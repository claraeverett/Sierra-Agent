import { modelResponse } from './aiService';
import { classifyIntent } from './intentClassifier';
import { generateResponse } from './generateResponse';

// Export all AI-related functions
export {
  modelResponse,
  classifyIntent,
  generateResponse
};

// Export AI-specific constants
export const AI_CONSTANTS = {
  MAX_TOKENS: 2048,
  DEFAULT_TEMPERATURE: 0,
  DEFAULT_MODEL: 'gpt-4o',
  MINI_MODEL: 'gpt-4o-mini',
  CONTEXT_WINDOW: 5  // number of messages to keep for context
} as const;

// Optional: Export default configurations
export const defaultModelConfig = {
  temperature: 0,
  maxTokens: 2048,
  model: 'gpt-4'
} as const;