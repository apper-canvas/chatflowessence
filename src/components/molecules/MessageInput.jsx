import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import EmojiPicker from "@/components/molecules/EmojiPicker";
const MessageInput = ({ 
  onSendMessage, 
  onSendMedia,
  disabled = false,
  placeholder = 'Type a message...',
  className = '',
  ...props 
}) => {
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);
  const handleSend = () => {
    if (!message.trim() || disabled) return;
    
    onSendMessage?.(message.trim());
    setMessage('');
    setIsTyping(false);
    
    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };
  
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };
  
  const handleTextareaChange = (e) => {
    const value = e.target.value;
    setMessage(value);
    setIsTyping(value.length > 0);
    
    // Auto-resize textarea
    const textarea = e.target;
    textarea.style.height = 'auto';
    textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
  };
  
  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      onSendMedia?.(file);
    }
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  const handleEmojiSelect = (emoji) => {
    const textarea = textareaRef.current;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newMessage = message.slice(0, start) + emoji + message.slice(end);
      
      setMessage(newMessage);
      setIsTyping(newMessage.length > 0);
      
      // Restore cursor position after emoji insertion
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + emoji.length, start + emoji.length);
      }, 0);
    }
  };

  const toggleEmojiPicker = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };

return (
    <div className={`flex items-end space-x-2 p-4 bg-white border-t ${className}`} {...props}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,.pdf,.doc,.docx,.txt"
        onChange={handleFileSelect}
        className="hidden"
      />

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={openFileDialog}
        disabled={disabled}
        className="flex-shrink-0 p-2 text-gray-500 hover:text-primary transition-colors disabled:opacity-50"
      >
        <ApperIcon name="Paperclip" size={20} />
      </motion.button>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={toggleEmojiPicker}
        disabled={disabled}
        className="flex-shrink-0 p-2 text-gray-500 hover:text-primary transition-colors disabled:opacity-50"
      >
        <ApperIcon name="Smile" size={20} />
      </motion.button>
      
      <div className="flex-1 min-w-0 max-w-full">
        <div className="relative">
          <EmojiPicker
            isOpen={showEmojiPicker}
            onClose={() => setShowEmojiPicker(false)}
            onEmojiSelect={handleEmojiSelect}
          />
          
          <textarea
            ref={textareaRef}
            value={message}
            onChange={handleTextareaChange}
            onKeyDown={handleKeyPress}
            placeholder={placeholder}
            disabled={disabled}
            rows={1}
            className="
              w-full px-4 py-3 pr-12 text-sm border border-gray-300 rounded-lg resize-none
              focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary
              disabled:opacity-50 disabled:cursor-not-allowed
              max-w-full overflow-hidden
            "
            style={{ minHeight: '44px', maxHeight: '120px' }}
          />
          
          {message.trim() ? (
            <motion.button
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleSend}
              disabled={disabled}
              className="absolute right-2 bottom-2 p-2 bg-primary text-white rounded-full hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              <ApperIcon name="Send" size={16} />
            </motion.button>
          ) : (
            <motion.button
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="absolute right-2 bottom-2 p-2 text-gray-400 hover:text-primary transition-colors"
            >
              <ApperIcon name="Mic" size={16} />
            </motion.button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageInput;