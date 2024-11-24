// backend/server.js
const express = require('express');
const cors = require('cors');
const OpenAI = require('openai');
require('dotenv').config();
const similarity = require('compute-cosine-similarity');

const app = express();
const port = process.env.PORT || 5001;

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  res.header('Access-Control-Allow-Credentials', 'true');

  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
    return;
  }
  next();
});

app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const splitIntoChunks = (text, maxChunkSize = 3000) => {
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [];
  const chunks = [];
  let currentChunk = '';

  for (const sentence of sentences) {
    if ((currentChunk + sentence).length > maxChunkSize) {
      chunks.push(currentChunk);
      currentChunk = sentence;
    } else {
      currentChunk += sentence;
    }
  }
  if (currentChunk) chunks.push(currentChunk);
  return chunks;
};

// Add this function to calculate cosine similarity
function cosineSimilarity(a, b) {
  return similarity(a, b);
}

// Add this function to get embeddings from OpenAI
async function getEmbedding(text) {
  const response = await openai.embeddings.create({
    model: 'text-embedding-ada-002',
    input: text,
  });
  return response.data[0].embedding;
}

// Endpoint to handle chat
app.post('/api/chat', async (req, res) => {
  try {
    const { question, context } = req.body;
    const chunks = splitIntoChunks(context);

    // Get embeddings for question and chunks
    const questionEmbedding = await getEmbedding(question);
    const chunkEmbeddings = await Promise.all(
      chunks.map((chunk) => getEmbedding(chunk))
    );

    // Calculate similarities and find most relevant chunk
    const similarities = chunkEmbeddings.map((chunkEmb) =>
      cosineSimilarity(questionEmbedding, chunkEmb)
    );
    const mostRelevantIndex = similarities.indexOf(Math.max(...similarities));
    const mostRelevantChunk = chunks[mostRelevantIndex];

    const prompt = `Use the following context to answer the question. If the context doesn't contain relevant information, say so.

Context: ${mostRelevantChunk}

Question: ${question}
Answer:`;

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content:
            'You are a helpful assistant that answers questions based on the given context.',
        },
        { role: 'user', content: prompt },
      ],
      max_tokens: 500,
      temperature: 0.7,
    });

    res.json({ answer: response.choices[0].message.content.trim() });
  } catch (error) {
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      response: error.response?.data,
    });

    res.status(500).json({
      error: 'Internal server error',
      details: error.message,
    });
  }
});

// Modified listen handler with error handling
const startServer = () => {
  app
    .listen(port, () => {
      console.log(`Server is running on port ${port}`);
    })
    .on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.log(`Port ${port} is busy, trying ${port + 1}`);
        port++;
        startServer();
      } else {
        console.error(err);
      }
    });
};

startServer();
