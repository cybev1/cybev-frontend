/**
 * ============================================
 * FILE: [id].jsx
 * PATH: cybev-frontend-main/src/pages/church/foundation/module/[id].jsx
 * VERSION: 2.0.0 - Mobile-First March 2025
 * STATUS: NEW FILE - Create module/ folder if needed
 * ============================================
 */

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { 
  ArrowLeft,
  BookOpen,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  Circle,
  Play,
  FileText,
  Clock,
  Award,
  ChevronRight,
  Sparkles,
  Flame,
  Droplets,
  Book,
  MessageCircle,
  Scroll,
  Heart
} from 'lucide-react';

// Icon mapping
const iconMap = {
  Sparkles, Flame, Droplets, Book, MessageCircle, Scroll, Heart, BookOpen
};

export default function ModuleDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  
  const [module, setModule] = useState(null);
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('lessons');
  const [expandedLesson, setExpandedLesson] = useState(null);
  
  // Quiz state
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [quizResults, setQuizResults] = useState(null);
  const [submittingQuiz, setSubmittingQuiz] = useState(false);
  
  const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

  useEffect(() => {
    if (id) {
      fetchModule();
    }
  }, [id]);

  const fetchModule = async () => {
    try {
      // Fetch module
      const res = await fetch(`${API_URL}/api/church/foundation/modules/${id}`);
      const data = await res.json();
      if (data.ok) {
        setModule(data.module);
      }

      // Fetch user progress
      const token = localStorage.getItem('token');
      if (token) {
        const progressRes = await fetch(`${API_URL}/api/church/foundation/progress`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const progressData = await progressRes.json();
        if (progressData.ok) {
          setProgress(progressData.progress);
        }
      }
    } catch (error) {
      console.error('Error fetching module:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLessonComplete = async (lessonNumber) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      await fetch(`${API_URL}/api/church/foundation/complete-lesson`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          moduleNumber: parseInt(id),
          lessonId: lessonNumber
        })
      });
      fetchModule();
    } catch (error) {
      console.error('Error completing lesson:', error);
    }
  };

  const isLessonCompleted = (lessonNumber) => {
    if (!progress?.completedLessons) return false;
    return progress.completedLessons.includes(`${id}-${lessonNumber}`);
  };

  const handleQuizAnswer = (questionIndex, answerIndex) => {
    setAnswers(prev => ({
      ...prev,
      [questionIndex]: answerIndex
    }));
  };

  const submitQuiz = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login?redirect=/church/foundation/module/' + id);
      return;
    }

    setSubmittingQuiz(true);
    try {
      const res = await fetch(`${API_URL}/api/church/foundation/submit-quiz`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          moduleNumber: parseInt(id),
          answers: Object.values(answers)
        })
      });
      const data = await res.json();
      if (data.ok) {
        setQuizResults(data);
      }
    } catch (error) {
      console.error('Error submitting quiz:', error);
    } finally {
      setSubmittingQuiz(false);
    }
  };

  const IconComponent = module?.icon ? (iconMap[module.icon] || BookOpen) : BookOpen;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading module...</p>
        </div>
      </div>
    );
  }

  if (!module) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <div className="text-center">
          <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Module Not Found</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">This module doesn't exist or has been removed.</p>
          <button
            onClick={() => router.push('/church/foundation')}
            className="bg-purple-600 text-white px-6 py-3 rounded-xl font-semibold"
          >
            Back to Foundation School
          </button>
        </div>
      </div>
    );
  }

  const quiz = module.quiz || [];
  const lessons = module.lessons || [];
  const completedLessonsCount = lessons.filter((_, i) => isLessonCompleted(i + 1)).length;

  return (
    <>
      <Head>
        <title>{module.title} | Foundation School</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
      </Head>

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Header */}
        <div 
          className="text-white"
          style={{ backgroundColor: module.color || '#8B5CF6' }}
        >
          <div className="px-4 pt-12 pb-6" style={{ paddingTop: 'calc(env(safe-area-inset-top) + 1rem)' }}>
            {/* Back Button */}
            <button
              onClick={() => router.push('/church/foundation')}
              className="flex items-center gap-2 text-white/80 hover:text-white mb-4 transition"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm">Back to Curriculum</span>
            </button>
            
            {/* Module Info */}
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center flex-shrink-0">
                <IconComponent className="w-9 h-9" />
              </div>
              <div>
                <span className="text-sm text-white/70">Class {module.moduleNumber}</span>
                <h1 className="text-2xl font-bold mb-1">{module.title}</h1>
                <p className="text-white/80 text-sm">{module.subtitle}</p>
              </div>
            </div>
            
            {/* Progress */}
            <div className="mt-6 bg-white/10 backdrop-blur rounded-xl p-3">
              <div className="flex justify-between text-sm mb-2">
                <span>Progress</span>
                <span>{completedLessonsCount} / {lessons.length} lessons</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-2">
                <div 
                  className="bg-white h-2 rounded-full transition-all"
                  style={{ width: `${(completedLessonsCount / lessons.length) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 z-10">
          <div className="flex">
            <button
              onClick={() => setActiveTab('lessons')}
              className={`flex-1 py-3 text-sm font-medium border-b-2 transition ${
                activeTab === 'lessons'
                  ? 'border-purple-600 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <BookOpen className="w-4 h-4 inline mr-2" />
              Lessons ({lessons.length})
            </button>
            <button
              onClick={() => setActiveTab('quiz')}
              className={`flex-1 py-3 text-sm font-medium border-b-2 transition ${
                activeTab === 'quiz'
                  ? 'border-purple-600 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Award className="w-4 h-4 inline mr-2" />
              Quiz ({quiz.length})
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="px-4 py-6">
          {/* Lessons Tab */}
          {activeTab === 'lessons' && (
            <div className="space-y-3">
              {lessons.map((lesson, index) => {
                const lessonNumber = lesson.lessonNumber || index + 1;
                const completed = isLessonCompleted(lessonNumber);
                const isExpanded = expandedLesson === lessonNumber;
                
                return (
                  <div
                    key={lessonNumber}
                    className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden"
                  >
                    {/* Lesson Header */}
                    <button
                      onClick={() => setExpandedLesson(isExpanded ? null : lessonNumber)}
                      className="w-full p-4 flex items-center gap-3 text-left"
                    >
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        completed 
                          ? 'bg-green-100 dark:bg-green-900/30' 
                          : 'bg-gray-100 dark:bg-gray-700'
                      }`}>
                        {completed ? (
                          <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                        ) : (
                          <span className="text-sm font-semibold text-gray-500">{lessonNumber}</span>
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                          {lesson.title}
                        </h3>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <Clock className="w-3 h-3" />
                          <span>{lesson.duration || '30 min'}</span>
                        </div>
                      </div>
                      
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5 text-gray-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                      )}
                    </button>
                    
                    {/* Lesson Content (Expanded) */}
                    {isExpanded && (
                      <div className="px-4 pb-4 border-t border-gray-100 dark:border-gray-700">
                        <div className="pt-4 prose dark:prose-invert max-w-none text-sm">
                          {/* Content */}
                          <div className="whitespace-pre-wrap text-gray-700 dark:text-gray-300 mb-4">
                            {lesson.content}
                          </div>
                          
                          {/* Key Points */}
                          {lesson.keyPoints && lesson.keyPoints.length > 0 && (
                            <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4 mb-4">
                              <h4 className="font-semibold text-purple-900 dark:text-purple-200 mb-2 flex items-center gap-2">
                                <Sparkles className="w-4 h-4" />
                                Key Points
                              </h4>
                              <ul className="space-y-2">
                                {lesson.keyPoints.map((point, i) => (
                                  <li key={i} className="flex items-start gap-2 text-purple-800 dark:text-purple-200">
                                    <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                                    <span>{point}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                          
                          {/* Memory Verse */}
                          {lesson.memoryVerse && (
                            <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-xl p-4 mb-4">
                              <h4 className="font-semibold text-yellow-900 dark:text-yellow-200 mb-2 flex items-center gap-2">
                                <Book className="w-4 h-4" />
                                Memory Verse
                              </h4>
                              <p className="text-yellow-800 dark:text-yellow-200 italic">
                                "{lesson.memoryVerse}"
                              </p>
                            </div>
                          )}
                          
                          {/* Scripture References */}
                          {lesson.scriptureReferences && lesson.scriptureReferences.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-4">
                              {lesson.scriptureReferences.map((ref, i) => (
                                <span 
                                  key={i}
                                  className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg text-xs"
                                >
                                  {ref}
                                </span>
                              ))}
                            </div>
                          )}
                          
                          {/* Complete Button */}
                          {!completed && (
                            <button
                              onClick={() => handleLessonComplete(lessonNumber)}
                              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2"
                            >
                              <CheckCircle className="w-5 h-5" />
                              Mark as Complete
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Quiz Tab */}
          {activeTab === 'quiz' && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-4">
              {quizResults ? (
                // Quiz Results
                <div>
                  <div className={`text-center mb-6 p-6 rounded-2xl ${
                    quizResults.passed 
                      ? 'bg-green-50 dark:bg-green-900/20' 
                      : 'bg-red-50 dark:bg-red-900/20'
                  }`}>
                    <div className={`w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center ${
                      quizResults.passed 
                        ? 'bg-green-100 dark:bg-green-900/30' 
                        : 'bg-red-100 dark:bg-red-900/30'
                    }`}>
                      {quizResults.passed ? (
                        <CheckCircle className="w-10 h-10 text-green-600" />
                      ) : (
                        <Circle className="w-10 h-10 text-red-600" />
                      )}
                    </div>
                    
                    <h2 className={`text-2xl font-bold mb-2 ${
                      quizResults.passed 
                        ? 'text-green-800 dark:text-green-200' 
                        : 'text-red-800 dark:text-red-200'
                    }`}>
                      {quizResults.passed ? 'Congratulations!' : 'Keep Learning!'}
                    </h2>
                    
                    <p className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                      {quizResults.score}%
                    </p>
                    
                    <p className="text-gray-600 dark:text-gray-400">
                      {quizResults.correct} of {quizResults.total} correct
                    </p>
                    
                    {!quizResults.passed && (
                      <p className="text-sm text-gray-500 mt-2">
                        You need {quizResults.passingScore}% to pass. Review the lessons and try again!
                      </p>
                    )}
                  </div>
                  
                  {/* Detailed Results */}
                  <div className="space-y-4">
                    {quizResults.results.map((result, i) => (
                      <div 
                        key={i}
                        className={`p-4 rounded-xl border ${
                          result.isCorrect 
                            ? 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20' 
                            : 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20'
                        }`}
                      >
                        <p className="font-medium text-gray-900 dark:text-white mb-2">
                          {i + 1}. {result.question}
                        </p>
                        
                        <p className={`text-sm mb-1 ${
                          result.isCorrect ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'
                        }`}>
                          Your answer: {quiz[i]?.options?.[result.userAnswer] || 'No answer'}
                        </p>
                        
                        {!result.isCorrect && (
                          <p className="text-sm text-green-700 dark:text-green-300">
                            Correct answer: {quiz[i]?.options?.[result.correctAnswer]}
                          </p>
                        )}
                        
                        {result.explanation && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 italic">
                            {result.explanation}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="mt-6 space-y-3">
                    {quizResults.passed ? (
                      <button
                        onClick={() => router.push('/church/foundation')}
                        className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2"
                      >
                        Continue to Next Class
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          setQuizResults(null);
                          setQuizStarted(false);
                          setAnswers({});
                          setCurrentQuestion(0);
                        }}
                        className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 rounded-xl font-semibold"
                      >
                        Try Again
                      </button>
                    )}
                  </div>
                </div>
              ) : quizStarted ? (
                // Quiz Questions
                <div>
                  {/* Progress */}
                  <div className="mb-6">
                    <div className="flex justify-between text-sm text-gray-500 mb-2">
                      <span>Question {currentQuestion + 1} of {quiz.length}</span>
                      <span>{Object.keys(answers).length} answered</span>
                    </div>
                    <div className="flex gap-1">
                      {quiz.map((_, i) => (
                        <div
                          key={i}
                          className={`h-2 flex-1 rounded-full ${
                            i === currentQuestion
                              ? 'bg-purple-500'
                              : answers[i] !== undefined
                                ? 'bg-green-500'
                                : 'bg-gray-200 dark:bg-gray-700'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  
                  {/* Current Question */}
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      {quiz[currentQuestion]?.question}
                    </h3>
                    
                    <div className="space-y-3">
                      {quiz[currentQuestion]?.options?.map((option, i) => {
                        const isSelected = answers[currentQuestion] === i;
                        return (
                          <button
                            key={i}
                            onClick={() => handleQuizAnswer(currentQuestion, i)}
                            className={`w-full p-4 rounded-xl text-left transition border-2 ${
                              isSelected
                                ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                                isSelected
                                  ? 'border-purple-500 bg-purple-500'
                                  : 'border-gray-300'
                              }`}>
                                {isSelected && <CheckCircle className="w-4 h-4 text-white" />}
                              </div>
                              <span className="text-gray-900 dark:text-white">{option}</span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  
                  {/* Navigation */}
                  <div className="flex gap-3">
                    {currentQuestion > 0 && (
                      <button
                        onClick={() => setCurrentQuestion(prev => prev - 1)}
                        className="flex-1 py-3 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-700 dark:text-gray-300 font-semibold"
                      >
                        Previous
                      </button>
                    )}
                    
                    {currentQuestion < quiz.length - 1 ? (
                      <button
                        onClick={() => setCurrentQuestion(prev => prev + 1)}
                        disabled={answers[currentQuestion] === undefined}
                        className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 rounded-xl font-semibold disabled:opacity-50"
                      >
                        Next
                      </button>
                    ) : (
                      <button
                        onClick={submitQuiz}
                        disabled={Object.keys(answers).length < quiz.length || submittingQuiz}
                        className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 rounded-xl font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        {submittingQuiz ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Submitting...
                          </>
                        ) : (
                          <>Submit Quiz</>
                        )}
                      </button>
                    )}
                  </div>
                  
                  {/* Question Navigator */}
                  <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-sm text-gray-500 mb-3">Jump to question:</p>
                    <div className="flex flex-wrap gap-2">
                      {quiz.map((_, i) => {
                        const answered = answers[i] !== undefined;
                        return (
                          <button
                            key={i}
                            onClick={() => setCurrentQuestion(i)}
                            className={`w-9 h-9 rounded-lg text-sm font-medium ${
                              i === currentQuestion
                                ? 'bg-purple-500 text-white'
                                : answered
                                  ? 'bg-green-100 text-green-600 dark:bg-green-900/40'
                                  : 'bg-gray-100 text-gray-400 dark:bg-gray-700'
                            }`}
                          >
                            {i + 1}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ) : (
                // Quiz Start Screen
                <div className="text-center py-8">
                  <div className="w-20 h-20 bg-purple-100 dark:bg-purple-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Award className="w-10 h-10 text-purple-600 dark:text-purple-400" />
                  </div>
                  
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    Ready for the Quiz?
                  </h2>
                  
                  <p className="text-gray-500 dark:text-gray-400 mb-6">
                    Test your knowledge of "{module.title}" with {quiz.length} questions. 
                    You need {module.passingScore || 70}% to pass.
                  </p>
                  
                  <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 mb-6">
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">{quiz.length}</p>
                        <p className="text-xs text-gray-500">Questions</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">{module.passingScore || 70}%</p>
                        <p className="text-xs text-gray-500">To Pass</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">∞</p>
                        <p className="text-xs text-gray-500">Attempts</p>
                      </div>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => setQuizStarted(true)}
                    className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2"
                  >
                    <Play className="w-5 h-5" />
                    Start Quiz
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Bottom safe area */}
        <div style={{ paddingBottom: 'env(safe-area-inset-bottom)' }} />
      </div>
    </>
  );
}
