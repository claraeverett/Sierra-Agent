import OpenAI from 'openai';
import { Pinecone } from "@pinecone-database/pinecone";
import { ENV } from '@/config/environment';

// Initialize API clients
export const openai = new OpenAI({ 
  apiKey: ENV.OPENAI_API_KEY 
});

export const pinecone = new Pinecone({ 
  apiKey: ENV.PINECONE_API_KEY 
});