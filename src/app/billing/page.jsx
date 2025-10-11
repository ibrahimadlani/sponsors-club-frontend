"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import AppHeader from "@/components/app-header";

// Simple UI, replace with shadcn/ui or your design system as needed
export default function BillingPage() {
  const [plans, setPlans] = useState([]);
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch plans and current subscription
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        const plansRes = await fetch("/api/payments/plans/");
        const plansData = await plansRes.json();
        setPlans(Array.isArray(plansData) ? plansData : []);
        const subRes = await fetch("/api/payments/subscriptions/me/");
        setSubscription(subRes.ok ? await subRes.json() : null);
      } catch (e) {
        setError("Erreur lors du chargement des données.");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Cancel subscription
  async function handleCancel() {
    if (!window.confirm("Confirmer l'annulation de l'abonnement ?")) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/payments/subscriptions/me/", { method: "DELETE" });
      if (!res.ok) throw new Error();
      setSubscription(null);
    } catch {
      setError("Erreur lors de l'annulation.");
    } finally {
      setLoading(false);
    }
  }

  // Subscribe to a plan
  async function handleSubscribe(planId) {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/payments/stripe/checkout-session/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan_id: planId })
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch {
      setError("Erreur lors de la souscription.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <AppHeader />
      <div className="max-w-2xl mx-auto py-10 px-4 flex-1">
      <h1 className="text-2xl font-bold mb-6">Abonnement & Facturation</h1>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      {loading ? (
        <div>Chargement…</div>
      ) : (
        <>
          {subscription ? (
            <div className="mb-8 p-4 border rounded bg-green-50">
              <h2 className="font-semibold mb-2">Votre abonnement</h2>
              <div>Plan : <b>{subscription.plan_name || subscription.plan || 'N/A'}</b></div>
              <div>Status : <b>{subscription.status || 'actif'}</b></div>
              <button onClick={handleCancel} className="mt-3 px-4 py-2 bg-red-500 text-white rounded">Annuler l&apos;abonnement</button>
            </div>
          ) : (
            <div className="mb-8 p-4 border rounded bg-yellow-50">Aucun abonnement actif.</div>
          )}

          <h2 className="font-semibold mb-4">Choisir un abonnement</h2>
          <div className="grid gap-4">
            {plans.length === 0 && <div>Aucun plan disponible.</div>}
            {plans.map(plan => (
              <div key={plan.id || plan.name} className="border rounded p-4 flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="font-bold text-lg">{plan.name}</div>
                  <div className="text-gray-600">{plan.description}</div>
                  <div className="text-xl mt-2">{plan.price ? plan.price + ' € / mois' : 'Prix sur demande'}</div>
                </div>
                <button
                  className="mt-4 md:mt-0 px-4 py-2 bg-blue-600 text-white rounded"
                  onClick={() => handleSubscribe(plan.id || plan.name)}
                  disabled={loading || (subscription && (subscription.plan_id === plan.id || subscription.plan === plan.name))}
                >
                  {subscription && (subscription.plan_id === plan.id || subscription.plan === plan.name) ? 'Abonnement actif' : 'Souscrire'}
                </button>
              </div>
            ))}
          </div>
        </>
      )}
      </div>
    </div>
  );
}
