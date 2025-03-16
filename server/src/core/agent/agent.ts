import { IntentClassification, Tool } from '@/types/types';
import { tools, ToolResponse } from '@/services/tools/toolExport';
import { GENERAL_RESPONSE } from '@/prompts/system-prompts';
import { State } from '@/core/state/state';
import { generateResponse } from '@/services/ai/response-generator';

/**
 * Agent System
 * 
 * The Agent is the central coordinator of the Sierra Outfitters Assistant.
 * It processes user requests, manages tools for different intents,
 * and generates appropriate responses based on the conversation context.
 */

/**
 * Main Agent class that handles user requests and coordinates tools
 */
export class Agent {
  private tools: Record<string, Tool>;  // Available tools indexed by intent name
  private state: State;                 // Current conversation state
  
  /**
   * Creates a new Agent instance
   * @param state The application state to use for this conversation
   */
  constructor(state: State) {
    this.tools = tools;
    this.state = state;
  }

  /**
   * Handles a user request by processing the intent classification
   * 
   * This is the main entry point for processing user messages:
   * 1. Adds the user message to conversation history
   * 2. Processes the classified intents
   * 3. Generates an appropriate response
   * 
   * @param classification The classified intent from the user's message
   * @param userMessage The original user message
   * @returns A response to the user
   */
  async handleRequest(classification: IntentClassification, userMessage: string) {
    // Add user message to conversation history
    this.state.addConversationEntry('user', userMessage);
    
    // Handle single or multiple intents based on classification
    const toolResponse = classification.intents.length > 1 
      ? await this.handleMultiIntent(classification)
      : await this.handleSingleIntent(classification.intents[0], classification.params[classification.intents[0]] || {});
        
    // If no prompt template is available, return a general response
    if (!toolResponse.promptTemplate) {
      return GENERAL_RESPONSE;
    }

    // Generate AI response based on the tool response and conversation context
    const AIResponse = await generateResponse(
      this.state,
      toolResponse.promptTemplate,
      toolResponse.details || {}
    );

    // Return the generated response or fall back to a general response
    return AIResponse || GENERAL_RESPONSE;
  }

  /**
   * Handles multiple intents by executing each tool and combining responses
   * 
   * When a user message contains multiple intents (e.g., asking about both
   * hiking trails and weather), this method processes each intent separately
   * and combines the results.
   * 
   * @param classification The intent classification with multiple intents
   * @returns Combined tool response with details from all successful tools
   */
  private async handleMultiIntent(classification: IntentClassification): Promise<ToolResponse> {
    // Execute each intent's tool in parallel
    const responses = await Promise.all(
      classification.intents.map(intent => 
        this.handleSingleIntent(intent, classification.params[intent] || {})
      )
    );

    
    // Filter to only include successful responses
    const successfulResponses = responses.filter(response => response.success);
    
    if (successfulResponses.length > 0) {
      // Combine all successful responses' details
      const combinedDetails = successfulResponses.reduce((acc, response) => {
        return { ...acc, ...(response.details || {}) };
      }, {});
      
      // Return combined response with all prompt templates joined
      return {
        success: true,
        details: combinedDetails,
        promptTemplate: successfulResponses.map(response => response.promptTemplate).join("\n")
      };
    }
    
    // If no successful responses, return a failure with general response
    return {
      success: false,
      promptTemplate: GENERAL_RESPONSE,
    };
  }

  /**
   * Handles a single intent by executing the appropriate tool
   * 
   * @param intent The intent to handle (e.g., "HikingRecommendation")
   * @param params Parameters extracted for the tool (e.g., location, difficulty)
   * @returns Tool response with success status and response details
   */
  private async handleSingleIntent(intent: string, params: any): Promise<ToolResponse> {
    // Look up the appropriate tool for this intent
    const tool = this.tools[intent.toLowerCase()];
    
    // Execute the tool if found, otherwise fall back to general intent
    return tool 
      ? await tool.execute(params, this.state)
      : await this.handleGeneralIntent();
  }

  /**
   * Handles general or unknown intents
   * 
   * This is a fallback for when no specific intent is detected
   * or when the detected intent doesn't have a matching tool.
   * 
   * @returns General tool response
   */
  private async handleGeneralIntent(): Promise<ToolResponse> {
    return await this.tools.general.execute({}, this.state);
  }
} 