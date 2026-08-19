from fastapi import APIRouter, HTTPException, Request
from app.services.ai_service import AIService
from app.services.scorecard_service import ScorecardService
from app.core.rate_limiter import limiter

router = APIRouter(prefix="/scorecard", tags=["Scorecard Engine"])

@router.get("/{session_id}")
@limiter.limit("20/minute")
async def get_interview_scorecard(request: Request, session_id: str):
    """Retrieve comprehensive candidate evaluation scorecard."""
    try:
        session = AIService.get_session(session_id)
        scorecard = ScorecardService.generate_scorecard(session)
        session["scorecard"] = scorecard
        return scorecard
    except KeyError:
        raise HTTPException(status_code=404, detail="Interview session not found")
