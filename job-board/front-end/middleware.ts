import { NextRequest, NextResponse } from 'next/server';
import type { NextFetchEvent } from 'next/server';

// JWT decode utility (since jwt-decode is not installed)
function decodeJWT(token: string): any {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => `%${('00' + c.charCodeAt(0).toString(16)).slice(-2)}`)
        .join('')
    );
    
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decoding JWT:', error);
    return null;
  }
}

// Helper function to get cookie value
function getCookie(request: NextRequest, name: string): string {
  const cookie = request.cookies.get(name);
  return cookie?.value || '';
}

export function middleware(request: NextRequest, event: NextFetchEvent) {
  const { pathname } = request.nextUrl;
  
  // Get auth token from cookies
  const token = getCookie(request, 'auth_token') || getCookie(request, 'token');
  
  // Public routes that don't require authentication
  const publicRoutes = ['/login', '/register', '/'];
  
  // If trying to access dashboard without token, redirect to login
  if (!token && pathname.startsWith('/dashboard')) {
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }
  
  // If token exists, decode and check role-based access
  if (token) {
    const decoded = decodeJWT(token);
    
    if (!decoded) {
      // Invalid token, redirect to login
      const loginUrl = new URL('/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
    
    const userRole = decoded.role;
    const agencyId = decoded.agencyId;
    
    // Route protection based on role
    if (pathname.startsWith('/dashboard/agency')) {
      // Only AGENCY role can access agency dashboard
      if (userRole !== 'agency') {
        // Redirect to appropriate dashboard or 403
        if (userRole === 'client') {
          const clientDashboardUrl = new URL('/dashboard/client', request.url);
          return NextResponse.redirect(clientDashboardUrl);
        } else {
          const forbiddenUrl = new URL('/403', request.url);
          return NextResponse.redirect(forbiddenUrl);
        }
      }
    }
    
    if (pathname.startsWith('/dashboard/client')) {
      // Only CLIENT role can access client dashboard
      if (userRole !== 'client') {
        // Redirect to appropriate dashboard or 403
        if (userRole === 'agency') {
          const agencyDashboardUrl = new URL('/dashboard/agency', request.url);
          return NextResponse.redirect(agencyDashboardUrl);
        } else {
          const forbiddenUrl = new URL('/403', request.url);
          return NextResponse.redirect(forbiddenUrl);
        }
      }
    }
    
    // If accessing general /dashboard without specific role path
    if (pathname === '/dashboard') {
      // Redirect to appropriate dashboard based on role
      if (userRole === 'agency') {
        const agencyDashboardUrl = new URL('/dashboard/agency', request.url);
        return NextResponse.redirect(agencyDashboardUrl);
      } else if (userRole === 'client') {
        const clientDashboardUrl = new URL('/dashboard/client', request.url);
        return NextResponse.redirect(clientDashboardUrl);
      } else {
        // Admin or other roles - you can customize this
        const forbiddenUrl = new URL('/403', request.url);
        return NextResponse.redirect(forbiddenUrl);
      }
    }
  }
  
  // Continue with the request
  return NextResponse.next();
}

// Configure middleware to run on specific paths
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
};
