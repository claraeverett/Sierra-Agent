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
    console.log("Search FAQ Tool", params, state);
    console.log(" ---------------------------------------------------------------")
    try {
      state.addUnresolvedIntents(Intent.SearchFAQ);
      //const index = pinecone.index(PINECONE_CONSTANTS.FAQ_INDEX_NAME);
      const query = params.query;
      //console.log(state);

      // Convert query to embedding
      const embeddingResponse = await modelResponseWithEmbedding(query, PINECONE_CONSTANTS.EMBEDDING_MODEL);

      const queryEmbedding = embeddingResponse.data[0].embedding;

      // Search Pinecone for similar FAQ sections

      const searchResponse = await searchIndex(queryEmbedding);

      // TO DO: Use the searchIndex function instead of the index.query method
      /*
      const searchResponse = await index.query({
          vector: queryEmbedding,
          topK: PINECONE_CONSTANTS.TOP_K, // Get top 3 matches
          includeMetadata: true,
        });*/

      const matches = searchResponse.matches || [];
      console.log(matches);

      // Extract relevant FAQ sections
      const matchedTexts = matches.map((match) => match.metadata?.text).join("\n\n");

      console.log("");
      console.log("matchedTexts", matchedTexts);
      console.log("");
      // Generate final response
      state.resolveIntent(Intent.SearchFAQ);
      console.log("Resolving Intent", Intent.SearchFAQ);
      console.log(" ---------------------------------------------------------------")
      return {
        success: true,
        details: {
          matchedText: matchedTexts,
        },
        promptTemplate: COMPANY_FAQ_PROMPTS.FAQ_SEARCH_RESULT_PROMPT(query, matchedTexts)
      };
    } catch (error) {
      console.error("Error searching FAQ:", error);
      console.log(" ---------------------------------------------------------------")
      return {
        success: false,
        promptTemplate: COMPANY_FAQ_PROMPTS.NO_MATCH_PROMPT
      };
    }
  }
};
