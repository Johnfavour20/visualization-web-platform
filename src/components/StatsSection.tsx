import React from 'react';
import { NavigationTab } from '../types';
import { GraduationCap, LayoutGrid, FlaskConical, Smile } from 'lucide-react';

interface StatsSectionProps {
  setActiveTab: (tab: NavigationTab) => void;
}

export const StatsSection: React.FC<StatsSectionProps> = ({ setActiveTab }) => {
  const stats = [
    {
      icon: GraduationCap,
      color: 'text-[#2f3c97]',
      title: 'AES-128',
      sub: '10 Encryption Rounds'
    },
    {
      icon: LayoutGrid,
      color: 'text-[#96490d]',
      title: '4×4 State Matrix',
      sub: 'Visual Learning'
    },
    {
      icon: FlaskConical,
      color: 'text-[#005221]',
      title: 'Key Expansion',
      sub: 'Round Key Generation'
    },
    {
      icon: Smile,
      color: 'text-[#142380]',
      title: 'Interactive Visualization',
      sub: 'Learn Every Transformation'
    }
  ];

  return (
    <section className="py-16 md:py-20 bg-[#F7F8FC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, idx) => {
            const IconComp = stat.icon;
            return (
              <div
                key={idx}
                onClick={() => {
                  setActiveTab('visualization');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="bg-white p-6 rounded-2xl text-center border border-[#D9DDE7] hover:-translate-y-1 hover:shadow-md transition-all cursor-pointer group"
              >
                <div className={`${stat.color} mb-3 flex justify-center group-hover:scale-110 transition-transform`}>
                  <IconComp className="w-8 h-8" />
                </div>
                <h4 className="text-xl font-bold text-[#1C2340] mb-1">
                  {stat.title}
                </h4>
                <p className="text-sm font-medium text-[#454652]">
                  {stat.sub}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
