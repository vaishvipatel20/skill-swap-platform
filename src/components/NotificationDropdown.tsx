import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Bell, X, Check, MessageSquare, Star, Users, AlertCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Notification } from '../types';

interface NotificationDropdownProps {
  unreadCount: number;
}

const NotificationDropdown: React.FC<NotificationDropdownProps> = ({ unreadCount }) => {
  const { currentUser, notifications, markNotificationAsRead, markAllNotificationsAsRead } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState<'bottom' | 'top'>('bottom');
  const [dropdownCoords, setDropdownCoords] = React.useState<{top: number; left: number} | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const userNotifications = notifications.filter(n => n.userId === currentUser?.id);
  const unreadNotifications = userNotifications.filter(n => !n.isRead);
  const recentNotifications = userNotifications.slice(0, 10);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const buttonRect = buttonRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const dropdownHeight = 400; // Approximate height of dropdown
      
      // Check if there's enough space below the button
      const spaceBelow = viewportHeight - buttonRect.bottom;
      const spaceAbove = buttonRect.top;
      
      if (spaceBelow < dropdownHeight && spaceAbove > dropdownHeight) {
        setDropdownPosition('top');
        setDropdownCoords({ top: buttonRect.top - dropdownHeight, left: buttonRect.right - 320 }); // 320 is approx width
      } else {
        setDropdownPosition('bottom');
        setDropdownCoords({ top: buttonRect.bottom, left: buttonRect.right - 320 });
      }
    }
  }, [isOpen]);
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'swap_request':
        return <MessageSquare className="h-4 w-4 text-blue-400" />;
      case 'swap_accepted':
        return <Check className="h-4 w-4 text-green-400" />;
      case 'swap_completed':
        return <Users className="h-4 w-4 text-purple-400" />;
      case 'rating_received':
        return <Star className="h-4 w-4 text-yellow-400" />;
      case 'admin_message':
        return <AlertCircle className="h-4 w-4 text-orange-400" />;
      default:
        return <Bell className="h-4 w-4 text-white/60" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'swap_request':
        return 'border-l-blue-400';
      case 'swap_accepted':
        return 'border-l-green-400';
      case 'swap_completed':
        return 'border-l-purple-400';
      case 'rating_received':
        return 'border-l-yellow-400';
      case 'admin_message':
        return 'border-l-orange-400';
      default:
        return 'border-l-white/30';
    }
  };

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.isRead) {
      markNotificationAsRead(notification.id);
    }
    // Here you could add navigation logic based on notification type
    setIsOpen(false);
  };

  const handleMarkAllAsRead = () => {
    markAllNotificationsAsRead();
  };

  return (
    <div className="relative z-[9999]" ref={dropdownRef}>
      {/* Bell Icon with Badge */}
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-white/80 hover:text-white transition-colors rounded-full hover:bg-white/10"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 rounded-full flex items-center justify-center text-xs text-white font-medium border-2 border-white/20">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && ReactDOM.createPortal(
        <div
          ref={dropdownRef}
          style={{
            position: 'fixed',
            top: dropdownCoords?.top ?? 0,
            left: dropdownCoords?.left ?? 0,
            width: dropdownCoords ? undefined : '20rem',
            maxHeight: '24rem',
            overflow: 'hidden',
          }}
          className={`backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-2xl z-[9999]`}
        >
          {/* Header */}
          <div className="p-4 border-b border-white/20">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">Notifications</h3>
              <div className="flex items-center space-x-2">
                {unreadNotifications.length > 0 && (
                  <button
                    onClick={handleMarkAllAsRead}
                    className="text-xs text-blue-300 hover:text-blue-100 transition-colors"
                  >
                    Mark all read
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-white/60 hover:text-white transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
            {unreadNotifications.length > 0 && (
              <p className="text-sm text-white/70 mt-1">
                {unreadNotifications.length} unread notification{unreadNotifications.length !== 1 ? 's' : ''}
              </p>
            )}
          </div>

          {/* Notifications List */}
          <div className="max-h-80 overflow-y-auto">
            {recentNotifications.length > 0 ? (
              <div className="divide-y divide-white/10">
                {recentNotifications.map(notification => (
                  <div
                    key={notification.id}
                    onClick={() => handleNotificationClick(notification)}
                    className={`p-4 hover:bg-white/10 transition-colors cursor-pointer border-l-4 ${getNotificationColor(notification.type)} ${
                      !notification.isRead ? 'bg-white/5' : ''
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 mt-1">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className={`text-sm font-medium ${!notification.isRead ? 'text-white' : 'text-white/80'}`}>
                              {notification.title}
                            </p>
                            <p className={`text-xs mt-1 ${!notification.isRead ? 'text-white/90' : 'text-white/60'}`}>
                              {notification.message}
                            </p>
                            <p className="text-xs text-white/50 mt-2">
                              {new Date(notification.createdAt).toLocaleDateString()} at{' '}
                              {new Date(notification.createdAt).toLocaleTimeString([], { 
                                hour: '2-digit', 
                                minute: '2-digit' 
                              })}
                            </p>
                          </div>
                          {!notification.isRead && (
                            <div className="w-2 h-2 bg-blue-400 rounded-full flex-shrink-0 mt-2"></div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center">
                <Bell className="h-12 w-12 text-white/30 mx-auto mb-3" />
                <p className="text-white/60 text-sm">No notifications yet</p>
                <p className="text-white/40 text-xs mt-1">
                  You'll see notifications here when you have new activity
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          {recentNotifications.length > 0 && userNotifications.length > 10 && (
            <div className="p-3 border-t border-white/20 text-center">
              <button className="text-sm text-blue-300 hover:text-blue-100 transition-colors">
                View all notifications
              </button>
            </div>
          )}
        </div>,
        document.body
      )}
    </div>
  );
};

export default NotificationDropdown;