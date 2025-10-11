# API Module Documentation

Ce dossier contient tous les appels API organisés par domaine fonctionnel.

## Structure

```
src/lib/api/
├── client.js          # Configuration de base et utilitaires HTTP
├── index.js           # Point d'entrée centralisé
├── analytics.js       # Endpoints analytics et statistiques
├── athletes.js        # Gestion des athlètes
├── contracts.js       # Contrats, clauses, signatures
├── messaging.js       # Threads et messages
├── notifications.js   # Notifications utilisateur
├── organisations.js   # Organisations et collaborateurs
├── payments.js        # Plans et abonnements
├── sports.js          # Sports et disciplines
└── users.js           # Authentification et profil utilisateur
```

## Utilisation

### Import par namespace (recommandé)

```javascript
import { athletes, users, payments } from '@/lib/api';

// Récupérer tous les athlètes
const athletesList = await athletes.getAthletes();

// Récupérer le profil utilisateur
const currentUser = await users.getMe();

// Récupérer les plans de paiement
const plans = await payments.getPlans();
```

### Import de fonctions spécifiques

```javascript
import { getAthletes, getAthlete } from '@/lib/api/athletes';
import { login, register } from '@/lib/api/users';

const allAthletes = await getAthletes();
const athlete = await getAthlete('athlete-id');
```

### Import de l'objet API complet

```javascript
import api from '@/lib/api';

const athletes = await api.athletes.getAthletes();
const user = await api.users.getMe();
```

## Exemples par domaine

### Athletes

```javascript
import { athletes } from '@/lib/api';

// Liste des athlètes
const list = await athletes.getAthletes({ page: 1 });

// Détails d'un athlète
const athlete = await athletes.getAthlete('uuid');

// Athlète par slug
const athlete = await athletes.getAthleteBySlug('john-doe');

// Créer un athlète
const newAthlete = await athletes.createAthlete({
  full_name: 'John Doe',
  sport_id: 'sport-uuid',
  birth_date: '1990-01-01',
  nationality: 'FR',
});

// Suivre/Ne plus suivre
await athletes.followAthlete('athlete-id');
await athletes.unfollowAthlete('athlete-id');

// Mes athlètes (pour agents)
const myAthletes = await athletes.getMyAthletes();
```

### Users & Authentication

```javascript
import { users } from '@/lib/api';

// Connexion
const { access, refresh, user } = await users.login('email@example.com', 'password');

// Inscription
const newUser = await users.register({
  email: 'email@example.com',
  password: 'password',
  account_type: 'AGENT',
  first_name: 'John',
  last_name: 'Doe',
});

// Profil utilisateur
const me = await users.getMe();

// Mettre à jour le profil
await users.updateMe({ first_name: 'Jane' });

// Entitlements et rôles
const entitlements = await users.getMyEntitlements();
const roles = await users.getMyRoles();

// Athlètes suivis
const follows = await users.getMyFollows();
```

### Payments

```javascript
import { payments } from '@/lib/api';

// Récupérer les plans
const plans = await payments.getPlans();

// Abonnement actuel
const subscription = await payments.getMySubscription();

// Créer une session Stripe
const { url } = await payments.createCheckoutSession('plan-id');
window.location.href = url; // Rediriger vers Stripe

// Annuler l'abonnement
await payments.cancelMySubscription();
```

### Organisations

```javascript
import { organisations } from '@/lib/api';

// Liste des organisations
const orgs = await organisations.getOrganisations();

// Créer une organisation
const org = await organisations.createOrganisation({
  name: 'Mon Entreprise',
  type: 'BRAND',
});

// Collaborateurs
const collaborators = await organisations.getOrganisationCollaborators('org-id');

// Ajouter un collaborateur
await organisations.addCollaborator('org-id', {
  user_email: 'collab@example.com',
});

// Codes d'invitation
const invites = await organisations.getOrganisationInvites('org-id');
await organisations.createOrganisationInvite('org-id', { max_uses: 5 });

// Rejoindre avec un code
await organisations.joinOrganisation('INVITE_CODE');
```

### Contracts

```javascript
import { contracts } from '@/lib/api';

// Liste des contrats
const contractsList = await contracts.getContracts();

// Créer un contrat
const contract = await contracts.createContract({
  organisation_id: 'org-id',
  agent_id: 'agent-id',
  title: 'Contrat de sponsoring',
});

// Ajouter une clause
await contracts.addClause('contract-id', {
  template_id: 'template-id',
  title: 'Clause titre',
  content: 'Contenu de la clause',
});

// Changer le statut
await contracts.changeContractStatus('contract-id', 'negotiation');

// Accepter le contrat
await contracts.agreeToContract('contract-id');

// Révision légale
await contracts.startLegalReview('contract-id');
await contracts.verifyLegalReview('contract-id');

// Signature
await contracts.initSigning('contract-id');
const signingStatus = await contracts.getSigningStatus('contract-id');

// Export PDF
const pdfBlob = await contracts.exportContractPDF('contract-id');
```

### Messaging

```javascript
import { messaging } from '@/lib/api';

// Liste des threads
const threads = await messaging.getThreads({ page: 1, page_size: 20 });

// Créer un thread
const thread = await messaging.createThread({
  athlete_id: 'athlete-id',
});

// Messages d'un thread
const messages = await messaging.getThreadMessages('thread-id');

// Envoyer un message
await messaging.sendMessage('thread-id', {
  content: 'Bonjour !',
});

// Marquer comme lu
await messaging.markMessageAsRead('message-id');
```

### Notifications

```javascript
import { notifications } from '@/lib/api';

// Liste des notifications
const notifs = await notifications.getNotifications({ page: 1 });

// Marquer comme lu
await notifications.markNotificationAsRead('notif-id');
```

### Analytics

```javascript
import { analytics } from '@/lib/api';

// Synchroniser tous les comptes
await analytics.syncAllAccounts();

// Fetch stats pour un compte
await analytics.fetchAccountStats('account-id');

// Stats d'un athlète
const stats = await analytics.getAthleteStats('athlete-id', { page: 1 });

// Résumé des stats
const summary = await analytics.getAthleteStatsSummary('athlete-id');

// Comparer deux athlètes
const comparison = await analytics.compareAthletes('athlete-1-id', 'athlete-2-id');
```

### Sports

```javascript
import { sports } from '@/lib/api';

// Liste des sports
const sportsList = await sports.getSports();

// Disciplines d'un sport
const disciplines = await sports.getSportDisciplines('sport-id');
```

## Gestion des erreurs

Toutes les fonctions peuvent lever des exceptions. Utilisez try/catch :

```javascript
import { athletes } from '@/lib/api';
import { toast } from 'sonner';

try {
  const athlete = await athletes.getAthlete('invalid-id');
} catch (error) {
  console.error('Error:', error);
  toast.error('Erreur', {
    description: error.message || 'Une erreur est survenue',
  });
}
```

Les erreurs contiennent :
- `status`: Code HTTP (0 si erreur réseau)
- `message`: Message d'erreur
- `data`: Données supplémentaires de l'API

## Utilitaires HTTP bas niveau

Pour des requêtes personnalisées :

```javascript
import { get, post, put, patch, delete as del, upload } from '@/lib/api';

// GET avec params
const data = await get('/custom/endpoint/', { param1: 'value' });

// POST
const result = await post('/custom/endpoint/', { body: 'data' });

// Upload de fichier
const formData = new FormData();
formData.append('file', file);
const uploaded = await upload('/upload/endpoint/', formData);
```

## Configuration

L'URL de base est définie dans `src/lib/api.js` :
- Variable d'environnement : `NEXT_PUBLIC_API_BASE_URL`
- Fallback : `http://localhost:8000/api`

Toutes les requêtes incluent automatiquement :
- `credentials: "include"` pour les cookies d'authentification
- `Content-Type: application/json` pour les requêtes JSON
