// ============================================
// FILE: src/pages/groups/index.jsx
// CYBEV Groups - Clean White Design v7.0
// ============================================

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import AppLayout from '@/components/Layout/AppLayout';
import api from '@/lib/api';
import { Users, Search, Plus, Globe, Lock, Loader2, ChevronRight, TrendingUp } from 'lucide-react';

export default function GroupsPage() {
  const router = useRouter();
  const [groups, setGroups] = useState([]);
  const [myGroups, setMyGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('discover');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => { fetchGroups(); }, []);

  const fetchGroups = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await api.get('/api/groups', { headers });
      setGroups(res.data.groups || res.data || []);
      if (token) {
        const myRes = await api.get('/api/groups/my', { headers });
        setMyGroups(myRes.data.groups || myRes.data || []);
      }
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const tabs = [
    { id: 'discover', label: 'Discover' },
    { id: 'my-groups', label: 'My Groups' },
  ];

  const displayedGroups = activeTab === 'my-groups' ? myGroups : groups;
  const filteredGroups = displayedGroups.filter(g => g.name?.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <AppLayout>
      <Head><title>Groups | CYBEV</title></Head>
      <div className="min-h-screen bg-gray-100">
        <div className="max-w-4xl mx-auto px-4 py-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Groups</h1>
              <p className="text-gray-500">Connect with communities</p>
            </div>
            <div className="flex gap-3">
              <div className="relative flex-1 md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search groups..." className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900" />
              </div>
              <Link href="/groups/create">
                <button className="px-4 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold shadow-lg hover:opacity-90 flex items-center gap-2">
                  <Plus className="w-5 h-5" />Create
                </button>
              </Link>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-6">
            {tabs.map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-xl font-medium transition-colors ${
                  activeTab === tab.id ? 'bg-purple-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                }`}>
                {tab.label}
              </button>
            ))}
          </div>

          {/* Grid */}
          {loading ? (
            <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 text-purple-600 animate-spin" /></div>
          ) : filteredGroups.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center">
              <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">{activeTab === 'my-groups' ? 'No groups joined' : 'No groups found'}</h3>
              <p className="text-gray-500 mb-4">{activeTab === 'my-groups' ? 'Join a group to connect with others!' : 'Be the first to create one!'}</p>
              <Link href="/groups/create">
                <button className="px-6 py-3 bg-purple-600 text-white rounded-xl font-semibold">Create Group</button>
              </Link>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {filteredGroups.map(group => (
                <Link key={group._id} href={`/groups/${group._id}`}>
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all cursor-pointer group">
                    <div className="h-24 bg-gradient-to-r from-purple-500 to-pink-500 relative">
                      {group.coverImage && <img src={group.coverImage} alt="" className="w-full h-full object-cover" />}
                    </div>
                    <div className="p-4">
                      <div className="flex items-start gap-3 -mt-8">
                        <div className="w-16 h-16 rounded-xl bg-white border-4 border-white shadow-md overflow-hidden">
                          {group.avatar ? (
                            <img src={group.avatar} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-xl font-bold">
                              {group.name?.[0]}
                            </div>
                          )}
                        </div>
                      </div>
                      <h3 className="font-bold text-gray-900 mt-2 group-hover:text-purple-600 transition-colors">{group.name}</h3>
                      <p className="text-sm text-gray-500 line-clamp-2 mt-1">{group.description}</p>
                      <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          {group.isPrivate ? <Lock className="w-4 h-4" /> : <Globe className="w-4 h-4" />}
                          {group.isPrivate ? 'Private' : 'Public'}
                        </span>
                        <span className="flex items-center gap-1"><Users className="w-4 h-4" />{group.membersCount || 0} members</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
