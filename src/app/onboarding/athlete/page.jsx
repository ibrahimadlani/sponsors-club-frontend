import Logo from "@/components/ui/logo";
import { AthleteOnboardingForm } from "@/components/forms/athlete-onboarding-form";

/**
 * AthleteOnboardingPage Component
 *
 * This component renders the athlete onboarding page for agents.
 * Agents can create their first athlete profile.
 *
 * @returns {JSX.Element} The rendered athlete onboarding page.
 */
export default function AthleteOnboardingPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-2xl flex-col gap-6 items-center">
        <Logo />
        <AthleteOnboardingForm />
      </div>
    </div>
  );
}
