from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel, Field
from app.services.github_service import GitHubService
from app.core.rate_limiter import limiter

router = APIRouter(prefix="/repo", tags=["Repository Ingestion"])

class RepoIngestRequest(BaseModel):
    repo_url: str = Field(..., example="https://github.com/fastapi/fastapi")
    level: int = Field(1, ge=1, le=10, description="Interview escalation difficulty level (1-10)")

class RepoIngestResponse(BaseModel):
    owner: str
    repo: str
    level: int
    file_count: int
    file_tree: list[str]
    file_contents: dict[str, str]

@router.post("/ingest", response_model=RepoIngestResponse)
@limiter.limit("20/minute")
async def ingest_repository(request: Request, body: RepoIngestRequest):
    """
    Ingest a GitHub repository and trim its context window based on the escalation level:
    - Levels 1-3 (Screening): README + dependency files
    - Levels 4-7 (System Design): README + File tree + Routers/Entrypoints
    - Levels 8-10 (Deep Code Review): Complete source code files
    """
    try:
        context = await GitHubService.get_level_context(body.repo_url, body.level)
        return context
    except ValueError as err:
        raise HTTPException(status_code=400, detail=str(err))
    except Exception as err:
        raise HTTPException(status_code=500, detail=f"Failed to fetch repository context: {str(err)}")

@router.get("/user/{username}")
@limiter.limit("30/minute")
async def get_user_repositories(request: Request, username: str):
    """Fetch public repositories for a GitHub user or organization."""
    try:
        repos = await GitHubService.fetch_user_repos(username)
        return repos
    except Exception as err:
        raise HTTPException(status_code=400, detail=f"Failed to fetch user repositories: {str(err)}")
