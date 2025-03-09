import { ToolResponse } from './tools';
import { Tool } from '../../types/types';
import { State } from '../../state/state';
import { EARLY_RISERS } from '../../config/constants';
import { EARLY_RISERS_RESPONSE } from '../../prompts/earlyRisers';
import { getTime, getPromoCode, timeIsToday } from '../../utils/utils';

interface EarlyRisersParams {
  productName?: string;
}

export const earlyRisersTool: Tool = {
  name: 'earlyRisers',
  description: 'Handle Early Risers promotion',
  execute: async (params: EarlyRisersParams, state: State): Promise<ToolResponse> => {
    const timeNow = getTime();
    const hour = new Date(timeNow).getHours();

    if (hour >= EARLY_RISERS.START_TIME && hour < EARLY_RISERS.END_TIME) {
      if (state.promoCode) {
        const isFromToday = timeIsToday(state.promoCode.createdAt, EARLY_RISERS.TIMEZONE, timeNow);
                
        if (isFromToday) {
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
        state.clearPromoCode();
      }

      const code = getPromoCode();
      state.updatePromoCode({
        code,
        createdAt: timeNow,
        productName: params.productName
      });

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

    const nextValidTime = getTime();
    if (hour >= EARLY_RISERS.END_TIME || hour < EARLY_RISERS.START_TIME) {
      nextValidTime.setHours(EARLY_RISERS.START_TIME, 0, 0, 0);
      if (hour >= EARLY_RISERS.END_TIME) {
        nextValidTime.setDate(nextValidTime.getDate() + 1);
      }
    }
    
    const currentTime = timeNow.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      timeZone: EARLY_RISERS.TIMEZONE,
      timeZoneName: 'short'
    });

    const nextAvailableTime = nextValidTime.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      timeZone: EARLY_RISERS.TIMEZONE,
      timeZoneName: 'short'
    });

    state.addUnresolvedIntents('EarlyRisers');
    
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