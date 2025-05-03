import React, { useState, useEffect } from "react";
import { useAuthenticationStore } from "../store/AuthStore";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ScrollTop } from "../Custom/Components";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
const LogIn = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const { authenticateUser } = useAuthenticationStore();
  const navigate = useNavigate();

  const LoginUser = async () => {
    const UserData = {
      email: email,
      password: password,
    };

    try {
      setLoading(true);
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/auth/login`,
        {
          method: "POST",
          headers: {
            "ngrok-skip-browser-warning": "skip-browser-warning",
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(UserData),
        }
      );

      // Check if response is OK before parsing JSON
      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.error || "Login failed. Please try again.");
        return;
      }

      const data = await response.json();

      localStorage.setItem("token", data.accessToken);
      toast.success("Logged in successfully");
      authenticateUser(data.accessToken);
      navigate("/home");

      // Reset form fields
      setEmail("");
      setPassword("");
    } catch (error) {
      console.error("Login error:", error);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setError(null);
  }, [email, password]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await LoginUser();
  };

  return (
    <motion.div
      className="min-h-screen flex items-center justify-center bg-[#F9FAFB]"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
    >
      <div className="w-full max-w-md rounded-lg shadow-md bg-white p-6">
        <div>
          <img
            src={"account.svg"}
            alt="Account"
            className="w-28 h-28 mx-auto"
          />
        </div>
        <h1 className="text-2xl font-bold text-[#3B82F6] mb-4 text-center">
          Welcome Back
        </h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-[#111827] font-semibold mb-2"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-[#111827] font-semibold mb-2"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
              placeholder="Enter your password"
              required
            />
          </div>
          {error && <p className="text-red-500 flexer text-sm mb-4">{error}</p>}
          <button
            type="submit"
            className="w-full bg-gradient-to-r flexer from-[#3B82F6] to-[#10B981] text-white py-2 rounded-lg hover:scale-105 transition-all"
          >
            {loading ? (
               <img className="w-6 h-6 animate-spin" src="loading.svg" alt="" />
            ) : (
              "Log In"
            )}
          </button>
        </form>
        <div className="flex justify-between  mt-4 text-sm text-[#111827]">
          <Link
            to="/forgot-password"
            className="text-[#3B82F6] hover:underline"
          >
            Forgot Password?
          </Link>
          <span onClick={()=>{
            ScrollTop()
            navigate("/register");
          }} className="text-[#3B82F6] cursor-pointer hover:underline">
            Sign Up
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default LogIn;
