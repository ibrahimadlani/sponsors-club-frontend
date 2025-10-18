"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { payments } from "@/lib/api";
import { Check, CreditCard } from "lucide-react";

const DEFAULT_ERROR = "Impossible de charger les informations de facturation.";

export default function SettingsBillingPage() {
  const [loading, setLoading] = useState(true);
  const [plans, setPlans] = useState([]);
  const [subscription, setSubscription] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function loadBilling() {
      setLoading(true);
      try {
        const [plansResult, subscriptionResult] = await Promise.allSettled([
          payments.getPlans(),
          payments.getMySubscription(),
        ]);

        if (!mounted) return;

        if (plansResult.status === "fulfilled") {
          setPlans(Array.isArray(plansResult.value) ? plansResult.value : []);
        } else {
          toast.warning("Impossible de récupérer les plans disponibles.");
        }

        if (subscriptionResult.status === "fulfilled") {
          setSubscription(subscriptionResult.value);
        }
      } catch (error) {
        if (mounted) toast.error(DEFAULT_ERROR);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadBilling();
    return () => {
      mounted = false;
    };
  }, []);

  const activePlanId = subscription?.plan?.id;

  const otherPlans = useMemo(() => {
    if (!Array.isArray(plans)) return [];
    return plans.filter((plan) => plan.id !== activePlanId);
  }, [plans, activePlanId]);

  async function handleCheckout(planId) {
    setProcessing(true);
    try {
      const session = await payments.createCheckoutSession(planId);
      if (session?.url) {
        window.location.href = session.url;
      } else {
        throw new Error("URL de paiement introuvable");
      }
    } catch (error) {
      toast.error(error?.message || "Impossible de démarrer le paiement.");
      setProcessing(false);
    }
  }

  async function handleCancelSubscription() {
    setCancelling(true);
    try {
      await payments.cancelMySubscription();
      toast.success("Votre abonnement a été annulé.");
      setSubscription(null);
    } catch (error) {
      toast.error(error?.message || "Impossible d'annuler l'abonnement.");
    } finally {
      setCancelling(false);
    }
  }

  return (
    <div className="space-y-8">
      <Card className="overflow-hidden border-border/80 bg-card/90">
        <CardHeader className="space-y-3 border-b border-border/60 bg-muted/40 px-6 py-5">
          <CardTitle className="text-xl">Facturation & abonnement</CardTitle>
          <CardDescription>
            Consultez le statut de votre abonnement, mettez à jour votre formule ou accédez à vos factures.
          </CardDescription>
        </CardHeader>
        <CardContent className="px-6 py-6">
          {loading ? (
            <div className="space-y-4">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-32 w-full" />
            </div>
          ) : subscription ? (
            <div className="flex flex-col gap-4 rounded-xl border border-border/70 bg-background/60 p-5 md:flex-row md:items-center md:justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <Badge variant="secondary">Plan actif</Badge>
                  <span className="text-sm text-muted-foreground">
                    Renouvellement {subscription.renewal_date ? `le ${new Date(subscription.renewal_date).toLocaleDateString("fr-FR")}` : "automatique"}
                  </span>
                </div>
                <h2 className="text-lg font-semibold">{subscription.plan?.name || "Abonnement en cours"}</h2>
                <p className="text-sm text-muted-foreground">
                  {subscription.plan?.description || "Inclut toutes les fonctionnalités de votre formule actuelle."}
                </p>
                {subscription.plan?.price ? (
                  <p className="text-sm font-medium text-foreground">
                    {new Intl.NumberFormat("fr-FR", { style: "currency", currency: subscription.plan?.currency || "EUR" }).format(subscription.plan.price)}
                    {" "} / {subscription.plan?.interval || "mois"}
                  </p>
                ) : null}
              </div>
              <div className="flex flex-col gap-2 md:items-end">
                <Button variant="outline" asChild>
                  <Link href="/billing">Accéder à l’historique</Link>
                </Button>
                <Button
                  variant="ghost"
                  onClick={handleCancelSubscription}
                  disabled={cancelling}
                  className="text-destructive hover:text-destructive"
                >
                  {cancelling ? "Annulation..." : "Résilier"}
                </Button>
              </div>
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-border/70 bg-muted/40 p-5 text-sm text-muted-foreground">
              <p>
                Vous n’avez pas encore souscrit à une formule SponsorsClub. Comparez nos offres pour débloquer davantage de fonctionnalités.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Formules disponibles</h2>
        <div className="grid gap-6 md:grid-cols-2">
          {otherPlans.map((plan) => (
            <Card key={plan.id} className="border-border/70 bg-card/90">
              <CardHeader className="space-y-3 border-b border-border/60 bg-muted/40 px-6 py-5">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CreditCard className="h-4 w-4" />
                  {plan.interval?.toUpperCase() || "MENSUEL"}
                </div>
                <CardTitle className="text-xl">{plan.name}</CardTitle>
                <CardDescription>{plan.description || "Formule complète pour vos besoins."}</CardDescription>
                {plan.price ? (
                  <p className="text-sm font-semibold text-foreground">
                    {new Intl.NumberFormat("fr-FR", { style: "currency", currency: plan.currency || "EUR" }).format(plan.price)}
                    {" "} / {plan.interval || "mois"}
                  </p>
                ) : (
                  <p className="text-sm font-semibold text-foreground">Tarif sur demande</p>
                )}
              </CardHeader>
              <CardContent className="space-y-2 px-6 py-5 text-sm text-muted-foreground">
                {Array.isArray(plan.features) ? (
                  plan.features.map((feature) => (
                    <div key={feature} className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-primary" />
                      <span>{feature}</span>
                    </div>
                  ))
                ) : (
                  <p>Fonctionnalités complètes SponsorsClub.</p>
                )}
              </CardContent>
              <CardFooter className="px-6 pb-6">
                <Button
                  className="w-full"
                  onClick={() => handleCheckout(plan.id)}
                  disabled={processing}
                >
                  {processing ? "Redirection..." : "Choisir ce plan"}
                </Button>
              </CardFooter>
            </Card>
          ))}
          {otherPlans.length === 0 && !loading ? (
            <Card className="border-border/60 bg-card/90">
              <CardContent className="px-6 py-6 text-sm text-muted-foreground">
                Aucune autre formule n’est disponible pour le moment.
              </CardContent>
            </Card>
          ) : null}
        </div>
      </div>
    </div>
  );
}

