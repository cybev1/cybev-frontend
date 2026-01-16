// ============================================
// FILE: src/pages/studio/campaigns/contacts.jsx
// CYBEV Contact Management - Import & Organize
// VERSION: 1.0.0 - Full Contact Management
// ============================================

import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import AppLayout from '@/components/Layout/AppLayout';
import {
  Users, Plus, Upload, Download, Search, Filter, Tag,
  Trash2, Edit2, MoreHorizontal, CheckSquare, Square,
  Loader2, ArrowLeft, Mail, X, FileSpreadsheet
} from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.cybev.io';

export default function ContactsPage() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState([]);
  const [showImport, setShowImport] = useState(false);
  const [showAddContact, setShowAddContact] = useState(false);
  const [importing, setImporting] = useState(false);
  const [lists, setLists] = useState([]);
  const fileInputRef = useRef(null);

  const [newContact, setNewContact] = useState({
    email: '', name: '', phone: '', company: '', tags: ''
  });

  useEffect(() => {
    fetchContacts();
    fetchLists();
  }, [page, searchQuery]);

  const getAuth = () => {
    const token = localStorage.getItem('token') || localStorage.getItem('cybev_token');
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  const fetchContacts = async () => {
    setLoading(true);
    try {
      let url = `${API_URL}/api/email/contacts?page=${page}&limit=50`;
      if (searchQuery) url += `&search=${encodeURIComponent(searchQuery)}`;
      
      const res = await fetch(url, getAuth());
      const data = await res.json();
      if (data.contacts) {
        setContacts(data.contacts);
        setTotal(data.pagination?.total || data.contacts.length);
      }
    } catch (err) {
      console.error('Fetch contacts error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchLists = async () => {
    try {
      const res = await fetch(`${API_URL}/api/campaigns-enhanced/lists`, getAuth());
      const data = await res.json();
      if (data.lists) setLists(data.lists);
    } catch (err) {
      console.error('Fetch lists error:', err);
    }
  };

  const addContact = async () => {
    if (!newContact.email) {
      alert('Email is required');
      return;
    }
    
    try {
      const res = await fetch(`${API_URL}/api/email/contacts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuth().headers },
        body: JSON.stringify({
          ...newContact,
          tags: newContact.tags.split(',').map(t => t.trim()).filter(Boolean)
        })
      });
      
      const data = await res.json();
      if (data.contact) {
        setContacts([data.contact, ...contacts]);
        setShowAddContact(false);
        setNewContact({ email: '', name: '', phone: '', company: '', tags: '' });
      }
    } catch (err) {
      alert('Failed to add contact');
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImporting(true);
    try {
      const text = await file.text();
      const lines = text.split('\n').filter(l => l.trim());
      const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
      
      const emailIdx = headers.findIndex(h => h.includes('email'));
      const nameIdx = headers.findIndex(h => h.includes('name'));
      const phoneIdx = headers.findIndex(h => h.includes('phone'));
      const companyIdx = headers.findIndex(h => h.includes('company'));
      
      if (emailIdx === -1) {
        alert('CSV must have an "email" column');
        return;
      }
      
      const contacts = [];
      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.trim().replace(/^"|"$/g, ''));
        if (values[emailIdx]) {
          contacts.push({
            email: values[emailIdx],
            name: nameIdx > -1 ? values[nameIdx] : '',
            phone: phoneIdx > -1 ? values[phoneIdx] : '',
            company: companyIdx > -1 ? values[companyIdx] : ''
          });
        }
      }
      
      if (contacts.length === 0) {
        alert('No valid contacts found in CSV');
        return;
      }
      
      const res = await fetch(`${API_URL}/api/campaigns-enhanced/lists/${lists[0]?._id || 'default'}/import`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuth().headers },
        body: JSON.stringify({ contacts })
      });
      
      const data = await res.json();
      if (data.ok) {
        alert(`Imported ${data.imported} contacts (${data.skipped} skipped)`);
        setShowImport(false);
        fetchContacts();
      }
    } catch (err) {
      alert('Failed to import CSV');
      console.error(err);
    } finally {
      setImporting(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const deleteContacts = async () => {
    if (selectedIds.length === 0) return;
    if (!confirm(`Delete ${selectedIds.length} contact(s)?`)) return;
    
    try {
      for (const id of selectedIds) {
        await fetch(`${API_URL}/api/email/contacts/${id}`, { method: 'DELETE', ...getAuth() });
      }
      setContacts(contacts.filter(c => !selectedIds.includes(c._id)));
      setSelectedIds([]);
    } catch (err) {
      alert('Failed to delete');
    }
  };

  const exportContacts = () => {
    const csv = ['Email,Name,Phone,Company,Tags,Subscribed'];
    contacts.forEach(c => {
      csv.push(`"${c.email}","${c.name || ''}","${c.phone || ''}","${c.company || ''}","${c.tags?.join(';') || ''}","${c.subscribed ? 'Yes' : 'No'}"`);
    });
    
    const blob = new Blob([csv.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cybev-contacts-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const toggleSelect = (id) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const selectAll = () => {
    if (selectedIds.length === contacts.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(contacts.map(c => c._id));
    }
  };

  return (
    <AppLayout>
      <Head>
        <title>Contacts - CYBEV Campaigns</title>
      </Head>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link href="/studio/campaigns" className="text-purple-600 hover:underline text-sm mb-2 inline-flex items-center gap-1">
              <ArrowLeft className="w-4 h-4" /> Back to Campaigns
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">Contacts</h1>
            <p className="text-gray-600">{total.toLocaleString()} total contacts</p>
          </div>
          
          <div className="flex items-center gap-3">
            <button onClick={exportContacts} className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2">
              <Download className="w-4 h-4" />Export
            </button>
            <button onClick={() => setShowImport(true)} className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2">
              <Upload className="w-4 h-4" />Import CSV
            </button>
            <button onClick={() => setShowAddContact(true)} className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2">
              <Plus className="w-5 h-5" />Add Contact
            </button>
          </div>
        </div>

        {/* Search & Actions */}
        <div className="flex items-center justify-between mb-6">
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
          
          {selectedIds.length > 0 && (
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600">{selectedIds.length} selected</span>
              <button onClick={deleteContacts} className="px-3 py-1.5 text-red-600 hover:bg-red-50 rounded-lg flex items-center gap-1">
                <Trash2 className="w-4 h-4" />Delete
              </button>
            </div>
          )}
        </div>

        {/* Contacts Table */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
          </div>
        ) : contacts.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No contacts yet</h3>
            <p className="text-gray-500 mb-6">Import contacts or add them manually</p>
            <div className="flex items-center justify-center gap-3">
              <button onClick={() => setShowImport(true)} className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                Import CSV
              </button>
              <button onClick={() => setShowAddContact(true)} className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                Add Contact
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="w-12 px-4 py-3">
                    <button onClick={selectAll}>
                      {selectedIds.length === contacts.length 
                        ? <CheckSquare className="w-5 h-5 text-purple-600" />
                        : <Square className="w-5 h-5 text-gray-400" />
                      }
                    </button>
                  </th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Email</th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Name</th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Company</th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Tags</th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {contacts.map(contact => (
                  <tr key={contact._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <button onClick={() => toggleSelect(contact._id)}>
                        {selectedIds.includes(contact._id)
                          ? <CheckSquare className="w-5 h-5 text-purple-600" />
                          : <Square className="w-5 h-5 text-gray-400" />
                        }
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-900">{contact.email}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-900">{contact.name || '—'}</td>
                    <td className="px-4 py-3 text-gray-600">{contact.company || '—'}</td>
                    <td className="px-4 py-3">
                      {contact.tags?.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {contact.tags.slice(0, 3).map(tag => (
                            <span key={tag} className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs rounded-full">
                              {tag}
                            </span>
                          ))}
                          {contact.tags.length > 3 && (
                            <span className="text-xs text-gray-500">+{contact.tags.length - 3}</span>
                          )}
                        </div>
                      ) : '—'}
                    </td>
                    <td className="px-4 py-3">
                      {contact.subscribed !== false ? (
                        <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">Active</span>
                      ) : (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">Unsubscribed</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {total > 50 && (
          <div className="flex items-center justify-center gap-2 mt-6">
            <button 
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1 border border-gray-300 rounded-lg disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-sm text-gray-600">Page {page} of {Math.ceil(total / 50)}</span>
            <button 
              onClick={() => setPage(p => p + 1)}
              disabled={page >= Math.ceil(total / 50)}
              className="px-3 py-1 border border-gray-300 rounded-lg disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}

        {/* Import Modal */}
        {showImport && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl w-full max-w-md">
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900">Import Contacts</h2>
                <button onClick={() => setShowImport(false)}><X className="w-5 h-5" /></button>
              </div>
              <div className="p-6">
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center">
                  <FileSpreadsheet className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">Upload a CSV file with contacts</p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="csv-upload"
                  />
                  <label 
                    htmlFor="csv-upload"
                    className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 cursor-pointer inline-flex items-center gap-2"
                  >
                    {importing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                    {importing ? 'Importing...' : 'Choose File'}
                  </label>
                </div>
                <p className="text-xs text-gray-500 mt-4">
                  CSV should have columns: email (required), name, phone, company
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Add Contact Modal */}
        {showAddContact && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl w-full max-w-md">
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900">Add Contact</h2>
                <button onClick={() => setShowAddContact(false)}><X className="w-5 h-5" /></button>
              </div>
              <div className="p-6 space-y-4">
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
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    value={newContact.name}
                    onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                  <input
                    type="text"
                    value={newContact.company}
                    onChange={(e) => setNewContact({ ...newContact, company: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    placeholder="Company Inc."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
                  <input
                    type="text"
                    value={newContact.tags}
                    onChange={(e) => setNewContact({ ...newContact, tags: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    placeholder="tag1, tag2, tag3"
                  />
                </div>
              </div>
              <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
                <button onClick={() => setShowAddContact(false)} className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
                  Cancel
                </button>
                <button onClick={addContact} className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                  Add Contact
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
