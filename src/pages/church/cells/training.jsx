// ============================================
// FILE: /church/cells/training.jsx
// PURPOSE: Cell Leader Training Curriculum
// Based on Cell Ministry Manual
// ============================================

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import {
  ArrowLeft, BookOpen, Award, Users, CheckCircle, Lock, Play,
  Clock, Star, ChevronRight, Target, Heart, Mic, Calendar,
  FileText, Video, Download, ExternalLink
} from 'lucide-react';
import AppLayout from '@/components/Layout/AppLayout';

// Cell Leader Training Curriculum
const TRAINING_MODULES = [
  {
    id: 'foundations',
    title: 'Foundations of Cell Ministry',
    description: 'Understanding the biblical basis and purpose of cell groups',
    icon: BookOpen,
    color: '#7c3aed',
    duration: '2 hours',
    lessons: [
      {
        id: 'f1',
        title: 'What is a Cell?',
        description: 'The cell is the basic unit of the ministry - a small group of believers meeting regularly for fellowship, Bible study, and outreach.',
        keyPoints: [
          'A cell is a missionary unit for soul winning',
          'Cells meet weekly in homes or designated locations',
          'Every member is a potential cell leader',
          'Cells are designed to grow and multiply'
        ],
        scripture: 'Acts 2:46-47 - "Day after day they met together in the temple courts, and in their homes they broke bread and shared their meals with glad and sincere hearts."'
      },
      {
        id: 'f2',
        title: 'The Vision of Cell Ministry',
        description: 'Every member a minister, every home a church',
        keyPoints: [
          'Reaching the unreached through personal evangelism',
          'Discipling new believers in an intimate setting',
          'Raising leaders for the end-time harvest',
          'Building strong families and communities'
        ],
        scripture: 'Matthew 28:19-20 - "Go and make disciples of all nations..."'
      },
      {
        id: 'f3',
        title: 'Cell Structure & Hierarchy',
        description: 'Bible Study Class → Cell → Senior Cell → PCF',
        keyPoints: [
          'Bible Study Class: 3-15 members (Entry point)',
          'Cell: 15-30 members (Growing fellowship)',
          'Senior Cell: 30-50 members (Ready to multiply)',
          'PCF: Network of cells under a PCF Leader'
        ],
        scripture: 'Exodus 18:21 - "Select capable men...as officials over thousands, hundreds, fifties and tens."'
      }
    ]
  },
  {
    id: 'weekly_meetings',
    title: 'The Four Weekly Meetings',
    description: 'Structure and purpose of each meeting type',
    icon: Calendar,
    color: '#3b82f6',
    duration: '3 hours',
    lessons: [
      {
        id: 'w1',
        title: '1. Cell Meeting',
        description: 'Weekly fellowship and Bible study',
        keyPoints: [
          'Opening prayer and worship (10 min)',
          'Testimony time (10 min)',
          'Bible study/Message review (30 min)',
          'Prayer and ministry time (20 min)',
          'Announcements and offering (10 min)'
        ],
        scripture: 'Hebrews 10:25 - "Not forsaking the assembling of ourselves together..."'
      },
      {
        id: 'w2',
        title: '2. Outreach/Evangelism',
        description: 'Soul winning and community outreach',
        keyPoints: [
          'Organized street evangelism',
          'Door-to-door visitation',
          'Market and workplace outreach',
          'Campus evangelism',
          'Online evangelism'
        ],
        scripture: 'Mark 16:15 - "Go into all the world and preach the gospel..."'
      },
      {
        id: 'w3',
        title: '3. Follow-up/Consolidation',
        description: 'New convert care and discipleship',
        keyPoints: [
          'Visit new converts within 48 hours',
          'Establish them in the Word',
          'Connect them to a cell',
          'Enroll in Foundation School',
          'Integrate into church activities'
        ],
        scripture: 'John 21:15-17 - "Feed my lambs...Take care of my sheep..."'
      },
      {
        id: 'w4',
        title: "4. Leaders' Meeting",
        description: 'Training and planning for cell leaders',
        keyPoints: [
          'Report review and analysis',
          'Message preparation for the week',
          'Skill development training',
          'Prayer for cell members',
          'Goal setting and planning'
        ],
        scripture: '2 Timothy 2:2 - "The things you have heard...entrust to reliable people who will also be qualified to teach others."'
      }
    ]
  },
  {
    id: 'leadership_skills',
    title: 'Cell Leadership Skills',
    description: 'Practical skills for effective cell leadership',
    icon: Star,
    color: '#f59e0b',
    duration: '4 hours',
    lessons: [
      {
        id: 'l1',
        title: 'Leading Worship',
        description: 'Creating an atmosphere for the Spirit',
        keyPoints: [
          'Select appropriate songs',
          'Lead with confidence and sensitivity',
          'Allow time for spontaneous worship',
          'Be sensitive to the Holy Spirit'
        ]
      },
      {
        id: 'l2',
        title: 'Teaching the Word',
        description: 'Effective Bible study facilitation',
        keyPoints: [
          'Prepare thoroughly',
          'Use illustrations and examples',
          'Encourage participation',
          'Apply truth to daily life'
        ]
      },
      {
        id: 'l3',
        title: 'Pastoral Care',
        description: 'Caring for cell members',
        keyPoints: [
          'Regular contact with members',
          'Visit the sick and troubled',
          'Counsel with wisdom',
          'Refer serious cases to pastoral leadership'
        ]
      },
      {
        id: 'l4',
        title: 'Handling Challenges',
        description: 'Common issues and solutions',
        keyPoints: [
          'Low attendance - personal follow-up',
          'Difficult members - love and patience',
          'Spiritual attacks - prayer and fasting',
          'Leadership burnout - delegation and rest'
        ]
      }
    ]
  },
  {
    id: 'multiplication',
    title: 'Cell Multiplication',
    description: 'Growing and multiplying your cell',
    icon: Users,
    color: '#10b981',
    duration: '2 hours',
    lessons: [
      {
        id: 'm1',
        title: 'Growing Your Cell',
        description: 'Strategies for consistent growth',
        keyPoints: [
          'Every member wins one soul monthly',
          'Follow up all first-time visitors',
          'Create a welcoming atmosphere',
          'Pray for breakthrough'
        ]
      },
      {
        id: 'm2',
        title: 'Raising Leaders',
        description: 'Identifying and developing potential leaders',
        keyPoints: [
          'Look for FAT people: Faithful, Available, Teachable',
          'Delegate responsibilities gradually',
          'Mentor through example',
          'Send to leadership training'
        ]
      },
      {
        id: 'm3',
        title: 'The Multiplication Process',
        description: 'When and how to multiply',
        keyPoints: [
          'Multiply when you have 15+ members',
          'Have a trained leader ready',
          'Plan the split prayerfully',
          'Support both groups after division'
        ]
      }
    ]
  },
  {
    id: 'digital_ministry',
    title: 'Online Cell Ministry',
    description: 'Leveraging technology for cell growth',
    icon: Video,
    color: '#ec4899',
    duration: '2 hours',
    lessons: [
      {
        id: 'd1',
        title: 'Virtual Cell Meetings',
        description: 'Running effective online meetings',
        keyPoints: [
          'Use reliable video platforms (Zoom, Google Meet)',
          'Keep sessions interactive',
          'Use breakout rooms for small groups',
          'Record for members who miss'
        ]
      },
      {
        id: 'd2',
        title: 'Digital Outreach',
        description: 'Soul winning through social media',
        keyPoints: [
          'Share testimonies and encouraging content',
          'Engage in Christian groups and forums',
          'Use KingsChat for ministry',
          'Follow up contacts digitally'
        ]
      },
      {
        id: 'd3',
        title: 'Cell Management Tools',
        description: 'Using CYBEV for cell administration',
        keyPoints: [
          'Track attendance and reports',
          'Manage member information',
          'Schedule meetings and reminders',
          'Communicate with cell members'
        ]
      }
    ]
  }
];

export default function CellTrainingPage() {
  const router = useRouter();
  const { orgId } = router.query;

  const [selectedModule, setSelectedModule] = useState(null);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [progress, setProgress] = useState({});

  // Load progress from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('cellTrainingProgress');
    if (saved) setProgress(JSON.parse(saved));
  }, []);

  const markComplete = (moduleId, lessonId) => {
    const key = `${moduleId}-${lessonId}`;
    const newProgress = { ...progress, [key]: true };
    setProgress(newProgress);
    localStorage.setItem('cellTrainingProgress', JSON.stringify(newProgress));
  };

  const getModuleProgress = (moduleId) => {
    const module = TRAINING_MODULES.find(m => m.id === moduleId);
    if (!module) return 0;
    const completed = module.lessons.filter(l => progress[`${moduleId}-${l.id}`]).length;
    return Math.round((completed / module.lessons.length) * 100);
  };

  const totalProgress = () => {
    const totalLessons = TRAINING_MODULES.reduce((sum, m) => sum + m.lessons.length, 0);
    const completedLessons = Object.keys(progress).filter(k => progress[k]).length;
    return Math.round((completedLessons / totalLessons) * 100);
  };

  return (
    <AppLayout>
      <Head>
        <title>Cell Leader Training | CYBEV Church</title>
      </Head>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link
            href={`/church/cells/dashboard?orgId=${orgId}`}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Cell Leader Training</h1>
            <p className="text-gray-500">Comprehensive curriculum for cell leadership development</p>
          </div>
        </div>

        {/* Overall Progress */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl p-6 text-white mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold">Your Progress</h2>
              <p className="text-white/80">Complete all modules to become a certified cell leader</p>
            </div>
            <div className="text-right">
              <p className="text-4xl font-bold">{totalProgress()}%</p>
              <p className="text-white/80">Complete</p>
            </div>
          </div>
          <div className="h-3 bg-white/30 rounded-full overflow-hidden">
            <div
              className="h-full bg-white rounded-full transition-all"
              style={{ width: `${totalProgress()}%` }}
            />
          </div>
        </div>

        {!selectedModule ? (
          /* Module List */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {TRAINING_MODULES.map((module, index) => {
              const moduleProgress = getModuleProgress(module.id);
              const isComplete = moduleProgress === 100;

              return (
                <button
                  key={module.id}
                  onClick={() => setSelectedModule(module)}
                  className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 text-left hover:shadow-lg transition group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className="w-14 h-14 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: `${module.color}15` }}
                    >
                      <module.icon className="w-7 h-7" style={{ color: module.color }} />
                    </div>
                    {isComplete && (
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      </div>
                    )}
                  </div>

                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                    Module {index + 1}: {module.title}
                  </h3>
                  <p className="text-sm text-gray-500 mb-4">{module.description}</p>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500 flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {module.duration}
                    </span>
                    <span className="text-gray-500">
                      {module.lessons.length} lessons
                    </span>
                  </div>

                  <div className="mt-4">
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span>Progress</span>
                      <span>{moduleProgress}%</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{ width: `${moduleProgress}%`, backgroundColor: module.color }}
                      />
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
                    <span className="text-sm font-medium" style={{ color: module.color }}>
                      {moduleProgress === 0 ? 'Start Learning' : moduleProgress === 100 ? 'Review' : 'Continue'}
                    </span>
                    <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
                  </div>
                </button>
              );
            })}
          </div>
        ) : !selectedLesson ? (
          /* Lesson List */
          <div>
            <button
              onClick={() => setSelectedModule(null)}
              className="flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Modules
            </button>

            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div
                className="p-6"
                style={{ background: `linear-gradient(135deg, ${selectedModule.color}, ${selectedModule.color}88)` }}
              >
                <div className="flex items-center gap-4 text-white">
                  <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center">
                    <selectedModule.icon className="w-8 h-8" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">{selectedModule.title}</h2>
                    <p className="text-white/80">{selectedModule.description}</p>
                  </div>
                </div>
              </div>

              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {selectedModule.lessons.map((lesson, index) => {
                  const isComplete = progress[`${selectedModule.id}-${lesson.id}`];

                  return (
                    <button
                      key={lesson.id}
                      onClick={() => setSelectedLesson(lesson)}
                      className="w-full p-5 flex items-center gap-4 hover:bg-gray-50 dark:hover:bg-gray-700 text-left transition"
                    >
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                          isComplete ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {isComplete ? <CheckCircle className="w-5 h-5" /> : index + 1}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 dark:text-white">{lesson.title}</h4>
                        <p className="text-sm text-gray-500">{lesson.description}</p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          /* Lesson Content */
          <div>
            <button
              onClick={() => setSelectedLesson(null)}
              className="flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to {selectedModule.title}
            </button>

            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div
                className="p-6"
                style={{ backgroundColor: `${selectedModule.color}15` }}
              >
                <p className="text-sm font-medium mb-2" style={{ color: selectedModule.color }}>
                  {selectedModule.title}
                </p>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {selectedLesson.title}
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                  {selectedLesson.description}
                </p>
              </div>

              <div className="p-6 space-y-6">
                {/* Key Points */}
                {selectedLesson.keyPoints && (
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                      <Target className="w-5 h-5" style={{ color: selectedModule.color }} />
                      Key Points
                    </h3>
                    <ul className="space-y-3">
                      {selectedLesson.keyPoints.map((point, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <div
                            className="w-6 h-6 rounded-full flex items-center justify-center text-white text-sm font-medium flex-shrink-0 mt-0.5"
                            style={{ backgroundColor: selectedModule.color }}
                          >
                            {index + 1}
                          </div>
                          <p className="text-gray-700 dark:text-gray-300">{point}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Scripture */}
                {selectedLesson.scripture && (
                  <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
                    <h4 className="font-semibold text-amber-800 dark:text-amber-300 mb-2 flex items-center gap-2">
                      <BookOpen className="w-4 h-4" />
                      Scripture Reference
                    </h4>
                    <p className="text-amber-700 dark:text-amber-400 italic">
                      {selectedLesson.scripture}
                    </p>
                  </div>
                )}

                {/* Mark Complete Button */}
                <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                  {progress[`${selectedModule.id}-${selectedLesson.id}`] ? (
                    <div className="flex items-center gap-2 text-green-600">
                      <CheckCircle className="w-5 h-5" />
                      <span className="font-medium">Completed</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => markComplete(selectedModule.id, selectedLesson.id)}
                      className="flex items-center gap-2 px-6 py-3 text-white rounded-lg font-medium"
                      style={{ backgroundColor: selectedModule.color }}
                    >
                      <CheckCircle className="w-5 h-5" />
                      Mark as Complete
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-between mt-6">
              {selectedModule.lessons.indexOf(selectedLesson) > 0 && (
                <button
                  onClick={() => setSelectedLesson(selectedModule.lessons[selectedModule.lessons.indexOf(selectedLesson) - 1])}
                  className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Previous Lesson
                </button>
              )}
              <div className="flex-1" />
              {selectedModule.lessons.indexOf(selectedLesson) < selectedModule.lessons.length - 1 && (
                <button
                  onClick={() => setSelectedLesson(selectedModule.lessons[selectedModule.lessons.indexOf(selectedLesson) + 1])}
                  className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
                >
                  Next Lesson
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Certificate Section */}
        {totalProgress() === 100 && !selectedModule && (
          <div className="mt-8 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl p-8 text-white text-center">
            <Award className="w-16 h-16 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Congratulations! 🎉</h2>
            <p className="text-white/90 mb-6">
              You have completed all training modules. You are now certified as a Cell Leader!
            </p>
            <button className="px-6 py-3 bg-white text-amber-600 rounded-lg font-semibold hover:bg-amber-50 transition">
              Download Certificate
            </button>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
