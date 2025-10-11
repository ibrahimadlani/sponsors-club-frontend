/**
 * Contracts API
 * 
 * Functions for managing contracts, clauses, and signing.
 */

import { get, post, patch, del } from "./client";

/**
 * Get all contracts
 */
export async function getContracts() {
  return get("/contracts/");
}

/**
 * Get contract by ID
 */
export async function getContract(id) {
  return get(`/contracts/${id}/`);
}

/**
 * Create a new contract
 */
export async function createContract(data) {
  return post("/contracts/", data);
}

/**
 * Get contract options/metadata
 */
export async function getContractOptions() {
  return get("/contracts/options/");
}

/**
 * Change contract status
 */
export async function changeContractStatus(id, status) {
  return patch(`/contracts/${id}/status/`, { status });
}

/**
 * Agree to contract terms
 */
export async function agreeToContract(id) {
  return post(`/contracts/${id}/agree/`);
}

/**
 * Expire a contract
 */
export async function expireContract(id) {
  return post(`/contracts/${id}/expire/`);
}

/**
 * Export contract as PDF
 */
export async function exportContractPDF(id) {
  return get(`/contracts/${id}/export/`);
}

// Clauses
/**
 * Add clause to contract
 */
export async function addClause(contractId, data) {
  return post(`/contracts/${contractId}/clauses/`, data);
}

/**
 * Update contract clause
 */
export async function updateClause(contractId, clauseId, data) {
  return patch(`/contracts/${contractId}/clauses/${clauseId}/`, data);
}

/**
 * Delete contract clause
 */
export async function deleteClause(contractId, clauseId) {
  return del(`/contracts/${contractId}/clauses/${clauseId}/`);
}

/**
 * Get clause templates
 */
export async function getClauseTemplates() {
  return get("/clause-templates/");
}

// Versions
/**
 * Get contract versions
 */
export async function getContractVersions(contractId) {
  return get(`/contracts/${contractId}/versions/`);
}

/**
 * Create contract revision
 */
export async function createRevision(contractId, data) {
  return post(`/contracts/${contractId}/revisions/`, data);
}

/**
 * Accept contract revision
 */
export async function acceptRevision(contractId, revisionId) {
  return post(`/contracts/${contractId}/revisions/${revisionId}/accept/`);
}

// Comments
/**
 * Get version comments
 */
export async function getVersionComments(contractId, versionId) {
  return get(`/contracts/${contractId}/versions/${versionId}/comments/`);
}

/**
 * Create version comment
 */
export async function createVersionComment(contractId, versionId, data) {
  return post(`/contracts/${contractId}/versions/${versionId}/comments/`, data);
}

// Legal Review
/**
 * Start legal review
 */
export async function startLegalReview(contractId) {
  return post(`/contracts/${contractId}/legal/review/`);
}

/**
 * Verify legal review
 */
export async function verifyLegalReview(contractId) {
  return patch(`/contracts/${contractId}/legal/verify/`);
}

// Signing
/**
 * Initialize contract signing
 */
export async function initSigning(contractId) {
  return post(`/contracts/${contractId}/signing/init/`);
}

/**
 * Get signing status
 */
export async function getSigningStatus(contractId) {
  return get(`/contracts/${contractId}/signing/status/`);
}

/**
 * Handle signing webhook (internal use)
 */
export async function handleSigningWebhook(payload) {
  return post("/contracts/signing/webhook/", payload);
}
