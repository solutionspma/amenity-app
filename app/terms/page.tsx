'use client';

import Link from 'next/link';
import AmenityHeader from '@/components/AmenityHeader';
import AmenityFooter from '@/components/AmenityFooter';
import { useBackdrop } from '@/contexts/BackdropContext';

export default function TermsPage() {
  const { getBackdropStyle } = useBackdrop();

  const lastUpdated = "November 14, 2025";
  const effectiveDate = "November 14, 2025";

  const sections = [
    {
      title: "Acceptance of Terms",
      content: [
        {
          subtitle: "Agreement to Terms",
          text: "By accessing or using Amenity platform, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any part of these terms, you may not use our services."
        },
        {
          subtitle: "Changes to Terms",
          text: "We reserve the right to modify these terms at any time. We will notify users of any material changes via email or platform notification. Continued use of the platform after changes constitutes acceptance of the new terms."
        },
        {
          subtitle: "Eligibility",
          text: "You must be at least 13 years old to use our platform. Users under 18 must have parental consent. By using our services, you represent that you meet these age requirements."
        }
      ]
    },
    {
      title: "User Accounts and Responsibilities",
      content: [
        {
          subtitle: "Account Creation",
          text: "You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You must provide accurate and complete information when creating your account."
        },
        {
          subtitle: "Account Security",
          text: "You must immediately notify us of any unauthorized use of your account or any other breach of security. We are not liable for any loss or damage arising from your failure to protect your account information."
        },
        {
          subtitle: "Prohibited Activities",
          text: "You may not use our platform to engage in illegal activities, harassment, spam, hate speech, or any content that violates our community guidelines. We reserve the right to suspend or terminate accounts that violate these terms."
        },
        {
          subtitle: "Content Standards",
          text: "All content must align with our faith-based community values. Content should be respectful, constructive, and appropriate for all ages. We encourage positive, uplifting content that builds community."
        }
      ]
    },
    {
      title: "Content and Intellectual Property",
      content: [
        {
          subtitle: "User Content Rights",
          text: "You retain ownership of content you create and post on our platform. By posting content, you grant us a non-exclusive, worldwide license to use, display, and distribute your content as part of our services."
        },
        {
          subtitle: "Content Moderation",
          text: "We reserve the right to review, moderate, and remove content that violates our terms or community guidelines. We may use automated systems and human reviewers for content moderation."
        },
        {
          subtitle: "Copyright Protection",
          text: "We respect intellectual property rights and expect our users to do the same. We will respond to valid copyright infringement notices in accordance with the Digital Millennium Copyright Act (DMCA)."
        },
        {
          subtitle: "Platform Content",
          text: "All platform features, design, logos, and original content created by Amenity are protected by copyright and other intellectual property laws. You may not copy or reproduce these without permission."
        }
      ]
    },
    {
      title: "Creator Economy and Monetization",
      content: [
        {
          subtitle: "Revenue Sharing",
          text: "Creators can earn revenue through our platform with our industry-leading 80-90% creator revenue share model. Specific terms and payment schedules are outlined in our Creator Agreement."
        },
        {
          subtitle: "Payment Terms",
          text: "Payments are processed monthly for qualified creators who meet minimum thresholds. We reserve the right to hold payments for investigation of suspicious activity or violations of terms."
        },
        {
          subtitle: "Tax Responsibilities",
          text: "Creators are responsible for reporting and paying all applicable taxes on earnings from the platform. We will provide necessary tax documentation as required by law."
        },
        {
          subtitle: "Subscription Services",
          text: "Users may subscribe to creators or premium features. Subscriptions are billed regularly and can be cancelled at any time. Refunds are provided according to our refund policy."
        }
      ]
    },
    {
      title: "Privacy and Data Protection",
      content: [
        {
          subtitle: "Data Collection",
          text: "Our collection and use of personal information is governed by our Privacy Policy, which is incorporated into these terms by reference. Please review our Privacy Policy to understand our data practices."
        },
        {
          subtitle: "Communications",
          text: "By using our platform, you consent to receive communications from us via email, push notifications, and in-platform messages. You can opt out of marketing communications at any time."
        },
        {
          subtitle: "Third-Party Services",
          text: "Our platform may integrate with third-party services. Your use of these services is subject to their respective terms and privacy policies in addition to ours."
        }
      ]
    },
    {
      title: "Platform Usage and Limitations",
      content: [
        {
          subtitle: "Service Availability",
          text: "While we strive for 24/7 availability, we do not guarantee uninterrupted service. We may temporarily suspend service for maintenance, updates, or technical issues."
        },
        {
          subtitle: "Usage Limits",
          text: "We may impose reasonable limits on platform usage to ensure fair access for all users and maintain service quality. Excessive usage may result in temporary restrictions."
        },
        {
          subtitle: "Device and Software Requirements",
          text: "Our platform requires compatible devices and up-to-date software. We are not responsible for issues arising from incompatible or outdated technology."
        },
        {
          subtitle: "Beta Features",
          text: "We may offer beta or experimental features. These features are provided as-is and may not work as intended. Beta features may be modified or discontinued at any time."
        }
      ]
    },
    {
      title: "Disclaimers and Limitation of Liability",
      content: [
        {
          subtitle: "Service Disclaimer",
          text: "Our platform is provided 'as is' without warranties of any kind. We disclaim all warranties, express or implied, including merchantability, fitness for a particular purpose, and non-infringement."
        },
        {
          subtitle: "User Content Disclaimer",
          text: "We are not responsible for user-generated content and do not endorse any opinions, recommendations, or advice expressed by users. Users interact with content at their own risk."
        },
        {
          subtitle: "Limitation of Liability",
          text: "To the fullest extent permitted by law, we shall not be liable for any indirect, incidental, consequential, or punitive damages arising from your use of the platform."
        },
        {
          subtitle: "Maximum Liability",
          text: "Our total liability to you for any claims related to the platform shall not exceed the amount you paid us in the 12 months preceding the claim, or $100, whichever is greater."
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen" style={getBackdropStyle('terms')}>
      <AmenityHeader currentPage="/terms" />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Terms of Service</h1>
          <p className="text-xl text-gray-300 mb-6">
            These terms govern your use of the Amenity platform and services
          </p>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 px-6 py-3 inline-block">
            <div className="text-sm text-gray-300">
              <div>Last updated: {lastUpdated}</div>
              <div>Effective date: {effectiveDate}</div>
            </div>
          </div>
        </div>

        {/* Important Notice */}
        <div className="bg-yellow-500/10 backdrop-blur-sm rounded-xl border border-yellow-500/20 p-6 mb-8">
          <h2 className="text-xl font-bold text-white mb-3 flex items-center">
            <span className="mr-3">⚠️</span>
            Important Notice
          </h2>
          <p className="text-gray-300">
            Please read these terms carefully before using our platform. By creating an account or using our services, 
            you agree to these terms. If you don't agree, please don't use our platform.
          </p>
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

        {/* Additional Legal Information */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm rounded-xl border border-white/20 p-6">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center">
              <span className="mr-3">⚖️</span>
              Dispute Resolution
            </h3>
            <div className="space-y-3 text-gray-300">
              <p><strong>Informal Resolution:</strong> We encourage resolving disputes through our support team first.</p>
              <p><strong>Arbitration:</strong> Disputes may be resolved through binding arbitration rather than court proceedings.</p>
              <p><strong>Governing Law:</strong> These terms are governed by the laws of [Jurisdiction].</p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-500/20 to-blue-500/20 backdrop-blur-sm rounded-xl border border-white/20 p-6">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center">
              <span className="mr-3">🤝</span>
              Community Values
            </h3>
            <div className="space-y-3 text-gray-300">
              <p><strong>Faith-Based:</strong> Our platform is built on Christian values and principles.</p>
              <p><strong>Respectful:</strong> We expect all users to treat others with respect and kindness.</p>
              <p><strong>Safe Space:</strong> We maintain a safe environment for users of all ages.</p>
            </div>
          </div>
        </div>

        {/* Termination */}
        <div className="mt-8 bg-red-500/10 backdrop-blur-sm rounded-xl border border-red-500/20 p-6">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center">
            <span className="mr-3">🚫</span>
            Account Termination
          </h3>
          <div className="text-gray-300 space-y-3">
            <p>
              <strong>Your Right to Terminate:</strong> You may delete your account at any time through your account settings. 
              Some information may be retained as required by law or for legitimate business purposes.
            </p>
            <p>
              <strong>Our Right to Terminate:</strong> We may suspend or terminate your account if you violate these terms, 
              engage in harmful behavior, or for other legitimate reasons. We will provide notice when possible.
            </p>
            <p>
              <strong>Effect of Termination:</strong> Upon termination, your right to use the platform ceases immediately. 
              Some provisions of these terms will survive termination.
            </p>
          </div>
        </div>

        {/* Contact Information */}
        <div className="mt-12 bg-white/5 backdrop-blur-sm rounded-xl border border-white/20 p-8 text-center">
          <h3 className="text-2xl font-bold text-white mb-4">Questions About These Terms?</h3>
          <p className="text-gray-300 mb-6">
            If you have any questions about these terms of service, please don't hesitate to contact us.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-3 rounded-lg font-medium hover:from-purple-600 hover:to-pink-600 transition-all"
            >
              📧 Contact Legal Team
            </Link>
            <Link
              href="/help"
              className="bg-white/10 backdrop-blur-sm border border-white/20 text-white px-8 py-3 rounded-lg font-medium hover:bg-white/20 transition-all"
            >
              📚 Terms Help Center
            </Link>
          </div>
          
          <div className="mt-6 text-sm text-gray-400">
            <p>Email: legal@amenity-platform.com</p>
            <p>Address: 123 Faith Street, Ministry City, MC 12345</p>
          </div>
        </div>
      </div>

      <AmenityFooter />
    </div>
  );
}