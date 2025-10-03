import { NextRequest, NextResponse } from 'next/server';
import { checkUserQuotas } from '@/lib/quota-checker';

/**
 * GET /api/quotas?session_id=xxx&user_id=xxx
 * Récupère les quotas d'un utilisateur pour une session donnée
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('session_id');
    const userId = searchParams.get('user_id');

    if (!sessionId) {
      return NextResponse.json(
        { error: 'session_id est requis' },
        { status: 400 }
      );
    }

    const quotaStatus = await checkUserQuotas(userId, sessionId);

    return NextResponse.json({
      ...quotaStatus,
      message:
        quotaStatus.isNearLimit
          ? 'Vous approchez de la limite'
          : 'Tout va bien',
    });
  } catch (error: any) {
    console.error('Erreur récupération quotas:', error);

    return NextResponse.json(
      {
        error: 'Erreur lors de la récupération des quotas',
        details: error.message,
      },
      { status: 500 }
    );
  }
}
