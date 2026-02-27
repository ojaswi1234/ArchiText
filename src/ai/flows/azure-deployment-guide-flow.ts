'use server';
/**
 * @fileOverview An AI agent for generating Azure deployment instructions.
 *
 * - generateAzureDeploymentGuide - A function that handles generating the deployment steps.
 * - AzureDeploymentGuideInput - The input type for the function.
 * - AzureDeploymentGuideOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const AzureDeploymentGuideInputSchema = z.object({
  architectureDescription: z.string().describe('The description of the system architecture.'),
  components: z.array(z.object({
    name: z.string(),
    type: z.string(),
    technology: z.string(),
  })).describe('List of architectural components.'),
});
export type AzureDeploymentGuideInput = z.infer<typeof AzureDeploymentGuideInputSchema>;

const AzureDeploymentGuideOutputSchema = z.object({
  summary: z.string().describe('A high-level summary of the deployment strategy.'),
  steps: z.array(z.object({
    title: z.string().describe('The title of the deployment step.'),
    description: z.string().describe('A detailed explanation of the actions to take.'),
    command: z.string().optional().describe('An optional Azure CLI command to execute.'),
  })).describe('Step-by-step instructions for deploying to Azure.'),
});
export type AzureDeploymentGuideOutput = z.infer<typeof AzureDeploymentGuideOutputSchema>;

export async function generateAzureDeploymentGuide(input: AzureDeploymentGuideInput): Promise<AzureDeploymentGuideOutput> {
  return azureDeploymentGuideFlow(input);
}

const prompt = ai.definePrompt({
  name: 'azureDeploymentGuidePrompt',
  input: { schema: AzureDeploymentGuideInputSchema },
  output: { schema: AzureDeploymentGuideOutputSchema },
  prompt: `You are an expert Azure Cloud Architect. Your task is to provide a comprehensive, step-by-step guide for deploying a specific system architecture onto Microsoft Azure.

For the given architecture and components, provide a clear deployment path. 
Include steps for setting up Resource Groups, Identity, and the specific services identified.
Where possible, provide sample Azure CLI commands.

Architecture:
{{{architectureDescription}}}

Components:
{{#each components}}
- {{{name}}} ({{{type}}}) using {{{technology}}}
{{/each}}`,
});

const azureDeploymentGuideFlow = ai.defineFlow(
  {
    name: 'azureDeploymentGuideFlow',
    inputSchema: AzureDeploymentGuideInputSchema,
    outputSchema: AzureDeploymentGuideOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
