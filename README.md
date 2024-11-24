# RAG Chat App

A React-based chat application that implements Retrieval-Augmented Generation (RAG) to provide context-aware responses using PDF documents.

## Features

- PDF document upload and processing
- Text chunking and embedding generation
- Semantic search using vector similarity
- Context-aware AI responses using OpenAI's GPT-3.5
- Real-time chat interface
- Chat history persistence
- Responsive design with Tailwind CSS

## Prerequisites

Before running the application, make sure you have:

- Node.js (v14 or higher)
- npm or yarn
- OpenAI API key

## Installation

1. Clone the repository:

```

This updated README:
1. Describes the project's features and architecture
2. Provides clear installation and setup instructions
3. Includes usage guidelines
4. Lists technical details and available scripts
5. Adds sections for contributing and licensing

The original Create React App documentation has been removed since it's less relevant to the actual application. Let me know if you'd like any adjustments to this documentation!

The application will be available at [http://localhost:3000](http://localhost:3000).

## Usage

1. Upload PDF documents using the drag-and-drop interface
2. Wait for the documents to be processed and embedded
3. Ask questions in the chat interface
4. Receive AI-generated answers based on the content of your documents

## Technical Details

- Frontend: React with Tailwind CSS
- Backend: Express.js
- Document Processing: PDF.js
- Embeddings: TensorFlow Universal Sentence Encoder (frontend) & OpenAI Embeddings (backend)
- Vector Similarity: Cosine similarity
- Chat: OpenAI GPT-3.5 Turbo

## Available Scripts

- `npm start`: Run the frontend development server
- `npm build`: Build the frontend for production
- `npm test`: Run frontend tests
- `npm eject`: Eject from Create React App

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

ISC
```
