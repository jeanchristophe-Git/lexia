import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/conversations - Récupérer toutes les conversations groupées par sessionId
export async function GET(request: NextRequest) {
  try {
    // Récupérer toutes les conversations, groupées par sessionId
    const conversations = await prisma.conversation.findMany({
      orderBy: {
        createdAt: 'desc'
      },
      select: {
        sessionId: true,
        question: true,
        answer: true,
        createdAt: true,
        confidence: true,
        sources: true
      }
    });

    // Grouper par sessionId et créer un titre à partir de la première question
    const groupedConversations = conversations.reduce((acc, conv) => {
      if (!acc[conv.sessionId]) {
        acc[conv.sessionId] = {
          id: conv.sessionId,
          title: conv.question.length > 50
            ? conv.question.substring(0, 50) + '...'
            : conv.question,
          messages: [],
          createdAt: conv.createdAt,
          updatedAt: conv.createdAt
        };
      }

      // Ajouter les messages
      acc[conv.sessionId].messages.push(
        {
          id: `${conv.sessionId}_q_${Date.now()}`,
          role: 'user',
          content: conv.question,
          timestamp: conv.createdAt
        },
        {
          id: `${conv.sessionId}_a_${Date.now()}`,
          role: 'assistant',
          content: conv.answer,
          timestamp: conv.createdAt,
          sources: conv.sources && conv.sources.trim() !== '' ? JSON.parse(conv.sources) : []
        }
      );

      // Mettre à jour la date de dernière modification
      if (new Date(conv.createdAt) > new Date(acc[conv.sessionId].updatedAt)) {
        acc[conv.sessionId].updatedAt = conv.createdAt;
      }

      return acc;
    }, {} as any);

    // Convertir l'objet en tableau et trier par date
    const conversationsArray = Object.values(groupedConversations).sort(
      (a: any, b: any) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );

    return NextResponse.json({
      conversations: conversationsArray,
      count: conversationsArray.length
    });

  } catch (error: any) {
    console.error('Erreur chargement conversations:', error);

    return NextResponse.json(
      {
        error: 'Erreur lors du chargement des conversations',
        details: error.message
      },
      { status: 500 }
    );
  }
}
