// ============================================
// FILE: src/pages/groups.jsx
// Groups Feature - Community Groups
// ============================================

import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { 
  ArrowLeft, Users, Plus, Search, Globe, Lock, 
  Image as ImageIcon, Settings, MoreHorizontal, UserPlus,
  MessageCircle, Bell, ChevronRight, Loader2
} from 'lucide-react';
import api from '@/lib/api';
import { toast } from 'react-toastify';

export default function GroupsPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('discover');
  const [groups, setGroups] = useState([]);
  const [myGroups, setMyGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('cybev_token');
      
      // Fetch all groups
      const response = await api.get('/api/groups', {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      
      if (response.data?.groups) {
        setGroups(response.data.groups);
      }
      
      // Fetch my groups if logged in
      if (token) {
        const myResponse = await api.get('/api/groups/my-groups', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (myResponse.data?.groups) {
          setMyGroups(myResponse.data.groups);
        }
      }
    } catch (error) {
      console.log('Groups fetch error, using demo data');
      // Demo groups
      const demoGroups = [
        {
          _id: '1',
          name: 'CYBEV Creators',
          description: 'A community for content creators on CYBEV',
          coverImage: null,
          membersCount: 156,
          postsCount: 42,
          privacy: 'public',
          category: 'Technology'
        },
        {
          _id: '2',
          name: 'Nigerian Tech Community',
          description: 'Connecting Nigerian tech enthusiasts and developers',
          coverImage: null,
          membersCount: 892,
          postsCount: 234,
          privacy: 'public',
          category: 'Technology'
        },
        {
          _id: '3',
          name: 'Web3 & Blockchain',
          description: 'Discuss cryptocurrency, NFTs, and blockchain technology',
          coverImage: null,
          membersCount: 421,
          postsCount: 89,
          privacy: 'public',
          category: 'Finance'
        },
        {
          _id: '4',
          name: 'Content Marketing Tips',
          description: 'Share and learn content marketing strategies',
          coverImage: null,
          membersCount: 267,
          postsCount: 156,
          privacy: 'public',
          category: 'Marketing'
        }
      ];
      setGroups(demoGroups);
      setMyGroups([demoGroups[0]]);
    }
    setLoading(false);
  };

  const handleJoinGroup = async (groupId) => {
    if (!user) {
      toast.info('Please login to join groups');
      router.push('/login');
      return;
    }

    try {
      const token = localStorage.getItem('token') || localStorage.getItem('cybev_token');
      await api.post(`/api/groups/${groupId}/join`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Joined group!');
      fetchGroups();
    } catch (error) {
      toast.error('Failed to join group');
    }
  };

  const filteredGroups = groups.filter(g => 
    g.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    g.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const tabs = [
    { id: 'discover', label: 'Discover' },
    { id: 'my-groups', label: 'My Groups' },
  ];

  return (
    <>
      <Head>
        <title>Groups | CYBEV</title>
      </Head>

      <div className="min-h-screen bg-gray-100">
        {/* Header */}
        <header className="sticky top-0 z-50 bg-white shadow-sm px-4 py-3">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/feed">
                <button className="p-2 hover:bg-gray-100 rounded-full">
                  <ArrowLeft className="w-5 h-5 text-gray-700" />
                </button>
              </Link>
              <div className="flex items-center gap-2">
                <Users className="w-6 h-6 text-purple-600" />
                <span className="font-bold text-xl text-gray-900">Groups</span>
              </div>
            </div>
            
            <button 
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700"
            >
              <Plus className="w-4 h-4" />
              Create
            </button>
          </div>
        </header>

        {/* Search */}
        <div className="bg-white border-b border-gray-200 px-4 py-3">
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search groups..."
                className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-300"
              />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white border-b border-gray-200 sticky top-14 z-40">
          <div className="max-w-4xl mx-auto px-4">
            <div className="flex gap-6">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 border-b-2 font-semibold transition ${
                    activeTab === tab.id
                      ? 'border-purple-600 text-purple-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab.label}
                  {tab.id === 'my-groups' && myGroups.length > 0 && (
                    <span className="ml-2 px-2 py-0.5 bg-purple-100 text-purple-600 text-xs rounded-full">
                      {myGroups.length}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        <main className="max-w-4xl mx-auto px-4 py-6 pb-24">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
            </div>
          ) : activeTab === 'discover' ? (
            /* Discover Groups */
            <div>
              {/* Categories */}
              <div className="flex gap-2 overflow-x-auto pb-4 mb-4">
                {['All', 'Technology', 'Business', 'Finance', 'Marketing', 'Lifestyle', 'Education'].map(cat => (
                  <button
                    key={cat}
                    className="px-4 py-2 bg-white rounded-full text-sm font-medium text-gray-700 hover:bg-purple-100 hover:text-purple-600 whitespace-nowrap shadow-sm"
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {filteredGroups.length === 0 ? (
                <div className="text-center py-20">
                  <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No Groups Found</h3>
                  <p className="text-gray-500 mb-6">Try a different search or create your own group</p>
                  <button
                    onClick={() => setShowCreateModal(true)}
                    className="px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700"
                  >
                    Create Group
                  </button>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 gap-4">
                  {filteredGroups.map(group => (
                    <div
                      key={group._id}
                      className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition cursor-pointer"
                      onClick={() => router.push(`/groups/${group._id}`)}
                    >
                      {/* Cover */}
                      <div className="h-24 bg-gradient-to-r from-purple-500 to-pink-500 relative">
                        {group.coverImage && (
                          <img src={group.coverImage} alt="" className="w-full h-full object-cover" />
                        )}
                        <div className="absolute top-2 right-2">
                          {group.privacy === 'private' ? (
                            <Lock className="w-4 h-4 text-white" />
                          ) : (
                            <Globe className="w-4 h-4 text-white" />
                          )}
                        </div>
                      </div>
                      
                      {/* Info */}
                      <div className="p-4">
                        <h3 className="font-semibold text-gray-900 line-clamp-1">{group.name}</h3>
                        <p className="text-gray-500 text-sm line-clamp-2 mt-1">{group.description}</p>
                        
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center gap-3 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <Users className="w-3 h-3" />
                              {group.membersCount || 0}
                            </span>
                            <span className="flex items-center gap-1">
                              <MessageCircle className="w-3 h-3" />
                              {group.postsCount || 0} posts
                            </span>
                          </div>
                          
                          <button
                            onClick={(e) => { e.stopPropagation(); handleJoinGroup(group._id); }}
                            className="px-3 py-1 bg-purple-100 text-purple-600 text-sm font-semibold rounded-lg hover:bg-purple-200"
                          >
                            Join
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            /* My Groups */
            <div>
              {myGroups.length === 0 ? (
                <div className="text-center py-20">
                  <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No Groups Yet</h3>
                  <p className="text-gray-500 mb-6">Join or create a group to get started</p>
                  <button
                    onClick={() => setActiveTab('discover')}
                    className="px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700"
                  >
                    Discover Groups
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {myGroups.map(group => (
                    <div
                      key={group._id}
                      className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition cursor-pointer flex items-center gap-4"
                      onClick={() => router.push(`/groups/${group._id}`)}
                    >
                      <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex-shrink-0 overflow-hidden">
                        {group.coverImage ? (
                          <img src={group.coverImage} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Users className="w-8 h-8 text-white" />
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900">{group.name}</h3>
                        <p className="text-gray-500 text-sm">{group.membersCount || 0} members</p>
                      </div>
                      
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </main>

        {/* Create Group Modal */}
        {showCreateModal && (
          <CreateGroupModal 
            onClose={() => setShowCreateModal(false)} 
            onSuccess={() => { setShowCreateModal(false); fetchGroups(); }}
          />
        )}

        {/* Bottom Navigation */}
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 flex items-center justify-around z-50">
          <Link href="/feed">
            <button className="flex flex-col items-center py-2 px-4 text-gray-400">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span className="text-xs mt-1">Feed</span>
            </button>
          </Link>
          
          <button className="flex flex-col items-center py-2 px-4 text-purple-600">
            <Users className="w-6 h-6" />
            <span className="text-xs mt-1">Groups</span>
          </button>
          
          <Link href="/create">
            <button className="relative -mt-6">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
                <Plus className="w-7 h-7 text-white" />
              </div>
            </button>
          </Link>
          
          <Link href="/tv">
            <button className="flex flex-col items-center py-2 px-4 text-gray-400">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span className="text-xs mt-1">TV</span>
            </button>
          </Link>
          
          <Link href="/menu">
            <button className="flex flex-col items-center py-2 px-4 text-gray-400">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <span className="text-xs mt-1">Menu</span>
            </button>
          </Link>
        </nav>
      </div>
    </>
  );
}

// Create Group Modal Component
function CreateGroupModal({ onClose, onSuccess }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [privacy, setPrivacy] = useState('public');
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!name.trim()) {
      toast.error('Please enter a group name');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('cybev_token');
      await api.post('/api/groups', {
        name,
        description,
        privacy
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Group created!');
      onSuccess();
    } catch (error) {
      toast.error('Failed to create group');
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl w-full max-w-md">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">Create Group</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-4 space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Group Name *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter group name"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What's this group about?"
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-purple-300"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">Privacy</label>
            <div className="flex gap-3">
              <button
                onClick={() => setPrivacy('public')}
                className={`flex-1 py-2 rounded-lg border-2 transition ${
                  privacy === 'public'
                    ? 'border-purple-600 bg-purple-50 text-purple-600'
                    : 'border-gray-200 text-gray-600'
                }`}
              >
                <Globe className="w-4 h-4 mx-auto mb-1" />
                <span className="text-sm font-medium">Public</span>
              </button>
              <button
                onClick={() => setPrivacy('private')}
                className={`flex-1 py-2 rounded-lg border-2 transition ${
                  privacy === 'private'
                    ? 'border-purple-600 bg-purple-50 text-purple-600'
                    : 'border-gray-200 text-gray-600'
                }`}
              >
                <Lock className="w-4 h-4 mx-auto mb-1" />
                <span className="text-sm font-medium">Private</span>
              </button>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-gray-200 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            disabled={loading || !name.trim()}
            className="flex-1 py-2 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            Create
          </button>
        </div>
      </div>
    </div>
  );
}
