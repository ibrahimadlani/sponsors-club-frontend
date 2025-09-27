import { NextResponse } from "next/server";

const ACCESS_COOKIE = "accessToken";
const PUBLIC_ROUTES = new Set(["/login", "/register", "/api/health", "/access-denied"]);
const COLLABORATOR_ONLY_ROUTES = new Set(["/explore", "/followed", "/collab", "/messages", "/settings"]);
const AUTH_REDIRECT = "/login";
const HOME_ROUTE = "/";

const normalisePath = (pathname) => pathname.replace(/\/$/, "") || "/";

const isRoutePublic = (pathname) => {
  const normalised = normalisePath(pathname);
  
  // Page d'accueil vitrine accessible sans authentification
  if (normalised === "/") {
    return true;
  }
  
  // Routes explicitement publiques
  if (PUBLIC_ROUTES.has(normalised)) {
    return true;
  }

  // Routes système Next.js
  return (
    normalised.startsWith("/_next") ||
    normalised.startsWith("/api") ||
    normalised.startsWith("/static") ||
    normalised.startsWith("/favicon.ico") ||
    normalised.startsWith("/images") ||
    normalised.startsWith("/fonts")
  );
};

const decodeSegment = (segment) => {
  const padded = segment
    .padEnd(segment.length + ((4 - (segment.length % 4)) % 4), "=")
    .replace(/-/g, "+")
    .replace(/_/g, "/");

  try {
    return atob(padded);
  } catch (error) {
    console.warn("Unable to decode JWT", error);
    return null;
  }
};

const parseJwt = (token) => {
  if (!token) return null;
  const segments = token.split(".");
  if (segments.length !== 3) return null;

  try {
    const decoded = decodeSegment(segments[1]);
    if (!decoded) return null;
    return JSON.parse(decoded);
  } catch (error) {
    console.warn("Invalid JWT payload", error);
    return null;
  }
};

const isTokenExpired = (token) => {
  const payload = parseJwt(token);
  if (!payload?.exp) return false;
  const expirySeconds = payload.exp * 1000;
  const now = Date.now();
  return expirySeconds <= now;
};

const isCollaboratorRoute = (pathname) => {
  const normalised = normalisePath(pathname);
  return COLLABORATOR_ONLY_ROUTES.has(normalised) || normalised.startsWith("/explore");
};

const getUserAccountType = (token) => {
  const payload = parseJwt(token);
  return payload?.account_type || null;
};

const buildRedirectResponse = (request, location) => {
  const url = new URL(location, request.url);
  return NextResponse.redirect(url);
};

export function middleware(request) {
  const { pathname, searchParams } = request.nextUrl;
  const token = request.cookies.get(ACCESS_COOKIE)?.value;
  const isPublic = isRoutePublic(pathname);
  const normalisedPath = normalisePath(pathname);
  const isAuthRoute = normalisedPath.startsWith("/login") || normalisedPath.startsWith("/register");
  const isCollabRoute = isCollaboratorRoute(pathname);

  // PROTECTION STRICTE pour /explore
  if (normalisedPath === "/explore") {
    if (!token) {
      console.log("[MIDDLEWARE] Accès à /explore sans token - BLOQUÉ");
      const nextUrl = pathname + (searchParams.size ? `?${searchParams.toString()}` : "");
      return buildRedirectResponse(request, `${AUTH_REDIRECT}?next=${encodeURIComponent(nextUrl)}`);
    }
    
    if (isTokenExpired(token)) {
      console.log("[MIDDLEWARE] Token expiré pour /explore - BLOQUÉ");
      const response = buildRedirectResponse(request, `${AUTH_REDIRECT}?reason=expired`);
      response.cookies.delete(ACCESS_COOKIE);
      return response;
    }
    
    const accountType = getUserAccountType(token);
    if (accountType !== "COLLABORATOR") {
      console.log(`[MIDDLEWARE] Type de compte ${accountType} non autorisé pour /explore - BLOQUÉ`);
      return buildRedirectResponse(request, "/access-denied");
    }
    
    console.log("[MIDDLEWARE] Accès à /explore autorisé pour COLLABORATOR");
  }

  // Vérifier si le token est expiré (pour autres routes)
  if (token && isTokenExpired(token)) {
    const response = buildRedirectResponse(request, `${AUTH_REDIRECT}?reason=expired`);
    response.cookies.delete(ACCESS_COOKIE);
    return response;
  }

  // Rediriger vers login si pas de token et route protégée
  if (!token && !isPublic) {
    const nextUrl = pathname + (searchParams.size ? `?${searchParams.toString()}` : "");
    const response = buildRedirectResponse(request, `${AUTH_REDIRECT}?next=${encodeURIComponent(nextUrl)}`);
    return response;
  }

  // Vérifier le type de compte pour les routes collaborateurs
  if (token && isCollabRoute) {
    const accountType = getUserAccountType(token);
    if (accountType !== "COLLABORATOR") {
      // Rediriger les agents vers une page d'accès refusé
      return buildRedirectResponse(request, "/access-denied");
    }
  }

  // Rediriger les utilisateurs connectés qui tentent d'accéder aux pages d'auth
  if (token && isAuthRoute) {
    const accountType = getUserAccountType(token);
    if (accountType === "COLLABORATOR") {
      return buildRedirectResponse(request, "/explore");
    }
    if (accountType === "AGENT") {
      return buildRedirectResponse(request, "/dashboard");
    }
    return buildRedirectResponse(request, HOME_ROUTE);
  }

  const response = NextResponse.next();

  if (token) {
    response.headers.set("x-access-token", token);
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images (public images)
     * - fonts (public fonts)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|images|fonts).*)',
  ],
};
