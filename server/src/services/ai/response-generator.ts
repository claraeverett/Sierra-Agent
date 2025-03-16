import { State } from '@/core/state/state';
import { GENERATE_RESPONSE_PROMPT } from '@/prompts/system-prompts';
import { modelResponse } from '@/services/ai/openai-service';

/**
 * Generates an AI response based on the conversation context and prompt template
 * @param state Current conversation state
 * @param promptTemplate Template string for the response
 * @param details Additional context details to be inserted into the template
 * @returns Generated response string or null if generation fails
 */
export async function generateResponse(
  state: State, 
  promptTemplate: string | undefined, 
  details: Record<string, any>
): Promise<string | null> {
  
  // Early return if no template provided
  if (!promptTemplate) return null;
  
  try {
    // Format the prompt template with provided details
    let formattedPrompt = promptTemplate;
    if (Object.keys(details).length > 0) {
      const formattedDetails = Object.entries(details)
        .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(", ") : value}`)
        .join("\n");
      formattedPrompt = formattedPrompt.replace("{details}", formattedDetails);
    }
    

    // Get recent conversation history for context
    const conversationHistory = state.getConversationHistory();
    // Add the current prompt to conversation
    conversationHistory.push({ 
      role: "system", 
      content: formattedPrompt 
    });

    // Generate AI response
    const response = await modelResponse(
      conversationHistory, 
      GENERATE_RESPONSE_PROMPT(state.language)
    );


    // Process and store response
    const aiResponse = response.choices[0].message.content || null;

    if (aiResponse) {
      // Add AI response to conversation history
      state.addConversationEntry( 
        "assistant", 
        aiResponse 
      );
      return aiResponse;
    }

    return null;
  } catch (error) {
    console.error("Error generating AI response:", error);
    return null;
  }
}
