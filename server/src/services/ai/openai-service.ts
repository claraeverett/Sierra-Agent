import { openai } from '@/services/api/clients';
import { ChatCompletionMessageParam } from "openai/resources";
import { AI_CONSTANTS } from '@/services/ai/index';
import { State } from '@/core/state/state';

/**
 * OpenAI Service
 * 
 * This module provides functions for interacting with the OpenAI API.
 * It handles text generation, embeddings, and intent classification.
 */

/**
 * Generates a response using the OpenAI chat completion API
 * 
 * This function creates a chat completion request with the provided conversation history
 * and system prompt. It's the primary method for generating text responses.
 * 
 * @param conversationHistory Array of previous messages in the conversation
 * @param systemPrompt The system prompt to guide the model's behavior
 * @param includeHistory Whether to include the conversation history in the request
 * @param temperature Controls randomness (0-1): lower values = more deterministic
 * @param maxTokens Maximum number of tokens to generate
 * @returns OpenAI chat completion response
 */
async function modelResponse(
  conversationHistory: ChatCompletionMessageParam[] = [], 
  systemPrompt: string,
  includeHistory: boolean = true,
  temperature: number = 0.7,
  maxTokens: number = 300
) {
  return await openai.chat.completions.create({
    model: AI_CONSTANTS.DEFAULT_MODEL,
    messages: [
      // Using "system" role for the system prompt is the correct approach
      // The system role is specifically designed for instructions that guide the model's behavior
      // Previously this was using "assistant" role which is less appropriate for system instructions
      { role: "system", content: systemPrompt },
      ...(includeHistory ? conversationHistory : [])
    ],
    temperature: temperature,  // Higher values make output more random
    max_tokens: maxTokens,   // Controls the maximum length of the generated response
  });
}

/**
 * Generates an embedding vector for text using the OpenAI embeddings API
 * 
 * Embeddings are vector representations of text that capture semantic meaning,
 * allowing for semantic search and similarity comparisons.
 * 
 * @param text The text to generate an embedding for
 * @param model The embedding model to use (defaults to text-embedding-ada-002)
 * @returns OpenAI embedding response containing vector representation
 */
async function modelResponseWithEmbedding(
  text: string,
  model: string = "text-embedding-ada-002"
) { 
  return await openai.embeddings.create({
    input: text,
    model: model,
  });
}

/**
 * Classifies user intent using a specialized model configuration
 * 
 * This function is specifically designed for intent classification with JSON output.
 * It uses a zero temperature setting for deterministic results and includes
 * conversation history for context.
 * 
 * @param prompt System prompt containing intent classification rules
 * @param message User message to classify
 * @param state Application state containing conversation history
 * @returns JSON formatted classification response
 */
async function intentClassifier(prompt: string, message: string, state: State) {
  return await openai.chat.completions.create({
    model: AI_CONSTANTS.DEFAULT_MODEL,
    messages: [
      { role: 'system', content: prompt },
      ...state.getConversationHistory(),
      { role: 'user', content: message },
    ],
    temperature: 0,  // Use 0 for more deterministic outputs
    response_format: { type: 'json_object' }  // Ensure JSON response
  });
}

export { modelResponse, intentClassifier, modelResponseWithEmbedding };