import React, { useEffect, useState } from "react";
import Login from "../../assets/Login.jpg";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
import { Loader2 } from "lucide-react";
const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setInitialLoading(false), 1500); // 1.5s splash
    return () => clearTimeout(timer);
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);
    axios
      .post(`${BACKEND_URL}/api/users/login`, {
        email: email,
        password: password,
      })
      .then((response) => {
        console.log(response.data);
        const token = response.data.token;
        const role = response.data.data.role; // 👈 Extract role

        localStorage.setItem("token", token);

        console.log("Token:", token);
        console.log("Role:", role);

        // Redirect based on role
        if (role === 'Admin') {
  navigate('/admin/dashboard');
  setTimeout(() => setLoading(false), 300);
} else if (role === 'User') {
  navigate('/');
  setTimeout(() => setLoading(false), 300);
} else {
  console.warn('Unknown role:', role);
  setLoading(false);
}

      })

      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  };

  if (initialLoading || loading) {
    return (
      <div className="w-full h-screen relative overflow-hidden flex items-center justify-center">
        {/* Background image */}
        <img
          src={Login}
          alt="Login Background"
          className="w-full h-full object-cover absolute inset-0 z-0"
        />
        <div className="flex justify-center items-center min-h-screen bg-background">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-screen relative overflow-hidden flex items-center justify-center">
      {/* Background image */}
      <img
        src={Login}
        alt="Login Background"
        className="w-full h-full object-cover absolute inset-0 z-0"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50 z-10" />

      {/* Login Form */}
      <div className="absolute flex   z-20">
        <div className="bg-white/15 backdrop-blur-md p-8 rounded-2xl shadow-xl w-80 sm:w-96">
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
            Login
          </h1>

          <form className="space-y-4" onSubmit={handleLogin}>
            <div>
              <label className="block text-sm font-medium text-gray-950 mb-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your email"
                autoComplete="email"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-950 mb-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your email"
                autoComplete="email"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md font-semibold transition duration-300"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
