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

  // DEBUG logging
  console.log('Middleware - Path:', request.nextUrl.pathname);
  console.log('Middleware - User:', user?.id);
  console.log('Middleware - User metadata:', user?.user_metadata);

  // Public routes
  const publicRoutes = ['/auth/login', '/auth/signup', '/'];
  const isPublicRoute = publicRoutes.some(route => request.nextUrl.pathname.startsWith(route));

  // Redirect to login if not authenticated and trying to access protected route
  if (!user && !isPublicRoute) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  // Redirect to appropriate dashboard if authenticated and on public route (including homepage)
  if (user && isPublicRoute) {
    // Try to get role from user metadata first (set during signup)
    let role = user.user_metadata?.role;

    // If not in metadata, try to get from database
    if (!role) {
      const { data: userData } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single();
      role = userData?.role;
    }

    console.log('Middleware - Detected role:', role);
    console.log('Middleware - Redirecting from', request.nextUrl.pathname, 'to dashboard');

    if (role === 'consultant') {
      return NextResponse.redirect(new URL('/consultant', request.url));
    } else if (role === 'agency') {
      return NextResponse.redirect(new URL('/agency', request.url));
    } else if (role === 'client') {
      return NextResponse.redirect(new URL('/client', request.url));
    }
  }

  // Role-based route protection
  const pathname = request.nextUrl.pathname;

  if (user) {
    // Try to get role from user metadata first (set during signup)
    let role = user.user_metadata?.role;

    // If not in metadata, try to get from database
    if (!role) {
      const { data: userData } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single();
      role = userData?.role;
    }

    console.log('Middleware - Role check for', pathname, '- role:', role);

    // Consultant routes
    if (pathname.startsWith('/consultant') && role !== 'consultant') {
      console.log('Middleware - Blocking access to consultant route, redirecting to /unauthorized');
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }

    // Agency routes
    if (pathname.startsWith('/agency') && role !== 'agency') {
      console.log('Middleware - Blocking access to agency route, redirecting to /unauthorized');
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }

    // Client routes
    if (pathname.startsWith('/client') && role !== 'client') {
      console.log('Middleware - Blocking access to client route, redirecting to /unauthorized');
      return NextResponse.redirect(new URL('/unauthorized', request.url));
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
