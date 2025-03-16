import { Tool, FAQParams, Intent } from '@/types/types';
import { State } from '@/core/state/state';
import { ToolResponse } from '@/services/tools/toolExport';
import { modelResponseWithEmbedding } from '@/services/ai/openai-service';
import { PINECONE_CONSTANTS } from '@/config/constants';
import { searchIndex } from '@/services/api/pinecone-faq-service';
import { COMPANY_FAQ_PROMPTS } from '@/prompts/company-faq-prompts';
/**
 * Search the FAQ
 * @param params - The parameters for the tool
 * @param state - The state of the application
 * @returns The tool response
 */
export const searchFaqTool: Tool = {
  name: 'searchFaq',
  description: 'Search the FAQ',
  execute: async (params: FAQParams, state: State): Promise<ToolResponse> => {
     try {
      state.addUnresolvedIntents(Intent.SearchFAQ);
      //const index = pinecone.index(PINECONE_CONSTANTS.FAQ_INDEX_NAME);
      const query = params.query;

      // Convert query to embedding
      const embeddingResponse = await modelResponseWithEmbedding(query, PINECONE_CONSTANTS.EMBEDDING_MODEL);

      const queryEmbedding = embeddingResponse.data[0].embedding;

      // Search Pinecone for similar FAQ sections

      const searchResponse = await searchIndex(queryEmbedding);


      const matches = searchResponse.matches || [];


      // Extract relevant FAQ sections
      const matchedTexts = matches.map((match) => match.metadata?.text).join("\n\n");

      
      // Generate final response
      state.resolveIntent(Intent.SearchFAQ);

      return {
        success: true,
        details: {
          matchedText: matchedTexts,
        },
        promptTemplate: COMPANY_FAQ_PROMPTS.FAQ_SEARCH_RESULT_PROMPT(query, matchedTexts)
      };
    } catch (error) {
      console.error("Error searching FAQ:", error);
      return {
        success: false,
        promptTemplate: COMPANY_FAQ_PROMPTS.NO_MATCH_PROMPT
      };
    }
  }
};
