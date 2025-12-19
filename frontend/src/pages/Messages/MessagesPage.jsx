import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchConversations, fetchChatHistory, sendMessage } from '../../features/chat/chatSlice';
import { Send, User, Search, MessageSquare } from 'lucide-react';

const MessagesPage = () => {
  const dispatch = useDispatch();
  const scrollRef = useRef();

  // Redux State
  const { user } = useSelector((state) => state.auth);
  const { conversations, messages, activeConversationId, isLoading } = useSelector((state) => state.chat);

  // Local State
  const [newMessage, setNewMessage] = useState("");

  // 1. Load Conversations on Mount
  useEffect(() => {
    dispatch(fetchConversations());
  }, [dispatch]);

  // 2. Auto-scroll to bottom when messages change
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Helper: Find the "Other" user in a conversation
  const getOtherParticipant = (conversation) => {
    return conversation.participants.find((p) => p._id !== user?._id) || {};
  };

  // Handler: Select Chat
  const handleSelectChat = (conversationId) => {
    dispatch(fetchChatHistory(conversationId));
  };

  // Handler: Send Message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeConversationId) return;

    // Find active conversation to get receiver ID
    const currentConv = conversations.find(c => c._id === activeConversationId);
    const receiver = getOtherParticipant(currentConv);

    await dispatch(sendMessage({
      receiverId: receiver._id,
      content: newMessage
    }));

    setNewMessage("");
  };

  // Find active conversation details for Header
  const activeConvDetails = conversations.find(c => c._id === activeConversationId);
  const activeUser = activeConvDetails ? getOtherParticipant(activeConvDetails) : null;

  return (
    <div className="h-[calc(100vh-100px)] animate-fadeIn">
        <div className="max-w-7xl mx-auto h-full">
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden h-full flex shadow-lg">
                
                {/* 👈 LEFT SIDEBAR: Conversations List */}
                <div className="w-full md:w-1/3 border-r border-gray-200 dark:border-gray-700 flex flex-col">
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Messages</h2>
                        {/* Search Bar (Visual Only for MVP) */}
                        <div className="relative">
                            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                            <input 
                                type="text" 
                                placeholder="Search chats..." 
                                className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    <div className="overflow-y-auto flex-1 custom-scrollbar">
                        {isLoading && conversations.length === 0 ? (
                            <div className="p-4 text-center text-gray-500">Loading chats...</div>
                        ) : conversations.length === 0 ? (
                            <div className="p-8 text-center text-gray-500 flex flex-col items-center">
                                <MessageSquare className="w-10 h-10 mb-2 opacity-20" />
                                <p>No conversations yet.</p>
                                <p className="text-xs mt-1">Visit Marketplace to connect.</p>
                            </div>
                        ) : (
                            conversations.map((conv) => {
                                const otherUser = getOtherParticipant(conv);
                                const isActive = conv._id === activeConversationId;
                                
                                return (
                                    <div 
                                        key={conv._id}
                                        onClick={() => handleSelectChat(conv._id)}
                                        className={`p-4 border-b border-gray-100 dark:border-gray-700 cursor-pointer transition-colors ${
                                            isActive 
                                            ? "bg-blue-50 dark:bg-blue-900/20 border-l-4 border-l-blue-600 dark:border-l-blue-400" 
                                            : "hover:bg-gray-50 dark:hover:bg-gray-700"
                                        }`}
                                    >
                                        <div className="flex items-center space-x-3">
                                            <img 
                                                src={otherUser.avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop"} 
                                                alt={otherUser.firstName} 
                                                className="w-10 h-10 rounded-full object-cover border border-gray-200 dark:border-gray-600"
                                            />
                                            <div className="flex-1 min-w-0">
                                                <div className="flex justify-between items-baseline mb-1">
                                                    <p className={`text-sm font-medium truncate ${isActive ? 'text-blue-700 dark:text-blue-300' : 'text-gray-900 dark:text-white'}`}>
                                                        {otherUser.firstName} {otherUser.lastName}
                                                    </p>
                                                    <span className="text-xs text-gray-400">
                                                        {new Date(conv.lastMessageAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                                                    {conv.lastMessage || "Started a conversation"}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>

                {/* 👉 RIGHT MAIN AREA: Chat Window */}
                <div className="hidden md:flex flex-1 flex-col bg-gray-50 dark:bg-gray-900">
                    {activeConversationId ? (
                        <>
                            {/* Header */}
                            <div className="p-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center space-x-3 shadow-sm z-10">
                                <img 
                                    src={activeUser?.avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop"} 
                                    className="w-10 h-10 rounded-full border border-gray-200 dark:border-gray-600"
                                    alt="User" 
                                />
                                <div>
                                    <h3 className="font-semibold text-gray-900 dark:text-white">
                                        {activeUser?.firstName} {activeUser?.lastName}
                                    </h3>
                                    <p className="text-xs text-green-500 font-medium flex items-center">
                                        <span className="w-2 h-2 bg-green-500 rounded-full mr-1.5"></span>
                                        {activeUser?.role}
                                    </p>
                                </div>
                            </div>

                            {/* Messages Body */}
                            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                                {messages.map((msg, index) => {
                                    const isMe = msg.sender === user?._id;
                                    return (
                                        <div key={index} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                            <div className={`flex max-w-[70%] ${isMe ? 'flex-row-reverse space-x-reverse' : 'flex-row'} items-end space-x-2`}>
                                                
                                                {/* Avatar (Only for receiver) */}
                                                {!isMe && (
                                                    <div className="w-8 h-8 flex-shrink-0 rounded-full overflow-hidden bg-gray-200">
                                                        <img src={activeUser?.avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32"} alt="" />
                                                    </div>
                                                )}

                                                {/* Bubble */}
                                                <div 
                                                    className={`px-4 py-2 rounded-2xl text-sm shadow-sm ${
                                                        isMe 
                                                        ? 'bg-blue-600 text-white rounded-br-none' 
                                                        : 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-bl-none border border-gray-200 dark:border-gray-600'
                                                    }`}
                                                >
                                                    <p>{msg.content}</p>
                                                    <p className={`text-[10px] mt-1 text-right ${isMe ? 'text-blue-100' : 'text-gray-400'}`}>
                                                        {new Date(msg.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                                <div ref={scrollRef} /> {/* Auto scroll anchor */}
                            </div>

                            {/* Input Area */}
                            <div className="p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
                                <form onSubmit={handleSendMessage} className="flex items-center space-x-3">
                                    <input 
                                        type="text" 
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        placeholder="Type your message..." 
                                        className="flex-1 border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-3 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                    />
                                    <button 
                                        type="submit"
                                        disabled={!newMessage.trim()}
                                        className="p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg transform active:scale-95"
                                    >
                                        <Send className="w-5 h-5" />
                                    </button>
                                </form>
                            </div>
                        </>
                    ) : (
                        /* Empty State (No Chat Selected) */
                        <div className="flex-1 flex flex-col items-center justify-center text-gray-400 p-8">
                            <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                                <MessageSquare className="w-10 h-10 text-gray-300 dark:text-gray-600" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Select a conversation</h3>
                            <p className="text-sm mt-2">Choose a contact from the left to start chatting.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    </div>
  );
};

export default MessagesPage;