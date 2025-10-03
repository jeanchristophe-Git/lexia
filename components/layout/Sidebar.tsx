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
    <div className="h-full flex flex-col bg-claude-sidebar border-r border-claude-border">
      {/* Nouveau chat button - Style Claude dark */}
      <div className="p-2 border-b border-claude-border">
        <button
          onClick={handleNewChat}
          className="w-full flex items-center justify-center space-x-2 px-3 py-2.5 rounded-lg bg-claude-bg-main hover:bg-claude-border text-sm font-medium text-claude-text-light transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Nouveau chat</span>
        </button>
      </div>

      {/* Mobile close button */}
      <div className="md:hidden flex justify-end p-2">
        <button
          onClick={onClose}
          className="p-1 rounded-md hover:bg-claude-border text-claude-text-secondary"
          aria-label="Fermer"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto px-2 py-2">
        {conversations.length === 0 ? (
          <div className="text-center py-8 text-claude-text-secondary">
            <MessageCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-xs">Aucune conversation</p>
          </div>
        ) : (
          <div className="space-y-1">
            {conversations.map((conversation) => (
              <div
                key={conversation.id}
                className={`group relative rounded-lg cursor-pointer transition-colors ${
                  currentConversationId === conversation.id
                    ? 'bg-claude-border shadow-sm'
                    : 'hover:bg-claude-border'
                }`}
                onClick={() => handleLoadConversation(conversation.id)}
              >
                <div className="flex items-center p-2.5">
                  <MessageCircle className="h-4 w-4 text-claude-text-secondary mr-2 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-claude-text-light truncate">
                      {truncateText(conversation.title, 30)}
                    </p>
                  </div>
                  <button
                    onClick={(e) => handleDeleteConversation(e, conversation.id)}
                    className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-claude-bg-main text-claude-text-secondary transition-opacity ml-2"
                    aria-label="Supprimer"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer - Style Claude dark */}
      <div className="border-t border-claude-border p-2 space-y-1">
        {/* Support */}
        <button className="w-full flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-claude-border text-claude-text-light text-sm transition-colors">
          <HelpCircle className="h-4 w-4" />
          <span>Support</span>
        </button>

        {/* User Profile - Cliquable style Claude */}
        {user && (
          <>
            <button
              onClick={() => setShowProfilePopup(true)}
              className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg hover:bg-claude-border transition-colors group"
            >
              <div className="w-8 h-8 bg-claude-user-bubble rounded-full flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
                {getUserInitials()}
              </div>
              <div className="flex-1 min-w-0 text-left">
                <p className="text-sm font-medium text-claude-text-light truncate">
                  {user.displayName || user.primaryEmail || 'Utilisateur'}
                </p>
                <p className="text-xs text-claude-text-secondary truncate">
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