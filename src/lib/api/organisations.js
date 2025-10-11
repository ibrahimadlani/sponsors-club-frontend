/**
 * Organisations API
 * 
 * Functions for managing organisations and collaborators.
 */

import { get, post, put, patch, del } from "./client";

/**
 * Get all organisations
 */
export async function getOrganisations(params = {}) {
  return get("/organisations/", params);
}

/**
 * Get organisation by ID
 */
export async function getOrganisation(id) {
  return get(`/organisations/${id}/`);
}

/**
 * Create a new organisation
 */
export async function createOrganisation(data) {
  return post("/organisations/", data);
}

/**
 * Update an organisation
 */
export async function updateOrganisation(id, data) {
  return put(`/organisations/${id}/`, data);
}

/**
 * Partially update an organisation
 */
export async function patchOrganisation(id, data) {
  return patch(`/organisations/${id}/`, data);
}

/**
 * Get organisation collaborators
 */
export async function getOrganisationCollaborators(id) {
  return get(`/organisations/${id}/collaborators/`);
}

/**
 * Add collaborator to organisation
 */
export async function addCollaborator(organisationId, data) {
  return post(`/organisations/${organisationId}/collaborators/add/`, data);
}

/**
 * Remove collaborator from organisation
 */
export async function removeCollaborator(collaboratorId) {
  return del(`/organisations/collaborators/${collaboratorId}/`);
}

/**
 * Update collaborator job title
 */
export async function updateCollaboratorJobTitle(organisationId, collaboratorId, jobTitle) {
  return patch(`/organisations/${organisationId}/collaborators/${collaboratorId}/job-title/`, {
    job_title: jobTitle,
  });
}

/**
 * Get organisation invites
 */
export async function getOrganisationInvites(organisationId) {
  return get(`/organisations/${organisationId}/invites/`);
}

/**
 * Create organisation invite
 */
export async function createOrganisationInvite(organisationId, data) {
  return post(`/organisations/${organisationId}/invites/`, data);
}

/**
 * Join organisation with invite code
 */
export async function joinOrganisation(inviteCode) {
  return post("/organisations/join/", { invite_code: inviteCode });
}

/**
 * Transfer organisation ownership
 */
export async function transferOwnership(organisationId, newOwnerId) {
  return post(`/organisations/${organisationId}/transfer-ownership/`, {
    new_owner_id: newOwnerId,
  });
}
