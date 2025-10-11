import React from "react";

import AppHeader from "@/components/app-header";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function BillingLayout({ children }) {
  return (
    <>
      <SidebarProvider>
        <AppHeader />
      </SidebarProvider>
      <main>{children}</main>
    </>
  );
}
