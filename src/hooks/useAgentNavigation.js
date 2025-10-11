import { useState, useEffect } from "react";
import { useUserRole } from "@/hooks/useUserRole";
import { getNavByRole } from "@/config/navigation";
import { fetchMyAthletes, isSelfRepresented } from "@/lib/api";

/**
 * useAgentNavigation Hook
 * 
 * Hook qui adapte la navigation pour les agents en fonction du nombre d'athlètes.
 * Si l'agent représente un seul athlète, le lien "Mes Athlètes" redirige 
 * directement vers la page de cet athlète.
 * 
 * @returns {Object} { navItems, isLoading, athletes }
 */
export function useAgentNavigation() {
  const { role, isLoading: roleLoading } = useUserRole();
  const [athletes, setAthletes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [navItems, setNavItems] = useState([]);

  useEffect(() => {
    const loadNavigation = async () => {
      // Si le rôle n'est pas encore chargé, attendre
      if (roleLoading) {
        return;
      }

      // Si ce n'est pas un agent, retourner la navigation standard
      if (role !== "AGENT") {
        setNavItems(getNavByRole(role));
        setIsLoading(false);
        return;
      }

      // Si c'est un agent, charger ses athlètes via l'endpoint /me/athletes/
      try {
        setIsLoading(true);
        const athletesList = await fetchMyAthletes();
        // fetchMyAthletes retourne un array ou un objet avec results
        const athletes = Array.isArray(athletesList) ? athletesList : (athletesList?.results || []);
        setAthletes(athletes);
        
        // Vérifier si l'agent est self-represented
        const selfRepresented = isSelfRepresented();
        
        // Générer la navigation avec les athlètes et le statut self-represented
        const nav = getNavByRole(role, { athletes, isSelfRepresented: selfRepresented });
        setNavItems(nav);
      } catch (error) {
        console.error("Erreur lors du chargement des athlètes:", error);
        console.error("Détails de l'erreur:", {
          message: error.message,
          role,
          hasToken: !!localStorage.getItem("accessToken")
        });
        // En cas d'erreur, utiliser la navigation par défaut
        setNavItems(getNavByRole(role));
        // Initialiser avec un tableau vide pour éviter d'autres erreurs
        setAthletes([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadNavigation();
  }, [role, roleLoading]);

  return { navItems, isLoading, athletes };
}
