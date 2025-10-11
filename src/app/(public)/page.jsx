"use client";

import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  CalendarCheck,
  CheckCircle2,
  Flame,
  Globe2,
  HeartHandshake,
  LineChart,
  Medal,
  MessageCircle,
  Search,
  ShieldCheck,
  Sparkles,
  Users,
  Zap,
  CreditCard,
  HelpCircle,
  MessageSquare,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Logo from "@/components/ui/logo";
import AppHeader from "@/components/app-header";
import Footer from "@/components/footer";
import { useCurrentUser } from "@/hooks/useCurrentUser";

const heroMetrics = [
  { value: "12 400+", label: "Talents activables", icon: Medal },
  { value: "530+", label: "Marques engagées", icon: HeartHandshake },
  { value: "48M€", label: "Valeur de deals pilotés", icon: LineChart },
  { value: "4.8/5", label: "Note moyenne satisfaction", icon: Sparkles },
];

const personas = [
  {
    title: "Athlètes & agents",
    description:
      "Valorisez votre image, centralisez vos preuves de performance et automatisez le suivi de vos partenariats.",
    icon: Flame,
    bullets: ["Portfolios immersifs", "Assistant de négociation", "Analytics audiences"],
    cta: { label: "Créer mon profil", href: "/onboarding/athlete" },
  },
  {
    title: "Sponsors & marques",
    description:
      "Déployez vos campagnes de sponsoring avec un pipeline maîtrisé, de la découverte à la mesure du ROI.",
    icon: BarChart3,
    bullets: ["Matching prédictif", "Contrats digitaux", "Reporting multi-campagne"],
    cta: { label: "Planifier une démo", href: "/contact" },
  },
];

const featureCatalog = [
  {
    value: "discover",
    label: "Découvrir",
    headline: "Matching intelligent propulsé par vos objectifs de marque.",
    subtext:
      "Filtrez par sport, marché, audience et valeurs. SponsorsClub suggère automatiquement les talents les plus pertinents.",
    icon: Search,
    points: [
      "Filtres avancés et recherches sauvegardées",
      "Vérification automatique des audiences sociales",
      "Short-list collaboratives pour votre équipe",
    ],
  },
  {
    value: "activate",
    label: "Activer",
    headline: "Un workflow contractuel ultra-fluide et sécurisé.",
    subtext:
      "Générez vos contrats, gérez les validations juridiques, suivez les clauses critiques et signez en un clic.",
    icon: ShieldCheck,
    points: [
      "Modèles dynamiques & signature électronique",
      "Historique des négociations consolidé",
      "Alertes de conformité en temps réel",
    ],
  },
  {
    value: "measure",
    label: "Mesurer",
    headline: "Visualisez l’impact de chaque activation en temps réel.",
    subtext:
      "Reliez vos comptes sociaux et vos objectifs business pour mesurer le ROI et piloter les prochaines campagnes.",
    icon: LineChart,
    points: [
      "Dashboards multi-campagnes prêts à l’emploi",
      "Exports intelligents pour vos rapports internes",
      "Benchmarks sectoriels actualisés",
    ],
  },
];

const journeySteps = [
  {
    stage: "1. Alignement",
    title: "Définissez votre stratégie de sponsoring",
    items: [
      "Workshop onboarding personnalisé",
      "Configuration des objectifs KPI & budget",
      "Cartographie des sports & audiences cibles",
    ],
  },
  {
    stage: "2. Activation",
    title: "Co-créez des activations sur-mesure",
    items: [
      "Briefs partagés athlètes ↔ marques",
      "Gestion collaborative des tâches & échéances",
      "Centralisation des contenus activations",
    ],
  },
  {
    stage: "3. Impact",
    title: "Mesurez, optimisez, scalez",
    items: [
      "Suivi ROI & analytics automatisés",
      "Insights actionnables pour vos prochaines vagues",
      "Score de partenariat pour chaque talent",
    ],
  },
];

const testimonials = [
  {
    quote:
      "En trois mois, nous avons signé quatre partenariats parfaitement alignés avec notre nouvelle plateforme de running. La transparence des données change tout.",
    name: "Sarah Martinez",
    position: "Directrice Marketing – Nike France",
  },
  {
    quote:
      "SponsorsClub a transformé ma gestion d’athlètes : un cockpit unique pour piloter offres, contrats et analytics. Mes talents sont mieux valorisés que jamais.",
    name: "Alexandre Dupont",
    position: "Agent d’athlètes olympiques",
  },
  {
    quote:
      "Le moteur de matching et les dashboards ROI nous offrent une vision instantanée de l’impact de chaque activation. Impossible de revenir en arrière.",
    name: "Lila Ben Amar",
    position: "Head of Partnerships – Decathlon",
  },
];

const integrations = [
  {
    icon: Globe2,
    title: "Connecteurs social media",
    description: "Instagram, TikTok, YouTube, Twitch… importez vos insights certifiés en un clic.",
  },
  {
    icon: Users,
    title: "Synchronisation CRM",
    description: "Reliez HubSpot, Salesforce ou vos outils internes pour garder un pipeline à jour.",
  },
  {
    icon: CalendarCheck,
    title: "Calendrier collaboratif",
    description: "Synchronisez briefs, tournages et activations avec Google Calendar ou Outlook.",
  },
  {
    icon: Zap,
    title: "Automations no-code",
    description: "Déclenchez des scénarios Zapier/Make : envois d’avis, rappels, dashboards personnalisés.",
  },
];

export default function HomePage() {
  const { user } = useCurrentUser();

  return (
    <div className="flex min-h-svh flex-col bg-background text-foreground">
      <AppHeader />

      <main className="flex-1">
        <section className="relative overflow-hidden border-b border-border bg-gradient-to-br from-muted/40 via-background to-background">
          <div className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-muted/60 blur-[130px]" />
          <div className="pointer-events-none absolute right-[-6rem] top-1/3 h-96 w-96 rounded-full bg-muted/40 blur-[140px]" />
          <div className="pointer-events-none absolute bottom-[-8rem] left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-muted/50 blur-[160px]" />

          <div className="mx-auto flex max-w-6xl flex-col gap-10 px-6 py-16 md:flex-row md:items-center md:gap-16 md:py-24">
            <div className="space-y-6 md:w-7/12">
              <Badge variant="outline" className="w-fit gap-2 border-border bg-background/70 text-foreground backdrop-blur">
                <Sparkles className="h-4 w-4" />
                SponsorsClub 2025
              </Badge>
              <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
                La plateforme qui aligne{" "}
                <span className="bg-gradient-to-r from-foreground via-foreground/70 to-foreground/40 bg-clip-text text-transparent">
                  talents sportifs
                </span>{" "}
                et{" "}
                <span className="bg-gradient-to-r from-foreground/70 to-foreground bg-clip-text text-transparent">
                  marques visionnaires
                </span>
                .
              </h1>
              <p className="text-base text-muted-foreground sm:text-lg">
                SponsorsClub fluidifie chaque étape de vos partenariats, de la découverte des meilleurs talents au suivi
                du ROI en temps réel. Une expérience design, collaborative et sécurisée.
              </p>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <Button asChild size="lg">
                  <Link href={user ? "/explore" : "/register"}>
                    {user ? "Explorer la plateforme" : "Créer un compte"}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link href="/demo">
                    Demander une démo
                    <MessageCircle className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>

            <Card className="md:w-5/12 border-border bg-card/80 backdrop-blur">
              <CardHeader className="space-y-3">
                <CardTitle className="text-lg">Un cockpit partagé pour vos équipes</CardTitle>
                <CardDescription>
                  Centralisez les talents, les contrats, les activations et les analytics au même endroit. SponsorsClub
                  devient votre hub sponsoring.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 sm:grid-cols-2">
                {heroMetrics.map(({ value, label, icon: Icon }) => (
                  <div key={label} className="rounded-lg border border-border/60 bg-muted/40 p-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Icon className="h-4 w-4" />
                      <span>{label}</span>
                    </div>
                    <p className="mt-2 text-2xl font-semibold text-foreground">{value}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 py-12 md:py-16">
          <div className="grid gap-6 md:grid-cols-2">
            {personas.map(({ title, description, icon: Icon, bullets, cta }) => (
              <Card key={title} className="border-border/70 bg-card/80 backdrop-blur transition-shadow hover:shadow-lg">
                <CardHeader className="space-y-3">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-muted text-foreground">
                    <Icon className="h-5 w-5" />
                  </div>
                  <CardTitle>{title}</CardTitle>
                  <CardDescription>{description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-5">
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    {bullets.map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <CheckCircle2 className="mt-1 h-4 w-4 text-primary" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                  <Button asChild variant="outline">
                    <Link href={cta.href}>{cta.label}</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="border-y border-border bg-muted/40 py-12 md:py-16">
          <div className="mx-auto max-w-6xl px-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
                  Une suite produit pensée pour chaque étape
                </h2>
                <p className="text-sm text-muted-foreground md:text-base">
                  Passez de la découverte à la mesure du ROI sans changer d’outil, avec une expérience design et réactive.
                </p>
              </div>
            </div>
            <Tabs defaultValue="discover" className="mt-10 space-y-8">
              <TabsList className="grid w-full gap-2 rounded-full bg-background/80 p-1 text-sm sm:grid-cols-3">
                {featureCatalog.map((feature) => (
                  <TabsTrigger
                    key={feature.value}
                    className="rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                    value={feature.value}
                  >
                    {feature.label}
                  </TabsTrigger>
                ))}
              </TabsList>

              {featureCatalog.map((feature) => (
                <TabsContent key={feature.value} value={feature.value}>
                  <Card className="border-border/70 bg-card/90 backdrop-blur">
                    <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                      <div className="space-y-2">
                        <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-muted text-foreground">
                          <feature.icon className="h-5 w-5" />
                        </div>
                        <CardTitle className="text-xl">{feature.headline}</CardTitle>
                        <CardDescription>{feature.subtext}</CardDescription>
                      </div>
                      <Button asChild>
                        <Link href="/features">Explorer la suite</Link>
                      </Button>
                    </CardHeader>
                    <Separator className="my-6" />
                    <CardContent className="grid gap-4 py-6 sm:grid-cols-3">
                      {feature.points.map((point) => (
                        <div key={point} className="rounded-lg border border-border/60 bg-muted/40 p-4 text-sm text-muted-foreground">
                          {point}
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 py-12 md:py-16">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
                Un parcours accompagnant de bout en bout
              </h2>
              <p className="text-sm text-muted-foreground md:text-base">
                Nos experts vous épaulent à chaque étape pour accélérer vos signatures et maximiser l’impact de vos activations.
              </p>
            </div>
            <Button asChild variant="outline">
              <Link href="/help">Accéder au centre de ressources</Link>
            </Button>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {journeySteps.map(({ stage, title, items }) => (
              <Card key={stage} className="border-border/70 bg-card/80 backdrop-blur">
                <CardHeader className="space-y-2">
                  <Badge variant="outline" className="w-fit border-border text-foreground">
                    {stage}
                  </Badge>
                  <CardTitle className="text-lg">{title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 text-sm text-muted-foreground">
                    {items.map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <CheckCircle2 className="mt-1 h-4 w-4 text-primary" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="border-y border-border bg-muted/40 py-12 md:py-16">
          <div className="mx-auto max-w-6xl px-6">
            <div className="space-y-3 text-center">
              <Badge variant="outline" className="mx-auto w-fit border-border text-foreground">
                Ils scalent leurs partenariats avec SponsorsClub
              </Badge>
              <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
                Des collaborations récompensées par les plus grandes marques
              </h2>
            </div>
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {testimonials.map(({ quote, name, position }) => (
                <Card key={name} className="border-border/70 bg-card/90 p-6 backdrop-blur">
                  <CardContent className="space-y-4">
                    <MessageCircle className="h-8 w-8 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">&ldquo;{quote}&rdquo;</p>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{name}</p>
                      <p className="text-xs text-muted-foreground">{position}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 py-12 md:py-16">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
                Vos outils préférés, déjà connectés
              </h2>
              <p className="text-sm text-muted-foreground md:text-base">
                SponsorsClub s’intègre à votre stack marketing pour conserver vos automatisations et vos reportings existants.
              </p>
            </div>
            <Button asChild variant="outline">
              <Link href="/api-docs" className="flex items-center gap-2">
                Voir la documentation API
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {integrations.map(({ icon: Icon, title, description }) => (
              <Card key={title} className="border-border/70 bg-card/80 backdrop-blur">
                <CardHeader className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted text-foreground">
                    <Icon className="h-6 w-6" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{title}</CardTitle>
                    <CardDescription>{description}</CardDescription>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </section>

        <section className="border-t border-border bg-muted/50">
          <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-12 md:flex-row md:items-center md:justify-between md:py-16">
            <div className="space-y-3">
              <h3 className="text-2xl font-semibold tracking-tight md:text-3xl">
                Prêt à redéfinir vos partenariats sportifs ?
              </h3>
              <p className="text-sm text-muted-foreground md:text-base">
                Rejoignez la communauté SponsorsClub et accédez à un écosystème premium d’athlètes, d’agents et de marques.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg">
                <Link href="/pricing" className="flex items-center gap-2">
                  Choisir un plan
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href={user ? "/explore" : "/register"} className="flex items-center gap-2">
                  Rejoindre SponsorsClub
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

