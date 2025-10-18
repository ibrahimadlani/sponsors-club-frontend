import Link from "next/link";
import AppHeader from "@/components/app-header";
import Footer from "@/components/footer";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  HelpCircle,
  Users,
  Handshake,
  Trophy,
  Sparkles,
  MessageCircle,
  ArrowRight,
} from "lucide-react";

export const metadata = {
  title: "FAQ | SponsorsClub",
  description:
    "Toutes les réponses aux questions fréquentes pour tirer le meilleur parti de SponsorsClub.",
};

const sections = [
  {
    id: "general",
    icon: HelpCircle,
    title: "Questions générales",
    description:
      "Fonctionnement global de la plateforme, création de compte et accès aux fonctionnalités.",
    items: [
      {
        question: "Comment fonctionne SponsorsClub ?",
        answer:
          "SponsorsClub connecte les athlètes, agents et marques via une plateforme unique. Chaque profil dispose d’outils pour présenter sa valeur, gérer ses opportunités et suivre la performance des partenariats.",
      },
      {
        question: "Quels rôles peuvent créer un compte ?",
        answer:
          "La plateforme est ouverte aux athlètes, agents, collaborateurs et marques. Lors de l’inscription, choisissez le rôle correspondant à votre activité pour débloquer les fonctionnalités adaptées.",
      },
      {
        question: "Proposez-vous un support lors de la prise en main ?",
        answer:
          "Oui, un parcours d’onboarding guidé vous accompagne à la création du compte. Notre équipe Customer Success est également disponible pour des sessions d’introduction personnalisées.",
      },
    ],
  },
  {
    id: "athletes",
    icon: Trophy,
    title: "Athlètes & agents",
    description:
      "Visibilité, gestion d’opportunités et collaboration avec les marques pour les talents et leurs représentants.",
    items: [
      {
        question: "Comment mettre en avant mon profil d’athlète ?",
        answer:
          "Complétez votre fiche avec vos résultats clés, audiences sociales et médias. L’algorithme favorise les profils complets et cohérents avec les recherches actives des marques.",
      },
      {
        question: "Puis-je gérer plusieurs athlètes en tant qu’agent ?",
        answer:
          "Oui, le tableau de bord agent consolide vos athlètes, vos propositions et vos suivis de contrats. Les permissions permettent également d’ajouter des collaborateurs pour vous épauler.",
      },
      {
        question: "Comment sont gérées les offres reçues ?",
        answer:
          "Chaque offre déclenche une notification. Depuis votre tableau de bord, vous accédez à la messagerie sécurisée, au suivi des étapes et à l’espace de signature électronique.",
      },
    ],
  },
  {
    id: "brands",
    icon: Handshake,
    title: "Sponsors & marques",
    description:
      "Sélection des talents, contractualisation et mesure d’impact pour les organisations et marques.",
    items: [
      {
        question: "Comment trouver les profils pertinents ?",
        answer:
          "Utilisez les filtres avancés (sport, audience, zone géographique, valeurs de marque) ou laissez l’algorithme proposer une short-list selon vos objectifs de campagne.",
      },
      {
        question: "La plateforme gère-t-elle la partie contractuelle ?",
        answer:
          "Oui. Vous disposez de modèles de contrats, de circuits de validation et d’une signature électronique intégrée. Toutes les versions et clauses sont historisées.",
      },
      {
        question: "Puis-je suivre le retour sur investissement ?",
        answer:
          "Les tableaux de bord mesurent reach, engagement et données business lorsque vous connectez vos outils. Vous pouvez exporter ces résultats pour vos reportings internes.",
      },
    ],
  },
  {
    id: "support",
    icon: Users,
    title: "Support & assistance",
    description:
      "Accompagnement, sécurité et ressources disponibles pour vous aider tout au long de votre parcours.",
    items: [
      {
        question: "Comment contacter le support SponsorsClub ?",
        answer:
          "Rendez-vous sur le centre d’aide ou envoyez un e-mail à contact@sponsorsclub.com. Nos équipes répondent généralement sous 24 heures ouvrées.",
      },
      {
        question: "La plateforme est-elle disponible en plusieurs langues ?",
        answer:
          "La version actuelle est disponible en français. L’anglais sera déployé prochainement pour l’ensemble de l’interface et des contenus d’aide.",
      },
      {
        question: "Mes données sont-elles sécurisées ?",
        answer:
          "Oui. Nous utilisons un chiffrement des données sensibles, un hébergement certifié et une surveillance continue. Vous pouvez consulter la page Confidentialité pour plus de détails.",
      },
    ],
  },
];

export default function FAQPage() {
  return (
    <SidebarProvider>
      <div className="flex min-h-svh flex-col bg-background text-foreground">
        <AppHeader />
        <main className="flex-1">
          <div className="mx-auto max-w-7xl px-6 py-12 md:py-20">
            {/* Hero Header */}
            <header className="space-y-6 text-center">
              <Badge variant="outline" className="mx-auto w-fit">
                <HelpCircle className="mr-1.5 h-3.5 w-3.5" />
                Questions fréquentes
              </Badge>
              <h1 className="text-4xl font-bold tracking-tight text-foreground md:text-5xl lg:text-6xl">
                Comment pouvons-nous vous aider ?
              </h1>
              <p className="mx-auto max-w-3xl text-lg text-muted-foreground md:text-xl">
                Retrouvez les réponses aux interrogations les plus courantes sur le fonctionnement 
                de SponsorsClub, de la prise en main à la mesure de vos partenariats.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <Button asChild>
                  <Link href="/contact" className="flex items-center gap-2">
                    <MessageCircle className="h-4 w-4" />
                    Contacter le support
                  </Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/help" className="flex items-center gap-2">
                    Centre d&apos;aide
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </header>

            <Separator className="my-12" />

            {/* FAQ Sections */}
            <div className="space-y-12 md:space-y-16">
            {sections.map(({ id, icon: Icon, title, description, items }, index) => (
              <article key={id} id={id} className="space-y-6">
                <Card className="overflow-hidden border-border/80 bg-card/90">
                  <CardHeader className="flex flex-col gap-4 border-b border-border/60 bg-muted/40 px-6 py-5 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full border border-border">
                        <Icon className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div>
                        <CardTitle className="text-xl md:text-2xl">{title}</CardTitle>
                        <CardDescription className="text-sm text-muted-foreground">
                          {description}
                        </CardDescription>
                      </div>
                    </div>
                    <Link
                      href={`#${id}`}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground md:self-end"
                    >
                      Section #{id}
                    </Link>
                  </CardHeader>
                  <CardContent className="px-6 py-5">
                    <Accordion type="single" collapsible className="space-y-3">
                      {items.map((item, itemIndex) => (
                        <AccordionItem
                          key={item.question}
                          value={`${id}-${itemIndex}`}
                          className="overflow-hidden rounded-xl border border-border/70 bg-card"
                        >
                          <AccordionTrigger className="px-4 py-3 text-left text-sm font-semibold text-foreground hover:no-underline">
                            {item.question}
                          </AccordionTrigger>
                          <AccordionContent className="px-4 pb-4 text-sm leading-relaxed text-muted-foreground">
                            {item.answer}
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </CardContent>
                </Card>
                {index < sections.length - 1 ? <Separator className="my-10" /> : null}
              </article>
            ))}

            <div className="rounded-2xl border border-border bg-muted/50 p-6 md:p-8">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold md:text-xl">
                    Besoin d&apos;aller plus loin ?
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Consultez nos guides détaillés ou planifiez une session d&apos;accompagnement pour vos équipes.
                  </p>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Button asChild variant="secondary">
                    <Link href="/guides">Voir les guides</Link>
                  </Button>
                  <Button asChild variant="outline">
                    <Link href="/demo">Demander un atelier</Link>
                  </Button>
                </div>
              </div>
            </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </SidebarProvider>
  );
}
