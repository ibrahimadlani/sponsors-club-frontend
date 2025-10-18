# Organisation automatique pour la création de contrats

## Date
17 octobre 2025

## Objectif
Simplifier la création de contrats en utilisant automatiquement l'organisation de l'utilisateur connecté au lieu d'un sélecteur.

## Modification apportée

### Avant
- Formulaire avec sélecteur d'organisation
- L'utilisateur devait choisir son organisation dans une liste
- Champ `organisation_id` obligatoire dans le formulaire

### Après
- L'organisation est automatiquement récupérée depuis le compte de l'utilisateur
- Affichage en lecture seule du nom de l'organisation
- Pas de sélection possible (une seule organisation par collaborateur)

## Changements techniques

### 1. Schema de validation (`contractSchema`)

**Avant:**
```javascript
const contractSchema = z.object({
  title: z.string().min(3, "Le titre doit contenir au moins 3 caractères"),
  organisation_id: z.string().uuid("Veuillez sélectionner une organisation"),  // ❌ Retiré
  agent_id: z.string().uuid("Veuillez sélectionner un agent/athlète"),
  effective_date: z.string().optional(),
  expiration_date: z.string().optional(),
  description: z.string().optional(),
});
```

**Après:**
```javascript
const contractSchema = z.object({
  title: z.string().min(3, "Le titre doit contenir au moins 3 caractères"),
  // organisation_id retiré du schema de validation
  agent_id: z.string().uuid("Veuillez sélectionner un agent/athlète"),
  effective_date: z.string().optional(),
  expiration_date: z.string().optional(),
  description: z.string().optional(),
});
```

### 2. États du composant

**Avant:**
```javascript
const [organisations, setOrganisations] = useState([]);  // Liste d'organisations
const [loadingOrgs, setLoadingOrgs] = useState(true);
```

**Après:**
```javascript
const [organisation, setOrganisation] = useState(null);  // Une seule organisation
const [loadingOrg, setLoadingOrg] = useState(true);
```

### 3. Chargement de l'organisation

**Logique:**
```javascript
useEffect(() => {
  const fetchOrganisation = async () => {
    try {
      setLoadingOrg(true);
      // Récupère la liste des organisations de l'utilisateur
      const data = await getOrganisations();
      const orgList = Array.isArray(data) ? data : data?.results ?? [];
      
      // Prend la première organisation (un collaborateur n'en a qu'une)
      const userOrg = orgList[0] ?? null;
      setOrganisation(userOrg);
      
      // Alerte si aucune organisation
      if (!userOrg) {
        toast.error("Vous devez être associé à une organisation pour créer un contrat");
      }
    } catch (error) {
      console.error("Error fetching organisation:", error);
      toast.error("Erreur lors du chargement de votre organisation");
    } finally {
      setLoadingOrg(false);
    }
  };

  fetchOrganisation();
}, []);
```

### 4. Interface utilisateur

**Avant (Select):**
```jsx
<Select
  value={selectedOrgId}
  onValueChange={(value) => setValue("organisation_id", value)}
>
  <SelectTrigger>
    <SelectValue placeholder="Sélectionnez une organisation" />
  </SelectTrigger>
  <SelectContent>
    {organisations.map((org) => (
      <SelectItem key={org.id} value={org.id}>
        {org.name}
      </SelectItem>
    ))}
  </SelectContent>
</Select>
```

**Après (Affichage en lecture seule):**
```jsx
<div className="space-y-2">
  <Label>Organisation</Label>
  {loadingOrg ? (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <Loader2 className="w-4 h-4 animate-spin" />
      Chargement de votre organisation...
    </div>
  ) : organisation ? (
    <div className="flex items-center gap-2 px-3 py-2 bg-muted/50 rounded-md border">
      <Building2 className="w-4 h-4 text-muted-foreground" />
      <span className="font-medium">{organisation.name}</span>
    </div>
  ) : (
    <div className="px-3 py-2 bg-red-50 dark:bg-red-950/20 rounded-md border border-red-200 dark:border-red-900">
      <p className="text-sm text-red-600 dark:text-red-400">
        Aucune organisation associée à votre compte
      </p>
    </div>
  )}
</div>
```

### 5. Soumission du formulaire

**Avant:**
```javascript
const onSubmit = async (data) => {
  const newContract = await createContract({
    title: data.title,
    organisation_id: data.organisation_id,  // Depuis le formulaire
    agent_id: data.agent_id,
    // ...
  });
};
```

**Après:**
```javascript
const onSubmit = async (data) => {
  // Vérification préalable
  if (!organisation?.id) {
    toast.error("Aucune organisation associée à votre compte");
    return;
  }

  const newContract = await createContract({
    title: data.title,
    organisation_id: organisation.id,  // Depuis l'état du composant
    agent_id: data.agent_id,
    // ...
  });
};
```

### 6. Désactivation du bouton submit

**Avant:**
```jsx
<Button
  type="submit"
  disabled={submitting || loadingOrgs || loadingAthletes}
>
  Créer le contrat
</Button>
```

**Après:**
```jsx
<Button
  type="submit"
  disabled={submitting || loadingOrg || loadingAthletes || !organisation}
>
  Créer le contrat
</Button>
```

**Conditions de désactivation:**
- `submitting`: Formulaire en cours de soumission
- `loadingOrg`: Chargement de l'organisation
- `loadingAthletes`: Chargement des athlètes
- `!organisation`: Aucune organisation disponible ⚠️ **NOUVEAU**

## États possibles

### 1. Chargement initial
```
┌─────────────────────────────┐
│ Organisation                │
│ ⟳ Chargement de votre       │
│   organisation...           │
└─────────────────────────────┘
```

### 2. Organisation trouvée
```
┌─────────────────────────────┐
│ Organisation                │
│ 🏢 SponsorsClub SAS         │
└─────────────────────────────┘
```

### 3. Aucune organisation
```
┌─────────────────────────────┐
│ Organisation                │
│ ⚠️ Aucune organisation      │
│    associée à votre compte  │
└─────────────────────────────┘
[Créer le contrat] ← Bouton désactivé
```

## Avantages

### ✅ Simplicité
- Moins de clics pour l'utilisateur
- Pas de risque de sélectionner la mauvaise organisation
- Interface plus épurée

### ✅ Cohérence
- Un collaborateur = une organisation
- Reflète la structure de données backend
- Évite les erreurs de sélection

### ✅ Sécurité
- L'utilisateur ne peut créer un contrat que pour son organisation
- Validation automatique de l'appartenance

### ✅ UX améliorée
- Moins de confusion pour l'utilisateur
- Affichage clair de l'organisation concernée
- Messages d'erreur explicites si problème

## Tests suggérés

### Scénarios à tester

- [ ] **Chargement normal**
  - Utilisateur avec organisation
  - Organisation affichée correctement
  - Bouton submit activé après chargement

- [ ] **Utilisateur sans organisation**
  - Message d'erreur affiché
  - Bouton submit désactivé
  - Toast d'erreur visible

- [ ] **Erreur de chargement**
  - API en erreur
  - Toast d'erreur affiché
  - Bouton submit désactivé

- [ ] **Soumission du formulaire**
  - Contrat créé avec la bonne organisation
  - Redirection vers la page de détail
  - Toast de succès

- [ ] **États de chargement**
  - Spinner visible pendant chargement
  - Bouton désactivé pendant chargement
  - Affichage correct après chargement

## Compatibilité

### API utilisée
- `GET /organisations/` - Récupère les organisations du collaborateur
- `POST /contracts/` - Crée le contrat avec `organisation_id`

### Prérequis
- L'utilisateur doit être un **COLLABORATOR**
- Le collaborateur doit être associé à **une organisation**
- L'organisation doit être active

## Impact sur la documentation

### Fichiers à mettre à jour
- ✅ `/docs/COLLAB_NEW_PAGE.md` - Mettre à jour la section "Organisation"
- ✅ `/docs/COLLAB_NEW_ORG_AUTO.md` - Ce fichier (nouvelle documentation)
- ⚠️ Tests fonctionnels à adapter

### Payload de création (inchangé)
```json
{
  "title": "Contrat de sponsoring 2025",
  "organisation_id": "uuid-automatique",  // ← Récupéré automatiquement
  "agent_id": "uuid-athlete",
  "effective_date": "2025-01-01",
  "expiration_date": "2025-12-31"
}
```

## Migration

### Pour les utilisateurs existants
- ✅ Aucun impact - comportement transparent
- ✅ Les anciens contrats restent inchangés
- ✅ Amélioration de l'UX uniquement

### Pour les développeurs
- Retirer tout code utilisant `selectedOrgId` ou `organisations` (tableau)
- Utiliser `organisation` (objet unique) et `loadingOrg`
- Adapter les tests unitaires

## Prochaines étapes possibles

### Améliorations futures
- [ ] Afficher des infos supplémentaires sur l'organisation (logo, description)
- [ ] Permettre de créer une organisation si inexistante
- [ ] Lien vers les paramètres d'organisation
- [ ] Gestion multi-organisations (si besoin futur)

### Fonctionnalités connexes
- [ ] Page de gestion d'organisation (`/settings/organisation`)
- [ ] Invitation de collaborateurs
- [ ] Changement d'organisation (cas rare)
