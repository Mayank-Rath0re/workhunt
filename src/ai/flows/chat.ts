
'use server';
/**
 * @fileOverview A conversational AI chatbot flow for FlutterFlow AI Assistant.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

const ChatMessageSchema = z.object({
  role: z.enum(['user', 'model']),
  content: z.string(),
});

export const chat = ai.defineFlow(
  {
    name: 'chatFlow',
    inputSchema: z.object({
      history: z.array(ChatMessageSchema),
      message: z.string(),
    }),
    outputSchema: z.string(),
  },
  async ({history, message}) => {
    const systemPrompt = `You are FlutterFlow AI Assistant, a friendly and knowledgeable chatbot.
Your purpose is to assist users with their questions about design, development, and using the FlutterFlow platform.
You can also answer general questions.
Be helpful, concise, and maintain a positive tone.`;

    const model = ai.getModel();
    const response = await model.generate({
      system: systemPrompt,
      messages: [...history, {role: 'user', content: message}],
      config: {
        temperature: 0.7,
      }
    });
    return response.text();
  }
);
