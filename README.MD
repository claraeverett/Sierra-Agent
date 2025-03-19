# Sierra Outfitters AI Agent

An AI-powered customer service agent for Sierra Outfitters, an outdoor gear and apparel company. This agent can handle various customer inquiries, provide hiking recommendations, manage promotional codes, check order status, and more.

## 🚀 Quick Start

```bash
# 1. Download and extract the project
# 2. Navigate to the project directory
cd sierra-agent

# 3. Install all dependencies
npm run install:all

# 4. Create .env file in the server directory with your API keys

# 5. Run the web application
npm run dev
```

After running `npm run dev`, the web interface will be available at http://localhost:3000

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
- **Multilingual Support**: Handles conversations in multiple languages including English and Spanish
- **Web Interface**: Modern React-based UI with responsive design for all devices

## 🛠️ Technical Architecture

The project is built with a modular architecture: 

### Core Components

- **State Management**: Centralized state tracking for conversation history and customer data
- **Intent Classification**: NLP-based intent detection using OpenAI's 4o model
- **Tool System**: Pluggable tools that handle specific customer intents
- **Response Generation**: Context-aware response creation
- **Agent System**: Coordinates tools and manages conversation flow
- **Language Detection**: Automatically detects and responds in the user's language
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
- API keys for the following services:
  - OpenAI API key
  - Mailgun API key (for email functionality)
  - Pinecone API key (for FAQ and product embeddings)
  - OpenWeather API key (for weather data in hiking recommendations)

### Step-by-Step Installation

1. **Download the repository:**
   ```bash
   # Download and extract the zip file to your preferred location
   
   # Navigate to the project directory
   cd sierra-agent
   ```

2. **Install all dependencies:**
   ```bash
   npm run install:all
   ```
   This installs dependencies for:
   - Root project
   - Client (React frontend)
   - Server (Node.js backend)

3. **Set up environment variables:**
   Create a `.env` file in the `server` directory with the following content:
   ```
   OPENAI_API_KEY=your_openai_api_key        # Required for AI functionality
   MAILGUN_API_KEY=your_mailgun_api_key      # Required for email notifications
   MAILGUN_DOMAIN=your_mailgun_domain        # Your Mailgun domain
   PINECONE_API_KEY=your_pinecone_api_key    # Required for vector database
   OPEN_WEATHER_API_KEY=your_openweather_api_key  # Required for weather data
   PORT=3001                                 # Server port (optional)
   ```

   > **Note:** The application requires these API keys to function properly. If you're missing any keys, certain features may not work.

4. **Run the application:**
   ```bash
   npm run dev
   ```
   This single command:
   - Starts the backend server at http://localhost:3001
   - Launches the frontend client at http://localhost:3000
   - Enables all AI chat functionality

### Troubleshooting Installation

If you encounter issues:

- **Error: Module not found**: Run `npm run install:all` again to ensure all dependencies are installed
- **API Errors**: Verify your API keys in the `.env` file
- **Port conflicts**: If port 3000 or 3001 is already in use, modify the PORT in `.env` and update `REACT_APP_API_URL` in client/.env

### Running the Application

#### Primary Method: Web Interface

**To run the complete web application:**

```bash
npm run dev
```

This is the **main command** you should use to run Sierra Outfitters AI Agent. After running this command:
- The web interface will be available at http://localhost:3000
- The backend API will be running at http://localhost:3001

> **Important:** All project features require both the frontend and backend to be running, which this command handles for you.

## 💻 Usage

The agent can be interacted with through the web interface or through a command-line interface for development purposes.

Example interactions:

- "What's the status of my order SO-12345?"
- "Can I get hiking recommendations near Denver?"
- "Tell me about the Early Risers promotion"
- "I need help with my recent purchase"
- "Can you recommend products for hiking in cold weather?"
- "I have an issue with my order W001"
- "¿Me puedes recomendar rutas de senderismo cerca de Madrid?" (Spanish: Can you recommend hiking trails near Madrid?)
- "Estado de mi pedido W002" (Spanish: Status of my order W002)

## 🧩 Key Components

### Intent Classification

The agent uses a sophisticated intent classification system to understand customer requests. It can identify multiple intents in a single message and extract relevant parameters. The system also detects the language of the user's message and responds accordingly.

### State Management

The `State` class maintains conversation context, customer preferences, order information, and tracks unresolved intents. This allows the agent to provide personalized responses and follow up on previous requests. The state also tracks the user's preferred language to ensure consistent communication.

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

### Multilingual Support

The Sierra Agent is designed with multilingual capabilities to serve both English and Spanish speakers:

- **Language Detection**: The agent automatically detects the language of the user's message during intent classification.
  
- **Dynamic Language Adaptation**: The agent responds in the language of the most recent message, allowing for seamless language transitions during a conversation without requiring any special commands or settings.
  
- **Natural Code-Switching**: Users can freely switch between languages mid-conversation (e.g., from English to Spanish and back) and the agent will adapt immediately to match the language of each new message.
  
Example of language transition:
```
User: "What hiking trails do you recommend near Denver?"
Agent: "I'd recommend the following trails near Denver: Bear Peak, Royal Arch Trail..."

User: "¿Y qué tal cerca de Boulder?"
Agent: "En Boulder, te recomendaría estos senderos: Flatirons Vista, Mesa Trail..."

User: "Thanks! What equipment should I bring?"
Agent: "You'll want to bring hiking boots, water, sunscreen..."
```

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
