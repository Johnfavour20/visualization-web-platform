/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { SessionRecord } from './types';
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
import { useAuthStore } from './store/useAuthStore';

function HomePage({ navigate }: { navigate: (path: string) => void }) {
  const setActiveTab = (tab: any) => {
    switch (tab) {
      case 'home':
        navigate('/');
        break;
      case 'dashboard':
        navigate('/dashboard');
        break;
      case 'basics':
        navigate('/basics');
        break;
      case 'visualization':
        navigate('/visualization');
        break;
      case 'documentation':
        navigate('/documentation');
        break;
      case 'login':
        navigate('/login');
        break;
      default:
        navigate('/');
    }
  };

  return (
    <div className="space-y-0">
      <HeroSection setActiveTab={setActiveTab} />
      <WhyChooseSection setActiveTab={setActiveTab} />
      <JourneyTimeline setActiveTab={setActiveTab} />
      <StatsSection setActiveTab={setActiveTab} />
      <CTASection setActiveTab={setActiveTab} />
    </div>
  );
}

export default function App() {
  const navigate = useNavigate();
  const [isLoginOpen, setIsLoginOpen] = React.useState(false);
  const [selectedSession, setSelectedSession] = React.useState<SessionRecord | null>(null);
  const { isLoggedIn, login, logout } = useAuthStore();

  const setActiveTab = (tab: any) => {
    switch (tab) {
      case 'home':
        navigate('/');
        break;
      case 'dashboard':
        navigate('/dashboard');
        break;
      case 'history':
        navigate('/history');
        break;
      case 'details':
        navigate('/details');
        break;
      case 'basics':
        navigate('/basics');
        break;
      case 'visualization':
        navigate('/visualization');
        break;
      case 'documentation':
        navigate('/documentation');
        break;
      case 'login':
        navigate('/login');
        break;
      default:
        navigate('/');
    }
  };

  const handleSelectSession = (session: SessionRecord) => {
    setSelectedSession(session);
    navigate('/details');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f9f9ff] text-[#151c27] font-sans antialiased">
      {/* Sticky Top Header (hidden for login, dashboard, history, details, basics, visualization, and documentation which have custom navigation shells) */}
      <Routes>
        {/* Routes with header and footer */}
        <Route
          path="/"
          element={
            <>
              <Header
                activeTab="home"
                setActiveTab={setActiveTab}
                onOpenLogin={() => setIsLoginOpen(true)}
                isLoggedIn={isLoggedIn}
                onLogout={logout}
              />
              <main className="flex-1">
                <HomePage navigate={navigate} />
              </main>
              <Footer setActiveTab={setActiveTab} onOpenLogin={() => setIsLoginOpen(true)} />
            </>
          }
        />

        {/* Routes without header and footer */}
        <Route
  path="/login"
  element={
    <main className="flex-1">
      <LoginPage
        setActiveTab={setActiveTab}
        onLoginSuccess={(user) => {
          login(user);
          navigate("/dashboard");
        }}
      />
    </main>
  }
/>

        <Route
          path="/dashboard"
          element={
            <main className="flex-1">
              <DashboardView setActiveTab={setActiveTab} onSelectSession={handleSelectSession} />
            </main>
          }
        />

        <Route
          path="/history"
          element={
            <main className="flex-1">
              <SessionHistoryView setActiveTab={setActiveTab} onSelectSession={handleSelectSession} />
            </main>
          }
        />

        <Route
          path="/details"
          element={
            <main className="flex-1">
              <SessionDetailsView setActiveTab={setActiveTab} selectedSession={selectedSession} />
            </main>
          }
        />

        <Route
          path="/basics"
          element={
            <main className="flex-1">
              <AESBasics setActiveTab={setActiveTab} />
            </main>
          }
        />

        <Route
          path="/visualization"
          element={
            <main className="flex-1">
              <AESVisualizer setActiveTab={setActiveTab} />
            </main>
          }
        />

        <Route
          path="/documentation"
          element={
            <main className="flex-1">
              <DocumentationView setActiveTab={setActiveTab} />
            </main>
          }
        />
      </Routes>

      {/* Login Modal */}
      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </div>
  );
}
