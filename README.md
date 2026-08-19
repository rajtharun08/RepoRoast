# RepoRoast 🚀

> Realistic technical interview escalation powered by repository analysis, Gemini API token trimming, FastAPI SSE streaming, and React Web Speech API.

RepoRoast mirrors real technical interview dynamics by starting with high-level architecture screening and progressing to deep code reviews while minimizing LLM context token overhead.

---

## 🌟 Key Features

- **Progressive Interview Escalation**:
  - **Levels 1–3 (Screening)**: Evaluates high-level vision and stack selection using `README.md` and dependency manifests (`package.json`, `requirements.txt`).
  - **Levels 4–7 (System Design)**: Evaluates security, data flow, and architecture using `README.md`, file trees, and routing entrypoints.
  - **Levels 8–10 (Deep Code Review)**: Evaluates algorithmic efficiency, memory management, and edge cases using complete filtered source code.
- **FastAPI SSE Streaming**: Real-time progressive token streaming via Server-Sent Events (`text/event-stream`).
- **Anti-Annoying UX & Personas**:
  - Selectable interviewer personas (**FAANG Gatekeeper**, **Startup CTO**, **Pedantic Security Auditor**, **Custom**).
  - Constructive hint & pivot system when candidate is stuck.
  - **Panic Button ("Reveal Answer")** to instantly break down technical solutions.
  - **5-Question Hard Cap** ending with a complete candidate scorecard.
- **Web Speech API**: Hands-free voice answer input with live transcription.
- **Supabase Integration**: Auth management, session tracking, and message history persistence.

---

## 🏗️ Architecture

```
RepoRoast/
├── backend/
│   ├── app/
│   │   ├── api/          # FastAPI Route Handlers (Repo, Interview, Scorecard, Auth)
│   │   ├── core/         # Configuration & Rate Limiter settings
│   │   ├── services/     # GitHub Ingestion, LangChain Gemini Service, Personas
│   │   └── db/           # Supabase Client integration
│   ├── tests/            # pytest suite
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/   # Header, ChatArena, VoiceInput, Modals
│   │   ├── pages/        # Home, Interview
│   │   └── services/     # API Client & SSE Stream Listener
│   └── package.json
└── supabase/
    └── schema.sql        # Database migration script
```

---

## 🚦 Quick Start

### 1. Backend Setup
```bash
cd backend
python -m venv venv
# On Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --reload --port 8000
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

---

## 📄 License
MIT
