import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { toast } from "react-toastify";
import Avatar from "@/components/atoms/Avatar";
import ApperIcon from "@/components/ApperIcon";
const ChatHeader = ({ 
  chat, 
  users = [],
  className = '',
  ...props 
}) => {
const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);
  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target) &&
          buttonRef.current && !buttonRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    const handleEscapeKey = (event) => {
      if (event.key === 'Escape') {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscapeKey);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [showDropdown]);
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
    // Always recalculate position when opening dropdown
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const dropdownWidth = 192; // w-48 = 192px
      
      // Calculate left position, ensuring dropdown stays within viewport
      const leftPosition = Math.min(
        rect.right - dropdownWidth,
        viewportWidth - dropdownWidth - 16 // 16px margin from edge
      );
      
      setDropdownPosition({
        top: rect.bottom + 8,
        left: Math.max(16, leftPosition) // Minimum 16px from left edge
      });
    }
    setShowDropdown(!showDropdown);
  };

  const handleMuteChat = () => {
    setShowDropdown(false);
    toast.success('Chat muted');
  };

  const handleUnmuteChat = () => {
    setShowDropdown(false);
    toast.success('Chat unmuted');
  };

  const handleViewProfile = () => {
    setShowDropdown(false);
    if (chat?.type === 'group') {
      toast.info('Group info feature coming soon');
    } else {
      toast.info('Profile view feature coming soon');
    }
  };

  const handleClearChat = () => {
    setShowDropdown(false);
    if (window.confirm('Are you sure you want to clear this chat? This action cannot be undone.')) {
      toast.success('Chat cleared');
    }
  };

  const handleBlockUser = () => {
    setShowDropdown(false);
    if (chat?.type === 'individual') {
      if (window.confirm('Are you sure you want to block this user?')) {
        toast.success('User blocked');
      }
    }
  };

  const handleReportChat = () => {
    setShowDropdown(false);
    toast.info('Report submitted. Thank you for helping keep our community safe.');
  };
return (
<motion.header
    initial={{
        opacity: 0,
        y: -10
    }}
    animate={{
        opacity: 1,
        y: 0
    }}
    transition={{
        duration: 0.3,
        ease: "easeOut"
    }}
    className={`
          flex items-center justify-between p-4 glass border-b border-white/20 shadow-soft backdrop-blur-md relative z-50
          ${className}
        `}
    {...props}>
    <div className="flex items-center space-x-4 flex-1 min-w-0">
        <motion.button
            whileHover={{
                scale: 1.1
            }}
            whileTap={{
                scale: 0.9
            }}
            onClick={handleBack}
            className="lg:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
            <ApperIcon name="ArrowLeft" size={20} />
        </motion.button>
        <div className="flex items-center space-x-3 flex-1 min-w-0">
            <Avatar
                src={getDisplayAvatar()}
                alt={getDisplayName()}
                fallback={getDisplayName()}
                size="lg"
                online={isOnline()} />
            <div className="flex-1 min-w-0">
                <h1 className="text-lg font-semibold text-gray-900 truncate">
                    {getDisplayName()}
                </h1>
                <p
                    className={`text-sm truncate ${isOnline() ? "text-secondary" : "text-gray-500"}`}>
                    {getStatusText()}
                </p>
            </div>
        </div>
    </div>
    <div className="flex items-center space-x-2 flex-shrink-0">
        {chat?.type === "individual" && <>
            <motion.button
                whileHover={{
                    scale: 1.1
                }}
                whileTap={{
                    scale: 0.9
                }}
                onClick={handleCall}
                className="p-2 text-gray-600 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors">
                <ApperIcon name="Phone" size={20} />
            </motion.button>
            <motion.button
                whileHover={{
                    scale: 1.1
                }}
                whileTap={{
                    scale: 0.9
                }}
                onClick={handleVideoCall}
                className="p-2 text-gray-600 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors">
                <ApperIcon name="Video" size={20} />
            </motion.button>
        </>}
        <div className="relative">
            <motion.button
                ref={buttonRef}
                whileHover={{
                    scale: 1.1
                }}
                whileTap={{
                    scale: 0.9
                }}
                onClick={handleMoreOptions}
                className={`p-2 rounded-lg transition-colors ${showDropdown ? "text-primary bg-primary/10" : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"}`}>
                <ApperIcon name="MoreVertical" size={20} />
            </motion.button>
            <AnimatePresence>
                {showDropdown && createPortal(<motion.div
                    ref={dropdownRef}
                    initial={{
                        opacity: 0,
                        scale: 0.95,
                        y: -10
                    }}
                    animate={{
                        opacity: 1,
                        scale: 1,
                        y: 0
                    }}
                    exit={{
                        opacity: 0,
                        scale: 0.95,
                        y: -10
                    }}
                    transition={{
                        duration: 0.15,
                        ease: "easeOut"
                    }}
style={{
                        position: 'fixed',
                        top: `${dropdownPosition.top || 0}px`,
                        left: `${dropdownPosition.left || 0}px`,
                        zIndex: 9999,
                        minWidth: '192px',
                        isolation: "isolate",
                        transform: "translateZ(0)",
                        maxHeight: "calc(100vh - 120px)"
                    }}
                    className="bg-white/90 backdrop-blur-md rounded-lg shadow-xl border border-white/20">
                    <div className="py-2">
                        <button
                            onClick={handleViewProfile}
                            className="w-full px-4 py-2 text-left hover:bg-white/10 transition-colors flex items-center space-x-3">
                            <ApperIcon name="User" size={16} />
                            <span>{chat?.type === "group" ? "Group Info" : "View Profile"}</span>
                        </button>
                        <button
                            onClick={chat?.isMuted ? handleUnmuteChat : handleMuteChat}
                            className="w-full px-4 py-2 text-left hover:bg-white/10 transition-colors flex items-center space-x-3">
                            <ApperIcon name={chat?.isMuted ? "VolumeX" : "Volume2"} size={16} />
                            <span>{chat?.isMuted ? "Unmute Chat" : "Mute Chat"}</span>
                        </button>
                        <button
                            onClick={handleClearChat}
                            className="w-full px-4 py-2 text-left hover:bg-white/10 transition-colors flex items-center space-x-3">
                            <ApperIcon name="Trash2" size={16} />
                            <span>Clear Chat</span>
                        </button>
                        <hr className="border-white/20 my-1" />
                        {chat?.type === "individual" && <button
                            onClick={handleBlockUser}
                            className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 flex items-center space-x-3 transition-colors">
                            <ApperIcon name="Shield" size={16} />
                            <span>Block User</span>
                        </button>}
                        <button
                            onClick={handleReportChat}
                            className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 flex items-center space-x-3 transition-colors">
                            <ApperIcon name="Flag" size={16} />
                            <span>Report</span>
                        </button>
                    </div>
                </motion.div>, document.body)}
            </AnimatePresence>
        </div>
    </div>
</motion.header>
  );
};

export default ChatHeader;