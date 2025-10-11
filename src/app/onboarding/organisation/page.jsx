"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Logo from "@/components/ui/logo";
import { OrganisationOnboardingForm } from "@/components/forms/organisation-onboarding-form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

/**
 * OrganisationOnboardingContent Component
 * 
 * Component qui gère le contenu de l'onboarding avec accès aux searchParams
 */
function OrganisationOnboardingContent() {
  const searchParams = useSearchParams();
  const isRequired = searchParams.get("required") === "true";

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-2xl flex-col gap-6 items-center">
        <Logo />
        
        {isRequired && (
          <Alert variant="destructive" className="w-full max-w-2xl">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="font-medium">
              🚫 <strong>Onboarding Obligatoire</strong><br/>
              Vous devez créer ou rejoindre une organisation pour accéder à la plateforme.
              Cette étape est nécessaire pour débloquer toutes les fonctionnalités.
            </AlertDescription>
          </Alert>
        )}
        
        <OrganisationOnboardingForm isRequired={isRequired} />
      </div>
    </div>
  );
}

/**
 * OrganisationOnboardingPage Component
 *
 * This component renders the organisation onboarding page.
 * Users can either join an existing organisation with an invitation code
 * or create a new organisation.
 *
 * @returns {JSX.Element} The rendered organisation onboarding page.
 */
export default function OrganisationOnboardingPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
        <div className="flex w-full max-w-2xl flex-col gap-6 items-center">
          <Logo />
          <div>Chargement...</div>
        </div>
      </div>
    }>
      <OrganisationOnboardingContent />
    </Suspense>
  );
}
