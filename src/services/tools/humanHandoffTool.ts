import { Tool, HumanHelpParams } from '@/types/types';
import { State } from '@/core/state/state';
import { ToolResponse } from '@/services/tools/toolExport';
import { HUMAN_HELP_PROMPT } from '@/prompts/system-prompts';
import { HUMAN_HELP_RESPONSE } from '@/prompts/human-handoff-prompts';
import { apiService } from '@/services/api/external-api-service';
import { generateCustomerId } from '@/utils/utils';
import { openai } from '@/services/api/clients';
import { AI_CONSTANTS } from '@/services/ai/index';

/**
 * Tool for requesting human assistance for customer support
 * Generates an email to the support team with details about the customer's request
 */
export const humanHelpTool: Tool = {
    name: 'humanHelp',
    description: 'Request human assistance for customer support',
    execute: async (params: HumanHelpParams, state: State): Promise<ToolResponse> => {  
        state.addUnresolvedIntents("HumanHelp");
        
        console.log('Executing humanHelpTool with params:', params);
        
        try {
            // Generate a customer ID if not already present in state
            if (!state.userId) {
                state.userId = generateCustomerId();
            }
            
            // Get conversation history
            const conversationHistory = state.getConversationHistory();
            
            // Create a custom prompt with explicit instructions
            const systemPrompt = HUMAN_HELP_PROMPT(params.customerRequest);
            
            // Call OpenAI directly with a specific message structure for better control
            const response = await openai.chat.completions.create({
                model: AI_CONSTANTS.DEFAULT_MODEL,
                messages: [
                    { role: "system", content: systemPrompt },  // Use system role for better instruction following
                    ...conversationHistory  // Include conversation history
                ],
                temperature: 0.1,  // Very low temperature for deterministic output
                max_tokens: 800   // Increased token limit to ensure complete email
            });
            
            // Extract the email body from the model response
            const emailBody = response.choices[0].message.content || '';
            console.log('Generated email body:', emailBody);
            
            // Send the email with the user ID from the state
            const emailResult = await apiService.sendEmail(emailBody, state.userId);
            
            if (emailResult) {
                console.log('Email sent successfully:', emailResult);
                state.resolveIntent("HumanHelp");
                return {
                    success: true,
                    promptTemplate: HUMAN_HELP_RESPONSE.EMAIL_SENT
                };
            } else {
                console.error('Failed to send email');
                return {
                    success: false,
                    promptTemplate: HUMAN_HELP_RESPONSE.EMAIL_FAILED
                };
            }
        } catch (error) {
            console.error('Error in humanHelpTool:', error);
            return {
                success: false,
                promptTemplate: HUMAN_HELP_RESPONSE.ERROR
            };
        }
    }
};
  