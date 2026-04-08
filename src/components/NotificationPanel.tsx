import React, { useState, useEffect } from 'react';
import { NotificationService, Notification } from '../services/NotificationService';

export function NotificationPanel() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    // Subscribe to notifications
    const unsubscribe = NotificationService.subscribe((newNotifications) => {
      setNotifications(newNotifications);
    });

    // Initial load
    setNotifications(NotificationService.getNotifications());

    return unsubscribe;
  }, []);

  const handleMarkAsRead = (id: string) => {
    NotificationService.markAsRead(id);
  };

  const handleMarkAllAsRead = () => {
    NotificationService.markAllAsRead();
  };

  const handleClearAll = () => {
    if (window.confirm('Clear all notifications?')) {
      NotificationService.clearAll();
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = Math.floor((now.getTime() - new Date(date).getTime()) / 1000);

    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return new Date(date).toLocaleDateString();
  };

  return (
    <div className="relative">
      {/* Notification Bell */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-800 transition-colors"
      >
        <span className="text-2xl">🔴</span>
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Notification Dropdown */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-2xl border border-gray-200 z-20 max-h-[600px] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-green-50 to-blue-50">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg">Notifications</h3>
                <span className="text-sm text-gray-600">
                  {unreadCount} unread
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleMarkAllAsRead}
                  className="text-xs text-blue-600 hover:text-blue-800"
                  disabled={unreadCount === 0}
                >
                  Mark all read
                </button>
                <span className="text-gray-300">|</span>
                <button
                  onClick={handleClearAll}
                  className="text-xs text-red-600 hover:text-red-800"
                  disabled={notifications.length === 0}
                >
                  Clear all
                </button>
              </div>
            </div>

            {/* Notifications List */}
            <div className="overflow-y-auto flex-1">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <div className="text-4xl mb-2">🔭</div>
                  <p>No notifications</p>
                </div>
              ) : (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors ${
                      !notification.read ? 'bg-blue-50' : ''
                    }`}
                    onClick={() => handleMarkAsRead(notification.id)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="text-2xl flex-shrink-0">
                        {notification.icon || '📝'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-1">
                          <p className="text-sm font-medium text-gray-900">
                            {notification.title}
                          </p>
                          {!notification.read && (
                            <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 ml-2 mt-1" />
                          )}
                        </div>
                        <p className="text-sm text-gray-600 break-words">
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {formatTime(notification.timestamp)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}




