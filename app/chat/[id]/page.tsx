'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Scale, Building2, FileText, Target, MessageSquare, AlertCircle, Settings, ChevronLeft, Plus, Send, Mic, Sparkles, Clock, Trash2, MoreVertical } from 'lucide-react';
import { useChatStore } from '@/lib/store/chatStore';

export default function ChatPage() {
  const params = useParams();
  const router = useRouter();
  const chatId = params.id as string;

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeSection, setActiveSection] = useState('chat');
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const {
    chats,
    currentChatId,
    setCurrentChat,
    addMessage,
    createChat,
    deleteChat,
    getCurrentChat,
  } = useChatStore();

  const currentChat = getCurrentChat();

  // Scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (chatId) {
      setCurrentChat(chatId);

      // Si le chat a un titre mais aucun message, envoyer le titre comme premier message
      const chat = chats.find(c => c.id === chatId);
      if (chat && chat.title && chat.title !== 'Nouvelle conversation' && chat.messages.length === 0) {
        // Envoyer automatiquement le titre comme premier message
        setInput(chat.title);
        setTimeout(() => {
          // Petit délai pour que l'UI se charge
          const firstMessage = chat.title;
          setInput('');
          setIsLoading(true);

          // Add user message
          addMessage(chatId, {
            role: 'user',
            content: firstMessage,
          });

          // Appel API
          fetch('/api/chat', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              question: firstMessage,
              session_id: chatId,
              conversation_history: []
            }),
          })
            .then(res => res.json())
            .then(data => {
              addMessage(chatId, {
                role: 'assistant',
                content: data.answer || 'Désolé, une erreur est survenue.',
              });
            })
            .catch(error => {
              console.error('Erreur:', error);
              addMessage(chatId, {
                role: 'assistant',
                content: `Désolé, une erreur est survenue lors de la communication avec l'API.`,
              });
            })
            .finally(() => {
              setIsLoading(false);
            });
        }, 500);
      }
    }
  }, [chatId, setCurrentChat]);

  useEffect(() => {
    scrollToBottom();
  }, [currentChat?.messages]);

  const handleSendMessage = async () => {
    if (!input.trim() || !chatId) return;

    const userMessage = input.trim();
    setInput('');
    setIsLoading(true);

    // Add user message
    addMessage(chatId, {
      role: 'user',
      content: userMessage,
    });

    // Auto-update chat title based on first message
    if (currentChat?.messages.length === 0) {
      const title = userMessage.slice(0, 50) + (userMessage.length > 50 ? '...' : '');
      useChatStore.getState().updateChatTitle(chatId, title);
    }

    try {
      // Appel à l'API Next.js
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: userMessage,
          session_id: chatId,
          conversation_history: currentChat?.messages.map(m => ({
            question: m.role === 'user' ? m.content : '',
            answer: m.role === 'assistant' ? m.content : ''
          })).filter(m => m.question || m.answer) || []
        }),
      });

      const data = await response.json();

      // Add AI response
      addMessage(chatId, {
        role: 'assistant',
        content: data.answer || 'Désolé, une erreur est survenue.',
      });
    } catch (error) {
      console.error('Erreur:', error);
      addMessage(chatId, {
        role: 'assistant',
        content: `Désolé, une erreur est survenue lors de la communication avec l'API. Vérifiez que le serveur est lancé et que la clé Groq est configurée dans .env.local`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewChat = () => {
    const newChatId = createChat();
    router.push(`/chat/${newChatId}`);
  };

  const handleDeleteChat = (id: string) => {
    deleteChat(id);
    if (id === chatId) {
      router.push('/');
    }
  };

  const menuItems = [
    { id: 'dashboard', name: 'Tableau de bord', icon: Target, href: '/' },
    { id: 'organization', name: 'Droit des Sociétés', icon: Building2 },
    { id: 'goals', name: 'Code Investissements', icon: FileText },
    { id: 'competition', name: 'Fiscalité & Taxes', icon: FileText },
    { id: 'delegation', name: 'Constitution CI', icon: Scale },
  ];

  const supportItems = [
    { id: 'bug', name: 'Signaler un bug', icon: AlertCircle, action: 'mailto' },
    { id: 'settings', name: 'Paramètres', icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-0'} transition-all duration-300 bg-white border-r border-gray-100 overflow-hidden flex flex-col`}>
        <div className="p-5 flex-1 overflow-y-auto">
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

          {/* New Chat Button */}
          <button
            onClick={handleNewChat}
            className="w-full mb-6 px-3 py-2.5 bg-blue-600 text-white text-[13px] font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Nouveau chat</span>
          </button>

          {/* Navigation */}
          <nav className="space-y-0.5 mb-6">
            <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2.5 px-3">
              Navigation
            </div>
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;

              if (item.href) {
                return (
                  <button
                    key={item.id}
                    onClick={() => router.push(item.href!)}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg transition-all text-[13px] ${
                      isActive
                        ? 'bg-gray-100 text-gray-900 font-medium'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <Icon className="w-[18px] h-[18px]" />
                    <span>{item.name}</span>
                  </button>
                );
              }

              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg transition-all text-[13px] ${
                    isActive
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

          {/* Chat History */}
          <nav className="space-y-0.5 mb-6">
            <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2.5 px-3 flex items-center justify-between">
              <span>Historique</span>
              <Clock className="w-3 h-3" />
            </div>
            <div className="space-y-1 max-h-64 overflow-y-auto">
              {chats.map((chat) => (
                <div
                  key={chat.id}
                  className={`group w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
                    chat.id === chatId
                      ? 'bg-blue-50 text-blue-900'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <button
                    onClick={() => router.push(`/chat/${chat.id}`)}
                    className="flex-1 flex flex-col gap-0.5 text-left min-w-0"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[12px] font-medium truncate">{chat.title}</span>
                      <MessageSquare className="w-3 h-3 flex-shrink-0 ml-1" />
                    </div>
                    <span className="text-[10px] text-gray-400">
                      {new Date(chat.updatedAt).toLocaleDateString('fr-FR')}
                    </span>
                  </button>
                  <button
                    onClick={() => handleDeleteChat(chat.id)}
                    className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-100 rounded transition-all"
                  >
                    <Trash2 className="w-3 h-3 text-red-600" />
                  </button>
                </div>
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
            {supportItems.map((item) => {
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
                <span className="text-gray-500">Chat</span>
                <span className="text-gray-300">/</span>
                <span className="font-medium text-gray-900 truncate max-w-md">
                  {currentChat?.title || 'Nouvelle conversation'}
                </span>
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

        {/* Messages */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto px-6 py-6">
            {currentChat?.messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-20">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-green-500 rounded-2xl flex items-center justify-center mb-4">
                  <Scale className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Posez votre question juridique
                </h2>
                <p className="text-gray-600 max-w-md">
                  LexIA est prêt à vous aider avec la législation ivoirienne. Commencez par poser votre première question.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {currentChat?.messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-4 ${
                      message.role === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    {message.role === 'assistant' && (
                      <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-green-500 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Scale className="w-4 h-4 text-white" />
                      </div>
                    )}
                    <div
                      className={`max-w-2xl rounded-2xl px-4 py-3 ${
                        message.role === 'user'
                          ? 'bg-blue-600 text-white'
                          : 'bg-white border border-gray-200 text-gray-900'
                      }`}
                    >
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">
                        {message.content}
                      </p>
                      <span
                        className={`text-[10px] mt-2 block ${
                          message.role === 'user' ? 'text-blue-100' : 'text-gray-400'
                        }`}
                      >
                        {new Date(message.timestamp).toLocaleTimeString('fr-FR', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                    {message.role === 'user' && (
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center flex-shrink-0 text-white text-xs font-semibold">
                        KA
                      </div>
                    )}
                  </div>
                ))}
                {isLoading && (
                  <div className="flex gap-4 justify-start">
                    <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-green-500 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Scale className="w-4 h-4 text-white" />
                    </div>
                    <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3">
                      <div className="flex gap-1.5">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>
        </div>

        {/* Input Area */}
        <div className="border-t border-gray-100 bg-white p-4">
          <div className="max-w-4xl mx-auto">
            <div className="relative flex items-end gap-2">
              <div className="flex-1 relative">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  placeholder="Posez votre question juridique..."
                  className="w-full px-4 py-3 pr-12 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-400 text-sm resize-none min-h-[52px] max-h-32"
                  rows={1}
                />
                <button className="absolute right-2 bottom-2 p-2 hover:bg-gray-200 rounded-lg transition-colors">
                  <Mic className="w-4 h-4 text-gray-400" />
                </button>
              </div>
              <button
                onClick={handleSendMessage}
                disabled={!input.trim() || isLoading}
                className="px-4 py-3 bg-gradient-to-r from-orange-500 to-green-600 text-white font-semibold rounded-xl hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            <p className="text-[10px] text-gray-400 text-center mt-2">
              LexIA peut faire des erreurs. Vérifiez les informations importantes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
