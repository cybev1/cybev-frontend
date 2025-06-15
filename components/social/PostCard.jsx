import React, { useState, useEffect } from 'react';
import ReactionMenu from './ReactionMenu';
import axios from 'axios';

export default function PostCard({ post }) {
  const [reaction, setReaction] = useState(post.userReaction || null);
  const [views, setViews] = useState(post.views || 0);
  const [likes, setLikes] = useState(post.likes || 0);
  const [comments, setComments] = useState(post.comments || 0);
  const [shares, setShares] = useState(post.shares || 0);

  useEffect(() => {
    // increment view count on mount
    axios.post(`/api/posts/${post.id}/view`).then(res => {
      if (res.data.views !== undefined) {
        setViews(res.data.views);
      }
    }).catch(() => {});
  }, [post.id]);

  const handleReact = async (label) => {
    try {
      const res = await axios.post(`/api/posts/${post.id}/react`, { reaction: label });
      setReaction(label);
      if (res.data.likes !== undefined) {
        setLikes(res.data.likes);
      }
    } catch (err) {
      console.error('React error:', err);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-6">
      <div className="flex items-center mb-4">
        <img src={post.author.avatar} alt={post.author.name} className="w-10 h-10 rounded-full mr-3" />
        <div>
          <div className="font-semibold text-gray-800 dark:text-gray-200">{post.author.name}</div>
          <div className="text-xs text-gray-500">{post.timestamp}</div>
        </div>
      </div>
      <div className="mb-4 text-gray-800 dark:text-gray-200">{post.content}</div>
      {post.image && <img src={post.image} alt="Post media" className="w-full rounded-lg mb-4" />}
      <div className="flex items-center justify-between text-gray-600 dark:text-gray-400 text-sm mb-2">
        <div>{views} views</div>
        <div className="flex items-center space-x-4">
          <div><ReactionMenu currentReaction={reaction} onReact={handleReact} /></div>
          <div>{likes} {likes === 1 ? 'like' : 'likes'}</div>
          <div>{comments} comments</div>
          <div>{shares} shares</div>
        </div>
      </div>
    </div>
  );
}
