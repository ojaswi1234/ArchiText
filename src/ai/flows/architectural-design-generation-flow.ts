'use server';
/**
 * @fileOverview An AI agent that generates a proposed system architecture based on natural language requirements.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const ArchitecturalDesignGenerationInputSchema = z.object({
  requirements: z.string().describe('Natural language system requirements and design constraints.'),
});
export type ArchitecturalDesignGenerationInput = z.infer<typeof ArchitecturalDesignGenerationInputSchema>;

const ArchitecturalDesignGenerationOutputSchema = z.object({
  diagramDescription: z.string().describe('A valid Mermaid.js diagram definition (e.g., graph TD) representing the system architecture. Use standard Mermaid syntax.'),
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
  prompt: `You are an expert system architect called ArchiText. Analyze user requirements and propose a production-ready system architecture.

Provide:
1. A valid Mermaid.js diagram code (usually starting with graph TD).
2. A detailed list of components with their technologies.
3. A rationale for these choices.

Requirements:
{{{requirements}}}`,
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