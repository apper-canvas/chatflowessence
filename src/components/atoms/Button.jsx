import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  icon, 
  iconPosition = 'left',
  disabled = false,
  loading = false,
  onClick,
  className = '',
  ...props 
}) => {
const baseClasses = 'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 transform';
  
  const variants = {
    primary: 'bg-gradient-to-r from-primary-500 to-primary-600 text-white hover:from-primary-600 hover:to-primary-700 focus:ring-primary-400 shadow-lg hover:shadow-glow-primary',
    secondary: 'bg-gradient-to-r from-secondary-500 to-secondary-600 text-white hover:from-secondary-600 hover:to-secondary-700 focus:ring-secondary-400 shadow-lg hover:shadow-glow',
    outline: 'border-2 border-primary-300 text-primary-700 bg-white/80 hover:bg-primary-50 hover:border-primary-400 focus:ring-primary-300 backdrop-blur-sm',
    ghost: 'text-gray-700 hover:bg-gradient-to-r hover:from-gray-100 hover:to-gray-50 focus:ring-primary-300 hover:text-primary-700',
    danger: 'bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 focus:ring-red-400 shadow-lg hover:shadow-xl'
  };
  const sizes = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-6 py-3 text-base',
    icon: 'p-2'
  };
  
  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : '';
  const loadingClasses = loading ? 'cursor-wait' : '';
  
  const buttonClasses = `${baseClasses} ${variants[variant]} ${sizes[size]} ${disabledClasses} ${loadingClasses} ${className}`;
  
  const handleClick = (e) => {
    if (disabled || loading) return;
    onClick?.(e);
  };

return (
    <motion.button
      whileHover={!disabled && !loading ? { 
        scale: 1.05, 
        y: -2,
        transition: { duration: 0.2 }
      } : {}}
      whileTap={!disabled && !loading ? { 
        scale: 0.95,
        transition: { duration: 0.1 }
      } : {}}
      className={buttonClasses}
      onClick={handleClick}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
      )}
      
      {icon && iconPosition === 'left' && !loading && (
        <ApperIcon name={icon} size={16} className="mr-2" />
      )}
      
      {children}
      
      {icon && iconPosition === 'right' && !loading && (
        <ApperIcon name={icon} size={16} className="ml-2" />
      )}
    </motion.button>
  );
};

export default Button;