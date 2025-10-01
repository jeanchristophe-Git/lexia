'use client';

import { motion } from 'framer-motion';
import { Bot } from 'lucide-react';

export default function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="mb-6 max-w-4xl"
    >
      <div className="flex items-center space-x-2 mb-2">
        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-green-500 to-blue-600 text-white flex items-center justify-center">
          <Bot className="h-3 w-3" />
        </div>
        <span className="text-sm font-medium text-black">Assistant Juridique</span>
        <span className="text-xs text-gray-500">en train de réfléchir...</span>
      </div>

      <div className="ml-8 bg-white border border-gray-200 rounded-2xl p-4">
        <div className="flex items-center space-x-2">
          <div className="flex space-x-1">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
                className="w-2 h-2 bg-gray-500 rounded-full"
              />
            ))}
          </div>
          <span className="text-sm text-gray-500">Assistant recherche dans la législation...</span>
        </div>
      </div>
    </motion.div>
  );
}