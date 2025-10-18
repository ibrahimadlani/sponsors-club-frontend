# Pré-remplissage Automatique pour Athlètes Auto-représentés

## Vue d'ensemble

Lorsqu'un utilisateur sélectionne **"Athlète"** (auto-représenté) dans le formulaire de création d'athlète, ses informations personnelles sont automatiquement pré-remplies depuis son profil utilisateur.

## Fonctionnement

### Déclenchement

Le pré-remplissage se déclenche automatiquement quand :
```javascript
isSelfRepresented === true
```

### Données Pré-remplies

| Champ du Formulaire | Source (user data) | Transformation |
|---------------------|-------------------|----------------|
| **full_name** | `first_name` + `last_name` | Concaténation avec trim() |
| **birth_date** | `date_of_birth` | Direct (format ISO) |
| **country** | `country` | Direct (ISO 3166-1 alpha-2) |
| **nationality** | `country` | Mapping vers nationalité en français |

### Mapping Pays → Nationalité

```javascript
const nationalityMap = {
  "FR": "Française",
  "BE": "Belge",
  "CH": "Suisse",
  "CA": "Canadienne",
  "US": "Américaine",
  "GB": "Britannique",
  "DE": "Allemande",
  "ES": "Espagnole",
  "IT": "Italienne",
  "PT": "Portugaise",
};
```

Si le pays n'est pas dans le mapping, le code ISO est utilisé directement.

## Implémentation

### 1. Import du Endpoint

```javascript
import { userEndpoints } from "@/lib/endpoints";
```

### 2. useEffect de Pré-remplissage

```javascript
useEffect(() => {
  const prefillUserData = async () => {
    if (isSelfRepresented === true) {
      try {
        const userData = await userEndpoints.me();
        
        // Nom complet
        if (userData.first_name || userData.last_name) {
          const fullName = `${userData.first_name || ""} ${userData.last_name || ""}`.trim();
          if (fullName) {
            form.setValue("full_name", fullName);
          }
        }
        
        // Date de naissance
        if (userData.date_of_birth) {
          form.setValue("birth_date", userData.date_of_birth);
        }
        
        // Pays et nationalité
        if (userData.country) {
          form.setValue("country", userData.country);
          const nationality = nationalityMap[userData.country] || userData.country;
          form.setValue("nationality", nationality);
        }
        
        toast.success("Vos informations ont été pré-remplies !", { duration: 3000 });
      } catch (error) {
        console.error("Erreur lors du chargement des données utilisateur:", error);
        // Pas de toast d'erreur pour ne pas perturber l'UX
      }
    }
  };

  if (isSelfRepresented === true) {
    prefillUserData();
  }
}, [isSelfRepresented, form]);
```

### 3. Dépendances

Le useEffect s'exécute quand :
- `isSelfRepresented` passe à `true`
- L'objet `form` change (rare)

## Flux Utilisateur

### Scénario : Athlète Auto-représenté

```
1. User clique sur "Athlète" (Step 0)
   ↓
2. isSelfRepresented = true
   ↓
3. useEffect se déclenche
   ↓
4. API call : userEndpoints.me()
   ↓
5. Données extraites et transformées
   ↓
6. form.setValue() pour chaque champ
   ↓
7. Toast : "Vos informations ont été pré-remplies !"
   ↓
8. Utilisateur arrive au Step 1 avec les champs pré-remplis
   ↓
9. Badge : "✨ Vous créez votre propre profil - Vos informations ont été pré-remplies"
```

### Scénario : Agent

```
1. User clique sur "Agent" (Step 0)
   ↓
2. isSelfRepresented = false
   ↓
3. Aucun pré-remplissage
   ↓
4. Utilisateur arrive au Step 1 avec formulaire vide
   ↓
5. Badge : "👔 Vous créez le profil d'un athlète que vous représentez"
```

## Exemple de Données

### Profil Utilisateur (API Response)

```json
{
  "id": "uuid-123",
  "email": "marie.dupont@example.com",
  "first_name": "Marie",
  "last_name": "Dupont",
  "date_of_birth": "1995-06-15",
  "country": "FR",
  "language": "fr",
  "gender": "FEMALE",
  "account_type": "AGENT"
}
```

### Formulaire Pré-rempli

```javascript
{
  full_name: "Marie Dupont",          // first_name + last_name
  birth_date: "1995-06-15",          // date_of_birth
  country: "FR",                      // country
  nationality: "Française",           // Mapping de FR
  // Champs non pré-remplis :
  sport_id: "",
  city: "",
  bio: "",
  discipline_ids: [],
  social_links: {}
}
```

## UX Améliorée

### Badge de Confirmation Amélioré

**Avant :**
```jsx
"✨ Vous créez votre propre profil d'athlète"
```

**Après :**
```jsx
"✨ Vous créez votre propre profil d'athlète - Vos informations ont été pré-remplies"
```

### Toast de Confirmation

Un toast apparaît pendant 3 secondes :
```javascript
toast.success("Vos informations ont été pré-remplies !", { duration: 3000 });
```

### Avantages UX

1. ✅ **Gain de temps** : Pas besoin de re-saisir son nom, date de naissance, etc.
2. ✅ **Moins d'erreurs** : Données cohérentes avec le profil utilisateur
3. ✅ **Expérience fluide** : Feedback immédiat avec toast et badge
4. ✅ **Transparence** : L'utilisateur sait que ses données ont été utilisées
5. ✅ **Modifiable** : Les champs restent éditables si besoin de correction

## Gestion des Erreurs

### Cas d'Erreur API

Si l'appel `userEndpoints.me()` échoue :
- ❌ Pas de toast d'erreur (pour ne pas perturber l'UX)
- ℹ️ Log dans la console pour le debug
- ✅ Le formulaire reste utilisable avec champs vides
- ✅ L'utilisateur peut quand même continuer

```javascript
catch (error) {
  console.error("Erreur lors du chargement des données utilisateur:", error);
  // Pas de toast d'erreur
}
```

### Cas de Données Manquantes

Si certaines données ne sont pas disponibles :
- ✅ Vérification avec `if (userData.field)` avant `setValue()`
- ✅ Pré-remplissage partiel si seulement certains champs disponibles
- ✅ Aucun impact sur les champs non pré-remplissables

## Champs Non Pré-remplis

Ces champs nécessitent une saisie manuelle (pas dans user data) :

| Champ | Raison |
|-------|--------|
| **sport_id** | Spécifique à l'athlète, pas au user |
| **city** | Peut être différent de l'adresse user |
| **bio** | Biographie sportive spécifique |
| **discipline_ids** | Disciplines sportives |
| **social_links** | Réseaux sociaux de l'athlète |

## Extensions Futures Possibles

### 1. Avatar Auto-importé
```javascript
if (userData.avatar) {
  form.setValue("profile_picture", userData.avatar);
}
```

### 2. Genre Pré-rempli
```javascript
if (userData.gender) {
  // Utiliser le genre pour des stats ou affichage
}
```

### 3. Ville depuis User
```javascript
if (userData.address_city) {
  form.setValue("city", userData.address_city);
}
```

### 4. Langue Préférée
```javascript
if (userData.language === "en") {
  // Adapter les labels ou suggestions
}
```

### 5. Email de Contact
```javascript
if (userData.email) {
  form.setValue("contact_email", userData.email);
}
```

## Tests Recommandés

### Test 1 : Pré-remplissage Complet
**Given** : User avec tous les champs remplis (first_name, last_name, date_of_birth, country)  
**When** : Sélection "Athlète"  
**Then** : 
- ✅ full_name = "Prénom Nom"
- ✅ birth_date = date ISO
- ✅ country = code ISO
- ✅ nationality = nom en français
- ✅ Toast affiché
- ✅ Badge avec message de pré-remplissage

### Test 2 : Pré-remplissage Partiel
**Given** : User avec seulement first_name et country  
**When** : Sélection "Athlète"  
**Then** :
- ✅ full_name = "Prénom" (sans last_name)
- ✅ country = code ISO
- ✅ nationality = nom en français
- ❌ birth_date = vide (non pré-rempli)

### Test 3 : Pays Non Mappé
**Given** : User avec country = "JP" (Japon, pas dans le mapping)  
**When** : Sélection "Athlète"  
**Then** :
- ✅ country = "JP"
- ✅ nationality = "JP" (fallback)

### Test 4 : Erreur API
**Given** : API userEndpoints.me() retourne une erreur 500  
**When** : Sélection "Athlète"  
**Then** :
- ❌ Pas de pré-remplissage
- ❌ Pas de toast d'erreur
- ✅ Formulaire reste utilisable
- ✅ Log dans console

### Test 5 : Agent (Pas de Pré-remplissage)
**Given** : User sélectionne "Agent"  
**When** : isSelfRepresented = false  
**Then** :
- ❌ Aucun pré-remplissage
- ❌ Pas d'appel API
- ✅ Formulaire vide

## Sécurité

### ✅ Points de Sécurité

1. **Authentification requise** : userEndpoints.me() nécessite un token
2. **Données validées** : Le formulaire valide avec Zod même si pré-rempli
3. **Modifiable** : L'utilisateur peut modifier les données pré-remplies
4. **Pas de données sensibles** : Seulement nom, date, pays (pas d'email, phone)

### ⚠️ Considérations

- Les données utilisateur sont récupérées côté client (visible dans devtools)
- Pas de problème car ce sont des données non sensibles du profil user

## Performance

### Optimisations

1. **Appel API unique** : Un seul `userEndpoints.me()` par pré-remplissage
2. **Lazy loading** : Appel seulement si `isSelfRepresented === true`
3. **Pas de re-fetch** : Le useEffect ne se re-déclenche pas inutilement

### Impact

- ⚡ +1 requête API si athlète auto-représenté
- ⏱️ ~200-500ms de délai supplémentaire
- ✅ Gain de temps utilisateur : ~30-60 secondes de saisie évitées

## Changelog

### Version 1.0.0 - 17 octobre 2025

#### ✅ Ajouté
- Pré-remplissage automatique pour athlètes auto-représentés
- Mapping pays → nationalité (10 pays)
- Toast de confirmation
- Badge amélioré avec message de pré-remplissage
- Gestion des erreurs silencieuse

#### 📝 Modifié
- Import de `userEndpoints` ajouté
- useEffect de pré-remplissage ajouté
- Badge du Step 1 mis à jour

#### 🔧 Technique
- Appel API : `userEndpoints.me()`
- Champs pré-remplis : 4 (full_name, birth_date, country, nationality)
- Dépendances : `[isSelfRepresented, form]`

---

**Fichier modifié** : `/src/components/forms/athlete-onboarding-form.jsx`  
**Dernière mise à jour** : 17 octobre 2025
