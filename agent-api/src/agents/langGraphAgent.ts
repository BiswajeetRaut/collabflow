import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { HumanMessage, SystemMessage } from '@langchain/core/messages';
import { tool } from '@langchain/core/tools';
import { createReactAgent } from '@langchain/langgraph/prebuilt';
import { z } from 'zod';
import {
  addSubtask,
  assignTaskMember,
  createMeetLink,
  createTask,
  getMyMentions,
  getProjectMembers,
  listTasks,
  postDiscussionMessage,
  scheduleReminder,
  searchDiscussions,
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

const langGraphPrompt = `
You are an advanced CollabFlow LangGraph agent.
You can plan and execute multi-step workflows with tools.

Rules:
1. Always prefer tools for project-aware actions.
2. Chain tools when the request has multiple actions.
3. Ask concise follow-up questions only for missing required fields.
4. Return structured, concise responses with actionable links when relevant.
`;

const createTools = (context: ToolContext) => [
  tool(async () => listTasks({ projectId: context.projectId, userId: context.userId }), {
    name: 'list_tasks',
    description: 'List tasks visible to the current user.',
    schema: z.object({})
  }),
  tool(async () => taskSummary({ projectId: context.projectId, userId: context.userId }), {
    name: 'task_summary',
    description: 'Return high-level summary for current tasks.',
    schema: z.object({})
  }),
  tool(
    async (args: { title: string; description: string; dueDate: string; visibility?: 'general' | 'personal' }) =>
      createTask({
        projectId: context.projectId,
        userId: context.userId,
        userName: context.userName,
        title: args.title,
        description: args.description,
        dueDate: args.dueDate,
        visibility: args.visibility || 'general'
      }),
    {
      name: 'create_task',
      description: 'Create a task and assign it to current user by default.',
      schema: z.object({
        title: z.string().min(1),
        description: z.string().min(1),
        dueDate: z.string().min(1),
        visibility: z.enum(['general', 'personal']).optional()
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
      description: 'Update task status by id or title.',
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
      description: 'Add a subtask to task by id or title.',
      schema: z.object({
        taskIdOrTitle: z.string().min(1),
        subtaskTitle: z.string().min(1)
      })
    }
  ),
  tool(async () => getProjectMembers(context.projectId), {
    name: 'list_project_members',
    description: 'List project members for assignment.',
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
      description: 'Assign member to task.',
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
      description: 'Post project discussion message.',
      schema: z.object({
        message: z.string().min(1)
      })
    }
  ),
  tool(
    async (args: { query: string }) =>
      searchDiscussions({
        projectId: context.projectId,
        query: args.query
      }),
    {
      name: 'search_discussions',
      description: 'Search discussion messages by keyword.',
      schema: z.object({
        query: z.string().min(1)
      })
    }
  ),
  tool(async () => getMyMentions({ projectId: context.projectId, userId: context.userId }), {
    name: 'get_my_mentions',
    description: 'Get latest discussion mentions for the current user.',
    schema: z.object({})
  }),
  tool(
    async (args: { title: string; startsAt: string; durationMinutes?: number }) =>
      createMeetLink({
        projectId: context.projectId,
        createdByUserId: context.userId,
        title: args.title,
        startsAt: args.startsAt,
        durationMinutes: args.durationMinutes || 30
      }),
    {
      name: 'create_meet_link',
      description: 'Create and return a meeting link.',
      schema: z.object({
        title: z.string().min(1),
        startsAt: z.string().min(1),
        durationMinutes: z.number().int().positive().max(480).optional()
      })
    }
  ),
  tool(
    async (args: { title: string; remindAt: string; notes?: string }) =>
      scheduleReminder({
        projectId: context.projectId,
        createdByUserId: context.userId,
        title: args.title,
        remindAt: args.remindAt,
        notes: args.notes
      }),
    {
      name: 'schedule_reminder',
      description: 'Schedule a reminder for the current project.',
      schema: z.object({
        title: z.string().min(1),
        remindAt: z.string().min(1),
        notes: z.string().optional()
      })
    }
  )
];

const buildContextAwareMessage = (message: string, history?: ChatHistoryItem[]) => {
  if (!history?.length) return message;

  const prior = history
    .slice(-10)
    .map((item, index) => `${index + 1}. ${item.role}: ${item.text}`)
    .join('\n');

  return `Conversation history:\n${prior}\n\nLatest user message:\n${message}`;
};

export const createLangGraphAgent = (context: ToolContext) => {
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
      const result = await agent.invoke({
        messages: [
          new SystemMessage(langGraphPrompt),
          new HumanMessage(buildContextAwareMessage(input.message, input.history))
        ]
      });

      const latest = result.messages[result.messages.length - 1];
      return { text: typeof latest.content === 'string' ? latest.content : JSON.stringify(latest.content) };
    }
  };
};
