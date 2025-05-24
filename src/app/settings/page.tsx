'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from '@/components/Sidebar';
import Button from '@/components/Button';

// Settings sections
const settingsSections = [
  { id: 'profile', name: 'Profile', icon: '👤' },
  { id: 'account', name: 'Account', icon: '🔒' },
  { id: 'notifications', name: 'Notifications', icon: '🔔' },
  { id: 'privacy', name: 'Privacy & Security', icon: '🛡️' },
  { id: 'billing', name: 'Billing', icon: '💳' },
  { id: 'appearance', name: 'Appearance', icon: '🎨' },
];

// Mock user data
const userData = {
  name: 'John Doe',
  email: 'john.doe@example.com',
  phone: '+1 (555) 123-4567',
  avatar: '👨‍💼',
  joinedDate: 'January 2023',
};

// Animation variants
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

type SettingSection = 'profile' | 'account' | 'notifications' | 'privacy' | 'billing' | 'appearance';

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState<SettingSection>('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: userData.name,
    email: userData.email,
    phone: userData.phone,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsEditing(false);
    // In a real app, you would save the data to your backend here
  };

  const renderSectionContent = () => {
    switch (activeSection) {
      case 'profile':
        return (
          <motion.div 
            variants={container}
            initial="hidden"
            animate="show"
            className="space-y-6"
          >
            <motion.div variants={item} className="flex items-center space-x-6">
              <div className="w-24 h-24 rounded-full bg-[#2a3424] flex items-center justify-center text-4xl">
                {userData.avatar}
              </div>
              <div>
                <Button 
                  variant="outline" 
                  className="border-[#a3e635] text-[#a3e635] hover:bg-[#a3e635]/10"
                >
                  Change Photo
                </Button>
              </div>
            </motion.div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-[#cbd5c0] mb-1">Full Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full bg-[#232b1c] border border-[#2a3424] rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#a3e635]/50 focus:border-transparent"
                      required
                    />
                  ) : (
                    <p className="text-white">{formData.name}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#cbd5c0] mb-1">Email</label>
                  {isEditing ? (
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full bg-[#232b1c] border border-[#2a3424] rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#a3e635]/50 focus:border-transparent"
                      required
                    />
                  ) : (
                    <p className="text-white">{formData.email}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#cbd5c0] mb-1">Phone Number</label>
                  {isEditing ? (
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full bg-[#232b1c] border border-[#2a3424] rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#a3e635]/50 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-white">{formData.phone || 'Not provided'}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#cbd5c0] mb-1">Member Since</label>
                  <p className="text-white">{userData.joinedDate}</p>
                </div>
              </motion.div>

              <motion.div variants={item} className="flex space-x-3 pt-4">
                {isEditing ? (
                  <>
                    <Button type="submit" className="bg-[#a3e635] text-[#181f16] hover:bg-[#8ac926]">
                      Save Changes
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      className="border-[#f87171] text-[#f87171] hover:bg-[#f87171]/10"
                      onClick={() => {
                        setIsEditing(false);
                        setFormData({
                          name: userData.name,
                          email: userData.email,
                          phone: userData.phone,
                        });
                      }}
                    >
                      Cancel
                    </Button>
                  </>
                ) : (
                  <Button 
                    type="button" 
                    onClick={() => setIsEditing(true)}
                    className="bg-[#a3e635] text-[#181f16] hover:bg-[#8ac926]"
                  >
                    Edit Profile
                  </Button>
                )}
              </motion.div>
            </form>
          </motion.div>
        );
      
      case 'account':
        return (
          <motion.div 
            variants={container}
            initial="hidden"
            animate="show"
            className="space-y-6"
          >
            <motion.div variants={item} className="space-y-6">
              <div className="bg-[#232b1c] border border-[#2a3424] rounded-xl p-6">
                <h3 className="text-lg font-medium text-white mb-4">Change Password</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[#cbd5c0] mb-1">Current Password</label>
                    <input
                      type="password"
                      className="w-full bg-[#2a3424] border border-[#364a36] rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#a3e635]/50 focus:border-transparent"
                      placeholder="Enter current password"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#cbd5c0] mb-1">New Password</label>
                    <input
                      type="password"
                      className="w-full bg-[#2a3424] border border-[#364a36] rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#a3e635]/50 focus:border-transparent"
                      placeholder="Enter new password"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#cbd5c0] mb-1">Confirm New Password</label>
                    <input
                      type="password"
                      className="w-full bg-[#2a3424] border border-[#364a36] rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#a3e635]/50 focus:border-transparent"
                      placeholder="Confirm new password"
                    />
                  </div>
                  <div className="pt-2">
                    <Button className="bg-[#a3e635] text-[#181f16] hover:bg-[#8ac926]">
                      Update Password
                    </Button>
                  </div>
                </div>
              </div>

              <div className="bg-[#232b1c] border border-[#2a3424] rounded-xl p-6">
                <h3 className="text-lg font-medium text-white mb-4">Danger Zone</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium text-white">Delete Account</h4>
                      <p className="text-sm text-[#cbd5c0]">Permanently delete your account and all associated data</p>
                    </div>
                    <Button 
                      variant="outline" 
                      className="border-[#f87171] text-[#f87171] hover:bg-[#f87171]/10"
                    >
                      Delete Account
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        );
      
      case 'notifications':
        return (
          <motion.div 
            variants={container}
            initial="hidden"
            animate="show"
            className="space-y-6"
          >
            <motion.div variants={item} className="bg-[#232b1c] border border-[#2a3424] rounded-xl p-6">
              <h3 className="text-lg font-medium text-white mb-6">Email Notifications</h3>
              <div className="space-y-4">
                {[
                  { id: 'payment-reminders', label: 'Payment Reminders', description: 'Get notified about upcoming payments', enabled: true },
                  { id: 'auction-alerts', label: 'Auction Alerts', description: 'Receive notifications about new auctions', enabled: true },
                  { id: 'group-updates', label: 'Group Updates', description: 'Get updates about your groups', enabled: true },
                  { id: 'newsletter', label: 'Newsletter', description: 'Receive our monthly newsletter', enabled: false },
                  { id: 'promotional', label: 'Promotional Emails', description: 'Get special offers and updates', enabled: false },
                ].map((item) => (
                  <div key={item.id} className="flex items-center justify-between py-3 border-b border-[#2a3424] last:border-0">
                    <div className="flex-1">
                      <h4 className="font-medium text-white">{item.label}</h4>
                      <p className="text-sm text-[#cbd5c0]">{item.description}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked={item.enabled} />
                      <div className="w-11 h-6 bg-[#2a3424] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#a3e635]"></div>
                    </label>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div variants={item} className="bg-[#232b1c] border border-[#2a3424] rounded-xl p-6">
              <h3 className="text-lg font-medium text-white mb-6">Push Notifications</h3>
              <div className="space-y-4">
                {[
                  { id: 'push-payments', label: 'Payment Notifications', description: 'Get notified about payment activities', enabled: true },
                  { id: 'push-auctions', label: 'Auction Updates', description: 'Receive real-time auction updates', enabled: true },
                  { id: 'push-activity', label: 'Account Activity', description: 'Get alerts for important account activities', enabled: false },
                ].map((item) => (
                  <div key={item.id} className="flex items-center justify-between py-3 border-b border-[#2a3424] last:border-0">
                    <div className="flex-1">
                      <h4 className="font-medium text-white">{item.label}</h4>
                      <p className="text-sm text-[#cbd5c0]">{item.description}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked={item.enabled} />
                      <div className="w-11 h-6 bg-[#2a3424] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#a3e635]"></div>
                    </label>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        );
      
      // Add cases for other sections (privacy, billing, appearance) as needed
      
      default:
        return (
          <motion.div 
            variants={container}
            initial="hidden"
            animate="show"
            className="flex flex-col items-center justify-center py-16 text-center"
          >
            <div className="w-48 h-48 md:w-64 md:h-64 relative mb-8">
              <div className="absolute inset-0 bg-[#a3e635]/10 rounded-full flex items-center justify-center">
                <div className="text-6xl md:text-7xl">⚙️</div>
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-3">Settings</h3>
            <p className="text-[#cbd5c0] max-w-md mb-6">
              Customize your account settings and preferences from the options in the sidebar.
            </p>
          </motion.div>
        );
    }
  };

  return (
    <div className="flex min-h-screen bg-[#181f16] text-white font-[family-name:var(--font-geist-sans)] overflow-hidden">
      <Sidebar activeItem="settings" />
      
      <div className="relative flex-1 p-6 md:p-8 overflow-y-auto">
        {/* Animated Background Elements */}
        <div className="fixed inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-1/2 -left-1/2 w-[800px] h-[800px] bg-gradient-to-br from-[#a3e635]/10 to-transparent rounded-full filter blur-3xl"></div>
          <div className="absolute -bottom-1/2 -right-1/2 w-[800px] h-[800px] bg-gradient-to-tl from-[#81c784]/10 to-transparent rounded-full filter blur-3xl"></div>
        </div>
        
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#a3e635] to-[#81c784] mb-2">
            Settings
          </h1>
          <p className="text-[#cbd5c0]">Manage your account settings and preferences</p>
        </motion.div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar Navigation */}
          <motion.div 
            className="w-full md:w-64 flex-shrink-0"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="bg-[#232b1c] border border-[#2a3424] rounded-xl overflow-hidden">
              <div className="p-2">
                {settingsSections.map((section) => (
                  <motion.button
                    key={section.id}
                    onClick={() => setActiveSection(section.id as SettingSection)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                      activeSection === section.id 
                        ? 'bg-[#2a3424] text-[#a3e635]' 
                        : 'text-[#cbd5c0] hover:bg-[#2a3424]/50'
                    }`}
                    whileHover={{ x: 4 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  >
                    <span className="text-xl">{section.icon}</span>
                    <span>{section.name}</span>
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Main Content */}
          <motion.div 
            className="flex-1 bg-[#232b1c] border border-[#2a3424] rounded-xl p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, type: 'spring', stiffness: 300, damping: 30 }}
          >
            {renderSectionContent()}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
