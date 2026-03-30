const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

async function request(url, options = {}) {
  console.log('API Request:', url); // Debug log
  const response = await fetch(url, options);
  if (!response.ok) {
    const errorText = await response.text();
    console.error('API Error:', response.status, errorText.substring(0, 100));
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }
  return response.json();
}

export const api = {
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
    
    register: (email, password) =>
      request(`${API_BASE}/api/users/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role: 'user' }),
      }),
    
    getProfile: (token) =>
      request(`${API_BASE}/api/users/profile`, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
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
