import React, { useState, useRef } from 'react';
import { FileIcon, UploadCloud, X, CheckCircle, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const FileUpload = ({ onFileSelect }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) {
      setIsDragging(true);
    }
  };

  const validateFile = (file) => {
    if (!file) return false;

    // Check file type
    if (file.type !== 'application/pdf') {
      setError('Only PDF files are accepted');
      return false;
    }

    // Reset error state if valid
    setError('');
    return true;
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const droppedFile = e.dataTransfer.files[0];
    if (validateFile(droppedFile)) {
      setFile(droppedFile);
      if (onFileSelect) onFileSelect(droppedFile);
    }
  };

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (validateFile(selectedFile)) {
      setFile(selectedFile);
      if (onFileSelect) onFileSelect(selectedFile);
    }
  };

  const handleBrowseClick = () => {
    fileInputRef.current.click();
  };

  const handleRemoveFile = () => {
    setFile(null);
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    if (onFileSelect) onFileSelect(null);
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' bytes';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };

  const dragOverlayVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  };

  const uploadIconVariants = {
    rest: { scale: 1, rotate: 0 },
    drag: { scale: 1.1, rotate: 5 },
  };

  const fileDisplayVariants = {
    initial: { opacity: 0, y: -10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 10 },
  };

  const errorVariants = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 10 },
  };

  return (
    <div className="w-full">
      {!file ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className={`relative border-2 border-dashed rounded-lg p-8 transition-all duration-300 ease-in-out flex flex-col items-center justify-center text-center cursor-pointer ${
            isDragging
              ? 'border-blue-400 bg-blue-50 animate-pulse'
              : 'border-blue-200 hover:border-blue-300 bg-white'
          }`}
          onDragEnter={handleDragEnter}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,application/pdf"
            className="hidden"
            onChange={handleFileSelect}
          />

          <motion.div
            className={`p-6 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 mb-6`}
            variants={uploadIconVariants}
            animate="rest"
            whileHover="drag"
          >
            <UploadCloud className="w-10 h-10 text-blue-600" />
          </motion.div>

          <h3 className="text-slate-800 font-semibold text-lg mb-3">
            Drag & Drop PDF File
          </h3>
          <p className="text-slate-600 text-sm mb-4">
            Or click below to browse
          </p>

          <motion.button
            type="button"
            onClick={handleBrowseClick}
            className="px-5 py-3 rounded-md text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 transition-all duration-200"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Browse Files
          </motion.button>

          <p className="mt-4 text-xs text-slate-500">Only PDF files are accepted</p>

          {isDragging && (
            <motion.div
              variants={dragOverlayVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="absolute top-0 left-0 right-0 bottom-0 bg-blue-100 bg-opacity-50 flex items-center justify-center rounded-lg"
            >
              <span className="text-blue-600 font-semibold">Drop PDF Here</span>
            </motion.div>
          )}

          {error && (
            <motion.div
              className="absolute bottom-2 left-0 right-0 text-center"
              variants={errorVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.2 }}
            >
              <p className="text-red-500 text-sm flex items-center justify-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {error}
              </p>
            </motion.div>
          )}
        </motion.div>
      ) : (
        <motion.div
          className="border border-blue-200 rounded-lg p-5 bg-white shadow-md transition-all duration-300"
          variants={fileDisplayVariants}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          <div className="flex items-center">
            <div className="p-3 rounded-md bg-blue-50 mr-4">
              <FileIcon className="w-7 h-7 text-blue-600" />
            </div>

            <div className="flex-1 min-w-0">
              <h4 className="text-slate-800 font-medium text-sm truncate">{file.name}</h4>
              <p className="text-slate-600 text-xs">{formatFileSize(file.size)}</p>
            </div>

            <div className="flex items-center space-x-3">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.2, delay: 0.1 }}
              >
                <CheckCircle className="w-6 h-6 text-green-500" />
              </motion.div>
              <motion.button
                onClick={handleRemoveFile}
                className="p-1 rounded-full hover:bg-slate-100 transition-colors duration-200 focus:outline-none"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <X className="w-5 h-5 text-slate-600 hover:text-slate-800" />
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default FileUpload;