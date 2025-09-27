import { API_BASE_URL, refreshAccessToken } from "./api";
const API_PREFIX = "/api/";

const buildUrl = (path, params) => {
  const normalisedPath = path.startsWith("/api/") ? path : `${API_PREFIX}${path.startsWith("/") ? "" : "/"}${path.replace(/^\//, "")}`;
  const url = new URL(normalisedPath, API_BASE_URL);
  if (params && typeof params === "object") {
    Object.entries(params)
      .filter(([, value]) => value !== undefined && value !== null)
      .forEach(([key, value]) => {
        if (Array.isArray(value)) {
          value.forEach((entry) => url.searchParams.append(key, entry));
        } else {
          url.searchParams.append(key, value);
        }
      });
  }
  return url.toString();
};

const parseResponse = async (response) => {
  const text = await response.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
};

const apiRequest = async (
  path,
  { method = "GET", params, body, auth = false, headers: customHeaders } = {}
) => {
  const url = buildUrl(path, params);
  const headers = new Headers(customHeaders);
  if (body !== undefined && !headers.has("Content-Type") && !(body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }
  let token = null;
  if (auth) {
    token = localStorage.getItem("accessToken");
    if (token) headers.set("Authorization", `Bearer ${token}`);
  }
  const requestInit = {
    method,
    headers,
    body: body instanceof FormData ? body : body !== undefined ? JSON.stringify(body) : undefined,
  };
  let response = await fetch(url, requestInit);
  if (response.status === 401 && auth) {
    token = await refreshAccessToken();
    headers.set("Authorization", `Bearer ${token}`);
    response = await fetch(url, requestInit);
  }
  if (!response.ok) {
    const errorPayload = await parseResponse(response);
    const error = new Error(
      errorPayload?.detail ||
        errorPayload?.message ||
        errorPayload?.error ||
        `Request failed with status ${response.status}`
    );
    error.status = response.status;
    error.payload = errorPayload;
    throw error;
  }
  return parseResponse(response);
};

export const analyticsEndpoints = {
  syncAllAccounts: () => apiRequest("/analytics/accounts/sync_all/", { method: "POST", auth: true }),
  fetchAccountStats: (accountId) =>
    apiRequest(`/analytics/accounts/${accountId}/fetch/`, { method: "POST", auth: true }),
  compareAthletes: (athleteId, otherId) =>
    apiRequest(`/analytics/athletes/${athleteId}/compare/${otherId}/`, { auth: true }),
  listAthleteStats: (athleteId, params) =>
    apiRequest(`/analytics/athletes/${athleteId}/stats/`, { params, auth: true }),
  listAthleteStatsSummary: (athleteId, params) =>
    apiRequest(`/analytics/athletes/${athleteId}/stats/summary/`, { params, auth: true }),
};

export const athleteEndpoints = {
  list: (params) => apiRequest("/athletes/", { params, auth: true }),
  create: (payload) => apiRequest("/athletes/", { method: "POST", body: payload, auth: true }),
  retrieve: (id) => apiRequest(`/athletes/${id}/`, { auth: true }),
  update: (id, payload) =>
    apiRequest(`/athletes/${id}/`, { method: "PUT", body: payload, auth: true }),
  partialUpdate: (id, payload) =>
    apiRequest(`/athletes/${id}/`, { method: "PATCH", body: payload, auth: true }),
  destroy: (id) => apiRequest(`/athletes/${id}/`, { method: "DELETE", auth: true }),
  follow: (id) => apiRequest(`/athletes/${id}/follow/`, { method: "POST", auth: true }),
  unfollow: (id) => apiRequest(`/athletes/${id}/follow/`, { method: "DELETE", auth: true }),
};

export const clauseTemplateEndpoints = {
  list: () => apiRequest("/clause-templates/", { auth: true }),
};

export const contractEndpoints = {
  list: (params) => apiRequest("/contracts/", { params, auth: true }),
  create: (payload) => apiRequest("/contracts/", { method: "POST", body: payload, auth: true }),
  retrieve: (id) => apiRequest(`/contracts/${id}/`, { auth: true }),
  createAgreement: (id, payload) =>
    apiRequest(`/contracts/${id}/agree/`, { method: "POST", body: payload, auth: true }),
  addClause: (id, payload) =>
    apiRequest(`/contracts/${id}/clauses/`, { method: "POST", body: payload, auth: true }),
  updateClause: (id, clauseId, payload) =>
    apiRequest(`/contracts/${id}/clauses/${clauseId}/`, { method: "PATCH", body: payload, auth: true }),
  removeClause: (id, clauseId) =>
    apiRequest(`/contracts/${id}/clauses/${clauseId}/`, { method: "DELETE", auth: true }),
  expire: (id, payload) =>
    apiRequest(`/contracts/${id}/expire/`, { method: "POST", body: payload, auth: true }),
  exportPdf: (id) => apiRequest(`/contracts/${id}/export/`, { auth: true }),
  startLegalReview: (id, payload) =>
    apiRequest(`/contracts/${id}/legal/review/`, { method: "POST", body: payload, auth: true }),
  verifyLegalReview: (id, payload) =>
    apiRequest(`/contracts/${id}/legal/verify/`, { method: "PATCH", body: payload, auth: true }),
  createRevision: (id, payload) =>
    apiRequest(`/contracts/${id}/revisions/`, { method: "POST", body: payload, auth: true }),
  acceptRevision: (id, revisionId, payload) =>
    apiRequest(`/contracts/${id}/revisions/${revisionId}/accept/`, {
      method: "POST",
      body: payload,
      auth: true,
    }),
  initSigning: (id, payload) =>
    apiRequest(`/contracts/${id}/signing/init/`, { method: "POST", body: payload, auth: true }),
  signingStatus: (id) => apiRequest(`/contracts/${id}/signing/status/`, { auth: true }),
  changeStatus: (id, payload) =>
    apiRequest(`/contracts/${id}/status/`, { method: "PATCH", body: payload, auth: true }),
  listVersions: (id) => apiRequest(`/contracts/${id}/versions/`, { auth: true }),
  listVersionComments: (id, versionId, params) =>
    apiRequest(`/contracts/${id}/versions/${versionId}/comments/`, { params, auth: true }),
  createVersionComment: (id, versionId, payload) =>
    apiRequest(`/contracts/${id}/versions/${versionId}/comments/`, {
      method: "POST",
      body: payload,
      auth: true,
    }),
};

export const contractOptionsEndpoints = {
  list: () => apiRequest("/contracts/options/", { auth: true }),
  signingWebhook: (payload) =>
    apiRequest("/contracts/signing/webhook/", { method: "POST", body: payload, auth: false }),
};

export const meEndpoints = {
  listAthletes: () => apiRequest("/me/athletes/", { auth: true }),
  listFollows: () => apiRequest("/me/follows/", { auth: true }),
};

export const messagingEndpoints = {
  listThreads: (params) => apiRequest("/messaging/threads/", { params, auth: true }),
  createThread: (payload) =>
    apiRequest("/messaging/threads/", { method: "POST", body: payload, auth: true }),
  listThreadMessages: (threadId, params) =>
    apiRequest(`/messaging/threads/${threadId}/messages/`, { params, auth: true }),
  createThreadMessage: (threadId, payload) =>
    apiRequest(`/messaging/threads/${threadId}/messages/`, { method: "POST", body: payload, auth: true }),
  markMessageRead: (messageId, payload) =>
    apiRequest(`/messaging/messages/${messageId}/read/`, { method: "PATCH", body: payload, auth: true }),
};

export const notificationEndpoints = {
  list: (params) => apiRequest("/notifications/", { params, auth: true }),
  markRead: (notificationId, payload) =>
    apiRequest(`/notifications/${notificationId}/read/`, { method: "PATCH", body: payload, auth: true }),
};

export const organisationEndpoints = {
  list: (params) => apiRequest("/organisations/", { params, auth: true }),
  create: (payload) => apiRequest("/organisations/", { method: "POST", body: payload, auth: true }),
  retrieve: (id) => apiRequest(`/organisations/${id}/`, { auth: true }),
  update: (id, payload) =>
    apiRequest(`/organisations/${id}/`, { method: "PUT", body: payload, auth: true }),
  partialUpdate: (id, payload) =>
    apiRequest(`/organisations/${id}/`, { method: "PATCH", body: payload, auth: true }),
  destroy: (id) => apiRequest(`/organisations/${id}/`, { method: "DELETE", auth: true }),
  listCollaborators: (id) => apiRequest(`/organisations/${id}/collaborators/`, { auth: true }),
  addCollaborator: (id, payload) =>
    apiRequest(`/organisations/${id}/collaborators/add/`, { method: "POST", body: payload, auth: true }),
  updateCollaboratorJobTitle: (id, collaboratorId, payload) =>
    apiRequest(`/organisations/${id}/collaborators/${collaboratorId}/job-title/`, {
      method: "PATCH",
      body: payload,
      auth: true,
    }),
  generateInvites: (id, payload) =>
    apiRequest(`/organisations/${id}/invites/`, { method: "POST", body: payload, auth: true }),
  listInvites: (id) => apiRequest(`/organisations/${id}/invites/`, { auth: true }),
  transferOwnership: (id, payload) =>
    apiRequest(`/organisations/${id}/transfer-ownership/`, { method: "POST", body: payload, auth: true }),
  removeCollaborator: (collaboratorId) =>
    apiRequest(`/organisations/collaborators/${collaboratorId}/`, { method: "DELETE", auth: true }),
  join: (payload) => apiRequest("/organisations/join/", { method: "POST", body: payload, auth: true }),
};

export const paymentEndpoints = {
  listPlans: () => apiRequest("/payments/plans/", { auth: true }),
  createCheckoutSession: (payload) =>
    apiRequest("/payments/stripe/checkout-session/", { method: "POST", body: payload, auth: true }),
  stripeWebhook: (payload) =>
    apiRequest("/payments/stripe/webhook/", { method: "POST", body: payload, auth: false }),
  createSubscription: (payload) =>
    apiRequest("/payments/subscriptions/", { method: "POST", body: payload, auth: true }),
  getMySubscription: () => apiRequest("/payments/subscriptions/me/", { auth: true }),
  cancelMySubscription: () =>
    apiRequest("/payments/subscriptions/me/", { method: "DELETE", auth: true }),
};

export const sportEndpoints = {
  listSports: () => apiRequest("/sports/", { auth: true }),
  listDisciplines: (sportId) => apiRequest(`/sports/${sportId}/disciplines/`, { auth: true }),
};

export const userEndpoints = {
  login: (payload) => apiRequest("/users/login/", { method: "POST", body: payload }),
  refresh: (payload) => apiRequest("/users/refresh/", { method: "POST", body: payload }),
  register: (payload) => apiRequest("/users/register/", { method: "POST", body: payload }),
  me: () => apiRequest("/users/me/", { auth: true }),
  updateMe: (payload) => apiRequest("/users/me/", { method: "PUT", body: payload, auth: true }),
  partialUpdateMe: (payload) => apiRequest("/users/me/", { method: "PATCH", body: payload, auth: true }),
  listEntitlements: () => apiRequest("/users/me/entitlements/", { auth: true }),
  listRoles: () => apiRequest("/users/me/roles/", { auth: true }),
  verifyEmail: (payload) => apiRequest("/users/verify-email/", { method: "POST", body: payload }),
};

export const utilityEndpoints = {
  resetPassword: (payload) => apiRequest("/auth/reset-password/", { method: "POST", body: payload }),
  confirmResetPassword: (payload) =>
    apiRequest("/auth/reset-password/confirm/", { method: "POST", body: payload }),
};

export default {
  analytics: analyticsEndpoints,
  athletes: athleteEndpoints,
  clauses: clauseTemplateEndpoints,
  contracts: contractEndpoints,
  contractOptions: contractOptionsEndpoints,
  me: meEndpoints,
  messaging: messagingEndpoints,
  notifications: notificationEndpoints,
  organisations: organisationEndpoints,
  payments: paymentEndpoints,
  sports: sportEndpoints,
  users: userEndpoints,
  utilities: utilityEndpoints,
};
