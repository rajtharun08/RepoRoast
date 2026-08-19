from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded

from app.core.config import settings
from app.core.rate_limiter import limiter
from app.api.repo import router as repo_router
from app.api.interview import router as interview_router
from app.api.scorecard import router as scorecard_router

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="RepoRoast - AI-Driven Technical Interview Escalation Platform",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# SlowAPI Rate Limiting setup
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# CORS Middleware setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API Routers
app.include_router(repo_router, prefix=settings.API_V1_STR)
app.include_router(interview_router, prefix=settings.API_V1_STR)
app.include_router(scorecard_router, prefix=settings.API_V1_STR)

@app.get("/")
@limiter.limit("30/minute")
async def root(request: Request):
    return {
        "status": "online",
        "app": settings.PROJECT_NAME,
        "message": "Welcome to RepoRoast API Server"
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy"}
