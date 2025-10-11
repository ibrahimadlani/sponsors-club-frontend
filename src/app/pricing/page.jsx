"use client";

/**
 * Pricing Page
 *
 * Displays available subscription plans fetched from the API.
 * Uses shadcn/ui components with a modern, responsive design.
 * Allows users to compare plans and subscribe via Stripe Checkout.
 */

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Check,
  Sparkles,
  TrendingUp,
  Crown,
  Loader2,
  Users,
  Building2,
  CreditCard,
  HelpCircle,
  MessageSquare,
} from "lucide-react";

// UI Components
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Logo from "@/components/ui/logo";
import AppHeader from "@/components/app-header";
import Footer from "@/components/footer";
import { useCurrentUser } from "@/hooks/useCurrentUser";

// API
import { payments } from "@/lib/api";

/**
 * Format price for display
 */
const formatPrice = (amount, currency = "EUR") => {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency,
  }).format(amount);
};

/**
 * Get icon based on plan name/tier
 */
const getPlanIcon = (name) => {
  const lowerName = name?.toLowerCase() || "";
  if (lowerName.includes("premium") || lowerName.includes("pro")) {
    return <Crown className="h-5 w-5" />;
  }
  if (lowerName.includes("plus") || lowerName.includes("growth")) {
    return <TrendingUp className="h-5 w-5" />;
  }
  return <Sparkles className="h-5 w-5" />;
};

/**
 * Main Pricing Page Component
 */
export default function PricingPage() {
  const [plans, setPlans] = useState([]);
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [subscribing, setSubscribing] = useState(null);
  const [activeTab, setActiveTab] = useState("agent");
  const { user } = useCurrentUser();
  const publicNavLinks = [
    { href: "/features", label: "Fonctionnalités", icon: Sparkles },
    { href: "/pricing", label: "Tarifs", icon: CreditCard },
    { href: "/faq", label: "FAQ", icon: HelpCircle },
    { href: "/contact", label: "Contact", icon: MessageSquare },
  ];
  // const { toast } = useToast();

  // Fetch plans and current subscription
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        // Fetch available plans
        const plansData = await payments.getPlans();
        setPlans(Array.isArray(plansData) ? plansData : []);

        // Fetch current subscription (optional - may fail if not authenticated)
        try {
          const subData = await payments.getMySubscription();
          setSubscription(subData);
        } catch {
          // User not authenticated or no subscription - it's ok
        }
      } catch (error) {
        console.error("Erreur chargement plans:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  /**
   * Handle subscription to a plan
   */
  async function handleSubscribe(planId) {
    setSubscribing(planId);
    try {
      const data = await payments.createCheckoutSession(planId);
      
      // Redirect to Stripe Checkout
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error("No checkout URL returned");
      }
    } catch (error) {
      console.error("Erreur création session:", error);
      alert("Impossible de créer la session de paiement. Veuillez réessayer.");
      setSubscribing(null);
    }
  }

  /**
   * Check if user is currently subscribed to a plan
   */
  const isSubscribedTo = (planId) => {
    return subscription?.plan?.id === planId;
  };

  /**
   * Filter plans by target audience (agent or organisation)
   */
  const getFilteredPlans = (type) => {
    return plans
      .filter((plan) => {
        const name = plan.name?.toLowerCase() || "";
        const description = plan.description?.toLowerCase() || "";
        
        if (type === "agent") {
          return (
            name.includes("agent") ||
            description.includes("agent") ||
            name.includes("starter") ||
            name.includes("basic")
          );
        } else {
          return (
            name.includes("organisation") ||
            name.includes("organization") ||
            description.includes("organisation") ||
            description.includes("organization") ||
            name.includes("enterprise") ||
            name.includes("business") ||
            name.includes("team")
          );
        }
      })
      .slice(0, 3); // Limit to 3 plans
  };

  /**
   * Loading State
   */
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
          <p className="mt-4 text-muted-foreground">Chargement des plans...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <main className="container mx-auto flex-1 px-4 py-16">
      {/* Header */}
      <div className="text-center mb-12 space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
          Nos Plans Tarifaires
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Choisissez le plan qui correspond le mieux à vos besoins et
          développez votre activité de sponsoring sportif.
        </p>
      </div>

      {/* Current Subscription Banner */}
      {subscription && (
        <div className="mb-8 p-4 bg-blue-50 border border-blue-200 rounded-lg max-w-7xl mx-auto dark:bg-blue-950 dark:border-blue-800">
          <div className="flex items-center gap-2">
            <Badge variant="default">Actif</Badge>
            <span className="text-sm">
              Vous êtes actuellement abonné au plan{" "}
              <strong>{subscription.plan?.name}</strong>
            </span>
          </div>
        </div>
      )}

      {/* Tabs for Agent vs Organisation */}
      <Tabs
        defaultValue="agent"
        value={activeTab}
        onValueChange={setActiveTab}
        className="max-w-7xl mx-auto"
      >
        <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-12">
          <TabsTrigger value="agent" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Agents
          </TabsTrigger>
          <TabsTrigger value="organisation" className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            Organisations
          </TabsTrigger>
        </TabsList>

        {/* Agent Plans */}
        <TabsContent value="agent" className="mt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {getFilteredPlans("agent").map((plan) => {
              const isActive = isSubscribedTo(plan.id);
              const isPopular = plan.is_popular || plan.name?.toLowerCase().includes("plus");

              return (
                <Card
                  key={plan.id}
                  className={`relative flex flex-col ${
                    isPopular
                      ? "border-orange-500 shadow-lg scale-105"
                      : "border-border"
                  }`}
                >
                  {/* Popular Badge */}
                  {isPopular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <Badge className="bg-orange-500 text-white px-4 py-1">
                        Populaire
                      </Badge>
                    </div>
                  )}

                  <CardHeader className="text-center pb-8 pt-8">
                    <div className="mx-auto mb-4 p-3 rounded-full bg-blue-100 w-fit dark:bg-blue-900">
                      {getPlanIcon(plan.name)}
                    </div>
                    <CardTitle className="text-2xl">{plan.name}</CardTitle>
                    <CardDescription className="text-sm mt-2">
                      {plan.description || "Plan de base pour démarrer"}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="flex-1 space-y-6">
                    {/* Price */}
                    <div className="text-center">
                      <div className="flex items-baseline justify-center gap-2">
                        <span className="text-5xl font-bold">
                          {formatPrice(plan.price_monthly || plan.price || 0)}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        par mois
                      </p>
                    </div>

                    <Separator />

                    {/* Features */}
                    <div className="space-y-3">
                      {plan.features && plan.features.length > 0 ? (
                        plan.features.map((feature, idx) => (
                          <div key={idx} className="flex items-start gap-2">
                            <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                            <span className="text-sm">{feature}</span>
                          </div>
                        ))
                      ) : (
                        <>
                          <div className="flex items-start gap-2">
                            <Check className="h-5 w-5 text-green-600 flex-shrink-0" />
                            <span className="text-sm">
                              Accès aux profils d&apos;athlètes
                            </span>
                          </div>
                          <div className="flex items-start gap-2">
                            <Check className="h-5 w-5 text-green-600 flex-shrink-0" />
                            <span className="text-sm">Statistiques avancées</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <Check className="h-5 w-5 text-green-600 flex-shrink-0" />
                            <span className="text-sm">Support prioritaire</span>
                          </div>
                        </>
                      )}
                    </div>

                    {/* Limits/Entitlements */}
                    {plan.max_follows && (
                      <div className="pt-4 border-t">
                        <p className="text-xs text-muted-foreground">
                          Jusqu&apos;à <strong>{plan.max_follows}</strong> athlètes
                          suivis
                        </p>
                      </div>
                    )}
                  </CardContent>

                  <CardFooter className="pt-6">
                    {isActive ? (
                      <Button disabled variant="secondary" className="w-full">
                        Plan Actuel
                      </Button>
                    ) : (
                      <Button
                        onClick={() => handleSubscribe(plan.id)}
                        disabled={subscribing !== null}
                        className="w-full"
                        variant={isPopular ? "default" : "outline"}
                      >
                        {subscribing === plan.id ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Redirection...
                          </>
                        ) : (
                          "S&apos;abonner"
                        )}
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              );
            })}

            {/* Empty State for Agents */}
            {getFilteredPlans("agent").length === 0 && (
              <div className="col-span-full text-center py-16">
                <p className="text-muted-foreground">
                  Aucun plan disponible pour les agents pour le moment.
                </p>
              </div>
            )}
          </div>
        </TabsContent>

        {/* Organisation Plans */}
        <TabsContent value="organisation" className="mt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {getFilteredPlans("organisation").map((plan) => {
              const isActive = isSubscribedTo(plan.id);
              const isPopular = plan.is_popular || plan.name?.toLowerCase().includes("enterprise");

              return (
                <Card
                  key={plan.id}
                  className={`relative flex flex-col ${
                    isPopular
                      ? "border-orange-500 shadow-lg scale-105"
                      : "border-border"
                  }`}
                >
                  {/* Popular Badge */}
                  {isPopular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <Badge className="bg-orange-500 text-white px-4 py-1">
                        Populaire
                      </Badge>
                    </div>
                  )}

                  <CardHeader className="text-center pb-8 pt-8">
                    <div className="mx-auto mb-4 p-3 rounded-full bg-blue-100 w-fit dark:bg-blue-900">
                      {getPlanIcon(plan.name)}
                    </div>
                    <CardTitle className="text-2xl">{plan.name}</CardTitle>
                    <CardDescription className="text-sm mt-2">
                      {plan.description || "Plan professionnel pour organisations"}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="flex-1 space-y-6">
                    {/* Price */}
                    <div className="text-center">
                      <div className="flex items-baseline justify-center gap-2">
                        <span className="text-5xl font-bold">
                          {formatPrice(plan.price_monthly || plan.price || 0)}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        par mois
                      </p>
                    </div>

                    <Separator />

                    {/* Features */}
                    <div className="space-y-3">
                      {plan.features && plan.features.length > 0 ? (
                        plan.features.map((feature, idx) => (
                          <div key={idx} className="flex items-start gap-2">
                            <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                            <span className="text-sm">{feature}</span>
                          </div>
                        ))
                      ) : (
                        <>
                          <div className="flex items-start gap-2">
                            <Check className="h-5 w-5 text-green-600 flex-shrink-0" />
                            <span className="text-sm">
                              Accès illimité aux athlètes
                            </span>
                          </div>
                          <div className="flex items-start gap-2">
                            <Check className="h-5 w-5 text-green-600 flex-shrink-0" />
                            <span className="text-sm">Analytics avancées</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <Check className="h-5 w-5 text-green-600 flex-shrink-0" />
                            <span className="text-sm">Support dédié 24/7</span>
                          </div>
                        </>
                      )}
                    </div>

                    {/* Limits/Entitlements */}
                    {plan.max_follows && (
                      <div className="pt-4 border-t">
                        <p className="text-xs text-muted-foreground">
                          Jusqu&apos;à <strong>{plan.max_follows}</strong> athlètes
                          suivis
                        </p>
                      </div>
                    )}
                  </CardContent>

                  <CardFooter className="pt-6">
                    {isActive ? (
                      <Button disabled variant="secondary" className="w-full">
                        Plan Actuel
                      </Button>
                    ) : (
                      <Button
                        onClick={() => handleSubscribe(plan.id)}
                        disabled={subscribing !== null}
                        className="w-full"
                        variant={isPopular ? "default" : "outline"}
                      >
                        {subscribing === plan.id ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Redirection...
                          </>
                        ) : (
                          "S&apos;abonner"
                        )}
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              );
            })}

            {/* Empty State for Organisations */}
            {getFilteredPlans("organisation").length === 0 && (
              <div className="col-span-full text-center py-16">
                <p className="text-muted-foreground">
                  Aucun plan disponible pour les organisations pour le moment.
                </p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Footer CTA */}
      <div className="mt-16 text-center space-y-4">
        <p className="text-muted-foreground">
          Vous avez des questions ? Contactez notre équipe
        </p>
        <div className="flex gap-4 justify-center">
          <Button variant="outline" asChild>
            <Link href="/contact">Nous contacter</Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="/faq">FAQ</Link>
          </Button>
        </div>
      </div>
      </main>
      <Footer />
    </div>
  );
}
