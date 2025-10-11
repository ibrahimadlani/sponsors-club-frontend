# Système de Chargement Utilisateur depuis JWT

## Vue d'ensemble

Le hook `useCurrentUser()` charge les données utilisateur de manière optimisée en deux étapes :

1. **Étape 1 (Instantané)** : Décoder le JWT du cookie pour afficher immédiatement les informations de base
2. **Étape 2 (Asynchrone)** : Appel API `/users/me/` pour enrichir avec les données complètes

---

## Pourquoi cette approche ?

### ❌ Problème avec l'approche API seule
```javascript
// Approche naïve : attendre l'API
const data = await users.getMe(); // 200-500ms de latence
setUser(data);
```

**Inconvénients** :
- 🐌 Latence visible (200-500ms)
- 👤 Pas d'avatar/nom pendant le chargement
- 🚫 NavBar affiche "Connexion" pendant 500ms
- 📱 Mauvaise UX sur mobile/connexions lentes

---

### ✅ Solution : JWT d'abord, API ensuite

```javascript
// 1. Données instantanées du JWT (0ms)
const tokenData = getUserFromToken();
setUser(mapTokenToUser(tokenData)); // UI mise à jour instantanément

// 2. Enrichissement avec API (200-500ms)
const fullData = await users.getMe();
setUser(enrichWithApiData(fullData, tokenData));
```

**Avantages** :
- ⚡ Affichage instantané (0ms)
- 👤 Nom/email/rôle disponibles immédiatement
- 🎨 NavBar correcte dès le chargement
- 📱 Excellente UX même en 3G

---

## Structure du JWT

### Token décodé
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

### Mapping vers objet User

```javascript
const user = {
  id: tokenData.user_id,           // UUID
  email: tokenData.email,           // string
  first_name: tokenData.prenom,     // string (⚠️ clé française)
  last_name: tokenData.nom,         // string (⚠️ clé française)
  role: tokenData.role,             // "AGENT" | "COLLABORATOR" | "STAFF"
  is_staff: tokenData.role === "STAFF" || tokenData.role === "ADMIN",
  agent_has_athlete: tokenData.agent_has_athlete,     // boolean
  collaborator_has_org: tokenData.collaborator_has_org, // boolean
};
```

---

## Implémentation

### Fonction `getUserFromToken()`

```javascript
// src/lib/api.js

const getCookie = (name) => {
  if (!isBrowser()) return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
};

export const getUserFromToken = () => {
  if (!isBrowser()) return null;
  const token = getCookie("accessToken") || localStorage.getItem("accessToken");
  if (!token) return null;
  return parseJwt(token); // Retourne le payload décodé
};
```

---

### Hook `useCurrentUser()` optimisé

```javascript
// src/hooks/useCurrentUser.js

export const useCurrentUser = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      try {
        // ÉTAPE 1: Chargement instantané depuis JWT
        const tokenData = getUserFromToken();
        if (tokenData && isMounted) {
          setUser({
            id: tokenData.user_id,
            email: tokenData.email,
            first_name: tokenData.prenom,
            last_name: tokenData.nom,
            role: tokenData.role,
            is_staff: tokenData.role === "STAFF",
            agent_has_athlete: tokenData.agent_has_athlete,
            collaborator_has_org: tokenData.collaborator_has_org,
          });
          setLoading(false); // ⚡ UI prête !
        }

        // ÉTAPE 2: Enrichissement avec API
        const data = await users.getMe();
        if (!isMounted) return;
        
        setUser({
          ...data, // Données complètes de l'API
          role: data.role || tokenData?.role, // Fallback sur JWT
          is_staff: data.is_staff ?? (tokenData?.role === "STAFF"),
        });
      } catch (err) {
        // Si API échoue, garder les données du JWT
        if (!isMounted) return;
        const tokenData = getUserFromToken();
        if (tokenData) {
          setUser({ /* ... mapping JWT ... */ });
        } else {
          setUser(null);
          redirectToLogin();
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    load();
    return () => { isMounted = false; };
  }, []);

  return { user, loading, error };
};
```

---

## Scénarios de fallback

### Scénario 1 : JWT valide + API OK ✅
```
1. JWT décodé → User affiché (0ms)
2. API retourne → User enrichi (300ms)
```
**Résultat** : Meilleure UX, données complètes

---

### Scénario 2 : JWT valide + API erreur 🟡
```
1. JWT décodé → User affiché (0ms)
2. API échoue → User du JWT conservé
```
**Résultat** : App fonctionnelle avec données de base

---

### Scénario 3 : JWT invalide + API OK 🟡
```
1. JWT absent/expiré → loading=true
2. API retourne → User affiché (300ms)
```
**Résultat** : Légère latence mais fonctionnel

---

### Scénario 4 : JWT invalide + API erreur ❌
```
1. JWT absent/expiré → loading=true
2. API échoue → Redirect vers /login
```
**Résultat** : Redirection appropriée

---

## Données disponibles instantanément

### ✅ Depuis le JWT (0ms)
- `id` (user_id)
- `email`
- `first_name` (prenom)
- `last_name` (nom)
- `role` (AGENT, COLLABORATOR, STAFF)
- `agent_has_athlete` (boolean)
- `collaborator_has_org` (boolean)

### ⏳ Depuis l'API (200-500ms)
- `avatar` / `profile_picture`
- `phone_number`
- `bio`
- `address`
- `language` / `currency`
- `email_verified`
- Informations d'organisation complètes
- Statistiques d'abonnement

---

## Impact sur les composants

### AppHeader
```javascript
// Immédiat : rôle disponible pour la NavBar
const role = getUserRole(user); // user.role depuis JWT
// → NavBar affiche les bons items dès le premier render
```

### NavUser
```javascript
// Immédiat : email et nom affichés
<span>{user.email}</span>
<span>{user.first_name} {user.last_name}</span>

// Après API : avatar disponible
<Avatar src={user.avatar} />
```

### Page Athletes
```javascript
// Immédiat : détection du rôle
const isAgent = user.role === "AGENT";

// API appropriée appelée dès le premier effet
useEffect(() => {
  if (isAgent) {
    athletesAPI.getMyAthletes();
  } else {
    athletesAPI.getAthletes();
  }
}, [isAgent]); // ✅ isAgent correct dès le début
```

---

## Comparaison des performances

### Avant (API seule)
```
Temps écoulé    État UI
0ms            Loading... (pas de user)
200ms          Loading... (requête en cours)
500ms          ✅ User affiché, NavBar correcte
```
**Time to Interactive** : 500ms

---

### Après (JWT + API)
```
Temps écoulé    État UI
0ms            ✅ User affiché (depuis JWT), NavBar correcte
200ms          ✅ User enrichi (API retournée)
```
**Time to Interactive** : 0ms ⚡

**Amélioration** : 500ms gagnées

---

## Tests suggérés

### Test 1 : Vérifier le chargement instantané
```javascript
// Dans la console du navigateur
console.time("User loaded");
// Recharger la page
// Observer dans React DevTools quand <NavBar> reçoit le bon role
console.timeEnd("User loaded");
// Devrait être < 10ms
```

### Test 2 : Simuler une API lente
```javascript
// Dans client.js, ajouter un délai artificiel
export async function get(endpoint, params) {
  await new Promise(r => setTimeout(r, 2000)); // 2s delay
  // ... reste du code
}
// Vérifier que la NavBar est correcte malgré le délai
```

### Test 3 : Tester le fallback
```javascript
// Bloquer l'API dans Network DevTools
// Vérifier que l'app reste fonctionnelle avec les données JWT
```

---

## Sécurité

### ⚠️ Limitations du JWT
Le JWT est décodé **côté client** sans vérification de signature.

**Ne PAS** :
- ❌ Utiliser pour des décisions de sécurité critiques
- ❌ Afficher des données sensibles uniquement du JWT
- ❌ Court-circuiter les vérifications backend

**OK pour** :
- ✅ Afficher l'UI appropriée (NavBar, etc.)
- ✅ Rediriger vers les bonnes pages
- ✅ Améliorer l'UX avec du pré-chargement

**Règle d'or** : Le JWT sert à l'UX, l'API sert à la sécurité.

---

## Dépannage

### Problème : NavBar affiche "COLLABORATOR" alors que je suis "AGENT"

**Cause** : `user.role` n'est pas défini ou mal mappé

**Solution** :
```javascript
// Vérifier dans la console
import { getUserFromToken } from '@/lib/api';
console.log(getUserFromToken());
// Doit afficher role: "AGENT"
```

### Problème : User null après déconnexion/reconnexion

**Cause** : Cookie ou localStorage non synchronisé

**Solution** :
```javascript
// Nettoyer et reconnecter
localStorage.clear();
document.cookie.split(";").forEach(c => {
  document.cookie = c.trim().split("=")[0] + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
});
// Puis se reconnecter
```

---

**Dernière mise à jour** : 9 octobre 2025
