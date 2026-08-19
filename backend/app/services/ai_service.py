import asyncio
import json
from typing import AsyncGenerator, Dict, Any, List
from app.core.config import settings
from app.services.persona_service import PersonaService

# In-memory interview session store (mirrored to DB)
SESSIONS: Dict[str, Dict[str, Any]] = {}

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
        if session_id not in SESSIONS:
            raise KeyError(f"Session {session_id} not found")
        return SESSIONS[session_id]

    @classmethod
    async def generate_question_stream(cls, session_id: str, candidate_answer: str = None, is_hint: bool = False, is_panic: bool = False) -> AsyncGenerator[str, None]:
        """
        Generate real-time SSE token stream for Gemini model response.
        Sends data chunks in SSE format: `data: {"text": "...", "question_count": 1, "status": "in_progress"}\n\n`
        """
        session = cls.get_session(session_id)
        question_count = session["question_count"]
        level = session["current_level"]
        persona_instructions = PersonaService.get_system_prompt(session["persona"], session["custom_persona"])
        
        # Build prompt context window
        context_str = json.dumps({
            "repo": f"{session['repo_context'].get('owner')}/{session['repo_context'].get('repo')}",
            "file_count": session['repo_context'].get('file_count'),
            "key_files": list(session['repo_context'].get('file_contents', {}).keys()),
            "snippets": session['repo_context'].get('file_contents', {})
        }, indent=2)

        prompt_prefix = f"SYSTEM:\n{persona_instructions}\n\nREPO CONTEXT (Level {level}):\n{context_str}\n\n"

        if is_panic:
            user_msg = f"[CANDIDATE REVEALED ANSWER / PANIC BUTTON] Please explain the optimal answer to Question #{question_count} concisely, and then ask Question #{min(question_count + 1, 5)}."
        elif is_hint:
            user_msg = f"[CANDIDATE ASKED FOR HINT] The candidate is stuck on Question #{question_count}. Give a helpful hint, pivot slightly, and encourage them to try."
        elif candidate_answer:
            user_msg = f"Candidate Answer to Question #{question_count}: {candidate_answer}\n\nEvaluate the answer briefly, and ask Question #{question_count + 1}."
            session["question_count"] += 1
            question_count = session["question_count"]
        else:
            # Initial opening question
            user_msg = f"Start the interview for Level {level}. Ask Question #1 focusing on the repository's core purpose and stack."

        # If question count exceeds 5, conclude session
        if question_count > 5:
            session["status"] = "completed"
            summary_payload = json.dumps({"text": "\n\n🎉 **Interview Completed!** You have completed all 5 technical questions. Generating your final scorecard...", "status": "completed", "question_count": 5})
            yield f"data: {summary_payload}\n\n"
            return

        # Record history
        session["history"].append({"role": "user", "content": user_msg, "question": question_count})

        # Try live Gemini stream if GEMINI_API_KEY is configured
        if settings.GEMINI_API_KEY and settings.GEMINI_API_KEY.strip() and settings.GEMINI_API_KEY != "your_gemini_api_key_here":
            try:
                from langchain_google_genai import ChatGoogleGenerativeAI
                llm = ChatGoogleGenerativeAI(
                    model=settings.GEMINI_MODEL, 
                    google_api_key=settings.GEMINI_API_KEY, 
                    streaming=True,
                    request_timeout=5.0
                )
                full_response = ""
                
                # Stream first chunk with a 4.0s timeout
                stream_iter = llm.astream(prompt_prefix + user_msg).__aiter__()
                try:
                    first_chunk = await asyncio.wait_for(stream_iter.__anext__(), timeout=4.0)
                    if first_chunk and first_chunk.content:
                        full_response += first_chunk.content
                        payload = json.dumps({"text": first_chunk.content, "question_count": question_count, "status": session["status"]})
                        yield f"data: {payload}\n\n"
                        await asyncio.sleep(0.01)
                    
                    async for chunk in stream_iter:
                        content = chunk.content
                        if content:
                            full_response += content
                            payload = json.dumps({"text": content, "question_count": question_count, "status": session["status"]})
                            yield f"data: {payload}\n\n"
                            await asyncio.sleep(0.01)

                    if full_response.strip():
                        session["history"].append({"role": "interviewer", "content": full_response, "question": question_count})
                        yield "data: [DONE]\n\n"
                        return
                except (asyncio.TimeoutError, StopAsyncIteration, Exception) as stream_err:
                    print(f"Gemini API stream timeout or error, switching to fast response: {stream_err}")
            except Exception as e:
                print(f"Gemini initialization error: {e}")

        # Fast fallback response generator so candidate NEVER waits
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
            if "Batman" in persona or "batman" in custom.lower():
                return (
                    f"I've been monitoring `{repo_name}` from the shadows.\n\n"
                    f"**Question 1 (Level {level} - Vigilante Audit)**: Looking at your `README.md` and dependency stack, "
                    f"what core single-point-of-failure vulnerabilities would collapse this system if your primary database goes dark?"
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
