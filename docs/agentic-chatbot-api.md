# Agentic Chatbot: Tool Catalog + API Integration Plan

## 1) Tool list to expose in your agent

### Core project tools (high priority)
1. `list_tasks`
   - Get visible tasks for current user/project.
2. `task_summary`
   - Return counts by status, overdue, due today.
3. `create_task`
   - Create new project task with due date and visibility.
4. `update_task_status`
   - Move task to `todo | inprogress | complete`.
5. `add_subtask`
   - Attach a subtask to a task.
6. `assign_task_member`
   - Add or update task assignee.
7. `list_project_members`
   - Resolve names/IDs for assignment.
8. `post_discussion_message`
   - Post assistant/user update into Discussions.

### Nice-to-have collaboration tools
9. `create_meet_link`
10. `schedule_reminder`
11. `search_discussions`
12. `get_my_mentions`

### External productivity tools (optional)
13. `google_calendar_create_event`
14. `slack_post_message`
15. `github_create_issue`
16. `notion_create_page`

---

## 2) Recommended API-first tech stack

### Best fit for current codebase (React + Firebase)
- **API runtime:** Node.js + Fastify (or Express)
- **Agent orchestration:** OpenAI Responses API with tool calling (or LangGraph if you want multi-step planning DAGs)
- **Data access:** Firebase Admin SDK (Firestore)
- **Auth:** Firebase ID token verification on API
- **State/memory:** Redis (conversation/session state)
- **Queue/background jobs:** BullMQ + Redis (for reminders/follow-up jobs)
- **Observability:** OpenTelemetry + structured logs (pino)
- **Deployment:** Cloud Run / Railway / Render

Why this stack:
- Minimal context switching from existing JS ecosystem.
- Native compatibility with Firestore + your current schema.
- Easy horizontal scaling for API hosting.

---

## 3) Integration steps (end-to-end)

1. **Create API service**
   - Scaffold `/agent-api` service with endpoint `POST /v1/agent/chat`.
   - Add health endpoint `GET /health`.

2. **Add authentication layer**
   - Frontend sends Firebase ID token in `Authorization: Bearer <token>`.
   - API verifies token and maps `uid`, `name`, and allowed `projectId`.

3. **Define tool registry (server-side)**
   - Register each tool with:
     - JSON schema for inputs
     - permission checks
     - handler implementation
   - Example registry: `list_tasks`, `task_summary`, `create_task`, `update_task_status`.

4. **Add agent runner**
   - System prompt = collaboration assistant with strict tool usage policy.
   - Pass selected tools and user/project context.
   - Loop: model decides tool -> execute -> return tool result -> final response.

5. **Add safety controls**
   - Server-side allowlist of tool names.
   - Per-tool project membership checks.
   - Rate limit by user ID/IP.
   - Audit log every tool invocation.

6. **Frontend wiring (already prepared)**
   - Set `REACT_APP_AGENT_API_URL`.
   - Chat modal calls `/v1/agent/chat`.
   - If API unavailable, local tool fallback still works.

7. **Deploy API**
   - Build container, set env vars (`OPENAI_API_KEY`, Firebase Admin creds, Redis URL).
   - Deploy to Cloud Run/Railway/Render.
   - Add CORS for frontend domain.

8. **Observability + QA**
   - Track latency, tool error rate, token usage, failed auth.
   - Add integration tests for each tool and at least one multi-step flow.

---

## 4) Request/response contract for hosted API

### POST `/v1/agent/chat`

Request:
```json
{
  "projectId": "abc123",
  "userId": "uid_1",
  "userName": "Alex",
  "message": "Create task: QA checks | Verify release checklist | 2026-04-20 | general",
  "availableTools": ["list_tasks", "create_task", "update_task_status"]
}
```

Response:
```json
{
  "reply": "Done — I created `QA checks` as a general task due 4/20/2026.",
  "toolCalls": [
    {
      "name": "create_task",
      "ok": true,
      "latencyMs": 82
    }
  ]
}
```

---

## 5) Production rollout suggestion

- Phase 1: Hosted API for read tools (`list_tasks`, `task_summary`) + local fallback on client.
- Phase 2: Enable write tools (`create_task`, `update_task_status`) with audit logs.
- Phase 3: Add external integrations (Calendar/Slack/GitHub) behind feature flags.
