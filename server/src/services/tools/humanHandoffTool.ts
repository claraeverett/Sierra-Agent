import { Tool, HumanHelpParams } from '@/types/types';
import { State } from '@/core/state/state';
import { ToolResponse } from '@/services/tools/toolExport';
import { HUMAN_HELP_PROMPT } from '@/prompts/system-prompts';
import { HUMAN_HELP_RESPONSE } from '@/prompts/human-handoff-prompts';
import { apiService } from '@/services/api/external-api-service';
import { generateCustomerId } from '@/utils/utils';
import { AI_CONSTANTS } from '@/services/ai/index';
import { Intent } from '@/types/types';
import { modelResponse } from '@/services/ai/openai-service';

/**
 * Human Handoff Tool
 * 
 * This module handles requests for human assistance by generating and sending
 * a detailed email to the customer support team. The email summarizes the
 * customer's issue, conversation history, and provides context to help the
 * support team address the customer's needs efficiently.
 * 
 * The tool follows these steps:
 * 1. Generate a structured email using the conversation history
 * 2. Send the email to the support team via the email service
 * 3. Provide confirmation to the customer that help is on the way
 */
export const humanHelpTool: Tool = {
    name: 'humanHelp',
    description: 'Request human assistance for customer support',
    execute: async (params: HumanHelpParams, state: State): Promise<ToolResponse> => {  
        // Track this intent as unresolved until we successfully send the email
        state.addUnresolvedIntents(Intent.HumanHelp);
                
        try {
            // Generate a customer ID if not already present in state
            // This ensures each customer has a unique identifier for tracking
            if (!state.userId) {
                state.userId = generateCustomerId();
            }
            
            // Get conversation history to provide context in the email
            const conversationHistory = state.getConversationHistory();
            
            // Create a custom prompt with explicit instructions for generating the email
            // The prompt is designed to create an internal email for the support team
            const systemPrompt = HUMAN_HELP_PROMPT(params.customerRequest);

            // Generate the email content using the AI model
            // Using low temperature for more deterministic output and higher token limit for detailed emails
            const response = await modelResponse(
                conversationHistory, 
                systemPrompt, 
                true,
                AI_CONSTANTS.SEND_EMAIL_TEMPERATURE, 
                AI_CONSTANTS.SEND_EMAIL_MAX_TOKENS
            );
            
            // Extract the email body from the model response
            const emailBody = response.choices[0].message.content || '';
            
            // Send the email to the support team with the customer ID for tracking
            const emailResult = await apiService.sendEmail(emailBody, state.userId);
            
            if (emailResult) {
                // Email sent successfully - inform the customer and resolve the intent
                state.resolveIntent(Intent.HumanHelp);
                return {
                    success: true,
                    promptTemplate: HUMAN_HELP_RESPONSE.EMAIL_SENT
                };
            } else {
                // Email failed to send - inform the customer of the failure
                console.error('Failed to send email');
                return {
                    success: false,
                    promptTemplate: HUMAN_HELP_RESPONSE.EMAIL_FAILED
                };
            }
        } catch (error) {
            // Handle any errors that occur during the process
            console.error('Error in humanHelpTool:', error);
            return {
                success: false,
                promptTemplate: HUMAN_HELP_RESPONSE.ERROR
            };
        }
    }
};
  