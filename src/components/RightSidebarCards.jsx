import React from 'react';

const RightSidebarCards = () => {
  const trendingTopics = [
    { tag: '#AI', posts: '12.5K' },
    { tag: '#Web3', posts: '8.2K' },
    { tag: '#Blockchain', posts: '6.8K' },
    { tag: '#NFT', posts: '5.4K' },
    { tag: '#Crypto', posts: '4.9K' }
  ];

  const suggestedUsers = [
    { name: 'Sarah Johnson', username: '@sarahj', followers: '2.5K' },
    { name: 'Mike Chen', username: '@mikechen', followers: '1.8K' },
    { name: 'Emma Davis', username: '@emmad', followers: '1.2K' }
  ];

  return (
    <div className="space-y-6">
      {/* Trending Topics Card */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <span>🔥</span>
          Trending Topics
        </h3>
        <div className="space-y-3">
          {trendingTopics.map((topic, idx) => (
            <button
              key={idx}
              className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-purple-50 transition-colors text-left"
            >
              <div>
                <p className="font-semibold text-purple-600">{topic.tag}</p>
                <p className="text-sm text-gray-500">{topic.posts} posts</p>
              </div>
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          ))}
        </div>
      </div>

      {/* Suggested Users Card */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <span>👥</span>
          Who to Follow
        </h3>
        <div className="space-y-4">
          {suggestedUsers.map((user, idx) => (
            <div key={idx} className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                {user.name.charAt(0)}
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-800">{user.name}</p>
                <p className="text-sm text-gray-500">{user.username} · {user.followers}</p>
              </div>
              <button className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full text-sm font-semibold hover:shadow-lg transition-all">
                Follow
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Stats Card */}
      <div className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl shadow-md p-6 text-white">
        <h3 className="text-lg font-bold mb-4">Your Stats</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="opacity-90">Total Posts</span>
            <span className="text-2xl font-bold">42</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="opacity-90">Followers</span>
            <span className="text-2xl font-bold">1.2K</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="opacity-90">Engagement</span>
            <span className="text-2xl font-bold">87%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RightSidebarCards;