from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health_check():
    res = client.get("/health")
    assert res.status_code == 200
    assert res.json() == {"status": "healthy"}

def test_root_endpoint():
    res = client.get("/")
    assert res.status_code == 200
    data = res.json()
    assert data["app"] == "RepoRoast"

def test_ingest_endpoint():
    payload = {"repo_url": "https://github.com/fastapi/fastapi", "level": 2}
    res = client.post("/api/repo/ingest", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data["owner"] == "fastapi"
    assert data["repo"] == "fastapi"
    assert data["level"] == 2

def test_start_interview_flow():
    payload = {
        "repo_url": "https://github.com/fastapi/fastapi",
        "persona": "FAANG Gatekeeper",
        "custom_persona": "",
        "level": 1
    }
    res = client.post("/api/interview/start", json=payload)
    assert res.status_code == 200
    session_data = res.json()
    assert "session_id" in session_data
    session_id = session_data["session_id"]

    # Submit answer
    answer_res = client.post("/api/interview/answer", json={"session_id": session_id, "answer": "FastAPI uses Starlette and Pydantic."})
    assert answer_res.status_code == 200

    # Fetch scorecard
    scorecard_res = client.get(f"/api/scorecard/{session_id}")
    assert scorecard_res.status_code == 200
    scorecard = scorecard_res.json()
    assert scorecard["session_id"] == session_id
    assert "overall_rating" in scorecard
