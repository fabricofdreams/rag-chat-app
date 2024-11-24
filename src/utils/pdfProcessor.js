// src/utils/pdfProcessor.js
import * as pdfjsLib from 'pdfjs-dist/webpack';

export const extractTextFromPDF = async (file) => {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  let textContent = '';

  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const text = await page.getTextContent();
    const pageText = text.items.map((item) => item.str).join(' ');
    textContent += pageText + '\n';
  }

  return textContent;
};
