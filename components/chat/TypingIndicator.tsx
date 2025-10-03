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
      <div className="flex items-center space-x-2 mb-2">
        <div className="w-7 h-7 rounded-lg bg-claude-assistant-bubble flex items-center justify-center">
          <span className="text-white text-sm font-bold">⚖️</span>
        </div>
        <span className="text-sm font-medium text-claude-text-light">LexIA</span>
        <span className="text-xs text-claude-text-secondary">écrit...</span>
      </div>

      <div className="ml-9 bg-claude-assistant-bubble border border-claude-border rounded-2xl p-4 w-fit">
        <div className="flex space-x-1.5">
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
              className="w-2 h-2 bg-claude-text-secondary rounded-full"
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}