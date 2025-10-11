/**
 * Navigation Configuration by Role
 * 
 * Defines navigation items for different user roles:
 * - PUBLIC: Features, Pricing, Blog, FAQ (unauthenticated users)
 * - AGENT: Athletes management, analytics
 * - COLLABORATOR: Browse athletes, follows, organisations
 * - ADMIN/STAFF: Full access including admin features
 */

import {
  BicepsFlexed,
  Building,
  Building2,
  ChartNoAxesCombined,
  CreditCard,
  Handshake,
  Heart,
  LayoutDashboard,
  MessagesSquare,
  ShieldCheck,
  Users,
  FileText,
  User,
  Zap,
  HelpCircle,
  BookOpen,
  DollarSign,
} from "lucide-react";

/**
 * Navigation schema for PUBLIC (unauthenticated) users
 * Public navigation for marketing and information pages
 */
export const PUBLIC_NAV = [
  {
    href: "/features",
    label: "Features",
    icon: Zap,
    description: "Découvrir les fonctionnalités",
  },
  {
    href: "/pricing",
    label: "Pricing",
    icon: DollarSign,
    description: "Voir les tarifs",
  },
  {
    href: "/blog",
    label: "Blog",
    icon: BookOpen,
    description: "Articles et actualités",
  },
  {
    href: "/faq",
    label: "FAQ",
    icon: HelpCircle,
    description: "Questions fréquentes",
  },
];

/**
 * Navigation schema for AGENT role
 * Agents manage their athletes and track performance
 */
export const AGENT_NAV = [
  {
    href: "/dashboard",
    label: "Tableau de bord",
    icon: LayoutDashboard,
    description: "Vue d'ensemble de vos athlètes",
  },
  {
    href: "/athletes",
    label: "Mes Athlètes",
    icon: BicepsFlexed,
    description: "Gérer vos athlètes",
  },
    {
    href: "/collaborations",
    label: "Collabs",
    icon: Handshake,
    description: "Contrats et collaborations",
  },
  {
    href: "/analytics",
    label: "Analytics",
    icon: ChartNoAxesCombined,
    description: "Statistiques et performances",
  },

];

/**
 * Navigation schema for COLLABORATOR role
 * Collaborators browse athletes and manage organisations
 */
export const COLLABORATOR_NAV = [
  {
    href: "/athletes",
    label: "Athlètes",
    icon: BicepsFlexed,
    description: "Découvrir des athlètes",
  },
  {
    href: "/followed",
    label: "Suivis",
    icon: Heart,
    description: "Athlètes suivis",
  },
  {
    href: "/collaborations",
    label: "Collabs",
    icon: Handshake,
    description: "Contrats et collaborations",
  },
  {
    href: "/analytics",
    label: "Analytics",
    icon: ChartNoAxesCombined,
    description: "Analytics globales",
  },
];

/**
 * Navigation schema for ADMIN/STAFF role
 * Full access to all features including admin panel
 */
export const ADMIN_NAV = [
  {
    href: "/dashboard",
    label: "Tableau de bord",
    icon: LayoutDashboard,
    description: "Vue d'ensemble",
  },
  {
    href: "/athletes",
    label: "Athlètes",
    icon: BicepsFlexed,
    description: "Tous les athlètes",
  },
  {
    href: "/organisations",
    label: "Organisations",
    icon: Building,
    description: "Toutes les organisations",
  },
  {
    href: "/users",
    label: "Utilisateurs",
    icon: Users,
    description: "Gestion des utilisateurs",
  },
  {
    href: "/contracts",
    label: "Contrats",
    icon: FileText,
    description: "Tous les contrats",
  },
  {
    href: "/analytics",
    label: "Analytics",
    icon: ChartNoAxesCombined,
    description: "Analytics globales",
  },
  {
    href: "/payments",
    label: "Paiements",
    icon: CreditCard,
    description: "Abonnements et facturation",
  },
  {
    href: "/admin",
    label: "Administration",
    icon: ShieldCheck,
    description: "Paramètres système",
  },
];

/**
 * Determine user role from user object
 * 
 * @deprecated Use getUserRole() from @/lib/api for direct JWT role access
 * @param {Object} user - User object with role property
 * @returns {string} Role name (AGENT, COLLABORATOR, or null)
 */
export function getUserRole(user) {
  // Return null if no user (unauthenticated)
  if (!user) {
    return null;
  }
  
  // Return role from user object (from JWT)
  if (user.role) {
    return user.role.toUpperCase();
  }
  
  // Fallback to null if no role found
  return null;
}

/**
 * Get navigation items for a specific role
 * @param {string|null} role - User role (AGENT or COLLABORATOR) or null for unauthenticated
 * @param {Object} options - Optional configuration
 * @param {Array} options.athletes - Array of athletes for AGENT role
 * @param {boolean} options.isSelfRepresented - If true, agent represents themselves
 * @returns {Array} Navigation items configuration
 */
export function getNavByRole(role, options = {}) {
  // If no role (unauthenticated), return public navigation
  if (!role) {
    console.log("No role (unauthenticated), returning PUBLIC_NAV");
    return PUBLIC_NAV;
  }
  
  if (role === "AGENT") {
    console.log("Role is AGENT, returning AGENT_NAV");
    
    const { athletes, isSelfRepresented } = options;
    
    // Si l'agent est self-represented, modifier "Mes Athlètes" en "Profil"
    if (isSelfRepresented) {
      return AGENT_NAV.map(item => {
        if (item.href === "/athletes") {
          // Si on a l'athlète, créer un lien direct vers son profil
          if (athletes && athletes.length === 1) {
            const athlete = athletes[0];
            const athleteSlug = athlete.slug || athlete.id;
            return {
              ...item,
              href: `/athletes/${athleteSlug}`,
              label: "Profil",
              icon: User,
              description: "Voir mon profil",
            };
          }
          // Sinon juste changer le label et l'icône
          return {
            ...item,
            label: "Profil",
            icon: User,
            description: "Voir mon profil",
          };
        }
        return item;
      });
    }
    
    // Si l'agent a exactement 1 athlète (mais n'est pas self-represented), modifier le lien "Mes Athlètes"
    if (athletes && athletes.length === 1) {
      const athlete = athletes[0];
      const athleteSlug = athlete.slug || athlete.id;
      
      return AGENT_NAV.map(item => {
        if (item.href === "/athletes") {
          return {
            ...item,
            href: `/athletes/${athleteSlug}`,
            description: "Voir le profil de votre athlète",
          };
        }
        return item;
      });
    }
    
    return AGENT_NAV;
  } else if (role === "COLLABORATOR") {
    console.log("Role is COLLABORATOR, returning COLLABORATOR_NAV");
    return COLLABORATOR_NAV;
  } else if (role === "ADMIN" || role === "STAFF") {
    console.log("Role is ADMIN/STAFF, returning ADMIN_NAV");
    return ADMIN_NAV;
  }

  // Default to public nav for unknown roles
  return PUBLIC_NAV;
}

/**
 * Check if a role has access to a specific path
 * @param {string} role - User role
 * @param {string} path - Path to check
 * @returns {boolean} True if role has access
 */
export function hasAccessToPath(role, path) {
  const navItems = getNavByRole(role);
  return navItems.some((item) => path.startsWith(item.href));
}
