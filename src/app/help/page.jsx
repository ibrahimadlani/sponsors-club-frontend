import Link from "next/link";
import AppHeader from "@/components/app-header";
import Footer from "@/components/footer";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  LifeBuoy,
  MessageSquare,
  FileText,
  Users,
  BookOpen,
  Headset,
  Sparkles,
  ArrowRight,
  ArrowUpRight,
} from "lucide-react";

export const metadata = {
  title: "Centre d'aide | SponsorsClub",
  description: "Guides, ressources et support pour tirer le meilleur parti de SponsorsClub.",
};

const quickLinks = [
  {
    title: "Documentation",
    description: "Accéder aux guides de démarrage rapide par rôle.",
    href: "/guides",
    icon: BookOpen,
  },
  {
    title: "FAQ",
    description: "Consulter les réponses aux questions fréquentes.",
    href: "/faq",
    icon: FileText,
  },
  {
    title: "Support",
    description: "Contacter notre équipe Customer Success.",
    href: "/contact",
    icon: Headset,
  },
];

const collections = [
  {
    title: "Prise en main",
    description: "Créer un compte, configurer votre profil et comprendre les rôles disponibles.",
    articles: [
      { label: "Créer un profil athlète ou agent", href: "/guides/onboarding-athlete" },
      { label: "Rejoindre une organisation en tant que collaborateur", href: "/guides/onboarding-collaborateur" },
      { label: "Paramétrer votre organisation", href: "/guides/onboarding-organisation" },
    ],
  },
  {
    title: "Collaborations",
    description: "Gérer les campagnes de sponsoring et fluidifier les échanges.",
    articles: [
      { label: "Trouver les talents adaptés", href: "/guides/matching" },
      { label: "Automatiser la contractualisation", href: "/guides/contracts" },
      { label: "Suivre la performance des activations", href: "/guides/analytics" },
    ],
  },
  {
    title: "Support produit",
    description: "Questions techniques, sécurité et intégrations avancées.",
    articles: [
      { label: "Sécurité et conformité des données", href: "/privacy" },
      { label: "Utiliser les API SponsorsClub", href: "/api-docs" },
      { label: "Assistance et SLA", href: "/support/sla" },
    ],
  },
];

const supportChannels = [
  {
    title: "Conversation en direct",
    description: "Discutez avec un membre de l'équipe en journée (9h-18h CET).",
    action: "Ouvrir le chat",
    href: "/contact?via=chat",
  },
  {
    title: "Assistance e-mail",
    description: "Envoyez-nous vos questions détaillées et obtenez une réponse sous 24h ouvrées.",
    action: "Envoyer un e-mail",
    href: "mailto:contact@sponsorsclub.com",
  },
  {
    title: "Session personnalisée",
    description: "Planifiez un atelier pour vos équipes ou un audit de vos campagnes.",
    action: "Planifier une session",
    href: "/demo",
  },
];

export default function HelpCenterPage() {
  return (
    <SidebarProvider>
      <div className="flex min-h-svh flex-col bg-background text-foreground">
        <AppHeader />
        <main className="flex-1">
          <section className="border-b border-border bg-muted/40">
            <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
              <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                <div className="space-y-4">
                  <Badge variant="outline" className="w-fit border-border text-foreground">
                    Centre d&apos;aide SponsorsClub
                  </Badge>
                  <div className="space-y-3">
                    <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">
                      Besoin d&apos;un coup de main ?
                    </h1>
                    <p className="max-w-2xl text-base text-muted-foreground md:text-lg">
                      Guides de référence, FAQ et support accompagné pour vous aider à configurer, lancer et mesurer
                      vos partenariats sportifs sur SponsorsClub.
                    </p>
                  </div>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row md:items-center">
                  <Button asChild>
                    <Link href="/faq" className="flex items-center gap-2">
                      Consulter la FAQ
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline">
                    <Link href="/guides" className="flex items-center gap-2">
                      Parcourir les guides
                      <ArrowUpRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </section>

          <section className="mx-auto max-w-7xl px-6 py-16">
            <div className="grid gap-6 md:grid-cols-3">
              {quickLinks.map(({ title, description, href, icon: Icon }) => (
                <Card key={href} className="overflow-hidden border-border/80 bg-card/90">
                  <CardHeader className="space-y-3 border-b border-border/60 bg-muted/40 px-6 py-5">
                    <div className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border">
                      <Icon className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <CardTitle className="text-lg">{title}</CardTitle>
                    <CardDescription>{description}</CardDescription>
                  </CardHeader>
                  <CardContent className="px-6 py-5">
                    <Button asChild variant="ghost" className="px-0 text-sm font-medium">
                      <Link href={href} className="inline-flex items-center gap-2">
                        Accéder
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          <section className="border-y border-border bg-muted/40">
            <div className="mx-auto max-w-7xl px-6 py-16 space-y-12 md:space-y-14">
              <div className="space-y-3">
                <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
                  Collections de ressources
                </h2>
                <p className="text-sm text-muted-foreground md:text-base">
                  Des tutoriels organisés par thématique pour accélérer votre prise en main.
                </p>
              </div>
              <div className="grid gap-6 md:grid-cols-3">
                {collections.map(({ title, description, articles }) => (
                  <Card key={title} className="overflow-hidden border-border/80 bg-card/90">
                    <CardHeader className="space-y-3 border-b border-border/60 bg-muted/40 px-6 py-5">
                      <CardTitle className="text-lg">{title}</CardTitle>
                      <CardDescription>{description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2 px-6 py-5 text-sm text-muted-foreground">
                      {articles.map((article) => (
                        <div key={article.href} className="flex items-center justify-between">
                          <Link href={article.href} className="hover:text-foreground">
                            {article.label}
                          </Link>
                          <ArrowRight className="h-4 w-4 text-muted-foreground" />
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          <section className="mx-auto max-w-7xl px-6 py-16">
            <div className="space-y-3">
              <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
                Vous n&apos;avez pas trouvé votre réponse ?
              </h2>
              <p className="text-sm text-muted-foreground md:text-base">
                Nos spécialistes vous accompagnent sur l&apos;ensemble de vos problématiques : usage produit,
                intégrations, conformité et déploiement.
              </p>
            </div>
            <div className="mt-6 grid gap-6 md:grid-cols-3">
              {supportChannels.map(({ title, description, action, href }) => (
                <Card key={title} className="overflow-hidden border-border/80 bg-card/90">
                  <CardHeader className="space-y-2 px-6 py-5">
                    <CardTitle className="text-lg">{title}</CardTitle>
                    <CardDescription>{description}</CardDescription>
                  </CardHeader>
                  <CardContent className="px-6 pb-6">
                    <Button asChild variant="secondary" className="w-full">
                      <Link href={href}>{action}</Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          <section className="border-t border-border bg-muted/50">
            <div className="mx-auto max-w-7xl px-6 py-16">
              <Card className="overflow-hidden border-border/80 bg-card/90">
                <CardHeader className="space-y-3 border-b border-border/60 bg-muted/40 px-6 py-5">
                  <CardTitle className="text-lg">Communautés SponsorsClub</CardTitle>
                  <CardDescription>
                    Partagez vos retours d&apos;expérience, découvrez des cas pratiques et échangez avec d&apos;autres
                    utilisateurs de la plateforme.
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-3 px-6 py-5 sm:flex-row">
                  <Button asChild>
                    <Link href="/community">
                      Rejoindre la communauté
                      <Users className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline">
                    <Link href="/events">
                      Voir les prochains événements
                      <Sparkles className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </SidebarProvider>
  );
}
