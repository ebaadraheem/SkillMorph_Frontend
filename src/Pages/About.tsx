import { motion } from "framer-motion";
import {  Award, Target, Clock, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ScrollTop } from "../Custom/Components";
import toast from "react-hot-toast";

const About = () => {
  const navigate = useNavigate();

  const values = [
    {
      title: "Quality First",
      description:
        "We maintain high standards for our course content and creator selection process.",
      icon: Award,
    },
    {
      title: "Accessibility",
      description:
        "Making education accessible to everyone, anywhere in the world.",
      icon: Target,
    },
    {
      title: "Flexibility",
      description: "Learn at your own pace with lifetime access to courses.",
      icon: Clock,
    },
    {
      title: "Security",
      description:
        "Your data and payments are protected with industry-leading security.",
      icon: Shield,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-[#F9FAFB] text-[#111827] p-4 md:p-8 lg:p-12"
    >
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-[#3B82F6]">
          About Us
        </h1>

        {/* Main Introduction */}
        <section className="mb-12">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <p className="text-[#111827] mb-6 text-lg">
              SkillMorph is a dynamic online learning platform that connects
              passionate creators with eager learners. Our mission is to
              democratize education by providing a space where experts can share
              their knowledge and learners can acquire new skills at their own
              pace.
            </p>
          </div>
        </section>


        {/* Vision Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-[#3B82F6]">
            Our Vision
          </h2>
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <p className="text-[#111827] mb-6 text-lg">
              We believe that education should be accessible, flexible, and
              engaging. SkillMorph empowers creators to build and share their
              expertise while enabling learners to transform their lives through
              quality education.
            </p>
          </div>
        </section>

        {/* Values Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-[#3B82F6]">
            Our Values
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-6 rounded-lg shadow-sm"
              >
                <value.icon className="w-8 h-8 text-[#3B82F6] mb-4" />
                <h3 className="text-xl font-semibold mb-2 text-[#3B82F6]">
                  {value.title}
                </h3>
                <p className="text-[#111827]">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Features Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-[#3B82F6]">
            What Makes Us Different
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-3 text-[#3B82F6]">
                Creator-Centric Approach
              </h3>
              <ul className="list-disc list-inside text-white space-y-2">
                <li>Carefully vetted creators ensure high-quality content</li>
                <li>Flexible course management tools</li>
                <li>Fair revenue sharing model</li>
                <li>Real-time analytics and payment tracking</li>
                <li>Comprehensive creator support system</li>
                <li>Advanced content management tools</li>
              </ul>
            </div>

            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-3 text-[#3B82F6]">
                Learner-Focused Experience
              </h3>
              <ul className="list-disc list-inside text-white space-y-2">
                <li>Lifetime access to purchased courses</li>
                <li>Learn anywhere, anytime</li>
                <li>Secure payment processing</li>
                <li>Intuitive user interface</li>
                <li>Progress tracking and certificates</li>
                <li>Interactive learning experience</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-[#3B82F6]">
            Join Our Community
          </h2>
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <p className="text-[#111827] mb-6">
              Whether you're an expert looking to share your knowledge or a
              learner eager to acquire new skills, SkillMorph provides the
              platform you need to succeed. Join our growing community of
              creators and learners today.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() =>
                  toast(
                    "Currently, anyone can create courses after signing up!"
                  )
                }
                className="bg-[#3B82F6] text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
              >
                Become a Creator
              </button>
              <button
                onClick={() => {
                  ScrollTop();
                  navigate("/skillsdashboard?view=allcourses");
                }}
                className="border border-[#3B82F6] text-[#3B82F6] px-6 py-2 rounded-lg hover:bg-blue-50 transition-colors"
              >
                Start Learning
              </button>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-6 text-[#3B82F6]">
            Get in Touch
          </h2>
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <p className="text-[#111827] mb-6">
              Have questions or feedback? We'd love to hear from you. Contact
              our support team or connect with us on social media.
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

export default About;
