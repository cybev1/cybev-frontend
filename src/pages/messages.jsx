// ============================================
// FILE: src/pages/messages.jsx
// CYBEV Messages - Clean White Design v7.0
// ============================================

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import AppLayout from '@/components/Layout/AppLayout';
import api from '@/lib/api';
import { MessageCircle, Search, Edit, Send, Phone, Video, MoreHorizontal, Loader2, Check, CheckCheck } from 'lucide-react';

export default function MessagesPage() {
  const router = useRouter();
  const [conversations, setConversations] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => { fetchConversations(); }, []);

  const fetchConversations = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) { router.push('/auth/login'); return; }
      const res = await api.get('/api/messages/conversations', { headers: { Authorization: `Bearer ${token}` } });
      setConversations(res.data.conversations || res.data || []);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedChat) return;
    try {
      const token = localStorage.getItem('token');
      await api.post('/api/messages/send', { conversationId: selectedChat._id, content: newMessage }, { headers: { Authorization: `Bearer ${token}` } });
      setMessages([...messages, { content: newMessage, sender: 'me', createdAt: new Date() }]);
      setNewMessage('');
    } catch (err) { console.error(err); }
  };

  return (
    <AppLayout>
      <Head><title>Messages | CYBEV</title></Head>
      <div className="min-h-screen bg-gray-100">
        <div className="max-w-5xl mx-auto">
          <div className="flex h-[calc(100vh-64px)]">
            {/* Sidebar */}
            <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
              <div className="p-4 border-b border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <h1 className="text-xl font-bold text-gray-900">Messages</h1>
                  <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <Edit className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Search messages" className="w-full pl-9 pr-4 py-2 bg-gray-100 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all text-gray-900" />
                </div>
              </div>
              <div className="flex-1 overflow-y-auto">
                {loading ? (
                  <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 text-purple-600 animate-spin" /></div>
                ) : conversations.length === 0 ? (
                  <div className="text-center py-12 px-4">
                    <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No messages yet</p>
                  </div>
                ) : (
                  conversations.map(conv => (
                    <div key={conv._id} onClick={() => setSelectedChat(conv)}
                      className={`flex items-center gap-3 p-4 hover:bg-gray-50 cursor-pointer transition-colors ${selectedChat?._id === conv._id ? 'bg-purple-50' : ''}`}>
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold overflow-hidden">
                        {conv.participant?.profilePicture ? (
                          <img src={conv.participant.profilePicture} alt="" className="w-full h-full object-cover" />
                        ) : (
                          conv.participant?.name?.[0] || '?'
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="font-semibold text-gray-900 truncate">{conv.participant?.name}</p>
                          <span className="text-xs text-gray-400">{new Date(conv.lastMessage?.createdAt).toLocaleDateString()}</span>
                        </div>
                        <p className="text-sm text-gray-500 truncate">{conv.lastMessage?.content}</p>
                      </div>
                      {conv.unreadCount > 0 && (
                        <div className="w-5 h-5 bg-purple-600 rounded-full flex items-center justify-center">
                          <span className="text-xs text-white font-bold">{conv.unreadCount}</span>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col bg-white">
              {selectedChat ? (
                <>
                  {/* Header */}
                  <div className="flex items-center justify-between p-4 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold overflow-hidden">
                        {selectedChat.participant?.name?.[0]}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{selectedChat.participant?.name}</p>
                        <p className="text-xs text-green-500">Online</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="p-2 hover:bg-gray-100 rounded-full"><Phone className="w-5 h-5 text-gray-600" /></button>
                      <button className="p-2 hover:bg-gray-100 rounded-full"><Video className="w-5 h-5 text-gray-600" /></button>
                      <button className="p-2 hover:bg-gray-100 rounded-full"><MoreHorizontal className="w-5 h-5 text-gray-600" /></button>
                    </div>
                  </div>
                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map((msg, i) => (
                      <div key={i} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-xs px-4 py-2 rounded-2xl ${msg.sender === 'me' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-900'}`}>
                          <p>{msg.content}</p>
                          <div className={`flex items-center justify-end gap-1 mt-1 ${msg.sender === 'me' ? 'text-purple-200' : 'text-gray-400'}`}>
                            <span className="text-xs">{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            {msg.sender === 'me' && <CheckCheck className="w-3 h-3" />}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  {/* Input */}
                  <div className="p-4 border-t border-gray-100">
                    <div className="flex items-center gap-3">
                      <input type="text" value={newMessage} onChange={e => setNewMessage(e.target.value)}
                        onKeyPress={e => e.key === 'Enter' && sendMessage()} placeholder="Type a message..."
                        className="flex-1 px-4 py-3 bg-gray-100 rounded-full focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all text-gray-900" />
                      <button onClick={sendMessage} disabled={!newMessage.trim()}
                        className="p-3 bg-purple-600 text-white rounded-full hover:bg-purple-700 disabled:opacity-50 transition-colors">
                        <Send className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="font-semibold text-gray-900 mb-2">Select a conversation</h3>
                    <p className="text-gray-500">Choose from your existing conversations or start a new one</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
