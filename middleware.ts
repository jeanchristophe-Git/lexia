import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyAdminToken } from './lib/auth'
import { stackServerApp } from './stack/server'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Protection admin dashboard
  if (pathname.startsWith('/sys-internal')) {
    const token = request.cookies.get('admin_session')?.value

    if (pathname === '/sys-internal/auth') {
      return NextResponse.next()
    }

    if (!token) {
      return NextResponse.redirect(new URL('/sys-internal/auth', request.url))
    }

    const session = await verifyAdminToken(token)

    if (!session) {
      return NextResponse.redirect(new URL('/sys-internal/auth', request.url))
    }
  }

  // Protection routes utilisateur avec Stack Auth
  const protectedRoutes = ['/']

  if (protectedRoutes.includes(pathname)) {
    const user = await stackServerApp.getUser({ request })

    if (!user) {
      return NextResponse.redirect(new URL('/handler/sign-in', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/sys-internal/:path*', '/']
}
