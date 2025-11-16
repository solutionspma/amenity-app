'use client';

import { useState } from 'react';
import AmenityHeader from '@/components/AmenityHeader';
import AmenityFooter from '@/components/AmenityFooter';
import { useBackdrop } from '@/contexts/BackdropContext';

export default function ContactPage() {
  const { getBackdropStyle } = useBackdrop();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    category: '',
    message: '',
    priority: 'normal'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const contactMethods = [
    {
      title: 'Email Support',
      description: 'Get help via email within 24 hours',
      icon: '📧',
      contact: 'support@amenity-platform.com',
      availability: '24/7'
    },
    {
      title: 'Live Chat',
      description: 'Chat with our support team in real-time',
      icon: '💬',
      contact: 'Available in app',
      availability: 'Mon-Fri 9AM-6PM EST'
    },
    {
      title: 'Phone Support',
      description: 'Speak directly with our team',
      icon: '📞',
      contact: '+1 (555) 123-4567',
      availability: 'Mon-Fri 9AM-5PM EST'
    },
    {
      title: 'Community Forum',
      description: 'Get help from other users',
      icon: '🌐',
      contact: 'forum.amenity-platform.com',
      availability: '24/7'
    }
  ];

  if (isSubmitted) {
    return (
      <div className="min-h-screen" style={getBackdropStyle('contact')}>
        <AmenityHeader currentPage="/contact" />
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 p-12">
            <div className="text-6xl mb-6">✅</div>
            <h1 className="text-3xl font-bold text-white mb-4">Message Sent!</h1>
            <p className="text-xl text-gray-300 mb-8">
              Thank you for contacting us. We'll get back to you within 24 hours.
            </p>
            <div className="space-y-4">
              <p className="text-gray-300">
                <strong>Reference ID:</strong> #{Math.random().toString(36).substr(2, 9).toUpperCase()}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="bg-white/10 backdrop-blur-sm border border-white/20 text-white px-6 py-3 rounded-lg font-medium hover:bg-white/20 transition-all"
                >
                  Send Another Message
                </button>
                <a
                  href="/"
                  className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-lg font-medium hover:from-purple-600 hover:to-pink-600 transition-all text-center"
                >
                  Return Home
                </a>
              </div>
            </div>
          </div>
        </div>

        <AmenityFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={getBackdropStyle('contact')}>
      <AmenityHeader currentPage="/contact" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Contact Us</h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            We're here to help! Get in touch with our support team
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 p-8">
              <h2 className="text-2xl font-bold text-white mb-6">Send us a message</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Your full name"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="your.email@example.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-300 mb-2">
                      Category *
                    </label>
                    <select
                      id="category"
                      name="category"
                      required
                      value={formData.category}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="">Select a category</option>
                      <option value="technical">Technical Issue</option>
                      <option value="account">Account Help</option>
                      <option value="billing">Billing Question</option>
                      <option value="feature">Feature Request</option>
                      <option value="bug">Bug Report</option>
                      <option value="general">General Inquiry</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="priority" className="block text-sm font-medium text-gray-300 mb-2">
                      Priority
                    </label>
                    <select
                      id="priority"
                      name="priority"
                      value={formData.priority}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="low">Low</option>
                      <option value="normal">Normal</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-2">
                    Subject *
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    required
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Brief description of your issue"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={6}
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                    placeholder="Please describe your issue in detail. Include any error messages, steps to reproduce, or specific questions you have."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 px-6 rounded-lg font-medium hover:from-purple-600 hover:to-pink-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending...
                    </>
                  ) : (
                    '📧 Send Message'
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Contact Methods */}
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 p-6">
              <h3 className="text-xl font-bold text-white mb-4">Other ways to reach us</h3>
              
              <div className="space-y-4">
                {contactMethods.map((method) => (
                  <div key={method.title} className="border-b border-white/10 pb-4 last:border-b-0 last:pb-0">
                    <div className="flex items-start space-x-3">
                      <span className="text-2xl">{method.icon}</span>
                      <div className="flex-1">
                        <h4 className="font-semibold text-white">{method.title}</h4>
                        <p className="text-sm text-gray-300 mb-2">{method.description}</p>
                        <div className="text-sm">
                          <div className="text-purple-400 font-medium">{method.contact}</div>
                          <div className="text-gray-400">{method.availability}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* FAQ Link */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 p-6">
              <h3 className="text-xl font-bold text-white mb-4">Before you contact us</h3>
              <p className="text-gray-300 mb-4">
                Check out our Help Center for instant answers to common questions.
              </p>
              <a
                href="/help"
                className="block w-full bg-white/10 backdrop-blur-sm border border-white/20 text-white py-3 px-4 rounded-lg font-medium hover:bg-white/20 transition-all text-center"
              >
                📚 Visit Help Center
              </a>
            </div>

            {/* Response Time */}
            <div className="bg-gradient-to-r from-green-500/20 to-blue-500/20 backdrop-blur-sm rounded-2xl border border-white/20 p-6">
              <h3 className="text-xl font-bold text-white mb-4">Response Times</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-300">Email:</span>
                  <span className="text-white font-medium">&lt; 24 hours</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Live Chat:</span>
                  <span className="text-white font-medium">&lt; 5 minutes</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Phone:</span>
                  <span className="text-white font-medium">Immediate</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AmenityFooter />
    </div>
  );
}