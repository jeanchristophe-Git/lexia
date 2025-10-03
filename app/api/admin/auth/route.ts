import { NextRequest, NextResponse } from 'next/server'
import { verifyAccessKey, createAdminToken } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    const { accessKey } = await req.json()

    if (!verifyAccessKey(accessKey)) {
      return NextResponse.json(
        { error: 'Clé d\'accès invalide' },
        { status: 401 }
      )
    }

    const token = await createAdminToken()

    const response = NextResponse.json({
      success: true,
      message: 'Authentification réussie'
    })

    response.cookies.set('admin_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24,
      path: '/'
    })

    return response
  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true })
  response.cookies.delete('admin_session')
  return response
}
