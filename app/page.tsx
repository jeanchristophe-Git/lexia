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
      <div className="flex h-screen bg-gray-50">
        <Sidebar isOpen={true} onClose={() => {}} />
        <ChatInterface />
      </div>
    );
  }

  // Sinon, afficher l'écran d'accueil
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar isOpen={true} onClose={() => {}} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto px-6 py-10">
            {/* Welcome Section */}
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-claude-primary/10 text-claude-primary text-xs font-medium rounded-full mb-5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Intelligence Artificielle Juridique</span>
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-3 leading-tight">
                Bienvenue sur LexIA
              </h1>
              <p className="text-base text-gray-600 max-w-xl mx-auto leading-relaxed">
                Obtenez instantanément des réponses précises sur la législation ivoirienne. Gagnez du temps et lancez votre business en conformité totale avec la loi.
              </p>
            </div>

            {/* Recent Goals */}
            <div className="mb-8">
              <h2 className="text-sm font-semibold text-gray-900 mb-3.5">Recherches récentes</h2>
              <div className="space-y-2.5">
                {recentGoals.map((goal, index) => (
                  <div
                    key={index}
                    onClick={() => handleQuickStart(goal.title)}
                    className="bg-white border border-gray-200 rounded-xl p-4 hover:border-gray-300 hover:shadow-sm transition-all cursor-pointer group"
                  >
                    <h3 className="text-sm font-medium text-gray-900 mb-1 group-hover:text-claude-primary transition-colors">
                      {goal.title}
                    </h3>
                    <p className="text-xs text-gray-500 leading-relaxed">
                      {goal.subtitle}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Input Box */}
            <div className="bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 rounded-2xl p-6 border border-purple-100/50 shadow-sm">
              <div className="mb-4">
                <div className="inline-block px-2.5 py-1 bg-white/90 backdrop-blur-sm text-[11px] font-medium text-gray-700 rounded-full mb-2.5 shadow-sm">
                  Recherche juridique • Assistant IA • Législation CI
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
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
                  className="w-full px-4 py-3.5 pr-28 bg-white/95 backdrop-blur-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-claude-primary focus:border-transparent text-gray-900 placeholder-gray-400 text-[13px] shadow-sm"
                />
                <div className="absolute right-1.5 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <Mic className="w-4 h-4 text-gray-400" />
                  </button>
                  <button
                    onClick={() => {
                      if (query.trim()) {
                        handleQuickStart(query);
                        setQuery('');
                      }
                    }}
                    disabled={!query.trim()}
                    className="px-4 py-2 bg-claude-primary hover:bg-claude-primary-dark text-white text-xs font-semibold rounded-lg hover:shadow-md transition-all flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
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
