"use client";

import React from "react";
import Logo from "@/components/ui/logo";
import { NavMenu } from "@/components/nav-bar";
import { MobileNav } from "@/components/mobile-nav";
import { NavUser } from "@/components/nav-user";
import { PublicAuthNav } from "@/components/public-auth-nav";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useUserRole } from "@/hooks/useUserRole";

/**
 * AppHeader Component
 * 
 * Dynamic header that adapts navigation based on user authentication status and role.
 * - Unauthenticated: Shows public navigation (Features, Pricing, Blog, FAQ) + auth buttons
 * - Authenticated: Shows role-based navigation (AGENT, COLLABORATOR) + user menu
 * 
 * Features:
 * - Public navigation for unauthenticated users
 * - Role-based navigation (AGENT, COLLABORATOR) directly from JWT
 * - Responsive design (desktop + mobile)
 * - Instant role detection (0ms from JWT token)
 * 
 * Supported Roles:
 * - null: Unauthenticated (shows public navigation + auth buttons)
 * - AGENT: Dashboard, Mes Athlètes, Analytics, Messages
 * - COLLABORATOR: Athlètes, Suivis, Collabs, Analytics
 */
export default function AppHeader() {
  // Get user data for NavUser component
  const { user } = useCurrentUser();
  
  // Get role directly from JWT (instant, no API call needed)
  const { role } = useUserRole();

  // Use null role for unauthenticated users (for public navigation)
  const navRole = user ? role : null;

  return (
    <header className="sticky top-0 z-50 w-full bg-background text-center border-b px-6 md:px-0 ">
      <div className="relative flex items-center justify-center min-h-[80px]">
        {/* Mobile menu (left, mobile only) */}
        <div className="absolute left-2 top-6 md:hidden">
          <MobileNav role={navRole} />
        </div>

        {/* Logo (left, desktop only) */}
        <div className="absolute left-6 top-6 md:left-12 2xl:left-24 hidden md:block">
          <Logo />
        </div>

        {/* Center navigation (desktop) */}
        <div className="relative max-w-md flex-col justify-center items-center lg:flex hidden">
          <NavMenu role={navRole} />
        </div>

        {/* Center logo (mobile) */}
        <div className="relative max-w-md flex items-center md:hidden">
          <Logo className="md:hidden mx-auto" />
        </div>

        {/* User menu (right) */}
        <div className="absolute flex right-2 top-1/2 -translate-y-1/2 md:right-12 2xl:right-24 gap-1 items-center">
          {user ? (
            <NavUser user={user} />
          ) : (
            <PublicAuthNav />
          )}
        </div>
      </div>
    </header>
  );
}
