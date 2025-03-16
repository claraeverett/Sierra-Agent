import express from 'express';
import path from 'path';
import cors from 'cors';
import dotenv from 'dotenv';
import { Agent } from './core/agent/agent';
import { State } from './core/state/state';
import { classifyIntent } from './services/ai/intent-classifier';
import { generateCustomerId } from './utils/utils';

/**
 * Main Express server for the Sierra Outfitters Assistant
 * This file sets up the web server that handles API requests from the client
 */

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Store active user sessions in memory
// In a production environment, this would be replaced with a persistent database
const sessions: Map<string, State> = new Map();

// Configure middleware
app.use(cors());                                     // Enable CORS for all routes
app.use(express.json());                             // Parse JSON request bodies
app.use(express.static(path.join(__dirname, 'client/build'))); // Serve static files

/**
 * API endpoint for processing chat messages
 * Handles message classification, processing, and response generation
 */
app.post('/api/message', async (req, res) => {
  try {
    const { message, sessionId: clientSessionId } = req.body;
    
    // Generate a new session ID if one wasn't provided
    const sessionId = clientSessionId || generateCustomerId();
    
    // Get existing state or create a new one for this session
    let state: State;
    if (sessions.has(sessionId)) {
      state = sessions.get(sessionId)!;
    } else {
      state = new State(generateCustomerId(), sessionId);
      sessions.set(sessionId, state);
    }
    
    // Note: We don't need to add the user message here as the Agent will do it
    // state.addConversationEntry('user', message);
    
    // Classify the user's intent using AI
    const intentClassification = await classifyIntent(message, state);
    
    // Create agent instance with the current state
    const agent = new Agent(state);
    
    // Process the message and generate a response
    const response = await agent.handleRequest(intentClassification, message);
    
    // Note: We don't need to add the assistant message here as the response generator already did it
    // state.addConversationEntry('assistant', response);
    
    // Return the response along with session information
    res.json({
      response,
      sessionId,
      conversationHistory: state.getConversationHistory()
    });
  } catch (error) {
    console.error('Error processing message:', error);
    res.status(500).json({ error: 'Failed to process message' });
  }
});

/**
 * Catch-all route to serve the React app
 * This allows client-side routing to work properly
 */
app.get('*', (_, res) => {
  res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

// Start the server if this file is run directly
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

export default app; 