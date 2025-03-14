/**
 * Intent Classifier Adapter for Express Server
 * 
 * This file provides a JavaScript adapter for intent classification
 * to work with the Express server.
 */

// Simple intent classifier implementation
async function classifyIntent(message, state) {
  // For demo purposes, we'll use a simple rule-based classifier
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('hike') || lowerMessage.includes('trail') || lowerMessage.includes('hiking')) {
    return {
      intents: ['HikingRecommendation'],
      params: {
        location: extractLocation(lowerMessage) || 'Denver, CO',
        difficulty: extractDifficulty(lowerMessage) || 'moderate',
        length: extractLength(lowerMessage) || 5
      }
    };
  } else if (lowerMessage.includes('order') && (lowerMessage.includes('status') || lowerMessage.includes('track'))) {
    return {
      intents: ['OrderStatus'],
      params: {
        orderId: extractOrderId(lowerMessage),
        email: extractEmail(lowerMessage)
      }
    };
  } else if (lowerMessage.includes('early') && lowerMessage.includes('riser')) {
    return {
      intents: ['EarlyRisers'],
      params: {
        productName: extractProductName(lowerMessage)
      }
    };
  } else if (lowerMessage.includes('help') && (lowerMessage.includes('human') || lowerMessage.includes('person') || lowerMessage.includes('agent'))) {
    return {
      intents: ['HumanHelp'],
      params: {
        customerRequest: message
      }
    };
  } else if (lowerMessage.includes('product') || lowerMessage.includes('inventory') || lowerMessage.includes('stock')) {
    return {
      intents: ['ProductInventory'],
      params: {
        productName: extractProductName(lowerMessage),
        productSku: extractSku(lowerMessage),
        query: message
      }
    };
  } else if (lowerMessage.includes('recommend') || lowerMessage.includes('suggestion')) {
    return {
      intents: ['ProductRecommendation'],
      params: {
        query: message
      }
    };
  } else if (lowerMessage.includes('faq') || lowerMessage.includes('question') || lowerMessage.includes('how do i')) {
    return {
      intents: ['SearchFAQ'],
      params: {
        query: message
      }
    };
  } else {
    return {
      intents: ['General'],
      params: {
        customerRequest: message
      }
    };
  }
}

// Helper functions for extracting parameters
function extractLocation(message) {
  const locationMatches = message.match(/(?:in|near|around|at)\s+([A-Za-z\s,]+)/i);
  return locationMatches ? locationMatches[1].trim() : null;
}

function extractDifficulty(message) {
  if (message.includes('easy')) return 'easy';
  if (message.includes('hard') || message.includes('difficult')) return 'hard';
  return 'moderate';
}

function extractLength(message) {
  const lengthMatches = message.match(/(\d+)(?:\s*-\s*\d+)?\s*(?:mile|mi)/i);
  return lengthMatches ? parseInt(lengthMatches[1]) : null;
}

function extractOrderId(message) {
  const orderMatches = message.match(/(?:order|#)\s*([A-Za-z0-9-]+)/i);
  return orderMatches ? orderMatches[1].trim() : null;
}

function extractEmail(message) {
  const emailMatches = message.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/i);
  return emailMatches ? emailMatches[1] : null;
}

function extractProductName(message) {
  // This is a simplified version - in a real system, you'd use NER or a more sophisticated approach
  const productMatches = message.match(/(?:product|item|buy|purchase)\s+([A-Za-z\s]+)/i);
  return productMatches ? productMatches[1].trim() : null;
}

function extractSku(message) {
  const skuMatches = message.match(/(?:sku|item number|product code)\s*([A-Za-z0-9-]+)/i);
  return skuMatches ? skuMatches[1].trim() : null;
}

// Export the classifyIntent function
module.exports = { classifyIntent }; 