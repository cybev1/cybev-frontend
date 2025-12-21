import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import AppLayout from '@/components/Layout/AppLayout';
import SEO from '@/components/SEO';
import SocialShare from '@/components/SocialShare';
import Comments from '@/components/Comments';
import { blogAPI, bookmarkAPI } from '@/lib/api';
import { toast } from 'react-toastify';
import {
  Heart, Eye, Clock, Calendar, Share2, Bookmark,
  ArrowLeft, User, TrendingUp, MessageCircle
} from 'lucide-react';

export default function BlogDetail() {
  const router = useRouter();
  const { id: blogId } = router.query;
  const id = blogId;

  const [blog, setBlog] = useState(null);
  const [relatedBlogs, setRelatedBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [bookmarked, setBookmarked] = useState(false);

  useEffect(() => {
    if (id) {
      fetchBlog();
      fetchRelatedBlogs();
      checkBookmark();
    }
  }, [id]);

  const fetchBlog = async () => {
    setLoading(true);
    try {
      const response = await blogAPI.getBlog(id);
      if (response.data.ok || response.data.success) {
        const blogData = response.data.blog || response.data.data;
        setBlog(blogData);
        setLikeCount(blogData.likes?.length || blogData.likeCount || 0);
        
        // Check if user has liked this blog
        const userId = JSON.parse(localStorage.getItem('user') || '{}').id;
        setLiked(blogData.likes?.includes(userId));
      }
    } catch (error) {
      console.error('Error loading blog:', error);
      toast.error('Failed to load blog');
      router.push('/feed');
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedBlogs = async () => {
  try {
    const response = await blogAPI.getBlogs({ limit: 6 });

    // Backend returns: { success: true, data: { blogs: [...] } }
    const raw =
      response?.data?.blogs ??
      response?.data?.data?.blogs ??
      response?.data?.data ??
      [];

    const blogs = Array.isArray(raw) ? raw : (raw?.blogs ?? []);
    const related = blogs.filter((b) => b?._id && b._id !== id).slice(0, 3);
    setRelatedBlogs(related);
  } catch (error) {
    console.error('Failed to load related blogs', error);
    // Do not toast here; related blogs are optional
  }
};

  const checkBookmark = async () => {
    try {
      const response = await bookmarkAPI.checkBookmark(id);
      if (response.data.ok || response.data.success) {
        setBookmarked(response.data.bookmarked || false);
      }
    } catch (error) {
      // Silently fail - bookmarks are optional
      console.log('Bookmark check failed');
    }
  };

  const handleLike = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please login to like posts');
      router.push('/auth/login');
      return;
    }

    try {
      const response = await blogAPI.toggleLike(id);
      if (response.data.ok || response.data.success) {
        setLiked(response.data.liked);
        setLikeCount(response.data.likeCount);
        toast.success(response.data.liked ? '❤️ Liked!' : 'Unliked');
      }
    } catch (error) {
      toast.error('Failed to like post');
    }
  };

  const handleBookmark = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please login to bookmark posts');
      router.push('/auth/login');
      return;
    }

    try {
      if (bookmarked) {
        await bookmarkAPI.deleteBookmark(id);
        setBookmarked(false);
        toast.success('Bookmark removed');
      } else {
        await bookmarkAPI.createBookmark(id);
        setBookmarked(true);
        toast.success('Bookmarked!');
      }
    } catch (error) {
      toast.error('Failed to bookmark post');
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: blog?.title,
      text: blog?.content?.substring(0, 100) + '...',
      url: window.location.href
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        toast.success('Shared successfully!');
      } catch (error) {
        copyToClipboard();
      }
    } else {
      copyToClipboard();
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Link copied to clipboard!');
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
        </div>
      </AppLayout>
    );
  }

  if (!blog) {
    return (
      <AppLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Blog not found</h2>
            <Link href="/feed">
              <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg">
                Back to Feed
              </button>
            </Link>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <SEO
        title={blog.title}
        description={blog.content.replace(/<[^>]*>/g, '').substring(0, 160)}
        type="article"
        author={blog.authorName}
        publishedTime={blog.createdAt}
        modifiedTime={blog.updatedAt}
        keywords={blog.tags?.join(', ')}
      />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50 to-blue-50 pb-20">
        {/* Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <Link href="/feed">
              <button className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors">
                <ArrowLeft className="w-4 h-4" />
                Back to Feed
              </button>
            </Link>

            {/* Category Badge */}
            {blog.category && (
              <span className="inline-block px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium mb-4">
                {blog.category}
              </span>
            )}

            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              {blog.title}
            </h1>

            {/* Author & Meta Info */}
            <div className="flex flex-wrap items-center gap-6 text-gray-600 mb-6">
              <div className="flex items-center gap-2">
                <User className="w-5 h-5" />
                <span className="font-medium">{blog.authorName}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{new Date(blog.createdAt).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}</span>
              </div>
              {blog.readTime && (
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{blog.readTime} min read</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4" />
                <span>{blog.views || 0} views</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 flex-wrap">
              <button
                onClick={handleLike}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                  liked
                    ? 'bg-pink-100 text-pink-600 border border-pink-200'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-200'
                }`}
              >
                <Heart className={`w-4 h-4 ${liked ? 'fill-pink-600' : ''}`} />
                <span className="font-medium">{likeCount}</span>
              </button>

              <button
                onClick={handleShare}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg transition-all border border-gray-200"
              >
                <Share2 className="w-4 h-4" />
                <span className="font-medium">Share</span>
              </button>

              <button
                onClick={handleBookmark}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                  bookmarked
                    ? 'bg-yellow-100 text-yellow-600 border border-yellow-200'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-200'
                }`}
              >
                <Bookmark className={`w-4 h-4 ${bookmarked ? 'fill-yellow-600' : ''}`} />
                <span className="font-medium">Save</span>
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white rounded-xl p-8 md:p-12 border border-gray-200 shadow-sm mb-12">
            {/* Tags */}
            {blog.tags && blog.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-8">
                {blog.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm border border-blue-100"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Blog Content */}
            <div
              className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-purple-600 prose-strong:text-gray-900"
              dangerouslySetInnerHTML={{ __html: blog.content }}
            />
          </div>

          {/* Author Card */}
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-8 border border-purple-100 mb-12">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
                {blog.authorName?.charAt(0) || 'A'}
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Written by {blog.authorName}
                </h3>
                <p className="text-gray-600 mb-4">
                  Content creator sharing insights and experiences.
                </p>
                <Link href={`/profile/${blog.authorName || blog.author}`}>
                  <button className="px-4 py-2 bg-white hover:bg-gray-50 text-gray-900 rounded-lg transition-all border border-gray-200 font-medium">
                    View Profile
                  </button>
                </Link>
              </div>
            </div>
          </div>

          {/* Comments Section */}
          <Comments blogId={id} />

          {/* Related Blogs */}
          {relatedBlogs.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-6">
                <TrendingUp className="w-5 h-5 text-purple-600" />
                <h2 className="text-2xl font-bold text-gray-900">More Articles</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedBlogs.map((relatedBlog) => (
                  <Link key={relatedBlog._id} href={`/blog/${relatedBlog._id}`}>
                    <div className="bg-white rounded-xl p-6 border border-gray-200 hover:border-purple-300 hover:shadow-lg transition-all cursor-pointer">
                      <span className="inline-block px-2 py-1 bg-purple-50 text-purple-700 rounded text-xs font-medium mb-3">
                        {relatedBlog.category}
                      </span>
                      <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 hover:text-purple-600 transition-colors">
                        {relatedBlog.title}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          {relatedBlog.views}
                        </div>
                        <div className="flex items-center gap-1">
                          <Heart className="w-3 h-3" />
                          {relatedBlog.likes?.length || 0}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {relatedBlog.readTime}m
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}