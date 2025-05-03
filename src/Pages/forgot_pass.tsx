import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react'; // Optional: use any icon or SVG
import toast from 'react-hot-toast';

export default function ForgotPassword() {
  const [email, setEmail] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await axios.post<{ msg: string }>(
        `${import.meta.env.VITE_SERVER_URL}/auth/forgot-password`,
        { email }
      );
      setMessage(res.data.msg);
      toast.success("Reset link sent successfully!");
      setEmail('');
    } catch (err: any) {
      setMessage(err.response?.data?.message || 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      className="min-h-[80vh] flex items-center justify-center bg-[#F9FAFB] p-4"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
    >
      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-6 space-y-6 relative">
        {/* Back Arrow */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 text-[#3B82F6]  rounded-full hover:opacity-65  transition"
          aria-label="Go back"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <h2 className="text-2xl font-bold text-center text-gray-800">
          Forgot Password
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Enter your registered email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3DA0A7]"
          />

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full bg-gradient-to-r flexer from-[#3B82F6] to-[#10B981] text-white py-2 rounded-lg hover:scale-105 transition-all ${
              isLoading
                ? 'bg-[#3DA0A7] cursor-not-allowed opacity-75'
                : 'bg-[#3DA0A7] hover:bg-[#368d94]'
            } text-white`}
          >
            {isLoading ? (
              <img
                src="/loading.svg"
                alt="Loading"
                className="w-5 h-5 animate-spin"
              />
            ) : (
              'Send Reset Link'
            )}
          </button>
        </form>

        {message && (
          <p className="text-center text-sm text-gray-600">{message}</p>
        )}
      </div>
    </motion.div>
  );
}
