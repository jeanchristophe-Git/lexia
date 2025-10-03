import { NextResponse } from 'next/server'
import { getAdminSession } from '@/lib/auth'

export async function GET() {
  const session = await getAdminSession()
  if (!session) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }

  try {
    // Vérifier les services
    const services = {
      groqApi: !!process.env.GROQ_API_KEY,
      database: !!process.env.DATABASE_URL,
      chromaDb: !!process.env.CHROMA_HOST,
      adminKey: !!process.env.ADMIN_SECRET_KEY
    }

    // Tester ChromaDB
    let chromaDbOnline = false
    try {
      const chromaRes = await fetch(`${process.env.CHROMA_HOST || 'http://localhost:8000'}/api/v1/heartbeat`, {
        signal: AbortSignal.timeout(2000)
      })
      // ChromaDB répond même avec une erreur v1 deprecated
      chromaDbOnline = chromaRes.status === 200 || chromaRes.status === 400
    } catch (error) {
      chromaDbOnline = false
    }

    return NextResponse.json({
      services,
      chromaDbOnline,
      env: process.env.NODE_ENV
    })
  } catch (error) {
    console.error('Erreur status:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la vérification' },
      { status: 500 }
    )
  }
}
