import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { userService, chatService } from '@/services';
import SearchBar from '@/components/molecules/SearchBar';
import ContactListItem from '@/components/molecules/ContactListItem';
import EmptyState from '@/components/organisms/EmptyState';
import ErrorState from '@/components/organisms/ErrorState';
import SkeletonLoader from '@/components/organisms/SkeletonLoader';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

const ContactsPage = () => {
  const navigate = useNavigate();
  const [contacts, setContacts] = useState([]);
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [creatingChat, setCreatingChat] = useState(false);

  useEffect(() => {
    loadContacts();
  }, []);

  useEffect(() => {
    filterContacts();
  }, [contacts, searchQuery]);

  const loadContacts = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const usersData = await userService.getAll();
      // Filter out current user (assuming id '1' is current user)
      const contactsData = usersData.filter(user => user.id !== '1');
      setContacts(contactsData);
    } catch (err) {
      setError(err.message || 'Failed to load contacts');
      toast.error('Failed to load contacts');
    } finally {
      setLoading(false);
    }
  };

  const filterContacts = () => {
    if (!searchQuery.trim()) {
      setFilteredContacts(contacts);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = contacts.filter(contact =>
      contact.displayName.toLowerCase().includes(query) ||
      contact.phoneNumber.includes(query)
    );
    
    setFilteredContacts(filtered);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleContactSelect = async (contact) => {
    setCreatingChat(true);
    
    try {
      // Check if chat already exists
      const existingChats = await chatService.getAll();
      const existingChat = existingChats.find(chat => 
        chat.type === 'individual' && 
        chat.participants.includes('1') && 
        chat.participants.includes(contact.id)
      );

      if (existingChat) {
        navigate(`/chat/${existingChat.id}`);
        return;
      }

      // Create new chat
      const newChat = await chatService.create({
        type: 'individual',
        participants: ['1', contact.id]
      });

      navigate(`/chat/${newChat.id}`);
      toast.success(`Started chat with ${contact.displayName}`);
    } catch (err) {
      toast.error('Failed to start chat');
      console.error('Error creating chat:', err);
    } finally {
      setCreatingChat(false);
    }
  };

  const handleAddContact = () => {
    toast.info('Add contact feature coming soon!');
  };

  if (loading) {
    return (
      <div className="h-full flex flex-col overflow-hidden">
        <div className="flex-shrink-0 p-4 bg-white border-b border-gray-200">
          <div className="h-10 bg-gray-200 rounded-lg animate-pulse mb-4" />
          <div className="h-10 bg-gray-200 rounded-lg animate-pulse" />
        </div>
        <div className="flex-1 overflow-y-auto">
          <SkeletonLoader count={8} type="contact" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex items-center justify-center">
        <ErrorState 
          message={error}
          onRetry={loadContacts}
        />
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col overflow-hidden bg-white">
      {/* Header */}
      <div className="flex-shrink-0 p-4 bg-white border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold text-gray-900">Contacts</h1>
          <Button
            onClick={handleAddContact}
            variant="outline"
            size="sm"
            icon="UserPlus"
          >
            Add Contact
          </Button>
        </div>
        
        <SearchBar
          placeholder="Search contacts..."
          onSearch={handleSearch}
          value={searchQuery}
        />
      </div>

      {/* Contacts List */}
      <div className="flex-1 overflow-y-auto scrollbar-thin">
        <AnimatePresence mode="wait">
          {filteredContacts.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-full flex items-center justify-center"
            >
              {searchQuery ? (
                <EmptyState
                  icon="Search"
                  title="No contacts found"
                  description={`No contacts match "${searchQuery}"`}
                />
              ) : (
                <EmptyState
                  icon="Users"
                  title="No contacts yet"
                  description="Add your first contact to start messaging"
                  actionLabel="Add Contact"
                  onAction={handleAddContact}
                />
              )}
            </motion.div>
          ) : (
            <motion.div
              key="list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {filteredContacts.map((contact, index) => (
                <motion.div
                  key={contact.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.3 }}
                >
                  <ContactListItem 
                    user={contact}
                    onSelect={handleContactSelect}
                    disabled={creatingChat}
                  />
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Loading overlay when creating chat */}
      {creatingChat && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
        >
          <div className="bg-white rounded-lg p-6 flex items-center space-x-3">
            <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
            <span className="text-gray-700">Starting chat...</span>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default ContactsPage;