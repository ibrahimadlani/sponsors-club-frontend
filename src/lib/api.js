
// Prefer env override if provided, fallback to documented local API
const DEFAULT_API_BASE = "http://localhost:8000/api";
const rawBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || DEFAULT_API_BASE;

// Normalise the base URL so we never end with a trailing slash
export const API_BASE_URL = rawBaseUrl.replace(/\/$/, "");

const makeUrl = (endpoint) =>
  `${API_BASE_URL}${endpoint.startsWith("/") ? "" : "/"}${endpoint}`;

// 🔹 Reset Password Request
export const resetPassword = async (email) => {
  const res = await fetch(makeUrl("/users/password/reset/"), {
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
  const res = await fetch(makeUrl("/users/password/reset/confirm/"), {
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
  const res = await fetch(makeUrl("/users/register/"), {
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
  const res = await fetch(makeUrl("/users/verify-email/"), {
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
    if (typeof window === "undefined") return {};
    const token = localStorage.getItem("accessToken");
    return token ? { Authorization: `Bearer ${token}` } : {};
  } catch {
    return {};
  }
};

export const getAthletes = async () => {
  const res = await fetch(makeUrl("/athletes/"), {
    cache: "no-store",
    headers: { ...withAuthIfAvailable() },
  });
  if (!res.ok) throw new Error("Impossible de charger les athlètes");
  const data = await res.json();
  // If paginated (DRF), return results, else assume array
  return Array.isArray(data) ? data : data.results || [];
};

export const getAthleteBySlug = async (slugOrId) => {
  // Try fetch by UUID first, else fallback to list and match by profile_url
  const isUuid = /[0-9a-fA-F-]{36}/.test(slugOrId);
  if (isUuid) {
    const res = await fetch(makeUrl(`/athletes/${slugOrId}/`), {
      cache: "no-store",
      headers: { ...withAuthIfAvailable() },
    });
    if (res.ok) return res.json();
  }
  const list = await getAthletes();
  return list.find((a) => a.profile_url === `/athletes/${slugOrId}` || a.id === slugOrId) || null;
};

export const getAthletesPage = async (pageSize = 12, page = 1) => {
  const params = new URLSearchParams({
    page: String(page),
    page_size: String(pageSize),
  });
  const url = `${makeUrl("/athletes/")}?${params.toString()}`;
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error("Impossible de charger les athlètes");
  const data = await res.json();
  if (Array.isArray(data)) {
    // non-paginated fallback
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    return {
      results: data.slice(start, end),
      next: end < data.length ? `${makeUrl("/athletes/")}?${new URLSearchParams({
        page: String(page + 1),
        page_size: String(pageSize),
      }).toString()}` : null,
    };
  }
  return { results: data.results || [], next: data.next || null };
};

export const login = async (email, password) => {
  const res = await fetch(makeUrl("/users/login/"), {
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
    // Création d'une erreur personnalisée incluant le status
    const error = new Error(data.message || "Login failed");
    error.status = res.status;
    throw error;
  }

  // Sauvegarde des tokens dans le localStorage
  if (typeof window !== "undefined") {
    localStorage.setItem("accessToken", data.access);
    localStorage.setItem("refreshToken", data.refresh);
  }
  return data;
};

// 🔹 Refresh Access Token
export const refreshAccessToken = async (refreshTokenParam) => {
  const refreshToken =
    refreshTokenParam ||
    (typeof window !== "undefined"
      ? localStorage.getItem("refreshToken")
      : null);
  if (!refreshToken) throw new Error("No refresh token available");

  const res = await fetch(makeUrl("/users/refresh/"), {
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
  if (typeof window !== "undefined") {
    localStorage.setItem("accessToken", data.access);
  }
  return data.access;
};

// 🔹 Logout User
export const logout = () => {
  if (typeof window === "undefined") return;
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");

  // Redirect to login page
  window.location.href = "/login?origin=logout";
};

// 🔹 Fetch User Profile
export const fetchUserProfile = async () => {
  const storedToken =
    typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
  let token = storedToken;
  if (!token) throw new Error("User not authenticated");

  let res = await fetch(makeUrl("/users/me/"), {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (res.status === 401) {
    token = await refreshAccessToken();
    res = await fetch(makeUrl("/users/me/"), {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  if (!res.ok) throw new Error("Failed to fetch user profile");
  return res.json();
};

// 🔹 Update User Profile
// 🔹 Mettre à jour le profil utilisateur avec PATCH
export const updateProfile = async (_id, data) => {
  let token =
    typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
  if (!token) throw new Error("Utilisateur non authentifié");

  if (typeof data !== "object") {
    throw new Error("Les données de mise à jour doivent être un objet JSON valide");
  }

  let res = await fetch(makeUrl("/users/me/"), {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (res.status === 401) {
    token = await refreshAccessToken();
    res = await fetch(makeUrl("/users/me/"), {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
  }

  if (!res.ok) {
    const errorResponse = await res.json();
    throw new Error(errorResponse.message || "Échec de la mise à jour du profil");
  }

  return res.json();
};


// 🔹 Request Password Reset
export const requestPasswordReset = async (email) => {
  const res = await fetch(makeUrl("/users/password/reset/"), {
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
  let token =
    typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
  if (!token) throw new Error("User not authenticated");

  let res = await fetch(makeUrl("/users/password/change/"), {
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
    res = await fetch(makeUrl("/users/password/change/"), {
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
  let token =
    typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
  if (!token) throw new Error("User not authenticated");

  let res = await fetch(makeUrl("/users/me/"), {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (res.status === 401) {
    token = await refreshAccessToken();
    res = await fetch(makeUrl("/users/me/"), {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
  }

  if (!res.ok) {
    let msg = "Failed to delete account";
    try {
      const data = await res.json();
      msg = data?.message || msg;
    } catch {}
    throw new Error(msg);
  }

  try {
    return await res.json();
  } catch {
    return null;
  }
};
