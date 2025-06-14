import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { chatService, messageService, userService } from '@/services';
import ChatHeader from '@/components/organisms/ChatHeader';
import MessageBubble from '@/components/molecules/MessageBubble';
import MessageInput from '@/components/molecules/MessageInput';
import TypingIndicator from '@/components/organisms/TypingIndicator';
import EmptyState from '@/components/organisms/EmptyState';
import ErrorState from '@/components/organisms/ErrorState';
import SkeletonLoader from '@/components/organisms/SkeletonLoader';

const ChatViewPage = () => {
  const { chatId } = useParams();
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  
  const [chat, setChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sending, setSending] = useState(false);
  const [typingUsers, setTypingUsers] = useState([]);
  
  useEffect(() => {
    if (chatId) {
      loadChatData();
    }
  }, [chatId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Mark messages as read when chat loads
    if (chat && messages.length > 0) {
      markMessagesAsRead();
    }
  }, [chat, messages]);

  const loadChatData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [chatData, messagesData, usersData] = await Promise.all([
        chatService.getById(chatId),
        messageService.getByChatId(chatId),
        userService.getAll()
      ]);
      
      setChat(chatData);
      setMessages(messagesData);
      setUsers(usersData);
      
      // Simulate typing indicator occasionally
      simulateTyping();
    } catch (err) {
      setError(err.message || 'Failed to load chat');
      toast.error('Failed to load chat');
    } finally {
      setLoading(false);
    }
  };

  const markMessagesAsRead = async () => {
    try {
      await messageService.markMessagesAsRead(chatId, '1'); // '1' is current user
      await chatService.markAsRead(chatId);
    } catch (err) {
      console.error('Error marking messages as read:', err);
    }
  };

  const simulateTyping = () => {
    // Randomly show typing indicator
    const shouldShowTyping = Math.random() > 0.7;
    if (shouldShowTyping && chat?.type === 'individual') {
      const otherUserId = chat.participants.find(id => id !== '1');
      const typingUser = users.find(user => user.id === otherUserId);
      
      if (typingUser) {
        setTypingUsers([typingUser]);
        setTimeout(() => setTypingUsers([]), 3000);
      }
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (content) => {
    if (!content.trim() || sending) return;
    
    setSending(true);
    
    try {
      const newMessage = await messageService.create({
        chatId: chatId,
        senderId: '1', // Current user ID
        content: content,
        type: 'text'
      });
      
      // Add message to local state immediately for optimistic UI
      setMessages(prev => [...prev, newMessage]);
      
      // Update chat's last message
      await chatService.update(chatId, {
        lastMessage: {
          id: newMessage.id,
          content: newMessage.content,
          timestamp: newMessage.timestamp,
          senderId: newMessage.senderId,
          status: newMessage.status
        }
      });
      
      // Simulate receiving a reply occasionally
      if (chat?.type === 'individual' && Math.random() > 0.5) {
        setTimeout(() => {
          simulateReply();
        }, 2000 + Math.random() * 3000);
      }
      
    } catch (err) {
      toast.error('Failed to send message');
      console.error('Error sending message:', err);
    } finally {
      setSending(false);
    }
  };

  const simulateReply = async () => {
    if (!chat) return;
    
    const replies = [
      "Thanks for the message!",
      "I'll get back to you soon.",
      "Sounds good! 👍",
      "Let me think about it.",
      "Great idea!"
    ];
    
    const otherUserId = chat.participants.find(id => id !== '1');
    const randomReply = replies[Math.floor(Math.random() * replies.length)];
    
    try {
      const replyMessage = await messageService.create({
        chatId: chatId,
        senderId: otherUserId,
        content: randomReply,
        type: 'text'
      });
      
      setMessages(prev => [...prev, replyMessage]);
      
      // Update chat's last message
      await chatService.update(chatId, {
        lastMessage: {
          id: replyMessage.id,
          content: replyMessage.content,
          timestamp: replyMessage.timestamp,
          senderId: replyMessage.senderId,
          status: replyMessage.status
        },
        unreadCount: 0 // Reset since we're viewing the chat
      });
      
    } catch (err) {
      console.error('Error simulating reply:', err);
    }
  };

  const handleSendMedia = async (file) => {
    setSending(true);
    
    try {
      // Simulate file upload
      const mediaUrl = URL.createObjectURL(file);
      const fileType = file.type.startsWith('image/') ? 'image' : 'file';
      
      const newMessage = await messageService.create({
        chatId: chatId,
        senderId: '1',
        content: file.name,
        type: fileType,
        mediaUrl: mediaUrl
      });
      
      setMessages(prev => [...prev, newMessage]);
      
      // Update chat's last message
      await chatService.update(chatId, {
        lastMessage: {
          id: newMessage.id,
          content: fileType === 'image' ? '📷 Photo' : '📎 File',
          timestamp: newMessage.timestamp,
          senderId: newMessage.senderId,
          status: newMessage.status
        }
      });
      
      toast.success('File sent successfully');
    } catch (err) {
      toast.error('Failed to send file');
      console.error('Error sending media:', err);
    } finally {
      setSending(false);
    }
  };

  const getUserById = (userId) => {
    return users.find(user => user.id === userId);
  };

  if (loading) {
    return (
      <div className="h-full flex flex-col overflow-hidden">
        <div className="flex-shrink-0 h-16 bg-gray-200 animate-pulse" />
        <div className="flex-1 overflow-y-auto p-4">
          <SkeletonLoader count={5} type="message" />
        </div>
        <div className="flex-shrink-0 h-20 bg-gray-200 animate-pulse" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex items-center justify-center">
        <ErrorState 
          message={error}
          onRetry={loadChatData}
        />
      </div>
    );
  }

  if (!chat) {
    return (
      <div className="h-full flex items-center justify-center">
        <EmptyState
          icon="MessageSquare"
          title="Chat not found"
          description="The chat you're looking for doesn't exist or has been deleted."
        />
      </div>
    );
  }

return (
<div className="h-full flex flex-col bg-gradient-to-br from-background via-background-secondary to-background-tertiary relative">
      {/* Chat Header */}
      <ChatHeader chat={chat} users={users} />
      {/* Messages Container */}
<div
          ref={messagesContainerRef}
          className="flex-1 overflow-y-auto chat-messages p-4 space-y-1 relative z-10"
        >
        <AnimatePresence>
          {messages.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="h-full flex items-center justify-center"
            >
              <EmptyState
                icon="MessageCircle"
                title="No messages yet"
                description="Start the conversation by sending your first message"
              />
            </motion.div>
          ) : (
            <>
              {messages.map((message, index) => {
                const isOwn = message.senderId === '1';
                const sender = getUserById(message.senderId);
                const showAvatar = chat.type === 'group' && !isOwn;
                
                return (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.2 }}
                  >
                    <MessageBubble
                      message={message}
                      isOwn={isOwn}
                      showAvatar={showAvatar}
                      sender={sender}
                    />
                  </motion.div>
                );
              })}
              
              {/* Typing Indicator */}
              {typingUsers.length > 0 && (
                <TypingIndicator
                  isVisible={true}
                  user={typingUsers[0]}
                />
              )}
            </>
          )}
        </AnimatePresence>
        
        {/* Scroll anchor */}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Message Input */}
      <MessageInput
        onSendMessage={handleSendMessage}
        onSendMedia={handleSendMedia}
        disabled={sending}
        placeholder="Type a message..."
      />
    </div>
  );
};

export default ChatViewPage;