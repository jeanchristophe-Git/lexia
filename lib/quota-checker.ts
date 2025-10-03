import { prisma } from './prisma';
import { LIMITS, QuotaError, QUOTA_ERROR_CODES } from './limits';

/**
 * Résultat de la vérification des quotas
 */
export interface QuotaStatus {
  messagesCountToday: number;
  messagesInSession: number;
  totalConversations: number;
  remainingToday: number;
  remainingInConversation: number;
  isNearLimit: boolean;
}

/**
 * Vérifie tous les quotas d'un utilisateur
 * Lance une QuotaError si une limite est dépassée
 */
export async function checkUserQuotas(
  userId: string | null,
  sessionId: string
): Promise<QuotaStatus> {
  // Si pas d'userId (utilisateur non connecté), pas de limites strictes
  if (!userId) {
    return {
      messagesCountToday: 0,
      messagesInSession: 0,
      totalConversations: 0,
      remainingToday: LIMITS.MAX_MESSAGES_PER_DAY,
      remainingInConversation: LIMITS.MAX_MESSAGES_PER_CONVERSATION,
      isNearLimit: false,
    };
  }

  // 1. Vérifier limite QUOTIDIENNE
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const messagesCountToday = await prisma.conversation.count({
    where: {
      userId,
      createdAt: { gte: today },
    },
  });

  if (messagesCountToday >= LIMITS.MAX_MESSAGES_PER_DAY) {
    throw new QuotaError(
      `Limite quotidienne atteinte (${LIMITS.MAX_MESSAGES_PER_DAY} messages/jour)`,
      QUOTA_ERROR_CODES.DAILY_LIMIT,
      LIMITS.MAX_MESSAGES_PER_DAY,
      messagesCountToday
    );
  }

  // 2. Vérifier limite PAR CONVERSATION
  const messagesInSession = await prisma.conversation.count({
    where: {
      userId,
      sessionId,
    },
  });

  if (messagesInSession >= LIMITS.MAX_MESSAGES_PER_CONVERSATION) {
    throw new QuotaError(
      `Cette conversation a atteint ${LIMITS.MAX_MESSAGES_PER_CONVERSATION} messages. Créez une nouvelle conversation pour continuer.`,
      QUOTA_ERROR_CODES.CONVERSATION_LIMIT,
      LIMITS.MAX_MESSAGES_PER_CONVERSATION,
      messagesInSession
    );
  }

  // 3. Vérifier nombre TOTAL de conversations
  const totalConversations = await prisma.conversation.groupBy({
    by: ['sessionId'],
    where: { userId },
    _count: { sessionId: true },
  });

  if (totalConversations.length >= LIMITS.MAX_CONVERSATIONS_PER_USER) {
    // Auto-suppression de la plus vieille conversation
    const oldestSession = await prisma.conversation.findFirst({
      where: { userId },
      orderBy: { createdAt: 'asc' },
      select: { sessionId: true },
    });

    if (oldestSession) {
      console.log(
        `[QUOTA] User ${userId} a atteint ${LIMITS.MAX_CONVERSATIONS_PER_USER} conversations. Suppression de la plus vieille: ${oldestSession.sessionId}`
      );

      await prisma.conversation.deleteMany({
        where: {
          userId,
          sessionId: oldestSession.sessionId,
        },
      });
    }
  }

  // Calculer les stats
  const remainingToday = LIMITS.MAX_MESSAGES_PER_DAY - messagesCountToday;
  const remainingInConversation =
    LIMITS.MAX_MESSAGES_PER_CONVERSATION - messagesInSession;

  const isNearLimit =
    messagesInSession / LIMITS.MAX_MESSAGES_PER_CONVERSATION >=
      LIMITS.WARNING_THRESHOLD ||
    messagesCountToday / LIMITS.MAX_MESSAGES_PER_DAY >= LIMITS.WARNING_THRESHOLD;

  return {
    messagesCountToday,
    messagesInSession,
    totalConversations: totalConversations.length,
    remainingToday,
    remainingInConversation,
    isNearLimit,
  };
}

/**
 * Supprime automatiquement les conversations de plus de X jours
 */
export async function cleanOldConversations() {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - LIMITS.AUTO_DELETE_AFTER_DAYS);

  const result = await prisma.conversation.deleteMany({
    where: {
      createdAt: { lt: cutoffDate },
    },
  });

  console.log(
    `[CLEANUP] ${result.count} conversations de plus de ${LIMITS.AUTO_DELETE_AFTER_DAYS} jours supprimées`
  );

  return result.count;
}
