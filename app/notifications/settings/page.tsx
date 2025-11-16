'use client';

import { useState, useEffect } from 'react';
import { useBackdrop } from '@/contexts/BackdropContext';
import AmenityHeader from '@/components/AmenityHeader';
import AmenityFooter from '@/components/AmenityFooter';
import { notificationService, NotificationPreferences } from '@/lib/services/notification-service';
import { Mail, MessageSquare, Bell, Smartphone, Volume2, Monitor, AlertCircle, Check } from 'lucide-react';

export default function NotificationSettingsPage() {
  const [preferences, setPreferences] = useState<NotificationPreferences | null>(null);
  const [testingEmail, setTestingEmail] = useState(false);
  const [testingSMS, setTestingSMS] = useState(false);
  const [saved, setSaved] = useState(false);
  const { getBackdropStyle } = useBackdrop();

  useEffect(() => {
    setPreferences(notificationService.getPreferences());
  }, []);

  const updatePreferences = (updates: Partial<NotificationPreferences>) => {
    if (!preferences) return;
    
    const newPreferences = { ...preferences, ...updates };
    setPreferences(newPreferences);
    notificationService.updatePreferences(updates);
    
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const updateEmailPreferences = (updates: Partial<NotificationPreferences['email']>) => {
    updatePreferences({ email: { ...preferences!.email, ...updates } });
  };

  const updateSMSPreferences = (updates: Partial<NotificationPreferences['sms']>) => {
    updatePreferences({ sms: { ...preferences!.sms, ...updates } });
  };

  const updatePushPreferences = (updates: Partial<NotificationPreferences['push']>) => {
    updatePreferences({ push: { ...preferences!.push, ...updates } });
  };

  const updateInAppPreferences = (updates: Partial<NotificationPreferences['inApp']>) => {
    updatePreferences({ inApp: { ...preferences!.inApp, ...updates } });
  };

  const testEmailNotification = async () => {
    setTestingEmail(true);
    notificationService.createNotification({
      type: 'system',
      title: 'Test Email Notification',
      message: 'This is a test notification to verify your email settings are working correctly.',
      urgent: false,
    });
    setTimeout(() => setTestingEmail(false), 2000);
  };

  const testSMSNotification = async () => {
    setTestingSMS(true);
    notificationService.createNotification({
      type: 'system',
      title: 'Test SMS Notification',
      message: 'This is a test SMS notification to verify your phone settings are working correctly.',
      urgent: true,
    });
    setTimeout(() => setTestingSMS(false), 2000);
  };

  if (!preferences) {
    return (
      <div className="min-h-screen" style={getBackdropStyle('notifications')}>
        <AmenityHeader currentPage="/notifications/settings" />
        <main className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto"></div>
            <p className="text-gray-300 mt-4">Loading notification preferences...</p>
          </div>
        </main>
        <AmenityFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={getBackdropStyle('notifications')}>
      <AmenityHeader currentPage="/notifications/settings" />
      
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">🔔 Notification Settings</h1>
          <p className="text-gray-300">Customize how you receive notifications across all channels</p>
        </div>

        {/* Saved Indicator */}
        {saved && (
          <div className="fixed top-20 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center space-x-2">
            <Check className="h-5 w-5" />
            <span>Settings saved!</span>
          </div>
        )}

        <div className="space-y-8">
          {/* Email Notifications */}
          <div className="bg-black/20 backdrop-blur-sm rounded-2xl p-8 border border-gray-700">
            <div className="flex items-center space-x-3 mb-6">
              <Mail className="h-8 w-8 text-blue-400" />
              <div>
                <h2 className="text-2xl font-bold text-white">Email Notifications</h2>
                <p className="text-gray-400">Receive notifications in your email inbox</p>
              </div>
            </div>

            <div className="space-y-6">
              {/* Email Toggle */}
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-lg font-medium text-white">Enable Email Notifications</label>
                  <p className="text-gray-400">Get notified via email for important events</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={preferences.email.enabled}
                    onChange={(e) => updateEmailPreferences({ enabled: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-500"></div>
                </label>
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
                <div className="flex space-x-3">
                  <input
                    type="email"
                    value={preferences.email.address}
                    onChange={(e) => updateEmailPreferences({ address: e.target.value })}
                    placeholder="your.email@example.com"
                    className="flex-1 bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-yellow-500"
                  />
                  <button
                    onClick={testEmailNotification}
                    disabled={!preferences.email.enabled || !preferences.email.address || testingEmail}
                    className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-6 py-3 rounded-lg font-medium transition-all"
                  >
                    {testingEmail ? 'Sending...' : 'Test'}
                  </button>
                </div>
              </div>

              {/* Email Notification Types */}
              {preferences.email.enabled && (
                <div className="grid md:grid-cols-2 gap-4">
                  {[
                    { key: 'likes', label: 'Likes on posts', icon: '❤️' },
                    { key: 'comments', label: 'Comments on posts', icon: '💬' },
                    { key: 'follows', label: 'New followers', icon: '👥' },
                    { key: 'mentions', label: 'Mentions', icon: '📢' },
                    { key: 'livestreams', label: 'Live streams', icon: '🔴' },
                    { key: 'posts', label: 'New posts from followed users', icon: '📝' },
                    { key: 'messages', label: 'Direct messages', icon: '✉️' },
                  ].map(({ key, label, icon }) => (
                    <div key={key} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <span className="text-xl">{icon}</span>
                        <span className="text-gray-300">{label}</span>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={preferences.email[key as keyof typeof preferences.email] as boolean}
                          onChange={(e) => updateEmailPreferences({ [key]: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-9 h-5 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-500"></div>
                      </label>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* SMS Notifications */}
          <div className="bg-black/20 backdrop-blur-sm rounded-2xl p-8 border border-gray-700">
            <div className="flex items-center space-x-3 mb-6">
              <Smartphone className="h-8 w-8 text-green-400" />
              <div>
                <h2 className="text-2xl font-bold text-white">SMS Notifications</h2>
                <p className="text-gray-400">Receive urgent notifications via text message</p>
              </div>
            </div>

            <div className="space-y-6">
              {/* SMS Toggle */}
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-lg font-medium text-white">Enable SMS Notifications</label>
                  <p className="text-gray-400">Get urgent notifications via text message</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={preferences.sms.enabled}
                    onChange={(e) => updateSMSPreferences({ enabled: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                </label>
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Phone Number</label>
                <div className="flex space-x-3">
                  <input
                    type="tel"
                    value={preferences.sms.number}
                    onChange={(e) => updateSMSPreferences({ number: e.target.value })}
                    placeholder="+1 (555) 123-4567"
                    className="flex-1 bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-yellow-500"
                  />
                  <button
                    onClick={testSMSNotification}
                    disabled={!preferences.sms.enabled || !preferences.sms.number || testingSMS}
                    className="bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white px-6 py-3 rounded-lg font-medium transition-all"
                  >
                    {testingSMS ? 'Sending...' : 'Test'}
                  </button>
                </div>
              </div>

              {/* SMS Notification Types */}
              {preferences.sms.enabled && (
                <div className="space-y-3">
                  {[
                    { key: 'urgent', label: 'Urgent notifications only', icon: '🚨' },
                    { key: 'livestreams', label: 'Live stream alerts', icon: '🔴' },
                    { key: 'mentions', label: 'Important mentions', icon: '📢' },
                  ].map(({ key, label, icon }) => (
                    <div key={key} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <span className="text-xl">{icon}</span>
                        <span className="text-gray-300">{label}</span>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={preferences.sms[key as keyof typeof preferences.sms] as boolean}
                          onChange={(e) => updateSMSPreferences({ [key]: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-9 h-5 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-green-500"></div>
                      </label>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Push Notifications */}
          <div className="bg-black/20 backdrop-blur-sm rounded-2xl p-8 border border-gray-700">
            <div className="flex items-center space-x-3 mb-6">
              <Bell className="h-8 w-8 text-purple-400" />
              <div>
                <h2 className="text-2xl font-bold text-white">Browser Push Notifications</h2>
                <p className="text-gray-400">Receive real-time notifications in your browser</p>
              </div>
            </div>

            <div className="space-y-6">
              {/* Push Toggle */}
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-lg font-medium text-white">Enable Push Notifications</label>
                  <p className="text-gray-400">Get real-time browser notifications</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={preferences.push.enabled}
                    onChange={(e) => updatePushPreferences({ enabled: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-500"></div>
                </label>
              </div>

              {/* Push Notification Types */}
              {preferences.push.enabled && (
                <div className="grid md:grid-cols-2 gap-4">
                  {[
                    { key: 'likes', label: 'Likes on posts', icon: '❤️' },
                    { key: 'comments', label: 'Comments on posts', icon: '💬' },
                    { key: 'follows', label: 'New followers', icon: '👥' },
                    { key: 'mentions', label: 'Mentions', icon: '📢' },
                    { key: 'livestreams', label: 'Live streams', icon: '🔴' },
                    { key: 'posts', label: 'New posts from followed users', icon: '📝' },
                    { key: 'messages', label: 'Direct messages', icon: '✉️' },
                  ].map(({ key, label, icon }) => (
                    <div key={key} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <span className="text-xl">{icon}</span>
                        <span className="text-gray-300">{label}</span>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={preferences.push[key as keyof typeof preferences.push] as boolean}
                          onChange={(e) => updatePushPreferences({ [key]: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-9 h-5 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-purple-500"></div>
                      </label>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* In-App Notifications */}
          <div className="bg-black/20 backdrop-blur-sm rounded-2xl p-8 border border-gray-700">
            <div className="flex items-center space-x-3 mb-6">
              <Monitor className="h-8 w-8 text-orange-400" />
              <div>
                <h2 className="text-2xl font-bold text-white">In-App Experience</h2>
                <p className="text-gray-400">Customize your in-app notification experience</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {[
                { key: 'enabled', label: 'Show in-app notifications', icon: Bell, description: 'Display notification toasts while using the app' },
                { key: 'sound', label: 'Play notification sounds', icon: Volume2, description: 'Play audio when notifications arrive' },
                { key: 'desktop', label: 'Desktop notifications', icon: Monitor, description: 'Show notifications on your desktop' },
                { key: 'badge', label: 'Show notification badges', icon: AlertCircle, description: 'Display unread counts on navigation items' },
              ].map(({ key, label, icon: Icon, description }) => (
                <div key={key} className="flex items-start justify-between p-4 bg-gray-800/50 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <Icon className="h-6 w-6 text-orange-400 mt-1 flex-shrink-0" />
                    <div>
                      <div className="text-white font-medium">{label}</div>
                      <div className="text-gray-400 text-sm">{description}</div>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer ml-4">
                    <input
                      type="checkbox"
                      checked={preferences.inApp[key as keyof typeof preferences.inApp] as boolean}
                      onChange={(e) => updateInAppPreferences({ [key]: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Test Controls */}
          <div className="bg-black/20 backdrop-blur-sm rounded-2xl p-8 border border-gray-700">
            <h2 className="text-2xl font-bold text-white mb-6">🧪 Test Notifications</h2>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => notificationService.createTestNotification()}
                className="bg-yellow-500 hover:bg-yellow-600 text-black px-6 py-3 rounded-lg font-medium transition-all"
              >
                Create Test Notification
              </button>
              <button
                onClick={() => notificationService.requestPermissions()}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-all"
              >
                Request Browser Permissions
              </button>
            </div>
          </div>
        </div>
      </main>

      <AmenityFooter />
    </div>
  );
}