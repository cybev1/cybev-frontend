// ============================================
// FILE: src/lib/api.js
// PATH: cybev-frontend/src/lib/api.js
// PURPOSE: API client with all routes
// VERSION: 6.8.3 - Fixed /api/ prefix on all routes
// PREVIOUS: 6.5.0 - Missing /api/ prefix on blog routes
// ROLLBACK: Check backend route paths if issues
// GITHUB: https://github.com/cybev1/cybev-frontend
// UPDATED: 2026-01-12
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
    const response = await axios.get(`${API_BASE_URL}/api/health`);
    return response.data;
  } catch (error) {
    console.error('Health check failed:', error);
    return { ok: false, error: error.message };
  }
};

// ========== AUTH APIs ==========
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

// ========== ADMIN APIs ==========
export const adminAPI = {
  // Stats
  getStats: () => api.get('/api/admin/stats'),
  getReports: (period) => api.get('/api/admin/reports', { params: { period } }),
  
  // Users
  getUsers: (params) => api.get('/api/admin/users', { params }),
  getUser: (id) => api.get(`/api/admin/users/${id}`),
  updateUser: (id, data) => api.put(`/api/admin/users/${id}`, data),
  deleteUser: (id, deleteContent) => api.delete(`/api/admin/users/${id}`, { params: { deleteContent } }),
  
  // Content Moderation
  getContent: (params) => api.get('/api/admin/content', { params }),
  moderateContent: (type, id, action, reason) => api.put(`/api/admin/content/${type}/${id}`, { action, reason }),
  
  // Broadcast
  broadcast: (message, type) => api.post('/api/admin/broadcast', { message, type })
};

// ========== BLOG APIs - FIXED v6.8.3: Added /api/ prefix ==========
export const blogAPI = {
  getBlogs: (params) => api.get('/api/blogs', { params }),
  getBlog: (id) => api.get(`/api/blogs/${id}`),
  createBlog: (data) => api.post('/api/blogs', data),
  updateBlog: (id, data) => api.put(`/api/blogs/${id}`, data),
  deleteBlog: (id) => api.delete(`/api/blogs/${id}`),
  toggleLike: (id) => api.post(`/api/blogs/${id}/like`),
  getMyBlogs: () => api.get('/api/blogs/my-blogs'),
  getStats: () => api.get('/api/blogs/stats'),
  getTrendingBlogs: () => api.get('/api/blogs/trending'),
  getTrendingTags: () => api.get('/api/blogs/trending-tags'),
  search: (params) => api.get('/api/blogs/search', { params }),
  trackShare: (id, platform) => api.post(`/api/blogs/${id}/share`, { platform })
};

// ========== CONTENT CREATION APIs ==========
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

// ========== POST APIs - FIXED v6.8.3: Added /api/ prefix ==========
export const postAPI = {
  getPosts: (params) => api.get('/api/posts', { params }),
  getPost: (id) => api.get(`/api/posts/${id}`),
  createPost: (data) => api.post('/api/posts', data),
  updatePost: (id, data) => api.put(`/api/posts/${id}`, data),
  deletePost: (id) => api.delete(`/api/posts/${id}`),
  getFeed: (params) => api.get('/api/posts/feed', { params }),
};

// ========== COMMENT APIs ==========
export const commentAPI = {
  getComments: (blogId, params) => api.get(`/api/comments/blog/${blogId}`, { params }),
  createComment: (data) => api.post('/api/comments', data),
  updateComment: (id, data) => api.put(`/api/comments/${id}`, data),
  deleteComment: (id) => api.delete(`/api/comments/${id}`),
  likeComment: (id) => api.post(`/api/comments/${id}/like`)
};

// ========== BOOKMARK APIs ==========
export const bookmarkAPI = {
  getBookmarks: (params) => api.get('/api/bookmarks', { params }),
  createBookmark: (blogId) => api.post('/api/bookmarks', { blogId }),
  deleteBookmark: (blogId) => api.delete(`/api/bookmarks/${blogId}`),
  checkBookmark: (blogId) => api.get(`/api/bookmarks/check/${blogId}`)
};

// ========== FOLLOW APIs ==========
export const followAPI = {
  followUser: (userId) => api.post(`/api/follow/${userId}`),
  unfollowUser: (userId) => api.delete(`/api/follow/${userId}`),
  checkFollowing: (userId) => api.get(`/api/follow/check/${userId}`),
  getFollowers: (userId, params) => api.get(`/api/follow/followers/${userId}`, { params }),
  getFollowing: (userId, params) => api.get(`/api/follow/following/${userId}`, { params }),
  getSuggestions: (params) => api.get('/api/follow/suggestions', { params })
};

// ========== FEED APIs ==========
export const feedAPI = {
  getFollowingFeed: (params) => api.get('/api/feed/following', { params }),
  getMixedFeed: (params) => api.get('/api/feed/mixed', { params })
};

// ========== NOTIFICATION APIs ==========
export const notificationAPI = {
  getNotifications: (params) => api.get('/api/notifications', { params }),
  markAsRead: (id) => api.patch(`/api/notifications/${id}/read`),
  markAllAsRead: () => api.post('/api/notifications/mark-all-read'),
  deleteNotification: (id) => api.delete(`/api/notifications/${id}`),
  getUnreadCount: () => api.get('/api/notifications/unread-count')
};

// ========== REWARD APIs ==========
export const rewardAPI = {
  getWallet: () => api.get('/api/rewards/wallet'),
  getTransactions: (params) => api.get('/api/rewards/transactions', { params }),
  getStats: () => api.get('/api/rewards/stats'),
  getLeaderboard: (params) => api.get('/api/rewards/leaderboard', { params }),
  claimDailyBonus: () => api.post('/api/rewards/daily-bonus'),
  getAchievements: () => api.get('/api/rewards/achievements')
};

// ========== DOMAIN APIs ==========
export const domainAPI = {
  checkDomain: (domain) => api.post('/api/domain/check', { domain }),
  verifyDomain: (domain) => api.post('/api/domain/verify', { domain }),
  getDomainStatus: () => api.get('/api/domain/status'),
  removeDomain: () => api.delete('/api/domain/remove')
};

// ========== UPLOAD APIs ==========
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

// ========== BLOG SITES APIs - FIXED v6.8.3: Added /api/ prefix ==========
export const blogSiteAPI = {
  create: (data) => api.post('/api/sites', data),
  mySites: () => api.get('/api/sites/my'),
  update: (id, data) => api.put(`/api/sites/${id}`, data),
  getPublic: (slug) => api.get(`/api/sites/public/${slug}`),
  getPublicPosts: (slug, params = {}) => api.get(`/api/sites/public/${slug}/posts`, { params }),
};

// ========== VLOG APIs ==========
export const vlogAPI = {
  getVlogs: (params) => api.get('/api/vlogs', { params }),
  getVlog: (id) => api.get(`/api/vlogs/${id}`),
  createVlog: (data) => api.post('/api/vlogs', data),
  updateVlog: (id, data) => api.put(`/api/vlogs/${id}`, data),
  deleteVlog: (id) => api.delete(`/api/vlogs/${id}`),
  getMyVlogs: () => api.get('/api/vlogs/my'),
  getFeed: (params) => api.get('/api/vlogs/feed', { params }),
};

// ========== CHURCH APIs ==========
export const churchAPI = {
  getChurch: () => api.get('/api/church'),
  createChurch: (data) => api.post('/api/church', data),
  updateChurch: (data) => api.put('/api/church', data),
  getMembers: (params) => api.get('/api/church/members', { params }),
  addMember: (data) => api.post('/api/church/members', data),
  getCells: () => api.get('/api/church/cells'),
  createCell: (data) => api.post('/api/church/cells', data),
  getPrayers: (params) => api.get('/api/church/prayers', { params }),
  createPrayer: (data) => api.post('/api/church/prayers', data),
  getGiving: (params) => api.get('/api/church/giving', { params }),
  recordGiving: (data) => api.post('/api/church/giving', data),
};

// ========== FORMS APIs ==========
export const formsAPI = {
  getForms: () => api.get('/api/forms'),
  getForm: (id) => api.get(`/api/forms/${id}`),
  createForm: (data) => api.post('/api/forms', data),
  updateForm: (id, data) => api.put(`/api/forms/${id}`, data),
  deleteForm: (id) => api.delete(`/api/forms/${id}`),
  submitResponse: (id, data) => api.post(`/api/forms/${id}/submit`, data),
  getResponses: (id) => api.get(`/api/forms/${id}/responses`),
};

// ========== MEET APIs (NEW v6.8.1) ==========
export const meetAPI = {
  createRoom: (data) => api.post('/api/meet/create', data),
  joinRoom: (roomId) => api.post(`/api/meet/join/${roomId}`),
  getRooms: () => api.get('/api/meet/rooms'),
  getRoom: (roomId) => api.get(`/api/meet/room/${roomId}`),
  endRoom: (roomId) => api.post(`/api/meet/end/${roomId}`),
};

// ========== SOCIAL TOOLS APIs (NEW v6.8.1) ==========
export const socialToolsAPI = {
  getAccounts: () => api.get('/api/social-tools/accounts'),
  addAccount: (data) => api.post('/api/social-tools/accounts', data),
  removeAccount: (id) => api.delete(`/api/social-tools/accounts/${id}`),
  schedulePost: (data) => api.post('/api/social-tools/schedule', data),
  getScheduled: () => api.get('/api/social-tools/scheduled'),
  getAnalytics: () => api.get('/api/social-tools/analytics'),
};

// ========== CAMPAIGNS APIs (NEW v6.8.1) ==========
export const campaignsAPI = {
  getCampaigns: () => api.get('/api/campaigns'),
  getCampaign: (id) => api.get(`/api/campaigns/${id}`),
  createCampaign: (data) => api.post('/api/campaigns', data),
  updateCampaign: (id, data) => api.put(`/api/campaigns/${id}`, data),
  deleteCampaign: (id) => api.delete(`/api/campaigns/${id}`),
  sendCampaign: (id) => api.post(`/api/campaigns/${id}/send`),
  getStats: (id) => api.get(`/api/campaigns/${id}/stats`),
  getContacts: () => api.get('/api/contacts'),
  addContact: (data) => api.post('/api/contacts', data),
  importContacts: (data) => api.post('/api/contacts/import', data),
};
