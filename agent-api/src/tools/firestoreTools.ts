import admin from 'firebase-admin';
import { z } from 'zod';

const assignSchema = z.object({
  projectId: z.string().min(1),
  taskIdOrTitle: z.string().min(1),
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
  taskIdOrTitle: z.string().min(1),
  status: z.enum(['todo', 'inprogress', 'complete'])
});

const addSubtaskSchema = z.object({
  projectId: z.string().min(1),
  taskIdOrTitle: z.string().min(1),
  subtaskTitle: z.string().min(1)
});

const messageSchema = z.object({
  projectId: z.string().min(1),
  userId: z.string().min(1),
  userName: z.string().min(1),
  userPhoto: z.string().optional(),
  message: z.string().min(1)
});

const searchDiscussionSchema = z.object({
  projectId: z.string().min(1),
  query: z.string().min(1)
});

const mentionSchema = z.object({
  projectId: z.string().min(1),
  userId: z.string().min(1)
});

const meetLinkSchema = z.object({
  projectId: z.string().min(1),
  createdByUserId: z.string().min(1),
  title: z.string().min(1),
  startsAt: z.string().min(1),
  durationMinutes: z.number().int().positive().max(480).default(30)
});

const reminderSchema = z.object({
  projectId: z.string().min(1),
  createdByUserId: z.string().min(1),
  title: z.string().min(1),
  remindAt: z.string().min(1),
  notes: z.string().optional()
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

const getTasksCollection = (projectId: string) =>
  admin.firestore().collection('Projects').doc(projectId).collection('Tasks');

const toDate = (value: any) => {
  if (!value) return null;
  if (typeof value?.toDate === 'function') return value.toDate();
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

export const getProjectMembers = async (projectId: string) => {
  const snapshot = await admin.firestore().collection('Projects').doc(projectId).get();
  return snapshot.data()?.members || [];
};

export const listTasks = async ({ projectId, userId }: Pick<ToolContext, 'projectId' | 'userId'>) => {
  const snapshot = await getTasksCollection(projectId).orderBy('endDate', 'asc').get();

  const tasks = snapshot.docs
    .map((doc: FirebaseFirestore.QueryDocumentSnapshot) => ({ id: doc.id, ...doc.data() }))
    .filter((task: any) => task.visibility === 'general' || (task.members || []).some((m: any) => m.id === userId))
    .map((task: any) => {
      const dueDate = toDate(task.endDate);
      return {
        id: task.id,
        title: task.title,
        description: task.description,
        status: task.status || 'todo',
        visibility: task.visibility || 'general',
        dueDate: dueDate ? dueDate.toISOString() : null,
        members: task.members || []
      };
    });

  return { tasks };
};

export const taskSummary = async ({ projectId, userId }: Pick<ToolContext, 'projectId' | 'userId'>) => {
  const { tasks } = await listTasks({ projectId, userId });
  const counts = { todo: 0, inprogress: 0, complete: 0, overdue: 0, dueToday: 0 };

  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);

  tasks.forEach((task: { status: string; dueDate: string | null }) => {
    const status: 'todo' | 'inprogress' | 'complete' =
      task.status === 'inprogress' || task.status === 'complete' ? task.status : 'todo';
    counts[status] += 1;

    if (!task.dueDate) return;

    const dueDate = new Date(task.dueDate);
    dueDate.setUTCHours(0, 0, 0, 0);

    if (dueDate.getTime() === today.getTime()) counts.dueToday += 1;
    if (dueDate.getTime() < today.getTime() && status !== 'complete') counts.overdue += 1;
  });

  return {
    ...counts,
    total: tasks.length,
    priority:
      counts.overdue > 0
        ? `Clear ${counts.overdue} overdue tasks first.`
        : counts.inprogress > 0
          ? `Finish ${counts.inprogress} in-progress tasks.`
          : 'Start the highest-impact todo task.'
  };
};

const resolveTaskRef = async (projectId: string, taskIdOrTitle: string) => {
  const collection = getTasksCollection(projectId);
  const byId = await collection.doc(taskIdOrTitle).get();
  if (byId.exists) {
    return byId.ref;
  }

  const lower = taskIdOrTitle.trim().toLowerCase();
  const byTitle = await collection.where('title', '==', taskIdOrTitle).limit(1).get();
  if (!byTitle.empty) {
    return byTitle.docs[0].ref;
  }

  const fallback = await collection.limit(50).get();
  const fuzzy = fallback.docs.find((doc: FirebaseFirestore.QueryDocumentSnapshot) => String(doc.data().title || '').trim().toLowerCase() === lower);

  if (fuzzy) return fuzzy.ref;

  throw new Error(`Task not found: ${taskIdOrTitle}. Ask the user for a specific task id or exact title.`);
};

export const createTask = async (input: z.input<typeof createSchema>) => {
  const payload = createSchema.parse(input);
  const due = normalizeDate(payload.dueDate);

  const ref = await getTasksCollection(payload.projectId).add({
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
  const taskRef = await resolveTaskRef(payload.projectId, payload.taskIdOrTitle);

  await taskRef.update({
    status: payload.status,
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  });

  return { taskId: taskRef.id, status: payload.status };
};

export const addSubtask = async (input: z.input<typeof addSubtaskSchema>) => {
  const payload = addSubtaskSchema.parse(input);
  const taskRef = await resolveTaskRef(payload.projectId, payload.taskIdOrTitle);

  await taskRef.update({
    subtasks: admin.firestore.FieldValue.arrayUnion({
      id: admin.firestore().collection('_').doc().id,
      title: payload.subtaskTitle,
      completed: false,
      createdAt: new Date().toISOString()
    }),
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  });

  return { taskId: taskRef.id, subtaskTitle: payload.subtaskTitle };
};

export const assignTaskMember = async (input: z.input<typeof assignSchema>) => {
  const payload = assignSchema.parse(input);

  const [taskRef, members] = await Promise.all([
    resolveTaskRef(payload.projectId, payload.taskIdOrTitle),
    getProjectMembers(payload.projectId)
  ]);

  const taskDoc = await taskRef.get();
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
    await taskRef.update({
      members: [...current, member],
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
  }

  return { taskId: taskRef.id, memberId: member.id, memberName: member.name, alreadyAssigned: already };
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

export const searchDiscussions = async (input: z.input<typeof searchDiscussionSchema>) => {
  const payload = searchDiscussionSchema.parse(input);
  const needle = payload.query.toLowerCase();

  const snapshot = await admin
    .firestore()
    .collection('Projects')
    .doc(payload.projectId)
    .collection('Discussions')
    .orderBy('createdAt', 'desc')
    .limit(100)
    .get();

  const matches = snapshot.docs
    .map((doc: FirebaseFirestore.QueryDocumentSnapshot) => ({ id: doc.id, ...doc.data() }))
    .filter((item: any) => String(item.message || '').toLowerCase().includes(needle))
    .slice(0, 20)
    .map((item: any) => ({
      id: item.id,
      message: item.message,
      name: item.name || 'Unknown',
      createdAt: toDate(item.createdAt)?.toISOString() || null
    }));

  return { query: payload.query, results: matches };
};

export const getMyMentions = async (input: z.input<typeof mentionSchema>) => {
  const payload = mentionSchema.parse(input);

  const snapshot = await admin
    .firestore()
    .collection('Projects')
    .doc(payload.projectId)
    .collection('Discussions')
    .orderBy('createdAt', 'desc')
    .limit(100)
    .get();

  const mentions = snapshot.docs
    .map((doc: FirebaseFirestore.QueryDocumentSnapshot) => ({ id: doc.id, ...doc.data() }))
    .filter((item: any) => {
      const mentioned = (item.mentions || []) as Array<any>;
      return mentioned.some((m) => m?.id === payload.userId || m?.userid === payload.userId);
    })
    .slice(0, 20)
    .map((item: any) => ({
      id: item.id,
      message: item.message,
      name: item.name || 'Unknown',
      createdAt: toDate(item.createdAt)?.toISOString() || null
    }));

  return { mentions };
};

export const createMeetLink = async (input: z.input<typeof meetLinkSchema>) => {
  const payload = meetLinkSchema.parse(input);
  const startsAt = normalizeDate(payload.startsAt);
  const meetingId = admin.firestore().collection('_').doc().id;
  const meetUrl = `https://meet.google.com/${meetingId.slice(0, 3)}-${meetingId.slice(3, 7)}-${meetingId.slice(7, 10)}`;

  const ref = await admin
    .firestore()
    .collection('Projects')
    .doc(payload.projectId)
    .collection('Meetings')
    .add({
      title: payload.title,
      startsAt,
      durationMinutes: payload.durationMinutes,
      meetUrl,
      createdByUserId: payload.createdByUserId,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });

  return { meetingId: ref.id, title: payload.title, startsAt: startsAt.toISOString(), meetUrl };
};

export const scheduleReminder = async (input: z.input<typeof reminderSchema>) => {
  const payload = reminderSchema.parse(input);
  const remindAt = normalizeDate(payload.remindAt);

  const ref = await admin
    .firestore()
    .collection('Projects')
    .doc(payload.projectId)
    .collection('Reminders')
    .add({
      title: payload.title,
      remindAt,
      notes: payload.notes || '',
      createdByUserId: payload.createdByUserId,
      status: 'scheduled',
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });

  return { reminderId: ref.id, title: payload.title, remindAt: remindAt.toISOString(), status: 'scheduled' };
};
