# Vue Athlètes par Rôle Utilisateur

## Vue d'ensemble

La page `/athletes` affiche un contenu différent selon le rôle de l'utilisateur connecté :

- **AGENT** : Affiche uniquement **ses propres athlètes**
- **COLLABORATOR/ADMIN** : Affiche **tous les athlètes** de la plateforme avec pagination infinie

---

## Comportement par rôle

### 👤 AGENT

**Titre de la page** : "Mes Athlètes"

**Source des données** : `athletesAPI.getMyAthletes()` (endpoint `/me/athletes/`)

**Fonctionnalités** :
- ✅ Affichage de tous ses athlètes (pas de pagination)
- ✅ Recherche et filtres (sport, pays, ville)
- ✅ Message personnalisé si aucun athlète
- ❌ Pas de scroll infini (liste complète chargée d'un coup)

**Message vide** :
```
Aucun athlète trouvé
Vous n'avez pas encore d'athlètes associés à votre compte. 
Ajoutez votre premier athlète pour commencer.
```

---

### 🏢 COLLABORATOR / ADMIN

**Titre de la page** : "Tous les Athlètes"

**Source des données** : `getAthletesPage(12, offset)` (endpoint `/athletes/` avec pagination)

**Fonctionnalités** :
- ✅ Affichage de tous les athlètes de la plateforme
- ✅ Pagination infinie avec IntersectionObserver
- ✅ Recherche et filtres (sport, pays, ville)
- ✅ Chargement progressif (12 athlètes par page)

---

## Implémentation technique

### Détection du rôle

```javascript
import { getUserRole } from "@/config/navigation";

const userRole = getUserRole(user);
const isAgent = userRole === "AGENT";
```

### Chargement initial

```javascript
useEffect(() => {
  (async () => {
    if (isAgent) {
      // Pour les agents : tous leurs athlètes
      const myAthletes = await athletesAPI.getMyAthletes();
      results = Array.isArray(myAthletes) ? myAthletes : [];
      next = null; // Pas de pagination
    } else {
      // Pour les autres : pagination normale
      const response = await getAthletesPage(12, 0);
      results = response.results;
      next = response.next;
    }
    setItems(results);
    setHasMore(Boolean(next));
  })();
}, [isAgent]);
```

### Désactivation du scroll infini pour les agents

```javascript
useEffect(() => {
  // Désactiver le scroll infini pour les agents
  if (isAgent || !hasMore || loading) return;
  
  // ... IntersectionObserver pour les autres rôles
}, [isAgent, offset, hasMore, fetchingMore, loading]);
```

---

## Structure de l'API

### Endpoint Agent
```
GET /me/athletes/
```

**Retour** :
```json
[
  {
    "id": 1,
    "slug": "john-doe",
    "full_name": "John Doe",
    "sport": { "name": "Football" },
    "country": "France",
    "city": "Paris",
    ...
  }
]
```

### Endpoint Global (avec pagination)
```
GET /athletes/?limit=12&offset=0
```

**Retour** :
```json
{
  "count": 150,
  "next": "http://api.../athletes/?limit=12&offset=12",
  "previous": null,
  "results": [...]
}
```

---

## Filtres de recherche

Les filtres fonctionnent de la même manière pour tous les rôles :

- **Recherche textuelle** : Nom, sport, ville, pays
- **Filtre sport** : Dropdown avec sports uniques
- **Filtre pays** : Dropdown avec pays uniques
- **Filtre ville** : Dropdown avec villes uniques

```javascript
const filteredItems = items.filter((item) => {
  const matchSearch = !q || 
    item.full_name?.toLowerCase().includes(q) ||
    item.sport?.name?.toLowerCase().includes(q);
  const matchSport = !sport || item.sport?.name === sport;
  const matchCountry = !country || item.country === country;
  const matchCity = !city || item.city === city;
  return matchSearch && matchSport && matchCountry && matchCity;
});
```

---

## UI/UX

### Titre dynamique

```jsx
<h1 className="text-2xl font-bold">
  {isAgent ? "Mes Athlètes" : "Tous les Athlètes"}
</h1>
```

### Sous-titre pour agents

```jsx
{isAgent && (
  <p className="text-sm text-muted-foreground mt-1">
    Gérez vos athlètes et leurs profils
  </p>
)}
```

### Message vide pour agents

```jsx
{isAgent && !loading && filteredItems.length === 0 && (
  <div className="flex flex-col items-center justify-center py-12">
    {/* Icône + Message personnalisé */}
  </div>
)}
```

---

## Avantages de cette approche

✅ **Séparation des préoccupations** : Chaque rôle a sa propre logique de données
✅ **Performance** : Agents chargent uniquement leurs athlètes (pas de sur-requête)
✅ **UX claire** : Interface adaptée au contexte de l'utilisateur
✅ **Scalabilité** : Pagination pour les grandes listes (collaborateurs/admins)
✅ **Maintenance** : Un seul composant pour tous les rôles avec conditions

---

## Tests suggérés

### En tant qu'AGENT
1. ✅ Vérifier que seuls MES athlètes s'affichent
2. ✅ Vérifier que le scroll infini est désactivé
3. ✅ Vérifier le titre "Mes Athlètes"
4. ✅ Tester les filtres sur mes athlètes
5. ✅ Vérifier le message si aucun athlète

### En tant que COLLABORATOR
1. ✅ Vérifier que TOUS les athlètes s'affichent
2. ✅ Vérifier que le scroll infini fonctionne
3. ✅ Vérifier le titre "Tous les Athlètes"
4. ✅ Tester les filtres sur tous les athlètes
5. ✅ Vérifier le chargement progressif

---

**Dernière mise à jour** : 9 octobre 2025
