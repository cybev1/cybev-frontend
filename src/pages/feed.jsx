```javascript
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import AppLayout from '@/components/Layout/AppLayout';
import EmptyState from '@/components/EmptyState';
import SuggestedUsers from '@/components/SuggestedUsers';
import { api } from '@/lib/api';
import { Heart, MessageCircle, Bookmark, TrendingUp, Users, Sparkles } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'react-hot-toast';

export default function FeedPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('mixed'); // mixed, following, trending
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchFeed();
  }, [activeTab, page]);

  const fetchFeed = async () => {
    setLoading(true);
    try {
      let endpoint;
      switch (activeTab) {
        case 'following':
          endpoint = '/feed/following';
          break;
        case 'mixed':
          endpoint = '/feed/mixed';
          break;
        case 'trending':
          endpoint = '/blogs'; // Use existing blogs endpoint with sort
          break;
        default:
          endpoint = '/feed/mixed';
      }

      const { data } = await api.get(endpoint, {
        params: { 
          page, 
          limit: 10,
          ...(activeTab === 'trending' && { sort: '-likes' })
        }
      });

      setBlogs(data.blogs);
    } catch (error) {
      console.error('Failed to fetch feed:', error);
      toast.error('Failed to load feed');
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'mixed', label: 'For You', icon: Sparkles },
    { id: 'following', label: 'Following', icon: Users },
    { id: 'trending', label: 'Trending', icon: TrendingUp }
  ];

  return (
    
      
        {/* Feed Tabs */}
        
          
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setPage(1);
                  }}
                  className={`
                    flex-1 flex items-center justify-center gap-2 px-6 py-4 font-medium transition-colors
                    ${activeTab === tab.id
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }
                  `}
                >
                  
                  {tab.label}
                
              );
            })}
          
        

        
          {/* Main Feed */}
          
            {loading ? (
              
            ) : blogs.length === 0 ? (
              <EmptyState
                icon={Users}
                title={
                  activeTab === 'following'
                    ? 'No Posts from Following'
                    : 'No Posts Available'
                }
                description={
                  activeTab === 'following'
                    ? 'Follow users to see their posts here'
                    : 'Be the first to create a post!'
                }
                action={{
                  label: 'Discover Users',
                  onClick: () => router.push('/explore')
                }}
              />
            ) : (
              blogs.map(blog => (
                
              ))
            )}

            {/* Load More */}
            {blogs.length > 0 && (
              
                <button
                  onClick={() => setPage(page + 1)}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Load More
                
              
            )}
          

          {/* Sidebar */}
          
            
            
            {/* Trending Tags */}
            
          
        
      
    
  );
}

// Blog Card Component
function BlogCard({ blog }) {
  return (
    
      
        {/* Author Header */}
        
          
            <img
              src={blog.author.avatar || '/default-avatar.png'}
              alt={blog.author.username}
              className="w-10 h-10 rounded-full"
            />
          
          
            
              
                {blog.author.username}
              
            
            
              {formatDistanceToNow(new Date(blog.createdAt), { addSuffix: true })}
            
          
        

        {/* Content */}
        
          {blog.coverImage && (
            
          )}
          
          
            {blog.title}
          
          
          
            {blog.excerpt || blog.content.substring(0, 200)}...
          

          {/* Tags */}
          {blog.tags && blog.tags.length > 0 && (
            
              {blog.tags.slice(0, 3).map((tag, index) => (
                
                  #{tag}
                
              ))}
            
          )}

          {/* Stats */}
          
            
              
              {blog.likes?.length || 0}
            
            
              
              {blog.commentCount || 0}
            
            
              
            
          
        
      
    
  );
}

// Feed Loading Skeleton
function FeedSkeleton() {
  return (
    <>
      {[1, 2, 3].map(i => (
        
          
            
            
              
              
            
          
          
          
          
        
      ))}
    </>
  );
}

// Trending Tags Component
function TrendingTags() {
  const [tags, setTags] = useState([]);

  useEffect(() => {
    fetchTrendingTags();
  }, []);

  const fetchTrendingTags = async () => {
    try {
      const { data } = await api.get('/blogs/trending-tags');
      setTags(data.tags || []);
    } catch (error) {
      console.error('Failed to fetch trending tags:', error);
    }
  };

  if (tags.length === 0) return null;

  return (
    
      
        
        Trending Tags
      
      
        {tags.slice(0, 10).map((tag, index) => (
          <Link key={index} href={`/explore?tag=${tag}`}>
            
              #{tag}
            
          
        ))}
      
    
  );
}
```

---
