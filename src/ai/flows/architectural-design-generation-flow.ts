'use server';
/**
 * @fileOverview An AI agent that generates a proposed system architecture based on natural language requirements.
 *
 * - architecturalDesignGeneration - A function that handles the architectural design generation process.
 * - ArchitecturalDesignGenerationInput - The input type for the architecturalDesignGeneration function.
 * - ArchitecturalDesignGenerationOutput - The return type for the architecturalDesignGeneration function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const ArchitecturalDesignGenerationInputSchema = z.object({
  requirements: z.string().describe('Natural language system requirements and design constraints.'),
});
export type ArchitecturalDesignGenerationInput = z.infer<typeof ArchitecturalDesignGenerationInputSchema>;

const ArchitecturalDesignGenerationOutputSchema = z.object({
  diagramDescription: z.string().describe('A detailed description of the proposed system architecture, suitable for generating a diagram.'),
  components: z.array(
    z.object({
      name: z.string().describe('The name of the architectural component.'),
      type: z.string().describe('The type of component (e.g., Frontend, Backend Service, Database, Message Queue).'),
      purpose: z.string().describe('The purpose and function of this component.'),
      technology: z.string().describe('Suggested technology or framework for this component (e.g., Next.js, Node.js, PostgreSQL, Kafka).'),
    })
  ).describe('A list of selected architectural components with their details.'),
  rationale: z.string().describe('An explanation of the design choices and why this architecture was proposed.'),
});
export type ArchitecturalDesignGenerationOutput = z.infer<typeof ArchitecturalDesignGenerationOutputSchema>;

export async function architecturalDesignGeneration(input: ArchitecturalDesignGenerationInput): Promise<ArchitecturalDesignGenerationOutput> {
  return architecturalDesignGenerationFlow(input);
}

const architecturalDesignGenerationPrompt = ai.definePrompt({
  name: 'architecturalDesignGenerationPrompt',
  input: { schema: ArchitecturalDesignGenerationInputSchema },
  output: { schema: ArchitecturalDesignGenerationOutputSchema },
  prompt: `You are an expert system architect and a Generative AI agent called ArchiText. Your task is to analyze user requirements and propose a production-ready system architecture.

Based on the following system requirements, provide a detailed description of the architecture, a list of core components with their type, purpose, and suggested technology, and a clear rationale for your design choices.

System Requirements:
{{{requirements}}}

Ensure the output is in the specified JSON format, strictly adhering to the schema. Think step-by-step to cover all aspects of a production-ready system.`,
});

const architecturalDesignGenerationFlow = ai.defineFlow(
  {
    name: 'architecturalDesignGenerationFlow',
    inputSchema: ArchitecturalDesignGenerationInputSchema,
    outputSchema: ArchitecturalDesignGenerationOutputSchema,
  },
  async (input) => {
    const { output } = await architecturalDesignGenerationPrompt(input);
    return output!;
  }
);
