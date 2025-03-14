import { orderStatusTool } from '@/services/tools/orderStatusTool';
import { earlyRisersTool } from '@/services/tools/earlyRiserTool';
import { hikingRecommendationTool } from '@/services/tools/hikingRecommendationTool';
import { generalTool } from '@/services/tools/generalRequestTool';
import { searchFaqTool } from '@/services/tools/searchFAQTool';
import { humanHelpTool } from '@/services/tools/humanHandoffTool';
import { productInventoryTool } from '@/services/tools/productInventory';
import { productRecommendationTool } from '@/services/tools/productRecommendation';
import { resolveOrderIssueTool } from '@/services/tools/resolveOrderIssue';
/**
 * Export all tools
 */
export const tools = {
  orderstatus: orderStatusTool,
  resolveorderissue: resolveOrderIssueTool,
  earlyrisers: earlyRisersTool,
  general: generalTool,
  hikingrecommendation: hikingRecommendationTool,
  searchfaq: searchFaqTool,
  humanhelp: humanHelpTool,
  productinventory: productInventoryTool,
  productrecommendation: productRecommendationTool,
};

/**
 * Tool Response Interface
 * Represents the response from a tool execution
 */
export interface ToolResponse {
  success: boolean;
  details?: Record<string, any>;
  missingParams?: string[];
  promptTemplate: string;
}
