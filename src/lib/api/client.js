/**
 * API Client
 * 
 * Base configuration and utilities for making API requests.
 * Handles authentication, error handling, and request/response formatting.
 */

import { API_BASE_URL } from "../api";

/**
 * Get CSRF token from cookies
 */
function getCsrfToken() {
  if (typeof document === 'undefined') return null;
  
  const name = 'csrftoken';
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.substring(0, name.length + 1) === (name + '=')) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

/**
 * Base fetch wrapper with authentication and error handling
 */
export async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  // Get CSRF token for unsafe methods
  const csrfToken = getCsrfToken();
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };
  
  // Add CSRF token for POST, PUT, PATCH, DELETE
  if (csrfToken && ['POST', 'PUT', 'PATCH', 'DELETE'].includes(options.method?.toUpperCase())) {
    headers['X-CSRFToken'] = csrfToken;
  }
  
  const config = {
    ...options,
    headers,
    credentials: "include", // Include cookies for authentication
  };

  try {
    const response = await fetch(url, config);

    // Handle different response types
    const contentType = response.headers.get("content-type");
    let data;

    if (contentType && contentType.includes("application/json")) {
      data = await response.json();
    } else if (contentType && contentType.includes("application/pdf")) {
      data = await response.blob();
    } else {
      data = await response.text();
    }

    if (!response.ok) {
      throw {
        status: response.status,
        message: data?.message || data?.detail || "Une erreur est survenue",
        data,
      };
    }

    return data;
  } catch (error) {
    if (error.status) {
      throw error;
    }
    throw {
      status: 0,
      message: "Erreur de connexion au serveur",
      error,
    };
  }
}

/**
 * GET request
 */
export async function get(endpoint, params = {}) {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      searchParams.append(key, value);
    }
  });

  const queryString = searchParams.toString();
  const url = queryString ? `${endpoint}?${queryString}` : endpoint;

  return apiRequest(url, { method: "GET" });
}

/**
 * POST request
 */
export async function post(endpoint, body = null) {
  return apiRequest(endpoint, {
    method: "POST",
    body: body ? JSON.stringify(body) : null,
  });
}

/**
 * PUT request
 */
export async function put(endpoint, body) {
  return apiRequest(endpoint, {
    method: "PUT",
    body: JSON.stringify(body),
  });
}

/**
 * PATCH request
 */
export async function patch(endpoint, body) {
  return apiRequest(endpoint, {
    method: "PATCH",
    body: JSON.stringify(body),
  });
}

/**
 * DELETE request
 */
export async function del(endpoint) {
  return apiRequest(endpoint, { method: "DELETE" });
}

/**
 * Upload file (multipart/form-data)
 */
export async function upload(endpoint, formData) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const response = await fetch(url, {
    method: "POST",
    body: formData,
    credentials: "include",
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw {
      status: response.status,
      message: data?.message || data?.detail || "Upload failed",
      data,
    };
  }

  return response.json();
}
