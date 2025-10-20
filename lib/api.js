import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.cybev.io/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true
});

api.interceptors.request.use(
  (config) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (data) => api.put('/auth/profile', data)
};

export const blogAPI = {
  getBlogs: (params) => api.get('/blogs', { params }),
  getBlog: (id) => api.get(`/blogs/${id}`),
  createBlog: (data) => api.post('/blogs', data),
  updateBlog: (id, data) => api.put(`/blogs/${id}`, data),
  deleteBlog: (id) => api.delete(`/blogs/${id}`),
  toggleLike: (id) => api.post(`/blogs/${id}/like`),
  getMyBlogs: () => api.get('/blogs/user/my-blogs'),
  getTrendingBlogs: () => api.get('/blogs/trending/top')
};

export const rewardAPI = {
  getWallet: () => api.get('/rewards/wallet'),
  getTransactions: (params) => api.get('/rewards/transactions', { params }),
  getStats: () => api.get('/rewards/stats'),
  getLeaderboard: (params) => api.get('/rewards/leaderboard', { params }),
  claimDailyBonus: () => api.post('/rewards/daily-bonus'),
  getAchievements: () => api.get('/rewards/achievements')
};

export const domainAPI = {
  checkDomain: (domain) => api.post('/domain/check', { domain }),
  verifyDomain: (domain) => api.post('/domain/verify', { domain }),
  getDomainStatus: () => api.get('/domain/status'),
  removeDomain: () => api.delete('/domain/remove')
};

export default api;