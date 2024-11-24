import React, { useState, useEffect } from 'react';
import axios from 'axios';
import FileUploader from './components/FileUploader';
import ChatInterface from './components/ChatInterface';
import { extractTextFromPDF } from './utils/pdfProcessor';
import { chunkText } from './utils/textChunker';
import { getEmbeddings } from './utils/embeddings';
import { VectorStore } from './utils/vectorStore';

const vectorStore = new VectorStore();

function App() {
  const [files, setFiles] = useState([]);
  const [chatHistory, setChatHistory] = useState([]);

  useEffect(() => {
    // Load chat history from localStorage on mount
    const savedChat = localStorage.getItem('chatHistory');
    if (savedChat) {
      setChatHistory(JSON.parse(savedChat));
    }
  }, []);

  useEffect(() => {
    // Save chat history to localStorage whenever it changes
    localStorage.setItem('chatHistory', JSON.stringify(chatHistory));
  }, [chatHistory]);

  const handleFilesAdded = async (newFiles) => {
    setFiles((prevFiles) => [...prevFiles, ...newFiles]);

    for (const file of newFiles) {
      const text = await extractTextFromPDF(file);
      const textChunks = chunkText(text);
      const newEmbeddings = await getEmbeddings(textChunks);

      textChunks.forEach((chunk, idx) => {
        vectorStore.add(chunk, newEmbeddings[idx]);
      });
    }
  };

  const handleSendMessage = async (message) => {
    // Add user message to chat history
    setChatHistory((prev) => [...prev, { sender: 'user', message }]);

    // Generate AI response
    const response = await generateAIResponse(message);
    setChatHistory((prev) => [...prev, { sender: 'ai', message: response }]);
  };

  const generateAIResponse = async (question) => {
    // Retrieve relevant chunks from vector store
    const questionEmbedding = await getEmbeddings([question]);
    const relevantChunks = vectorStore.search(questionEmbedding[0], 5);
    const context = relevantChunks.map((chunk) => chunk.text).join('\n');

    // Send to backend
    try {
      const res = await axios.post(
        'http://localhost:5001/api/chat',
        {
          question,
          context,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        }
      );
      return res.data.answer;
    } catch (error) {
      console.error(error);
      return "I'm sorry, I couldn't process your request.";
    }
  };

  const handleDeleteFile = (index) => {
    const fileToRemove = files[index];
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
    // Reset vector store and re-add remaining files
    vectorStore.store = [];
    files
      .filter((_, i) => i !== index)
      .forEach(async (file) => {
        const text = await extractTextFromPDF(file);
        const textChunks = chunkText(text);
        const newEmbeddings = await getEmbeddings(textChunks);
        textChunks.forEach((chunk, idx) => {
          vectorStore.add(chunk, newEmbeddings[idx]);
        });
      });
  };

  const handleRefreshChat = () => {
    setChatHistory([]);
  };

  const handleClearChat = () => {
    setChatHistory([]);
    localStorage.removeItem('chatHistory');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-4xl font-bold mb-6">RAG Chat App</h1>
      <FileUploader onFilesAdded={handleFilesAdded} />
      {/* Display uploaded files */}
      <div className="mt-4 w-full max-w-md">
        {files.length > 0 && (
          <ul className="list-disc pl-5">
            {files.map((file, index) => (
              <li key={index} className="flex justify-between items-center">
                {file.name}
                <button
                  className="text-red-500 hover:text-red-700"
                  onClick={() => handleDeleteFile(index)}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
      {/* Chat Controls */}
      <div className="mt-4 w-full max-w-md flex justify-end">
        <button
          className="bg-yellow-500 text-white px-3 py-1 rounded mr-2"
          onClick={handleRefreshChat}
        >
          Refresh Chat
        </button>
        <button
          className="bg-red-500 text-white px-3 py-1 rounded"
          onClick={handleClearChat}
        >
          Clear Chat
        </button>
      </div>
      {/* Chat Interface */}
      <ChatInterface
        onSendMessage={handleSendMessage}
        chatHistory={chatHistory}
      />
    </div>
  );
}

export default App;
