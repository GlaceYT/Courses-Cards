import React from "react";
import { motion } from "framer-motion";
import Carousel from "./components/Carousel";

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-gray-900 dark:to-indigo-950 text-gray-800 dark:text-white flex flex-col items-center justify-center p-4 overflow-hidden">
      <motion.div 
        className="w-full max-w-5xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Carousel />
      </motion.div>
    </div>
  );
};

export default App;