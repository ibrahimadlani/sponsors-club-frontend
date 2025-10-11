"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LogIn, UserPlus } from "lucide-react";

/**
 * PublicAuthNav Component
 * 
 * Authentication navigation for public/unauthenticated users.
 * Displays login and register call-to-action buttons.
 * 
 * Features:
 * - Login link with login icon
 * - Register call-to-action button (primary style)
 * - Responsive design
 */
export function PublicAuthNav() {
  return (
    <div className="flex items-center gap-2">
      {/* Login Link */}
      <Link href="/login">
        <Button variant="ghost" size="sm" className="flex items-center gap-2">
          <LogIn className="h-4 w-4" />
          <span className="hidden sm:inline">Se connecter</span>
        </Button>
      </Link>

      {/* Register CTA */}
      <Link href="/register">
        <Button size="sm" className="flex items-center gap-2">
          <UserPlus className="h-4 w-4" />
          <span className="hidden sm:inline">S&apos;inscrire</span>
        </Button>
      </Link>
    </div>
  );
}