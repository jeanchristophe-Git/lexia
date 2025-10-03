'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Share2, Copy, Check } from 'lucide-react';
import { useChatStore } from '@/store/chatStore';
import MessageBubble from './MessageBubble';
import MessageInput from './MessageInput';
import TypingIndicator from './TypingIndicator';
import WelcomeScreen from './WelcomeScreen';

export default function ChatInterface() {
  const { messages, isTyping, currentConversationId } = useChatStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const hasMessages = messages.length > 0;

  const handleShare = async () => {
    const url = `${window.location.origin}/chat/${currentConversationId}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Erreur lors de la copie:', error);
    }
  };

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-white dark:bg-gray-900">
      {/* Share button - visible only when conversation active */}
      {hasMessages && (
        <div className="absolute top-4 left-4 z-10">
          <button
            onClick={handleShare}
            className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750 text-gray-700 dark:text-gray-300 text-sm font-medium shadow-sm transition-colors"
          >
            {copied ? (
              <>
                <Check className="h-4 w-4 text-green-600" />
                <span className="text-green-600">Copié !</span>
              </>
            ) : (
              <>
                <Share2 className="h-4 w-4" />
                <span>Partager</span>
              </>
            )}
          </button>
        </div>
      )}

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto pt-16">
        <div className="max-w-4xl mx-auto px-4 py-6">
          {!hasMessages ? (
            <WelcomeScreen />
          ) : (
            <div className="space-y-0">
              <AnimatePresence mode="popLayout">
                {messages.map((message, index) => (
                  <MessageBubble
                    key={message.id}
                    message={message}
                    isLast={index === messages.length - 1}
                  />
                ))}
              </AnimatePresence>

              {/* Typing Indicator */}
              <AnimatePresence>
                {isTyping && <TypingIndicator />}
              </AnimatePresence>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <MessageInput />
    </div>
  );
}