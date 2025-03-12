import { ToolResponse } from '@/services/tools/toolExport';
import { Tool, EarlyRisersParams} from '@/types/types';
import { State } from '@/core/state/state';
import { EARLY_RISERS } from '@/config/constants';
import { EARLY_RISERS_RESPONSE } from '@/prompts/early-riser-prompts';
import { getTime, getPromoCode, timeIsToday } from '@/utils/utils';

/**
 * Early Risers Promotion Tool
 * 
 * This module handles the "Early Risers" time-based promotion that offers
 * discounts to customers who shop during specific morning hours (typically 8-10 AM).
 * The tool generates unique promo codes, validates time restrictions, and
 * provides appropriate responses based on the current time.
 */
export const earlyRisersTool: Tool = {
  name: 'earlyRisers',
  description: 'Handle Early Risers promotion',
  execute: async (params: EarlyRisersParams, state: State): Promise<ToolResponse> => {
    // Get the current time to check if we're in the valid promotion window
    console.log("Early Risers Tool", params, state);
    console.log(" ---------------------------------------------------------------")
    
    const timeNow = getTime();
    const hour = new Date(timeNow).getHours();

    // Check if current time is within the promotion window (e.g., 8-10 AM)
    if (hour >= EARLY_RISERS.START_TIME && hour < EARLY_RISERS.END_TIME) {
      // If the user already has a promo code in their state
      if (state.promoCode) {
        // Check if the existing code was generated today
        const isFromToday = timeIsToday(state.promoCode.createdAt, EARLY_RISERS.TIMEZONE, timeNow);
                
        if (isFromToday) {
          // Return the existing code if it's still valid (from today)
          return {
            success: true,
            details: { 
              code: state.promoCode.code, 
              discount: EARLY_RISERS.PROMO_CODE,
              isExisting: true
            },
            promptTemplate: EARLY_RISERS_RESPONSE.VALID_TIME_EXISTING_CODE(
              state.promoCode.code, 
              EARLY_RISERS.PROMO_CODE, 
              EARLY_RISERS.END_TIME
            )
          };
        }
        // Clear expired promo code
        state.clearPromoCode();
      }

      // Generate a new promo code
      const code = getPromoCode();
      
      // Store the new promo code in the state
      state.updatePromoCode({
        code,
        createdAt: timeNow,
        productName: params.productName
      });

      // Return the new promo code
      return {
        success: true,
        details: { 
          code, 
          discount: EARLY_RISERS.PROMO_CODE,
          productName: params.productName,
          isNew: true
        },
        promptTemplate: EARLY_RISERS_RESPONSE.VALID_TIME_NEW_CODE(code, EARLY_RISERS.PROMO_CODE)
      };
    }

    // If outside promotion hours, calculate the next available time
    const nextValidTime = getTime();
    if (hour >= EARLY_RISERS.END_TIME || hour < EARLY_RISERS.START_TIME) {
      // Set to the start time of the promotion
      nextValidTime.setHours(EARLY_RISERS.START_TIME, 0, 0, 0);
      // If it's after the end time, set to tomorrow
      if (hour >= EARLY_RISERS.END_TIME) {
        nextValidTime.setDate(nextValidTime.getDate() + 1);
      }
    }
    
    // Format the current time for display
    const currentTime = timeNow.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      timeZone: EARLY_RISERS.TIMEZONE,
      timeZoneName: 'short'
    });

    // Format the next available time for display
    const nextAvailableTime = nextValidTime.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      timeZone: EARLY_RISERS.TIMEZONE,
      timeZoneName: 'short'
    });
    
    // Return a message indicating the promotion is not currently available
    return {
      success: false,
      details: {
        currentTime,
        nextValidTime: nextAvailableTime
      },
      promptTemplate: EARLY_RISERS_RESPONSE.INVALID_TIME(currentTime, nextAvailableTime)
    };
  }
}; 