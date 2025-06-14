import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import Avatar from '@/components/atoms/Avatar';
import ApperIcon from '@/components/ApperIcon';

const ChatHeader = ({ 
  chat, 
  users = [],
  className = '',
  ...props 
}) => {
  const navigate = useNavigate();
  
  const getDisplayName = () => {
    if (chat?.type === 'group') {
      return chat.groupName;
    }
    
    const otherUserId = chat?.participants?.find(id => id !== '1');
    const otherUser = users.find(user => user.id === otherUserId);
    return otherUser?.displayName || 'Unknown';
  };
  
  const getDisplayAvatar = () => {
    if (chat?.type === 'group') {
      return chat.groupAvatar;
    }
    
    const otherUserId = chat?.participants?.find(id => id !== '1');
    const otherUser = users.find(user => user.id === otherUserId);
    return otherUser?.avatar;
  };
  
  const getStatusText = () => {
    if (chat?.type === 'group') {
      const count = chat.participants?.length || 0;
      return `${count} members`;
    }
    
    const otherUserId = chat?.participants?.find(id => id !== '1');
    const otherUser = users.find(user => user.id === otherUserId);
    
    if (!otherUser?.lastSeen) return 'Offline';
    
    const now = new Date();
    const lastSeenDate = new Date(otherUser.lastSeen);
    const diffInMinutes = (now - lastSeenDate) / (1000 * 60);
    
    if (diffInMinutes < 5) {
      return 'Online';
    } else {
      return `Last seen ${formatDistanceToNow(lastSeenDate, { addSuffix: true })}`;
    }
  };
  
  const isOnline = () => {
    if (chat?.type === 'group') return false;
    
    const otherUserId = chat?.participants?.find(id => id !== '1');
    const otherUser = users.find(user => user.id === otherUserId);
    
    if (!otherUser?.lastSeen) return false;
    
    const now = new Date();
    const lastSeenDate = new Date(otherUser.lastSeen);
    const diffInMinutes = (now - lastSeenDate) / (1000 * 60);
    return diffInMinutes < 5;
  };

  const handleBack = () => {
    navigate('/chats');
  };

  const handleCall = () => {
    // Simulate call functionality
    console.log('Initiating call...');
  };

  const handleVideoCall = () => {
    // Simulate video call functionality
    console.log('Initiating video call...');
  };

  const handleMoreOptions = () => {
    // Simulate more options
    console.log('Opening more options...');
  };

  return (
    <motion.header
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`
        flex items-center justify-between p-4 bg-white border-b border-gray-200
        ${className}
      `}
      {...props}
    >
      <div className="flex items-center space-x-4 flex-1 min-w-0">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleBack}
          className="lg:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ApperIcon name="ArrowLeft" size={20} />
        </motion.button>
        
        <div className="flex items-center space-x-3 flex-1 min-w-0">
          <Avatar 
            src={getDisplayAvatar()} 
            alt={getDisplayName()}
            fallback={getDisplayName()}
            size="lg"
            online={isOnline()}
          />
          
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-semibold text-gray-900 truncate">
              {getDisplayName()}
            </h1>
            <p className={`text-sm truncate ${isOnline() ? 'text-secondary' : 'text-gray-500'}`}>
              {getStatusText()}
            </p>
          </div>
        </div>
      </div>
      
      <div className="flex items-center space-x-2 flex-shrink-0">
        {chat?.type === 'individual' && (
          <>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleCall}
              className="p-2 text-gray-600 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors"
            >
              <ApperIcon name="Phone" size={20} />
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleVideoCall}
              className="p-2 text-gray-600 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors"
            >
              <ApperIcon name="Video" size={20} />
            </motion.button>
          </>
        )}
        
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleMoreOptions}
          className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ApperIcon name="MoreVertical" size={20} />
        </motion.button>
      </div>
    </motion.header>
  );
};

export default ChatHeader;