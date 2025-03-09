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

## 🛠️ Technical Architecture

The project is built with a modular architecture that separates concerns:

### Core Components

- **State Management**: Centralized state tracking for conversation history and customer data
- **Intent Classification**: NLP-based intent detection using OpenAI's models
- **Tool System**: Pluggable tools that handle specific customer intents
- **Response Generation**: Context-aware response creation

### Directory Structure

```
src/
├── config/         # Configuration constants and environment setup
├── prompts/        # System prompts for AI interactions
├── services/       # Core service implementations
│   ├── ai/         # AI service integrations (OpenAI)
│   ├── api/        # External API integrations
│   └── tools/      # Intent-specific tool implementations
├── state/          # State management
├── types/          # TypeScript type definitions
└── utils/          # Utility functions
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- OpenAI API key
- Mailgun API key (for email functionality)
- Pinecone API key (for FAQ embeddings)

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
- `generalTool`: Handles general inquiries and fallbacks

### Response Generation

The agent generates natural, conversational responses using carefully crafted prompts and OpenAI's language models.

## 🔧 Development

### Adding a New Tool

1. Create a new file in `src/services/tools/`
2. Implement the `Tool` interface
3. Add the tool to the `tools` object in `src/services/tools/toolsExport.ts`
4. Update the intent classification prompt in `src/prompts/systemPrompts.ts`

### Modifying Prompts

System prompts are stored in `src/prompts/systemPrompts.ts` and can be modified to adjust the agent's behavior and responses.

### Running Tests

```bash
npm test
```

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- OpenAI for providing the language models
- Pinecone for vector database capabilities
- Mailgun for email functionality
- OpenWeatherMap for weather data integration
