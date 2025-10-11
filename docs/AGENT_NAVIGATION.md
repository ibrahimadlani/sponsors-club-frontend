# Navigation Intelligente pour Agents

## 🎯 Fonctionnalité

Lorsqu'un agent ne représente qu'**un seul athlète**, le bouton "Mes Athlètes" redirige automatiquement vers la page de profil de cet athlète au lieu de la liste des athlètes.

## 🏗️ Architecture

### Hook Principal : `useAgentNavigation`

**Fichier**: `/src/hooks/useAgentNavigation.js`

Ce hook :
1. Détecte le rôle de l'utilisateur via `useUserRole()`
2. Pour les agents, charge la liste de leurs athlètes
3. Adapte automatiquement la navigation si un seul athlète
4. Retourne `{ navItems, isLoading, athletes }`

### Fonction de Configuration : `getNavByRole`

**Fichier**: `/src/config/navigation.js`

Modifiée pour accepter un paramètre optionnel `options` :

```javascript
getNavByRole(role, { athletes })
```

Si `athletes.length === 1`, le lien `/athletes` devient `/athletes/{slug}`

## 📍 Composants Mis à Jour

### 1. NavBar (`nav-bar.jsx`)
```jsx
const { navItems: agentNavItems } = useAgentNavigation();
navItems = role === "AGENT" ? agentNavItems : getNavByRole(role);
```

### 2. NavUser (`nav-user.jsx`)
```jsx
const { navItems: agentNavItems } = useAgentNavigation();
const items = userRole === "AGENT" ? agentNavItems : getNavByRole(userRole);
```

### 3. MobileNav (`mobile-nav.jsx`)
```jsx
const { navItems: agentNavItems } = useAgentNavigation();
navItems = role === "AGENT" ? agentNavItems : getNavByRole(role);
```

### 4. Dashboard (`dashboard/page.jsx`)
```jsx
const { navItems: agentNavItems, athletes } = useAgentNavigation();

// Dans AgentDashboard
<Link href={navItems.find(item => item.label === "Mes Athlètes")?.href || "/athletes"}>
  <span>{athletes?.length === 1 ? "Mon Athlète" : "Mes Athlètes"}</span>
</Link>
```

## 🔄 Flux de Données

1. **useAgentNavigation()** : Charge les athlètes via API
2. **getNavByRole()** : Adapte le lien selon le nombre d'athlètes
3. **NavBar/NavUser/MobileNav** : Affichent la navigation adaptée
4. **Dashboard** : Utilise le lien adapté dans les actions rapides

## ✨ Avantages

- ✅ **UX Optimisée** : Moins de clics pour les agents mono-athlète
- ✅ **Automatique** : Pas besoin de configuration manuelle
- ✅ **Cohérent** : Même comportement dans tous les composants de navigation
- ✅ **Performant** : Chargement en parallèle avec les autres données
- ✅ **Flexible** : Revient automatiquement à la liste si > 1 athlète

## 🧪 Cas de Test

### Scénario 1 : Agent avec 1 athlète
- ✅ Le lien "Mes Athlètes" pointe vers `/athletes/teddy-riner`
- ✅ Le label devient "Mon Athlète" dans le dashboard
- ✅ Comportement identique dans NavBar, NavUser, MobileNav

### Scénario 2 : Agent avec plusieurs athlètes
- ✅ Le lien "Mes Athlètes" pointe vers `/athletes`
- ✅ Le label reste "Mes Athlètes"
- ✅ Affiche la liste complète

### Scénario 3 : Collaborateur
- ✅ Navigation standard inchangée
- ✅ Pas d'appel API pour charger les athlètes

## 🔧 API Utilisée

```javascript
athletesAPI.getMyAthletes()
```

**Endpoint**: `GET /me/athletes/`

Retourne les athlètes de l'agent connecté (array ou objet avec `results`):
- `id` : Identifiant unique
- `slug` : Slug pour l'URL (utilisé pour construire `/athletes/{slug}`)
- `name` / `full_name` : Nom de l'athlète
- Autres propriétés du profil athlète

## 📦 Dépendances

- `@/hooks/useUserRole` : Détection du rôle depuis JWT
- `@/lib/api` : Client API pour récupérer les athlètes
- `@/config/navigation` : Configuration des schémas de navigation

## 🚀 Utilisation Future

Pour étendre cette logique à d'autres rôles :

```javascript
// Dans getNavByRole()
if (role === "AUTRE_ROLE" && options.conditions) {
  return modifiedNavigation;
}
```

## 📝 Notes

- Le hook met en cache les résultats pendant la durée de vie du composant
- Les erreurs API sont gérées silencieusement (fallback sur navigation standard)
- Le chargement est non-bloquant (isLoading disponible si besoin d'UI de chargement)
