import React from 'react';
import ChatBot from './components/ChatBot';

function App() {
  return (
    <div className="min-h-screen bg-gray-900">
      {/* Your existing app content goes here */}
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-white text-center mb-8">
          Welcome to Your Website
        </h1>
        <p className="text-gray-300 text-center max-w-2xl mx-auto">
          Your website is now enhanced with an AI-powered chatbot that supports multiple languages 
          including English, Hindi, Punjabi, Tamil, and Malayalam. The chatbot features voice input 
          and text-to-speech capabilities for a complete multilingual experience.
        </p>
      </div>
      
      {/* AI Chatbot Component */}
      <ChatBot />
    </div>
  );
}

export default App;
