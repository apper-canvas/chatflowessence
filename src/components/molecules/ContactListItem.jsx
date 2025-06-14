import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import Avatar from '@/components/atoms/Avatar';
import ApperIcon from '@/components/ApperIcon';

const ContactListItem = ({ 
  user, 
  onSelect,
  selected = false,
  showLastSeen = true,
  className = '',
  ...props 
}) => {
  const formatLastSeen = (lastSeen) => {
    if (!lastSeen) return 'Never';
    
    const now = new Date();
    const lastSeenDate = new Date(lastSeen);
    const diffInMinutes = (now - lastSeenDate) / (1000 * 60);
    
    if (diffInMinutes < 5) {
      return 'Online';
    } else {
      return `Last seen ${formatDistanceToNow(lastSeenDate, { addSuffix: true })}`;
    }
  };
  
  const isOnline = () => {
    if (!user.lastSeen) return false;
    const now = new Date();
    const lastSeenDate = new Date(user.lastSeen);
    const diffInMinutes = (now - lastSeenDate) / (1000 * 60);
    return diffInMinutes < 5;
  };

  return (
    <motion.div
      whileHover={{ backgroundColor: '#f9fafb' }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onSelect?.(user)}
      className={`
        flex items-center space-x-4 p-4 cursor-pointer transition-all duration-150
        border-b border-gray-100 last:border-b-0 max-w-full overflow-hidden
        ${selected ? 'bg-primary/5 border-primary/20' : ''}
        ${className}
      `}
      {...props}
    >
      <div className="flex-shrink-0">
        <Avatar 
          src={user.avatar} 
          alt={user.displayName}
          fallback={user.displayName}
          size="lg"
          online={isOnline()}
        />
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-sm font-semibold text-gray-900 truncate">
            {user.displayName}
          </h3>
          {selected && (
            <div className="flex-shrink-0 ml-2">
              <ApperIcon name="Check" size={16} className="text-primary" />
            </div>
          )}
        </div>
        
        <div className="space-y-1">
          <p className="text-sm text-gray-600 truncate">
            {user.phoneNumber}
          </p>
          
          {user.status && (
            <p className="text-xs text-gray-500 truncate">
              {user.status}
            </p>
          )}
          
          {showLastSeen && (
            <p className={`text-xs truncate ${isOnline() ? 'text-secondary' : 'text-gray-500'}`}>
              {formatLastSeen(user.lastSeen)}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ContactListItem;