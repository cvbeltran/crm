import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return req.cookies.getAll()
        },
        setAll(cookiesToSet: Array<{ name: string; value: string; options?: any }>) {
          cookiesToSet.forEach(({ name, value, options }) => {
            res.cookies.set(name, value, options)
          })
        },
      },
    }
  )

  const {
    data: { session },
  } = await supabase.auth.getSession()

  const pathname = req.nextUrl.pathname

  // Public auth routes that don't require authentication
  const publicAuthRoutes = ['/login', '/signup', '/forgot-password', '/auth/callback', '/auth/setup-password', '/auth/reset-password', '/auth/login', '/auth/signup', '/auth/signout']
  const isPublicAuthRoute = publicAuthRoutes.some(route => pathname.startsWith(route))

  // If user is authenticated and trying to access login/signup, redirect to home
  if (session && (pathname === '/login' || pathname === '/signup')) {
    return NextResponse.redirect(new URL('/', req.url))
  }

  // If no session and trying to access protected route, redirect to login
  if (!session && !isPublicAuthRoute && !pathname.startsWith('/_next') && !pathname.startsWith('/api')) {
    const loginUrl = new URL('/login', req.url)
    // Preserve the intended destination
    loginUrl.searchParams.set('next', pathname)
    return NextResponse.redirect(loginUrl)
  }

  return res
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
