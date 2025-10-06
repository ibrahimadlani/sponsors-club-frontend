"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Building2, ArrowRight, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";
import Logo from "@/components/ui/logo";
import { useCurrentUser } from "@/hooks/useCurrentUser";

export default function AccessDeniedPage() {
  const router = useRouter();
  const { user } = useCurrentUser();

  useEffect(() => {
    // Si l'utilisateur n'est pas connecté, rediriger vers login
    if (!user) {
      router.push("/login");
      return;
    }

    // Si l'utilisateur est un collaborateur, rediriger vers explore
    if (user.account_type === "COLLABORATOR") {
      router.push("/explore");
      return;
    }
  }, [user, router]);

  if (!user || user.account_type === "COLLABORATOR") {
    return null; // Ne rien afficher pendant la redirection
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <motion.div
        className="w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-8">
          <Logo />
        </div>

        <Card>
          <CardHeader className="text-center pb-4">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-orange-100">
              <AlertTriangle className="h-8 w-8 text-orange-600" />
            </div>
            <CardTitle className="text-xl">Accès restreint</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <p className="text-muted-foreground">
              Cette section est réservée aux collaborateurs d&apos;organisations. 
              En tant qu&apos;agent sportif, vous avez accès à d&apos;autres fonctionnalités.
            </p>

            <div className="space-y-4">
              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-3 mb-2">
                  <Users className="h-5 w-5 text-blue-500" />
                  <span className="font-medium">Gestion d&apos;athlètes</span>
                </div>
                <p className="text-sm text-muted-foreground text-left">
                  Créez et gérez les profils de vos athlètes
                </p>
              </div>

              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-3 mb-2">
                  <Building2 className="h-5 w-5 text-green-500" />
                  <span className="font-medium">Recherche d&apos;opportunités</span>
                </div>
                <p className="text-sm text-muted-foreground text-left">
                  Trouvez des partenariats pour vos athlètes
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <Button asChild className="w-full">
                <Link href="/onboarding/athlete">
                  Créer un profil athlète
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              
              <Button variant="outline" asChild className="w-full">
                <Link href="/athletes">
                  Mes athlètes
                </Link>
              </Button>

              <Button variant="ghost" asChild className="w-full">
                <Link href="/">
                  Retour à l&apos;accueil
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
