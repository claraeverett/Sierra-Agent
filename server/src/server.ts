import express from 'express';
import path from 'path';
import cors from 'cors';
import dotenv from 'dotenv';
import { Agent } from './core/agent/agent';
import { State } from './core/state/state';
import { classifyIntent } from './services/ai/intent-classifier';
import { generateCustomerId } from './utils/utils';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Store sessions
const sessions: Map<string, State> = new Map();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'client/build')));

// API endpoint for messages
app.post('/api/message', async (req, res) => {
  try {
    const { message, sessionId: clientSessionId } = req.body;
    
    // Generate or retrieve session ID
    const sessionId = clientSessionId || generateCustomerId();
    
    // Get or create state for this session
    let state: State;
    if (sessions.has(sessionId)) {
      state = sessions.get(sessionId)!;
    } else {
      state = new State(generateCustomerId(), sessionId);
      sessions.set(sessionId, state);
    }
    
    // Note: We don't need to add the user message here as the Agent will do it
    // state.addConversationEntry('user', message);
    
    // Classify intent
    const intentClassification = await classifyIntent(message, state);
    
    // Create agent with the state
    const agent = new Agent(state);
    
    // Process the message and get response
    const response = await agent.handleRequest(intentClassification, message);
    
    // Note: We don't need to add the assistant message here as the response generator already did it
    // state.addConversationEntry('assistant', response);
    
    // Return response
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

// Serve React app for any other route
app.get('*', (_, res) => {
  res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

// Start server
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

export default app; 