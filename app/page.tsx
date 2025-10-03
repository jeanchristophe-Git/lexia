'use client';

import { useState } from 'react';
import { Sparkles, Mic } from 'lucide-react';
import Sidebar from '@/components/layout/Sidebar';
import ChatInterface from '@/components/chat/ChatInterface';
import { useChatStore } from '@/store/chatStore';

export default function HomePage() {
  const [query, setQuery] = useState('');
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
      <div className="flex h-screen bg-white dark:bg-gray-900">
        <Sidebar isOpen={true} onClose={() => {}} />
        <ChatInterface />
      </div>
    );
  }

  // Sinon, afficher l'écran d'accueil
  return (
    <div className="flex h-screen bg-white dark:bg-gray-900">
      {/* Sidebar */}
      <Sidebar isOpen={true} onClose={() => {}} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto px-6 py-10">
            {/* Welcome Section */}
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 text-xs font-medium rounded-full mb-5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Intelligence Artificielle Juridique</span>
              </div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-3 leading-tight">
                Bienvenue sur LexIA
              </h1>
              <p className="text-base text-gray-600 dark:text-gray-400 max-w-xl mx-auto leading-relaxed">
                Obtenez instantanément des réponses précises sur la législation ivoirienne. Gagnez du temps et lancez votre business en conformité totale avec la loi.
              </p>
            </div>

            {/* Recent Goals */}
            <div className="mb-8">
              <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3.5">Recherches récentes</h2>
              <div className="space-y-2.5">
                {recentGoals.map((goal, index) => (
                  <div
                    key={index}
                    onClick={() => handleQuickStart(goal.title)}
                    className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-sm transition-all cursor-pointer group"
                  >
                    <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                      {goal.title}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                      {goal.subtitle}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Input Box */}
            <div className="bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 dark:from-purple-900/20 dark:via-blue-900/20 dark:to-pink-900/20 rounded-2xl p-6 border border-purple-100/50 dark:border-purple-700/50 shadow-sm">
              <div className="mb-4">
                <div className="inline-block px-2.5 py-1 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm text-[11px] font-medium text-gray-700 dark:text-gray-300 rounded-full mb-2.5 shadow-sm">
                  Recherche juridique • Assistant IA • Législation CI
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
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
                  className="w-full px-4 py-3.5 pr-28 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400 focus:border-transparent text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 text-[13px] shadow-sm"
                />
                <div className="absolute right-1.5 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
                  <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                    <Mic className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                  </button>
                  <button
                    onClick={() => {
                      if (query.trim()) {
                        handleQuickStart(query);
                        setQuery('');
                      }
                    }}
                    disabled={!query.trim()}
                    className="px-4 py-2 bg-gradient-to-r from-orange-500 to-green-600 text-white text-xs font-semibold rounded-lg hover:shadow-md transition-all flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span>Envoyer</span>
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
