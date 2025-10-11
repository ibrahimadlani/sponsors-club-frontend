# Page Athletes - Deux Vues Distinctes par Rôle

## 📍 Localisation
`/src/app/(private)/athletes/page.jsx`

## 🎯 Fonctionnalité

La page **Athletes** affiche **deux vues complètement différentes** selon le rôle de l'utilisateur :

### Vue AGENT (`AgentAthletesView`)
- **Endpoint** : `GET /me/athletes/`
- **Affichage** : Uniquement les athlètes représentés par l'agent
- **Titre** : "Mes Athlètes"
- **Description** : "Gérez vos athlètes et leurs profils"
- **Barre de recherche** : ❌ **Absente** (pas de filtres)
- **Pagination** : ❌ Désactivée (liste complète)
- **Scroll infini** : ❌ Désactivé
- **Bouton d'action** : "Ajouter un athlète" (désactivé)
- **Empty State** : Message spécifique pour agents sans athlètes

### Vue COLLABORATOR (`CollaboratorAthletesView`)
- **Endpoint** : `GET /athletes/` (avec pagination)
- **Affichage** : Tous les athlètes de la plateforme
- **Titre** : "Tous les Athlètes"
- **Description** : "Découvrez et suivez vos athlètes favoris"
- **Barre de recherche** : ✅ **Présente** (avec 4 filtres)
- **Filtres** : Recherche texte, Sport, Pays, Ville
- **Pagination** : ✅ Active (12 athlètes par page)
- **Scroll infini** : ✅ Activé (IntersectionObserver)
- **Bouton d'action** : "Réinitialiser les filtres" (si filtres actifs)
- **Empty State** : Message adaptatif selon filtres actifs

## 🏗️ Architecture

### Structure des Composants

```
AthletesPage (Main Router)
├── Loading State (spinner)
├── AgentAthletesView (role === "AGENT")
│   ├── Header avec "Ajouter un athlète"
│   ├── Empty State (si 0 athlètes)
│   └── ItemsGrid (liste simple)
│
└── CollaboratorAthletesView (role !== "AGENT")
    ├── Header
    ├── AthleteSearchBar (4 filtres)
    ├── Empty State (adaptatif)
    ├── ItemsGrid (avec filtres)
    ├── Loading More (skeleton)
    └── Sentinel (infinite scroll)
```

### Routage par Rôle

```jsx
export default function AthletesPage() {
  const { role: userRole, isLoading: roleLoading } = useUserRole();

  if (roleLoading) {
    return <LoadingSpinner />;
  }

  // Route vers la vue appropriée
  return userRole === "AGENT" 
    ? <AgentAthletesView /> 
    : <CollaboratorAthletesView />;
}
```

### Vue Agent (Simple)

```jsx
function AgentAthletesView() {
  const [loading, setLoading] = useState(true);
  const [athletes, setAthletes] = useState([]);

  useEffect(() => {
    const loadAthletes = async () => {
      const myAthletes = await athletesAPI.getMyAthletes();
      const results = Array.isArray(myAthletes) 
        ? myAthletes 
        : (myAthletes?.results || []);
      setAthletes(results);
      setLoading(false);
    };
    loadAthletes();
  }, []);

  // Pas de filtres, pas de pagination
  return <ItemsGrid items={athletes} />;
}
```

### Vue Collaborator (Complexe)

```jsx
function CollaboratorAthletesView() {
  const [items, setItems] = useState([]);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [search, setSearch] = useState("");
  const [sport, setSport] = useState("");
  // ... autres états de filtres

  // Chargement initial
  useEffect(() => {
    const response = await getAthletesPage(12, 0);
    setItems(response.results);
    setHasMore(Boolean(response.next));
  }, []);

  // Infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(/* ... */);
    observer.observe(sentinelRef.current);
  }, [offset, hasMore]);

  // Filtrage côté client
  const filteredItems = items.filter(/* ... */);

  return (
    <>
      <AthleteSearchBar {...filterProps} />
      <ItemsGrid items={filteredItems} />
      <div ref={sentinelRef} />
    </>
  );
}
```

### Scroll Infini (IntersectionObserver)

```jsx
useEffect(() => {
  // Désactiver pour les agents
  if (isAgent || !hasMore || loading) return;
  
  // Observer pour charger plus d'athlètes au scroll
  const observer = new IntersectionObserver(async (entries) => {
    if (entries[0].isIntersecting && !fetchingMore) {
      const { results, next } = await getAthletesPage(12, offset);
      setItems(prev => [...prev, ...results]);
      setOffset(prev => prev + results.length);
      setHasMore(Boolean(next));
    }
  }, { rootMargin: "200px" });
  
  observer.observe(sentinelRef.current);
  return () => observer.disconnect();
}, [isAgent, offset, hasMore, fetchingMore, loading]);
```

## 🔍 Filtres et Recherche

Les filtres fonctionnent de manière identique pour tous les rôles :

### Filtres Disponibles
1. **Recherche textuelle** : Nom, sport, ville, pays
2. **Sport** : Dropdown avec liste des sports
3. **Pays** : Dropdown avec liste des pays
4. **Ville** : Dropdown avec liste des villes

### Génération Dynamique
```jsx
const sports = Array.from(new Set(items.map(a => a.sport?.name).filter(Boolean))).sort();
const countries = Array.from(new Set(items.map(a => a.country).filter(Boolean))).sort();
const cities = Array.from(new Set(items.map(a => a.city).filter(Boolean))).sort();
```

### Logique de Filtrage
```jsx
const filteredItems = items.filter(item => {
  const matchSearch = !search || 
    item.name.toLowerCase().includes(search.toLowerCase()) ||
    item.sport?.name.toLowerCase().includes(search.toLowerCase());
  const matchSport = !sport || item.sport?.name === sport;
  const matchCountry = !country || item.country === country;
  const matchCity = !city || item.city === city;
  
  return matchSearch && matchSport && matchCountry && matchCity;
});
```

## 📊 Affichage

### Composant Grid
Utilise le composant `ItemsGrid` pour afficher les cartes d'athlètes :

```jsx
<ItemsGrid items={filteredItems} />
```

### État de Chargement
```jsx
{loading && (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    {[...Array(6)].map((_, i) => (
      <SkeletonItem key={i} />
    ))}
  </div>
)}
```

## 🔗 Navigation Liée

Cette page est liée au système de **navigation intelligente** :
- Si un agent a **1 seul athlète** : le bouton "Mes Athlètes" dans la navbar redirige directement vers `/athletes/{slug}`
- Si un agent a **plusieurs athlètes** : le bouton "Mes Athlètes" redirige vers `/athletes` (cette page)

Voir : [`docs/AGENT_NAVIGATION.md`](./AGENT_NAVIGATION.md)

## 🔧 API Endpoints

### Agent : Get My Athletes
```
GET /me/athletes/
```

**Réponse** :
```json
[
  {
    "id": 1,
    "slug": "teddy-riner",
    "name": "Teddy Riner",
    "full_name": "Teddy Riner",
    "sport": { "name": "Judo" },
    "city": "Paris",
    "country": "France",
    "profile_picture": "...",
    // ... autres champs
  }
]
```

### Collaborateur : Get Athletes (paginated)
```
GET /athletes/?limit=12&offset=0
```

**Réponse** :
```json
{
  "count": 150,
  "next": "http://api.../athletes/?limit=12&offset=12",
  "previous": null,
  "results": [
    {
      "id": 1,
      "slug": "teddy-riner",
      // ... même structure que ci-dessus
    }
  ]
}
```

## 🎨 UI/UX Différences Complètes

| Aspect | Agent (AgentAthletesView) | Collaborateur (CollaboratorAthletesView) |
|--------|---------------------------|------------------------------------------|
| **Composant** | Vue séparée | Vue séparée |
| **Titre** | "Mes Athlètes" | "Tous les Athlètes" |
| **Description** | "Gérez vos athlètes et leurs profils" | "Découvrez et suivez vos athlètes favoris" |
| **Source API** | `GET /me/athletes/` | `GET /athletes/?limit=12&offset=X` |
| **Barre de recherche** | ❌ **Absente** | ✅ **Présente** |
| **Filtres** | ❌ Aucun | ✅ 4 filtres (texte, sport, pays, ville) |
| **Pagination** | ❌ Non (liste complète) | ✅ Oui (12 par page) |
| **Scroll infini** | ❌ Désactivé | ✅ Activé (IntersectionObserver) |
| **Bouton d'action** | "Ajouter un athlète" (désactivé) | "Réinitialiser les filtres" (si filtres actifs) |
| **Empty State** | Message pour ajouter premier athlète | Message adaptatif selon filtres |
| **Padding vertical** | `py-6` (plus d'espace) | `py-6` |
| **Gap entre éléments** | `gap-6` | `gap-4` |

## 🚀 Améliorations Futures

### Pour les Agents
- [ ] Ajouter un bouton "Ajouter un athlète"
- [ ] Afficher des statistiques par athlète (contrats, revenus)
- [ ] Permettre le tri (par nom, date d'ajout, revenus)
- [ ] Ajouter des actions rapides (éditer, voir contrats, analytics)

### Pour tous
- [ ] Filtres avancés (âge, niveau, disponibilité)
- [ ] Vue carte/liste toggle
- [ ] Sauvegarde des filtres dans URL (partage de recherche)
- [ ] Export de la liste (CSV, PDF)

## 🔍 Dépannage

### L'agent ne voit pas ses athlètes
1. Vérifier que le JWT contient `"role": "AGENT"`
2. Vérifier que l'endpoint `/me/athletes/` retourne des données
3. Vérifier la console pour les erreurs API

### Le scroll infini ne fonctionne pas
1. Vérifier que `isAgent === false`
2. Vérifier que `hasMore === true`
3. Vérifier que l'élément sentinel est bien dans le DOM

### Les filtres ne fonctionnent pas
1. Vérifier que les données des athlètes contiennent `sport.name`, `country`, `city`
2. Vérifier la logique de filtrage dans `filteredItems`
3. S'assurer que les dropdowns ont des valeurs valides

## 📝 Notes Techniques

- Utilise `useUserRole()` hook pour lecture instantanée du rôle depuis JWT
- IntersectionObserver avec `rootMargin: "200px"` pour pré-chargement
- Les filtres sont appliqués côté client (pas d'appels API)
- Les listes de filtres (sports, pays, villes) sont générées dynamiquement depuis les données chargées
- Le composant est wrappé dans `SidebarInset` pour cohérence avec le layout
