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
  
  const avatarClasses = `${sizes[size]} rounded-full bg-gray-300 flex items-center justify-center overflow-hidden relative ${className}`;
  
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
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.15 }}
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
        <div className={`absolute bottom-0 right-0 ${onlineIndicatorSizes[size]} bg-secondary border-2 border-white rounded-full`} />
      )}
    </motion.div>
  );
};

export default Avatar;