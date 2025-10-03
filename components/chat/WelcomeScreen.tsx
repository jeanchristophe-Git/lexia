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
      {/* Logo et titre */}
      <div className="text-center mb-10">
        <div className="mb-5 flex justify-center">
          <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg">
            ⚖️
          </div>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-3">
          Assistant Juridique {selectedCountry.flag} {selectedCountry.name}
        </h1>
        <p className="text-gray-600 text-base">
          Posez vos questions sur le droit {selectedCountry.code === 'ci' ? 'ivoirien' : selectedCountry.code === 'cm' ? 'camerounais' : 'togolais'}
        </p>
      </div>

      {/* Suggestions */}
      <div className="w-full mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {getExampleQuestions().map((question, index) => (
            <button
              key={index}
              onClick={() => handleQuestionClick(question)}
              className="p-5 text-left border-2 border-gray-200 rounded-2xl hover:bg-primary/5 hover:border-primary transition-all text-sm font-medium text-gray-800 bg-white shadow-sm hover:shadow-md"
            >
              {question}
            </button>
          ))}
        </div>
      </div>

      {/* Disclaimer discret */}
      <div className="text-center text-xs text-gray-500 max-w-md">
        <p>
          Information générale sur le droit {selectedCountry.code === 'ci' ? 'ivoirien' : selectedCountry.code === 'cm' ? 'camerounais' : 'togolais'}.
          Consultez un avocat inscrit au barreau pour validation juridique.
        </p>
      </div>
    </div>
  );
}