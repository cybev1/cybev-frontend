import React from 'react';
import ReactionBar from './ReactionBar';

export default function PostCard({ post }) {
  return (
    <div className="bg-white dark:bg-gray-900 p-4 rounded-xl shadow-md border dark:border-gray-700">
      <h3 className="font-semibold">@{post.username}</h3>
      <p className="mt-2">{post.content}</p>
      {post.image && <img src={post.image} alt="post" className="w-full mt-3 rounded-lg" />}
      <ReactionBar views={post.views} reactions={post.reactions} earnings={post.earnings} />
    </div>
  );
}