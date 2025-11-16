'use client';

import { useState, useEffect } from 'react';
import { useBackdrop } from '@/contexts/BackdropContext';
import AmenityHeader from '@/components/AmenityHeader';
import AmenityFooter from '@/components/AmenityFooter';
import { notificationService, Notification } from '@/lib/services/notification-service';
import { Settings, Trash2, Clock, ExternalLink } from 'lucide-react';

export default function NotificationsPage() {
  const [activeTab, setActiveTab] = useState<'all' | 'like' | 'comment' | 'follow' | 'mention' | 'livestream' | 'post' | 'message' | 'system'>('all');
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { getBackdropStyle } = useBackdrop();

  useEffect(() => {
    // Load initial notifications
    setNotifications(notificationService.getNotifications());

    // Subscribe to notification updates
    const unsubscribe = notificationService.addListener((updatedNotifications) => {
      setNotifications(updatedNotifications);
    });

    return unsubscribe;
  }, []);

  const filteredNotifications = notifications.filter(notif => {
    if (activeTab === 'all') return true;
    return notif.type === activeTab;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkAsRead = (notificationId: string) => {
    notificationService.markAsRead(notificationId);
  };

  const handleMarkAllAsRead = () => {
    notificationService.markAllAsRead();
  };

  const handleDeleteNotification = (notificationId: string) => {
    notificationService.deleteNotification(notificationId);
  };

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.read) {
      handleMarkAsRead(notification.id);
    }
    if (notification.actionUrl) {
      window.location.href = notification.actionUrl;
    }
  };

  const formatTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - timestamp.getTime()) / 60000);
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    
    return timestamp.toLocaleDateString();
  };

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'like': return '❤️';
      case 'comment': return '💬';
      case 'follow': return '👥';
      case 'mention': return '📢';
      case 'livestream': return '🔴';
      case 'post': return '📝';
      case 'message': return '✉️';
      case 'system': return '🔔';
      default: return '🔔';
    }
  };

  return (
    <div className="min-h-screen" style={getBackdropStyle('notifications')}>
      <AmenityHeader currentPage="/notifications" />
      
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Notifications Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold text-white mb-4">
                🔔 Notifications
                {unreadCount > 0 && (
                  <span className="ml-3 bg-red-500 text-white text-sm px-2 py-1 rounded-full animate-pulse">
                    {unreadCount} new
                  </span>
                )}
              </h1>
              <p className="text-gray-300">Stay connected with your community</p>
            </div>
            <div className="flex space-x-3">
              <button 
                onClick={() => window.location.href = '/notifications/settings'}
                className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
              >
                <Settings className="h-4 w-4" />
                <span>Settings</span>
              </button>
              {unreadCount > 0 && (
                <button 
                  onClick={handleMarkAllAsRead}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  Mark all as read
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Notification Tabs */}
        <div className="bg-black/20 backdrop-blur-sm rounded-2xl p-6 mb-8 border border-gray-700">
          <div className="flex flex-wrap gap-2 mb-6">
            {(['all', 'like', 'comment', 'follow', 'mention', 'livestream'] as const).map((tab) => {
              const count = tab === 'all' ? notifications.length : notifications.filter(n => n.type === tab).length;
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors capitalize flex items-center space-x-2 ${
                    activeTab === tab
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  <span>{getNotificationIcon(tab === 'all' ? 'system' : tab as Notification['type'])}</span>
                  <span>{tab}</span>
                  {count > 0 && (
                    <span className="bg-gray-600 text-xs px-2 py-1 rounded-full">
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Notifications List */}
          <div className="space-y-4">
            {filteredNotifications.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-6xl mb-4">🔔</div>
                <h3 className="text-xl font-medium text-white mb-2">No notifications yet</h3>
                <p className="text-gray-400">When you get notifications, they'll show up here.</p>
              </div>
            ) : (
              filteredNotifications.map((notification) => (
                <div 
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer group ${
                    !notification.read
                      ? 'bg-purple-600/10 border-purple-500/30 hover:bg-purple-600/20'
                      : 'bg-gray-800/50 border-gray-600/30 hover:bg-gray-700/50'
                  }`}
                >
                  <div className="flex items-start space-x-4">
                    {/* Avatar */}
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white text-xl flex-shrink-0">
                      {notification.user?.avatar || getNotificationIcon(notification.type)}
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-semibold text-white truncate">
                          {notification.user?.name || 'System'}
                        </span>
                        {notification.user?.verified && (
                          <span className="text-blue-400">✓</span>
                        )}
                        {!notification.read && (
                          <div className="w-2 h-2 bg-purple-500 rounded-full flex-shrink-0"></div>
                        )}
                      </div>
                      
                      <p className="text-gray-300 mb-2 leading-relaxed">
                        {notification.message}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Clock className="h-4 w-4 text-gray-500" />
                          <span className="text-gray-500 text-sm">
                            {formatTimeAgo(notification.timestamp)}
                          </span>
                          {notification.urgent && (
                            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                              Urgent
                            </span>
                          )}
                        </div>
                        <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          {notification.actionUrl && (
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleNotificationClick(notification);
                              }}
                              className="text-gray-400 hover:text-blue-400 text-sm flex items-center space-x-1"
                            >
                              <ExternalLink className="h-3 w-3" />
                              <span>View</span>
                            </button>
                          )}
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteNotification(notification.id);
                            }}
                            className="text-gray-400 hover:text-red-400 text-sm flex items-center space-x-1"
                          >
                            <Trash2 className="h-3 w-3" />
                            <span>Remove</span>
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    {/* Notification Type Icon */}
                    <div className="text-2xl flex-shrink-0">
                      {getNotificationIcon(notification.type)}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {filteredNotifications.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔕</div>
              <h3 className="text-xl font-semibold text-white mb-2">No notifications</h3>
              <p className="text-gray-400">You're all caught up!</p>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-4">
          <button className="bg-gradient-to-r from-blue-600 to-blue-700 p-4 rounded-xl text-white text-center hover:from-blue-700 hover:to-blue-800 transition-all">
            <div className="text-2xl mb-2">🔔</div>
            <div className="font-medium">Notification Settings</div>
          </button>
          
          <button className="bg-gradient-to-r from-green-600 to-green-700 p-4 rounded-xl text-white text-center hover:from-green-700 hover:to-green-800 transition-all">
            <div className="text-2xl mb-2">📱</div>
            <div className="font-medium">Push Notifications</div>
          </button>
          
          <button className="bg-gradient-to-r from-purple-600 to-purple-700 p-4 rounded-xl text-white text-center hover:from-purple-700 hover:to-purple-800 transition-all">
            <div className="text-2xl mb-2">✉️</div>
            <div className="font-medium">Email Preferences</div>
          </button>
        </div>
      </main>
      
      <AmenityFooter />
    </div>
  );
}