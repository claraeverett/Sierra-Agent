import { orderStatusTool } from '@/services/tools/orderStatusTool';
import { earlyRisersTool } from '@/services/tools/earlyRiserTool';
import { hikingRecommendationTool } from '@/services/tools/hikingRecommendationTool';
import { generalTool } from '@/services/tools/generalRequestTool';
import { searchFaqTool } from '@/services/tools/searchFAQTool';
import { humanHelpTool } from '@/services/tools/humanHandoffTool';

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
