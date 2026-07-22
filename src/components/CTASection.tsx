import React from 'react';
import { NavigationTab } from '../types';
import { Sparkles, ArrowRight } from 'lucide-react';

interface CTASectionProps {
  setActiveTab: (tab: NavigationTab) => void;
}

export const CTASection: React.FC<CTASectionProps> = ({ setActiveTab }) => {
  return (
    <section className="py-16 md:py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto bg-[#2f3c97] text-white rounded-3xl p-8 sm:p-12 md:p-16 text-center shadow-2xl relative overflow-hidden">
        
        {/* Abstract dot background pattern */}
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)',
            backgroundSize: '24px 24px'
          }}
        />

        <div className="relative z-10 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-white/10 text-white px-4 py-1.5 rounded-full text-xs font-semibold mb-6 backdrop-blur-xs">
            <Sparkles className="w-4 h-4 text-[#ff9a5b]" />
            <span>Interactive Cryptography Education</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-6 leading-tight">
            Start Your AES Learning Journey
          </h2>

          <p className="text-base sm:text-lg mb-8 opacity-90 leading-relaxed max-w-2xl mx-auto">
            Gain a deeper understanding of the Advanced Encryption Standard through interactive visualization, guided explanations, and hands-on exploration.
          </p>

          <button
            onClick={() => {
              setActiveTab('login');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            id="cta-start-learning-btn"
            className="bg-white text-[#2f3c97] px-8 sm:px-10 py-3.5 sm:py-4 rounded-xl font-bold text-base sm:text-lg shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all inline-flex items-center gap-2 cursor-pointer"
          >
            <span>Start Learning Now</span>
            <ArrowRight className="w-5 h-5 text-[#2f3c97]" />
          </button>
        </div>

      </div>
    </section>
  );
};
