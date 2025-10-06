"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { BicepsFlexed, Building, ChartNoAxesCombined, Handshake, Heart, MessagesSquare, ShieldHalf, User, Users } from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

const NAV_LINKS = [
  { href: "/athletes", label: "Athlètes", icon: BicepsFlexed },
  { href: "/follows", label: "Suivis", icon: Heart },
  { href: "/collaborations", label: "Collabs", icon: Handshake },
  { href: "/analytics", label: "Analytics", icon: ChartNoAxesCombined },
];

export function NavMenu() {
  const pathname = usePathname();

  return (
    <NavigationMenu className="flex-col">
      <NavigationMenuList>
        {NAV_LINKS.map(({ href, label, icon: Icon }) => (
          <NavigationMenuItem key={href}>
            <Link href={href} legacyBehavior passHref>
              <NavigationMenuLink
                className={cn(navigationMenuTriggerStyle(), "flex items-center")}
                data-active={pathname.startsWith(href) ? "true" : undefined}
              >
                <Icon className="me-2 h-4 w-4" />
                {label}
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
}
