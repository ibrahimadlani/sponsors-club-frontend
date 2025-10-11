"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import AppHeader from "@/components/app-header";
import Footer from "@/components/footer";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useCurrentUser } from "@/hooks/useCurrentUser";

/**
 * PrivateLayout Component
 * 
 * Layout for all authenticated pages.
 * Includes authentication check and AppHeader with role-based navigation.
 * 
 * Pages in this layout:
 * - /athletes
 * - /dashboard
 * - /explore
 * - /followed
 * - /messages
 */
export default function PrivateLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, loading } = useCurrentUser();

  useEffect(() => {
    // Vérifier si l'utilisateur a un token
    console.log(user)
    const accessToken = document.cookie
      .split('; ')
      .find(row => row.startsWith('accessToken='));
    
    if (!accessToken) {
      // Pas de token, rediriger vers /login
      console.log('[PrivateLayout] No token, redirecting to /login');
      router.push(`/login?next=${encodeURIComponent(pathname)}`);
    }
  }, [router, pathname]);

  useEffect(() => {
    if (loading) return;
    if (!user) return;

    const onboardingPath = "/onboarding/organisation";
    if (
      user.role === "COLLABORATOR" &&
      user.collaborator_has_org === false &&
      !pathname.startsWith(onboardingPath)
    ) {
      const url = `${onboardingPath}?required=true`;
      router.replace(url);
    }
  }, [user, loading, pathname, router]);

  return (
    <SidebarProvider>
      <div className="flex flex-col min-h-screen w-full">
        <AppHeader />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </div>
    </SidebarProvider>
  );
}
