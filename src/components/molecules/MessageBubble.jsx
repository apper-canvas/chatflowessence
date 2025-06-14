import { motion } from 'framer-motion'
import { formatDistanceToNow } from 'date-fns'
import ApperIcon from '@/components/ApperIcon'
import Avatar from '@/components/atoms/Avatar'

const MessageBubble = ({ 
  message, 
  isOwn = false, 
  showAvatar = false, 
  sender = null,
  className = '',
  ...props 
}) => {
  const getStatusIcon = (status) => {
    switch (status) {
      case 'sent':
        return <ApperIcon name="Check" size={14} className="text-gray-400" />;
      case 'delivered':
        return <ApperIcon name="CheckCheck" size={14} className="text-gray-400" />;
      case 'read':
        return <ApperIcon name="CheckCheck" size={14} className="text-secondary" />;
      default:
        return null;
    }
  };

  const formatTimestamp = (timestamp) => {
    return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
  };

  const renderContent = () => {
    switch (message.type) {
      case 'image':
        return (
          <div className="rounded-lg overflow-hidden max-w-xs">
            <img 
              src={message.mediaUrl} 
              alt="Shared image" 
              className="w-full h-auto object-cover"
            />
            {message.content && (
              <div className="p-2 text-sm">
                {message.content}
              </div>
            )}
          </div>
        );
      
      case 'file':
        return (
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg max-w-xs">
            <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <ApperIcon name="FileText" size={20} className="text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {message.content}
              </p>
              <p className="text-xs text-gray-500">Document</p>
            </div>
            <button className="flex-shrink-0 p-1 text-gray-400 hover:text-gray-600">
              <ApperIcon name="Download" size={16} />
            </button>
          </div>
        );
      
      default:
        return (
          <p className="text-sm whitespace-pre-wrap break-words">
            {message.content}
          </p>
        );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-4 ${className}`}
      {...props}
    >
      <div className={`flex ${isOwn ? 'flex-row-reverse' : 'flex-row'} items-end space-x-2 max-w-full`}>
        {showAvatar && !isOwn && (
          <Avatar 
            src={sender?.avatar} 
            alt={sender?.displayName}
            fallback={sender?.displayName}
            size="sm"
            className="flex-shrink-0"
          />
        )}
        
        <div className={`flex flex-col ${isOwn ? 'items-end' : 'items-start'} max-w-[70%] min-w-0`}>
          {showAvatar && !isOwn && (
            <span className="text-xs text-gray-500 mb-1 px-3">
              {sender?.displayName}
            </span>
          )}
          
<motion.div
            whileHover={{ 
              scale: 1.02,
              y: -1,
              transition: { duration: 0.2 }
            }}
            className={`
              px-4 py-3 rounded-message shadow-soft max-w-full min-w-0 backdrop-blur-sm
              ${isOwn 
                ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-br-md shadow-glow-primary' 
                : 'glass text-gray-900 border border-white/20 rounded-bl-md'
              }
            `}
          >
            {renderContent()}
          </motion.div>
          
          <div className={`flex items-center space-x-1 mt-1 px-1 ${isOwn ? 'flex-row-reverse space-x-reverse' : 'flex-row'}`}>
            <span className="text-xs text-gray-500">
              {formatTimestamp(message.timestamp)}
            </span>
            {isOwn && getStatusIcon(message.status)}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default MessageBubble;