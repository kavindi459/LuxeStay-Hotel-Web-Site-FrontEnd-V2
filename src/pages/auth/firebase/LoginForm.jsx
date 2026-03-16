import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ React Router
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../../../config/Firebase"; // ✅ Adjust this path if needed
import axios from "axios";
import GoogleIcon from "./GoogleIcon"; // ✅ Google icon component
import { Loader2 } from "lucide-react";
import Login from "../../../assets/Login.jpg"; // ✅ Background image
import toast from "react-hot-toast";
const LoginPages = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setInitialLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleEmailLogin = async (e) => {
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
      const role = response.data.data.role;

      localStorage.setItem("token", token);

      toast.success('Login successful!');

      console.log("Token:", token);
      console.log("Role:", role);

      // Redirect based on role
      if (role === 'Admin') {
        navigate('/admin/dashboard');
      } else if (role === 'User') {
        navigate('/');
      } else {
        toast.warn('Unknown role detected');
      }

      setTimeout(() => setLoading(false), 300);
    })
    .catch((error) => {
      console.error('Login error:', error);
      toast.error('Login failed: ' + (error.response?.data?.message || error.message));
      setLoading(false);
    });
};

  const handleGoogleSignIn = async () => {
    setLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);

       toast.success("Login Successful. Redirecting to Home...");

      navigate("/");
    } catch (error) {
      toast.error(`Google Login Failed: ${error.message}`);
    } finally {
      setTimeout(() => setLoading(false), 300);
    }
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
    <div className="w-full h-screen relative flex items-center justify-center">
      <img src={Login} alt="Login Background" className="w-full h-full object-cover absolute inset-0 z-0" />
      <div className="absolute inset-0 bg-black/50 z-10" />
      <div className="absolute z-20 flex justify-center items-center w-full px-4">
        <div className="bg-white/15 backdrop-blur-md p-8 rounded-2xl shadow-xl w-full max-w-md">
          <h1 className="text-3xl font-bold text-center text-white mb-6">Login</h1>

          <form className="space-y-4" onSubmit={handleEmailLogin}>
            <div>
              <label className="block text-sm font-medium text-white mb-1">Email</label>
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
              <label className="block text-sm font-medium text-white mb-1">Password</label>
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
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md font-semibold transition duration-300"
            >
              Login
            </button>
          </form>

          <div className="my-4 text-center text-white">or</div>

          <button
            onClick={handleGoogleSignIn}
            className="w-full flex items-center justify-center gap-3 bg-white text-black border hover:bg-gray-200 py-2 rounded-md font-semibold transition duration-300"
            aria-label="Sign in with Google"
          >
            <GoogleIcon className="h-5 w-5" />
            Sign in with Google
          </button>

          <p className="text-xs text-center text-white mt-4">
            By signing in, you agree to our Terms of Service.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPages;
