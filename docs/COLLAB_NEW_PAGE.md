# Page de création de contrat - Documentation

## Date
17 octobre 2025

## Objectif
Permettre aux collaborateurs de créer de nouveaux contrats de partenariat.

## Pages créées

### 1. Page de création (`/collab/new/page.jsx`)

**Route:** `/collab/new`

**Fonctionnalités:**
- Formulaire de création de contrat
- Validation avec React Hook Form + Zod
- Sélection d'organisation
- Sélection d'agent/athlète
- Dates de validité (optionnelles)
- Description du contrat (optionnelle)
- Gestion des états de chargement
- Navigation retour

**Champs du formulaire:**

| Champ | Type | Obligatoire | Description |
|-------|------|-------------|-------------|
| `title` | String | ✅ | Titre du contrat (min 3 caractères) |
| `organisation_id` | UUID | ✅ | Organisation partie au contrat |
| `agent_id` | UUID | ✅ | Agent/Athlète partie au contrat |
| `effective_date` | Date | ❌ | Date de début du contrat |
| `expiration_date` | Date | ❌ | Date de fin du contrat |
| `description` | Text | ❌ | Description libre du contrat |

**Validation Zod:**
```typescript
const contractSchema = z.object({
  title: z.string().min(3, "Le titre doit contenir au moins 3 caractères"),
  organisation_id: z.string().uuid("Veuillez sélectionner une organisation"),
  agent_id: z.string().uuid("Veuillez sélectionner un agent/athlète"),
  effective_date: z.string().optional(),
  expiration_date: z.string().optional(),
  description: z.string().optional(),
});
```

**API Endpoints utilisés:**
- `GET /organisations/` - Liste des organisations disponibles (récupère l'organisation du collaborateur)
- `GET /athletes/` - Liste des athlètes disponibles (pour récupérer leurs agents)
- `POST /contracts/` - Création du contrat

**Payload de création:**
```json
{
  "title": "Contrat de sponsoring 2025",
  "organisation_id": "uuid-organisation",
  "agent_id": "uuid-agent",
  "effective_date": "2025-01-01",
  "expiration_date": "2025-12-31"
}
```

**Structure du formulaire:**

```jsx
<Form>
  {/* Section 1: Informations générales */}
  <Card>
    - Titre du contrat (*)
    - Description (optionnel)
  </Card>

  {/* Section 2: Parties du contrat */}
  <Card>
    - Organisation (*)
    - Agent/Athlète (*)
  </Card>

  {/* Section 3: Période de validité */}
  <Card>
    - Date de début (optionnel)
    - Date de fin (optionnel)
  </Card>

  {/* Actions */}
  <Actions>
    - Bouton Annuler
    - Bouton Créer le contrat
  </Actions>
</Form>
```

**États de chargement:**
- `loadingOrgs`: Chargement des organisations
- `loadingAthletes`: Chargement des athlètes
- `submitting`: Soumission du formulaire

**Gestion des erreurs:**
- Toast d'erreur si chargement échoue
- Messages de validation inline
- Bordures rouges sur champs invalides
- Désactivation du bouton submit pendant chargement

**Flow après création:**
1. Validation du formulaire
2. Appel API `createContract(data)`
3. Toast de succès
4. Redirection vers `/collab/{newContractId}`

### 2. Page de détail (`/collab/[id]/page.jsx`)

**Route:** `/collab/[id]`

**Fonctionnalités:**
- Affichage complet du contrat
- Informations sur les parties
- Liste des clauses
- Actions contextuelles selon le statut
- Export PDF
- Validation/Accord
- Édition (si statut le permet)

**Sections:**

#### Header
- Bouton retour
- Titre du contrat
- Badge de statut
- Boutons d'action (Export, Modifier)

#### Cartes principales (3 colonnes)
1. **Organisation**
   - Nom de l'organisation
   - Statut d'accord (si signé)

2. **Agent**
   - Nom de l'agent
   - Statut d'accord (si signé)

3. **Période**
   - Date de début
   - Date de fin

#### Section Clauses
- Liste de toutes les clauses
- Numéro de clause
- Badge "Obligatoire" si nécessaire
- Titre et contenu
- Bouton suppression (si non obligatoire et éditable)
- Bouton "Ajouter une clause" (si éditable)

#### Section Validation (si statut = "agreement")
- Message d'information
- Bouton "Donner mon accord"
- Dialog de confirmation

#### Footer
- Informations de version
- Dates de création/modification

**Actions disponibles selon le statut:**

| Statut | Actions possibles |
|--------|-------------------|
| `draft` | Modifier, Ajouter clauses, Supprimer clauses, Export |
| `negotiation` | Modifier, Ajouter clauses, Supprimer clauses, Export |
| `agreement` | Donner accord, Export |
| `legal_review` | Export |
| `signing` | Export |
| `active` | Export |
| `expired` | Export |
| `terminated` | Export |

**API Endpoints utilisés:**
- `GET /contracts/{id}/` - Récupération du contrat
- `PATCH /contracts/{id}/status/` - Changement de statut
- `POST /contracts/{id}/agree/` - Enregistrement de l'accord
- `GET /contracts/{id}/export/` - Export PDF

**Conditions d'édition:**
```javascript
const canEdit = contract.status === "draft" || contract.status === "negotiation";
const canAgree = contract.status === "agreement" && 
  (!contract.owner_agreed_at || !contract.agent_agreed_at);
```

**Dialog de confirmation d'accord:**
```jsx
<AlertDialog>
  <AlertDialogTrigger>
    Donner mon accord
  </AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogTitle>Confirmer l'accord</AlertDialogTitle>
    <AlertDialogDescription>
      Vous confirmez avoir lu et accepté les termes...
    </AlertDialogDescription>
    <AlertDialogFooter>
      <AlertDialogCancel>Annuler</AlertDialogCancel>
      <AlertDialogAction onClick={handleAgree}>
        Confirmer
      </AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
```

## Workflow complet

### Création d'un contrat
```mermaid
graph TD
    A[Clic "Nouveau contrat"] --> B[Page /collab/new]
    B --> C[Remplir formulaire]
    C --> D{Validation}
    D -->|Erreur| C
    D -->|Succès| E[Appel API createContract]
    E --> F[Toast succès]
    F --> G[Redirection /collab/{id}]
```

### Validation du contrat
```mermaid
graph TD
    A[Page détail contrat] --> B{Statut = agreement?}
    B -->|Non| C[Afficher actions standard]
    B -->|Oui| D[Afficher bouton accord]
    D --> E[Clic "Donner mon accord"]
    E --> F[Dialog de confirmation]
    F -->|Annuler| A
    F -->|Confirmer| G[Appel agreeToContract]
    G --> H[Mise à jour contrat]
    H --> I[Toast succès]
```

## Permissions et rôles

### Collaborateur
- ✅ Peut créer des contrats
- ✅ Peut modifier les contrats en brouillon/négociation
- ✅ Peut donner son accord
- ✅ Peut ajouter/supprimer des clauses
- ✅ Peut exporter les contrats

### Agent
- ✅ Peut voir les contrats le concernant
- ✅ Peut donner son accord
- ✅ Peut exporter les contrats
- ❌ Ne peut pas créer de contrats
- ❌ Ne peut pas modifier les clauses

## Composants utilisés

### shadcn/ui
- `Button` - Actions et navigation
- `Input` - Saisie de texte
- `Textarea` - Description longue
- `Label` - Labels de formulaire
- `Select` - Sélection d'organisation/agent
- `Badge` - Statuts et indicateurs
- `AlertDialog` - Confirmation d'accord
- `SidebarInset` - Layout de page

### React Hook Form
- `useForm` - Gestion du formulaire
- `register` - Enregistrement des champs
- `handleSubmit` - Soumission
- `watch` - Observation des valeurs
- `setValue` - Modification programmatique
- `formState.errors` - Erreurs de validation

### Zod
- Schema de validation
- Messages d'erreur personnalisés
- Validation UUID

### Lucide Icons
- `ArrowLeft` - Navigation retour
- `Building2` - Organisation
- `User` - Agent/Athlète
- `Calendar` - Dates
- `FileText` - Document/Contrat
- `Plus` - Ajouter
- `Edit` - Modifier
- `Download` - Export
- `CheckCircle2` - Accord/Validation
- `Trash2` - Supprimer
- `Loader2` - Chargement

## États et gestion

### Page de création
```javascript
const [organisations, setOrganisations] = useState([]);
const [athletes, setAthletes] = useState([]);
const [loadingOrgs, setLoadingOrgs] = useState(true);
const [loadingAthletes, setLoadingAthletes] = useState(true);
const [submitting, setSubmitting] = useState(false);
```

### Page de détail
```javascript
const [contract, setContract] = useState(null);
const [loading, setLoading] = useState(true);
const [actionLoading, setActionLoading] = useState(false);
```

## Tests suggérés

### Page de création
- [ ] Validation du titre (min 3 caractères)
- [ ] Validation organisation requise
- [ ] Validation agent requis
- [ ] Dates optionnelles
- [ ] Liste organisations chargée
- [ ] Liste athlètes chargée
- [ ] Submit disabled pendant chargement
- [ ] Toast succès après création
- [ ] Redirection vers détail
- [ ] Toast erreur si échec API
- [ ] Bouton annuler fonctionne
- [ ] Champs invalides en rouge

### Page de détail
- [ ] Contrat chargé correctement
- [ ] Statut affiché avec badge
- [ ] Organisation affichée
- [ ] Agent affiché
- [ ] Dates formatées
- [ ] Clauses listées
- [ ] Bouton modifier visible si éditable
- [ ] Bouton accord visible si status agreement
- [ ] Dialog confirmation fonctionne
- [ ] Accord enregistré
- [ ] Toast succès/erreur
- [ ] Export PDF fonctionne
- [ ] Navigation retour fonctionne

## Sécurité

- ✅ Authentification requise (hook `useCurrentUser`)
- ✅ Validation côté client (Zod)
- ✅ Validation côté serveur (API Django)
- ✅ Tokens JWT automatiques
- ✅ Permissions vérifiées côté API
- ✅ UUID validation
- ✅ CSRF protection

## Performance

- ⚡ Chargement parallèle orgs/athletes
- ⚡ Validation instantanée
- ⚡ États de chargement visuels
- ⚡ Pas de re-fetch inutile
- ⚡ Navigation optimisée

## Prochaines étapes

### Fonctionnalités à ajouter
- [ ] Page d'édition (`/collab/[id]/edit`)
- [ ] Gestion des clauses (`/collab/[id]/clauses`)
- [ ] Historique des versions
- [ ] Commentaires
- [ ] Notifications
- [ ] Workflow d'approbation
- [ ] Signature électronique
- [ ] Templates de contrat
- [ ] Recherche/Filtrage avancé
- [ ] Statistiques

### Améliorations UX
- [ ] Auto-save
- [ ] Validation temps réel
- [ ] Suggestions de titre
- [ ] Preview avant création
- [ ] Drag & drop des clauses
- [ ] Comparaison de versions
- [ ] Timeline du contrat

## Notes techniques

### Formats de dates
- Input: `YYYY-MM-DD`
- Affichage: `jour mois année` (ex: "15 janvier 2025")
- Timezone: UTC

### Gestion des erreurs API
```javascript
try {
  // API call
} catch (error) {
  console.error("Error:", error);
  toast.error(
    error.response?.data?.detail || 
    "Message d'erreur par défaut"
  );
}
```

### Navigation programmatique
```javascript
router.push("/collab");        // Liste
router.push(`/collab/${id}`);  // Détail
router.back();                 // Retour
```
