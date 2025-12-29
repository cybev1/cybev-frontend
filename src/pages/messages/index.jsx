// ============================================
// FILE: src/pages/messages/index.jsx
// PATH: cybev-frontend/src/pages/messages/index.jsx
// PURPOSE: Chat/Messages page for direct messaging
// ============================================

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import AppLayout from '@/components/Layout/AppLayout';
import {
  MessageCircle,
  Search,
  Send,
  MoreVertical,
  Phone,
  Video,
  Smile,
  Paperclip,
  Image,
  Plus,
  Check,
  CheckCheck,
  ArrowLeft,
  Settings,
  Trash2,
  UserPlus
} from 'lucide-react';
import api from '@/lib/api';

export default function Messages() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [message, setMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [showNewChat, setShowNewChat] = useState(false);
  const messagesEndRef = useRef(null);

  // Sample conversations (replace with API data)
  const sampleConversations = [
    {
      id: '1',
      user: { _id: 'u1', name: 'Sarah Johnson', username: 'sarah_j', avatar: null },
      lastMessage: 'Hey! Love your latest blog post! 🔥',
      time: '2m ago',
      unread: 2,
      online: true
    },
    {
      id: '2',
      user: { _id: 'u2', name: 'Mike Chen', username: 'mikechen', avatar: null },
      lastMessage: 'Thanks for the tip! 🙏',
      time: '1h ago',
      unread: 0,
      online: false
    },
    {
      id: '3',
      user: { _id: 'u3', name: 'Creative Studio', username: 'creativestudio', avatar: null },
      lastMessage: 'Would you like to collaborate?',
      time: '3h ago',
      unread: 1,
      online: true
    },
    {
      id: '4',
      user: { _id: 'u4', name: 'Alex Rivera', username: 'alexr', avatar: null },
      lastMessage: 'The event was amazing!',
      time: 'Yesterday',
      unread: 0,
      online: false
    }
  ];

  const sampleMessages = [
    { id: '1', sender: 'them', text: 'Hey there! 👋', time: '10:30 AM', status: 'read' },
    { id: '2', sender: 'me', text: 'Hi! How are you?', time: '10:31 AM', status: 'read' },
    { id: '3', sender: 'them', text: 'I loved your latest blog post about Web3!', time: '10:32 AM', status: 'read' },
    { id: '4', sender: 'them', text: 'Really insightful content 🔥', time: '10:32 AM', status: 'read' },
    { id: '5', sender: 'me', text: 'Thank you so much! Glad you enjoyed it', time: '10:35 AM', status: 'read' },
    { id: '6', sender: 'them', text: 'Would you be interested in a collaboration?', time: '10:36 AM', status: 'delivered' },
  ];

  useEffect(() => {
    const token = localStorage.getItem('token') || localStorage.getItem('cybev_token');
    if (!token) {
      router.push('/auth/login');
      return;
    }

    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (e) {
        console.error('Failed to parse user data');
      }
    }

    // Load conversations
    setConversations(sampleConversations);
    setLoading(false);
  }, [router]);

  useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSelectConversation = (conv) => {
    setSelectedConversation(conv);
    setMessages(sampleMessages);
    // Mark as read
    setConversations(prev => 
      prev.map(c => c.id === conv.id ? {...c, unread: 0} : c)
    );
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    
    const newMsg = {
      id: Date.now().toString(),
      sender: 'me',
      text: message,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'sent'
    };
    
    setMessages(prev => [...prev, newMsg]);
    setMessage('');
    
    // TODO: Send to API
    // api.post('/api/messages', { conversationId: selectedConversation.id, text: message });
  };

  const filteredConversations = conversations.filter(conv =>
    conv.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <Head>
        <title>Messages - CYBEV</title>
      </Head>

      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="bg-black/40 backdrop-blur-xl rounded-2xl border border-purple-500/20 overflow-hidden" style={{ height: 'calc(100vh - 140px)' }}>
          <div className="flex h-full">
            {/* Conversations List */}
            <div className={`w-full md:w-96 border-r border-purple-500/20 flex flex-col ${selectedConversation ? 'hidden md:flex' : 'flex'}`}>
              {/* Header */}
              <div className="p-4 border-b border-purple-500/20">
                <div className="flex items-center justify-between mb-4">
                  <h1 className="text-xl font-bold text-white">Messages</h1>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setShowNewChat(true)}
                      className="p-2 hover:bg-purple-500/10 rounded-lg transition-colors"
                      title="New Chat"
                    >
                      <Plus className="w-5 h-5 text-purple-400" />
                    </button>
                    <button className="p-2 hover:bg-purple-500/10 rounded-lg transition-colors">
                      <Settings className="w-5 h-5 text-gray-400" />
                    </button>
                  </div>
                </div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search messages..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-gray-800/50 border border-purple-500/20 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Conversations */}
              <div className="flex-1 overflow-y-auto">
                {filteredConversations.length === 0 ? (
                  <div className="p-8 text-center">
                    <MessageCircle className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                    <p className="text-gray-400">No conversations yet</p>
                    <button 
                      onClick={() => setShowNewChat(true)}
                      className="mt-4 px-4 py-2 bg-purple-500/20 text-purple-400 rounded-lg hover:bg-purple-500/30"
                    >
                      Start a conversation
                    </button>
                  </div>
                ) : (
                  filteredConversations.map((conv) => (
                    <button
                      key={conv.id}
                      onClick={() => handleSelectConversation(conv)}
                      className={`w-full p-4 flex items-center gap-3 hover:bg-purple-500/10 transition-colors border-b border-purple-500/10 ${
                        selectedConversation?.id === conv.id ? 'bg-purple-500/10' : ''
                      }`}
                    >
                      <div className="relative flex-shrink-0">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                          {conv.user.name[0]}
                        </div>
                        {conv.online && (
                          <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-gray-900"></div>
                        )}
                      </div>
                      <div className="flex-1 text-left min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-white font-medium truncate">{conv.user.name}</p>
                          <span className="text-gray-500 text-xs flex-shrink-0 ml-2">{conv.time}</span>
                        </div>
                        <p className="text-gray-400 text-sm truncate">{conv.lastMessage}</p>
                      </div>
                      {conv.unread > 0 && (
                        <span className="w-5 h-5 bg-purple-500 rounded-full text-white text-xs flex items-center justify-center flex-shrink-0">
                          {conv.unread}
                        </span>
                      )}
                    </button>
                  ))
                )}
              </div>
            </div>

            {/* Chat Area */}
            <div className={`flex-1 flex flex-col ${!selectedConversation ? 'hidden md:flex' : 'flex'}`}>
              {selectedConversation ? (
                <>
                  {/* Chat Header */}
                  <div className="p-4 border-b border-purple-500/20 flex items-center justify-between bg-black/20">
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={() => setSelectedConversation(null)}
                        className="md:hidden p-2 hover:bg-purple-500/10 rounded-lg"
                      >
                        <ArrowLeft className="w-5 h-5 text-white" />
                      </button>
                      <div className="relative">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                          {selectedConversation.user.name[0]}
                        </div>
                        {selectedConversation.online && (
                          <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-gray-900"></div>
                        )}
                      </div>
                      <div>
                        <p className="text-white font-medium">{selectedConversation.user.name}</p>
                        <p className={`text-sm ${selectedConversation.online ? 'text-green-400' : 'text-gray-400'}`}>
                          {selectedConversation.online ? 'Online' : 'Offline'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <button className="p-2 hover:bg-purple-500/10 rounded-lg transition-colors" title="Voice Call">
                        <Phone className="w-5 h-5 text-gray-400" />
                      </button>
                      <button className="p-2 hover:bg-purple-500/10 rounded-lg transition-colors" title="Video Call">
                        <Video className="w-5 h-5 text-gray-400" />
                      </button>
                      <button className="p-2 hover:bg-purple-500/10 rounded-lg transition-colors">
                        <MoreVertical className="w-5 h-5 text-gray-400" />
                      </button>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map((msg, index) => (
                      <div
                        key={msg.id}
                        className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-[75%] ${msg.sender === 'me' ? 'order-2' : 'order-1'}`}>
                          <div
                            className={`px-4 py-2.5 rounded-2xl ${
                              msg.sender === 'me'
                                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-br-sm'
                                : 'bg-gray-800 text-white rounded-bl-sm'
                            }`}
                          >
                            <p className="break-words">{msg.text}</p>
                          </div>
                          <div className={`flex items-center gap-1 mt-1 ${msg.sender === 'me' ? 'justify-end' : ''}`}>
                            <span className="text-xs text-gray-500">{msg.time}</span>
                            {msg.sender === 'me' && (
                              msg.status === 'read' ? (
                                <CheckCheck className="w-3.5 h-3.5 text-blue-400" />
                              ) : (
                                <Check className="w-3.5 h-3.5 text-gray-500" />
                              )
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Message Input */}
                  <form onSubmit={handleSendMessage} className="p-4 border-t border-purple-500/20 bg-black/20">
                    <div className="flex items-center gap-2">
                      <button type="button" className="p-2 hover:bg-purple-500/10 rounded-lg transition-colors">
                        <Paperclip className="w-5 h-5 text-gray-400" />
                      </button>
                      <button type="button" className="p-2 hover:bg-purple-500/10 rounded-lg transition-colors">
                        <Image className="w-5 h-5 text-gray-400" />
                      </button>
                      <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1 bg-gray-800/50 border border-purple-500/20 rounded-full px-4 py-2.5 text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none"
                      />
                      <button type="button" className="p-2 hover:bg-purple-500/10 rounded-lg transition-colors">
                        <Smile className="w-5 h-5 text-gray-400" />
                      </button>
                      <button 
                        type="submit"
                        disabled={!message.trim()}
                        className="p-2.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
                      >
                        <Send className="w-5 h-5 text-white" />
                      </button>
                    </div>
                  </form>
                </>
              ) : (
                /* Empty State */
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center p-8">
                    <div className="w-20 h-20 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                      <MessageCircle className="w-10 h-10 text-purple-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">Your Messages</h2>
                    <p className="text-gray-400 mb-6 max-w-sm">Select a conversation to start chatting or start a new conversation with someone.</p>
                    <button 
                      onClick={() => setShowNewChat(true)}
                      className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-medium hover:opacity-90 transition-opacity inline-flex items-center gap-2"
                    >
                      <UserPlus className="w-5 h-5" />
                      Start New Chat
                    </button>
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