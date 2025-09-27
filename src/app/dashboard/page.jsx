"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Building2, ArrowRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import Logo from "@/components/ui/logo";
import { useCurrentUser } from "@/hooks/useCurrentUser";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

export default function AgentDashboardPage() {
  const { user } = useCurrentUser();
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    
    // Rediriger si pas un agent
    if (user && user.account_type === "COLLABORATOR") {
      router.push("/explore");
    }
  }, [user, router]);

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-background/95 backdrop-blur">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Logo />
          <div className="flex items-center space-x-2">
            <Button variant="ghost" asChild>
              <Link href="/settings">Paramètres</Link>
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        <motion.div
          className="max-w-4xl mx-auto"
          initial="initial"
          animate={isVisible ? "animate" : "initial"}
          variants={{
            animate: {
              transition: {
                staggerChildren: 0.1
              }
            }
          }}
        >
          <motion.div variants={fadeInUp} className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
              <Sparkles className="h-4 w-4" />
              Bienvenue, {user.first_name || user.display_name || "Agent"} !
            </div>
            <h1 className="text-4xl font-bold mb-4">
              Votre tableau de bord agent
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Gérez vos athlètes et développez leur carrière avec nos outils professionnels
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <motion.div variants={fadeInUp}>
              <Card className="h-full hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-lg bg-blue-100">
                      <Users className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle>Gestion d&apos;athlètes</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        Créez et gérez les profils de vos talents
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Athlètes actifs</span>
                      <span className="font-medium">0</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Profils complétés</span>
                      <span className="font-medium">0%</span>
                    </div>
                  </div>
                  <Button className="w-full" asChild>
                    <Link href="/onboarding/athlete">
                      Créer votre premier athlète
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <Card className="h-full hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-lg bg-green-100">
                      <Building2 className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <CardTitle>Opportunités</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        Trouvez des partenariats pour vos athlètes
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Contrats actifs</span>
                      <span className="font-medium">0</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Revenus générés</span>
                      <span className="font-medium">0 €</span>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full" disabled>
                    Rechercher des sponsors
                    <span className="ml-2 text-xs">(Bientôt disponible)</span>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          <motion.div variants={fadeInUp}>
            <Card>
              <CardHeader>
                <CardTitle>Premiers pas</CardTitle>
                <p className="text-muted-foreground">
                  Suivez ces étapes pour commencer à utiliser SponsorsClub efficacement
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-4 p-4 border rounded-lg">
                    <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                      1
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium mb-1">Créez votre premier profil d&apos;athlète</h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        Commencez par ajouter les informations de base de votre athlète principal
                      </p>
                      <Button size="sm" asChild>
                        <Link href="/onboarding/athlete">
                          Commencer
                          <ArrowRight className="ml-2 h-3 w-3" />
                        </Link>
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 border rounded-lg opacity-50">
                    <div className="flex-shrink-0 w-8 h-8 bg-muted text-muted-foreground rounded-full flex items-center justify-center text-sm font-bold">
                      2
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium mb-1">Complétez les profils</h4>
                      <p className="text-sm text-muted-foreground">
                        Ajoutez des photos, statistiques et informations détaillées
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 border rounded-lg opacity-50">
                    <div className="flex-shrink-0 w-8 h-8 bg-muted text-muted-foreground rounded-full flex items-center justify-center text-sm font-bold">
                      3
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium mb-1">Recherchez des partenaires</h4>
                      <p className="text-sm text-muted-foreground">
                        Utilisez notre plateforme pour trouver des opportunités de sponsoring
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
