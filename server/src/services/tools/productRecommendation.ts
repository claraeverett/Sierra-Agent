import { ToolResponse } from '@/services/tools/toolExport';
import { Tool, ProductInventoryParams } from '@/types/types';
import { State } from '@/core/state/state';
import { PRODUCT_RECOMMENDATION_PROMPT } from '@/prompts/product-prompts';
import { Intent} from '@/types/types';
import { PRODUCT_SIMILARITY_PROMPT } from '@/prompts/system-prompts';
import { modelResponse, modelResponseWithEmbedding } from '@/services/ai/openai-service';
import { searchProduct } from '@/services/api/pinecone-product-service';
import { PINECONE_CONSTANTS } from '@/config/constants';
/**
 * Product Recommendation Tool
 * 
 * This module provides functionality to recommend products to users based on their
 * preferences, past orders, and current query. It uses a hybrid search approach
 * combining semantic understanding and vector embeddings.
 */

/**
 * Generate Search Query Tool
 * Creates an optimized search query based on user input and state
 * 
 * @param state - The application state containing user preferences and history
 * @param query - The original user query to enhance
 * @returns A semantically enriched search query for better product matching
 */
async function generateSearchQuery(query:string): Promise<string> {
  // Use the product similarity prompt to generate a more effective search query
  // This incorporates user preferences and past behavior from the state

  const prompt = PRODUCT_SIMILARITY_PROMPT(query);

  const response = await modelResponse([],prompt, false);

  return response.choices[0].message?.content || "";
}

/**
 * Get Embedding Tool
 * Converts text to vector embeddings for semantic search
 * 
 * @param text - The text to convert to vector embeddings
 * @returns An array of numbers representing the text embedding
 */
async function getEmbedding(text: string): Promise<number[]> {
  // Note: Using text-embedding-ada-002 model - consider moving this to constants
  const response = await modelResponseWithEmbedding(text, PINECONE_CONSTANTS.EMBEDDING_MODEL);

  return response.data[0].embedding;
}

/**
 * Search Hybrid Tool
 * Performs a hybrid search combining semantic understanding and vector similarity
 * 
 * @param userState - The application state with user context
 * @param params - The search parameters from the user
 * @param topK - The number of results to return (defaults to 3)
 * @returns An array of matching products with relevance scores
 */
async function searchHybrid(params: ProductInventoryParams, topK: number = 3) {
  let userQuery = params.query;

  // Step 1: Generate a structured query that incorporates user context
  const searchQuery = await generateSearchQuery(userQuery);

  // Step 2: Convert search query to embedding vector for semantic matching
  const queryVector = await getEmbedding(searchQuery);

  // Step 3: Run hybrid search in Pinecone vector database
  const result = await searchProduct(topK, queryVector);

  // Step 4: Format the results for display
  return result.matches.map((match) => ({
    SKU: match.id,
    ProductName: match.metadata?.ProductName,
    Description: match.metadata?.Description,
    Tags: match.metadata?.Tags,
    Inventory: match.metadata?.Inventory,
    Score: match.score,
  }));
}

/**
 * Product Recommendation Tool
 * Main tool implementation that handles product recommendation requests
 * 
 * @param params - The parameters for the product recommendation
 * @param state - The application state
 * @returns A tool response with recommended products or an error message
 */
export const productRecommendationTool: Tool = {
  name: 'productRecommendation',
  description: 'Recommend a product to the user',
  execute: async (params: ProductInventoryParams, state: State): Promise<ToolResponse> => {    
    // Track this intent as unresolved until we successfully complete the recommendation
    state.addUnresolvedIntents(Intent.ProductRecommendation);
    
    // Perform the hybrid search to find relevant products
    const result = await searchHybrid(params, PINECONE_CONSTANTS.TOP_K);

    const formattedResults = result.map(item => ({
      productName: String(item.ProductName),
      sku: item.SKU,
      inventory: Number(item.Inventory),
      description: String(item.Description),
      tags: Array.isArray(item.Tags) ? item.Tags : []
    }));

    if(result.length > 0) {
      // Mark the intent as resolved since we found products to recommend
      state.resolveIntent(Intent.ProductRecommendation);
      
      // Format each product recommendation using the product prompt template
      return {
        success: true,
        promptTemplate: PRODUCT_RECOMMENDATION_PROMPT.PRODUCTS_FOUND(formattedResults)
      };
    }

    // Return an error response if no products were found
    return {
        success: false,
        promptTemplate: PRODUCT_RECOMMENDATION_PROMPT.ERROR,
    };
  }
};  
