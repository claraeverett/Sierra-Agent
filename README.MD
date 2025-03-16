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
- **Order Issue Resolution**: Helps customers resolve issues with their orders
- **Web Interface**: Modern React-based UI with responsive design for all devices

## 🛠️ Technical Architecture

The project is built with a modular architecture that separates concerns:

### Core Components

- **State Management**: Centralized state tracking for conversation history and customer data
- **Intent Classification**: NLP-based intent detection using OpenAI's models
- **Tool System**: Pluggable tools that handle specific customer intents
- **Response Generation**: Context-aware response creation
- **Agent System**: Coordinates tools and manages conversation flow
- **Web UI**: React-based user interface with TailwindCSS

### Directory Structure

```
/
├── package.json            # Root package.json for monorepo management
├── client/                 # Frontend React application
│   ├── public/             # Static assets
│   ├── src/                # Frontend source code
│   │   ├── components/     # React components
│   │   ├── services/       # Frontend services
│   │   ├── styles/         # Additional style files
│   │   └── App.tsx         # Main application component
│   └── package.json        # Client dependencies
└── server/                 # Backend application
    ├── src/                # Backend source code
    │   ├── config/         # Configuration constants and environment setup
    │   ├── core/           # Core application components
    │   │   ├── agent/      # Agent implementation for handling requests
    │   │   └── state/      # State management for conversation and user data
    │   ├── data/           # Static data and sample information
    │   ├── prompts/        # System prompts for AI interactions
    │   ├── services/       # Service implementations
    │   │   ├── ai/         # AI service integrations (OpenAI)
    │   │   ├── api/        # External API integrations
    │   │   └── tools/      # Intent-specific tool implementations
    │   ├── types/          # TypeScript type definitions
    │   ├── utils/          # Utility functions
    │   ├── index.ts        # CLI entry point
    │   └── server.ts       # Web server entry point
    ├── .env                # Environment variables
    └── package.json        # Server dependencies
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

1. Download the repository:
   ```bash
   # Download and extract the zip file
   
   cd sierra-agent
   ```

2. Install all dependencies (root, client, and server):
   ```bash
   npm run install:all
   ```

3. Create a `.env` file in the server directory with your API keys:
   ```
   OPENAI_API_KEY=your_openai_api_key        # Required for AI functionality
   MAILGUN_API_KEY=your_mailgun_api_key      # Required for email notifications
   MAILGUN_DOMAIN=your_mailgun_domain        # Your Mailgun domain
   PINECONE_API_KEY=your_pinecone_api_key    # Required for vector database
   OPEN_WEATHER_API_KEY=your_openweather_api_key  # Required for weather data
   PORT=3001                                 # Server port (optional)
   ```

### Running the Application

#### Command Line Interface (CLI)

To run the agent in CLI mode for testing:

```bash
npm run start:cli
```

This will start the agent in interactive mode, allowing you to chat with it directly in your terminal. Type `exit` to quit the session.

#### Web Interface

To run the complete application (both server and client):

```bash
npm run dev
```

This will start both the server and client in development mode. The client will be available at http://localhost:3000 and the server at http://localhost:3001.

To run the server and client separately:

1. Start the server:
   ```bash
   npm run dev:server
   ```

2. Start the client:
   ```bash
   npm run dev:client
   ```

### Building for Production

To build both client and server for production:

```bash
npm run build
```

To run the production build:

```bash
# First build the project
npm run build
# Then start the server
npm run start:server
```

## 💻 Usage

The agent can be interacted with through the web interface or through a command-line interface for development purposes.

Example interactions:

- "What's the status of my order SO-12345?"
- "Can I get hiking recommendations near Denver?"
- "Tell me about the Early Risers promotion"
- "I need help with my recent purchase"
- "Can you recommend products for hiking in cold weather?"
- "I have an issue with my order W001"

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
- `resolveOrderIssueTool`: Helps resolve issues with orders
- `generalTool`: Handles general inquiries and fallbacks

### Web Interface

The web interface is built with React and TailwindCSS, providing a modern and responsive user experience. It includes:

- Chat interface with message history
- Real-time responses
- Session persistence
- Responsive design for all devices
- Background image and styling

## 🔧 Development

### Project Structure

The project is organized as a monorepo with separate client and server packages:

- **Root**: Contains scripts to coordinate both client and server
- **Client**: React-based frontend application
- **Server**: Express-based backend with two entry points:
  - `index.ts`: CLI interface for testing
  - `server.ts`: Web server for API endpoints

### Adding a New Tool

1. Create a new file in `server/src/services/tools/`
2. Implement the `Tool` interface
3. Add the tool to the `tools` object in `server/src/services/tools/toolExport.ts`
4. Update the intent classification prompt in `server/src/prompts/system-prompts.ts`

### Modifying Prompts

System prompts are stored in `server/src/prompts/system-prompts.ts` and can be modified to adjust the agent's behavior and responses. Specialized prompts for specific tools are in their respective files in the `prompts` directory.

### Available Scripts

#### Root Scripts
- `install:all`: Install dependencies for root, client, and server
- `start:cli`: Run the CLI interface
- `start:server`: Run the web server
- `start:client`: Run the client
- `dev:cli`: Run the CLI interface in development mode
- `dev:server`: Run the server in development mode
- `dev:client`: Run the client in development mode
- `dev`: Run both server and client in development mode
- `build:server`: Build the server for production
- `build:client`: Build the client for production
- `build`: Build both server and client for production
- `test`: Run tests

#### Server Scripts
- `start`: Run the CLI interface
- `start:server`: Run the web server
- `dev`: Run the CLI interface in development mode
- `dev:server`: Run the web server in development mode
- `build`: Build the server for production
- `build:ui`: Build the client from the server directory
- `build:all`: Build both server and client
- `setup`: Run setup script
- `start:ui`: Start the client from the server directory
- `dev:ui`: Start the client in development mode from the server directory
- `dev:full`: Run both server and client in development mode
- `test`: Run tests
- `lint`: Run ESLint
- `format`: Format code with Prettier

#### Client Scripts
- `start`: Run the client in development mode
- `build`: Build the client for production
- `test`: Run client tests
- `eject`: Eject from Create React App
- `build:css`: Build CSS with Tailwind
