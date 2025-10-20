import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests if it exists
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - redirect to login
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        window.location.href = '/auth/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;

// ========== HEALTH CHECK ==========
export const healthCheck = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL.replace('/api', '')}/health`);
    return response.data;
  } catch (error) {
    console.error('Health check failed:', error);
    return { ok: false, error: error.message };
  }
};

// ========== AUTH APIs ==========
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (data) => api.put('/auth/profile', data)
};

// ========== BLOG APIs ==========
export const blogAPI = {
  // Get all blogs with filters
  getBlogs: (params) => api.get('/blogs', { params }),
  
  // Get single blog
  getBlog: (id) => api.get(`/blogs/${id}`),
  
  // Create blog
  createBlog: (data) => api.post('/blogs', data),
  
  // Update blog
  updateBlog: (id, data) => api.put(`/blogs/${id}`, data),
  
  // Delete blog
  deleteBlog: (id) => api.delete(`/blogs/${id}`),
  
  // Like/Unlike blog
  toggleLike: (id) => api.post(`/blogs/${id}/like`),
  
  // Get my blogs
  getMyBlogs: () => api.get('/blogs/user/my-blogs'),
  
  // Get trending blogs
  getTrendingBlogs: () => api.get('/blogs/trending/top')
};

// ========== REWARD APIs ==========
export const rewardAPI = {
  // Get wallet info
  getWallet: () => api.get('/rewards/wallet'),
  
  // Get transactions
  getTransactions: (params) => api.get('/rewards/transactions', { params }),
  
  // Get user stats
  getStats: () => api.get('/rewards/stats'),
  
  // Get leaderboard
  getLeaderboard: (params) => api.get('/rewards/leaderboard', { params }),
  
  // Claim daily bonus
  claimDailyBonus: () => api.post('/rewards/daily-bonus'),
  
  // Get achievements
  getAchievements: () => api.get('/rewards/achievements')
};

// ========== DOMAIN APIs ==========
export const domainAPI = {
  // Check domain availability
  checkDomain: (domain) => api.post('/domain/check', { domain }),
  
  // Verify and connect domain
  verifyDomain: (domain) => api.post('/domain/verify', { domain }),
  
  // Get domain status
  getDomainStatus: () => api.get('/domain/status'),
  
  // Remove custom domain
  removeDomain: () => api.delete('/domain/remove')
};
