'use client';

import { useState, useEffect } from 'react';
import { X, MessageCircle, Trash2, Plus, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '@stackframe/stack';
import { useChatStore } from '@/store/chatStore';
import { formatDate, truncateText } from '@/lib/utils';
import UserProfilePopup from '@/components/UserProfilePopup';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const user = useUser();
  const [showProfilePopup, setShowProfilePopup] = useState(false);
  const {
    conversations,
    currentConversationId,
    loadConversation,
    deleteConversation,
    clearCurrentChat,
    loadConversationsFromDB
  } = useChatStore();

  // Charger les conversations depuis la BDD au montage
  useEffect(() => {
    loadConversationsFromDB();
  }, [loadConversationsFromDB]);

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

  // Obtenir les initiales de l'utilisateur
  const getUserInitials = () => {
    if (!user) return 'U';
    const name = user.displayName || user.primaryEmail || 'User';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const sidebarContent = (
    <div className="h-full flex flex-col bg-white border-r border-gray-200 shadow-sm">
      {/* Nouveau chat button */}
      <div className="p-3 border-b border-gray-200">
        <button
          onClick={handleNewChat}
          className="w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-xl bg-primary hover:bg-primary-dark text-sm font-semibold text-white transition-all shadow-sm hover:shadow-md"
        >
          <Plus className="h-4 w-4" />
          <span>Nouveau chat</span>
        </button>
      </div>

      {/* Mobile close button */}
      <div className="md:hidden flex justify-end p-2">
        <button
          onClick={onClose}
          className="p-2 rounded-lg hover:bg-gray-100 text-gray-600"
          aria-label="Fermer"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto px-3 py-2">
        {conversations.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <MessageCircle className="h-10 w-10 mx-auto mb-3 opacity-50" />
            <p className="text-sm">Aucune conversation</p>
          </div>
        ) : (
          <div className="space-y-2">
            {conversations.map((conversation) => (
              <div
                key={conversation.id}
                className={`group relative rounded-xl cursor-pointer transition-all ${
                  currentConversationId === conversation.id
                    ? 'bg-primary/10 border border-primary/20'
                    : 'hover:bg-gray-50 border border-transparent'
                }`}
                onClick={() => handleLoadConversation(conversation.id)}
              >
                <div className="flex items-center p-3">
                  <MessageCircle className={`h-4 w-4 mr-3 flex-shrink-0 ${currentConversationId === conversation.id ? 'text-primary' : 'text-gray-400'}`} />
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm truncate ${currentConversationId === conversation.id ? 'text-primary font-medium' : 'text-gray-700'}`}>
                      {truncateText(conversation.title, 30)}
                    </p>
                  </div>
                  <button
                    onClick={(e) => handleDeleteConversation(e, conversation.id)}
                    className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600 transition-all ml-2"
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

      {/* Footer */}
      <div className="border-t border-gray-200 p-3 space-y-2">
        {/* Support */}
        <button className="w-full flex items-center space-x-2 px-3 py-2.5 rounded-xl hover:bg-gray-50 text-gray-700 text-sm font-medium transition-colors">
          <HelpCircle className="h-5 w-5" />
          <span>Support</span>
        </button>

        {/* User Profile */}
        {user && (
          <>
            <button
              onClick={() => setShowProfilePopup(true)}
              className="w-full flex items-center space-x-3 px-3 py-3 rounded-xl hover:bg-gray-50 transition-all group"
            >
              <div className="w-9 h-9 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0 shadow-sm">
                {getUserInitials()}
              </div>
              <div className="flex-1 min-w-0 text-left">
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {user.displayName || user.primaryEmail || 'Utilisateur'}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  Voir le profil
                </p>
              </div>
            </button>

            <UserProfilePopup
              isOpen={showProfilePopup}
              onClose={() => setShowProfilePopup(false)}
            />
          </>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar - Toujours visible */}
      <div className="hidden md:block w-64 h-full">
        {sidebarContent}
      </div>

      {/* Mobile Sidebar - Caché par défaut, slide-in depuis la gauche */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop dark */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="md:hidden fixed inset-0 bg-black/70 z-40"
            />

            {/* Sidebar */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="md:hidden fixed left-0 top-0 h-full w-64 z-50"
            >
              {sidebarContent}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}