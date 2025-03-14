import { modelResponse } from '@/services/ai/openai-service';
import { classifyIntent } from '@/services/ai/intent-classifier';
import { generateResponse } from '@/services/ai/response-generator';

/**
 * AI Service Module
 * 
 * This module serves as the central export point for AI-related functionality
 * and configuration constants. It provides access to the core AI functions
 * and defines important constants that control AI behavior throughout the application.
 */

// Export all AI-related functions
export {
  modelResponse,
  classifyIntent,
  generateResponse
};

/**
 * AI Constants
 * 
 * These constants control the behavior of AI interactions throughout the application.
 * They define model selection, generation parameters, and context management settings.
 */
export const AI_CONSTANTS = {
  /**
   * Maximum tokens to generate in standard responses
   * Higher values allow for longer outputs but increase API costs
   */
  MAX_TOKENS: 2048,
  
  /**
   * Default temperature for most AI interactions
   * 0 = deterministic, higher values increase randomness
   * Using 0 for consistent, predictable responses
   */
  DEFAULT_TEMPERATURE: 0,
  
  /**
   * Primary model used for most interactions
   * GPT-4o provides the best balance of capability and cost
   */
  DEFAULT_MODEL: 'gpt-4o',
  
  /**
   * Smaller, faster model for simpler tasks
   * Used when full GPT-4o capabilities aren't needed
   */
  MINI_MODEL: 'gpt-4o-mini',
  
  /**
   * Number of conversation messages to keep for context
   * Balances comprehensive context with token efficiency
   */
  CONTEXT_WINDOW: 5,  // number of messages to keep for context
  
  /**
   * Temperature setting specifically for email generation
   * Low value (0.1) ensures consistent, professional emails
   */
  SEND_EMAIL_TEMPERATURE: 0.1,
  
  /**
   * Maximum tokens for email generation
   * Higher limit to ensure emails can include all necessary details
   */
  SEND_EMAIL_MAX_TOKENS: 800
} as const;
