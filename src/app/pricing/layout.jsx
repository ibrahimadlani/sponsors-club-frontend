import { SidebarProvider } from "@/components/ui/sidebar";
import AppHeader from "@/components/app-header";

export default function PricingLayout({ children }) {
  return (
    <SidebarProvider>
      <div className="flex flex-col min-h-screen w-full">
        <AppHeader />
        <main className="flex-1">{children}</main>
      </div>
    </SidebarProvider>
  );
}
