import { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';

const EmojiPicker = ({ 
  isOpen, 
  onClose, 
  onEmojiSelect,
  className = '' 
}) => {
  const pickerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen, onClose]);

  const handleEmojiSelect = (emoji) => {
    onEmojiSelect(emoji.native);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={pickerRef}
          initial={{ opacity: 0, y: 10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className={`absolute bottom-full right-0 mb-2 z-50 shadow-lg rounded-lg overflow-hidden ${className}`}
        >
          <Picker
            data={data}
            onEmojiSelect={handleEmojiSelect}
            theme="light"
            previewPosition="none"
            skinTonePosition="none"
            categories={[
              'people',
              'nature', 
              'foods',
              'activity',
              'places',
              'objects',
              'symbols',
              'flags'
            ]}
            maxFrequentRows={2}
            perLine={8}
            emojiSize={20}
            emojiButtonSize={28}
            set="native"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EmojiPicker;