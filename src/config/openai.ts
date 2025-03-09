import OpenAI from 'openai';
import * as dotenv from 'dotenv';

dotenv.config();

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
}); 

export const FAQ_FILE_ID = "file-1234567890";