import Logo from "@/components/ui/logo";
import { OrganisationOnboardingForm } from "@/components/forms/organisation-onboarding-form";

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
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-2xl flex-col gap-6 items-center">
        <Logo />
        <OrganisationOnboardingForm />
      </div>
    </div>
  );
}
