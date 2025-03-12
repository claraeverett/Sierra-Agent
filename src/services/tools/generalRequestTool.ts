import { Tool } from '@/types/types';
import { ToolResponse } from '@/services/tools/toolExport';
import { State } from '@/core/state/state';
import { GENERAL_RESPONSE_PROMPT } from '@/prompts/system-prompts';

/**
 * General Request Tool
 * 
 * This module handles general inquiries that don't match specific intents.
 * It serves as a fallback mechanism to ensure users always receive a helpful response.
 * The tool has two main functions:
 * 1. Remind users about unresolved intents from previous interactions
 * 2. Provide guidance about available services when no specific intent is detected
 */
export const generalTool: Tool = {
  name: 'general',
  description: 'Handle general inquiries',
  execute: async (_params: any, state: State): Promise<ToolResponse> => {
    console.log("General Tool", _params, state);
    console.log(" ---------------------------------------------------------------")
    // Check for unresolved intents from previous interactions
    const unresolvedIntents = state.getUnresolvedIntents();
    
    if (unresolvedIntents.length > 0) {
      // Create a message about unresolved intents to maintain conversation continuity
      // This helps prevent user requests from being forgotten during the conversation
      const unresolvedMessage = GENERAL_RESPONSE_PROMPT.UNRESOLVED_INTENTS_PROMPT(unresolvedIntents);
      
      return {
        success: true,
        promptTemplate: unresolvedMessage
      };
    }
    
    // If no unresolved intents, suggest available services
    // This provides guidance to users who may not know what the system can do
    return {
      success: true,
      promptTemplate: GENERAL_RESPONSE_PROMPT.GENERAL_HANDLER
    };
  }
};