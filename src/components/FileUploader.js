// src/components/FileUploader.js
import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

const FileUploader = ({ onFilesAdded }) => {
  const onDrop = useCallback(
    (acceptedFiles) => {
      // Filter PDF files
      const pdfFiles = acceptedFiles.filter(
        (file) => file.type === 'application/pdf'
      );
      onFilesAdded(pdfFiles);
    },
    [onFilesAdded]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: 'application/pdf',
  });

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed p-6 text-center cursor-pointer ${
        isDragActive ? 'border-blue-400' : 'border-gray-300'
      }`}
    >
      <input {...getInputProps()} />
      {isDragActive ? (
        <p>Drop the files here ...</p>
      ) : (
        <p>Drag and drop PDF files here, or click to select files</p>
      )}
    </div>
  );
};

export default FileUploader;
