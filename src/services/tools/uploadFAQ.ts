import { Pinecone } from "@pinecone-database/pinecone";
import OpenAI from "openai";
import * as fs from "fs-extra";
import * as dotenv from "dotenv";

dotenv.config();

// Initialize OpenAI & Pinecone
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });
const pinecone = new Pinecone({ apiKey: process.env.PINECONE_API_KEY! });

// Constants
const INDEX_NAME = "sierra-agent-faq"; // Ensure this matches your Pinecone index name
const EMBEDDING_MODEL = "text-embedding-3-small"; // 1024 dimensions
const VECTOR_DIMENSION = 1536;

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
    const indexExists = indexList.indexes?.some(idx => idx.name === INDEX_NAME) || false;
    
    if (!indexExists) {
      await pinecone.createIndex({
        name: INDEX_NAME,
        dimension: VECTOR_DIMENSION,
        metric: "cosine",
        spec: { serverless: { cloud: "aws", region: "us-west-2" } }
      });
      console.log("Created Pinecone index.");
    }

    const index = pinecone.index(INDEX_NAME);

    // Loop through FAQ sections, create embeddings & upload to Pinecone
    for (let i = 0; i < faqSections.length; i++) {
      const text = faqSections[i];
      if (!text.trim()) continue;

      // Generate vector embedding
      const embeddingResponse = await openai.embeddings.create({
        model: EMBEDDING_MODEL,
        input: text
      });

      const embedding = embeddingResponse.data[0].embedding;
      
      // Verify embedding dimension
      if (embedding.length !== VECTOR_DIMENSION) {
        console.error(`Embedding dimension mismatch: got ${embedding.length}, expected ${VECTOR_DIMENSION}`);
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

