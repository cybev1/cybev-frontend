// ============================================
// FILE: src/pages/terms.jsx
// CYBEV Terms of Service Page
// ============================================

import Head from 'next/head';
import Link from 'next/link';
import { ArrowLeft, FileText, Mail } from 'lucide-react';

export default function TermsOfService() {
  const lastUpdated = "January 6, 2025";
  
  return (
    <>
      <Head>
        <title>Terms of Service | CYBEV</title>
        <meta name="description" content="CYBEV Terms of Service - Rules and guidelines for using our platform." />
      </Head>

      <div className="min-h-screen bg-gray-50 dark:bg-gray-50">
        {/* Header */}
        <header className="bg-white dark:bg-white border-b border-gray-200 dark:border-gray-200 sticky top-0 z-10">
          <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
            <Link href="/" className="p-2 hover:bg-gray-100 dark:hover:bg-gray-100 rounded-xl transition">
              <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-500" />
            </Link>
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-purple-600" />
              <h1 className="text-xl font-bold text-gray-900 dark:text-gray-900">Terms of Service</h1>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="max-w-4xl mx-auto px-4 py-8">
          <div className="bg-white dark:bg-white rounded-2xl border border-gray-200 dark:border-gray-200 p-6 md:p-10">
            
            <div className="mb-8 pb-6 border-b border-gray-200 dark:border-gray-200">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-900 mb-2">Terms of Service</h1>
              <p className="text-gray-500 dark:text-gray-500">Last updated: {lastUpdated}</p>
            </div>

            <div className="prose prose-gray dark:prose-invert max-w-none">
              
              <section className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-900 mb-4">1. Agreement to Terms</h2>
                <p className="text-gray-600 dark:text-gray-600 mb-4">
                  Welcome to CYBEV! These Terms of Service ("Terms") govern your access to and use of the CYBEV platform, including our website, mobile applications, and all related services (collectively, the "Service"). By accessing or using our Service, you agree to be bound by these Terms.
                </p>
                <p className="text-gray-600 dark:text-gray-600">
                  If you do not agree to these Terms, you may not access or use our Service. We may modify these Terms at any time, and your continued use of the Service after such modifications constitutes your acceptance of the updated Terms.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-900 mb-4">2. Eligibility</h2>
                <p className="text-gray-600 dark:text-gray-600">
                  You must be at least 13 years old to use our Service. If you are under 18, you represent that you have your parent's or guardian's permission to use the Service. By using the Service, you represent and warrant that you meet these eligibility requirements.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-900 mb-4">3. Account Registration</h2>
                <p className="text-gray-600 dark:text-gray-600 mb-4">
                  To access certain features of our Service, you must create an account. When creating an account, you agree to:
                </p>
                <ul className="list-disc pl-6 text-gray-600 dark:text-gray-600 space-y-2">
                  <li>Provide accurate, current, and complete information</li>
                  <li>Maintain and promptly update your account information</li>
                  <li>Keep your password secure and confidential</li>
                  <li>Accept responsibility for all activities that occur under your account</li>
                  <li>Notify us immediately of any unauthorized use of your account</li>
                </ul>
                <p className="text-gray-600 dark:text-gray-600 mt-4">
                  We reserve the right to suspend or terminate accounts that violate these Terms or for any other reason at our discretion.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-900 mb-4">4. User Content</h2>
                
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-700 mb-3">4.1 Your Content</h3>
                <p className="text-gray-600 dark:text-gray-600 mb-4">
                  Our Service allows you to create, upload, publish, and share content including text, images, videos, live streams, and other materials ("User Content"). You retain ownership of your User Content, but by posting it on CYBEV, you grant us a worldwide, non-exclusive, royalty-free license to use, copy, modify, distribute, publish, and process your User Content for the purpose of operating and improving our Service.
                </p>

                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-700 mb-3">4.2 Content Standards</h3>
                <p className="text-gray-600 dark:text-gray-600 mb-4">You agree not to post User Content that:</p>
                <ul className="list-disc pl-6 text-gray-600 dark:text-gray-600 space-y-2">
                  <li>Is illegal, harmful, threatening, abusive, harassing, defamatory, or otherwise objectionable</li>
                  <li>Infringes any patent, trademark, copyright, or other intellectual property rights</li>
                  <li>Contains viruses, malware, or other harmful code</li>
                  <li>Promotes violence, discrimination, or hatred against individuals or groups</li>
                  <li>Contains sexually explicit material or pornography</li>
                  <li>Impersonates any person or entity or misrepresents your affiliation</li>
                  <li>Contains spam, advertising, or promotional material without authorization</li>
                  <li>Violates the privacy rights of others</li>
                  <li>Is false, misleading, or deceptive</li>
                </ul>

                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-700 mb-3 mt-4">4.3 Content Moderation</h3>
                <p className="text-gray-600 dark:text-gray-600">
                  We reserve the right, but are not obligated, to monitor, review, and remove User Content at our sole discretion. We may remove content that violates these Terms or that we find objectionable for any reason.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-900 mb-4">5. Prohibited Activities</h2>
                <p className="text-gray-600 dark:text-gray-600 mb-4">You agree not to:</p>
                <ul className="list-disc pl-6 text-gray-600 dark:text-gray-600 space-y-2">
                  <li>Use the Service for any illegal purpose or in violation of any laws</li>
                  <li>Harass, bully, intimidate, or threaten other users</li>
                  <li>Attempt to gain unauthorized access to our systems or other users' accounts</li>
                  <li>Use automated scripts, bots, or scrapers to access the Service</li>
                  <li>Interfere with or disrupt the Service or servers</li>
                  <li>Circumvent any access restrictions or security measures</li>
                  <li>Create multiple accounts for deceptive or abusive purposes</li>
                  <li>Sell or transfer your account to another party</li>
                  <li>Use the Service to send spam or unsolicited messages</li>
                  <li>Engage in any activity that could damage our reputation or goodwill</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-900 mb-4">6. Intellectual Property</h2>
                <p className="text-gray-600 dark:text-gray-600 mb-4">
                  The Service and its original content (excluding User Content), features, and functionality are owned by CYBEV and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.
                </p>
                <p className="text-gray-600 dark:text-gray-600">
                  The CYBEV name, logo, and all related names, logos, product and service names, designs, and slogans are trademarks of CYBEV. You may not use these marks without our prior written permission.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-900 mb-4">7. AI-Generated Content</h2>
                <p className="text-gray-600 dark:text-gray-600 mb-4">
                  Our Service includes AI-powered features to assist with content creation. When using these features:
                </p>
                <ul className="list-disc pl-6 text-gray-600 dark:text-gray-600 space-y-2">
                  <li>You are responsible for reviewing and editing AI-generated content before publishing</li>
                  <li>AI-generated content should be used as a starting point, not a final product</li>
                  <li>You must ensure AI-generated content complies with our Content Standards</li>
                  <li>We do not guarantee the accuracy, completeness, or appropriateness of AI-generated content</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-900 mb-4">8. Live Streaming</h2>
                <p className="text-gray-600 dark:text-gray-600 mb-4">
                  When using our live streaming features, you agree to:
                </p>
                <ul className="list-disc pl-6 text-gray-600 dark:text-gray-600 space-y-2">
                  <li>Comply with all Content Standards during your stream</li>
                  <li>Not stream copyrighted content without authorization</li>
                  <li>Not engage in dangerous or illegal activities during streams</li>
                  <li>Accept that streams may be recorded and stored</li>
                  <li>Take responsibility for all content broadcast during your streams</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-900 mb-4">9. Third-Party Services</h2>
                <p className="text-gray-600 dark:text-gray-600">
                  Our Service may contain links to third-party websites or integrate with third-party services (such as social login providers). We are not responsible for the content, privacy policies, or practices of third-party services. Your use of third-party services is at your own risk and subject to their terms and conditions.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-900 mb-4">10. Disclaimers</h2>
                <p className="text-gray-600 dark:text-gray-600 mb-4">
                  THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED. WE DISCLAIM ALL WARRANTIES, INCLUDING BUT NOT LIMITED TO:
                </p>
                <ul className="list-disc pl-6 text-gray-600 dark:text-gray-600 space-y-2">
                  <li>Merchantability and fitness for a particular purpose</li>
                  <li>Non-infringement</li>
                  <li>Accuracy, reliability, or completeness of content</li>
                  <li>Uninterrupted or error-free operation</li>
                  <li>Security of your data or content</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-900 mb-4">11. Limitation of Liability</h2>
                <p className="text-gray-600 dark:text-gray-600">
                  TO THE MAXIMUM EXTENT PERMITTED BY LAW, CYBEV SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO LOSS OF PROFITS, DATA, USE, OR GOODWILL, ARISING OUT OF OR RELATED TO YOUR USE OF THE SERVICE, REGARDLESS OF THE THEORY OF LIABILITY.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-900 mb-4">12. Indemnification</h2>
                <p className="text-gray-600 dark:text-gray-600">
                  You agree to indemnify, defend, and hold harmless CYBEV and its officers, directors, employees, and agents from and against any claims, damages, losses, liabilities, costs, and expenses (including reasonable attorneys' fees) arising out of or related to your use of the Service, your User Content, or your violation of these Terms.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-900 mb-4">13. Termination</h2>
                <p className="text-gray-600 dark:text-gray-600 mb-4">
                  We may terminate or suspend your account and access to the Service immediately, without prior notice or liability, for any reason, including if you breach these Terms. Upon termination:
                </p>
                <ul className="list-disc pl-6 text-gray-600 dark:text-gray-600 space-y-2">
                  <li>Your right to use the Service will immediately cease</li>
                  <li>We may delete your account and User Content</li>
                  <li>Provisions of these Terms that should survive termination will remain in effect</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-900 mb-4">14. Governing Law</h2>
                <p className="text-gray-600 dark:text-gray-600">
                  These Terms shall be governed by and construed in accordance with the laws of the jurisdiction in which CYBEV operates, without regard to its conflict of law provisions. Any disputes arising under these Terms shall be resolved through binding arbitration or in the courts of competent jurisdiction.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-900 mb-4">15. Changes to Terms</h2>
                <p className="text-gray-600 dark:text-gray-600">
                  We reserve the right to modify these Terms at any time. We will notify users of material changes by posting the updated Terms on this page and updating the "Last updated" date. Your continued use of the Service after changes become effective constitutes your acceptance of the revised Terms.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-900 mb-4">16. Severability</h2>
                <p className="text-gray-600 dark:text-gray-600">
                  If any provision of these Terms is found to be unenforceable or invalid, that provision shall be limited or eliminated to the minimum extent necessary, and the remaining provisions shall remain in full force and effect.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-900 mb-4">17. Entire Agreement</h2>
                <p className="text-gray-600 dark:text-gray-600">
                  These Terms, together with our Privacy Policy, constitute the entire agreement between you and CYBEV regarding the use of our Service and supersede any prior agreements.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-900 mb-4">18. Contact Us</h2>
                <p className="text-gray-600 dark:text-gray-600 mb-4">
                  If you have any questions about these Terms of Service, please contact us:
                </p>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
                  <p className="text-gray-700 dark:text-gray-600">
                    <strong>CYBEV</strong><br />
                    Email: <a href="mailto:legal@cybev.io" className="text-purple-600 hover:underline">legal@cybev.io</a><br />
                    Website: <a href="https://cybev.io" className="text-purple-600 hover:underline">https://cybev.io</a>
                  </p>
                </div>
              </section>

            </div>
          </div>

          {/* Footer Links */}
          <div className="mt-8 text-center">
            <Link href="/privacy" className="text-purple-600 hover:underline font-medium">
              View Privacy Policy →
            </Link>
          </div>
        </main>
      </div>
    </>
  );
}
