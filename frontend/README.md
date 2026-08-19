# RepoRoast Frontend Application

The frontend client is built with React 18, Vite, Tailwind CSS, and Lucide React icons. It provides a real-time interview dashboard, progressive token streaming via Server-Sent Events (SSE), native browser voice input using the Web Speech API, code context inspection, and evaluation scorecard visualizations.

---

## Component Architecture

```
frontend/
├── src/
│   ├── components/
│   │   ├── Header.jsx          # Top navigation bar, Q1-Q5 progress stepper, level badge, panic/hint buttons
│   │   ├── ChatArena.jsx       # Conversation view, SSE token streaming buffer, markdown code block rendering
│   │   ├── VoiceInput.jsx      # Web Speech API speech-to-text recording button & audio indicator
│   │   ├── CodeContextModal.jsx# Scoped repo file tree & code context inspection modal
│   │   └── ScorecardModal.jsx  # Final evaluation scorecard with skill progress bars & qualitative feedback
│   ├── pages/
│   │   ├── Home.jsx            # Landing setup screen (Repo URL, difficulty level slider, persona picker)
│   │   └── Interview.jsx       # Active interview workspace & state manager
│   ├── services/
│   │   ├── api.js              # REST fetch wrappers & EventSource SSE stream listener
│   │   └── supabase.js         # Frontend Supabase client helper
│   ├── App.jsx                 # Application root & view switcher
│   ├── main.jsx                # React DOM entrypoint
│   └── index.css               # Tailwind CSS directives & scrollbar styling
├── index.html
├── package.json
├── tailwind.config.js
└── vite.config.js
```

---

## Subsystem Details

### 1. Progressive SSE Streaming Reader
The frontend connects to FastAPI's Server-Sent Events stream using the browser `EventSource` API in [`src/services/api.js`](file:///d:/RepoRoast/frontend/src/services/api.js):

```javascript
export function subscribeToInterviewSSE(sessionId, answer, onChunk, onError, onComplete) {
  let url = `/api/interview/stream/${sessionId}`;
  if (answer) {
    url += `?answer=${encodeURIComponent(answer)}`;
  }
  const eventSource = new EventSource(url);
  eventSource.onmessage = (event) => {
    const data = JSON.parse(event.data);
    onChunk(data);
    if (data.status === 'completed') {
      eventSource.close();
      onComplete(data);
    }
  };
  eventSource.onerror = (err) => {
    eventSource.close();
    onError(err);
  };
  return () => eventSource.close();
}
```

### 2. Native Web Speech API Integration
Audio voice recording is implemented natively in [`src/components/VoiceInput.jsx`](file:///d:/RepoRoast/frontend/src/components/VoiceInput.jsx) without third-party audio packages. It uses `window.SpeechRecognition` or `window.webkitSpeechRecognition` to transcribe continuous audio directly into the candidate answer input field.

### 3. Syntax Highlighting & Code Blocks
AI responses containing markdown code snippets are rendered using `react-syntax-highlighter` with the Prism `vscDarkPlus` theme inside [`src/components/ChatArena.jsx`](file:///d:/RepoRoast/frontend/src/components/ChatArena.jsx) and [`src/components/CodeContextModal.jsx`](file:///d:/RepoRoast/frontend/src/components/CodeContextModal.jsx).

---

## Key UI Components

- **Home Setup Page (`Home.jsx`)**: Allows candidates to specify any public GitHub URL, select a starting difficulty level (1–10), and select an interviewer persona preset or custom prompt.
- **Header Stepper (`Header.jsx`)**: Tracks active question progress (Q1 through Q5), displays current escalation level, and houses the **Context Inspector**, **Hint Request**, and **Panic Button (Reveal Answer)** controls.
- **Chat Arena (`ChatArena.jsx`)**: Manages conversation history between interviewer and candidate, displays live streaming text with cursor animation, and handles text/voice submission.
- **Scorecard Modal (`ScorecardModal.jsx`)**: Appears automatically upon completing Question 5. Displays quantitative ratings (Technical Depth, System Architecture, Communication, Problem Solving, Code Quality), key strengths, and growth areas.

---

## Setup & Development

### Installation
```bash
cd frontend
npm install
```

### Start Development Server
```bash
npm run dev
```
The application will run at `http://localhost:5173`. Requests to `/api` are automatically proxied to the backend at `http://localhost:8000` via `vite.config.js`.

### Production Build
```bash
npm run build
```
Generates production-optimized static assets in `frontend/dist/`.
