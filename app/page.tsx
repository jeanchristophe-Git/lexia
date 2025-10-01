'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Scale, Building2, FileText, Target, Users, MessageSquare, AlertCircle, Settings, ChevronLeft, Plus, Share2, Mic, Sparkles, Clock } from 'lucide-react';
import { useChatStore } from '@/lib/store/chatStore';

export default function LexIADashboard() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [query, setQuery] = useState('');

  const { chats, createChat } = useChatStore();

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

  const handleNewChat = () => {
    const chatId = createChat();
    router.push(`/chat/${chatId}`);
  };

  const handleQuickStart = (question: string) => {
    const chatId = createChat(question);
    router.push(`/chat/${chatId}`);
  };

  const menuItems = [
    { id: 'dashboard', name: 'Tableau de bord', icon: Target },
    { id: 'organization', name: 'Droit des Sociétés', icon: Building2 },
    { id: 'goals', name: 'Code Investissements', icon: FileText },
    { id: 'competition', name: 'Fiscalité & Taxes', icon: FileText },
    { id: 'delegation', name: 'Constitution CI', icon: Scale }
  ];

  const supportItems = [
    { id: 'bug', name: 'Signaler un bug', icon: AlertCircle, action: 'mailto' },
    { id: 'settings', name: 'Paramètres', icon: Settings }
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-0'} transition-all duration-300 bg-white border-r border-gray-100 overflow-hidden flex flex-col`}>
        <div className="p-5 flex-1">
          {/* Logo */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center">
                <Scale className="w-4 h-4 text-white" />
              </div>
              <span className="text-base font-semibold text-gray-900">LexIA</span>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
            >
              <ChevronLeft className="w-4 h-4 text-gray-400" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="space-y-0.5 mb-6">
            <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2.5 px-3">
              Navigation
            </div>
            {menuItems.map(item => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg transition-all text-[13px] ${
                    activeSection === item.id
                      ? 'bg-gray-100 text-gray-900 font-medium'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Icon className="w-[18px] h-[18px]" />
                  <span>{item.name}</span>
                </button>
              );
            })}
          </nav>

          {/* Historique des conversations */}
          <nav className="space-y-0.5 mb-6">
            <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2.5 px-3 flex items-center justify-between">
              <span>Historique</span>
              <Clock className="w-3 h-3" />
            </div>
            <div className="space-y-1 max-h-48 overflow-y-auto">
              {chats.slice(0, 5).map(chat => (
                <button
                  key={chat.id}
                  onClick={() => router.push(`/chat/${chat.id}`)}
                  className="w-full flex flex-col gap-0.5 px-3 py-2 rounded-lg transition-all text-gray-600 hover:bg-gray-50 hover:text-gray-900 text-left"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] font-medium truncate">{chat.title}</span>
                    <MessageSquare className="w-3 h-3 flex-shrink-0 ml-1" />
                  </div>
                  <span className="text-[10px] text-gray-400">
                    {new Date(chat.updatedAt).toLocaleDateString('fr-FR')}
                  </span>
                </button>
              ))}
              {chats.length === 0 && (
                <p className="text-[11px] text-gray-400 px-3 py-2">Aucun historique</p>
              )}
            </div>
          </nav>

          {/* Support */}
          <nav className="space-y-0.5">
            <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2.5 px-3">
              Support
            </div>
            {supportItems.map(item => {
              const Icon = item.icon;

              if (item.action === 'mailto') {
                return (
                  <a
                    key={item.id}
                    href="mailto:hello.jeanchristophebogbe@gmail.com?subject=Bug%20LexIA%20-%20Signalement&body=Bonjour,%0D%0A%0D%0AJe%20souhaite%20signaler%20un%20bug%20:%0D%0A%0D%0A"
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg transition-all text-[13px] text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  >
                    <Icon className="w-[18px] h-[18px]" />
                    <span>{item.name}</span>
                  </a>
                );
              }

              return (
                <button
                  key={item.id}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg transition-all text-[13px] text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                >
                  <Icon className="w-[18px] h-[18px]" />
                  <span>{item.name}</span>
                </button>
              );
            })}
          </nav>

          {/* Theme Toggle */}
          <div className="mt-6 flex gap-1.5 bg-gray-100 rounded-lg p-1">
            <button className="flex-1 px-3 py-1.5 bg-white text-gray-900 text-xs font-medium rounded-md shadow-sm">
              Light
            </button>
            <button className="flex-1 px-3 py-1.5 text-gray-600 text-xs font-medium rounded-md hover:text-gray-900">
              System
            </button>
          </div>
        </div>

        {/* User Profile */}
        <div className="p-4 border-t border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-orange-400 to-green-500 rounded-full flex items-center justify-center text-white text-xs font-semibold">
              KA
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-medium text-gray-900 truncate">Kouadio Aman</p>
              <p className="text-[11px] text-gray-500 truncate">Entrepreneur • CI</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-100 px-6 py-3.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 text-sm">
                {!sidebarOpen && (
                  <button
                    onClick={() => setSidebarOpen(true)}
                    className="p-1 hover:bg-gray-100 rounded transition-colors mr-2"
                  >
                    <ChevronLeft className="w-3.5 h-3.5 text-gray-400 rotate-180" />
                  </button>
                )}
                <span className="text-gray-500">Accueil</span>
                <span className="text-gray-300">/</span>
                <span className="font-medium text-gray-900">Tableau de bord</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleNewChat}
                className="px-3.5 py-2 text-gray-700 text-[13px] font-medium rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-2"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Nouveau chat</span>
              </button>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto px-6 py-10">
            {/* Welcome Section */}
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-700 text-xs font-medium rounded-full mb-5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Intelligence Artificielle Juridique</span>
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-3 leading-tight">
                Bienvenue sur LexIA
              </h1>
              <p className="text-base text-gray-600 max-w-xl mx-auto leading-relaxed">
                Obtenez instantanément des réponses précises sur la législation ivoirienne. Gagnez du temps et lancez votre business en conformité totale avec la loi.
              </p>
              <button
                onClick={handleNewChat}
                className="mt-6 px-5 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center gap-2 shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Créer un nouveau chat</span>
              </button>
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
                    <h3 className="text-sm font-medium text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
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
                  Définir vos objectifs • Atteindre l'efficacité prévue • Alimenté par l'IA
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  Alignement des objectifs intelligents
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
                    }
                  }}
                  placeholder="Saisissez votre question juridique ici"
                  className="w-full px-4 py-3.5 pr-28 bg-white/95 backdrop-blur-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-400 text-[13px] shadow-sm"
                />
                <div className="absolute right-1.5 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <Mic className="w-4 h-4 text-gray-400" />
                  </button>
                  <button
                    onClick={() => query.trim() && handleQuickStart(query)}
                    disabled={!query.trim()}
                    className="px-4 py-2 bg-gradient-to-r from-orange-500 to-green-600 text-white text-xs font-semibold rounded-lg hover:shadow-md transition-all flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span>Générer</span>
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
