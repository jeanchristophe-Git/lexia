'use client';

import { useChatStore } from '@/store/chatStore';

export default function WelcomeScreen() {
  const { selectedCountry, addMessage, createConversation, currentConversationId } = useChatStore();

  const handleQuestionClick = (question: string) => {
    if (!currentConversationId) {
      createConversation();
    }

    addMessage({
      role: 'user',
      content: question,
    });
  };

  const getExampleQuestions = () => {
    switch (selectedCountry.code) {
      case 'ci':
        return [
          "Comment créer une SARL en Côte d'Ivoire ?",
          "Quel est le SMIG en CI ?",
          "Procédure de divorce en Côte d'Ivoire",
          "Ouvrir un commerce en CI"
        ];
      case 'cm':
        return [
          "Création d'entreprise au Cameroun",
          "Salaire minimum au Cameroun",
          "Droit du travail camerounais",
          "Import-export au Cameroun"
        ];
      case 'tg':
        return [
          "Créer une entreprise au Togo",
          "Code de commerce togolais",
          "Droit de la famille au Togo",
          "Licences commerciales au Togo"
        ];
      default:
        return [];
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] max-w-2xl mx-auto px-4">
      {/* Logo et titre - style ChatGPT */}
      <div className="text-center mb-8">
        <div className="mb-4 flex justify-center">
          <div className="w-12 h-12 bg-claude-primary rounded-full flex items-center justify-center text-white text-xl font-semibold">
            ⚖️
          </div>
        </div>
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">
          Assistant Juridique {selectedCountry.flag} {selectedCountry.name}
        </h1>
        <p className="text-gray-600 text-base">
          Posez vos questions sur le droit {selectedCountry.code === 'ci' ? 'ivoirien' : selectedCountry.code === 'cm' ? 'camerounais' : 'togolais'}
        </p>
      </div>

      {/* Suggestions - style ChatGPT (chips simples) */}
      <div className="w-full mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {getExampleQuestions().map((question, index) => (
            <button
              key={index}
              onClick={() => handleQuestionClick(question)}
              className="p-4 text-left border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors text-sm text-gray-900 bg-white"
            >
              {question}
            </button>
          ))}
        </div>
      </div>

      {/* Disclaimer discret - style ChatGPT */}
      <div className="text-center text-xs text-gray-500 max-w-md">
        <p>
          Information générale sur le droit {selectedCountry.code === 'ci' ? 'ivoirien' : selectedCountry.code === 'cm' ? 'camerounais' : 'togolais'}.
          Consultez un avocat inscrit au barreau pour validation juridique.
        </p>
      </div>
    </div>
  );
}