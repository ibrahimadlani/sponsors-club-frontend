/**
 * API Module Index
 * 
 * Centralized export of all API functions organized by domain.
 * Import from this file for a clean, organized API usage.
 * 
 * @example
 * import { athletes, users, payments } from '@/lib/api';
 * 
 * const athletesList = await athletes.getAthletes();
 * const currentUser = await users.getMe();
 * const plans = await payments.getPlans();
 */

import * as analytics from "./analytics";
import * as athletes from "./athletes";
import * as contracts from "./contracts";
import * as messaging from "./messaging";
import * as notifications from "./notifications";
import * as organisations from "./organisations";
import * as payments from "./payments";
import * as sports from "./sports";
import * as users from "./users";

// Export all modules as namespaces
export {
  analytics,
  athletes,
  contracts,
  messaging,
  notifications,
  organisations,
  payments,
  sports,
  users,
};

// Export client utilities for custom requests
export { apiRequest, get, post, put, patch, del as delete, upload } from "./client";

// Export auth utilities from main api.js
export { getUserFromToken, getUserRole } from "../api";

// Default export with all namespaces
const api = {
  analytics,
  athletes,
  contracts,
  messaging,
  notifications,
  organisations,
  payments,
  sports,
  users,
};

export default api;
