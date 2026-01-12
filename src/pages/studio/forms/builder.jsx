// ============================================
// FILE: /studio/forms/builder.jsx
// PURPOSE: Drag-drop Form Builder UI
// ============================================

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import {
  ArrowLeft, Save, Eye, Settings, Plus, Trash2, GripVertical,
  Type, AlignLeft, Mail, Phone, Hash, Calendar, List, CheckSquare,
  Circle, Star, Sliders, Upload, Image, FileSignature, MapPin,
  Link as LinkIcon, Clock, ChevronDown, ChevronUp, Copy, X, Check,
  Palette, Globe, Lock, Users, Bell
} from 'lucide-react';

const FIELD_TYPES = [
  { type: 'text', label: 'Short Text', icon: Type, description: 'Single line text input' },
  { type: 'textarea', label: 'Long Text', icon: AlignLeft, description: 'Multi-line text area' },
  { type: 'email', label: 'Email', icon: Mail, description: 'Email address input' },
  { type: 'phone', label: 'Phone', icon: Phone, description: 'Phone number input' },
  { type: 'number', label: 'Number', icon: Hash, description: 'Numeric input' },
  { type: 'date', label: 'Date', icon: Calendar, description: 'Date picker' },
  { type: 'time', label: 'Time', icon: Clock, description: 'Time picker' },
  { type: 'select', label: 'Dropdown', icon: List, description: 'Single select dropdown' },
  { type: 'multiselect', label: 'Multi Select', icon: CheckSquare, description: 'Multiple selection' },
  { type: 'radio', label: 'Radio Buttons', icon: Circle, description: 'Single choice options' },
  { type: 'checkbox', label: 'Checkboxes', icon: CheckSquare, description: 'Multiple choice options' },
  { type: 'rating', label: 'Rating', icon: Star, description: 'Star rating' },
  { type: 'scale', label: 'Scale', icon: Sliders, description: 'Linear scale (1-10)' },
  { type: 'file', label: 'File Upload', icon: Upload, description: 'File attachment' },
  { type: 'image', label: 'Image Upload', icon: Image, description: 'Image attachment' },
  { type: 'url', label: 'Website URL', icon: LinkIcon, description: 'URL input' },
  { type: 'location', label: 'Location', icon: MapPin, description: 'Address/location input' },
];

export default function FormBuilderPage() {
  const router = useRouter();
  const { id } = router.query;

  const [form, setForm] = useState({
    title: 'Untitled Form',
    description: '',
    fields: [],
    settings: {
      requireLogin: false,
      oneResponsePerUser: false,
      allowAnonymous: true,
      showProgressBar: true,
      shuffleFields: false,
      confirmationMessage: 'Thank you for your response!',
      redirectUrl: ''
    },
    branding: {
      primaryColor: '#7c3aed',
      backgroundColor: '#ffffff',
      logo: '',
      headerImage: ''
    },
    notifications: {
      emailOnResponse: false,
      notifyEmails: []
    },
    limits: {
      maxResponses: null,
      startDate: null,
      endDate: null
    }
  });

  const [activeTab, setActiveTab] = useState('fields');
  const [selectedField, setSelectedField] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [saving, setSaving] = useState(false);
  const [draggedField, setDraggedField] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);

  const API = process.env.NEXT_PUBLIC_API_URL || '';

  useEffect(() => {
    if (id) {
      fetchForm(id);
    }
  }, [id]);

  const fetchForm = async (formId) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API}/api/forms/${formId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.ok && data.form) {
        setForm(data.form);
      }
    } catch (err) {
      console.error('Error fetching form:', err);
    }
  };

  const saveForm = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      const url = id ? `${API}/api/forms/${id}` : `${API}/api/forms`;
      const method = id ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(form)
      });

      const data = await res.json();
      if (data.ok) {
        if (!id && data.form?._id) {
          router.replace(`/studio/forms/builder?id=${data.form._id}`, undefined, { shallow: true });
        }
        alert('Form saved successfully!');
      } else {
        alert(data.error || 'Failed to save form');
      }
    } catch (err) {
      console.error('Error saving form:', err);
      alert('Error saving form');
    } finally {
      setSaving(false);
    }
  };

  const addField = (fieldType) => {
    const fieldConfig = FIELD_TYPES.find(f => f.type === fieldType);
    const newField = {
      id: `field_${Date.now()}`,
      type: fieldType,
      label: fieldConfig?.label || 'New Field',
      placeholder: '',
      helpText: '',
      required: false,
      options: ['select', 'multiselect', 'radio', 'checkbox'].includes(fieldType)
        ? ['Option 1', 'Option 2', 'Option 3']
        : [],
      validation: {},
      conditional: null
    };

    setForm(prev => ({
      ...prev,
      fields: [...prev.fields, newField]
    }));
    setSelectedField(newField.id);
  };

  const updateField = (fieldId, updates) => {
    setForm(prev => ({
      ...prev,
      fields: prev.fields.map(f =>
        f.id === fieldId ? { ...f, ...updates } : f
      )
    }));
  };

  const removeField = (fieldId) => {
    setForm(prev => ({
      ...prev,
      fields: prev.fields.filter(f => f.id !== fieldId)
    }));
    if (selectedField === fieldId) {
      setSelectedField(null);
    }
  };

  const duplicateField = (fieldId) => {
    const field = form.fields.find(f => f.id === fieldId);
    if (field) {
      const newField = {
        ...field,
        id: `field_${Date.now()}`,
        label: `${field.label} (Copy)`
      };
      const index = form.fields.findIndex(f => f.id === fieldId);
      const newFields = [...form.fields];
      newFields.splice(index + 1, 0, newField);
      setForm(prev => ({ ...prev, fields: newFields }));
    }
  };

  const moveField = (fromIndex, toIndex) => {
    const newFields = [...form.fields];
    const [movedField] = newFields.splice(fromIndex, 1);
    newFields.splice(toIndex, 0, movedField);
    setForm(prev => ({ ...prev, fields: newFields }));
  };

  const handleDragStart = (e, index) => {
    setDraggedField(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    setDragOverIndex(index);
  };

  const handleDragEnd = () => {
    if (draggedField !== null && dragOverIndex !== null && draggedField !== dragOverIndex) {
      moveField(draggedField, dragOverIndex);
    }
    setDraggedField(null);
    setDragOverIndex(null);
  };

  const selectedFieldData = form.fields.find(f => f.id === selectedField);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-50">
      <Head>
        <title>{form.title} | Form Builder</title>
      </Head>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-white dark:bg-white border-b border-gray-200 dark:border-gray-200">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/studio/forms')}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-100 rounded-lg transition"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))}
              className="text-lg font-semibold bg-transparent border-none focus:ring-0 focus:outline-none"
              placeholder="Form title"
            />
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowPreview(true)}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-100 rounded-lg transition"
            >
              <Eye className="w-4 h-4" />
              Preview
            </button>
            <button
              onClick={saveForm}
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-gray-900 rounded-lg hover:bg-purple-700 transition disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 px-4 border-t border-gray-100 dark:border-gray-200">
          {[
            { id: 'fields', label: 'Fields', icon: Type },
            { id: 'settings', label: 'Settings', icon: Settings },
            { id: 'branding', label: 'Branding', icon: Palette },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition ${
                activeTab === tab.id
                  ? 'border-purple-600 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </header>

      <div className="flex">
        {/* Left Sidebar - Field Types */}
        {activeTab === 'fields' && (
          <aside className="w-64 bg-white dark:bg-white border-r border-gray-200 dark:border-gray-200 p-4 h-[calc(100vh-120px)] overflow-y-auto">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
              Add Fields
            </h3>
            <div className="space-y-2">
              {FIELD_TYPES.map(field => (
                <button
                  key={field.type}
                  onClick={() => addField(field.type)}
                  className="w-full flex items-center gap-3 p-3 text-left rounded-lg hover:bg-gray-50 dark:hover:bg-gray-100 transition group"
                >
                  <div className="p-2 bg-purple-50 dark:bg-purple-900/30 rounded-lg group-hover:bg-purple-100">
                    <field.icon className="w-4 h-4 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-900">{field.label}</p>
                    <p className="text-xs text-gray-500">{field.description}</p>
                  </div>
                </button>
              ))}
            </div>
          </aside>
        )}

        {/* Main Content */}
        <main className="flex-1 p-8 h-[calc(100vh-120px)] overflow-y-auto">
          {activeTab === 'fields' && (
            <div className="max-w-2xl mx-auto">
              {/* Form Header */}
              <div
                className="bg-white dark:bg-white rounded-xl shadow-sm border border-gray-200 dark:border-gray-200 p-6 mb-6"
                style={{ borderTopColor: form.branding?.primaryColor, borderTopWidth: '4px' }}
              >
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full text-2xl font-bold bg-transparent border-none focus:ring-0 focus:outline-none mb-2"
                  placeholder="Form Title"
                />
                <textarea
                  value={form.description}
                  onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full text-gray-500 bg-transparent border-none focus:ring-0 focus:outline-none resize-none"
                  placeholder="Form description (optional)"
                  rows={2}
                />
              </div>

              {/* Fields */}
              {form.fields.length === 0 ? (
                <div className="text-center py-16 bg-white dark:bg-white rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-200">
                  <Plus className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-500">Add fields from the sidebar</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {form.fields.map((field, index) => (
                    <div
                      key={field.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, index)}
                      onDragOver={(e) => handleDragOver(e, index)}
                      onDragEnd={handleDragEnd}
                      onClick={() => setSelectedField(field.id)}
                      className={`bg-white dark:bg-white rounded-xl border-2 p-4 cursor-pointer transition ${
                        selectedField === field.id
                          ? 'border-purple-500 ring-2 ring-purple-100'
                          : 'border-gray-200 dark:border-gray-200 hover:border-purple-300'
                      } ${dragOverIndex === index ? 'border-purple-400 bg-purple-50' : ''}`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="cursor-grab active:cursor-grabbing p-1 text-gray-500 hover:text-gray-600">
                          <GripVertical className="w-5 h-5" />
                        </div>

                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-sm font-medium text-gray-900 dark:text-gray-900">
                              {field.label}
                            </span>
                            {field.required && (
                              <span className="text-red-500 text-sm">*</span>
                            )}
                            <span className="text-xs text-gray-500 px-2 py-0.5 bg-gray-100 rounded">
                              {field.type}
                            </span>
                          </div>

                          {/* Field Preview */}
                          <FieldPreview field={field} />
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              duplicateField(field.id);
                            }}
                            className="p-1.5 text-gray-500 hover:text-purple-600 hover:bg-purple-50 rounded"
                            title="Duplicate"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              removeField(field.id);
                            }}
                            className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="max-w-2xl mx-auto space-y-6">
              <SettingsPanel form={form} setForm={setForm} />
            </div>
          )}

          {activeTab === 'branding' && (
            <div className="max-w-2xl mx-auto space-y-6">
              <BrandingPanel form={form} setForm={setForm} />
            </div>
          )}
        </main>

        {/* Right Sidebar - Field Properties */}
        {activeTab === 'fields' && selectedFieldData && (
          <aside className="w-80 bg-white dark:bg-white border-l border-gray-200 dark:border-gray-200 p-4 h-[calc(100vh-120px)] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900 dark:text-gray-900">Field Properties</h3>
              <button
                onClick={() => setSelectedField(null)}
                className="p-1 text-gray-500 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <FieldPropertiesPanel
              field={selectedFieldData}
              onUpdate={(updates) => updateField(selectedFieldData.id, updates)}
            />
          </aside>
        )}
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <PreviewModal form={form} onClose={() => setShowPreview(false)} />
      )}
    </div>
  );
}

// Field Preview Component
function FieldPreview({ field }) {
  switch (field.type) {
    case 'text':
    case 'email':
    case 'phone':
    case 'number':
    case 'url':
      return (
        <input
          type="text"
          placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}`}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-sm"
          disabled
        />
      );
    case 'textarea':
      return (
        <textarea
          placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}`}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-sm"
          rows={2}
          disabled
        />
      );
    case 'select':
    case 'multiselect':
      return (
        <select className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-sm" disabled>
          <option>Select an option</option>
          {field.options?.map((opt, i) => (
            <option key={i}>{opt}</option>
          ))}
        </select>
      );
    case 'radio':
      return (
        <div className="space-y-2">
          {field.options?.slice(0, 3).map((opt, i) => (
            <label key={i} className="flex items-center gap-2 text-sm text-gray-600">
              <input type="radio" disabled className="text-purple-600" />
              {opt}
            </label>
          ))}
        </div>
      );
    case 'checkbox':
      return (
        <div className="space-y-2">
          {field.options?.slice(0, 3).map((opt, i) => (
            <label key={i} className="flex items-center gap-2 text-sm text-gray-600">
              <input type="checkbox" disabled className="rounded text-purple-600" />
              {opt}
            </label>
          ))}
        </div>
      );
    case 'rating':
      return (
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map(i => (
            <Star key={i} className="w-6 h-6 text-gray-600" />
          ))}
        </div>
      );
    case 'scale':
      return (
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">1</span>
          <div className="flex-1 flex gap-1">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(i => (
              <div key={i} className="flex-1 h-8 bg-gray-200 rounded" />
            ))}
          </div>
          <span className="text-xs text-gray-500">10</span>
        </div>
      );
    case 'date':
      return (
        <input type="date" className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-sm" disabled />
      );
    case 'time':
      return (
        <input type="time" className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-sm" disabled />
      );
    case 'file':
    case 'image':
      return (
        <div className="border-2 border-dashed border-gray-200 rounded-lg p-4 text-center text-gray-500 text-sm">
          <Upload className="w-6 h-6 mx-auto mb-1" />
          Click or drag to upload
        </div>
      );
    case 'location':
      return (
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Enter address"
            className="flex-1 px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-sm"
            disabled
          />
        </div>
      );
    default:
      return null;
  }
}

// Field Properties Panel
function FieldPropertiesPanel({ field, onUpdate }) {
  const hasOptions = ['select', 'multiselect', 'radio', 'checkbox'].includes(field.type);

  return (
    <div className="space-y-4">
      {/* Label */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-600 mb-1">
          Label
        </label>
        <input
          type="text"
          value={field.label}
          onChange={(e) => onUpdate({ label: e.target.value })}
          className="w-full px-3 py-2 border border-gray-200 dark:border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500"
        />
      </div>

      {/* Placeholder */}
      {!hasOptions && (
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-600 mb-1">
            Placeholder
          </label>
          <input
            type="text"
            value={field.placeholder || ''}
            onChange={(e) => onUpdate({ placeholder: e.target.value })}
            className="w-full px-3 py-2 border border-gray-200 dark:border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500"
          />
        </div>
      )}

      {/* Help Text */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-600 mb-1">
          Help Text
        </label>
        <input
          type="text"
          value={field.helpText || ''}
          onChange={(e) => onUpdate({ helpText: e.target.value })}
          placeholder="Additional instructions"
          className="w-full px-3 py-2 border border-gray-200 dark:border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500"
        />
      </div>

      {/* Required Toggle */}
      <div className="flex items-center justify-between py-2">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-600">Required</span>
        <button
          onClick={() => onUpdate({ required: !field.required })}
          className={`relative w-12 h-6 rounded-full transition ${
            field.required ? 'bg-purple-600' : 'bg-gray-200'
          }`}
        >
          <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition ${
            field.required ? 'right-1' : 'left-1'
          }`} />
        </button>
      </div>

      {/* Options (for select, radio, checkbox) */}
      {hasOptions && (
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-600 mb-2">
            Options
          </label>
          <div className="space-y-2">
            {field.options?.map((option, index) => (
              <div key={index} className="flex items-center gap-2">
                <input
                  type="text"
                  value={option}
                  onChange={(e) => {
                    const newOptions = [...field.options];
                    newOptions[index] = e.target.value;
                    onUpdate({ options: newOptions });
                  }}
                  className="flex-1 px-3 py-2 border border-gray-200 dark:border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-purple-500"
                />
                <button
                  onClick={() => {
                    const newOptions = field.options.filter((_, i) => i !== index);
                    onUpdate({ options: newOptions });
                  }}
                  className="p-2 text-gray-500 hover:text-red-500"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
            <button
              onClick={() => onUpdate({ options: [...(field.options || []), `Option ${(field.options?.length || 0) + 1}`] })}
              className="w-full py-2 border-2 border-dashed border-gray-200 rounded-lg text-sm text-gray-500 hover:border-purple-400 hover:text-purple-600 transition"
            >
              + Add Option
            </button>
          </div>
        </div>
      )}

      {/* Validation */}
      {['text', 'number'].includes(field.type) && (
        <div className="pt-4 border-t border-gray-200">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-600 mb-3">Validation</h4>
          {field.type === 'number' && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-gray-500">Min</label>
                <input
                  type="number"
                  value={field.validation?.min || ''}
                  onChange={(e) => onUpdate({ validation: { ...field.validation, min: e.target.value } })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500">Max</label>
                <input
                  type="number"
                  value={field.validation?.max || ''}
                  onChange={(e) => onUpdate({ validation: { ...field.validation, max: e.target.value } })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                />
              </div>
            </div>
          )}
          {field.type === 'text' && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-gray-500">Min Length</label>
                <input
                  type="number"
                  value={field.validation?.minLength || ''}
                  onChange={(e) => onUpdate({ validation: { ...field.validation, minLength: e.target.value } })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500">Max Length</label>
                <input
                  type="number"
                  value={field.validation?.maxLength || ''}
                  onChange={(e) => onUpdate({ validation: { ...field.validation, maxLength: e.target.value } })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Settings Panel
function SettingsPanel({ form, setForm }) {
  const updateSettings = (key, value) => {
    setForm(prev => ({
      ...prev,
      settings: { ...prev.settings, [key]: value }
    }));
  };

  const updateLimits = (key, value) => {
    setForm(prev => ({
      ...prev,
      limits: { ...prev.limits, [key]: value }
    }));
  };

  return (
    <>
      {/* Access Control */}
      <div className="bg-white dark:bg-white rounded-xl p-6 border border-gray-200 dark:border-gray-200">
        <h3 className="font-semibold text-gray-900 dark:text-gray-900 mb-4 flex items-center gap-2">
          <Lock className="w-5 h-5" />
          Access Control
        </h3>
        <div className="space-y-4">
          <SettingToggle
            label="Require Login"
            description="Users must be logged in to submit"
            checked={form.settings?.requireLogin}
            onChange={(v) => updateSettings('requireLogin', v)}
          />
          <SettingToggle
            label="One Response Per User"
            description="Limit each user to one submission"
            checked={form.settings?.oneResponsePerUser}
            onChange={(v) => updateSettings('oneResponsePerUser', v)}
          />
          <SettingToggle
            label="Allow Anonymous"
            description="Allow submissions without identifying info"
            checked={form.settings?.allowAnonymous}
            onChange={(v) => updateSettings('allowAnonymous', v)}
          />
        </div>
      </div>

      {/* Form Behavior */}
      <div className="bg-white dark:bg-white rounded-xl p-6 border border-gray-200 dark:border-gray-200">
        <h3 className="font-semibold text-gray-900 dark:text-gray-900 mb-4 flex items-center gap-2">
          <Settings className="w-5 h-5" />
          Form Behavior
        </h3>
        <div className="space-y-4">
          <SettingToggle
            label="Show Progress Bar"
            description="Display completion progress"
            checked={form.settings?.showProgressBar}
            onChange={(v) => updateSettings('showProgressBar', v)}
          />
          <SettingToggle
            label="Shuffle Fields"
            description="Randomize field order for each user"
            checked={form.settings?.shuffleFields}
            onChange={(v) => updateSettings('shuffleFields', v)}
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-600 mb-1">
              Confirmation Message
            </label>
            <textarea
              value={form.settings?.confirmationMessage || ''}
              onChange={(e) => updateSettings('confirmationMessage', e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 dark:border-gray-200 rounded-lg"
              rows={2}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-600 mb-1">
              Redirect URL (optional)
            </label>
            <input
              type="url"
              value={form.settings?.redirectUrl || ''}
              onChange={(e) => updateSettings('redirectUrl', e.target.value)}
              placeholder="https://example.com/thank-you"
              className="w-full px-3 py-2 border border-gray-200 dark:border-gray-200 rounded-lg"
            />
          </div>
        </div>
      </div>

      {/* Limits */}
      <div className="bg-white dark:bg-white rounded-xl p-6 border border-gray-200 dark:border-gray-200">
        <h3 className="font-semibold text-gray-900 dark:text-gray-900 mb-4 flex items-center gap-2">
          <Users className="w-5 h-5" />
          Response Limits
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-600 mb-1">
              Maximum Responses
            </label>
            <input
              type="number"
              value={form.limits?.maxResponses || ''}
              onChange={(e) => updateLimits('maxResponses', e.target.value ? parseInt(e.target.value) : null)}
              placeholder="Unlimited"
              className="w-full px-3 py-2 border border-gray-200 dark:border-gray-200 rounded-lg"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-600 mb-1">
                Start Date
              </label>
              <input
                type="datetime-local"
                value={form.limits?.startDate ? form.limits.startDate.slice(0, 16) : ''}
                onChange={(e) => updateLimits('startDate', e.target.value ? new Date(e.target.value).toISOString() : null)}
                className="w-full px-3 py-2 border border-gray-200 dark:border-gray-200 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-600 mb-1">
                End Date
              </label>
              <input
                type="datetime-local"
                value={form.limits?.endDate ? form.limits.endDate.slice(0, 16) : ''}
                onChange={(e) => updateLimits('endDate', e.target.value ? new Date(e.target.value).toISOString() : null)}
                className="w-full px-3 py-2 border border-gray-200 dark:border-gray-200 rounded-lg"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-white dark:bg-white rounded-xl p-6 border border-gray-200 dark:border-gray-200">
        <h3 className="font-semibold text-gray-900 dark:text-gray-900 mb-4 flex items-center gap-2">
          <Bell className="w-5 h-5" />
          Notifications
        </h3>
        <SettingToggle
          label="Email on Response"
          description="Receive email notifications for new submissions"
          checked={form.notifications?.emailOnResponse}
          onChange={(v) => setForm(prev => ({
            ...prev,
            notifications: { ...prev.notifications, emailOnResponse: v }
          }))}
        />
      </div>
    </>
  );
}

// Branding Panel
function BrandingPanel({ form, setForm }) {
  const updateBranding = (key, value) => {
    setForm(prev => ({
      ...prev,
      branding: { ...prev.branding, [key]: value }
    }));
  };

  const colors = [
    '#7c3aed', '#8b5cf6', '#6366f1', '#3b82f6', '#0ea5e9',
    '#14b8a6', '#10b981', '#22c55e', '#eab308', '#f97316',
    '#ef4444', '#ec4899', '#d946ef', '#6b7280', '#1f2937'
  ];

  return (
    <>
      <div className="bg-white dark:bg-white rounded-xl p-6 border border-gray-200 dark:border-gray-200">
        <h3 className="font-semibold text-gray-900 dark:text-gray-900 mb-4 flex items-center gap-2">
          <Palette className="w-5 h-5" />
          Colors
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-600 mb-2">
              Primary Color
            </label>
            <div className="flex flex-wrap gap-2">
              {colors.map(color => (
                <button
                  key={color}
                  onClick={() => updateBranding('primaryColor', color)}
                  className={`w-8 h-8 rounded-lg border-2 ${
                    form.branding?.primaryColor === color ? 'border-gray-900 scale-110' : 'border-transparent'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
              <input
                type="color"
                value={form.branding?.primaryColor || '#7c3aed'}
                onChange={(e) => updateBranding('primaryColor', e.target.value)}
                className="w-8 h-8 rounded-lg cursor-pointer"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-600 mb-2">
              Background Color
            </label>
            <div className="flex gap-3">
              {['#ffffff', '#f9fafb', '#f3f4f6', '#1f2937', '#111827'].map(color => (
                <button
                  key={color}
                  onClick={() => updateBranding('backgroundColor', color)}
                  className={`w-8 h-8 rounded-lg border-2 ${
                    form.branding?.backgroundColor === color ? 'border-purple-600 scale-110' : 'border-gray-200'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-white rounded-xl p-6 border border-gray-200 dark:border-gray-200">
        <h3 className="font-semibold text-gray-900 dark:text-gray-900 mb-4 flex items-center gap-2">
          <Image className="w-5 h-5" />
          Images
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-600 mb-1">
              Logo URL
            </label>
            <input
              type="url"
              value={form.branding?.logo || ''}
              onChange={(e) => updateBranding('logo', e.target.value)}
              placeholder="https://example.com/logo.png"
              className="w-full px-3 py-2 border border-gray-200 dark:border-gray-200 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-600 mb-1">
              Header Image URL
            </label>
            <input
              type="url"
              value={form.branding?.headerImage || ''}
              onChange={(e) => updateBranding('headerImage', e.target.value)}
              placeholder="https://example.com/header.jpg"
              className="w-full px-3 py-2 border border-gray-200 dark:border-gray-200 rounded-lg"
            />
          </div>
        </div>
      </div>
    </>
  );
}

// Setting Toggle Component
function SettingToggle({ label, description, checked, onChange }) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-900 dark:text-gray-900">{label}</p>
        <p className="text-xs text-gray-500">{description}</p>
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={`relative w-12 h-6 rounded-full transition ${
          checked ? 'bg-purple-600' : 'bg-gray-200'
        }`}
      >
        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition shadow ${
          checked ? 'right-1' : 'left-1'
        }`} />
      </button>
    </div>
  );
}

// Preview Modal
function PreviewModal({ form, onClose }) {
  return (
    <div className="fixed inset-0 bg-gray-900/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white dark:bg-white border-b border-gray-200 dark:border-gray-200 px-6 py-4 flex items-center justify-between">
          <h3 className="font-semibold text-gray-900 dark:text-gray-900">Form Preview</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6" style={{ backgroundColor: form.branding?.backgroundColor }}>
          {form.branding?.headerImage && (
            <img
              src={form.branding.headerImage}
              alt=""
              className="w-full h-40 object-cover rounded-xl mb-6"
            />
          )}

          <div
            className="bg-white rounded-xl p-6 mb-6"
            style={{ borderTopColor: form.branding?.primaryColor, borderTopWidth: '4px' }}
          >
            {form.branding?.logo && (
              <img src={form.branding.logo} alt="" className="h-12 mb-4" />
            )}
            <h1 className="text-2xl font-bold mb-2">{form.title}</h1>
            {form.description && (
              <p className="text-gray-500">{form.description}</p>
            )}
          </div>

          <div className="space-y-4">
            {form.fields.map((field, index) => (
              <div key={field.id} className="bg-white rounded-xl p-5">
                <label className="block font-medium mb-2">
                  {field.label}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </label>
                {field.helpText && (
                  <p className="text-sm text-gray-500 mb-2">{field.helpText}</p>
                )}
                <FieldPreview field={field} />
              </div>
            ))}
          </div>

          <button
            className="w-full mt-6 py-3 text-gray-900 rounded-xl font-semibold"
            style={{ backgroundColor: form.branding?.primaryColor }}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}
