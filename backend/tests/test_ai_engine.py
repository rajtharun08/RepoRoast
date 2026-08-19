import pytest
from app.services.persona_service import PersonaService, PERSONA_PRESETS
from app.services.ai_service import AIService
from app.services.scorecard_service import ScorecardService

def test_persona_service():
    faang_prompt = PersonaService.get_system_prompt("FAANG Gatekeeper")
    assert "FAANG" in faang_prompt or "Senior Staff" in faang_prompt
    
    custom_prompt = PersonaService.get_system_prompt("Custom", custom_prompt="Strict Python Lead")
    assert "Strict Python Lead" in custom_prompt

def test_ai_service_session_lifecycle():
    mock_context = {"owner": "test", "repo": "repo", "file_count": 5, "file_contents": {}}
    session = AIService.create_session("sess-100", "test/repo", "FAANG Gatekeeper", "", 1, mock_context)
    
    assert session["session_id"] == "sess-100"
    assert session["question_count"] == 1
    assert session["status"] == "in_progress"
    
    scorecard = ScorecardService.generate_scorecard(session)
    assert scorecard["overall_rating"] > 0
    assert scorecard["session_id"] == "sess-100"
