// ============================================
// FILE: /forms/[slug].jsx
// PURPOSE: Public Form View and Submission
// ============================================

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import {
  Star, CheckCircle, AlertCircle, Loader2, Upload, MapPin,
  Calendar, Clock, ChevronLeft, ChevronRight, X
} from 'lucide-react';

export default function FormViewPage() {
  const router = useRouter();
  const { slug } = router.query;

  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [currentSection, setCurrentSection] = useState(0);

  const API = process.env.NEXT_PUBLIC_API_URL || '';

  useEffect(() => {
    if (slug) {
      fetchForm();
    }
  }, [slug]);

  const fetchForm = async () => {
    try {
      const res = await fetch(`${API}/api/forms/slug/${slug}`);
      const data = await res.json();

      if (data.ok && data.form) {
        if (data.form.status !== 'published') {
          setError('This form is not accepting responses');
        } else if (data.form.limits?.endDate && new Date(data.form.limits.endDate) < new Date()) {
          setError('This form has expired');
        } else if (data.form.limits?.maxResponses && data.form.analytics?.responses >= data.form.limits.maxResponses) {
          setError('This form has reached its maximum number of responses');
        } else {
          setForm(data.form);
          // Initialize form data
          const initialData = {};
          data.form.fields?.forEach(field => {
            if (field.type === 'checkbox' || field.type === 'multiselect') {
              initialData[field.id] = [];
            } else if (field.type === 'rating') {
              initialData[field.id] = 0;
            } else {
              initialData[field.id] = '';
            }
          });
          setFormData(initialData);
        }
      } else {
        setError(data.error || 'Form not found');
      }
    } catch (err) {
      console.error('Error fetching form:', err);
      setError('Failed to load form');
    } finally {
      setLoading(false);
    }
  };

  const validateField = (field, value) => {
    if (field.required) {
      if (Array.isArray(value) && value.length === 0) return 'This field is required';
      if (!value && value !== 0) return 'This field is required';
    }

    if (field.type === 'email' && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) return 'Please enter a valid email';
    }

    if (field.type === 'url' && value) {
      try {
        new URL(value);
      } catch {
        return 'Please enter a valid URL';
      }
    }

    if (field.validation) {
      if (field.validation.minLength && value.length < field.validation.minLength) {
        return `Minimum ${field.validation.minLength} characters required`;
      }
      if (field.validation.maxLength && value.length > field.validation.maxLength) {
        return `Maximum ${field.validation.maxLength} characters allowed`;
      }
      if (field.validation.min && Number(value) < field.validation.min) {
        return `Minimum value is ${field.validation.min}`;
      }
      if (field.validation.max && Number(value) > field.validation.max) {
        return `Maximum value is ${field.validation.max}`;
      }
    }

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate all fields
    const newErrors = {};
    form.fields?.forEach(field => {
      const error = validateField(field, formData[field.id]);
      if (error) newErrors[field.id] = error;
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      // Scroll to first error
      const firstErrorField = form.fields.find(f => newErrors[f.id]);
      if (firstErrorField) {
        document.getElementById(`field-${firstErrorField.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    setSubmitting(true);
    setErrors({});

    try {
      const token = localStorage.getItem('token');
      const headers = {
        'Content-Type': 'application/json'
      };
      if (token) headers.Authorization = `Bearer ${token}`;

      // Transform form data to expected format
      const answers = form.fields.map(field => ({
        fieldId: field.id,
        value: formData[field.id]
      }));

      const res = await fetch(`${API}/api/forms/${form._id}/responses`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ answers })
      });

      const data = await res.json();

      if (data.ok) {
        setSubmitted(true);
        // Handle redirect if configured
        if (form.settings?.redirectUrl) {
          setTimeout(() => {
            window.location.href = form.settings.redirectUrl;
          }, 2000);
        }
      } else {
        setErrors({ submit: data.error || 'Failed to submit form' });
      }
    } catch (err) {
      console.error('Error submitting form:', err);
      setErrors({ submit: 'Failed to submit form. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  const updateField = (fieldId, value) => {
    setFormData(prev => ({ ...prev, [fieldId]: value }));
    // Clear error on change
    if (errors[fieldId]) {
      setErrors(prev => {
        const next = { ...prev };
        delete next[fieldId];
        return next;
      });
    }
  };

  const handleCheckboxChange = (fieldId, option, checked) => {
    setFormData(prev => {
      const current = prev[fieldId] || [];
      if (checked) {
        return { ...prev, [fieldId]: [...current, option] };
      } else {
        return { ...prev, [fieldId]: current.filter(v => v !== option) };
      }
    });
  };

  // Calculate progress
  const calculateProgress = () => {
    if (!form?.fields?.length) return 0;
    const filledFields = form.fields.filter(field => {
      const value = formData[field.id];
      if (Array.isArray(value)) return value.length > 0;
      return value !== '' && value !== 0 && value !== null;
    }).length;
    return Math.round((filledFields / form.fields.length) * 100);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Form Unavailable</h1>
          <p className="text-gray-500 mb-6">{error}</p>
          <Link href="/" className="text-purple-600 hover:text-purple-700 font-medium">
            Go to Homepage
          </Link>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div
        className="min-h-screen flex items-center justify-center p-4"
        style={{ backgroundColor: form.branding?.backgroundColor || '#f9fafb' }}
      >
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6"
            style={{ backgroundColor: `${form.branding?.primaryColor || '#7c3aed'}15` }}
          >
            <CheckCircle
              className="w-8 h-8"
              style={{ color: form.branding?.primaryColor || '#7c3aed' }}
            />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Thank You!</h2>
          <p className="text-gray-500 mb-6">
            {form.settings?.confirmationMessage || 'Your response has been recorded.'}
          </p>
          {form.settings?.redirectUrl && (
            <p className="text-sm text-gray-400">Redirecting...</p>
          )}
          <Link
            href="/"
            className="inline-block mt-4 text-sm font-medium hover:underline"
            style={{ color: form.branding?.primaryColor || '#7c3aed' }}
          >
            Back to CYBEV
          </Link>
        </div>
      </div>
    );
  }

  const primaryColor = form.branding?.primaryColor || '#7c3aed';
  const bgColor = form.branding?.backgroundColor || '#f9fafb';

  return (
    <div className="min-h-screen py-8 px-4" style={{ backgroundColor: bgColor }}>
      <Head>
        <title>{form.title} | CYBEV Forms</title>
        <meta name="description" content={form.description || ''} />
      </Head>

      <div className="max-w-2xl mx-auto">
        {/* Progress Bar */}
        {form.settings?.showProgressBar && (
          <div className="mb-6">
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full transition-all duration-300"
                style={{
                  width: `${calculateProgress()}%`,
                  backgroundColor: primaryColor
                }}
              />
            </div>
            <p className="text-sm text-gray-500 mt-2 text-right">
              {calculateProgress()}% complete
            </p>
          </div>
        )}

        {/* Form Header */}
        <div
          className="bg-white rounded-xl shadow-sm overflow-hidden mb-6"
          style={{ borderTopColor: primaryColor, borderTopWidth: '4px' }}
        >
          {form.branding?.headerImage && (
            <img
              src={form.branding.headerImage}
              alt=""
              className="w-full h-40 object-cover"
            />
          )}
          <div className="p-6">
            {form.branding?.logo && (
              <img src={form.branding.logo} alt="" className="h-12 mb-4" />
            )}
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{form.title}</h1>
            {form.description && (
              <p className="text-gray-500">{form.description}</p>
            )}
            {form.settings?.requireLogin && !localStorage.getItem('token') && (
              <div className="mt-4 p-4 bg-amber-50 rounded-lg border border-amber-200">
                <p className="text-amber-700 text-sm">
                  This form requires you to be logged in.{' '}
                  <Link href="/auth/login" className="font-medium underline">
                    Sign in
                  </Link>
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Form Fields */}
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            {form.fields?.map((field, index) => (
              <div
                key={field.id}
                id={`field-${field.id}`}
                className={`bg-white rounded-xl shadow-sm p-6 transition ${
                  errors[field.id] ? 'ring-2 ring-red-500' : ''
                }`}
              >
                <label className="block font-medium text-gray-900 mb-1">
                  {field.label}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </label>
                {field.helpText && (
                  <p className="text-sm text-gray-500 mb-3">{field.helpText}</p>
                )}

                <FormField
                  field={field}
                  value={formData[field.id]}
                  onChange={(value) => updateField(field.id, value)}
                  onCheckboxChange={(option, checked) => handleCheckboxChange(field.id, option, checked)}
                  primaryColor={primaryColor}
                  error={errors[field.id]}
                />

                {errors[field.id] && (
                  <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors[field.id]}
                  </p>
                )}
              </div>
            ))}
          </div>

          {/* Submit Error */}
          {errors.submit && (
            <div className="mt-4 p-4 bg-red-50 rounded-lg border border-red-200">
              <p className="text-red-700 text-sm flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                {errors.submit}
              </p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={submitting || (form.settings?.requireLogin && !localStorage.getItem('token'))}
            className="w-full mt-6 py-4 text-white rounded-xl font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            style={{ backgroundColor: primaryColor }}
          >
            {submitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Submitting...
              </>
            ) : (
              'Submit'
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-400">
            Powered by{' '}
            <Link href="https://cybev.io" className="font-medium hover:underline" style={{ color: primaryColor }}>
              CYBEV
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

// Form Field Component
function FormField({ field, value, onChange, onCheckboxChange, primaryColor, error }) {
  switch (field.type) {
    case 'text':
    case 'email':
    case 'phone':
    case 'url':
      return (
        <input
          type={field.type === 'email' ? 'email' : field.type === 'phone' ? 'tel' : field.type === 'url' ? 'url' : 'text'}
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder}
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent transition ${
            error ? 'border-red-300' : 'border-gray-200'
          }`}
          style={{ '--tw-ring-color': primaryColor }}
        />
      );

    case 'textarea':
      return (
        <textarea
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder}
          rows={4}
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent transition resize-none ${
            error ? 'border-red-300' : 'border-gray-200'
          }`}
          style={{ '--tw-ring-color': primaryColor }}
        />
      );

    case 'number':
      return (
        <input
          type="number"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder}
          min={field.validation?.min}
          max={field.validation?.max}
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent transition ${
            error ? 'border-red-300' : 'border-gray-200'
          }`}
          style={{ '--tw-ring-color': primaryColor }}
        />
      );

    case 'date':
      return (
        <div className="relative">
          <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="date"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            className={`w-full pl-12 pr-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent transition ${
              error ? 'border-red-300' : 'border-gray-200'
            }`}
            style={{ '--tw-ring-color': primaryColor }}
          />
        </div>
      );

    case 'time':
      return (
        <div className="relative">
          <Clock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="time"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            className={`w-full pl-12 pr-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent transition ${
              error ? 'border-red-300' : 'border-gray-200'
            }`}
            style={{ '--tw-ring-color': primaryColor }}
          />
        </div>
      );

    case 'select':
      return (
        <select
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent transition ${
            error ? 'border-red-300' : 'border-gray-200'
          }`}
          style={{ '--tw-ring-color': primaryColor }}
        >
          <option value="">Select an option</option>
          {field.options?.map((opt, i) => (
            <option key={i} value={opt}>{opt}</option>
          ))}
        </select>
      );

    case 'multiselect':
      return (
        <select
          multiple
          value={value || []}
          onChange={(e) => onChange(Array.from(e.target.selectedOptions, option => option.value))}
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent transition min-h-[120px] ${
            error ? 'border-red-300' : 'border-gray-200'
          }`}
          style={{ '--tw-ring-color': primaryColor }}
        >
          {field.options?.map((opt, i) => (
            <option key={i} value={opt}>{opt}</option>
          ))}
        </select>
      );

    case 'radio':
      return (
        <div className="space-y-3">
          {field.options?.map((opt, i) => (
            <label key={i} className="flex items-center gap-3 cursor-pointer group">
              <input
                type="radio"
                name={field.id}
                value={opt}
                checked={value === opt}
                onChange={(e) => onChange(e.target.value)}
                className="w-5 h-5 border-2 border-gray-300"
                style={{ accentColor: primaryColor }}
              />
              <span className="text-gray-700 group-hover:text-gray-900">{opt}</span>
            </label>
          ))}
        </div>
      );

    case 'checkbox':
      return (
        <div className="space-y-3">
          {field.options?.map((opt, i) => (
            <label key={i} className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={(value || []).includes(opt)}
                onChange={(e) => onCheckboxChange(opt, e.target.checked)}
                className="w-5 h-5 rounded border-2 border-gray-300"
                style={{ accentColor: primaryColor }}
              />
              <span className="text-gray-700 group-hover:text-gray-900">{opt}</span>
            </label>
          ))}
        </div>
      );

    case 'rating':
      return (
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map(star => (
            <button
              key={star}
              type="button"
              onClick={() => onChange(star)}
              className="p-1 transition hover:scale-110"
            >
              <Star
                className={`w-8 h-8 transition ${
                  star <= value ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                }`}
              />
            </button>
          ))}
        </div>
      );

    case 'scale':
      return (
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-gray-500">
            <span>1 - Not at all</span>
            <span>10 - Extremely</span>
          </div>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
              <button
                key={num}
                type="button"
                onClick={() => onChange(num)}
                className={`flex-1 py-3 rounded-lg border-2 text-sm font-medium transition ${
                  value === num
                    ? 'text-white border-transparent'
                    : 'border-gray-200 text-gray-700 hover:border-gray-300'
                }`}
                style={{
                  backgroundColor: value === num ? primaryColor : 'white'
                }}
              >
                {num}
              </button>
            ))}
          </div>
        </div>
      );

    case 'file':
    case 'image':
      return (
        <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center hover:border-gray-300 transition cursor-pointer">
          <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-500">Click or drag to upload</p>
          <p className="text-xs text-gray-400 mt-1">
            {field.type === 'image' ? 'PNG, JPG, GIF up to 10MB' : 'Any file up to 10MB'}
          </p>
          <input
            type="file"
            accept={field.type === 'image' ? 'image/*' : '*'}
            onChange={(e) => onChange(e.target.files?.[0]?.name || '')}
            className="hidden"
          />
        </div>
      );

    case 'location':
      return (
        <div className="relative">
          <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Enter address or location"
            className={`w-full pl-12 pr-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent transition ${
              error ? 'border-red-300' : 'border-gray-200'
            }`}
            style={{ '--tw-ring-color': primaryColor }}
          />
        </div>
      );

    default:
      return (
        <input
          type="text"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-4 py-3 border border-gray-200 rounded-lg"
        />
      );
  }
}
