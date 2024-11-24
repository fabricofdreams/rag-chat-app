// src/components/ChatInterface.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ChatInterface = ({ onSendMessage, chatHistory }) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim() === '') return;
    onSendMessage(input);
    setInput('');
  };

  return (
    <div className="w-full max-w-md mt-6 flex flex-col h-96 bg-white rounded-lg shadow-md">
      <div className="flex-1 p-4 overflow-y-auto">
        {chatHistory.map((msg, index) => (
          <div
            key={index}
            className={`mb-2 ${
              msg.sender === 'user' ? 'text-right' : 'text-left'
            }`}
          >
            <span
              className={`inline-block px-4 py-2 rounded ${
                msg.sender === 'user'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-800'
              }`}
            >
              {msg.message}
            </span>
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="flex p-4 border-t">
        <input
          type="text"
          className="flex-1 border rounded px-3 py-2 mr-2 focus:outline-none focus:ring"
          placeholder="Ask a question..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatInterface;
