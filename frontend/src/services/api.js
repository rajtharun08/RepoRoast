const API_BASE = '/api';

// Live Mode is Enabled by Default (100% Real FastAPI & GitHub API Integration)
export let USE_MOCK_DATA = false;

export function setMockMode(enabled) {
  USE_MOCK_DATA = enabled;
}

let mockQuestionCount = 1;

export async function ingestRepo(repoUrl, level) {
  if (USE_MOCK_DATA) {
    await new Promise((r) => setTimeout(r, 400));
    const urlParts = repoUrl.replace('https://github.com/', '').split('/');
    const owner = urlParts[0] || 'fastapi';
    const repo = urlParts[1] || 'fastapi';
    return {
      owner,
      repo,
      level,
      file_count: level <= 3 ? 3 : level <= 7 ? 12 : 45,
      file_tree: [
        'README.md',
        'package.json',
        'src/main.py',
        'src/routes/auth.py',
        'src/routes/interview.py',
        'src/utils/helpers.py'
      ],
      file_contents: {
        'README.md': `# ${repo}\n\nHigh-performance asynchronous application built for production scale.`,
        'package.json': `{\n  "name": "${repo}",\n  "version": "1.0.0",\n  "dependencies": {\n    "fastapi": "^0.109.0",\n    "pydantic": "^2.5.0"\n  }\n}`,
        'src/routes/auth.py': `# Authentication Router\nfrom fastapi import APIRouter\nrouter = APIRouter()\n\n@router.post("/login")\ndef login():\n    return {"token": "jwt-token-123"}`
      }
    };
  }

  const res = await fetch(`${API_BASE}/repo/ingest`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ repo_url: repoUrl, level: level })
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || 'Failed to ingest repository from GitHub.');
  }
  return res.json();
}

export async function startInterviewSession(repoUrl, persona, customPersona, level) {
  mockQuestionCount = 1;
  if (USE_MOCK_DATA) {
    await new Promise((r) => setTimeout(r, 300));
    return {
      session_id: 'mock-session-' + Date.now(),
      repo_url: repoUrl,
      persona: persona || 'FAANG Gatekeeper',
      level: level,
      question_count: 1,
      status: 'in_progress'
    };
  }

  const res = await fetch(`${API_BASE}/interview/start`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      repo_url: repoUrl,
      persona: persona,
      custom_persona: customPersona,
      level: level
    })
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || 'Failed to start interview session on backend.');
  }
  return res.json();
}

export async function submitAnswer(sessionId, answer) {
  if (USE_MOCK_DATA) {
    mockQuestionCount = Math.min(mockQuestionCount + 1, 5);
    return { status: 'accepted', session_id: sessionId, question_count: mockQuestionCount };
  }

  const res = await fetch(`${API_BASE}/interview/answer`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ session_id: sessionId, answer })
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || 'Failed to submit answer');
  }
  return res.json();
}

export async function fetchScorecard(sessionId) {
  if (USE_MOCK_DATA) {
    await new Promise((r) => setTimeout(r, 400));
    return {
      session_id: sessionId,
      repo_url: 'https://github.com/fastapi/fastapi',
      persona: 'FAANG Gatekeeper',
      level: 1,
      overall_rating: 91.5,
      breakdown: {
        technical_depth: 92,
        system_architecture: 94,
        communication_clarity: 90,
        problem_solving: 89,
        code_quality: 93
      },
      summary: 'Completed 5-question mock interview.',
      strengths: [
        'Excellent articulation of asynchronous event loop architecture.',
        'Clear understanding of dependency injection and middleware pipelines.',
        'Structured responses with realistic trade-off analysis.'
      ],
      areas_for_growth: [
        'Include precise Big-O time & memory space bounds in answers.',
        'Address edge cases regarding connection drops during streaming.'
      ],
      panic_count: 0,
      hint_count: 0,
      total_questions: 5
    };
  }

  const res = await fetch(`${API_BASE}/scorecard/${sessionId}`);
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || 'Failed to fetch scorecard from database');
  }
  return res.json();
}

export function subscribeToInterviewSSE(sessionId, answer = null, onChunk, onError, onComplete, mode = 'normal') {
  if (USE_MOCK_DATA) {
    let mockText = '';
    if (mode === 'hint') {
      mockText = `Hint: Consider how incoming requests are validated in the middleware stack before reaching route handlers. Think about schema validation boundaries. Give it another try!`;
    } else if (mode === 'panic') {
      mockText = `Reveal Answer: For Question #${mockQuestionCount}, the optimal architectural approach involves implementing an async connection pool with connection lifetime limits to prevent resource leaks.\n\nMoving to Question #${Math.min(mockQuestionCount + 1, 5)}: How do you handle circuit breaking when an upstream database connection drops?`;
    } else if (mockQuestionCount === 1 && !answer) {
      mockText = `Welcome to your technical interview for this repository! I'll be evaluating your architectural choices today.\n\nQuestion 1 (Level ${mockQuestionCount} - Screening): Looking at your README.md and package manifests, what core technical requirements drove the selection of these specific frameworks and libraries?`;
    } else if (mockQuestionCount >= 5) {
      mockText = `Great answer on Question #5! That concludes our 5-question technical interview session.\n\nInterview Completed! Generating your comprehensive performance scorecard...`;
    } else {
      mockText = `Solid point on Question #${mockQuestionCount - 1}. Let's dive deeper into system boundaries.\n\nQuestion ${mockQuestionCount}: How do you handle asynchronous task cancellation and cleanup when a client drops the connection prematurely?`;
    }

    const words = mockText.split(' ');
    let wordIndex = 0;

    const timer = setInterval(() => {
      if (wordIndex < words.length) {
        const chunk = words[wordIndex] + (wordIndex < words.length - 1 ? ' ' : '');
        onChunk({
          text: chunk,
          question_count: mockQuestionCount,
          status: mockQuestionCount >= 5 && wordIndex === words.length - 1 ? 'completed' : 'in_progress'
        });
        wordIndex++;
      } else {
        clearInterval(timer);
        if (mockQuestionCount >= 5) {
          if (onComplete) onComplete({ status: 'completed' });
        } else {
          if (onComplete) onComplete();
        }
      }
    }, 25);

    return () => clearInterval(timer);
  }

  // Live Backend SSE Stream Mode
  let url = `${API_BASE}/interview/stream/${sessionId}`;
  if (answer) {
    url += `?answer=${encodeURIComponent(answer)}`;
  }
  
  const eventSource = new EventSource(url);
  
  eventSource.onmessage = (event) => {
    if (event.data === '[DONE]') {
      eventSource.close();
      if (onComplete) onComplete();
      return;
    }
    try {
      const data = JSON.parse(event.data);
      onChunk(data);
      if (data.status === 'completed') {
        eventSource.close();
        if (onComplete) onComplete(data);
      }
    } catch (e) {
      console.error('Failed to parse SSE payload', e);
    }
  };

  eventSource.onerror = (err) => {
    if (eventSource.readyState === EventSource.CLOSED || eventSource.readyState === 2) {
      eventSource.close();
      if (onComplete) onComplete();
      return;
    }
    eventSource.close();
    if (onError) onError(err);
  };

  return () => eventSource.close();
}

export async function triggerHintAPI(sessionId) {
  if (USE_MOCK_DATA) {
    return { status: 'accepted' };
  }
  const res = await fetch(`${API_BASE}/interview/hint/${sessionId}`, { method: 'POST' });
  return res;
}

export async function triggerPanicAPI(sessionId) {
  if (USE_MOCK_DATA) {
    return { status: 'accepted' };
  }
  const res = await fetch(`${API_BASE}/interview/panic/${sessionId}`, { method: 'POST' });
  return res;
}
