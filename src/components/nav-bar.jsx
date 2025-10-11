"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { getNavByRole } from "@/config/navigation";
import { useAgentNavigation } from "@/hooks/useAgentNavigation";

/**
 * NavMenu Component
 * 
 * Dynamic navigation menu that displays different items based on user role.
 * For AGENT role, automatically adapts "Mes Athlètes" link if only one athlete.
 * 
 * @param {Object} props
 * @param {string} props.role - User role (AGENT, COLLABORATOR, ADMIN) or null for unauthenticated
 * @param {Array} props.items - Optional custom navigation items (overrides role-based nav)
 */
export function NavMenu({ role, items = null }) {
  const pathname = usePathname();
  
  // Get navigation adapted for agents (single athlete redirect)
  const { navItems: agentNavItems } = useAgentNavigation();

  // Use custom items or get items based on role
  // For AGENT role, use adapted navigation from hook
  let navItems = items;
  if (!items) {
    navItems = role === "AGENT" ? agentNavItems : getNavByRole(role);
  }

  return (
    <NavigationMenu className="flex-col">
      <NavigationMenuList>
        {navItems.map(({ href, label, icon: Icon, description }) => (
          <NavigationMenuItem key={href}>
            <Link href={href} legacyBehavior passHref>
              <NavigationMenuLink
                className={cn(navigationMenuTriggerStyle(), "flex items-center")}
                data-active={pathname.startsWith(href) ? "true" : undefined}
                title={description}
              >
                {Icon && <Icon className="me-2 h-4 w-4" />}
                {label}
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
}
