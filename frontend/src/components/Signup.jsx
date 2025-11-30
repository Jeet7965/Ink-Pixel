import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate, Link } from "react-router-dom";
import api from "../config/ApiUrl";
import { Oval } from "react-loader-spinner";

const Signup = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Handle input changes
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) {
      return toast.error("Please fill all required fields!");
    }

    setLoading(true);
    try {
      await api.post("/users/register", form);

      toast.success("Account created successfully!");
      setForm({ name: "", email: "", password: "" });
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Signup failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0A1128] px-4">
      <ToastContainer />
      <div className="max-w-md w-full bg-[#0F1736] p-8 rounded-xl shadow-xl">
        <h2 className="text-3xl font-bold text-white mb-6 text-center">Sign Up</h2>
        <form onSubmit={handleSignup} className="flex flex-col gap-4">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            className="p-3 rounded-lg border border-gray-600 bg-[#1A1F36] text-white placeholder-gray-400"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="p-3 rounded-lg border border-gray-600 bg-[#1A1F36] text-white placeholder-gray-400"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="p-3 rounded-lg border border-gray-600 bg-[#1A1F36] text-white placeholder-gray-400"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <Oval height={20} width={20} color="#fff" secondaryColor="#ccc" strokeWidth={2} />
            ) : (
              "Sign Up"
            )}
          </button>
        </form>
        <p className="mt-4 text-gray-300 text-sm text-center">
          Already have an account? <Link to="/login" className="hover:underline text-blue-400">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
