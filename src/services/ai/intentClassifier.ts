import { INTENT_CLASSIFICATION_PROMPT } from '../../prompts/systemPrompts';
import { intentClassifier } from './chatComplete';
import { IntentClassification } from '../../types/types';

export async function classifyIntent(message: string): Promise<IntentClassification> {
  
  const completion = await intentClassifier(INTENT_CLASSIFICATION_PROMPT, message);

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