import { motion } from 'framer-motion';

const TermsOfService = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }} 
      className="min-h-screen bg-[#F9FAFB] text-[#111827] p-4 md:p-8 lg:p-12"
    >
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-[#3B82F6]">Terms of Service</h1>
        <p className="text-[#111827] mb-4">Last Updated: February 2, 2025</p>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-[#3B82F6]">1. Introduction</h2>
          <p className="text-[#111827] mb-4">
            Welcome to SkillMorph ("we," "our," or "us"). These Terms of Service ("Terms") govern your access to and use of the SkillMorph platform, including our website, services, and applications (collectively, the "Service"). By accessing or using SkillMorph, you agree to be bound by these Terms.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-[#3B82F6]">2. Definitions</h2>
          <ul className="list-disc list-inside text-[#111827] space-y-2">
            <li>"Content" refers to all courses, lectures, materials, text, images, videos, and other content available through the Service</li>
            <li>"Creator" refers to users who have been approved to create and sell courses on the platform</li>
            <li>"User" refers to any individual who accesses or uses the Service</li>
            <li>"Platform" refers to the SkillMorph website and all related services</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-[#3B82F6]">3. Account Registration and Security</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-semibold mb-2">3.1. Account Creation</h3>
              <p className="text-[#111827]">
                To access certain features of the Service, you must create an account. You agree to provide accurate, current, and complete information during registration and to update such information to keep it accurate, current, and complete.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">3.2. Account Security</h3>
              <p className="text-[#111827]">
                You are responsible for safeguarding your account credentials and for any activities or actions under your account. You must immediately notify us of any unauthorized use of your account.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">3.3. Session Duration</h3>
              <p className="text-[#111827]">
                Accounts will remain logged in for up to one month in the same browser for user convenience, but you are responsible for maintaining the security of your browsing session.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-[#3B82F6]">4. Creator Terms</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-semibold mb-2">4.1. Creator Approval</h3>
              <ul className="list-disc list-inside text-[#111827] space-y-2">
                <li>All potential Creators must receive explicit approval from SkillMorph before creating courses</li>
                <li>We reserve the right to reject Creator applications or revoke Creator status at our discretion</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">4.2. Content Guidelines</h3>
              <ul className="list-disc list-inside text-[#111827] space-y-2">
                <li>Creators must ensure their content is original or they have the right to use it</li>
                <li>Content must not violate any laws or third-party rights</li>
                <li>Content must meet our quality standards and educational objectives</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">4.3. Revenue Share</h3>
              <ul className="list-disc list-inside text-[#111827] space-y-2">
                <li>Creators receive a portion of the course sales as specified in their Creator agreement</li>
                <li>Payments are processed through Stripe according to our payment schedule</li>
                <li>Creators are responsible for any applicable taxes on their earnings</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-[#3B82F6]">5. User Rights and Restrictions</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-semibold mb-2">5.1. Course Access</h3>
              <ul className="list-disc list-inside text-[#111827] space-y-2">
                <li>Users who purchase courses have lifetime access to the course content</li>
                <li>Access is for personal, non-commercial use only</li>
                <li>Course materials may not be shared, redistributed, or resold</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">5.2. Prohibited Activities</h3>
              <ul className="list-disc list-inside text-[#111827] space-y-2">
                <li>Attempting to bypass payment systems</li>
                <li>Sharing account credentials</li>
                <li>Downloading or copying course content except as specifically allowed</li>
                <li>Harassing Creators or other users</li>
                <li>Attempting to reverse engineer the platform</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-[#3B82F6]">6. Payment Terms</h2>
          <ul className="list-disc list-inside text-[#111827] space-y-2">
            <li>All payments are processed securely through Stripe</li>
            <li>Course fees are non-refundable unless otherwise specified</li>
            <li>We reserve the right to modify pricing at any time</li>
            <li>Users are responsible for all applicable taxes</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-[#3B82F6]">7. Termination</h2>
          <p className="text-[#111827] mb-4">
            We reserve the right to terminate or suspend access to our Service immediately, without prior notice, for any violation of these Terms or for any other reason we deem appropriate.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-[#3B82F6]">8. Changes to Terms</h2>
          <p className="text-[#111827] mb-4">
            We reserve the right to modify these Terms at any time. We will notify users of any material changes via email or through the platform.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-[#3B82F6]">9. Contact Us</h2>
          <p className="text-[#111827] mb-4">
            If you have any questions about these Terms, please contact us at:
          </p>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <p className="text-[#111827]">Email: ebaadraheem20@gmail.com</p>
            <p className="text-[#111827]">Phone No: +92 326 5545081</p>
          </div>
        </section>
      </div>
    </motion.div>
  );
};

export default TermsOfService;