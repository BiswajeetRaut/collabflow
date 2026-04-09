import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import admin from 'firebase-admin';
import { z } from 'zod';
import { createRootAgent } from './agents/rootAgent.js';

const app = express();
app.use(cors());
app.use(express.json({ limit: '1mb' }));

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')
    })
  });
}

const requestSchema = z.object({
  projectId: z.string().min(1),
  userId: z.string().min(1),
  userName: z.string().min(1),
  userPhoto: z.string().optional(),
  message: z.string().min(1),
  history: z.array(z.object({ role: z.string(), text: z.string() })).optional()
});

app.get('/health', (_req, res) => {
  res.json({ ok: true, service: 'collabflow-agent-api' });
});

app.post('/v1/agent/chat', async (req, res) => {
  try {
    const payload = requestSchema.parse(req.body);

    const agent = createRootAgent({
      projectId: payload.projectId,
      userId: payload.userId,
      userName: payload.userName,
      userPhoto: payload.userPhoto
    });

    const result = await agent.run({
      message: payload.message,
      projectId: payload.projectId,
      userId: payload.userId,
      userName: payload.userName,
      userPhoto: payload.userPhoto,
      history: payload.history
    });

    res.json({
      reply: String(result?.text || result || 'No response from agent.'),
      provider: 'langgraph-gemini',
      mode: 'agentic-tool-calling'
    });
  } catch (error: any) {
    res.status(400).json({
      reply: 'I need more details before I can run that tool operation.',
      error: error?.message || 'Unknown error'
    });
  }
});

const port = Number(process.env.PORT || 8080);
app.listen(port, () => {
  console.log(`collabflow-agent-api listening on :${port}`);
});
