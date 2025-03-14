import * as fs from "fs-extra";
import { PINECONE_CONSTANTS } from '@/config/constants';
import { pinecone } from '@/services/api/clients';
import { modelResponseWithEmbedding } from '@/services/ai/openai-service';
import { QueryResponse } from '@pinecone-database/pinecone';
let index = pinecone.Index(PINECONE_CONSTANTS.FAQ_INDEX_NAME);

/**
 * Uploads the Company FAQ to Pinecone
 */
export const uploadFaq = async () => {
  try {
    // Read FAQ file
    const filePath = "./src/knowledge/knowledgeBase.txt";
    if (!fs.existsSync(filePath)) {
      console.error("FAQ file not found!");
      return;
    }
    
    const faqContent = await fs.readFile(filePath, "utf-8");
    const faqSections = faqContent.split("\n\n"); // Split into chunks

    // Ensure Pinecone index exists
    const indexList = await pinecone.listIndexes();
    const indexExists = indexList.indexes?.some(idx => idx.name === PINECONE_CONSTANTS.FAQ_INDEX_NAME) || false;
    
    if (!indexExists) {
      await pinecone.createIndex({
        name: PINECONE_CONSTANTS.FAQ_INDEX_NAME,
        dimension: PINECONE_CONSTANTS.VECTOR_DIMENSION,
        metric: "cosine",
        spec: { serverless: { cloud: "aws", region: "us-west-2" } }
      });
      console.log("Created Pinecone index.");
    }


    // Loop through FAQ sections, create embeddings & upload to Pinecone
    for (let i = 0; i < faqSections.length; i++) {
      const text = faqSections[i];
      if (!text.trim()) continue;

      // Generate vector embedding
      const embeddingResponse = await modelResponseWithEmbedding(text, PINECONE_CONSTANTS.EMBEDDING_MODEL);

      const embedding = embeddingResponse.data[0].embedding;
      
      // Verify embedding dimension
      if (embedding.length !== PINECONE_CONSTANTS.VECTOR_DIMENSION) {
        console.error(`Embedding dimension mismatch: got ${embedding.length}, expected ${PINECONE_CONSTANTS.VECTOR_DIMENSION}`);
        continue;
      }

      // Upload to Pinecone
      await index.upsert([{ 
        id: `faq-${i}`, 
        values: embedding, 
        metadata: { text } 
      }]);
      
      console.log(`Uploaded section ${i + 1} to Pinecone`);
    }

    console.log("All FAQ sections uploaded!");
  } catch (error) {
    console.error("Error uploading FAQ:", error);
  }
};

export const searchIndex = async (queryEmbedding: number[]): Promise<QueryResponse> => {
  return await index.query({
    vector: queryEmbedding,
    topK: PINECONE_CONSTANTS.TOP_K, // Get top 3 matches
    includeMetadata: true,
  });
}
