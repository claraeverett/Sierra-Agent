import { IntentClassification, Tool } from '../types/types';
import { tools, ToolResponse } from './tools/tools';
import { GENERAL_RESPONSE } from '../prompts/systemPrompts';
import { State } from '../state/state';
import { generateResponse } from './ai/generateResponse';

export class Agent {
  private tools: Record<string, Tool>;
  private state: State;
  
  constructor(state: State) {
    this.tools = tools;
    this.state = state;
  }

  async handleRequest(classification: IntentClassification, userMessage: string) {
    this.state.addConversationEntry('user', userMessage);

    const toolResponse = classification.intents.length > 1 
      ? await this.handleMultiIntent(classification)
      : await this.handleSingleIntent(classification.intents[0], classification.params[classification.intents[0]] || {});

    if (!toolResponse.promptTemplate) {
      return GENERAL_RESPONSE;
    }


    const AIResponse = await generateResponse(
      this.state,
      toolResponse.promptTemplate,
      toolResponse.details || {}
    );
    
    return AIResponse || GENERAL_RESPONSE;
  }

  private async handleMultiIntent(classification: IntentClassification): Promise<ToolResponse> {
    const responses = await Promise.all(
      classification.intents.map(intent => 
        this.handleSingleIntent(intent, classification.params[intent] || {})
      )
    );

    return {
      success: responses.some(response => response.success),
      promptTemplate: responses.map(response => response.promptTemplate).join("\n\n"),
      details: responses.reduce((acc, response) => ({ ...acc, ...response.details }), {})
    };
  }

  private async handleSingleIntent(intent: string, params: any): Promise<ToolResponse> {
    const tool = this.tools[intent.toLowerCase()];
    return tool ? await tool.execute(params, this.state) : this.handleGeneralIntent();
  }

  private async handleGeneralIntent(): Promise<ToolResponse> {
    return {
      success: true,
      promptTemplate: GENERAL_RESPONSE,
      details: {}
    };
  }
} 