import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import Avatar from '@/components/atoms/Avatar';
import Badge from '@/components/atoms/Badge';
import ApperIcon from '@/components/ApperIcon';

const ChatListItem = ({ 
  chat, 
  users = [],
  className = '',
  ...props 
}) => {
  const navigate = useNavigate();
  
  const getDisplayName = () => {
    if (chat.type === 'group') {
      return chat.groupName;
    }
    
    const otherUserId = chat.participants.find(id => id !== '1'); // Assuming '1' is current user
    const otherUser = users.find(user => user.id === otherUserId);
    return otherUser?.displayName || 'Unknown';
  };
  
  const getDisplayAvatar = () => {
    if (chat.type === 'group') {
      return chat.groupAvatar;
    }
    
    const otherUserId = chat.participants.find(id => id !== '1');
    const otherUser = users.find(user => user.id === otherUserId);
    return otherUser?.avatar;
  };
  
  const getLastMessagePreview = () => {
    if (!chat.lastMessage) return 'No messages yet';
    
    const message = chat.lastMessage;
    switch (message.type) {
      case 'image':
        return '📷 Photo';
      case 'file':
        return '📎 File';
      case 'voice':
        return '🎤 Voice message';
      default:
        return message.content;
    }
  };
  
  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    
    const now = new Date();
    const messageTime = new Date(timestamp);
    const diffInHours = (now - messageTime) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return messageTime.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      });
    } else {
      return messageTime.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      });
    }
  };
  
  const handleClick = () => {
    navigate(`/chat/${chat.id}`);
  };

return (
    <motion.div
      whileHover={{ 
        backgroundColor: 'rgba(37, 211, 102, 0.05)',
        scale: 1.02,
        x: 4
      }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      onClick={handleClick}
      className={`
        flex items-center space-x-4 p-4 cursor-pointer transition-all duration-200
        border-b border-gray-100/50 last:border-b-0 max-w-full overflow-hidden
        hover:shadow-soft rounded-lg mx-2 my-1
        ${className}
      `}
      {...props}
    >
      <div className="flex-shrink-0">
        <Avatar 
          src={getDisplayAvatar()} 
          alt={getDisplayName()}
          fallback={getDisplayName()}
          size="lg"
          online={chat.type === 'individual'}
        />
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-sm font-semibold text-gray-900 truncate">
            {getDisplayName()}
          </h3>
          <div className="flex items-center space-x-2 flex-shrink-0 ml-2">
            {chat.lastMessage?.timestamp && (
              <span className="text-xs text-gray-500">
                {formatTime(chat.lastMessage.timestamp)}
              </span>
            )}
{chat.unreadCount > 0 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="pulse-glow"
              >
                <Badge variant="secondary" size="xs">
                  {chat.unreadCount > 99 ? '99+' : chat.unreadCount}
                </Badge>
              </motion.div>
            )}
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600 truncate flex-1 min-w-0">
            {getLastMessagePreview()}
          </p>
          
          {chat.lastMessage?.status && chat.lastMessage.senderId === '1' && (
            <div className="flex-shrink-0 ml-2">
              {chat.lastMessage.status === 'sent' && (
                <ApperIcon name="Check" size={14} className="text-gray-400" />
              )}
              {chat.lastMessage.status === 'delivered' && (
                <ApperIcon name="CheckCheck" size={14} className="text-gray-400" />
              )}
              {chat.lastMessage.status === 'read' && (
                <ApperIcon name="CheckCheck" size={14} className="text-secondary" />
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ChatListItem;