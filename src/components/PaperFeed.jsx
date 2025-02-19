import React, { useState, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import PaperCard from './PaperCard';
import { fetchPapers } from '../services/arxivService';

const PaperFeed = () => {
  const [papers, setPapers] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [startIndex, setStartIndex] = useState(0);

  const loadMorePapers = useCallback(async () => {
    try {
      setLoading(true);
      const newPapers = await fetchPapers(startIndex, 20);
      setPapers(prevPapers => [...prevPapers, ...newPapers]);
      setStartIndex(prev => prev + 20);
    } catch (err) {
      setError('Failed to load papers');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [startIndex]);

  useEffect(() => {
    loadMorePapers();
  }, []);

  useEffect(() => {
    if (currentIndex >= papers.length - 5 && !loading) {
      loadMorePapers();
    }
  }, [currentIndex, papers.length, loading, loadMorePapers]);

  const handleSwipe = (direction) => {
    if (direction === 'up' && currentIndex < papers.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else if (direction === 'down' && currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  return (
    <div className="fixed inset-0 bg-black overflow-hidden">
      {papers.length === 0 && loading ? (
        <div className="flex items-center justify-center h-full">
          <div className="text-white">Loading papers...</div>
        </div>
      ) : error ? (
        <div className="flex items-center justify-center h-full">
          <div className="text-red-500">{error}</div>
        </div>
      ) : (
        <div className="relative h-full">
          <AnimatePresence initial={false}>
            {papers[currentIndex] && (
              <PaperCard 
                key={papers[currentIndex].id}
                paper={papers[currentIndex]}
                onSwipe={handleSwipe}
              />
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default PaperFeed; 