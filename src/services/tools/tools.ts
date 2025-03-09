import { orderStatusTool } from './orderStatus';
import { earlyRisersTool } from './earlyRisers';
import { hikingRecommendationTool } from './hikingRecommendation';
import { generalTool } from './generalResponseHandler';
import { searchFaqTool } from './searchFAQ';
import { humanHelpTool } from './humanHelp';

export const tools = {
  orderstatus: orderStatusTool,
  earlyrisers: earlyRisersTool,
  general: generalTool,
  hikingrecommendation: hikingRecommendationTool,
  searchfaq: searchFaqTool,
  humanhelp: humanHelpTool,
};

export interface ToolResponse {
  success: boolean;
  details?: Record<string, any>;
  missingParams?: string[];
  promptTemplate: string;
}
