/**
 * Sports API
 * 
 * Functions for retrieving sports and disciplines.
 */

import { get } from "./client";

/**
 * Get all sports
 */
export async function getSports() {
  return get("/sports/");
}

/**
 * Get disciplines for a sport
 */
export async function getSportDisciplines(sportId) {
  return get(`/sports/${sportId}/disciplines/`);
}
