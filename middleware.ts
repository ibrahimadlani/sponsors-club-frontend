import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

console.log('[Middleware] Module loaded');

// Liste des routes publiques (accessibles sans connexion)
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
];

// Préfixes publics (ex: /blog/slug)
const PUBLIC_PREFIXES = ['/blog', '/guides', '/faq', '/contact'];

const ACCESS_COOKIE = 'accessToken';

// Décodage JWT (sans vérif signature, juste pour payload)
function parseJwt(token: string) {
	try {
		const base64Url = token.split('.')[1];
		const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
		const jsonPayload = decodeURIComponent(
			atob(base64)
				.split('')
				.map(function (c) {
					return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
				})
				.join('')
		);
		return JSON.parse(jsonPayload);
	} catch {
		return null;
	}
}

export function middleware(req: NextRequest) {
	const { pathname } = req.nextUrl;

	console.log('[Middleware] Checking path:', pathname);

	// Autoriser les assets statiques et Next internals
	if (
		pathname.startsWith('/_next') ||
		pathname.startsWith('/api') ||
		pathname.startsWith('/static') ||
		pathname.startsWith('/favicon') ||
		pathname.startsWith('/images')
	) {
		return NextResponse.next();
	}

	// Autoriser les routes publiques
	if (
		PUBLIC_PATHS.includes(pathname) ||
		PUBLIC_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(prefix + '/'))
	) {
		return NextResponse.next();
	}

	// Vérifier le token d'accès
	const accessToken = req.cookies.get(ACCESS_COOKIE)?.value;
	console.log('[Middleware] Access token:', accessToken ? 'EXISTS' : 'MISSING');
	if (!accessToken) {
		// Redirige vers login avec next param
		console.log('[Middleware] Redirecting to /login (no token)');
		const loginUrl = req.nextUrl.clone();
		loginUrl.pathname = '/login';
		loginUrl.searchParams.set('next', pathname);
		return NextResponse.redirect(loginUrl);
	}

	// Décoder le token pour vérifier l'expiration et le rôle
	const payload = parseJwt(accessToken);
	if (!payload || !payload.exp || Date.now() / 1000 > payload.exp) {
		// Token expiré ou invalide
		const loginUrl = req.nextUrl.clone();
		loginUrl.pathname = '/login';
		loginUrl.searchParams.set('next', pathname);
		return NextResponse.redirect(loginUrl);
	}

	// Récupérer le rôle (is_agent)
	const isAgent = payload.is_agent;

	// Définir les préfixes privés par rôle
	const AGENT_PREFIXES = [
		'/dashboard',
		'/athlete',
		'/athletes',
		'/analytics',
		'/calendar',
		'/messages',
		'/collaborations',
		'/billing',
		'/onboarding',
		'/settings',
		'/notifications',
	];
	const ORG_PREFIXES = [
		'/dashboard',
		'/athletes',
		'/follows',
		'/collaborations',
		'/analytics',
		'/messages',
		'/billing',
		'/onboarding',
		'/settings',
		'/notifications',
	];

	// Si agent, bloquer accès aux routes org spécifiques (ex: /follows)
	if (isAgent) {
		if (
			pathname.startsWith('/follows')
			// Ajouter d'autres routes org-only si besoin
		) {
			return NextResponse.redirect('/dashboard');
		}
	} else {
		// Si collaborateur, bloquer accès aux routes agent-only (ex: /athlete)
		if (
			pathname.startsWith('/athlete')
			// Ajouter d'autres routes agent-only si besoin
		) {
			return NextResponse.redirect('/dashboard');
		}
	}

	// Si connecté, empêcher accès à /login ou /register
	if (pathname === '/login' || pathname === '/register') {
		return NextResponse.redirect('/dashboard');
	}

	// Sinon, accès autorisé
	return NextResponse.next();
}

export const config = {
	matcher: [
		/*
		 * Match all request paths except for the ones starting with:
		 * - _next/static (static files)
		 * - _next/image (image optimization files)
		 * - favicon.ico (favicon file)
		 * - images (public images)
		 * - static (public static files)
		 */
		'/((?!_next/static|_next/image|favicon.ico|images|static).*)',
	],
};


