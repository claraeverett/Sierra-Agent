/**
 * App component to handle the main application
 * @returns The main application component
 */

import Chat from './components/Chat';

function App() {
  return (
    <div className="relative min-h-screen w-full">
      {/* Background div with fixed position */}
      <div className="fixed top-0 left-0 w-full h-full z-0" style={{
        backgroundImage: 'url("/img/background.jpeg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        width: '100%',
        height: '100vh'
      }}></div>
      
      {/* Content container */}
      <div className="relative z-10 min-h-screen flex flex-col w-full overflow-hidden">
        <header className="p-6 flex justify-center items-center flex-shrink-0">
          <div className="text-center">
            <img 
              src="/img/logo.png" 
              alt="Sierra Outfitters Logo" 
              className="h-24 mx-auto mb-3 logo-animation" 
            />
            <h1 className="text-3xl font-bold text-white drop-shadow-lg title-text">Sierra Outfitters</h1>
          </div>
        </header>
        <main className="flex-1 flex items-center justify-center p-4 min-h-0 overflow-hidden">
          <div className="w-full max-w-3xl h-[800px] max-h-[calc(100vh-180px)] flex flex-col">
            <Chat />
          </div>
        </main>
      </div>
    </div>
  );
}

export default App; 