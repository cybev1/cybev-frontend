// ============================================
// FILE: src/pages/studio/campaigns/automation/new.jsx
// CYBEV Automation Workflow Builder
// VERSION: 1.0.0 - Visual Workflow Editor
// ============================================

import { useState, useEffect, useCallback, useRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import AppLayout from '@/components/Layout/AppLayout';
import {
  ArrowLeft, Save, Play, Pause, Plus, Trash2, Settings, Mail,
  Clock, GitBranch, Zap, Users, Tag, List, Bell, Gift, ShoppingCart,
  Calendar, Heart, UserPlus, X, Check, Loader2, ChevronRight,
  ChevronDown, Edit2, Copy, MoreHorizontal, Target, TrendingUp,
  MousePointer, Sparkles, Info
} from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.cybev.io';

// ==========================================
// TRIGGER TYPES
// ==========================================

const TRIGGER_TYPES = [
  { id: 'list_signup', name: 'List Sign-up', icon: UserPlus, description: 'When someone joins a list', color: 'blue' },
  { id: 'form_submit', name: 'Form Submission', icon: Target, description: 'When a form is submitted', color: 'purple' },
  { id: 'tag_added', name: 'Tag Added', icon: Tag, description: 'When a tag is added to contact', color: 'green' },
  { id: 'purchase', name: 'Purchase', icon: ShoppingCart, description: 'When someone makes a purchase', color: 'orange' },
  { id: 'abandoned_cart', name: 'Abandoned Cart', icon: ShoppingCart, description: 'When cart is abandoned', color: 'red' },
  { id: 'date_property', name: 'Date Property', icon: Calendar, description: 'Birthday, anniversary, etc.', color: 'pink' },
  { id: 'inactivity', name: 'Inactivity', icon: Clock, description: 'No engagement for X days', color: 'gray' },
];

// ==========================================
// STEP TYPES
// ==========================================

const STEP_TYPES = [
  { id: 'email', name: 'Send Email', icon: Mail, description: 'Send an email to the contact', color: 'purple' },
  { id: 'delay', name: 'Wait / Delay', icon: Clock, description: 'Wait before next step', color: 'blue' },
  { id: 'condition', name: 'Condition', icon: GitBranch, description: 'Split based on condition', color: 'orange' },
  { id: 'action', name: 'Action', icon: Zap, description: 'Add tag, update field, etc.', color: 'green' },
];

// ==========================================
// TEMPLATES
// ==========================================

const TEMPLATES = [
  { 
    id: 'welcome', 
    name: 'Welcome Series', 
    icon: '👋', 
    description: '3-email welcome sequence for new subscribers',
    steps: 3
  },
  { 
    id: 'abandoned_cart', 
    name: 'Abandoned Cart', 
    icon: '🛒', 
    description: 'Recover abandoned carts with timely reminders',
    steps: 2
  },
  { 
    id: 'birthday', 
    name: 'Birthday', 
    icon: '🎂', 
    description: 'Send birthday wishes and special offers',
    steps: 1
  },
  { 
    id: 'win_back', 
    name: 'Win-Back', 
    icon: '💔', 
    description: 'Re-engage inactive subscribers',
    steps: 2
  },
  { 
    id: 'post_purchase', 
    name: 'Post-Purchase', 
    icon: '📦', 
    description: 'Thank customers and request reviews',
    steps: 3
  },
];

export default function AutomationBuilder() {
  const router = useRouter();
  const { id, template } = router.query;
  
  const [automation, setAutomation] = useState({
    name: 'New Automation',
    description: '',
    trigger: { type: 'list_signup' },
    steps: [],
    settings: {}
  });
  
  const [loading, setLoading] = useState(!!id);
  const [saving, setSaving] = useState(false);
  const [selectedStep, setSelectedStep] = useState(null);
  const [showAddStep, setShowAddStep] = useState(false);
  const [addStepAfter, setAddStepAfter] = useState(null);
  const [showTriggerConfig, setShowTriggerConfig] = useState(false);
  const [lists, setLists] = useState([]);
  const [forms, setForms] = useState([]);

  useEffect(() => {
    fetchLists();
    fetchForms();
    
    if (id && id !== 'new') {
      fetchAutomation(id);
    } else if (template) {
      loadTemplate(template);
    } else {
      setLoading(false);
    }
  }, [id, template]);

  const getAuth = () => {
    const token = localStorage.getItem('token') || localStorage.getItem('cybev_token');
    return { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } };
  };

  const fetchAutomation = async (automationId) => {
    try {
      const res = await fetch(`${API_URL}/api/automations/${automationId}`, getAuth());
      const data = await res.json();
      if (data.automation) {
        setAutomation(data.automation);
      }
    } catch (err) {
      console.error('Fetch automation error:', err);
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

  const fetchForms = async () => {
    try {
      const res = await fetch(`${API_URL}/api/forms`, getAuth());
      const data = await res.json();
      if (data.forms) setForms(data.forms);
    } catch (err) {
      console.error('Fetch forms error:', err);
    }
  };

  const loadTemplate = async (templateId) => {
    try {
      const res = await fetch(`${API_URL}/api/automations`, {
        method: 'POST',
        ...getAuth(),
        body: JSON.stringify({ templateId })
      });
      const data = await res.json();
      if (data.automation) {
        setAutomation(data.automation);
        router.replace(`/studio/campaigns/automation/new?id=${data.automation._id}`, undefined, { shallow: true });
      }
    } catch (err) {
      console.error('Load template error:', err);
    } finally {
      setLoading(false);
    }
  };

  const saveAutomation = async () => {
    setSaving(true);
    try {
      const method = automation._id ? 'PUT' : 'POST';
      const url = automation._id 
        ? `${API_URL}/api/automations/${automation._id}`
        : `${API_URL}/api/automations`;
      
      const res = await fetch(url, {
        method,
        ...getAuth(),
        body: JSON.stringify(automation)
      });
      
      const data = await res.json();
      if (data.automation) {
        setAutomation(data.automation);
        if (!automation._id) {
          router.replace(`/studio/campaigns/automation/new?id=${data.automation._id}`, undefined, { shallow: true });
        }
        alert('Saved successfully!');
      }
    } catch (err) {
      console.error('Save error:', err);
      alert('Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const activateAutomation = async () => {
    if (!automation._id) {
      await saveAutomation();
    }
    
    try {
      const res = await fetch(`${API_URL}/api/automations/${automation._id}/activate`, {
        method: 'POST',
        ...getAuth()
      });
      
      const data = await res.json();
      if (data.automation) {
        setAutomation(data.automation);
        alert('Automation activated!');
      } else {
        alert(data.error || 'Failed to activate');
      }
    } catch (err) {
      alert('Failed to activate automation');
    }
  };

  const pauseAutomation = async () => {
    try {
      const res = await fetch(`${API_URL}/api/automations/${automation._id}/pause`, {
        method: 'POST',
        ...getAuth()
      });
      
      const data = await res.json();
      if (data.automation) {
        setAutomation(data.automation);
      }
    } catch (err) {
      alert('Failed to pause automation');
    }
  };

  const addStep = (type, afterId = null) => {
    const newStep = {
      id: `step_${Date.now()}`,
      type,
      position: { x: 250, y: automation.steps.length * 120 + 200 },
      config: getDefaultConfig(type),
      nextSteps: []
    };
    
    const newSteps = [...automation.steps];
    
    if (afterId) {
      const afterIndex = newSteps.findIndex(s => s.id === afterId);
      if (afterIndex !== -1) {
        // Update the previous step to point to the new one
        newSteps[afterIndex].nextSteps = [newStep.id];
        newSteps.splice(afterIndex + 1, 0, newStep);
      }
    } else {
      if (newSteps.length > 0) {
        newSteps[newSteps.length - 1].nextSteps = [newStep.id];
      }
      newSteps.push(newStep);
    }
    
    setAutomation({ ...automation, steps: newSteps });
    setShowAddStep(false);
    setAddStepAfter(null);
    setSelectedStep(newStep.id);
  };

  const removeStep = (stepId) => {
    const newSteps = automation.steps.filter(s => s.id !== stepId);
    // Update references
    newSteps.forEach(step => {
      step.nextSteps = step.nextSteps.filter(id => id !== stepId);
    });
    setAutomation({ ...automation, steps: newSteps });
    if (selectedStep === stepId) setSelectedStep(null);
  };

  const updateStep = (stepId, updates) => {
    const newSteps = automation.steps.map(step => 
      step.id === stepId ? { ...step, ...updates } : step
    );
    setAutomation({ ...automation, steps: newSteps });
  };

  const getDefaultConfig = (type) => {
    switch (type) {
      case 'email':
        return { subject: '', html: '', previewText: '' };
      case 'delay':
        return { delayType: 'fixed', delayValue: 1, delayUnit: 'days' };
      case 'condition':
        return { conditionType: 'email_opened', yesPath: '', noPath: '' };
      case 'action':
        return { actionType: 'add_tag', tagName: '' };
      default:
        return {};
    }
  };

  const triggerConfig = TRIGGER_TYPES.find(t => t.id === automation.trigger?.type);

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-screen">
          <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
        </div>
      </AppLayout>
    );
  }

  return (
    <>
      <Head>
        <title>{automation.name} - Automation Builder - CYBEV</title>
      </Head>

      <div className="h-screen flex flex-col bg-gray-100">
        {/* Top Bar */}
        <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/studio/campaigns/automation')}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <input
                type="text"
                value={automation.name}
                onChange={(e) => setAutomation({ ...automation, name: e.target.value })}
                className="font-semibold text-lg border-none focus:ring-0 p-0 bg-transparent"
                placeholder="Automation name"
              />
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                  automation.status === 'active' ? 'bg-green-100 text-green-700' :
                  automation.status === 'paused' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-gray-100 text-gray-600'
                }`}>
                  {automation.status || 'draft'}
                </span>
                {automation.stats?.totalEntered > 0 && (
                  <span>{automation.stats.totalEntered} contacts entered</span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={saveAutomation}
              disabled={saving}
              className="px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center gap-2"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Save
            </button>
            {automation.status === 'active' ? (
              <button
                onClick={pauseAutomation}
                className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 flex items-center gap-2"
              >
                <Pause className="w-4 h-4" />
                Pause
              </button>
            ) : (
              <button
                onClick={activateAutomation}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
              >
                <Play className="w-4 h-4" />
                Activate
              </button>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Workflow Canvas */}
          <div className="flex-1 overflow-auto p-8">
            <div className="max-w-xl mx-auto space-y-4">
              {/* Trigger */}
              <div
                onClick={() => setShowTriggerConfig(true)}
                className="bg-white rounded-xl border-2 border-blue-200 p-4 cursor-pointer hover:shadow-lg transition"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-xl bg-${triggerConfig?.color || 'blue'}-100 flex items-center justify-center`}>
                    {triggerConfig?.icon && <triggerConfig.icon className={`w-6 h-6 text-${triggerConfig.color}-600`} />}
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-blue-600 font-medium uppercase">Trigger</p>
                    <h3 className="font-semibold text-gray-900">{triggerConfig?.name || 'Select trigger'}</h3>
                    <p className="text-sm text-gray-500">{triggerConfig?.description}</p>
                  </div>
                  <Settings className="w-5 h-5 text-gray-400" />
                </div>
              </div>

              {/* Connector */}
              <div className="flex justify-center">
                <div className="w-0.5 h-8 bg-gray-300"></div>
              </div>

              {/* Steps */}
              {automation.steps.map((step, index) => {
                const stepType = STEP_TYPES.find(t => t.id === step.type);
                const Icon = stepType?.icon || Zap;
                
                return (
                  <div key={step.id}>
                    <div
                      onClick={() => setSelectedStep(step.id)}
                      className={`bg-white rounded-xl border-2 p-4 cursor-pointer hover:shadow-lg transition ${
                        selectedStep === step.id ? 'border-purple-500 ring-2 ring-purple-200' : 'border-gray-200'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-xl bg-${stepType?.color || 'gray'}-100 flex items-center justify-center`}>
                          <Icon className={`w-6 h-6 text-${stepType?.color || 'gray'}-600`} />
                        </div>
                        <div className="flex-1">
                          <p className={`text-xs text-${stepType?.color || 'gray'}-600 font-medium uppercase`}>
                            {stepType?.name || step.type}
                          </p>
                          <h3 className="font-semibold text-gray-900">
                            {step.type === 'email' && (step.config?.subject || 'Configure email')}
                            {step.type === 'delay' && `Wait ${step.config?.delayValue || 1} ${step.config?.delayUnit || 'days'}`}
                            {step.type === 'condition' && (step.config?.conditionType || 'Set condition')}
                            {step.type === 'action' && (step.config?.actionType?.replace('_', ' ') || 'Set action')}
                          </h3>
                        </div>
                        <button
                          onClick={(e) => { e.stopPropagation(); removeStep(step.id); }}
                          className="p-2 hover:bg-red-100 rounded-lg text-gray-400 hover:text-red-500"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Connector with add button */}
                    <div className="flex flex-col items-center py-2">
                      <div className="w-0.5 h-4 bg-gray-300"></div>
                      <button
                        onClick={() => { setAddStepAfter(step.id); setShowAddStep(true); }}
                        className="w-8 h-8 rounded-full bg-white border-2 border-dashed border-gray-300 flex items-center justify-center hover:border-purple-500 hover:bg-purple-50 transition"
                      >
                        <Plus className="w-4 h-4 text-gray-400" />
                      </button>
                      <div className="w-0.5 h-4 bg-gray-300"></div>
                    </div>
                  </div>
                );
              })}

              {/* Add First Step Button */}
              {automation.steps.length === 0 && (
                <button
                  onClick={() => setShowAddStep(true)}
                  className="w-full bg-white rounded-xl border-2 border-dashed border-gray-300 p-8 flex flex-col items-center gap-2 hover:border-purple-500 hover:bg-purple-50 transition"
                >
                  <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                    <Plus className="w-6 h-6 text-purple-600" />
                  </div>
                  <span className="font-medium text-gray-700">Add your first step</span>
                </button>
              )}

              {/* End Node */}
              {automation.steps.length > 0 && (
                <div className="flex justify-center">
                  <div className="px-4 py-2 bg-gray-100 rounded-full text-sm text-gray-600 font-medium">
                    End of workflow
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Panel - Step Config */}
          {selectedStep && (
            <div className="w-96 bg-white border-l border-gray-200 overflow-auto">
              <StepConfigPanel
                step={automation.steps.find(s => s.id === selectedStep)}
                onUpdate={(updates) => updateStep(selectedStep, updates)}
                onClose={() => setSelectedStep(null)}
                lists={lists}
              />
            </div>
          )}
        </div>
      </div>

      {/* Add Step Modal */}
      {showAddStep && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-lg font-semibold">Add Step</h3>
              <button onClick={() => { setShowAddStep(false); setAddStepAfter(null); }} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 grid gap-3">
              {STEP_TYPES.map(type => {
                const Icon = type.icon;
                return (
                  <button
                    key={type.id}
                    onClick={() => addStep(type.id, addStepAfter)}
                    className="flex items-center gap-4 p-4 rounded-xl border border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition text-left"
                  >
                    <div className={`w-12 h-12 rounded-xl bg-${type.color}-100 flex items-center justify-center`}>
                      <Icon className={`w-6 h-6 text-${type.color}-600`} />
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

      {/* Trigger Config Modal */}
      {showTriggerConfig && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-lg font-semibold">Configure Trigger</h3>
              <button onClick={() => setShowTriggerConfig(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Trigger Type</label>
                <div className="grid gap-2">
                  {TRIGGER_TYPES.map(type => {
                    const Icon = type.icon;
                    return (
                      <button
                        key={type.id}
                        onClick={() => setAutomation({ 
                          ...automation, 
                          trigger: { ...automation.trigger, type: type.id } 
                        })}
                        className={`flex items-center gap-3 p-3 rounded-xl border-2 text-left transition ${
                          automation.trigger?.type === type.id
                            ? 'border-purple-500 bg-purple-50'
                            : 'border-gray-200 hover:border-purple-300'
                        }`}
                      >
                        <Icon className={`w-5 h-5 text-${type.color}-600`} />
                        <div>
                          <h4 className="font-medium text-gray-900">{type.name}</h4>
                          <p className="text-xs text-gray-500">{type.description}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Trigger-specific settings */}
              {automation.trigger?.type === 'list_signup' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Select List</label>
                  <select
                    value={automation.trigger?.listId || ''}
                    onChange={(e) => setAutomation({
                      ...automation,
                      trigger: { ...automation.trigger, listId: e.target.value }
                    })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                  >
                    <option value="">Any list</option>
                    {lists.map(list => (
                      <option key={list._id} value={list._id}>{list.name}</option>
                    ))}
                  </select>
                </div>
              )}

              {automation.trigger?.type === 'inactivity' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Days of Inactivity</label>
                  <input
                    type="number"
                    value={automation.trigger?.inactivityDays || 30}
                    onChange={(e) => setAutomation({
                      ...automation,
                      trigger: { ...automation.trigger, inactivityDays: parseInt(e.target.value) }
                    })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                    min="1"
                  />
                </div>
              )}
            </div>
            <div className="p-6 border-t border-gray-100 flex justify-end">
              <button
                onClick={() => setShowTriggerConfig(false)}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ==========================================
// STEP CONFIG PANEL COMPONENT
// ==========================================

function StepConfigPanel({ step, onUpdate, onClose, lists }) {
  if (!step) return null;

  const updateConfig = (key, value) => {
    onUpdate({ config: { ...step.config, [key]: value } });
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <h3 className="font-semibold">Configure Step</h3>
        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-auto p-4 space-y-4">
        {/* Email Step */}
        {step.type === 'email' && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Subject Line</label>
              <input
                type="text"
                value={step.config?.subject || ''}
                onChange={(e) => updateConfig('subject', e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                placeholder="Enter subject line"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Preview Text</label>
              <input
                type="text"
                value={step.config?.previewText || ''}
                onChange={(e) => updateConfig('previewText', e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                placeholder="Preview text shown in inbox"
              />
            </div>
            <div className="p-4 bg-purple-50 rounded-xl">
              <p className="text-sm text-purple-700">
                <Sparkles className="w-4 h-4 inline mr-1" />
                Email content will be designed in the email editor
              </p>
            </div>
          </>
        )}

        {/* Delay Step */}
        {step.type === 'delay' && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Wait For</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={step.config?.delayValue || 1}
                  onChange={(e) => updateConfig('delayValue', parseInt(e.target.value))}
                  className="w-24 px-3 py-2 border border-gray-200 rounded-lg"
                  min="1"
                />
                <select
                  value={step.config?.delayUnit || 'days'}
                  onChange={(e) => updateConfig('delayUnit', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-200 rounded-lg"
                >
                  <option value="minutes">Minutes</option>
                  <option value="hours">Hours</option>
                  <option value="days">Days</option>
                  <option value="weeks">Weeks</option>
                </select>
              </div>
            </div>
          </>
        )}

        {/* Condition Step */}
        {step.type === 'condition' && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Condition Type</label>
              <select
                value={step.config?.conditionType || 'email_opened'}
                onChange={(e) => updateConfig('conditionType', e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg"
              >
                <option value="email_opened">Email Opened</option>
                <option value="email_clicked">Email Clicked</option>
                <option value="has_tag">Has Tag</option>
              </select>
            </div>
            {step.config?.conditionType === 'has_tag' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tag Name</label>
                <input
                  type="text"
                  value={step.config?.conditionValue || ''}
                  onChange={(e) => updateConfig('conditionValue', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                  placeholder="Enter tag name"
                />
              </div>
            )}
          </>
        )}

        {/* Action Step */}
        {step.type === 'action' && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Action Type</label>
              <select
                value={step.config?.actionType || 'add_tag'}
                onChange={(e) => updateConfig('actionType', e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg"
              >
                <option value="add_tag">Add Tag</option>
                <option value="remove_tag">Remove Tag</option>
                <option value="add_to_list">Add to List</option>
                <option value="remove_from_list">Remove from List</option>
                <option value="update_field">Update Field</option>
              </select>
            </div>
            {(step.config?.actionType === 'add_tag' || step.config?.actionType === 'remove_tag') && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tag Name</label>
                <input
                  type="text"
                  value={step.config?.tagName || ''}
                  onChange={(e) => updateConfig('tagName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                  placeholder="Enter tag name"
                />
              </div>
            )}
            {(step.config?.actionType === 'add_to_list' || step.config?.actionType === 'remove_from_list') && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Select List</label>
                <select
                  value={step.config?.listId || ''}
                  onChange={(e) => updateConfig('listId', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                >
                  <option value="">Select a list</option>
                  {lists.map(list => (
                    <option key={list._id} value={list._id}>{list.name}</option>
                  ))}
                </select>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
