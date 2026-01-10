// ============================================
// FILE: pages/church/foundation/module/[id].jsx
// Foundation School Module Viewer
// VERSION: 1.0.0
// ============================================

import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  BookOpen, ArrowLeft, ChevronRight, ChevronLeft, Play,
  CheckCircle, XCircle, BookMarked, FileText, HelpCircle,
  Award, Loader2, Volume2, Clock
} from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.cybev.io';

function LessonContent({ lesson, index }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700">
      <div className="flex items-start gap-4 mb-4">
        <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400 font-bold">
          {index + 1}
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {lesson.title}
          </h3>
          {lesson.duration && (
            <span className="text-sm text-gray-500 flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {lesson.duration} min read
            </span>
          )}
        </div>
      </div>
      
      <div className="prose dark:prose-invert max-w-none">
        <p className="text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
          {lesson.content}
        </p>
      </div>

      {lesson.videoUrl && (
        <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
          <a 
            href={lesson.videoUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-purple-600 dark:text-purple-400 hover:underline"
          >
            <Play className="w-5 h-5" />
            Watch Video Lesson
          </a>
        </div>
      )}
    </div>
  );
}

function QuizQuestion({ question, index, selectedAnswer, onSelect, showResult }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700">
      <div className="flex items-start gap-3 mb-4">
        <span className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400 font-bold text-sm flex-shrink-0">
          {index + 1}
        </span>
        <p className="text-gray-900 dark:text-white font-medium">{question.question}</p>
      </div>

      <div className="space-y-2 ml-11">
        {question.options.map((option, i) => {
          const isSelected = selectedAnswer === i;
          const isCorrect = i === question.correctAnswer;
          
          let bgClass = 'bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700';
          let borderClass = 'border-gray-200 dark:border-gray-600';
          
          if (showResult) {
            if (isCorrect) {
              bgClass = 'bg-green-50 dark:bg-green-900/20';
              borderClass = 'border-green-500';
            } else if (isSelected && !isCorrect) {
              bgClass = 'bg-red-50 dark:bg-red-900/20';
              borderClass = 'border-red-500';
            }
          } else if (isSelected) {
            bgClass = 'bg-purple-50 dark:bg-purple-900/20';
            borderClass = 'border-purple-500';
          }

          return (
            <button
              key={i}
              onClick={() => !showResult && onSelect(i)}
              disabled={showResult}
              className={`w-full p-4 rounded-xl border-2 text-left transition-all ${bgClass} ${borderClass}`}
            >
              <div className="flex items-center gap-3">
                <span className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-sm ${
                  isSelected 
                    ? 'border-purple-500 bg-purple-500 text-white' 
                    : 'border-gray-300 dark:border-gray-500'
                }`}>
                  {showResult && isCorrect ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : showResult && isSelected && !isCorrect ? (
                    <XCircle className="w-4 h-4 text-red-500" />
                  ) : (
                    String.fromCharCode(65 + i)
                  )}
                </span>
                <span className={`${
                  showResult && isCorrect 
                    ? 'text-green-700 dark:text-green-400 font-medium' 
                    : showResult && isSelected && !isCorrect
                      ? 'text-red-700 dark:text-red-400'
                      : 'text-gray-700 dark:text-gray-300'
                }`}>
                  {option}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {showResult && question.explanation && (
        <div className="mt-4 ml-11 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
          <p className="text-sm text-blue-700 dark:text-blue-300">
            <strong>Explanation:</strong> {question.explanation}
          </p>
        </div>
      )}
    </div>
  );
}

export default function ModuleViewer() {
  const router = useRouter();
  const { id: moduleNumber } = router.query;
  
  const [loading, setLoading] = useState(true);
  const [module, setModule] = useState(null);
  const [activeTab, setActiveTab] = useState('lessons');
  const [currentLesson, setCurrentLesson] = useState(0);
  
  // Quiz state
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const getAuth = () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    return { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } };
  };

  useEffect(() => {
    if (moduleNumber) {
      fetchModule();
    }
  }, [moduleNumber]);

  const fetchModule = async () => {
    try {
      const res = await fetch(`${API_URL}/api/church/foundation/modules`);
      const data = await res.json();
      if (data.ok) {
        const foundModule = data.modules.find(m => m.moduleNumber === parseInt(moduleNumber));
        setModule(foundModule);
      }
    } catch (err) {
      console.error('Fetch module error:', err);
    }
    setLoading(false);
  };

  const handleQuizAnswer = (questionIndex, answerIndex) => {
    setQuizAnswers(prev => ({
      ...prev,
      [questionIndex]: answerIndex
    }));
  };

  const calculateScore = () => {
    if (!module?.quiz) return 0;
    let correct = 0;
    module.quiz.forEach((q, i) => {
      if (quizAnswers[i] === q.correctAnswer) {
        correct++;
      }
    });
    return Math.round((correct / module.quiz.length) * 100);
  };

  const handleSubmitQuiz = async () => {
    const score = calculateScore();
    setQuizScore(score);
    setQuizSubmitted(true);
    setSubmitting(true);

    try {
      const res = await fetch(`${API_URL}/api/church/foundation/complete-module`, {
        method: 'POST',
        ...getAuth(),
        body: JSON.stringify({
          moduleNumber: parseInt(moduleNumber),
          quizScore: score
        })
      });
      const data = await res.json();
      // Handle response
    } catch (err) {
      console.error('Submit quiz error:', err);
    }
    setSubmitting(false);
  };

  const resetQuiz = () => {
    setQuizAnswers({});
    setQuizSubmitted(false);
    setQuizScore(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
      </div>
    );
  }

  if (!module) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Module not found</p>
          <Link href="/church/foundation">
            <button className="px-6 py-2 bg-purple-600 text-white rounded-lg">
              Back to Modules
            </button>
          </Link>
        </div>
      </div>
    );
  }

  const lessons = module.content?.lessons || [];
  const quiz = module.quiz || [];
  const passed = quizScore !== null && quizScore >= (module.passingScore || 70);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Head>
        <title>Module {module.moduleNumber}: {module.title} - Foundation School</title>
      </Head>

      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <Link href="/church/foundation" className="inline-flex items-center gap-2 text-purple-200 hover:text-white mb-3">
            <ArrowLeft className="w-4 h-4" />
            Back to Foundation School
          </Link>
          
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center">
              <span className="text-2xl font-bold">{module.moduleNumber}</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold">{module.title}</h1>
              <p className="text-purple-200">{module.description}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex gap-1">
            <button
              onClick={() => setActiveTab('lessons')}
              className={`px-6 py-4 font-medium border-b-2 transition ${
                activeTab === 'lessons'
                  ? 'border-purple-500 text-purple-600 dark:text-purple-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <FileText className="w-4 h-4 inline mr-2" />
              Lessons ({lessons.length})
            </button>
            <button
              onClick={() => setActiveTab('scriptures')}
              className={`px-6 py-4 font-medium border-b-2 transition ${
                activeTab === 'scriptures'
                  ? 'border-purple-500 text-purple-600 dark:text-purple-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <BookMarked className="w-4 h-4 inline mr-2" />
              Scriptures
            </button>
            <button
              onClick={() => setActiveTab('quiz')}
              className={`px-6 py-4 font-medium border-b-2 transition ${
                activeTab === 'quiz'
                  ? 'border-purple-500 text-purple-600 dark:text-purple-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <HelpCircle className="w-4 h-4 inline mr-2" />
              Quiz ({quiz.length})
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Lessons Tab */}
        {activeTab === 'lessons' && (
          <div className="space-y-6">
            {/* Memory Verse */}
            {module.content?.memoryVerse && (
              <div className="bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 rounded-2xl p-6 border border-amber-200 dark:border-amber-800">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                  <BookMarked className="w-5 h-5 text-amber-500" />
                  Memory Verse
                </h3>
                <blockquote className="text-gray-700 dark:text-gray-300 italic text-lg">
                  "{module.content.memoryVerse}"
                </blockquote>
              </div>
            )}

            {/* Introduction */}
            {module.content?.introduction && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Introduction</h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {module.content.introduction}
                </p>
              </div>
            )}

            {/* Lessons */}
            {lessons.map((lesson, i) => (
              <LessonContent key={i} lesson={lesson} index={i} />
            ))}

            {/* Continue to Quiz */}
            <div className="flex justify-center pt-6">
              <button
                onClick={() => setActiveTab('quiz')}
                className="px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-indigo-700 flex items-center gap-2"
              >
                Continue to Quiz
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Scriptures Tab */}
        {activeTab === 'scriptures' && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <BookMarked className="w-5 h-5 text-purple-500" />
              Key Scriptures
            </h3>
            
            <div className="space-y-3">
              {module.content?.scriptures?.map((scripture, i) => (
                <div 
                  key={i}
                  className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl flex items-center gap-3"
                >
                  <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400 text-sm font-bold">
                    {i + 1}
                  </div>
                  <span className="text-gray-700 dark:text-gray-300 font-medium">
                    {scripture}
                  </span>
                </div>
              ))}
            </div>

            <p className="mt-6 text-gray-500 text-sm">
              💡 Tip: Look up each scripture in your Bible and meditate on them.
            </p>
          </div>
        )}

        {/* Quiz Tab */}
        {activeTab === 'quiz' && (
          <div className="space-y-6">
            {/* Quiz Result */}
            {quizSubmitted && (
              <div className={`rounded-2xl p-6 text-center ${
                passed 
                  ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
                  : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
              }`}>
                <div className={`w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center ${
                  passed ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30'
                }`}>
                  {passed ? (
                    <Award className="w-10 h-10 text-green-500" />
                  ) : (
                    <XCircle className="w-10 h-10 text-red-500" />
                  )}
                </div>
                <h3 className={`text-2xl font-bold mb-2 ${
                  passed ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'
                }`}>
                  {passed ? 'Congratulations!' : 'Keep Learning!'}
                </h3>
                <p className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                  {quizScore}%
                </p>
                <p className={`${passed ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                  {passed 
                    ? `You passed! You can now proceed to Module ${module.moduleNumber + 1}.`
                    : `You need ${module.passingScore || 70}% to pass. Review the lessons and try again.`
                  }
                </p>
                
                <div className="flex gap-3 justify-center mt-6">
                  {!passed && (
                    <button
                      onClick={resetQuiz}
                      className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-300 dark:hover:bg-gray-600"
                    >
                      Try Again
                    </button>
                  )}
                  <Link href="/church/foundation">
                    <button className="px-6 py-3 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700">
                      {passed ? 'Continue' : 'Back to Modules'}
                    </button>
                  </Link>
                </div>
              </div>
            )}

            {/* Quiz Questions */}
            {!quizSubmitted && quiz.map((question, i) => (
              <QuizQuestion
                key={i}
                question={question}
                index={i}
                selectedAnswer={quizAnswers[i]}
                onSelect={(answer) => handleQuizAnswer(i, answer)}
                showResult={quizSubmitted}
              />
            ))}

            {/* Submit Button */}
            {!quizSubmitted && (
              <div className="flex justify-center pt-6">
                <button
                  onClick={handleSubmitQuiz}
                  disabled={Object.keys(quizAnswers).length < quiz.length || submitting}
                  className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold hover:from-green-600 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      Submit Quiz ({Object.keys(quizAnswers).length}/{quiz.length})
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Show all results after submit */}
            {quizSubmitted && quiz.map((question, i) => (
              <QuizQuestion
                key={`result-${i}`}
                question={question}
                index={i}
                selectedAnswer={quizAnswers[i]}
                onSelect={() => {}}
                showResult={true}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
