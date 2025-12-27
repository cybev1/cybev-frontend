// ============================================
// FILE: src/lib/api.js - PROPERLY FIXED VERSION
// ============================================
import axios from 'axios';

// Get base API URL (without any suffix)
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.cybev.io';

console.log('🔗 API Base URL:', API_BASE_URL);

// Create axios instance with base URL only (no /api)
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Auto-add token to all requests
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

// Auto-handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
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
    const response = await axios.get(`${API_BASE_URL}/health`);
    return response.data;
  } catch (error) {
    console.error('Health check failed:', error);
    return { ok: false, error: error.message };
  }
};

// ========== AUTH APIs (Has /api prefix) ==========
export const authAPI = {
  register: (data) => api.post('/api/auth/register', data),
  login: (data) => api.post('/api/auth/login', data),
  verifyEmail: (token) => api.post('/api/auth/verify-email', { token }),
  resendVerification: (email) => api.post('/api/auth/resend-verification', { email }),
  forgotPassword: (email) => api.post('/api/auth/forgot-password', { email }),
  resetPassword: (data) => api.post('/api/auth/reset-password', data),
  getProfile: () => api.get('/api/auth/profile'),
  updateProfile: (data) => api.put('/api/auth/profile', data),
  completeOnboarding: (data) => api.put('/api/auth/complete-onboarding', data),
  searchUsers: (params) => api.get('/api/auth/search', { params }),
  getUserByUsername: (username) => api.get(`/api/auth/user/${username}`)
};

// ========== BLOG APIs (NO /api prefix) ==========
export const blogAPI = {
  getBlogs: (params) => api.get('/blogs', { params }),
  getBlog: (id) => api.get(`/blogs/${id}`),
  createBlog: (data) => api.post('/blogs', data),
  updateBlog: (id, data) => api.put(`/blogs/${id}`, data),
  deleteBlog: (id) => api.delete(`/blogs/${id}`),
  toggleLike: (id) => api.post(`/blogs/${id}/like`),
  getMyBlogs: () => api.get('/blogs/my-blogs'),
  getStats: () => api.get('/blogs/stats'),
  getTrendingBlogs: () => api.get('/blogs/trending'),
  getTrendingTags: () => api.get('/blogs/trending-tags'),
  search: (params) => api.get('/blogs/search', { params }),
  trackShare: (id, platform) => api.post(`/blogs/${id}/share`, { platform })
};

// ========== CONTENT CREATION APIs (Has /api prefix) ==========
export const contentAPI = {
  // AI Blog Creation
  createBlog: (data) => api.post('/api/content/create-blog', data),
  publishBlog: (data) => api.post('/api/content/publish-blog', data),
  
  // AI Template Generation
  createTemplate: (data) => api.post('/api/content/create-template', data),
  
  // SEO & Optimization
  generateSEO: (data) => api.post('/api/content/generate-seo', data),
  generateHashtags: (data) => api.post('/api/content/generate-hashtags', data),
  getFeaturedImage: (data) => api.post('/api/content/get-featured-image', data),
  
  // NFT & Staking
  mintNFT: (data) => api.post('/api/content/mint-nft', data),
  stake: (data) => api.post('/api/content/stake', data),
  getViralScore: (blogId) => api.get(`/api/content/viral-score/${blogId}`)
};

// ========== POST APIs (NO /api prefix) ==========
export const postAPI = {
  getPosts: (params) => api.get('/posts', { params }),
  getPost: (id) => api.get(`/posts/${id}`),
  createPost: (data) => api.post('/posts', data),
  updatePost: (id, data) => api.put(`/posts/${id}`, data),
  deletePost: (id) => api.delete(`/posts/${id}`),
  getFeed: (params) => api.get('/posts/feed', { params }),
};

// ========== COMMENT APIs (Has /api prefix) ==========
export const commentAPI = {
  getComments: (blogId, params) => api.get(`/api/comments/blog/${blogId}`, { params }),
  createComment: (data) => api.post('/api/comments', data),
  updateComment: (id, data) => api.put(`/api/comments/${id}`, data),
  deleteComment: (id) => api.delete(`/api/comments/${id}`),
  likeComment: (id) => api.post(`/api/comments/${id}/like`)
};

// ========== BOOKMARK APIs (Has /api prefix) ==========
export const bookmarkAPI = {
  getBookmarks: (params) => api.get('/api/bookmarks', { params }),
  createBookmark: (blogId) => api.post('/api/bookmarks', { blogId }),
  deleteBookmark: (blogId) => api.delete(`/api/bookmarks/${blogId}`),
  checkBookmark: (blogId) => api.get(`/api/bookmarks/check/${blogId}`)
};

// ========== FOLLOW APIs (Has /api prefix) ==========
export const followAPI = {
  followUser: (userId) => api.post(`/api/follow/${userId}`),
  unfollowUser: (userId) => api.delete(`/api/follow/${userId}`),
  checkFollowing: (userId) => api.get(`/api/follow/check/${userId}`),
  getFollowers: (userId, params) => api.get(`/api/follow/followers/${userId}`, { params }),
  getFollowing: (userId, params) => api.get(`/api/follow/following/${userId}`, { params }),
  getSuggestions: (params) => api.get('/api/follow/suggestions', { params })
};

// ========== FEED APIs (Has /api prefix) ==========
export const feedAPI = {
  getFollowingFeed: (params) => api.get('/api/feed/following', { params }),
  getMixedFeed: (params) => api.get('/api/feed/mixed', { params })
};

// ========== NOTIFICATION APIs (Has /api prefix) ==========
export const notificationAPI = {
  getNotifications: (params) => api.get('/api/notifications', { params }),
  markAsRead: (id) => api.patch(`/api/notifications/${id}/read`),
  markAllAsRead: () => api.post('/api/notifications/mark-all-read'),
  deleteNotification: (id) => api.delete(`/api/notifications/${id}`),
  getUnreadCount: () => api.get('/api/notifications/unread-count')
};

// ========== REWARD APIs (Has /api prefix) ==========
export const rewardAPI = {
  getWallet: () => api.get('/api/rewards/wallet'),
  getTransactions: (params) => api.get('/api/rewards/transactions', { params }),
  getStats: () => api.get('/api/rewards/stats'),
  getLeaderboard: (params) => api.get('/api/rewards/leaderboard', { params }),
  claimDailyBonus: () => api.post('/api/rewards/daily-bonus'),
  getAchievements: () => api.get('/api/rewards/achievements')
};

// ========== DOMAIN APIs (Has /api prefix) ==========
export const domainAPI = {
  checkDomain: (domain) => api.post('/api/domain/check', { domain }),
  verifyDomain: (domain) => api.post('/api/domain/verify', { domain }),
  getDomainStatus: () => api.get('/api/domain/status'),
  removeDomain: () => api.delete('/api/domain/remove')
};

// ========== UPLOAD APIs (Has /api prefix) ==========
export const uploadAPI = {
  uploadImage: (formData) => {
    return api.post('/api/upload/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  uploadVideo: (formData) => {
    return api.post('/api/upload/video', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};


// Blog Sites (public + creator)
export const blogSiteAPI = {
  create: (data) => api.post('/sites', data),
  mySites: () => api.get('/sites/my'),
  update: (id, data) => api.put(`/sites/${id}`, data),
  getPublic: (slug) => api.get(`/sites/public/${slug}`),
  getPublicPosts: (slug, params = {}) => api.get(`/sites/public/${slug}/posts`, { params }),
};
