from typing import Dict, Any, List

class ScorecardService:
    @staticmethod
    def generate_scorecard(session: Dict[str, Any]) -> Dict[str, Any]:
        """Generate comprehensive 5-question interview evaluation scorecard."""
        history: List[Dict[str, Any]] = session.get("history", [])
        question_count = session.get("question_count", 1)
        
        # Calculate quantitative performance metrics
        panic_count = sum(1 for h in history if "REVEALED ANSWER" in h.get("content", ""))
        hint_count = sum(1 for h in history if "ASKED FOR HINT" in h.get("content", ""))
        answers = [h for h in history if h.get("role") == "user" and "REVEALED ANSWER" not in h.get("content", "") and "ASKED FOR HINT" not in h.get("content", "")]
        
        base_score = 85
        tech_depth_score = max(50, min(100, base_score - (panic_count * 15) - (hint_count * 5) + (len(answers) * 2)))
        architecture_score = max(55, min(98, base_score - (panic_count * 10) + 5))
        communication_score = max(60, min(100, 80 + (len(answers) * 3) - (panic_count * 5)))
        overall_rating = round((tech_depth_score + architecture_score + communication_score) / 3, 1)

        level = session.get("current_level", 1)
        persona = session.get("persona", "FAANG Gatekeeper")

        return {
            "session_id": session.get("session_id"),
            "repo_url": session.get("repo_url"),
            "persona": persona,
            "level": level,
            "overall_rating": overall_rating,
            "breakdown": {
                "technical_depth": tech_depth_score,
                "system_architecture": architecture_score,
                "communication_clarity": communication_score,
                "problem_solving": max(45, 90 - (panic_count * 20)),
                "code_quality": max(50, 88 - (hint_count * 8))
            },
            "summary": f"Completed 5-question technical interview evaluated by {persona} persona at Level {level}.",
            "strengths": [
                "Demonstrated strong understanding of framework design choices and dependencies.",
                "Articulated system architecture and data flow boundaries effectively.",
                "Responsive to interview escalation and technical line-of-questioning."
            ],
            "areas_for_growth": [
                "Deepen knowledge of asynchronous resource cancellation edge cases.",
                "Provide explicit code snippets and time/space complexity bounds in responses."
            ],
            "panic_count": panic_count,
            "hint_count": hint_count,
            "total_questions": min(question_count, 5)
        }
