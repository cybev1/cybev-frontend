import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { MessageCircle, Heart, Reply, Edit, Trash2, Send } from 'lucide-react';
import { toast } from 'react-toastify';
import api from '../lib/api';

export default function Comments({ blogId }) {
  const router = useRouter();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);
  const [editingComment, setEditingComment] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (blogId) {
      fetchComments();
    }
  }, [blogId]);

  const fetchComments = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/comments/blog/${blogId}`);
      if (response.data.ok) {
        setComments(response.data.comments);
      }
    } catch (error) {
      console.error('Failed to load comments');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitComment = async (parentId = null) => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please login to comment');
      router.push('/auth/login');
      return;
    }

    const content = parentId ? replyingTo?.content : newComment;
    if (!content?.trim()) {
      toast.error('Comment cannot be empty');
      return;
    }

    setSubmitting(true);
    try {
      const response = await api.post('/comments', {
        content,
        blogId,
        parentCommentId: parentId
      });

      if (response.data.ok) {
        toast.success('Comment posted!');
        setNewComment('');
        setReplyingTo(null);
        fetchComments();
      }
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to post comment');
    } finally {
      setSubmitting(false);
    }
  };

  const handleLikeComment = async (commentId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please login to like comments');
      return;
    }

    try {
      const response = await api.post(`/comments/${commentId}/like`);
      if (response.data.ok) {
        fetchComments();
      }
    } catch (error) {
      toast.error('Failed to like comment');
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!confirm('Are you sure you want to delete this comment?')) return;

    try {
      const response = await api.delete(`/comments/${commentId}`);
      if (response.data.ok) {
        toast.success('Comment deleted');
        fetchComments();
      }
    } catch (error) {
      toast.error('Failed to delete comment');
    }
  };

  const CommentItem = ({ comment, isReply = false }) => {
    const user = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('user') || '{}') : {};
    const isAuthor = user.id === comment.author?._id;

    return (
      <div className={`${isReply ? 'ml-12' : ''} mb-4`}>
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                {comment.authorName?.charAt(0) || '?'}
              </div>
              <div>
                <p className="font-semibold text-gray-900">{comment.authorName}</p>
                <p className="text-xs text-gray-500">
                  {new Date(comment.createdAt).toLocaleDateString()} 
                  {comment.isEdited && ' (edited)'}
                </p>
              </div>
            </div>
          </div>

          <p className="text-gray-700 mb-3 whitespace-pre-wrap">{comment.content}</p>

          <div className="flex items-center gap-4">
            <button
              onClick={() => handleLikeComment(comment._id)}
              className="flex items-center gap-1 text-gray-600 hover:text-pink-600 transition-colors text-sm"
            >
              <Heart className={`w-4 h-4 ${comment.likes?.includes(user.id) ? 'fill-pink-600 text-pink-600' : ''}`} />
              <span>{comment.likes?.length || 0}</span>
            </button>

            {!isReply && (
              <button
                onClick={() => setReplyingTo({ id: comment._id, content: '' })}
                className="flex items-center gap-1 text-gray-600 hover:text-blue-600 transition-colors text-sm"
              >
                <Reply className="w-4 h-4" />
                <span>Reply</span>
              </button>
            )}

            {isAuthor && (
              <button
                onClick={() => handleDeleteComment(comment._id)}
                className="flex items-center gap-1 text-gray-600 hover:text-red-600 transition-colors text-sm"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete</span>
              </button>
            )}
          </div>
        </div>

        {/* Reply Input */}
        {replyingTo?.id === comment._id && (
          <div className="ml-12 mt-3">
            <div className="flex gap-2">
              <input
                type="text"
                value={replyingTo.content}
                onChange={(e) => setReplyingTo({ ...replyingTo, content: e.target.value })}
                placeholder="Write a reply..."
                className="flex-1 px-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                onKeyPress={(e) => e.key === 'Enter' && handleSubmitComment(comment._id)}
              />
              <button
                onClick={() => handleSubmitComment(comment._id)}
                disabled={submitting}
                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
              </button>
              <button
                onClick={() => setReplyingTo(null)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Replies */}
        {comment.replies?.length > 0 && (
          <div className="mt-3">
            {comment.replies.map((reply) => (
              <CommentItem key={reply._id} comment={reply} isReply={true} />
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200">
      <div className="flex items-center gap-2 mb-6">
        <MessageCircle className="w-5 h-5 text-purple-600" />
        <h2 className="text-2xl font-bold text-gray-900">
          Comments ({comments.length})
        </h2>
      </div>

      {/* New Comment Input */}
      <div className="mb-8">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Share your thoughts..."
          rows={3}
          className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
        />
        <div className="flex justify-end mt-2">
          <button
            onClick={() => handleSubmitComment()}
            disabled={submitting || !newComment.trim()}
            className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
          >
            <Send className="w-4 h-4" />
            {submitting ? 'Posting...' : 'Post Comment'}
          </button>
        </div>
      </div>

      {/* Comments List */}
      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-gray-50 rounded-lg p-4 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/4 mb-3"></div>
              <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center py-8">
          <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No comments yet. Be the first to comment!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <CommentItem key={comment._id} comment={comment} />
          ))}
        </div>
      )}
    </div>
  );
}
