// ============================================
// FILE: pages/church/events/index.jsx
// Events Calendar - List, Calendar View, RSVP
// VERSION: 1.0.0
// ============================================

import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  Calendar, Plus, ChevronLeft, ChevronRight, Clock, MapPin,
  Users, ArrowLeft, Loader2, Grid, List, Filter, Search,
  Video, Globe, Bell, Share2, CheckCircle, XCircle,
  MoreHorizontal, Edit, Trash2, Copy, ExternalLink,
  CalendarDays, Repeat, Star, Heart
} from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.cybev.io';

const eventTypeConfig = {
  service: { label: 'Service', color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400', icon: '⛪' },
  prayer: { label: 'Prayer', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400', icon: '🙏' },
  biblestudy: { label: 'Bible Study', color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400', icon: '📖' },
  outreach: { label: 'Outreach', color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400', icon: '🌍' },
  conference: { label: 'Conference', color: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400', icon: '🎤' },
  seminar: { label: 'Seminar', color: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400', icon: '📚' },
  meeting: { label: 'Meeting', color: 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400', icon: '👥' },
  special: { label: 'Special', color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400', icon: '⭐' },
  crusade: { label: 'Crusade', color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400', icon: '🔥' }
};

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

function EventCard({ event, onView, onEdit, onDelete, isAdmin }) {
  const [showMenu, setShowMenu] = useState(false);
  const config = eventTypeConfig[event.type] || eventTypeConfig.special;
  const isPast = new Date(event.startDate) < new Date();
  const isToday = new Date(event.startDate).toDateString() === new Date().toDateString();

  const formatTime = (date) => new Date(date).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });

  return (
    <div 
      className={`bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700 hover:shadow-lg transition cursor-pointer group ${isPast ? 'opacity-60' : ''}`}
      onClick={() => onView(event)}
    >
      <div className="flex items-start gap-4">
        <div className={`w-14 h-14 rounded-xl flex flex-col items-center justify-center flex-shrink-0 ${isToday ? 'bg-purple-500 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'}`}>
          <span className="text-xs uppercase">{new Date(event.startDate).toLocaleDateString('en-US', { month: 'short' })}</span>
          <span className="text-xl font-bold">{new Date(event.startDate).getDate()}</span>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-xs px-2 py-0.5 rounded-full ${config.color}`}>{config.icon} {config.label}</span>
            {event.isRecurring && <span className="text-xs text-gray-400 flex items-center gap-1"><Repeat className="w-3 h-3" />{event.recurrence}</span>}
            {isToday && <span className="text-xs px-2 py-0.5 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded-full">Today</span>}
          </div>
          <h3 className="font-semibold text-gray-900 dark:text-white mb-1 group-hover:text-purple-600 transition line-clamp-1">{event.title}</h3>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{formatTime(event.startDate)}</span>
            {event.location?.name && <span className="flex items-center gap-1 truncate">{event.isOnline ? <Video className="w-3.5 h-3.5" /> : <MapPin className="w-3.5 h-3.5" />}{event.location.name}</span>}
          </div>
          {event.attendees?.length > 0 && (
            <div className="flex items-center gap-2 mt-2">
              <div className="flex -space-x-2">
                {event.attendees.slice(0, 4).map((a, i) => <img key={i} src={a.user?.profilePicture || '/default-avatar.png'} alt="" className="w-6 h-6 rounded-full border-2 border-white dark:border-gray-800" />)}
              </div>
              <span className="text-xs text-gray-400">{event.attendees.length} attending</span>
            </div>
          )}
        </div>

        {isAdmin && (
          <div className="relative">
            <button onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu); }} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 opacity-0 group-hover:opacity-100 transition">
              <MoreHorizontal className="w-5 h-5 text-gray-400" />
            </button>
            {showMenu && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
                <div className="absolute right-0 top-10 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 py-2 w-40 z-20">
                  <button onClick={(e) => { e.stopPropagation(); onEdit(event); setShowMenu(false); }} className="w-full px-4 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2 text-gray-700 dark:text-gray-300"><Edit className="w-4 h-4" />Edit</button>
                  <button onClick={(e) => { e.stopPropagation(); onDelete(event); setShowMenu(false); }} className="w-full px-4 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2 text-red-600"><Trash2 className="w-4 h-4" />Delete</button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function CalendarGrid({ currentDate, events, onDateClick, onEventClick }) {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const startingDayOfWeek = firstDayOfMonth.getDay();
  const daysInMonth = lastDayOfMonth.getDate();

  const days = [];
  for (let i = 0; i < startingDayOfWeek; i++) days.push({ date: new Date(year, month, -startingDayOfWeek + i + 1), isCurrentMonth: false });
  for (let i = 1; i <= daysInMonth; i++) days.push({ date: new Date(year, month, i), isCurrentMonth: true });
  const remainingDays = 42 - days.length;
  for (let i = 1; i <= remainingDays; i++) days.push({ date: new Date(year, month + 1, i), isCurrentMonth: false });

  const getEventsForDate = (date) => events.filter(e => new Date(e.startDate).toDateString() === date.toDateString());
  const isToday = (date) => date.toDateString() === new Date().toDateString();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden">
      <div className="grid grid-cols-7 bg-gray-50 dark:bg-gray-700/50">
        {daysOfWeek.map(day => <div key={day} className="py-3 text-center text-sm font-medium text-gray-500">{day}</div>)}
      </div>
      <div className="grid grid-cols-7">
        {days.map((day, i) => {
          const dayEvents = getEventsForDate(day.date);
          return (
            <div key={i} onClick={() => onDateClick(day.date)} className={`min-h-[100px] p-2 border-t border-l border-gray-100 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition ${!day.isCurrentMonth ? 'bg-gray-50 dark:bg-gray-800/50' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium mb-1 ${isToday(day.date) ? 'bg-purple-500 text-white' : day.isCurrentMonth ? 'text-gray-900 dark:text-white' : 'text-gray-400'}`}>{day.date.getDate()}</div>
              <div className="space-y-1">
                {dayEvents.slice(0, 3).map((event, j) => {
                  const config = eventTypeConfig[event.type] || eventTypeConfig.special;
                  return <div key={j} onClick={(e) => { e.stopPropagation(); onEventClick(event); }} className={`text-xs px-2 py-1 rounded truncate ${config.color}`}>{event.title}</div>;
                })}
                {dayEvents.length > 3 && <div className="text-xs text-gray-400 pl-2">+{dayEvents.length - 3} more</div>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function CreateEventModal({ isOpen, onClose, orgs, onCreate, loading, editEvent }) {
  const [form, setForm] = useState({ title: '', description: '', type: 'service', organizationId: '', startDate: '', startTime: '10:00', endDate: '', endTime: '12:00', isOnline: false, locationName: '', locationAddress: '', streamUrl: '', isRecurring: false, recurrence: 'weekly', isPublic: true, requireRegistration: false });

  useEffect(() => { if (orgs.length > 0 && !form.organizationId) setForm(f => ({ ...f, organizationId: orgs[0]._id })); }, [orgs]);
  useEffect(() => { if (editEvent) setForm({ title: editEvent.title || '', description: editEvent.description || '', type: editEvent.type || 'service', organizationId: editEvent.organization?._id || '', startDate: editEvent.startDate ? new Date(editEvent.startDate).toISOString().split('T')[0] : '', startTime: editEvent.startDate ? new Date(editEvent.startDate).toTimeString().slice(0, 5) : '10:00', endDate: editEvent.endDate ? new Date(editEvent.endDate).toISOString().split('T')[0] : '', endTime: editEvent.endDate ? new Date(editEvent.endDate).toTimeString().slice(0, 5) : '12:00', isOnline: editEvent.isOnline || false, locationName: editEvent.location?.name || '', locationAddress: editEvent.location?.address || '', streamUrl: editEvent.streamUrl || '', isRecurring: editEvent.isRecurring || false, recurrence: editEvent.recurrence || 'weekly', isPublic: editEvent.isPublic !== false, requireRegistration: editEvent.requireRegistration || false }); }, [editEvent]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const startDateTime = new Date(`${form.startDate}T${form.startTime}`);
    const endDateTime = form.endDate ? new Date(`${form.endDate}T${form.endTime}`) : new Date(`${form.startDate}T${form.endTime}`);
    onCreate({ ...form, startDate: startDateTime.toISOString(), endDate: endDateTime.toISOString(), location: { name: form.locationName, address: form.locationAddress } }, editEvent?._id);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-lg shadow-xl my-8">
        <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2"><Calendar className="w-5 h-5 text-purple-500" />{editEvent ? 'Edit Event' : 'Create Event'}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">✕</button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Event Title *</label><input type="text" value={form.title} onChange={(e) => setForm(f => ({ ...f, title: e.target.value }))} required className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700" placeholder="Sunday Service" /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Event Type</label><select value={form.type} onChange={(e) => setForm(f => ({ ...f, type: e.target.value }))} className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700">{Object.entries(eventTypeConfig).map(([key, config]) => <option key={key} value={key}>{config.icon} {config.label}</option>)}</select></div>
            <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Organization</label><select value={form.organizationId} onChange={(e) => setForm(f => ({ ...f, organizationId: e.target.value }))} className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700">{orgs.map(org => <option key={org._id} value={org._id}>{org.name}</option>)}</select></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Start Date *</label><input type="date" value={form.startDate} onChange={(e) => setForm(f => ({ ...f, startDate: e.target.value, endDate: e.target.value }))} required className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700" /></div>
            <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Start Time *</label><input type="time" value={form.startTime} onChange={(e) => setForm(f => ({ ...f, startTime: e.target.value }))} required className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700" /></div>
            <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">End Date</label><input type="date" value={form.endDate} onChange={(e) => setForm(f => ({ ...f, endDate: e.target.value }))} className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700" /></div>
            <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">End Time</label><input type="time" value={form.endTime} onChange={(e) => setForm(f => ({ ...f, endTime: e.target.value }))} className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700" /></div>
          </div>
          <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label><textarea value={form.description} onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))} rows={2} className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 resize-none" placeholder="Event details..." /></div>
          <div><label className="flex items-center gap-2 mb-3"><input type="checkbox" checked={form.isOnline} onChange={(e) => setForm(f => ({ ...f, isOnline: e.target.checked }))} className="w-4 h-4 rounded border-gray-300 text-purple-600" /><span className="text-sm font-medium text-gray-700 dark:text-gray-300">This is an online event</span></label>{form.isOnline ? <input type="url" value={form.streamUrl} onChange={(e) => setForm(f => ({ ...f, streamUrl: e.target.value }))} className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700" placeholder="https://cybev.io/live/..." /> : <div className="space-y-3"><input type="text" value={form.locationName} onChange={(e) => setForm(f => ({ ...f, locationName: e.target.value }))} className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700" placeholder="Location name" /><input type="text" value={form.locationAddress} onChange={(e) => setForm(f => ({ ...f, locationAddress: e.target.value }))} className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700" placeholder="Full address" /></div>}</div>
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4"><label className="flex items-center gap-2 mb-3"><input type="checkbox" checked={form.isRecurring} onChange={(e) => setForm(f => ({ ...f, isRecurring: e.target.checked }))} className="w-4 h-4 rounded border-gray-300 text-purple-600" /><span className="text-sm font-medium text-gray-700 dark:text-gray-300">Recurring Event</span></label>{form.isRecurring && <select value={form.recurrence} onChange={(e) => setForm(f => ({ ...f, recurrence: e.target.value }))} className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700"><option value="daily">Daily</option><option value="weekly">Weekly</option><option value="biweekly">Bi-weekly</option><option value="monthly">Monthly</option></select>}</div>
          <div className="flex flex-wrap gap-4"><label className="flex items-center gap-2"><input type="checkbox" checked={form.isPublic} onChange={(e) => setForm(f => ({ ...f, isPublic: e.target.checked }))} className="w-4 h-4 rounded border-gray-300 text-purple-600" /><span className="text-sm text-gray-700 dark:text-gray-300">Public event</span></label><label className="flex items-center gap-2"><input type="checkbox" checked={form.requireRegistration} onChange={(e) => setForm(f => ({ ...f, requireRegistration: e.target.checked }))} className="w-4 h-4 rounded border-gray-300 text-purple-600" /><span className="text-sm text-gray-700 dark:text-gray-300">Require RSVP</span></label></div>
        </form>
        <div className="flex gap-3 p-6 border-t border-gray-100 dark:border-gray-700">
          <button type="button" onClick={onClose} className="flex-1 py-3 rounded-xl font-semibold border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700">Cancel</button>
          <button onClick={handleSubmit} disabled={loading || !form.title || !form.startDate} className="flex-1 py-3 rounded-xl font-semibold bg-purple-600 text-white hover:bg-purple-700 disabled:opacity-50 flex items-center justify-center gap-2">{loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Calendar className="w-5 h-5" />{editEvent ? 'Save Changes' : 'Create Event'}</>}</button>
        </div>
      </div>
    </div>
  );
}

function EventDetailModal({ event, onClose, onRsvp, loading }) {
  if (!event) return null;
  const config = eventTypeConfig[event.type] || eventTypeConfig.special;
  const isPast = new Date(event.startDate) < new Date();
  const formatDateTime = (date) => new Date(date).toLocaleString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' });

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-lg shadow-xl">
        <div className="relative h-40 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-t-2xl overflow-hidden">
          <div className="absolute inset-0 flex items-end p-6"><div><span className="text-xs px-2 py-1 rounded-full bg-white/20 text-white mb-2 inline-block">{config.icon} {config.label}</span><h2 className="text-2xl font-bold text-white">{event.title}</h2></div></div>
          <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/30">✕</button>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex items-start gap-3"><div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center flex-shrink-0"><Calendar className="w-5 h-5 text-purple-600 dark:text-purple-400" /></div><div><p className="font-medium text-gray-900 dark:text-white">{formatDateTime(event.startDate)}</p>{event.isRecurring && <span className="text-xs text-purple-600 flex items-center gap-1 mt-1"><Repeat className="w-3 h-3" />Repeats {event.recurrence}</span>}</div></div>
          {(event.location?.name || event.isOnline) && <div className="flex items-start gap-3"><div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center flex-shrink-0">{event.isOnline ? <Video className="w-5 h-5 text-blue-600 dark:text-blue-400" /> : <MapPin className="w-5 h-5 text-blue-600 dark:text-blue-400" />}</div><div><p className="font-medium text-gray-900 dark:text-white">{event.isOnline ? 'Online Event' : event.location.name}</p>{event.location?.address && <p className="text-sm text-gray-500">{event.location.address}</p>}{event.isOnline && event.streamUrl && <a href={event.streamUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-purple-600 hover:underline flex items-center gap-1 mt-1">Join Stream <ExternalLink className="w-3 h-3" /></a>}</div></div>}
          {event.description && <div className="pt-4 border-t border-gray-100 dark:border-gray-700"><p className="text-gray-600 dark:text-gray-400">{event.description}</p></div>}
          {event.attendees?.length > 0 && <div className="pt-4 border-t border-gray-100 dark:border-gray-700"><p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{event.attendees.length} people attending</p><div className="flex -space-x-2">{event.attendees.slice(0, 8).map((a, i) => <img key={i} src={a.user?.profilePicture || '/default-avatar.png'} alt="" className="w-8 h-8 rounded-full border-2 border-white dark:border-gray-800" />)}{event.attendees.length > 8 && <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 border-2 border-white dark:border-gray-800 flex items-center justify-center text-xs font-medium">+{event.attendees.length - 8}</div>}</div></div>}
          <div className="flex gap-3 pt-4">{!isPast && event.requireRegistration && <button onClick={() => onRsvp(event._id, 'going')} disabled={loading} className="flex-1 py-3 rounded-xl font-semibold bg-purple-600 text-white hover:bg-purple-700 disabled:opacity-50 flex items-center justify-center gap-2">{loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Users className="w-5 h-5" />RSVP</>}</button>}<button onClick={() => navigator.clipboard.writeText(`${window.location.origin}/church/events/${event._id}`)} className="px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"><Share2 className="w-5 h-5 text-gray-600 dark:text-gray-300" /></button><button onClick={onClose} className="px-6 py-3 rounded-xl border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 font-medium">Close</button></div>
        </div>
      </div>
    </div>
  );
}

export default function EventsCalendar() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState([]);
  const [myOrgs, setMyOrgs] = useState([]);
  const [selectedOrg, setSelectedOrg] = useState('');
  const [view, setView] = useState('list');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [filter, setFilter] = useState('upcoming');
  const [typeFilter, setTypeFilter] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [editingEvent, setEditingEvent] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const getAuth = () => { const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null; return { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } }; };

  useEffect(() => { fetchOrgs(); }, []);
  useEffect(() => { if (selectedOrg) fetchEvents(); }, [selectedOrg, filter, typeFilter]);

  const fetchOrgs = async () => { try { const res = await fetch(`${API_URL}/api/church/org/my`, getAuth()); const data = await res.json(); if (data.ok && data.orgs?.length > 0) { setMyOrgs(data.orgs); setSelectedOrg(data.orgs[0]._id); } } catch (err) { console.error(err); } };

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ orgId: selectedOrg, ...(filter === 'upcoming' && { upcoming: 'true' }), ...(typeFilter && { type: typeFilter }) });
      const res = await fetch(`${API_URL}/api/church/events?${params}`, getAuth());
      const data = await res.json();
      if (data.ok) setEvents(data.events || []);
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  const handleCreateEvent = async (formData, eventId) => {
    setActionLoading(true);
    try {
      const url = eventId ? `${API_URL}/api/church/events/${eventId}` : `${API_URL}/api/church/events`;
      const res = await fetch(url, { method: eventId ? 'PUT' : 'POST', ...getAuth(), body: JSON.stringify({ ...formData, organization: formData.organizationId }) });
      const data = await res.json();
      if (data.ok) { setShowCreateModal(false); setEditingEvent(null); fetchEvents(); } else alert(data.error || 'Failed to save event');
    } catch (err) { console.error(err); }
    setActionLoading(false);
  };

  const handleDeleteEvent = async (event) => { if (!confirm(`Delete "${event.title}"?`)) return; try { await fetch(`${API_URL}/api/church/events/${event._id}`, { method: 'DELETE', ...getAuth() }); fetchEvents(); } catch (err) { console.error(err); } };

  const handleRsvp = async (eventId, status) => { setActionLoading(true); try { const res = await fetch(`${API_URL}/api/church/events/${eventId}/rsvp`, { method: 'POST', ...getAuth(), body: JSON.stringify({ status }) }); const data = await res.json(); if (data.ok) { fetchEvents(); setSelectedEvent(null); } } catch (err) { console.error(err); } setActionLoading(false); };

  const navigateMonth = (direction) => setCurrentDate(prev => { const d = new Date(prev); d.setMonth(d.getMonth() + direction); return d; });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Head><title>Events Calendar - CYBEV Church</title></Head>
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <Link href="/church" className="inline-flex items-center gap-2 text-purple-200 hover:text-white mb-4"><ArrowLeft className="w-4 h-4" />Back to Dashboard</Link>
          <div className="flex items-center justify-between">
            <div><h1 className="text-3xl font-bold flex items-center gap-3"><Calendar className="w-8 h-8" />Events Calendar</h1><p className="text-purple-100 mt-1">Manage church events and services</p></div>
            <button onClick={() => setShowCreateModal(true)} className="px-6 py-3 bg-white text-purple-600 rounded-xl font-semibold hover:bg-purple-50 flex items-center gap-2 shadow-lg"><Plus className="w-5 h-5" />Create Event</button>
          </div>
          <div className="grid grid-cols-4 gap-4 mt-6">
            <div className="bg-white/10 backdrop-blur rounded-xl p-4"><p className="text-3xl font-bold">{events.filter(e => new Date(e.startDate) >= new Date()).length}</p><p className="text-purple-200 text-sm">Upcoming</p></div>
            <div className="bg-white/10 backdrop-blur rounded-xl p-4"><p className="text-3xl font-bold">{events.filter(e => e.type === 'service').length}</p><p className="text-purple-200 text-sm">Services</p></div>
            <div className="bg-white/10 backdrop-blur rounded-xl p-4"><p className="text-3xl font-bold">{events.filter(e => e.isRecurring).length}</p><p className="text-purple-200 text-sm">Recurring</p></div>
            <div className="bg-white/10 backdrop-blur rounded-xl p-4"><p className="text-3xl font-bold">{events.reduce((sum, e) => sum + (e.attendees?.length || 0), 0)}</p><p className="text-purple-200 text-sm">Total RSVPs</p></div>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700 flex flex-wrap gap-4 items-center">
          <select value={selectedOrg} onChange={(e) => setSelectedOrg(e.target.value)} className="px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700">{myOrgs.map(org => <option key={org._id} value={org._id}>{org.name}</option>)}</select>
          <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700"><option value="">All Types</option>{Object.entries(eventTypeConfig).map(([key, config]) => <option key={key} value={key}>{config.icon} {config.label}</option>)}</select>
          <div className="flex border border-gray-200 dark:border-gray-600 rounded-xl overflow-hidden">{['upcoming', 'all', 'past'].map(f => <button key={f} onClick={() => setFilter(f)} className={`px-4 py-2 capitalize ${filter === f ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30' : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700'}`}>{f}</button>)}</div>
          <div className="flex-1" />
          <div className="flex border border-gray-200 dark:border-gray-600 rounded-xl overflow-hidden"><button onClick={() => setView('list')} className={`px-4 py-2 flex items-center gap-2 ${view === 'list' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30' : 'text-gray-500'}`}><List className="w-4 h-4" />List</button><button onClick={() => setView('calendar')} className={`px-4 py-2 flex items-center gap-2 ${view === 'calendar' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30' : 'text-gray-500'}`}><CalendarDays className="w-4 h-4" />Calendar</button></div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 pb-8">
        {view === 'calendar' && <div className="flex items-center justify-between mb-6"><button onClick={() => navigateMonth(-1)} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"><ChevronLeft className="w-6 h-6 text-gray-600 dark:text-gray-300" /></button><h2 className="text-xl font-bold text-gray-900 dark:text-white">{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</h2><button onClick={() => navigateMonth(1)} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"><ChevronRight className="w-6 h-6 text-gray-600 dark:text-gray-300" /></button></div>}
        {loading ? <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 text-purple-500 animate-spin" /></div> : view === 'calendar' ? <CalendarGrid currentDate={currentDate} events={events} onDateClick={(date) => { setCurrentDate(date); setShowCreateModal(true); }} onEventClick={setSelectedEvent} /> : events.length === 0 ? <div className="bg-white dark:bg-gray-800 rounded-2xl p-12 text-center border border-gray-100 dark:border-gray-700"><Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" /><h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No Events Found</h3><p className="text-gray-500 mb-6">Create your first event to get started</p><button onClick={() => setShowCreateModal(true)} className="px-6 py-3 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700">Create Event</button></div> : <div className="grid gap-4">{events.map(event => <EventCard key={event._id} event={event} onView={setSelectedEvent} onEdit={(e) => { setEditingEvent(e); setShowCreateModal(true); }} onDelete={handleDeleteEvent} isAdmin={true} />)}</div>}
      </div>
      <CreateEventModal isOpen={showCreateModal} onClose={() => { setShowCreateModal(false); setEditingEvent(null); }} orgs={myOrgs} onCreate={handleCreateEvent} loading={actionLoading} editEvent={editingEvent} />
      <EventDetailModal event={selectedEvent} onClose={() => setSelectedEvent(null)} onRsvp={handleRsvp} loading={actionLoading} />
    </div>
  );
}
