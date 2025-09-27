import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function TestPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-4">
        <h1 className="text-2xl font-bold">Page de test</h1>
        <p>Cliquez sur les liens ci-dessous pour tester les différents onboarding</p>
        <div className="space-y-3">
          <Link href="/onboarding/organisation">
            <Button className="w-full">
              🏢 Onboarding Organisation
            </Button>
          </Link>
          <Link href="/onboarding/athlete">
            <Button className="w-full" variant="outline">
              🏆 Onboarding Athlète
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
