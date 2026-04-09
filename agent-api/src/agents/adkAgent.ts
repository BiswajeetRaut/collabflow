import { LlmAgent } from '@google/adk';
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

const agentPrompt = `
You are CollabFlow's agentic assistant using Gemini.
You must understand natural language requests, including complex multi-step instructions.

Behavior requirements:
1) Prefer tool execution over assumptions whenever project data/actions are requested.
2) When a user asks for multiple actions, execute them in sequence and summarize outcomes.
3) Use taskIdOrTitle as either task id or task title.
4) If required fields are missing, ask one concise follow-up question.
5) Keep final replies concise, practical, and user-focused.
6) Available tools are strongly typed; provide required arguments exactly.
`;

const withSchema = <T>(
  schema: z.ZodType<T>,
  execute: (args: T) => Promise<any>
) => async (args: unknown) => execute(schema.parse(args));

const formatTool = (
  name: string,
  description: string,
  inputSchema: unknown,
  execute: (args: any) => Promise<any>
) => ({
  name,
  description,
  input_schema: inputSchema,
  execute
});

const createTaskSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  dueDate: z.string().min(1).describe('Date in YYYY-MM-DD format'),
  visibility: z.enum(['general', 'personal']).default('general')
});

const updateTaskStatusSchema = z.object({
  taskIdOrTitle: z.string().min(1),
  status: z.enum(['todo', 'inprogress', 'complete'])
});

const addSubtaskSchema = z.object({
  taskIdOrTitle: z.string().min(1),
  subtaskTitle: z.string().min(1)
});

const assignTaskMemberSchema = z.object({
  taskIdOrTitle: z.string().min(1),
  memberIdOrName: z.string().min(1)
});

const postDiscussionSchema = z.object({
  message: z.string().min(1)
});

const searchDiscussionSchema = z.object({
  query: z.string().min(1)
});

const mentionSchema = z.object({});

const createMeetLinkSchema = z.object({
  title: z.string().min(1),
  startsAt: z.string().min(1),
  durationMinutes: z.number().int().positive().max(480).default(30)
});

const scheduleReminderSchema = z.object({
  title: z.string().min(1),
  remindAt: z.string().min(1),
  notes: z.string().optional()
});

const createTaskInputSchema = {
  type: 'object',
  properties: {
    title: { type: 'string' },
    description: { type: 'string' },
    dueDate: { type: 'string', description: 'Date in YYYY-MM-DD format' },
    visibility: { type: 'string', enum: ['general', 'personal'] }
  },
  required: ['title', 'description', 'dueDate']
};

const updateTaskStatusInputSchema = {
  type: 'object',
  properties: {
    taskIdOrTitle: { type: 'string' },
    status: { type: 'string', enum: ['todo', 'inprogress', 'complete'] }
  },
  required: ['taskIdOrTitle', 'status']
};

const addSubtaskInputSchema = {
  type: 'object',
  properties: {
    taskIdOrTitle: { type: 'string' },
    subtaskTitle: { type: 'string' }
  },
  required: ['taskIdOrTitle', 'subtaskTitle']
};

const assignTaskMemberInputSchema = {
  type: 'object',
  properties: {
    taskIdOrTitle: { type: 'string' },
    memberIdOrName: { type: 'string' }
  },
  required: ['taskIdOrTitle', 'memberIdOrName']
};

const postDiscussionInputSchema = {
  type: 'object',
  properties: {
    message: { type: 'string' }
  },
  required: ['message']
};

const searchDiscussionInputSchema = {
  type: 'object',
  properties: {
    query: { type: 'string' }
  },
  required: ['query']
};

const mentionInputSchema = {
  type: 'object',
  properties: {},
  required: []
};

const createMeetLinkInputSchema = {
  type: 'object',
  properties: {
    title: { type: 'string' },
    startsAt: { type: 'string', description: 'ISO datetime preferred' },
    durationMinutes: { type: 'number' }
  },
  required: ['title', 'startsAt']
};

const scheduleReminderInputSchema = {
  type: 'object',
  properties: {
    title: { type: 'string' },
    remindAt: { type: 'string', description: 'ISO datetime preferred' },
    notes: { type: 'string' }
  },
  required: ['title', 'remindAt']
};

const createAgent = (context: ToolContext) =>
  new LlmAgent({
    name: 'collabflow_agent',
    model: GEMINI_MODEL,
    instruction: agentPrompt,
    tools: [
      formatTool('list_tasks', 'List tasks visible to the current user.', {}, async () =>
        listTasks({ projectId: context.projectId, userId: context.userId })
      ),
      formatTool('task_summary', 'Get summary counts and priority for current tasks.', {}, async () =>
        taskSummary({ projectId: context.projectId, userId: context.userId })
      ),
      formatTool(
        'create_task',
        'Create a task in the project. Use this whenever user asks to create/add a task.',
        createTaskInputSchema,
        withSchema(createTaskSchema, async (args: z.infer<typeof createTaskSchema>) =>
          createTask({
            projectId: context.projectId,
            userId: context.userId,
            userName: context.userName,
            title: args.title,
            description: args.description,
            dueDate: args.dueDate,
            visibility: args.visibility || 'general'
          })
        )
      ),
      formatTool(
        'update_task_status',
        'Update task status by task id or task title.',
        updateTaskStatusInputSchema,
        withSchema(updateTaskStatusSchema, async (args: z.infer<typeof updateTaskStatusSchema>) =>
          updateTaskStatus({
            projectId: context.projectId,
            taskIdOrTitle: args.taskIdOrTitle,
            status: args.status
          })
        )
      ),
      formatTool(
        'add_subtask',
        'Add a subtask to task by task id or title.',
        addSubtaskInputSchema,
        withSchema(addSubtaskSchema, async (args: z.infer<typeof addSubtaskSchema>) =>
          addSubtask({
            projectId: context.projectId,
            taskIdOrTitle: args.taskIdOrTitle,
            subtaskTitle: args.subtaskTitle
          })
        )
      ),
      formatTool('list_project_members', 'List all project members.', {}, async () =>
        getProjectMembers(context.projectId)
      ),
      formatTool(
        'assign_task_member',
        'Assign a member to task by task id/title.',
        assignTaskMemberInputSchema,
        withSchema(assignTaskMemberSchema, async (args: z.infer<typeof assignTaskMemberSchema>) =>
          assignTaskMember({
            projectId: context.projectId,
            taskIdOrTitle: args.taskIdOrTitle,
            memberIdOrName: args.memberIdOrName
          })
        )
      ),
      formatTool(
        'post_discussion_message',
        'Post a message in project discussions.',
        postDiscussionInputSchema,
        withSchema(postDiscussionSchema, async (args: z.infer<typeof postDiscussionSchema>) =>
          postDiscussionMessage({
            projectId: context.projectId,
            userId: context.userId,
            userName: context.userName,
            userPhoto: context.userPhoto,
            message: args.message
          })
        )
      ),
      formatTool(
        'search_discussions',
        'Search discussion messages by query text.',
        searchDiscussionInputSchema,
        withSchema(searchDiscussionSchema, async (args: z.infer<typeof searchDiscussionSchema>) =>
          searchDiscussions({
            projectId: context.projectId,
            query: args.query
          })
        )
      ),
      formatTool(
        'get_my_mentions',
        'Get latest discussion messages that mention the current user.',
        mentionInputSchema,
        withSchema(mentionSchema, async () =>
          getMyMentions({
            projectId: context.projectId,
            userId: context.userId
          })
        )
      ),
      formatTool(
        'create_meet_link',
        'Create a meeting link for the project.',
        createMeetLinkInputSchema,
        withSchema(createMeetLinkSchema, async (args: z.infer<typeof createMeetLinkSchema>) =>
          createMeetLink({
            projectId: context.projectId,
            createdByUserId: context.userId,
            title: args.title,
            startsAt: args.startsAt,
            durationMinutes: args.durationMinutes
          })
        )
      ),
      formatTool(
        'schedule_reminder',
        'Schedule a reminder for the project.',
        scheduleReminderInputSchema,
        withSchema(scheduleReminderSchema, async (args: z.infer<typeof scheduleReminderSchema>) =>
          scheduleReminder({
            projectId: context.projectId,
            createdByUserId: context.userId,
            title: args.title,
            remindAt: args.remindAt,
            notes: args.notes
          })
        )
      )
    ]
  });

const buildContextAwareMessage = (message: string, history?: ChatHistoryItem[]) => {
  if (!history?.length) return message;

  const prior = history
    .slice(-10)
    .map((item, index) => `${index + 1}. ${item.role}: ${item.text}`)
    .join('\n');

  return `Conversation history:\n${prior}\n\nLatest user message:\n${message}`;
};

export const createAdkAgent = (context: ToolContext) => {
  const agent = createAgent(context);

  return {
    async run(input: AgentInput) {
      const prompt = buildContextAwareMessage(input.message, input.history);
      const result = await agent.run(prompt);
      return { text: String(result?.text || result || 'No response from agent.') };
    }
  };
};
