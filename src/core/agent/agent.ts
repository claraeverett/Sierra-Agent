import { IntentClassification, Tool } from '@/types/types';
import { tools, ToolResponse } from '@/services/tools/toolExport';
import { GENERAL_RESPONSE } from '@/prompts/system-prompts';
import { State } from '@/core/state/state';
import { generateResponse } from '@/services/ai/response-generator';

/**
 * Main Agent class that handles user requests and coordinates tools
 */
export class Agent {
  private tools: Record<string, Tool>;
  private state: State;
  
  /**
   * Creates a new Agent instance
   * @param state The application state to use
   */
  constructor(state: State) {
    this.tools = tools;
    this.state = state;
  }

  /**
   * Handles a user request by processing the intent classification
   * @param classification The classified intent from the user's message
   * @param userMessage The original user message
   * @returns A response to the user
   */
  async handleRequest(classification: IntentClassification, userMessage: string) {
    this.state.addConversationEntry('user', userMessage);
    console.log("classification", classification);
    
    // Handle single or multiple intents
    const toolResponse = classification.intents.length > 1 
      ? await this.handleMultiIntent(classification)
      : await this.handleSingleIntent(classification.intents[0], classification.params[classification.intents[0]] || {});

    // Return general response if no prompt template is available
    if (!toolResponse.promptTemplate) {
      return GENERAL_RESPONSE;
    }

    // Generate AI response based on the tool response
    const AIResponse = await generateResponse(
      this.state,
      toolResponse.promptTemplate,
      toolResponse.details || {}
    );

    console.log("Unresolved Intents", this.state.getUnresolvedIntents());
    
    return AIResponse || GENERAL_RESPONSE;
  }

  /**
   * Handles multiple intents by executing each tool and combining responses
   * @param classification The intent classification with multiple intents
   * @returns Combined tool response
   */
  private async handleMultiIntent(classification: IntentClassification): Promise<ToolResponse> {
    const responses = await Promise.all(
      classification.intents.map(intent => 
        this.handleSingleIntent(intent, classification.params[intent] || {})
      )
    );
    
    // Filter successful responses
    const successfulResponses = responses.filter(response => response.success);
    
    if (successfulResponses.length > 0) {
      // Combine all successful responses
      const combinedDetails = successfulResponses.reduce((acc, response) => {
        return { ...acc, ...(response.details || {}) };
      }, {});
      
      return {
        success: true,
        details: combinedDetails,
        promptTemplate: successfulResponses[0].promptTemplate
      };
    }
    
    return {
      success: false,
      promptTemplate: GENERAL_RESPONSE,
    };
  }

  /**
   * Handles a single intent by executing the appropriate tool
   * @param intent The intent to handle
   * @param params Parameters for the tool
   * @returns Tool response
   */
  private async handleSingleIntent(intent: string, params: any): Promise<ToolResponse> {
    const tool = this.tools[intent.toLowerCase()];
    return tool 
      ? await tool.execute(params, this.state)
      : await this.handleGeneralIntent();
  }

  /**
   * Handles general or unknown intents
   * @returns General tool response
   */
  private async handleGeneralIntent(): Promise<ToolResponse> {
    return await this.tools.general.execute({}, this.state);
  }
} 