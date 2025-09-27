"use client";

/**
 * Home Page - Landing Page Vitrine
 *
 * Page d'accueil vitrine moderne pour SponsorsClub
 * Présente la plateforme et incite à l'inscription/connexion
 */

// React Imports
import { useState, useEffect } from "react";

// Next.js Imports
import Link from "next/link";
import Image from "next/image";

// Third-Party Library Imports
import {
  ArrowRight,
  Star,
  Users,
  TrendingUp,
  Shield,
  Zap,
  Heart,
  Search,
  Building2,
  Trophy,
  PlayCircle,
  CheckCircle,
  Globe,
  Euro,
  ChevronDown,
} from "lucide-react";
import { motion } from "framer-motion";

// UI Components
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Logo from "@/components/ui/logo";

// Hooks
import { useCurrentUser } from "@/hooks/useCurrentUser";

// React Imports
import { useState, useEffect, useCallback } from "react";

// Next.js Imports
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

// Third-Party Library Imports
import {
  Globe,
  Euro,
  ChevronDown,
  Search,
  Handshake,
  MessageSquare,
  Heart,
  Sparkles,
  User,
  MapIcon,
} from "lucide-react";

// UI Components
import { Button } from "@/components/ui/button";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import Logo from "@/components/ui/logo";
import Skeleton from "@/components/skeleton-item";

// Navigation Components
import { NavUser } from "@/components/nav-user";
import { NavMenu } from "@/components/nav-bar";
import AthletesTabs from "@/components/athletes-tabs";

// Charts

// Hooks
import { useCurrentUser } from "@/hooks/useCurrentUser";

// Utility Functions
import { handleScroll, formatNumber } from "@/lib/utils";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  CarouselDots,
} from "@/components/ui/carousel";
import { API_BASE_URL } from "@/lib/api";
import { getAthletes } from "@/lib/api";


// Helpers to shape athlete payloads from the API
const SPORT_EMOJI_MAP = {
  football: "⚽",
  soccer: "⚽",
  basketball: "🏀",
  judo: "🥋",
  rugby: "🏉",
  tennis: "🎾",
  natation: "🏊",
  swimming: "🏊",
  cyclisme: "🚴",
  cycling: "🚴",
  boxe: "🥊",
  boxing: "🥊",
  biathlon: "🎿",
  handball: "🤾",
  volleyball: "🏐",
  athletics: "🏃",
  athlétisme: "🏃",
};

const getSportEmoji = (sportName, defaultEmoji = "🏅") => {
  if (!sportName) return defaultEmoji;
  const key = sportName.toLowerCase();
  return SPORT_EMOJI_MAP[key] || defaultEmoji;
};

const toAbsoluteMediaUrl = (value) => {
  if (!value || typeof value !== "string") return null;
  const raw = value.trim();
  if (!raw) return null;
  if (/^(?:https?:)?\/\//i.test(raw)) {
    return raw;
  }
  const base = API_BASE_URL.replace(/\/$/, "");
  let path = raw;
  if (path.startsWith("./")) {
    path = path.slice(1);
  }
  path = path.replace(/^media\//i, "/media/");
  if (!path.startsWith("/")) {
    path = `/${path}`;
  }
  if (!path.startsWith("/media/")) {
    const stripped = path.replace(/^\/+/, "").replace(/^media\//i, "");
    path = `/media/${stripped}`;
  }
  return `${base}${path}`;
};

const extractMediaSources = (athlete) => {
  if (!athlete) return [];
  const sources = new Set();
  if (Array.isArray(athlete.card_photos)) {
    athlete.card_photos.forEach((photo) => {
      const src = typeof photo === "string" ? photo : photo?.image;
      const absolute = toAbsoluteMediaUrl(src);
      if (absolute) {
        sources.add(absolute);
      }
    });
  }
  if (Array.isArray(athlete.gallery_photos)) {
    athlete.gallery_photos.forEach((photo) => {
      const url = typeof photo === "string" ? photo : photo?.image;
      const absolute = toAbsoluteMediaUrl(url);
      if (absolute) {
        sources.add(absolute);
      }
    });
  }
  if (athlete?.avatar) {
    const absolute = toAbsoluteMediaUrl(athlete.avatar);
    if (absolute) {
      sources.add(absolute);
    }
  }
  return Array.from(sources);
};

const formatEngagementRate = (value) => {
  if (value === null || value === undefined) return "N/A";
  const numeric = Number(value);
  if (Number.isNaN(numeric)) return "N/A";
  const percentage = numeric > 1 ? numeric : numeric * 100;
  return `${Intl.NumberFormat("fr-FR", { maximumFractionDigits: 2 }).format(percentage)}%`;
};

const buildProfileHref = (athlete) => {
  if (!athlete) return "#";

  const normaliseSlug = (value) =>
    String(value || "")
      .trim()
      .replace(/^\/+|\/+$/g, "");

  const slugCandidate = normaliseSlug(athlete.slug || athlete.profile_slug);
  if (slugCandidate) {
    return `/athletes/${slugCandidate}`;
  }

  const profileUrl = String(athlete.profile_url || "").trim();
  if (profileUrl) {
    try {
      const resolved = profileUrl.startsWith("http")
        ? new URL(profileUrl).pathname
        : profileUrl;
      const segments = resolved.split("/").filter(Boolean);
      if (segments.length >= 2) {
        const last = segments[segments.length - 1];
        const beforeLast = segments[segments.length - 2];
        if (beforeLast === "athletes" && last) {
          return `/athletes/${last}`;
        }
      }
      if (segments.length === 1) {
        return `/athletes/${segments[0]}`;
      }
      if (resolved.startsWith("/")) {
        return resolved;
      }
    } catch (error) {
      console.warn("Unable to normalise profile_url", error);
    }
  }

  return athlete.id ? `/athletes/${athlete.id}` : "#";
};

// Component to display each athlete card
const ItemComponent = ({ athlete }) => {
  const mediaSources = extractMediaSources(athlete);
  const hasMultipleImages = mediaSources.length > 1;
  const heroImage = mediaSources[0] || null;
  const profileHref = buildProfileHref(athlete);
  const city = athlete?.city?.trim() || null;
  const country = athlete?.country?.trim() || null;
  const locationLabel = [city, country].filter(Boolean).join(", ");
  const followers = athlete?.followers_count_cached ?? 0;
  const engagementRate = formatEngagementRate(athlete?.engagement_rate_cached);
  const sportName = athlete?.sport?.name;
  const sportEmoji = athlete?.sport?.emoji || getSportEmoji(sportName || athlete?.category);
  const sportLabel = sportName
    ? `${sportEmoji} ${sportName}`
    : athlete?.category
    ? `${getSportEmoji(athlete.category)} ${athlete.category}`
    : null;
  const bio =
    athlete?.bio ||
    "Découvrez ses performances et son potentiel de sponsoring sur SponsorsClub.";

  return (
    <div className="rounded-xl w-full group relative block transition-transform transform z-0">
      {sportLabel && (
        <span className="absolute top-4 right-4 flex items-center gap-1 text-black bg-white text-xs font-semibold px-2 py-1 rounded-lg shadow z-50">
          {sportLabel}
        </span>
      )}

      {hasMultipleImages ? (
        <div className="relative w-full h-64 rounded-xl border overflow-hidden">
          <Carousel className="w-full h-full">
            <CarouselContent className="h-full">
              {mediaSources.map((src, index) => (
                <CarouselItem key={index} className="h-64">
                  <Link href={profileHref} className="relative block h-full w-full">
                    <Image
                      src={src}
                      alt={`${athlete?.full_name || "Athlète"} - image ${index + 1}`}
                      fill
                      unoptimized
                      className="object-cover object-center"
                      sizes="(min-width: 768px) 300px, 100vw"
                    />
                  </Link>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex" />
            <CarouselNext className="hidden md:flex" />
            <CarouselDots className="bottom-2" />
          </Carousel>
        </div>
      ) : (
        <Link href={profileHref} className="relative block h-64 w-full rounded-xl border overflow-hidden">
          {heroImage ? (
            <Image
              src={heroImage}
              alt={athlete?.full_name || "Athlète"}
              fill
              unoptimized
              className="object-cover object-center"
              sizes="(min-width: 768px) 300px, 100vw"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-muted text-sm text-muted-foreground">
              Visuel en attente
            </div>
          )}
        </Link>
      )}

      <div className="flex flex-col mt-3">
        <div>
          <Link href={profileHref} className="font-medium text-base leading-2 hover:underline">
            {athlete?.full_name || athlete?.display_name || "Athlète"}
          </Link>

          <p className="font-normal text-sm dark:text-white/50 text-black/50 leading-5">
           {(locationLabel) && (
            <>
              <span className="font-medium">
                {locationLabel}
              </span>
              <span className="font-bold mx-2">·</span>
            </>
          )}
            <span>{bio}</span>
          </p>
        </div>
        <div className="font-medium text-sm text-muted-foreground flex flex-wrap items-center gap-4 my-3">
          <div className="flex items-center gap-2">
            <Heart className="h-4 w-4" strokeWidth={1.75} />
            {formatNumber(followers)} abonnés
          </div>
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4" strokeWidth={1.75} />
            {engagementRate} engagement
          </div>
        </div>
      </div>
    </div>
  );
};

// Google Map component for displaying a map iframe
const GoogleMap = () => {
  return (
    <div className="w-full h-full">
      <iframe
        width="100%"
        height="100%"
        loading="lazy"
        allowFullScreen
        referrerPolicy="no-referrer-when-downgrade"
        src="https://www.google.com/maps/embed/v1/view?key=AIzaSyD5z6oVvSfl5zkdyIXlsIiaXGHTqtmfB3I&center=48.8566,2.3522&zoom=6"
      />
    </div>
  );
};

// Main page component
export default function Page() {

  const { user } = useCurrentUser();

  // State for loading, athletes, UI toggles, and scroll
  const [loading, setLoading] = useState(true);
  const [athletes, setAthletes] = useState([]);
  const [error, setError] = useState(null);
  const [isHidden, setIsHidden] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const pathname = usePathname();
  const isExplorer = pathname === "/" || ["/explorer", "/athletes", "/teams", "/organisations"].some((p) => pathname.startsWith(p));

  const fetchAthletes = useCallback(async () => {
    try {
      const data = await getAthletes();
      return Array.isArray(data) ? data : [];
    } catch (err) {
      throw err;
    }
  }, []);

  const loadAthletes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchAthletes();
      setAthletes(data);
    } catch (err) {
      console.error('Failed to load athletes', err);
      setAthletes([]);
      setError("Impossible de récupérer les athlètes pour le moment.");
    } finally {
      setLoading(false);
    }
  }, [fetchAthletes]);

  useEffect(() => {
    let isMounted = true;
    const run = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchAthletes();
        if (!isMounted) return;
        setAthletes(data);
      } catch (err) {
        if (!isMounted) return;
        console.error('Failed to load athletes', err);
        setAthletes([]);
        setError("Impossible de récupérer les athlètes pour le moment.");
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    run();
    return () => {
      isMounted = false;
    };
  }, [fetchAthletes]);

  // Handle scroll to show/hide UI elements
  useEffect(() => {
    const onScroll = () => handleScroll(setIsHidden, lastScrollY, setLastScrollY);

    window.addEventListener("scroll", onScroll);

    return () => window.removeEventListener("scroll", onScroll);
  }, [lastScrollY]);

  const gridClasses = "grid mb-36 gap-x-6 gap-y-12 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 3xl:grid-cols-5";
  const skeletonItems = Array.from({ length: 10 }, (_, index) => <Skeleton key={index} />);

  let content;
  if (loading) {
    content = <div className={gridClasses}>{skeletonItems}</div>;
  } else if (error) {
    content = (
      <div className="flex flex-col items-center justify-center py-16 text-center gap-4">
        <p className="text-sm text-muted-foreground max-w-md">{error}</p>
        <Button onClick={loadAthletes} variant="outline">
          Réessayer
        </Button>
      </div>
    );
  } else if (!athletes.length) {
    content = (
      <div className="flex flex-col items-center justify-center py-16 text-center gap-4">
        <p className="text-sm text-muted-foreground max-w-md">
          Aucun athlète n'est disponible pour le moment. Revenez plus tard ou actualisez la page.
        </p>
        <Button onClick={loadAthletes} variant="outline">
          Actualiser
        </Button>
      </div>
    );
  } else {
    content = (
      <div className={gridClasses}>
        {athletes.map((athlete) => (
          <ItemComponent key={athlete.id || athlete.full_name} athlete={athlete} />
        ))}
      </div>
    );
  }

  return (
    <SidebarProvider>
      <SidebarInset>
        {/* HEADER: Logo, navigation, and user menu */}
        <header className="sticky top-0 z-50 w-full bg-background text-center border-b px-6 md:px-0 ">
          <div className="relative flex items-center justify-center min-h-[80px]">
            {/* Logo (left, desktop only) */}
            <div className="absolute left-6 top-6 md:left-12 2xl:left-24 hidden md:block">
              <Logo />
            </div>

            {/* Center navigation (desktop) */}
            <div className="relative max-w-md flex-col justify-center items-center lg:flex hidden">
              <NavMenu />
            </div>

            {/* Center navigation (mobile) */}
            <div className="relative max-w-md flex items-center md:hidden">
              <Logo className="md:hidden mx-auto" />
            </div>

            {/* User menu (right) and CTA */}
            <div className="absolute flex right-0 top-4 md:right-12 2xl:right-24 gap-1 items-center ">
                <NavUser user={user} />
            </div>

            </div>
        </header>
        {/* Tabs for athlete categories */}
        {/* <AthletesTabs className="w-full"/> */}
        {/* Conditional rendering: show map or grid */}
        {showMap ? (
            <GoogleMap />
          ) : (
        <div className="flex flex-1 flex-col gap-4 px-6 md:px-12 2xl:px-24 py-3">
            {/* Grid of athlete cards or skeletons while loading */}
            {content}
        </div>
          )}  
        {/* GRID of items end */}
        

        {/* FOOTER (desktop) */}
        <footer className="sticky bottom-0 w-full px-6 md:px-12 2xl:px-24 py-4 text-center border-t bg-background items-center justify-between text-sm hidden md:flex">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="">
              &copy; {new Date().getFullYear()} SponsorsClub
            </span>
            <span> · </span>
            <Link href="/privacy" className="hover:underline">
              Confidentialité
            </Link>
            <span> · </span>
            <Link href="/terms-of-services" className="hover:underline">
              Conditions générales
            </Link>
            <span> · </span>
            <Link href="/sitemap" className="hover:underline">
              Plan du site
            </Link>
            <span> · </span>
            <Link href="/about" className="hover:underline">
              À propos
            </Link>
          </div>
          <div className="flex  items-center gap-2.5">
            <Link href="/privacy" className="font-semibold flex items-center gap-1 hover:underline  whitespace-nowrap">
              <Globe className="w-4 h-4" />
              Français
            </Link>
            <span> · </span>
            <Link href="/privacy" className="font-semibold flex items-center gap-1 hover:underline  whitespace-nowrap">
              <Euro className="w-4 h-4" />
              EUR
            </Link>
            <span> · </span>
            <Link href="/privacy" className="font-semibold flex items-center gap-1 hover:underline  whitespace-nowrap">
              Aide & ressources
              <ChevronDown className="w-4 h-4" />
            </Link>
          </div>
        </footer>
        {/* FOOTER - mobile version */}
        {/* ${isHidden ? "translate-y-24" : "translate-y-0"} */}
        <div className="flex w-full justify-center">
          {/* Button to toggle map on desktop */}
          {/* <Button className={`fixed bottom-16 hidden md:flex  py-0 text-xs bg-foreground rounded-full text-background shadow-xl  items-center justify-center z-50  font-semibold `} onClick={() => setShowMap(!showMap)}>
            Show map
            <MapIcon className="w-4 h-4" />
          </Button> */}
          {/* Button to toggle map on mobile */}
          {/* <Button className={`transition-transform duration certified: true, ease-in-out fixed bottom-24 md:hidden py-0 text-xs bg-foreground rounded-full text-background shadow-xl flex items-center justify-center z-50  font-semibold ${isHidden ? "translate-y-[75px]" : "translate-y-0"} `}>
            Show map
            <MapIcon className="w-4 h-4" />
          </Button> */}
        </div>
        {/* Mobile sticky navigation/footer */}
        <footer
          className={`fixed bottom-5 left-2.5 right-2.5 w-auto max-w-[560px] mx-auto py-3 bg-background text-center border-t md:hidden px-7 rounded-full shadow-xl transition-transform ease-in-out ${isHidden ? "translate-y-[100px]" : "translate-y-0"}`}
        >
          {user ? (
            <div className="flex justify-between w-full">
              {/* Connecté: Explorer, Suivis, Collab, Messages, Profile */}
              <Link href="/" className={`flex flex-col items-center gap-0.5 font-medium antialiased w-full max-w-[56px] ${isExplorer ? 'text-pink-500' : 'opacity-70'}`}>
                <Search className="w-6 h-6" strokeWidth={isExplorer ? 2.5 : 1.5} />
                <span className={`text-[0.625rem] ${isExplorer ? 'font-bold' : 'font-medium'}`}>Explorer</span>
              </Link>
              <Link href="/followed" className={`flex flex-col items-center gap-0.5 font-medium antialiased w-full max-w-[56px] ${pathname.startsWith('/followed') ? 'text-pink-500' : 'opacity-70'}`}>
                <Heart className="w-6 h-6" strokeWidth={pathname.startsWith('/followed') ? 2.5 : 1.5} />
                <span className={`text-[0.625rem] ${pathname.startsWith('/followed') ? 'font-bold' : 'font-medium'}`}>Suivis</span>
              </Link>
              <Link href="/collab" className={`flex flex-col items-center gap-0.5 font-medium antialiased w-full max-w-[56px] ${pathname.startsWith('/collab') ? 'text-pink-500' : 'opacity-70'}`}>
                <Handshake className="w-6 h-6" strokeWidth={pathname.startsWith('/collab') ? 2.5 : 1.5} />
                <span className={`text-[0.625rem] ${pathname.startsWith('/collab') ? 'font-bold' : 'font-medium'}`}>Collab</span>
              </Link>
              <Link href="/messages" className={`flex flex-col items-center gap-0.5 font-medium antialiased w-full max-w-[56px] ${pathname.startsWith('/messages') ? 'text-pink-500' : 'opacity-70'}`}>
                <MessageSquare className="w-6 h-6" strokeWidth={pathname.startsWith('/messages') ? 2.5 : 1.5} />
                <span className={`text-[0.625rem] ${pathname.startsWith('/messages') ? 'font-bold' : 'font-medium'}`}>Messages</span>
              </Link>
              <Link href="/settings" className={`flex flex-col items-center gap-0.5 font-medium antialiased w-full max-w-[56px] ${pathname.startsWith('/settings') ? 'text-pink-500' : 'opacity-70'}`}>
                <User className="w-6 h-6" strokeWidth={pathname.startsWith('/settings') ? 2.5 : 1.5} />
                <span className={`text-[0.625rem] ${pathname.startsWith('/settings') ? 'font-bold' : 'font-medium'}`}>Profile</span>
              </Link>
            </div>
          ) : (
            <div className="flex justify-center sm:justify-around gap-6 sm:gap-6 w-full">
              {/* Déconnecté: Explorer, Suivis, Connexion */}
              <Link href="/explorer" className={`flex flex-col items-center gap-0.5 font-medium w-full max-w-[56px] ${isExplorer ? 'text-pink-500' : 'opacity-70'}`}>
                <Search className="w-6 h-6" strokeWidth={isExplorer ? 2.5 : 1.5} />
                <span className={`text-[0.625rem] ${isExplorer ? 'font-bold' : 'font-medium'}`}>Explorer</span>
              </Link>
              <Link href="/followed" className={`flex flex-col items-center gap-0.5 font-medium w-full max-w-[56px] ${pathname.startsWith('/followed') ? 'text-pink-500' : 'opacity-70'}`}>
                <Heart className="w-6 h-6" strokeWidth={pathname.startsWith('/followed') ? 2.5 : 1.5} />
                <span className={`text-[0.625rem] ${pathname.startsWith('/followed') ? 'font-bold' : 'font-medium'}`}>Suivis</span>
              </Link>
              <Link href="/login" className={`flex flex-col items-center gap-0.5 font-medium w-full max-w-[56px] ${pathname.startsWith('/login') ? 'text-pink-500' : 'opacity-70'}`}>
                <User className="w-6 h-6" strokeWidth={pathname.startsWith('/login') ? 2.5 : 1.5} />
                <span className={`text-[0.625rem] ${pathname.startsWith('/login') ? 'font-bold' : 'font-medium'}`}>Connexion</span>
              </Link>
            </div>
          )}
        </footer>
      </SidebarInset>
    </SidebarProvider>
  );
}
