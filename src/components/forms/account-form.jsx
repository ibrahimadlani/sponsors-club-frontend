"use client";

import { useCallback, useEffect, useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { paymentEndpoints } from "@/lib/endpoints";

const accountFormSchema = z.object({
  planId: z.string({ required_error: "Veuillez sélectionner une formule." }).min(1),
});

const formatPlanPrice = (plan) => {
  const amount = plan?.price ?? plan?.amount ?? plan?.unit_amount;
  if (typeof amount !== "number") return "Tarif non disponible";
  const currency = (plan?.currency || "EUR").toString().toUpperCase();
  const interval = plan?.interval || plan?.interval_unit || plan?.billing_interval;
  try {
    const price = new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
    }).format(amount / 100);
    return interval ? `${price} / ${interval}` : price;
  } catch (error) {
    console.warn("Unable to format price", error);
    return `${amount / 100} ${currency}`;
  }
};

const formatDate = (value) => {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "medium",
  }).format(date);
};

export function AccountForm() {
  const form = useForm({
    resolver: zodResolver(accountFormSchema),
    defaultValues: { planId: "" },
  });
  const [plans, setPlans] = useState([]);
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [plansPayload, subscriptionPayload] = await Promise.all([
        paymentEndpoints
          .listPlans()
          .then((response) => (Array.isArray(response) ? response : []))
          .catch((error) => {
            console.warn("Unable to load plans", error);
            return [];
          }),
        paymentEndpoints
          .getMySubscription()
          .catch((error) => {
            if (error?.status === 404) {
              return null;
            }
            throw error;
          }),
      ]);
      setPlans(plansPayload);
      setSubscription(subscriptionPayload);
      form.reset({ planId: subscriptionPayload?.plan?.id || "" });
    } catch (error) {
      console.error(error);
      toast.error("Impossible de charger vos informations de facturation.");
    } finally {
      setLoading(false);
    }
  }, [form]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const onSubmit = async ({ planId }) => {
    if (!planId) {
      toast.error("Sélectionnez une formule pour continuer.");
      return;
    }
    if (subscription?.plan?.id === planId && !subscription?.cancel_at_period_end) {
      toast.info("Vous êtes déjà sur cette formule.");
      return;
    }
    setActionLoading(true);
    try {
      const session = await paymentEndpoints.createCheckoutSession({ plan_id: planId });
      const redirectUrl = session?.checkout_url || session?.url;
      if (redirectUrl) {
        window.location.href = redirectUrl;
        return;
      }
      toast.success("Session de paiement créée. Consultez votre messagerie pour continuer.");
    } catch (error) {
      console.error(error);
      toast.error("Impossible de créer la session de paiement.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!subscription) return;
    setActionLoading(true);
    try {
      await paymentEndpoints.cancelMySubscription();
      toast.success("Votre abonnement sera annulé à la fin de la période en cours.");
      await loadData();
    } catch (error) {
      console.error(error);
      toast.error("Impossible d&apos;annuler l&apos;abonnement.");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <section className="rounded-lg border bg-card text-card-foreground shadow-sm">
        <div className="space-y-2 border-b p-4">
          <h4 className="text-base font-semibold">Abonnement actuel</h4>
          {loading ? (
            <p className="text-sm text-muted-foreground">Chargement des détails...</p>
          ) : subscription ? (
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>
                Formule : <span className="font-medium text-foreground">{subscription?.plan?.name || subscription?.plan?.nickname || "Plan personnalisé"}</span>
              </p>
              {subscription?.status ? (
                <p>
                  Statut : <span className="font-medium text-foreground">{subscription.status}</span>
                </p>
              ) : null}
              {subscription?.current_period_end ? (
                <p>
                  Renouvellement le {formatDate(subscription.current_period_end)}
                </p>
              ) : null}
              {subscription?.cancel_at_period_end ? (
                <p className="text-amber-600 dark:text-amber-400">
                  L&apos;abonnement sera résilié à la fin de la période.
                </p>
              ) : null}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Aucun abonnement actif pour le moment.</p>
          )}
        </div>
        <div className="flex items-center justify-between gap-3 p-4">
          <div className="text-sm text-muted-foreground">
            {subscription?.plan ? formatPlanPrice(subscription.plan) : "Sélectionnez une formule pour démarrer."}
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            disabled={!subscription || actionLoading}
          >
            {actionLoading ? "Traitement..." : "Annuler l&apos;abonnement"}
          </Button>
        </div>
      </section>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="planId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Choisir une formule</FormLabel>
                <FormControl>
                  <select
                    {...field}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="">Sélectionnez une formule</option>
                    {plans.map((plan) => (
                      <option key={plan.id} value={plan.id}>
                        {(plan.name || plan.nickname || "Plan") + " – " + formatPlanPrice(plan)}
                      </option>
                    ))}
                  </select>
                </FormControl>
                <FormDescription>
                  Sélectionnez le plan qui correspond le mieux à vos besoins.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex items-center gap-3">
            <Button type="submit" disabled={actionLoading || loading || plans.length === 0}>
              {actionLoading ? "Traitement..." : "Mettre à jour la formule"}
            </Button>
            {plans.length === 0 ? (
              <span className="text-sm text-muted-foreground">Aucune formule disponible pour le moment.</span>
            ) : null}
          </div>
        </form>
      </Form>
    </div>
  );
}
