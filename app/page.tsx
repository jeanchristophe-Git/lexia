'use client';

import { useState } from 'react';
import { Sparkles, Mic, Menu } from 'lucide-react';
import Sidebar from '@/components/layout/Sidebar';
import ChatInterface from '@/components/chat/ChatInterface';
import { useChatStore } from '@/store/chatStore';

export default function HomePage() {
  const [query, setQuery] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { messages, sendMessage } = useChatStore();

  const recentGoals = [
    {
      title: "Créer une SARL en Côte d'Ivoire",
      subtitle: "Documents requis et démarches administratives"
    },
    {
      title: "Régime fiscal applicable aux startups",
      subtitle: "Code des Investissements et exonérations"
    }
  ];

  const handleQuickStart = async (question: string) => {
    if (!question.trim()) return;
    await sendMessage(question);
  };

  // Si des messages existent, afficher le ChatInterface
  if (messages.length > 0) {
    return (
      <div className="flex h-screen bg-claude-bg-main">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        {/* Hamburger Menu Button - Mobile only */}
        <button
          onClick={() => setSidebarOpen(true)}
          className="md:hidden fixed top-4 left-4 z-30 p-2 bg-claude-sidebar rounded-lg text-claude-text-light hover:bg-claude-border transition-colors"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        <ChatInterface />
      </div>
    );
  }

  // Sinon, afficher l'écran d'accueil
  return (
    <div className="flex h-screen bg-claude-bg-main">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Hamburger Menu Button - Mobile only */}
      <button
        onClick={() => setSidebarOpen(true)}
        className="md:hidden fixed top-4 left-4 z-30 p-2 bg-claude-sidebar rounded-lg text-claude-text-light hover:bg-claude-border transition-colors"
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-3xl mx-auto px-4 md:px-6 py-8 md:py-12">
            {/* Welcome Section */}
            <div className="text-center mb-8 md:mb-12">
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-claude-user-bubble/20 text-claude-user-bubble text-xs font-medium rounded-full mb-4 md:mb-6">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Intelligence Artificielle Juridique</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-claude-text-light mb-3 leading-tight">
                Bienvenue sur LexIA
              </h1>
              <p className="text-sm md:text-base text-claude-text-secondary max-w-xl mx-auto leading-relaxed">
                Obtenez instantanément des réponses précises sur la législation ivoirienne. Gagnez du temps et lancez votre business en conformité totale avec la loi.
              </p>
            </div>

            {/* Recent Goals */}
            <div className="mb-6 md:mb-8">
              <h2 className="text-xs md:text-sm font-semibold text-claude-text-light mb-3">Recherches récentes</h2>
              <div className="space-y-2.5">
                {recentGoals.map((goal, index) => (
                  <div
                    key={index}
                    onClick={() => handleQuickStart(goal.title)}
                    className="bg-claude-sidebar border border-claude-border rounded-xl p-3 md:p-4 hover:border-claude-user-bubble hover:shadow-lg transition-all cursor-pointer group"
                  >
                    <h3 className="text-xs md:text-sm font-medium text-claude-text-light mb-1 group-hover:text-claude-user-bubble transition-colors">
                      {goal.title}
                    </h3>
                    <p className="text-[11px] md:text-xs text-claude-text-secondary leading-relaxed">
                      {goal.subtitle}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Input Box */}
            <div className="bg-claude-sidebar/50 rounded-2xl p-4 md:p-6 border border-claude-border shadow-lg">
              <div className="mb-4">
                <div className="inline-block px-2.5 py-1 bg-claude-assistant-bubble text-[11px] font-medium text-claude-text-secondary rounded-full mb-2.5">
                  Recherche juridique • Assistant IA • Législation CI
                </div>
                <h3 className="text-base md:text-lg font-semibold text-claude-text-light mb-1">
                  Posez votre question juridique
                </h3>
              </div>

              <div className="relative">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && query.trim()) {
                      handleQuickStart(query);
                      setQuery('');
                    }
                  }}
                  placeholder="Comment créer une entreprise en Côte d'Ivoire ?"
                  className="w-full px-4 py-3 md:py-3.5 pr-24 md:pr-28 bg-claude-bg-main border border-claude-border rounded-xl focus:outline-none focus:ring-2 focus:ring-claude-user-bubble focus:border-transparent text-claude-text-light placeholder-claude-text-secondary text-xs md:text-[13px]"
                />
                <div className="absolute right-1.5 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
                  <button className="p-2 hover:bg-claude-border rounded-lg transition-colors">
                    <Mic className="w-4 h-4 text-claude-text-secondary" />
                  </button>
                  <button
                    onClick={() => {
                      if (query.trim()) {
                        handleQuickStart(query);
                        setQuery('');
                      }
                    }}
                    disabled={!query.trim()}
                    className="px-3 md:px-4 py-2 bg-claude-user-bubble hover:bg-blue-600 text-white text-xs font-semibold rounded-lg hover:shadow-md transition-all flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="hidden md:inline">Envoyer</span>
                    <Sparkles className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
