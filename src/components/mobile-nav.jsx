"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";

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
import { getNavByRole } from "@/config/navigation";
import { useAgentNavigation } from "@/hooks/useAgentNavigation";
import { PublicAuthNav } from "@/components/public-auth-nav";
import Logo from "@/components/ui/logo";

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
  
  // Get navigation adapted for agents (single athlete redirect)
  const { navItems: agentNavItems } = useAgentNavigation();

  // Use custom items or get items based on role
  // For AGENT role, use adapted navigation from hook
  let navItems = items;
  if (!items) {
    navItems = role === "AGENT" ? agentNavItems : getNavByRole(role);
  }

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
        <nav className="flex flex-col gap-2 mt-8">
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
      </SheetContent>
    </Sheet>
  );
}
