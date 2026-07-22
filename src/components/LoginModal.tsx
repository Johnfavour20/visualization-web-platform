import React, { useState } from 'react';
import { X, Lock, Mail, ShieldCheck } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('student@university.edu');
  const [password, setPassword] = useState('••••••••••••');
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-[#c6c5d4] animate-in fade-in zoom-in-95 space-y-6 relative">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-1 text-[#454652] hover:text-[#142380] rounded-lg hover:bg-[#f0f3ff]"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-[#e7eefe] text-[#142380] rounded-2xl flex items-center justify-center mx-auto font-bold shadow-xs">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-[#1C2340]">
            Platform Account Login
          </h2>
          <p className="text-sm text-[#454652]">
            Access saved AES encryption simulations and academic courseware.
          </p>
        </div>

        {isSubmitted ? (
          <div className="bg-[#e7eefe] p-6 rounded-2xl text-center space-y-2 text-[#142380]">
            <ShieldCheck className="w-10 h-10 mx-auto text-[#2f3c97]" />
            <div className="font-bold text-base">Welcome Back!</div>
            <div className="text-xs text-[#454652]">Authentication successful. Loading your workspace...</div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#142380] uppercase">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#454652] absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-[#F7F8FC] border border-[#D9DDE7] focus:border-[#2f3c97] focus:bg-white text-[#1C2340] text-sm pl-10 pr-4 py-3 rounded-xl focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#142380] uppercase">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#454652] absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full bg-[#F7F8FC] border border-[#D9DDE7] focus:border-[#2f3c97] focus:bg-white text-[#1C2340] text-sm pl-10 pr-4 py-3 rounded-xl focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-[#2f3c97] text-white py-3 rounded-xl font-bold text-base shadow-md hover:bg-[#142380] transition-all cursor-pointer"
            >
              Sign In to Platform
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
