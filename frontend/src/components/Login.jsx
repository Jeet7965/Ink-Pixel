import React, { useState,useContext } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link, useNavigate } from "react-router-dom";
import api from "../config/ApiUrl";
import { Oval } from "react-loader-spinner";
import { AuthContext } from "../context/authContext";
const Login = () => {
    const [form, setForm] = useState({
        email: "",
        password: "",
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useContext(AuthContext)
    const handleLogin = async (e) => {
        e.preventDefault();
        const { email, password } = form;
        if (!email || !password) return toast.error("Fill all fields!");

        setLoading(true);
        try {
            const res = await api.post("/auth/login",form);
            if (res.status === 200 && res.data.accessToken) {
                const token = res.data.accessToken;
                const userId = res.data.user.id;
                login(token, userId);
                toast.success("Login successful!");
                navigate("/");
            } else {
                toast.error("Login failed:", res.data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Login failed!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0A1128] px-4">
             <ToastContainer position="top-center" autoClose={3000} />
            <div className="max-w-md w-full bg-[#0F1736] p-8 rounded-xl shadow-xl">
                <h2 className="text-3xl font-bold text-white mb-6 text-center">Login</h2>
                <form onSubmit={handleLogin} className="flex flex-col gap-4">
                    <input
                        type="email"
                        placeholder="Email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className="p-3 rounded-lg border border-gray-600 bg-[#1A1F36] text-white placeholder-gray-400"
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={form.password}
                        onChange={(e) => setForm({ ...form, password: e.target.value })}
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
                            "Login"
                        )}
                    </button>
                </form>
                <div className="flex justify-between mt-4 text-gray-300 text-sm">
                    <Link to="/forgot-password" className="hover:underline">Forgot Password?</Link>
                    <Link to="/signup" className="hover:underline">Sign Up</Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
