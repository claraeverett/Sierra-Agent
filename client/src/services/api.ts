import axios from 'axios';

/**
 * API Service for Sierra Outfitters Assistant
 * Handles communication between the client and server
 */

// Base URL for the API - use environment variable or default to localhost
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

// Create an axios instance with default configuration
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Interface for chat message request payload
 */
interface ChatMessageRequest {
  message: string;                // The user's message text
  sessionId?: string;             // Optional session ID for continuing conversations
  userId?: string;                // For backward compatibility
}

/**
 * Interface for chat message response from the server
 */
interface ChatMessageResponse {
  response: string;               // The assistant's response text
  sessionId: string;              // Session ID for maintaining conversation state
  conversationHistory: Array<{    // Full conversation history
    role: 'user' | 'assistant' | 'system';
    content: string;
  }>;
  // Fields below are for backward compatibility
  message?: string;               // Alias for response
  intent?: string;                // Detected intent
  parameters?: Record<string, any>; // Intent parameters
  userId?: string;                // User identifier
}

/**
 * API service object with methods for interacting with the server
 */
const apiService = {
  /**
   * Sends a message to the Sierra assistant and returns the response
   * @param data Request data containing the message and optional session ID
   * @returns Promise resolving to the assistant's response
   */
  sendMessage: async (data: ChatMessageRequest): Promise<ChatMessageResponse> => {
    try {
      // Call the message API endpoint
      const response = await apiClient.post('/message', data);
      
      // Process the response data
      const responseData = response.data;
      
      // Handle the new response format (with 'response' field)
      if (responseData.response) {
        return {
          ...responseData,
          // Add backward compatibility field
          message: responseData.response
        };
      }
      
      // Return the original response format for backward compatibility
      return responseData;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  },
};

export default apiService; 