// ============================================
// FILE: src/pages/studio/campaigns/contacts.jsx
// CYBEV Contacts Management - Fully Functional
// VERSION: 4.0.0 - Import, Add, Manage Contacts
// ============================================

import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import AppLayout from '@/components/Layout/AppLayout';
import {
  Users, Plus, Upload, Download, Search, Filter, Trash2, Edit2,
  ArrowLeft, Loader2, Check, X, Tag, Mail, Phone, Building,
  MoreHorizontal, ChevronDown, AlertCircle, FileText, CheckCircle,
  UserPlus, RefreshCw, Star
} from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.cybev.io';

export default function ContactsManagement() {
  const router = useRouter();
  const { import: showImportModal } = router.query;
  const fileInputRef = useRef(null);
  
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, subscribed: 0, unsubscribed: 0 });
  const [pagination, setPagination] = useState({ page: 1, limit: 50, total: 0 });
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [tags, setTags] = useState([]);
  const [selectedTag, setSelectedTag] = useState('');
  
  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showImport, setShowImport] = useState(showImportModal === 'true');
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState(null);
  
  // New contact form
  const [newContact, setNewContact] = useState({
    email: '', firstName: '', lastName: '', phone: '', company: '', tags: []
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchContacts();
    fetchStats();
    fetchTags();
  }, [pagination.page, searchQuery, selectedTag]);

  useEffect(() => {
    if (showImportModal === 'true') {
      setShowImport(true);
    }
  }, [showImportModal]);

  const getAuth = () => {
    const token = localStorage.getItem('token') || localStorage.getItem('cybev_token');
    return { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } };
  };

  const fetchContacts = async () => {
    try {
      let url = `${API_URL}/api/campaigns-enhanced/contacts?page=${pagination.page}&limit=${pagination.limit}`;
      if (searchQuery) url += `&search=${encodeURIComponent(searchQuery)}`;
      if (selectedTag) url += `&tag=${encodeURIComponent(selectedTag)}`;
      
      const res = await fetch(url, getAuth());
      const data = await res.json();
      
      if (data.contacts) {
        setContacts(data.contacts);
        setPagination(prev => ({ ...prev, total: data.pagination?.total || 0 }));
      }
    } catch (err) {
      console.error('Failed to fetch contacts:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await fetch(`${API_URL}/api/campaigns-enhanced/contacts/stats`, getAuth());
      const data = await res.json();
      if (data.stats) setStats(data.stats);
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    }
  };

  const fetchTags = async () => {
    try {
      const res = await fetch(`${API_URL}/api/campaigns-enhanced/tags`, getAuth());
      const data = await res.json();
      if (data.tags) setTags(data.tags);
    } catch (err) {
      console.error('Failed to fetch tags:', err);
    }
  };

  const addContact = async () => {
    if (!newContact.email) {
      alert('Email is required');
      return;
    }
    
    setSaving(true);
    try {
      const res = await fetch(`${API_URL}/api/campaigns-enhanced/contacts`, {
        method: 'POST',
        ...getAuth(),
        body: JSON.stringify({
          email: newContact.email,
          name: `${newContact.firstName} ${newContact.lastName}`.trim(),
          firstName: newContact.firstName,
          lastName: newContact.lastName,
          phone: newContact.phone,
          company: newContact.company,
          tags: newContact.tags
        })
      });
      
      const data = await res.json();
      if (data.ok) {
        setShowAddModal(false);
        setNewContact({ email: '', firstName: '', lastName: '', phone: '', company: '', tags: [] });
        fetchContacts();
        fetchStats();
        alert('Contact added successfully!');
      } else {
        alert(data.error || 'Failed to add contact');
      }
    } catch (err) {
      alert('Failed to add contact');
    } finally {
      setSaving(false);
    }
  };

  const deleteContact = async (contactId) => {
    if (!confirm('Delete this contact?')) return;
    
    try {
      const res = await fetch(`${API_URL}/api/campaigns-enhanced/contacts/${contactId}`, {
        method: 'DELETE',
        ...getAuth()
      });
      
      if (res.ok) {
        setContacts(contacts.filter(c => c._id !== contactId));
        fetchStats();
      }
    } catch (err) {
      alert('Failed to delete contact');
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setImporting(true);
    setImportResult(null);
    
    try {
      const text = await file.text();
      const lines = text.split('\n').filter(line => line.trim());
      
      if (lines.length < 2) {
        alert('CSV file must have a header row and at least one data row');
        setImporting(false);
        return;
      }
      
      // Parse header
      const headers = lines[0].split(',').map(h => h.trim().toLowerCase().replace(/['"]/g, ''));
      const emailIndex = headers.findIndex(h => h === 'email' || h === 'e-mail' || h === 'email address');
      
      if (emailIndex === -1) {
        alert('CSV must have an "email" column');
        setImporting(false);
        return;
      }
      
      // Parse contacts
      const contactsToImport = [];
      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.trim().replace(/['"]/g, ''));
        if (values[emailIndex]) {
          const contact = { email: values[emailIndex] };
          
          headers.forEach((header, idx) => {
            if (idx !== emailIndex && values[idx]) {
              if (header === 'name' || header === 'full name') contact.name = values[idx];
              else if (header === 'first name' || header === 'firstname') contact.firstName = values[idx];
              else if (header === 'last name' || header === 'lastname') contact.lastName = values[idx];
              else if (header === 'phone' || header === 'telephone') contact.phone = values[idx];
              else if (header === 'company' || header === 'organization') contact.company = values[idx];
            }
          });
          
          contactsToImport.push(contact);
        }
      }
      
      if (!contactsToImport.length) {
        alert('No valid contacts found in CSV');
        setImporting(false);
        return;
      }
      
      // Import via API
      const res = await fetch(`${API_URL}/api/campaigns-enhanced/contacts/import`, {
        method: 'POST',
        ...getAuth(),
        body: JSON.stringify({ contacts: contactsToImport })
      });
      
      const data = await res.json();
      
      if (data.ok) {
        setImportResult({
          success: true,
          imported: data.imported,
          skipped: data.skipped,
          total: data.total
        });
        fetchContacts();
        fetchStats();
      } else {
        setImportResult({ success: false, error: data.error });
      }
    } catch (err) {
      console.error('Import error:', err);
      setImportResult({ success: false, error: err.message });
    } finally {
      setImporting(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const exportContacts = () => {
    const csv = [
      'Email,First Name,Last Name,Phone,Company,Tags,Subscribed',
      ...contacts.map(c => 
        `${c.email},${c.firstName || ''},${c.lastName || ''},${c.phone || ''},${c.company || ''},${(c.tags || []).join(';')},${c.subscribed ? 'Yes' : 'No'}`
      )
    ].join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'contacts.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <AppLayout>
      <Head>
        <title>Contacts - CYBEV Email Marketing</title>
      </Head>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link href="/studio/campaigns" className="text-purple-600 hover:underline text-sm mb-2 inline-flex items-center gap-1">
              <ArrowLeft className="w-4 h-4" /> Back to Campaigns
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">Contacts</h1>
            <p className="text-gray-600">Manage your email subscribers</p>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowImport(true)}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center gap-2"
            >
              <Upload className="w-4 h-4" />
              Import CSV
            </button>
            <button
              onClick={exportContacts}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2"
            >
              <UserPlus className="w-4 h-4" />
              Add Contact
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl p-5 border border-gray-200">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <span className="text-sm text-gray-500">Total Contacts</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.total?.toLocaleString() || 0}</p>
          </div>
          <div className="bg-white rounded-xl p-5 border border-gray-200">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <span className="text-sm text-gray-500">Subscribed</span>
            </div>
            <p className="text-3xl font-bold text-green-600">{stats.subscribed?.toLocaleString() || 0}</p>
          </div>
          <div className="bg-white rounded-xl p-5 border border-gray-200">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <X className="w-5 h-5 text-red-600" />
              </div>
              <span className="text-sm text-gray-500">Unsubscribed</span>
            </div>
            <p className="text-3xl font-bold text-red-600">{stats.unsubscribed?.toLocaleString() || 0}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6 flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by email or name..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            />
          </div>
          
          <select
            value={selectedTag}
            onChange={(e) => setSelectedTag(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
          >
            <option value="">All Tags</option>
            {tags.map(tag => (
              <option key={tag.name} value={tag.name}>{tag.name} ({tag.count})</option>
            ))}
          </select>
          
          <button onClick={fetchContacts} className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg">
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>

        {/* Contacts Table */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
            </div>
          ) : contacts.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-10 h-10 text-purple-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No contacts yet</h3>
              <p className="text-gray-500 mb-6">Start building your list by adding contacts</p>
              <div className="flex items-center justify-center gap-4">
                <button
                  onClick={() => setShowImport(true)}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2"
                >
                  <Upload className="w-4 h-4" />
                  Import CSV
                </button>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="px-4 py-2 border border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50 flex items-center gap-2"
                >
                  <UserPlus className="w-4 h-4" />
                  Add Manually
                </button>
              </div>
            </div>
          ) : (
            <>
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Contact</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Phone</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Company</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Tags</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                    <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {contacts.map(contact => (
                    <tr key={contact._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-medium">
                            {(contact.name || contact.email)?.[0]?.toUpperCase() || '?'}
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{contact.name || contact.firstName || '—'}</div>
                            <div className="text-sm text-gray-500">{contact.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600">{contact.phone || '—'}</td>
                      <td className="px-6 py-4 text-gray-600">{contact.company || '—'}</td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {(contact.tags || []).slice(0, 3).map(tag => (
                            <span key={tag} className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">{tag}</span>
                          ))}
                          {(contact.tags || []).length > 3 && (
                            <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">+{contact.tags.length - 3}</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {contact.subscribed ? (
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                            <Check className="w-3 h-3" /> Subscribed
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-full">
                            <X className="w-3 h-3" /> Unsubscribed
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-1">
                          <button onClick={() => deleteContact(contact._id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {/* Pagination */}
              <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                <p className="text-sm text-gray-500">
                  Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total}
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPagination(p => ({ ...p, page: p.page - 1 }))}
                    disabled={pagination.page <= 1}
                    className="px-3 py-1 border border-gray-300 rounded-lg disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setPagination(p => ({ ...p, page: p.page + 1 }))}
                    disabled={pagination.page * pagination.limit >= pagination.total}
                    className="px-3 py-1 border border-gray-300 rounded-lg disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Add Contact Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Add Contact</h2>
                <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                  <input
                    type="email"
                    value={newContact.email}
                    onChange={(e) => setNewContact({ ...newContact, email: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    placeholder="email@example.com"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                    <input
                      type="text"
                      value={newContact.firstName}
                      onChange={(e) => setNewContact({ ...newContact, firstName: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                    <input
                      type="text"
                      value={newContact.lastName}
                      onChange={(e) => setNewContact({ ...newContact, lastName: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input
                    type="tel"
                    value={newContact.phone}
                    onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                  <input
                    type="text"
                    value={newContact.company}
                    onChange={(e) => setNewContact({ ...newContact, company: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>
              
              <div className="flex items-center gap-3 mt-6">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={addContact}
                  disabled={saving || !newContact.email}
                  className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />}
                  Add Contact
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Import Modal */}
        {showImport && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Import Contacts</h2>
                <button onClick={() => { setShowImport(false); setImportResult(null); }} className="p-2 hover:bg-gray-100 rounded-lg">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              {importResult ? (
                <div className="text-center py-8">
                  {importResult.success ? (
                    <>
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="w-8 h-8 text-green-600" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Import Complete!</h3>
                      <p className="text-gray-600 mb-4">
                        <span className="font-semibold text-green-600">{importResult.imported}</span> contacts imported successfully.
                        {importResult.skipped > 0 && <span className="text-gray-500"> ({importResult.skipped} skipped)</span>}
                      </p>
                      <p className="text-sm text-gray-500">Total contacts: {importResult.total}</p>
                    </>
                  ) : (
                    <>
                      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <AlertCircle className="w-8 h-8 text-red-600" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Import Failed</h3>
                      <p className="text-red-600">{importResult.error}</p>
                    </>
                  )}
                  <button
                    onClick={() => { setShowImport(false); setImportResult(null); }}
                    className="mt-6 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                  >
                    Done
                  </button>
                </div>
              ) : (
                <>
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center">
                    {importing ? (
                      <div className="flex flex-col items-center">
                        <Loader2 className="w-12 h-12 animate-spin text-purple-600 mb-4" />
                        <p className="text-gray-600">Importing contacts...</p>
                      </div>
                    ) : (
                      <>
                        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="font-medium text-gray-900 mb-2">Upload CSV File</h3>
                        <p className="text-sm text-gray-500 mb-4">
                          File must have an "email" column. Supports: name, first name, last name, phone, company.
                        </p>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept=".csv"
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                        <button
                          onClick={() => fileInputRef.current?.click()}
                          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                        >
                          Select File
                        </button>
                      </>
                    )}
                  </div>
                  
                  <div className="mt-6 p-4 bg-gray-50 rounded-xl">
                    <h4 className="font-medium text-gray-900 mb-2">CSV Format Example:</h4>
                    <code className="text-sm text-gray-600 block bg-white p-3 rounded border">
                      email,first name,last name,phone,company<br/>
                      john@example.com,John,Doe,+1234567890,Acme Inc
                    </code>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
