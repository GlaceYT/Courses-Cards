import React, { useState } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";

interface CardProps {
  title: string;
  author: string;
  rating: number;
  reviewCount: number;
  duration: string;
  views: number;
  image: string;
  position: "center" | "left" | "right" | "hidden";
  index: number;
  active: boolean;
}

const Card: React.FC<CardProps> = ({
  title,
  author,
  rating,
  reviewCount,
  duration,
  views,
  image,
  position,
  active
}) => {
  const [hovered, setHovered] = useState(false);
  
  // 3D tilt effect values
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  // Transform mouse movement to rotation
  const rotateX = useTransform(y, [-100, 100], [5, -5]);
  const rotateY = useTransform(x, [-100, 100], [-5, 5]);
  
  // Handle mouse move for 3D effect (only for center card)
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (position === "center") {
      const rect = e.currentTarget.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      x.set(e.clientX - centerX);
      y.set(e.clientY - centerY);
    }
  };
  
  // Reset position when mouse leaves
  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    setHovered(false);
  };

  // Card variants with advanced animations
  const cardVariants = {
    center: {
      scale: 1,
      zIndex: 50,
      x: 0,
      y: 0,
      rotate: 0,
      opacity: 1,
      filter: "drop-shadow(0 20px 30px rgba(0, 0, 0, 0.3))",
      transition: { 
        type: "spring", 
        stiffness: 300, 
        damping: 20,
        duration: 0.6
      }
    },
    left: {
      scale: 0.8,
      zIndex: 30,
      x: "-35%",
      y: 0,
      rotate: -8,
      opacity: 0.7,
      filter: "drop-shadow(0 10px 15px rgba(0, 0, 0, 0.2))",
      transition: { 
        type: "spring", 
        stiffness: 300, 
        damping: 20,
        duration: 0.6
      }
    },
    right: {
      scale: 0.8,
      zIndex: 30,
      x: "35%",
      y: 0,
      rotate: 8,
      opacity: 0.7,
      filter: "drop-shadow(0 10px 15px rgba(0, 0, 0, 0.2))",
      transition: { 
        type: "spring", 
        stiffness: 300, 
        damping: 20,
        duration: 0.6 
      }
    },
    hidden: {
      scale: 0.5,
      zIndex: 0,
      x: 0,
      y: 100,
      rotate: 0,
      opacity: 0,
      filter: "blur(10px)",
      transition: { 
        duration: 0.5,
        ease: "easeInOut"
      }
    },
    exit: {
      scale: 0.5,
      opacity: 0,
      y: 100,
      transition: {
        duration: 0.5
      }
    }
  };

  // Content animation variants
  const contentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        delay: 0.2,
        duration: 0.4
      }
    }
  };

  // Generate star rating display
  const renderStars = () => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <span key={star} className="relative">
            {/* Background star (always visible) */}
            <svg className="w-4 h-4 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z" />
            </svg>
            
            {/* Filled star (partial fills based on rating) */}
            <span 
              className="absolute inset-0 overflow-hidden" 
              style={{ width: star <= rating ? '100%' : (star - 1 < rating && rating < star) ? `${(rating % 1) * 100}%` : '0%' }}
            >
              <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z" />
              </svg>
            </span>
          </span>
        ))}
      </div>
    );
  };

  // Shine effect overlay
  const shineVariants = {
    default: {
      opacity: 0,
      x: "-100%",
    },
    hover: {
      opacity: 0.2,
      x: "100%",
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <motion.div
      className="absolute w-full max-w-sm rounded-2xl overflow-hidden bg-white dark:bg-gray-800 cursor-pointer perspective-1000"
      style={{ 
        rotateX: position === "center" && hovered ? rotateX : 0,
        rotateY: position === "center" && hovered ? rotateY : 0,
        transformStyle: "preserve-3d"
      }}
      variants={cardVariants}
      initial="hidden"
      animate={position}
      exit="exit"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={handleMouseLeave}
      whileTap={position === "center" ? { scale: 0.95 } : undefined}
    >
      {/* Reflective card surface effect */}
      <div className="absolute inset-0 bg-gradient-to-tr from-white/5 via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      {/* Shine effect overlay (animated on hover) */}
      {position === "center" && (
        <motion.div
          className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white to-transparent"
          variants={shineVariants}
          initial="default"
          animate={hovered ? "hover" : "default"}
        />
      )}

      {/* Image with overlay gradient */}
      <div className="relative h-44 overflow-hidden">
        <motion.img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover transform-gpu"
          initial={{ scale: 1.2 }}
          animate={{ 
            scale: position === "center" && hovered ? 1.05 : 1,
            filter: position !== "center" ? "brightness(0.8)" : "brightness(1)" 
          }}
          transition={{ duration: 0.4 }}
        />
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        
        {/* Status badge - top right position */}
        <div className="absolute top-3 right-3">
          <span className="bg-violet-600 text-white text-xs px-2 py-1 rounded-full font-semibold">
            New
          </span>
        </div>
        
        {/* Duration badge - bottom left */}
        <div className="absolute bottom-3 left-3 flex items-center space-x-1 bg-black/70 text-white text-xs px-2 py-1 rounded-full">
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{duration}</span>
        </div>
      </div>

      {/* Content */}
      <motion.div 
        className="p-4"
        variants={contentVariants}
        initial="hidden"
        animate={active ? "visible" : "hidden"}
      >
        <div className="space-y-3">
          <h2 className="font-bold text-lg line-clamp-1 tracking-tight dark:text-white">{title}</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center space-x-1">
            <span className="h-6 w-6 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center text-xs font-bold text-indigo-600 dark:text-indigo-300">
              {author.charAt(0).toUpperCase()}
            </span>
            <span>By {author}</span>
          </p>

          {/* Ratings & Stats */}
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <div className="flex items-center space-x-1">
                {renderStars()}
                <span className="ml-1 font-medium text-sm">{rating.toFixed(1)}</span>
              </div>
              <span className="text-xs text-gray-500">({reviewCount.toLocaleString()})</span>
            </div>
            
            <div className="flex items-center space-x-1 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-lg">
              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <span className="text-xs font-medium">{views >= 1000 ? `${(views/1000).toFixed(1)}K` : views}</span>
            </div>
          </div>
          
          {/* Progress bar */}
          <div className="w-full bg-gray-200 dark:bg-gray-700 h-1.5 rounded-full overflow-hidden">
            <div className="bg-violet-600 h-full rounded-full" style={{ width: "35%" }}></div>
          </div>
          
          {/* Action button - only visible on the center card */}
          {position === "center" && (
            <motion.button
              className="w-full mt-2 bg-violet-600 hover:bg-violet-700 text-white py-2 px-4 rounded-lg font-medium flex items-center justify-center gap-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Start Learning
            </motion.button>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Card;