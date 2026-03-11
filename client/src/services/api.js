const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

async function request(url, options = {}) {
  const response = await fetch(url, options);
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }
  return response.json();
}

export const api = {
  projects: {
    getAll: () => request(`${API_BASE}/projects`),
  },

  contact: {
    submit: (data) =>
      request(`${API_BASE}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }),
  },

  blog: {
    getPosts: (username, n = 5) =>
      request(
        `https://dev.to/api/articles?username=${encodeURIComponent(username)}&per_page=${n}`
      ),
  },
};
