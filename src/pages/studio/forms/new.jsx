/**
 * Create Form - Forms Builder
 * /studio/forms/new
 */

import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function CreateForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    fields: [],
  });

  const [showAddField, setShowAddField] = useState(false);
  const [newField, setNewField] = useState({
    type: 'text',
    label: '',
    required: false,
    placeholder: '',
    options: '',
  });

  const fieldTypes = [
    { id: 'text', label: 'Short Text', icon: '📝' },
    { id: 'textarea', label: 'Long Text', icon: '📄' },
    { id: 'email', label: 'Email', icon: '📧' },
    { id: 'phone', label: 'Phone', icon: '📱' },
    { id: 'number', label: 'Number', icon: '🔢' },
    { id: 'date', label: 'Date', icon: '📅' },
    { id: 'select', label: 'Dropdown', icon: '📋' },
    { id: 'radio', label: 'Multiple Choice', icon: '⭕' },
    { id: 'checkbox', label: 'Checkboxes', icon: '☑️' },
    { id: 'file', label: 'File Upload', icon: '📎' },
  ];

  const addField = () => {
    if (!newField.label) {
      alert('Please enter a field label');
      return;
    }

    const field = {
      id: Date.now().toString(),
      type: newField.type,
      label: newField.label,
      required: newField.required,
      placeholder: newField.placeholder,
      options: newField.options.split('\n').filter(o => o.trim()),
    };

    setFormData({
      ...formData,
      fields: [...formData.fields, field]
    });

    setNewField({
      type: 'text',
      label: '',
      required: false,
      placeholder: '',
      options: '',
    });
    setShowAddField(false);
  };

  const removeField = (id) => {
    setFormData({
      ...formData,
      fields: formData.fields.filter(f => f.id !== id)
    });
  };

  const moveField = (index, direction) => {
    const fields = [...formData.fields];
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= fields.length) return;
    
    [fields[index], fields[newIndex]] = [fields[newIndex], fields[index]];
    setFormData({ ...formData, fields });
  };

  const createForm = async () => {
    if (!formData.title) {
      alert('Please enter a form title');
      return;
    }
    if (formData.fields.length === 0) {
      alert('Please add at least one field');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/forms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      if (data.ok || data.form) {
        router.push('/studio?tab=forms');
      } else {
        alert(data.error || 'Failed to create form');
      }
    } catch (error) {
      alert('Failed to create form');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Create Form - CYBEV Studio</title>
      </Head>

      <div style={styles.page}>
        <div style={styles.container}>
          {/* Header */}
          <div style={styles.header}>
            <Link href="/studio" style={styles.backLink}>← Back to Studio</Link>
            <h1 style={styles.title}>📝 Create Form</h1>
            <p style={styles.subtitle}>Build surveys and collect responses</p>
          </div>

          <div style={styles.content}>
            {/* Form Settings */}
            <div style={styles.settingsCard}>
              <h2 style={styles.cardTitle}>Form Settings</h2>
              
              <div style={styles.formGroup}>
                <label style={styles.label}>Form Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="e.g., Contact Form, Survey, Registration"
                  style={styles.input}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Describe your form..."
                  style={styles.textarea}
                  rows={3}
                />
              </div>
            </div>

            {/* Fields */}
            <div style={styles.fieldsCard}>
              <div style={styles.fieldsHeader}>
                <h2 style={styles.cardTitle}>Form Fields</h2>
                <button 
                  onClick={() => setShowAddField(true)}
                  style={styles.addFieldButton}
                >
                  + Add Field
                </button>
              </div>

              {formData.fields.length === 0 ? (
                <div style={styles.emptyFields}>
                  <span style={styles.emptyIcon}>📋</span>
                  <p style={styles.emptyText}>No fields added yet</p>
                  <button 
                    onClick={() => setShowAddField(true)}
                    style={styles.emptyButton}
                  >
                    Add Your First Field
                  </button>
                </div>
              ) : (
                <div style={styles.fieldsList}>
                  {formData.fields.map((field, index) => (
                    <div key={field.id} style={styles.fieldItem}>
                      <div style={styles.fieldInfo}>
                        <span style={styles.fieldIcon}>
                          {fieldTypes.find(t => t.id === field.type)?.icon || '📝'}
                        </span>
                        <div>
                          <span style={styles.fieldLabel}>
                            {field.label}
                            {field.required && <span style={styles.requiredBadge}>Required</span>}
                          </span>
                          <span style={styles.fieldType}>
                            {fieldTypes.find(t => t.id === field.type)?.label}
                          </span>
                        </div>
                      </div>
                      <div style={styles.fieldActions}>
                        <button 
                          onClick={() => moveField(index, -1)}
                          disabled={index === 0}
                          style={styles.moveButton}
                        >
                          ↑
                        </button>
                        <button 
                          onClick={() => moveField(index, 1)}
                          disabled={index === formData.fields.length - 1}
                          style={styles.moveButton}
                        >
                          ↓
                        </button>
                        <button 
                          onClick={() => removeField(field.id)}
                          style={styles.removeButton}
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Actions */}
            <div style={styles.actions}>
              <Link href="/studio" style={styles.cancelButton}>
                Cancel
              </Link>
              <button 
                onClick={createForm}
                disabled={loading || !formData.title || formData.fields.length === 0}
                style={{
                  ...styles.createButton,
                  opacity: formData.title && formData.fields.length > 0 && !loading ? 1 : 0.5,
                }}
              >
                {loading ? 'Creating...' : 'Create Form'}
              </button>
            </div>
          </div>

          {/* Add Field Modal */}
          {showAddField && (
            <div style={styles.modalOverlay} onClick={() => setShowAddField(false)}>
              <div style={styles.modal} onClick={e => e.stopPropagation()}>
                <div style={styles.modalHeader}>
                  <h2 style={styles.modalTitle}>Add Field</h2>
                  <button onClick={() => setShowAddField(false)} style={styles.closeButton}>×</button>
                </div>
                
                <div style={styles.modalContent}>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Field Type</label>
                    <div style={styles.typeGrid}>
                      {fieldTypes.map(type => (
                        <button
                          key={type.id}
                          onClick={() => setNewField({...newField, type: type.id})}
                          style={{
                            ...styles.typeButton,
                            borderColor: newField.type === type.id ? '#8B5CF6' : '#E4E6EB',
                            backgroundColor: newField.type === type.id ? '#F5F3FF' : '#FFFFFF',
                          }}
                        >
                          <span>{type.icon}</span>
                          <span style={styles.typeLabel}>{type.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div style={styles.formGroup}>
                    <label style={styles.label}>Label *</label>
                    <input
                      type="text"
                      value={newField.label}
                      onChange={(e) => setNewField({...newField, label: e.target.value})}
                      placeholder="e.g., Full Name, Email Address"
                      style={styles.input}
                    />
                  </div>

                  <div style={styles.formGroup}>
                    <label style={styles.label}>Placeholder</label>
                    <input
                      type="text"
                      value={newField.placeholder}
                      onChange={(e) => setNewField({...newField, placeholder: e.target.value})}
                      placeholder="Hint text for users"
                      style={styles.input}
                    />
                  </div>

                  {['select', 'radio', 'checkbox'].includes(newField.type) && (
                    <div style={styles.formGroup}>
                      <label style={styles.label}>Options (one per line)</label>
                      <textarea
                        value={newField.options}
                        onChange={(e) => setNewField({...newField, options: e.target.value})}
                        placeholder="Option 1&#10;Option 2&#10;Option 3"
                        style={styles.textarea}
                        rows={4}
                      />
                    </div>
                  )}

                  <label style={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      checked={newField.required}
                      onChange={(e) => setNewField({...newField, required: e.target.checked})}
                      style={styles.checkbox}
                    />
                    Required field
                  </label>
                </div>

                <div style={styles.modalActions}>
                  <button onClick={() => setShowAddField(false)} style={styles.modalCancel}>
                    Cancel
                  </button>
                  <button onClick={addField} style={styles.modalAdd}>
                    Add Field
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    backgroundColor: '#F0F2F5',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  },
  container: {
    maxWidth: '900px',
    margin: '0 auto',
    padding: '24px 16px',
  },
  header: {
    marginBottom: '24px',
  },
  backLink: {
    display: 'inline-block',
    color: '#8B5CF6',
    textDecoration: 'none',
    fontSize: '14px',
    marginBottom: '8px',
  },
  title: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#1C1E21',
    margin: '0 0 8px 0',
  },
  subtitle: {
    fontSize: '15px',
    color: '#65676B',
    margin: 0,
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  settingsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: '8px',
    padding: '24px',
    boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
  },
  fieldsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: '8px',
    padding: '24px',
    boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
  },
  cardTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#1C1E21',
    margin: '0 0 20px 0',
  },
  formGroup: {
    marginBottom: '20px',
  },
  label: {
    display: 'block',
    fontSize: '14px',
    fontWeight: '600',
    color: '#1C1E21',
    marginBottom: '8px',
  },
  input: {
    width: '100%',
    padding: '12px 16px',
    border: '1px solid #CED0D4',
    borderRadius: '6px',
    fontSize: '15px',
    color: '#1C1E21',
    backgroundColor: '#FFFFFF',
    boxSizing: 'border-box',
  },
  textarea: {
    width: '100%',
    padding: '12px 16px',
    border: '1px solid #CED0D4',
    borderRadius: '6px',
    fontSize: '15px',
    color: '#1C1E21',
    backgroundColor: '#FFFFFF',
    resize: 'vertical',
    fontFamily: 'inherit',
    boxSizing: 'border-box',
  },
  fieldsHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  addFieldButton: {
    padding: '10px 20px',
    backgroundColor: '#8B5CF6',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  emptyFields: {
    textAlign: 'center',
    padding: '40px 20px',
  },
  emptyIcon: {
    fontSize: '40px',
    display: 'block',
    marginBottom: '12px',
  },
  emptyText: {
    color: '#65676B',
    margin: '0 0 16px 0',
  },
  emptyButton: {
    padding: '10px 20px',
    backgroundColor: '#E4E6EB',
    color: '#1C1E21',
    border: 'none',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  fieldsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  fieldItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px',
    backgroundColor: '#F7F8FA',
    borderRadius: '8px',
    border: '1px solid #E4E6EB',
  },
  fieldInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  fieldIcon: {
    fontSize: '20px',
  },
  fieldLabel: {
    display: 'block',
    fontSize: '14px',
    fontWeight: '600',
    color: '#1C1E21',
  },
  requiredBadge: {
    marginLeft: '8px',
    padding: '2px 8px',
    backgroundColor: '#FEE2E2',
    color: '#DC2626',
    borderRadius: '4px',
    fontSize: '11px',
    fontWeight: '600',
  },
  fieldType: {
    display: 'block',
    fontSize: '12px',
    color: '#65676B',
  },
  fieldActions: {
    display: 'flex',
    gap: '8px',
  },
  moveButton: {
    width: '32px',
    height: '32px',
    backgroundColor: '#E4E6EB',
    color: '#65676B',
    border: 'none',
    borderRadius: '6px',
    fontSize: '14px',
    cursor: 'pointer',
  },
  removeButton: {
    width: '32px',
    height: '32px',
    backgroundColor: '#FEE2E2',
    color: '#DC2626',
    border: 'none',
    borderRadius: '6px',
    fontSize: '18px',
    cursor: 'pointer',
  },
  actions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '12px',
  },
  cancelButton: {
    display: 'inline-block',
    padding: '12px 24px',
    backgroundColor: '#E4E6EB',
    color: '#1C1E21',
    textDecoration: 'none',
    borderRadius: '6px',
    fontSize: '15px',
    fontWeight: '600',
  },
  createButton: {
    padding: '12px 32px',
    backgroundColor: '#10B981',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '6px',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  modalOverlay: {
    position: 'fixed',
    inset: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '24px',
    zIndex: 1000,
  },
  modal: {
    backgroundColor: '#FFFFFF',
    borderRadius: '8px',
    width: '100%',
    maxWidth: '550px',
    maxHeight: '90vh',
    overflow: 'auto',
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px',
    borderBottom: '1px solid #E4E6EB',
  },
  modalTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#1C1E21',
    margin: 0,
  },
  closeButton: {
    background: 'none',
    border: 'none',
    fontSize: '24px',
    color: '#65676B',
    cursor: 'pointer',
  },
  modalContent: {
    padding: '20px',
  },
  typeGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(5, 1fr)',
    gap: '8px',
  },
  typeButton: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '12px 8px',
    border: '2px solid #E4E6EB',
    borderRadius: '6px',
    cursor: 'pointer',
    backgroundColor: '#FFFFFF',
  },
  typeLabel: {
    fontSize: '11px',
    color: '#1C1E21',
    marginTop: '4px',
  },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px',
    color: '#1C1E21',
    cursor: 'pointer',
  },
  checkbox: {
    width: '18px',
    height: '18px',
    cursor: 'pointer',
  },
  modalActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '12px',
    padding: '16px 20px',
    borderTop: '1px solid #E4E6EB',
  },
  modalCancel: {
    padding: '10px 20px',
    backgroundColor: '#E4E6EB',
    color: '#1C1E21',
    border: 'none',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  modalAdd: {
    padding: '10px 24px',
    backgroundColor: '#8B5CF6',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
  },
};
