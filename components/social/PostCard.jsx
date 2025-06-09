import React from 'react';
import AutoMintButton from '@/components/mint/AutoMintButton';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function PostCard({ post }) {
  const isOwnPost = true; // Optional: replace with actual auth logic

  return (
    <div className="border rounded-xl p-4 mb-4 bg-white shadow">
      <div className="flex justify-between items-center mb-2">
        <h2 className="font-semibold">{post.authorName}</h2>
        <span className="text-sm text-gray-500">{new Date(post.createdAt).toLocaleString()}</span>
      </div>

      <p className="mb-3">{post.caption}</p>

      {post.mediaUrl && (
        <img src={post.mediaUrl} alt="media" className="w-full max-h-64 object-cover rounded mb-3" />
      )}

      {isOwnPost && (
        <div className="mt-2">
          <AutoMintButton
            getData={() => ({
              title: post.caption?.substring(0, 50) || 'Social Post',
              description: post.caption,
              mediaUrl: post.mediaUrl || ''
            })}
          />
        </div>
      )}
      <ToastContainer />
    </div>
  );
}