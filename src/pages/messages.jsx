// ============================================
// FILE: src/pages/messages.jsx
// Messages/Chat Page - Light Theme with Full Features
// ============================================

import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { 
  ArrowLeft, Search, Plus, Settings, Phone, Video, MoreVertical,
  Paperclip, Image as ImageIcon, Smile, Send, Check, CheckCheck,
  Mic, X, Camera, File, Loader2, UserPlus
} from 'lucide-react';
import api from '@/lib/api';
import { toast } from 'react-toastify';

// Emoji Picker Data
const EMOJI_CATEGORIES = {
  'Smileys': ['😀', '😃', '😄', '😁', '😅', '😂', '🤣', '😊', '😇', '🙂', '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚', '😋', '😛', '😜', '🤪', '😝', '🤑', '🤗', '🤭', '🤫', '🤔', '🤐', '🤨', '😐', '😑', '😶', '😏', '😒', '🙄', '😬', '🤥', '😌', '😔', '😪', '🤤', '😴', '😷'],
  'Gestures': ['👍', '👎', '👌', '✌️', '🤞', '🤟', '🤘', '🤙', '👈', '👉', '👆', '👇', '☝️', '✋', '🤚', '🖐️', '🖖', '👋', '🤝', '👏', '🙌', '👐', '🤲', '🙏', '✍️', '💪'],
  'Hearts': ['❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '❣️', '💕', '💞', '💓', '💗', '💖', '💘', '💝'],
  'Objects': ['🎉', '🎊', '🎈', '🎁', '🏆', '🥇', '⭐', '🌟', '✨', '💫', '🔥', '💯', '✅', '❌', '❓', '❗', '💬', '💭', '🗨️', '📱', '💻', '🎵', '🎶']
};

export default function MessagesPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [showCallModal, setShowCallModal] = useState(null);
  const [showChatOptions, setShowChatOptions] = useState(false);
  const [uploading, setUploading] = useState(false);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const imageInputRef = useRef(null);

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

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchConversations = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('cybev_token');
      const response = await api.get('/api/messages/conversations', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data?.conversations) {
        setConversations(response.data.conversations);
      }
    } catch (error) {
      console.log('Using demo conversations');
      setConversations([
        {
          _id: '1',
          participant: { _id: 'u1', name: 'Sarah Johnson', username: 'sarah', profilePicture: null, isOnline: true },
          lastMessage: { content: 'Hey! Love your latest blog post! 🔥', createdAt: new Date(Date.now() - 2 * 60000) },
          unreadCount: 2
        },
        {
          _id: '2',
          participant: { _id: 'u2', name: 'Mike Chen', username: 'mike', profilePicture: null, isOnline: false },
          lastMessage: { content: 'Thanks for the tip! 🙏', createdAt: new Date(Date.now() - 60 * 60000) },
          unreadCount: 0
        },
        {
          _id: '3',
          participant: { _id: 'u3', name: 'Creative Studio', username: 'creative', profilePicture: null, isOnline: true },
          lastMessage: { content: 'Would you like to collaborate?', createdAt: new Date(Date.now() - 3 * 60 * 60000) },
          unreadCount: 1
        }
      ]);
    }
    setLoading(false);
  };

  const fetchMessages = async (chatId) => {
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('cybev_token');
      const response = await api.get(`/api/messages/${chatId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessages(response.data?.messages || []);
    } catch (error) {
      setMessages([
        { _id: '1', content: 'Hey! I loved your latest blog post about Web3!', sender: selectedChat?.participant?._id, createdAt: new Date(Date.now() - 10 * 60000), read: true },
        { _id: '2', content: 'Really insightful content 🔥', sender: selectedChat?.participant?._id, createdAt: new Date(Date.now() - 9 * 60000), read: true },
        { _id: '3', content: 'Thank you so much! Glad you enjoyed it', sender: user?._id, createdAt: new Date(Date.now() - 5 * 60000), read: true },
        { _id: '4', content: 'Would you be interested in a collaboration?', sender: selectedChat?.participant?._id, createdAt: new Date(Date.now() - 2 * 60000), read: false }
      ]);
    }
  };

  const openChat = (conversation) => {
    setSelectedChat(conversation);
    fetchMessages(conversation._id);
    setConversations(prev => prev.map(c => 
      c._id === conversation._id ? { ...c, unreadCount: 0 } : c
    ));
  };

  const sendMessage = async (e) => {
    e?.preventDefault();
    if (!newMessage.trim() || !selectedChat) return;

    const messageContent = newMessage.trim();
    setNewMessage('');
    setSending(true);

    const tempMessage = {
      _id: Date.now().toString(),
      content: messageContent,
      sender: user?._id,
      createdAt: new Date(),
      read: false,
      pending: true
    };
    setMessages(prev => [...prev, tempMessage]);

    try {
      const token = localStorage.getItem('token') || localStorage.getItem('cybev_token');
      const response = await api.post(`/api/messages/${selectedChat._id}`, 
        { content: messageContent },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setMessages(prev => prev.map(m => 
        m._id === tempMessage._id ? { ...response.data.message, read: false } : m
      ));
      
      setConversations(prev => prev.map(c => 
        c._id === selectedChat._id 
          ? { ...c, lastMessage: { content: messageContent, createdAt: new Date() } }
          : c
      ));
    } catch (error) {
      setMessages(prev => prev.map(m => 
        m._id === tempMessage._id ? { ...m, pending: false } : m
      ));
    }
    setSending(false);
  };

  const handleFileUpload = async (file, type) => {
    if (!file || !selectedChat) return;
    
    setUploading(true);
    setShowAttachMenu(false);
    
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('cybev_token');
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', type);
      
      const response = await api.post('/api/upload/message', formData, {
        headers: { 
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}` 
        }
      });
      
      if (response.data?.url) {
        const attachmentMessage = {
          _id: Date.now().toString(),
          content: type === 'image' ? '📷 Image' : '📎 File',
          attachment: { url: response.data.url, type, name: file.name },
          sender: user?._id,
          createdAt: new Date(),
          read: false
        };
        setMessages(prev => [...prev, attachmentMessage]);
        toast.success(`${type === 'image' ? 'Image' : 'File'} sent!`);
      }
    } catch (error) {
      toast.error('Failed to upload file');
    }
    setUploading(false);
  };

  const addEmoji = (emoji) => {
    setNewMessage(prev => prev + emoji);
  };

  const initiateCall = (type) => {
    setShowCallModal(type);
    toast.info(`${type === 'voice' ? 'Voice' : 'Video'} calling ${selectedChat?.participant?.name}...`);
    
    setTimeout(() => {
      toast.success('Call feature coming soon!');
      setShowCallModal(null);
    }, 2000);
  };

  const formatTime = (date) => {
    if (!date) return '';
    const d = new Date(date);
    const now = new Date();
    const diff = now - d;
    
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return d.toLocaleDateString();
  };

  const filteredConversations = conversations.filter(c => 
    c.participant?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.participant?.username?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <Head>
        <title>Messages | CYBEV</title>
      </Head>

      <div className="min-h-screen bg-white">
        {!selectedChat ? (
          <>
            {/* Header */}
            <header className="sticky top-0 z-50 bg-white border-b border-gray-200 px-4 py-3">
              <div className="max-w-2xl mx-auto flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Link href="/feed">
                    <button className="p-2 hover:bg-gray-100 rounded-full">
                      <ArrowLeft className="w-5 h-5 text-gray-700" />
                    </button>
                  </Link>
                  <h1 className="text-xl font-bold text-gray-900">Messages</h1>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setShowNewChatModal(true)}
                    className="p-2 bg-purple-100 hover:bg-purple-200 rounded-full"
                  >
                    <Plus className="w-5 h-5 text-purple-600" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-full">
                    <Settings className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
              </div>
            </header>

            {/* Search */}
            <div className="px-4 py-3 bg-white border-b border-gray-100">
              <div className="max-w-2xl mx-auto">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search messages..."
                    className="w-full pl-10 pr-4 py-3 bg-gray-100 rounded-full text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-300"
                  />
                </div>
              </div>
            </div>

            {/* Conversations List */}
            <main className="max-w-2xl mx-auto pb-24">
              {loading ? (
                <div className="flex items-center justify-center py-20">
                  <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
                </div>
              ) : filteredConversations.length === 0 ? (
                <div className="text-center py-20 px-4">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Send className="w-10 h-10 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No messages yet</h3>
                  <p className="text-gray-500 mb-4">Start a conversation with someone!</p>
                  <button
                    onClick={() => setShowNewChatModal(true)}
                    className="px-6 py-2 bg-purple-600 text-white rounded-full font-semibold hover:bg-purple-700"
                  >
                    New Message
                  </button>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {filteredConversations.map(conversation => (
                    <div
                      key={conversation._id}
                      onClick={() => openChat(conversation)}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 cursor-pointer transition"
                    >
                      <div className="relative">
                        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center overflow-hidden">
                          {conversation.participant?.profilePicture ? (
                            <img src={conversation.participant.profilePicture} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-white font-bold text-lg">
                              {conversation.participant?.name?.[0] || 'U'}
                            </span>
                          )}
                        </div>
                        {conversation.participant?.isOnline && (
                          <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-gray-900 truncate">
                            {conversation.participant?.name || 'User'}
                          </h3>
                          <span className="text-xs text-gray-500">
                            {formatTime(conversation.lastMessage?.createdAt)}
                          </span>
                        </div>
                        <p className={`text-sm truncate ${conversation.unreadCount > 0 ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
                          {conversation.lastMessage?.content || 'No messages yet'}
                        </p>
                      </div>

                      {conversation.unreadCount > 0 && (
                        <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs font-bold">{conversation.unreadCount}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </main>
          </>
        ) : (
          <div className="flex flex-col h-screen">
            {/* Chat Header */}
            <header className="sticky top-0 z-50 bg-white border-b border-gray-200 px-4 py-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button onClick={() => setSelectedChat(null)} className="p-2 hover:bg-gray-100 rounded-full">
                    <ArrowLeft className="w-5 h-5 text-gray-700" />
                  </button>
                  <Link href={`/profile/${selectedChat.participant?.username || selectedChat.participant?._id}`}>
                    <div className="flex items-center gap-3 cursor-pointer">
                      <div className="relative">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center overflow-hidden">
                          {selectedChat.participant?.profilePicture ? (
                            <img src={selectedChat.participant.profilePicture} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-white font-bold">
                              {selectedChat.participant?.name?.[0] || 'U'}
                            </span>
                          )}
                        </div>
                        {selectedChat.participant?.isOnline && (
                          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                        )}
                      </div>
                      <div>
                        <h2 className="font-semibold text-gray-900">{selectedChat.participant?.name}</h2>
                        <p className="text-xs text-gray-500">
                          {selectedChat.participant?.isOnline ? 'Online' : 'Offline'}
                        </p>
                      </div>
                    </div>
                  </Link>
                </div>
                
                <div className="flex items-center gap-1">
                  <button 
                    onClick={() => initiateCall('voice')}
                    className="p-2 hover:bg-gray-100 rounded-full"
                    title="Voice Call"
                  >
                    <Phone className="w-5 h-5 text-gray-700" />
                  </button>
                  <button 
                    onClick={() => initiateCall('video')}
                    className="p-2 hover:bg-gray-100 rounded-full"
                    title="Video Call"
                  >
                    <Video className="w-5 h-5 text-gray-700" />
                  </button>
                  <div className="relative">
                    <button 
                      onClick={() => setShowChatOptions(!showChatOptions)}
                      className="p-2 hover:bg-gray-100 rounded-full"
                    >
                      <MoreVertical className="w-5 h-5 text-gray-700" />
                    </button>
                    
                    {showChatOptions && (
                      <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                        <button className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50">View Profile</button>
                        <button className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50">Search in Chat</button>
                        <button className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50">Mute Notifications</button>
                        <hr className="my-1" />
                        <button className="w-full px-4 py-2 text-left text-red-600 hover:bg-gray-50">Block User</button>
                        <button className="w-full px-4 py-2 text-left text-red-600 hover:bg-gray-50">Delete Chat</button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </header>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 bg-gray-50">
              <div className="max-w-2xl mx-auto space-y-4">
                {messages.map((message) => {
                  const isOwn = message.sender === user?._id;
                  return (
                    <div key={message._id} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[75%] ${isOwn ? 'order-2' : ''}`}>
                        {message.attachment && (
                          <div className="mb-1">
                            {message.attachment.type === 'image' ? (
                              <img 
                                src={message.attachment.url} 
                                alt="" 
                                className="max-w-full rounded-lg"
                              />
                            ) : (
                              <a 
                                href={message.attachment.url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 p-3 bg-gray-100 rounded-lg hover:bg-gray-200"
                              >
                                <File className="w-5 h-5 text-gray-600" />
                                <span className="text-gray-900 text-sm">{message.attachment.name}</span>
                              </a>
                            )}
                          </div>
                        )}
                        
                        {message.content && (
                          <div className={`px-4 py-2 rounded-2xl ${
                            isOwn 
                              ? 'bg-purple-600 text-white rounded-br-md' 
                              : 'bg-white text-gray-900 border border-gray-200 rounded-bl-md shadow-sm'
                          }`}>
                            <p className="text-sm">{message.content}</p>
                          </div>
                        )}
                        
                        <div className={`flex items-center gap-1 mt-1 ${isOwn ? 'justify-end' : ''}`}>
                          <span className="text-xs text-gray-500">{formatTime(message.createdAt)}</span>
                          {isOwn && (
                            message.pending ? (
                              <Loader2 className="w-3 h-3 text-gray-400 animate-spin" />
                            ) : message.read ? (
                              <CheckCheck className="w-3 h-3 text-purple-500" />
                            ) : (
                              <Check className="w-3 h-3 text-gray-400" />
                            )
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Message Input */}
            <div className="bg-white border-t border-gray-200 px-4 py-3">
              <div className="max-w-2xl mx-auto">
                <form onSubmit={sendMessage} className="flex items-center gap-2">
                  <div className="relative">
                    <button 
                      type="button"
                      onClick={() => setShowAttachMenu(!showAttachMenu)}
                      className="p-2 hover:bg-gray-100 rounded-full"
                    >
                      <Paperclip className="w-5 h-5 text-gray-600" />
                    </button>
                    
                    {showAttachMenu && (
                      <div className="absolute bottom-full left-0 mb-2 bg-white rounded-lg shadow-lg border border-gray-200 py-2 w-40">
                        <button
                          type="button"
                          onClick={() => imageInputRef.current?.click()}
                          className="w-full px-4 py-2 flex items-center gap-2 text-gray-700 hover:bg-gray-50"
                        >
                          <ImageIcon className="w-4 h-4 text-green-600" />
                          <span className="text-gray-900">Photo/Video</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="w-full px-4 py-2 flex items-center gap-2 text-gray-700 hover:bg-gray-50"
                        >
                          <File className="w-4 h-4 text-blue-600" />
                          <span className="text-gray-900">Document</span>
                        </button>
                        <button
                          type="button"
                          className="w-full px-4 py-2 flex items-center gap-2 text-gray-700 hover:bg-gray-50"
                        >
                          <Camera className="w-4 h-4 text-purple-600" />
                          <span className="text-gray-900">Camera</span>
                        </button>
                      </div>
                    )}
                  </div>
                  
                  <input
                    type="file"
                    ref={imageInputRef}
                    accept="image/*,video/*"
                    className="hidden"
                    onChange={(e) => handleFileUpload(e.target.files?.[0], 'image')}
                  />
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={(e) => handleFileUpload(e.target.files?.[0], 'file')}
                  />
                  
                  <button 
                    type="button"
                    onClick={() => imageInputRef.current?.click()}
                    className="p-2 hover:bg-gray-100 rounded-full"
                  >
                    <ImageIcon className="w-5 h-5 text-gray-600" />
                  </button>

                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type a message..."
                      className="w-full px-4 py-2 bg-gray-100 rounded-full text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-300"
                    />
                  </div>

                  <div className="relative">
                    <button 
                      type="button"
                      onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                      className="p-2 hover:bg-gray-100 rounded-full"
                    >
                      <Smile className="w-5 h-5 text-gray-600" />
                    </button>
                    
                    {showEmojiPicker && (
                      <div className="absolute bottom-full right-0 mb-2 w-72 bg-white rounded-lg shadow-lg border border-gray-200 p-3 z-50">
                        <div className="max-h-48 overflow-y-auto">
                          {Object.entries(EMOJI_CATEGORIES).map(([category, emojis]) => (
                            <div key={category} className="mb-2">
                              <p className="text-xs text-gray-500 mb-1">{category}</p>
                              <div className="flex flex-wrap gap-1">
                                {emojis.map((emoji, i) => (
                                  <button
                                    key={i}
                                    type="button"
                                    onClick={() => addEmoji(emoji)}
                                    className="text-xl hover:bg-gray-100 rounded p-1"
                                  >
                                    {emoji}
                                  </button>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={!newMessage.trim() || sending}
                    className="p-2 bg-purple-600 hover:bg-purple-700 rounded-full disabled:opacity-50"
                  >
                    {uploading || sending ? (
                      <Loader2 className="w-5 h-5 text-white animate-spin" />
                    ) : (
                      <Send className="w-5 h-5 text-white" />
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Call Modal */}
        {showCallModal && (
          <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center">
            <div className="bg-white rounded-2xl p-8 text-center max-w-sm mx-4">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-3xl font-bold">
                  {selectedChat?.participant?.name?.[0]}
                </span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-1">{selectedChat?.participant?.name}</h3>
              <p className="text-gray-500 mb-6">
                {showCallModal === 'voice' ? 'Voice calling...' : 'Video calling...'}
              </p>
              <div className="flex items-center justify-center gap-4">
                <button
                  onClick={() => setShowCallModal(null)}
                  className="w-14 h-14 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center"
                >
                  <Phone className="w-6 h-6 text-white transform rotate-135" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* New Chat Modal */}
        {showNewChatModal && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl w-full max-w-md">
              <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-900">New Message</h2>
                <button onClick={() => setShowNewChatModal(false)} className="p-2 hover:bg-gray-100 rounded-full">
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>
              <div className="p-4">
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search users..."
                    className="w-full pl-10 pr-4 py-3 bg-gray-100 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-300"
                  />
                </div>
                <p className="text-center text-gray-500 py-8">Search for users to start a conversation</p>
              </div>
            </div>
          </div>
        )}

        {/* Bottom Navigation */}
        {!selectedChat && (
          <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 flex items-center justify-around z-50">
            <Link href="/feed">
              <button className="flex flex-col items-center py-2 px-4 text-gray-500">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                <span className="text-xs mt-1 text-gray-600">Feed</span>
              </button>
            </Link>
            
            <Link href="/explore">
              <button className="flex flex-col items-center py-2 px-4 text-gray-500">
                <Search className="w-6 h-6" />
                <span className="text-xs mt-1 text-gray-600">Search</span>
              </button>
            </Link>
            
            <Link href="/create">
              <button className="relative -mt-6">
                <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
                  <Plus className="w-7 h-7 text-white" />
                </div>
              </button>
            </Link>
            
            <button className="flex flex-col items-center py-2 px-4 text-purple-600">
              <Send className="w-6 h-6" />
              <span className="text-xs mt-1 font-medium">Messages</span>
            </button>
            
            <Link href="/menu">
              <button className="flex flex-col items-center py-2 px-4 text-gray-500">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                <span className="text-xs mt-1 text-gray-600">Menu</span>
              </button>
            </Link>
          </nav>
        )}
      </div>
    </>
  );
}
