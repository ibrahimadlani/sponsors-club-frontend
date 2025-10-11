"use client";

import { useUserRole } from "@/hooks/useUserRole";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, User, Briefcase } from "lucide-react";

/**
 * RoleDisplay Component
 * 
 * Exemple de composant qui utilise le hook useUserRole() pour afficher
 * du contenu conditionnel basé sur le rôle de l'utilisateur.
 * 
 * Peut être utilisé dans n'importe quelle page pour personnaliser l'UI
 * selon le rôle (AGENT, COLLABORATOR, ADMIN).
 */
export function RoleDisplay() {
  const { role, isLoading } = useUserRole();

  if (isLoading) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Chargement...</CardTitle>
        </CardHeader>
      </Card>
    );
  }

  // Icône selon le rôle
  const RoleIcon = role === "AGENT" ? Briefcase : User;

  // Couleur du badge selon le rôle
  const badgeVariant = role === "AGENT" ? "default" : "secondary";

  // Message personnalisé selon le rôle
  const roleMessage = role === "AGENT"
    ? "Vous avez accès à la gestion de vos athlètes et contrats."
    : role === "COLLABORATOR"
    ? "Vous pouvez explorer les athlètes et organisations."
    : "Veuillez vous connecter pour accéder aux fonctionnalités.";

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <RoleIcon className="h-5 w-5" />
            Votre rôle
          </CardTitle>
          <Badge variant={badgeVariant}>
            {role === "AGENT" ? "Agent" : 
             role === "COLLABORATOR" ? "Collaborateur" : 
             "Non connecté"}
          </Badge>
        </div>
        <CardDescription>{roleMessage}</CardDescription>
      </CardHeader>
      <CardContent>
        {/* Contenu spécifique aux agents */}
        {role === "AGENT" && (
          <div className="space-y-2">
            <h4 className="font-semibold text-sm">Fonctionnalités Agent :</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Gérer mes athlètes</li>
              <li>• Créer et suivre des contrats</li>
              <li>• Analytics avancées</li>
            </ul>
          </div>
        )}

        {/* Contenu spécifique aux collaborateurs */}
        {role === "COLLABORATOR" && (
          <div className="space-y-2">
            <h4 className="font-semibold text-sm">Fonctionnalités Collaborateur :</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Explorer tous les athlètes</li>
              <li>• Suivre des athlètes</li>
              <li>• Découvrir des organisations</li>
            </ul>
          </div>
        )}

        {/* Message pour non connectés */}
        {!role && (
          <div className="text-sm text-muted-foreground">
            <p>Connectez-vous pour accéder à votre espace personnalisé.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

/**
 * ConditionalContent Component
 * 
 * Exemple de wrapper pour afficher du contenu uniquement si l'utilisateur
 * a un rôle spécifique.
 */
export function ConditionalContent({ allowedRoles = [], children, fallback = null }) {
  const { role, isLoading } = useUserRole();

  if (isLoading) {
    return fallback;
  }

  if (!role || !allowedRoles.includes(role)) {
    return fallback;
  }

  return <>{children}</>;
}

// Exemples d'utilisation :
// 
// 1. Afficher du contenu uniquement pour les agents :
// <ConditionalContent allowedRoles={["AGENT"]}>
//   <AgentOnlyFeature />
// </ConditionalContent>
//
// 2. Afficher du contenu pour agents et admins :
// <ConditionalContent allowedRoles={["AGENT", "ADMIN"]}>
//   <AdvancedFeature />
// </ConditionalContent>
//
// 3. Avec un fallback :
// <ConditionalContent 
//   allowedRoles={["ADMIN"]} 
//   fallback={<p>Accès réservé aux administrateurs</p>}
// >
//   <AdminPanel />
// </ConditionalContent>
