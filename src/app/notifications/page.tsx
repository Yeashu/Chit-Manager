'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Sidebar from '@/components/Sidebar';
import Button from '@/components/Button';
import { getUserNotifications, updateNotificationStatus, deleteNotification } from '@/lib/actions/notificationActions';
import { inviteMemberToGroup } from '@/lib/actions/memberActions';
import type { NotificationWithContext } from '@/types';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationWithContext[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await getUserNotifications();
      if (response.success && response.data) {
        setNotifications(response.data);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptInvitation = async (notificationId: string, groupId: string) => {
    try {
      setActionLoading(notificationId);
      
      // Accept the invitation by updating status
      const response = await updateNotificationStatus(notificationId, 'accepted');
      
      if (response.success) {
        // Update local state
        setNotifications(prev => 
          prev.map(notif => 
            notif.id === notificationId 
              ? { ...notif, status: 'accepted' as const }
              : notif
          )
        );
        alert('Invitation accepted! You are now a member of the group.');
      } else {
        alert(response.error || 'Failed to accept invitation');
      }
    } catch (error) {
      console.error('Error accepting invitation:', error);
      alert('An error occurred while accepting the invitation');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeclineInvitation = async (notificationId: string) => {
    try {
      setActionLoading(notificationId);
      
      const response = await updateNotificationStatus(notificationId, 'declined');
      
      if (response.success) {
        setNotifications(prev => 
          prev.map(notif => 
            notif.id === notificationId 
              ? { ...notif, status: 'declined' as const }
              : notif
          )
        );
        alert('Invitation declined');
      } else {
        alert(response.error || 'Failed to decline invitation');
      }
    } catch (error) {
      console.error('Error declining invitation:', error);
      alert('An error occurred while declining the invitation');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteNotification = async (notificationId: string) => {
    if (!confirm('Are you sure you want to delete this notification?')) return;
    
    try {
      setActionLoading(notificationId);
      
      const response = await deleteNotification(notificationId);
      
      if (response.success) {
        setNotifications(prev => prev.filter(notif => notif.id !== notificationId));
        alert('Notification deleted');
      } else {
        alert(response.error || 'Failed to delete notification');
      }
    } catch (error) {
      console.error('Error deleting notification:', error);
      alert('An error occurred while deleting the notification');
    } finally {
      setActionLoading(null);
    }
  };

  const getNotificationIcon = (type: string, status: string) => {
    if (type === 'group_invite') {
      if (status === 'accepted') {
        return (
          <div className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        );
      } else if (status === 'declined') {
        return (
          <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
        );
      } else {
        return (
          <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
        );
      }
    }
    return (
      <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center">
        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5-5-5h5V7z" />
        </svg>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-[#1c2c1c] text-white">
        <Sidebar activeItem="notifications" />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-400">Loading notifications...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#1c2c1c] text-white">
      <Sidebar activeItem="notifications" />
      <div className="flex-1 p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">Notifications</h1>
              <p className="text-gray-400">Stay updated with your group invitations and activities</p>
            </div>
            <Button onClick={fetchNotifications}>Refresh</Button>
          </div>

          <div className="space-y-4">
            {notifications.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#2a3a2a] flex items-center justify-center">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5-5-5h5V7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-medium mb-2">No notifications</h3>
                <p className="text-gray-400">You're all caught up! New notifications will appear here.</p>
              </motion.div>
            ) : (
              notifications.map((notification, index) => (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-[#2a3a2a] rounded-lg p-6 border border-[#3a4a3a] hover:border-[#4a5a4a] transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      {getNotificationIcon(notification.type, notification.status)}
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="font-semibold">
                            {notification.type === 'group_invite' ? 'Group Invitation' : 'System Alert'}
                          </h3>
                          <span className={`px-2 py-1 rounded text-xs ${
                            notification.status === 'pending' ? 'bg-yellow-600' :
                            notification.status === 'accepted' ? 'bg-green-600' :
                            notification.status === 'declined' ? 'bg-red-600' :
                            'bg-gray-600'
                          }`}>
                            {notification.status.charAt(0).toUpperCase() + notification.status.slice(1)}
                          </span>
                        </div>
                        <p className="text-gray-300 mb-2">
                          {notification.type === 'group_invite' ? (
                            <>
                              <span className="font-medium">{notification.inviter_name || notification.inviter_email}</span>
                              {' '}invited you to join the group{' '}
                              <span className="font-medium">"{notification.group_name}"</span>
                            </>
                          ) : (
                            notification.message || 'System notification'
                          )}
                        </p>
                        <p className="text-sm text-gray-400">
                          {new Date(notification.created_at).toLocaleDateString()} at{' '}
                          {new Date(notification.created_at).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {notification.status === 'pending' && notification.type === 'group_invite' && (
                        <>
                          <Button
                            size="sm"
                            onClick={() => handleAcceptInvitation(notification.id, notification.group_id)}
                            disabled={actionLoading === notification.id}
                          >
                            {actionLoading === notification.id ? 'Processing...' : 'Accept'}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeclineInvitation(notification.id)}
                            disabled={actionLoading === notification.id}
                          >
                            Decline
                          </Button>
                        </>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeleteNotification(notification.id)}
                        disabled={actionLoading === notification.id}
                        className="text-red-400 border-red-400 hover:bg-red-400/10"
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
