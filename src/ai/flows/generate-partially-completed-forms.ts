'use server';
/**
 * @fileOverview An AI agent that generates partially completed forms based on user inputs and integrates official instructions.
 *
 * - generatePartiallyCompletedForm - A function that generates partially completed forms.
 * - GeneratePartiallyCompletedFormInput - The input type for the generatePartiallyCompletedForm function.
 * - GeneratePartiallyCompletedFormOutput - The return type for the generatePartiallyCompletedForm function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GeneratePartiallyCompletedFormInputSchema = z.object({
  formName: z.string().describe('The name of the government form to be completed.'),
  userInput: z.string().describe('The user provided information to fill the form.'),
  officialInstructions: z.string().optional().describe('Official instructions for filling out the form.'),
});
export type GeneratePartiallyCompletedFormInput = z.infer<typeof GeneratePartiallyCompletedFormInputSchema>;

const GeneratePartiallyCompletedFormOutputSchema = z.object({
  completedFormSection: z.string().describe('A section of the government form, partially completed with the user input and incorporating official instructions.'),
});
export type GeneratePartiallyCompletedFormOutput = z.infer<typeof GeneratePartiallyCompletedFormOutputSchema>;

export async function generatePartiallyCompletedForm(input: GeneratePartiallyCompletedFormInput): Promise<GeneratePartiallyCompletedFormOutput> {
  return generatePartiallyCompletedFormFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generatePartiallyCompletedFormPrompt',
  input: {schema: GeneratePartiallyCompletedFormInputSchema},
  output: {schema: GeneratePartiallyCompletedFormOutputSchema},
  prompt: `You are an AI assistant specialized in helping users fill out government forms.

  Based on the user provided information and the official instructions, generate a partially completed section of the form.
  Form Name: {{{formName}}}
  User Input: {{{userInput}}}
  Official Instructions: {{{officialInstructions}}}

  Partially Completed Form Section:
  `,
});

const generatePartiallyCompletedFormFlow = ai.defineFlow(
  {
    name: 'generatePartiallyCompletedFormFlow',
    inputSchema: GeneratePartiallyCompletedFormInputSchema,
    outputSchema: GeneratePartiallyCompletedFormOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
