"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, LogOut, Settings, CreditCard, Bell } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { getNavByRole } from "@/config/navigation";
import { useAgentNavigation } from "@/hooks/useAgentNavigation";
import { PublicAuthNav } from "@/components/public-auth-nav";
import Logo from "@/components/ui/logo";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { logout } from "@/lib/api";
import { useRouter } from "next/navigation";

/**
 * MobileNav Component
 * 
 * Mobile navigation drawer that displays role-specific menu items.
 * - Public: Shows Features, Pricing, Blog, FAQ + auth buttons
 * - AGENT: Dashboard, Mes Athlètes, Analytics (with single athlete redirect)
 * - COLLABORATOR: Athlètes, Suivis, Collabs, Analytics
 * 
 * @param {Object} props
 * @param {string|null} props.role - User role (AGENT, COLLABORATOR, ADMIN, STAFF) or null for public
 * @param {Array} props.items - Optional custom navigation items
 */
export function MobileNav({ role = null, items = null }) {
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);
  const router = useRouter();
  
  // Get current user data
  const { user } = useCurrentUser();
  
  // Get navigation adapted for agents (single athlete redirect)
  const { navItems: agentNavItems } = useAgentNavigation();

  // Use custom items or get items based on role
  // For AGENT role, use adapted navigation from hook
  let navItems = items;
  if (!items) {
    navItems = role === "AGENT" ? agentNavItems : getNavByRole(role);
  }

  // Format user data for display
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

  /**
   * Handles user logout by clearing tokens and redirecting to the login page.
   */
  const handleLogout = (e) => {
    e.preventDefault();
    logout(); // Clear tokens and session data
    setOpen(false);
    router.push("/login"); // Redirect to login page
  };

  // Secondary navigation items (Settings and Logout)
  const secondaryItems = [
    {
      title: "Paramètres",
      url: "/settings",
      icon: Settings,
    },
    {
      title: "Déconnexion",
      url: "#",
      icon: LogOut,
      onClick: handleLogout,
    },
  ];

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] sm:w-[400px]">
        <SheetHeader>
          <SheetTitle>
            <Logo />
          </SheetTitle>
          <SheetDescription>
            {role ? `Navigation - ${role}` : "Navigation"}
          </SheetDescription>
        </SheetHeader>
        <nav className={cn(
          "flex flex-col gap-2 mt-8",
          role && user ? "pb-40" : "" // Add more padding when user footer is shown (NavSecondary + User profile)
        )}>
          {navItems.map(({ href, label, icon: Icon, description }) => {
            const isActive = pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                {Icon && <Icon className="h-5 w-5" />}
                <div className="flex flex-col items-start">
                  <span>{label}</span>
                  {description && (
                    <span className="text-xs opacity-70">{description}</span>
                  )}
                </div>
              </Link>
            );
          })}
          
          {/* Auth buttons for public navigation */}
          {!role && (
            <div className="mt-6 pt-6 border-t">
              <div className="flex flex-col gap-2">
                <PublicAuthNav />
              </div>
            </div>
          )}
        </nav>

        {/* User Footer - Only for authenticated users */}
        {role && user && (
          <div className="absolute bottom-0 left-0 right-0 border-t bg-background">
            {/* Secondary Navigation - Settings and Logout */}
            <div className="px-3 py-2 space-y-1">
              {secondaryItems.map((item) => (
                <a
                  key={item.title}
                  href={item.url}
                  onClick={(e) => {
                    if (item.onClick) {
                      item.onClick(e);
                    } else {
                      setOpen(false);
                    }
                  }}
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.title}</span>
                </a>
              ))}
            </div>
            
            <Separator />
            
            {/* User Profile */}
            <div className="p-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10 rounded-lg">
                  <AvatarImage src={avatarUrl ?? undefined} alt={displayName} />
                  <AvatarFallback className="rounded-lg">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{displayName}</p>
                  <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
