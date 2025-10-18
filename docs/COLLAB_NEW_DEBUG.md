# Debugging de la création de contrat

## Date
17 octobre 2025

## Erreur rencontrée

```
Error creating contract: {}
```

## Améliorations apportées pour le debugging

### 1. Logs détaillés

#### Avant l'envoi
```javascript
console.log("📤 Creating contract with payload:", payload);
```

Affiche exactement ce qui est envoyé à l'API.

#### Après l'envoi (succès)
```javascript
console.log("✅ Contract created successfully:", newContract);
```

#### En cas d'erreur
```javascript
console.error("❌ Error creating contract:", error);
console.error("Error details:", {
  message: error.message,
  response: error.response,
  data: error.response?.data,
  status: error.response?.status,
});
```

### 2. Validation avant envoi

```javascript
// Vérifier que l'organisation existe
if (!organisation?.id) {
  toast.error("Aucune organisation associée à votre compte");
  return;
}

// Vérifier que l'athlète est sélectionné
if (!data.agent_id) {
  toast.error("Veuillez sélectionner un athlète");
  return;
}
```

### 3. Payload optimisé

**Avant :**
```javascript
const payload = {
  title: data.title,
  organisation_id: organisation.id,
  agent_id: data.agent_id,
  effective_date: data.effective_date || null,  // ❌ Envoie null explicitement
  expiration_date: data.expiration_date || null,
};
```

**Après :**
```javascript
const payload = {
  title: data.title,
  organisation_id: organisation.id,
  agent_id: data.agent_id,
};

// ✅ Ajoute les champs seulement s'ils sont remplis
if (data.effective_date) {
  payload.effective_date = data.effective_date;
}
if (data.expiration_date) {
  payload.expiration_date = data.expiration_date;
}
if (data.description) {
  payload.description = data.description;
}
```

### 4. Extraction intelligente des erreurs

```javascript
let errorMessage = "Erreur lors de la création du contrat";

if (error.response?.data) {
  if (typeof error.response.data === 'string') {
    // Erreur simple en string
    errorMessage = error.response.data;
  } else if (error.response.data.detail) {
    // Format Django REST Framework
    errorMessage = error.response.data.detail;
  } else if (error.response.data.message) {
    // Format custom
    errorMessage = error.response.data.message;
  } else {
    // Erreurs de validation par champ
    const fieldErrors = Object.entries(error.response.data)
      .map(([field, errors]) => 
        `${field}: ${Array.isArray(errors) ? errors.join(', ') : errors}`
      )
      .join('; ');
    if (fieldErrors) {
      errorMessage = fieldErrors;
    }
  }
} else if (error.message) {
  errorMessage = error.message;
}
```

## Causes possibles de l'erreur

### 1. **Champ agent_id invalide**

L'`agent_id` peut être soit :
- Un UUID d'agent valide
- Un UUID d'athlète (si auto-représenté)

**À vérifier dans la console :**
```
📤 Creating contract with payload: {
  agent_id: "..." // ← Vérifier que c'est bien un UUID valide
}
```

### 2. **Organisation invalide**

L'organisation récupérée peut ne pas être valide ou active.

**À vérifier :**
```javascript
console.log("Organisation:", organisation);
```

### 3. **Backend attend un format différent**

Le backend peut attendre :
- `athlete_id` au lieu de `agent_id`
- Un format de date différent
- Des champs supplémentaires obligatoires

### 4. **Permissions insuffisantes**

L'utilisateur peut ne pas avoir les permissions pour créer un contrat.

### 5. **CSRF Token manquant**

Si le backend utilise CSRF protection.

## Comment debugger

### Étape 1 : Vérifier le payload
Ouvrez la console et cherchez :
```
📤 Creating contract with payload: { ... }
```

Vérifiez que tous les champs sont corrects :
- `title` : string non vide
- `organisation_id` : UUID valide
- `agent_id` : UUID valide

### Étape 2 : Vérifier les détails de l'erreur
Cherchez dans la console :
```
Error details: {
  message: "...",
  response: { ... },
  data: { ... },
  status: 400/401/403/500
}
```

### Étape 3 : Vérifier le Network tab

Dans les DevTools :
1. Onglet **Network**
2. Trouvez la requête `POST /api/contracts/`
3. Regardez :
   - **Request Payload** : Ce qui a été envoyé
   - **Response** : La réponse du serveur
   - **Status Code** : 400, 401, 403, 500, etc.

### Étape 4 : Codes d'erreur courants

| Code | Signification | Solution probable |
|------|---------------|-------------------|
| 400 | Bad Request | Champ manquant ou invalide |
| 401 | Unauthorized | Token expiré, reconnexion nécessaire |
| 403 | Forbidden | Permissions insuffisantes |
| 404 | Not Found | Endpoint incorrect |
| 422 | Unprocessable Entity | Validation échouée |
| 500 | Server Error | Erreur backend |

## Format attendu par le backend

### Minimal
```json
{
  "title": "Contrat de sponsoring 2025",
  "organisation_id": "uuid-valide",
  "agent_id": "uuid-valide"
}
```

### Complet
```json
{
  "title": "Contrat de sponsoring 2025",
  "organisation_id": "uuid-valide",
  "agent_id": "uuid-valide",
  "effective_date": "2025-01-01",
  "expiration_date": "2025-12-31",
  "description": "Description optionnelle"
}
```

## Solutions possibles

### Solution 1 : Vérifier l'endpoint
```javascript
// Dans contracts.js
export async function createContract(data) {
  console.log("Calling POST /contracts/ with:", data);
  return post("/contracts/", data);
}
```

### Solution 2 : Utiliser athlete_id au lieu de agent_id

Si le backend attend `athlete_id` :
```javascript
const payload = {
  title: data.title,
  organisation_id: organisation.id,
  athlete_id: data.agent_id,  // ← Renommer le champ
};
```

### Solution 3 : Vérifier les permissions

Vérifier que l'utilisateur est bien un COLLABORATOR avec une organisation.

### Solution 4 : Tester avec curl

```bash
curl -X POST http://localhost:8000/api/contracts/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "title": "Test Contract",
    "organisation_id": "uuid-here",
    "agent_id": "uuid-here"
  }'
```

## Checklist de vérification

- [ ] Console affiche le payload envoyé
- [ ] `organisation_id` est un UUID valide
- [ ] `agent_id` est un UUID valide
- [ ] L'utilisateur est connecté (token valide)
- [ ] L'utilisateur est un COLLABORATOR
- [ ] L'organisation existe et est active
- [ ] Network tab montre la requête POST
- [ ] Response body contient des détails d'erreur
- [ ] Backend logs montrent l'erreur exacte

## Prochaines étapes

1. **Recharger la page**
2. **Remplir le formulaire**
3. **Ouvrir la console** (F12)
4. **Cliquer sur "Créer le contrat"**
5. **Noter les logs** :
   - Payload envoyé
   - Error details
   - Status code
6. **Vérifier Network tab**
7. **Partager les informations** pour analyse

## Informations à collecter

Pour résoudre le problème, nous avons besoin de :

```
📤 Creating contract with payload: {
  // Copier tout le contenu ici
}

Error details: {
  // Copier tout le contenu ici
}

Network tab:
- Request URL: 
- Request Method: 
- Status Code: 
- Response Body: 
```

## Tests suggérés

### Test 1 : Création minimale
- Remplir seulement le titre et l'athlète
- Laisser les dates vides
- Créer le contrat

### Test 2 : Création complète
- Remplir tous les champs
- Créer le contrat

### Test 3 : Vérifier l'organisation
```javascript
console.log("Organisation actuelle:", organisation);
```

### Test 4 : Vérifier l'athlète sélectionné
```javascript
console.log("Athlète sélectionné:", data.agent_id);
const selectedAthlete = athletes.find(a => a.id === data.agent_id || a.agent?.id === data.agent_id);
console.log("Données de l'athlète:", selectedAthlete);
```
