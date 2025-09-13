'use server';

/**
 * @fileOverview Summarizes support requests, identifies user needs, and suggests appropriate services.
 *
 * - summarizeSupportRequest - A function that handles the summarization process.
 * - SummarizeSupportRequestInput - The input type for the summarizeSupportRequest function.
 * - SummarizeSupportRequestOutput - The return type for the summarizeSupportRequest function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeSupportRequestInputSchema = z.object({
  requestText: z.string().describe('The text content of the support request.'),
});
export type SummarizeSupportRequestInput = z.infer<typeof SummarizeSupportRequestInputSchema>;

const SummarizeSupportRequestOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the support request.'),
  userNeed: z.string().describe('Identification of the user\u2019s need.'),
  suggestedService:
    z.string().describe('Recommendation of the most appropriate service for the user.'),
});
export type SummarizeSupportRequestOutput = z.infer<typeof SummarizeSupportRequestOutputSchema>;

export async function summarizeSupportRequest(
  input: SummarizeSupportRequestInput
): Promise<SummarizeSupportRequestOutput> {
  return summarizeSupportRequestFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeSupportRequestPrompt',
  input: {schema: SummarizeSupportRequestInputSchema},
  output: {schema: SummarizeSupportRequestOutputSchema},
  prompt: `You are an AI assistant tasked with summarizing support requests to help administrators quickly understand user needs and suggest appropriate services.

  Summarize the following support request, identify the user's need, and suggest the most appropriate service to address the request.

  Support Request:
  {{requestText}}

  Provide the summary, user need, and suggested service in a structured format.
`,
});

const summarizeSupportRequestFlow = ai.defineFlow(
  {
    name: 'summarizeSupportRequestFlow',
    inputSchema: SummarizeSupportRequestInputSchema,
    outputSchema: SummarizeSupportRequestOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
