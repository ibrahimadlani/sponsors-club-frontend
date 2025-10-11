import AppHeader from "@/components/app-header";
import Footer from "@/components/footer";
import { SidebarProvider } from "@/components/ui/sidebar";
import FeaturesContent from "./features-content";

export const metadata = {
  title: "Fonctionnalités | SponsorsClub",
  description:
    "Explorez les fonctionnalités clés de SponsorsClub pour développer des partenariats entre athlètes et marques.",
};

export default function FeaturesPage() {
  return (
    <SidebarProvider>
      <div className="flex min-h-svh flex-col bg-background text-foreground">
        <AppHeader />
        <FeaturesContent />
        <Footer />
      </div>
    </SidebarProvider>
  );
}

