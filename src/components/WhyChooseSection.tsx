import React from 'react';
import { NavigationTab } from '../types';
import { Eye, Key, BookOpen } from 'lucide-react';

interface WhyChooseSectionProps {
  setActiveTab: (tab: NavigationTab) => void;
}

export const WhyChooseSection: React.FC<WhyChooseSectionProps> = ({ setActiveTab }) => {
  const cards = [
    {
      id: 'visualization-feature',
      icon: Eye,
      iconBg: 'bg-[#2f3c97] text-white',
      title: 'Interactive AES Visualization',
      description: 'Observe every AES transformation in real time as plaintext moves through each encryption stage.',
      tab: 'visualization' as NavigationTab
    },
    {
      id: 'key-expansion-feature',
      icon: Key,
      iconBg: 'bg-[#ff9a5b] text-[#733300]',
      title: 'AES Key Expansion',
      description: 'Visualize how the original encryption key generates round keys used throughout the AES algorithm.',
      tab: 'visualization' as NavigationTab
    },
    {
      id: 'round-encryption-feature',
      icon: BookOpen,
      iconBg: 'bg-[#005221] text-white',
      title: 'Round-by-Round Encryption',
      description: 'Navigate every encryption round and understand the purpose of each AES transformation.',
      tab: 'basics' as NavigationTab
    }
  ];

  return (
    <section id="features" className="py-16 md:py-20 bg-[#F7F8FC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1C2340] mb-3">
            Why Choose AES Visualization Web Platform?
          </h2>
          <p className="text-base text-[#454652] max-w-xl mx-auto">
            Uncomplicating the complexity of cryptographic algorithms.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {cards.map((card) => {
            const IconComponent = card.icon;
            return (
              <div
                key={card.id}
                onClick={() => {
                  setActiveTab(card.tab);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="bg-white p-8 rounded-2xl shadow-xs border border-[#D9DDE7] hover:shadow-lg transition-all cursor-pointer group hover:-translate-y-1"
              >
                <div className={`w-12 h-12 ${card.iconBg} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-xs`}>
                  <IconComponent className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-[#1C2340] mb-3 group-hover:text-[#2f3c97] transition-colors">
                  {card.title}
                </h3>
                <p className="text-base text-[#454652] leading-relaxed">
                  {card.description}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
