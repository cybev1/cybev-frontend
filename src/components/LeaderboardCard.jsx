import React from 'react';

const LeaderboardCard = ({ user, rank }) => {
  const getRankColor = (rank) => {
    if (rank === 1) return 'from-yellow-400 to-yellow-600';
    if (rank === 2) return 'from-gray-300 to-gray-500';
    if (rank === 3) return 'from-orange-400 to-orange-600';
    return 'from-purple-600 to-blue-600';
  };

  const getRankEmoji = (rank) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return '🏆';
  };

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all p-6 border border-gray-200">
      <div className="flex items-center gap-4">
        {/* Rank Badge */}
        <div className={`w-16 h-16 bg-gradient-to-br ${getRankColor(rank)} rounded-full flex items-center justify-center text-white font-bold text-2xl flex-shrink-0`}>
          {rank <= 3 ? getRankEmoji(rank) : `#${rank}`}
        </div>

        {/* User Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-bold text-gray-800 truncate">
              {user.name || 'Anonymous'}
            </h3>
            {user.verified && (
              <svg className="w-5 h-5 text-blue-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            )}
          </div>
          <p className="text-sm text-gray-500 truncate">
            {user.username || '@user'}
          </p>
        </div>

        {/* Score */}
        <div className="text-right">
          <div className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            {user.score || 0}
          </div>
          <p className="text-xs text-gray-500">points</p>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-lg font-bold text-gray-800">{user.posts || 0}</p>
            <p className="text-xs text-gray-500">Posts</p>
          </div>
          <div>
            <p className="text-lg font-bold text-gray-800">{user.followers || 0}</p>
            <p className="text-xs text-gray-500">Followers</p>
          </div>
          <div>
            <p className="text-lg font-bold text-gray-800">{user.engagement || '0%'}</p>
            <p className="text-xs text-gray-500">Engagement</p>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-4">
        <div className="flex justify-between text-xs text-gray-600 mb-1">
          <span>Progress to next rank</span>
          <span>{user.progress || 0}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-purple-600 to-blue-600 h-2 rounded-full transition-all"
            style={{ width: `${user.progress || 0}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default LeaderboardCard;