"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import AppHeader from "@/components/app-header";
import Footer from "@/components/footer";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Mail,
  MessageSquare,
  Headset,
  Calendar,
  MapPin,
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  FileText,
  LifeBuoy,
  Users,
  Sparkles,
} from "lucide-react";

const contactChannels = [
  {
    icon: MessageSquare,
    title: "Support produit",
    description: "Obtenez de l'aide sur l'utilisation quotidienne de SponsorsClub.",
    action: "Ouvrir le centre d'aide",
    href: "/help",
  },
  {
    icon: Headset,
    title: "Assistance prioritaire",
    description: "Clients premium : accédez directement à votre channel dédié.",
    action: "Accéder à l'espace client",
    href: "/support",
  },
  {
    icon: Calendar,
    title: "Démo & accompagnement",
    description: "Planifiez un échange pour cadrer vos besoins et découvrir la plateforme.",
    action: "Planifier un call",
    href: "/demo",
  },
];

export default function ContactPage() {
  return (
    <SidebarProvider>
      <div className="flex min-h-svh flex-col bg-background text-foreground">
        <AppHeader />
        <main className="flex-1">
          <section className="border-b border-border bg-muted/40">
            <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
              <motion.div
                className="space-y-6 text-center"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Badge variant="outline" className="mx-auto w-fit border-border text-foreground">
                  Contact SponsorsClub
                </Badge>
                <div className="space-y-4">
                  <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">
                    Parlons de vos partenariats sportifs.
                  </h1>
                  <p className="text-base text-muted-foreground md:text-lg">
                    Une question, un projet ou une demande de support ? Notre équipe est disponible pour vous répondre rapidement.
                  </p>
                </div>
              </motion.div>
            </div>
          </section>

          <section className="mx-auto max-w-7xl px-6 py-16 md:py-20">
            <div className="grid gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
              <motion.div
                className="space-y-6"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.4 }}
              >
                <Card className="overflow-hidden border-border/80 bg-card/90 shadow-sm">
                  <CardHeader className="space-y-2 border-b border-border/60 bg-muted/40 px-6 py-5">
                    <CardTitle className="text-lg">Envoyez-nous un message</CardTitle>
                    <CardDescription>
                      Complétez le formulaire et un membre de l’équipe vous contactera sous 24 heures ouvrées.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4 px-6 py-5">
                    <div className="grid gap-4 md:grid-cols-2">
                      <Input placeholder="Prénom & nom" />
                      <Input type="email" placeholder="Adresse e-mail" />
                    </div>
                    <Input placeholder="Organisation (optionnel)" />
                    <Textarea placeholder="Votre message" className="min-h-[160px]" />
                    <Button className="w-full md:w-fit">
                      Envoyer le message
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                className="space-y-6"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.4, delay: 0.1 }}
              >
                <Card className="overflow-hidden border-border/80 bg-card/90">
                  <CardHeader className="space-y-3 border-b border-border/60 bg-muted/40 px-6 py-5">
                    <CardTitle className="text-lg">Contact direct</CardTitle>
                    <CardDescription>
                      Vous préférez un canal dédié ? Choisissez la méthode qui vous convient le mieux.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4 px-6 py-5 text-sm text-muted-foreground">
                    <div className="flex items-start gap-3">
                      <Mail className="mt-1 h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium text-foreground">E-mail</p>
                        <Link
                          href="mailto:contact@sponsorsclub.com"
                          className="hover:text-foreground"
                        >
                          contact@sponsorsclub.com
                        </Link>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Headset className="mt-1 h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium text-foreground">Support Premium</p>
                        <p>Disponible pour les plans Pro & Enterprise via votre espace client.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <MapPin className="mt-1 h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium text-foreground">Bureau</p>
                        <p>42 Avenue des Champs-Élysées, 75008 Paris</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="overflow-hidden border-border/80 bg-card/90">
                  <CardHeader className="space-y-2 border-b border-border/60 bg-muted/40 px-6 py-5">
                    <CardTitle className="text-lg">Ressources utiles</CardTitle>
                    <CardDescription>
                      Guides et documents pour approfondir votre connaissance de la plateforme.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3 px-6 py-5 text-sm text-muted-foreground">
                    <Button asChild variant="ghost" className="w-full justify-start px-0">
                      <Link href="/guides">
                        <BookOpen className="mr-2 h-4 w-4" />
                        Guides de prise en main
                      </Link>
                    </Button>
                    <Button asChild variant="ghost" className="w-full justify-start px-0">
                      <Link href="/faq">
                        <FileText className="mr-2 h-4 w-4" />
                        Questions fréquentes
                      </Link>
                    </Button>
                    <Button asChild variant="ghost" className="w-full justify-start px-0">
                      <Link href="/help">
                        <LifeBuoy className="mr-2 h-4 w-4" />
                        Centre d&apos;aide
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </section>

          <section className="border-t border-border bg-muted/50">
            <div className="mx-auto max-w-7xl px-6 py-16">
              <motion.div
                className="flex flex-col gap-6 rounded-2xl border border-border bg-card/80 p-8 md:flex-row md:items-center md:justify-between"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.4 }}
              >
                <div className="space-y-3">
                  <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
                    Rejoignez la communauté SponsorsClub
                  </h2>
                  <p className="text-sm text-muted-foreground md:text-base">
                    Suivez les dernières mises à jour produit et partagez vos retours avec d&apos;autres professionnels du sponsoring.
                  </p>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Button asChild>
                    <Link href="/community" className="flex items-center gap-2">
                      Rejoindre la communauté
                      <Users className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline">
                    <Link href="/events" className="flex items-center gap-2">
                      Voir les événements
                      <Sparkles className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </motion.div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </SidebarProvider>
  );
}
