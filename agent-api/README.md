# CollabFlow Agent API (Google ADK + Gemini)

Yes — this is absolutely possible with Google ADK.

This service uses **Google ADK** + **Gemini** to run an agentic chatbot that can understand natural language (including complex, multi-step requests) and invoke project tools in sequence.

- Single ADK agent with a shared tool registry.
- Handles task + collaboration flows in one conversation.
- Accepts optional conversation `history` for context-aware responses.

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
  "message": "Create a QA task due tomorrow, assign Priya, then post an update in discussion",
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

Then set frontend `.env`:

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
