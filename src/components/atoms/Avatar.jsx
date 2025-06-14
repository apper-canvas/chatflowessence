import { useState } from 'react';
import { motion } from 'framer-motion';

const Avatar = ({ 
  src, 
  alt, 
  size = 'md', 
  fallback, 
  online = false,
  className = '',
  ...props 
}) => {
  const [imageError, setImageError] = useState(false);
  
  const sizes = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg',
    xl: 'w-16 h-16 text-xl',
    '2xl': 'w-20 h-20 text-2xl'
  };
  
  const onlineIndicatorSizes = {
    xs: 'w-2 h-2',
    sm: 'w-2.5 h-2.5',
    md: 'w-3 h-3',
    lg: 'w-3.5 h-3.5',
    xl: 'w-4 h-4',
    '2xl': 'w-5 h-5'
  };
  
const avatarClasses = `${sizes[size]} rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center overflow-hidden relative shadow-lg hover:shadow-glow-primary transition-all duration-200 ${className}`;
  
  const getInitials = (name) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <motion.div 
      className={avatarClasses}
      whileHover={{ 
        scale: 1.1,
        rotate: [0, -5, 5, 0],
        transition: { duration: 0.3 }
      }}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.2 }}
      {...props}
    >
      {src && !imageError ? (
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover"
          onError={() => setImageError(true)}
        />
      ) : (
        <div className="w-full h-full bg-primary text-white flex items-center justify-center font-medium">
          {getInitials(fallback || alt)}
        </div>
      )}
{online && (
        <motion.div 
          className={`absolute bottom-0 right-0 ${onlineIndicatorSizes[size]} bg-gradient-to-r from-secondary-400 to-secondary-600 border-2 border-white rounded-full shadow-lg`}
          animate={{ 
            scale: [1, 1.2, 1],
            boxShadow: [
              '0 0 0px rgba(37, 211, 102, 0.4)',
              '0 0 10px rgba(37, 211, 102, 0.8)',
              '0 0 0px rgba(37, 211, 102, 0.4)'
            ]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      )}
    </motion.div>
  );
};

export default Avatar;