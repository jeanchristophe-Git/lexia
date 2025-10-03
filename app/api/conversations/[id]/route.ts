import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// DELETE /api/conversations/[id] - Supprimer une conversation
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { error: 'ID de conversation manquant' },
        { status: 400 }
      );
    }

    // Supprimer toutes les conversations avec ce sessionId
    await prisma.conversation.deleteMany({
      where: {
        sessionId: id
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Conversation supprimée avec succès'
    });

  } catch (error: any) {
    console.error('Erreur suppression conversation:', error);

    return NextResponse.json(
      {
        error: 'Erreur lors de la suppression',
        details: error.message
      },
      { status: 500 }
    );
  }
}
