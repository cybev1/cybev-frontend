// ============================================
// FILE: src/components/Live/LivePoll.jsx
// Live Poll Component for Streams
// VERSION: 1.0
// ============================================

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BarChart3,
  Plus,
  X,
  Check,
  Clock,
  Users,
  Loader2,
  ChevronRight
} from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.cybev.io';

// Poll Creator (Host View)
export function PollCreator({ streamId, onPollCreated }) {
  const [isOpen, setIsOpen] = useState(false);
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [duration, setDuration] = useState(60); // seconds
  const [loading, setLoading] = useState(false);

  const addOption = () => {
    if (options.length < 6) {
      setOptions([...options, '']);
    }
  };

  const removeOption = (index) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index));
    }
  };

  const updateOption = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const createPoll = async () => {
    const validOptions = options.filter(o => o.trim());
    if (!question.trim() || validOptions.length < 2) {
      toast.error('Enter a question and at least 2 options');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_URL}/api/stream-schedule/poll`,
        {
          streamId,
          question: question.trim(),
          options: validOptions,
          duration
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success('Poll created!');
      setIsOpen(false);
      setQuestion('');
      setOptions(['', '']);
      onPollCreated?.(response.data.poll);
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to create poll');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl transition-colors"
      >
        <BarChart3 className="w-4 h-4" />
        Create Poll
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-purple-600" />
                  Create Poll
                </h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-4">
                {/* Question */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Question
                  </label>
                  <input
                    type="text"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="Ask your viewers..."
                    maxLength={200}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                {/* Options */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Options
                  </label>
                  <div className="space-y-2">
                    {options.map((option, index) => (
                      <div key={index} className="flex gap-2">
                        <input
                          type="text"
                          value={option}
                          onChange={(e) => updateOption(index, e.target.value)}
                          placeholder={`Option ${index + 1}`}
                          maxLength={100}
                          className="flex-1 px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-purple-500"
                        />
                        {options.length > 2 && (
                          <button
                            onClick={() => removeOption(index)}
                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                  {options.length < 6 && (
                    <button
                      onClick={addOption}
                      className="mt-2 text-sm text-purple-600 hover:text-purple-700 flex items-center gap-1"
                    >
                      <Plus className="w-4 h-4" />
                      Add Option
                    </button>
                  )}
                </div>

                {/* Duration */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <Clock className="w-4 h-4 inline mr-1" />
                    Duration
                  </label>
                  <select
                    value={duration}
                    onChange={(e) => setDuration(parseInt(e.target.value))}
                    className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl"
                  >
                    <option value={30}>30 seconds</option>
                    <option value={60}>1 minute</option>
                    <option value={120}>2 minutes</option>
                    <option value={300}>5 minutes</option>
                    <option value={0}>No limit</option>
                  </select>
                </div>
              </div>

              <div className="p-6 bg-gray-50 dark:bg-gray-800/50 flex gap-3">
                <button
                  onClick={() => setIsOpen(false)}
                  className="flex-1 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  onClick={createPoll}
                  disabled={loading}
                  className="flex-1 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Check className="w-5 h-5" />}
                  Create
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// Poll Display (Viewer View)
export function LivePollDisplay({ poll, onVote, hasVoted, isHost }) {
  const [selectedOption, setSelectedOption] = useState(null);
  const [voting, setVoting] = useState(false);
  const [timeLeft, setTimeLeft] = useState(null);

  useEffect(() => {
    if (poll?.endsAt) {
      const timer = setInterval(() => {
        const remaining = Math.max(0, new Date(poll.endsAt) - new Date());
        setTimeLeft(Math.ceil(remaining / 1000));
        if (remaining <= 0) clearInterval(timer);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [poll?.endsAt]);

  const handleVote = async () => {
    if (selectedOption === null || hasVoted) return;

    setVoting(true);
    try {
      await onVote(selectedOption);
    } finally {
      setVoting(false);
    }
  };

  if (!poll) return null;

  const totalVotes = poll.totalVotes || poll.options?.reduce((sum, o) => sum + (o.voteCount || 0), 0) || 0;
  const showResults = hasVoted || poll.showResults || (timeLeft !== null && timeLeft <= 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden border border-purple-200 dark:border-purple-800"
    >
      <div className="p-4 bg-gradient-to-r from-purple-600 to-pink-600">
        <div className="flex items-center justify-between text-white">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            <span className="font-medium">Live Poll</span>
          </div>
          {timeLeft !== null && timeLeft > 0 && (
            <span className="text-sm bg-white/20 px-2 py-1 rounded-full">
              {timeLeft}s left
            </span>
          )}
        </div>
      </div>

      <div className="p-4">
        <p className="font-semibold text-gray-900 dark:text-white mb-4">{poll.question}</p>

        <div className="space-y-2">
          {poll.options?.map((option, index) => {
            const percentage = totalVotes > 0 ? Math.round(((option.voteCount || 0) / totalVotes) * 100) : 0;
            const isSelected = selectedOption === index;

            return (
              <button
                key={index}
                onClick={() => !hasVoted && setSelectedOption(index)}
                disabled={hasVoted || voting}
                className={`w-full relative overflow-hidden rounded-xl transition-all ${
                  hasVoted || showResults
                    ? 'cursor-default'
                    : isSelected
                    ? 'ring-2 ring-purple-500'
                    : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
              >
                {/* Background progress bar */}
                {showResults && (
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                    className={`absolute inset-y-0 left-0 ${
                      isSelected ? 'bg-purple-100 dark:bg-purple-900/30' : 'bg-gray-100 dark:bg-gray-800'
                    }`}
                  />
                )}

                <div className="relative flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-xl">
                  <div className="flex items-center gap-3">
                    {!hasVoted && !showResults && (
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        isSelected ? 'border-purple-500 bg-purple-500' : 'border-gray-300 dark:border-gray-600'
                      }`}>
                        {isSelected && <Check className="w-3 h-3 text-white" />}
                      </div>
                    )}
                    <span className="font-medium text-gray-900 dark:text-white">{option.text}</span>
                  </div>
                  {showResults && (
                    <span className="font-semibold text-gray-700 dark:text-gray-300">
                      {percentage}%
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Vote Button */}
        {!hasVoted && !showResults && (
          <button
            onClick={handleVote}
            disabled={selectedOption === null || voting}
            className="w-full mt-4 py-3 bg-purple-600 text-white rounded-xl font-medium hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {voting ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <Check className="w-5 h-5" />
                Vote
              </>
            )}
          </button>
        )}

        {/* Stats */}
        <div className="mt-4 flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
          <span className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            {totalVotes} votes
          </span>
          {hasVoted && <span className="text-green-600">You voted ✓</span>}
        </div>
      </div>
    </motion.div>
  );
}

// Poll Results Summary (for host)
export function PollResults({ poll }) {
  if (!poll) return null;

  const totalVotes = poll.totalVotes || poll.options?.reduce((sum, o) => sum + (o.voteCount || 0), 0) || 0;
  const winner = poll.options?.reduce((max, opt) => 
    (opt.voteCount || 0) > (max.voteCount || 0) ? opt : max
  , poll.options[0]);

  return (
    <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
      <p className="font-medium text-gray-900 dark:text-white mb-3">{poll.question}</p>
      
      <div className="space-y-2">
        {poll.options?.map((option, index) => {
          const percentage = totalVotes > 0 ? Math.round(((option.voteCount || 0) / totalVotes) * 100) : 0;
          const isWinner = option.text === winner?.text && totalVotes > 0;

          return (
            <div key={index} className="flex items-center gap-3">
              <div className="flex-1">
                <div className="flex justify-between text-sm mb-1">
                  <span className={isWinner ? 'font-semibold text-purple-600' : 'text-gray-700 dark:text-gray-300'}>
                    {option.text} {isWinner && '👑'}
                  </span>
                  <span className="text-gray-500">{option.voteCount || 0}</span>
                </div>
                <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${isWinner ? 'bg-purple-600' : 'bg-gray-400'}`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
              <span className="text-sm font-medium w-12 text-right">{percentage}%</span>
            </div>
          );
        })}
      </div>

      <p className="text-sm text-gray-500 mt-3">{totalVotes} total votes</p>
    </div>
  );
}

export default { PollCreator, LivePollDisplay, PollResults };
