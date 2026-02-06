// ============================================
// FILE: src/pages/studio/campaigns/contacts.jsx
// CYBEV Contacts Management - Professional Grade
// VERSION: 5.0.0 - Complete with All Features
// ============================================

import { useState, useEffect, useRef, useCallback } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import AppLayout from '@/components/Layout/AppLayout';
import {
  Users, Plus, Upload, Download, Search, Filter, Trash2, Edit2,
  ArrowLeft, ArrowRight, Loader2, Check, X, Tag, Mail, Phone, Building,
  MoreHorizontal, ChevronDown, AlertCircle, FileText, CheckCircle,
  UserPlus, RefreshCw, Star, Shield, Sparkles, Zap, AlertTriangle,
  XCircle, Eye, EyeOff, Crown, BarChart3, PieChart, TrendingUp,
  Database, Wand2, Target, Globe, Clock, Copy, ExternalLink, Info,
  Folder, FolderPlus, Settings, List, Grid3X3, ChevronRight, Hash
} from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.cybev.io';

// ==========================================
// HELPER FUNCTIONS
// ==========================================

const getAuth = () => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  return {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    }
  };
};

// ==========================================
// MAIN COMPONENT
// ==========================================

export default function CampaignContacts() {
  const router = useRouter();
  const fileInputRef = useRef(null);
  
  // Core state
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalContacts, setTotalContacts] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  // Search and Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedTag, setSelectedTag] = useState('');
  const [selectedList, setSelectedList] = useState('');
  
  // Lists Management
  const [lists, setLists] = useState([]);
  const [showCreateList, setShowCreateList] = useState(false);
  const [newListName, setNewListName] = useState('');
  const [newListDescription, setNewListDescription] = useState('');
  const [creatingList, setCreatingList] = useState(false);
  const [editingList, setEditingList] = useState(null);
  
  // Tags
  const [tags, setTags] = useState([]);
  
  // Selection and Bulk Operations
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  
  // Modals
  const [showAddContact, setShowAddContact] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showDeleteAllModal, setShowDeleteAllModal] = useState(false);
  const [showBulkTagModal, setShowBulkTagModal] = useState(false);
  const [showAICleanModal, setShowAICleanModal] = useState(false);
  const [showEditContact, setShowEditContact] = useState(null);
  const [showBulkMoveModal, setShowBulkMoveModal] = useState(false);
  
  // Delete All
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [deletingAll, setDeletingAll] = useState(false);
  
  // Bulk Tag
  const [bulkTagName, setBulkTagName] = useState('');
  
  // AI Clean
  const [aiCleaning, setAiCleaning] = useState(false);
  const [aiCleanResult, setAiCleanResult] = useState(null);
  
  // Import
  const [importFile, setImportFile] = useState(null);
  const [importPreview, setImportPreview] = useState(null);
  const [importing, setImporting] = useState(false);
  const [importToList, setImportToList] = useState('');
  const [importAutoTag, setImportAutoTag] = useState('');
  const [importMapping, setImportMapping] = useState({});
  
  // New Contact Form
  const [newContact, setNewContact] = useState({
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    company: '',
    tags: [],
    list: ''
  });
  
  // Stats
  const [stats, setStats] = useState({
    total: 0,
    subscribed: 0,
    unsubscribed: 0,
    bounced: 0,
    recentlyAdded: 0
  });

  // View mode
  const [viewMode, setViewMode] = useState('table');

  // ==========================================
  // DATA FETCHING
  // ==========================================

  const fetchContacts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '50',
        ...(searchQuery && { search: searchQuery }),
        ...(selectedStatus !== 'all' && { status: selectedStatus }),
        ...(selectedTag && { tag: selectedTag }),
        ...(selectedList && { list: selectedList })
      });
      
      const res = await fetch(`${API_URL}/api/campaigns-enhanced/contacts?${params}`, getAuth());
      const data = await res.json();
      
      if (data.contacts) {
        setContacts(data.contacts);
        setTotalContacts(data.total || data.contacts.length);
        setTotalPages(data.totalPages || Math.ceil(data.total / 50));
      }
    } catch (err) {
      console.error('Failed to fetch contacts:', err);
    } finally {
      setLoading(false);
    }
  }, [page, searchQuery, selectedStatus, selectedTag, selectedList]);

  const fetchLists = async () => {
    try {
      const res = await fetch(`${API_URL}/api/campaigns-enhanced/lists`, getAuth());
      const data = await res.json();
      if (data.lists) {
        setLists(data.lists);
      }
    } catch (err) {
      console.error('Failed to fetch lists:', err);
    }
  };

  const fetchTags = async () => {
    try {
      const res = await fetch(`${API_URL}/api/campaigns-enhanced/tags`, getAuth());
      const data = await res.json();
      if (data.tags) {
        setTags(data.tags);
      }
    } catch (err) {
      console.error('Failed to fetch tags:', err);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await fetch(`${API_URL}/api/campaigns-enhanced/stats`, getAuth());
      const data = await res.json();
      if (data.contacts) {
        setStats(data.contacts);
      }
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  useEffect(() => {
    fetchLists();
    fetchTags();
    fetchStats();
  }, []);

  // ==========================================
  // LIST MANAGEMENT
  // ==========================================

  const createList = async () => {
    if (!newListName.trim()) return;
    setCreatingList(true);
    
    try {
      const res = await fetch(`${API_URL}/api/campaigns-enhanced/lists`, {
        method: 'POST',
        ...getAuth(),
        body: JSON.stringify({
          name: newListName.trim(),
          description: newListDescription.trim()
        })
      });
      
      const data = await res.json();
      if (data.list) {
        setLists([...lists, data.list]);
        setNewListName('');
        setNewListDescription('');
        setShowCreateList(false);
      } else {
        alert(data.error || 'Failed to create list');
      }
    } catch (err) {
      alert('Failed to create list');
    } finally {
      setCreatingList(false);
    }
  };

  const updateList = async (listId, updates) => {
    try {
      const res = await fetch(`${API_URL}/api/campaigns-enhanced/lists/${listId}`, {
        method: 'PUT',
        ...getAuth(),
        body: JSON.stringify(updates)
      });
      
      const data = await res.json();
      if (data.list) {
        setLists(lists.map(l => l._id === listId ? data.list : l));
        setEditingList(null);
      }
    } catch (err) {
      alert('Failed to update list');
    }
  };

  const deleteList = async (listId) => {
    if (!confirm('Delete this list? Contacts will not be deleted, only removed from this list.')) return;
    
    try {
      const res = await fetch(`${API_URL}/api/campaigns-enhanced/lists/${listId}`, {
        method: 'DELETE',
        ...getAuth()
      });
      
      const data = await res.json();
      if (data.ok) {
        setLists(lists.filter(l => l._id !== listId));
        if (selectedList === listId) {
          setSelectedList('');
        }
      }
    } catch (err) {
      alert('Failed to delete list');
    }
  };

  // ==========================================
  // CONTACT OPERATIONS
  // ==========================================

  const addContact = async () => {
    if (!newContact.email.trim()) {
      alert('Email is required');
      return;
    }
    
    try {
      const res = await fetch(`${API_URL}/api/campaigns-enhanced/contacts`, {
        method: 'POST',
        ...getAuth(),
        body: JSON.stringify(newContact)
      });
      
      const data = await res.json();
      if (data.contact) {
        setShowAddContact(false);
        setNewContact({
          email: '',
          firstName: '',
          lastName: '',
          phone: '',
          company: '',
          tags: [],
          list: ''
        });
        fetchContacts();
        fetchStats();
        fetchLists();
      } else {
        alert(data.error || 'Failed to add contact');
      }
    } catch (err) {
      alert('Failed to add contact');
    }
  };

  const updateContact = async (contactId, updates) => {
    try {
      const res = await fetch(`${API_URL}/api/campaigns-enhanced/contacts/${contactId}`, {
        method: 'PUT',
        ...getAuth(),
        body: JSON.stringify(updates)
      });
      
      const data = await res.json();
      if (data.contact) {
        setContacts(contacts.map(c => c._id === contactId ? data.contact : c));
        setShowEditContact(null);
      }
    } catch (err) {
      alert('Failed to update contact');
    }
  };

  const deleteContact = async (contactId) => {
    if (!confirm('Delete this contact?')) return;
    
    try {
      const res = await fetch(`${API_URL}/api/campaigns-enhanced/contacts/${contactId}`, {
        method: 'DELETE',
        ...getAuth()
      });
      
      const data = await res.json();
      if (data.ok) {
        setContacts(contacts.filter(c => c._id !== contactId));
        fetchStats();
      }
    } catch (err) {
      alert('Failed to delete contact');
    }
  };

  // ==========================================
  // BULK OPERATIONS
  // ==========================================

  // Delete All Contacts
  const deleteAllContacts = async () => {
    if (deleteConfirmText !== 'DELETE ALL') return;
    setDeletingAll(true);
    
    try {
      const url = selectedList 
        ? `${API_URL}/api/campaigns-enhanced/contacts/delete-all?list=${encodeURIComponent(selectedList)}`
        : `${API_URL}/api/campaigns-enhanced/contacts/delete-all`;
        
      const res = await fetch(url, {
        method: 'DELETE',
        ...getAuth()
      });
      
      const data = await res.json();
      if (data.ok) {
        setShowDeleteAllModal(false);
        setDeleteConfirmText('');
        setContacts([]);
        fetchStats();
        fetchLists();
        alert(`Successfully deleted ${data.deleted} contacts`);
      } else {
        alert(data.error || 'Failed to delete contacts');
      }
    } catch (err) {
      alert('Failed to delete contacts');
    } finally {
      setDeletingAll(false);
    }
  };

  // Bulk delete selected
  const deleteSelectedContacts = async () => {
    if (selectedContacts.length === 0) return;
    if (!confirm(`Delete ${selectedContacts.length} selected contacts?`)) return;
    
    try {
      const res = await fetch(`${API_URL}/api/campaigns-enhanced/contacts/bulk-delete`, {
        method: 'POST',
        ...getAuth(),
        body: JSON.stringify({ contactIds: selectedContacts })
      });
      
      const data = await res.json();
      if (data.ok) {
        setSelectedContacts([]);
        setSelectAll(false);
        fetchContacts();
        fetchStats();
        alert(`Deleted ${data.deleted} contacts`);
      }
    } catch (err) {
      alert('Failed to delete contacts');
    }
  };

  // Bulk add tag
  const bulkAddTag = async () => {
    if (!bulkTagName.trim() || selectedContacts.length === 0) return;
    
    try {
      const res = await fetch(`${API_URL}/api/campaigns-enhanced/contacts/bulk-tag`, {
        method: 'POST',
        ...getAuth(),
        body: JSON.stringify({ contactIds: selectedContacts, tag: bulkTagName })
      });
      
      const data = await res.json();
      if (data.ok) {
        setShowBulkTagModal(false);
        setBulkTagName('');
        setSelectedContacts([]);
        setSelectAll(false);
        fetchContacts();
        fetchTags();
        alert(`Added tag to ${data.updated} contacts`);
      }
    } catch (err) {
      alert('Failed to add tag');
    }
  };

  // Bulk move to list
  const bulkMoveToList = async (listId) => {
    if (selectedContacts.length === 0) return;
    
    try {
      const res = await fetch(`${API_URL}/api/campaigns-enhanced/contacts/bulk-move`, {
        method: 'POST',
        ...getAuth(),
        body: JSON.stringify({ contactIds: selectedContacts, listId })
      });
      
      const data = await res.json();
      if (data.ok) {
        setShowBulkMoveModal(false);
        setSelectedContacts([]);
        setSelectAll(false);
        fetchContacts();
        fetchLists();
        alert(`Moved ${data.updated} contacts`);
      }
    } catch (err) {
      alert('Failed to move contacts');
    }
  };

  // AI Clean List
  const aiCleanList = async () => {
    setAiCleaning(true);
    setAiCleanResult(null);
    
    try {
      const res = await fetch(`${API_URL}/api/campaigns-enhanced/contacts/ai-clean`, {
        method: 'POST',
        ...getAuth(),
        body: JSON.stringify({ list: selectedList || null })
      });
      
      const data = await res.json();
      if (data.ok) {
        setAiCleanResult(data);
        fetchContacts();
        fetchStats();
      } else {
        alert(data.error || 'AI cleaning failed');
      }
    } catch (err) {
      alert('AI cleaning failed');
    } finally {
      setAiCleaning(false);
    }
  };

  // ==========================================
  // IMPORT FUNCTIONALITY
  // ==========================================

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setImportFile(file);
    
    // Parse CSV preview
    const text = await file.text();
    const lines = text.split('\n').filter(l => l.trim());
    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
    
    const previewRows = lines.slice(1, 6).map(line => {
      const values = line.split(',').map(v => v.trim().replace(/"/g, ''));
      const row = {};
      headers.forEach((h, i) => {
        row[h] = values[i] || '';
      });
      return row;
    });
    
    // Auto-detect column mapping
    const mapping = {};
    headers.forEach(h => {
      const lower = h.toLowerCase();
      if (lower.includes('email')) mapping[h] = 'email';
      else if (lower.includes('first') && lower.includes('name')) mapping[h] = 'firstName';
      else if (lower.includes('last') && lower.includes('name')) mapping[h] = 'lastName';
      else if (lower === 'name' || lower === 'full name') mapping[h] = 'firstName';
      else if (lower.includes('phone') || lower.includes('mobile')) mapping[h] = 'phone';
      else if (lower.includes('company') || lower.includes('organization')) mapping[h] = 'company';
    });
    
    setImportMapping(mapping);
    setImportPreview({
      headers,
      rows: previewRows,
      totalRows: lines.length - 1
    });
    setShowImportModal(true);
  };

  const processImport = async () => {
    if (!importFile || !importPreview) return;
    setImporting(true);
    
    try {
      const formData = new FormData();
      formData.append('file', importFile);
      formData.append('mapping', JSON.stringify(importMapping));
      if (importToList) formData.append('list', importToList);
      if (importAutoTag) formData.append('tag', importAutoTag);
      
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/campaigns-enhanced/contacts/import`, {
        method: 'POST',
        headers: {
          'Authorization': token ? `Bearer ${token}` : ''
        },
        body: formData
      });
      
      const data = await res.json();
      if (data.ok) {
        setShowImportModal(false);
        setImportFile(null);
        setImportPreview(null);
        setImportMapping({});
        setImportToList('');
        setImportAutoTag('');
        fetchContacts();
        fetchStats();
        fetchLists();
        alert(`Successfully imported ${data.imported} contacts. ${data.duplicates || 0} duplicates skipped.`);
      } else {
        alert(data.error || 'Import failed');
      }
    } catch (err) {
      alert('Import failed');
    } finally {
      setImporting(false);
    }
  };

  // ==========================================
  // EXPORT
  // ==========================================

  const exportContacts = async () => {
    try {
      const params = new URLSearchParams({
        format: 'csv',
        ...(selectedList && { list: selectedList }),
        ...(selectedTag && { tag: selectedTag }),
        ...(selectedStatus !== 'all' && { status: selectedStatus })
      });
      
      const res = await fetch(`${API_URL}/api/campaigns-enhanced/contacts/export?${params}`, getAuth());
      const blob = await res.blob();
      
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `contacts-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert('Export failed');
    }
  };

  // ==========================================
  // SELECTION HELPERS
  // ==========================================

  const toggleSelectAll = () => {
    if (selectAll) {
      setSelectedContacts([]);
    } else {
      setSelectedContacts(contacts.map(c => c._id));
    }
    setSelectAll(!selectAll);
  };

  const toggleSelectContact = (contactId) => {
    if (selectedContacts.includes(contactId)) {
      setSelectedContacts(selectedContacts.filter(id => id !== contactId));
    } else {
      setSelectedContacts([...selectedContacts, contactId]);
    }
  };

  // ==========================================
  // RENDER HELPERS
  // ==========================================

  const getStatusBadge = (status) => {
    const styles = {
      subscribed: 'bg-green-100 text-green-700',
      unsubscribed: 'bg-gray-100 text-gray-600',
      bounced: 'bg-red-100 text-red-700',
      complained: 'bg-orange-100 text-orange-700'
    };
    return styles[status] || 'bg-gray-100 text-gray-600';
  };

  // ==========================================
  // RENDER
  // ==========================================

  return (
    <AppLayout>
      <Head>
        <title>Contacts | CYBEV Email Marketing</title>
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center gap-4">
                <Link href="/studio/campaigns" className="text-gray-400 hover:text-gray-600">
                  <ArrowLeft className="w-5 h-5" />
                </Link>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Contacts</h1>
                  <p className="text-gray-500 text-sm mt-1">
                    {stats.total.toLocaleString()} total contacts • {stats.subscribed.toLocaleString()} subscribed
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                {/* AI Clean Button */}
                <button
                  onClick={() => setShowAICleanModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-lg hover:from-purple-600 hover:to-indigo-600 transition shadow-sm"
                >
                  <Wand2 className="w-4 h-4" />
                  <span>AI Clean</span>
                </button>
                
                {/* Import Button */}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                >
                  <Upload className="w-4 h-4" />
                  <span>Import</span>
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv,.xlsx,.xls"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                
                {/* Export Button */}
                <button
                  onClick={exportContacts}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                >
                  <Download className="w-4 h-4" />
                  <span>Export</span>
                </button>
                
                {/* Add Contact Button */}
                <button
                  onClick={() => setShowAddContact(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Contact</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Workflow Guidance Banner - Show when contacts exist */}
        {stats.subscribed > 0 && (
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-green-900">Ready to send!</h3>
                    <p className="text-sm text-green-700">
                      You have {stats.subscribed} subscribed contact{stats.subscribed > 1 ? 's' : ''} 
                      {selectedList && lists.find(l => l._id === selectedList) 
                        ? ` in "${lists.find(l => l._id === selectedList)?.name}"` 
                        : ''
                      }. Create a campaign to start sending emails.
                    </p>
                  </div>
                </div>
                <Link
                  href="/studio/campaigns/create"
                  className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition shadow-lg shadow-green-200 font-medium"
                >
                  <Mail className="w-5 h-5" />
                  <span>Create Campaign</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        )}

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex gap-6">
            {/* Left Sidebar - Lists */}
            <div className="w-64 flex-shrink-0">
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="p-4 border-b border-gray-100">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-gray-900">Lists</h3>
                    <button
                      onClick={() => setShowCreateList(true)}
                      className="p-1 hover:bg-gray-100 rounded"
                    >
                      <Plus className="w-4 h-4 text-gray-500" />
                    </button>
                  </div>
                  
                  {showCreateList && (
                    <div className="space-y-2 mb-3 p-3 bg-gray-50 rounded-lg">
                      <input
                        type="text"
                        placeholder="List name"
                        value={newListName}
                        onChange={(e) => setNewListName(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                      <input
                        type="text"
                        placeholder="Description (optional)"
                        value={newListDescription}
                        onChange={(e) => setNewListDescription(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={createList}
                          disabled={creatingList || !newListName.trim()}
                          className="flex-1 py-1.5 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700 disabled:opacity-50"
                        >
                          {creatingList ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : 'Create'}
                        </button>
                        <button
                          onClick={() => {
                            setShowCreateList(false);
                            setNewListName('');
                            setNewListDescription('');
                          }}
                          className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm hover:bg-gray-100"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="divide-y divide-gray-100">
                  {/* All Contacts */}
                  <button
                    onClick={() => setSelectedList('')}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 transition ${
                      selectedList === '' ? 'bg-purple-50 text-purple-700' : ''
                    }`}
                  >
                    <Users className="w-4 h-4 flex-shrink-0" />
                    <span className="flex-1 truncate">All Contacts</span>
                    <span className="text-xs text-gray-400">{stats.total}</span>
                  </button>
                  
                  {/* Dynamic Lists */}
                  {lists.map(list => (
                    <div
                      key={list._id}
                      className={`group flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition ${
                        selectedList === list._id ? 'bg-purple-50 text-purple-700' : ''
                      }`}
                    >
                      <button
                        onClick={() => setSelectedList(list._id)}
                        className="flex-1 flex items-center gap-3 text-left"
                      >
                        <Folder className="w-4 h-4 flex-shrink-0" />
                        <span className="flex-1 truncate">{list.name}</span>
                        <span className="text-xs text-gray-400">{list.contactCount || 0}</span>
                      </button>
                      <div className="hidden group-hover:flex items-center gap-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingList(list);
                          }}
                          className="p-1 hover:bg-gray-200 rounded"
                        >
                          <Edit2 className="w-3 h-3 text-gray-400" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteList(list._id);
                          }}
                          className="p-1 hover:bg-gray-200 rounded"
                        >
                          <Trash2 className="w-3 h-3 text-gray-400" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                
                {lists.length === 0 && (
                  <div className="p-4 text-center text-gray-400 text-sm">
                    No lists yet. Create one to organize your contacts.
                  </div>
                )}
              </div>

              {/* Stats Card */}
              <div className="bg-white rounded-xl border border-gray-200 p-4 mt-4">
                <h3 className="font-semibold text-gray-900 mb-3">Overview</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Subscribed</span>
                    <span className="text-sm font-medium text-green-600">{stats.subscribed?.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Unsubscribed</span>
                    <span className="text-sm font-medium text-gray-600">{stats.unsubscribed?.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Bounced</span>
                    <span className="text-sm font-medium text-red-600">{stats.bounced?.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Quick Actions Card */}
              {stats.subscribed > 0 && (
                <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl border border-purple-200 p-4 mt-4">
                  <h3 className="font-semibold text-purple-900 mb-3 flex items-center gap-2">
                    <Zap className="w-4 h-4" />
                    Quick Actions
                  </h3>
                  <div className="space-y-2">
                    <Link
                      href={`/studio/campaigns/create${selectedList ? `?list=${selectedList}` : ''}`}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-medium"
                    >
                      <Mail className="w-4 h-4" />
                      <span>Send Campaign</span>
                    </Link>
                    {selectedList && lists.find(l => l._id === selectedList)?.contactCount > 0 && (
                      <p className="text-xs text-purple-600 text-center">
                        To {lists.find(l => l._id === selectedList)?.contactCount} contacts in "{lists.find(l => l._id === selectedList)?.name}"
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Danger Zone */}
              <div className="bg-white rounded-xl border border-red-200 p-4 mt-4">
                <h3 className="font-semibold text-red-600 mb-3 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  Danger Zone
                </h3>
                <button
                  onClick={() => setShowDeleteAllModal(true)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition border border-red-200"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete All Contacts</span>
                </button>
                <p className="text-xs text-gray-400 mt-2 text-center">
                  {selectedList ? 'Deletes all contacts in selected list' : 'Deletes ALL contacts'}
                </p>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1">
              {/* Toolbar */}
              <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4">
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  {/* Search */}
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search by name, email, or company..."
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setPage(1);
                      }}
                      className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  
                  {/* Filters */}
                  <div className="flex items-center gap-3">
                    {/* Status Filter */}
                    <select
                      value={selectedStatus}
                      onChange={(e) => {
                        setSelectedStatus(e.target.value);
                        setPage(1);
                      }}
                      className="px-3 py-2 border border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="all">All Status</option>
                      <option value="subscribed">Subscribed</option>
                      <option value="unsubscribed">Unsubscribed</option>
                      <option value="bounced">Bounced</option>
                    </select>
                    
                    {/* Tag Filter */}
                    <select
                      value={selectedTag}
                      onChange={(e) => {
                        setSelectedTag(e.target.value);
                        setPage(1);
                      }}
                      className="px-3 py-2 border border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="">All Tags</option>
                      {tags.map(tag => (
                        <option key={tag} value={tag}>{tag}</option>
                      ))}
                    </select>

                    {/* Refresh */}
                    <button
                      onClick={fetchContacts}
                      className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
                    >
                      <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                    </button>
                  </div>
                </div>
                
                {/* Bulk Actions Bar */}
                {selectedContacts.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-100 flex items-center gap-4">
                    <span className="text-sm text-gray-600">
                      {selectedContacts.length} selected
                    </span>
                    <button
                      onClick={() => setShowBulkTagModal(true)}
                      className="flex items-center gap-2 px-3 py-1.5 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 text-sm"
                    >
                      <Tag className="w-3.5 h-3.5" />
                      Add Tag
                    </button>
                    <button
                      onClick={() => setShowBulkMoveModal(true)}
                      className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 text-sm"
                    >
                      <Folder className="w-3.5 h-3.5" />
                      Move to List
                    </button>
                    <button
                      onClick={deleteSelectedContacts}
                      className="flex items-center gap-2 px-3 py-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 text-sm"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Delete
                    </button>
                    <button
                      onClick={() => {
                        setSelectedContacts([]);
                        setSelectAll(false);
                      }}
                      className="text-sm text-gray-500 hover:text-gray-700"
                    >
                      Clear Selection
                    </button>
                  </div>
                )}
              </div>

              {/* Contacts Table */}
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                {loading ? (
                  <div className="flex items-center justify-center py-20">
                    <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
                  </div>
                ) : contacts.length === 0 ? (
                  <div className="text-center py-20">
                    <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No contacts found</h3>
                    <p className="text-gray-500 mb-4">
                      {searchQuery || selectedTag || selectedList
                        ? 'Try adjusting your filters'
                        : 'Import contacts or add them manually'}
                    </p>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                    >
                      <Upload className="w-4 h-4" />
                      Import Contacts
                    </button>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                          <th className="px-4 py-3 text-left">
                            <input
                              type="checkbox"
                              checked={selectAll}
                              onChange={toggleSelectAll}
                              className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                            />
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Contact
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Tags
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            List
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Added
                          </th>
                          <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {contacts.map(contact => (
                          <tr key={contact._id} className="hover:bg-gray-50">
                            <td className="px-4 py-3">
                              <input
                                type="checkbox"
                                checked={selectedContacts.includes(contact._id)}
                                onChange={() => toggleSelectContact(contact._id)}
                                className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                              />
                            </td>
                            <td className="px-4 py-3">
                              <div>
                                <div className="font-medium text-gray-900">
                                  {contact.firstName || contact.lastName
                                    ? `${contact.firstName || ''} ${contact.lastName || ''}`.trim()
                                    : '-'}
                                </div>
                                <div className="text-sm text-gray-500">{contact.email}</div>
                                {contact.company && (
                                  <div className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                                    <Building className="w-3 h-3" />
                                    {contact.company}
                                  </div>
                                )}
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(contact.status)}`}>
                                {contact.status || 'subscribed'}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex flex-wrap gap-1">
                                {(contact.tags || []).slice(0, 3).map(tag => (
                                  <span
                                    key={tag}
                                    className="inline-flex items-center px-2 py-0.5 rounded bg-purple-100 text-purple-700 text-xs"
                                  >
                                    {tag}
                                  </span>
                                ))}
                                {(contact.tags || []).length > 3 && (
                                  <span className="text-xs text-gray-400">
                                    +{contact.tags.length - 3}
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <span className="text-sm text-gray-500">
                                {contact.listName || '-'}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-500">
                              {contact.createdAt
                                ? new Date(contact.createdAt).toLocaleDateString()
                                : '-'}
                            </td>
                            <td className="px-4 py-3 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  onClick={() => setShowEditContact(contact)}
                                  className="p-1.5 hover:bg-gray-100 rounded-lg transition"
                                >
                                  <Edit2 className="w-4 h-4 text-gray-400" />
                                </button>
                                <button
                                  onClick={() => deleteContact(contact._id)}
                                  className="p-1.5 hover:bg-red-50 rounded-lg transition"
                                >
                                  <Trash2 className="w-4 h-4 text-gray-400 hover:text-red-500" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="px-4 py-3 border-t border-gray-200 flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                      Page {page} of {totalPages} • {totalContacts.toLocaleString()} contacts
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="px-3 py-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Previous
                      </button>
                      <button
                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages}
                        className="px-3 py-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ==================== MODALS ==================== */}

        {/* Add Contact Modal */}
        {showAddContact && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <h3 className="text-lg font-semibold">Add New Contact</h3>
                <button
                  onClick={() => setShowAddContact(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={newContact.email}
                    onChange={(e) => setNewContact({ ...newContact, email: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="john@example.com"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      First Name
                    </label>
                    <input
                      type="text"
                      value={newContact.firstName}
                      onChange={(e) => setNewContact({ ...newContact, firstName: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="John"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Last Name
                    </label>
                    <input
                      type="text"
                      value={newContact.lastName}
                      onChange={(e) => setNewContact({ ...newContact, lastName: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Doe"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={newContact.phone}
                    onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Company
                  </label>
                  <input
                    type="text"
                    value={newContact.company}
                    onChange={(e) => setNewContact({ ...newContact, company: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Acme Inc."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Add to List
                  </label>
                  {!newContact.showCreateList ? (
                    <div className="space-y-2">
                      <select
                        value={newContact.list}
                        onChange={(e) => setNewContact({ ...newContact, list: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-purple-500"
                      >
                        <option value="">No list (general contacts)</option>
                        {lists.map(list => (
                          <option key={list._id} value={list._id}>{list.name}</option>
                        ))}
                      </select>
                      <button
                        type="button"
                        onClick={() => setNewContact({ ...newContact, showCreateList: true, newListName: '' })}
                        className="text-sm text-purple-600 hover:text-purple-700 flex items-center gap-1"
                      >
                        <Plus className="w-4 h-4" /> Create new list
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={newContact.newListName || ''}
                        onChange={(e) => setNewContact({ ...newContact, newListName: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="Enter list name"
                        autoFocus
                      />
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={async () => {
                            if (!newContact.newListName?.trim()) return;
                            setCreatingList(true);
                            try {
                              const res = await fetch(`${API_URL}/api/campaigns-enhanced/lists`, {
                                method: 'POST',
                                ...getAuth(),
                                body: JSON.stringify({ name: newContact.newListName.trim() })
                              });
                              const data = await res.json();
                              if (data.list) {
                                setLists([...lists, data.list]);
                                setNewContact({ ...newContact, list: data.list._id, showCreateList: false, newListName: '' });
                              }
                            } catch (err) {
                              alert('Failed to create list');
                            } finally {
                              setCreatingList(false);
                            }
                          }}
                          disabled={creatingList || !newContact.newListName?.trim()}
                          className="px-3 py-1.5 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 disabled:opacity-50 flex items-center gap-1"
                        >
                          {creatingList ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                          Create
                        </button>
                        <button
                          type="button"
                          onClick={() => setNewContact({ ...newContact, showCreateList: false, newListName: '' })}
                          className="px-3 py-1.5 border border-gray-200 text-gray-600 text-sm rounded-lg hover:bg-gray-50"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="p-6 border-t border-gray-100 flex justify-end gap-3">
                <button
                  onClick={() => setShowAddContact(false)}
                  className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={addContact}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                >
                  Add Contact
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Import Modal */}
        {showImportModal && importPreview && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">Import Contacts</h3>
                  <p className="text-sm text-gray-500">{importPreview.totalRows} contacts found</p>
                </div>
                <button
                  onClick={() => {
                    setShowImportModal(false);
                    setImportFile(null);
                    setImportPreview(null);
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* Import Options */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Import to List
                    </label>
                    <select
                      value={importToList}
                      onChange={(e) => setImportToList(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="">No list (general contacts)</option>
                      {lists.map(list => (
                        <option key={list._id} value={list._id}>{list.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Auto-tag all imports
                    </label>
                    <input
                      type="text"
                      value={importAutoTag}
                      onChange={(e) => setImportAutoTag(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="e.g., imported-jan-2025"
                    />
                  </div>
                </div>

                {/* Column Mapping */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Column Mapping</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {importPreview.headers.map(header => (
                      <div key={header} className="flex items-center gap-2">
                        <span className="text-sm text-gray-600 min-w-[80px] truncate">{header}:</span>
                        <select
                          value={importMapping[header] || ''}
                          onChange={(e) => setImportMapping({ ...importMapping, [header]: e.target.value })}
                          className="flex-1 px-2 py-1 border border-gray-200 rounded text-sm bg-white"
                        >
                          <option value="">Skip</option>
                          <option value="email">Email</option>
                          <option value="firstName">First Name</option>
                          <option value="lastName">Last Name</option>
                          <option value="phone">Phone</option>
                          <option value="company">Company</option>
                        </select>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Preview Table */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Preview (first 5 rows)</h4>
                  <div className="overflow-x-auto border border-gray-200 rounded-lg">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50">
                        <tr>
                          {importPreview.headers.map(header => (
                            <th key={header} className="px-3 py-2 text-left font-medium text-gray-600">
                              {header}
                              {importMapping[header] && (
                                <span className="ml-1 text-purple-600">→ {importMapping[header]}</span>
                              )}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {importPreview.rows.map((row, i) => (
                          <tr key={i} className="border-t border-gray-100">
                            {importPreview.headers.map(header => (
                              <td key={header} className="px-3 py-2 text-gray-600">
                                {row[header] || '-'}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              
              <div className="p-6 border-t border-gray-100 flex justify-end gap-3">
                <button
                  onClick={() => {
                    setShowImportModal(false);
                    setImportFile(null);
                    setImportPreview(null);
                  }}
                  className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={processImport}
                  disabled={importing || !importMapping.email}
                  className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 flex items-center gap-2"
                >
                  {importing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Importing...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4" />
                      Import {importPreview.totalRows} Contacts
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete All Modal */}
        {showDeleteAllModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-md">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center gap-3 text-red-600">
                  <AlertTriangle className="w-6 h-6" />
                  <h3 className="text-lg font-semibold">Delete All Contacts</h3>
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-600 mb-4">
                  {selectedList
                    ? `This will permanently delete ALL contacts in the selected list.`
                    : `This will permanently delete ALL ${stats.total.toLocaleString()} contacts.`}
                </p>
                <p className="text-gray-600 mb-4">
                  This action <strong>cannot be undone</strong>.
                </p>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type <span className="font-mono bg-gray-100 px-1 rounded">DELETE ALL</span> to confirm:
                  </label>
                  <input
                    type="text"
                    value={deleteConfirmText}
                    onChange={(e) => setDeleteConfirmText(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="DELETE ALL"
                  />
                </div>
              </div>
              <div className="p-6 border-t border-gray-100 flex justify-end gap-3">
                <button
                  onClick={() => {
                    setShowDeleteAllModal(false);
                    setDeleteConfirmText('');
                  }}
                  className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={deleteAllContacts}
                  disabled={deleteConfirmText !== 'DELETE ALL' || deletingAll}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center gap-2"
                >
                  {deletingAll ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-4 h-4" />
                      Delete All
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Bulk Tag Modal */}
        {showBulkTagModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-md">
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <h3 className="text-lg font-semibold">Add Tag to Selected</h3>
                <button
                  onClick={() => setShowBulkTagModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6">
                <p className="text-gray-600 mb-4">
                  Add a tag to {selectedContacts.length} selected contacts.
                </p>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tag Name
                  </label>
                  <input
                    type="text"
                    value={bulkTagName}
                    onChange={(e) => setBulkTagName(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="e.g., vip-customer"
                  />
                  {tags.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {tags.slice(0, 10).map(tag => (
                        <button
                          key={tag}
                          onClick={() => setBulkTagName(tag)}
                          className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs hover:bg-gray-200"
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="p-6 border-t border-gray-100 flex justify-end gap-3">
                <button
                  onClick={() => setShowBulkTagModal(false)}
                  className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={bulkAddTag}
                  disabled={!bulkTagName.trim()}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
                >
                  Add Tag
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Bulk Move Modal */}
        {showBulkMoveModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-md">
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <h3 className="text-lg font-semibold">Move to List</h3>
                <button
                  onClick={() => setShowBulkMoveModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6">
                <p className="text-gray-600 mb-4">
                  Move {selectedContacts.length} selected contacts to a list.
                </p>
                <div className="space-y-2">
                  <button
                    onClick={() => bulkMoveToList('')}
                    className="w-full flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 text-left"
                  >
                    <Users className="w-5 h-5 text-gray-400" />
                    <span>Remove from all lists</span>
                  </button>
                  {lists.map(list => (
                    <button
                      key={list._id}
                      onClick={() => bulkMoveToList(list._id)}
                      className="w-full flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 text-left"
                    >
                      <Folder className="w-5 h-5 text-purple-500" />
                      <span>{list.name}</span>
                      <span className="ml-auto text-sm text-gray-400">{list.contactCount || 0}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* AI Clean Modal */}
        {showAICleanModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-md">
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-lg flex items-center justify-center">
                    <Wand2 className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">AI List Cleaning</h3>
                    <p className="text-sm text-gray-500">Powered by AI</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setShowAICleanModal(false);
                    setAiCleanResult(null);
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="p-6">
                {!aiCleanResult ? (
                  <>
                    <p className="text-gray-600 mb-4">
                      AI will analyze your contacts and:
                    </p>
                    <ul className="space-y-2 mb-6">
                      <li className="flex items-center gap-2 text-sm text-gray-600">
                        <Check className="w-4 h-4 text-green-500" />
                        Remove duplicate email addresses
                      </li>
                      <li className="flex items-center gap-2 text-sm text-gray-600">
                        <Check className="w-4 h-4 text-green-500" />
                        Fix common email typos
                      </li>
                      <li className="flex items-center gap-2 text-sm text-gray-600">
                        <Check className="w-4 h-4 text-green-500" />
                        Remove invalid email formats
                      </li>
                      <li className="flex items-center gap-2 text-sm text-gray-600">
                        <Check className="w-4 h-4 text-green-500" />
                        Flag suspicious domains
                      </li>
                    </ul>
                    <button
                      onClick={aiCleanList}
                      disabled={aiCleaning}
                      className="w-full py-3 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-lg hover:from-purple-600 hover:to-indigo-600 font-medium flex items-center justify-center gap-2"
                    >
                      {aiCleaning ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Cleaning...
                        </>
                      ) : (
                        <>
                          <Wand2 className="w-4 h-4" />
                          Start Cleaning
                        </>
                      )}
                    </button>
                  </>
                ) : (
                  <>
                    <div className="text-center mb-6">
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="w-8 h-8 text-green-500" />
                      </div>
                      <h4 className="text-lg font-semibold text-gray-900">Cleaning Complete!</h4>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm text-gray-600">Duplicates removed</span>
                        <span className="font-semibold text-red-600">{aiCleanResult.duplicatesRemoved || 0}</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm text-gray-600">Emails fixed</span>
                        <span className="font-semibold text-blue-600">{aiCleanResult.emailsFixed || 0}</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm text-gray-600">Invalid removed</span>
                        <span className="font-semibold text-orange-600">{aiCleanResult.invalidRemoved || 0}</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm text-gray-600">Flagged for review</span>
                        <span className="font-semibold text-purple-600">{aiCleanResult.flagged || 0}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setShowAICleanModal(false);
                        setAiCleanResult(null);
                      }}
                      className="w-full mt-6 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 font-medium"
                    >
                      Done
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Edit Contact Modal */}
        {showEditContact && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <h3 className="text-lg font-semibold">Edit Contact</h3>
                <button
                  onClick={() => setShowEditContact(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={showEditContact.email}
                    onChange={(e) => setShowEditContact({ ...showEditContact, email: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      First Name
                    </label>
                    <input
                      type="text"
                      value={showEditContact.firstName || ''}
                      onChange={(e) => setShowEditContact({ ...showEditContact, firstName: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Last Name
                    </label>
                    <input
                      type="text"
                      value={showEditContact.lastName || ''}
                      onChange={(e) => setShowEditContact({ ...showEditContact, lastName: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={showEditContact.phone || ''}
                    onChange={(e) => setShowEditContact({ ...showEditContact, phone: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Company
                  </label>
                  <input
                    type="text"
                    value={showEditContact.company || ''}
                    onChange={(e) => setShowEditContact({ ...showEditContact, company: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    value={showEditContact.status || 'subscribed'}
                    onChange={(e) => setShowEditContact({ ...showEditContact, status: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="subscribed">Subscribed</option>
                    <option value="unsubscribed">Unsubscribed</option>
                    <option value="bounced">Bounced</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    List
                  </label>
                  <select
                    value={showEditContact.list || ''}
                    onChange={(e) => setShowEditContact({ ...showEditContact, list: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="">No list</option>
                    {lists.map(list => (
                      <option key={list._id} value={list._id}>{list.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="p-6 border-t border-gray-100 flex justify-end gap-3">
                <button
                  onClick={() => setShowEditContact(null)}
                  className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => updateContact(showEditContact._id, showEditContact)}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit List Modal */}
        {editingList && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-md">
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <h3 className="text-lg font-semibold">Edit List</h3>
                <button
                  onClick={() => setEditingList(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    List Name
                  </label>
                  <input
                    type="text"
                    value={editingList.name}
                    onChange={(e) => setEditingList({ ...editingList, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <input
                    type="text"
                    value={editingList.description || ''}
                    onChange={(e) => setEditingList({ ...editingList, description: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div className="p-6 border-t border-gray-100 flex justify-end gap-3">
                <button
                  onClick={() => setEditingList(null)}
                  className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => updateList(editingList._id, { name: editingList.name, description: editingList.description })}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
