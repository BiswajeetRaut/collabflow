import { createAdkAgent } from './adkAgent.js';
import { createLangGraphAgent } from './langGraphAgent.js';
import type { ToolContext } from '../tools/firestoreTools.js';

type ChatHistoryItem = {
  role: string;
  text: string;
};

type AgentInput = ToolContext & {
  message: string;
  history?: ChatHistoryItem[];
};

export type AgentMode = 'adk' | 'langgraph';

export const createRootAgent = (context: ToolContext, mode: AgentMode = 'adk') => {
  if (mode === 'langgraph') {
    return createLangGraphAgent(context);
  }

  return createAdkAgent(context);
};

export type { AgentInput };
