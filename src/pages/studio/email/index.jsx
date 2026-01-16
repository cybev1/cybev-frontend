// ============================================
// FILE: src/pages/studio/email/index.jsx
// CYBEV Email Client - Gmail-like Interface
// VERSION: 1.0.0 - Full Inbox Support
// ============================================

import { useState, useEffect, useCallback } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import AppLayout from '@/components/Layout/AppLayout';
import {
  Mail, Send, FileEdit, Trash2, Archive, AlertCircle, Star, 
  Inbox, Search, RefreshCw, ChevronDown, MoreHorizontal,
  Paperclip, Reply, Forward, ArrowLeft, Plus, Tag, 
  CheckSquare, Square, Loader2, X, Settings, Users,
  Globe, Clock, CheckCircle, AlertTriangle
} from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.cybev.io';

// Folders configuration
const FOLDERS = [
  { id: 'inbox', label: 'Inbox', icon: Inbox },
  { id: 'sent', label: 'Sent', icon: Send },
  { id: 'drafts', label: 'Drafts', icon: FileEdit },
  { id: 'starred', label: 'Starred', icon: Star },
  { id: 'archive', label: 'Archive', icon: Archive },
  { id: 'spam', label: 'Spam', icon: AlertCircle },
  { id: 'trash', label: 'Trash', icon: Trash2 },
];

export default function EmailClient() {
  const router = useRouter();
  const { folder: queryFolder } = router.query;
  
  const [currentFolder, setCurrentFolder] = useState('inbox');
  const [messages, setMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [counts, setCounts] = useState({});
  const [selectedIds, setSelectedIds] = useState([]);
  const [showCompose, setShowCompose] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [emailAddresses, setEmailAddresses] = useState([]);
  const [labels, setLabels] = useState([]);
  
  // Compose state
  const [compose, setCompose] = useState({
    to: '',
    cc: '',
    bcc: '',
    subject: '',
    body: '',
    from: '',
    replyTo: null
  });
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (queryFolder) setCurrentFolder(queryFolder);
  }, [queryFolder]);

  useEffect(() => {
    fetchEmailAddresses();
    fetchLabels();
    fetchCounts();
  }, []);

  useEffect(() => {
    fetchMessages();
    setSelectedMessage(null);
    setSelectedIds([]);
  }, [currentFolder, searchQuery]);

  const getAuth = () => {
    const token = localStorage.getItem('token') || localStorage.getItem('cybev_token');
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  const fetchEmailAddresses = async () => {
    try {
      const res = await fetch(`${API_URL}/api/email/addresses`, getAuth());
      const data = await res.json();
      if (data.addresses) {
        setEmailAddresses(data.addresses);
        if (data.addresses.length > 0) {
          setCompose(prev => ({ ...prev, from: data.addresses[0]._id }));
        }
      }
    } catch (err) {
      console.error('Fetch addresses error:', err);
    }
  };

  const fetchLabels = async () => {
    try {
      const res = await fetch(`${API_URL}/api/email/labels`, getAuth());
      const data = await res.json();
      if (data.labels) setLabels(data.labels);
    } catch (err) {
      console.error('Fetch labels error:', err);
    }
  };

  const fetchCounts = async () => {
    try {
      const res = await fetch(`${API_URL}/api/email/counts`, getAuth());
      const data = await res.json();
      if (data.counts) setCounts(data.counts);
    } catch (err) {
      console.error('Fetch counts error:', err);
    }
  };

  const fetchMessages = async () => {
    setLoading(true);
    try {
      let url = `${API_URL}/api/email/messages?folder=${currentFolder}&limit=50`;
      if (searchQuery) url += `&search=${encodeURIComponent(searchQuery)}`;
      if (currentFolder === 'starred') url = `${API_URL}/api/email/messages?isStarred=true&limit=50`;
      
      const res = await fetch(url, getAuth());
      const data = await res.json();
      if (data.messages) setMessages(data.messages);
    } catch (err) {
      console.error('Fetch messages error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessage = async (id) => {
    try {
      const res = await fetch(`${API_URL}/api/email/messages/${id}`, getAuth());
      const data = await res.json();
      if (data.message) setSelectedMessage(data.message);
      fetchCounts(); // Refresh unread count
    } catch (err) {
      console.error('Fetch message error:', err);
    }
  };

  const handleSend = async () => {
    if (!compose.to || !compose.body) {
      alert('Please enter recipient and message');
      return;
    }
    
    setSending(true);
    try {
      const res = await fetch(`${API_URL}/api/email/messages/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuth().headers },
        body: JSON.stringify({
          from: compose.from,
          to: compose.to.split(',').map(e => e.trim()),
          cc: compose.cc ? compose.cc.split(',').map(e => e.trim()) : [],
          subject: compose.subject,
          bodyHtml: `<div style="font-family: Arial, sans-serif;">${compose.body.replace(/\n/g, '<br>')}</div>`,
          bodyText: compose.body,
          inReplyTo: compose.replyTo
        })
      });
      
      const data = await res.json();
      if (data.ok) {
        setShowCompose(false);
        setCompose({ to: '', cc: '', bcc: '', subject: '', body: '', from: emailAddresses[0]?._id || '', replyTo: null });
        fetchMessages();
        fetchCounts();
      } else {
        alert(data.error || 'Failed to send');
      }
    } catch (err) {
      alert('Failed to send email');
    } finally {
      setSending(false);
    }
  };

  const handleBulkAction = async (action, value) => {
    if (selectedIds.length === 0) return;
    
    try {
      await fetch(`${API_URL}/api/email/messages/bulk`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuth().headers },
        body: JSON.stringify({ ids: selectedIds, action, value })
      });
      
      fetchMessages();
      fetchCounts();
      setSelectedIds([]);
    } catch (err) {
      console.error('Bulk action error:', err);
    }
  };

  const toggleStar = async (id, currentStarred) => {
    try {
      await fetch(`${API_URL}/api/email/messages/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...getAuth().headers },
        body: JSON.stringify({ isStarred: !currentStarred })
      });
      
      setMessages(messages.map(m => 
        m._id === id ? { ...m, isStarred: !currentStarred } : m
      ));
    } catch (err) {
      console.error('Toggle star error:', err);
    }
  };

  const handleReply = (message) => {
    setCompose({
      to: message.from.email,
      cc: '',
      bcc: '',
      subject: message.subject.startsWith('Re:') ? message.subject : `Re: ${message.subject}`,
      body: `\n\n---\nOn ${new Date(message.createdAt).toLocaleString()}, ${message.from.name || message.from.email} wrote:\n> ${message.snippet}`,
      from: emailAddresses[0]?._id || '',
      replyTo: message.messageId
    });
    setShowCompose(true);
  };

  const toggleSelect = (id) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const selectAll = () => {
    if (selectedIds.length === messages.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(messages.map(m => m._id));
    }
  };

  const formatDate = (date) => {
    const d = new Date(date);
    const now = new Date();
    const diff = now - d;
    
    if (diff < 86400000 && d.getDate() === now.getDate()) {
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diff < 604800000) {
      return d.toLocaleDateString([], { weekday: 'short' });
    } else if (d.getFullYear() === now.getFullYear()) {
      return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
    return d.toLocaleDateString([], { month: 'short', day: 'numeric', year: '2-digit' });
  };

  return (
    <AppLayout>
      <Head>
        <title>Email - CYBEV Studio</title>
      </Head>

      <div className="h-[calc(100vh-64px)] flex bg-gray-50">
        {/* Sidebar */}
        <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
          {/* Compose Button */}
          <div className="p-4">
            <button
              onClick={() => setShowCompose(true)}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-medium hover:opacity-90 shadow-lg"
            >
              <Plus className="w-5 h-5" />
              Compose
            </button>
          </div>

          {/* Email Address */}
          {emailAddresses.length > 0 && (
            <div className="px-4 pb-4">
              <div className="text-xs text-gray-500 mb-1">Sending as</div>
              <div className="text-sm font-medium text-purple-600 truncate">
                {emailAddresses.find(e => e.isPrimary)?.email || emailAddresses[0]?.email}
              </div>
            </div>
          )}

          {/* Folders */}
          <nav className="flex-1 overflow-y-auto px-2">
            {FOLDERS.map(folder => {
              const Icon = folder.icon;
              const count = counts[folder.id] || 0;
              const isActive = currentFolder === folder.id;
              
              return (
                <button
                  key={folder.id}
                  onClick={() => {
                    setCurrentFolder(folder.id);
                    router.push(`/studio/email?folder=${folder.id}`, undefined, { shallow: true });
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg mb-1 transition ${
                    isActive 
                      ? 'bg-purple-50 text-purple-700 font-medium' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="flex-1 text-left">{folder.label}</span>
                  {count > 0 && folder.id === 'inbox' && (
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      isActive ? 'bg-purple-200 text-purple-800' : 'bg-gray-200 text-gray-600'
                    }`}>
                      {count > 99 ? '99+' : count}
                    </span>
                  )}
                </button>
              );
            })}

            {/* Labels */}
            {labels.length > 0 && (
              <>
                <div className="text-xs font-medium text-gray-400 uppercase mt-4 mb-2 px-3">Labels</div>
                {labels.map(label => (
                  <button
                    key={label._id}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100"
                  >
                    <Tag className="w-4 h-4" style={{ color: label.color }} />
                    <span>{label.name}</span>
                  </button>
                ))}
              </>
            )}
          </nav>

          {/* Bottom Links */}
          <div className="p-4 border-t border-gray-200">
            <Link href="/studio/email/domains" className="flex items-center gap-2 text-sm text-gray-600 hover:text-purple-600">
              <Globe className="w-4 h-4" />
              Manage Domains
            </Link>
            <Link href="/studio/campaigns" className="flex items-center gap-2 text-sm text-gray-600 hover:text-purple-600 mt-2">
              <Users className="w-4 h-4" />
              Campaigns
            </Link>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Toolbar */}
          <div className="bg-white border-b border-gray-200 px-4 py-2 flex items-center gap-2">
            {selectedMessage ? (
              <button
                onClick={() => setSelectedMessage(null)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            ) : (
              <>
                <button
                  onClick={selectAll}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  {selectedIds.length === messages.length && messages.length > 0 
                    ? <CheckSquare className="w-5 h-5 text-purple-600" />
                    : <Square className="w-5 h-5" />
                  }
                </button>
                
                <button
                  onClick={fetchMessages}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                </button>

                {selectedIds.length > 0 && (
                  <>
                    <div className="h-6 w-px bg-gray-200 mx-2" />
                    <button
                      onClick={() => handleBulkAction('trash')}
                      className="p-2 hover:bg-gray-100 rounded-lg text-gray-600 hover:text-red-600"
                      title="Delete"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleBulkAction('read')}
                      className="p-2 hover:bg-gray-100 rounded-lg"
                      title="Mark as read"
                    >
                      <Mail className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleBulkAction('move', 'archive')}
                      className="p-2 hover:bg-gray-100 rounded-lg"
                      title="Archive"
                    >
                      <Archive className="w-5 h-5" />
                    </button>
                  </>
                )}
              </>
            )}

            {/* Search */}
            <div className="flex-1 max-w-xl mx-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search emails..."
                  className="w-full pl-10 pr-4 py-2 bg-gray-100 border-0 rounded-lg focus:ring-2 focus:ring-purple-500 focus:bg-white"
                />
              </div>
            </div>

            <Link href="/studio/email/settings" className="p-2 hover:bg-gray-100 rounded-lg">
              <Settings className="w-5 h-5 text-gray-600" />
            </Link>
          </div>

          {/* Messages List / Message View */}
          <div className="flex-1 overflow-hidden">
            {selectedMessage ? (
              // Message Detail View
              <div className="h-full overflow-y-auto bg-white">
                <div className="max-w-4xl mx-auto p-6">
                  {/* Subject */}
                  <h1 className="text-2xl font-bold text-gray-900 mb-4">
                    {selectedMessage.subject}
                  </h1>

                  {/* From/To */}
                  <div className="flex items-start justify-between mb-6 pb-6 border-b border-gray-200">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                        <span className="text-purple-600 font-medium">
                          {(selectedMessage.from.name || selectedMessage.from.email)[0].toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">
                          {selectedMessage.from.name || selectedMessage.from.email}
                        </div>
                        <div className="text-sm text-gray-500">
                          to {selectedMessage.to.map(t => t.name || t.email).join(', ')}
                        </div>
                      </div>
                    </div>
                    <div className="text-sm text-gray-500">
                      {new Date(selectedMessage.createdAt).toLocaleString()}
                    </div>
                  </div>

                  {/* Body */}
                  <div 
                    className="prose max-w-none mb-6"
                    dangerouslySetInnerHTML={{ __html: selectedMessage.bodyHtml || selectedMessage.bodyText }}
                  />

                  {/* Attachments */}
                  {selectedMessage.attachments?.length > 0 && (
                    <div className="border-t border-gray-200 pt-4">
                      <div className="text-sm font-medium text-gray-700 mb-2">
                        Attachments ({selectedMessage.attachments.length})
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {selectedMessage.attachments.map((att, i) => (
                          <a
                            key={i}
                            href={att.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
                          >
                            <Paperclip className="w-4 h-4" />
                            <span className="text-sm">{att.filename}</span>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2 mt-6 pt-6 border-t border-gray-200">
                    <button
                      onClick={() => handleReply(selectedMessage)}
                      className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                    >
                      <Reply className="w-4 h-4" />
                      Reply
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                      <Forward className="w-4 h-4" />
                      Forward
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              // Messages List
              <div className="h-full overflow-y-auto">
                {loading ? (
                  <div className="flex items-center justify-center h-64">
                    <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
                  </div>
                ) : messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                    <Inbox className="w-16 h-16 mb-4 text-gray-300" />
                    <p>No messages in {currentFolder}</p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100">
                    {messages.map(message => (
                      <div
                        key={message._id}
                        className={`flex items-center gap-3 px-4 py-3 hover:bg-gray-50 cursor-pointer transition ${
                          !message.isRead ? 'bg-purple-50/50' : 'bg-white'
                        }`}
                      >
                        <button
                          onClick={(e) => { e.stopPropagation(); toggleSelect(message._id); }}
                          className="flex-shrink-0"
                        >
                          {selectedIds.includes(message._id)
                            ? <CheckSquare className="w-5 h-5 text-purple-600" />
                            : <Square className="w-5 h-5 text-gray-400" />
                          }
                        </button>

                        <button
                          onClick={(e) => { e.stopPropagation(); toggleStar(message._id, message.isStarred); }}
                          className="flex-shrink-0"
                        >
                          <Star className={`w-5 h-5 ${message.isStarred ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'}`} />
                        </button>

                        <div
                          className="flex-1 min-w-0 flex items-center gap-4"
                          onClick={() => fetchMessage(message._id)}
                        >
                          <div className={`w-48 truncate ${!message.isRead ? 'font-semibold' : ''}`}>
                            {message.direction === 'outbound' 
                              ? `To: ${message.to[0]?.email}` 
                              : (message.from.name || message.from.email)
                            }
                          </div>

                          <div className="flex-1 min-w-0 flex items-center gap-2">
                            <span className={`truncate ${!message.isRead ? 'font-semibold text-gray-900' : 'text-gray-600'}`}>
                              {message.subject}
                            </span>
                            <span className="text-gray-400">–</span>
                            <span className="text-gray-500 truncate">
                              {message.snippet}
                            </span>
                          </div>

                          {message.attachments?.length > 0 && (
                            <Paperclip className="w-4 h-4 text-gray-400 flex-shrink-0" />
                          )}

                          <div className="text-sm text-gray-500 flex-shrink-0 w-20 text-right">
                            {formatDate(message.createdAt)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Compose Modal */}
        {showCompose && (
          <div className="fixed bottom-4 right-4 w-[560px] bg-white rounded-t-xl shadow-2xl border border-gray-200 z-50">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-gray-900 text-white rounded-t-xl">
              <span className="font-medium">New Message</span>
              <button onClick={() => setShowCompose(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <div className="p-4">
              {/* From */}
              {emailAddresses.length > 1 && (
                <div className="flex items-center border-b border-gray-200 py-2">
                  <span className="text-sm text-gray-500 w-16">From</span>
                  <select
                    value={compose.from}
                    onChange={(e) => setCompose({ ...compose, from: e.target.value })}
                    className="flex-1 border-0 focus:ring-0 text-sm"
                  >
                    {emailAddresses.map(addr => (
                      <option key={addr._id} value={addr._id}>
                        {addr.displayName ? `${addr.displayName} <${addr.email}>` : addr.email}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* To */}
              <div className="flex items-center border-b border-gray-200 py-2">
                <span className="text-sm text-gray-500 w-16">To</span>
                <input
                  type="text"
                  value={compose.to}
                  onChange={(e) => setCompose({ ...compose, to: e.target.value })}
                  placeholder="Recipients (comma separated)"
                  className="flex-1 border-0 focus:ring-0 text-sm"
                />
              </div>

              {/* Subject */}
              <div className="flex items-center border-b border-gray-200 py-2">
                <span className="text-sm text-gray-500 w-16">Subject</span>
                <input
                  type="text"
                  value={compose.subject}
                  onChange={(e) => setCompose({ ...compose, subject: e.target.value })}
                  placeholder="Subject"
                  className="flex-1 border-0 focus:ring-0 text-sm"
                />
              </div>

              {/* Body */}
              <textarea
                value={compose.body}
                onChange={(e) => setCompose({ ...compose, body: e.target.value })}
                placeholder="Write your message..."
                rows={12}
                className="w-full border-0 focus:ring-0 resize-none text-sm mt-2"
              />

              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <button
                  onClick={handleSend}
                  disabled={sending}
                  className="flex items-center gap-2 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
                >
                  {sending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                  Send
                </button>

                <div className="flex items-center gap-2">
                  <button className="p-2 hover:bg-gray-100 rounded-lg">
                    <Paperclip className="w-5 h-5 text-gray-600" />
                  </button>
                  <button
                    onClick={() => setShowCompose(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <Trash2 className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
