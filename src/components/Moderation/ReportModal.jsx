// ============================================
// FILE: src/components/Moderation/ReportModal.jsx
// Report Content Modal
// VERSION: 1.0
// ============================================

import { useState } from 'react';
import axios from 'axios';
import {
  X,
  Flag,
  AlertTriangle,
  Shield,
  Loader2,
  CheckCircle,
  MessageSquare,
  User,
  FileText,
  Video,
  Image as ImageIcon,
  Users
} from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.cybev.io';

const REPORT_REASONS = [
  { value: 'spam', label: 'Spam', description: 'Repetitive, promotional, or irrelevant content', icon: '🚫' },
  { value: 'harassment', label: 'Harassment', description: 'Bullying, threats, or targeted abuse', icon: '😠' },
  { value: 'hate-speech', label: 'Hate Speech', description: 'Discrimination based on identity', icon: '🚷' },
  { value: 'violence', label: 'Violence', description: 'Threats or graphic violent content', icon: '⚠️' },
  { value: 'nudity', label: 'Nudity/Sexual Content', description: 'Adult or sexually explicit content', icon: '🔞' },
  { value: 'self-harm', label: 'Self-Harm', description: 'Content promoting self-injury', icon: '💔' },
  { value: 'misinformation', label: 'Misinformation', description: 'False or misleading information', icon: '❌' },
  { value: 'copyright', label: 'Copyright', description: 'Unauthorized use of copyrighted material', icon: '©️' },
  { value: 'impersonation', label: 'Impersonation', description: 'Pretending to be someone else', icon: '🎭' },
  { value: 'scam', label: 'Scam/Fraud', description: 'Deceptive schemes or fraud attempts', icon: '💸' },
  { value: 'underage', label: 'Involves Minor', description: 'Inappropriate content involving minors', icon: '🔒' },
  { value: 'other', label: 'Other', description: 'Another reason not listed', icon: '📋' }
];

const CONTENT_TYPE_ICONS = {
  post: FileText,
  blog: FileText,
  comment: MessageSquare,
  user: User,
  group: Users,
  event: Flag,
  'live-stream': Video,
  nft: ImageIcon
};

export default function ReportModal({ 
  isOpen, 
  onClose, 
  contentType, 
  contentId,
  contentPreview 
}) {
  const [selectedReason, setSelectedReason] = useState('');
  const [details, setDetails] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!selectedReason) {
      setError('Please select a reason for your report');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      const token = localStorage.getItem('token');
      await axios.post(
        `${API_URL}/api/moderation/report`,
        {
          contentType,
          contentId,
          reason: selectedReason,
          reasonDetails: details.trim() || undefined
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSubmitted(true);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to submit report');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSelectedReason('');
    setDetails('');
    setSubmitted(false);
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  const ContentIcon = CONTENT_TYPE_ICONS[contentType] || Flag;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
              <Flag className="w-5 h-5 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900 dark:text-white">Report Content</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                <ContentIcon className="w-3 h-3" />
                {contentType.replace('-', ' ')}
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[60vh]">
          {submitted ? (
            // Success state
            <div className="p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Report Submitted
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Thank you for helping keep our community safe. We'll review your report and take appropriate action.
              </p>
              <button
                onClick={handleClose}
                className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
              >
                Done
              </button>
            </div>
          ) : (
            <div className="p-4 space-y-4">
              {/* Content Preview */}
              {contentPreview && (
                <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
                    {contentPreview}
                  </p>
                </div>
              )}

              {/* Info */}
              <div className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  Your report is anonymous. The content creator won't know who reported them.
                </p>
              </div>

              {/* Reason Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Why are you reporting this?
                </label>
                <div className="space-y-2">
                  {REPORT_REASONS.map(reason => (
                    <button
                      key={reason.value}
                      type="button"
                      onClick={() => {
                        setSelectedReason(reason.value);
                        setError('');
                      }}
                      className={`w-full p-3 rounded-lg border text-left transition ${
                        selectedReason === reason.value
                          ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                          : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-lg">{reason.icon}</span>
                        <div>
                          <div className={`font-medium ${
                            selectedReason === reason.value
                              ? 'text-purple-700 dark:text-purple-300'
                              : 'text-gray-900 dark:text-white'
                          }`}>
                            {reason.label}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {reason.description}
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Additional Details */}
              {selectedReason && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Additional details (optional)
                  </label>
                  <textarea
                    value={details}
                    onChange={(e) => setDetails(e.target.value)}
                    placeholder="Provide any additional context that might help our team review this report..."
                    rows={3}
                    maxLength={500}
                    className="w-full px-4 py-3 border dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
                  />
                  <div className="text-right text-xs text-gray-500 mt-1">
                    {details.length}/500
                  </div>
                </div>
              )}

              {/* Error */}
              {error && (
                <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg text-red-600 dark:text-red-400">
                  <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                  <span className="text-sm">{error}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        {!submitted && (
          <div className="p-4 border-t dark:border-gray-700 flex gap-3">
            <button
              onClick={handleClose}
              className="flex-1 py-2 border dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading || !selectedReason}
              className="flex-1 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Flag className="w-4 h-4" />
                  Submit Report
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
