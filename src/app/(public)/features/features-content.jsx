"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  AreaChart,
  ArrowRight,
  Blend,
  Brain,
  Briefcase,
  CalendarCheck,
  CheckCircle2,
  Compass,
  Fingerprint,
  Globe2,
  Layers,
  LineChart,
  MessagesSquare,
  Rocket,
  Shield,
  Sparkles,
  Users,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.94 },
  visible: { opacity: 1, scale: 1 },
};

const athleteFeatures = [
  {
    icon: Rocket,
    title: "Growth coach digital",
    description:
      "Recommandations automatiques pour booster votre image, basées sur vos métriques sociales et sportives.",
  },
  {
    icon: MessagesSquare,
    title: "Messagerie assistée IA",
    description:
      "Engagez la conversation avec les marques en vous appuyant sur des suggestions de réponses contextualisées.",
  },
  {
    icon: LineChart,
    title: "Analytics personnel",
    description:
      "Suivez l'évolution de votre audience et la valeur estimée de vos activations sur chaque réseau social.",
  },
];

const sponsorFeatures = [
  {
    icon: Brain,
    title: "Matching prédictif",
    description:
      "Détectez les profils les plus compatibles avec vos objectifs de marque grâce à notre moteur de recommandation.",
  },
  {
    icon: Briefcase,
    title: "Console contrats",
    description:
      "Centralisez vos contrats, versions et signatures électroniques dans un pipeline visuel et collaboratif.",
  },
  {
    icon: Shield,
    title: "Conformité intégrée",
    description:
      "Vérifiez les clauses clés, pilotez les validations juridiques et recevez des alertes de risque en temps réel.",
  },
];

const workflowSteps = [
  {
    stage: "Découverte",
    title: "Cartographiez l'écosystème en un clin d'œil",
    points: [
      "Filtres avancés (sport, audience, pays, valeurs)",
      "Accès aux statistiques sociales vérifiées",
      "Listes partagées avec votre équipe ou agent",
    ],
  },
  {
    stage: "Activation",
    title: "Construisez des collaborations sur-mesure",
    points: [
      "Assistant de négociation avec historique",
      "Modèles de contrats personnalisables",
      "Gestion des tâches et échéances clés",
    ],
  },
  {
    stage: "Impact",
    title: "Mesurez la performance sans friction",
    points: [
      "Dashboard ROI multi-campagne",
      "Comparaison vs objectifs et benchmarks",
      "Exports automatiques pour vos rapports",
    ],
  },
];

const integrations = [
  {
    icon: Globe2,
    title: "Connecteurs réseaux sociaux",
    description: "Instagram, TikTok, YouTube et plus encore pour remonter vos insights en direct.",
  },
  {
    icon: Layers,
    title: "API partenaires",
    description: "Intégrez vos CRM, outils de ticketing ou plateformes internes via notre API documentation.",
  },
  {
    icon: CalendarCheck,
    title: "Calendrier collaboratif",
    description: "Synchronisez vos activations avec Google Calendar ou Outlook pour garder le cap.",
  },
  {
    icon: Fingerprint,
    title: "Sécurité & conformité",
    description: "Authentification forte, chiffrement et monitoring conformité RGPD par défaut.",
  },
];

export default function FeaturesContent() {
  return (
    <main className="flex-1">
      {/* Hero --------------------------------------------------------------- */}
      <section className="relative overflow-hidden border-b border-border bg-gradient-to-br from-gray-100 via-background to-background dark:from-gray-900">
        <div className="pointer-events-none absolute -left-20 top-10 h-60 w-60 rounded-full bg-gray-200 blur-[120px] dark:bg-gray-700" />
        <div className="pointer-events-none absolute -right-16 bottom-0 h-72 w-72 rounded-full bg-gray-300 blur-[140px] dark:bg-gray-600" />

        <motion.div
          className="mx-auto flex w-full flex-col gap-10 px-8 py-16 md:flex-row md:items-center md:gap-16 md:py-24 lg:px-20 xl:px-32 2xl:px-48"
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <motion.div className="space-y-6 md:w-7/12" variants={fadeUp}>
            <Badge variant="outline" className="w-fit gap-2 bg-background/70 backdrop-blur">
              <Sparkles className="h-4 w-4 text-foreground" />
              Fonctionnalités SponsorsClub
            </Badge>
            <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl lg:text-5xl">
              L&apos;arsenal complet pour des partenariats sportifs performants.
            </h1>
            <p className="text-base text-muted-foreground md:text-lg">
              De la découverte à la mesure du ROI, SponsorsClub aligne athlètes et marques autour d&apos;une suite
              d&apos;outils unifiés, sécurisés et pensés pour accélérer vos signatures.
            </p>
            <motion.div
              className="flex flex-col gap-3 sm:flex-row"
              variants={fadeUp}
              transition={{ delay: 0.1 }}
            >
              <Button size="lg" asChild>
                <Link href="/pricing" className="flex items-center gap-2">
                  Voir les offres
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/demo" className="flex items-center gap-2">
                  Demander une démo
                  <Compass className="h-4 w-4" />
                </Link>
              </Button>
            </motion.div>
          </motion.div>

          <motion.div className="md:w-5/12" variants={scaleIn}>
            <Card className="overflow-hidden border-border/40 bg-card/80 backdrop-blur">
              <CardHeader className="space-y-1">
                <CardTitle className="text-lg">Un cockpit partagé</CardTitle>
                <CardDescription>
                  Pilotez tous vos partenariats depuis un espace centralisé, accessible par vos équipes marketing,
                  juridiques et opérationnelles.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2">
                <FeatureStat value="+12K" label="Talents sportifs qualifiés" />
                <FeatureStat value="94%" label="Campagnes livrées à temps" />
                <FeatureStat value="3x" label="Accélération moyenne des négos" />
                <FeatureStat value="A+" label="Satisfaction clients 2024" />
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </section>

      {/* Segmented tabs ----------------------------------------------------- */}
      <section className="mx-auto w-full px-8 py-12 md:py-16 lg:px-20 xl:px-32 2xl:px-48">
        <Tabs defaultValue="athletes" className="space-y-10">
          <TabsList className="flex w-full justify-start overflow-x-auto rounded-full bg-muted/60 p-1 text-sm md:w-fit">
            <TabsTrigger value="athletes" className="rounded-full px-5 py-2">
              Pour les athlètes
            </TabsTrigger>
            <TabsTrigger value="sponsors" className="rounded-full px-5 py-2">
              Pour les sponsors & marques
            </TabsTrigger>
          </TabsList>

          <TabsContent value="athletes" className="space-y-8">
            <motion.div
              className="grid gap-6 md:grid-cols-3"
              variants={stagger}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
            >
              {athleteFeatures.map(({ icon: Icon, title, description }) => (
                <motion.div key={title} variants={fadeUp}>
                  <Card className="border-border/70 bg-card/70 backdrop-blur transition-transform duration-300 hover:-translate-y-2 hover:shadow-xl">
                    <CardHeader className="space-y-3">
                      <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                        <Icon className="h-5 w-5" />
                      </div>
                      <CardTitle className="text-base">{title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">{description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
            >
              <Card className="border-dashed border-gray-300 bg-gray-100 transition-transform duration-300 hover:-translate-y-2 hover:shadow-xl dark:border-gray-700 dark:bg-gray-900">
                <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <CardTitle>Construisez votre portfolio de sponsorings</CardTitle>
                    <CardDescription>
                      Centralisez vos résultats, générez des dossiers partagés et présentez vos activations clés en un clic.
                    </CardDescription>
                  </div>
                  <Badge variant="secondary" className="w-fit gap-2">
                    <Users className="h-4 w-4" />
                    Mode agent disponible
                  </Badge>
                </CardHeader>
                <CardContent className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <p className="text-sm text-muted-foreground md:w-2/3">
                    Partagez vos KPIs vérifiés, votre calendrier sportif et vos propositions d&apos;activations via une URL
                    sécurisée. Recevez des feedbacks en direct des marques.
                  </p>
                  <Button asChild size="lg" variant="secondary">
                    <Link href="/onboarding/athlete">Créer mon profil pro</Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="sponsors" className="space-y-8">
            <motion.div
              className="grid gap-6 md:grid-cols-3"
              variants={stagger}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
            >
              {sponsorFeatures.map(({ icon: Icon, title, description }) => (
                <motion.div key={title} variants={fadeUp}>
                  <Card className="border-border/70 bg-card/70 backdrop-blur transition-transform duration-300 hover:-translate-y-2 hover:shadow-xl">
                    <CardHeader className="space-y-3">
                      <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                        <Icon className="h-5 w-5" />
                      </div>
                      <CardTitle className="text-base">{title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">{description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
            >
              <Card className="border-dashed border-gray-300 bg-gray-100 transition-transform duration-300 hover:-translate-y-2 hover:shadow-xl dark:border-gray-700 dark:bg-gray-900">
                <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <CardTitle>Activez un pipeline sponsoring pilotable</CardTitle>
                    <CardDescription>
                      Coordonnez recrutement, contractualisation, briefs et reporting dans un espace partagé avec vos équipes.
                    </CardDescription>
                  </div>
                  <Badge variant="secondary" className="w-fit gap-2">
                    <Blend className="h-4 w-4" />
                    Collaboration multi-équipes
                  </Badge>
                </CardHeader>
                <CardContent className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <p className="text-sm text-muted-foreground md:w-2/3">
                    Créez des scénarios personnalisés, attribuez des tâches aux collaborateurs et suivez les validations
                    juridiques en temps réel dans un seul tableau de bord.
                  </p>
                  <Button asChild size="lg" variant="secondary">
                    <Link href="/contact">Parler à un expert</Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
        </Tabs>
      </section>

      {/* Workflow ----------------------------------------------------------- */}
      <section className="border-y border-border bg-muted/40">
        <div className="mx-auto max-w-6xl px-8 py-12 md:py-16 lg:px-20 xl:px-32 2xl:px-48">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
                Un workflow pensé pour toutes les équipes
              </h2>
              <p className="text-sm text-muted-foreground md:text-base">
                SponsorsClub harmonise les étapes clés de vos partenariats. Chaque phase s&apos;appuie sur les données et
                outils nécessaires pour prendre de meilleures décisions.
              </p>
            </div>
            <Button variant="outline" asChild>
              <Link href="/docs/partnership-playbook">Consulter le playbook</Link>
            </Button>
          </div>
          <Separator className="my-8" />
          <motion.div
            className="grid gap-6 md:grid-cols-3"
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            {workflowSteps.map(({ stage, title, points }) => (
              <motion.div key={stage} variants={fadeUp}>
                <Card className="border-border/60 bg-card/80 transition-transform duration-300 hover:-translate-y-2 hover:shadow-xl">
                  <CardHeader>
                    <Badge variant="outline" className="w-fit uppercase tracking-wide">
                      {stage}
                    </Badge>
                    <CardTitle className="text-lg">{title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3 text-sm text-muted-foreground">
                      {points.map((point) => (
                        <li key={point} className="flex items-start gap-2">
                          <CheckCircle2 className="mt-0.5 h-4 w-4 text-green-600" />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Integrations ------------------------------------------------------- */}
      <section className="mx-auto max-w-6xl px-8 py-12 md:py-16 lg:px-20 xl:px-32 2xl:px-48">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
              Des intégrations sécurisées et prêtes à l&apos;emploi
            </h2>
            <p className="text-sm text-muted-foreground md:text-base">
              Connectez vos outils existants et récupérez la donnée qui compte sans multiplier les interfaces.
            </p>
          </div>
          <Button variant="outline" asChild>
            <Link href="/api-docs" className="flex items-center gap-2">
              Voir la documentation API
              <AreaChart className="h-4 w-4" />
            </Link>
          </Button>
        </div>
        <motion.div
          className="mt-10 grid gap-6 md:grid-cols-2"
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {integrations.map(({ icon: Icon, title, description }) => (
            <motion.div key={title} variants={fadeUp}>
              <Card className="border-border/70 bg-card/80 transition-transform duration-300 hover:-translate-y-2 hover:shadow-xl">
                <CardHeader className="flex flex-row items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                    <Icon className="h-6 w-6" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{title}</CardTitle>
                    <CardDescription>{description}</CardDescription>
                  </div>
                </CardHeader>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* CTA ---------------------------------------------------------------- */}
      <section className="border-t border-border bg-gray-900 text-white dark:bg-gray-800">
        <motion.div
          className="mx-auto flex max-w-6xl flex-col gap-6 px-8 py-12 md:flex-row md:items-center md:justify-between md:py-16 lg:px-20 xl:px-32 2xl:px-48"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <div className="space-y-3">
            <h3 className="text-2xl font-semibold tracking-tight md:text-3xl">
              Prêt à accélérer vos signatures de partenariats ?
            </h3>
            <p className="text-sm text-gray-300 md:text-base">
              Choisissez la formule adaptée à votre équipe ou planifiez une session stratégique avec nos experts.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button variant="secondary" size="lg" asChild>
              <Link href="/pricing" className="flex items-center gap-2">
                Choisir un plan
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="text-white border-white hover:bg-white hover:text-gray-900" asChild>
              <Link href="/contact" className="flex items-center gap-2">
                Échanger avec nous
                <MessagesSquare className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </motion.div>
      </section>
    </main>
  );
}

function FeatureStat({ value, label }) {
  return (
    <motion.div
      className="rounded-lg border border-border/60 bg-muted/40 p-4 shadow-sm"
      variants={scaleIn}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.4 }}
    >
      <p className="text-2xl font-semibold text-foreground">{value}</p>
      <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
    </motion.div>
  );
}
