"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ProfileForm } from "@/components/forms/profile-form";
import ChangePasswordForm from "@/components/forms/change-password-form";
import DeleteAccount from "@/components/forms/delete-account";
import { users } from "@/lib/api";

export default function SettingsUserPage() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    let mounted = true;

    async function fetchUser() {
      try {
        setLoading(true);
        const data = await users.getMe();
        if (mounted) setUser(data);
      } catch (error) {
        toast.error("Impossible de charger votre profil.");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchUser();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="space-y-8">
      <section className="rounded-xl border border-border bg-card shadow-sm">
        <CardHeader className="border-b border-border/70 bg-muted/40 px-6 py-5">
          <CardTitle className="text-xl">Profil utilisateur</CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            Mettez à jour vos informations personnelles et la façon dont les autres vous voient sur SponsorsClub.
          </CardDescription>
        </CardHeader>
        <CardContent className="px-6 py-6">
          {loading ? (
            <div className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-32 w-full" />
            </div>
          ) : (
            <ProfileForm />
          )}
        </CardContent>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="rounded-xl border border-border shadow-sm">
          <CardHeader className="border-b border-border/70 bg-muted/40 px-6 py-5">
            <CardTitle className="text-lg">Sécurité du compte</CardTitle>
            <CardDescription className="text-sm text-muted-foreground">
              Changez votre mot de passe pour renforcer la sécurité de votre compte SponsorsClub.
            </CardDescription>
          </CardHeader>
          <CardContent className="px-6 py-6">
            <ChangePasswordForm />
          </CardContent>
        </Card>

        <Card className="rounded-xl border border-destructive/40 bg-destructive/5 shadow-sm">
          <CardHeader className="border-b border-destructive/20 bg-destructive/10 px-6 py-5">
            <CardTitle className="text-lg text-destructive">Zone sensible</CardTitle>
            <CardDescription className="text-sm text-destructive/80">
              Supprimer votre compte entraînera la perte définitive de vos données et historiques.
            </CardDescription>
          </CardHeader>
          <CardContent className="px-6 py-6">
            <DeleteAccount />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

