'use client';

import { motion } from 'framer-motion';

export default function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="mb-6 max-w-4xl"
    >
      <div className="flex items-center space-x-3 mb-3">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent to-purple-600 flex items-center justify-center shadow-sm">
          <span className="text-white text-base font-bold">⚖️</span>
        </div>
        <span className="text-sm font-semibold text-gray-900">LexIA</span>
        <span className="text-xs text-gray-500">écrit...</span>
      </div>

      <div className="ml-11 bg-white border-2 border-gray-200 rounded-2xl p-5 w-fit shadow-sm">
        <div className="flex space-x-2">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{
                y: [0, -8, 0],
              }}
              transition={{
                duration: 0.6,
                repeat: Infinity,
                delay: i * 0.15,
                ease: "easeInOut"
              }}
              className="w-2.5 h-2.5 bg-accent rounded-full"
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}