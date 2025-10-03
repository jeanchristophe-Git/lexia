'use client';

import { useState } from 'react';
import { Sparkles, ArrowUp, Menu } from 'lucide-react';
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
      <div className="flex h-screen bg-gray-50">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        {/* Hamburger Menu Button - Mobile only */}
        <button
          onClick={() => setSidebarOpen(true)}
          className="md:hidden fixed top-4 left-4 z-30 p-2.5 bg-white rounded-xl text-gray-700 hover:bg-gray-100 transition-colors shadow-sm border border-gray-200"
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
    <div className="flex h-screen bg-white">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Hamburger Menu Button - Mobile only */}
      <button
        onClick={() => setSidebarOpen(true)}
        className="md:hidden fixed top-4 left-4 z-30 p-2.5 bg-white rounded-xl text-gray-700 hover:bg-gray-100 transition-colors shadow-sm border border-gray-200"
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto px-4 md:px-8 py-12 md:py-16">
            {/* Welcome Section */}
            <div className="text-center mb-12 md:mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary text-sm font-medium rounded-full mb-6">
                <Sparkles className="w-4 h-4" />
                <span>Intelligence Artificielle Juridique</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
                Bienvenue sur <span className="text-primary">LexIA</span>
              </h1>
              <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
                Obtenez instantanément des réponses précises sur la législation ivoirienne. Gagnez du temps et lancez votre business en conformité totale avec la loi.
              </p>
            </div>

            {/* Recent Goals */}
            <div className="mb-10">
              <h2 className="text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wide">Exemples de questions</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {recentGoals.map((goal, index) => (
                  <div
                    key={index}
                    onClick={() => handleQuickStart(goal.title)}
                    className="bg-white border-2 border-gray-200 rounded-2xl p-5 hover:border-primary hover:shadow-lg transition-all cursor-pointer group"
                  >
                    <h3 className="text-sm font-semibold text-gray-900 mb-2 group-hover:text-primary transition-colors">
                      {goal.title}
                    </h3>
                    <p className="text-xs text-gray-500 leading-relaxed">
                      {goal.subtitle}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Input Box - Style moderne comme ChatGPT */}
            <div className="bg-white rounded-3xl p-2 border-2 border-gray-200 shadow-md hover:shadow-lg transition-shadow">
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
                  placeholder="Posez votre question juridique..."
                  className="w-full px-6 py-4 pr-16 bg-transparent border-none focus:outline-none text-gray-900 placeholder-gray-400 text-base"
                />
                <button
                  onClick={() => {
                    if (query.trim()) {
                      handleQuickStart(query);
                      setQuery('');
                    }
                  }}
                  disabled={!query.trim()}
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 rounded-xl bg-primary hover:bg-primary-dark text-white flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm hover:shadow-md"
                >
                  <ArrowUp className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Disclaimer sous l'input */}
            <p className="text-center text-xs text-gray-500 mt-4">
              LexIA peut faire des erreurs. Vérifiez les informations importantes avec un avocat.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
