import { Tool } from '../../types/types';
import { ToolResponse } from './tools';
import { State } from '../../state/state';

export const generalTool: Tool = {
  name: 'general',
  description: 'Handle general inquiries',
  execute: async (_params: any, state: State): Promise<ToolResponse> => {
    // Check for unresolved intents
    const unresolvedIntents = state.getUnresolvedIntents();
    
    if (unresolvedIntents.length > 0) {
      // Create a message about unresolved intents
      const unresolvedMessage = `I notice we haven't fully addressed your previous ${unresolvedIntents.length > 1 ? 'requests' : 'request'} about ${unresolvedIntents.join(', ')}. Would you like to continue with ${unresolvedIntents.length > 1 ? 'those' : 'that'} first?`;
      
      return {
        success: true,
        promptTemplate: unresolvedMessage
      };
    }
    
    // If no unresolved intents, suggest available services
    const suggestionsMessage = `I'm not sure how to help with that specific request. Here are some things I can assist you with:

• Check the status of your order
• Get hiking trail recommendations
• Learn about our Early Risers promotion
• Search our FAQ for information
• Connect you with a human customer service agent

Could you please let me know which of these services you're interested in, or provide more details about your request?`;
    
    return {
      success: true,
      promptTemplate: suggestionsMessage
    };
  }
};