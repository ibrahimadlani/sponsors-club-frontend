# Refactorisation de la page Followed

## Date
17 octobre 2025

## Objectif
Refactoriser la page `/followed` pour utiliser des composants réutilisables et adapter l'affichage à la nouvelle structure de l'API.

## Structure de l'API

L'endpoint `/api/me/follows/` retourne un tableau d'objets de suivi avec la structure suivante :

```json
[
  {
    "id": "uuid",
    "athlete": {
      "id": "uuid",
      "slug": "athlete-slug",
      "full_name": "Nom complet",
      "country": "Pays",
      "city": "Ville",
      "sport": {
        "id": "uuid",
        "name": "Nom du sport",
        "slug": "sport-slug",
        "emoji": "🏀",
        "category": "TEAM",
        "disciplines": [...]
      },
      "disciplines": [...],
      "nationality": "Nationalité",
      "agent": {
        "id": "uuid",
        "name": "Nom de l'agent",
        "email": "email@example.com",
        "avatar": null
      },
      "followers_count_cached": 6,
      "engagement_rate_cached": "3.01",
      "avatar": null,
      "card_photos": ["/media/path/to/photo.jpg"],
      "gallery_photos": [
        {
          "id": "uuid",
          "image": "/media/path/to/photo.jpg",
          "caption": "Description",
          "position": 0,
          "created_at": "2025-01-21T10:01:00Z"
        }
      ]
    },
    "notify_news": true,
    "notify_stats": true,
    "notify_contracts": true,
    "created_at": "2025-10-17T18:37:27.065499Z"
  }
]
```

## Composants créés

### 1. AthleteCard (`/src/components/athlete-card.jsx`)

Composant réutilisable pour afficher une carte d'athlète.

**Props:**
- `athlete` (Object) : Données de l'athlète
- `onMessageClick` (Function) : Callback pour le bouton message
- `messageLoading` (Boolean) : État de chargement du bouton message
- `compact` (Boolean, optionnel) : Version compacte de la carte

**Fonctionnalités:**
- Affichage de l'avatar (avec fallback sur card_photos et gallery_photos)
- Nom complet de l'athlète (full_name)
- Sport avec emoji
- Localisation (ville, pays)
- Statistiques (abonnés, engagement)
- Boutons d'action (Voir le profil, Message)
- Support du mode compact

**Sources d'avatar (par ordre de priorité):**
1. `athlete.avatar`
2. `athlete.card_photos[0]`
3. `athlete.gallery_photos[0].image`
4. Icône par défaut (User)

### 2. AthleteCardSkeleton (`/src/components/athlete-card-skeleton.jsx`)

Composant de chargement (skeleton) pour AthleteCard.

**Props:**
- `compact` (Boolean, optionnel) : Version compacte du skeleton

**Fonctionnalités:**
- Animation de pulsation
- Adapté à la taille de AthleteCard
- Support du mode compact

## Modifications de la page Followed

### Fichier: `/src/app/(private)/followed/page.jsx`

**Changements principaux:**

1. **Extraction des données athlètes:**
   ```javascript
   const athletesData = response?.map(follow => follow.athlete) || [];
   ```
   L'API retourne des objets de suivi, on extrait uniquement les athlètes.

2. **Utilisation de AthleteCard:**
   - Remplacement du code inline par le composant
   - Passage de `messageLoadingId === athlete.id` pour gérer l'état de chargement individuel

3. **Amélioration du chargement:**
   - Remplacement du simple texte par 3 skeletons
   - Meilleure expérience utilisateur

4. **Suppression du code dupliqué:**
   - Logique d'affichage de l'avatar
   - Gestion des fallbacks
   - Styles et structure

## Avantages

### Réutilisabilité
- AthleteCard peut être utilisé dans d'autres pages (search, recommendations, etc.)
- Code plus maintenable et DRY (Don't Repeat Yourself)

### Cohérence
- Design uniforme à travers l'application
- Gestion centralisée des fallbacks d'avatar
- Logique unique pour les URLs de profil

### Performance
- Skeleton loading améliore la perception de performance
- Composants optimisés avec ResponsiveImage

### Maintenabilité
- Changements de design centralisés dans AthleteCard
- Documentation claire avec JSDoc
- Séparation des responsabilités

## Structure finale

```
src/
├── components/
│   ├── athlete-card.jsx (nouveau)
│   └── athlete-card-skeleton.jsx (nouveau)
└── app/
    └── (private)/
        └── followed/
            └── page.jsx (refactorisé)
```

## API Integration

### Endpoints utilisés:
- `GET /api/me/follows/` - Récupération des athlètes suivis
- `GET /api/messaging/threads/` - Vérification des threads existants
- `POST /api/messaging/threads/` - Création d'un nouveau thread

### Gestion des threads:
1. Vérification si un thread existe avec l'agent de l'athlète
2. Si oui : redirection vers le thread existant
3. Si non : création d'un nouveau thread puis redirection

## Tests suggérés

1. **Affichage:**
   - [ ] Les athlètes s'affichent correctement avec toutes les infos
   - [ ] Les avatars se chargent (fallback fonctionne)
   - [ ] Les emojis de sport s'affichent
   - [ ] Les statistiques sont visibles

2. **Interactions:**
   - [ ] Bouton "Voir le profil" redirige vers la page athlète
   - [ ] Bouton "Message" crée/ouvre un thread
   - [ ] État de chargement s'affiche pendant l'action message
   - [ ] Toast d'erreur si pas d'agent

3. **États:**
   - [ ] Skeleton s'affiche pendant le chargement
   - [ ] Message d'état vide si aucun athlète suivi
   - [ ] Compteur d'athlètes correct

4. **Responsive:**
   - [ ] Boutons s'empilent sur mobile
   - [ ] Cards sont lisibles sur tous les écrans

## Notes

- Le champ `full_name` de l'API est utilisé au lieu de `name`
- Les statistiques (followers_count_cached, engagement_rate_cached) sont maintenant affichées
- Le sport inclut un emoji pour une meilleure UX
- Support complet des disciplines et de la nationalité (prêt pour affichage futur)
