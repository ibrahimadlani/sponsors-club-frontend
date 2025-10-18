# Migration vers Codes ISO : Nationalité et Pays

## Vue d'ensemble

Les champs **Nationalité** et **Pays** du formulaire de création d'athlète utilisent désormais des codes **ISO 3166-1 alpha-2** au lieu de saisie libre de texte.

## Changements Apportés

### Avant

```jsx
// Champs Input avec saisie libre
<Input placeholder="Ex: Française" {...form.register("nationality")} />
<Input placeholder="Ex: France" {...form.register("country")} />
```

**Problèmes :**
- ❌ Incohérence des données (France, FRANCE, france, Français, etc.)
- ❌ Fautes de frappe possibles
- ❌ Difficile à standardiser côté backend
- ❌ Problèmes d'internationalisation

### Après

```jsx
// Champs Select avec codes ISO
<Select value={nationality} onValueChange={setNationality}>
  <SelectItem value="FR">🇫🇷 Française</SelectItem>
  <SelectItem value="US">🇺🇸 Américaine</SelectItem>
  // ...
</Select>

<Select value={country} onValueChange={setCountry}>
  <SelectItem value="FR">🇫🇷 France</SelectItem>
  <SelectItem value="US">🇺🇸 États-Unis</SelectItem>
  // ...
</Select>
```

**Avantages :**
- ✅ Données cohérentes et standardisées (codes ISO)
- ✅ Pas de fautes de frappe possibles
- ✅ Drapeaux pour meilleure UX
- ✅ Facile à internationaliser
- ✅ Compatible avec les standards internationaux

## Format des Données

### Standard : ISO 3166-1 alpha-2

Code à **2 caractères** représentant chaque pays.

**Exemples :**
```
FR - France
US - États-Unis
GB - Royaume-Uni
DE - Allemagne
ES - Espagne
IT - Italie
CA - Canada
CH - Suisse
BE - Belgique
```

### Validation Zod

```javascript
nationality: z.string()
  .min(2, "La nationalité est requise")
  .max(2, "Code ISO 3166-1 alpha-2 requis (ex: FR)"),

country: z.string()
  .length(2, "Code ISO 3166-1 alpha-2 requis (ex: FR)")
  .optional()
  .or(z.literal("")),
```

## Liste des Pays Disponibles

| Code | Drapeau | Nationalité | Pays |
|------|---------|-------------|------|
| **FR** | 🇫🇷 | Française | France |
| **BE** | 🇧🇪 | Belge | Belgique |
| **CH** | 🇨🇭 | Suisse | Suisse |
| **CA** | 🇨🇦 | Canadienne | Canada |
| **US** | 🇺🇸 | Américaine | États-Unis |
| **GB** | 🇬🇧 | Britannique | Royaume-Uni |
| **DE** | 🇩🇪 | Allemande | Allemagne |
| **ES** | 🇪🇸 | Espagnole | Espagne |
| **IT** | 🇮🇹 | Italienne | Italie |
| **PT** | 🇵🇹 | Portugaise | Portugal |
| **NL** | 🇳🇱 | Néerlandaise | Pays-Bas |
| **LU** | 🇱🇺 | Luxembourgeoise | Luxembourg |
| **BR** | 🇧🇷 | Brésilienne | Brésil |
| **AR** | 🇦🇷 | Argentine | Argentine |
| **MX** | 🇲🇽 | Mexicaine | Mexique |
| **JP** | 🇯🇵 | Japonaise | Japon |
| **CN** | 🇨🇳 | Chinoise | Chine |
| **KR** | 🇰🇷 | Sud-Coréenne | Corée du Sud |
| **AU** | 🇦🇺 | Australienne | Australie |
| **NZ** | 🇳🇿 | Néo-Zélandaise | Nouvelle-Zélande |

**Total : 20 pays** (extensible facilement)

## Implémentation Technique

### 1. États Locaux

```javascript
const [nationality, setNationality] = useState(""); // ISO 3166-1 alpha-2
const [country, setCountry] = useState(""); // ISO 3166-1 alpha-2
```

### 2. Synchronisation avec React Hook Form

```javascript
// Synchroniser nationality avec le formulaire
useEffect(() => {
  if (nationality) {
    form.setValue("nationality", nationality, { shouldValidate: true });
  }
}, [nationality, form]);

// Synchroniser country avec le formulaire
useEffect(() => {
  if (country) {
    form.setValue("country", country, { shouldValidate: true });
  }
}, [country, form]);
```

### 3. Pré-remplissage pour Athlètes Auto-représentés

```javascript
// Pré-remplir avec codes ISO
if (userData.country) {
  setCountry(userData.country);     // Ex: "FR"
  setNationality(userData.country); // Ex: "FR" (même code)
}
```

**Logique :**
- Pour un athlète auto-représenté, on assume que sa nationalité = pays de résidence
- Les deux champs utilisent le même code ISO initial
- L'utilisateur peut modifier si nécessaire

### 4. Composants Select

```jsx
<Select value={nationality} onValueChange={setNationality}>
  <SelectTrigger>
    <SelectValue placeholder="Sélectionnez une nationalité" />
  </SelectTrigger>
  <SelectContent 
    position="popper" 
    side="bottom"
    avoidCollisions={false}
  >
    <SelectItem value="FR">🇫🇷 Française</SelectItem>
    {/* ... autres options */}
  </SelectContent>
</Select>
```

**Props importantes :**
- `position="popper"` : Meilleur positionnement
- `side="bottom"` : Dropdown vers le bas
- `avoidCollisions={false}` : Pas de flip automatique

## Différence entre Nationalité et Pays

### Nationalité (nationality)
- **Requis** (*)
- Représente la citoyenneté légale de l'athlète
- Affiché avec le nom au féminin (Française, Américaine, etc.)
- Utilisé pour les compétitions internationales

### Pays (country)
- **Optionnel**
- Représente le pays de résidence actuel
- Affiché avec le nom du pays (France, États-Unis, etc.)
- Peut être différent de la nationalité

**Exemple :**
```javascript
{
  nationality: "FR",  // Nationalité française
  country: "US"       // Réside aux États-Unis
}
```

## Données Envoyées à l'API

### Payload de Création d'Athlète

```json
{
  "full_name": "Marie Dupont",
  "birth_date": "1995-06-15",
  "nationality": "FR",        // Code ISO (2 caractères)
  "country": "FR",            // Code ISO (2 caractères)
  "city": "Paris",
  "sport_id": "uuid-sport",
  "is_self_represented": true
}
```

### Backend Django

Le backend doit accepter les codes ISO et éventuellement les convertir/valider :

```python
# models.py
nationality = models.CharField(
    max_length=2,
    help_text="ISO 3166-1 alpha-2 country code (e.g., FR, US, GB)"
)
country = models.CharField(
    max_length=2,
    blank=True,
    help_text="ISO 3166-1 alpha-2 country code (e.g., FR, US, GB)"
)
```

## Migration des Données Existantes

Si des athlètes existent déjà avec des noms de pays en texte libre :

### Script de Migration (Backend)

```python
# Mapping texte → ISO
COUNTRY_MAPPING = {
    "France": "FR",
    "FRANCE": "FR",
    "france": "FR",
    "Française": "FR",
    "États-Unis": "US",
    "USA": "US",
    "Royaume-Uni": "GB",
    "UK": "GB",
    # ... etc
}

# Convertir les données existantes
for athlete in Athlete.objects.all():
    if athlete.nationality and len(athlete.nationality) > 2:
        iso_code = COUNTRY_MAPPING.get(athlete.nationality)
        if iso_code:
            athlete.nationality = iso_code
            athlete.save()
```

## Extensions Futures

### 1. Ajouter Plus de Pays

Simplement ajouter de nouveaux `<SelectItem>` :

```jsx
<SelectItem value="SE">🇸🇪 Suède</SelectItem>
<SelectItem value="NO">🇳🇴 Norvège</SelectItem>
<SelectItem value="DK">🇩🇰 Danemark</SelectItem>
```

### 2. Liste Complète ISO 3166-1

Créer un fichier de configuration avec tous les pays :

```javascript
// config/countries.js
export const countries = [
  { code: "FR", flag: "🇫🇷", name: "France", nationality: "Française" },
  { code: "US", flag: "🇺🇸", name: "États-Unis", nationality: "Américaine" },
  // ... ~195 pays
];
```

Utiliser dynamiquement :

```jsx
{countries.map(c => (
  <SelectItem key={c.code} value={c.code}>
    {c.flag} {c.name}
  </SelectItem>
))}
```

### 3. Recherche/Filtre dans le Select

Implémenter un select avec recherche pour les longues listes :

```jsx
import { Combobox } from "@/components/ui/combobox";

<Combobox
  options={countries}
  value={nationality}
  onChange={setNationality}
  placeholder="Rechercher un pays..."
/>
```

### 4. Conversion ISO → Nom Complet

Créer une fonction helper :

```javascript
const getCountryName = (isoCode) => {
  const countryMap = {
    FR: "France",
    US: "États-Unis",
    GB: "Royaume-Uni",
    // ...
  };
  return countryMap[isoCode] || isoCode;
};

// Utilisation
<p>Pays : {getCountryName(athlete.country)}</p>
```

### 5. Support Multi-nationalité

Pour les athlètes avec double nationalité :

```javascript
nationality: z.array(z.string().length(2)).max(3)
```

```jsx
<MultiSelect
  value={nationalities}
  onChange={setNationalities}
  max={3}
>
  <SelectItem value="FR">🇫🇷 Française</SelectItem>
  // ...
</MultiSelect>
```

## Tests Recommandés

### Test 1 : Sélection Nationalité
**Given** : Formulaire vide  
**When** : Sélection "🇫🇷 Française"  
**Then** : 
- ✅ nationality = "FR"
- ✅ Formulaire valide

### Test 2 : Sélection Pays
**Given** : Formulaire vide  
**When** : Sélection "🇺🇸 États-Unis"  
**Then** :
- ✅ country = "US"
- ✅ Validation passe

### Test 3 : Pré-remplissage Athlète
**Given** : User avec country = "FR"  
**When** : Sélection "Athlète" au Step 0  
**Then** :
- ✅ nationality = "FR"
- ✅ country = "FR"
- ✅ Toast de confirmation

### Test 4 : Validation ISO
**Given** : Tentative de setValue avec "France" (texte)  
**When** : Validation Zod  
**Then** :
- ❌ Erreur : "Code ISO 3166-1 alpha-2 requis"

### Test 5 : Nationalité ≠ Pays
**Given** : Formulaire  
**When** : nationality = "FR", country = "US"  
**Then** :
- ✅ Deux codes ISO différents acceptés
- ✅ Payload correct envoyé

## UX Améliorée

### Avant
```
Nationalité : [_______________] (saisie libre)
→ Utilisateur tape "francaise" ou "Française" ou "France" ?
→ Confusion possible
```

### Après
```
Nationalité : [🇫🇷 Française ▼]
→ Clic → Menu déroulant avec drapeaux
→ Sélection claire et intuitive
```

### Avantages UX

1. ✅ **Visuel** : Drapeaux pour reconnaissance immédiate
2. ✅ **Pas d'erreur** : Sélection dans une liste = pas de typo
3. ✅ **Rapide** : Scroll ou recherche au clavier
4. ✅ **International** : Fonctionne quelle que soit la langue
5. ✅ **Cohérent** : Même UX que le formulaire onboarding

## Sécurité et Validation

### ✅ Validation Frontend (Zod)

```javascript
nationality: z.string()
  .min(2, "La nationalité est requise")
  .max(2, "Code ISO 3166-1 alpha-2 requis")
```

### ✅ Validation Backend (Django)

```python
# validators.py
from django.core.validators import RegexValidator

iso_country_validator = RegexValidator(
    regex=r'^[A-Z]{2}$',
    message='Code ISO 3166-1 alpha-2 requis (ex: FR, US)'
)

# models.py
nationality = models.CharField(
    max_length=2,
    validators=[iso_country_validator]
)
```

### 🔒 Sécurité

- Pas de XSS : Les codes ISO sont des strings fixes
- Pas d'injection SQL : Validation stricte (2 caractères)
- Whitelist : Seulement les codes existants dans le Select

## Changelog

### Version 1.0.0 - 17 octobre 2025

#### ✅ Ajouté
- Select pour nationalité avec 20 pays (codes ISO)
- Select pour pays avec 20 pays (codes ISO)
- Drapeaux emoji pour chaque pays
- États locaux `nationality` et `country`
- useEffect de synchronisation avec form
- Validation Zod pour codes ISO (2 caractères)

#### 📝 Modifié
- Pré-remplissage utilise codes ISO au lieu de mapping texte
- Schéma Zod : nationality et country acceptent codes ISO
- Labels : "Nationalité *" et "Pays de résidence"

#### ❌ Supprimé
- Champs Input pour nationalité et pays
- Mapping texte → nationalité
- Saisie libre de texte

---

**Fichier modifié** : `/src/components/forms/athlete-onboarding-form.jsx`  
**Dernière mise à jour** : 17 octobre 2025
