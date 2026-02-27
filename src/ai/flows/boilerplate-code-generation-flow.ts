'use server';
/**
 * @fileOverview A Genkit flow for generating Dockerized boilerplate code based on a system architecture description.
 *
 * - generateBoilerplateCode - A function that handles the boilerplate code generation process.
 * - BoilerplateCodeGenerationInput - The input type for the generateBoilerplateCode function.
 * - BoilerplateCodeGenerationOutput - The return type for the generateBoilerplateCode function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const BoilerplateCodeGenerationInputSchema = z.object({
  architectureDescription: z
    .string()
    .describe(
      'A detailed description of the system architecture. This should include a list of core services, their primary functionalities, desired programming languages or frameworks for each service, and any notable dependencies or interactions between them.'
    ),
});
export type BoilerplateCodeGenerationInput = z.infer<
  typeof BoilerplateCodeGenerationInputSchema
>;

const BoilerplateCodeGenerationOutputSchema = z.object({
  dockerizedBoilerplateCode: z
    .string()
    .describe(
      'The complete Dockerized boilerplate code for the described architecture. This includes placeholder code for each service, their respective Dockerfiles, and a docker-compose.yml file to orchestrate them. The output should be formatted clearly using markdown code blocks to separate different files.'
    ),
});
export type BoilerplateCodeGenerationOutput = z.infer<
  typeof BoilerplateCodeGenerationOutputSchema
>;

export async function generateBoilerplateCode(
  input: BoilerplateCodeGenerationInput
): Promise<BoilerplateCodeGenerationOutput> {
  return boilerplateCodeGenerationFlow(input);
}

const boilerplateCodeGenerationPrompt = ai.definePrompt({
  name: 'boilerplateCodeGenerationPrompt',
  input: {schema: BoilerplateCodeGenerationInputSchema},
  output: {schema: BoilerplateCodeGenerationOutputSchema},
  prompt: `You are an expert software architect and developer specializing in creating Dockerized boilerplate code for new system architectures. Your goal is to provide well-structured, clean, and ready-to-develop boilerplate code based on the user's requirements.

For the given architecture description, generate the following:
1.  **Boilerplate code for each core service**: Include basic file structures and placeholder code in the specified programming languages/frameworks.
2.  **Dockerfile for each service**: Define the necessary steps to build a Docker image for each service.
3.  **docker-compose.yml**: An orchestration file to easily run all services together, including any required database or messaging queues.

Ensure the output is directly usable and follows best practices for Dockerization and the specified technologies. Format the output using markdown code blocks for each file. Include the intended file path as a header or comment at the top of each block.

Architecture Description:
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
