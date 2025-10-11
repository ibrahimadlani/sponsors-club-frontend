# Guide de Migration vers la nouvelle API

Ce guide explique comment migrer vos appels API existants vers la nouvelle structure modulaire.

## Avant (ancien code)

```javascript
// Ancien code avec fetch direct
const response = await fetch(`${API_BASE_URL}/payments/plans/`, {
  credentials: "include",
});
if (response.ok) {
  const data = await response.json();
  setPlans(data);
}
```

## Après (nouveau code)

```javascript
// Nouveau code avec API modulaire
import { payments } from '@/lib/api';

const data = await payments.getPlans();
setPlans(data);
```

## Exemples de migration par cas d'usage

### 1. Récupération de données (GET)

**Avant :**
```javascript
const res = await fetch(`${API_BASE_URL}/athletes/`, {
  credentials: "include",
});
const athletes = await res.json();
```

**Après :**
```javascript
import { athletes } from '@/lib/api';

const athletesList = await athletes.getAthletes();
```

### 2. Création de ressource (POST)

**Avant :**
```javascript
const res = await fetch(`${API_BASE_URL}/athletes/`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  credentials: "include",
  body: JSON.stringify({
    full_name: "John Doe",
    sport_id: "uuid",
  }),
});
const newAthlete = await res.json();
```

**Après :**
```javascript
import { athletes } from '@/lib/api';

const newAthlete = await athletes.createAthlete({
  full_name: "John Doe",
  sport_id: "uuid",
});
```

### 3. Mise à jour (PUT/PATCH)

**Avant :**
```javascript
const res = await fetch(`${API_BASE_URL}/users/me/`, {
  method: "PATCH",
  headers: { "Content-Type": "application/json" },
  credentials: "include",
  body: JSON.stringify({ first_name: "Jane" }),
});
const updated = await res.json();
```

**Après :**
```javascript
import { users } from '@/lib/api';

const updated = await users.patchMe({ first_name: "Jane" });
```

### 4. Suppression (DELETE)

**Avant :**
```javascript
await fetch(`${API_BASE_URL}/athletes/${id}/follow/`, {
  method: "DELETE",
  credentials: "include",
});
```

**Après :**
```javascript
import { athletes } from '@/lib/api';

await athletes.unfollowAthlete(id);
```

### 5. Gestion des erreurs

**Avant :**
```javascript
try {
  const res = await fetch(`${API_BASE_URL}/athletes/${id}/`);
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Error');
  }
  const data = await res.json();
  // ...
} catch (error) {
  console.error(error);
  toast.error(error.message);
}
```

**Après :**
```javascript
import { athletes } from '@/lib/api';
import { toast } from 'sonner';

try {
  const data = await athletes.getAthlete(id);
  // ...
} catch (error) {
  console.error(error);
  toast.error('Erreur', {
    description: error.message || 'Une erreur est survenue',
  });
}
```

## Checklist de migration

Pour chaque fichier contenant des appels API :

- [ ] Identifier tous les `fetch()` vers l'API backend
- [ ] Importer le module API correspondant (`import { athletes, users, etc } from '@/lib/api'`)
- [ ] Remplacer chaque `fetch()` par la fonction API appropriée
- [ ] Supprimer les imports `API_BASE_URL` inutilisés
- [ ] Simplifier la gestion des erreurs
- [ ] Tester le fonctionnement

## Fichiers à migrer

Voici une liste des fichiers qui utilisent probablement `fetch()` :

### Pages
- [ ] `src/app/athletes/page.jsx`
- [ ] `src/app/athletes/[slug]/page.jsx`
- [ ] `src/app/dashboard/page.jsx`
- [ ] `src/app/billing/page.jsx` ✅ (migré)
- [x] `src/app/pricing/page.jsx` ✅ (migré)
- [ ] `src/app/followed/page.jsx`
- [ ] `src/app/messages/page.jsx`
- [ ] `src/app/notifications/page.jsx`
- [ ] `src/app/organisations/page.jsx`
- [ ] `src/app/settings/page.jsx`

### Composants
- [ ] `src/components/forms/login-form.jsx`
- [ ] `src/components/forms/register-form.jsx`
- [ ] `src/components/athlete-profile.jsx`
- [ ] `src/hooks/useCurrentUser.js`

## Avantages de la migration

1. **Code plus propre** : Moins de code répétitif
2. **Typage implicite** : Fonctions documentées avec JSDoc
3. **Centralisation** : Un seul endroit pour modifier les appels API
4. **Gestion d'erreurs uniforme** : Comportement cohérent
5. **Testabilité** : Plus facile à mocker pour les tests
6. **Maintenance** : Mise à jour de l'API backend simplifiée

## Support

Pour toute question sur l'utilisation de l'API, consultez :
- `src/lib/api/README.md` - Documentation complète
- Les fichiers individuels dans `src/lib/api/` - Exemples de fonctions
