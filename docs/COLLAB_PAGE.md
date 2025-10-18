# Page Collaboration - Documentation

## Date
17 octobre 2025

## Objectif
Créer une page de gestion des collaborations connectée à l'API des contrats.

## API Endpoints utilisés

Basé sur le Swagger API fourni, voici les endpoints utilisés :

### Contrats
- `GET /api/contracts/` - Liste tous les contrats visibles par l'utilisateur
- `GET /api/contracts/{id}/` - Récupère un contrat spécifique
- `POST /api/contracts/` - Crée un nouveau contrat
- `GET /api/contracts/options/` - Métadonnées pour l'interface
- `PATCH /api/contracts/{id}/status/` - Change le statut du contrat
- `POST /api/contracts/{id}/agree/` - Enregistre l'accord de l'utilisateur

### Clauses
- `POST /api/contracts/{id}/clauses/` - Ajoute une clause
- `PATCH /api/contracts/{id}/clauses/{clause_id}/` - Modifie une clause
- `DELETE /api/contracts/{id}/clauses/{clause_id}/` - Supprime une clause

### Révision légale
- `POST /api/contracts/{id}/legal/review/` - Démarre la révision légale
- `PATCH /api/contracts/{id}/legal/verify/` - Complète la révision légale

### Signature
- `POST /api/contracts/{id}/signing/init/` - Initialise le processus de signature
- `GET /api/contracts/{id}/signing/status/` - Statut de la signature

### Versions
- `GET /api/contracts/{id}/versions/` - Historique des versions
- `POST /api/contracts/{id}/revisions/` - Crée une révision
- `POST /api/contracts/{id}/revisions/{revision_id}/accept/` - Accepte une révision

### Export
- `GET /api/contracts/{id}/export/` - Exporte le PDF signé

### Templates de clauses
- `GET /api/clause-templates/` - Liste des templates disponibles

## Structure de données

### Contract Object
```typescript
{
  id: string (UUID)
  organisation: {
    id: string (UUID)
    name: string
  }
  agent: {
    id: string (UUID)
    name: string
  }
  initiated_by: {
    id: string (UUID)
    role: "OWNER" | "MEMBER"
    user_email: string
  }
  status: "draft" | "negotiation" | "agreement" | "legal_review" | "signing" | "active" | "expired" | "terminated"
  status_label: string
  title: string
  effective_date: string (date) | null
  expiration_date: string (date) | null
  owner_agreed_at: string (datetime) | null
  agent_agreed_at: string (datetime) | null
  current_version_number: number
  created_at: string (datetime)
  updated_at: string (datetime)
  clauses: ContractClause[]
  signed_file: string | null
  legal_review: string | null
  signing: string | null
  versions: ContractVersion[]
}
```

### Clause Template Object
```typescript
{
  id: string (UUID)
  category: "legal_obligations" | "financial" | "athlete_obligations" | 
            "organisation_obligations" | "intellectual_property" | 
            "confidentiality" | "performance" | "ethics_morality" | 
            "logistics" | "administrative"
  category_label: string
  title: string
  content: string
  placeholders: object
  is_mandatory: boolean
  version: number
}
```

## Statuts des contrats

| Statut | Label | Description | Couleur | Icône |
|--------|-------|-------------|---------|-------|
| `draft` | Brouillon | Contrat en cours de rédaction | Gris | FileText |
| `negotiation` | Négociation | En phase de négociation | Bleu | MessageSquare |
| `agreement` | Accord | Accord trouvé | Violet | Handshake |
| `legal_review` | Révision légale | En révision par l'équipe légale | Jaune | AlertCircle |
| `signing` | Signature | En attente de signatures | Orange | FileText |
| `active` | Actif | Contrat actif et signé | Vert | CheckCircle2 |
| `expired` | Expiré | Contrat expiré | Gris | Clock |
| `terminated` | Résilié | Contrat résilié | Rouge | XCircle |

## Composants créés

### Page Collab (`/src/app/(private)/collab/page.jsx`)

**Fonctionnalités:**
- Liste de tous les contrats de l'utilisateur
- Filtrage par statut (Tous, Brouillons, En négociation, Actifs, En signature)
- Bouton de création de nouveau contrat
- Skeleton loading pendant le chargement
- État vide avec message d'encouragement
- Navigation mobile avec footer

**Structure:**
```jsx
<CollabPage>
  ├── Header (titre + bouton nouveau contrat)
  ├── Filtres (boutons de filtre par statut)
  ├── Liste des contrats
  │   └── ContractCard (pour chaque contrat)
  └── Footer de navigation mobile
</CollabPage>
```

### ContractCard Component

**Props:**
- `contract` (Object) - Données du contrat

**Affichage:**
- Icône de statut avec couleur
- Titre du contrat
- Badge de statut
- Organisation et agent
- Dates de début et fin
- Version du contrat
- Statut d'accord (organisation/agent)
- Cliquable pour ouvrir le détail

## Filtres disponibles

```javascript
const FILTER_OPTIONS = [
  { value: "all", label: "Tous" },
  { value: "draft", label: "Brouillons" },
  { value: "negotiation", label: "En négociation" },
  { value: "active", label: "Actifs" },
  { value: "signing", label: "En signature" },
];
```

## Gestion d'erreurs

- Toast d'erreur si le chargement échoue
- État vide avec message approprié selon le filtre
- Console.error pour le debugging

## UX Features

### Loading States
- Skeleton cards pendant le chargement
- 3 skeletons animés avec effet de pulsation

### Empty States
- Message personnalisé selon le filtre actif
- Bouton CTA pour créer un contrat (si filtre = "all")
- Icône illustrative (Handshake)

### Visual Feedback
- Hover effect sur les cards
- Badges colorés pour les statuts
- Icônes descriptives
- Dates formatées en français

### Responsive
- Layout adaptatif
- Footer de navigation mobile
- Cards responsives

## Prochaines étapes

### Page de détail du contrat
- [ ] Créer `/collab/[id]/page.jsx`
- [ ] Afficher toutes les clauses
- [ ] Actions selon le statut
- [ ] Historique des versions
- [ ] Commentaires

### Page de création
- [ ] Créer `/collab/new/page.jsx`
- [ ] Formulaire de création
- [ ] Sélection organisation/agent
- [ ] Dates de début/fin
- [ ] Sélection des clauses templates

### Fonctionnalités avancées
- [ ] Notifications en temps réel
- [ ] Export PDF
- [ ] Signature électronique
- [ ] Gestion des révisions
- [ ] Workflow d'approbation
- [ ] Timeline du contrat

## Tests suggérés

### Affichage
- [ ] Liste des contrats chargée correctement
- [ ] Filtres fonctionnent
- [ ] Badges de statut corrects
- [ ] Dates formatées en français
- [ ] Organisation et agent affichés

### Interactions
- [ ] Clic sur card ouvre le détail
- [ ] Bouton "Nouveau contrat" redirige
- [ ] Filtres changent la liste
- [ ] Toast d'erreur si échec API

### États
- [ ] Skeleton pendant chargement
- [ ] Message si aucun contrat
- [ ] Message adapté au filtre actif

### Responsive
- [ ] Footer mobile visible sur petit écran
- [ ] Cards adaptées à la largeur
- [ ] Textes pas coupés

## Notes techniques

### Dépendances
- `shadcn/ui`: Button, Badge, SidebarInset
- `lucide-react`: Icônes
- `sonner`: Toasts
- Next.js: useRouter, Link
- React: useState, useEffect

### API Client
- Import depuis `/lib/api/contracts`
- Fonction `getContracts()` existante
- Gestion des erreurs avec try/catch

### Styling
- Tailwind CSS
- Dark mode supporté
- Couleurs cohérentes avec le design system
- Animation de pulsation pour les skeletons

## Sécurité

- Authentification requise (hook `useCurrentUser`)
- Tokens JWT automatiques
- API endpoints protégés côté serveur
- Validation des permissions côté API

## Performance

- Chargement différé des contrats
- Filtrage côté client (rapide)
- Pas de re-fetch inutile
- Skeleton pour perception rapide
