import axios from 'axios';

// Base URL for the API
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

// Create an axios instance with default config
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interface for chat message request
interface ChatMessageRequest {
  message: string;
  sessionId?: string;
  userId?: string; // For backward compatibility
}

// Interface for chat message response
interface ChatMessageResponse {
  response: string;
  sessionId: string;
  conversationHistory: Array<{
    role: 'user' | 'assistant' | 'system';
    content: string;
  }>;
  // For backward compatibility
  message?: string;
  intent?: string;
  parameters?: Record<string, any>;
  userId?: string;
}

// API service object
const apiService = {
  // Send a message to the Sierra assistant
  sendMessage: async (data: ChatMessageRequest): Promise<ChatMessageResponse> => {
    try {
      // Call the actual API endpoint
      const response = await apiClient.post('/message', data);
      console.log("Response", response);
      
      // Handle both new and old response formats
      const responseData = response.data;
      
      // If the response has the new format
      if (responseData.response) {
        return {
          ...responseData,
          // For backward compatibility
          message: responseData.response
        };
      }
      
      // Return the original response for backward compatibility
      return responseData;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  },
};

export default apiService; 