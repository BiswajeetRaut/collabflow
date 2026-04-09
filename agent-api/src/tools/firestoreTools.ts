import admin from 'firebase-admin';
import { z } from 'zod';

const assignSchema = z.object({
  projectId: z.string().min(1),
  taskId: z.string().min(1),
  memberIdOrName: z.string().min(1)
});

const createSchema = z.object({
  projectId: z.string().min(1),
  userId: z.string().min(1),
  userName: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  dueDate: z.string().min(1),
  visibility: z.enum(['general', 'personal']).default('general')
});

const statusSchema = z.object({
  projectId: z.string().min(1),
  taskId: z.string().min(1),
  status: z.enum(['todo', 'inprogress', 'complete'])
});

const messageSchema = z.object({
  projectId: z.string().min(1),
  userId: z.string().min(1),
  userName: z.string().min(1),
  userPhoto: z.string().optional(),
  message: z.string().min(1)
});

export type ToolContext = {
  projectId: string;
  userId: string;
  userName: string;
  userPhoto?: string;
};

const normalizeDate = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    throw new Error(`Invalid date: ${value}. Use YYYY-MM-DD.`);
  }
  return date;
};

export const getProjectMembers = async (projectId: string) => {
  const snapshot = await admin.firestore().collection('Projects').doc(projectId).get();
  return snapshot.data()?.members || [];
};

export const listTasks = async ({ projectId, userId }: Pick<ToolContext, 'projectId' | 'userId'>) => {
  const snapshot = await admin
    .firestore()
    .collection('Projects')
    .doc(projectId)
    .collection('Tasks')
    .orderBy('endDate', 'asc')
    .get();

  const tasks = snapshot.docs
    .map((doc) => ({ id: doc.id, ...doc.data() }))
    .filter((task: any) => task.visibility === 'general' || (task.members || []).some((m: any) => m.id === userId));

  return { tasks };
};

export const createTask = async (input: z.input<typeof createSchema>) => {
  const payload = createSchema.parse(input);
  const due = normalizeDate(payload.dueDate);

  const ref = await admin
    .firestore()
    .collection('Projects')
    .doc(payload.projectId)
    .collection('Tasks')
    .add({
      title: payload.title,
      description: payload.description,
      startDate: new Date(),
      endDate: due,
      status: 'todo',
      visibility: payload.visibility,
      members: [{ id: payload.userId, name: payload.userName }],
      created_by: payload.userName,
      created_by_id: payload.userId,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

  return { taskId: ref.id, title: payload.title };
};

export const updateTaskStatus = async (input: z.input<typeof statusSchema>) => {
  const payload = statusSchema.parse(input);
  await admin
    .firestore()
    .collection('Projects')
    .doc(payload.projectId)
    .collection('Tasks')
    .doc(payload.taskId)
    .update({
      status: payload.status,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

  return { taskId: payload.taskId, status: payload.status };
};

export const assignTaskMember = async (input: z.input<typeof assignSchema>) => {
  const payload = assignSchema.parse(input);

  const [taskDoc, members] = await Promise.all([
    admin
      .firestore()
      .collection('Projects')
      .doc(payload.projectId)
      .collection('Tasks')
      .doc(payload.taskId)
      .get(),
    getProjectMembers(payload.projectId)
  ]);

  if (!taskDoc.exists) {
    throw new Error(`Task not found: ${payload.taskId}`);
  }

  const memberKey = payload.memberIdOrName.toLowerCase();
  const member = members.find(
    (m: any) => m.id?.toLowerCase() === memberKey || m.name?.toLowerCase() === memberKey
  );

  if (!member) {
    throw new Error(`Member not found: ${payload.memberIdOrName}. Call list_project_members first.`);
  }

  const current = (taskDoc.data()?.members || []) as Array<any>;
  const already = current.some((m) => m.id === member.id);

  if (!already) {
    await taskDoc.ref.update({
      members: [...current, member],
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
  }

  return { taskId: payload.taskId, memberId: member.id, memberName: member.name, alreadyAssigned: already };
};

export const postDiscussionMessage = async (input: z.input<typeof messageSchema>) => {
  const payload = messageSchema.parse(input);

  const ref = await admin
    .firestore()
    .collection('Projects')
    .doc(payload.projectId)
    .collection('Discussions')
    .add({
      message: payload.message,
      userid: payload.userId,
      name: payload.userName,
      photo: payload.userPhoto || '',
      mentions: [],
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });

  return { discussionId: ref.id };
};
