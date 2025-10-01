'use client';

import { useState, useRef, useEffect } from 'react';
import {
  Plus,
  Search,
  ChevronDown,
  Send,
  Paperclip,
  Sun,
  Moon,
  Menu,
  X,
  User,
  Bot,
  Settings,
  HelpCircle,
  Bell,
  ChevronRight,
  Target,
  Users,
  CheckSquare,
  Link,
  LogOut,
  Building2,
  Briefcase,
  Home,
  Scale
} from 'lucide-react';
import { useTheme } from 'next-themes';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
}

const ChatGPTLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sidebarPinned, setSidebarPinned] = useState(true);
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const { theme, setTheme } = useTheme();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const simulateResponse = (userMessage: string) => {
    setIsTyping(true);

    setTimeout(() => {
      const responses = {
        'sarl': 'Pour créer une SARL en Côte d\'Ivoire, vous devez suivre plusieurs étapes :\n\n1. **Capital minimum** : 1 000 000 FCFA\n2. **Nombre d\'associés** : 2 à 50 associés\n3. **Formalités** :\n   - Rédaction des statuts\n   - Dépôt du capital en banque\n   - Enregistrement au Centre de Formalités des Entreprises (CFE)\n   - Publication dans un journal d\'annonces légales\n\n**Documents requis** :\n- Statuts de la société\n- Certificat de dépôt de capital\n- Formulaire de déclaration d\'existence\n- Pièces d\'identité des associés\n\nSelon le Code de commerce ivoirien, la durée de la procédure est généralement de 15 à 30 jours.',

        'travail': 'Le Code du Travail ivoirien (Loi n° 2015-532) régit les relations de travail en Côte d\'Ivoire :\n\n**Points clés** :\n• **Durée légale** : 40h/semaine, 8h/jour\n• **Congés payés** : 2,5 jours par mois travaillé\n• **Préavis** : Variable selon l\'ancienneté\n• **Salaire minimum** : SMIG fixé par décret\n\n**Types de contrats** :\n- CDI (Contrat à Durée Indéterminée)\n- CDD (Contrat à Durée Déterminée)\n- Contrat d\'apprentissage\n\nPour toute situation spécifique, il est conseillé de consulter un avocat spécialisé.',

        'default': 'En tant qu\'Assistant Juridique CI, je suis spécialisé dans la législation ivoirienne. Je peux vous aider avec :\n\n• **Droit des affaires** : Création d\'entreprises, contrats commerciaux\n• **Droit du travail** : Relations employeur-employé, contentieux\n• **Droit civil** : Contrats, responsabilité, famille\n• **Procédures** : Tribunaux, recours, médiation\n• **OHADA** : Droit des affaires harmonisé\n\nPour une réponse plus précise, pouvez-vous me donner plus de détails sur votre situation juridique ?'
      };

      let response = responses.default;
      const lowerMessage = userMessage.toLowerCase();

      if (lowerMessage.includes('sarl') || lowerMessage.includes('société') || lowerMessage.includes('entreprise')) {
        response = responses.sarl;
      } else if (lowerMessage.includes('travail') || lowerMessage.includes('employé') || lowerMessage.includes('contrat de travail')) {
        response = responses.travail;
      }

      const assistantMessage: Message = {
        id: Date.now().toString() + '_assistant',
        content: response,
        sender: 'assistant',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 2000);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();

    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString() + '_user',
      content: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    simulateResponse(inputValue);
  };

  const handleNewChat = () => {
    setMessages([]);
    setIsTyping(false);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div className="h-screen flex bg-[#f5f5f7] dark:bg-gray-900 transition-colors">
      {/* SIDEBAR */}
      <aside
        className={`${sidebarOpen ? 'w-64' : 'w-16'} transition-all duration-300 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col`}
        onMouseEnter={() => !sidebarPinned && setSidebarOpen(true)}
        onMouseLeave={() => !sidebarPinned && setSidebarOpen(false)}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-4 border-b border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-black dark:bg-white rounded-md flex items-center justify-center flex-shrink-0">
                <span className="text-white dark:text-black font-bold text-sm">A</span>
              </div>
              {sidebarOpen && (
                <span className="font-semibold text-gray-900 dark:text-gray-100">Assistant Juridique</span>
              )}
              <button
                onClick={() => {
                  setSidebarPinned(!sidebarPinned);
                  setSidebarOpen(!sidebarOpen);
                }}
                className="ml-auto p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
              >
                <Menu size={16} className="text-gray-500 dark:text-gray-400" />
              </button>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <nav className="p-4">
              <div className="space-y-1">
                <NavItem icon={<Target size={16} />} label="Dashboard" active expanded={sidebarOpen} />
                <NavItem icon={<Users size={16} />} label="Gestion des Consultations" expanded={sidebarOpen} />
                <NavItem icon={<Plus size={16} />} label="Questions & Réponses" expanded={sidebarOpen} onClick={handleNewChat} />
                <NavItem icon={<CheckSquare size={16} />} label="Suivi des Dossiers" expanded={sidebarOpen} />
                <NavItem icon={<Search size={16} />} label="Base Juridique" expanded={sidebarOpen} />
              </div>
            </nav>

            {/* Scrollable Chat History Section */}
            {sidebarOpen && (
              <div className="flex-1 overflow-y-auto px-4 pb-4">
                <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
                  <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-3">CONVERSATIONS RÉCENTES</div>
                  <div className="space-y-2">
                    {[
                      "Création SARL en CI",
                      "Code du Travail 2025",
                      "Droit des contrats",
                      "Procédures civiles",
                      "Bail commercial",
                      "Droit OHADA",
                      "Constitution ivoirienne",
                      "Procédures pénales",
                      "Droit de la famille",
                      "Code fiscal CI",
                      "Droit du travail",
                      "Contrats commerciaux",
                      "Propriété intellectuelle"
                    ].map((chat, index) => (
                      <button
                        key={index}
                        className="w-full text-left p-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors truncate"
                      >
                        {chat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Support Section */}
                <div className="mt-8 pt-4 border-t border-gray-100 dark:border-gray-700">
                  <div className="space-y-1">
                    <SupportItem icon={<Bell size={16} />} label="Notifications" expanded={sidebarOpen} />
                    <SupportItem icon={<HelpCircle size={16} />} label="Centre d'aide" expanded={sidebarOpen} />
                    <SupportItem icon={<Settings size={16} />} label="Paramètres" expanded={sidebarOpen} />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* User Profile */}
          <div className="p-4 border-t border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center flex-shrink-0">
                <User size={16} className="text-gray-600 dark:text-gray-300" />
              </div>
              {sidebarOpen && (
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-900 dark:text-gray-100">Utilisateur Juridique</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Côte d'Ivoire</div>
                </div>
              )}
            </div>
            {sidebarOpen && (
              <div className="mt-2 flex justify-between items-center">
                <button
                  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                  className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                >
                  {theme === 'dark' ? 'Light' : 'Dark'}
                </button>
                <button className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 flex items-center gap-1">
                  <LogOut size={12} />
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col">
        {/* Header Bar */}
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <nav className="text-sm text-gray-500 dark:text-gray-400">
              Overview / <span className="text-gray-900 dark:text-gray-100 font-medium">Dashboard</span>
            </nav>
            <div className="flex items-center gap-3">
              <button className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300">
                New Tab
              </button>
              <button className="p-1.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                <Settings size={16} />
              </button>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 bg-[#fafafa] dark:bg-gray-800 overflow-hidden flex items-center justify-center">
          {messages.length === 0 ? (
            <div className="w-full max-w-6xl mx-auto px-8 py-16">
              {/* Welcome Section */}
              <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 text-sm rounded-full mb-4">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  IA spécialisée en droit ivoirien
                </div>
                <h1 className="text-4xl md:text-5xl font-semibold text-gray-900 dark:text-gray-100 mb-6 leading-tight">
                  Assistant Juridique CI
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-400 mb-12 max-w-3xl mx-auto leading-relaxed">
                  Obtenez des conseils juridiques précis avec l'IA spécialisée en droit ivoirien, pour une gestion optimale de vos questions légales.
                </p>
              </div>

              {/* AI Input Section with Gradient Border */}
              <div className="max-w-4xl">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 rounded-2xl p-[2px]">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-8">
                      <div className="text-base text-gray-600 dark:text-gray-400 mb-6 text-center">
                        Définir. Analyser. Conseiller. Expertise juridique IA précise.
                      </div>
                      <div className="flex items-center gap-4">
                        <input
                          type="text"
                          value={inputValue}
                          onChange={(e) => setInputValue(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(e)}
                          placeholder="Assistant Juridique IA — Décrivez votre situation juridique"
                          className="flex-1 px-6 py-4 text-lg border border-gray-200 dark:border-gray-600 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                        />
                        <button
                          onClick={(e) => handleSendMessage(e)}
                          disabled={!inputValue.trim()}
                          className="px-6 py-2 bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-200 dark:border-indigo-600 rounded-xl text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 disabled:opacity-50 transition-colors font-medium"
                        >
                          Analyser →
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Mini Bubbles with Icons */}
                <div className="flex justify-center gap-4 mt-8">
                  <button
                    onClick={() => setInputValue("Comment créer une SARL en Côte d'Ivoire ?")}
                    className="flex flex-col items-center gap-2 group"
                  >
                    <div className="w-10 h-6 bg-white dark:bg-gray-800 rounded-full border border-gray-200 dark:border-gray-600 flex items-center justify-center group-hover:border-indigo-300 dark:group-hover:border-indigo-500 transition-colors shadow-sm">
                      <Building2 size={12} className="text-gray-600 dark:text-gray-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors" />
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors">Création SARL</span>
                  </button>

                  <button
                    onClick={() => setInputValue("Quels sont mes droits en tant qu'employé ?")}
                    className="flex flex-col items-center gap-2 group"
                  >
                    <div className="w-10 h-6 bg-white dark:bg-gray-800 rounded-full border border-gray-200 dark:border-gray-600 flex items-center justify-center group-hover:border-indigo-300 dark:group-hover:border-indigo-500 transition-colors shadow-sm">
                      <Briefcase size={12} className="text-gray-600 dark:text-gray-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors" />
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors">Droit Travail</span>
                  </button>

                  <button
                    onClick={() => setInputValue("Comment résilier un bail commercial ?")}
                    className="flex flex-col items-center gap-2 group"
                  >
                    <div className="w-10 h-6 bg-white dark:bg-gray-800 rounded-full border border-gray-200 dark:border-gray-600 flex items-center justify-center group-hover:border-indigo-300 dark:group-hover:border-indigo-500 transition-colors shadow-sm">
                      <Home size={12} className="text-gray-600 dark:text-gray-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors" />
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors">Bail Commercial</span>
                  </button>

                  <button
                    onClick={() => setInputValue("Procédures devant les tribunaux ivoiriens")}
                    className="flex flex-col items-center gap-2 group"
                  >
                    <div className="w-10 h-6 bg-white dark:bg-gray-800 rounded-full border border-gray-200 dark:border-gray-600 flex items-center justify-center group-hover:border-indigo-300 dark:group-hover:border-indigo-500 transition-colors shadow-sm">
                      <Scale size={12} className="text-gray-600 dark:text-gray-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors" />
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors">Procédures</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Messages Display */
            <div className="w-full max-w-4xl mx-auto px-8 py-8 overflow-y-auto max-h-full">
              <div className="space-y-6 mb-6">
                {messages.map((message) => (
                  <div key={message.id} className={`flex gap-4 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    {message.sender === 'assistant' && (
                      <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center flex-shrink-0">
                        <Bot size={16} className="text-white" />
                      </div>
                    )}

                    <div className={`max-w-3xl ${message.sender === 'user' ? 'order-1' : 'order-2'}`}>
                      <div className={`p-4 rounded-2xl ${
                        message.sender === 'user'
                          ? 'bg-indigo-600 text-white ml-12'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
                      }`}>
                        <div className="whitespace-pre-wrap leading-relaxed">{message.content}</div>
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 px-4">
                        {message.timestamp.toLocaleTimeString('fr-FR', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </div>

                    {message.sender === 'user' && (
                      <div className="w-10 h-10 rounded-full bg-gray-600 dark:bg-gray-500 flex items-center justify-center flex-shrink-0 order-2">
                        <User size={16} className="text-white" />
                      </div>
                    )}
                  </div>
                ))}

                {isTyping && (
                  <div className="flex gap-4 justify-start">
                    <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center flex-shrink-0">
                      <Bot size={16} className="text-white" />
                    </div>
                    <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-2xl">
                      <div className="flex space-x-2">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Fixed input at bottom when in conversation */}
              <div className="sticky bottom-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4">
                <form onSubmit={handleSendMessage} className="flex items-center gap-3">
                  <button type="button" className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors">
                    <Paperclip size={20} className="text-gray-500 dark:text-gray-400" />
                  </button>
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Continuez la conversation..."
                    className="flex-1 p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    disabled={isTyping}
                  />
                  <button
                    type="submit"
                    disabled={!inputValue.trim() || isTyping}
                    className="p-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <Send size={16} />
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

// Helper Components
function NavItem({ icon, label, active = false, expanded = true, onClick }: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  expanded?: boolean;
  onClick?: () => void;
}) {
  return (
    <div
      className={`flex items-center ${expanded ? 'gap-3' : 'justify-center'} p-2 rounded-md cursor-pointer transition-colors ${
        active
          ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'
          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
      }`}
      onClick={onClick}
      title={!expanded ? label : undefined}
    >
      {icon}
      {expanded && <span className="text-sm">{label}</span>}
    </div>
  );
}

function SupportItem({ icon, label, expanded = true }: { icon: React.ReactNode; label: string; expanded?: boolean }) {
  return (
    <div className={`flex items-center ${expanded ? 'justify-between' : 'justify-center'} p-2 rounded-md cursor-pointer text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors`}
         title={!expanded ? label : undefined}>
      <div className={`flex items-center ${expanded ? 'gap-3' : 'justify-center'}`}>
        {icon}
        {expanded && <span className="text-sm">{label}</span>}
      </div>
      {expanded && <ChevronRight size={14} className="text-gray-400" />}
    </div>
  );
}

export default ChatGPTLayout;