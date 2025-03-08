import * as dotenv from 'dotenv';
import * as readline from 'readline';
import { classifyIntent } from './services/ai/intentClassifier';
import { Agent } from './services/agent';
import { State } from './state/state';

const state = new State("user_123", "session_456");
  
dotenv.config();

// Setup CLI interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const agent = new Agent(state);

async function chat() {
  console.log('Sierra Outfitters Assistant: How can I help you today?');
  
  while (true) {
    const userInput = await new Promise<string>(resolve => {
      rl.question('You: ', resolve);
    });

    if (userInput.toLowerCase() === 'exit') break;

    try {
      const classification = await classifyIntent(userInput, state);
      const response = await agent.handleRequest(classification, userInput);
      console.log('Sierra Outfitters Assistant:', response);
    } catch (error) {
      console.error('Error:', error);
      console.log('Sierra Outfitters Assistant: I apologize, but I encountered an error.');
    }
  }
}

// Run the chatbot if this file is executed directly
if (require.main === module) {
  chat().catch(console.error);
}

// Export for use as a module
export { chat }; 