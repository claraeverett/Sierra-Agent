import { Pinecone } from "@pinecone-database/pinecone";
import OpenAI from "openai";
import * as dotenv from "dotenv";
import { Tool, FAQParams } from '@/types/types';
import { State } from '@/core/state/state';
import { ToolResponse } from '@/services/tools/toolExport';

dotenv.config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });
const pinecone = new Pinecone({ apiKey: process.env.PINECONE_API_KEY! });

const INDEX_NAME = "sierra-agent-faq";

export const searchFaqTool: Tool = {
  name: 'searchFaq',
  description: 'Search the FAQ',
  execute: async (params: FAQParams, state: State): Promise<ToolResponse> => {
    try {
      state.addUnresolvedIntents("SearchFAQ");
      const index = pinecone.index(INDEX_NAME);
      const query = params.query;
      console.log(state);

      // Convert query to embedding
      const embeddingResponse = await openai.embeddings.create({
        model: "text-embedding-3-small",
        input: query
      });

      const queryEmbedding = embeddingResponse.data[0].embedding;

      // Search Pinecone for similar FAQ sections
      const searchResponse = await index.query({
        vector: queryEmbedding,
        topK: 3, // Get top 3 matches
        includeMetadata: true,
      });

      const matches = searchResponse.matches || [];
      console.log(matches);

      // Extract relevant FAQ sections
      const matchedTexts = matches.map((match) => match.metadata?.text).join("\n\n");

      console.log("");
      console.log("matchedTexts", matchedTexts);
      console.log("");
      // Generate final response
      state.resolveIntent("SearchFAQ");
      return {
        success: true,
        details: {
          matchedText: matchedTexts,
        },
        promptTemplate: `Answer the following question based on this FAQ:\n\n${matchedTexts}\n\nQuestion: ${query}`
      };
    } catch (error) {
      console.error("Error searching FAQ:", error);
      return {
        success: false,
        promptTemplate: "Tell the user that you couldn't find the answer to their question in the FAQ."
      };
    }
  }
};
