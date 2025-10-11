import { NextResponse } from 'next/server';

// Pages publiques autorisées sans auth
const PUBLIC_PATHS = [
  '/',
  '/faq',
  '/contact',
  '/pricing',
  '/login',
  '/register',
  '/terms',
  '/privacy',
  '/blog',
  '/guides',
  '/forgot-password',
  '/reset-password',
  '/verify-email'
];

// Helper: déterminer si la route est publique
function isPublic(pathname) {
  return PUBLIC_PATHS.some(p => pathname === p || pathname.startsWith(p + '/'));
}

// Helper: décoder un JWT sans vérification de signature
function decodeJWT(token) {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    
    const payload = JSON.parse(
      Buffer.from(parts[1].replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString()
    );
    return payload;
  } catch {
    return null;
  }
}

export async function middleware(req) {
  const { pathname } = req.nextUrl;

  console.log('[Middleware] Checking:', pathname);

  // Autoriser les assets publics / API Next internes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/static') ||
    pathname.startsWith('/images') ||
    pathname.startsWith('/favicon') ||
    pathname === '/favicon.ico'
  ) {
    return NextResponse.next();
  }

  // Récupérer JWT (cookie accessToken)
  const accessToken = req.cookies.get('accessToken')?.value;

  // Si l'utilisateur est connecté et essaie d'accéder à /login ou /register
  if (accessToken && (pathname === '/login' || pathname === '/register')) {
    const payload = decodeJWT(accessToken);
    
    // Vérifier que le token est valide et non expiré
    if (payload && (!payload.exp || payload.exp >= Date.now() / 1000)) {
      const isAgent = payload.is_agent || payload.account_type === 'AGENT';
      const defaultPath = isAgent ? '/dashboard' : '/athletes';
      console.log('[Middleware] Authenticated user accessing auth page, redirecting to', defaultPath);
      const url = req.nextUrl.clone();
      url.pathname = defaultPath;
      url.searchParams.set('already_authenticated', 'true');
      return NextResponse.redirect(url);
    }
  }

  // Si route publique, laisser passer
  if (isPublic(pathname)) {
    console.log('[Middleware] Public route, allowing');
    return NextResponse.next();
  }

  if (!accessToken) {
    console.log('[Middleware] No token, redirecting to /login');
    const url = req.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('next', pathname);
    url.searchParams.set('redirected', 'true');
    return NextResponse.redirect(url);
  }

  const payload = decodeJWT(accessToken);
  if (!payload) {
    console.log('[Middleware] Invalid token, redirecting to /login');
    const url = req.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('next', pathname);
    url.searchParams.set('redirected', 'true');
    return NextResponse.redirect(url);
  }

  // Vérifier expiration du token (champ exp)
  if (payload.exp && payload.exp < Date.now() / 1000) {
    console.log('[Middleware] Token expired, redirecting to /login');
    const url = req.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('next', pathname);
    url.searchParams.set('redirected', 'true');
    url.searchParams.set('expired', '1');
    return NextResponse.redirect(url);
  }

  // Déterminer le rôle (is_agent: true/false ou account_type)
  const isAgent = payload.is_agent || payload.account_type === 'AGENT';
  const role = isAgent ? 'AGENT' : 'COLLABORATOR';

  console.log('[Middleware] User role:', role);

  // Redirections automatiques selon rôle
  // Si agent accède à une route collaborateur (/follows, /organisations)
  if (isAgent && (pathname.startsWith('/follows') || pathname.startsWith('/organisations'))) {
    console.log('[Middleware] Agent accessing collaborator route, redirecting to /dashboard');
    const url = req.nextUrl.clone();
    url.pathname = '/dashboard';
    return NextResponse.redirect(url);
  }

  // Si collaborateur accède à une route agent uniquement
  if (!isAgent && pathname.startsWith('/athlete/')) {
    console.log('[Middleware] Collaborator accessing agent route, redirecting to /athletes');
    const url = req.nextUrl.clone();
    url.pathname = '/athletes';
    return NextResponse.redirect(url);
  }

  // Enrichir la requête : ajouter le rôle dans l'en-tête
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set('x-user-role', role);
  requestHeaders.set('x-user-email', payload.email || '');

  console.log('[Middleware] Allowing access');
  return NextResponse.next({ request: { headers: requestHeaders } });
}

export const config = {
  matcher: ['/((?!_next|static|images|favicon|api).*)'],
};
