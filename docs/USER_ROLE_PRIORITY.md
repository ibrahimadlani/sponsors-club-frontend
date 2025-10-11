# User Role Priority System

## Vue d'ensemble

Le système de navigation utilise une logique de priorité pour déterminer le rôle d'un utilisateur et afficher la navigation appropriée.

## Ordre de Priorité

La fonction `getUserRole(user)` détermine le rôle avec l'ordre de priorité suivant :

### 1. **STAFF/ADMIN** (Priorité la plus élevée) ⭐
```javascript
if (user.is_staff === true) {
  return "ADMIN";
}
```

**Condition** : L'utilisateur a la propriété `is_staff` à `true`

**Navigation** : 8 items (Dashboard, Athlètes, Organisations, Utilisateurs, Contrats, Analytics, Paiements, Administration)

**Cas d'usage** : Administrateurs système, équipe interne

---

### 2. **Role from JWT** (Priorité haute) 🔑
```javascript
if (user.role) {
  return user.role.toUpperCase();
}
```

**Condition** : L'utilisateur a une propriété `role` définie (provenant du JWT)

**Source** : Token JWT décodé (`role` key in payload)

**Valeurs possibles** :
- `"AGENT"` → Navigation avec 4 items (Dashboard, Mes Athlètes, Analytics, Messages)
- `"COLLABORATOR"` → Navigation avec 4 items (Athlètes, Suivis, Collabs, Analytics)
- `"STAFF"` → Navigation avec 8 items (Dashboard, Athlètes, Organisations, etc.)

**Cas d'usage** : Source de vérité principale, données instantanées du JWT

---

### 3. **Account Type** (Priorité moyenne - Fallback)
```javascript
if (user.account_type) {
  return user.account_type.toUpperCase();
}
```

**Condition** : L'utilisateur a une propriété `account_type` définie

**Source** : API `/users/me/` (legacy)

**Valeurs possibles** :
- `"AGENT"` → Navigation avec 4 items (Dashboard, Mes Athlètes, Analytics, Messages)
- `"COLLABORATOR"` → Navigation avec 4 items (Athlètes, Suivis, Collabs, Analytics)

**Cas d'usage** : Fallback pour ancienne API ou si JWT n'a pas de `role`

---

### 4. **Default COLLABORATOR** (Priorité la plus basse)
```javascript
return "COLLABORATOR";
```

**Condition** : Aucune des conditions précédentes n'est remplie

**Navigation** : 4 items (Athlètes, Suivis, Collabs, Analytics)

**Cas d'usage** : Nouveaux utilisateurs, utilisateurs sans role/account_type défini

---

## Exemples

### Exemple 1 : User depuis JWT avec role AGENT
```javascript
const user = {
  id: "62750fc3-9247-4ed8-a391-c54dddd44efa",
  email: "asma@adlani.com",
  first_name: "Asma",
  last_name: "Adlani",
  role: "AGENT",  // ✅ Priorité 2 (depuis JWT)
};

getUserRole(user); // → "AGENT"
```
**Résultat** : Navigation AGENT avec 4 items

---

### Exemple 2 : Staff avec role AGENT (is_staff prioritaire)
```javascript
const user = {
  is_staff: true,     // ✅ Priorité 1
  role: "AGENT"       // ❌ Ignoré car is_staff = true
};

getUserRole(user); // → "ADMIN"
```
**Résultat** : Navigation ADMIN avec 8 items

---

### Exemple 2 : Agent standard
```javascript
const user = {
  is_staff: false,
  account_type: "AGENT"  // ✅ Priorité 2
};

getUserRole(user); // → "AGENT"
```
**Résultat** : Navigation AGENT avec 4 items

---

### Exemple 3 : Utilisateur sans type
```javascript
const user = {
  email: "user@example.com"
  // Pas de is_staff ni account_type
};

getUserRole(user); // → "COLLABORATOR"
```
**Résultat** : Navigation COLLABORATOR par défaut avec 4 items

---

### Exemple 4 : Utilisateur null
```javascript
getUserRole(null); // → "COLLABORATOR"
```
**Résultat** : Navigation COLLABORATOR par défaut

---

## Utilisation dans les composants

### Composants qui utilisent `getUserRole()`
1. **`app-header.jsx`** : Détermine le rôle pour passer aux composants de navigation
2. **`nav-user.jsx`** : Génère le menu utilisateur basé sur le rôle

### Composants qui reçoivent le `role` en prop
1. **`nav-bar.jsx`** : Navigation desktop
2. **`mobile-nav.jsx`** : Navigation mobile (drawer)

## Code centralisé

La logique est centralisée dans `/src/config/navigation.js` :

```javascript
import { getUserRole, getNavByRole } from "@/config/navigation";

// Dans un composant
const role = getUserRole(user);
const navItems = getNavByRole(role);
```

## Avantages de cette approche

✅ **Source unique de vérité** : Une seule fonction pour déterminer le rôle
✅ **Cohérence** : Tous les composants utilisent la même logique
✅ **Priorité claire** : STAFF toujours prioritaire sur account_type
✅ **Maintenabilité** : Facile à modifier en un seul endroit
✅ **Testable** : Fonction pure, facile à tester

## Tests

Pour tester la logique de priorité :

```javascript
// Test 1: Staff priority
const staffUser = { is_staff: true, account_type: "AGENT" };
console.assert(getUserRole(staffUser) === "ADMIN");

// Test 2: Account type
const agentUser = { account_type: "AGENT" };
console.assert(getUserRole(agentUser) === "AGENT");

// Test 3: Default
const newUser = { email: "test@test.com" };
console.assert(getUserRole(newUser) === "COLLABORATOR");
```

---

**Dernière mise à jour** : 9 octobre 2025
