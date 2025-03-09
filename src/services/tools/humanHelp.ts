import { Tool } from '../../types/types';
import { State } from '../../state/state';
import { ToolResponse } from './tools';
import { modelResponse } from '../ai/aiService';
import { HUMAN_HELP_PROMPT } from '../../prompts/systemPrompts';
import { apiService } from '../api/apiService';
import { generateCustomerId } from '../../utils/utils';

interface HumanHelpParams {
    customerRequest: string;
}


export const humanHelpTool: Tool = {
    name: 'humanHelp',
    description: 'Request human assistance for customer support',
    execute: async (params: HumanHelpParams, state: State): Promise<ToolResponse> => {  
        console.log('Executing humanHelpTool with params:', params);
        
        try {
            // Generate a customer ID if not already present in state
            if (!state.userId) {
                state.userId = generateCustomerId();
            }
            
            // Generate email content using the model
            const details = await modelResponse(
                state.getConversationHistory(), 
                HUMAN_HELP_PROMPT(params.customerRequest), 
                true,
                0.2,
                1000
            );
            
            // Extract the email body from the model response
            const emailBody = details.choices[0].message.content || '';
            console.log('Generated email body:', emailBody);
            
            // Send the email with the user ID from the state
            const emailResult = await apiService.sendEmail(emailBody, state.userId);
            
            if (emailResult) {
                console.log('Email sent successfully:', emailResult);
                return {
                    success: true,
                    promptTemplate: "I've notified our customer service team about your request. A human agent will contact you shortly to provide personalized assistance. Is there anything else I can help you with in the meantime?"
                };
            } else {
                console.error('Failed to send email');
                return {
                    success: false,
                    promptTemplate: "I'm trying to connect you with a human agent, but we're experiencing some technical difficulties. Please try again in a few moments or call our customer service line directly at 1-800-SIERRA-HELP."
                };
            }
        } catch (error) {
            console.error('Error in humanHelpTool:', error);
            return {
                success: false,
                promptTemplate: "I apologize, but I'm having trouble connecting you with a human agent right now. Please try again or contact us directly at support@sierraoutfitters.com."
            };
        }
    }
}
  