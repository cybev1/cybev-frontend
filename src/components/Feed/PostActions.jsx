// ============================================
// FILE: components/Feed/PostActions.jsx
// Edit and Delete functionality for posts
// ============================================

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Edit, Trash2, MoreHorizontal, X, Save } from 'lucide-react';

export default function PostActions({ post, onEdit, onDelete }) {
  const [showMenu, setShowMenu] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editContent, setEditContent] = useState(post.content);
  const [loading, setLoading] = useState(false);

  const handleEdit = async () => {
    if (!editContent.trim()) {
      alert('Content cannot be empty!');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.cybev.io';

      const response = await fetch(`${API_URL}/posts/${post._id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          content: editContent
        })
      });

      const data = await response.json();

      if (data.success) {
        alert('✅ Post updated successfully!');
        setShowEditModal(false);
        if (onEdit) onEdit(data.post);
      } else {
        throw new Error(data.error || 'Failed to update post');
      }
    } catch (error) {
      console.error('❌ Edit error:', error);
      alert('Failed to update post: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this post?')) {
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.cybev.io';

      const response = await fetch(`${API_URL}/posts/${post._id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (data.success) {
        alert('✅ Post deleted successfully!');
        if (onDelete) onDelete(post._id);
      } else {
        throw new Error(data.error || 'Failed to delete post');
      }
    } catch (error) {
      console.error('❌ Delete error:', error);
      alert('Failed to delete post: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Check if current user owns this post (safe for SSR)
  let currentUserId = null;
  if (typeof window !== 'undefined') {
    try {
      const raw = localStorage.getItem('user');
      if (raw) currentUserId = JSON.parse(raw)?.id || null;
    } catch (_) {
      currentUserId = null;
    }
  }
  const isOwner = post.authorId?._id === currentUserId || 
                  post.authorId === currentUserId;

  if (!isOwner) {
    return (
      <button className="p-2 hover:bg-gray-50 rounded-lg transition-colors">
        <MoreHorizontal className="w-5 h-5 text-gray-600" />
      </button>
    );
  }

  return (
    <>
      <div className="relative">
        <button 
          onClick={() => setShowMenu(!showMenu)}
          className="p-2 hover:bg-gray-50 rounded-lg transition-colors"
        >
          <MoreHorizontal className="w-5 h-5 text-gray-600" />
        </button>

        {showMenu && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute right-0 top-full mt-2 bg-white rounded-xl border-2 border-purple-200 shadow-xl overflow-hidden z-50"
          >
            <button
              onClick={() => {
                setShowEditModal(true);
                setShowMenu(false);
              }}
              className="flex items-center gap-2 px-4 py-3 hover:bg-purple-50 transition-colors w-full text-left"
            >
              <Edit className="w-4 h-4 text-purple-600" />
              <span className="font-semibold text-gray-700">Edit</span>
            </button>
            
            <button
              onClick={() => {
                handleDelete();
                setShowMenu(false);
              }}
              className="flex items-center gap-2 px-4 py-3 hover:bg-red-50 transition-colors w-full text-left"
            >
              <Trash2 className="w-4 h-4 text-red-600" />
              <span className="font-semibold text-gray-700">Delete</span>
            </button>
          </motion.div>
        )}
      </div>

      {/* Edit Modal */}
      <AnimatePresence>
        {showEditModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowEditModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900">Edit Post</h2>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-6 h-6 text-gray-600" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6">
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="w-full min-h-[200px] text-lg resize-none border-2 border-purple-100 rounded-xl p-4 focus:border-purple-300 focus:ring-2 focus:ring-purple-200 focus:outline-none"
                  maxLength={5000}
                />
                <div className="text-sm text-right text-gray-500 mt-2">
                  {5000 - editContent.length} characters remaining
                </div>
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-gray-200 flex gap-3">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 py-3 rounded-xl font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleEdit}
                  disabled={loading}
                  className="flex-1 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
