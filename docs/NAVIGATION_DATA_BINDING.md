# Navigation Data Binding System

Ce système permet d'afficher dynamiquement différents menus de navigation selon le rôle de l'utilisateur.

## Architecture

```
src/
├── config/
│   └── navigation.js        # Configuration des menus par rôle
├── components/
│   ├── app-header.jsx       # Header principal (avec data binding)
│   ├── nav-bar.jsx          # Navigation desktop
│   ├── mobile-nav.jsx       # Navigation mobile
│   └── nav-user.jsx         # Menu utilisateur
```

## Configuration par rôle

### 1. AGENT (Agents sportifs)
- **Tableau de bord** : Vue d'ensemble
- **Mes Athlètes** : Gestion des athlètes
- **Analytics** : Statistiques et performances
- **Messages** : Conversations avec les marques

### 2. COLLABORATOR (Marques/Organisations)
- **Tableau de bord** : Vue d'ensemble
- **Explorer** : Découvrir des athlètes
- **Suivis** : Athlètes suivis
- **Organisations** : Gérer les organisations
- **Contrats** : Contrats et collaborations
- **Messages** : Conversations

### 3. ADMIN/STAFF (Administrateurs)
- **Tableau de bord** : Vue d'ensemble
- **Athlètes** : Tous les athlètes
- **Organisations** : Toutes les organisations
- **Utilisateurs** : Gestion des utilisateurs
- **Contrats** : Tous les contrats
- **Analytics** : Analytics globales
- **Paiements** : Abonnements et facturation
- **Administration** : Paramètres système

## Utilisation

### AppHeader (automatique)

Le composant `AppHeader` détecte automatiquement le rôle de l'utilisateur :

```jsx
import AppHeader from '@/components/app-header';

// Le rôle est détecté automatiquement
<AppHeader />

// Ou vous pouvez passer l'utilisateur manuellement
<AppHeader user={user} />
```

### NavMenu (personnalisé)

Vous pouvez utiliser `NavMenu` avec un rôle spécifique :

```jsx
import { NavMenu } from '@/components/nav-bar';

// Avec un rôle
<NavMenu role="AGENT" />
<NavMenu role="COLLABORATOR" />
<NavMenu role="ADMIN" />

// Avec des items personnalisés
<NavMenu items={customNavItems} />
```

### MobileNav (mobile)

Navigation mobile avec drawer :

```jsx
import { MobileNav } from '@/components/mobile-nav';

<MobileNav role="AGENT" />
```

## Ajouter un nouvel item de navigation

### 1. Modifier la configuration

Éditez `src/config/navigation.js` :

```javascript
export const AGENT_NAV = [
  // ... items existants
  {
    href: "/nouveau-lien",
    label: "Nouveau",
    icon: IconName,  // Importez l'icône depuis lucide-react
    description: "Description du lien",
  },
];
```

### 2. Les items disponibles

Chaque item de navigation contient :
- `href`: Chemin de la route
- `label`: Texte affiché
- `icon`: Composant d'icône (lucide-react)
- `description`: Description (tooltip + mobile)

## Détection du rôle

Le rôle est détecté dans cet ordre :

1. `user.is_staff === true` → **ADMIN**
2. `user.account_type === "AGENT"` → **AGENT**
3. `user.account_type === "COLLABORATOR"` → **COLLABORATOR**
4. Par défaut → **COLLABORATOR**

## Fonctions utilitaires

### getNavByRole(role)

Retourne les items de navigation pour un rôle :

```javascript
import { getNavByRole } from '@/config/navigation';

const items = getNavByRole('AGENT');
// Retourne AGENT_NAV
```

### hasAccessToPath(role, path)

Vérifie si un rôle a accès à un chemin :

```javascript
import { hasAccessToPath } from '@/config/navigation';

const canAccess = hasAccessToPath('AGENT', '/athletes');
// Retourne true si le rôle AGENT a accès à /athletes
```

## Exemples de personnalisation

### Navigation personnalisée

```jsx
import { NavMenu } from '@/components/nav-bar';
import { Home, Settings } from 'lucide-react';

const customItems = [
  { href: "/home", label: "Accueil", icon: Home },
  { href: "/settings", label: "Paramètres", icon: Settings },
];

<NavMenu items={customItems} />
```

### Navigation conditionnelle

```jsx
import { NavMenu } from '@/components/nav-bar';
import { getNavByRole } from '@/config/navigation';

function CustomNav({ user }) {
  const baseNav = getNavByRole(user.account_type);
  
  // Ajouter un item conditionnel
  const navItems = user.isPremium 
    ? [...baseNav, { href: "/premium", label: "Premium", icon: Crown }]
    : baseNav;

  return <NavMenu items={navItems} />;
}
```

### Filtrer les items

```jsx
import { NavMenu } from '@/components/nav-bar';
import { getNavByRole } from '@/config/navigation';

function FilteredNav({ role, excludePaths = [] }) {
  const items = getNavByRole(role).filter(
    item => !excludePaths.includes(item.href)
  );

  return <NavMenu items={items} />;
}
```

## Styling

### Classes CSS actives

Les liens actifs reçoivent automatiquement `data-active="true"` :

```css
[data-active="true"] {
  /* Styles pour les liens actifs */
}
```

### Personnalisation des icônes

Toutes les icônes proviennent de `lucide-react`. Pour changer une icône :

```javascript
import { NewIcon } from 'lucide-react';

const AGENT_NAV = [
  { href: "/path", label: "Label", icon: NewIcon },
];
```

## Migration depuis l'ancien système

### Avant (statique)
```jsx
const NAV_LINKS = [
  { href: "/athletes", label: "Athlètes", icon: BicepsFlexed },
  { href: "/follows", label: "Suivis", icon: Heart },
];

export function NavMenu() {
  return (
    <NavigationMenu>
      {NAV_LINKS.map(...)}
    </NavigationMenu>
  );
}
```

### Après (dynamique)
```jsx
import { getNavByRole } from '@/config/navigation';

export function NavMenu({ role }) {
  const navItems = getNavByRole(role);
  
  return (
    <NavigationMenu>
      {navItems.map(...)}
    </NavigationMenu>
  );
}
```

## Middleware et protection des routes

Le middleware peut utiliser `hasAccessToPath` pour vérifier les accès :

```javascript
import { hasAccessToPath } from '@/config/navigation';

export function middleware(req) {
  const role = getUserRole(req);
  const path = req.nextUrl.pathname;
  
  if (!hasAccessToPath(role, path)) {
    return NextResponse.redirect('/unauthorized');
  }
  
  return NextResponse.next();
}
```

## Tests

Pour tester les différents rôles :

```javascript
import { getNavByRole } from '@/config/navigation';

describe('Navigation', () => {
  it('should return correct nav for AGENT', () => {
    const nav = getNavByRole('AGENT');
    expect(nav).toHaveLength(4);
    expect(nav[0].href).toBe('/dashboard');
  });

  it('should return correct nav for COLLABORATOR', () => {
    const nav = getNavByRole('COLLABORATOR');
    expect(nav).toHaveLength(6);
  });

  it('should return correct nav for ADMIN', () => {
    const nav = getNavByRole('ADMIN');
    expect(nav).toHaveLength(8);
  });
});
```

## Performance

- Les configurations sont **statiques** et exportées en tant que constantes
- Aucun recalcul inutile
- Utilisation de `React.memo` pour les composants si nécessaire
- Navigation côté client avec Next.js Link (pas de rechargement)

## Accessibilité

- Tous les liens ont des labels appropriés
- Les icônes sont décoratives (pas dans le texte)
- Support clavier complet
- ARIA labels automatiques via shadcn/ui
- Descriptions pour les lecteurs d'écran

## Notes importantes

1. **Ordre des items** : L'ordre dans les tableaux définit l'ordre d'affichage
2. **Icônes** : Toujours importer depuis `lucide-react`
3. **Paths** : Utiliser des chemins absolus (`/path`) et non relatifs
4. **Matching** : Les liens actifs utilisent `pathname.startsWith(href)`
5. **Mobile** : Le drawer se ferme automatiquement au clic sur un lien
