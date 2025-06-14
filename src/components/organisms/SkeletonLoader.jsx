import { motion } from 'framer-motion';

const SkeletonLoader = ({ 
  type = 'chat',
  count = 3,
  className = '',
  ...props 
}) => {
  const renderChatSkeleton = () => (
    <div className="flex items-center space-x-4 p-4">
      <div className="w-12 h-12 bg-gray-200 rounded-full animate-pulse" />
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
        <div className="h-3 bg-gray-200 rounded w-1/2 animate-pulse" />
      </div>
      <div className="w-12 text-right">
        <div className="h-3 bg-gray-200 rounded w-full animate-pulse" />
      </div>
    </div>
  );

  const renderMessageSkeleton = () => (
    <div className="flex items-end space-x-2 mb-4">
      <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse" />
      <div className="bg-gray-200 rounded-message px-4 py-3 max-w-xs animate-pulse">
        <div className="h-4 bg-gray-300 rounded" />
      </div>
    </div>
  );

  const renderContactSkeleton = () => (
    <div className="flex items-center space-x-4 p-4">
      <div className="w-12 h-12 bg-gray-200 rounded-full animate-pulse" />
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse" />
        <div className="h-3 bg-gray-200 rounded w-1/3 animate-pulse" />
        <div className="h-3 bg-gray-200 rounded w-1/2 animate-pulse" />
      </div>
    </div>
  );

  const renderSkeleton = () => {
    switch (type) {
      case 'message':
        return renderMessageSkeleton();
      case 'contact':
        return renderContactSkeleton();
      default:
        return renderChatSkeleton();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`space-y-1 ${className}`}
      {...props}
    >
      {Array.from({ length: count }, (_, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1, duration: 0.3 }}
        >
          {renderSkeleton()}
        </motion.div>
      ))}
    </motion.div>
  );
};

export default SkeletonLoader;