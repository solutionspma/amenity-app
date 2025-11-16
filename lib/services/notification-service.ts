'use client';

export interface NotificationPreferences {
  email: {
    enabled: boolean;
    address: string;
    likes: boolean;
    comments: boolean;
    follows: boolean;
    mentions: boolean;
    livestreams: boolean;
    posts: boolean;
    messages: boolean;
  };
  sms: {
    enabled: boolean;
    number: string;
    urgent: boolean;
    livestreams: boolean;
    mentions: boolean;
  };
  push: {
    enabled: boolean;
    likes: boolean;
    comments: boolean;
    follows: boolean;
    mentions: boolean;
    livestreams: boolean;
    posts: boolean;
    messages: boolean;
  };
  inApp: {
    enabled: boolean;
    sound: boolean;
    desktop: boolean;
    badge: boolean;
  };
}

export interface Notification {
  id: string;
  type: 'like' | 'comment' | 'follow' | 'mention' | 'livestream' | 'post' | 'message' | 'system';
  title: string;
  message: string;
  user?: {
    id: string;
    name: string;
    avatar?: string;
    verified?: boolean;
  };
  timestamp: Date;
  read: boolean;
  urgent: boolean;
  actionUrl?: string;
  metadata?: Record<string, any>;
}

class NotificationService {
  private static instance: NotificationService;
  private notifications: Notification[] = [];
  private preferences: NotificationPreferences;
  private listeners: ((notifications: Notification[]) => void)[] = [];
  
  constructor() {
    this.preferences = this.loadPreferences();
    this.loadNotifications();
    this.requestPermissions();
  }

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  // Preferences Management
  loadPreferences(): NotificationPreferences {
    if (typeof window === 'undefined') return this.getDefaultPreferences();
    
    const saved = localStorage.getItem('amenity_notification_preferences');
    if (saved) {
      return { ...this.getDefaultPreferences(), ...JSON.parse(saved) };
    }
    return this.getDefaultPreferences();
  }

  getDefaultPreferences(): NotificationPreferences {
    return {
      email: {
        enabled: true,
        address: '',
        likes: false,
        comments: true,
        follows: true,
        mentions: true,
        livestreams: true,
        posts: false,
        messages: true,
      },
      sms: {
        enabled: false,
        number: '',
        urgent: true,
        livestreams: true,
        mentions: true,
      },
      push: {
        enabled: true,
        likes: false,
        comments: true,
        follows: true,
        mentions: true,
        livestreams: true,
        posts: false,
        messages: true,
      },
      inApp: {
        enabled: true,
        sound: true,
        desktop: true,
        badge: true,
      },
    };
  }

  updatePreferences(newPreferences: Partial<NotificationPreferences>) {
    this.preferences = { ...this.preferences, ...newPreferences };
    localStorage.setItem('amenity_notification_preferences', JSON.stringify(this.preferences));
  }

  getPreferences(): NotificationPreferences {
    return this.preferences;
  }

  // Permissions
  async requestPermissions() {
    if (typeof window === 'undefined' || !('Notification' in window)) return false;

    if (Notification.permission === 'default') {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }
    
    return Notification.permission === 'granted';
  }

  // Notification Management
  loadNotifications() {
    if (typeof window === 'undefined') return;
    
    const saved = localStorage.getItem('amenity_notifications');
    if (saved) {
      this.notifications = JSON.parse(saved).map((n: any) => ({
        ...n,
        timestamp: new Date(n.timestamp)
      }));
    } else {
      this.notifications = this.getMockNotifications();
    }
  }

  saveNotifications() {
    if (typeof window === 'undefined') return;
    localStorage.setItem('amenity_notifications', JSON.stringify(this.notifications));
  }

  getMockNotifications(): Notification[] {
    return [
      {
        id: '1',
        type: 'like',
        title: 'New Like',
        message: 'Sarah Johnson liked your post "Faith is taking the first step..."',
        user: { id: 'sarah', name: 'Sarah Johnson', avatar: '👩‍🦱' },
        timestamp: new Date(Date.now() - 2 * 60 * 1000), // 2 minutes ago
        read: false,
        urgent: false,
        actionUrl: '/posts/faith-first-step'
      },
      {
        id: '2',
        type: 'follow',
        title: 'New Follower',
        message: 'Pastor Michael started following you',
        user: { id: 'pastor-michael', name: 'Pastor Michael', avatar: '👨‍💼', verified: true },
        timestamp: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
        read: false,
        urgent: false,
        actionUrl: '/profiles/pastor-michael'
      },
      {
        id: '3',
        type: 'comment',
        title: 'New Comment',
        message: 'Grace Community commented: "Beautiful message! Amen 🙏"',
        user: { id: 'grace-community', name: 'Grace Community', avatar: '⛪' },
        timestamp: new Date(Date.now() - 60 * 60 * 1000), // 1 hour ago
        read: true,
        urgent: false,
        actionUrl: '/posts/faith-first-step#comment-grace'
      },
      {
        id: '4',
        type: 'livestream',
        title: 'Live Stream Starting',
        message: 'Faith Broadcasting is going live: "Sunday Service - Join us!"',
        user: { id: 'faith-broadcasting', name: 'Faith Broadcasting', avatar: '🔴' },
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        read: false,
        urgent: true,
        actionUrl: '/live/sunday-service'
      },
      {
        id: '5',
        type: 'mention',
        title: 'You were mentioned',
        message: 'Youth Ministry mentioned you: "Thanks to @yourhandle for the amazing workshop"',
        user: { id: 'youth-ministry', name: 'Youth Ministry', avatar: '🎯' },
        timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
        read: true,
        urgent: false,
        actionUrl: '/posts/workshop-mention'
      }
    ];
  }

  // Create new notification
  createNotification(notification: Omit<Notification, 'id' | 'timestamp' | 'read'>): string {
    const newNotification: Notification = {
      ...notification,
      id: this.generateId(),
      timestamp: new Date(),
      read: false,
    };

    this.notifications.unshift(newNotification);
    this.saveNotifications();
    this.notifyListeners();

    // Send appropriate notifications based on preferences
    this.sendNotification(newNotification);

    return newNotification.id;
  }

  // Send notification through various channels
  private async sendNotification(notification: Notification) {
    const prefs = this.preferences;

    // In-app notification
    if (prefs.inApp.enabled) {
      this.showInAppNotification(notification);
    }

    // Browser push notification
    if (prefs.push.enabled && this.shouldSendPushForType(notification.type)) {
      this.showBrowserNotification(notification);
    }

    // Email notification (simulate)
    if (prefs.email.enabled && prefs.email.address && this.shouldSendEmailForType(notification.type)) {
      this.sendEmailNotification(notification);
    }

    // SMS notification (simulate)
    if (prefs.sms.enabled && prefs.sms.number && this.shouldSendSMSForType(notification.type)) {
      this.sendSMSNotification(notification);
    }
  }

  private shouldSendPushForType(type: Notification['type']): boolean {
    const prefs = this.preferences.push;
    switch (type) {
      case 'like': return prefs.likes;
      case 'comment': return prefs.comments;
      case 'follow': return prefs.follows;
      case 'mention': return prefs.mentions;
      case 'livestream': return prefs.livestreams;
      case 'post': return prefs.posts;
      case 'message': return prefs.messages;
      default: return true;
    }
  }

  private shouldSendEmailForType(type: Notification['type']): boolean {
    const prefs = this.preferences.email;
    switch (type) {
      case 'like': return prefs.likes;
      case 'comment': return prefs.comments;
      case 'follow': return prefs.follows;
      case 'mention': return prefs.mentions;
      case 'livestream': return prefs.livestreams;
      case 'post': return prefs.posts;
      case 'message': return prefs.messages;
      default: return true;
    }
  }

  private shouldSendSMSForType(type: Notification['type']): boolean {
    const prefs = this.preferences.sms;
    switch (type) {
      case 'livestream': return prefs.livestreams;
      case 'mention': return prefs.mentions;
      default: return prefs.urgent;
    }
  }

  private showInAppNotification(notification: Notification) {
    // Create in-app toast notification
    const toast = document.createElement('div');
    toast.className = 'fixed top-4 right-4 z-50 max-w-sm bg-white dark:bg-gray-800 rounded-lg shadow-2xl p-4 border border-gray-200 dark:border-gray-700 animate-in slide-in-from-right duration-300';
    
    toast.innerHTML = `
      <div class="flex items-start space-x-3">
        <div class="flex-shrink-0">
          ${notification.user?.avatar || '🔔'}
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium text-gray-900 dark:text-gray-100">${notification.title}</p>
          <p class="text-sm text-gray-600 dark:text-gray-400">${notification.message}</p>
        </div>
        <button onclick="this.parentElement.parentElement.remove()" class="text-gray-400 hover:text-gray-600">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
    `;

    document.body.appendChild(toast);

    // Auto remove after 5 seconds
    setTimeout(() => {
      if (toast.parentElement) {
        toast.remove();
      }
    }, 5000);

    // Play sound if enabled
    if (this.preferences.inApp.sound) {
      this.playNotificationSound();
    }
  }

  private showBrowserNotification(notification: Notification) {
    if (Notification.permission === 'granted') {
      const browserNotification = new Notification(notification.title, {
        body: notification.message,
        icon: '/logos/amenity-logo-dark.svg',
        badge: '/logos/amenity-logo-dark.svg',
        tag: notification.id,
        requireInteraction: notification.urgent,
      });

      browserNotification.onclick = () => {
        if (notification.actionUrl) {
          window.location.href = notification.actionUrl;
        }
        browserNotification.close();
      };
    }
  }

  private async sendEmailNotification(notification: Notification) {
    // Simulate email sending
    console.log('📧 Email notification sent to:', this.preferences.email.address);
    console.log('Subject:', notification.title);
    console.log('Body:', notification.message);
    
    // In a real implementation, this would call your email service API
    // await fetch('/api/notifications/email', {
    //   method: 'POST',
    //   body: JSON.stringify({ 
    //     to: this.preferences.email.address,
    //     subject: notification.title,
    //     body: notification.message 
    //   })
    // });
  }

  private async sendSMSNotification(notification: Notification) {
    // Simulate SMS sending
    console.log('📱 SMS notification sent to:', this.preferences.sms.number);
    console.log('Message:', notification.message);
    
    // In a real implementation, this would call your SMS service API
    // await fetch('/api/notifications/sms', {
    //   method: 'POST',
    //   body: JSON.stringify({ 
    //     to: this.preferences.sms.number,
    //     message: notification.message 
    //   })
    // });
  }

  private playNotificationSound() {
    try {
      const audio = new Audio('/sounds/notification.mp3');
      audio.volume = 0.3;
      audio.play().catch(() => {
        // Fallback to system beep or ignore
        console.log('Could not play notification sound');
      });
    } catch (e) {
      console.log('Audio not supported');
    }
  }

  // Notification queries
  getNotifications(filter?: { type?: Notification['type']; unread?: boolean }): Notification[] {
    let filtered = this.notifications;
    
    if (filter?.type) {
      filtered = filtered.filter(n => n.type === filter.type);
    }
    
    if (filter?.unread === true) {
      filtered = filtered.filter(n => !n.read);
    } else if (filter?.unread === false) {
      filtered = filtered.filter(n => n.read);
    }
    
    return filtered;
  }

  getUnreadCount(): number {
    return this.notifications.filter(n => !n.read).length;
  }

  markAsRead(notificationId: string): void {
    const notification = this.notifications.find(n => n.id === notificationId);
    if (notification && !notification.read) {
      notification.read = true;
      this.saveNotifications();
      this.notifyListeners();
    }
  }

  markAllAsRead(): void {
    let changed = false;
    this.notifications.forEach(n => {
      if (!n.read) {
        n.read = true;
        changed = true;
      }
    });
    
    if (changed) {
      this.saveNotifications();
      this.notifyListeners();
    }
  }

  deleteNotification(notificationId: string): void {
    const index = this.notifications.findIndex(n => n.id === notificationId);
    if (index !== -1) {
      this.notifications.splice(index, 1);
      this.saveNotifications();
      this.notifyListeners();
    }
  }

  clearAllNotifications(): void {
    this.notifications = [];
    this.saveNotifications();
    this.notifyListeners();
  }

  // Listeners for real-time updates
  addListener(callback: (notifications: Notification[]) => void): () => void {
    this.listeners.push(callback);
    return () => {
      const index = this.listeners.indexOf(callback);
      if (index !== -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  private notifyListeners(): void {
    this.listeners.forEach(callback => callback(this.notifications));
  }

  // Utility methods
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  // Test methods for development
  createTestNotification(): void {
    const types: Notification['type'][] = ['like', 'comment', 'follow', 'mention', 'livestream'];
    const randomType = types[Math.floor(Math.random() * types.length)];
    
    this.createNotification({
      type: randomType,
      title: `Test ${randomType} notification`,
      message: `This is a test ${randomType} notification created at ${new Date().toLocaleTimeString()}`,
      urgent: Math.random() > 0.7,
      user: {
        id: 'test-user',
        name: 'Test User',
        avatar: '🧪'
      }
    });
  }
}

export const notificationService = NotificationService.getInstance();