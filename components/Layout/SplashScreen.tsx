"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ChefHat } from "lucide-react";
import { useEffect, useState } from "react";

const SplashScreen = ({ onComplete }: { onComplete: () => void }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onComplete, 1000); // Wait for fade out animation
    }, 3000); // Total duration of logo animation

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-cream tatreez-pattern overflow-hidden"
        >
          {/* Subtle animated background pulse */}
          <motion.div 
            animate={{ 
              scale: [1, 1.05, 1],
              opacity: [0.3, 0.5, 0.3]
            }}
            transition={{ 
              duration: 4, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
            className="absolute inset-0 tatreez-pattern-red opacity-20"
          />

          <div className="relative flex flex-col items-center">
            {/* Logo Icon with Jump and Pop */}
            <motion.div
              initial={{ scale: 0, y: 100, rotate: -10 }}
              animate={{ 
                scale: [0, 1.2, 1],
                y: [100, -50, 0],
                rotate: [10, -5, 0]
              }}
              transition={{ 
                duration: 1.2,
                times: [0, 0.6, 1],
                ease: "easeOut",
              }}
              className="w-24 h-24 bg-olive-green rounded-full flex items-center justify-center shadow-xl mb-6"
            >
              <ChefHat className="w-14 h-14 text-white" />
            </motion.div>

            {/* Text Animation */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="text-center"
            >
              <h1 className="font-serif-elegant text-5xl text-dark-brown mb-2">Taste of Home</h1>
              <div className="flex items-center justify-center gap-4">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: 40 }}
                  transition={{ delay: 1.2, duration: 0.8 }}
                  className="h-[1px] bg-terracotta"
                />
                <p className="text-sm text-dark-brown/60 font-medium tracking-[0.2em] uppercase">
                  Palestinian & Lebanese Heritage
                </p>
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: 40 }}
                  transition={{ delay: 1.2, duration: 0.8 }}
                  className="h-[1px] bg-terracotta"
                />
              </div>
            </motion.div>
          </div>

          {/* Decorative Tatreez Border at bottom */}
          <motion.div 
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.5, duration: 1.5, ease: "circOut" }}
            className="absolute bottom-0 left-0 right-0 h-2 tatreez-border origin-left"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SplashScreen;
