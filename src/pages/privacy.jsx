// ============================================
// FILE: src/pages/privacy.jsx
// CYBEV Privacy Policy Page
// ============================================

import Head from 'next/head';
import Link from 'next/link';
import { ArrowLeft, Shield, Mail } from 'lucide-react';

export default function PrivacyPolicy() {
  const lastUpdated = "January 6, 2025";
  
  return (
    <>
      <Head>
        <title>Privacy Policy | CYBEV</title>
        <meta name="description" content="CYBEV Privacy Policy - Learn how we collect, use, and protect your personal information." />
      </Head>

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
          <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
            <Link href="/" className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition">
              <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </Link>
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-purple-600" />
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">Privacy Policy</h1>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="max-w-4xl mx-auto px-4 py-8">
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 md:p-10">
            
            <div className="mb-8 pb-6 border-b border-gray-200 dark:border-gray-700">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Privacy Policy</h1>
              <p className="text-gray-500 dark:text-gray-400">Last updated: {lastUpdated}</p>
            </div>

            <div className="prose prose-gray dark:prose-invert max-w-none">
              
              <section className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">1. Introduction</h2>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Welcome to CYBEV ("we," "our," or "us"). We are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our social blogging platform and related services (collectively, the "Service").
                </p>
                <p className="text-gray-600 dark:text-gray-300">
                  By using CYBEV, you agree to the collection and use of information in accordance with this policy. If you do not agree with our policies and practices, please do not use our Service.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">2. Information We Collect</h2>
                
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">2.1 Information You Provide</h3>
                <ul className="list-disc pl-6 text-gray-600 dark:text-gray-300 mb-4 space-y-2">
                  <li><strong>Account Information:</strong> Name, email address, username, password, and profile picture when you create an account.</li>
                  <li><strong>Profile Information:</strong> Bio, social links, and other information you choose to add to your profile.</li>
                  <li><strong>Content:</strong> Blog posts, articles, comments, messages, images, videos, and live streams you create or share.</li>
                  <li><strong>Communications:</strong> Information you provide when you contact us for support or feedback.</li>
                </ul>

                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">2.2 Information Collected Automatically</h3>
                <ul className="list-disc pl-6 text-gray-600 dark:text-gray-300 mb-4 space-y-2">
                  <li><strong>Usage Data:</strong> Pages visited, features used, time spent on the platform, and interaction patterns.</li>
                  <li><strong>Device Information:</strong> Device type, operating system, browser type, and unique device identifiers.</li>
                  <li><strong>Log Data:</strong> IP address, access times, and referring URLs.</li>
                  <li><strong>Cookies:</strong> We use cookies and similar technologies to enhance your experience and analyze usage.</li>
                </ul>

                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">2.3 Information from Third Parties</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  If you choose to sign in using Google, Facebook, Apple, or other social login providers, we receive basic profile information (name, email, profile picture) as permitted by your privacy settings on those platforms.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">3. How We Use Your Information</h2>
                <p className="text-gray-600 dark:text-gray-300 mb-4">We use the information we collect to:</p>
                <ul className="list-disc pl-6 text-gray-600 dark:text-gray-300 space-y-2">
                  <li>Provide, maintain, and improve our Service</li>
                  <li>Create and manage your account</li>
                  <li>Enable you to create, publish, and share content</li>
                  <li>Facilitate social interactions (following, commenting, messaging)</li>
                  <li>Send notifications about activity on your account</li>
                  <li>Provide customer support</li>
                  <li>Analyze usage patterns to improve user experience</li>
                  <li>Detect and prevent fraud, abuse, and security issues</li>
                  <li>Comply with legal obligations</li>
                  <li>Send promotional communications (with your consent)</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">4. Sharing Your Information</h2>
                <p className="text-gray-600 dark:text-gray-300 mb-4">We may share your information in the following circumstances:</p>
                <ul className="list-disc pl-6 text-gray-600 dark:text-gray-300 space-y-2">
                  <li><strong>Public Content:</strong> Content you post publicly (blogs, posts, comments) is visible to other users and may be indexed by search engines.</li>
                  <li><strong>Service Providers:</strong> We share data with trusted third-party services that help us operate our platform (hosting, analytics, email delivery).</li>
                  <li><strong>Legal Requirements:</strong> We may disclose information if required by law or to protect our rights and safety.</li>
                  <li><strong>Business Transfers:</strong> In the event of a merger, acquisition, or sale of assets, your information may be transferred.</li>
                </ul>
                <p className="text-gray-600 dark:text-gray-300 mt-4">
                  <strong>We do not sell your personal information to third parties.</strong>
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">5. Data Security</h2>
                <p className="text-gray-600 dark:text-gray-300">
                  We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. This includes encryption of data in transit (HTTPS), secure password hashing, and regular security assessments. However, no method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">6. Data Retention</h2>
                <p className="text-gray-600 dark:text-gray-300">
                  We retain your personal information for as long as your account is active or as needed to provide you with our Service. If you delete your account, we will delete or anonymize your personal information within 30 days, except where we are required to retain it for legal purposes.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">7. Your Rights and Choices</h2>
                <p className="text-gray-600 dark:text-gray-300 mb-4">You have the following rights regarding your personal information:</p>
                <ul className="list-disc pl-6 text-gray-600 dark:text-gray-300 space-y-2">
                  <li><strong>Access:</strong> Request a copy of the personal information we hold about you.</li>
                  <li><strong>Correction:</strong> Update or correct inaccurate information through your account settings.</li>
                  <li><strong>Deletion:</strong> Request deletion of your account and personal data.</li>
                  <li><strong>Portability:</strong> Request a copy of your data in a portable format.</li>
                  <li><strong>Opt-out:</strong> Unsubscribe from marketing communications at any time.</li>
                  <li><strong>Cookies:</strong> Manage cookie preferences through your browser settings.</li>
                </ul>
                <p className="text-gray-600 dark:text-gray-300 mt-4">
                  To exercise these rights, please contact us at <a href="mailto:privacy@cybev.io" className="text-purple-600 hover:underline">privacy@cybev.io</a>.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">8. Children's Privacy</h2>
                <p className="text-gray-600 dark:text-gray-300">
                  Our Service is not intended for children under the age of 13. We do not knowingly collect personal information from children under 13. If we become aware that we have collected personal information from a child under 13, we will take steps to delete that information.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">9. International Data Transfers</h2>
                <p className="text-gray-600 dark:text-gray-300">
                  Your information may be transferred to and processed in countries other than your country of residence. These countries may have different data protection laws. By using our Service, you consent to the transfer of your information to these countries.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">10. Third-Party Links</h2>
                <p className="text-gray-600 dark:text-gray-300">
                  Our Service may contain links to third-party websites or services. We are not responsible for the privacy practices of these third parties. We encourage you to read the privacy policies of any third-party sites you visit.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">11. Changes to This Policy</h2>
                <p className="text-gray-600 dark:text-gray-300">
                  We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last updated" date. We encourage you to review this Privacy Policy periodically for any changes.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">12. Contact Us</h2>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  If you have any questions about this Privacy Policy or our privacy practices, please contact us:
                </p>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
                  <p className="text-gray-700 dark:text-gray-300">
                    <strong>CYBEV</strong><br />
                    Email: <a href="mailto:privacy@cybev.io" className="text-purple-600 hover:underline">privacy@cybev.io</a><br />
                    Website: <a href="https://cybev.io" className="text-purple-600 hover:underline">https://cybev.io</a>
                  </p>
                </div>
              </section>

            </div>
          </div>

          {/* Footer Links */}
          <div className="mt-8 text-center">
            <Link href="/terms" className="text-purple-600 hover:underline font-medium">
              View Terms of Service →
            </Link>
          </div>
        </main>
      </div>
    </>
  );
}
