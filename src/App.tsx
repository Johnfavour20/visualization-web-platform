/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { NavigationTab, SessionRecord } from './types';
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
import { DashboardView } from './components/DashboardView';
import { SessionHistoryView } from './components/SessionHistoryView';
import { SessionDetailsView } from './components/SessionDetailsView';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavigationTab>('home');
  const [isLoginOpen, setIsLoginOpen] = useState<boolean>(false);
  const [selectedSession, setSelectedSession] = useState<SessionRecord | null>(null);

  const handleSelectSession = (session: SessionRecord) => {
    setSelectedSession(session);
    setActiveTab('details');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f9f9ff] text-[#151c27] font-sans antialiased">
      {/* Sticky Top Header (hidden for login, dashboard, history, details, and basics which have custom dashboard navigation shell) */}
      {activeTab !== 'login' && activeTab !== 'dashboard' && activeTab !== 'history' && activeTab !== 'details' && activeTab !== 'basics' && (
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

        {activeTab === 'dashboard' && (
          <DashboardView setActiveTab={setActiveTab} onSelectSession={handleSelectSession} />
        )}

        {activeTab === 'history' && (
          <SessionHistoryView setActiveTab={setActiveTab} onSelectSession={handleSelectSession} />
        )}

        {activeTab === 'details' && (
          <SessionDetailsView setActiveTab={setActiveTab} selectedSession={selectedSession} />
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
      {activeTab !== 'login' && activeTab !== 'dashboard' && activeTab !== 'history' && activeTab !== 'details' && activeTab !== 'basics' && (
        <Footer setActiveTab={setActiveTab} onOpenLogin={() => setIsLoginOpen(true)} />
      )}

      {/* Login Modal */}
      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </div>
  );
}
