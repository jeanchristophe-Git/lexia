import { create } from 'zustand';
import { ChatStore, Message, Conversation, Country } from '@/types';
import { generateId } from '@/lib/utils';
import { DEFAULT_COUNTRY } from '@/lib/countries';

export const useChatStore = create<ChatStore>()((set, get) => ({
  // State
  messages: [],
  conversations: [],
  currentConversationId: null,
  selectedCountry: DEFAULT_COUNTRY,
  isTyping: false,
  sidebarOpen: false,

      // Actions
      addMessage: (messageData) => {
        const message: Message = {
          ...messageData,
          id: generateId(),
          timestamp: new Date(),
        };

        const { currentConversationId, conversations } = get();

        set((state) => ({ messages: [...state.messages, message] }));

        // Update conversation if exists
        if (currentConversationId) {
          const updatedConversations = conversations.map((conv) =>
            conv.id === currentConversationId
              ? {
                  ...conv,
                  messages: [...conv.messages, message],
                  updatedAt: new Date(),
                  // Update title if first user message
                  title: conv.messages.length === 0 && message.role === 'user'
                    ? message.content.length > 50
                      ? message.content.substring(0, 50) + '...'
                      : message.content
                    : conv.title
                }
              : conv
          );
          set({ conversations: updatedConversations });
        }
      },

      setMessages: (messages) => set({ messages }),

      setTyping: (isTyping) => set({ isTyping }),

      setSelectedCountry: (country) => set({ selectedCountry: country }),

      setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),

      createConversation: (title) => {
        const conversation: Conversation = {
          id: generateId(),
          title: title || 'Nouvelle conversation',
          messages: [],
          country: get().selectedCountry.code,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        set((state) => ({
          conversations: [conversation, ...state.conversations],
          currentConversationId: conversation.id,
          messages: [],
        }));
      },

      loadConversation: (id) => {
        const conversation = get().conversations.find((conv) => conv.id === id);
        if (conversation) {
          set({
            currentConversationId: id,
            messages: conversation.messages,
            selectedCountry: {
              ...get().selectedCountry,
              code: conversation.country
            }
          });
        }
      },

      deleteConversation: async (id) => {
        const { conversations, currentConversationId } = get();

        // Supprimer de la BDD via API
        try {
          const response = await fetch(`/api/conversations/${id}`, {
            method: 'DELETE',
          });

          if (!response.ok) {
            throw new Error('Erreur lors de la suppression');
          }

          // Supprimer du store local uniquement si la suppression BDD a réussi
          const updatedConversations = conversations.filter((conv) => conv.id !== id);

          set({
            conversations: updatedConversations,
            ...(currentConversationId === id && {
              currentConversationId: null,
              messages: [],
            }),
          });

        } catch (error) {
          console.error('Erreur suppression conversation:', error);
          alert('Erreur lors de la suppression de la conversation');
        }
      },

      clearCurrentChat: () => {
        set({
          messages: [],
          currentConversationId: null,
        });
      },

      // Charger les conversations depuis la BDD
      loadConversationsFromDB: async () => {
        try {
          const response = await fetch('/api/conversations');
          const data = await response.json();

          if (data.conversations) {
            set({ conversations: data.conversations });
          }
        } catch (error) {
          console.error('Erreur chargement conversations:', error);
        }
      },

      // Envoyer un message
      sendMessage: async (content: string) => {
        const { currentConversationId, selectedCountry, addMessage, createConversation, setTyping } = get();

        // Créer une conversation si elle n'existe pas
        if (!currentConversationId) {
          createConversation(content.length > 50 ? content.substring(0, 50) + '...' : content);
        }

        // Ajouter le message utilisateur
        addMessage({
          role: 'user',
          content,
        });

        // Activer l'indicateur de frappe
        setTyping(true);

        try {
          // Appeler l'API
          const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              question: content,
              session_id: currentConversationId || generateId(),
            }),
          });

          const data = await response.json();

          // Ajouter la réponse de l'assistant
          addMessage({
            role: 'assistant',
            content: data.answer || 'Désolé, je n\'ai pas pu générer une réponse.',
            sources: data.sources || [],
          });
        } catch (error) {
          console.error('Erreur lors de l\'envoi du message:', error);
          addMessage({
            role: 'assistant',
            content: 'Désolé, une erreur s\'est produite. Veuillez réessayer.',
            sources: [],
          });
        } finally {
          setTyping(false);
        }
      },
    }));

// Mock API calls
export async function sendMessage(message: string, country: string): Promise<{
  response: string;
  sources: any[];
  confidence: 'low' | 'medium' | 'high';
}> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1500 + Math.random() * 1000));

  // Mock responses based on country and message content
  const mockResponses = {
    ci: {
      creation: {
        response: `Pour créer une SARL en Côte d'Ivoire, voici les étapes principales :

**1. Capital social minimum :** 1 000 000 FCFA, divisé en parts sociales d'une valeur nominale minimale de 5 000 FCFA.

**2. Formalités obligatoires :**
- Rédaction des statuts par un notaire
- Dépôt du capital social dans une banque
- Immatriculation au RCCM (Registre du Commerce et du Crédit Mobilier)
- Inscription au registre des contribuables

**3. Documents requis :**
- Statuts de la société
- Procès-verbal de l'assemblée générale constitutive
- Justificatif de versement du capital
- Pièces d'identité des associés

**4. Coût approximatif :** Entre 150 000 et 300 000 FCFA pour l'ensemble des formalités.

La procédure prend généralement 2 à 4 semaines selon la diligence des démarches.`,
        sources: [
          {
            title: 'Code de Commerce Ivoirien',
            article: 'Article 4-1 à 4-15',
            excerpt: 'Les sociétés à responsabilité limitée sont constituées par une ou plusieurs personnes...',
            url: 'https://civilii.ci/code-commerce/art-4-1',
            country: 'ci',
            year: 2023
          }
        ],
        confidence: 'high' as const
      },
      travail: {
        response: `Le SMIG (Salaire Minimum Interprofessionnel Garanti) en Côte d'Ivoire est fixé à **75 000 FCFA par mois** depuis 2023.

**Conditions d'application :**
- S'applique à tous les secteurs d'activité
- Concerne tous les travailleurs salariés
- Base de calcul : 40 heures par semaine
- Révision périodique par décret

**Droits des employés :**
- Congés payés : 2,5 jours par mois travaillé
- Prime d'ancienneté après 2 ans de service
- Indemnités de licenciement selon l'ancienneté
- Couverture sociale obligatoire (CNPS)

**Sanctions en cas de non-respect :**
- Amende de 200 000 à 2 000 000 FCFA
- Rappel de salaire avec intérêts`,
        sources: [
          {
            title: 'Code du Travail Ivoirien',
            article: 'Article 31-1',
            excerpt: 'Le salaire minimum interprofessionnel garanti est fixé par décret...',
            url: 'https://civilii.ci/code-travail/art-31-1',
            country: 'ci',
            year: 2023
          }
        ],
        confidence: 'high' as const
      }
    },
    cm: {
      creation: {
        response: `Pour créer une SARL au Cameroun, les étapes sont les suivantes :

**1. Capital social minimum :** 100 000 FCFA, librement déterminé par les associés.

**2. Formalités au Centre de Formalités de Création d'Entreprises (CFCE) :**
- Dépôt de la demande d'immatriculation
- Réservation de la dénomination sociale
- Établissement des statuts

**3. Documents requis :**
- Formulaire de demande d'immatriculation
- Statuts de la société (3 exemplaires)
- Attestation de versement du capital
- Pièces d'identité des associés et gérants

**4. Coût total :** Environ 50 000 à 100 000 FCFA selon les frais notariaux.

**Délai :** 7 à 15 jours ouvrables pour l'obtention du certificat d'immatriculation.`,
        sources: [
          {
            title: 'Acte Uniforme OHADA sur les Sociétés Commerciales',
            article: 'Article 311 et suivants',
            excerpt: 'La société à responsabilité limitée est constituée par une ou plusieurs personnes...',
            url: 'https://ohada.org/acte-uniforme-societes/art-311',
            country: 'cm',
            year: 2023
          }
        ],
        confidence: 'high' as const
      }
    }
  };

  // Simple keyword matching for demo
  const content = message.toLowerCase();

  if (content.includes('sarl') || content.includes('entreprise') || content.includes('création')) {
    return mockResponses[country as keyof typeof mockResponses]?.creation || {
      response: "Je peux vous aider avec la création d'entreprise. Pouvez-vous préciser votre question ?",
      sources: [],
      confidence: 'medium' as const
    };
  }

  if (content.includes('salaire') || content.includes('smig') || content.includes('travail')) {
    return mockResponses.ci.travail;
  }

  // Default response
  return {
    response: `Je comprends votre question sur le droit ${country === 'ci' ? 'ivoirien' : country === 'cm' ? 'camerounais' : 'togolais'}.

Pour vous donner une réponse précise et fiable, j'aurais besoin de plus de détails sur votre situation spécifique.

Pouvez-vous reformuler votre question en précisant :
- Le domaine juridique concerné (droit commercial, travail, famille, etc.)
- Votre situation particulière
- Les documents ou informations dont vous disposez

Cela m'aidera à vous fournir une réponse adaptée avec les références légales appropriées.`,
    sources: [],
    confidence: 'medium' as const
  };
}