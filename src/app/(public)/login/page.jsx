"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import Logo from "@/components/ui/logo";
import { LoginForm } from "@/components/forms/login-form";


/**
 * LoginPage Component
 *
 * This component represents the login page of the application.
 * It uses a flexbox layout to center its content both vertically and horizontally.
 * The page consists of a header displaying the company logo (which links to the homepage)
 * and a login form for user authentication.
 * 
 * If redirected by middleware, displays a toast notification informing the user.
 *
 * @returns {JSX.Element} The rendered login page.
 */
export default function LoginPage() {
  const searchParams = useSearchParams();

  useEffect(() => {
    // Check if user was redirected by middleware
    const redirected = searchParams.get("redirected");
    const expired = searchParams.get("expired");
    const next = searchParams.get("next");
    
    if (redirected === "true") {
      if (expired === "1") {
        toast.error("Session expirée", {
          description: "Votre session a expiré. Veuillez vous reconnecter.",
          duration: 5000,
        });
      } else {
        toast.warning("Authentification requise", {
          description: next 
            ? `Vous devez vous connecter pour accéder à ${next}` 
            : "Vous devez vous connecter pour accéder à cette page.",
          duration: 5000,
        });
      }
    }
  }, [searchParams]);

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6 items-center">
        <Logo />
        <LoginForm />
      </div>
    </div>
  );
}