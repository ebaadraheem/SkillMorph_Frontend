import { motion } from 'framer-motion';

const PrivacyPolicy = () => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-[#F9FAFB] text-[#111827] p-4 md:p-8 lg:p-12"
    >
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-[#3B82F6]">Privacy Policy</h1>
        <p className="text-[#111827] mb-4">Last Updated: February 2, 2025</p>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-[#3B82F6]">1. Information We Collect</h2>
          
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-3 text-[#3B82F6]">1.1. Information You Provide</h3>
            <ul className="list-disc list-inside text-[#111827] space-y-2">
              <li>Account information (name, email, password)</li>
              <li>Profile information</li>
              <li>Payment information (processed securely through Stripe)</li>
              <li>Course content (for Creators)</li>
              <li>Communications with us</li>
            </ul>
          </div>

          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-3 text-[#3B82F6]">1.2. Information Automatically Collected</h3>
            <ul className="list-disc list-inside text-[#111827] space-y-2">
              <li>Device information</li>
              <li>Log data</li>
              <li>Usage information</li>
              <li>Cookies and similar technologies</li>
              <li>Payment and transaction history</li>
            </ul>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-[#3B82F6]">2. How We Use Your Information</h2>
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <p className="text-[#111827] mb-4">We use your information to:</p>
            <ul className="list-disc list-inside text-[#111827] space-y-2">
              <li>Provide and maintain the Service</li>
              <li>Process payments and transactions</li>
              <li>Send administrative communications</li>
              <li>Provide customer support</li>
              <li>Analyze platform usage</li>
              <li>Prevent fraud and abuse</li>
              <li>Comply with legal obligations</li>
            </ul>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-[#3B82F6]">3. Information Sharing</h2>
          <div className="space-y-4">
            <h3 className="text-xl font-semibold mb-3 text-[#3B82F6]">3.1. Third-Party Service Providers</h3>
            <p className="text-[#111827] mb-4">We share information with:</p>
            <ul className="list-disc list-inside text-[#111827] space-y-2">
              <li>Stripe for payment processing</li>
              <li>Service providers who assist our operations</li>
              <li>Law enforcement when required by law</li>
              <li>Other users as part of normal platform operation (e.g., Creator profiles)</li>
            </ul>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-[#3B82F6]">4. Data Security</h2>
          <div className="bg-white rounded-lg p-6 shadow-sm space-y-4">
            <p className="text-[#111827]">We implement appropriate security measures to protect your information:</p>
            <ul className="list-disc list-inside text-[#111827] space-y-2">
              <li>Industry-standard encryption for data transmission</li>
              <li>Regular security audits and updates</li>
              <li>Secure data storage practices</li>
              <li>Limited access to personal information by employees</li>
            </ul>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-[#3B82F6]">5. Your Rights</h2>
          <div className="space-y-4">
            <p className="text-[#111827]">You have the right to:</p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold mb-2 text-[#3B82F6]">Access and Control</h3>
                <ul className="list-disc list-inside text-[#111827] space-y-2">
                  <li>Access your personal information</li>
                  <li>Correct inaccurate information</li>
                  <li>Request deletion of your information</li>
                </ul>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold mb-2 text-[#3B82F6]">Data Portability</h3>
                <ul className="list-disc list-inside text-[#111827] space-y-2">
                  <li>Export your data</li>
                  <li>Transfer your information</li>
                  <li>Receive a copy of your data</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-[#3B82F6]">6. Cookies and Tracking</h2>
          <div className="space-y-4">
            <p className="text-[#111827]">We use cookies and similar tracking technologies to:</p>
            <ul className="list-disc list-inside text-[#111827] space-y-2">
              <li>Remember your preferences</li>
              <li>Analyze platform usage</li>
              <li>Personalize your experience</li>
              <li>Maintain security features</li>
            </ul>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-[#3B82F6]">7. Data Retention</h2>
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <p className="text-[#111827] mb-4">
              We retain your information for as long as necessary to:
            </p>
            <ul className="list-disc list-inside text-[#111827] space-y-2">
              <li>Provide our services</li>
              <li>Comply with legal obligations</li>
              <li>Resolve disputes</li>
              <li>Enforce our agreements</li>
            </ul>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-[#3B82F6]">8. Children's Privacy</h2>
          <p className="text-[#111827] mb-4">
            Our Service is not directed to children under 13. We do not knowingly collect personal information from children under 13. If you become aware that a child has provided us with personal information, please contact us.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-[#3B82F6]">9. Changes to Privacy Policy</h2>
          <p className="text-[#111827] mb-4">
            We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-[#3B82F6]">10. Contact Us</h2>
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <p className="text-[#111827] mb-4">
              If you have any questions about this Privacy Policy, please contact us at:
            </p>
            <div className="space-y-2">
              <p className="text-[#111827]">Email: ebaadraheem20@gmail.com</p>
              <p className="text-[#111827]">Phone No: +92 326 5545081</p>
            </div>
          </div>
        </section>
      </div>
    </motion.div>
  );
};

export default PrivacyPolicy;