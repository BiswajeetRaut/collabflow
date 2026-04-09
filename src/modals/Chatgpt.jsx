import React, { useMemo, useState } from 'react';
import db from '../firebase';
import { useSelector } from 'react-redux';
import { selectProjectId } from '../features/project/projectSlice';
import { selectUserId, selectUserName } from '../features/user/userSlice';

const HOSTED_AGENT_TOOLS = [
  'list_tasks',
  'task_summary',
  'create_task',
  'update_task_status',
  'add_subtask',
  'assign_task_member',
  'post_discussion_message',
  'list_project_members'
];

const TOOL_DEFINITIONS = [
  {
    name: 'list_tasks',
    usage: 'Show my tasks / list tasks',
    purpose: 'Fetches your visible tasks (general + personal assigned to you).'
  },
  {
    name: 'task_summary',
    usage: 'Summarize tasks / what should I focus on?',
    purpose: 'Returns actionable counts by status and urgency (today, overdue).'
  },
  {
    name: 'create_task',
    usage: 'Create task: title | description | YYYY-MM-DD | general|personal',
    purpose: 'Creates a task directly in the current project.'
  },
  {
    name: 'update_task_status',
    usage: 'Move task <task-id or task-title> to todo|inprogress|complete',
    purpose: 'Updates task workflow state so boards stay synced.'
  }
];

const STATUS_ORDER = ['todo', 'inprogress', 'complete'];

const normaliseStatus = (value = '') => {
  const lowered = value.toLowerCase();
  if (lowered.includes('progress')) return 'inprogress';
  if (lowered.includes('done') || lowered.includes('complete')) return 'complete';
  return 'todo';
};

const matchesUser = (task, userId) => {
  if (task.visibility === 'general') return true;
  return (task.members || []).some((member) => member.id === userId);
};

const parseDateFromCommand = (value) => {
  if (!value) return null;
  const parsed = new Date(value.trim());
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const getDateDaysFromToday = (days) => {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() + days);
  return date;
};

const inferNaturalCreateTaskInput = (text) => {
  const lower = text.toLowerCase();
  const isCreateIntent =
    lower.includes('create') &&
    (lower.includes('task') || lower.includes('todo')) &&
    (lower.includes('deadline') || lower.includes('due') || lower.includes('by'));

  if (!isCreateIntent) return null;

  const titleMatch =
    text.match(/task name(?: as| is)?\s+["“]?(.+?)["”]?(?:\s+and|\s+with|\s+deadline|\s+due|$)/i) ||
    text.match(/create (?:a )?task(?: called| named)?\s+["“]?(.+?)["”]?(?:\s+and|\s+with|\s+deadline|\s+due|$)/i);

  const daysMatch = text.match(/(\d+)\s*(?:business\s*)?days?\s*(?:from\s+today|later|out)?/i);
  const explicitDateMatch = text.match(/\b(\d{4}-\d{2}-\d{2})\b/);

  const title = titleMatch?.[1]?.trim();
  const dueDate = explicitDateMatch?.[1]
    ? parseDateFromCommand(explicitDateMatch[1])
    : daysMatch
      ? getDateDaysFromToday(Number(daysMatch[1]))
      : null;

  if (!title || !dueDate) return null;

  return {
    title,
    description: `Created from chat request: ${text}`,
    dueDate,
    visibility: lower.includes('personal') ? 'personal' : 'general'
  };
};

const formatTaskLine = (task) => {
  const dueDate = task.endDate?.toDate ? task.endDate.toDate() : task.endDate;
  const due = dueDate ? new Date(dueDate).toLocaleDateString() : 'N/A';
  return `• ${task.title} (status: ${task.status}, due: ${due}) → ${window.location.origin}/task/${task.id}`;
};

const linkifyText = (text) => {
  const markdownRegex = /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g;
  const urlRegex = /(https?:\/\/[^\s]+)/g;

  return text.split('\n').map((line, lineIndex) => {
    const markdownParts = [];
    let cursor = 0;
    let markdownMatch;

    while ((markdownMatch = markdownRegex.exec(line)) !== null) {
      if (markdownMatch.index > cursor) {
        markdownParts.push({ type: 'text', value: line.slice(cursor, markdownMatch.index) });
      }
      markdownParts.push({
        type: 'link',
        value: markdownMatch[1],
        href: markdownMatch[2]
      });
      cursor = markdownRegex.lastIndex;
    }

    if (cursor < line.length) {
      markdownParts.push({ type: 'text', value: line.slice(cursor) });
    }

    const resolvedParts = markdownParts.flatMap((part) => {
      if (part.type === 'link') return [part];

      const pieces = [];
      let textCursor = 0;
      let urlMatch;
      while ((urlMatch = urlRegex.exec(part.value)) !== null) {
        if (urlMatch.index > textCursor) {
          pieces.push({ type: 'text', value: part.value.slice(textCursor, urlMatch.index) });
        }
        pieces.push({ type: 'link', value: 'Open', href: urlMatch[1] });
        textCursor = urlRegex.lastIndex;
      }
      if (textCursor < part.value.length) {
        pieces.push({ type: 'text', value: part.value.slice(textCursor) });
      }
      return pieces;
    });

    return (
      <div key={`line-${lineIndex}`}>
        {resolvedParts.map((part, index) =>
          part.type === 'link' ? (
            <a
              key={`part-${lineIndex}-${index}`}
              href={part.href}
              className="text-indigo-600 underline font-medium hover:text-indigo-800"
            >
              {part.value}
            </a>
          ) : (
            <span key={`part-${lineIndex}-${index}`}>{part.value}</span>
          )
        )}
      </div>
    );
  });
};

const ChatGPT = ({ setchatgpt, messages, responses, setMessages, setResponses }) => {
  const projectId = useSelector(selectProjectId);
  const userId = useSelector(selectUserId);
  const userName = useSelector(selectUserName);

  const [isProcessing, setIsProcessing] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [agentMode, setAgentMode] = useState('adk');
  const agentApiUrl = process.env.REACT_APP_AGENT_API_URL;

  const toolSummary = useMemo(
    () => TOOL_DEFINITIONS.map((tool) => `${tool.name}: ${tool.purpose}`).join(' | '),
    []
  );

  const getVisibleTasks = async () => {
    const snapshot = await db
      .collection('Projects')
      .doc(projectId)
      .collection('Tasks')
      .orderBy('endDate', 'asc')
      .get();

    const tasks = [];
    snapshot.docs.forEach((doc) => {
      const task = { ...doc.data(), id: doc.id };
      if (matchesUser(task, userId)) {
        tasks.push(task);
      }
    });

    return tasks;
  };

  const runAgent = async (message) => {
    const text = message.trim();
    const lowerText = text.toLowerCase();

    if (!projectId) {
      return 'Please select a project first. I can only run tools inside an active project.';
    }

    if (lowerText === '/help' || lowerText.includes('tools') || lowerText.includes('help')) {
      return [
        `I am your CollabFlow agent. I can execute these tools:`,
        ...TOOL_DEFINITIONS.map(
          (tool) => `• ${tool.name}: ${tool.usage}\n  ↳ ${tool.purpose}`
        ),
        'Tip: try `Create task: QA regression sweep | Verify dashboard flow | 2026-04-20 | general`.'
      ].join('\n');
    }

    if (lowerText.startsWith('create task:') || lowerText.includes('create') || lowerText.includes('deadline')) {
      let title;
      let description;
      let dueDate;
      let visibility = 'general';

      if (lowerText.startsWith('create task:')) {
        const payload = text.replace(/create task:/i, '').split('|').map((item) => item.trim());
        const [titleRaw, descriptionRaw, dueDateRaw, visibilityRaw] = payload;
        title = titleRaw;
        description = descriptionRaw;
        dueDate = parseDateFromCommand(dueDateRaw);
        visibility = visibilityRaw === 'personal' ? 'personal' : 'general';
      } else {
        const inferred = inferNaturalCreateTaskInput(text);
        if (inferred) {
          title = inferred.title;
          description = inferred.description;
          dueDate = inferred.dueDate;
          visibility = inferred.visibility;
        }
      }

      if (!title || !dueDate) {
        return [
          'I can create that task, but I need either structured or clear due-date input.',
          'Try:',
          '• `Create task: title | description | YYYY-MM-DD | general|personal`',
          '• `Create a task with task name as Testing Payment functionality and deadline 10 days from today`'
        ].join('\n');
      }

      const createdRef = await db.collection('Projects').doc(projectId).collection('Tasks').add({
        title,
        description: description || `Task created by ${userName || 'user'} via assistant`,
        startDate: new Date(),
        endDate: dueDate,
        status: 'todo',
        visibility,
        members: [{ id: userId, name: userName }],
        created_by: userName
      });

      const taskUrl = `${window.location.origin}/task/${createdRef.id}`;
      return [
        `✅ Created: ${title}`,
        `• Visibility: ${visibility}`,
        `• Due: ${dueDate.toLocaleDateString()}`,
        `• Assigned to: ${userName || 'you'}`,
        `[Open task](${taskUrl})`
      ].join('\n');
    }

    if (lowerText.startsWith('move task')) {
      const match = text.match(/move task\s+(.+)\s+to\s+(.+)/i);
      if (!match) {
        return 'Use: `Move task <task-id or task-title> to todo|inprogress|complete`.';
      }

      const identifier = match[1].trim();
      const status = normaliseStatus(match[2]);
      const tasks = await getVisibleTasks();
      const selected = tasks.find(
        (task) => task.id === identifier || task.title.toLowerCase() === identifier.toLowerCase()
      );

      if (!selected) {
        return `I couldn't find task \`${identifier}\`. Run “show tasks” to copy an exact id.`;
      }

      await db.collection('Projects').doc(projectId).collection('Tasks').doc(selected.id).update({
        status
      });

      return `Updated \`${selected.title}\` to \`${status}\`.`;
    }

    if (
      lowerText.includes('summary') ||
      lowerText.includes('focus') ||
      lowerText.includes('plan my day')
    ) {
      const tasks = await getVisibleTasks();
      const counts = { todo: 0, inprogress: 0, complete: 0, overdue: 0, dueToday: 0 };
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      tasks.forEach((task) => {
        const status = STATUS_ORDER.includes(task.status) ? task.status : 'todo';
        counts[status] += 1;

        const dueDate = task.endDate?.toDate ? task.endDate.toDate() : task.endDate;
        if (!dueDate) return;

        const due = new Date(dueDate);
        due.setHours(0, 0, 0, 0);

        if (due.getTime() === today.getTime()) counts.dueToday += 1;
        if (due < today && status !== 'complete') counts.overdue += 1;
      });

      const priorityLine = counts.overdue
        ? `Priority: clear ${counts.overdue} overdue item(s) first.`
        : counts.inprogress
          ? `Priority: finish ${counts.inprogress} in-progress item(s).`
          : 'Priority: pick your highest-impact todo and start it now.';

      return [
        `Task summary for ${userName || 'you'}:`,
        `• Todo: ${counts.todo}`,
        `• In Progress: ${counts.inprogress}`,
        `• Completed: ${counts.complete}`,
        `• Due today: ${counts.dueToday}`,
        `• Overdue: ${counts.overdue}`,
        priorityLine
      ].join('\n');
    }

    if (lowerText.includes('show tasks') || lowerText.includes('list tasks') || lowerText === 'tasks') {
      const tasks = await getVisibleTasks();
      if (!tasks.length) {
        return 'No tasks available yet for your current scope.';
      }

      return [`I found ${tasks.length} visible task(s):`, ...tasks.slice(0, 10).map(formatTaskLine)].join('\n');
    }

    return [
      'I can execute task tools, but I did not understand that request.',
      'Try one of these:',
      '• Show tasks',
      '• Summarize tasks',
      '• Create a task with task name as Testing Payment functionality and deadline 10 days from today',
      '• Create task: title | description | YYYY-MM-DD | general|personal',
      '• Move task <task-id> to inprogress',
      `Loaded tools: ${toolSummary}`
    ].join('\n');
  };

  const callHostedAgentApi = async (message) => {
    if (!agentApiUrl) return null;

    const response = await fetch(`${agentApiUrl}/v1/agent/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        projectId,
        userId,
        userName,
        message,
        history: [
          ...messages.map((entry) => ({ role: 'user', text: entry.text })),
          ...responses.map((entry) => ({ role: 'assistant', text: entry.text }))
        ],
        availableTools: HOSTED_AGENT_TOOLS,
        agentMode
      })
    });

    if (!response.ok) {
      throw new Error('Hosted agent API request failed');
    }

    const payload = await response.json();
    return payload?.reply || 'The hosted agent did not return a response.';
  };

  const getAssistantReply = async (message) => {
    try {
      const hostedResponse = await callHostedAgentApi(message);
      if (hostedResponse) return hostedResponse;
    } catch (error) {
      return 'Hosted API failed, so I switched to local tools for this request.\n\n' + await runAgent(message);
    }

    return runAgent(message);
  };

  const handleSendMessage = async () => {
    if (isProcessing) {
      alert('Already processing one query. Please wait a moment.');
      return;
    }

    if (inputValue.trim() === '') return;

    const newMessages = [...messages, { text: inputValue }];
    setMessages(newMessages);
    setIsProcessing(true);

    try {
      const reply = await getAssistantReply(inputValue);
      setResponses([...responses, { text: reply }]);
    } catch (error) {
      setResponses([
        ...responses,
        { text: 'Something went wrong while running tools. Please try again.' }
      ]);
    } finally {
      setInputValue('');
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 h-full w-full">
      <div
        className="bg-white w-full max-w-md mx-auto rounded-lg shadow-lg"
        style={{
          height: '85%',
          width: '90%'
        }}
      >
        <div className="px-4 py-6 h-full">
          <div className="flex justify-between items-center w-full mb-4">
            <h2 className="text-2xl font-bold text-gray-900">Agentic Chat Bot</h2>
            <div
              onClick={() => {
                setchatgpt(false);
              }}
              className="text-md text-gray-900/50 cursor-pointer"
            >
              X
            </div>
          </div>

          <div className="text-xs text-gray-600 bg-gray-50 border border-gray-200 rounded-md p-2 mb-3">
            <div className="flex items-center justify-between mb-2">
              <p className="font-semibold">Tools loaded</p>
              <div className="flex items-center gap-2">
                <label className="text-[11px] font-semibold text-gray-500">Engine</label>
                <select
                  value={agentMode}
                  onChange={(e) => setAgentMode(e.target.value)}
                  className="border border-gray-300 rounded-md px-2 py-1 bg-white text-[11px] font-medium"
                >
                  <option value="adk">Gemini ADK</option>
                  <option value="langgraph">Gemini LangGraph</option>
                </select>
              </div>
            </div>
            <ul className="list-disc pl-4 space-y-1">
              {HOSTED_AGENT_TOOLS.map((toolName) => (
                <li key={toolName}>
                  <span className="font-medium">{toolName}</span>
                </li>
              ))}
            </ul>
            <p className="mt-2">
              Mode: {agentApiUrl ? `Hosted API (${agentMode}) + local fallback` : 'Local tools only'}
            </p>
          </div>

          <div className="overflow-y-auto border border-gray-300 rounded-lg p-4 mb-4" style={{ height: '66%' }}>
            <div key="assistant-welcome" className="text-left mb-2">
              <div className="inline-block px-4 py-2 bg-gray-200 rounded-lg">{linkifyText(responses[0].text)}</div>
            </div>
            {messages.map((message, index) => (
              <React.Fragment key={`message-${index}`}>
                <div className="text-right mb-2">
                  <p className="inline-block px-4 py-2 bg-purple-100 rounded-lg">{message.text}</p>
                </div>
                {responses[index + 1] && (
                  <div key={`response-${index}`} className="text-left mb-2">
                    <div className="inline-block px-4 py-2 bg-gray-200 rounded-lg whitespace-pre-wrap max-w-full">
                      {linkifyText(responses[index + 1].text)}
                    </div>
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>

          <div className="flex overflow-x-auto">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask me to list, summarize, create, or move tasks..."
              className="flex-grow px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 mr-2"
            />
            <button
              onClick={handleSendMessage}
              className="bg-indigo-500 text-white py-2 px-4 rounded-md hover:bg-indigo-600 disabled:opacity-60"
              disabled={isProcessing}
            >
              {isProcessing ? 'Running...' : 'Send'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatGPT;
