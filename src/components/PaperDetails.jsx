import React from 'react';
import { motion } from 'framer-motion';

const PaperDetails = ({ paper, onClose }) => {
  return (
    <motion.div 
      className="fixed inset-0 bg-gray-900 text-white p-6 overflow-y-auto"
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: "spring", damping: 20 }}
    >
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">{paper.title}</h1>
        
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Authors</h2>
          <p className="text-gray-300">
            {paper.authors?.join(', ')}
          </p>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Abstract</h2>
          <p className="text-gray-300 leading-relaxed">
            {paper.abstract}
          </p>
        </div>

        {paper.link && (
          <div className="mb-6">
            <a 
              href={paper.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Read on arXiv
            </a>
          </div>
        )}

        <button
          onClick={onClose}
          className="fixed top-4 right-4 text-white p-2 rounded-full bg-gray-800/60 backdrop-blur-sm"
        >
          ✕
        </button>
      </div>
    </motion.div>
  );
};

export default PaperDetails; 