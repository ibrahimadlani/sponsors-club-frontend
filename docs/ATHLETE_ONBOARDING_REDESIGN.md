# Refonte : Page de Sélection Agent/Athlète

## Vue d'ensemble

Le formulaire de création d'athlète (`/onboarding/athlete`) a été repensé avec une **page d'accueil dédiée** (Step 0) présentant deux gros boutons modernes et responsives pour sélectionner le type de profil.

## Design

### Step 0 : Page de Sélection

```
┌─────────────────────────────────────────────────────────────┐
│                                                               │
│                         Bienvenue !                           │
│                 (Gradient text : primary → primary/60)        │
│                                                               │
│            Pour commencer, dites-nous qui vous êtes          │
│                                                               │
│  ┌───────────────────────┐  ┌───────────────────────┐       │
│  │                       │  │                       │       │
│  │         💼            │  │          👤           │       │
│  │    (Briefcase)        │  │    (UserCircle)       │       │
│  │                       │  │                       │       │
│  │   Agent Sportif       │  │      Athlète          │       │
│  │                       │  │                       │       │
│  │  Je représente un ou  │  │  Je suis un athlète   │       │
│  │  plusieurs athlètes   │  │  et je souhaite gérer │       │
│  │  et gère leur carrière│  │  moi-même ma carrière │       │
│  │                       │  │                       │       │
│  │  Continuer → (hover)  │  │  Continuer → (hover)  │       │
│  │                       │  │                       │       │
│  └───────────────────────┘  └───────────────────────┘       │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

### Caractéristiques du Design

#### 📱 Responsive
```css
/* Mobile : 1 colonne */
grid-cols-1

/* Desktop : 2 colonnes */
md:grid-cols-2
```

#### 🎨 Style Moderne

**Boutons :**
- Taille : `p-8 md:p-12` (padding adaptatif)
- Bordure : `border-2` → `hover:border-primary`
- Coins arrondis : `rounded-2xl`
- Effet : `hover:shadow-2xl`
- Gradient de fond : `from-background to-muted/30`
- Ring focus : `focus:ring-4 focus:ring-primary/20`

**Icônes :**
- Taille : `w-16 h-16 md:w-20 md:h-20` (responsive)
- Background circulaire : `rounded-full bg-primary/10`
- Hover : `group-hover:bg-primary/20`

**Animations (Framer Motion) :**
```jsx
whileHover={{ scale: 1.02 }}   // Zoom léger au survol
whileTap={{ scale: 0.98 }}     // Compression au clic
```

**Effet de fond animé :**
```jsx
<div className="absolute inset-0 bg-gradient-to-br from-primary/5 
  to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
```

**Flèche animée :**
```jsx
<ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
```

## Flux Utilisateur

```
┌──────────────────────────┐
│   STEP 0 : Sélection     │
│   ┌─────────┐ ┌────────┐ │
│   │ Agent   │ │ Athlète│ │
│   └────┬────┘ └───┬────┘ │
└────────┼──────────┼──────┘
         │          │
         └────┬─────┘
              ↓
     (Auto-passage au step 1)
              ↓
┌──────────────────────────┐
│   STEP 1 : Infos perso   │
│   [Badge de confirmation]│
│   "✨ Vous créez votre    │
│    propre profil..."      │
│                           │
│   Nom complet *           │
│   Date de naissance *     │
│   ...                     │
└──────────────────────────┘
              ↓
┌──────────────────────────┐
│   STEP 2-4 : Suite...    │
└──────────────────────────┘
```

## Implémentation Technique

### 1. État Initial

```javascript
const [step, setStep] = useState(0); // Commence à 0
const [isSelfRepresented, setIsSelfRepresented] = useState(null); // null au départ
```

### 2. Fonction nextStep Modifiée

```javascript
const nextStep = async () => {
  if (step === 0) {
    // Vérifier qu'une option a été sélectionnée
    if (isSelfRepresented === null) {
      toast.error("Veuillez sélectionner votre profil");
      return;
    }
    setStep(step + 1);
    return;
  }
  
  if (step === 1) {
    // Validation des champs du step 1
    const isValid = await form.trigger(["full_name", "sport_id", "birth_date", "nationality"]);
    if (!isValid) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }
  }
  setStep(step + 1);
};
```

### 3. Gestion de l'Affichage

```jsx
{/* Masquer le header et le stepper sur le step 0 */}
{step > 0 && (
  <motion.div>
    <h1>Créer votre premier athlète</h1>
    {/* Stepper 1-2-3-4 */}
  </motion.div>
)}

{/* Step 0 : Sélection Agent/Athlète */}
{step === 0 && (
  <motion.div>
    {/* Gros boutons */}
  </motion.div>
)}

{/* Steps 1-4 : Formulaire */}
{step > 0 && (
  <Card>
    {/* Contenu du formulaire */}
  </Card>
)}
```

### 4. Auto-Navigation au Clic

```jsx
<button
  onClick={() => {
    setIsSelfRepresented(false); // ou true pour athlète
    nextStep(); // Passe automatiquement au step 1
  }}
>
```

### 5. Badge de Confirmation (Step 1)

```jsx
<div className="mb-2 p-4 rounded-lg bg-primary/5 border border-primary/20">
  <p className="text-sm text-center">
    {isSelfRepresented 
      ? "✨ Vous créez votre propre profil d'athlète" 
      : "👔 Vous créez le profil d'un athlète que vous représentez"}
  </p>
</div>
```

## Code du Bouton Agent

```jsx
<motion.button
  type="button"
  whileHover={{ scale: 1.02 }}
  whileTap={{ scale: 0.98 }}
  onClick={() => {
    setIsSelfRepresented(false);
    nextStep();
  }}
  className={cn(
    "group relative overflow-hidden rounded-2xl border-2 p-8 md:p-12",
    "transition-all duration-300 hover:shadow-2xl",
    "bg-gradient-to-br from-background to-muted/30",
    "hover:border-primary focus:outline-none focus:ring-4 focus:ring-primary/20",
    isSelfRepresented === false && "border-primary ring-4 ring-primary/20"
  )}
>
  <div className="relative z-10 flex flex-col items-center text-center space-y-6">
    {/* Icône circulaire */}
    <div className="p-6 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
      <Briefcase className="w-16 h-16 md:w-20 md:h-20 text-primary" />
    </div>
    
    {/* Titre et description */}
    <div>
      <h2 className="text-2xl md:text-3xl font-bold mb-3">Agent Sportif</h2>
      <p className="text-muted-foreground text-base md:text-lg">
        Je représente un ou plusieurs athlètes et gère leur carrière professionnelle
      </p>
    </div>
    
    {/* CTA avec flèche animée */}
    <div className="flex items-center gap-2 text-primary font-medium">
      <span>Continuer en tant qu'agent</span>
      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
    </div>
  </div>
  
  {/* Effet de fond animé */}
  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent 
    opacity-0 group-hover:opacity-100 transition-opacity" />
</motion.button>
```

## Breakpoints Responsive

### Mobile (< 768px)
```css
- Boutons : 1 colonne (stack vertical)
- Padding : p-8
- Icônes : w-16 h-16
- Titre : text-2xl
- Description : text-base
```

### Desktop (≥ 768px)
```css
- Boutons : 2 colonnes (grid)
- Padding : p-12
- Icônes : w-20 h-20
- Titre : text-3xl
- Description : text-lg
```

## Accessibilité

### ✅ Implémenté

1. **Focus visible** : `focus:ring-4 focus:ring-primary/20`
2. **Type button** : `type="button"` (pas de soumission de formulaire)
3. **Bouton sémantique** : `<button>` au lieu de `<div onclick>`
4. **Texte descriptif** : Description claire de chaque option
5. **États visuels** : Hover, active, focus bien distincts

### 🎯 À Ajouter (Optionnel)

1. **Navigation clavier** : Déjà fonctionnel avec `<button>`
2. **ARIA labels** : `aria-label="Sélectionner le profil agent"`
3. **Feedback screen reader** : Annoncer le changement au clic

## Performance

### Optimisations

1. **Lazy loading des icônes** : Importées depuis lucide-react
2. **Animations GPU** : `transform: scale()` utilise le GPU
3. **Transitions CSS** : Plus performant que JS animations
4. **Framer Motion** : Utilise `will-change` automatiquement

## Améliorations UX

### Avant
```
Step 1 : Tabs "Agent" / "Athlète" mélangé avec le formulaire
→ Peu visible, décision noyée dans le formulaire
```

### Après
```
Step 0 : Page dédiée avec 2 gros boutons
→ Décision claire et engageante dès le départ
→ Passage automatique au formulaire après sélection
```

### Avantages

1. ✅ **Plus visible** : Impossible de manquer la question
2. ✅ **Plus engageant** : Design moderne qui inspire confiance
3. ✅ **Plus rapide** : Clic + auto-navigation (au lieu de clic + bouton suivant)
4. ✅ **Plus clair** : Une seule action par page
5. ✅ **Plus professionnel** : Design soigné et cohérent

## Tests Recommandés

### Test Fonctionnels

- [ ] Clic sur "Agent" → Step 1 avec badge "👔 Vous créez le profil d'un athlète..."
- [ ] Clic sur "Athlète" → Step 1 avec badge "✨ Vous créez votre propre profil..."
- [ ] Bouton Précédent au step 2 → Retour au step 1 (pas au step 0)
- [ ] Validation step 0 : message d'erreur si aucune sélection (ne devrait pas arriver)
- [ ] Donnée `is_self_represented` correctement envoyée à l'API

### Tests Responsive

- [ ] Mobile (375px) : Boutons en colonne, texte lisible
- [ ] Tablet (768px) : Transition vers 2 colonnes
- [ ] Desktop (1200px) : Espacement optimal

### Tests UX

- [ ] Hover sur bouton → Shadow + border + fond animé
- [ ] Tap sur mobile → Feedback visuel (scale 0.98)
- [ ] Focus clavier → Ring visible
- [ ] Animation d'entrée → Smooth (scale 0.95 → 1)

## Changements de Code

### Fichiers Modifiés

- ✅ `/src/components/forms/athlete-onboarding-form.jsx`

### Changements Principaux

1. `useState(1)` → `useState(0)` : Commencer au step 0
2. `useState(false)` → `useState(null)` : Aucune sélection initiale
3. Ajout du step 0 complet avec 2 boutons
4. Suppression du tab dans le step 1
5. Ajout du badge de confirmation au step 1
6. Masquage du header/stepper au step 0
7. Validation step 0 dans `nextStep()`
8. Auto-navigation au clic sur un bouton

### Lignes de Code Ajoutées

~100 lignes (step 0 complet avec animations)

## Changelog

### Version 2.0.0 - 17 octobre 2025

#### 🎨 Design
- ✅ Nouveau step 0 avec page dédiée à la sélection
- ✅ Deux gros boutons modernes et responsives
- ✅ Animations Framer Motion (scale, fade)
- ✅ Effets hover sophistiqués
- ✅ Gradient text pour le titre "Bienvenue"
- ✅ Icônes circulaires avec background animé

#### ⚡ UX
- ✅ Auto-navigation au clic (pas besoin de bouton "Suivant")
- ✅ Badge de confirmation au step 1
- ✅ Header masqué au step 0 pour plus de focus
- ✅ Messages contextuels et émojis

#### 🔧 Technique
- ✅ Step commence à 0 au lieu de 1
- ✅ isSelfRepresented = null initialement
- ✅ Validation step 0 dans nextStep()
- ✅ Responsive avec Tailwind (md: breakpoints)

---

**Dernière mise à jour** : 17 octobre 2025  
**Version** : 2.0.0
