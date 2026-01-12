// ============================================
// FILE: /studio/forms/[id]/responses.jsx
// PURPOSE: View form responses with analytics
// ============================================

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import {
  ArrowLeft, Download, Trash2, Eye, Filter, Search, RefreshCw,
  BarChart2, Users, Clock, TrendingUp, ChevronDown, X, FileText,
  Calendar, CheckCircle, Star, MapPin, Mail, Phone
} from 'lucide-react';
import AppLayout from '@/components/Layout/AppLayout';

export default function FormResponsesPage() {
  const router = useRouter();
  const { id } = router.query;

  const [form, setForm] = useState(null);
  const [responses, setResponses] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('responses');
  const [selectedResponse, setSelectedResponse] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  const API = process.env.NEXT_PUBLIC_API_URL || '';

  useEffect(() => {
    if (id) {
      fetchFormData();
    }
  }, [id]);

  const fetchFormData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      // Fetch form details
      const formRes = await fetch(`${API}/api/forms/${id}`, { headers });
      const formData = await formRes.json();
      if (formData.ok) setForm(formData.form);

      // Fetch responses
      const respRes = await fetch(`${API}/api/forms/${id}/responses`, { headers });
      const respData = await respRes.json();
      if (respData.ok) setResponses(respData.responses || []);

      // Fetch analytics
      const analyticsRes = await fetch(`${API}/api/forms/${id}/analytics`, { headers });
      const analyticsData = await analyticsRes.json();
      if (analyticsData.ok) setAnalytics(analyticsData.analytics);
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = () => {
    if (!form || !responses.length) return;

    // Create CSV headers
    const headers = ['Submitted At', 'User', ...form.fields.map(f => f.label)];
    
    // Create CSV rows
    const rows = responses.map(response => {
      const row = [
        new Date(response.submittedAt).toLocaleString(),
        response.user?.username || response.user?.email || 'Anonymous'
      ];
      
      form.fields.forEach(field => {
        const answer = response.answers?.find(a => a.fieldId === field.id);
        let value = answer?.value || '';
        if (Array.isArray(value)) value = value.join(', ');
        // Escape commas and quotes
        if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
          value = `"${value.replace(/"/g, '""')}"`;
        }
        row.push(value);
      });
      
      return row;
    });

    // Create CSV content
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    // Download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${form.title.replace(/[^a-z0-9]/gi, '_')}_responses.csv`;
    link.click();
  };

  const getAnswerValue = (response, fieldId) => {
    const answer = response.answers?.find(a => a.fieldId === fieldId);
    if (!answer) return '-';
    const value = answer.value;
    if (Array.isArray(value)) return value.join(', ');
    if (typeof value === 'boolean') return value ? 'Yes' : 'No';
    return value || '-';
  };

  const filteredResponses = responses
    .filter(r => {
      if (!searchQuery) return true;
      const searchLower = searchQuery.toLowerCase();
      // Search in answers
      return r.answers?.some(a => 
        String(a.value).toLowerCase().includes(searchLower)
      ) || r.user?.username?.toLowerCase().includes(searchLower)
        || r.user?.email?.toLowerCase().includes(searchLower);
    })
    .sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.submittedAt) - new Date(a.submittedAt);
      if (sortBy === 'oldest') return new Date(a.submittedAt) - new Date(b.submittedAt);
      return 0;
    });

  if (loading) {
    return (
      <AppLayout>
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="grid grid-cols-4 gap-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-24 bg-gray-200 rounded-xl"></div>
              ))}
            </div>
            <div className="h-96 bg-gray-200 rounded-xl"></div>
          </div>
        </div>
      </AppLayout>
    );
  }

  if (!form) {
    return (
      <AppLayout>
        <div className="max-w-7xl mx-auto px-4 py-8 text-center">
          <FileText className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Form not found</h2>
          <Link href="/studio/forms" className="text-purple-600 hover:underline">
            Back to Forms
          </Link>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <Head>
        <title>Responses - {form.title} | CYBEV</title>
      </Head>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <Link
              href="/studio/forms"
              className="p-2 hover:bg-gray-100 dark:hover:bg-white rounded-lg transition"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-900">{form.title}</h1>
              <p className="text-gray-500">{responses.length} responses</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={fetchFormData}
              className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition"
              title="Refresh"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
            <button
              onClick={exportToCSV}
              disabled={responses.length === 0}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-gray-900 rounded-lg hover:bg-purple-700 transition disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </button>
          </div>
        </div>

        {/* Analytics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <AnalyticsCard
            icon={Users}
            label="Total Responses"
            value={analytics?.totalResponses || 0}
            color="purple"
          />
          <AnalyticsCard
            icon={Eye}
            label="Views"
            value={analytics?.views || 0}
            color="blue"
          />
          <AnalyticsCard
            icon={TrendingUp}
            label="Conversion Rate"
            value={`${Math.round((analytics?.conversionRate || 0) * 100)}%`}
            color="green"
          />
          <AnalyticsCard
            icon={Clock}
            label="Avg. Time"
            value={formatDuration(analytics?.avgCompletionTime || 0)}
            color="orange"
          />
        </div>

        {/* Tabs */}
        <div className="flex gap-1 border-b border-gray-200 dark:border-gray-200 mb-6">
          <button
            onClick={() => setActiveTab('responses')}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition ${
              activeTab === 'responses'
                ? 'border-purple-600 text-purple-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Responses
          </button>
          <button
            onClick={() => setActiveTab('summary')}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition ${
              activeTab === 'summary'
                ? 'border-purple-600 text-purple-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Summary
          </button>
        </div>

        {activeTab === 'responses' && (
          <>
            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search responses..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 dark:border-gray-200 rounded-lg bg-white dark:bg-white"
                />
              </div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2.5 border border-gray-200 dark:border-gray-200 rounded-lg bg-white dark:bg-white"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
              </select>
            </div>

            {/* Responses Table */}
            {filteredResponses.length === 0 ? (
              <div className="text-center py-16 bg-white dark:bg-white rounded-xl border border-gray-200 dark:border-gray-200">
                <FileText className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-900 mb-2">
                  No responses yet
                </h3>
                <p className="text-gray-500">
                  Share your form to start collecting responses
                </p>
              </div>
            ) : (
              <div className="bg-white dark:bg-white rounded-xl border border-gray-200 dark:border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          #
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Submitted
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          User
                        </th>
                        {form.fields?.slice(0, 3).map(field => (
                          <th
                            key={field.id}
                            className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider max-w-[200px]"
                          >
                            {field.label}
                          </th>
                        ))}
                        <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-200">
                      {filteredResponses.map((response, index) => (
                        <tr key={response._id} className="hover:bg-gray-50 dark:hover:bg-gray-100">
                          <td className="px-4 py-3 text-sm text-gray-500">
                            {filteredResponses.length - index}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-900 whitespace-nowrap">
                            {new Date(response.submittedAt).toLocaleDateString()}
                            <span className="text-gray-500 ml-1">
                              {new Date(response.submittedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm">
                            {response.user ? (
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-medium">
                                  {(response.user.username || response.user.email)?.[0]?.toUpperCase()}
                                </div>
                                <span className="text-gray-900 dark:text-gray-900">
                                  {response.user.username || response.user.email}
                                </span>
                              </div>
                            ) : (
                              <span className="text-gray-500">Anonymous</span>
                            )}
                          </td>
                          {form.fields?.slice(0, 3).map(field => (
                            <td
                              key={field.id}
                              className="px-4 py-3 text-sm text-gray-700 dark:text-gray-600 max-w-[200px] truncate"
                            >
                              {renderAnswerPreview(field, getAnswerValue(response, field.id))}
                            </td>
                          ))}
                          <td className="px-4 py-3 text-right">
                            <button
                              onClick={() => setSelectedResponse(response)}
                              className="p-2 text-gray-500 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}

        {activeTab === 'summary' && (
          <div className="space-y-6">
            {form.fields?.map(field => (
              <FieldSummary
                key={field.id}
                field={field}
                responses={responses}
                primaryColor={form.branding?.primaryColor || '#7c3aed'}
              />
            ))}
          </div>
        )}
      </div>

      {/* Response Detail Modal */}
      {selectedResponse && (
        <div className="fixed inset-0 bg-gray-900/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
            <div className="sticky top-0 bg-white dark:bg-white border-b border-gray-200 dark:border-gray-200 px-6 py-4 flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-900">Response Details</h3>
                <p className="text-sm text-gray-500">
                  {new Date(selectedResponse.submittedAt).toLocaleString()}
                </p>
              </div>
              <button
                onClick={() => setSelectedResponse(null)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
              {/* User Info */}
              {selectedResponse.user && (
                <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">Respondent</p>
                  <p className="font-medium text-gray-900 dark:text-gray-900">
                    {selectedResponse.user.username || selectedResponse.user.email}
                  </p>
                </div>
              )}

              {/* Answers */}
              <div className="space-y-6">
                {form.fields?.map(field => {
                  const answer = selectedResponse.answers?.find(a => a.fieldId === field.id);
                  return (
                    <div key={field.id}>
                      <p className="text-sm font-medium text-gray-500 mb-1">{field.label}</p>
                      <div className="text-gray-900 dark:text-gray-900">
                        {renderFullAnswer(field, answer?.value)}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Metadata */}
              {(selectedResponse.metadata?.device || selectedResponse.metadata?.browser) && (
                <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-200">
                  <p className="text-sm font-medium text-gray-500 mb-2">Submission Details</p>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    {selectedResponse.metadata?.device && (
                      <div>
                        <span className="text-gray-500">Device:</span>{' '}
                        <span className="text-gray-700 dark:text-gray-600">{selectedResponse.metadata.device}</span>
                      </div>
                    )}
                    {selectedResponse.metadata?.browser && (
                      <div>
                        <span className="text-gray-500">Browser:</span>{' '}
                        <span className="text-gray-700 dark:text-gray-600">{selectedResponse.metadata.browser}</span>
                      </div>
                    )}
                    {selectedResponse.completionTime && (
                      <div>
                        <span className="text-gray-500">Time to complete:</span>{' '}
                        <span className="text-gray-700 dark:text-gray-600">
                          {formatDuration(selectedResponse.completionTime)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}

// Analytics Card Component
function AnalyticsCard({ icon: Icon, label, value, color }) {
  const colors = {
    purple: 'bg-purple-50 text-purple-600',
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    orange: 'bg-orange-50 text-orange-600'
  };

  return (
    <div className="bg-white dark:bg-white rounded-xl p-5 border border-gray-200 dark:border-gray-200">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${colors[color]}`}>
        <Icon className="w-5 h-5" />
      </div>
      <p className="text-2xl font-bold text-gray-900 dark:text-gray-900">{value}</p>
      <p className="text-sm text-gray-500">{label}</p>
    </div>
  );
}

// Field Summary Component
function FieldSummary({ field, responses, primaryColor }) {
  const answers = responses
    .map(r => r.answers?.find(a => a.fieldId === field.id)?.value)
    .filter(v => v !== undefined && v !== null && v !== '');

  if (['select', 'radio', 'checkbox', 'multiselect'].includes(field.type)) {
    // Count options
    const counts = {};
    field.options?.forEach(opt => counts[opt] = 0);
    
    answers.forEach(value => {
      if (Array.isArray(value)) {
        value.forEach(v => counts[v] = (counts[v] || 0) + 1);
      } else {
        counts[value] = (counts[value] || 0) + 1;
      }
    });

    const maxCount = Math.max(...Object.values(counts), 1);

    return (
      <div className="bg-white dark:bg-white rounded-xl p-6 border border-gray-200 dark:border-gray-200">
        <h4 className="font-medium text-gray-900 dark:text-gray-900 mb-4">{field.label}</h4>
        <p className="text-sm text-gray-500 mb-4">{answers.length} responses</p>
        <div className="space-y-3">
          {Object.entries(counts).map(([option, count]) => (
            <div key={option}>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-700 dark:text-gray-600">{option}</span>
                <span className="text-gray-500">{count} ({Math.round(count / (answers.length || 1) * 100)}%)</span>
              </div>
              <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${(count / maxCount) * 100}%`,
                    backgroundColor: primaryColor
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (field.type === 'rating') {
    const avg = answers.length > 0
      ? (answers.reduce((sum, v) => sum + Number(v), 0) / answers.length).toFixed(1)
      : 0;
    
    const distribution = [5, 4, 3, 2, 1].map(star => ({
      star,
      count: answers.filter(v => Number(v) === star).length
    }));

    return (
      <div className="bg-white dark:bg-white rounded-xl p-6 border border-gray-200 dark:border-gray-200">
        <h4 className="font-medium text-gray-900 dark:text-gray-900 mb-4">{field.label}</h4>
        <div className="flex items-center gap-4 mb-4">
          <div className="text-4xl font-bold" style={{ color: primaryColor }}>{avg}</div>
          <div className="flex">
            {[1, 2, 3, 4, 5].map(star => (
              <Star
                key={star}
                className={`w-6 h-6 ${star <= Math.round(avg) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-600'}`}
              />
            ))}
          </div>
          <span className="text-gray-500 text-sm">{answers.length} responses</span>
        </div>
        <div className="space-y-2">
          {distribution.map(({ star, count }) => (
            <div key={star} className="flex items-center gap-2">
              <span className="text-sm text-gray-500 w-4">{star}</span>
              <Star className="w-4 h-4 text-yellow-400" />
              <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-yellow-400 rounded-full"
                  style={{ width: `${(count / (answers.length || 1)) * 100}%` }}
                />
              </div>
              <span className="text-sm text-gray-500 w-8">{count}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (field.type === 'scale') {
    const avg = answers.length > 0
      ? (answers.reduce((sum, v) => sum + Number(v), 0) / answers.length).toFixed(1)
      : 0;

    return (
      <div className="bg-white dark:bg-white rounded-xl p-6 border border-gray-200 dark:border-gray-200">
        <h4 className="font-medium text-gray-900 dark:text-gray-900 mb-4">{field.label}</h4>
        <div className="flex items-center gap-4">
          <div className="text-4xl font-bold" style={{ color: primaryColor }}>{avg}</div>
          <div>
            <p className="text-gray-700 dark:text-gray-600">Average score</p>
            <p className="text-sm text-gray-500">{answers.length} responses</p>
          </div>
        </div>
      </div>
    );
  }

  // Text-based fields
  return (
    <div className="bg-white dark:bg-white rounded-xl p-6 border border-gray-200 dark:border-gray-200">
      <h4 className="font-medium text-gray-900 dark:text-gray-900 mb-4">{field.label}</h4>
      <p className="text-sm text-gray-500 mb-4">{answers.length} responses</p>
      <div className="space-y-2 max-h-60 overflow-y-auto">
        {answers.slice(0, 10).map((answer, i) => (
          <div key={i} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg text-sm text-gray-700 dark:text-gray-600">
            {String(answer)}
          </div>
        ))}
        {answers.length > 10 && (
          <p className="text-sm text-gray-500 text-center py-2">
            +{answers.length - 10} more responses
          </p>
        )}
      </div>
    </div>
  );
}

// Helper Functions
function formatDuration(seconds) {
  if (!seconds) return '-';
  if (seconds < 60) return `${Math.round(seconds)}s`;
  if (seconds < 3600) return `${Math.round(seconds / 60)}m`;
  return `${Math.round(seconds / 3600)}h`;
}

function renderAnswerPreview(field, value) {
  if (value === '-' || !value) return <span className="text-gray-500">-</span>;
  
  if (field.type === 'rating') {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map(star => (
          <Star
            key={star}
            className={`w-4 h-4 ${star <= value ? 'fill-yellow-400 text-yellow-400' : 'text-gray-700'}`}
          />
        ))}
      </div>
    );
  }
  
  return value;
}

function renderFullAnswer(field, value) {
  if (value === undefined || value === null || value === '') {
    return <span className="text-gray-500">No answer</span>;
  }

  if (Array.isArray(value)) {
    return (
      <div className="flex flex-wrap gap-2">
        {value.map((v, i) => (
          <span key={i} className="px-2 py-1 bg-purple-50 text-purple-700 rounded text-sm">
            {v}
          </span>
        ))}
      </div>
    );
  }

  if (field.type === 'rating') {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map(star => (
          <Star
            key={star}
            className={`w-6 h-6 ${star <= value ? 'fill-yellow-400 text-yellow-400' : 'text-gray-700'}`}
          />
        ))}
        <span className="ml-2 text-gray-500">({value}/5)</span>
      </div>
    );
  }

  if (field.type === 'scale') {
    return (
      <div className="flex items-center gap-2">
        <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-purple-600 rounded-full"
            style={{ width: `${(value / 10) * 100}%` }}
          />
        </div>
        <span className="font-medium">{value}/10</span>
      </div>
    );
  }

  if (field.type === 'email') {
    return (
      <a href={`mailto:${value}`} className="text-purple-600 hover:underline flex items-center gap-1">
        <Mail className="w-4 h-4" />
        {value}
      </a>
    );
  }

  if (field.type === 'phone') {
    return (
      <a href={`tel:${value}`} className="text-purple-600 hover:underline flex items-center gap-1">
        <Phone className="w-4 h-4" />
        {value}
      </a>
    );
  }

  if (field.type === 'url') {
    return (
      <a href={value} target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:underline">
        {value}
      </a>
    );
  }

  return <span className="whitespace-pre-wrap">{value}</span>;
}
