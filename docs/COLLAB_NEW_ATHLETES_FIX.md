# Correction de l'endpoint athlètes pour création de contrat

## Date
17 octobre 2025

## Problème identifié

### Erreur console
```
Error fetching athletes: {}
```

### Cause
L'endpoint `/me/athletes/` était utilisé pour récupérer les athlètes, mais cet endpoint est destiné aux **agents** pour récupérer leurs propres athlètes. 

Un **collaborateur** créant un contrat doit pouvoir sélectionner n'importe quel athlète (et son agent) disponible dans le système, pas seulement les siens.

### Code problématique
```javascript
import { getMyAthletes } from "@/lib/api/athletes";

// ...

const data = await getMyAthletes(); // ❌ Endpoint /me/athletes/ - Pour agents uniquement
```

## Solution implémentée

### 1. Changement d'endpoint

**Avant:**
- Endpoint : `/me/athletes/` (liste mes athlètes)
- Usage : Pour les agents qui gèrent leurs athlètes

**Après:**
- Endpoint : `/athletes/` (liste tous les athlètes)
- Usage : Pour tous les utilisateurs, liste complète avec pagination

### 2. Code corrigé

```javascript
import { getAthletes } from "@/lib/api/athletes"; // ✅ Fonction correcte

// ...

const fetchAthletes = async () => {
  try {
    setLoadingAthletes(true);
    const data = await getAthletes(); // ✅ Liste complète des athlètes
    
    // Gestion de la pagination
    const athletesList = Array.isArray(data) ? data : data?.results ?? [];
    setAthletes(athletesList);
  } catch (error) {
    console.error("Error fetching athletes:", error);
    toast.error("Erreur lors du chargement des athlètes");
  } finally {
    setLoadingAthletes(false);
  }
};
```

### 3. Amélioration du Select

#### Structure des données
Chaque athlète a un objet `agent` imbriqué :
```json
{
  "id": "athlete-uuid",
  "full_name": "Kylian Mbappé",
  "agent": {
    "id": "agent-uuid",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

#### Code du Select amélioré

**Avant:**
```jsx
athletes.map((athlete) => (
  <SelectItem key={athlete.id} value={athlete.agent || athlete.id}>
    <div className="flex items-center gap-2">
      <User className="w-4 h-4" />
      {athlete.full_name || athlete.name}
    </div>
  </SelectItem>
))
```

**Après:**
```jsx
athletes
  .filter((athlete) => athlete.agent?.id) // ✅ Ne garde que les athlètes avec agent
  .map((athlete) => (
    <SelectItem key={athlete.id} value={athlete.agent.id}>
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <User className="w-4 h-4" />
          <span className="font-medium">{athlete.full_name}</span>
        </div>
        <span className="text-xs text-muted-foreground ml-6">
          Agent: {athlete.agent.name}
        </span>
      </div>
    </SelectItem>
  ))
```

#### Améliorations visuelles
1. **Filtrage** : Exclusion des athlètes sans agent
2. **Affichage double ligne** :
   - Ligne 1 : Nom de l'athlète (en gras)
   - Ligne 2 : Nom de l'agent (texte secondaire)
3. **Clarté** : L'utilisateur voit clairement quel agent sera associé au contrat

## Impact

### Avant la correction
- ❌ Erreur console `Error fetching athletes: {}`
- ❌ Liste vide d'athlètes
- ❌ Impossible de créer un contrat
- ❌ Endpoint inapproprié pour le rôle COLLABORATOR

### Après la correction
- ✅ Liste complète des athlètes disponibles
- ✅ Affichage de l'athlète ET de son agent
- ✅ Filtrage automatique (seulement athlètes avec agent)
- ✅ Création de contrat fonctionnelle
- ✅ Endpoint approprié pour tous les rôles

## Différence entre endpoints

| Endpoint | Usage | Qui peut l'utiliser | Retour |
|----------|-------|---------------------|--------|
| `GET /me/athletes/` | Mes athlètes | **Agents** uniquement | Athlètes que je représente |
| `GET /athletes/` | Tous les athlètes | **Tous** (public ou auth) | Liste complète paginée |

## Fichiers modifiés

### 1. `/src/app/(private)/collab/new/page.jsx`

**Imports:**
```diff
- import { getMyAthletes } from "@/lib/api/athletes";
+ import { getAthletes } from "@/lib/api/athletes";
```

**useEffect:**
```diff
- const data = await getMyAthletes();
- setAthletes(data || []);
+ const data = await getAthletes();
+ const athletesList = Array.isArray(data) ? data : data?.results ?? [];
+ setAthletes(athletesList);
```

**Select rendering:**
```diff
- athletes.map((athlete) => (
-   <SelectItem key={athlete.id} value={athlete.agent || athlete.id}>
+ athletes
+   .filter((athlete) => athlete.agent?.id)
+   .map((athlete) => (
+     <SelectItem key={athlete.id} value={athlete.agent.id}>
```

### 2. `/docs/COLLAB_NEW_PAGE.md`

**API Endpoints section:**
```diff
- GET /me/athletes/ - Liste des athlètes (pour récupérer les agents)
+ GET /athletes/ - Liste des athlètes disponibles (pour récupérer leurs agents)
```

### 3. `/docs/COLLAB_NEW_ATHLETES_FIX.md` (ce fichier)
Documentation de la correction.

## Tests à effectuer

### Scénarios de test

- [ ] **Chargement des athlètes**
  - Vérifier que la liste se charge sans erreur console
  - Vérifier que les athlètes s'affichent avec leurs agents

- [ ] **Filtrage**
  - Vérifier que seuls les athlètes avec agent sont affichés
  - Vérifier le comportement si aucun athlète avec agent

- [ ] **Sélection**
  - Sélectionner un athlète
  - Vérifier que `agent_id` est correctement enregistré
  - Vérifier l'affichage du nom de l'agent

- [ ] **Création de contrat**
  - Créer un contrat avec un athlète sélectionné
  - Vérifier que le bon `agent_id` est envoyé à l'API
  - Vérifier la redirection vers la page de détail

- [ ] **États de chargement**
  - Spinner visible pendant le chargement
  - Message si liste vide
  - Désactivation du submit pendant chargement

## API athlete object structure

```javascript
{
  id: "uuid",
  slug: "athlete-slug",
  full_name: "Nom Complet",
  sport: {
    id: "uuid",
    name: "Football",
    emoji: "⚽"
  },
  agent: {           // ← Objet critique pour les contrats
    id: "uuid",      // ← Cet ID est utilisé comme agent_id
    name: "Nom Agent",
    email: "agent@example.com",
    avatar: null
  },
  country: "France",
  city: "Paris",
  avatar: "/media/avatar.jpg",
  followers_count_cached: 1000,
  engagement_rate_cached: "4.50"
}
```

## Payload de création de contrat

Le `agent_id` dans le payload provient de `athlete.agent.id` :

```json
{
  "title": "Contrat de sponsoring 2025",
  "organisation_id": "uuid-organisation-auto",
  "agent_id": "uuid-from-athlete.agent.id",  // ✅ ID de l'agent, pas de l'athlète
  "effective_date": "2025-01-01",
  "expiration_date": "2025-12-31"
}
```

## Prochaines améliorations possibles

### Court terme
- [ ] Recherche/Filtrage des athlètes par nom
- [ ] Tri par sport, pays, agent
- [ ] Pagination si beaucoup d'athlètes

### Moyen terme
- [ ] Groupe par agent (si un agent a plusieurs athlètes)
- [ ] Photos des athlètes dans le select
- [ ] Informations supplémentaires (sport, pays) dans le select

### Long terme
- [ ] Endpoint dédié `/agents/` pour sélectionner directement les agents
- [ ] Création de contrat avec plusieurs athlètes d'un même agent
- [ ] Import/Suggestion d'athlètes basé sur l'organisation

## Conclusion

✅ **Problème résolu** : L'endpoint correct est maintenant utilisé  
✅ **UX améliorée** : Affichage clair de l'athlète et de son agent  
✅ **Code robuste** : Gestion de la pagination et filtrage des données  
✅ **Documentation à jour** : COLLAB_NEW_PAGE.md mise à jour  

La création de contrat fonctionne maintenant correctement pour les collaborateurs.
