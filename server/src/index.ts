import * as dotenv from 'dotenv';
import * as readline from 'readline';
import { classifyIntent } from '@/services/ai/intent-classifier';
import { Agent } from '@/core/agent/agent';
import { State } from '@/core/state/state';
import { generateCustomerId } from '@/utils/utils';

/**
 * CLI Interface for Sierra Outfitters Assistant
 * This file provides a command-line interface for testing the assistant
 * without needing to use the web interface.
 */

// Initialize state with a generated customer ID and fixed session ID
const state = new State(generateCustomerId(), "session_456");

// Load environment variables from .env file
dotenv.config();

// Setup readline interface for CLI interaction
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Create agent instance with the initialized state
const agent = new Agent(state);

/**
 * Main chat function that handles the conversation loop
 * Continuously prompts for user input, processes it, and displays responses
 */
async function chat() {
  // Display welcome message
  console.log('Sierra Outfitters Assistant: How can I help you today?');
  
  // Main conversation loop
  while (true) {
    
    // Prompt for user input
    const userInput = await new Promise<string>(resolve => {
      rl.question('You: ', resolve);
    });

    // Exit condition
    if (userInput.toLowerCase() === 'exit') break;

    try {
      // Classify user intent
      const classification = await classifyIntent(userInput, state);
      
      // Process request and get response
      const response = await agent.handleRequest(classification, userInput);
      
      // Display assistant response
      console.log('Sierra Outfitters Assistant:', response);
    } catch (error) {
      // Handle errors gracefully
      console.error('Error:', error);
      console.log('Sierra Outfitters Assistant: I apologize, but I encountered an error.');
    }
  }
  
  // Close the readline interface when exiting
  rl.close();
}

// Run the chatbot if this file is executed directly
if (require.main === module) {
  chat().catch(console.error);
}

// Export for use as a module
export { chat }; 