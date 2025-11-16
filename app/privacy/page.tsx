'use client';

import Link from 'next/link';
import AmenityHeader from '@/components/AmenityHeader';
import AmenityFooter from '@/components/AmenityFooter';
import { useBackdrop } from '@/contexts/BackdropContext';

export default function PrivacyPage() {
  const { getBackdropStyle } = useBackdrop();

  const lastUpdated = "November 14, 2025";

  const sections = [
    {
      title: "Information We Collect",
      content: [
        {
          subtitle: "Personal Information",
          text: "When you create an account, we collect information such as your name, email address, phone number, and profile details. This helps us provide personalized services and ensure account security."
        },
        {
          subtitle: "Content Information",
          text: "We collect the content you create, upload, and share on our platform, including posts, comments, messages, photos, videos, and live streams."
        },
        {
          subtitle: "Usage Information", 
          text: "We automatically collect information about how you use our services, including pages visited, features used, time spent, and interaction patterns."
        },
        {
          subtitle: "Device Information",
          text: "We collect information about the devices you use to access our platform, including device type, operating system, browser type, IP address, and mobile network information."
        }
      ]
    },
    {
      title: "How We Use Your Information",
      content: [
        {
          subtitle: "Service Provision",
          text: "We use your information to provide, maintain, and improve our services, including personalizing your experience and enabling communication with other users."
        },
        {
          subtitle: "Safety and Security",
          text: "We use your information to protect our community by detecting and preventing harmful behavior, spam, and violations of our terms of service."
        },
        {
          subtitle: "Communication",
          text: "We may use your contact information to send you service updates, security alerts, and marketing communications (which you can opt out of at any time)."
        },
        {
          subtitle: "Analytics and Improvement",
          text: "We analyze usage patterns to understand how our services are used and to make improvements and develop new features."
        }
      ]
    },
    {
      title: "Information Sharing",
      content: [
        {
          subtitle: "Public Content",
          text: "Content you choose to make public (posts, comments, public profile information) will be visible to other users and may be accessible through search engines."
        },
        {
          subtitle: "Service Providers",
          text: "We may share information with trusted third-party service providers who help us operate our platform, such as cloud hosting, analytics, and customer support services."
        },
        {
          subtitle: "Legal Requirements",
          text: "We may disclose information when required by law, legal process, or to protect the rights, property, or safety of our users and the public."
        },
        {
          subtitle: "Business Transfers",
          text: "In the event of a merger, acquisition, or sale of assets, user information may be transferred as part of that transaction."
        }
      ]
    },
    {
      title: "Your Privacy Controls",
      content: [
        {
          subtitle: "Account Settings",
          text: "You can access and update your personal information through your account settings. You have control over what information appears in your profile and who can see it."
        },
        {
          subtitle: "Privacy Settings",
          text: "We provide various privacy settings that allow you to control who can see your content, send you messages, and interact with you on the platform."
        },
        {
          subtitle: "Content Management",
          text: "You can edit, delete, or archive your content at any time. Deleted content is removed from public view but may be retained in backups for a limited time."
        },
        {
          subtitle: "Data Portability",
          text: "You can request a copy of your data in a machine-readable format. Contact our support team to initiate a data export request."
        }
      ]
    },
    {
      title: "Data Security",
      content: [
        {
          subtitle: "Encryption",
          text: "We use industry-standard encryption to protect your data in transit and at rest. All communications between your device and our servers are encrypted using SSL/TLS."
        },
        {
          subtitle: "Access Controls", 
          text: "We implement strict access controls to ensure that only authorized personnel can access user data, and only when necessary for service operations."
        },
        {
          subtitle: "Security Monitoring",
          text: "We continuously monitor our systems for security threats and vulnerabilities, and we regularly update our security measures."
        },
        {
          subtitle: "Incident Response",
          text: "In the event of a security incident, we have procedures in place to respond quickly and notify affected users as required by law."
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen" style={getBackdropStyle('privacy')}>
      <AmenityHeader currentPage="/privacy" />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Privacy Policy</h1>
          <p className="text-xl text-gray-300 mb-6">
            Your privacy is important to us. This policy explains how we collect, use, and protect your information.
          </p>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 px-4 py-2 inline-block">
            <span className="text-gray-300">Last updated: {lastUpdated}</span>
          </div>
        </div>

        {/* Quick Navigation */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 p-6 mb-8">
          <h2 className="text-xl font-bold text-white mb-4">Quick Navigation</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {sections.map((section, index) => (
              <a
                key={index}
                href={`#section-${index}`}
                className="text-purple-400 hover:text-purple-300 transition-colors"
              >
                • {section.title}
              </a>
            ))}
          </div>
        </div>

        {/* Sections */}
        <div className="space-y-8">
          {sections.map((section, sectionIndex) => (
            <div
              key={sectionIndex}
              id={`section-${sectionIndex}`}
              className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 p-8"
            >
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mr-3">
                  {sectionIndex + 1}
                </span>
                {section.title}
              </h2>
              
              <div className="space-y-6">
                {section.content.map((item, itemIndex) => (
                  <div key={itemIndex}>
                    <h3 className="text-lg font-semibold text-white mb-3">{item.subtitle}</h3>
                    <p className="text-gray-300 leading-relaxed">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Additional Information */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm rounded-xl border border-white/20 p-6">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center">
              <span className="mr-3">🛡️</span>
              Data Protection Rights
            </h3>
            <p className="text-gray-300 mb-4">
              Depending on your location, you may have additional rights regarding your personal data, including:
            </p>
            <ul className="space-y-2 text-gray-300">
              <li>• Right to access your data</li>
              <li>• Right to correct inaccurate data</li>
              <li>• Right to delete your data</li>
              <li>• Right to restrict processing</li>
              <li>• Right to data portability</li>
              <li>• Right to object to processing</li>
            </ul>
          </div>

          <div className="bg-gradient-to-r from-green-500/20 to-blue-500/20 backdrop-blur-sm rounded-xl border border-white/20 p-6">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center">
              <span className="mr-3">🔒</span>
              Children's Privacy
            </h3>
            <p className="text-gray-300 mb-4">
              Our services are not intended for children under 13. We do not knowingly collect personal information from children under 13.
            </p>
            <p className="text-gray-300">
              If you believe we have collected information from a child under 13, please contact us immediately so we can delete such information.
            </p>
          </div>
        </div>

        {/* Contact Information */}
        <div className="mt-12 bg-white/5 backdrop-blur-sm rounded-xl border border-white/20 p-8 text-center">
          <h3 className="text-2xl font-bold text-white mb-4">Questions About Privacy?</h3>
          <p className="text-gray-300 mb-6">
            If you have any questions about this privacy policy or how we handle your data, we're here to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-3 rounded-lg font-medium hover:from-purple-600 hover:to-pink-600 transition-all"
            >
              📧 Contact Privacy Team
            </Link>
            <Link
              href="/help"
              className="bg-white/10 backdrop-blur-sm border border-white/20 text-white px-8 py-3 rounded-lg font-medium hover:bg-white/20 transition-all"
            >
              📚 Privacy Help Center
            </Link>
          </div>
          
          <div className="mt-6 text-sm text-gray-400">
            <p>Email: privacy@amenity-platform.com</p>
            <p>Address: 123 Faith Street, Ministry City, MC 12345</p>
          </div>
        </div>

        {/* Policy Changes */}
        <div className="mt-8 bg-yellow-500/10 backdrop-blur-sm rounded-xl border border-yellow-500/20 p-6">
          <h3 className="text-lg font-bold text-white mb-3 flex items-center">
            <span className="mr-3">📝</span>
            Policy Updates
          </h3>
          <p className="text-gray-300 text-sm">
            We may update this privacy policy from time to time. We will notify you of any material changes by posting the new policy on this page and updating the "Last updated" date. We encourage you to review this policy periodically.
          </p>
        </div>
      </div>

      <AmenityFooter />
    </div>
  );
}