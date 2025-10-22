// ============================================
// FILE: lib/api.js (FIXED VERSION)
// ============================================
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

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

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
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
  getBlogs: (params) => api.get('/blogs', { params }),
  getBlog: (id) => api.get(`/blogs/${id}`),
  createBlog: (data) => api.post('/blogs', data),
  updateBlog: (id, data) => api.put(`/blogs/${id}`, data),
  deleteBlog: (id) => api.delete(`/blogs/${id}`),
  toggleLike: (id) => api.post(`/blogs/${id}/like`),
  getMyBlogs: () => api.get('/blogs/user/my-blogs'),
  getTrendingBlogs: () => api.get('/blogs/trending/top'),
  getTrendingTags: () => api.get('/blogs/trending-tags')
};

// ========== COMMENT APIs ==========
export const commentAPI = {
  getComments: (blogId, params) => api.get(`/comments/blog/${blogId}`, { params }),
  createComment: (data) => api.post('/comments', data),
  updateComment: (id, data) => api.put(`/comments/${id}`, data),
  deleteComment: (id) => api.delete(`/comments/${id}`),
  likeComment: (id) => api.post(`/comments/${id}/like`)
};

// ========== BOOKMARK APIs ==========
export const bookmarkAPI = {
  getBookmarks: (params) => api.get('/bookmarks', { params }),
  createBookmark: (blogId) => api.post('/bookmarks', { blogId }),
  deleteBookmark: (blogId) => api.delete(`/bookmarks/${blogId}`),
  checkBookmark: (blogId) => api.get(`/bookmarks/check/${blogId}`)
};

// ========== FOLLOW APIs ==========
export const followAPI = {
  followUser: (userId) => api.post(`/follow/${userId}`),
  unfollowUser: (userId) => api.delete(`/follow/${userId}`),
  checkFollowing: (userId) => api.get(`/follow/check/${userId}`),
  getFollowers: (userId, params) => api.get(`/follow/followers/${userId}`, { params }),
  getFollowing: (userId, params) => api.get(`/follow/following/${userId}`, { params }),
  getSuggestions: (params) => api.get('/follow/suggestions', { params })
};

// ========== FEED APIs ==========
export const feedAPI = {
  getFollowingFeed: (params) => api.get('/feed/following', { params }),
  getMixedFeed: (params) => api.get('/feed/mixed', { params })
};

// ========== NOTIFICATION APIs ==========
export const notificationAPI = {
  getNotifications: (params) => api.get('/notifications', { params }),
  markAsRead: (id) => api.patch(`/notifications/${id}/read`),
  markAllAsRead: () => api.post('/notifications/mark-all-read'),
  deleteNotification: (id) => api.delete(`/notifications/${id}`),
  getUnreadCount: () => api.get('/notifications/unread-count')
};

// ========== REWARD APIs ==========
export const rewardAPI = {
  getWallet: () => api.get('/rewards/wallet'),
  getTransactions: (params) => api.get('/rewards/transactions', { params }),
  getStats: () => api.get('/rewards/stats'),
  getLeaderboard: (params) => api.get('/rewards/leaderboard', { params }),
  claimDailyBonus: () => api.post('/rewards/daily-bonus'),
  getAchievements: () => api.get('/rewards/achievements')
};

// ========== DOMAIN APIs ==========
export const domainAPI = {
  checkDomain: (domain) => api.post('/domain/check', { domain }),
  verifyDomain: (domain) => api.post('/domain/verify', { domain }),
  getDomainStatus: () => api.get('/domain/status'),
  removeDomain: () => api.delete('/domain/remove')
};
