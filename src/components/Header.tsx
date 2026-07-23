import React, { useState } from 'react';
import { NavigationTab } from '../types';
import { Lock, Menu, X, Shield, ChevronRight } from 'lucide-react';

interface HeaderProps {
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  onOpenLogin: () => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab, onOpenLogin }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: { id: NavigationTab; label: string }[] = [
    { id: 'home', label: 'Home' },
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'basics', label: 'AES Basics' },
    { id: 'visualization', label: 'Visualization' },
    { id: 'documentation', label: 'Documentation' },
  ];

  const handleNav = (tab: NavigationTab) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="bg-white sticky top-0 z-50 border-b border-[#D9DDE7] shadow-xs">
      <div className="flex justify-between items-center w-full px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto h-20">
        {/* Brand Logo & Title */}
        <button
          onClick={() => handleNav('home')}
          className="flex items-center gap-3 text-left group focus:outline-none"
          id="nav-logo-btn"
        >
          <div className="w-10 h-10 rounded-xl bg-[#2f3c97] text-white flex items-center justify-center shadow-md group-hover:bg-[#142380] transition-colors">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <div className="text-lg sm:text-xl font-bold text-[#142380] leading-snug">
              AES Visualization Web Platform
            </div>
            <div className="text-xs text-[#454652] font-medium hidden sm:block">
              Interactive Cryptography Laboratory
            </div>
          </div>
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNav(item.id)}
                id={`nav-link-${item.id}`}
                className={`font-semibold text-base transition-all py-1 border-b-2 ${
                  isActive
                    ? 'text-[#142380] border-[#142380]'
                    : 'text-[#454652] border-transparent hover:text-[#24307B]'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Action Buttons */}
        <div className="hidden sm:flex items-center gap-3">
          <button
            onClick={() => handleNav('login')}
            id="header-login-btn"
            className={`px-4 py-2 font-semibold text-base transition-colors rounded-lg ${
              activeTab === 'login'
                ? 'text-[#142380] bg-[#e7eefe]'
                : 'text-[#454652] hover:text-[#24307B] hover:bg-[#f0f3ff]'
            }`}
          >
            Login
          </button>
          <button
            onClick={() => handleNav('visualization')}
            id="header-start-learning-btn"
            className="bg-[#2f3c97] text-white px-5 py-2.5 rounded-xl font-semibold text-base shadow-md hover:bg-[#142380] hover:shadow-lg transition-all active:scale-95 flex items-center gap-2"
          >
            <span>Start Learning</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="md:hidden flex items-center gap-2">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            id="mobile-menu-toggle"
            className="p-2 text-[#454652] hover:text-[#142380] rounded-lg hover:bg-[#f0f3ff]"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-[#D9DDE7] px-4 pt-2 pb-6 space-y-3 shadow-lg">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNav(item.id)}
              className={`w-full text-left px-4 py-3 rounded-xl text-base font-semibold transition-colors flex items-center justify-between ${
                activeTab === item.id
                  ? 'bg-[#e7eefe] text-[#142380]'
                  : 'text-[#454652] hover:bg-[#f0f3ff]'
              }`}
            >
              <span>{item.label}</span>
              {activeTab === item.id && <div className="w-2 h-2 rounded-full bg-[#142380]" />}
            </button>
          ))}
          <div className="pt-2 border-t border-[#D9DDE7] flex flex-col gap-2">
            <button
              onClick={() => {
                handleNav('login');
              }}
              className={`w-full text-center px-4 py-2.5 text-base font-semibold border rounded-xl ${
                activeTab === 'login'
                  ? 'bg-[#e7eefe] text-[#142380] border-[#142380]'
                  : 'text-[#454652] border-[#D9DDE7] hover:bg-[#f0f3ff]'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => handleNav('visualization')}
              className="w-full text-center px-4 py-2.5 text-base font-semibold text-white bg-[#2f3c97] rounded-xl hover:bg-[#142380] shadow-sm"
            >
              Start Learning
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
