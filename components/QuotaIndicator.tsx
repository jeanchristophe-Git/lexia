'use client';

import { useEffect, useState } from 'react';
import { AlertCircle, TrendingUp } from 'lucide-react';

interface QuotaIndicatorProps {
  sessionId: string;
  userId?: string;
}

interface QuotaData {
  messagesCountToday: number;
  messagesInSession: number;
  totalConversations: number;
  remainingToday: number;
  remainingInConversation: number;
  isNearLimit: boolean;
  message: string;
}

export function QuotaIndicator({ sessionId, userId }: QuotaIndicatorProps) {
  const [quotaData, setQuotaData] = useState<QuotaData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuotas = async () => {
      try {
        const params = new URLSearchParams({
          session_id: sessionId,
          ...(userId && { user_id: userId }),
        });

        const response = await fetch(`/api/quotas?${params}`);
        const data = await response.json();

        setQuotaData(data);
      } catch (error) {
        console.error('Erreur chargement quotas:', error);
      } finally {
        setLoading(false);
      }
    };

    if (sessionId) {
      fetchQuotas();
    }
  }, [sessionId, userId]);

  if (loading || !quotaData) {
    return null;
  }

  // Calculer le pourcentage de la conversation (50 messages max)
  const conversationPercentage =
    (quotaData.messagesInSession / 50) * 100;

  // Calculer le pourcentage quotidien (100 messages max)
  const dailyPercentage = (quotaData.messagesCountToday / 100) * 100;

  // Couleur selon le niveau
  const getColor = (percentage: number) => {
    if (percentage >= 90) return 'text-red-500 bg-red-100';
    if (percentage >= 70) return 'text-orange-500 bg-orange-100';
    return 'text-green-500 bg-green-100';
  };

  const getBarColor = (percentage: number) => {
    if (percentage >= 90) return 'bg-red-500';
    if (percentage >= 70) return 'bg-orange-500';
    return 'bg-green-500';
  };

  return (
    <div className="border-t border-gray-200 bg-gray-50 p-3 space-y-3">
      {/* Avertissement si proche de la limite */}
      {quotaData.isNearLimit && (
        <div className="flex items-start gap-2 p-2 bg-yellow-50 border border-yellow-200 rounded-lg text-xs">
          <AlertCircle className="h-4 w-4 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div className="text-yellow-800">
            <p className="font-medium">Attention aux limites</p>
            <p className="text-yellow-700 mt-0.5">
              Vous approchez de la limite de cette conversation ou de votre quota quotidien.
            </p>
          </div>
        </div>
      )}

      {/* Barre de progression conversation */}
      <div>
        <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
          <span className="font-medium">Cette conversation</span>
          <span className={`px-2 py-0.5 rounded-full font-medium ${getColor(conversationPercentage)}`}>
            {quotaData.messagesInSession}/50
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all ${getBarColor(conversationPercentage)}`}
            style={{ width: `${Math.min(conversationPercentage, 100)}%` }}
          />
        </div>
        {quotaData.remainingInConversation <= 10 && quotaData.remainingInConversation > 0 && (
          <p className="text-xs text-orange-600 mt-1">
            Plus que {quotaData.remainingInConversation} messages avant de créer une nouvelle conversation
          </p>
        )}
      </div>

      {/* Barre de progression quotidienne */}
      <div>
        <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
          <span className="font-medium">Aujourd'hui</span>
          <span className={`px-2 py-0.5 rounded-full font-medium ${getColor(dailyPercentage)}`}>
            {quotaData.messagesCountToday}/100
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all ${getBarColor(dailyPercentage)}`}
            style={{ width: `${Math.min(dailyPercentage, 100)}%` }}
          />
        </div>
        <p className="text-xs text-gray-500 mt-1">
          {quotaData.remainingToday} messages restants aujourd'hui
        </p>
      </div>

      {/* Stats supplémentaires + CTA */}
      <div className="pt-2 border-t border-gray-200 space-y-2">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <TrendingUp className="h-3 w-3" />
          <span>{quotaData.totalConversations}/20 conversations totales</span>
        </div>

        <a
          href="mailto:contact@lexia.ci?subject=Demande version complète LexIA"
          className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white text-xs py-2 rounded-lg transition-colors"
        >
          🚀 Version complète illimitée
        </a>
      </div>
    </div>
  );
}
