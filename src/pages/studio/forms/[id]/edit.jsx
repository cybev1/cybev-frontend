// ============================================
// FILE: src/pages/studio/forms/[id]/edit.jsx
// CYBEV Form Builder - Visual Form Editor
// VERSION: 1.0.0 - Drag & Drop Form Builder
// ============================================

import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Link from 'next/link';
import AppLayout from '@/components/Layout/AppLayout';
import {
  ArrowLeft, Save, Eye, Play, Pause, Settings, Palette, Target,
  Code, Plus, Trash2, GripVertical, Mail, Type, Phone, List,
  CheckSquare, Calendar, X, Check, Loader2, Copy, ExternalLink,
  Smartphone, Monitor, ChevronDown, ChevronUp, Image, Zap
} from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.cybev.io';

const FIELD_TYPES = [
  { id: 'email', name: 'Email', icon: Mail, description: 'Email address input' },
  { id: 'text', name: 'Text', icon: Type, description: 'Single line text' },
  { id: 'phone', name: 'Phone', icon: Phone, description: 'Phone number' },
  { id: 'select', name: 'Dropdown', icon: List, description: 'Select from options' },
  { id: 'checkbox', name: 'Checkbox', icon: CheckSquare, description: 'Yes/no option' },
  { id: 'date', name: 'Date', icon: Calendar, description: 'Date picker' },
];

export default function FormEditor() {
  const router = useRouter();
  const { id } = router.query;
  
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('design');
  const [previewMode, setPreviewMode] = useState('desktop');
  const [showAddField, setShowAddField] = useState(false);
  const [selectedField, setSelectedField] = useState(null);
  const [showEmbedCode, setShowEmbedCode] = useState(false);
  const [lists, setLists] = useState([]);

  useEffect(() => {
    if (id) {
      fetchForm();
      fetchLists();
    }
  }, [id]);

  const getAuth = () => {
    const token = localStorage.getItem('token') || localStorage.getItem('cybev_token');
    return { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } };
  };

  const fetchForm = async () => {
    try {
      const res = await fetch(`${API_URL}/api/forms/${id}`, getAuth());
      const data = await res.json();
      if (data.form) setForm(data.form);
    } catch (err) {
      console.error('Fetch form error:', err);
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

  const saveForm = async () => {
    setSaving(true);
    try {
      const res = await fetch(`${API_URL}/api/forms/${id}`, {
        method: 'PUT',
        ...getAuth(),
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (data.form) {
        setForm(data.form);
        alert('Saved successfully!');
      }
    } catch (err) {
      alert('Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const addField = (type) => {
    const newField = {
      id: `field_${Date.now()}`,
      type,
      label: FIELD_TYPES.find(f => f.id === type)?.name || 'Field',
      placeholder: '',
      required: false,
      order: form.fields.length,
      options: type === 'select' ? ['Option 1', 'Option 2'] : [],
      mapTo: type === 'email' ? 'email' : 'custom'
    };
    setForm({ ...form, fields: [...form.fields, newField] });
    setShowAddField(false);
    setSelectedField(newField.id);
  };

  const updateField = (fieldId, updates) => {
    setForm({
      ...form,
      fields: form.fields.map(f => f.id === fieldId ? { ...f, ...updates } : f)
    });
  };

  const removeField = (fieldId) => {
    setForm({
      ...form,
      fields: form.fields.filter(f => f.id !== fieldId)
    });
    if (selectedField === fieldId) setSelectedField(null);
  };

  const moveField = (fieldId, direction) => {
    const idx = form.fields.findIndex(f => f.id === fieldId);
    if ((direction === -1 && idx === 0) || (direction === 1 && idx === form.fields.length - 1)) return;
    
    const newFields = [...form.fields];
    [newFields[idx], newFields[idx + direction]] = [newFields[idx + direction], newFields[idx]];
    setForm({ ...form, fields: newFields });
  };

  const activateForm = async () => {
    try {
      await fetch(`${API_URL}/api/forms/${id}/activate`, {
        method: 'POST',
        ...getAuth()
      });
      fetchForm();
    } catch (err) {
      alert('Failed to activate');
    }
  };

  const pauseForm = async () => {
    try {
      await fetch(`${API_URL}/api/forms/${id}/pause`, {
        method: 'POST',
        ...getAuth()
      });
      fetchForm();
    } catch (err) {
      alert('Failed to pause');
    }
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-screen">
          <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
        </div>
      </AppLayout>
    );
  }

  if (!form) {
    return (
      <AppLayout>
        <div className="text-center py-20">
          <p>Form not found</p>
        </div>
      </AppLayout>
    );
  }

  return (
    <>
      <Head>
        <title>Edit {form.name} - CYBEV Forms</title>
      </Head>

      <div className="h-screen flex flex-col bg-gray-100">
        {/* Top Bar */}
        <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => router.push('/studio/forms')} className="p-2 hover:bg-gray-100 rounded-lg">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="font-semibold text-lg border-none focus:ring-0 p-0 bg-transparent"
              />
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span className="capitalize">{form.type}</span>
                <span>•</span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                  form.status === 'active' ? 'bg-green-100 text-green-700' :
                  form.status === 'paused' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-gray-100 text-gray-600'
                }`}>
                  {form.status}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Preview Mode Toggle */}
            <div className="flex items-center bg-gray-100 rounded-lg p-1 mr-2">
              <button
                onClick={() => setPreviewMode('desktop')}
                className={`p-2 rounded-md ${previewMode === 'desktop' ? 'bg-white shadow-sm' : ''}`}
              >
                <Monitor className="w-4 h-4" />
              </button>
              <button
                onClick={() => setPreviewMode('mobile')}
                className={`p-2 rounded-md ${previewMode === 'mobile' ? 'bg-white shadow-sm' : ''}`}
              >
                <Smartphone className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={() => setShowEmbedCode(true)}
              className="px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center gap-2"
            >
              <Code className="w-4 h-4" />
              Get Code
            </button>

            <button
              onClick={saveForm}
              disabled={saving}
              className="px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center gap-2"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Save
            </button>

            {form.status === 'active' ? (
              <button
                onClick={pauseForm}
                className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 flex items-center gap-2"
              >
                <Pause className="w-4 h-4" />
                Pause
              </button>
            ) : (
              <button
                onClick={activateForm}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
              >
                <Play className="w-4 h-4" />
                Publish
              </button>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Panel - Fields & Settings */}
          <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
            {/* Tabs */}
            <div className="flex border-b border-gray-200">
              {[
                { id: 'design', label: 'Fields', icon: Type },
                { id: 'style', label: 'Style', icon: Palette },
                { id: 'settings', label: 'Settings', icon: Settings },
              ].map(tab => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 px-4 py-3 text-sm font-medium flex items-center justify-center gap-2 border-b-2 transition ${
                      activeTab === tab.id
                        ? 'border-purple-600 text-purple-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Panel Content */}
            <div className="flex-1 overflow-auto p-4">
              {/* Fields Tab */}
              {activeTab === 'design' && (
                <div className="space-y-4">
                  {/* Content Settings */}
                  <div className="space-y-3">
                    <h4 className="font-medium text-gray-900">Content</h4>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Heading</label>
                      <input
                        type="text"
                        value={form.content?.heading || ''}
                        onChange={(e) => setForm({ ...form, content: { ...form.content, heading: e.target.value } })}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Subheading</label>
                      <input
                        type="text"
                        value={form.content?.subheading || ''}
                        onChange={(e) => setForm({ ...form, content: { ...form.content, subheading: e.target.value } })}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Button Text</label>
                      <input
                        type="text"
                        value={form.content?.submitButtonText || 'Subscribe'}
                        onChange={(e) => setForm({ ...form, content: { ...form.content, submitButtonText: e.target.value } })}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Success Message</label>
                      <input
                        type="text"
                        value={form.content?.successMessage || ''}
                        onChange={(e) => setForm({ ...form, content: { ...form.content, successMessage: e.target.value } })}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                      />
                    </div>
                  </div>

                  <hr />

                  {/* Fields List */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-gray-900">Form Fields</h4>
                      <button
                        onClick={() => setShowAddField(true)}
                        className="p-1 text-purple-600 hover:bg-purple-50 rounded"
                      >
                        <Plus className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="space-y-2">
                      {form.fields.map((field, idx) => {
                        const FieldIcon = FIELD_TYPES.find(f => f.id === field.type)?.icon || Type;
                        return (
                          <div
                            key={field.id}
                            onClick={() => setSelectedField(field.id)}
                            className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer ${
                              selectedField === field.id
                                ? 'border-purple-500 bg-purple-50'
                                : 'border-gray-200 hover:border-purple-300'
                            }`}
                          >
                            <GripVertical className="w-4 h-4 text-gray-400" />
                            <FieldIcon className="w-4 h-4 text-gray-500" />
                            <span className="flex-1 text-sm">{field.label}</span>
                            {field.required && (
                              <span className="text-xs text-red-500">*</span>
                            )}
                            <div className="flex items-center gap-1">
                              <button
                                onClick={(e) => { e.stopPropagation(); moveField(field.id, -1); }}
                                className="p-1 hover:bg-gray-100 rounded"
                                disabled={idx === 0}
                              >
                                <ChevronUp className="w-3 h-3" />
                              </button>
                              <button
                                onClick={(e) => { e.stopPropagation(); moveField(field.id, 1); }}
                                className="p-1 hover:bg-gray-100 rounded"
                                disabled={idx === form.fields.length - 1}
                              >
                                <ChevronDown className="w-3 h-3" />
                              </button>
                              <button
                                onClick={(e) => { e.stopPropagation(); removeField(field.id); }}
                                className="p-1 hover:bg-red-100 rounded text-red-500"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Selected Field Settings */}
                  {selectedField && (
                    <>
                      <hr />
                      <div className="space-y-3">
                        <h4 className="font-medium text-gray-900">Field Settings</h4>
                        {(() => {
                          const field = form.fields.find(f => f.id === selectedField);
                          if (!field) return null;
                          return (
                            <>
                              <div>
                                <label className="block text-sm text-gray-600 mb-1">Label</label>
                                <input
                                  type="text"
                                  value={field.label}
                                  onChange={(e) => updateField(field.id, { label: e.target.value })}
                                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                                />
                              </div>
                              <div>
                                <label className="block text-sm text-gray-600 mb-1">Placeholder</label>
                                <input
                                  type="text"
                                  value={field.placeholder || ''}
                                  onChange={(e) => updateField(field.id, { placeholder: e.target.value })}
                                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                                />
                              </div>
                              <div className="flex items-center gap-2">
                                <input
                                  type="checkbox"
                                  id="required"
                                  checked={field.required}
                                  onChange={(e) => updateField(field.id, { required: e.target.checked })}
                                  className="rounded border-gray-300"
                                />
                                <label htmlFor="required" className="text-sm text-gray-600">Required</label>
                              </div>
                              <div>
                                <label className="block text-sm text-gray-600 mb-1">Map to Contact Field</label>
                                <select
                                  value={field.mapTo || 'custom'}
                                  onChange={(e) => updateField(field.id, { mapTo: e.target.value })}
                                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                                >
                                  <option value="email">Email</option>
                                  <option value="firstName">First Name</option>
                                  <option value="lastName">Last Name</option>
                                  <option value="phone">Phone</option>
                                  <option value="company">Company</option>
                                  <option value="custom">Custom Field</option>
                                </select>
                              </div>
                            </>
                          );
                        })()}
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* Style Tab */}
              {activeTab === 'style' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Background Color</label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={form.design?.backgroundColor || '#ffffff'}
                        onChange={(e) => setForm({ ...form, design: { ...form.design, backgroundColor: e.target.value } })}
                        className="w-10 h-10 rounded border border-gray-200"
                      />
                      <input
                        type="text"
                        value={form.design?.backgroundColor || '#ffffff'}
                        onChange={(e) => setForm({ ...form, design: { ...form.design, backgroundColor: e.target.value } })}
                        className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Accent Color</label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={form.design?.accentColor || '#7c3aed'}
                        onChange={(e) => setForm({ ...form, design: { ...form.design, accentColor: e.target.value } })}
                        className="w-10 h-10 rounded border border-gray-200"
                      />
                      <input
                        type="text"
                        value={form.design?.accentColor || '#7c3aed'}
                        onChange={(e) => setForm({ ...form, design: { ...form.design, accentColor: e.target.value } })}
                        className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Border Radius</label>
                    <input
                      type="range"
                      min="0"
                      max="24"
                      value={form.design?.borderRadius || 12}
                      onChange={(e) => setForm({ ...form, design: { ...form.design, borderRadius: parseInt(e.target.value) } })}
                      className="w-full"
                    />
                    <span className="text-sm text-gray-500">{form.design?.borderRadius || 12}px</span>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Width</label>
                    <input
                      type="number"
                      value={form.design?.width || 400}
                      onChange={(e) => setForm({ ...form, design: { ...form.design, width: parseInt(e.target.value) } })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                    />
                  </div>
                </div>
              )}

              {/* Settings Tab */}
              {activeTab === 'settings' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Add to List</label>
                    <select
                      value={form.integration?.addToList || ''}
                      onChange={(e) => setForm({ ...form, integration: { ...form.integration, addToList: e.target.value } })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                    >
                      <option value="">No list</option>
                      {lists.map(list => (
                        <option key={list._id} value={list._id}>{list.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Add Tags (comma separated)</label>
                    <input
                      type="text"
                      value={form.integration?.addTags?.join(', ') || ''}
                      onChange={(e) => setForm({ 
                        ...form, 
                        integration: { 
                          ...form.integration, 
                          addTags: e.target.value.split(',').map(t => t.trim()).filter(Boolean)
                        } 
                      })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                      placeholder="newsletter, signup"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Display Trigger</label>
                    <select
                      value={form.targeting?.trigger || 'delay'}
                      onChange={(e) => setForm({ ...form, targeting: { ...form.targeting, trigger: e.target.value } })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                    >
                      <option value="immediate">Immediately</option>
                      <option value="delay">After delay</option>
                      <option value="scroll">On scroll</option>
                      <option value="exit">Exit intent</option>
                    </select>
                  </div>
                  {form.targeting?.trigger === 'delay' && (
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Delay (seconds)</label>
                      <input
                        type="number"
                        value={form.targeting?.delay || 5}
                        onChange={(e) => setForm({ ...form, targeting: { ...form.targeting, delay: parseInt(e.target.value) } })}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                      />
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="doubleOptIn"
                      checked={form.integration?.doubleOptIn || false}
                      onChange={(e) => setForm({ ...form, integration: { ...form.integration, doubleOptIn: e.target.checked } })}
                      className="rounded border-gray-300"
                    />
                    <label htmlFor="doubleOptIn" className="text-sm text-gray-600">Enable double opt-in</label>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Preview Area */}
          <div className="flex-1 overflow-auto p-8 flex items-center justify-center">
            <div 
              className={`transition-all ${previewMode === 'mobile' ? 'max-w-sm' : ''}`}
              style={{ width: previewMode === 'mobile' ? '375px' : `${form.design?.width || 400}px` }}
            >
              {/* Form Preview */}
              <div
                className="shadow-2xl"
                style={{
                  backgroundColor: form.design?.backgroundColor || '#ffffff',
                  borderRadius: `${form.design?.borderRadius || 12}px`,
                  padding: `${form.design?.padding || 24}px`
                }}
              >
                {form.content?.heading && (
                  <h2 
                    className="font-bold mb-2"
                    style={{ 
                      color: form.design?.textColor || '#1f2937',
                      fontSize: `${form.design?.headingSize || 24}px`
                    }}
                  >
                    {form.content.heading}
                  </h2>
                )}
                {form.content?.subheading && (
                  <p 
                    className="mb-6"
                    style={{ 
                      color: '#6b7280',
                      fontSize: `${form.design?.bodySize || 14}px`
                    }}
                  >
                    {form.content.subheading}
                  </p>
                )}

                <div className="space-y-4">
                  {form.fields.map(field => (
                    <div key={field.id}>
                      <label className="block text-sm font-medium mb-1" style={{ color: form.design?.textColor || '#1f2937' }}>
                        {field.label}
                        {field.required && <span className="text-red-500 ml-1">*</span>}
                      </label>
                      {field.type === 'select' ? (
                        <select className="w-full px-3 py-2 border border-gray-200 rounded-lg">
                          <option>{field.placeholder || 'Select...'}</option>
                          {field.options?.map((opt, i) => (
                            <option key={i}>{opt}</option>
                          ))}
                        </select>
                      ) : field.type === 'checkbox' ? (
                        <div className="flex items-center gap-2">
                          <input type="checkbox" className="rounded" />
                          <span className="text-sm">{field.placeholder}</span>
                        </div>
                      ) : (
                        <input
                          type={field.type === 'email' ? 'email' : field.type === 'phone' ? 'tel' : 'text'}
                          placeholder={field.placeholder}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                        />
                      )}
                    </div>
                  ))}

                  <button
                    className="w-full py-3 rounded-lg font-medium text-white transition hover:opacity-90"
                    style={{ backgroundColor: form.design?.accentColor || '#7c3aed' }}
                  >
                    {form.content?.submitButtonText || 'Subscribe'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Field Modal */}
      {showAddField && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-lg font-semibold">Add Field</h3>
              <button onClick={() => setShowAddField(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 grid gap-3">
              {FIELD_TYPES.map(type => {
                const Icon = type.icon;
                return (
                  <button
                    key={type.id}
                    onClick={() => addField(type.id)}
                    className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition text-left"
                  >
                    <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{type.name}</h4>
                      <p className="text-sm text-gray-500">{type.description}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Embed Code Modal */}
      {showEmbedCode && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-lg font-semibold">Embed Code</h3>
              <button onClick={() => setShowEmbedCode(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <p className="text-sm text-gray-600 mb-4">
                Copy this code and paste it into your website where you want the form to appear.
              </p>
              <div className="bg-gray-900 rounded-lg p-4 text-green-400 font-mono text-sm overflow-auto">
                <pre>{form.embedCode || `<!-- CYBEV Form -->
<script>
(function(c,y,b,e,v){
  c.CYBEVForms=c.CYBEVForms||[];
  var s=y.createElement('script');
  s.src='https://cybev.io/forms/embed.js';
  s.async=true;
  s.onload=function(){
    c.CYBEVForms.push({id:'${form.shortCode}',type:'${form.type}'});
  };
  y.head.appendChild(s);
})(window,document);
</script>
<div id="cybev-form-${form.shortCode}"></div>
<!-- End CYBEV Form -->`}</pre>
              </div>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(form.embedCode || `...`);
                  alert('Copied!');
                }}
                className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2"
              >
                <Copy className="w-4 h-4" />
                Copy Code
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
