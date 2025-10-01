'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Loader2 } from 'lucide-react';
import { useChatStore } from '@/store/chatStore';
import { sendMessage } from '@/store/chatStore';
import { getPlaceholderByCountry } from '@/lib/countries';

interface MessageInputProps {
  onSendMessage?: (message: string) => void;
}

export default function MessageInput({ onSendMessage }: MessageInputProps) {
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const {
    selectedCountry,
    addMessage,
    setTyping,
    isTyping,
    currentConversationId,
    createConversation
  } = useChatStore();

  const placeholder = getPlaceholderByCountry(selectedCountry.code);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [input]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedInput = input.trim();
    if (!trimmedInput || isTyping) return;

    // Create new conversation if none exists
    if (!currentConversationId) {
      createConversation();
    }

    // Add user message
    addMessage({
      role: 'user',
      content: trimmedInput,
    });

    // Clear input
    setInput('');

    // Set typing state
    setTyping(true);

    // Call external handler if provided
    if (onSendMessage) {
      onSendMessage(trimmedInput);
    }

    try {
      // Send to mock API
      const response = await sendMessage(trimmedInput, selectedCountry.code);

      // Add AI response
      addMessage({
        role: 'assistant',
        content: response.response,
        sources: response.sources,
        confidence: response.confidence,
      });
    } catch (error) {
      console.error('Error sending message:', error);

      // Add error message
      addMessage({
        role: 'assistant',
        content: 'Désolé, une erreur est survenue. Veuillez réessayer.',
        confidence: 'low',
      });
    } finally {
      setTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as any);
    }
  };

  return (
    <div className="border-t border-gray-200 bg-white">
      <div className="px-4 pb-4 pt-2">
        <form onSubmit={handleSubmit}>
          <div className="flex items-end space-x-3 max-w-4xl mx-auto">
            <div className="flex-1 relative">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                disabled={isTyping}
                className="w-full resize-none rounded-xl border border-gray-200 bg-white px-4 py-3 pr-12 text-sm placeholder:text-gray-500 focus:border-blue-600 focus:outline-none focus:ring-0 min-h-[50px] max-h-[200px] disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                rows={1}
              />

              <button
                type="submit"
                disabled={!input.trim() || isTyping}
                className="absolute right-2 bottom-2 h-8 w-8 rounded-full p-0 bg-blue-600 hover:bg-opacity-80 text-white flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {isTyping ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>
        </form>

        {/* Suggestions */}
        {input === '' && (
          <div className="flex flex-wrap gap-2 mt-3 max-w-4xl mx-auto">
            {getSuggestionsByCountry(selectedCountry.code).map((suggestion, index) => (
              <button
                key={index}
                onClick={() => setInput(suggestion)}
                className="px-3 py-1 text-xs rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-black transition-colors"
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function getSuggestionsByCountry(countryCode: string): string[] {
  const suggestions = {
    ci: [
      "Comment créer une SARL en Côte d'Ivoire ?",
      "Quel est le SMIG en CI ?",
      "Procédure de divorce en Côte d'Ivoire",
      "Ouvrir un commerce en CI"
    ],
    cm: [
      "Création d'entreprise au Cameroun",
      "Salaire minimum au Cameroun",
      "Droit du travail camerounais",
      "Import-export au Cameroun"
    ],
    tg: [
      "Créer une entreprise au Togo",
      "Code de commerce togolais",
      "Droit de la famille au Togo",
      "Licences commerciales au Togo"
    ]
  };

  return suggestions[countryCode as keyof typeof suggestions] || suggestions.ci;
}