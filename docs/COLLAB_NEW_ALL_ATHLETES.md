# Affichage de tous les athlètes sans filtrage par agent

## Date
17 octobre 2025

## Contexte
Les athlètes chargés depuis l'API ne possèdent pas tous un agent associé. Le filtrage strict sur `athlete.agent?.id` empêchait l'affichage de 37 athlètes disponibles.

## Problème initial
```
"Aucun athlète avec agent disponible
(37 athlète(s) chargé(s), mais aucun n'a d'agent)"
```

## Solution implémentée

### 1. Suppression du filtrage strict

**Avant :**
```javascript
athletes
  .filter((athlete) => athlete.agent?.id) // ❌ Filtre trop strict
  .map((athlete) => (
    <SelectItem value={athlete.agent.id}>
      {/* ... */}
    </SelectItem>
  ))
```

**Après :**
```javascript
athletes.map((athlete) => (
  <SelectItem value={athlete.agent?.id || athlete.id}> {/* ✅ Fallback sur athlete.id */}
    {/* ... */}
  </SelectItem>
))
```

### 2. Value avec fallback

La valeur utilisée pour le contrat est maintenant :
- `athlete.agent.id` si l'agent existe
- `athlete.id` sinon (athlète auto-représenté)

### 3. Affichage conditionnel des informations

```jsx
<SelectItem value={athlete.agent?.id || athlete.id}>
  <div className="flex flex-col gap-1">
    {/* Nom de l'athlète - toujours affiché */}
    <div className="flex items-center gap-2">
      <User className="w-4 h-4" />
      <span className="font-medium">{athlete.full_name}</span>
    </div>
    
    {/* Agent - affiché seulement si présent */}
    {athlete.agent?.name && (
      <span className="text-xs text-muted-foreground ml-6">
        Agent: {athlete.agent.name}
      </span>
    )}
    
    {/* Sport - affiché seulement si présent */}
    {athlete.sport?.name && (
      <span className="text-xs text-muted-foreground ml-6">
        {athlete.sport.emoji} {athlete.sport.name}
      </span>
    )}
  </div>
</SelectItem>
```

### 4. Validation simplifiée

**Avant :**
```javascript
agent_id: z.string().uuid("Veuillez sélectionner un agent/athlète")
```

**Après :**
```javascript
agent_id: z.string().min(1, "Veuillez sélectionner un athlète")
```

## Résultat

### Interface utilisateur

**Label :**
```
Athlète *
37 athlète(s) disponible(s)
```

**Placeholder :**
```
Sélectionnez un athlète
```

**Items du select :**
```
👤 Kylian Mbappé
   Agent: John Doe
   ⚽ Football

👤 Rafael Nadal
   🎾 Tennis

👤 Teddy Riner
   Agent: Jane Smith
   🥋 Judo
```

### Avantages

✅ **Tous les athlètes visibles** : 37 au lieu de 0  
✅ **Affichage flexible** : Agent et sport affichés seulement si disponibles  
✅ **Meilleure UX** : L'utilisateur voit toutes les options  
✅ **Fallback intelligent** : Utilise l'ID de l'athlète si pas d'agent  
✅ **Code plus simple** : Moins de conditions, plus maintenable  

## Structure des données

### Athlète avec agent
```json
{
  "id": "athlete-uuid-1",
  "full_name": "Kylian Mbappé",
  "agent": {
    "id": "agent-uuid-1",
    "name": "John Doe"
  },
  "sport": {
    "name": "Football",
    "emoji": "⚽"
  }
}
```
→ `value = "agent-uuid-1"` (ID de l'agent)

### Athlète sans agent (auto-représenté)
```json
{
  "id": "athlete-uuid-2",
  "full_name": "Rafael Nadal",
  "agent": null,
  "sport": {
    "name": "Tennis",
    "emoji": "🎾"
  }
}
```
→ `value = "athlete-uuid-2"` (ID de l'athlète)

## Impact sur l'API

### Payload de création de contrat

Le champ `agent_id` peut maintenant contenir :
- Un UUID d'agent (si l'athlète a un agent)
- Un UUID d'athlète (si auto-représenté)

```json
{
  "title": "Contrat de sponsoring 2025",
  "organisation_id": "uuid-organisation",
  "agent_id": "uuid-agent-ou-athlete",  // ← Peut être soit l'agent soit l'athlète
  "effective_date": "2025-01-01",
  "expiration_date": "2025-12-31"
}
```

⚠️ **Note importante** : Le backend doit gérer les deux cas :
- Athlète avec agent → `agent_id` pointe vers l'agent
- Athlète auto-représenté → `agent_id` pointe vers l'athlète lui-même

## Console logs

```
✅ 37 athlète(s) chargé(s)
```

Au lieu de :
```
❌ Error fetching athletes: {}
```

## Fichiers modifiés

### `/src/app/(private)/collab/new/page.jsx`

**Changements :**
1. Suppression du filtrage `.filter((athlete) => athlete.agent?.id)`
2. Value avec fallback : `athlete.agent?.id || athlete.id`
3. Affichage conditionnel de l'agent et du sport
4. Label changé : "Agent / Athlète" → "Athlète"
5. Placeholder : "Sélectionnez un agent ou athlète" → "Sélectionnez un athlète"
6. Validation : `.uuid()` → `.min(1)`
7. Debug info : compteur d'athlètes disponibles
8. Console logs simplifiés

## Tests suggérés

- [ ] **37 athlètes visibles** dans le select
- [ ] **Athlètes avec agent** : affichent le nom de l'agent
- [ ] **Athlètes sans agent** : n'affichent pas la ligne agent
- [ ] **Sport affiché** avec emoji si disponible
- [ ] **Sélection** fonctionne pour tous les types d'athlètes
- [ ] **Création de contrat** réussie avec athlète avec agent
- [ ] **Création de contrat** réussie avec athlète sans agent
- [ ] **Validation** accepte les deux types d'IDs

## Prochaines améliorations possibles

- [ ] Badge "Auto-représenté" pour les athlètes sans agent
- [ ] Tri par catégorie (avec agent / sans agent)
- [ ] Recherche/filtrage par nom
- [ ] Photos des athlètes dans le select
- [ ] Indication du pays avec drapeau

## Conclusion

✅ **Problème résolu** : Tous les athlètes sont maintenant visibles  
✅ **UX améliorée** : Affichage intelligent avec informations contextuelles  
✅ **Code simplifié** : Moins de conditions, plus robuste  
✅ **Flexibilité** : Gère les athlètes avec et sans agent  

Le select affiche maintenant les 37 athlètes disponibles avec leurs informations pertinentes.
