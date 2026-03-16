import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../../config/api.js';
import { Eye, EyeOff, AlertCircle, User, Mail, Phone, Lock } from 'lucide-react';
import logo from '../../assets/Logo.png';
import loginBg from '../../assets/Login.jpg';
import Button from '../../components/ui/Button.jsx';

const validate = (form) => {
  const errors = {};

  if (!form.firstName.trim()) {
    errors.firstName = 'First name is required';
  } else if (!/^[A-Za-z\s]+$/.test(form.firstName)) {
    errors.firstName = 'First name can only contain letters';
  } else if (form.firstName.trim().length < 2) {
    errors.firstName = 'First name must be at least 2 characters';
  }

  if (!form.lastName.trim()) {
    errors.lastName = 'Last name is required';
  } else if (!/^[A-Za-z\s]+$/.test(form.lastName)) {
    errors.lastName = 'Last name can only contain letters';
  } else if (form.lastName.trim().length < 2) {
    errors.lastName = 'Last name must be at least 2 characters';
  }

  if (!form.email.trim()) {
    errors.email = 'Email is required';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = 'Enter a valid email address';
  }

  if (!form.phone.trim()) {
    errors.phone = 'Phone number is required';
  } else if (!/^\d{10}$/.test(form.phone.replace(/\s/g, ''))) {
    errors.phone = 'Phone number must be 10 digits';
  }

  if (!form.password) {
    errors.password = 'Password is required';
  } else if (form.password.length < 8) {
    errors.password = 'Password must be at least 8 characters';
  } else if (!/[A-Z]/.test(form.password)) {
    errors.password = 'Password must contain at least one uppercase letter';
  } else if (!/[a-z]/.test(form.password)) {
    errors.password = 'Password must contain at least one lowercase letter';
  } else if (!/[0-9]/.test(form.password)) {
    errors.password = 'Password must contain at least one number';
  }

  if (!form.confirmPassword) {
    errors.confirmPassword = 'Please confirm your password';
  } else if (form.password !== form.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match';
  }

  return errors;
};

const RegisterPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const handleChange = (e) => {
    const updated = { ...form, [e.target.name]: e.target.value };
    setForm(updated);
    if (touched[e.target.name]) {
      setErrors(validate(updated));
    }
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    setErrors(validate(form));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const allTouched = Object.keys(form).reduce((acc, k) => ({ ...acc, [k]: true }), {});
    setTouched(allTouched);
    const errs = validate(form);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setLoading(true);
    try {
      await api.post('/api/users/createuser', {
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        phone: form.phone,
        password: form.password,
      });
      toast.success('Registration successful! Please verify your email.');
      navigate('/auth/verify-otp', { state: { email: form.email } });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = (field) =>
    `w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:border-transparent transition-all bg-gray-50 ${
      touched[field] && errors[field]
        ? 'border-red-400 focus:ring-red-400 bg-red-50'
        : 'border-gray-200 focus:ring-blue-800 focus:bg-white'
    }`;

  return (
    <div className="min-h-screen flex">
      {/* Left — Background Image Panel */}
      <div
        className="hidden lg:flex lg:w-5/12 relative flex-col justify-between p-12 overflow-hidden"
        style={{
          backgroundImage: `url(${loginBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />

        {/* Logo top-left */}
        <div className="relative z-10">
          <img src={logo} alt="CINNAMON LAKE Hotel" className="h-12 w-auto object-contain brightness-0 invert" />
        </div>

        {/* Bottom content */}
        <div className="relative z-10">
          <div className="mb-6">
            <h2 className="text-white text-3xl font-bold leading-tight mb-3">
              Begin Your<br />Luxury Journey
            </h2>
            <p className="text-white/70 text-sm leading-relaxed">
              Create your account and unlock exclusive access to our world-class accommodations and personalized services.
            </p>
          </div>
          {/* Feature dots */}
          <div className="space-y-2.5">
            {['Premium room selection', 'Exclusive member rates', 'Easy booking management'].map((item) => (
              <div key={item} className="flex items-center gap-2.5">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                <span className="text-white/80 text-sm">{item}</span>
              </div>
            ))}
          </div>
          <div className="flex gap-2 mt-6">
            <div className="w-8 h-1 bg-white rounded-full" />
            <div className="w-2 h-1 bg-white/40 rounded-full" />
            <div className="w-2 h-1 bg-white/40 rounded-full" />
          </div>
        </div>
      </div>

      {/* Right — Form Panel */}
      <div className="flex-1 flex flex-col justify-center items-center px-6 py-10 bg-white lg:px-12 xl:px-16 overflow-y-auto">
        {/* Mobile logo */}
        <div className="lg:hidden mb-6">
          <img src={logo} alt="CINNAMON LAKE Hotel" className="h-12 w-auto object-contain mx-auto" />
        </div>

        <div className="w-full max-w-md">
          {/* Heading */}
          <div className="mb-7">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h1>
            <p className="text-gray-500 text-sm">Join us for an unforgettable luxury experience</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {/* Name row */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">First Name</label>
                <div className="relative">
                  <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    name="firstName"
                    value={form.firstName}
                    onChange={handleChange}
                    onBlur={() => handleBlur('firstName')}
                    placeholder="John"
                    className={`${inputClass('firstName')} pl-9`}
                  />
                </div>
                {touched.firstName && errors.firstName && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <AlertCircle size={10} /> {errors.firstName}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Last Name</label>
                <div className="relative">
                  <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    name="lastName"
                    value={form.lastName}
                    onChange={handleChange}
                    onBlur={() => handleBlur('lastName')}
                    placeholder="Doe"
                    className={`${inputClass('lastName')} pl-9`}
                  />
                </div>
                {touched.lastName && errors.lastName && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <AlertCircle size={10} /> {errors.lastName}
                  </p>
                )}
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email Address</label>
              <div className="relative">
                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  onBlur={() => handleBlur('email')}
                  placeholder="john@example.com"
                  className={`${inputClass('email')} pl-9`}
                />
              </div>
              {touched.email && errors.email && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <AlertCircle size={10} /> {errors.email}
                </p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Phone Number</label>
              <div className="relative">
                <Phone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  onBlur={() => handleBlur('phone')}
                  placeholder="0123456789"
                  className={`${inputClass('phone')} pl-9`}
                />
              </div>
              {touched.phone && errors.phone && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <AlertCircle size={10} /> {errors.phone}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  onBlur={() => handleBlur('password')}
                  placeholder="Min. 8 characters"
                  className={`${inputClass('password')} pl-9 pr-11`}
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
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <AlertCircle size={10} /> {errors.password}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Confirm Password</label>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  onBlur={() => handleBlur('confirmPassword')}
                  placeholder="Repeat your password"
                  className={`${inputClass('confirmPassword')} pl-9 pr-11`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {touched.confirmPassword && errors.confirmPassword && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <AlertCircle size={10} /> {errors.confirmPassword}
                </p>
              )}
            </div>

            <Button type="submit" loading={loading} className="w-full py-3 text-base rounded-xl mt-2">
              Create Account
            </Button>
          </form>

          <div className="mt-5 text-center">
            <p className="text-sm text-gray-500">
              Already have an account?{' '}
              <Link to="/auth/login" className="text-blue-800 font-semibold hover:underline">
                Sign in
              </Link>
            </p>
          </div>

          {/* Footer */}
          <div className="mt-6 pt-5 border-t border-gray-100 text-center">
            <p className="text-xs text-gray-400">
              © {new Date().getFullYear()} CINNAMON LAKE Hotel. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
