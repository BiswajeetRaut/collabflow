import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { tool } from '@langchain/core/tools';
import { AIMessage, HumanMessage, SystemMessage } from '@langchain/core/messages';
import { createReactAgent } from '@langchain/langgraph/prebuilt';
import { z } from 'zod';
import {
  addSubtask,
  assignTaskMember,
  createTask,
  getProjectMembers,
  listTasks,
  postDiscussionMessage,
  taskSummary,
  updateTaskStatus,
  type ToolContext
} from '../tools/firestoreTools.js';

type ChatHistoryItem = {
  role: string;
  text: string;
};

type AgentInput = ToolContext & {
  message: string;
  history?: ChatHistoryItem[];
};

const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash';

const agentPrompt = `
You are CollabFlow's agentic project assistant.
Your job is to understand the user's intent even for complex or multi-part requests,
then call the right tool(s) in sequence.

Rules:
1. Prefer tools over assumptions for project data.
2. If user asks multiple actions, execute all actions in order and provide a concise result summary.
3. For task updates/assignment, taskIdOrTitle can be either task id or exact title.
4. If required details are missing, ask one focused follow-up question.
5. Keep response concise and action oriented.
`;

const createTools = (context: ToolContext) => [
  tool(async () => listTasks({ projectId: context.projectId, userId: context.userId }), {
    name: 'list_tasks',
    description: 'List tasks visible to the current user in the project.',
    schema: z.object({})
  }),
  tool(async () => taskSummary({ projectId: context.projectId, userId: context.userId }), {
    name: 'task_summary',
    description: 'Get aggregated summary: todo/inprogress/complete, due today, overdue, and priority.',
    schema: z.object({})
  }),
  tool(
    async (args: { title: string; description: string; dueDate: string; visibility: 'general' | 'personal' }) =>
      createTask({
        projectId: context.projectId,
        userId: context.userId,
        userName: context.userName,
        title: args.title,
        description: args.description,
        dueDate: args.dueDate,
        visibility: args.visibility
      }),
    {
      name: 'create_task',
      description: 'Create a task in the project.',
      schema: z.object({
        title: z.string().min(1),
        description: z.string().min(1),
        dueDate: z.string().describe('Due date in YYYY-MM-DD format'),
        visibility: z.enum(['general', 'personal']).default('general')
      })
    }
  ),
  tool(
    async (args: { taskIdOrTitle: string; status: 'todo' | 'inprogress' | 'complete' }) =>
      updateTaskStatus({
        projectId: context.projectId,
        taskIdOrTitle: args.taskIdOrTitle,
        status: args.status
      }),
    {
      name: 'update_task_status',
      description: 'Update a task status using task id or task title.',
      schema: z.object({
        taskIdOrTitle: z.string().min(1),
        status: z.enum(['todo', 'inprogress', 'complete'])
      })
    }
  ),
  tool(
    async (args: { taskIdOrTitle: string; subtaskTitle: string }) =>
      addSubtask({
        projectId: context.projectId,
        taskIdOrTitle: args.taskIdOrTitle,
        subtaskTitle: args.subtaskTitle
      }),
    {
      name: 'add_subtask',
      description: 'Add a subtask to a task using task id or title.',
      schema: z.object({
        taskIdOrTitle: z.string().min(1),
        subtaskTitle: z.string().min(1)
      })
    }
  ),
  tool(async () => getProjectMembers(context.projectId), {
    name: 'list_project_members',
    description: 'List members in the active project.',
    schema: z.object({})
  }),
  tool(
    async (args: { taskIdOrTitle: string; memberIdOrName: string }) =>
      assignTaskMember({
        projectId: context.projectId,
        taskIdOrTitle: args.taskIdOrTitle,
        memberIdOrName: args.memberIdOrName
      }),
    {
      name: 'assign_task_member',
      description: 'Assign a project member to a task by task id/title and member id/name.',
      schema: z.object({
        taskIdOrTitle: z.string().min(1),
        memberIdOrName: z.string().min(1)
      })
    }
  ),
  tool(
    async (args: { message: string }) =>
      postDiscussionMessage({
        projectId: context.projectId,
        userId: context.userId,
        userName: context.userName,
        userPhoto: context.userPhoto,
        message: args.message
      }),
    {
      name: 'post_discussion_message',
      description: 'Post a discussion message in the current project.',
      schema: z.object({
        message: z.string().min(1)
      })
    }
  )
];

const buildHistoryMessages = (history?: ChatHistoryItem[]) => {
  if (!history?.length) return [];

  return history.slice(-10).map((item) =>
    item.role === 'assistant' ? new AIMessage(item.text) : new HumanMessage(item.text)
  );
};

export const createRootAgent = (context: ToolContext) => {
  const model = new ChatGoogleGenerativeAI({
    model: GEMINI_MODEL,
    temperature: 0.1
  });

  const agent = createReactAgent({
    llm: model,
    tools: createTools(context)
  });

  return {
    async run(input: AgentInput) {
      const historyMessages = buildHistoryMessages(input.history);
      const result = await agent.invoke({
        messages: [
          new SystemMessage(agentPrompt),
          ...historyMessages,
          new HumanMessage(input.message)
        ]
      });

      const latest = result.messages[result.messages.length - 1];
      return { text: typeof latest.content === 'string' ? latest.content : JSON.stringify(latest.content) };
    }
  };
};
