# Guide d'utilisation du rôle utilisateur

Ce guide explique comment utiliser la nouvelle fonction `getUserRole()` et le hook `useUserRole()` pour faire de l'affichage conditionnel basé sur le rôle de l'utilisateur.

## 🎯 Fonctionnalités

- **Lecture directe du JWT** : Accès instantané au rôle (0ms, pas d'appel API)
- **Rôles supportés** : `AGENT`, `COLLABORATOR`, `ADMIN`
- **Affichage conditionnel** : Personnalisez l'UI selon le rôle
- **React Hook** : `useUserRole()` pour une intégration facile dans les composants

## 📦 Structure du JWT

Le backend retourne un JWT avec la structure suivante :

```json
{
  "token_type": "access",
  "exp": 1760041236,
  "iat": 1760040936,
  "jti": "2573191eedfd4fb8bb26c2eebc64edf5",
  "user_id": "62750fc3-9247-4ed8-a391-c54dddd44efa",
  "email": "asma@adlani.com",
  "prenom": "Asma",
  "nom": "Adlani",
  "role": "AGENT",
  "agent_has_athlete": false,
  "collaborator_has_org": false
}
```

### Mapping des rôles

- **Agent** : `role === "AGENT"`
- **Collaborateur** : `role === "COLLABORATOR"`
- **Admin/Staff** : `is_staff === true` (prioritaire sur le role)

## 🚀 Utilisation

### 1. Dans un composant React (avec hook)

```jsx
"use client";

import { useUserRole } from "@/hooks/useUserRole";

export default function MyComponent() {
  const { role, isLoading } = useUserRole();

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  // Affichage conditionnel basé sur le rôle
  if (role === "AGENT") {
    return (
      <div>
        <h1>Tableau de bord Agent</h1>
        <p>Bienvenue, agent !</p>
        {/* Contenu spécifique aux agents */}
      </div>
    );
  }

  if (role === "COLLABORATOR") {
    return (
      <div>
        <h1>Tableau de bord Collaborateur</h1>
        <p>Bienvenue, collaborateur !</p>
        {/* Contenu spécifique aux collaborateurs */}
      </div>
    );
  }

  if (role === "ADMIN") {
    return (
      <div>
        <h1>Tableau de bord Admin</h1>
        <p>Bienvenue, administrateur !</p>
        {/* Contenu spécifique aux admins */}
      </div>
    );
  }

  // Utilisateur non connecté
  return <div>Veuillez vous connecter</div>;
}
```

### 2. Affichage conditionnel inline

```jsx
"use client";

import { useUserRole } from "@/hooks/useUserRole";

export default function Dashboard() {
  const { role } = useUserRole();

  return (
    <div>
      <h1>Dashboard</h1>
      
      {/* Bouton visible uniquement pour les agents */}
      {role === "AGENT" && (
        <button>Ajouter un athlète</button>
      )}

      {/* Section visible pour agents ET admins */}
      {(role === "AGENT" || role === "ADMIN") && (
        <div>
          <h2>Statistiques avancées</h2>
          {/* Contenu */}
        </div>
      )}

      {/* Section visible pour tous les rôles connectés */}
      {role && (
        <div>
          <h2>Contenu pour utilisateurs connectés</h2>
        </div>
      )}
    </div>
  );
}
```

### 3. Utilisation sans React (fonction pure)

```javascript
import { getUserRole } from "@/lib/api";

// Dans une fonction async ou un useEffect
function checkUserAccess() {
  const role = getUserRole();
  
  if (role === "AGENT") {
    console.log("Utilisateur est un agent");
    // Faire quelque chose
  } else if (role === "COLLABORATOR") {
    console.log("Utilisateur est un collaborateur");
    // Faire quelque chose d'autre
  } else if (role === "ADMIN") {
    console.log("Utilisateur est un admin");
    // Faire quelque chose pour admin
  } else {
    console.log("Utilisateur non connecté");
    // Rediriger vers login
  }
}
```

### 4. Dans un composant serveur (Server Component)

Pour les Server Components, vous ne pouvez pas utiliser le hook. Utilisez plutôt la fonction côté serveur :

```jsx
import { cookies } from "next/headers";

export default async function ServerComponent() {
  // Récupérer le token depuis les cookies
  const cookieStore = cookies();
  const token = cookieStore.get("accessToken")?.value;
  
  let role = null;
  if (token) {
    // Décoder le JWT côté serveur
    const payload = JSON.parse(
      Buffer.from(token.split('.')[1], 'base64').toString()
    );
    role = payload.role;
  }

  return (
    <div>
      {role === "AGENT" ? (
        <h1>Vue Agent</h1>
      ) : (
        <h1>Vue par défaut</h1>
      )}
    </div>
  );
}
```

## 🎨 Exemples d'utilisation avancés

### Navigation conditionnelle

```jsx
"use client";

import { useUserRole } from "@/hooks/useUserRole";
import Link from "next/link";

export function ConditionalNav() {
  const { role } = useUserRole();

  return (
    <nav>
      {/* Liens communs */}
      <Link href="/dashboard">Dashboard</Link>
      
      {/* Liens spécifiques aux agents */}
      {role === "AGENT" && (
        <>
          <Link href="/athletes/my-athletes">Mes Athlètes</Link>
          <Link href="/contracts/agent">Mes Contrats</Link>
        </>
      )}

      {/* Liens spécifiques aux collaborateurs */}
      {role === "COLLABORATOR" && (
        <>
          <Link href="/athletes">Tous les Athlètes</Link>
          <Link href="/organisations">Organisations</Link>
        </>
      )}

      {/* Liens admin uniquement */}
      {role === "ADMIN" && (
        <>
          <Link href="/admin/users">Gestion Utilisateurs</Link>
          <Link href="/admin/settings">Paramètres</Link>
        </>
      )}
    </nav>
  );
}
```

### Composant avec protection de route

```jsx
"use client";

import { useUserRole } from "@/hooks/useUserRole";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProtectedAgentPage() {
  const { role, isLoading } = useUserRole();
  const router = useRouter();

  useEffect(() => {
    // Rediriger si pas agent
    if (!isLoading && role !== "AGENT") {
      router.push("/access-denied");
    }
  }, [role, isLoading, router]);

  if (isLoading) {
    return <div>Vérification des permissions...</div>;
  }

  if (role !== "AGENT") {
    return null; // Ou un message d'erreur
  }

  return (
    <div>
      <h1>Page réservée aux agents</h1>
      {/* Contenu de la page */}
    </div>
  );
}
```

### Composant de carte conditionnelle

```jsx
"use client";

import { useUserRole } from "@/hooks/useUserRole";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export function DashboardCard({ athlete }) {
  const { role } = useUserRole();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{athlete.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>{athlete.sport}</p>
        
        {/* Bouton visible uniquement pour les agents */}
        {role === "AGENT" && (
          <button>Gérer l'athlète</button>
        )}

        {/* Stats complètes pour admin */}
        {role === "ADMIN" && (
          <div>
            <p>Revenus: {athlete.revenue}</p>
            <p>Contrats: {athlete.contracts}</p>
          </div>
        )}

        {/* Vue simplifiée pour collaborateurs */}
        {role === "COLLABORATOR" && (
          <button>Suivre</button>
        )}
      </CardContent>
    </Card>
  );
}
```

## ⚡ Performance

- **getUserRole()** : 0ms (lecture directe du JWT depuis le cookie)
- **useUserRole()** : 0ms initial + écoute des changements d'authentification
- **Pas d'appel API** : Le rôle est déjà dans le JWT, pas besoin d'appeler le backend

## 🔄 Mise à jour automatique

Le hook `useUserRole()` écoute automatiquement les changements d'authentification :

- Connexion/déconnexion dans un autre onglet
- Changement de token
- Expiration du token

```jsx
// Le composant se re-rendra automatiquement quand le rôle change
const { role } = useUserRole();
```

## 📝 Bonnes pratiques

1. **Toujours vérifier `isLoading`** avant d'afficher du contenu protégé
2. **Utiliser le hook dans les Client Components** (`"use client"`)
3. **Gérer le cas `role === null`** (utilisateur non connecté)
4. **Ne pas faire d'appel API supplémentaire** pour obtenir le rôle
5. **Utiliser la fonction `getUserRole()`** pour les vérifications côté serveur

## 🛠️ Débogage

Pour voir le rôle dans la console :

```jsx
const { role } = useUserRole();
console.log("Current role:", role);
```

Pour voir le contenu complet du JWT :

```javascript
import { getUserFromToken } from "@/lib/api";

const tokenData = getUserFromToken();
console.log("JWT payload:", tokenData);
```

## 📚 Références

- **Hook**: `/src/hooks/useUserRole.js`
- **Fonction**: `/src/lib/api.js` → `getUserRole()`
- **Navigation**: `/src/config/navigation.js` → `getNavByRole(role)`
- **Header**: `/src/components/app-header.jsx` (exemple d'utilisation)
