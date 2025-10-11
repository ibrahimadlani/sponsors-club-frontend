/**
 * Navigation Configuration Tests
 * 
 * Examples and test cases for the role-based navigation system
 */

import { getNavByRole, hasAccessToPath } from './navigation';

// ============================================================================
// Test 1: Get navigation for different roles
// ============================================================================

console.log('=== Test 1: Navigation by Role ===');

const agentNav = getNavByRole('AGENT');
console.log('AGENT Navigation Items:', agentNav.length);
agentNav.forEach(item => console.log(`  - ${item.label} (${item.href})`));

const collaboratorNav = getNavByRole('COLLABORATOR');
console.log('\nCOLLABORATOR Navigation Items:', collaboratorNav.length);
collaboratorNav.forEach(item => console.log(`  - ${item.label} (${item.href})`));

const adminNav = getNavByRole('ADMIN');
console.log('\nADMIN Navigation Items:', adminNav.length);
adminNav.forEach(item => console.log(`  - ${item.label} (${item.href})`));

// ============================================================================
// Test 2: Access control checks
// ============================================================================

console.log('\n=== Test 2: Access Control ===');

const testPaths = [
  '/dashboard',
  '/athletes',
  '/explore',
  '/organisations',
  '/admin',
  '/payments',
];

const roles = ['AGENT', 'COLLABORATOR', 'ADMIN'];

roles.forEach(role => {
  console.log(`\n${role} access:`);
  testPaths.forEach(path => {
    const hasAccess = hasAccessToPath(role, path);
    console.log(`  ${path}: ${hasAccess ? '✓ YES' : '✗ NO'}`);
  });
});

// ============================================================================
// Test 3: Case insensitivity
// ============================================================================

console.log('\n=== Test 3: Case Insensitivity ===');

const testRoles = ['agent', 'AGENT', 'Agent', 'aGeNt'];
testRoles.forEach(role => {
  const nav = getNavByRole(role);
  console.log(`getNavByRole('${role}'): ${nav.length} items`);
});

// ============================================================================
// Test 4: Unknown role defaults
// ============================================================================

console.log('\n=== Test 4: Unknown Role Handling ===');

const unknownRoles = ['UNKNOWN', null, undefined, ''];
unknownRoles.forEach(role => {
  const nav = getNavByRole(role);
  console.log(`getNavByRole('${role}'): ${nav.length} items (defaults to COLLABORATOR)`);
});

// ============================================================================
// Test 5: Staff role mapping
// ============================================================================

console.log('\n=== Test 5: Staff Role Mapping ===');

const staffNav = getNavByRole('STAFF');
const adminNavCompare = getNavByRole('ADMIN');
console.log(`STAFF nav items: ${staffNav.length}`);
console.log(`ADMIN nav items: ${adminNavCompare.length}`);
console.log(`STAFF === ADMIN: ${staffNav === adminNavCompare}`);

// ============================================================================
// Expected Results
// ============================================================================

console.log('\n=== Expected Results ===');
console.log(`
✅ AGENT should have: 4 items
   - Tableau de bord
   - Mes Athlètes
   - Analytics
   - Messages

✅ COLLABORATOR should have: 6 items
   - Tableau de bord
   - Explorer
   - Suivis
   - Organisations
   - Contrats
   - Messages

✅ ADMIN/STAFF should have: 8 items
   - Tableau de bord
   - Athlètes
   - Organisations
   - Utilisateurs
   - Contrats
   - Analytics
   - Paiements
   - Administration

✅ Access Control:
   - AGENT: Can access /athletes, /analytics, /messages
   - COLLABORATOR: Can access /explore, /organisations, /contracts
   - ADMIN: Can access ALL routes including /admin, /payments, /users

✅ Case insensitivity: 'agent', 'AGENT', 'Agent' all return same result

✅ Unknown roles: Default to COLLABORATOR navigation

✅ STAFF role: Maps to ADMIN navigation
`);

export {
  // Re-export for use in tests
  getNavByRole,
  hasAccessToPath,
};
