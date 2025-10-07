"use client";
/**
 * Settings > Billing
 * Billing/account plan management form.
 */

import { Separator } from "@/components/ui/separator";
import { AccountForm } from "@/components/forms/account-form";

export default function SettingsBillingPage() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Billing</h3>
        <p className="text-sm text-muted-foreground">
          Gérez votre abonnement, vos paiements et vos factures depuis cet espace.
        </p>
      </div>
      <Separator />
      <AccountForm />
    </div>
  );
}
