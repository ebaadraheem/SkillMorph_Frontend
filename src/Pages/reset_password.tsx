import { useState, FormEvent } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function Reset_Password() {
  const [password, setPassword] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false); // ✅ loading state

  const { token } = useParams();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true); // ✅ start loading

    try {
      const res = await axios.post<{ msg: string }>(
        `${import.meta.env.VITE_SERVER_URL}/auth/reset-password`,
        { password, token }
      );
      setMessage(res.data.msg);
      toast.success("Password reset successfully!");
      setPassword(""); // Clear the password field after successful reset
      setTimeout(() => {
        navigate("/login"); 
      }, 1000);
    } catch (err: any) {
      setMessage(err.response?.data?.message || "Something went wrong");
    } finally {
      setIsLoading(false); // ✅ stop loading
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
      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-6 space-y-6">
        <h2 className="text-2xl font-bold text-center text-gray-800">
          Reset Password
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            placeholder="Enter your new password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3DA0A7]"
          />

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full bg-gradient-to-r flexer from-[#3B82F6] to-[#10B981] text-white py-2 rounded-lg hover:scale-105 transition-all  ${
              isLoading
                ? "bg-[#3DA0A7] cursor-not-allowed opacity-75"
                : "bg-[#3DA0A7] hover:bg-[#368d94]"
            } text-white`}
          >
            {isLoading ? (
              <img src="/loading.svg" alt="Loading" className="w-5 h-5 animate-spin" />
            ) : (
              "Reset Password"
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
