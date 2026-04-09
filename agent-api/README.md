# CollabFlow Agent API (Google ADK)

This service adds an **LLM decision layer** for the chatbot using **Google ADK** and Gemini models:

- `router_agent` decides whether task operations, collaboration operations, or a direct chat reply is needed.
- `task_ops_agent` handles task tools.
- `collaboration_agent` handles members/discussions.
- The API accepts optional conversation `history` for context-sensitive routing/replies.

## Endpoints

- `GET /health`
- `POST /v1/agent/chat`

## Request body

```json
{
  "projectId": "...",
  "userId": "...",
  "userName": "...",
  "userPhoto": "...",
  "message": "Create task to finish QA by Friday",
  "history": [{ "role": "user", "text": "previous turn" }]
}
```

## Local run

```bash
cd agent-api
npm install
cp .env.example .env
# edit .env and set GOOGLE_API_KEY + Firebase Admin values
npm run dev
```

Then set in frontend `.env`:

```bash
REACT_APP_AGENT_API_URL=http://localhost:8080
```

## Firestore expectations

- `Projects/{projectId}` has `members[]`
- `Projects/{projectId}/Tasks/{taskId}` task documents
- `Projects/{projectId}/Tasks/{taskId}/SubTasks/{subTaskId}` subtasks
- `Projects/{projectId}/Discussions/{messageId}` discussion items

## Production hardening checklist

1. Verify Firebase Auth token in middleware.
2. Enforce project membership before tool execution.
3. Add rate limiting and audit logs.
4. Add tool allow-list and argument schema checks.
5. Add observability traces and tool latency metrics.
