import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuthStore } from "../../store/authStore.jsx";
import api from "../../config/api.js";
import toast from "react-hot-toast";
import { Eye, EyeOff, AlertCircle, Mail, Lock } from "lucide-react";
import logo from "../../assets/Logo.png";
import loginBg from "../../assets/Login.jpg";
import Button from "../../components/ui/Button.jsx";

const validate = (email, password) => {
  const errors = {};
  if (!email.trim()) {
    errors.email = "Email is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = "Enter a valid email address";
  }
  if (!password) {
    errors.password = "Password is required";
  } else if (password.length < 6) {
    errors.password = "Password must be at least 6 characters";
  }
  return errors;
};

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [authError, setAuthError] = useState("");
  const navigate = useNavigate();
  const { dispatch } = useAuthStore();

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    setErrors(validate(email, password));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const allTouched = { email: true, password: true };
    setTouched(allTouched);
    const errs = validate(email, password);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setAuthError("");
    setLoading(true);
    try {
      const response = await api.post("/api/users/login", { email, password });
      const { token, data: user } = response.data;

      dispatch({ type: "LOGIN", payload: { token, user } });
      toast.success(`Welcome back, ${user.firstName}!`);

      if (user.role === "Admin" || user.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/");
      }
    } catch (error) {
      setAuthError(error.response?.data?.message || "Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = (field) =>
    `w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:border-transparent transition-all bg-gray-50 ${
      touched[field] && errors[field]
        ? "border-red-400 focus:ring-red-400 bg-red-50"
        : "border-gray-200 focus:ring-blue-800 focus:bg-white"
    }`;

  return (
    <div className="min-h-screen flex">
      {/* Left — Background Image Panel */}
      <div
        className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-12 overflow-hidden"
        style={{
          backgroundImage: `url(${loginBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />

        {/* Logo top-left */}
        <div className="relative z-10">
          <img src={logo} alt="CINNAMON LAKE Hotel" className="h-12 w-auto object-contain brightness-0 invert" />
        </div>

        {/* Bottom quote */}
        <div className="relative z-10">
          <blockquote className="text-white">
            <p className="text-2xl font-light leading-relaxed italic mb-4">
              "Where every stay becomes an unforgettable memory."
            </p>
            <footer className="text-white/70 text-sm font-medium tracking-widest uppercase">
              CINNAMON LAKE Hotel
            </footer>
          </blockquote>
          {/* Decorative dots */}
          <div className="flex gap-2 mt-6">
            <div className="w-8 h-1 bg-white rounded-full" />
            <div className="w-2 h-1 bg-white/40 rounded-full" />
            <div className="w-2 h-1 bg-white/40 rounded-full" />
          </div>
        </div>
      </div>

      {/* Right — Form Panel */}
      <div className="flex-1 flex flex-col justify-center items-center px-6 py-12 bg-white lg:px-16 xl:px-24">
        {/* Mobile logo */}
        <div className="lg:hidden mb-8">
          <img src={logo} alt="CINNAMON LAKE Hotel" className="h-12 w-auto object-contain mx-auto" />
        </div>

        <div className="w-full max-w-md">
          {/* Heading */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back</h1>
            <p className="text-gray-500 text-sm">Sign in to continue your luxury experience</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5" noValidate>
            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (authError) setAuthError("");
                    if (touched.email) setErrors(validate(e.target.value, password));
                  }}
                  onBlur={() => handleBlur("email")}
                  placeholder="john@example.com"
                  className={`${inputClass("email")} pl-10`}
                />
              </div>
              {touched.email && errors.email && (
                <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                  <AlertCircle size={11} /> {errors.email}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (authError) setAuthError("");
                    if (touched.password) setErrors(validate(email, e.target.value));
                  }}
                  onBlur={() => handleBlur("password")}
                  placeholder="Enter your password"
                  className={`${inputClass("password")} pl-10 pr-11`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {touched.password && errors.password && (
                <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                  <AlertCircle size={11} /> {errors.password}
                </p>
              )}
            </div>

            {/* Forgot password */}
            <div className="flex justify-end">
              <Link
                to="/auth/forgot-password"
                className="text-sm text-blue-800 hover:text-blue-900 font-medium hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            {/* Auth error */}
            {authError && (
              <div className="flex items-start gap-2.5 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
                <AlertCircle size={16} className="mt-0.5 shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            <Button type="submit" loading={loading} className="w-full py-3 text-base rounded-xl">
              Sign In
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Don't have an account?{" "}
              <Link
                to="/auth/register"
                className="text-blue-800 font-semibold hover:underline"
              >
                Create account
              </Link>
            </p>
          </div>

          {/* Divider */}
          <div className="mt-8 pt-6 border-t border-gray-100 text-center">
            <p className="text-xs text-gray-400">
              © {new Date().getFullYear()} CINNAMON LAKE Hotel. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
