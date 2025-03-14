/**
 * Tools Export Adapter for Express Server
 * 
 * This file provides a JavaScript adapter for tools
 * to work with the Express server.
 */

// Simple tool implementations
const tools = [
  {
    name: 'general',
    description: 'Handle general inquiries',
    execute: async (params, state) => {
      return {
        success: true,
        promptTemplate: `I'm here to help with your outdoor adventure needs! You can ask me about hiking trails, order status, early risers promotion, and more.`
      };
    }
  },
  {
    name: 'hikingrecommendation',
    description: 'Provide hiking recommendations',
    execute: async (params, state) => {
      const { location = 'Denver, CO', difficulty = 'moderate', length = 5 } = params;
      return {
        success: true,
        promptTemplate: `Based on your preferences, I recommend hiking in ${location}. There are several ${difficulty} trails that are around ${length} miles long in that area. Would you like more specific trail recommendations?`
      };
    }
  },
  {
    name: 'orderstatus',
    description: 'Check order status',
    execute: async (params, state) => {
      const { orderId = 'unknown', email = 'unknown' } = params;
      return {
        success: true,
        promptTemplate: `I've checked the status of order ${orderId}. It's currently in processing. You should receive an email update at ${email} soon.`
      };
    }
  },
  {
    name: 'earlyrisers',
    description: 'Handle Early Risers promotion',
    execute: async (params, state) => {
      return {
        success: true,
        promptTemplate: `The Early Risers promotion is available from 8-10 AM PT. During this time, you can get a 10% discount on your purchase with a special promo code.`
      };
    }
  },
  {
    name: 'humanhelp',
    description: 'Request human assistance',
    execute: async (params, state) => {
      return {
        success: true,
        promptTemplate: `I'll connect you with a human representative. A customer service agent will contact you shortly to assist with your request.`
      };
    }
  },
  {
    name: 'productinventory',
    description: 'Check product inventory',
    execute: async (params, state) => {
      const { productName = 'unknown', productSku = 'unknown' } = params;
      return {
        success: true,
        promptTemplate: `I've checked our inventory for ${productName} (SKU: ${productSku}). We currently have this item in stock and ready to ship.`
      };
    }
  },
  {
    name: 'productrecommendation',
    description: 'Recommend products',
    execute: async (params, state) => {
      return {
        success: true,
        promptTemplate: `Based on your interests, I recommend our premium hiking boots, lightweight backpacks, and moisture-wicking clothing for your outdoor adventures.`
      };
    }
  },
  {
    name: 'searchfaq',
    description: 'Search FAQ',
    execute: async (params, state) => {
      const { query = '' } = params;
      return {
        success: true,
        promptTemplate: `I found some information in our FAQ that might help with your question about "${query}". Our return policy allows returns within 30 days of purchase, and we offer free shipping on orders over $50.`
      };
    }
  }
];

// Export the tools
module.exports = { tools }; 