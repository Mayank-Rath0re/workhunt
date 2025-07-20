
'use server';

import { chat } from '@/ai/chat_flow'; // Updated import path
import type { Message } from '@/lib/types';

export async function getAiResponse(history: Message[], newMessage: string) { // Removed geminiKey parameter
  
  try {
    const response = await chat(newMessage); // Pass only the new message
    return { success: true, response };
  } catch (error) {
    console.error('Error getting AI response:', error);
    return { success: false, error: 'Failed to get AI response from the server.' };
  }
}

// Removed getSummary function as it was related to the old flow
