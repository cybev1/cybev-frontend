import React, { useState } from 'react';
import PostCard from '../PostCard';

const EnhancedSocialFeed = () => {
  const [activeTab, setActiveTab] = useState('for-you');
  const [postContent, setPostContent] = useState('');

  // Mock posts data
  const mockPosts = [
    {
      id: 1,
      author: { name: 'Sarah Johnson', username: '@sarahj' },
      content: 'Just launched my new blog on CYBEV! Check it out and let me know what you think. 🚀',
      likes: 42,
      comments: 8,
      timestamp: '2h ago',
      image: null
    },
    {
      id: 2,
      author: { name: 'Mike Chen', username: '@mikechen' },
      content: 'The future of Web3 is here! Built my first NFT marketplace on CYBEV. Loving the platform so far.',
      likes: 128,
      comments: 23,
      timestamp: '4h ago',
      image: null
    },
    {
      id: 3,
      author: { name: 'Emma Davis', username: '@emmad' },
      content: 'Tips for creating engaging content:\n\n1. Know your audience\n2. Be authentic\n3. Use visuals\n4. Engage with comments\n\nWhat would you add to this list?',
      likes: 89,
      comments: 34,
      timestamp: '6h ago',
      image: null
    }
  ];

  const handlePost = () => {
    if (postContent.trim()) {
      // TODO: Send post to backend
      console.log('Posting:', postContent);
      setPostContent('');
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Create Post Card */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6 border border-gray-200">
        <div className="flex gap-4">
          <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
            U
          </div>
          <div className="flex-1">
            <textarea
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
              placeholder="What's on your mind?"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-400 focus:outline-none resize-none"
              rows="3"
            />
            <div className="flex items-center justify-between mt-4">
              <div className="flex gap-2">
                <button className="p-2 hover:bg-purple-50 rounded-lg text-purple-600 transition-colors">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </button>
                <button className="p-2 hover:bg-purple-50 rounded-lg text-purple-600 transition-colors">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </button>
                <button className="p-2 hover:bg-purple-50 rounded-lg text-purple-600 transition-colors">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                  </svg>
                </button>
              </div>
              <button
                onClick={handlePost}
                disabled={!postContent.trim()}
                className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Post
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-md mb-6 border border-gray-200">
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('for-you')}
            className={`flex-1 px-6 py-4 font-semibold transition-colors ${
              activeTab === 'for-you'
                ? 'text-purple-600 border-b-2 border-purple-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            For You
          </button>
          <button
            onClick={() => setActiveTab('following')}
            className={`flex-1 px-6 py-4 font-semibold transition-colors ${
              activeTab === 'following'
                ? 'text-purple-600 border-b-2 border-purple-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Following
          </button>
          <button
            onClick={() => setActiveTab('trending')}
            className={`flex-1 px-6 py-4 font-semibold transition-colors ${
              activeTab === 'trending'
                ? 'text-purple-600 border-b-2 border-purple-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Trending
          </button>
        </div>
      </div>

      {/* Posts Feed */}
      <div className="space-y-4">
        {mockPosts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>

      {/* Load More */}
      <div className="mt-8 text-center">
        <button className="px-8 py-3 bg-white text-purple-600 border-2 border-purple-200 rounded-full font-semibold hover:bg-purple-50 transition-all">
          Load More Posts
        </button>
      </div>
    </div>
  );
};

export default EnhancedSocialFeed;