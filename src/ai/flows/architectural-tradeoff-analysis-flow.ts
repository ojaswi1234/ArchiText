'use server';
/**
 * @fileOverview An AI agent that provides a comprehensive trade-off analysis for key architectural choices.
 *
 * - architecturalTradeoffAnalysis - A function that handles the architectural trade-off analysis process.
 * - ArchitecturalTradeoffAnalysisInput - The input type for the architecturalTradeoffAnalysis function.
 * - ArchitecturalTradeoffAnalysisOutput - The return type for the architecturalTradeoffAnalysis function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ArchitecturalTradeoffAnalysisInputSchema = z.object({
  architectureDescription: z
    .string()
    .describe('A detailed description of the proposed system architecture.'),
  architecturalChoices: z
    .array(z.string())
    .describe('A list of key architectural choices within the proposed architecture to analyze.'),
});
export type ArchitecturalTradeoffAnalysisInput = z.infer<
  typeof ArchitecturalTradeoffAnalysisInputSchema
>;

const ArchitecturalTradeoffAnalysisOutputSchema = z.object({
  analysisResults: z
    .array(
      z.object({
        choice: z.string().describe('The architectural choice being analyzed.'),
        benefits: z.array(z.string()).describe('A list of benefits for this architectural choice.'),
        drawbacks: z
          .array(z.string())
          .describe('A list of drawbacks or disadvantages for this architectural choice.'),
      })
    )
    .describe('A comprehensive list of trade-off analyses for each architectural choice.'),
});
export type ArchitecturalTradeoffAnalysisOutput = z.infer<
  typeof ArchitecturalTradeoffAnalysisOutputSchema
>;

export async function architecturalTradeoffAnalysis(
  input: ArchitecturalTradeoffAnalysisInput
): Promise<ArchitecturalTradeoffAnalysisOutput> {
  return architecturalTradeoffAnalysisFlow(input);
}

const prompt = ai.definePrompt({
  name: 'architecturalTradeoffAnalysisPrompt',
  input: {schema: ArchitecturalTradeoffAnalysisInputSchema},
  output: {schema: ArchitecturalTradeoffAnalysisOutputSchema},
  prompt: `You are an expert system architect and analyst. Your task is to provide a comprehensive trade-off analysis for specific architectural choices within a given system architecture.

For each architectural choice provided, detail its benefits and drawbacks. Present the information clearly and concisely.

Proposed System Architecture Description:
{{{architectureDescription}}}

Architectural Choices to Analyze:
{{#each architecturalChoices}}
- {{{this}}}
{{/each}}
`,
});

const architecturalTradeoffAnalysisFlow = ai.defineFlow(
  {
    name: 'architecturalTradeoffAnalysisFlow',
    inputSchema: ArchitecturalTradeoffAnalysisInputSchema,
    outputSchema: ArchitecturalTradeoffAnalysisOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
