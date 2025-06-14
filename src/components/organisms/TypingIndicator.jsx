import { motion, AnimatePresence } from 'framer-motion';
import Avatar from '@/components/atoms/Avatar';

const TypingIndicator = ({ 
  isVisible = false, 
  user,
  className = '',
  ...props 
}) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className={`flex items-end space-x-2 mb-4 ${className}`}
          {...props}
        >
          {user && (
            <Avatar 
              src={user.avatar} 
              alt={user.displayName}
              fallback={user.displayName}
              size="sm"
              className="flex-shrink-0"
            />
          )}
          
          <div className="bg-white border border-gray-200 rounded-message rounded-bl-md px-4 py-3 shadow-sm">
            <div className="typing-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TypingIndicator;