'use client';

import { useState, useEffect } from 'react';
import { X, MessageCircle, Trash2, Plus, History, Settings, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useChatStore } from '@/store/chatStore';
import { formatDate, truncateText } from '@/lib/utils';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const {
    conversations,
    currentConversationId,
    loadConversation,
    deleteConversation,
    clearCurrentChat
  } = useChatStore();

  const handleNewChat = () => {
    clearCurrentChat();
    onClose();
  };

  const handleLoadConversation = (id: string) => {
    loadConversation(id);
    onClose();
  };

  const handleDeleteConversation = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (window.confirm('Supprimer cette conversation ?')) {
      deleteConversation(id);
    }
  };

  const sidebarContent = (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header ChatGPT style */}
      <div className="p-3">
        <button
          onClick={handleNewChat}
          className="w-full flex items-center justify-center space-x-2 px-3 py-3 rounded-lg border border-gray-200 hover:bg-white text-sm font-medium text-black transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Nouveau chat</span>
        </button>
      </div>

      {/* Mobile close button */}
      <div className="lg:hidden flex justify-end p-3 pt-0">
        <button
          onClick={onClose}
          className="p-1 rounded-md hover:bg-gray-100 text-gray-500"
          aria-label="Fermer"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Conversations List - ChatGPT style */}
      <div className="flex-1 overflow-y-auto px-3">
        {conversations.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <History className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Aucune conversation</p>
          </div>
        ) : (
          <div className="space-y-1">
            {conversations.map((conversation) => (
              <div
                key={conversation.id}
                className={`group relative rounded-lg cursor-pointer transition-colors ${
                  currentConversationId === conversation.id
                    ? 'bg-gray-100'
                    : 'hover:bg-gray-100'
                }`}
                onClick={() => handleLoadConversation(conversation.id)}
              >
                <div className="flex items-center p-3">
                  <MessageCircle className="h-4 w-4 text-gray-500 mr-3 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-black truncate">
                      {truncateText(conversation.title, 30)}
                    </p>
                  </div>
                  <button
                    onClick={(e) => handleDeleteConversation(e, conversation.id)}
                    className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-white text-gray-500 transition-opacity ml-2"
                    aria-label="Supprimer"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer - ChatGPT style */}
      <div className="border-t border-gray-200 p-3 space-y-1">
        <button className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-100 text-gray-500 text-sm">
          <Settings className="h-4 w-4" />
          <span>Paramètres</span>
        </button>
        <button className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-100 text-gray-500 text-sm">
          <HelpCircle className="h-4 w-4" />
          <span>Aide</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar - ChatGPT style */}
      <div className="hidden lg:block w-64 h-full">
        {sidebarContent}
      </div>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
            />

            {/* Sidebar */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="lg:hidden fixed left-0 top-0 h-full w-64 z-50"
            >
              {sidebarContent}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}