import { orderStatusTool } from './orderStatus';
import { earlyRisersTool } from './earlyRisers';
import { hikingRecommendationTool } from './hikingRecommendation';
import { generalTool } from './generalResponseHandler';

export const tools = {
  orderstatus: orderStatusTool,
  earlyrisers: earlyRisersTool,
  general: generalTool,
  hikingrecommendation: hikingRecommendationTool
};

export interface ToolResponse {
  success: boolean;
  details?: Record<string, any>;
  missingParams?: string[];
  promptTemplate: string;
}
