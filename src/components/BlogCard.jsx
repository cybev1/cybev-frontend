import React from 'react';
import { useRouter } from 'next/router';

const BlogCard = ({ blog }) => {
  const router = useRouter();

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all p-6 border border-gray-200">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2">
            {blog.title || 'Untitled Blog Post'}
          </h3>
          <p className="text-gray-600 text-sm line-clamp-2">
            {blog.description || 'No description available'}
          </p>
        </div>
        
        {/* Status Badge */}
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
          blog.status === 'published' 
            ? 'bg-green-100 text-green-700'
            : blog.status === 'draft'
            ? 'bg-yellow-100 text-yellow-700'
            : 'bg-gray-100 text-gray-700'
        }`}>
          {blog.status || 'Draft'}
        </span>
      </div>

      {/* Meta Info */}
      <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
        <span className="flex items-center gap-1">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {blog.createdAt ? new Date(blog.createdAt).toLocaleDateString() : 'Today'}
        </span>
        <span className="flex items-center gap-1">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          {blog.views || 0} views
        </span>
      </div>

      {/* Keywords */}
      {blog.keywords && blog.keywords.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {blog.keywords.slice(0, 3).map((keyword, idx) => (
            <span key={idx} className="px-2 py-1 bg-purple-50 text-purple-600 rounded text-xs font-medium">
              {keyword}
            </span>
          ))}
          {blog.keywords.length > 3 && (
            <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs font-medium">
              +{blog.keywords.length - 3} more
            </span>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2 pt-4 border-t border-gray-100">
        <button
          onClick={() => router.push(`/blog/editor?id=${blog.id}`)}
          className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-medium hover:shadow-lg transition-all"
        >
          Edit
        </button>
        <button
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-all"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default BlogCard;