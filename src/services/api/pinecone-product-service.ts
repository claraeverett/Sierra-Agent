import * as fs from "fs-extra";
import { PINECONE_CONSTANTS } from '@/config/constants';
import { openai,pinecone } from '@/services/api/clients';
import {QueryResponse } from '@pinecone-database/pinecone';

interface Product {
    ProductName: string;
    SKU: string;
    Inventory: number;
    Description: string;
    Tags: string[];
  }

let index = pinecone.Index(PINECONE_CONSTANTS.PRODUCT_INDEX_NAME);
/*
export const sparseVectorQuery = async (queryVector: Promise<number[]>,topK: number = 3,): Promise<number[]> => {
    return await index.query({
        vector: queryVector,
        sparseVector: Object.fromEntries(queryVector.map((word) => [word, 1])), // BM25-style keyword weighting
        topK: topK,
        includeMetadata: true,
      });
}
*/

export const searchProduct = async (topK: number = PINECONE_CONSTANTS.TOP_K,queryVector: number[]): Promise<QueryResponse> => {
    return await index.query({
        vector: queryVector,
        topK: topK,
        includeMetadata: true,
      });
}


async function getEmbedding(text: string): Promise<number[]> {
    const response = await openai.embeddings.create({
      input: text,
      model: PINECONE_CONSTANTS.EMBEDDING_MODEL,
    });
  
    return response.data[0].embedding;
  }

/**
 * Uploads the Product Catalog to Pinecone
 */
export const uploadProduct = async () => {
    const productData = await fs.readFile('./src/data/mockData/productCatalog.json', 'utf8');
    const products: Product[] = JSON.parse(productData);
    const vectors = await Promise.all(
        products.map(async (product) => {
          const text = `${product.ProductName} - ${product.Description} - ${product.Tags.join(", ")}`;
          const vector = await getEmbedding(text);
    
          return {
            id: product.SKU,
            values: vector,
            metadata: {
              ProductName: product.ProductName,
              SKU: product.SKU,
              Description: product.Description,
              Tags: product.Tags.join(", "),
              Inventory: product.Inventory,
            },
          };
        })
      );
    
      // Upload vectors to Pinecone
      await index.upsert(vectors);
    
}
