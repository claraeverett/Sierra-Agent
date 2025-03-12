import { INTENT_CLASSIFICATION_PROMPT } from '@/prompts/system-prompts';
import { intentClassifier } from '@/services/ai/openai-service';
import { IntentClassification } from '@/types/types';
import { State } from '@/core/state/state';

/**
 * Classifies user intent based on their message
 * @param message The user's message to classify
 * @param state Current application state
 * @returns Classification with intents and parameters
 */
export async function classifyIntent(message: string, state: State): Promise<IntentClassification> {
  
  const completion = await intentClassifier(INTENT_CLASSIFICATION_PROMPT, message, state);

  try {
    const result = JSON.parse(completion.choices[0].message.content || '{}');
    
    // Ensure we have valid arrays and objects
    const intents = Array.isArray(result.intents) ? result.intents : [];
    const params = typeof result.params === 'object' ? result.params : {};

    return { 
      intents: intents.length ? intents : ['General'],
      params
    };
  } catch (error) {
    console.error('Error parsing intent classification:', error);
    return { intents: ['General'], params: {} };
  }
} 