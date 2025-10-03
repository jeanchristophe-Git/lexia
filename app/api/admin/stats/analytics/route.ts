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
    // Stats générales
    const totalConversations = await prisma.conversation.count()
    const totalMessages = await prisma.message.count()

    // Messages par rôle
    const userMessages = await prisma.message.count({
      where: { role: 'user' }
    })

    const assistantMessages = await prisma.message.count({
      where: { role: 'assistant' }
    })

    // Dernières 7 jours
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    const conversationsWeek = await prisma.conversation.groupBy({
      by: ['createdAt'],
      where: {
        createdAt: {
          gte: sevenDaysAgo
        }
      },
      _count: true
    })

    // Questions récentes (user messages)
    const topQuestions = await prisma.message.findMany({
      where: {
        role: 'user'
      },
      take: 10,
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({
      totalConversations,
      totalMessages,
      userMessages,
      assistantMessages,
      conversationsWeek: conversationsWeek.length,
      topQuestions: topQuestions.map(q => ({
        question: q.content.substring(0, 100),
        date: q.createdAt
      }))
    })
  } catch (error) {
    console.error('Erreur analytics:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des analytics' },
      { status: 500 }
    )
  }
}
