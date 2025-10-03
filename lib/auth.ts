import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import { verifyToken } from './jwt'

// ====== ADMIN AUTH ======
const SECRET_KEY = new TextEncoder().encode(
  process.env.ADMIN_SECRET_KEY || 'change-this-in-production-super-secret-key-lexia-admin-2024'
)

const ADMIN_ACCESS_KEY = process.env.ADMIN_ACCESS_KEY || 'lexia-admin-x7k9m2p5-2024'

const TOKEN_EXPIRATION = '24h'

export interface AdminSession {
  isAdmin: true
  timestamp: number
}

export function verifyAccessKey(key: string): boolean {
  return key === ADMIN_ACCESS_KEY
}

export async function createAdminToken(): Promise<string> {
  const token = await new SignJWT({ isAdmin: true, timestamp: Date.now() })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(TOKEN_EXPIRATION)
    .sign(SECRET_KEY)

  return token
}

export async function verifyAdminToken(token: string): Promise<AdminSession | null> {
  try {
    const verified = await jwtVerify(token, SECRET_KEY)
    return verified.payload as AdminSession
  } catch (error) {
    return null
  }
}

export async function getAdminSession(): Promise<AdminSession | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get('admin_session')?.value

  if (!token) return null

  return verifyAdminToken(token)
}

// ====== USER AUTH (Neon Authorize) ======
export interface UserSession {
  user: {
    id: string
    email: string
    name?: string
  }
}

export async function getSession(): Promise<UserSession | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get('token')?.value

  if (!token) return null

  const payload = await verifyToken(token)
  if (!payload) return null

  return {
    user: {
      id: payload.sub as string,
      email: payload.email as string,
      name: payload.name as string | undefined,
    }
  }
}

export async function requireAuth(): Promise<UserSession> {
  const session = await getSession()
  if (!session) {
    throw new Error('Unauthorized')
  }
  return session
}
