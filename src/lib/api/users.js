/**
 * Users API
 * 
 * Functions for user authentication and profile management.
 */

import { get, post, put, patch } from "./client";

/**
 * Login user
 */
export async function login(email, password) {
  return post("/users/login/", { email, password });
}

/**
 * Register new user
 */
export async function register(data) {
  return post("/users/register/", data);
}

/**
 * Refresh access token
 */
export async function refreshToken(refreshToken) {
  return post("/users/refresh/", { refresh: refreshToken });
}

/**
 * Verify email address
 */
export async function verifyEmail(token) {
  return post("/users/verify-email/", { token });
}

/**
 * Get current user profile
 */
export async function getMe() {
  return get("/users/me/");
}

/**
 * Update current user profile
 */
export async function updateMe(data) {
  return put("/users/me/", data);
}

/**
 * Partially update current user profile
 */
export async function patchMe(data) {
  return patch("/users/me/", data);
}

/**
 * Get current user's entitlements
 */
export async function getMyEntitlements() {
  return get("/users/me/entitlements/");
}

/**
 * Get current user's roles
 */
export async function getMyRoles() {
  return get("/users/me/roles/");
}

/**
 * Get current user's followed athletes
 */
export async function getMyFollows() {
  return get("/me/follows/");
}
