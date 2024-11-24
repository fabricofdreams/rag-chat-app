// src/utils/embeddings.js
import * as tf from '@tensorflow/tfjs';
import * as use from '@tensorflow-models/universal-sentence-encoder';

let model = null;

export const loadModel = async () => {
  // Initialize tensorflow backend
  await tf.ready();

  if (!model) {
    model = await use.load();
  }
  return model;
};

export const getEmbeddings = async (texts) => {
  const model = await loadModel();
  const embeddings = await model.embed(texts);
  return embeddings.arraySync();
};
