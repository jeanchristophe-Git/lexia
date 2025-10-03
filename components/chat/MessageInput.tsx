'use client';

import { useState, useRef, useEffect } from 'react';
import { ArrowUp, Loader2 } from 'lucide-react';
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
    <div className="border-t-2 border-gray-200 bg-white shadow-lg">
      <div className="px-4 pb-5 pt-4">
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
                className="w-full resize-none rounded-2xl border-2 border-gray-200 bg-white px-5 py-4 pr-14 text-sm text-gray-900 placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 min-h-[56px] max-h-[200px] disabled:opacity-50 disabled:cursor-not-allowed shadow-sm transition-all"
                rows={1}
              />

              <button
                type="submit"
                disabled={!input.trim() || isTyping}
                className="absolute right-3 bottom-3 h-10 w-10 rounded-xl p-0 bg-primary hover:bg-primary-dark text-white flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm hover:shadow-md"
              >
                {isTyping ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <ArrowUp className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
        </form>

        {/* Suggestions */}
        {input === '' && (
          <div className="flex flex-wrap gap-2 mt-4 max-w-4xl mx-auto">
            {getSuggestionsByCountry(selectedCountry.code).map((suggestion, index) => (
              <button
                key={index}
                onClick={() => setInput(suggestion)}
                className="px-3 py-1.5 text-xs font-medium rounded-lg bg-gray-100 hover:bg-primary/10 text-gray-600 hover:text-primary transition-colors border border-transparent hover:border-primary/20"
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