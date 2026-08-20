import asyncio
import json
import httpx
from typing import AsyncGenerator, Dict, Any, List
from app.core.config import settings
from app.services.persona_service import PersonaService

# In-memory interview session store (mirrored to DB)
SESSIONS: Dict[str, Dict[str, Any]] = {}

def get_valid_gemini_model_name(configured_model: str) -> str:
    """Ensure Gemini model name matches active Google REST API model identifiers."""
    cleaned = (configured_model or "").strip().lower()
    if "pro" in cleaned:
        return "gemini-pro-latest"
    return "gemini-flash-lite-latest"

class AIService:
    @classmethod
    def create_session(cls, session_id: str, repo_url: str, persona: str, custom_persona: str, level: int, repo_context: Dict[str, Any]) -> Dict[str, Any]:
        """Initialize new 5-question interview session state."""
        session = {
            "session_id": session_id,
            "repo_url": repo_url,
            "persona": persona,
            "custom_persona": custom_persona,
            "current_level": level,
            "question_count": 1,  # Hard cap at 5
            "status": "in_progress",
            "repo_context": repo_context,
            "history": [],
            "scorecard": None
        }
        SESSIONS[session_id] = session
        return session

    @classmethod
    def get_session(cls, session_id: str) -> Dict[str, Any]:
        """Retrieve session safely, auto-initializing fallback if server restarted."""
        if session_id not in SESSIONS:
            SESSIONS[session_id] = {
                "session_id": session_id,
                "repo_url": "https://github.com/fastapi/fastapi",
                "persona": "FAANG Gatekeeper",
                "custom_persona": "",
                "current_level": 1,
                "question_count": 1,
                "status": "in_progress",
                "repo_context": {
                    "owner": "fastapi",
                    "repo": "fastapi",
                    "file_count": 1,
                    "file_tree": ["README.md"],
                    "file_contents": {"README.md": "# FastAPI\nHigh-performance web framework."}
                },
                "history": [],
                "scorecard": None
            }
        return SESSIONS[session_id]

    @classmethod
    async def generate_question_stream(cls, session_id: str, candidate_answer: str = None, is_hint: bool = False, is_panic: bool = False) -> AsyncGenerator[str, None]:
        """
        Generate real-time SSE token stream for Gemini model response.
        Uses direct HTTP SSE streaming to Google Gemini REST API for maximum reliability.
        """
        session = cls.get_session(session_id)
        question_count = session["question_count"]
        level = session["current_level"]
        persona_instructions = PersonaService.get_system_prompt(session["persona"], session["custom_persona"])
        
        context_str = json.dumps({
            "repo": f"{session['repo_context'].get('owner')}/{session['repo_context'].get('repo')}",
            "file_count": session['repo_context'].get('file_count'),
            "key_files": list(session['repo_context'].get('file_contents', {}).keys()),
            "snippets": session['repo_context'].get('file_contents', {})
        }, indent=2)

        prompt_prefix = f"SYSTEM INSTRUCTIONS:\n{persona_instructions}\n\nREPOSITORY CONTEXT (Level {level}):\n{context_str}\n\n"

        if is_panic:
            user_msg = f"[CANDIDATE REVEALED ANSWER / PANIC BUTTON] Please explain the optimal answer to Question #{question_count} concisely, and then ask Question #{min(question_count + 1, 5)}."
        elif is_hint:
            user_msg = f"[CANDIDATE ASKED FOR HINT] The candidate is stuck on Question #{question_count}. Give a helpful hint, pivot slightly, and encourage them to try."
        elif candidate_answer:
            user_msg = f"Candidate Answer to Question #{question_count}: {candidate_answer}\n\nEvaluate the answer briefly, and ask Question #{question_count + 1}."
            session["question_count"] += 1
            question_count = session["question_count"]
        else:
            user_msg = f"Start the interview for Level {level}. Ask Question #1 focusing on the repository's core purpose, architecture, and technology stack."

        if question_count > 5:
            session["status"] = "completed"
            summary_payload = json.dumps({"text": "\n\n🎉 **Interview Completed!** You have completed all 5 technical questions. Generating your final scorecard...", "status": "completed", "question_count": 5})
            yield f"data: {summary_payload}\n\n"
            return

        session["history"].append({"role": "user", "content": user_msg, "question": question_count})

        api_key = (settings.GEMINI_API_KEY or "").strip()
        
        # Direct Gemini REST API Stream execution if key is present
        if api_key and api_key != "your_gemini_api_key_here":
            model_name = get_valid_gemini_model_name(settings.GEMINI_MODEL)
            api_url = f"https://generativelanguage.googleapis.com/v1beta/models/{model_name}:streamGenerateContent?alt=sse&key={api_key}"
            
            payload = {
                "contents": [
                    {
                        "parts": [
                            {"text": prompt_prefix + user_msg}
                        ]
                    }
                ]
            }

            full_response = ""
            try:
                async with httpx.AsyncClient(timeout=30.0) as client:
                    async with client.stream("POST", api_url, json=payload) as response:
                        if response.status_code != 200:
                            err_body = await response.aread()
                            err_text = err_body.decode("utf-8", errors="ignore")
                            print(f"Gemini API Error (HTTP {response.status_code}): {err_text}")
                            err_msg = f"\n\n⚠️ **Gemini API Error ({response.status_code})**: Unable to fetch live response from Gemini API. Check your `GEMINI_API_KEY` in `backend/.env`."
                            payload_err = json.dumps({"text": err_msg, "question_count": question_count, "status": session["status"]})
                            yield f"data: {payload_err}\n\n"
                            session["history"].append({"role": "interviewer", "content": err_msg, "question": question_count})
                            yield "data: [DONE]\n\n"
                            return

                        async for line in response.aiter_lines():
                            if line.startswith("data: "):
                                json_str = line[6:].strip()
                                if not json_str:
                                    continue
                                try:
                                    data_obj = json.loads(json_str)
                                    candidates = data_obj.get("candidates", [])
                                    if candidates:
                                        parts = candidates[0].get("content", {}).get("parts", [])
                                        for p in parts:
                                            chunk_text = p.get("text", "")
                                            if chunk_text:
                                                full_response += chunk_text
                                                payload_chunk = json.dumps({"text": chunk_text, "question_count": question_count, "status": session["status"]})
                                                yield f"data: {payload_chunk}\n\n"
                                                await asyncio.sleep(0.01)
                                except Exception as parse_err:
                                    print("Error parsing Gemini SSE chunk:", parse_err)

                        if full_response.strip():
                            session["history"].append({"role": "interviewer", "content": full_response, "question": question_count})
                            yield "data: [DONE]\n\n"
                            return

            except Exception as net_err:
                print("Gemini REST API connection error:", net_err)

        # Fallback question streamer if API Key is not configured
        simulated_text = cls._generate_mock_response(session, candidate_answer, is_hint, is_panic, question_count, level)
        full_response = ""
        for word in simulated_text.split(" "):
            full_response += word + " "
            payload = json.dumps({"text": word + " ", "question_count": question_count, "status": session["status"]})
            yield f"data: {payload}\n\n"
            await asyncio.sleep(0.02)

        session["history"].append({"role": "interviewer", "content": full_response, "question": question_count})
        yield "data: [DONE]\n\n"

    @classmethod
    def _generate_mock_response(cls, session: Dict[str, Any], candidate_answer: str, is_hint: bool, is_panic: bool, q_num: int, level: int) -> str:
        repo_name = f"{session['repo_context'].get('owner')}/{session['repo_context'].get('repo')}"
        persona = session.get('persona', 'Interviewer')
        custom = session.get('custom_persona', '')
        
        if is_panic:
            return (
                f"**[Reveal Answer]** For Question #{q_num - 1 if q_num > 1 else 1}, the ideal approach involves optimizing the primary request handler "
                f"and utilizing async connection pooling to prevent event loop bottlenecks in `{repo_name}`.\n\n"
                f"Moving forward to **Question #{q_num} (Level {level})**:\n"
                f"How would you ensure failure isolation and graceful degradation if an external dependency fails in this service?"
            )
        elif is_hint:
            return (
                f"**[Hint]** Think about how incoming payloads are validated before reaching the route handler. "
                f"Consider checking the middleware definitions and context schemas in `{repo_name}`. Give it another shot!"
            )
        elif q_num == 1:
            if custom.strip():
                return (
                    f"Welcome to your technical interview for `{repo_name}`! I'm acting under your custom persona directives: *'{custom.strip()}'*.\n\n"
                    f"**Question 1 (Level {level} - Custom Review)**: Looking at your `README.md` and codebase structure, "
                    f"what core architectural patterns and security assumptions did you make when designing this project?"
                )
            return (
                f"Welcome to your technical interview for `{repo_name}`! I'm evaluating your architectural choices today.\n\n"
                f"**Question 1 (Level {level} - Screening)**: Looking at your `README.md` and dependency stack, "
                f"what core technical requirements drove the selection of these specific frameworks and libraries?"
            )
        else:
            return (
                f"Solid reasoning on Question #{q_num - 1}. Let's escalate.\n\n"
                f"**Question {q_num} (Level {level})**: In `{repo_name}`, how do you handle asynchronous background task "
                f"cancellation and resource cleanup when a client drops the connection prematurely?"
            )
