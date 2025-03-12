# Sierra Outfitters AI Agent

An AI-powered customer service agent for Sierra Outfitters, an outdoor gear and apparel company. This agent can handle various customer inquiries, provide hiking recommendations, manage promotional codes, check order status, and more.

## 🌟 Features

- **Intent Classification**: Automatically identifies customer intents from natural language
- **Hiking Recommendations**: Suggests trails based on location, difficulty, and length preferences
- **Order Status Tracking**: Allows customers to check their order status
- **Early Risers Promotion**: Manages time-sensitive promotional codes
- **FAQ Search**: Answers common questions using embedded knowledge base
- **Human Handoff**: Seamlessly transfers complex issues to human agents
- **Conversation Management**: Maintains context throughout customer interactions
- **Unresolved Intent Tracking**: Follows up on previously mentioned but unresolved requests
- **Product Recommendations**: Suggests products based on customer preferences and history

## 🛠️ Technical Architecture

The project is built with a modular architecture that separates concerns:

### Core Components

- **State Management**: Centralized state tracking for conversation history and customer data
- **Intent Classification**: NLP-based intent detection using OpenAI's models
- **Tool System**: Pluggable tools that handle specific customer intents
- **Response Generation**: Context-aware response creation
- **Agent System**: Coordinates tools and manages conversation flow

### Directory Structure

```
src/
├── config/         # Configuration constants and environment setup
├── core/           # Core application components
│   ├── agent/      # Agent implementation for handling requests
│   └── state/      # State management for conversation and user data
├── data/           # Static data and sample information
├── prompts/        # System prompts for AI interactions
│   ├── system-prompts.ts          # Main system prompts
│   ├── hiking-prompts.ts          # Hiking-specific prompts
│   ├── order-status-prompts.ts    # Order status prompts
│   ├── early-riser-prompts.ts     # Early riser promotion prompts
│   ├── human-handoff-prompts.ts   # Human handoff prompts
│   ├── company-faq-prompts.ts     # FAQ prompts
│   └── product-prompts.ts         # Product recommendation prompts
├── services/       # Service implementations
│   ├── ai/         # AI service integrations (OpenAI)
│   │   ├── intent-classifier.ts   # Intent classification
│   │   ├── openai-service.ts      # OpenAI API integration
│   │   └── response-generator.ts  # Response generation
│   ├── api/        # External API integrations
│   │   ├── clients.ts             # API client initialization
│   │   ├── endpoints.ts           # API endpoint definitions
│   │   └── external-api-service.ts # External API service
│   └── tools/      # Intent-specific tool implementations
│       ├── toolExport.ts          # Tool registry and exports
│       ├── orderStatusTool.ts     # Order status tool
│       ├── hikingRecommendationTool.ts # Hiking recommendation tool
│       ├── earlyRiserTool.ts      # Early riser promotion tool
│       ├── searchFAQTool.ts       # FAQ search tool
│       ├── humanHandoffTool.ts    # Human handoff tool
│       ├── generalRequestTool.ts  # General inquiry tool
│       ├── productInventory.ts    # Product inventory tool
│       └── productRecommendation.ts # Product recommendation tool
├── types/          # TypeScript type definitions
└── utils/          # Utility functions
    ├── formatting.ts              # Data formatting utilities
    └── utils.ts                   # General utilities
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- OpenAI API key
- Mailgun API key (for email functionality)
- Pinecone API key (for FAQ and product embeddings)
- OpenWeather API key (for weather data in hiking recommendations)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/sierra-agent.git
   cd sierra-agent
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with your API keys:
   ```
   OPENAI_API_KEY=your_openai_api_key
   MAILGUN_API_KEY=your_mailgun_api_key
   MAILGUN_DOMAIN=your_mailgun_domain
   PINECONE_API_KEY=your_pinecone_api_key
   OPEN_WEATHER_API_KEY=your_openweather_api_key
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## 💻 Usage

The agent can be interacted with through a command-line interface for development purposes:

```bash
npm start
```

Example interactions:

- "What's the status of my order SO-12345?"
- "Can I get hiking recommendations near Denver?"
- "Tell me about the Early Risers promotion"
- "I need help with my recent purchase"
- "Can you recommend products for hiking in cold weather?"

## 🧩 Key Components

### Intent Classification

The agent uses a sophisticated intent classification system to understand customer requests. It can identify multiple intents in a single message and extract relevant parameters.

### State Management

The `State` class maintains conversation context, customer preferences, order information, and tracks unresolved intents. This allows the agent to provide personalized responses and follow up on previous requests.

### Tool System

Each customer intent is handled by a specialized tool:

- `orderStatusTool`: Checks order status
- `hikingRecommendationTool`: Provides hiking trail recommendations
- `earlyRisersTool`: Manages the Early Risers promotion
- `searchFaqTool`: Searches the knowledge base for answers
- `humanHelpTool`: Transfers to human customer support
- `productInventoryTool`: Checks product inventory
- `productRecommendationTool`: Provides product recommendations
- `generalTool`: Handles general inquiries and fallbacks

### Response Generation

The agent generates natural, conversational responses using carefully crafted prompts and OpenAI's language models.

## 🔧 Development

### Adding a New Tool

1. Create a new file in `src/services/tools/`
2. Implement the `Tool` interface
3. Add the tool to the `tools` object in `src/services/tools/toolExport.ts`
4. Update the intent classification prompt in `src/prompts/system-prompts.ts`

### Modifying Prompts

System prompts are stored in `src/prompts/system-prompts.ts` and can be modified to adjust the agent's behavior and responses. Specialized prompts for specific tools are in their respective files in the `prompts` directory.

### Running Tests

```bash
npm test
```
