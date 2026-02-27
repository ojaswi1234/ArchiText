'use server';
/**
 * @fileOverview A Genkit flow for generating Dockerized boilerplate code.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const BoilerplateCodeGenerationInputSchema = z.object({
  architectureDescription: z
    .string()
    .describe('A detailed description of the system architecture.'),
});
export type BoilerplateCodeGenerationInput = z.infer<typeof BoilerplateCodeGenerationInputSchema>;

const BoilerplateCodeGenerationOutputSchema = z.object({
  dockerizedBoilerplateCode: z
    .string()
    .describe('The complete Dockerized boilerplate code formatted as a single markdown string with multiple code blocks for files.'),
});
export type BoilerplateCodeGenerationOutput = z.infer<typeof BoilerplateCodeGenerationOutputSchema>;

export async function generateBoilerplateCode(input: BoilerplateCodeGenerationInput): Promise<BoilerplateCodeGenerationOutput> {
  return boilerplateCodeGenerationFlow(input);
}

const boilerplateCodeGenerationPrompt = ai.definePrompt({
  name: 'boilerplateCodeGenerationPrompt',
  input: {schema: BoilerplateCodeGenerationInputSchema},
  output: {schema: BoilerplateCodeGenerationOutputSchema},
  prompt: `You are an expert developer. Generate Dockerized boilerplate code for the following architecture.

Include:
1. Core service files.
2. Dockerfiles for each service.
3. A docker-compose.yml file.

Format the output clearly using markdown code blocks. For each block, specify the file path as a header or comment.

Architecture:
{{{architectureDescription}}}`,
});

const boilerplateCodeGenerationFlow = ai.defineFlow(
  {
    name: 'boilerplateCodeGenerationFlow',
    inputSchema: BoilerplateCodeGenerationInputSchema,
    outputSchema: BoilerplateCodeGenerationOutputSchema,
  },
  async input => {
    const {output} = await boilerplateCodeGenerationPrompt(input);
    return output!;
  }
);