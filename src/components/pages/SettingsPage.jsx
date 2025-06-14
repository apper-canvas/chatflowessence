import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { userService } from '@/services';
import Avatar from '@/components/atoms/Avatar';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import ApperIcon from '@/components/ApperIcon';
import SkeletonLoader from '@/components/organisms/SkeletonLoader';
import ErrorState from '@/components/organisms/ErrorState';

const SettingsPage = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [formData, setFormData] = useState({
    displayName: '',
    status: '',
    phoneNumber: ''
  });

  useEffect(() => {
    loadCurrentUser();
  }, []);

  const loadCurrentUser = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const user = await userService.getCurrentUser();
      setCurrentUser(user);
      setFormData({
        displayName: user.displayName || '',
        status: user.status || '',
        phoneNumber: user.phoneNumber || ''
      });
    } catch (err) {
      setError(err.message || 'Failed to load user data');
      toast.error('Failed to load user data');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleUpdateProfile = async () => {
    if (!currentUser) return;
    
    setUpdating(true);
    
    try {
      const updatedUser = await userService.update(currentUser.id, {
        displayName: formData.displayName.trim(),
        status: formData.status.trim()
      });
      
      setCurrentUser(updatedUser);
      toast.success('Profile updated successfully');
    } catch (err) {
      toast.error('Failed to update profile');
      console.error('Error updating profile:', err);
    } finally {
      setUpdating(false);
    }
  };

  const handleThemeToggle = () => {
    toast.info('Theme switching coming soon!');
  };

  const handleNotificationSettings = () => {
    toast.info('Notification settings coming soon!');
  };

  const handlePrivacySettings = () => {
    toast.info('Privacy settings coming soon!');
  };

  const handleBackup = () => {
    toast.info('Backup feature coming soon!');
  };

  const handleLogout = () => {
    toast.info('Logout feature coming soon!');
  };

  if (loading) {
    return (
      <div className="h-full flex flex-col overflow-hidden">
        <div className="flex-shrink-0 p-6 bg-white border-b border-gray-200">
          <div className="h-6 bg-gray-200 rounded w-32 animate-pulse mb-6" />
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 bg-gray-200 rounded-full animate-pulse" />
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-32 animate-pulse" />
              <div className="h-3 bg-gray-200 rounded w-24 animate-pulse" />
            </div>
          </div>
        </div>
        <div className="flex-1 p-6 space-y-4">
          {Array.from({ length: 5 }, (_, i) => (
            <div key={i} className="h-12 bg-gray-200 rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex items-center justify-center">
        <ErrorState 
          message={error}
          onRetry={loadCurrentUser}
        />
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col overflow-hidden bg-white">
      {/* Header */}
      <div className="flex-shrink-0 p-6 bg-white border-b border-gray-200">
        <h1 className="text-xl font-bold text-gray-900 mb-6">Settings</h1>
        
        {/* Profile Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center space-x-4"
        >
          <Avatar 
            src={currentUser?.avatar} 
            alt={currentUser?.displayName}
            fallback={currentUser?.displayName}
            size="2xl"
          />
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-semibold text-gray-900 truncate">
              {currentUser?.displayName}
            </h2>
            <p className="text-sm text-gray-500 truncate">
              {currentUser?.phoneNumber}
            </p>
            <p className="text-sm text-gray-600 truncate">
              {currentUser?.status}
            </p>
          </div>
        </motion.div>
      </div>

      {/* Settings Content */}
      <div className="flex-1 overflow-y-auto scrollbar-thin">
        <div className="p-6 space-y-8">
          {/* Profile Settings */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-4"
          >
            <h3 className="text-lg font-semibold text-gray-900">Profile</h3>
            
            <div className="space-y-4">
              <Input
                label="Display Name"
                value={formData.displayName}
                onChange={(e) => handleInputChange('displayName', e.target.value)}
                placeholder="Enter your display name"
              />
              
              <Input
                label="Status"
                value={formData.status}
                onChange={(e) => handleInputChange('status', e.target.value)}
                placeholder="Set your status message"
              />
              
              <Input
                label="Phone Number"
                value={formData.phoneNumber}
                disabled
                helperText="Phone number cannot be changed"
              />
              
              <Button
                onClick={handleUpdateProfile}
                loading={updating}
                disabled={!formData.displayName.trim()}
                className="w-full sm:w-auto"
              >
                Update Profile
              </Button>
            </div>
          </motion.section>

          {/* App Settings */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            <h3 className="text-lg font-semibold text-gray-900">Preferences</h3>
            
            <div className="space-y-2">
              <SettingItem
                icon="Palette"
                title="Theme"
                subtitle="Choose light or dark theme"
                onClick={handleThemeToggle}
              />
              
              <SettingItem
                icon="Bell"
                title="Notifications"
                subtitle="Manage notification preferences"
                onClick={handleNotificationSettings}
              />
              
              <SettingItem
                icon="Shield"
                title="Privacy"
                subtitle="Control your privacy settings"
                onClick={handlePrivacySettings}
              />
              
              <SettingItem
                icon="Download"
                title="Backup & Restore"
                subtitle="Backup your chat history"
                onClick={handleBackup}
              />
            </div>
          </motion.section>

          {/* Account Actions */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-4"
          >
            <h3 className="text-lg font-semibold text-gray-900">Account</h3>
            
            <div className="space-y-2">
              <SettingItem
                icon="LogOut"
                title="Logout"
                subtitle="Sign out of your account"
                onClick={handleLogout}
                textColor="text-red-600"
              />
            </div>
          </motion.section>
        </div>
      </div>
    </div>
  );
};

const SettingItem = ({ 
  icon, 
  title, 
  subtitle, 
  onClick, 
  textColor = "text-gray-900" 
}) => (
  <motion.button
    whileHover={{ backgroundColor: '#f9fafb' }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className="w-full flex items-center space-x-4 p-4 rounded-lg transition-colors text-left"
  >
    <div className="flex-shrink-0">
      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
        <ApperIcon name={icon} size={20} className="text-gray-600" />
      </div>
    </div>
    
    <div className="flex-1 min-w-0">
      <h4 className={`text-sm font-medium ${textColor} truncate`}>
        {title}
      </h4>
      <p className="text-sm text-gray-500 truncate">
        {subtitle}
      </p>
    </div>
    
    <div className="flex-shrink-0">
      <ApperIcon name="ChevronRight" size={16} className="text-gray-400" />
    </div>
  </motion.button>
);

export default SettingsPage;