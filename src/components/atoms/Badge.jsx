import { motion } from 'framer-motion';

const Badge = ({ 
  children, 
  variant = 'primary', 
  size = 'sm',
  dot = false,
  className = '',
  ...props 
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-full';
  
  const variants = {
    primary: 'bg-primary text-white',
    secondary: 'bg-secondary text-white',
    success: 'bg-success text-white',
    warning: 'bg-warning text-white',
    error: 'bg-error text-white',
    info: 'bg-info text-white',
    gray: 'bg-gray-100 text-gray-800'
  };
  
  const sizes = {
    xs: dot ? 'w-2 h-2' : 'px-2 py-0.5 text-xs min-w-[1rem] h-4',
    sm: dot ? 'w-2.5 h-2.5' : 'px-2.5 py-1 text-xs min-w-[1.25rem] h-5',
    md: dot ? 'w-3 h-3' : 'px-3 py-1.5 text-sm min-w-[1.5rem] h-6',
    lg: dot ? 'w-4 h-4' : 'px-4 py-2 text-sm min-w-[2rem] h-8'
  };
  
  const badgeClasses = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`;

  if (dot) {
    return (
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className={badgeClasses}
        {...props}
      />
    );
  }

  return (
    <motion.span
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      className={badgeClasses}
      {...props}
    >
      {children}
    </motion.span>
  );
};

export default Badge;