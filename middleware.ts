/**
 * Next.js Middleware
 *
 * This middleware runs on every request and handles:
 * 1. Session refresh for authenticated users
 * 2. Protected route access control
 * 3. Role-based redirects
 *
 * @module middleware
 */

import { createClient } from '@/lib/supabase/middleware'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * Public routes that don't require authentication
 */
const PUBLIC_ROUTES = [
  '/login',
  '/signup',
  '/auth/callback',
  '/forgot-password',
  '/reset-password',
  '/about',
  '/contact',
  '/privacy',
  '/terms',
]

/**
 * Routes that should redirect authenticated users
 * (e.g., login page when already logged in)
 */
const AUTH_ROUTES = ['/login', '/signup']

/**
 * Role-based route access control
 */
const ROLE_ROUTES = {
  student: ['/dashboard', '/learn', '/chat', '/progress', '/profile'],
  parent: ['/dashboard', '/children', '/reports', '/profile'],
  teacher: ['/dashboard', '/students', '/assignments', '/analytics', '/profile'],
  admin: ['/dashboard', '/admin', '/users', '/analytics', '/settings', '/profile'],
}

/**
 * Default redirect paths for each role after login
 */
const DEFAULT_REDIRECTS: Record<string, string> = {
  student: '/dashboard',
  parent: '/dashboard',
  teacher: '/dashboard',
  admin: '/dashboard',
}

/**
 * Middleware function that runs on every request
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip middleware for static files and API routes (except auth)
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/static') ||
    pathname.includes('.')
  ) {
    return NextResponse.next()
  }

  try {
    const { supabase, response } = createClient(request)

    // Refresh session if expired
    const {
      data: { session },
    } = await supabase.auth.getSession()

    const isAuthenticated = !!session
    const isPublicRoute = PUBLIC_ROUTES.some((route) =>
      pathname.startsWith(route)
    )
    const isAuthRoute = AUTH_ROUTES.some((route) => pathname.startsWith(route))

    // If user is authenticated and trying to access auth routes (login/signup),
    // redirect to dashboard
    if (isAuthenticated && isAuthRoute) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    // If user is not authenticated and trying to access protected routes,
    // redirect to login
    if (!isAuthenticated && !isPublicRoute) {
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('redirectTo', pathname)
      return NextResponse.redirect(loginUrl)
    }

    // For MVP: Allow all authenticated users to access all routes
    // Role-based access control disabled to prevent RLS issues
    // TODO: Re-enable role-based access after fixing RLS policies

    // Return the response with refreshed session
    return response
  } catch (error) {
    console.error('Middleware error:', error)
    // On error, allow the request to proceed
    // This prevents the entire app from breaking if middleware fails
    return NextResponse.next()
  }
}

/**
 * Matcher configuration
 *
 * Defines which routes the middleware should run on.
 * This excludes static files, images, and API routes for performance.
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - static files (images, etc.)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
