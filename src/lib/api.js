
// Prefer env override if provided, fallback to API docs host
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

const ACCESS_COOKIE = "accessToken";
const REFRESH_COOKIE = "refreshToken";

const isBrowser = () => typeof window !== "undefined";

const normaliseBase64 = (segment) =>
  segment
    .padEnd(segment.length + ((4 - (segment.length % 4)) % 4), "=")
    .replace(/-/g, "+")
    .replace(/_/g, "/");

const parseJwt = (token) => {
  if (!token) return null;
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  try {
    const payload = normaliseBase64(parts[1]);
    return JSON.parse(atob(payload));
  } catch (error) {
    console.warn("Unable to parse JWT payload", error);
    return null;
  }
};

const computeExpiry = (token) => {
  const payload = parseJwt(token);
  if (!payload?.exp) return null;
  return payload.exp * 1000;
};

const setCookie = (name, value, { expires } = {}) => {
  if (!isBrowser()) return;
  let cookie = `${name}=${encodeURIComponent(value)}; path=/; SameSite=Lax`;
  if (expires) {
    cookie += `; expires=${new Date(expires).toUTCString()}`;
  }
  if (window.location.protocol === "https:") {
    cookie += "; Secure";
  }
  document.cookie = cookie;
};

const deleteCookie = (name) => {
  if (!isBrowser()) return;
  document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax`;
};

export const persistAuthTokens = (accessToken, refreshToken) => {
  if (!isBrowser()) return;
  try {
    if (accessToken) {
      localStorage.setItem("accessToken", accessToken);
      const expiry = computeExpiry(accessToken) ?? Date.now() + 60 * 60 * 1000;
      setCookie(ACCESS_COOKIE, accessToken, { expires: expiry });
    }
    if (refreshToken) {
      localStorage.setItem("refreshToken", refreshToken);
      // We intentionally avoid storing the refresh token in a cookie.
    }
  } catch (error) {
    console.warn("Unable to persist auth tokens", error);
  }
};

export const clearAuthTokens = () => {
  if (!isBrowser()) return;
  try {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  } catch (error) {
    console.warn("Unable to clear auth tokens", error);
  }
  deleteCookie(ACCESS_COOKIE);
  deleteCookie(REFRESH_COOKIE);
};

// 🔹 Reset Password Request
export const resetPassword = async (email) => {
  const res = await fetch(`${API_BASE_URL}/api/auth/reset-password/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  });

  if (!res.ok) {
    throw new Error("Reset password request failed");
  }

  return res.json();
};

// 🔹 Confirm Password Reset
export const confirmPasswordReset = async (token, newPassword) => {
  const res = await fetch(`${API_BASE_URL}/api/auth/reset-password/confirm/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      token,
      new_password: newPassword,
    }),
  });

  if (!res.ok) throw new Error("Password reset confirmation failed");
  return res.json();
};

// 🔹 Register a new user
export const registerUser = async (userData) => {
  const res = await fetch(`${API_BASE_URL}/api/users/register/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Registration failed");
  }

  return res.json();
};

// 🔹 Verify Email
export const verifyEmail = async (token) => {
  const res = await fetch(`${API_BASE_URL}/api/auth/verify-email/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data.error || "Échec de la vérification.");
    err.status = res.status;
    throw err;
  }
  return data;
};

// ---------- Public data endpoints ----------

// Helper: attach Authorization header if accessToken is available (for user-scoped fields like is_followed)
const withAuthIfAvailable = () => {
  try {
    if (typeof window === 'undefined') return {};
    const token = localStorage.getItem("accessToken");
    return token ? { Authorization: `Bearer ${token}` } : {};
  } catch {
    return {};
  }
};

export const getAthletes = async () => {
  const res = await fetch(`${API_BASE_URL}/api/athletes/`, {
    cache: "no-store",
    headers: { ...withAuthIfAvailable() },
  });
  if (!res.ok) throw new Error("Impossible de charger les athlètes");
  const data = await res.json();
  // If paginated (DRF), return results, else assume array
  return Array.isArray(data) ? data : data.results || [];
};

export const getAthleteBySlug = async (identifier) => {
  if (!identifier) return null;
  const trimmed = String(identifier).trim().replace(/^\/+|\/+$/g, "");
  if (!trimmed) return null;

  const segments = trimmed.split("/").filter(Boolean);
  const candidate = segments.length ? segments[segments.length - 1] : trimmed;
  const isUuid = /[0-9a-fA-F-]{36}/.test(candidate);

  const fetchById = async (id) => {
    const res = await fetch(`${API_BASE_URL}/api/athletes/${id}/`, {
      cache: "no-store",
      headers: { ...withAuthIfAvailable() },
    });
    if (!res.ok) return null;
    try {
      return await res.json();
    } catch {
      return null;
    }
  };

  if (isUuid) {
    const athlete = await fetchById(candidate);
    if (athlete) return athlete;
  }

  const slug = candidate.toLowerCase();

  // Try a direct lookup via list filtering ?slug=<value>
  try {
    const res = await fetch(
      `${API_BASE_URL}/api/athletes/?slug=${encodeURIComponent(slug)}`,
      {
        cache: "no-store",
        headers: { ...withAuthIfAvailable() },
      },
    );
    if (res.ok) {
      const payload = await res.json().catch(() => null);
      if (Array.isArray(payload)) {
        const match = payload.find((entry) => (entry.slug ?? "").toLowerCase() === slug);
        if (match) return match;
      } else if (payload?.results) {
        const match = payload.results.find((entry) => (entry.slug ?? "").toLowerCase() === slug);
        if (match) return match;
      }
    }
  } catch (error) {
    console.warn("Unable to fetch athlete by slug", error);
  }

  // Fallback: fetch list and attempt to resolve by slug/profile_url/id
  const list = await getAthletes();
  const lowerSlug = slug;
  return (
    list.find((entry) => {
      const entrySlug = (entry.slug || entry.profile_slug || "").toLowerCase();
      if (entrySlug && entrySlug === lowerSlug) {
        return true;
      }
      const profileUrl = (entry.profile_url || "").replace(/\/+$/, "");
      if (profileUrl) {
        const parts = profileUrl.split("/").filter(Boolean);
        const urlSlug = parts.length ? parts[parts.length - 1].toLowerCase() : "";
        if (urlSlug === lowerSlug) {
          return true;
        }
      }
      return String(entry.id) === candidate;
    }) || null
  );
};

export const getAthletesPage = async (limit = 12, offset = 0) => {
  const url = `${API_BASE_URL}/api/athletes/?limit=${limit}&offset=${offset}`;
  let headers = {};
  // Ajoute le header Authorization si token dispo
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("accessToken") || null;
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }
  const res = await fetch(url, { cache: "no-store", headers });
  if (!res.ok) throw new Error("Impossible de charger les athlètes");
  const data = await res.json();
  if (Array.isArray(data)) {
    // non-paginated fallback
    return { results: data.slice(offset, offset + limit), next: data.length > offset + limit ? url : null };
  }
  return { results: data.results || [], next: data.next || null };
};

export const login = async (email, password) => {
  const res = await fetch(`${API_BASE_URL}/api/users/login/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  let data;
  try {
    data = await res.json();
  } catch (parseError) {
    throw new Error("Internal server error");
  }

  if (!res.ok) {
    const message =
      data?.detail ||
      data?.error ||
      data?.message ||
      (res.status === 401 ? "Identifiants invalides." : "Échec de la connexion");
    const error = new Error(message);
    error.status = res.status;
    throw error;
  }

  persistAuthTokens(data.access, data.refresh);
  return data;
};

// 🔹 Refresh Access Token
export const refreshAccessToken = async () => {
  const refreshToken = localStorage.getItem("refreshToken");
  if (!refreshToken) throw new Error("No refresh token available");

  const res = await fetch(`${API_BASE_URL}/api/users/refresh/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ refresh: refreshToken }),
  });

  if (!res.ok) {
    throw new Error("Token refresh failed");
  }

  const data = await res.json();
  persistAuthTokens(data.access, refreshToken);
  return data.access;
};

// 🔹 Logout User
export const logout = () => {
  clearAuthTokens();
  window.location.href = "/login?origin=logout";
  
};

// 🔹 Fetch User Profile
const getStoredAccessToken = () => {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem("accessToken");
  } catch (error) {
    console.warn("Unable to read access token", error);
    return null;
  }
};

const ensureObjectPayload = (data) => {
  if (data && typeof data === "object" && !Array.isArray(data)) {
    return data;
  }
  throw new Error("Les données de mise à jour doivent être un objet JSON valide");
};

const authedRequest = async (path, { method = "GET", body } = {}) => {
  const token = getStoredAccessToken();
  if (!token) throw new Error("Utilisateur non authentifié");

  const execute = async (accessToken) =>
    fetch(`${API_BASE_URL}${path}`, {
      method,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        ...(body !== undefined ? { "Content-Type": "application/json" } : {}),
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });

  let response = await execute(token);
  if (response.status === 401) {
    const refreshedToken = await refreshAccessToken();
    response = await execute(refreshedToken);
  }
  return response;
};

export const fetchUserProfile = async () => {
  const response = await authedRequest("/api/users/me/");
  if (!response.ok) throw new Error("Failed to fetch user profile");
  return response.json();
};

// 🔹 Update User Profile
// 🔹 Mettre à jour le profil utilisateur avec PATCH
export const updateProfile = async (data) => {
  const payload = ensureObjectPayload(data ?? {});
  const response = await authedRequest("/api/users/me/", { method: "PATCH", body: payload });
  if (!response.ok) {
    const errorResponse = await response.json().catch(() => ({}));
    throw new Error(errorResponse?.message || "Échec de la mise à jour du profil");
  }
  const text = await response.text();
  if (!text) {
    return null;
  }
  try {
    return JSON.parse(text);
  } catch (error) {
    console.warn("Unable to parse profile update response", error);
    return null;
  }
};


// 🔹 Request Password Reset
export const requestPasswordReset = async (email) => {
  const res = await fetch(`${API_BASE_URL}/api/auth/password/reset/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });

  if (!res.ok) {
    throw new Error("Password reset request failed");
  }

  return res.json();
};

// 🔹 Change Password
export const changePassword = async (oldPassword, newPassword, confirmNewPassword) => {
  let token = localStorage.getItem("accessToken");
  if (!token) throw new Error("User not authenticated");

  let res = await fetch(`${API_BASE_URL}/api/auth/change-password/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      old_password: oldPassword,
      new_password: newPassword,
      confirm_new_password: confirmNewPassword ?? newPassword,
    }),
  });

  if (res.status === 401) {
    token = await refreshAccessToken();
    res = await fetch(`${API_BASE_URL}/api/auth/change-password/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        old_password: oldPassword,
        new_password: newPassword,
        confirm_new_password: confirmNewPassword ?? newPassword,
      }),
    });
  }

  if (!res.ok) throw new Error("Password change failed");
  return res.json();
};

// 🔹 Delete account (Right to erasure)
export const deleteAccount = async () => {
  let token = localStorage.getItem("accessToken");
  if (!token) throw new Error("User not authenticated");

  let res = await fetch(`${API_BASE_URL}/api/privacy/erase/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (res.status === 401) {
    token = await refreshAccessToken();
    res = await fetch(`${API_BASE_URL}/api/privacy/erase/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
  }

  if (!res.ok) {
    let msg = "Failed to delete account";
    try { const data = await res.json(); msg = data?.message || msg; } catch {}
    throw new Error(msg);
  }

  return res.json();
};

// 🔹 Organisation Management

// Get all organisations
export const fetchOrganisations = async () => {
  let token = localStorage.getItem("accessToken");
  if (!token) throw new Error("User not authenticated");

  let res = await fetch(`${API_BASE_URL}/api/organisations/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (res.status === 401) {
    token = await refreshAccessToken();
    res = await fetch(`${API_BASE_URL}/api/organisations/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
  }

  if (!res.ok) throw new Error("Failed to fetch organisations");
  return res.json();
};

// Create a new organisation
export const createOrganisation = async (organisationData) => {
  let token = localStorage.getItem("accessToken");
  if (!token) throw new Error("User not authenticated");

  let res = await fetch(`${API_BASE_URL}/api/organisations/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(organisationData),
  });

  if (res.status === 401) {
    token = await refreshAccessToken();
    res = await fetch(`${API_BASE_URL}/api/organisations/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(organisationData),
    });
  }

  if (!res.ok) {
    let msg = "Failed to create organisation";
    try { 
      const errorData = await res.json(); 
      msg = errorData?.message || errorData?.detail || msg;
    } catch {}
    throw new Error(msg);
  }

  return res.json();
};

// Join an organisation with invitation code
export const joinOrganisation = async (invitationCode) => {
  let token = localStorage.getItem("accessToken");
  if (!token) throw new Error("User not authenticated");

  let res = await fetch(`${API_BASE_URL}/api/organisations/join/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ invitation_code: invitationCode }),
  });

  if (res.status === 401) {
    token = await refreshAccessToken();
    res = await fetch(`${API_BASE_URL}/api/organisations/join/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ invitation_code: invitationCode }),
    });
  }

  if (!res.ok) {
    let msg = "Failed to join organisation";
    try { 
      const errorData = await res.json(); 
      msg = errorData?.message || errorData?.detail || msg;
    } catch {}
    throw new Error(msg);
  }

  return res.json();
};

// Get specific organisation details
export const fetchOrganisation = async (organisationId) => {
  let token = localStorage.getItem("accessToken");
  if (!token) throw new Error("User not authenticated");

  let res = await fetch(`${API_BASE_URL}/api/organisations/${organisationId}/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (res.status === 401) {
    token = await refreshAccessToken();
    res = await fetch(`${API_BASE_URL}/api/organisations/${organisationId}/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
  }

  if (!res.ok) throw new Error("Failed to fetch organisation");
  return res.json();
};

// Update organisation
export const updateOrganisation = async (organisationId, organisationData) => {
  let token = localStorage.getItem("accessToken");
  if (!token) throw new Error("User not authenticated");

  let res = await fetch(`${API_BASE_URL}/api/organisations/${organisationId}/`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(organisationData),
  });

  if (res.status === 401) {
    token = await refreshAccessToken();
    res = await fetch(`${API_BASE_URL}/api/organisations/${organisationId}/`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(organisationData),
    });
  }

  if (!res.ok) throw new Error("Failed to update organisation");
  return res.json();
};

// Get organisation collaborators
export const fetchOrganisationCollaborators = async (organisationId) => {
  let token = localStorage.getItem("accessToken");
  if (!token) throw new Error("User not authenticated");

  let res = await fetch(`${API_BASE_URL}/api/organisations/${organisationId}/collaborators/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (res.status === 401) {
    token = await refreshAccessToken();
    res = await fetch(`${API_BASE_URL}/api/organisations/${organisationId}/collaborators/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
  }

  if (!res.ok) throw new Error("Failed to fetch collaborators");
  return res.json();
};

// Get organisation invites
export const fetchOrganisationInvites = async (organisationId) => {
  let token = localStorage.getItem("accessToken");
  if (!token) throw new Error("User not authenticated");

  let res = await fetch(`${API_BASE_URL}/api/organisations/${organisationId}/invites/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (res.status === 401) {
    token = await refreshAccessToken();
    res = await fetch(`${API_BASE_URL}/api/organisations/${organisationId}/invites/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
  }

  if (!res.ok) throw new Error("Failed to fetch invites");
  return res.json();
};

// Create organisation invite
export const createOrganisationInvite = async (organisationId, inviteData = {}) => {
  let token = localStorage.getItem("accessToken");
  if (!token) throw new Error("User not authenticated");

  let res = await fetch(`${API_BASE_URL}/api/organisations/${organisationId}/invites/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(inviteData),
  });

  if (res.status === 401) {
    token = await refreshAccessToken();
    res = await fetch(`${API_BASE_URL}/api/organisations/${organisationId}/invites/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(inviteData),
    });
  }

  if (!res.ok) throw new Error("Failed to create invite");
  return res.json();
};

// 🔹 Sports Management

// Get all sports
export const fetchSports = async () => {
  let token = localStorage.getItem("accessToken");
  if (!token) throw new Error("User not authenticated");

  let res = await fetch(`${API_BASE_URL}/api/sports/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (res.status === 401) {
    token = await refreshAccessToken();
    res = await fetch(`${API_BASE_URL}/api/sports/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
  }

  if (!res.ok) throw new Error("Failed to fetch sports");
  return res.json();
};

// Get disciplines for a specific sport
export const fetchSportDisciplines = async (sportId) => {
  let token = localStorage.getItem("accessToken");
  if (!token) throw new Error("User not authenticated");

  let res = await fetch(`${API_BASE_URL}/api/sports/${sportId}/disciplines/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (res.status === 401) {
    token = await refreshAccessToken();
    res = await fetch(`${API_BASE_URL}/api/sports/${sportId}/disciplines/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
  }

  if (!res.ok) throw new Error("Failed to fetch sport disciplines");
  return res.json();
};

// 🔹 Athletes Management

// Get all athletes
export const fetchAthletes = async () => {
  let token = localStorage.getItem("accessToken");
  if (!token) throw new Error("User not authenticated");

  let res = await fetch(`${API_BASE_URL}/api/athletes/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (res.status === 401) {
    token = await refreshAccessToken();
    res = await fetch(`${API_BASE_URL}/api/athletes/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
  }

  if (!res.ok) throw new Error("Failed to fetch athletes");
  return res.json();
};

// Create a new athlete
export const createAthlete = async (athleteData) => {
  let token = localStorage.getItem("accessToken");
  if (!token) throw new Error("User not authenticated");

  let res = await fetch(`${API_BASE_URL}/api/athletes/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(athleteData),
  });

  if (res.status === 401) {
    token = await refreshAccessToken();
    res = await fetch(`${API_BASE_URL}/api/athletes/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(athleteData),
    });
  }

  if (!res.ok) {
    let msg = "Failed to create athlete";
    try { 
      const errorData = await res.json(); 
      msg = errorData?.message || errorData?.detail || msg;
    } catch {}
    throw new Error(msg);
  }

  return res.json();
};

// Get specific athlete details
export const fetchAthlete = async (athleteId) => {
  let token = localStorage.getItem("accessToken");
  if (!token) throw new Error("User not authenticated");

  let res = await fetch(`${API_BASE_URL}/api/athletes/${athleteId}/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (res.status === 401) {
    token = await refreshAccessToken();
    res = await fetch(`${API_BASE_URL}/api/athletes/${athleteId}/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
  }

  if (!res.ok) throw new Error("Failed to fetch athlete");
  return res.json();
};

// Update athlete
export const updateAthlete = async (athleteId, athleteData) => {
  let token = localStorage.getItem("accessToken");
  if (!token) throw new Error("User not authenticated");

  let res = await fetch(`${API_BASE_URL}/api/athletes/${athleteId}/`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(athleteData),
  });

  if (res.status === 401) {
    token = await refreshAccessToken();
    res = await fetch(`${API_BASE_URL}/api/athletes/${athleteId}/`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(athleteData),
    });
  }

  if (!res.ok) throw new Error("Failed to update athlete");
  return res.json();
};

// Delete athlete
export const deleteAthlete = async (athleteId) => {
  let token = localStorage.getItem("accessToken");
  if (!token) throw new Error("User not authenticated");

  let res = await fetch(`${API_BASE_URL}/api/athletes/${athleteId}/`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (res.status === 401) {
    token = await refreshAccessToken();
    res = await fetch(`${API_BASE_URL}/api/athletes/${athleteId}/`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
  }

  if (!res.ok) throw new Error("Failed to delete athlete");
  return res.status === 204;
};

// Get my athletes (for agents)
export const fetchMyAthletes = async () => {
  let token = localStorage.getItem("accessToken");
  if (!token) throw new Error("User not authenticated");

  let res = await fetch(`${API_BASE_URL}/api/me/athletes/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (res.status === 401) {
    token = await refreshAccessToken();
    res = await fetch(`${API_BASE_URL}/api/me/athletes/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
  }

  if (!res.ok) throw new Error("Failed to fetch my athletes");
  return res.json();
};

// Follow/unfollow athlete
export const followAthlete = async (athleteId) => {
  let token = localStorage.getItem("accessToken");
  if (!token) throw new Error("User not authenticated");

  let res = await fetch(`${API_BASE_URL}/api/athletes/${athleteId}/follow/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (res.status === 401) {
    token = await refreshAccessToken();
    res = await fetch(`${API_BASE_URL}/api/athletes/${athleteId}/follow/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
  }

  if (!res.ok) throw new Error("Failed to follow athlete");
  return res.json();
};

export const unfollowAthlete = async (athleteId) => {
  let token = localStorage.getItem("accessToken");
  if (!token) throw new Error("User not authenticated");

  let res = await fetch(`${API_BASE_URL}/api/athletes/${athleteId}/follow/`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (res.status === 401) {
    token = await refreshAccessToken();
    res = await fetch(`${API_BASE_URL}/api/athletes/${athleteId}/follow/`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
  }

  if (!res.ok) throw new Error("Failed to unfollow athlete");
  return res.status === 204;
};

// Get athlete photos
export const fetchAthletePhotos = async (athleteId) => {
  let token = localStorage.getItem("accessToken");
  if (!token) throw new Error("User not authenticated");

  let res = await fetch(`${API_BASE_URL}/api/athletes/${athleteId}/photos/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (res.status === 401) {
    token = await refreshAccessToken();
    res = await fetch(`${API_BASE_URL}/api/athletes/${athleteId}/photos/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
  }

  if (!res.ok) throw new Error("Failed to fetch athlete photos");
  return res.json();
};
