# Fonctionnalité : Sélection Agent vs Athlète Auto-représenté

## Vue d'ensemble

Le formulaire de création d'athlète (`/onboarding/athlete`) permet désormais aux utilisateurs de spécifier s'ils sont :
- **Agent** : Créant le profil d'un athlète qu'ils représentent
- **Athlète** : Créant leur propre profil (auto-représentation)

Cette information est stockée dans le champ `is_self_represented` du profil agent.

## Interface Utilisateur

### Composant Ajouté

Un composant `Tabs` a été ajouté au **Step 1** (Informations personnelles) du formulaire :

```jsx
<Tabs 
  value={isSelfRepresented ? "athlete" : "agent"} 
  onValueChange={(value) => setIsSelfRepresented(value === "athlete")} 
  className="w-full"
>
  <TabsList className="w-full grid grid-cols-2">
    <TabsTrigger value="agent" className="flex items-center gap-2">
      <Briefcase className="w-4 h-4" />
      Agent
    </TabsTrigger>
    <TabsTrigger value="athlete" className="flex items-center gap-2">
      <UserCircle className="w-4 h-4" />
      Athlète
    </TabsTrigger>
  </TabsList>
</Tabs>
```

### Position dans le Formulaire

```
┌─────────────────────────────────────────────┐
│  STEP 1 : Informations personnelles         │
├─────────────────────────────────────────────┤
│                                              │
│  Je suis un                                  │
│  ┌──────────────┬──────────────┐           │
│  │ 💼 Agent     │ 👤 Athlète   │           │
│  └──────────────┴──────────────┘           │
│  "Vous créez le profil d'un athlète..."     │
│                                              │
│  ───────────────────────────────            │
│                                              │
│  Nom complet *                               │
│  ┌────────────────────────────┐             │
│  │ Ex: Marie Dupont           │             │
│  └────────────────────────────┘             │
│                                              │
│  ... (reste du formulaire)                   │
└─────────────────────────────────────────────┘
```

### Message Contextuel

Le message affiché change selon la sélection :
- **Agent sélectionné** : "Vous créez le profil d'un athlète que vous représentez"
- **Athlète sélectionné** : "Vous créez votre propre profil d'athlète"

## Implémentation Technique

### 1. Modifications du Schéma Zod

```javascript
const createAthleteSchema = z.object({
  is_self_represented: z.boolean().default(false),
  sport_id: z.string().uuid("Veuillez sélectionner un sport"),
  full_name: z.string().min(1, "Le nom complet est requis"),
  // ... autres champs
});
```

### 2. État Local

```javascript
const [isSelfRepresented, setIsSelfRepresented] = useState(false);
```

### 3. Synchronisation avec React Hook Form

```javascript
useEffect(() => {
  form.setValue("is_self_represented", isSelfRepresented, { shouldValidate: true });
}, [isSelfRepresented, form]);
```

### 4. Valeurs par Défaut

```javascript
const form = useForm({
  resolver: zodResolver(createAthleteSchema),
  defaultValues: {
    is_self_represented: false,  // Défaut : Agent
    social_links: { /* ... */ },
    discipline_ids: [],
  },
});
```

### 5. Imports Nécessaires

```javascript
import { Briefcase, UserCircle } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
```

## Données Envoyées à l'API

Lors de la création d'un athlète, le payload inclut maintenant :

```json
{
  "is_self_represented": true,  // ou false
  "sport_id": "uuid-sport",
  "full_name": "Marie Dupont",
  "birth_date": "1995-06-15",
  "nationality": "Française",
  "country": "France",
  "city": "Paris",
  "bio": "...",
  "discipline_ids": ["uuid-1", "uuid-2"],
  "social_links": {
    "instagram": "https://instagram.com/...",
    "twitter": "https://twitter.com/..."
  }
}
```

## Correspondance Backend Django

### Modèle `AgentProfile`

```python
class AgentProfile(BaseModel):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="agent_profile")
    bio = models.TextField(blank=True)
    is_self_represented = models.BooleanField(default=False)
```

### Valeurs

- `is_self_represented = False` → L'utilisateur est un **agent** traditionnel
- `is_self_represented = True` → L'utilisateur est un **athlète auto-représenté**

## Cas d'Usage

### Scénario 1 : Agent Traditionnel
**Profil** : Jean Dupont est un agent sportif qui gère plusieurs athlètes.

**Action** :
1. Sélectionne **"Agent"** dans le tab
2. Remplit les informations de son athlète (ex: "Marie Martin")
3. `is_self_represented = false`

**Résultat** :
- Le profil créé est celui de Marie Martin
- Jean peut créer d'autres profils d'athlètes par la suite

### Scénario 2 : Athlète Auto-représenté
**Profil** : Sophie Durand est une athlète qui gère sa propre carrière.

**Action** :
1. Sélectionne **"Athlète"** dans le tab
2. Remplit ses propres informations
3. `is_self_represented = true`

**Résultat** :
- Le profil créé est celui de Sophie elle-même
- Sophie peut gérer directement son profil

## Flux Complet

```
INSCRIPTION (Agent)
    ↓
PROFIL PERSONNEL (/onboarding)
    ↓
CRÉATION ATHLÈTE (/onboarding/athlete)
    ↓
┌─────────────────────────────┐
│ Je suis un                  │
│ [Agent] [Athlète]           │
└─────────────────────────────┘
    ↓
    ├─→ Agent (is_self_represented=false)
    │   → Crée le profil d'un athlète représenté
    │
    └─→ Athlète (is_self_represented=true)
        → Crée son propre profil
    ↓
DASHBOARD (/dashboard)
```

## UI/UX Design

### Icônes Utilisées
- **Agent** : `Briefcase` (💼) - Symbole professionnel
- **Athlète** : `UserCircle` (👤) - Symbole personnel

### Couleurs et États
- Tab actif : `bg-primary text-primary-foreground`
- Tab inactif : `bg-transparent`
- Transition smooth au changement

### Responsive Design
```css
grid-cols-2  /* Les deux tabs prennent 50% de la largeur */
```

## Validation et Erreurs

### Aucune Validation Requise
Le champ `is_self_represented` a une valeur par défaut (`false`), donc aucune erreur de validation n'est possible.

### Backend Validation
Le backend Django accepte ce champ comme booléen optionnel avec valeur par défaut.

## Tests Recommandés

### Test 1 : Sélection Agent
- [ ] Sélectionner "Agent"
- [ ] Vérifier que le message affiche "Vous créez le profil d'un athlète que vous représentez"
- [ ] Créer l'athlète
- [ ] Vérifier dans la BDD que `is_self_represented = false`

### Test 2 : Sélection Athlète
- [ ] Sélectionner "Athlète"
- [ ] Vérifier que le message affiche "Vous créez votre propre profil d'athlète"
- [ ] Créer l'athlète
- [ ] Vérifier dans la BDD que `is_self_represented = true`

### Test 3 : Changement de Sélection
- [ ] Sélectionner "Agent"
- [ ] Changer pour "Athlète"
- [ ] Vérifier que le message s'actualise
- [ ] Créer l'athlète
- [ ] Vérifier que la dernière sélection est prise en compte

### Test 4 : Valeur par Défaut
- [ ] Ouvrir le formulaire
- [ ] Vérifier que "Agent" est sélectionné par défaut
- [ ] Créer sans changer
- [ ] Vérifier que `is_self_represented = false`

## Évolutions Futures Possibles

### 1. Modification du Texte selon le Contexte
Si `is_self_represented = true`, adapter les labels :
- "Nom complet" → "Votre nom complet"
- "Date de naissance" → "Votre date de naissance"

### 2. Restrictions pour Athlètes Auto-représentés
Limiter à 1 seul profil d'athlète si `is_self_represented = true`

### 3. Badge dans le Dashboard
Afficher un badge "Auto-représenté" pour distinguer les athlètes

### 4. Analytics
Tracker le ratio Agent/Athlète pour comprendre l'usage de la plateforme

## Changelog

### Version 1.0.0 - 17 octobre 2025
- ✅ Ajout du tab Agent/Athlète dans le formulaire de création
- ✅ Ajout du champ `is_self_represented` au schéma
- ✅ Synchronisation avec React Hook Form
- ✅ Message contextuel dynamique
- ✅ Séparateur visuel pour clarifier les sections
- ✅ Icônes Briefcase et UserCircle
- ✅ Documentation complète

---

**Fichier modifié** : `/src/components/forms/athlete-onboarding-form.jsx`  
**Dernière mise à jour** : 17 octobre 2025
