import React from 'react';
import Chat from './components/Chat';

function App() {
  return (
    <div className="min-h-screen flex flex-col" style={{
      //backgroundImage: 'url("https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2070")',
      backgroundImage: 'url("/img/background.jpeg")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat'
    }}>
      <header className="p-4 flex justify-center items-center">
        <div className="text-center">
          <img src="/img/logo.png" alt="Sierra Outdoors Logo" className="h-16 mx-auto mb-2" />
          <h1 className="text-2xl font-bold text-white">Sierra Outdoors</h1>
        </div>
      </header>
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-3xl h-[600px] flex flex-col">
          <Chat />
        </div>
      </main>
    </div>
  );
}

export default App; 