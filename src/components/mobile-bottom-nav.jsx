"use client";

import { useContext, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Handshake, Heart, MessageSquare, Search, User } from "lucide-react";

import AuthContext from "@/context/AuthContext";

const EXPLORER_PREFIXES = ["/explorer", "/athletes", "/teams", "/organisations"]; // keeps future sections in sync

export function MobileBottomNav() {
  const { user } = useContext(AuthContext);
  const pathname = usePathname();
  const hiddenPrefixes = ["/login", "/register", "/reset-password", "/verify-email", "/forgot-password", "/onboarding"];
  if (pathname && hiddenPrefixes.some((prefix) => pathname.startsWith(prefix))) {
    return null;
  }
  const [isHidden, setIsHidden] = useState(false);
  const lastScrollRef = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.scrollY;
      if (currentScroll > lastScrollRef.current && currentScroll > 50) {
        setIsHidden(true);
      } else {
        setIsHidden(false);
      }
      lastScrollRef.current = currentScroll;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isExplorerActive = useMemo(() => {
    if (!pathname) return false;
    return pathname === "/" || EXPLORER_PREFIXES.some((prefix) => pathname.startsWith(prefix));
  }, [pathname]);

  const sharedLinkClasses = "flex flex-col items-center gap-0.5 font-medium antialiased w-full max-w-[56px]";

  return (
    <footer
      className={`fixed bottom-5 left-2.5 right-2.5 z-40 w-auto max-w-[560px] mx-auto py-3 bg-background text-center border-t md:hidden px-7 rounded-full shadow-xl transition-transform ease-in-out ${isHidden ? "translate-y-[100px]" : "translate-y-0"}`}
    >
      {user ? (
        <div className="flex justify-between w-full">
          <Link href="/" className={`${sharedLinkClasses} ${isExplorerActive ? "text-pink-500" : "opacity-70"}`}>
            <Search className="w-6 h-6" strokeWidth={isExplorerActive ? 2.5 : 1.5} />
            <span className={`text-[0.625rem] ${isExplorerActive ? "font-bold" : "font-medium"}`}>Explorer</span>
          </Link>
          <Link href="/followed" className={`${sharedLinkClasses} ${pathname?.startsWith("/followed") ? "text-pink-500" : "opacity-70"}`}>
            <Heart className="w-6 h-6" strokeWidth={pathname?.startsWith("/followed") ? 2.5 : 1.5} />
            <span className={`text-[0.625rem] ${pathname?.startsWith("/followed") ? "font-bold" : "font-medium"}`}>Suivis</span>
          </Link>
          <Link href="/collab" className={`${sharedLinkClasses} ${pathname?.startsWith("/collab") ? "text-pink-500" : "opacity-70"}`}>
            <Handshake className="w-6 h-6" strokeWidth={pathname?.startsWith("/collab") ? 2.5 : 1.5} />
            <span className={`text-[0.625rem] ${pathname?.startsWith("/collab") ? "font-bold" : "font-medium"}`}>Collab</span>
          </Link>
          <Link href="/messages" className={`${sharedLinkClasses} ${pathname?.startsWith("/messages") ? "text-pink-500" : "opacity-70"}`}>
            <MessageSquare className="w-6 h-6" strokeWidth={pathname?.startsWith("/messages") ? 2.5 : 1.5} />
            <span className={`text-[0.625rem] ${pathname?.startsWith("/messages") ? "font-bold" : "font-medium"}`}>Messages</span>
          </Link>
          <Link href="/settings" className={`${sharedLinkClasses} ${pathname?.startsWith("/settings") ? "text-pink-500" : "opacity-70"}`}>
            <User className="w-6 h-6" strokeWidth={pathname?.startsWith("/settings") ? 2.5 : 1.5} />
            <span className={`text-[0.625rem] ${pathname?.startsWith("/settings") ? "font-bold" : "font-medium"}`}>Profile</span>
          </Link>
        </div>
      ) : (
        <div className="flex justify-center gap-6 sm:gap-6 w-full">
          <Link href="/explorer" className={`${sharedLinkClasses} ${isExplorerActive ? "text-pink-500" : "opacity-70"}`}>
            <Search className="w-6 h-6" strokeWidth={isExplorerActive ? 2.5 : 1.5} />
            <span className={`text-[0.625rem] ${isExplorerActive ? "font-bold" : "font-medium"}`}>Explorer</span>
          </Link>
          <Link href="/followed" className={`${sharedLinkClasses} ${pathname?.startsWith("/followed") ? "text-pink-500" : "opacity-70"}`}>
            <Heart className="w-6 h-6" strokeWidth={pathname?.startsWith("/followed") ? 2.5 : 1.5} />
            <span className={`text-[0.625rem] ${pathname?.startsWith("/followed") ? "font-bold" : "font-medium"}`}>Suivis</span>
          </Link>
          <Link href="/login" className={`${sharedLinkClasses} ${pathname?.startsWith("/login") ? "text-pink-500" : "opacity-70"}`}>
            <User className="w-6 h-6" strokeWidth={pathname?.startsWith("/login") ? 2.5 : 1.5} />
            <span className={`text-[0.625rem] ${pathname?.startsWith("/login") ? "font-bold" : "font-medium"}`}>Connexion</span>
          </Link>
        </div>
      )}
    </footer>
  );
}

export default MobileBottomNav;
