import { Tool } from '../../types/types';
import { ToolResponse } from './tools';
import { State } from '../../state/state';
import { GENERAL_RESPONSE } from '../../prompts/responses';

export const generalTool: Tool = {
  name: 'general',
  description: 'Handle general inquiries',
  execute: async (_params: any, _state: State): Promise<ToolResponse> => {
    return {
      success: false,
      promptTemplate: GENERAL_RESPONSE
    };
  }
};