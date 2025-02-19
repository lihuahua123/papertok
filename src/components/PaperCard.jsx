import React, { useState, useRef, useEffect } from 'react';
import { 
  HeartIcon, 
  ChatBubbleLeftIcon, 
  BookmarkIcon, 
  ShareIcon 
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';

const PaperCard = ({ paper, onSwipe }) => {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const contentRef = useRef(null);
  const [isAtBottom, setIsAtBottom] = useState(false);
  const [isAtTop, setIsAtTop] = useState(true);
  const [touchStart, setTouchStart] = useState(null);

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTop = 0;
      setIsAtBottom(false);
      setIsAtTop(true);
    }
  }, [paper.id]);

  const handleScroll = (e) => {
    const element = e.target;
    const currentScrollTop = element.scrollTop;
    
    // 检查是否在顶部
    const atTop = currentScrollTop === 0;
    setIsAtTop(atTop);
    
    // 检查是否在底部
    const scrollPosition = Math.abs(element.scrollHeight - currentScrollTop - element.clientHeight);
    setIsAtBottom(scrollPosition < 1);
  };

  const handleTouchStart = (e) => {
    setTouchStart(e.touches[0].clientY);
  };

  const handleTouchMove = (e) => {
    if (!touchStart) return;

    const currentY = e.touches[0].clientY;
    const deltaY = touchStart - currentY;
    const element = contentRef.current;

    if (Math.abs(deltaY) > 50) {
      if (deltaY > 0) { // 向上滑动
        if (isAtBottom) {
          onSwipe('up');
          setTouchStart(null);
        }
      } else { // 向下滑动
        if (isAtTop) {
          onSwipe('down');
          setTouchStart(null);
        }
      }
    }
  };

  const handleWheel = (e) => {
    const element = contentRef.current;
    if (!element) return;

    if (isAtBottom && e.deltaY > 0) {
      e.preventDefault();
      onSwipe('up');
    } else if (isAtTop && e.deltaY < 0) {
      e.preventDefault();
      onSwipe('down');
    }
  };

  return (
    <div 
      className="absolute inset-0 bg-gray-900 text-white"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
    >
      <div 
        ref={contentRef}
        className="h-full w-full px-4 pt-6 pb-24 overflow-y-auto"
        onScroll={handleScroll}
        onWheel={handleWheel}
      >
        <h1 className="text-2xl font-bold mb-4">{paper.title}</h1>
        <p className="text-gray-300 text-base leading-relaxed">{paper.abstract}</p>
      </div>

      {/* 交互按钮 */}
      <div className="absolute right-4 bottom-6 flex flex-col space-y-4 z-10">
        <button 
          onClick={() => setLiked(!liked)}
          className="p-2 rounded-full bg-gray-800/60 backdrop-blur-sm"
        >
          {liked ? (
            <HeartSolidIcon className="w-8 h-8 text-red-500" />
          ) : (
            <HeartIcon className="w-8 h-8" />
          )}
        </button>

        <button className="p-2 rounded-full bg-gray-800/60 backdrop-blur-sm">
          <ChatBubbleLeftIcon className="w-8 h-8" />
        </button>

        <button 
          onClick={() => setSaved(!saved)}
          className="p-2 rounded-full bg-gray-800/60 backdrop-blur-sm"
        >
          <BookmarkIcon className={`w-8 h-8 ${saved ? 'text-yellow-500' : ''}`} />
        </button>

        <button className="p-2 rounded-full bg-gray-800/60 backdrop-blur-sm">
          <ShareIcon className="w-8 h-8" />
        </button>
      </div>

      {/* 滚动提示 */}
      {isAtBottom && (
        <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 text-white/50 text-sm">
          向上滑动查看下一篇
        </div>
      )}
      {isAtTop && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 text-white/50 text-sm">
          向下滑动查看上一篇
        </div>
      )}
    </div>
  );
};

export default PaperCard; 