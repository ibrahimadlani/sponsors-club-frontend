"use client";

import React, { useEffect, useState } from "react";
import {
  LogOut,
  Sparkles,
  Moon,
  Sun,
  Search,
  Handshake,
  LifeBuoy,
  Settings,
  User,
  MessageSquare,
  Heart,
  LogIn,
  AlignJustify,
  ClipboardPen,
  Globe,
  Bell,
  MessagesSquare,
  Mail,
  BicepsFlexed,
  HeartIcon,
  ChartNoAxesCombined,
  LayoutDashboard,
  CreditCard,
} from "lucide-react";

import { useRouter } from "next/navigation"; // Next.js router for redirection
import { useTheme } from "next-themes"; // Hook to manage theme (light/dark)
import { logout, fetchUserProfile } from "@/lib/api";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { LanguageCurrencyModal } from "@/components/language-currency-modal";

const formatDate = (value, options) => {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return new Intl.DateTimeFormat("fr-FR", options).format(date);
};

/**
 * NavUser Component
 *
 * Displays a dropdown menu with different content based on user authentication.
 * If authenticated: Shows user profile and navigation options.
 * If not authenticated: Shows login and registration links.
 *
 * @param {object} props - Component properties.
 * @param {object|null} props.user - User information object (or null if not logged in).
 * @returns {JSX.Element} The rendered NavUser component.
 */
export function NavUser({ user: userProp = null }) {
  const { isMobile } = useSidebar();
  const router = useRouter(); // For navigation
  const { theme, setTheme } = useTheme();
  const [isLanguageCurrencyModalOpen, setIsLanguageCurrencyModalOpen] = useState(false);
  const [user, setUser] = useState(userProp);
  const [loadingProfile, setLoadingProfile] = useState(!userProp);

  useEffect(() => {
    if (userProp) {
      setUser(userProp);
      setLoadingProfile(false);
      return;
    }

    let isMounted = true;

    const loadProfile = async () => {
      setLoadingProfile(true);
      try {
        const profile = await fetchUserProfile();
        if (isMounted) {
          setUser(profile);
        }
      } catch (error) {
        if (isMounted) {
          setUser(null);
        }
        console.warn("Unable to fetch the authenticated user", error);
      } finally {
        if (isMounted) {
          setLoadingProfile(false);
        }
      }
    };

    loadProfile();

    return () => {
      isMounted = false;
    };
  }, [userProp]);

  const avatarUrl = user?.avatar || user?.avatar_url || user?.profile_picture || null;
  const firstName = user?.first_name?.trim() || "";
  const lastName = user?.last_name?.trim() || "";
  const fullName = [firstName, lastName].filter(Boolean).join(" ");
  const displayName = fullName || user?.email?.trim() || user?.display_name?.trim() || "";
  let initials = [firstName.charAt(0), lastName.charAt(0)]
    .filter(Boolean)
    .join("")
    .toUpperCase();
  if (!initials) {
    initials = user?.email?.charAt(0)?.toUpperCase() || "U";
  }
  const accountTypeLabel =
    user?.account_type === "AGENT"
      ? "Agent"
      : user?.account_type === "COLLABORATOR"
      ? "Collaborateur"
      : user?.account_type || null;
  const emailStatusLabel = user?.email_verified ? "Email vérifié" : null;
  const isAuthenticated = Boolean(user);
  const isLoadingProfile = loadingProfile;

  /**
   * Handles user logout by clearing tokens and redirecting to the login page.
   */
  const handleLogout = () => {
    logout(); // Clear tokens and session data
    router.push("/login"); // Redirect to login page
  };

  /**
   * Toggles the theme between light and dark modes.
   */
  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  // Schéma des menus par rôle
  const menuSchemas = {
    AGENT: [
      { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
      { label: 'Profile', href: '/athletes', icon: User },
      { label: 'Athlètes', href: '/athletes', icon: Heart },
      { label: 'Collaborations', href: null, icon: Handshake },
      { label: 'Profile', href: null, icon: User },
    ],
    COLLABORATOR: [
      { label: 'Athlètes', href: '/athletes', icon: BicepsFlexed },
      { label: 'Suivis', href: '/follows', icon: HeartIcon },
      { label: 'Collabs', href: '/collaborations', icon: Handshake },
      { label: 'Analytics', href: '/analytics', icon: ChartNoAxesCombined },
    ],
    ADMIN: [
      { label: 'Dashboard Admin', href: '/admin/dashboard', icon: Sparkles },
      { label: 'Explorer', href: '/explore', icon: Search },
      { label: 'Profile', href: null, icon: User },
    ],
  };

  // Génère le menu à partir du schéma
  const RoleMenu = () => {
    const type = user?.account_type || 'AGENT';
    const items = menuSchemas[type] || menuSchemas['AGENT'];
    return (
      <DropdownMenuGroup className="hidden md:block">
        {items.map((item, idx) =>
          item.href ? (
            <Link href={item.href} passHref className="font-semibold" key={item.label}>
              <DropdownMenuItem>
                <item.icon className="mr-2 h-4 w-4" />
                {item.label}
              </DropdownMenuItem>
            </Link>
          ) : (
            <DropdownMenuItem className="font-semibold" key={item.label}>
              <item.icon className="mr-2 h-4 w-4" />
              {item.label}
            </DropdownMenuItem>
          )
        )}
      </DropdownMenuGroup>
    );
  };

  return (
    <SidebarMenu className="flex justify-end flex-row items-center gap-3 d-none">
      {/* Call to Action link */}

      <Link href="/notifications" passHref legacyBehavior>
        <a className="relative rounded-full hover:bg-muted/70 dark:hover:bg-muted/90 transition-colors h-10 w-10 hidden lg:flex justify-center items-center cursor-pointer">
          <span className="absolute -top-1 -right-1 flex items-center justify-center h-5 w-5 rounded-full bg-pink-500 text-white text-[11px] font-bold z-10 shadow">5</span>
          <Bell className="h-4 w-4" />
        </a>
      </Link>
      <Link href="/messages" passHref legacyBehavior>
        <a className="relative rounded-full hover:bg-muted/70 dark:hover:bg-muted/90 transition-colors h-10 w-10 hidden lg:flex justify-center items-center cursor-pointer">
          <span className="absolute -top-1 -right-1 flex items-center justify-center h-5 w-5 rounded-full bg-pink-500 text-white text-[11px] font-bold z-10 shadow">3</span>
          <Mail className="h-4 w-4" />
        </a>
      </Link>

      <SidebarMenuItem className="relative">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="relative data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground !ring-0 flex !hover:bg-transparent !bg-transparent hover:!bg-transparent"
            >
              <div className="flex items-center gap-1.5 rounded-lg border border-black/10 dark:border-white/10 px-1.5 py-1 transition-colors hover:bg-muted/60 dark:hover:bg-muted/80">
                {/* Hamburger icon next to avatar */}
                <div className="rounded-full h-7 w-7 flex items-center justify-center text-muted-foreground">
                  <AlignJustify className="h-4 w-4" />
                </div>
                {isAuthenticated ? (
                <Avatar className="rounded-full h-6 w-6 ring-1 ring-black/10 dark:ring-white/10 hidden lg:block">
                    <>
                      <AvatarImage src={avatarUrl ?? undefined} alt={displayName} />
                      <AvatarFallback className="rounded-full text-xs flex items-center justify-center bg-black/10 dark:bg-white/10 text-foreground">
                        {initials || "U"}
                      </AvatarFallback>
                    </>
                </Avatar>
                ) : (
                    <></>
                )}
              </div>
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="absolute right-0 top-2 w-56 min-w-56 rounded-lg shadow-lg z-50 bg-background border border-border"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            {/* ✅ If user is logged in, show user-specific dropdown */}
            {isAuthenticated ? (
              <>
                {/* User Information */}
                <DropdownMenuLabel className="p-0 font-normal">
                  <div className="flex items-center gap-2 px-3 py-2 text-left text-sm">
                    <Avatar className="h-8 w-8 rounded-lg">
                      <AvatarImage src={avatarUrl ?? undefined} alt={displayName} />
                      <AvatarFallback className="rounded-lg">
                        {initials || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight gap-0.5">
                      <span className="truncate font-semibold">
                        {displayName}
                      </span>
                      <span className="truncate text-xs text-muted-foreground">{user.email}</span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />

                {/* Premium Option */}
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <Sparkles className="mr-2 h-4 w-4" />
                    <span>
                      Passez <span className="font-bold text-pink-500">Premium</span>
                    </span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator className="hidden md:block"/>

                {/* Navigation Options selon le rôle */}
                <RoleMenu />
                <DropdownMenuSeparator />

                {/* Preferences and Account Options */}
                <Link href="/settings" passHref>
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    Préférences
                  </DropdownMenuItem>
                </Link>

                {/* Preferences and Account Options */}
                <Link href="/settings" passHref>
                  <DropdownMenuItem>
                    <CreditCard className="mr-2 h-4 w-4" />
                    Facturation
                  </DropdownMenuItem>
                </Link>

                {/* Theme Toggle */}
                <DropdownMenuItem onClick={toggleTheme}>
                  {theme === "dark" ? (
                    <Sun className="mr-2 h-4 w-4" />
                  ) : (
                    <Moon className="mr-2 h-4 w-4" />
                  )}
                  Mode {theme === "dark" ? "claire" : "sombre"}
                </DropdownMenuItem>

                {/* Help Center */}
                <DropdownMenuItem>
                  <LifeBuoy className="mr-2 h-4 w-4" />
                  Centre d&apos;aide
                </DropdownMenuItem>

                {/* Language and Currency */}
                <DropdownMenuItem onClick={() => setIsLanguageCurrencyModalOpen(true)}>
                  <Globe className="mr-2 h-4 w-4" />
                  Langue et Devise
                </DropdownMenuItem>
                <DropdownMenuSeparator />

                {/* Logout Option */}
                <DropdownMenuItem onClick={handleLogout} className="hover:!text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  Déconnexion
                </DropdownMenuItem>
              </>
            ) : isLoadingProfile ? (
              <DropdownMenuGroup className="px-3 py-2 text-sm text-muted-foreground">
                Chargement du profil…
              </DropdownMenuGroup>
            ) : (
              <>
                {/* ✅ If user is NOT logged in, show login/signup options */}
                <DropdownMenuGroup>
                  <Link href="/login" passHref className="font-semibold">
                    <DropdownMenuItem>
                      <User className="mr-2 h-4 w-4" />
                      Connexion
                    </DropdownMenuItem>
                  </Link>
                  <Link href="/register" passHref className="font-semibold">
                    <DropdownMenuItem>
                      <ClipboardPen className="mr-2 h-4 w-4" />
                      Inscription
                    </DropdownMenuItem>
                  </Link>
                </DropdownMenuGroup>

                <DropdownMenuSeparator />

                {/* Theme Toggle */}
                <DropdownMenuItem onClick={toggleTheme}>
                  {theme === "dark" ? (
                    <Sun className="mr-2 h-4 w-4" />
                  ) : (
                    <Moon className="mr-2 h-4 w-4" />
                  )}
                  Mode {theme === "dark" ? "claire" : "sombre"}
                </DropdownMenuItem>

                {/* Help Center */}
                <DropdownMenuItem>
                  <LifeBuoy className="mr-2 h-4 w-4" />
                  Centre d&apos;aide
                </DropdownMenuItem>

                {/* Language and Currency */}
                <DropdownMenuItem onClick={() => setIsLanguageCurrencyModalOpen(true)}>
                  <Globe className="mr-2 h-4 w-4" />
                  Langue et Devise
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>

      {/* Language and Currency Modal */}
      <LanguageCurrencyModal 
        open={isLanguageCurrencyModalOpen} 
        onOpenChange={setIsLanguageCurrencyModalOpen} 
      />
    </SidebarMenu>
  );
}
