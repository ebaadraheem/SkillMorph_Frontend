import React, { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ScrollTop } from "../Custom/Components";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
const SignUp: React.FC = () => {
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setUser((prevUser) => ({ ...prevUser, [id]: value }));
  };

  const RegisterUser = async () => {
    const UserData = {
      username: user.name,
      email: user.email,
      password: user.password,
    };

    const response = await fetch(
      `${import.meta.env.VITE_SERVER_URL}/auth/register`,
      {
        method: "POST",
        headers: {
          "ngrok-skip-browser-warning": "skip-browser-warning", // Skip the ngrok browser warning
          "Content-Type": "application/json", // Add other headers if necessary
        },
        body: JSON.stringify(UserData),
      }
    );
    const data = await response.json();
    if (data.error) {
      setError(data.error);
      return;
    }
    toast.success("User created successfully");
    navigate("/login");

    // Reset form
    setUser({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
  };

  useEffect(() => {
    setError(null);
  }, [user.name, user.email, user.password, user.confirmPassword]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const { name, email, password, confirmPassword } = user;

    if (!name || !email || !password || !confirmPassword) {
      setError("All fields are required.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setError(null);
    try {
      setLoading(true);
      await RegisterUser();
    } catch (error) {
      console.error("Register error:", error);
      setError("Something went wrong. Please try");
    } finally {
      setLoading(false);
    }
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
        <h1 className="text-2xl font-bold text-[#3B82F6] mb-6 text-center">
          Create Your Account
        </h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="name"
              className="block text-[#111827] font-semibold mb-2"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
              placeholder="Enter your name"
              value={user.name}
              onChange={handleChange}
            />
          </div>
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
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
              placeholder="Enter your email"
              value={user.email}
              onChange={handleChange}
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
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
              placeholder="Enter your password"
              value={user.password}
              onChange={handleChange}
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="confirmPassword"
              className="block text-[#111827] font-semibold mb-2"
            >
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
              placeholder="Confirm your password"
              value={user.confirmPassword}
              onChange={handleChange}
            />
          </div>
          {error && <p className="text-red-500 flexer text-sm mb-4">{error}</p>}
          <button
            type="submit"
            className="w-full bg-gradient-to-r flexer from-[#3B82F6] to-[#10B981] text-white py-2 rounded-lg hover:scale-105 transition-transform"
          >
            {loading ? (
              <img className="w-6 h-6 animate-spin" src="loading.svg" alt="" />
            ) : (
              "Sign Up"
            )}
          </button>
        </form>
        <p className="text-sm text-[#111827] mt-4 text-center">
          Already have an account?{" "}
          <span
            onClick={() => {
              ScrollTop()
              navigate("/login");
            }}
            className="text-[#3B82F6] cursor-pointer hover:underline"
          >
            Log In
          </span>
        </p>
      </div>
    </motion.div>
  );
};

export default SignUp;
