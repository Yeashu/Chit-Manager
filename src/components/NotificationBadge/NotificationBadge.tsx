'use client';

import { useState, useEffect } from 'react';
import { getUserNotifications } from '@/lib/actions/notificationActions';

interface NotificationBadgeProps {
  className?: string;
}

export default function NotificationBadge({ className = '' }: NotificationBadgeProps) {
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    fetchUnreadCount();
    // Set up polling for real-time updates
    const interval = setInterval(fetchUnreadCount, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchUnreadCount = async () => {
    try {
      const response = await getUserNotifications();
      if (response.success && response.data) {
        // Count pending notifications
        const unread = response.data.filter(
          notification => notification.status === 'pending'
        ).length;
        setUnreadCount(unread);
      }
    } catch (error) {
      console.error('Error fetching notification count:', error);
    }
  };

  if (unreadCount === 0) {
    return null;
  }

  return (
    <span className={`absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center ${className}`}>
      {unreadCount > 99 ? '99+' : unreadCount}
    </span>
  );
}
