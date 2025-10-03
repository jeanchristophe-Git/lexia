import { NextResponse } from 'next/server'
import { getAdminSession } from '@/lib/auth'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  const session = await getAdminSession()
  if (!session) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }

  try {
    // Compter les conversations
    const totalConversations = await prisma.conversation.count()

    // Compter les messages
    const totalMessages = await prisma.message.count()

    // Conversations dernières 24h
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000)
    const conversationsToday = await prisma.conversation.count({
      where: {
        createdAt: {
          gte: yesterday
        }
      }
    })

    // Activité récente (derniers messages)
    const recentActivity = await prisma.message.findMany({
      take: 10,
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        conversation: true
      }
    })

    return NextResponse.json({
      totalConversations,
      totalMessages,
      conversationsToday,
      recentActivity: recentActivity.map(msg => ({
        text: msg.content.substring(0, 100),
        time: msg.createdAt,
        role: msg.role
      }))
    })
  } catch (error) {
    console.error('Erreur stats:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des stats' },
      { status: 500 }
    )
  }
}
