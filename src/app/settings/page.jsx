"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  BellDot,
  LineChart,
  Loader2,
  Lock,
  Network,
  ShieldCheck,
  Users2,
} from "lucide-react";
import { analytics, notifications, organisations, users } from "@/lib/api";
import { ProfileForm } from "@/components/forms/profile-form";
import ChangePasswordForm from "@/components/forms/change-password-form";
import DeleteAccount from "@/components/forms/delete-account";

const DEFAULT_ERROR = "Impossible de charger vos paramètres. Réessayez dans quelques instants.";

function normalizeRoles(rolesPayload) {
  if (!rolesPayload) return [];
  if (Array.isArray(rolesPayload)) return rolesPayload;
  if (Array.isArray(rolesPayload?.roles)) return rolesPayload.roles;
  if (Array.isArray(rolesPayload?.data)) return rolesPayload.data;
  return Object.entries(rolesPayload)
    .filter(([, value]) => value != null)
    .map(([key, value]) => (typeof value === "string" ? value : key));
}

function normalizeEntitlements(entitlementsPayload) {
  if (!entitlementsPayload) return [];
  if (Array.isArray(entitlementsPayload)) return entitlementsPayload;
  if (Array.isArray(entitlementsPayload?.features)) return entitlementsPayload.features;
  if (Array.isArray(entitlementsPayload?.enabled)) return entitlementsPayload.enabled;
  return Object.entries(entitlementsPayload)
    .filter(([, value]) => Boolean(value))
    .map(([key]) => key);
}

function formatDate(value) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export default function SettingsOverviewPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [syncingAnalytics, setSyncingAnalytics] = useState(false);
  const [data, setData] = useState({
    user: null,
    roles: [],
    entitlements: [],
    organisations: [],
    notifications: [],
  });

  useEffect(() => {
    let mounted = true;

    async function fetchSettingsData() {
      setLoading(true);
      setError("");

      try {
        const [userResult, rolesResult, entitlementsResult, organisationsResult, notificationsResult] =
          await Promise.allSettled([
            users.getMe(),
            users.getMyRoles(),
            users.getMyEntitlements(),
            organisations.getOrganisations(),
            notifications.getNotifications({ page_size: 5 }),
          ]);

        if (!mounted) return;

        const nextState = {
          user: userResult.status === "fulfilled" ? userResult.value : null,
          roles:
            rolesResult.status === "fulfilled"
              ? normalizeRoles(rolesResult.value)
              : [],
          entitlements:
            entitlementsResult.status === "fulfilled"
              ? normalizeEntitlements(entitlementsResult.value)
              : [],
          organisations:
            organisationsResult.status === "fulfilled"
              ? Array.isArray(organisationsResult.value)
                ? organisationsResult.value
                : organisationsResult.value?.results ?? []
              : [],
          notifications:
            notificationsResult.status === "fulfilled"
              ? Array.isArray(notificationsResult.value?.results)
                ? notificationsResult.value.results
                : Array.isArray(notificationsResult.value)
                ? notificationsResult.value
                : []
              : [],
        };

        setData(nextState);

        // Surface partial fetch issues with a non-blocking toast
        const rejected = [
          userResult,
          rolesResult,
          entitlementsResult,
          organisationsResult,
          notificationsResult,
        ].filter((result) => result.status === "rejected");
        if (rejected.length > 0) {
          toast.warning("Certaines données n'ont pas pu être chargées.");
        }
      } catch (err) {
        if (!mounted) return;
        setError(err?.message || DEFAULT_ERROR);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    fetchSettingsData();

    return () => {
      mounted = false;
    };
  }, []);

  const accountTypeLabel = useMemo(() => {
    const accountType = data.user?.account_type;
    if (!accountType) return "Compte";
    switch (accountType) {
      case "AGENT":
        return "Compte agent";
      case "COLLABORATOR":
        return "Compte collaborateur";
      default:
        return accountType;
    }
  }, [data.user?.account_type]);

  const organisationsPreview = useMemo(() => {
    if (!Array.isArray(data.organisations)) return [];
    if (!data.user?.id) return data.organisations.slice(0, 3);
    const owned = data.organisations.filter(
      (org) => org.owner_user_id === data.user.id || org.owner_id === data.user.id
    );
    if (owned.length > 0) {
      return owned.slice(0, 3);
    }
    return data.organisations.slice(0, 3);
  }, [data.organisations, data.user?.id]);

  async function handleAnalyticsSync() {
    setSyncingAnalytics(true);
    try {
      await analytics.syncAllAccounts();
      toast.success("Synchronisation analytics lancée.");
    } catch (err) {
      toast.error(err?.message || "Impossible de lancer la synchronisation.");
    } finally {
      setSyncingAnalytics(false);
    }
  }

  const showContent = !loading && !error;

  return (
    <div className="space-y-10">
      <section className="rounded-lg border border-border bg-card p-6 shadow-sm md:p-8">
        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-10 w-2/3" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-1/3" />
          </div>
        ) : (
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="space-y-3">
              <Badge variant="secondary" className="uppercase tracking-wide">
                {accountTypeLabel}
              </Badge>
              <div>
                <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
                  Paramètres du compte
                </h1>
                <p className="text-muted-foreground">
                  Centralisez vos informations, mettez à jour votre profil et pilotez vos intégrations.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {data.roles.slice(0, 4).map((role) => (
                  <Badge key={role} variant="outline">
                    {role}
                  </Badge>
                ))}
                {data.roles.length === 0 && (
                  <Badge variant="outline">Rôle standard</Badge>
                )}
              </div>
            </div>
            <div className="w-full max-w-sm rounded-lg border border-dashed border-border bg-background/80 p-4 shadow-inner">
              <p className="text-sm font-medium text-muted-foreground">Coordonnées principales</p>
              <p className="mt-2 text-base font-semibold text-foreground">
                {data.user?.first_name || data.user?.last_name
                  ? `${data.user?.first_name ?? ""} ${data.user?.last_name ?? ""}`.trim()
                  : data.user?.email}
              </p>
              <p className="text-sm text-muted-foreground">{data.user?.email}</p>
              {data.user?.phone_number && (
                <p className="text-sm text-muted-foreground">
                  {`${data.user?.phone_country_code ?? ""} ${data.user?.phone_number}`}
                </p>
              )}
            </div>
          </div>
        )}
      </section>

      {error && !loading ? (
        <Card className="border-destructive/50 bg-destructive/10">
          <CardHeader>
            <CardTitle>Erreur lors du chargement</CardTitle>
            <CardDescription>{error || DEFAULT_ERROR}</CardDescription>
          </CardHeader>
        </Card>
      ) : null}

      {showContent ? (
        <>
          <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-base font-semibold">Entitlements</CardTitle>
                <ShieldCheck className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent className="space-y-3">
                {data.entitlements.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {data.entitlements.slice(0, 8).map((feature) => (
                      <Badge key={feature} variant="outline" className="capitalize">
                        {feature.replace(/_/g, " ")}
                      </Badge>
                    ))}
                    {data.entitlements.length > 8 && (
                      <Badge variant="secondary">
                        +{data.entitlements.length - 8} autres
                      </Badge>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Aucune donnée d&apos;entitlement disponible pour votre compte.
                  </p>
                )}
              </CardContent>
              <CardFooter className="text-xs text-muted-foreground">
                Basé sur <code className="rounded bg-muted px-1 py-0.5">/users/me/entitlements/</code>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-base font-semibold">Organisations</CardTitle>
                <Users2 className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent className="space-y-2">
                {organisationsPreview.length > 0 ? (
                  <ul className="space-y-2">
                    {organisationsPreview.map((org) => (
                      <li key={org.id} className="rounded-md border border-border/70 bg-muted/20 p-3">
                        <p className="font-medium leading-tight">{org.name}</p>
                        {org.industry ? (
                          <p className="text-xs text-muted-foreground">{org.industry}</p>
                        ) : null}
                        {org.owner_user_id === data.user?.id ? (
                          <Badge variant="secondary" className="mt-2 text-xs">
                            Propriétaire
                          </Badge>
                        ) : null}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Rejoignez ou créez une organisation pour collaborer plus facilement.
                  </p>
                )}
              </CardContent>
              <CardFooter className="text-xs text-muted-foreground">
                Source <code className="rounded bg-muted px-1 py-0.5">/organisations/</code>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-base font-semibold">Dernières notifications</CardTitle>
                <BellDot className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent className="space-y-3">
                {data.notifications.length > 0 ? (
                  <ul className="space-y-3">
                    {data.notifications.map((notification) => (
                      <li key={notification.id} className="rounded-md border border-border/60 bg-muted/10 p-3">
                        <p className="text-sm font-medium capitalize">{notification.type?.toLowerCase()}</p>
                        {notification.created_at ? (
                          <p className="text-xs text-muted-foreground">
                            {formatDate(notification.created_at)}
                          </p>
                        ) : null}
                        {notification.is_read ? (
                          <Badge variant="secondary" className="mt-2 text-xs">
                            Lu
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="mt-2 text-xs">
                            Non lu
                          </Badge>
                        )}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Vous n&apos;avez aucune notification récente.
                  </p>
                )}
              </CardContent>
              <CardFooter className="text-xs text-muted-foreground">
                Données <code className="rounded bg-muted px-1 py-0.5">/notifications/</code>
              </CardFooter>
            </Card>

            <Card className="md:col-span-2 xl:col-span-3">
              <CardHeader className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <CardTitle className="text-base font-semibold">Intégrations & Analytics</CardTitle>
                  <CardDescription>
                    Déclenchez une synchronisation globale ou surveillez vos connexions.
                  </CardDescription>
                </div>
                <Badge variant="outline" className="flex items-center gap-1">
                  <Network className="h-3.5 w-3.5" />
                  Connecteurs actifs
                </Badge>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2 rounded-lg border border-dashed border-border bg-muted/20 p-4">
                  <p className="text-sm font-medium">Synchroniser toutes les audiences</p>
                  <p className="text-sm text-muted-foreground">
                    Relance un fetch social pour chaque compte actif via{" "}
                    <code className="rounded bg-muted px-1 py-0.5 text-xs">
                      /analytics/accounts/sync_all/
                    </code>
                  </p>
                  <Button
                    onClick={handleAnalyticsSync}
                    disabled={syncingAnalytics}
                    className="mt-2 w-full md:w-auto"
                  >
                    <span className="flex items-center gap-2">
                      {syncingAnalytics ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <LineChart className="h-4 w-4" />
                      )}
                      {syncingAnalytics ? "Synchronisation..." : "Lancer la synchronisation"}
                    </span>
                  </Button>
                </div>
                <div className="space-y-2 rounded-lg border border-dashed border-border bg-muted/20 p-4">
                  <p className="text-sm font-medium">Historique récent</p>
                  <p className="text-sm text-muted-foreground">
                    Consultez les dernières métriques dans l&apos;onglet Analytics de votre espace privé.
                  </p>
                  <Button variant="outline" className="mt-2 w-full md:w-auto" asChild>
                    <Link href="/analytics" className="flex items-center gap-2">
                      <LineChart className="h-4 w-4" />
                      Voir les analytics
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </section>

          <section className="grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
            <Card className="order-2 lg:order-1">
              <CardHeader>
                <CardTitle>Informations personnelles</CardTitle>
                <CardDescription>
                  Mettez à jour vos informations visibles par vos partenaires.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ProfileForm />
              </CardContent>
            </Card>

            <div className="order-1 space-y-6 lg:order-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lock className="h-4 w-4 text-primary" />
                    Sécurité du compte
                  </CardTitle>
                  <CardDescription>
                    Changez votre mot de passe et sécurisez l&apos;accès à votre compte.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ChangePasswordForm />
                </CardContent>
              </Card>

              <Card className="border-destructive/40 bg-destructive/5">
                <CardHeader>
                  <CardTitle className="text-destructive flex items-center gap-2">
                    <Lock className="h-4 w-4" />
                    Zone sensible
                  </CardTitle>
                  <CardDescription>
                    Supprimez définitivement votre compte et toutes vos données associées.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <DeleteAccount />
                </CardContent>
              </Card>
            </div>
          </section>
        </>
      ) : null}
    </div>
  );
}
