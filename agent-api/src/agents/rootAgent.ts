import { LlmAgent } from '@google/adk';
import {
  assignTaskMember,
  createTask,
  getProjectMembers,
  listTasks,
  postDiscussionMessage,
  updateTaskStatus,
  type ToolContext
} from '../tools/firestoreTools.js';

type AgentInput = ToolContext & {
  message: string;
};

const routerPrompt = `
You are the supervisor for CollabFlow.
Decide which worker agent should handle the user request:
- task_ops_agent: create/update/list task and subtasks work
- collaboration_agent: members and discussion operations
If no tool is needed, answer directly.
Always return short JSON with keys: {"target": "task_ops_agent|collaboration_agent|direct", "reason": "..."}
`;

const taskOpsPrompt = `
You are task_ops_agent for CollabFlow.
Use tools to execute task operations in Firestore.
If required arguments are missing, ask a follow-up question with only missing fields.
`;

const collaborationPrompt = `
You are collaboration_agent for CollabFlow.
Use tools for project members and discussions.
If required arguments are missing, ask a follow-up question with only missing fields.
`;

const formatTool = (name: string, description: string, fn: (input: any) => Promise<any>) => ({
  name,
  description,
  execute: fn
});

const createWorkerAgents = (context: ToolContext) => {
  const taskOpsAgent = new LlmAgent({
    name: 'task_ops_agent',
    model: 'gemini-2.5-flash',
    instruction: taskOpsPrompt,
    tools: [
      formatTool('list_tasks', 'List visible tasks for the current user.', async () =>
        listTasks({ projectId: context.projectId, userId: context.userId })
      ),
      formatTool('create_task', 'Create a task.', async (args) =>
        createTask({
          projectId: context.projectId,
          userId: context.userId,
          userName: context.userName,
          title: args.title,
          description: args.description,
          dueDate: args.dueDate,
          visibility: args.visibility || 'general'
        })
      ),
      formatTool('update_task_status', 'Update a task status.', async (args) =>
        updateTaskStatus({ projectId: context.projectId, taskId: args.taskId, status: args.status })
      )
    ]
  });

  const collaborationAgent = new LlmAgent({
    name: 'collaboration_agent',
    model: 'gemini-2.5-flash',
    instruction: collaborationPrompt,
    tools: [
      formatTool('list_project_members', 'List project members.', async () =>
        getProjectMembers(context.projectId)
      ),
      formatTool('assign_task_member', 'Assign member to task.', async (args) =>
        assignTaskMember({
          projectId: context.projectId,
          taskId: args.taskId,
          memberIdOrName: args.memberIdOrName
        })
      ),
      formatTool('post_discussion_message', 'Post a discussion message.', async (args) =>
        postDiscussionMessage({
          projectId: context.projectId,
          userId: context.userId,
          userName: context.userName,
          userPhoto: context.userPhoto,
          message: args.message
        })
      )
    ]
  });

  return { taskOpsAgent, collaborationAgent };
};

export const createRootAgent = (context: ToolContext) => {
  const { taskOpsAgent, collaborationAgent } = createWorkerAgents(context);

  const routerAgent = new LlmAgent({
    name: 'router_agent',
    model: 'gemini-2.5-flash',
    instruction: routerPrompt
  });

  return {
    async run(input: AgentInput) {
      const route = await routerAgent.run(input.message);
      const routeText = String(route?.text || route || '').toLowerCase();

      if (routeText.includes('task_ops_agent')) {
        return taskOpsAgent.run(input.message);
      }

      if (routeText.includes('collaboration_agent')) {
        return collaborationAgent.run(input.message);
      }

      return routerAgent.run(input.message);
    }
  };
};
