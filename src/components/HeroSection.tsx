import React from 'react';
import { NavigationTab } from '../types';
import { Play, Sparkles, ArrowRight, Layers } from 'lucide-react';

interface HeroSectionProps {
  setActiveTab: (tab: NavigationTab) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ setActiveTab }) => {
  return (
    <section className="hero-gradient relative py-12 md:py-20 overflow-hidden bg-[#f9f9ff]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
        
        {/* Left Column Text Content */}
        <div className="flex-1 text-left">
          {/* Pills / Badges */}
          <div className="flex flex-wrap gap-2 mb-6">
            <span className="bg-[#e7eefe] text-[#142380] font-semibold text-xs px-3 py-1.5 rounded-full border border-[#dce2f3] flex items-center gap-1.5 shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-[#2f3c97]" />
              Interactive Learning
            </span>
            <span className="bg-[#e7eefe] text-[#142380] font-semibold text-xs px-3 py-1.5 rounded-full border border-[#dce2f3] flex items-center gap-1.5 shadow-2xs">
              <Layers className="w-3.5 h-3.5 text-[#2f3c97]" />
              Step-by-Step Visualization
            </span>
            <span className="bg-[#e7eefe] text-[#142380] font-semibold text-xs px-3 py-1.5 rounded-full border border-[#dce2f3] shadow-2xs">
              Web-Based Platform
            </span>
          </div>

          {/* Main Title */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#1C2340] mb-6 leading-[1.15] tracking-tight">
            Understand Every Step of AES Encryption Through{' '}
            <span className="text-[#2f3c97] underline decoration-[#ff9a5b]/40 decoration-wavy">
              Interactive Visualization
            </span>
          </h1>

          {/* Body Description */}
          <p className="text-base sm:text-lg text-[#454652] mb-8 max-w-2xl leading-relaxed">
            Learn how plaintext is transformed into ciphertext by exploring every AES encryption round, key expansion process, and state transformation through interactive visualizations and guided explanations.
          </p>

          {/* Call to Actions */}
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => {
                setActiveTab('login');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              id="hero-start-learning-btn"
              className="bg-[#2f3c97] text-white px-8 py-3.5 rounded-xl font-semibold text-base shadow-lg hover:bg-[#142380] hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center gap-2 group cursor-pointer"
            >
              <span>Start Learning</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => {
                setActiveTab('basics');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              id="hero-explore-features-btn"
              className="border-2 border-[#2f3c97] text-[#2f3c97] bg-white px-8 py-3.5 rounded-xl font-semibold text-base hover:bg-[#f0f3ff] transition-all cursor-pointer shadow-xs"
            >
              Explore Features
            </button>
          </div>
        </div>

        {/* Right Column Diagram Illustration */}
        <div className="flex-1 relative w-full">
          <div className="relative z-10 p-3 sm:p-4 bg-white rounded-2xl shadow-2xl border border-[#c6c5d4] group">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBQT4p9zGQkUkuaflGSSPmmOH_yASdS4UoqWak4IqS2yzoim2QD7-zw-okJ1wjMl7h72bjfc2H73iZDzNbroNtlAOlOdDXt5mDbtnX01GkeJNgllLvvRAraf2eK63cF8fZQ4IrK-wkNArBLzHF28EgkZwNO-0Ktzp8wWQYamgootjN0NMBgK67hXromxW3WBNgQxWGNp7HZAQ6Oca3nDlconwT0GjPsjlENzUmyc-CSUzQeY7YIdcVW-Q"
              alt="AES Encryption Workflow: Protecting Data Through Advanced Transformation"
              className="w-full h-auto rounded-xl object-contain bg-[#fafafd]"
            />

            {/* Floating Interactive Badge / Button on Image */}
            <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl flex items-center justify-center">
              <button
                onClick={() => {
                  setActiveTab('visualization');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="bg-[#2f3c97] text-white px-6 py-3 rounded-xl font-semibold shadow-2xl flex items-center gap-2 transform translate-y-2 group-hover:translate-y-0 transition-transform cursor-pointer"
              >
                <Play className="w-5 h-5 fill-white" />
                <span>Launch Interactive Matrix Simulator</span>
              </button>
            </div>
          </div>

          {/* Decorative ambient background glows */}
          <div className="absolute -top-10 -right-10 w-64 h-64 bg-[#2f3c97] opacity-10 blur-3xl rounded-full pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-[#ff9a5b] opacity-15 blur-3xl rounded-full pointer-events-none" />
        </div>

      </div>
    </section>
  );
};
