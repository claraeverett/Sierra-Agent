import * as dotenv from 'dotenv';

/**
 * Environment Configuration
 * 
 * This module loads and validates environment variables required by the application.
 * It ensures all necessary API keys are present before the application starts.
 */

// Load environment variables from .env file
dotenv.config();

// Define required environment variables
// These are the API keys needed for various services used by the application
const requiredEnvVars = [
  'OPEN_WEATHER_API_KEY',  // For weather data in hiking recommendations
  'PINECONE_API_KEY',      // For vector database operations
  'OPENAI_API_KEY',        // For AI/ML operations
  'MAILGUN_API_KEY',       // For email notifications
] as const;

// Check for any missing environment variables
const missingEnvVars = requiredEnvVars.filter(
  (envVar) => !process.env[envVar]
);

// Throw an error if any required variables are missing
if (missingEnvVars.length > 0) {
  throw new Error(
    `Missing required environment variables: ${missingEnvVars.join(', ')}`
  );
}

/**
 * Validated environment variables exported for use throughout the application
 * Type casting ensures TypeScript recognizes these as strings
 */
export const ENV = {
  OPEN_WEATHER_API_KEY: process.env.OPEN_WEATHER_API_KEY as string,
  PINECONE_API_KEY: process.env.PINECONE_API_KEY as string,
  OPENAI_API_KEY: process.env.OPENAI_API_KEY as string,
  MAILGUN_API_KEY: process.env.MAILGUN_API_KEY as string,
} as const;