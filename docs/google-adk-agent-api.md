# Google ADK LLM Layer for CollabFlow Chatbot

This doc defines the production path to move from local rule-based fallback to an LLM-orchestrated tool system.

## Why this layer

The frontend chat input should allow free-form text. The LLM should decide:
1. whether a tool call is needed,
2. which tool to call,
3. what missing parameters must be requested from the user.

## Multi-agent segregation

- **router_agent**: intent routing (`task_ops_agent`, `collaboration_agent`, or direct answer)
- **task_ops_agent**: `list_tasks`, `create_task`, `update_task_status`
- **collaboration_agent**: `list_project_members`, `assign_task_member`, `post_discussion_message`

## Runtime contract

`POST /v1/agent/chat`

Input:
- `projectId`
- `userId`
- `userName`
- `message`
- `history` (optional)

Output:
- `reply`
- `provider: "google-adk"`
- `mode: "multi-agent"`

## Firestore data shape

### Project
`Projects/{projectId}`
- `members: [{ id, name, email?, photo?, role? }]`

### Task
`Projects/{projectId}/Tasks/{taskId}`
- `title`, `description`
- `status: todo | inprogress | complete`
- `visibility: general | personal`
- `members: [{ id, name, photo? }]`
- `startDate`, `endDate`
- `created_by`, `created_by_id`
- `createdAt`, `updatedAt`, `updatedBy`, `updatedById`

### Subtask
`Projects/{projectId}/Tasks/{taskId}/SubTasks/{subTaskId}`
- `subtaskTitle`, `description`
- `startDate`, `endDate`
- `createdAt`, `createdBy`, `createdById`

### Discussion
`Projects/{projectId}/Discussions/{messageId}`
- `message`, `userid`, `name`, `photo`
- `mentions: []`
- `timestamp`, `createdAt`

## Security baseline

1. Verify Firebase JWT from `Authorization: Bearer <token>`.
2. Check requester is in `project.members`.
3. Restrict tools by role if needed.
4. Validate tool input with schema (zod/jsonschema).
5. Log each tool call with actor, project, args hash, result status.
