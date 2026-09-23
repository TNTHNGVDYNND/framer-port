const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// I3 (#40, PR #48 review): a 401 means the session is gone/revoked (cookie
// expired, force-logout, tokenVersion bump). Instead of error toasts on every
// call, reload ONCE — the fresh page re-bootstraps auth from /profile into the
// guest state and the UI reorients (login gate). The flag guards reload loops;
// any successful response clears it so a future session's 401 reloads again.
const RELOADED_FOR_401 = 'api.reloadedFor401';

async function request(url, options = {}) {
  console.log('API Request:', url); // Debug log
  // M-2/#31: auth rides the HttpOnly cookie (credentials: 'include') — no token
  // is read from or attached by JS.
  const response = await fetch(url, { credentials: 'include', ...options });
  if (response.status === 401 && !sessionStorage.getItem(RELOADED_FOR_401)) {
    sessionStorage.setItem(RELOADED_FOR_401, '1');
    window.location.assign(window.location.pathname + window.location.search);
    throw new Error('HTTP 401: session expired — reloading');
  }
  if (response.ok) {
    sessionStorage.removeItem(RELOADED_FOR_401);
  }
  if (!response.ok) {
    const errorText = await response.text();
    console.error('API Error:', response.status, errorText.substring(0, 100));
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }
  return response.json();
}

export const api = {
  // Generic HTTP methods
  get: (endpoint) => {
    return request(`${API_BASE}/api${endpoint}`, {
      headers: { 'Content-Type': 'application/json' },
    });
  },

  post: (endpoint, data) => {
    return request(`${API_BASE}/api${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  },

  patch: (endpoint, data) => {
    return request(`${API_BASE}/api${endpoint}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  },

  put: (endpoint, data) => {
    return request(`${API_BASE}/api${endpoint}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  },

  delete: (endpoint) => {
    return request(`${API_BASE}/api${endpoint}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    });
  },

  projects: {
    getAll: () => request(`${API_BASE}/api/projects`),
  },

  contact: {
    submit: (data) =>
      request(`${API_BASE}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }),
  },

  auth: {
    login: (email, password) =>
      request(`${API_BASE}/api/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      }),

    getProfile: () =>
      request(`${API_BASE}/api/users/profile`, {
        headers: { 'Content-Type': 'application/json' },
      }),
  },

  blog: {
    getPosts: (username, n = 5) =>
      request(
        `https://dev.to/api/articles?username=${encodeURIComponent(username)}&per_page=${n}`
      ),
  },
};

export default api;
