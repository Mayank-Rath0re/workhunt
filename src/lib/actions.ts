
'use server';

import { chat } from '@/ai/flows/chat';
import { summarizeDesignDecisions } from '@/ai/flows/summarize-design-decisions';
import type { Message } from '@/lib/types';

export async function getAiResponse(history: Message[], newMessage: string) {
  const modelHistory = history.map((msg) => ({
    role: msg.role === 'user' ? ('user' as const) : ('model' as const),
    content: msg.content,
  }));

  try {
    const response = await chat({
      history: modelHistory,
      message: newMessage,
    });
    return { success: true, response };
  } catch (error) {
    console.error('Error getting AI response:', error);
    return { success: false, error: 'Failed to get AI response from the server.' };
  }
}

export async function getSummary(chatHistory: Message[]) {
  const historyString = chatHistory
    .map((msg) => `${msg.role}: ${msg.content}`)
    .join('\n');

  try {
    const result = await summarizeDesignDecisions({ chatHistory: historyString });
    return { success: true, summary: result.summary };
  } catch (error) {
    console.error('Error getting summary:', error);
    return { success: false, error: 'Failed to generate a summary.' };
  }
}
