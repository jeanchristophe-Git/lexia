'use client';

import { Menu, Plus } from 'lucide-react';
import { useChatStore } from '@/store/chatStore';
import CountrySelector from '@/components/legal/CountrySelector';

export default function Header() {
  const { setSidebarOpen, clearCurrentChat } = useChatStore();

  const handleNewChat = () => {
    clearCurrentChat();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white">
      <div className="flex h-14 items-center px-4 justify-between max-w-full">
        {/* Left side - ChatGPT style */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-md hover:bg-gray-100 text-black"
            aria-label="Ouvrir le menu"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">⚖️</span>
            </div>
            <div>
              <h1 className="font-semibold text-lg text-black">
                Assistant Juridique
              </h1>
            </div>
          </div>
        </div>

        {/* Center - Country Selector */}
        <div className="flex-1 flex justify-center max-w-xs">
          <CountrySelector />
        </div>

        {/* Right side - Simple new chat button */}
        <div className="flex items-center">
          <button
            onClick={handleNewChat}
            className="hidden md:flex items-center space-x-2 px-3 py-2 rounded-lg border border-gray-200 hover:bg-gray-100 text-sm text-black transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Nouveau chat</span>
          </button>

          {/* Mobile new chat button */}
          <button
            onClick={handleNewChat}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 text-black"
            aria-label="Nouveau chat"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  );
}