/**
 * Analytics API
 * 
 * Functions for interacting with analytics and statistics endpoints.
 */

import { get, post } from "./client";

/**
 * Sync all social accounts stats
 */
export async function syncAllAccounts() {
  return post("/analytics/accounts/sync_all/");
}

/**
 * Fetch stats for a specific social account
 */
export async function fetchAccountStats(accountId) {
  return post(`/analytics/accounts/${accountId}/fetch/`);
}

/**
 * Get daily stats for an athlete
 */
export async function getAthleteStats(athleteId, params = {}) {
  return get(`/analytics/athletes/${athleteId}/stats/`, params);
}

/**
 * Get stats summary for an athlete
 */
export async function getAthleteStatsSummary(athleteId) {
  return get(`/analytics/athletes/${athleteId}/stats/summary/`);
}

/**
 * Compare two athletes
 */
export async function compareAthletes(athleteId, otherId) {
  return get(`/analytics/athletes/${athleteId}/compare/${otherId}/`);
}
