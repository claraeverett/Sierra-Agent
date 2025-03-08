import { orderStatusTool } from './orderStatus';
import { earlyRisersTool } from './earlyRisers';
import { generalTool } from './generalResponseHandler';

export const tools = {
  orderstatus: orderStatusTool,
  earlyrisers: earlyRisersTool,
  general: generalTool
};

export interface ToolResponse {
  success: boolean;
  details?: Record<string, any>;
  missingParams?: string[];
  promptTemplate: string;
}
