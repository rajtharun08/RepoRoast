from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel
from typing import Optional
from app.db.supabase_client import SupabaseManager
from app.core.rate_limiter import limiter

router = APIRouter(prefix="/auth", tags=["Authentication & User Session"])

class UserProfileRequest(BaseModel):
    github_id: str
    username: str
    email: Optional[str] = None
    avatar_url: Optional[str] = None

@router.post("/session")
@limiter.limit("15/minute")
async def sync_user_session(request: Request, body: UserProfileRequest):
    """Sync GitHub OAuth user session metadata with Supabase."""
    client = SupabaseManager.get_client()
    if not client:
        return {"status": "mock", "message": "Supabase credentials unconfigured, using local session"}
    try:
        data = client.table("users").upsert({
            "github_id": body.github_id,
            "username": body.username,
            "email": body.email,
            "avatar_url": body.avatar_url
        }, on_conflict="github_id").execute()
        return {"status": "success", "user": data.data}
    except Exception as err:
        raise HTTPException(status_code=400, detail=f"User sync failed: {str(err)}")
