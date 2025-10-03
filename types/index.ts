export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  sources?: LegalSource[];
  confidence?: 'low' | 'medium' | 'high';
  timestamp: Date;
}

export interface LegalSource {
  title: string;
  article: string;
  excerpt: string;
  url: string;
  country: string;
  year: number;
}

export interface ChatRequest {
  message: string;
  country: string;
  conversation_id?: string;
}

export interface ChatResponse {
  response: string;
  sources: LegalSource[];
  confidence: 'low' | 'medium' | 'high';
  conversation_id: string;
}

export interface Country {
  code: string;
  name: string;
  flag: string;
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  country: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ChatStore {
  // State
  messages: Message[];
  conversations: Conversation[];
  currentConversationId: string | null;
  selectedCountry: Country;
  isTyping: boolean;
  sidebarOpen: boolean;

  // Actions
  addMessage: (message: Omit<Message, 'id' | 'timestamp'>) => void;
  setMessages: (messages: Message[]) => void;
  setTyping: (typing: boolean) => void;
  setSelectedCountry: (country: Country) => void;
  setSidebarOpen: (open: boolean) => void;
  createConversation: (title?: string) => void;
  loadConversation: (id: string) => void;
  deleteConversation: (id: string) => void;
  clearCurrentChat: () => void;
  loadConversationsFromDB: () => Promise<void>;
  sendMessage: (content: string) => Promise<void>;
}