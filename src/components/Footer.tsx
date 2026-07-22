import React from 'react';
import { NavigationTab } from '../types';
import { Shield, ExternalLink } from 'lucide-react';

interface FooterProps {
  setActiveTab: (tab: NavigationTab) => void;
  onOpenLogin: () => void;
}

export const Footer: React.FC<FooterProps> = ({ setActiveTab, onOpenLogin }) => {
  const handleNav = (tab: NavigationTab) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#e7eefe] text-[#151c27] border-t border-[#c6c5d4] mt-auto">
      <div className="flex flex-col md:flex-row justify-between items-start w-full px-6 lg:px-8 py-12 max-w-7xl mx-auto gap-10">
        {/* Brand Column */}
        <div className="flex flex-col gap-4 max-w-sm">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#2f3c97] text-white flex items-center justify-center shadow-sm">
              <Shield className="w-5 h-5" />
            </div>
            <span className="text-xl font-bold text-[#142380]">
              AES Visualization Web Platform
            </span>
          </div>
          <p className="text-sm text-[#454652] leading-relaxed">
            Empowering the next generation of cybersecurity experts with visual learning tools and interactive cryptographic algorithms.
          </p>
          <div className="text-xs text-[#454652] pt-2">
            © {new Date().getFullYear()} AES Visualization Web Platform. All rights reserved.
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 w-full md:w-auto">
          {/* Product */}
          <div className="flex flex-col gap-2.5">
            <span className="text-sm font-bold text-[#142380]">Product</span>
            <button
              onClick={() => handleNav('visualization')}
              className="text-left text-sm text-[#454652] hover:text-[#142380] hover:underline"
            >
              Visualization
            </button>
            <button
              onClick={() => handleNav('visualization')}
              className="text-left text-sm text-[#454652] hover:text-[#142380] hover:underline"
            >
              Key Expansion
            </button>
            <button
              onClick={() => handleNav('basics')}
              className="text-left text-sm text-[#454652] hover:text-[#142380] hover:underline"
            >
              Simulations
            </button>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col gap-2.5">
            <span className="text-sm font-bold text-[#142380]">Quick Links</span>
            <button
              onClick={() => handleNav('home')}
              className="text-left text-sm text-[#454652] hover:text-[#142380] hover:underline"
            >
              Home
            </button>
            <button
              onClick={() => handleNav('basics')}
              className="text-left text-sm text-[#454652] hover:text-[#142380] hover:underline"
            >
              AES Basics
            </button>
            <button
              onClick={() => handleNav('login')}
              className="text-left text-sm text-[#454652] hover:text-[#142380] hover:underline"
            >
              Login
            </button>
          </div>

          {/* Documentation */}
          <div className="flex flex-col gap-2.5">
            <span className="text-sm font-bold text-[#142380]">Documentation</span>
            <button
              onClick={() => handleNav('documentation')}
              className="text-left text-sm text-[#454652] hover:text-[#142380] hover:underline"
            >
              API Ref
            </button>
            <button
              onClick={() => handleNav('documentation')}
              className="text-left text-sm text-[#454652] hover:text-[#142380] hover:underline"
            >
              Standards
            </button>
            <button
              onClick={() => handleNav('documentation')}
              className="text-left text-sm text-[#454652] hover:text-[#142380] hover:underline"
            >
              FAQ
            </button>
          </div>

          {/* Contact */}
          <div className="flex flex-col gap-2.5">
            <span className="text-sm font-bold text-[#142380]">Contact</span>
            <a
              href="https://nvlpubs.nist.gov/nistpubs/FIPS/NIST.FIPS.197.pdf"
              target="_blank"
              rel="noreferrer"
              className="text-left text-sm text-[#454652] hover:text-[#142380] hover:underline flex items-center gap-1"
            >
              <span>NIST Standard</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <button
              onClick={() => handleNav('documentation')}
              className="text-left text-sm text-[#454652] hover:text-[#142380] hover:underline"
            >
              Support
            </button>
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="text-left text-sm text-[#454652] hover:text-[#142380] hover:underline flex items-center gap-1"
            >
              <span>GitHub</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
