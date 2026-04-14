const API_BASE = '/api';

class ApiClient {
  constructor() {
    this.token = localStorage.getItem('token');
  }

  setToken(token) {
    this.token = token;
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }

  async request(endpoint, options = {}) {
    const url = `${API_BASE}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Request failed' }));
        console.error(`API Error [${response.status}] ${endpoint}:`, error);
        throw { status: response.status, ...error };
      }

      return response.json();
    } catch (err) {
      console.error(`API Request Failed ${endpoint}:`, err);
      throw err;
    }
  }

  // Auth
  auth = {
    register: (data) => this.request('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
    login: (data) => this.request('/auth/login', { method: 'POST', body: JSON.stringify(data) }),
    google: (googleToken) => this.request('/auth/google', { method: 'POST', body: JSON.stringify({ googleToken }) }),
    me: () => this.request('/auth/me'),
    logout: () => {
      this.setToken(null);
      window.location.href = '/';
    },
    forgotPassword: (email) => this.request('/auth/forgot-password', { method: 'POST', body: JSON.stringify({ email }) }),
    resetPassword: (data) => this.request('/auth/reset-password', { method: 'POST', body: JSON.stringify(data) }),
  };

  // Projects
  projects = {
    list: (sort = '-created_at', limit = 50) => this.request(`/projects?sort=${sort}&limit=${limit}`),
    get: (id) => this.request(`/projects/${id}`),
    create: (data) => this.request('/projects', { method: 'POST', body: JSON.stringify(data) }),
    update: (id, data) => this.request(`/projects/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
    delete: (id) => this.request(`/projects/${id}`, { method: 'DELETE' }),
  };

  // Segments
  segments = {
    list: (projectId, sort = '-created_at', limit = 200) => this.request(`/projects/${projectId}/segments?sort=${sort}&limit=${limit}`),
    create: (data) => this.request('/segments', { method: 'POST', body: JSON.stringify(data) }),
    update: (id, data) => this.request(`/segments/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  };

  // AI
  ai = {
    analyze: (data) => this.request('/ai/analyze', { method: 'POST', body: JSON.stringify(data) }),
    generatePost: (data) => this.request('/ai/generate-post', { method: 'POST', body: JSON.stringify(data) }),
  };

  // Social Accounts
  socialAccounts = {
    list: () => this.request('/social-accounts'),
    getOAuthUrl: (platform) => this.request(`/social-accounts/oauth-url/${platform}`),
    connect: (data) => this.request('/social-accounts', { method: 'POST', body: JSON.stringify(data) }),
    disconnect: (id) => this.request(`/social-accounts/${id}`, { method: 'DELETE' }),
  };

  // Subscription & Payment
  subscription = {
    get: () => this.request('/subscription'),
    getPlans: () => this.request('/pricing'),
    getLimits: (plan) => this.request(`/subscription/limits/${plan}`),
    initializePayment: (data) => this.request('/payment/initialize', { method: 'POST', body: JSON.stringify(data) }),
    verifyPayment: (data) => this.request('/payment/verify', { method: 'POST', body: JSON.stringify(data) }),
  };

  admin = {
    getUsers: () => this.request('/admin/users'),
    getPricing: () => this.request('/admin/pricing'),
    updatePricing: (plan, data) => this.request(`/admin/pricing/${plan}`, { method: 'PUT', body: JSON.stringify(data) }),
    addPricing: (data) => this.request('/admin/pricing', { method: 'POST', body: JSON.stringify(data) }),
  };
}

export const api = new ApiClient();
export default api;