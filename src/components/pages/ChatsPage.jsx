import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { chatService, userService } from '@/services';
import SearchBar from '@/components/molecules/SearchBar';
import ChatListItem from '@/components/molecules/ChatListItem';
import EmptyState from '@/components/organisms/EmptyState';
import ErrorState from '@/components/organisms/ErrorState';
import SkeletonLoader from '@/components/organisms/SkeletonLoader';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const ChatsPage = () => {
  const [chats, setChats] = useState([]);
  const [users, setUsers] = useState([]);
  const [filteredChats, setFilteredChats] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterChats();
  }, [chats, searchQuery]);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [chatsData, usersData] = await Promise.all([
        chatService.getAll(),
        userService.getAll()
      ]);
      
      setChats(chatsData);
      setUsers(usersData);
    } catch (err) {
      setError(err.message || 'Failed to load chats');
      toast.error('Failed to load chats');
    } finally {
      setLoading(false);
    }
  };

  const filterChats = () => {
    if (!searchQuery.trim()) {
      setFilteredChats(chats);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = chats.filter(chat => {
      if (chat.type === 'group') {
        return chat.groupName?.toLowerCase().includes(query);
      }
      
      const otherUserId = chat.participants.find(id => id !== '1');
      const otherUser = users.find(user => user.id === otherUserId);
      return otherUser?.displayName?.toLowerCase().includes(query);
    });
    
    setFilteredChats(filtered);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleNewChat = () => {
    // Navigate to contacts to start new chat
    window.history.pushState(null, '', '/contacts');
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  if (loading) {
    return (
      <div className="h-full flex flex-col overflow-hidden">
        <div className="flex-shrink-0 p-4 bg-white border-b border-gray-200">
          <div className="h-10 bg-gray-200 rounded-lg animate-pulse" />
        </div>
        <div className="flex-1 overflow-y-auto">
          <SkeletonLoader count={6} type="chat" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex items-center justify-center">
        <ErrorState 
          message={error}
          onRetry={loadData}
        />
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col overflow-hidden bg-white">
      {/* Header with Search */}
      <div className="flex-shrink-0 p-4 bg-white border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold text-gray-900">Chats</h1>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleNewChat}
            className="p-2 bg-primary text-white rounded-full shadow-lg hover:shadow-xl transition-shadow"
          >
            <ApperIcon name="Plus" size={20} />
          </motion.button>
        </div>
        
        <SearchBar
          placeholder="Search chats..."
          onSearch={handleSearch}
          value={searchQuery}
        />
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto scrollbar-thin">
        <AnimatePresence mode="wait">
          {filteredChats.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-full flex items-center justify-center"
            >
              {searchQuery ? (
                <EmptyState
                  icon="Search"
                  title="No chats found"
                  description={`No chats match "${searchQuery}"`}
                />
              ) : (
                <EmptyState
                  icon="MessageCircle"
                  title="No conversations yet"
                  description="Start your first conversation by selecting a contact"
                  actionLabel="Start Chatting"
                  onAction={handleNewChat}
                />
              )}
            </motion.div>
          ) : (
            <motion.div
              key="list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {filteredChats.map((chat, index) => (
                <motion.div
                  key={chat.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.3 }}
                >
                  <ChatListItem 
                    chat={chat} 
                    users={users}
                  />
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Floating Action Button for Mobile */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={handleNewChat}
        className="lg:hidden fixed bottom-20 right-4 w-14 h-14 bg-secondary text-white rounded-full shadow-lg hover:shadow-xl transition-shadow z-30 flex items-center justify-center"
      >
        <ApperIcon name="Plus" size={24} />
      </motion.button>
    </div>
  );
};

export default ChatsPage;