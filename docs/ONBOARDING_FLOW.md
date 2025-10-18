# Flux d'Onboarding Multi-Étapes

## Vue d'ensemble

Le processus d'onboarding se déroule en 2 étapes principales, avec une redirection automatique selon le type d'utilisateur.

## Architecture du Flux

```
┌─────────────────────────────────────────────────────────────────┐
│                         REGISTRATION                             │
│                      /register (Public)                          │
│                                                                   │
│  • Informations de base (email, nom, prénom)                    │
│  • Choix du type de compte : AGENT ou COLLABORATOR              │
│  • Création du compte                                            │
│  • Auto-login automatique                                        │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ↓
┌─────────────────────────────────────────────────────────────────┐
│                    ÉTAPE 1 : PROFIL PERSONNEL                    │
│                      /onboarding (Private)                       │
│                                                                   │
│  • Photo de profil (avatar)                                      │
│  • Date de naissance                                             │
│  • Genre (Homme/Femme/Non-binaire)                              │
│  • Pays (ISO 3166-1 alpha-2)                                    │
│  • Langue préférée (ISO 639-1)                                  │
│                                                                   │
│  [Continuer →] ou [Passer cette étape]                          │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ↓
              ┌──────────┴──────────┐
              │                     │
              ↓                     ↓
┌──────────────────────┐  ┌──────────────────────┐
│    TYPE: AGENT       │  │ TYPE: COLLABORATOR   │
└──────────┬───────────┘  └──────────┬───────────┘
           │                         │
           ↓                         ↓
┌─────────────────────────────────────────────────────────────────┐
│              ÉTAPE 2A : CRÉATION D'UN ATHLÈTE                    │
│                 /onboarding/athlete (Private)                    │
│                     [Pour les AGENTS]                            │
│                                                                   │
│  • Informations de l'athlète                                     │
│  • Sport et spécialité                                           │
│  • Réseaux sociaux                                               │
│  • Médias et portfolio                                           │
│                                                                   │
│  → Redirection : /dashboard                                      │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│            ÉTAPE 2B : REJOINDRE/CRÉER UNE ORGANISATION          │
│              /onboarding/organisation (Private)                  │
│                  [Pour les COLLABORATORS]                        │
│                                                                   │
│  Option 1: Rejoindre une organisation existante                 │
│    • Code d'invitation (6 caractères)                           │
│                                                                   │
│  Option 2: Créer une nouvelle organisation                      │
│    • Nom, type, industrie                                       │
│    • Informations de contact                                     │
│    • Détails supplémentaires                                     │
│                                                                   │
│  → Redirection : /athletes                                       │
└─────────────────────────────────────────────────────────────────┘
```

## Détails par Type d'Utilisateur

### 👨‍💼 AGENT (Agent Sportif)

**Parcours complet :**
1. ✅ Inscription → `/register`
2. ✅ Auto-login automatique
3. ✅ Profil personnel → `/onboarding`
4. ✅ Création du premier athlète → `/onboarding/athlete`
5. ✅ Accès au dashboard → `/dashboard`

**Particularités :**
- Un agent peut gérer plusieurs athlètes
- Le premier athlète doit être créé lors de l'onboarding
- Accès complet aux fonctionnalités de gestion d'athlètes

### 🤝 COLLABORATOR (Collaborateur de Marque/Organisation)

**Parcours complet :**
1. ✅ Inscription → `/register`
2. ✅ Auto-login automatique
3. ✅ Profil personnel → `/onboarding`
4. ✅ Rejoindre/Créer une organisation → `/onboarding/organisation`
5. ✅ Accès à la liste des athlètes → `/athletes`

**Particularités :**
- Doit obligatoirement être rattaché à une organisation
- Peut rejoindre une organisation existante avec un code d'invitation
- Peut créer une nouvelle organisation si nécessaire
- Accès aux fonctionnalités de recherche et matching d'athlètes

## Composants Impliqués

### 1. `register-form.jsx`
- **Route :** `/register`
- **Responsabilités :**
  - Collecte des informations de base
  - Sélection du type de compte (AGENT/COLLABORATOR)
  - Création du compte utilisateur
  - Auto-login avec gestion des tokens
  - Redirection vers `/onboarding`

### 2. `onboarding-form.jsx`
- **Route :** `/onboarding`
- **Responsabilités :**
  - Collecte des informations personnelles
  - Upload de l'avatar (multipart/form-data)
  - Mise à jour du profil utilisateur via API
  - **Redirection conditionnelle :**
    - AGENT → `/onboarding/athlete`
    - COLLABORATOR → `/onboarding/organisation`

### 3. `athlete-onboarding-form.jsx`
- **Route :** `/onboarding/athlete`
- **Type :** AGENT uniquement
- **Responsabilités :**
  - Création du premier profil d'athlète
  - Collecte des informations sportives
  - Redirection vers `/dashboard` après succès

### 4. `organisation-onboarding-form.jsx`
- **Route :** `/onboarding/organisation`
- **Type :** COLLABORATOR uniquement
- **Responsabilités :**
  - Option 1 : Rejoindre via code d'invitation
  - Option 2 : Créer une nouvelle organisation
  - Redirection vers `/athletes` après succès

## Gestion des Données

### API Endpoints Utilisés

```javascript
// Étape 1 : Profil personnel
userEndpoints.me()                    // GET /api/users/me/
userEndpoints.partialUpdateMe(data)   // PATCH /api/users/me/

// Étape 2A : Athlète (AGENT)
athletesEndpoints.create(data)        // POST /api/athletes/

// Étape 2B : Organisation (COLLABORATOR)
joinOrganisation(code)                // POST /api/organisations/join/
createOrganisation(data)              // POST /api/organisations/
```

### Format des Données

#### Profil Personnel
```javascript
{
  avatar: File,                    // Image file (multipart/form-data)
  date_of_birth: "YYYY-MM-DD",    // Format ISO
  gender: "MALE" | "FEMALE" | "NON_BINARY",
  country: "FR",                   // ISO 3166-1 alpha-2
  language: "fr"                   // ISO 639-1
}
```

#### Genre (Mapping)
- Frontend : `"MALE"`, `"FEMALE"`, `"NON_BINARY"`
- Backend Django : `User.Gender.MALE`, `User.Gender.FEMALE`, `User.Gender.NON_BINARY`

## Comportements Spéciaux

### Bouton "Passer cette étape"
- **Étape 1 :** Redirige directement vers l'étape 2 correspondante sans sauvegarder
- Permet de compléter le profil plus tard via `/settings`

### Auto-Login Après Inscription
- Utilise `window.location.href` au lieu de `router.push()`
- Garantit que les tokens localStorage sont correctement chargés
- Délai de 100ms avant redirection pour la synchronisation

### Gestion des Tokens
```javascript
localStorage.setItem("access_token", data.access_token);
localStorage.setItem("refresh_token", data.refresh_token);
```

## États de Chargement

### Étape 1 : Onboarding Form
```javascript
const [loading, setLoading] = useState(false);
const [user, setUser] = useState(null);
const [gender, setGender] = useState("MALE");
const [dateOfBirth, setDateOfBirth] = useState(null);
const [avatarPreview, setAvatarPreview] = useState(null);
const [avatarFile, setAvatarFile] = useState(null);
```

### Délai de Chargement API
```javascript
// Attendre que le token soit disponible
await new Promise(resolve => setTimeout(resolve, 200));
const userData = await userEndpoints.me();
```

## UX / Messages Utilisateur

### Indicateurs de Progression
- **Étape 1 :** "Étape 1/2 : Complétez votre profil personnel"
- **Bouton Principal :**
  - AGENT : "Continuer vers la création d'un athlète →"
  - COLLABORATOR : "Continuer vers l'organisation →"
- **Bouton Skip :** "Passer cette étape"

### Messages de Succès
```javascript
toast.success("Votre profil a été mis à jour !");
```

### Messages d'Erreur
```javascript
toast.error("Erreur lors de la mise à jour du profil.");
```

## Sécurité

### Routes Protégées
- `/onboarding` : Authentification requise
- `/onboarding/athlete` : Authentification + type AGENT
- `/onboarding/organisation` : Authentification + type COLLABORATOR

### Validation des Données
- **Zod Schema Validation** pour tous les formulaires
- **Backend Django Validation** pour la cohérence des données
- **Multipart/Form-Data** pour l'upload sécurisé de fichiers

## Maintenance et Évolution

### Points d'Extension Possibles
1. **Ajout d'étapes supplémentaires** pour certains types d'utilisateurs
2. **Onboarding guidé avec tooltips** pour améliorer l'UX
3. **Sauvegarde automatique des brouillons** pour éviter les pertes de données
4. **Analytics** pour mesurer le taux de complétion de l'onboarding

### Tests à Effectuer
- [ ] Inscription → Auto-login → Onboarding AGENT complet
- [ ] Inscription → Auto-login → Onboarding COLLABORATOR complet
- [ ] Bouton "Passer cette étape" à chaque étape
- [ ] Upload d'avatar (différents formats d'image)
- [ ] Validation des données ISO (pays, langue)
- [ ] Gestion des erreurs API

---

**Dernière mise à jour :** 16 octobre 2025
**Version :** 1.0.0
