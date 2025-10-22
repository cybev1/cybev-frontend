// ============================================
// FILE: lib/api.js
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
};.ceil(total / limit),
        hasMore: skip + blogs.length < total
      }
    });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id)
      .populate('author', 'name username email avatar');
    
    if (!blog) {
      return res.status(404).json({ ok: false, error: 'Blog not found' });
    }
    
    blog.views += 1;
    await blog.save();
    
    res.json({ ok: true, blog });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
});

router.post('/', authenticateToken, async (req, res) => {
  try {
    const { title, content, category, tags } = req.body;
    
    const blog = new Blog({
      title,
      content,
      category,
      tags: tags || [],
      author: req.user.id,
      authorName: req.user.name
    });
    
    await blog.save();
    
    let wallet = await Wallet.findOne({ user: req.user.id });
    if (!wallet) {
      wallet = new Wallet({ user: req.user.id });
    }
    
    await wallet.addTokens(50, 'BLOG_POST', `Published: ${title}`, blog._id);
    await wallet.updateStreak();
    
    if (!wallet.achievements.includes('FIRST_POST')) {
      wallet.achievements.push('FIRST_POST');
      await wallet.addTokens(25, 'BONUS', 'First post achievement!');
    }
    
    if (wallet.streaks.current === 7 && !wallet.achievements.includes('WEEK_STREAK')) {
      wallet.achievements.push('WEEK_STREAK');
      await wallet.addTokens(100, 'BONUS', '7-day streak bonus!');
    }
    
    await wallet.save();
    
    res.status(201).json({ 
      ok: true,
      blog, 
      tokensEarned: 50,
      currentStreak: wallet.streaks.current
    });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
});

router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    
    if (!blog) {
      return res.status(404).json({ ok: false, error: 'Blog not found' });
    }
    
    if (blog.author.toString() !== req.user.id) {
      return res.status(403).json({ ok: false, error: 'Not authorized' });
    }
    
    const { title, content, category, tags, status } = req.body;
    
    if (title) blog.title = title;
    if (content) blog.content = content;
    if (category) blog.category = category;
    if (tags) blog.tags = tags;
    if (status) blog.status = status;
    
    await blog.save();
    
    res.json({ ok: true, blog });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
});

router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    
    if (!blog) {
      return res.status(404).json({ ok: false, error: 'Blog not found' });
    }
    
    if (blog.author.toString() !== req.user.id) {
      return res.status(403).json({ ok: false, error: 'Not authorized' });
    }
    
    await blog.deleteOne();
    
    res.json({ ok: true, message: 'Blog deleted successfully' });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
});

router.post('/:id/like', authenticateToken, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    
    if (!blog) {
      return res.status(404).json({ ok: false, error: 'Blog not found' });
    }
    
    const userIndex = blog.likes.indexOf(req.user.id);
    let liked = false;
    
    if (userIndex > -1) {
      blog.likes.splice(userIndex, 1);
      liked = false;
    } else {
      blog.likes.push(req.user.id);
      liked = true;
      
      if (blog.author.toString() !== req.user.id) {
        let authorWallet = await Wallet.findOne({ user: blog.author });
        if (!authorWallet) {
          authorWallet = new Wallet({ user: blog.author });
        }
        
        await authorWallet.addTokens(5, 'BLOG_LIKE', `Like received on: ${blog.title}`, blog._id);
        
        // NEW: Create notification for like
        await createNotification({
          recipient: blog.author,
          sender: req.user.id,
          type: 'like',
          targetModel: 'Blog',
          target: blog._id,
          message: `liked your post "${blog.title}"`
        });
      }
    }
    
    await blog.save();
    
    res.json({ 
      ok: true,
      liked, 
      likeCount: blog.likes.length 
    });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
});

router.get('/user/my-blogs', authenticateToken, async (req, res) => {
  try {
    const blogs = await Blog.find({ author: req.user.id })
      .sort({ createdAt: -1 });
    
    res.json({ ok: true, blogs });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
});

router.get('/trending/top', async (req, res) => {
  try {
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
    
    const blogs = await Blog.find({
      status: 'published',
      createdAt: { $gte: threeDaysAgo }
    })
      .populate('author', 'name username email avatar')
      .sort({ views: -1, likes: -1 })
      .limit(6);
    
    res.json({ ok: true, blogs });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
});

// NEW: Get trending tags
router.get('/trending-tags', async (req, res) => {
  try {
    const tags = await Blog.aggregate([
      { $match: { status: 'published' } },
      { $unwind: '$tags' },
      { $group: { _id: '$tags', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 20 }
    ]);

    res.json({ ok: true, tags: tags.map(t => t._id) });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
});

module.exports = router;
