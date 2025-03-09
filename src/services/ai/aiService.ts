import { openai } from "../../config/openai";
import { ChatCompletionMessageParam } from "openai/resources";
import { AI_CONSTANTS } from "./index";
import { State } from "../../state/state";
/**
 * Generates a response using the chat completion API
 * @param conversationHistory Array of previous messages in the conversation
 * @param systemPrompt The system prompt to guide the model's behavior
 * @returns OpenAI chat completion response
 */
async function modelResponse(
  conversationHistory: ChatCompletionMessageParam[] = [], 
  systemPrompt: string,
  includeHistory: boolean = true
) {
  return await openai.chat.completions.create({
    model: AI_CONSTANTS.DEFAULT_MODEL,
    messages: [
      { role: "assistant", content: systemPrompt },
      ...(includeHistory ? conversationHistory : [])
    ],
    temperature: 0.7,  // Higher values make output more random
    max_tokens: 300,   // Increased from 200 to allow for longer responses
  });
}

/**
 * Classifies user intent using a specialized model configuration
 * @param prompt System prompt containing intent classification rules
 * @param message User message to classify
 * @returns JSON formatted classification response
 */
async function intentClassifier(prompt: string, message: string, state: State) {
  console.log("IntentClassifier conversationHistory : ", state.getConversationHistory());

  
  return await openai.chat.completions.create({
    model: AI_CONSTANTS.DEFAULT_MODEL,  // Using smaller model for classification
    messages: [
      { role: 'assistant', content: prompt },
      ...state.getConversationHistory(),
      { role: 'user', content: message },
      
    ],
    temperature: 0,  // Use 0 for more deterministic outputs
    response_format: { type: 'json_object' }  // Ensure JSON response
  });
}

export { modelResponse, intentClassifier };