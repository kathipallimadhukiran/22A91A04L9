import React from 'react';
import URLShortener from './components/URLShortener';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>URL Shortener</h1>
      </header>
      <main>
        <URLShortener />
      </main>
    </div>
  );
}

export default App; 