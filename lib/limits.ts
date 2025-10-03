/**
 * Limites de quotas pour la version DÉMO
 * Configuration pour vente B2B - Montrer la valeur sans donner tout gratuitement
 */

export const LIMITS = {
  // Limite par conversation (version démo)
  MAX_MESSAGES_PER_CONVERSATION: 50,

  // Limite quotidienne par utilisateur (évite le spam)
  MAX_MESSAGES_PER_DAY: 100,

  // Nombre max de conversations par utilisateur (version démo)
  MAX_CONVERSATIONS_PER_USER: 20,

  // Rétention automatique des conversations (nettoyage auto)
  AUTO_DELETE_AFTER_DAYS: 30,

  // Avertissement quand proche de la limite
  WARNING_THRESHOLD: 0.8, // 80% pour alerter plus tôt
} as const;

/**
 * Erreur personnalisée pour les quotas dépassés
 */
export class QuotaError extends Error {
  constructor(
    message: string,
    public code: string,
    public limit: number,
    public current: number
  ) {
    super(message);
    this.name = 'QuotaError';
  }
}

/**
 * Codes d'erreur de quotas
 */
export const QUOTA_ERROR_CODES = {
  DAILY_LIMIT: 'DAILY_LIMIT_REACHED',
  CONVERSATION_LIMIT: 'CONVERSATION_LIMIT_REACHED',
  TOTAL_CONVERSATIONS_LIMIT: 'TOTAL_CONVERSATIONS_LIMIT_REACHED',
} as const;
