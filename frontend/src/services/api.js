const API_BASE = '/api';

export async function ingestRepo(repoUrl, level) {
  const res = await fetch(`${API_BASE}/repo/ingest`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ repo_url: repoUrl, level: level })
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || 'Failed to ingest repository');
  }
  return res.json();
}

export async function startInterviewSession(repoUrl, persona, customPersona, level) {
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
    throw new Error(errorData.detail || 'Failed to start interview session');
  }
  return res.json();
}

export async function submitAnswer(sessionId, answer) {
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
  const res = await fetch(`${API_BASE}/scorecard/${sessionId}`);
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || 'Failed to fetch scorecard');
  }
  return res.json();
}

export function subscribeToInterviewSSE(sessionId, answer = null, onChunk, onError, onComplete) {
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
  const res = await fetch(`${API_BASE}/interview/hint/${sessionId}`, { method: 'POST' });
  return res;
}

export async function triggerPanicAPI(sessionId) {
  const res = await fetch(`${API_BASE}/interview/panic/${sessionId}`, { method: 'POST' });
  return res;
}
