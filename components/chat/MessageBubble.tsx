'use client';

import { useState } from 'react';
import { Copy, Share2, ChevronDown, ChevronUp, ExternalLink, User, Bot } from 'lucide-react';
import { motion } from 'framer-motion';
import { Message } from '@/types';
import { formatDate, getConfidenceColor, getConfidenceText } from '@/lib/utils';
import LegalReference from '@/components/legal/LegalReference';
import ConfidenceLevel from '@/components/legal/ConfidenceLevel';

interface MessageBubbleProps {
  message: Message;
  isLast?: boolean;
}

export default function MessageBubble({ message, isLast }: MessageBubbleProps) {
  const [showSources, setShowSources] = useState(false);
  const [copied, setCopied] = useState(false);

  const isUser = message.role === 'user';
  const hasSources = message.sources && message.sources.length > 0;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy text:', error);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Assistant Juridique',
        text: message.content,
      }).catch(console.error);
    }
  };

  const renderContent = (content: string) => {
    return content.split('\n').map((line, index) => {
      if (line.startsWith('**') && line.endsWith('**')) {
        return (
          <h4 key={index} className="font-semibold mt-3 mb-1 text-black">
            {line.slice(2, -2)}
          </h4>
        );
      }
      if (line.startsWith('- ')) {
        return (
          <li key={index} className="ml-4 mb-1">
            {line.slice(2)}
          </li>
        );
      }
      if (line.trim() === '') {
        return <br key={index} />;
      }
      return (
        <p key={index} className="mb-2 last:mb-0">
          {line}
        </p>
      );
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: isLast ? 0.1 : 0 }}
      className={`group relative mb-6 ${isUser ? 'ml-auto max-w-2xl' : 'max-w-4xl'}`}
    >
      {/* Message Header */}
      <div className="flex items-center space-x-2 mb-2">
        <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${
          isUser
            ? 'bg-gradient-to-br from-orange-400 to-green-500 text-white'
            : 'bg-gradient-to-br from-orange-500 to-green-600'
        }`}>
          {isUser ? <User className="h-4 w-4" /> : <span className="text-white text-sm font-bold">⚖️</span>}
        </div>
        <span className="text-sm font-medium text-black">
          {isUser ? 'Vous' : 'LexIA'}
        </span>
        <span className="text-xs text-gray-500">
          {formatDate(message.timestamp)}
        </span>
        {!isUser && message.confidence && (
          <ConfidenceLevel confidence={message.confidence} />
        )}
      </div>

      {/* Message Content */}
      <div className={`relative rounded-2xl p-4 ${
        isUser
          ? 'bg-blue-600 text-white ml-8'
          : 'bg-white border border-gray-200 text-black'
      }`}>
        <div className="prose prose-sm max-w-none">
          {typeof message.content === 'string'
            ? renderContent(message.content)
            : <p>{message.content}</p>
          }
        </div>

        {/* Action Buttons */}
        {!isUser && (
          <div className="flex items-center space-x-2 mt-4 pt-3 border-t border-gray-100">
            <button
              onClick={handleCopy}
              className="flex items-center space-x-1 px-2 py-1 rounded-md hover:bg-gray-100 text-xs text-gray-500 hover:text-black transition-colors"
            >
              <Copy className="h-3 w-3" />
              <span>{copied ? 'Copié!' : 'Copier'}</span>
            </button>

            <button
              onClick={handleShare}
              className="flex items-center space-x-1 px-2 py-1 rounded-md hover:bg-gray-100 text-xs text-gray-500 hover:text-black transition-colors"
            >
              <Share2 className="h-3 w-3" />
              <span>Partager</span>
            </button>

            {hasSources && (
              <button
                onClick={() => setShowSources(!showSources)}
                className="flex items-center space-x-1 px-2 py-1 rounded-md hover:bg-gray-100 text-xs text-gray-500 hover:text-black transition-colors"
              >
                <ExternalLink className="h-3 w-3" />
                <span>Sources ({message.sources?.length})</span>
                {showSources ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
              </button>
            )}

            <div className="flex-1" />

            <a
              href="#"
              className="text-xs text-blue-600 hover:text-blue-800 underline"
            >
              Consulter un avocat
            </a>
          </div>
        )}
      </div>

      {/* Legal Sources */}
      {hasSources && showSources && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="ml-8 mt-3 space-y-2"
        >
          {message.sources?.map((source, index) => (
            <LegalReference key={index} source={source} />
          ))}
        </motion.div>
      )}
    </motion.div>
  );
}