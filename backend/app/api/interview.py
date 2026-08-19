import uuid
from fastapi import APIRouter, HTTPException, Request
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, Field
from typing import Optional

from app.services.github_service import GitHubService
from app.services.ai_service import AIService
from app.core.rate_limiter import limiter

router = APIRouter(prefix="/interview", tags=["Interview Engine"])

class StartInterviewRequest(BaseModel):
    repo_url: str = Field(..., example="https://github.com/fastapi/fastapi")
    persona: str = Field("FAANG Gatekeeper", example="FAANG Gatekeeper")
    custom_persona: Optional[str] = Field("", example="")
    level: int = Field(1, ge=1, le=10)

class StartInterviewResponse(BaseModel):
    session_id: str
    repo_url: str
    persona: str
    level: int
    question_count: int
    status: str

class CandidateAnswerRequest(BaseModel):
    session_id: str
    answer: str

@router.post("/start", response_model=StartInterviewResponse)
@limiter.limit("15/minute")
async def start_interview(request: Request, body: StartInterviewRequest):
    """Start a new 5-question mock interview session."""
    try:
        session_id = str(uuid.uuid4())
        repo_context = await GitHubService.get_level_context(body.repo_url, body.level)
        session = AIService.create_session(
            session_id=session_id,
            repo_url=body.repo_url,
            persona=body.persona,
            custom_persona=body.custom_persona or "",
            level=body.level,
            repo_context=repo_context
        )
        return StartInterviewResponse(
            session_id=session["session_id"],
            repo_url=session["repo_url"],
            persona=session["persona"],
            level=session["current_level"],
            question_count=session["question_count"],
            status=session["status"]
        )
    except Exception as err:
        raise HTTPException(status_code=400, detail=f"Failed to start interview session: {str(err)}")

@router.get("/stream/{session_id}")
@limiter.limit("30/minute")
async def stream_interview_question(request: Request, session_id: str, answer: Optional[str] = None):
    """
    SSE Endpoint streaming live AI interviewer tokens to frontend `EventSource`.
    """
    try:
        return StreamingResponse(
            AIService.generate_question_stream(session_id=session_id, candidate_answer=answer),
            media_type="text/event-stream",
            headers={"Cache-Control": "no-cache", "Connection": "keep-alive", "X-Accel-Buffering": "no"}
        )
    except KeyError:
        raise HTTPException(status_code=404, detail="Interview session not found")

@router.post("/answer")
@limiter.limit("30/minute")
async def submit_answer(request: Request, body: CandidateAnswerRequest):
    """Submit candidate answer to current question."""
    try:
        session = AIService.get_session(body.session_id)
        if session["status"] == "completed":
            return {"message": "Session completed", "question_count": 5, "status": "completed"}
        return {"status": "accepted", "session_id": body.session_id}
    except KeyError:
        raise HTTPException(status_code=404, detail="Session not found")

@router.post("/hint/{session_id}")
@limiter.limit("10/minute")
async def request_hint(request: Request, session_id: str):
    """Trigger constructive hint & pivot logic."""
    try:
        return StreamingResponse(
            AIService.generate_question_stream(session_id=session_id, is_hint=True),
            media_type="text/event-stream"
        )
    except KeyError:
        raise HTTPException(status_code=404, detail="Session not found")

@router.post("/panic/{session_id}")
@limiter.limit("10/minute")
async def trigger_panic_button(request: Request, session_id: str):
    """Trigger Reveal Answer override."""
    try:
        return StreamingResponse(
            AIService.generate_question_stream(session_id=session_id, is_panic=True),
            media_type="text/event-stream"
        )
    except KeyError:
        raise HTTPException(status_code=404, detail="Session not found")
