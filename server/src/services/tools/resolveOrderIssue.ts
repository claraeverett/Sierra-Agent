import { ToolResponse } from '@/services/tools/toolExport';
import { Tool, ResolveOrderIssueParams} from '@/types/types';
import { State } from '@/core/state/state';
import { RESOLVE_ORDER_ISSUE_PROMPT } from '@/prompts/resolve-order';

/**
 * Resolve Order Issue Tool
 * 
 * This tool handles the resolution of order issues for Sierra Outfitters.
 * It supports various resolution types including refunds, replacements, repairs, and other issues.
 */

export const resolveOrderIssueTool: Tool = {
  name: 'resolveOrderIssue',
  description: 'Handle order issue resolution',
  execute: async (params: ResolveOrderIssueParams, state: State): Promise<ToolResponse> => {
    console.log(state)
    
    const { orderId, email, resolution, confidenceScore, reason } = params;
    // If the user has not looked up an order ID, and the resolution is a refund, replacement, or repair, return an error and prompt the user to look up an order ID.
    if (!params.orderId && (params.resolution === "Refund" || params.resolution === "Replacement" || params.resolution === "Repair")) {
      return {
        success: false,
        details: {
          orderId: orderId,
          email: email,
          resolution: resolution,
          confidenceScore: confidenceScore,
          reason: reason
        },
        promptTemplate: RESOLVE_ORDER_ISSUE_PROMPT.NO_ORDER_ID_PROMPT(resolution)
      };
    }

    if (params.resolution == "other") {
      return {
        success: true,
        details: {
          orderId: orderId,
          email: email,
          resolution: resolution,
          confidenceScore: confidenceScore,
          reason: reason
        },
        promptTemplate: RESOLVE_ORDER_ISSUE_PROMPT.OTHER_PROMPT
      };
    }

    return {
      success: true,
      details: {
        orderId: orderId,
        email: email,
        resolution: resolution,
        confidenceScore: confidenceScore,
        reason: reason
      },
      promptTemplate: RESOLVE_ORDER_ISSUE_PROMPT.GENERAL_PROMPT(orderId, email, resolution, confidenceScore, reason)
    };
  }
}; 