import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value: '',
            ...options,
          });
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Public routes
  const pathname = request.nextUrl.pathname;
  const isPublicRoute =
    pathname === '/' ||
    pathname.startsWith('/auth/login') ||
    pathname.startsWith('/auth/signup');

  // Allow debug, admin, and test pages through without redirect
  if (pathname.startsWith('/debug') || pathname.startsWith('/admin') || pathname.startsWith('/agency-test')) {
    return response;
  }

  // Redirect to login if not authenticated and trying to access protected route
  if (!user && !isPublicRoute) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  // Redirect to appropriate dashboard if authenticated and on public route (including homepage)
  if (user && isPublicRoute) {
    // Get user role from database
    const { data: userData, error: roleError } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single();

    // If there's an error fetching the role or no user data exists, sign them out
    if (roleError || !userData) {
      await supabase.auth.signOut();
      return NextResponse.redirect(new URL('/auth/login?error=account_setup', request.url));
    }

    // Redirect based on role
    if (userData.role === 'consultant') {
      return NextResponse.redirect(new URL('/consultant', request.url));
    } else if (userData.role === 'agency') {
      return NextResponse.redirect(new URL('/agency', request.url));
    } else if (userData.role === 'client') {
      return NextResponse.redirect(new URL('/client', request.url));
    } else {
      // Invalid or missing role - sign them out
      await supabase.auth.signOut();
      return NextResponse.redirect(new URL('/auth/login?error=invalid_role', request.url));
    }
  }

  // Role-based route protection - redirect to correct dashboard instead of showing error
  if (user && !isPublicRoute) {
    const { data: userData } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single();

    if (userData) {
      // If accessing wrong dashboard, redirect to correct one
      if (pathname.startsWith('/consultant') && userData.role !== 'consultant') {
        return NextResponse.redirect(new URL(`/${userData.role}`, request.url));
      }
      if (pathname.startsWith('/agency') && userData.role !== 'agency') {
        return NextResponse.redirect(new URL(`/${userData.role}`, request.url));
      }
      if (pathname.startsWith('/client') && userData.role !== 'client') {
        return NextResponse.redirect(new URL(`/${userData.role}`, request.url));
      }
    }
  }

  return response;
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
};
