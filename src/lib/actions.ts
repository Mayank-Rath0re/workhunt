// src/lib/actions.ts
'use server';

import { chat } from '@/ai/chat_flow';
import type { Message } from '@/lib/types';

// Accept geminiKey as a parameter
export async function getAiResponse(history: Message[], newMessage: string, geminiKey: string) {
  console.log('Calling getAiResponse with message:', newMessage);
  console.log('Using Gemini Key:', geminiKey ? '******' + geminiKey.slice(-4) : 'Not set');
  try {
    console.log('Calling chat function...');
    // Pass the geminiKey to the chat function
    const response = await chat(newMessage, geminiKey);
    console.log('Response from chat function in actions: ', response); // Added logging here
    return { success: true, response };
  } catch (error) {
    console.error('Error getting AI response:', error);
    let errorMessage = 'An unknown error occurred.';
    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === 'string') {
      errorMessage = error;
    }
    return { success: false, error: `Failed to get AI response from the server: ${errorMessage}` };
  }
}

// Removed getSummary function as it was related to the old flow
