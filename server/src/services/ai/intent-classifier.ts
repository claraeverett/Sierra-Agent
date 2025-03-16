import { INTENT_CLASSIFICATION_PROMPT } from '@/prompts/system-prompts';
import { intentClassifier } from '@/services/ai/openai-service';
import { IntentClassification } from '@/types/types';
import { State } from '@/core/state/state';

/**
 * Intent Classification Service
 * 
 * This module handles the classification of user messages into specific intents
 * that the system can respond to. It uses OpenAI's models to analyze the text
 * and determine what the user is asking for.
 */

/**
 * Classifies user intent based on their message
 * 
 * @param message The user's message to classify
 * @param state Current application state containing conversation history
 * @returns Classification with detected intents and extracted parameters
 */
export async function classifyIntent(message: string, state: State): Promise<IntentClassification> {
  // Call the OpenAI service to classify the intent
  const completion = await intentClassifier(INTENT_CLASSIFICATION_PROMPT, message, state);

  try {
    // Parse the JSON response from the AI model
    const result = JSON.parse(completion.choices[0].message.content || '{}');
    
    // Ensure we have valid arrays and objects with fallbacks
    const intents = Array.isArray(result.intents) ? result.intents : [];
    const params = typeof result.params === 'object' ? result.params : {};
    const language = typeof result.language === 'string' ? result.language : 'en';
    state.language = language;
    // Return the classification, defaulting to 'General' intent if none detected
    return { 
      intents: intents.length ? intents : ['General'],
      params,
      language: language
    };
  } catch (error) {
    // Log parsing errors and return a default classification
    console.error('Error parsing intent classification:', error);
    return { intents: ['General'], params: {}, language: 'en' };
  }
} 