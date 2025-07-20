'use server';
/**
 * @fileOverview Summarizes previous design decisions made in the conversation.
 *
 * - summarizeDesignDecisions - A function that summarizes design decisions.
 * - SummarizeDesignDecisionsInput - The input type for the summarizeDesignDecisions function.
 * - SummarizeDesignDecisionsOutput - The return type for the summarizeDesignDecisions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeDesignDecisionsInputSchema = z.object({
  chatHistory: z
    .string()
    .describe('The complete chat history of the conversation.'),
});
export type SummarizeDesignDecisionsInput = z.infer<
  typeof SummarizeDesignDecisionsInputSchema
>;

const SummarizeDesignDecisionsOutputSchema = z.object({
  summary: z
    .string()
    .describe(
      'A summary of the design decisions made in the conversation so far.'
    ),
});
export type SummarizeDesignDecisionsOutput = z.infer<
  typeof SummarizeDesignDecisionsOutputSchema
>;

export async function summarizeDesignDecisions(
  input: SummarizeDesignDecisionsInput
): Promise<SummarizeDesignDecisionsOutput> {
  return summarizeDesignDecisionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeDesignDecisionsPrompt',
  input: {schema: SummarizeDesignDecisionsInputSchema},
  output: {schema: SummarizeDesignDecisionsOutputSchema},
  prompt: `You are an AI assistant helping a designer make decisions.

  Summarize the design decisions that have been made so far in the conversation history below. Be as concise as possible.

  Chat History:
  {{chatHistory}}`,
});

const summarizeDesignDecisionsFlow = ai.defineFlow(
  {
    name: 'summarizeDesignDecisionsFlow',
    inputSchema: SummarizeDesignDecisionsInputSchema,
    outputSchema: SummarizeDesignDecisionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
