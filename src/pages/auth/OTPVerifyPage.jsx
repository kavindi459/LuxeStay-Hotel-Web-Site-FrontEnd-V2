import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../../config/api.js';
import { ShieldCheck, RefreshCw } from 'lucide-react';
import logo from '../../assets/Logo.png';
import Button from '../../components/ui/Button.jsx';

const OTPVerifyPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const emailFromState = location.state?.email || '';
  const [email, setEmail] = useState(emailFromState);
  const [digits, setDigits] = useState(['', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];

  // Countdown timer for resend
  useEffect(() => {
    if (countdown <= 0) {
      setCanResend(true);
      return;
    }
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleDigitChange = (index, value) => {
    const digit = value.replace(/\D/g, '').slice(-1);
    const next = [...digits];
    next[index] = digit;
    setDigits(next);
    if (digit && index < 3) {
      inputRefs[index + 1].current?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs[index - 1].current?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 4);
    const next = ['', '', '', ''];
    for (let i = 0; i < pasted.length; i++) next[i] = pasted[i];
    setDigits(next);
    const focusIndex = Math.min(pasted.length, 3);
    inputRefs[focusIndex].current?.focus();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otp = digits.join('');
    if (otp.length !== 4) {
      toast.error('Please enter all 4 digits');
      return;
    }
    setLoading(true);
    try {
      await api.post('/api/users/verifyemail', { email, otp: Number(otp) });
      toast.success('Email verified! You can now log in.');
      navigate('/auth/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!canResend) return;
    setResending(true);
    try {
      await api.post('/api/users/resend-otp', { email });
      toast.success('A new OTP has been sent to your email.');
      setDigits(['', '', '', '']);
      setCountdown(60);
      setCanResend(false);
      inputRefs[0].current?.focus();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to resend OTP.');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <img src={logo} alt="CINNAMON LAKE Hotel" className="h-14 w-auto object-contain" />
          </div>
          <div className="flex items-center justify-center w-16 h-16 bg-blue-50 rounded-full mx-auto mb-4">
            <ShieldCheck size={32} className="text-blue-800" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Verify Your Email</h2>
          <p className="text-gray-500 text-sm mt-2">
            We sent a 4-digit code to{' '}
            <span className="font-semibold text-blue-800">{email}</span>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {!emailFromState && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="your@email.com"
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-800"
              />
            </div>
          )}

          {/* 4 OTP boxes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3 text-center">Enter OTP Code</label>
            <div className="flex justify-center gap-3">
              {digits.map((digit, i) => (
                <input
                  key={i}
                  ref={inputRefs[i]}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleDigitChange(i, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(i, e)}
                  onPaste={i === 0 ? handlePaste : undefined}
                  className="w-14 h-14 text-center text-2xl font-bold border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-800 focus:ring-2 focus:ring-blue-200 transition-colors"
                />
              ))}
            </div>
          </div>

          <Button type="submit" loading={loading} className="w-full py-2.5">
            Verify Email
          </Button>
        </form>

        {/* Resend OTP */}
        <div className="text-center mt-5">
          {canResend ? (
            <button
              onClick={handleResend}
              disabled={resending}
              className="flex items-center gap-1.5 text-sm text-blue-800 font-semibold hover:underline mx-auto disabled:opacity-60"
            >
              {resending ? <RefreshCw size={14} className="animate-spin" /> : <RefreshCw size={14} />}
              Resend OTP
            </button>
          ) : (
            <p className="text-sm text-gray-400">
              Resend OTP in <span className="font-semibold text-gray-600">{countdown}s</span>
            </p>
          )}
        </div>

        <p className="text-center text-sm text-gray-500 mt-4">
          Already verified?{' '}
          <Link to="/auth/login" className="text-blue-800 font-semibold hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default OTPVerifyPage;
