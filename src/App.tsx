/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { NavigationTab } from './types';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HeroSection } from './components/HeroSection';
import { WhyChooseSection } from './components/WhyChooseSection';
import { JourneyTimeline } from './components/JourneyTimeline';
import { StatsSection } from './components/StatsSection';
import { CTASection } from './components/CTASection';
import { AESVisualizer } from './components/AESVisualizer';
import { AESBasics } from './components/AESBasics';
import { DocumentationView } from './components/DocumentationView';
import { LoginPage } from './components/LoginPage';
import { LoginModal } from './components/LoginModal';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavigationTab>('home');
  const [isLoginOpen, setIsLoginOpen] = useState<boolean>(false);

  return (
    <div className="min-h-screen flex flex-col bg-[#f9f9ff] text-[#151c27] font-sans antialiased">
      {/* Sticky Top Header */}
      {activeTab !== 'login' && (
        <Header
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onOpenLogin={() => setIsLoginOpen(true)}
        />
      )}

      {/* Main Page Content based on Active Tab */}
      <main className="flex-1">
        {activeTab === 'home' && (
          <div className="space-y-0">
            <HeroSection setActiveTab={setActiveTab} />
            <WhyChooseSection setActiveTab={setActiveTab} />
            <JourneyTimeline setActiveTab={setActiveTab} />
            <StatsSection setActiveTab={setActiveTab} />
            <CTASection setActiveTab={setActiveTab} />
          </div>
        )}

        {activeTab === 'basics' && (
          <AESBasics setActiveTab={setActiveTab} />
        )}

        {activeTab === 'visualization' && (
          <AESVisualizer />
        )}

        {activeTab === 'documentation' && (
          <DocumentationView />
        )}

        {activeTab === 'login' && (
          <LoginPage setActiveTab={setActiveTab} />
        )}
      </main>

      {/* Footer */}
      {activeTab !== 'login' && (
        <Footer setActiveTab={setActiveTab} onOpenLogin={() => setIsLoginOpen(true)} />
      )}

      {/* Login Modal */}
      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </div>
  );
}
