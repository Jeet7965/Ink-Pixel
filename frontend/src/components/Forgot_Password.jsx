import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "../config/ApiUrl";
import { Oval } from "react-loader-spinner";
import { Link } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleForgot = async (e) => {
    e.preventDefault();
    if (!email) return toast.error("Enter your email!");

    setLoading(true);
    try {
      await api.post("/auth/forgot-password", { email });
      toast.success("Reset link sent to your email!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send link!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0A1128] px-4">
     <ToastContainer position="top-center" autoClose={3000} />
      <div className="max-w-md w-full bg-[#0F1736] p-8 rounded-xl shadow-xl">
        <h2 className="text-3xl font-bold text-white mb-6 text-center">Forgot Password</h2>
        <form onSubmit={handleForgot} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="p-3 rounded-lg border border-gray-600 bg-[#1A1F36] text-white placeholder-gray-400"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-yellow-600 hover:bg-yellow-700 text-white py-3 rounded-lg font-semibold transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? <Oval height={20} width={20} color="#fff" secondaryColor="#ccc" strokeWidth={2} /> : "Send Reset Link"}
          </button>
        </form>
        <p className="mt-4 text-gray-300 text-sm text-center">
          Remembered your password? <Link to="/login" className="hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
