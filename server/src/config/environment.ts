import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Validate required environment variables
const requiredEnvVars = [
  'OPEN_WEATHER_API_KEY',
  'PINECONE_API_KEY',
  'OPENAI_API_KEY',
  'MAILGUN_API_KEY',
] as const;

// Check for missing environment variables
const missingEnvVars = requiredEnvVars.filter(
  (envVar) => !process.env[envVar]
);

if (missingEnvVars.length > 0) {
  throw new Error(
    `Missing required environment variables: ${missingEnvVars.join(', ')}`
  );
}

// Export validated environment variables
export const ENV = {
  OPEN_WEATHER_API_KEY: process.env.OPEN_WEATHER_API_KEY as string,
  PINECONE_API_KEY: process.env.PINECONE_API_KEY as string,
  OPENAI_API_KEY: process.env.OPENAI_API_KEY as string,
  MAILGUN_API_KEY: process.env.MAILGUN_API_KEY as string,
} as const;