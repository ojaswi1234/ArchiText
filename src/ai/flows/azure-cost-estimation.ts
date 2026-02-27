'use server';
/**
 * @fileOverview An AI agent for estimating Azure cloud costs.
 *
 * - estimateAzureCost - A function that handles the Azure cost estimation process.
 * - AzureCostEstimationInput - The input type for the estimateAzureCost function.
 * - AzureCostEstimationOutput - The return type for the estimateAzureCost function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AzureComponentSchema = z.object({
  name: z.string().describe('The name of the architectural component (e.g., "Web App", "Database").'),
  serviceType: z.string().describe('The Azure service type (e.g., "Azure App Service", "Azure SQL Database", "Azure Functions", "Azure Storage Account", "Azure Kubernetes Service").'),
  region: z.string().describe('The Azure region where the component is deployed (e.g., "East US 2", "West Europe").'),
  specifications: z.record(z.any()).describe('A JSON object containing detailed specifications and projected usage for the component. Examples: { "sku": "P1v2", "instanceCount": 2, "estimatedRequestsPerMonth": 100000 }, { "tier": "General Purpose", "vCores": 4, "storageGB": 500, "backupRetentionDays": 7 }, { "type": "Blob", "tier": "Hot", "storageGB": 1000, "dataTransferGB": 50 }.').optional()
});

const AzureCostEstimationInputSchema = z.object({
  architectureDescription: z.string().describe('A high-level description of the system architecture.'),
  components: z.array(AzureComponentSchema).describe('An array of architectural components with their service types, regions, and detailed specifications/usage.')
});
export type AzureCostEstimationInput = z.infer<typeof AzureCostEstimationInputSchema>;

const AzureCostEstimationOutputSchema = z.object({
  totalMonthlyCostUSD: z.number().describe('The estimated total monthly cost in USD for the entire architecture.'),
  costBreakdown: z.array(z.object({
    componentName: z.string().describe('The name of the architectural component.'),
    serviceType: z.string().describe('The Azure service type of the component.'),
    estimatedMonthlyCostUSD: z.number().describe('The estimated monthly cost in USD for this specific component.'),
    details: z.string().describe('A detailed explanation of how the cost was estimated for this component, including key factors and assumptions.')
  })).describe('A detailed breakdown of the estimated monthly cost for each architectural component.'),
  assumptions: z.string().describe('Any general assumptions made during the cost estimation process (e.g., no premium support included, standard egress rates).')
});
export type AzureCostEstimationOutput = z.infer<typeof AzureCostEstimationOutputSchema>;

export async function estimateAzureCost(input: AzureCostEstimationInput): Promise<AzureCostEstimationOutput> {
  return azureCostEstimationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'azureCostEstimationPrompt',
  input: {schema: AzureCostEstimationInputSchema},
  output: {schema: AzureCostEstimationOutputSchema},
  prompt: `You are an expert in Azure cloud architecture and cost estimation.\nYour task is to estimate the monthly Azure cloud costs for a given system architecture based on its components and projected resource usage.\n\nProvide a detailed breakdown of the costs for each component and a total estimated monthly cost in USD.\nAssume standard Azure pricing for the specified regions. Acknowledge that these are estimates and actual costs may vary.\nIf a specification is missing or unclear, make a reasonable default assumption and state it in the 'details' field for that component.\n\nArchitecture Description:\n{{{architectureDescription}}}\n\nArchitectural Components:\n{{#each components}}\n- Name: {{{name}}}\n  Service Type: {{{serviceType}}}\n  Region: {{{region}}}\n  Specifications: {{{json specifications}}}\n{{/each}}`
});

const azureCostEstimationFlow = ai.defineFlow(
  {
    name: 'azureCostEstimationFlow',
    inputSchema: AzureCostEstimationInputSchema,
    outputSchema: AzureCostEstimationOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
