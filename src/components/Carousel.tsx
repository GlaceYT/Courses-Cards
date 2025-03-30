import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Card from "./card"; 


const cardData = [
  {
    id: 1,
    title: "Crash Course of Java programming langauges | 2025",
    author: "Shiva Reddy",
    rating: 5,
    reviewCount: 432,
    duration: "11HRS 90 MIN",
    views: 50000,
    image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1769&q=80",
  },
  {
    id: 2,
    title: "Mastering Python for Data Science | 2025",
    author: "John Doe",
    rating: 4.8,
    reviewCount: 328,
    duration: "8HRS 45 MIN",
    views: 32500,
    image: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80",
  },
  {
    id: 3,
    title: "Full Stack Web Development Bootcamp | 2025",
    author: "Alice Smith",
    rating: 4.9,
    reviewCount: 517,
    duration: "12HRS 30 MIN",
    views: 42800,
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1772&q=80",
  },
  {
    id: 4,
    title: "Advanced React & Redux for Modern Apps | 2025",
    author: "Emma Johnson",
    rating: 4.7,
    reviewCount: 382,
    duration: "10HRS 15 MIN",
    views: 38600,
    image: "https://images.unsplash.com/photo-1593720213428-28a5b9e94613?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80",
  },
  {
    id: 5,
    title: "Machine Learning: From Zero to Hero | 2025",
    author: "Michael Chen",
    rating: 4.95,
    reviewCount: 624,
    duration: "14HRS 20 MIN",
    views: 51700,
    image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1572&q=80",
  },
];

const Carousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [touchStart, setTouchStart] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  const autoPlayInterval = useRef<NodeJS.Timeout | null>(null);
  // Auto rotation timer
  useEffect(() => {
    if (isAutoPlaying && !isTransitioning) {
      autoPlayInterval.current = setInterval(() => {
        handleSlideChange((prev) => (prev + 1) % cardData.length);
      }, 3000);
    }
    
    return () => {
      if (autoPlayInterval.current) {
        clearInterval(autoPlayInterval.current);
      }
    };
  }, [isAutoPlaying, cardData.length, isTransitioning]);
  
  // Pause auto rotation on hover
  const handleMouseEnter = () => {
    setIsAutoPlaying(false);
  };
  
  const handleMouseLeave = () => {
    setIsAutoPlaying(true);
  };

  // Check if the device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Initial check
    checkMobile();
    
    // Add event listener for window resize
    window.addEventListener("resize", checkMobile);
    
    // Cleanup
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        prevSlide();
      } else if (e.key === "ArrowRight") {
        nextSlide();
      }
    };
    
    window.addEventListener("keydown", handleKeyDown);
    
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [currentIndex, isTransitioning]);

  // Handle slide change with transition lock
  const handleSlideChange = (indexFn: (prev: number) => number) => {
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    setCurrentIndex(indexFn);
    
    // Reset transition lock after animation completes
    setTimeout(() => {
      setIsTransitioning(false);
    }, 600); // Match this with the longest animation duration
  };

  const nextSlide = () => {
    handleSlideChange((prevIndex) => (prevIndex + 1) % cardData.length);
  };

  const prevSlide = () => {
    handleSlideChange((prevIndex) => (prevIndex === 0 ? cardData.length - 1 : prevIndex - 1));
  };

  // Handle touch events for swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX);
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || isTransitioning) return;
    const currentTouch = e.touches[0].clientX;
    const diff = touchStart - currentTouch;
    
    // Swipe threshold
    if (diff > 50) {
      nextSlide();
      setIsDragging(false);
    } else if (diff < -50) {
      prevSlide();
      setIsDragging(false);
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  // Get indexes for the cards
  const getCardIndex = (offset: number) => {
    return (currentIndex + offset + cardData.length) % cardData.length;
  };

  // Determine card positions - MODIFIED to always show center card
  const getCardPosition = (index: number): "left" | "center" | "right" | "hidden" => {
    // Always show center card regardless of device
    if (index === currentIndex) return "center";
    
    // For desktop, show left and right cards too
    if (!isMobile) {
      if (index === getCardIndex(1)) return "right";
      if (index === getCardIndex(-1)) return "left";
    }
    
    return "hidden";
  };

  // Main container animation
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  // Button animations
  const buttonVariants = {
    initial: { scale: 1 },
    hover: { scale: 1.1, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" },
    tap: { scale: 0.95 }
  };

  // Background gradient animation
  const gradientVariants = {
    initial: { backgroundPosition: "0% 50%" },
    animate: { 
      backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
      transition: {
        duration: 15,
        ease: "linear",
        repeat: Infinity
      }
    }
  };

  return (
    <motion.div 
      className="relative flex flex-col items-center justify-center w-full min-h-screen px-4 py-16 overflow-hidden bg-gray-50 dark:bg-gray-900"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Background gradient */}
      <motion.div 
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          background: "linear-gradient(45deg, #4f46e5, #8b5cf6, #ec4899, #3b82f6)",
          backgroundSize: "400% 400%",
        }}
        variants={gradientVariants}
        initial="initial"
        animate="animate"
      />
      
      {/* Title with animated underline */}
      <div className="relative mb-12 md:mb-16 text-center">
        <motion.h1 
          className="text-4xl font-bold text-gray-800 dark:text-white md:text-5xl"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Featured Tutorials
        </motion.h1>
        <motion.div 
          className="h-1.5 w-24 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-full mx-auto mt-4"
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: "6rem", opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        />
        <motion.p
          className="mt-4 text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          Explore our handpicked collection of top-rated programming courses
        </motion.p>
      </div>

      {/* Navigation Controls - MOVED ABOVE CARDS */}
      <div className="w-full max-w-4xl mb-4 md:mb-8">
        {/* Current course indicator and navigation buttons in a single row */}
        <div className="flex items-center justify-between mb-4">
          {/* Current/Total Count */}
          <motion.div
            className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm px-3 py-1.5 rounded-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
              <span className="text-violet-600 dark:text-violet-400">{currentIndex + 1}</span>
              <span> / {cardData.length}</span>
            </p>
          </motion.div>
          
          {/* Navigation buttons */}
          <div className="flex items-center space-x-3">
            <motion.button
              className="p-2 md:p-3 bg-white/80 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 text-violet-600 dark:text-violet-400 rounded-full shadow-md"
              onClick={prevSlide}
              whileHover="hover"
              whileTap="tap"
              variants={buttonVariants}
              disabled={isTransitioning}
              aria-label="Previous slide"
            >
              <svg width="16" height="16" className="md:w-5 md:h-5" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/>
              </svg>
            </motion.button>
            
            <motion.button
              className="p-2 md:p-3 bg-white/80 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 text-violet-600 dark:text-violet-400 rounded-full shadow-md"
              onClick={nextSlide}
              whileHover="hover"
              whileTap="tap"
              variants={buttonVariants}
              disabled={isTransitioning}
              aria-label="Next slide"
            >
              <svg width="16" height="16" className="md:w-5 md:h-5" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/>
              </svg>
            </motion.button>
          </div>
        </div>
        
        {/* Slide Indicators with dots */}
        <div className="flex items-center justify-center space-x-2 md:space-x-3">
          {cardData.map((_, index) => (
            <motion.button
              key={index}
              className={`w-2 h-2 md:w-3 md:h-3 rounded-full ${
                index === currentIndex ? 'bg-violet-600' : 'bg-gray-300 dark:bg-gray-600'
              }`}
              onClick={() => handleSlideChange(() => index)}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ 
                opacity: 1, 
                scale: index === currentIndex ? 1.2 : 1,
                transition: { duration: 0.3 }
              }}
              disabled={isTransitioning}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Cards Container */}
      <div 
        className="relative h-96 md:h-[28rem] w-full max-w-4xl"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Card Stack */}
        <div className="relative h-full w-full flex items-center justify-center">
          <AnimatePresence>
            {cardData.map((card, index) => (
              <Card
                key={card.id}
                {...card}
                position={getCardPosition(index)}
                index={index}
                active={index === currentIndex}
              />
            ))}
          </AnimatePresence>
        </div>
        
        {/* Auto-play indicator */}
        <motion.div 
          className="absolute bottom-4 left-4 flex items-center space-x-2 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm px-2 py-1 md:px-3 md:py-2 rounded-full"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <button 
            onClick={() => setIsAutoPlaying(!isAutoPlaying)}
            className={`w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center transition-colors ${isAutoPlaying ? 'bg-violet-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300'}`}
            aria-label={isAutoPlaying ? "Pause auto-play" : "Start auto-play"}
          >
            {isAutoPlaying ? (
              <svg className="w-3 h-3 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            ) : (
              <svg className="w-3 h-3 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
          </button>
          <span className="text-xs font-medium text-gray-700 dark:text-gray-300 hidden sm:inline">
            {isAutoPlaying ? "Auto-play on" : "Auto-play off"}
          </span>
        </motion.div>
      </div>

      {/* View All Button */}
      <motion.button
        className="mt-8 md:mt-12 px-6 py-2 md:px-8 md:py-3 bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-sm md:text-base font-medium rounded-full shadow-lg group relative overflow-hidden"
        whileHover={{ 
          scale: 1.05,
          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
        }}
        whileTap={{ scale: 0.98 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
      >
        {/* Background shine effect */}
        <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
        
        <span className="relative flex items-center space-x-2">
          <span>View All Courses</span>
          <svg className="w-3 h-3 md:w-4 md:h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </span>
      </motion.button>
      
      {/* Theme toggle */}
      <motion.button
        className="absolute top-4 right-4 p-2 bg-white/80 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 rounded-full shadow-md"
        whileHover={{ rotate: 180, transition: { duration: 0.3 } }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        aria-label="Toggle theme"
      >
        <svg className="w-5 h-5 md:w-6 md:h-6 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
      </motion.button>
    </motion.div>
  );
};

export default Carousel;