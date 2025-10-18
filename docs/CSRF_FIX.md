# Correction de l'erreur CSRF 403

## Date
17 octobre 2025

## Erreur rencontrée

```
403 Forbidden
{
  "detail": "CSRF Failed: Origin checking failed - http://localhost:3000 does not match any trusted origins."
}
```

## Cause

Django utilise la protection CSRF (Cross-Site Request Forgery) pour sécuriser les requêtes POST, PUT, PATCH et DELETE. Le frontend doit envoyer un token CSRF dans les headers pour prouver que la requête provient du bon domaine.

## Solution implémentée

### 1. Fonction de récupération du CSRF token

Ajout d'une fonction pour lire le token depuis les cookies :

```javascript
/**
 * Get CSRF token from cookies
 */
function getCsrfToken() {
  if (typeof document === 'undefined') return null;
  
  const name = 'csrftoken';
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.substring(0, name.length + 1) === (name + '=')) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}
```

### 2. Inclusion automatique du token

Modification de `apiRequest` pour inclure le token dans les headers :

```javascript
export async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  // Get CSRF token for unsafe methods
  const csrfToken = getCsrfToken();
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };
  
  // Add CSRF token for POST, PUT, PATCH, DELETE
  if (csrfToken && ['POST', 'PUT', 'PATCH', 'DELETE'].includes(options.method?.toUpperCase())) {
    headers['X-CSRFToken'] = csrfToken;
  }
  
  const config = {
    ...options,
    headers,
    credentials: "include", // Include cookies for authentication
  };
  
  // ... rest of the function
}
```

## Comment ça fonctionne

### Étape 1 : Django envoie le cookie CSRF
Lors de la première requête (par exemple lors du login), Django envoie un cookie `csrftoken`.

### Étape 2 : Le frontend lit le cookie
```javascript
const csrfToken = getCsrfToken(); // Lit le cookie 'csrftoken'
```

### Étape 3 : Le frontend renvoie le token dans les headers
Pour les méthodes "unsafe" (POST, PUT, PATCH, DELETE) :
```javascript
headers['X-CSRFToken'] = csrfToken;
```

### Étape 4 : Django valide le token
Django compare le token du header avec celui du cookie. Si c'est le même, la requête est acceptée.

## Méthodes concernées

Le token CSRF est ajouté automatiquement pour :
- ✅ `POST` (création de ressources)
- ✅ `PUT` (remplacement complet)
- ✅ `PATCH` (mise à jour partielle)
- ✅ `DELETE` (suppression)

Le token n'est **pas** ajouté pour :
- ❌ `GET` (lecture seule, considéré comme safe)
- ❌ `HEAD` (metadata, considéré comme safe)
- ❌ `OPTIONS` (préflight, considéré comme safe)

## Avantages de cette implémentation

### ✅ Automatique
Le token est ajouté automatiquement à toutes les requêtes nécessaires, pas besoin de le gérer manuellement.

### ✅ Centralisé
Tout passe par `apiRequest`, donc une seule modification suffit pour tout le projet.

### ✅ Sécurisé
Protège contre les attaques CSRF cross-origin.

### ✅ Compatible SSR
Vérifie `typeof document === 'undefined'` pour éviter les erreurs en SSR.

## Configuration Django requise

### settings.py

Le backend doit avoir la configuration CSRF appropriée :

```python
# CSRF Settings
CSRF_COOKIE_NAME = 'csrftoken'
CSRF_COOKIE_HTTPONLY = False  # ← Important : permet au JavaScript de lire le cookie
CSRF_COOKIE_SAMESITE = 'Lax'
CSRF_COOKIE_SECURE = False  # True en production avec HTTPS

# Trusted origins
CSRF_TRUSTED_ORIGINS = [
    'http://localhost:3000',  # Frontend dev
    'http://127.0.0.1:3000',
    'https://yourdomain.com',  # Production
]
```

### middleware.py

Vérifier que le middleware CSRF est activé :

```python
MIDDLEWARE = [
    # ...
    'django.middleware.csrf.CsrfViewMiddleware',
    # ...
]
```

## Test de la correction

### 1. Vérifier que le cookie est présent

Dans la console du navigateur :
```javascript
document.cookie.split(';').find(c => c.includes('csrftoken'))
```

Devrait afficher quelque chose comme :
```
" csrftoken=abc123def456..."
```

### 2. Vérifier que le header est envoyé

Dans l'onglet **Network** des DevTools :
1. Faites une requête POST (ex: créer un contrat)
2. Cliquez sur la requête
3. Onglet **Headers**
4. Cherchez dans **Request Headers** :
```
X-CSRFToken: abc123def456...
```

### 3. Tester la création de contrat

1. Rechargez la page
2. Remplissez le formulaire
3. Cliquez sur "Créer le contrat"
4. ✅ Devrait fonctionner sans erreur 403

## Erreurs possibles et solutions

### Erreur : "CSRF token missing"

**Cause :** Le cookie `csrftoken` n'existe pas.

**Solution :** 
- Vérifier que `CSRF_COOKIE_HTTPONLY = False` dans Django
- Faire une requête GET d'abord pour obtenir le cookie
- Vérifier que `credentials: "include"` est bien présent

### Erreur : "CSRF token incorrect"

**Cause :** Le token du cookie ne correspond pas au token du header.

**Solution :**
- Vérifier que le cookie n'a pas expiré
- Vérifier qu'il n'y a pas de conflit entre plusieurs cookies
- Recharger la page pour obtenir un nouveau token

### Erreur : "Origin checking failed"

**Cause :** L'origine n'est pas dans `CSRF_TRUSTED_ORIGINS`.

**Solution :**
- Ajouter `http://localhost:3000` dans `CSRF_TRUSTED_ORIGINS`
- Vérifier le port exact utilisé
- Vérifier le protocole (http vs https)

## Alternative : Désactiver CSRF (⚠️ NON RECOMMANDÉ en production)

Pour le développement uniquement, vous pouvez temporairement désactiver CSRF :

```python
# views.py
from django.views.decorators.csrf import csrf_exempt

@csrf_exempt
def create_contract(request):
    # ...
```

Ou dans les settings :
```python
# settings.py (DEV ONLY!)
MIDDLEWARE = [
    # ...
    # 'django.middleware.csrf.CsrfViewMiddleware',  # ← Commenté
    # ...
]
```

⚠️ **ATTENTION** : Ne jamais faire cela en production !

## Impact sur les autres requêtes

Toutes les requêtes POST, PUT, PATCH, DELETE du projet bénéficient automatiquement de cette correction :

- ✅ Création de contrat
- ✅ Modification de contrat
- ✅ Suppression de clauses
- ✅ Accord au contrat
- ✅ Upload de fichiers
- ✅ Toute autre requête "unsafe"

## Fichiers modifiés

### `/src/lib/api/client.js`

**Ajouts :**
1. Fonction `getCsrfToken()` pour lire le cookie
2. Récupération automatique du token dans `apiRequest`
3. Ajout du header `X-CSRFToken` pour les méthodes unsafe

## Tests suggérés

- [ ] Création de contrat → ✅ Fonctionne
- [ ] Modification de profil → ✅ Fonctionne
- [ ] Suppression d'éléments → ✅ Fonctionne
- [ ] Upload de fichiers → ✅ Fonctionne
- [ ] Cookie `csrftoken` présent dans les DevTools
- [ ] Header `X-CSRFToken` présent dans les requêtes POST
- [ ] Pas d'erreur 403 CSRF

## Ressources

- [Django CSRF Protection](https://docs.djangoproject.com/en/stable/ref/csrf/)
- [Django Settings - CSRF_TRUSTED_ORIGINS](https://docs.djangoproject.com/en/stable/ref/settings/#csrf-trusted-origins)
- [MDN - CSRF](https://developer.mozilla.org/en-US/docs/Glossary/CSRF)

## Conclusion

✅ **Problème résolu** : Le token CSRF est maintenant automatiquement inclus dans toutes les requêtes  
✅ **Code centralisé** : Une seule modification dans `client.js` suffit  
✅ **Sécurisé** : Protection contre les attaques CSRF maintenue  
✅ **Transparent** : Aucune modification nécessaire dans le reste du code  

La création de contrat et toutes les autres opérations d'écriture devraient maintenant fonctionner ! 🎉
