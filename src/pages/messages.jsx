// ============================================
// FILE: src/pages/messages.jsx
// Messages/Chat Page
// ============================================

import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ArrowLeft, Search, Edit, MoreHorizontal, Send, Image as ImageIcon, Smile, Phone, Video, Info, Check, CheckCheck } from 'lucide-react';
import api from '@/lib/api';
import { toast } from 'react-toastify';

function getRelativeTime(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  
  if (diffMins < 1) return 'now';
  if (diffMins < 60) return `${diffMins}m`;
  if (diffHours < 24) return `${diffHours}h`;
  if (diffDays < 7) return `${diffDays}d`;
  return date.toLocaleDateString();
}

export default function MessagesPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    } else {
      router.push('/login');
      return;
    }
    fetchConversations();
  }, []);

  const fetchConversations = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('cybev_token');
      const response = await api.get('/api/messages/conversations', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setConversations(response.data?.conversations || []);
    } catch (error) {
      console.log('Fetch conversations error:', error);
      // Demo conversations
      setConversations([
        {
          _id: '1',
          participant: { name: 'John Doe', username: 'johndoe', profilePicture: null },
          lastMessage: { content: 'Hey, how are you?', createdAt: new Date().toISOString() },
          unreadCount: 2
        },
        {
          _id: '2',
          participant: { name: 'Jane Smith', username: 'janesmith', profilePicture: null },
          lastMessage: { content: 'Great blog post!', createdAt: new Date(Date.now() - 3600000).toISOString() },
          unreadCount: 0
        }
      ]);
    }
    setLoading(false);
  };

  const openChat = async (conversation) => {
    setActiveChat(conversation);
    // Fetch messages for this conversation
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('cybev_token');
      const response = await api.get(`/api/messages/${conversation._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessages(response.data?.messages || []);
    } catch (error) {
      // Demo messages
      setMessages([
        { _id: '1', content: 'Hey!', sender: conversation.participant._id, createdAt: new Date(Date.now() - 7200000).toISOString() },
        { _id: '2', content: 'Hi there! How are you?', sender: user?._id, createdAt: new Date(Date.now() - 3600000).toISOString() },
        { _id: '3', content: conversation.lastMessage?.content || 'Great!', sender: conversation.participant._id, createdAt: new Date().toISOString() }
      ]);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeChat) return;

    const tempMessage = {
      _id: Date.now().toString(),
      content: newMessage,
      sender: user?._id,
      createdAt: new Date().toISOString()
    };

    setMessages(prev => [...prev, tempMessage]);
    setNewMessage('');

    try {
      const token = localStorage.getItem('token') || localStorage.getItem('cybev_token');
      await api.post(`/api/messages/${activeChat._id}`, {
        content: newMessage
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (error) {
      console.log('Send message error:', error);
    }
  };

  const filteredConversations = conversations.filter(c => 
    c.participant?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.participant?.username?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Chat View
  if (activeChat) {
    const otherUser = activeChat.participant;
    
    return (
      <>
        <Head>
          <title>Chat with {otherUser?.name} | CYBEV</title>
        </Head>

        <div className="min-h-screen bg-gray-100 flex flex-col">
          {/* Chat Header */}
          <header className="sticky top-0 z-50 bg-white shadow-sm px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button onClick={() => setActiveChat(null)} className="p-2 hover:bg-gray-100 rounded-full">
                  <ArrowLeft className="w-5 h-5 text-gray-700" />
                </button>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center overflow-hidden">
                    {otherUser?.profilePicture ? (
                      <img src={otherUser.profilePicture} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-white font-bold">{otherUser?.name?.[0] || 'U'}</span>
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{otherUser?.name}</p>
                    <p className="text-xs text-green-500">Online</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 hover:bg-gray-100 rounded-full">
                  <Phone className="w-5 h-5 text-gray-600" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-full">
                  <Video className="w-5 h-5 text-gray-600" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-full">
                  <Info className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>
          </header>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((msg, idx) => {
              const isMe = msg.sender === user?._id || msg.sender === user?.id;
              return (
                <div key={msg._id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                    isMe 
                      ? 'bg-purple-600 text-white rounded-br-md' 
                      : 'bg-white text-gray-900 rounded-bl-md shadow-sm'
                  }`}>
                    <p>{msg.content}</p>
                    <div className={`flex items-center justify-end gap-1 mt-1 text-xs ${isMe ? 'text-purple-200' : 'text-gray-400'}`}>
                      <span>{getRelativeTime(msg.createdAt)}</span>
                      {isMe && <CheckCheck className="w-3 h-3" />}
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <form onSubmit={sendMessage} className="sticky bottom-0 bg-white border-t border-gray-200 p-4">
            <div className="flex items-center gap-2">
              <button type="button" className="p-2 hover:bg-gray-100 rounded-full">
                <ImageIcon className="w-5 h-5 text-gray-500" />
              </button>
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 px-4 py-2 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-300"
              />
              <button type="button" className="p-2 hover:bg-gray-100 rounded-full">
                <Smile className="w-5 h-5 text-gray-500" />
              </button>
              <button
                type="submit"
                disabled={!newMessage.trim()}
                className="p-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 disabled:opacity-50"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </form>
        </div>
      </>
    );
  }

  // Conversations List View
  return (
    <>
      <Head>
        <title>Messages | CYBEV</title>
      </Head>

      <div className="min-h-screen bg-gray-100">
        {/* Header */}
        <header className="sticky top-0 z-50 bg-white shadow-sm px-4 py-3">
          <div className="max-w-lg mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/feed">
                <button className="p-2 hover:bg-gray-100 rounded-full">
                  <ArrowLeft className="w-5 h-5 text-gray-700" />
                </button>
              </Link>
              <h1 className="text-xl font-bold text-gray-900">Messages</h1>
            </div>
            <button className="p-2 hover:bg-gray-100 rounded-full">
              <Edit className="w-5 h-5 text-gray-700" />
            </button>
          </div>
        </header>

        {/* Search */}
        <div className="bg-white px-4 py-3 border-b border-gray-200">
          <div className="max-w-lg mx-auto relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search messages..."
              className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-300"
            />
          </div>
        </div>

        <main className="max-w-lg mx-auto">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filteredConversations.length === 0 ? (
            <div className="text-center py-20 px-4">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Send className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Messages Yet</h3>
              <p className="text-gray-500">Start a conversation with someone!</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {filteredConversations.map(conv => (
                <button
                  key={conv._id}
                  onClick={() => openChat(conv)}
                  className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition text-left"
                >
                  <div className="relative">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center overflow-hidden">
                      {conv.participant?.profilePicture ? (
                        <img src={conv.participant.profilePicture} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-white font-bold text-lg">{conv.participant?.name?.[0] || 'U'}</span>
                      )}
                    </div>
                    {/* Online indicator */}
                    <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-white rounded-full" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-gray-900">{conv.participant?.name}</p>
                      <span className="text-xs text-gray-400">{getRelativeTime(conv.lastMessage?.createdAt)}</span>
                    </div>
                    <p className="text-sm text-gray-500 truncate">{conv.lastMessage?.content}</p>
                  </div>
                  {conv.unreadCount > 0 && (
                    <div className="w-6 h-6 bg-purple-600 text-white text-xs font-bold rounded-full flex items-center justify-center">
                      {conv.unreadCount}
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}
        </main>

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
          
          <Link href="/explore">
            <button className="flex flex-col items-center py-2 px-4 text-gray-400">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span className="text-xs mt-1">Explore</span>
            </button>
          </Link>
          
          <Link href="/create">
            <button className="relative -mt-6">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
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
          
          <button className="flex flex-col items-center py-2 px-4 text-purple-600">
            <Send className="w-6 h-6" />
            <span className="text-xs mt-1">Messages</span>
          </button>
        </nav>
      </div>
    </>
  );
}
