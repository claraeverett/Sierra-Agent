# Sierra UI

A modern React-based user interface for the Sierra Assistant, an intelligent hiking and outdoor adventure assistant.

## Features

- Interactive chat interface
- Real-time responses to user queries
- Information about hiking trails, weather conditions, and outdoor activities
- Responsive design with TailwindCSS

## Tech Stack

- React 18
- TypeScript
- TailwindCSS
- Axios for API communication

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository
2. Navigate to the project directory:
   ```
   cd sierra-ui
   ```
3. Install dependencies:
   ```
   npm install
   ```
   or
   ```
   yarn install
   ```

### Development

Start the development server:

```
npm start
```

or

```
yarn start
```

The application will be available at [http://localhost:3000](http://localhost:3000).

### Building for Production

Build the application for production:

```
npm run build
```

or

```
yarn build
```

The build artifacts will be stored in the `build/` directory.

## Project Structure

- `public/` - Static assets and HTML template
- `src/` - Source code
  - `components/` - React components
  - `services/` - API and utility services
  - `App.tsx` - Main application component
  - `index.tsx` - Application entry point

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```
REACT_APP_API_URL=http://localhost:3001/api
```

## License

This project is licensed under the MIT License. 