/**
 * Athletes API
 * 
 * Functions for interacting with athlete-related endpoints.
 */

import { get, post, put, patch, del } from "./client";

/**
 * Get all athletes
 */
export async function getAthletes(params = {}) {
  return get("/athletes/", params);
}

/**
 * Get athlete by ID
 */
export async function getAthlete(id) {
  return get(`/athletes/${id}/`);
}

/**
 * Get athlete by slug
 */
export async function getAthleteBySlug(slug) {
  return get(`/athletes/slug/${slug}/`);
}

/**
 * Create a new athlete
 */
export async function createAthlete(data) {
  return post("/athletes/", data);
}

/**
 * Update an athlete
 */
export async function updateAthlete(id, data) {
  return put(`/athletes/${id}/`, data);
}

/**
 * Partially update an athlete
 */
export async function patchAthlete(id, data) {
  return patch(`/athletes/${id}/`, data);
}

/**
 * Delete an athlete
 */
export async function deleteAthlete(id) {
  return del(`/athletes/${id}/`);
}

/**
 * Follow an athlete
 */
export async function followAthlete(athleteId) {
  return post(`/athletes/${athleteId}/follow/`);
}

/**
 * Unfollow an athlete
 */
export async function unfollowAthlete(athleteId) {
  return del(`/athletes/${athleteId}/follow/`);
}

/**
 * Get athlete photos
 */
export async function getAthletePhotos(athleteId) {
  return get(`/athletes/${athleteId}/photos/`);
}

/**
 * Get current user's athletes (for agents)
 */
export async function getMyAthletes() {
  return get("/me/athletes/");
}
