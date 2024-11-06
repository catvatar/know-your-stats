import React from 'react';
import Stopwatches from './components/Stopwatches';

function App() {
  return (
    <div className="App bg-gray-900 text-white min-h-screen p-8">
      <h1 className="text-4xl font-bold underline mb-8 text-center">
        Know your stats
      </h1>
      <Stopwatches/>
    </div>
  );
}

export default App;
