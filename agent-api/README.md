# CollabFlow Agent API (LangGraph + Gemini)

This service adds an **LLM agent layer** for the chatbot using **LangGraph** with **Gemini**.

- Uses a ReAct-style LangGraph agent to interpret natural language requests.
- Handles complex and multi-step prompts by chaining tool calls.
- Accepts optional conversation `history` for context-aware reasoning.
- Supports task + collaboration tools in one unified agent.

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
  "message": "Create a task for QA, assign it to Priya, and post an update in discussions",
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

## Tool coverage

- `list_tasks`
- `task_summary`
- `create_task`
- `update_task_status`
- `add_subtask`
- `list_project_members`
- `assign_task_member`
- `post_discussion_message`

## Firestore expectations

- `Projects/{projectId}` has `members[]`
- `Projects/{projectId}/Tasks/{taskId}` task documents
- `Projects/{projectId}/Discussions/{messageId}` discussion items

## Production hardening checklist

1. Verify Firebase Auth token in middleware.
2. Enforce project membership before tool execution.
3. Add rate limiting and audit logs.
4. Add tool allow-list and argument schema checks.
5. Add observability traces and tool latency metrics.
