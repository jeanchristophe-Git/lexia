'use client';

import { useState } from 'react';
import { X, User, Mail, Settings, LogOut, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '@stackframe/stack';

interface UserProfilePopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function UserProfilePopup({ isOpen, onClose }: UserProfilePopupProps) {
  const user = useUser();

  if (!user) return null;

  const getUserInitials = () => {
    const name = user.displayName || user.primaryEmail || 'User';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50"
          />

          {/* Popup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-20 left-4 w-80 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-br from-orange-400 to-green-500 p-6 relative">
              <button
                onClick={onClose}
                className="absolute top-3 right-3 p-1.5 rounded-lg hover:bg-white/20 text-white transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
              <div className="flex flex-col items-center">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-orange-500 text-2xl font-bold shadow-lg mb-3">
                  {getUserInitials()}
                </div>
                <h3 className="text-white font-semibold text-lg">
                  {user.displayName || 'Utilisateur'}
                </h3>
                <p className="text-white/90 text-sm">
                  {user.primaryEmail}
                </p>
              </div>
            </div>

            {/* Menu Items */}
            <div className="p-3 space-y-1">
              <a
                href="/account/settings"
                className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors group"
              >
                <Settings className="h-5 w-5 text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Paramètres</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Gérer votre compte
                  </p>
                </div>
              </a>

              <a
                href="/account/profile"
                className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors group"
              >
                <User className="h-5 w-5 text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Mon profil</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Voir et modifier vos informations
                  </p>
                </div>
              </a>

              <a
                href="/account/privacy"
                className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors group"
              >
                <Shield className="h-5 w-5 text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Confidentialité</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Gérer vos données
                  </p>
                </div>
              </a>

              <div className="border-t border-gray-200 dark:border-gray-700 my-2"></div>

              <button
                onClick={() => {
                  user.signOut();
                  onClose();
                }}
                className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 transition-colors group"
              >
                <LogOut className="h-5 w-5" />
                <div className="flex-1 text-left">
                  <p className="text-sm font-medium">Déconnexion</p>
                  <p className="text-xs opacity-80">Se déconnecter de LexIA</p>
                </div>
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
