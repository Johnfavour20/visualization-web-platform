import React, { useState, useEffect } from 'react';
import { NavigationTab } from '../types';
import {
  ShieldCheck,
  Zap,
  Network,
  KeyRound,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Info,
  CheckCircle2,
  Loader2,
  User,
  RotateCcw,
  Shield,
  Check,
  Circle,
  AlertCircle,
  Clock,
  AtSign,
  Send,
  HelpCircle
} from 'lucide-react';

interface LoginPageProps {
  setActiveTab: (tab: NavigationTab) => void;
  initialMode?: 'login' | 'register' | 'verify' | 'forgot' | 'reset';
}

export const LoginPage: React.FC<LoginPageProps> = ({ setActiveTab, initialMode = 'register' }) => {
  const [mode, setMode] = useState<'login' | 'register' | 'verify' | 'forgot' | 'reset'>(initialMode);

  // Common Form States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');

  // Register Specific States
  const [fullName, setFullName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);

  // Verification Mode States
  const [timeLeft, setTimeLeft] = useState(60);
  const [timerActive, setTimerActive] = useState(true);
  const [verificationStatus, setVerificationStatus] = useState<'none' | 'success' | 'resent'>('none');

  // Forgot Password States
  const [forgotSubmitted, setForgotSubmitted] = useState(false);
  const [forgotLoading, setForgotLoading] = useState(false);

  // Reset Password States
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
  const [resetSubmitted, setResetSubmitted] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);

  // Countdown timer effect for verification
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (mode === 'verify' && timerActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setTimerActive(false);
    }
    return () => clearInterval(interval);
  }, [mode, timerActive, timeLeft]);

  const handleResendEmail = () => {
    setTimeLeft(60);
    setTimerActive(true);
    setVerificationStatus('resent');
    setTimeout(() => {
      setVerificationStatus('none');
    }, 4000);
  };

  const handleVerifySuccess = () => {
    setVerificationStatus('success');
    setTimeout(() => {
      setActiveTab('dashboard');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 2000);
  };

  // Reset Password requirements calculation
  const resetReqs = {
    length: newPassword.length >= 8,
    upper: /[A-Z]/.test(newPassword),
    lower: /[a-z]/.test(newPassword),
    number: /[0-9]/.test(newPassword),
    special: /[^A-Za-z0-9]/.test(newPassword),
  };
  const resetScore = Object.values(resetReqs).filter(Boolean).length;
  const reqs = {
    length: password.length >= 8,
    upper: /[A-Z]/.test(password),
    lower: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
  };

  const strengthCount = Object.values(reqs).filter(Boolean).length;
  const strengthPercentage = (strengthCount / 4) * 100;

  let strengthColor = 'bg-red-500';
  if (strengthPercentage > 25 && strengthPercentage <= 50) strengthColor = 'bg-amber-500';
  else if (strengthPercentage > 50 && strengthPercentage <= 75) strengthColor = 'bg-[#2f3c97]';
  else if (strengthPercentage > 75) strengthColor = 'bg-[#005221]';

  // Matrix cell values matching screenshot
  const matrixCells = [
    'AE', 'S1', '34', 'B9',
    '2F', 'C6', '88', '4A',
    'E8', '88', '4A', 'D2',
    '1B', '9F', '7C', '0D',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'register' && !termsAccepted) {
      alert('Please agree to the Terms of Service and Privacy Policy.');
      return;
    }
    if (mode === 'register' && password !== confirmPassword) {
      alert('Passwords do not match.');
      return;
    }

    setStatus('loading');
    setTimeout(() => {
      setStatus('success');
      setTimeout(() => {
        if (mode === 'register') {
          setMode('verify');
          setStatus('idle');
          setTimeLeft(60);
          setTimerActive(true);
        } else {
          setActiveTab('dashboard');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }, 1000);
    }, 1200);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#F7F8FC]">
      {/* Left Panel: Branding & AES Illustration */}
      <section className="w-full md:w-[45%] lg:w-[45%] bg-[#142380] p-8 md:p-12 lg:p-16 flex flex-col justify-center relative overflow-hidden text-white">
        {/* Background Decorative Accents */}
        <div className="absolute -top-24 -left-24 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-48 -right-24 w-96 h-96 bg-[#2f3c97]/40 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-xl mx-auto md:mx-0 space-y-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <button
                type="button"
                onClick={() => setActiveTab('home')}
                className="flex items-center gap-2 text-left hover:opacity-90 transition-opacity cursor-pointer group"
              >
                <div className="w-10 h-10 bg-white text-[#142380] rounded-xl flex items-center justify-center font-bold shadow-sm group-hover:scale-105 transition-transform">
                  <Shield className="w-6 h-6 fill-[#142380]" />
                </div>
                <span className="text-white text-xl font-bold tracking-tight">AES Explorer</span>
              </button>
            </div>

            {/* Security Protocol Badge for Forgot Mode */}
            {mode === 'forgot' && (
              <div className="inline-flex items-center gap-2 px-3.5 py-2 bg-white/10 rounded-xl border border-white/20 backdrop-blur-md mb-4">
                <div className="w-6 h-6 rounded-lg bg-white/10 flex items-center justify-center">
                  <RotateCcw className="w-4 h-4 text-white" />
                </div>
                <span className="text-white text-xs font-bold uppercase tracking-widest opacity-90">Security Protocol</span>
              </div>
            )}

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight mb-4 text-white">
              {mode === 'login'
                ? 'Welcome Back'
                : mode === 'verify'
                ? "You're Almost Ready"
                : mode === 'forgot'
                ? 'Reset Your Password'
                : mode === 'reset'
                ? 'Create a New Password'
                : 'Create Your Learning Account'}
            </h1>
            <p className="text-base sm:text-lg text-[#dfe0ff] opacity-90 leading-relaxed">
              {mode === 'login'
                ? 'Continue your journey into the mathematics of AES. Master encryption through high-fidelity visualizations and round-by-round analysis.'
                : mode === 'verify'
                ? 'Verify your email address to activate your account and begin exploring the Advanced Encryption Standard through interactive visualization.'
                : mode === 'forgot'
                ? "Don't worry. Enter your registered email address and we'll send you a secure password reset link so you can continue learning AES."
                : mode === 'reset'
                ? 'Choose a strong password to secure your account and continue exploring AES through interactive visualization.'
                : 'Join the AES Visualization Web Platform and explore every stage of the Advanced Encryption Standard through interactive learning, guided explanations, and real-time visualization.'}
            </p>
          </div>

          {/* Security Protocol Badge for Reset Mode */}
          {mode === 'reset' && (
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white/10 rounded-xl border border-white/20 backdrop-blur-md w-fit">
              <RotateCcw className="w-4 h-4 text-[#ff9a5b]" />
              <span className="text-white text-xs font-bold uppercase tracking-widest opacity-90">Security Protocol</span>
            </div>
          )}

          {/* AES 4x4 State Matrix Visual Card (for Login mode) */}
          {mode === 'login' && (
            <div className="p-6 bg-[#2f3c97]/30 rounded-2xl border border-white/10 backdrop-blur-xs space-y-4">
              <div className="text-center text-xs font-semibold text-[#a4aeff]">
                4×4 State Matrix Visualization
              </div>
              <div className="grid grid-cols-4 gap-2.5 max-w-[280px] mx-auto">
                {matrixCells.map((val, idx) => {
                  const isHighlight = val === 'S1';
                  return (
                    <div
                      key={idx}
                      className={`aspect-square flex items-center justify-center rounded-xl font-mono text-xs sm:text-sm font-semibold transition-all duration-300 hover:scale-105 ${
                        isHighlight
                          ? 'bg-[#ff9a5b]/20 border border-[#ff9a5b] text-[#ff9a5b] shadow-md shadow-[#ff9a5b]/10'
                          : 'bg-white/10 border border-white/20 text-white hover:bg-white/20'
                      }`}
                    >
                      {val}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Feature Highlights */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-3 bg-white/5 p-3 rounded-xl border border-white/10 hover:bg-white/10 transition-colors">
              <div className="w-8 h-8 rounded-full bg-[#005221] flex items-center justify-center shrink-0">
                <Check className="w-4 h-4 text-white" />
              </div>
              <span className="font-semibold text-sm text-white">Interactive AES Visualization</span>
            </div>

            <div className="flex items-center gap-3 bg-white/5 p-3 rounded-xl border border-white/10 hover:bg-white/10 transition-colors">
              <div className="w-8 h-8 rounded-full bg-[#005221] flex items-center justify-center shrink-0">
                <Check className="w-4 h-4 text-white" />
              </div>
              <span className="font-semibold text-sm text-white">
                {mode === 'forgot' ? 'Round-by-Round Learning' : 'Step-by-Step Encryption Rounds'}
              </span>
            </div>

            <div className="flex items-center gap-3 bg-white/5 p-3 rounded-xl border border-white/10 hover:bg-white/10 transition-colors">
              <div className="w-8 h-8 rounded-full bg-[#005221] flex items-center justify-center shrink-0">
                <Check className="w-4 h-4 text-white" />
              </div>
              <span className="font-semibold text-sm text-white">
                {mode === 'forgot' ? 'Key Expansion Explorer' : 'Key Expansion Learning'}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Right Panel: Login / Register / Verify Form */}
      <section className="w-full md:w-[55%] lg:w-[55%] flex flex-col justify-center items-center p-6 md:p-12 lg:p-16 bg-[#F7F8FC] relative">
        <div className="w-full max-w-[440px] space-y-6">

          {/* MODE: VERIFY EMAIL */}
          {mode === 'verify' && (
            <div className="bg-white p-8 sm:p-10 rounded-3xl shadow-lg border border-[#D9DDE7] space-y-6">
              {/* Icon Header */}
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-20 h-20 bg-[#e7eefe] rounded-full flex items-center justify-center relative shadow-sm">
                  <Mail className="w-10 h-10 text-[#142380]" />
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-[#ff9a5b] rounded-full border-2 border-white flex items-center justify-center text-white">
                    <AlertCircle className="w-3.5 h-3.5" />
                  </div>
                </div>
                <div className="space-y-1">
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-[#142380]">
                    Verify Your Email
                  </h2>
                  <p className="text-xs sm:text-sm text-[#454652] max-w-sm">
                    We've sent a verification link to your email address. Please check your inbox and click the link to activate your account.
                  </p>
                </div>
              </div>

              {/* Email Display Box */}
              <div className="bg-[#f0f3ff] rounded-xl p-3.5 flex items-center justify-between border border-[#c6c5d4]/40">
                <div className="flex items-center gap-2 min-w-0 pr-2">
                  <AtSign className="w-4 h-4 text-[#767683] shrink-0" />
                  <span className="text-xs sm:text-sm font-semibold text-[#151c27] truncate">
                    {email || 'john@example.com'}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setMode('register');
                    setVerificationStatus('none');
                  }}
                  className="text-xs text-[#142380] hover:underline font-bold shrink-0 cursor-pointer"
                >
                  Change Email
                </button>
              </div>

              {/* Status Box */}
              {verificationStatus === 'success' && (
                <div className="rounded-xl p-4 bg-[#005221]/10 border border-[#005221]/20 text-[#005221] flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-xs sm:text-sm font-bold">Email Successfully Verified</p>
                    <p className="text-xs mt-1 text-[#005221]/80">
                      Redirecting you to the AES workspace in a few moments...
                    </p>
                  </div>
                </div>
              )}

              {verificationStatus === 'resent' && (
                <div className="rounded-xl p-4 bg-[#142380]/10 border border-[#142380]/20 text-[#142380] flex items-start gap-3">
                  <Send className="w-5 h-5 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-xs sm:text-sm font-bold">Verification Email Sent!</p>
                    <p className="text-xs mt-1 text-[#454652]">
                      A fresh verification link has been dispatched to {email || 'your email'}.
                    </p>
                  </div>
                </div>
              )}

              {/* Verification Actions */}
              <div className="space-y-4 pt-1">
                <button
                  type="button"
                  onClick={handleVerifySuccess}
                  className="w-full h-12 bg-[#142380] hover:bg-[#2f3c97] text-white font-bold text-sm rounded-xl shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>I've Verified My Email</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <div className="flex flex-col items-center gap-2 text-center">
                  <button
                    type="button"
                    disabled={timerActive}
                    onClick={handleResendEmail}
                    className={`text-xs font-semibold transition-colors ${
                      timerActive
                        ? 'text-[#767683] cursor-not-allowed'
                        : 'text-[#96490d] hover:text-[#D97430] cursor-pointer font-bold'
                    }`}
                  >
                    Resend Verification Email
                  </button>

                  {timerActive && (
                    <p className="text-xs text-[#454652] flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-[#767683]" />
                      Resend available in <span className="font-bold text-[#142380]">{timeLeft}</span> seconds
                    </p>
                  )}
                </div>
              </div>

              {/* Footer Help */}
              <div className="pt-4 border-t border-[#D9DDE7] text-center">
                <p className="text-xs text-[#767683]">
                  Didn't receive an email? Check your spam folder or{' '}
                  <button
                    type="button"
                    onClick={() => alert('Support team contacted. We will assist you shortly!')}
                    className="text-[#142380] font-bold hover:underline cursor-pointer"
                  >
                    Contact Support
                  </button>
                </p>
              </div>
            </div>
          )}

          {/* MODE: LOGIN OR REGISTER */}
          {(mode === 'login' || mode === 'register') && (
            <div className="bg-white p-8 sm:p-10 rounded-3xl shadow-lg border border-[#D9DDE7] space-y-6">
              <div className="text-center space-y-1">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#142380]">
                  {mode === 'login' ? 'Login' : 'Create Account'}
                </h2>
                <p className="text-sm text-[#454652]">
                  {mode === 'login'
                    ? 'Sign in to continue learning AES.'
                    : 'Start your AES learning journey today.'}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Full Name Input (Register Only) */}
                {mode === 'register' && (
                  <div className="space-y-1.5">
                    <label htmlFor="full-name" className="block text-xs font-bold text-[#454652] uppercase tracking-wider">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-[#767683] absolute left-4 top-1/2 -translate-y-1/2" />
                      <input
                        id="full-name"
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="John Doe"
                        required
                        className="w-full h-12 pl-11 pr-4 bg-[#F7F8FC] border border-[#D9DDE7] rounded-xl focus:ring-2 focus:ring-[#142380]/20 focus:border-[#142380] focus:bg-white text-[#151c27] text-sm outline-none transition-all"
                      />
                    </div>
                  </div>
                )}

                {/* Email Address Input */}
                <div className="space-y-1.5">
                  <label htmlFor="login-email" className="block text-xs font-bold text-[#454652] uppercase tracking-wider">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-[#767683] absolute left-4 top-1/2 -translate-y-1/2" />
                    <input
                      id="login-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@university.edu"
                      required
                      className="w-full h-12 pl-11 pr-4 bg-[#F7F8FC] border border-[#D9DDE7] rounded-xl focus:ring-2 focus:ring-[#142380]/20 focus:border-[#142380] focus:bg-white text-[#151c27] text-sm outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Password Input */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label htmlFor="login-password" className="block text-xs font-bold text-[#454652] uppercase tracking-wider">
                      Password
                    </label>
                    {mode === 'login' && (
                      <button
                        type="button"
                        onClick={() => {
                          setMode('forgot');
                          setForgotSubmitted(false);
                          setStatus('idle');
                        }}
                        className="text-xs font-semibold text-[#142380] hover:underline cursor-pointer"
                      >
                        Forgot Password?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-[#767683] absolute left-4 top-1/2 -translate-y-1/2" />
                    <input
                      id="login-password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="w-full h-12 pl-11 pr-11 bg-[#F7F8FC] border border-[#D9DDE7] rounded-xl focus:ring-2 focus:ring-[#142380]/20 focus:border-[#142380] focus:bg-white text-[#151c27] text-sm outline-none transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-[#767683] hover:text-[#142380] transition-colors cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Password Strength Indicator (Register Mode) */}
                  {mode === 'register' && (
                    <div className="space-y-2 pt-1">
                      <div className="h-1.5 w-full bg-[#dce2f3] rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all duration-300 rounded-full ${strengthColor}`}
                          style={{ width: `${strengthPercentage}%` }}
                        />
                      </div>
                      <ul className="grid grid-cols-2 gap-1.5 text-xs">
                        <li className={`flex items-center gap-1.5 ${reqs.length ? 'text-[#005221] font-semibold' : 'text-[#767683]'}`}>
                          {reqs.length ? <CheckCircle2 className="w-3.5 h-3.5 text-[#005221]" /> : <Circle className="w-3.5 h-3.5 text-[#767683]" />}
                          8+ Characters
                        </li>
                        <li className={`flex items-center gap-1.5 ${reqs.upper ? 'text-[#005221] font-semibold' : 'text-[#767683]'}`}>
                          {reqs.upper ? <CheckCircle2 className="w-3.5 h-3.5 text-[#005221]" /> : <Circle className="w-3.5 h-3.5 text-[#767683]" />}
                          Uppercase
                        </li>
                        <li className={`flex items-center gap-1.5 ${reqs.lower ? 'text-[#005221] font-semibold' : 'text-[#767683]'}`}>
                          {reqs.lower ? <CheckCircle2 className="w-3.5 h-3.5 text-[#005221]" /> : <Circle className="w-3.5 h-3.5 text-[#767683]" />}
                          Lowercase
                        </li>
                        <li className={`flex items-center gap-1.5 ${reqs.number ? 'text-[#005221] font-semibold' : 'text-[#767683]'}`}>
                          {reqs.number ? <CheckCircle2 className="w-3.5 h-3.5 text-[#005221]" /> : <Circle className="w-3.5 h-3.5 text-[#767683]" />}
                          Number
                        </li>
                      </ul>
                    </div>
                  )}
                </div>

                {/* Confirm Password (Register Mode) */}
                {mode === 'register' && (
                  <div className="space-y-1.5">
                    <label htmlFor="confirm-password" className="block text-xs font-bold text-[#454652] uppercase tracking-wider">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <RotateCcw className="w-4 h-4 text-[#767683] absolute left-4 top-1/2 -translate-y-1/2" />
                      <input
                        id="confirm-password"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                        className="w-full h-12 pl-11 pr-4 bg-[#F7F8FC] border border-[#D9DDE7] rounded-xl focus:ring-2 focus:ring-[#142380]/20 focus:border-[#142380] focus:bg-white text-[#151c27] text-sm outline-none transition-all"
                      />
                    </div>
                  </div>
                )}

                {/* Remember Me / Terms Checkbox */}
                {mode === 'login' ? (
                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="checkbox"
                      id="remember"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 text-[#142380] border-[#D9DDE7] rounded focus:ring-[#142380] cursor-pointer"
                    />
                    <label htmlFor="remember" className="text-xs font-medium text-[#454652] cursor-pointer select-none">
                      Remember this device
                    </label>
                  </div>
                ) : (
                  <div className="flex items-start gap-2.5 pt-1">
                    <input
                      type="checkbox"
                      id="terms"
                      checked={termsAccepted}
                      onChange={(e) => setTermsAccepted(e.target.checked)}
                      required
                      className="mt-0.5 w-4 h-4 text-[#142380] border-[#D9DDE7] rounded focus:ring-[#142380] cursor-pointer"
                    />
                    <label htmlFor="terms" className="text-xs font-medium text-[#454652] cursor-pointer select-none leading-relaxed">
                      I agree to the{' '}
                      <button
                        type="button"
                        onClick={() => alert('Terms of Service: Authorized educational usage only.')}
                        className="text-[#142380] font-bold hover:underline"
                      >
                        Terms of Service
                      </button>{' '}
                      and{' '}
                      <button
                        type="button"
                        onClick={() => alert('Privacy Policy: No personal data is stored or shared.')}
                        className="text-[#142380] font-bold hover:underline"
                      >
                        Privacy Policy
                      </button>.
                    </label>
                  </div>
                )}

                {/* Primary Action Button */}
                <button
                  type="submit"
                  disabled={status !== 'idle'}
                  className={`w-full h-12 text-white font-bold text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer mt-2 ${
                    status === 'success'
                      ? 'bg-[#005221]'
                      : 'bg-[#142380] hover:bg-[#2f3c97] active:scale-[0.98]'
                  }`}
                >
                  {status === 'loading' && (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>{mode === 'login' ? 'Authenticating...' : 'Creating Account...'}</span>
                    </>
                  )}
                  {status === 'success' && (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{mode === 'login' ? 'Authenticated! Opening Lab...' : 'Account Created! Verify Email...'}</span>
                    </>
                  )}
                  {status === 'idle' && (
                    <>
                      <span>{mode === 'login' ? 'Login' : 'Create Account'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              {/* Footer Toggle Mode Link */}
              <div className="pt-4 border-t border-[#D9DDE7] text-center">
                <p className="text-xs sm:text-sm text-[#454652]">
                  {mode === 'login' ? (
                    <>
                      Don't have an account?{' '}
                      <button
                        type="button"
                        onClick={() => {
                          setMode('register');
                          setStatus('idle');
                        }}
                        className="text-[#142380] font-bold hover:underline cursor-pointer"
                      >
                        Create Account
                      </button>
                    </>
                  ) : (
                    <>
                      Already have an account?{' '}
                      <button
                        type="button"
                        onClick={() => {
                          setMode('login');
                          setStatus('idle');
                        }}
                        className="text-[#142380] font-bold hover:underline cursor-pointer"
                      >
                        Login
                      </button>
                    </>
                  )}
                </p>
              </div>
            </div>
          )}

          {/* Forgot Password Mode */}
          {mode === 'forgot' && (
            <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-xl shadow-slate-200/50 border border-[#D9DDE7] space-y-6">
              {!forgotSubmitted ? (
                <>
                  <div className="space-y-1.5">
                    <h2 className="text-2xl font-bold text-[#151c27]">Forgot Password?</h2>
                    <p className="text-xs sm:text-sm text-[#454652]">
                      Enter the email address associated with your account. We'll send you instructions to reset your password.
                    </p>
                  </div>

                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (!email) return;
                      setForgotLoading(true);
                      setTimeout(() => {
                        setForgotLoading(false);
                        setForgotSubmitted(true);
                      }, 1000);
                    }}
                    className="space-y-5"
                  >
                    <div className="space-y-1.5">
                      <label htmlFor="forgot-email" className="block text-xs font-bold text-[#454652] uppercase tracking-wider">
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-[#767683] absolute left-4 top-1/2 -translate-y-1/2" />
                        <input
                          id="forgot-email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Enter your registered email address"
                          required
                          className="w-full h-12 pl-11 pr-4 bg-[#F7F8FC] border border-[#D9DDE7] rounded-xl focus:ring-2 focus:ring-[#142380]/20 focus:border-[#142380] focus:bg-white text-[#151c27] text-sm outline-none transition-all"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={forgotLoading}
                      className="w-full h-12 bg-[#142380] hover:bg-[#2f3c97] text-white font-bold text-sm rounded-xl shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
                    >
                      {forgotLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Sending Reset Link...</span>
                        </>
                      ) : (
                        <>
                          <span>Send Reset Link</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>

                    <div className="pt-2 text-center">
                      <p className="text-xs sm:text-sm text-[#454652]">
                        Remember your password?{' '}
                        <button
                          type="button"
                          onClick={() => {
                            setMode('login');
                            setStatus('idle');
                          }}
                          className="text-[#142380] font-bold hover:underline ml-1 cursor-pointer"
                        >
                          Back to Login
                        </button>
                      </p>
                    </div>
                  </form>
                </>
              ) : (
                <div className="flex flex-col items-center text-center py-4 space-y-4">
                  <div className="w-16 h-16 bg-[#6bff8f]/30 border border-[#005221]/20 rounded-full flex items-center justify-center text-[#005221]">
                    <CheckCircle2 className="w-10 h-10 text-[#005221]" />
                  </div>
                  <div className="space-y-1.5">
                    <h3 className="text-2xl font-bold text-[#151c27]">Check Your Email</h3>
                    <p className="text-xs sm:text-sm text-[#454652] max-w-sm mx-auto">
                      We've sent a password reset link to <span className="font-semibold text-[#142380]">{email || 'your email address'}</span>. Please follow the instructions to reset your password.
                    </p>
                  </div>

                  <div className="pt-4 space-y-3 w-full">
                    <button
                      type="button"
                      onClick={() => {
                        setMode('reset');
                        setResetSubmitted(false);
                      }}
                      className="w-full h-11 bg-[#142380] text-white font-bold text-sm rounded-xl hover:bg-[#2f3c97] transition-all cursor-pointer flex items-center justify-center gap-2"
                    >
                      <span>Reset Password Now</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => setForgotSubmitted(false)}
                      className="text-xs sm:text-sm text-[#142380] font-bold hover:underline cursor-pointer block mx-auto"
                    >
                      Didn't receive the email? Try again
                    </button>

                    <div>
                      <button
                        type="button"
                        onClick={() => {
                          setMode('login');
                          setStatus('idle');
                        }}
                        className="w-full h-11 bg-[#F7F8FC] border border-[#D9DDE7] text-[#151c27] font-bold text-sm rounded-xl hover:bg-[#e7eefe] transition-all cursor-pointer"
                      >
                        Back to Login
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Reset Password Mode */}
          {mode === 'reset' && (
            <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-xl shadow-slate-200/50 border border-[#D9DDE7] space-y-6">
              {!resetSubmitted ? (
                <>
                  <div className="flex flex-col items-center text-center space-y-3">
                    <div className="w-16 h-16 bg-[#e7eefe] rounded-full flex items-center justify-center text-[#142380]">
                      <RotateCcw className="w-8 h-8" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-extrabold text-[#151c27]">Reset Password</h2>
                      <p className="text-xs sm:text-sm text-[#454652] mt-1">
                        Enter and confirm your new password.
                      </p>
                    </div>
                  </div>

                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (newPassword !== confirmNewPassword) {
                        alert('Passwords do not match!');
                        return;
                      }
                      setResetLoading(true);
                      setTimeout(() => {
                        setResetLoading(false);
                        setResetSubmitted(true);
                      }, 1200);
                    }}
                    className="space-y-5"
                  >
                    {/* New Password Field */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center">
                        <label htmlFor="new-pass" className="block text-xs font-bold text-[#454652] uppercase tracking-wider">
                          New Password
                        </label>
                        <span
                          className={`text-xs font-bold ${
                            resetScore === 0
                              ? 'text-[#767683]'
                              : resetScore <= 2
                              ? 'text-[#EF4444]'
                              : resetScore <= 4
                              ? 'text-[#F59E0B]'
                              : 'text-[#005221]'
                          }`}
                        >
                          Strength: {resetScore === 0 ? '-' : resetScore <= 2 ? 'Weak' : resetScore <= 4 ? 'Fair' : 'Strong'}
                        </span>
                      </div>
                      <div className="relative">
                        <input
                          id="new-pass"
                          type={showNewPassword ? 'text' : 'password'}
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="••••••••"
                          required
                          className="w-full h-12 pl-4 pr-11 bg-[#F7F8FC] border border-[#D9DDE7] rounded-xl focus:ring-2 focus:ring-[#142380]/20 focus:border-[#142380] focus:bg-white text-[#151c27] text-sm outline-none transition-all"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#767683] hover:text-[#142380] transition-colors cursor-pointer"
                        >
                          {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      {/* Strength Bar */}
                      <div className="h-1.5 w-full bg-[#e2e8f8] rounded-full overflow-hidden mt-1.5">
                        <div
                          className={`h-full transition-all duration-300 ${
                            resetScore === 0
                              ? 'w-0'
                              : resetScore <= 2
                              ? 'w-1/3 bg-[#EF4444]'
                              : resetScore <= 4
                              ? 'w-2/3 bg-[#F59E0B]'
                              : 'w-full bg-[#005221]'
                          }`}
                        />
                      </div>
                    </div>

                    {/* Confirm New Password Field */}
                    <div className="space-y-1.5">
                      <label htmlFor="confirm-new-pass" className="block text-xs font-bold text-[#454652] uppercase tracking-wider">
                        Confirm New Password
                      </label>
                      <div className="relative">
                        <input
                          id="confirm-new-pass"
                          type={showConfirmNewPassword ? 'text' : 'password'}
                          value={confirmNewPassword}
                          onChange={(e) => setConfirmNewPassword(e.target.value)}
                          placeholder="••••••••"
                          required
                          className={`w-full h-12 pl-4 pr-11 bg-[#F7F8FC] border rounded-xl focus:ring-2 focus:ring-[#142380]/20 focus:bg-white text-[#151c27] text-sm outline-none transition-all ${
                            confirmNewPassword && newPassword !== confirmNewPassword
                              ? 'border-[#EF4444] focus:border-[#EF4444]'
                              : 'border-[#D9DDE7] focus:border-[#142380]'
                          }`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#767683] hover:text-[#142380] transition-colors cursor-pointer"
                        >
                          {showConfirmNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      {confirmNewPassword && newPassword !== confirmNewPassword && (
                        <p className="text-xs text-[#EF4444] font-medium flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5" /> Passwords do not match.
                        </p>
                      )}
                    </div>

                    {/* Security Requirements Checklist */}
                    <div className="p-3.5 bg-[#f0f3ff] rounded-xl border border-[#D9DDE7]/60 space-y-2">
                      <h4 className="text-[11px] font-bold text-[#767683] uppercase tracking-wider">
                        Security Requirements
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        <div className={`flex items-center gap-1.5 ${resetReqs.length ? 'text-[#005221] font-bold' : 'text-[#767683]'}`}>
                          {resetReqs.length ? <CheckCircle2 className="w-3.5 h-3.5 text-[#005221]" /> : <Circle className="w-3.5 h-3.5 text-[#767683]" />}
                          <span>8+ Characters</span>
                        </div>
                        <div className={`flex items-center gap-1.5 ${resetReqs.upper ? 'text-[#005221] font-bold' : 'text-[#767683]'}`}>
                          {resetReqs.upper ? <CheckCircle2 className="w-3.5 h-3.5 text-[#005221]" /> : <Circle className="w-3.5 h-3.5 text-[#767683]" />}
                          <span>Uppercase Letter</span>
                        </div>
                        <div className={`flex items-center gap-1.5 ${resetReqs.lower ? 'text-[#005221] font-bold' : 'text-[#767683]'}`}>
                          {resetReqs.lower ? <CheckCircle2 className="w-3.5 h-3.5 text-[#005221]" /> : <Circle className="w-3.5 h-3.5 text-[#767683]" />}
                          <span>Lowercase Letter</span>
                        </div>
                        <div className={`flex items-center gap-1.5 ${resetReqs.number ? 'text-[#005221] font-bold' : 'text-[#767683]'}`}>
                          {resetReqs.number ? <CheckCircle2 className="w-3.5 h-3.5 text-[#005221]" /> : <Circle className="w-3.5 h-3.5 text-[#767683]" />}
                          <span>A Number</span>
                        </div>
                        <div className={`flex items-center gap-1.5 col-span-full ${resetReqs.special ? 'text-[#005221] font-bold' : 'text-[#767683]'}`}>
                          {resetReqs.special ? <CheckCircle2 className="w-3.5 h-3.5 text-[#005221]" /> : <Circle className="w-3.5 h-3.5 text-[#767683]" />}
                          <span>Special Character (!@#$%)</span>
                        </div>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={resetLoading}
                      className="w-full h-12 bg-[#142380] hover:bg-[#2f3c97] text-white font-bold text-sm rounded-xl shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
                    >
                      {resetLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Updating Password...</span>
                        </>
                      ) : (
                        <>
                          <span>Update Password</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>

                    <div className="text-center pt-1">
                      <button
                        type="button"
                        onClick={() => {
                          setMode('login');
                          setStatus('idle');
                        }}
                        className="text-xs sm:text-sm text-[#142380] font-bold hover:underline cursor-pointer"
                      >
                        Back to Login
                      </button>
                    </div>
                  </form>
                </>
              ) : (
                /* Success View after Reset Password */
                <div className="flex flex-col items-center text-center py-4 space-y-4">
                  <div className="w-16 h-16 bg-[#6bff8f]/30 border border-[#005221]/20 rounded-full flex items-center justify-center text-[#005221]">
                    <CheckCircle2 className="w-10 h-10 text-[#005221]" />
                  </div>
                  <div className="space-y-1.5">
                    <h3 className="text-2xl font-bold text-[#151c27]">Password Updated Successfully</h3>
                    <p className="text-xs sm:text-sm text-[#454652] max-w-sm mx-auto">
                      Your password has been changed successfully. You can now sign in using your new password.
                    </p>
                  </div>

                  <div className="pt-2 w-full space-y-2.5">
                    <button
                      type="button"
                      onClick={() => {
                        setMode('login');
                        setResetSubmitted(false);
                        setNewPassword('');
                        setConfirmNewPassword('');
                        setStatus('idle');
                      }}
                      className="w-full h-12 bg-[#142380] hover:bg-[#2f3c97] text-white font-bold text-sm rounded-xl shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
                    >
                      <span>Go to Login</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveTab('home')}
                      className="w-full h-11 border-2 border-[#D9DDE7] text-[#142380] font-bold text-sm rounded-xl hover:bg-[#F7F8FC] hover:border-[#142380] transition-all cursor-pointer"
                    >
                      Back to Home
                    </button>
                  </div>

                  <div className="w-full p-3 bg-[#f0f3ff] rounded-xl border border-[#142380]/10 flex gap-2.5 items-start text-left">
                    <Info className="w-4 h-4 text-[#142380] shrink-0 mt-0.5" />
                    <p className="text-xs text-[#454652] leading-relaxed">
                      <span className="font-bold text-[#151c27]">Security Tip:</span> Keep your password private and avoid sharing it with others. Use a unique password to better protect your account.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Academic Integrity / Assistance Note */}
          <div className="p-4 bg-[#e7eefe] rounded-2xl border border-[#dce2f3] flex items-start gap-3">
            {(mode === 'forgot' || mode === 'reset') ? (
              <>
                <HelpCircle className="w-5 h-5 text-[#96490d] shrink-0 mt-0.5" />
                <p className="text-xs text-[#454652] leading-relaxed">
                  Need immediate help? Contact our{' '}
                  <button
                    type="button"
                    onClick={() => alert('Technical support team notified. We will assist you shortly!')}
                    className="text-[#96490d] font-bold hover:underline cursor-pointer"
                  >
                    technical support
                  </button>{' '}
                  team available 24/7.
                </p>
              </>
            ) : (
              <>
                <Info className="w-5 h-5 text-[#142380] shrink-0 mt-0.5" />
                <p className="text-xs text-[#454652] leading-relaxed">
                  Authorized access only. By logging in or creating an account, you agree to our Academic Integrity Policy and terms of service.
                </p>
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};


