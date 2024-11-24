// src/utils/vectorStore.js

export class VectorStore {
  constructor() {
    this.store = [];
  }

  add(text, embedding) {
    this.store.push({ text, embedding });
  }

  // Simple cosine similarity
  cosineSimilarity(a, b) {
    const dotProduct = a.reduce((acc, val, idx) => acc + val * b[idx], 0);
    const magnitudeA = Math.sqrt(a.reduce((acc, val) => acc + val * val, 0));
    const magnitudeB = Math.sqrt(b.reduce((acc, val) => acc + val * val, 0));
    return dotProduct / (magnitudeA * magnitudeB);
  }

  // Retrieve top N similar chunks
  search(queryEmbedding, topN = 5) {
    const similarities = this.store.map((item) => ({
      text: item.text,
      similarity: this.cosineSimilarity(queryEmbedding, item.embedding),
    }));
    similarities.sort((a, b) => b.similarity - a.similarity);
    return similarities.slice(0, topN);
  }
}
