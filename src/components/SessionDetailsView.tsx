import React, { useState } from 'react';
import { NavigationTab, SessionRecord } from '../types';
import {
  Shield,
  LayoutDashboard,
  PlusCircle,
  History,
  BookOpen,
  Info,
  Settings,
  HelpCircle,
  LogOut,
  Search,
  Bell,
  Eye,
  RotateCcw,
  Trash2,
  Play,
  CheckCircle2,
  Clock,
  BarChart2,
  Menu,
  ChevronLeft,
  ChevronRight,
  X,
  Lightbulb,
  FileQuestion,
  Filter,
  ArrowUpDown,
  Download,
  Key,
  FileText,
  Lock,
  Layers,
  ChevronDown,
  ChevronUp,
  Check,
  Calendar,
  Sparkles,
  ArrowRight,
  Share2,
  Copy,
  ExternalLink,
  Cpu,
  Award,
  Zap,
  HelpCircle as QuestionIcon
} from 'lucide-react';

interface SessionDetailsViewProps {
  setActiveTab: (tab: NavigationTab) => void;
  selectedSession?: SessionRecord | null;
}

export const SessionDetailsView: React.FC<SessionDetailsViewProps> = ({
  setActiveTab,
  selectedSession
}) => {
  // Sidebar state
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Popover / Toast states
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Active round inspector (0 to 10)
  const [activeRound, setActiveRound] = useState<number>(1);

  // Accordion expansion states
  const [expandedTimelineItem, setExpandedTimelineItem] = useState<string | null>('subbytes');
  const [expandedNote, setExpandedNote] = useState<string | null>('plaintext-flow');

  // Fallback default session if none passed
  const session: SessionRecord = selectedSession || {
    id: '#AES-8492',
    date: 'Oct 24, 2023',
    timestamp: '2023-10-24 14:32:05',
    variant: 'AES-128',
    status: 'Completed',
    duration: '2m 15s',
    lastStage: 'Final Ciphertext',
    plaintext: 'HELLO AES WORLD 12',
    plaintextHex: '48 45 4C 4C 4F 20 41 45 53 20 57 4F 52 4C 44 31',
    key: 'SECRET KEY 123456',
    keyHex: '53 45 43 52 45 54 20 4B 45 59 20 31 32 33 34 35',
    ciphertextHex: '29 C3 50 5F 57 14 20 F6 40 22 99 B3 1A 02 D7 3A',
    roundsCompleted: 10,
    totalRounds: 10
  };

  // Helper function for copy toast
  const handleCopyText = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    triggerToast(`Copied ${label} to clipboard!`);
  };

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Simulated PDF Download
  const handleDownloadPDF = () => {
    triggerToast('Generating session PDF report... Download started!');
  };

  // Sample Round Data Generator for Round Inspector
  const getRoundDetails = (roundNum: number) => {
    if (roundNum === 0) {
      return {
        roundTitle: 'Round 0: Initial AddRoundKey',
        opsExecuted: ['Key Expansion Generation', 'Bitwise XOR (Plaintext ⊕ Round Key 0)'],
        keyUsedHex: '53 45 43 52 45 54 20 4B 45 59 20 31 32 33 34 35',
        outputMatrix: [
          ['1B', '10', '0F', '1E'],
          ['1C', '74', '04', '0E'],
          ['06', '0B', '35', '00'],
          ['25', '13', '07', '04']
        ],
        summary: 'Plaintext is initially combined with the original master key using XOR logic before round iterations begin.'
      };
    } else if (roundNum === 10) {
      return {
        roundTitle: 'Round 10: Final Round (No MixColumns)',
        opsExecuted: ['SubBytes (S-Box Lookup)', 'ShiftRows (Cyclic Row Shift)', 'AddRoundKey (⊕ Round Key 10)'],
        keyUsedHex: 'AC 19 28 D4 72 E1 05 FB 90 31 88 4A 12 EF 7C 90',
        outputMatrix: [
          ['29', '57', '40', '1A'],
          ['C3', '14', '22', '02'],
          ['50', '20', '99', 'D7'],
          ['5F', 'F6', 'B3', '3A']
        ],
        summary: 'MixColumns step is omitted in the final round to ensure encryption and decryption processes remain perfectly symmetrical.'
      };
    } else {
      return {
        roundTitle: `Round ${roundNum}: Standard Transformation Iteration`,
        opsExecuted: [
          'SubBytes (Non-linear S-Box substitution)',
          'ShiftRows (Permute row bytes left)',
          'MixColumns (Galois Field GF(2^8) matrix multiplication)',
          'AddRoundKey (⊕ Round Key ' + roundNum + ')'
        ],
        keyUsedHex: `2F ${roundNum}A 8B 12 4C 9D 00 1F E4 55 90 ${roundNum}C 88 1A 3B 7F`,
        outputMatrix: [
          [`A${roundNum}`, '4F', '82', '1C'],
          ['3B', `D${roundNum}`, '90', 'E4'],
          ['55', '1A', `F${roundNum}`, '03'],
          ['77', 'C8', '11', `B${roundNum}`]
        ],
        summary: `Standard AES round #${roundNum} applying substitution, transposition, polynomial diffusion, and key mixing.`
      };
    }
  };

  const currentRoundData = getRoundDetails(activeRound);

  return (
    <div className="min-h-screen bg-[#f9f9ff] text-[#151c27] flex flex-col md:flex-row font-sans relative">
      
      {/* TOAST NOTIFICATION OVERLAY */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#142380] text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 text-xs font-bold animate-in fade-in slide-in-from-bottom-4">
          <Sparkles className="w-4 h-4 text-[#ff9a5b]" />
          <span>{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="ml-2 hover:opacity-80">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* ================= 1. LEFT SIDEBAR NAVIGATION (DESKTOP) ================= */}
      <aside
        className={`hidden md:flex flex-col bg-white border-r border-[#D9DDE7] sticky top-0 h-screen z-40 shrink-0 justify-between py-6 transition-all duration-300 shadow-xs ${
          isSidebarCollapsed ? 'w-20 px-3' : 'w-64 px-4'
        }`}
      >
        <div className="space-y-6">
          {/* Brand Logo & Collapse Toggle */}
          <div className="flex items-center justify-between px-1">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center gap-3 py-2 text-left group cursor-pointer ${
                isSidebarCollapsed ? 'justify-center w-full' : 'min-w-0'
              }`}
              title="AES Visualizer Dashboard"
            >
              <div className="w-10 h-10 rounded-xl bg-[#142380] text-white flex items-center justify-center shadow-md group-hover:bg-[#2f3c97] transition-colors shrink-0">
                <Shield className="w-5 h-5 fill-white" />
              </div>
              {!isSidebarCollapsed && (
                <div className="min-w-0">
                  <h1 className="text-base font-extrabold text-[#142380] leading-tight truncate">
                    AES Visualizer
                  </h1>
                  <p className="text-[11px] font-semibold text-[#767683] uppercase tracking-wider truncate">
                    Premium Learning Lab
                  </p>
                </div>
              )}
            </button>

            {/* Desktop Sidebar Collapse Toggle */}
            {!isSidebarCollapsed && (
              <button
                onClick={() => setIsSidebarCollapsed(true)}
                className="p-1.5 text-[#767683] hover:text-[#142380] hover:bg-[#f0f3ff] rounded-xl transition-colors cursor-pointer shrink-0"
                title="Collapse Sidebar"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Navigation Items */}
          <nav className="space-y-1.5 pt-2">
            <button
              onClick={() => setActiveTab('dashboard')}
              title="Dashboard"
              className={`w-full flex items-center rounded-xl font-bold text-xs sm:text-sm text-[#454652] hover:bg-[#f0f3ff] hover:text-[#142380] transition-all cursor-pointer ${
                isSidebarCollapsed ? 'justify-center p-3' : 'px-4 py-3 gap-3'
              }`}
            >
              <LayoutDashboard className="w-5 h-5 shrink-0" />
              {!isSidebarCollapsed && <span>Dashboard</span>}
            </button>

            <button
              onClick={() => setActiveTab('visualization')}
              title="New Visualization"
              className={`w-full flex items-center rounded-xl font-bold text-xs sm:text-sm text-[#454652] hover:bg-[#f0f3ff] hover:text-[#142380] transition-all cursor-pointer ${
                isSidebarCollapsed ? 'justify-center p-3' : 'px-4 py-3 gap-3'
              }`}
            >
              <PlusCircle className="w-5 h-5 shrink-0 text-[#96490d]" />
              {!isSidebarCollapsed && <span>New Visualization</span>}
            </button>

            <button
              onClick={() => setActiveTab('history')}
              title="Session History"
              className={`w-full flex items-center rounded-xl font-bold text-xs sm:text-sm text-[#454652] hover:bg-[#f0f3ff] hover:text-[#142380] transition-all cursor-pointer ${
                isSidebarCollapsed ? 'justify-center p-3' : 'px-4 py-3 gap-3'
              }`}
            >
              <History className="w-5 h-5 shrink-0" />
              {!isSidebarCollapsed && <span>Session History</span>}
            </button>

            <button
              onClick={() => setActiveTab('basics')}
              title="Learning Center"
              className={`w-full flex items-center rounded-xl font-bold text-xs sm:text-sm text-[#454652] hover:bg-[#f0f3ff] hover:text-[#142380] transition-all cursor-pointer ${
                isSidebarCollapsed ? 'justify-center p-3' : 'px-4 py-3 gap-3'
              }`}
            >
              <BookOpen className="w-5 h-5 shrink-0" />
              {!isSidebarCollapsed && <span>Learning Center</span>}
            </button>

            <button
              onClick={() => setActiveTab('documentation')}
              title="About AES"
              className={`w-full flex items-center rounded-xl font-bold text-xs sm:text-sm text-[#454652] hover:bg-[#f0f3ff] hover:text-[#142380] transition-all cursor-pointer ${
                isSidebarCollapsed ? 'justify-center p-3' : 'px-4 py-3 gap-3'
              }`}
            >
              <Info className="w-5 h-5 shrink-0" />
              {!isSidebarCollapsed && <span>About AES</span>}
            </button>
          </nav>
        </div>

        {/* Footer Sidebar Actions */}
        <div className="space-y-3 pt-4 border-t border-[#D9DDE7]">
          <button
            onClick={() => setActiveTab('dashboard')}
            title="Settings"
            className={`w-full flex items-center rounded-xl font-semibold text-xs sm:text-sm text-[#454652] hover:bg-[#f0f3ff] hover:text-[#142380] transition-all cursor-pointer ${
              isSidebarCollapsed ? 'justify-center p-2.5' : 'px-4 py-2.5 gap-3'
            }`}
          >
            <Settings className="w-4 h-4 text-[#767683] shrink-0" />
            {!isSidebarCollapsed && <span>Settings</span>}
          </button>

          <button
            onClick={() => setActiveTab('basics')}
            title="Help & FAQ"
            className={`w-full flex items-center rounded-xl font-semibold text-xs sm:text-sm text-[#454652] hover:bg-[#f0f3ff] hover:text-[#142380] transition-all cursor-pointer ${
              isSidebarCollapsed ? 'justify-center p-2.5' : 'px-4 py-2.5 gap-3'
            }`}
          >
            <HelpCircle className="w-4 h-4 text-[#767683] shrink-0" />
            {!isSidebarCollapsed && <span>Help & FAQ</span>}
          </button>

          {/* User Profile Badge */}
          {isSidebarCollapsed ? (
            <div className="flex justify-center p-1 mt-2" title="Prof. Alan Turing (Instructor)">
              <div className="w-9 h-9 rounded-xl bg-[#142380] text-white flex items-center justify-center font-extrabold text-xs shadow-xs cursor-pointer">
                AT
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3 p-3 bg-[#F7F8FC] rounded-2xl border border-[#D9DDE7] mt-2">
              <div className="w-9 h-9 rounded-xl bg-[#142380] text-white flex items-center justify-center font-extrabold text-xs shrink-0 shadow-xs">
                AT
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-[#151c27] truncate">Prof. Alan Turing</p>
                <p className="text-[10px] text-[#767683] font-semibold truncate">Instructor</p>
              </div>
              <button
                onClick={() => setActiveTab('login')}
                title="Logout"
                className="p-1.5 text-[#767683] hover:text-[#EF4444] rounded-lg hover:bg-white transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* MOBILE SIDEBAR DRAWER OVERLAY */}
      {mobileSidebarOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex">
          <div className="w-72 bg-white h-full p-6 flex flex-col justify-between shadow-2xl animate-in slide-in-from-left">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#142380] text-white flex items-center justify-center font-bold">
                    <Shield className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="font-extrabold text-[#142380] text-base">AES Visualizer</h2>
                    <p className="text-[10px] text-[#767683] font-semibold">Session Details</p>
                  </div>
                </div>
                <button
                  onClick={() => setMobileSidebarOpen(false)}
                  className="p-2 text-[#454652] hover:bg-[#f0f3ff] rounded-xl"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="space-y-2">
                <button
                  onClick={() => { setActiveTab('dashboard'); setMobileSidebarOpen(false); }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[#454652] font-bold text-sm hover:bg-[#f0f3ff]"
                >
                  <LayoutDashboard className="w-5 h-5" />
                  <span>Dashboard</span>
                </button>
                <button
                  onClick={() => { setActiveTab('visualization'); setMobileSidebarOpen(false); }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[#454652] font-bold text-sm hover:bg-[#f0f3ff]"
                >
                  <PlusCircle className="w-5 h-5 text-[#96490d]" />
                  <span>New Visualization</span>
                </button>
                <button
                  onClick={() => { setActiveTab('history'); setMobileSidebarOpen(false); }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[#454652] font-bold text-sm hover:bg-[#f0f3ff]"
                >
                  <History className="w-5 h-5" />
                  <span>Session History</span>
                </button>
                <button
                  onClick={() => { setActiveTab('basics'); setMobileSidebarOpen(false); }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[#454652] font-bold text-sm hover:bg-[#f0f3ff]"
                >
                  <BookOpen className="w-5 h-5" />
                  <span>Learning Center</span>
                </button>
              </nav>
            </div>

            <div className="pt-4 border-t border-[#D9DDE7] space-y-3">
              <button
                onClick={() => { setActiveTab('login'); setMobileSidebarOpen(false); }}
                className="w-full flex items-center gap-3 px-4 py-2 text-[#EF4444] font-bold text-sm"
              >
                <LogOut className="w-4 h-4" />
                <span>Log Out</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= 2. MAIN CONTENT AREA ================= */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        
        {/* TOP HEADER BAR */}
        <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-[#D9DDE7] px-4 sm:px-8 py-4 flex items-center justify-between gap-4 shadow-xs">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            {/* Mobile Hamburger Drawer Toggle */}
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="md:hidden p-2 text-[#454652] hover:bg-[#f0f3ff] rounded-xl cursor-pointer"
              title="Open Navigation Menu"
            >
              <Menu className="w-5 h-5 text-[#142380]" />
            </button>

            {/* Desktop Hamburger Sidebar Toggle */}
            <button
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="hidden md:flex p-2 text-[#142380] hover:bg-[#f0f3ff] rounded-xl transition-colors cursor-pointer"
              title={isSidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Search Input */}
            <div className="relative w-full max-w-md">
              <Search className="w-4 h-4 text-[#767683] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search session parameters..."
                className="w-full bg-[#F7F8FC] border border-[#D9DDE7] focus:border-[#142380] focus:bg-white text-[#151c27] text-xs sm:text-sm pl-10 pr-4 py-2.5 rounded-2xl outline-none transition-all font-medium"
              />
            </div>
          </div>

          {/* Right Header Controls */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Notification Popover */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2.5 bg-[#F7F8FC] hover:bg-[#e7eefe] text-[#142380] rounded-2xl border border-[#D9DDE7] transition-all relative cursor-pointer"
                title="Notifications"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-[#96490d] rounded-full border-2 border-white animate-pulse" />
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white border border-[#D9DDE7] rounded-3xl shadow-xl p-4 z-50 animate-in fade-in zoom-in-95 space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-[#f0f3ff]">
                    <h4 className="text-xs font-extrabold text-[#151c27] uppercase tracking-wider">Session Notifications</h4>
                    <span className="text-[10px] font-bold text-[#005221] bg-[#e8f8ee] px-2 py-0.5 rounded-full">Report Ready</span>
                  </div>
                  <div className="p-2.5 bg-[#F7F8FC] rounded-xl border border-[#D9DDE7]/50 space-y-0.5">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-[#142380]">Session #{session.id} Verified</span>
                      <span className="text-[10px] text-[#767683]">Just now</span>
                    </div>
                    <p className="text-[11px] text-[#454652]">Full 10-round transformation report generated.</p>
                  </div>
                </div>
              )}
            </div>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                className="flex items-center gap-2.5 p-1.5 pr-3 bg-[#F7F8FC] hover:bg-[#e7eefe] border border-[#D9DDE7] rounded-2xl transition-all cursor-pointer"
              >
                <div className="w-8 h-8 rounded-xl bg-[#142380] text-white flex items-center justify-center font-extrabold text-xs shadow-xs">
                  AT
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-xs font-bold text-[#151c27] leading-tight">Prof. Alan Turing</p>
                </div>
                <ChevronDown className="w-4 h-4 text-[#767683]" />
              </button>

              {showProfileDropdown && (
                <div className="absolute right-0 mt-2 w-56 bg-white border border-[#D9DDE7] rounded-2xl shadow-xl p-2 z-50 space-y-1 animate-in fade-in">
                  <div className="px-3 py-2 border-b border-[#f0f3ff]">
                    <p className="text-xs font-bold text-[#151c27]">Prof. Alan Turing</p>
                    <p className="text-[10px] text-[#767683]">turing@university.edu</p>
                  </div>
                  <button
                    onClick={() => { setActiveTab('dashboard'); setShowProfileDropdown(false); }}
                    className="w-full text-left px-3 py-2 text-xs font-semibold text-[#454652] hover:bg-[#f0f3ff] hover:text-[#142380] rounded-xl flex items-center gap-2 cursor-pointer"
                  >
                    <Settings className="w-4 h-4 text-[#767683]" />
                    <span>Dashboard Preferences</span>
                  </button>
                  <div className="pt-1 border-t border-[#f0f3ff]">
                    <button
                      onClick={() => setActiveTab('login')}
                      className="w-full text-left px-3 py-2 text-xs font-bold text-[#EF4444] hover:bg-red-50 rounded-xl flex items-center gap-2 cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Log Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* CANVAS WORKSPACE */}
        <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl mx-auto w-full">

          {/* ================= 3. PAGE HEADER & TOP ACTIONS ================= */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#D9DDE7] pb-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-extrabold text-[#142380]">
                <button
                  onClick={() => setActiveTab('history')}
                  className="hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>Session History</span>
                </button>
                <span className="text-[#767683]">•</span>
                <span className="text-[#767683] font-mono">{session.id}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#151c27] tracking-tight">
                Session Details
              </h1>
              <p className="text-xs sm:text-sm text-[#454652] leading-relaxed">
                Review every step performed during this AES encryption visualization.
              </p>
            </div>

            {/* Header Right Actions */}
            <div className="flex flex-wrap items-center gap-2.5">
              <button
                onClick={() => setActiveTab('history')}
                className="px-4 py-2.5 bg-white border border-[#D9DDE7] hover:bg-[#f0f3ff] text-[#151c27] text-xs font-bold rounded-xl flex items-center gap-2 transition-all cursor-pointer shadow-xs"
              >
                <ChevronLeft className="w-4 h-4 text-[#767683]" />
                <span>Back</span>
              </button>

              <button
                onClick={handleDownloadPDF}
                className="px-4 py-2.5 bg-white border border-[#142380] hover:bg-[#e7eefe] text-[#142380] text-xs font-extrabold rounded-xl flex items-center gap-2 transition-all cursor-pointer shadow-xs"
              >
                <Download className="w-4 h-4" />
                <span>PDF Report</span>
              </button>

              <button
                onClick={() => setActiveTab('visualization')}
                className="px-5 py-2.5 bg-[#142380] hover:bg-[#2f3c97] text-white text-xs font-extrabold rounded-xl flex items-center gap-2 transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-md"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>Replay</span>
              </button>
            </div>
          </div>

          {/* ================= 4. SESSION INFORMATION GRID ================= */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            {/* Card 1: Session ID */}
            <div className="bg-white border border-[#D9DDE7] p-4 rounded-2xl shadow-xs space-y-1">
              <span className="text-[10px] font-extrabold text-[#767683] uppercase tracking-wider block">Session ID</span>
              <span className="text-sm font-extrabold text-[#142380] font-mono block truncate">{session.id}</span>
            </div>

            {/* Card 2: User Name */}
            <div className="bg-white border border-[#D9DDE7] p-4 rounded-2xl shadow-xs space-y-1">
              <span className="text-[10px] font-extrabold text-[#767683] uppercase tracking-wider block">User</span>
              <span className="text-xs font-extrabold text-[#151c27] block truncate">Prof. Alan Turing</span>
            </div>

            {/* Card 3: Date & Time */}
            <div className="bg-white border border-[#D9DDE7] p-4 rounded-2xl shadow-xs space-y-1">
              <span className="text-[10px] font-extrabold text-[#767683] uppercase tracking-wider block">Date</span>
              <span className="text-xs font-bold text-[#151c27] block truncate">{session.date}</span>
            </div>

            {/* Card 4: AES Variant */}
            <div className="bg-white border border-[#D9DDE7] p-4 rounded-2xl shadow-xs space-y-1">
              <span className="text-[10px] font-extrabold text-[#767683] uppercase tracking-wider block">Variant</span>
              <span className="text-xs font-extrabold text-[#96490d] block">{session.variant}</span>
            </div>

            {/* Card 5: Key Length */}
            <div className="bg-white border border-[#D9DDE7] p-4 rounded-2xl shadow-xs space-y-1">
              <span className="text-[10px] font-extrabold text-[#767683] uppercase tracking-wider block">Key Length</span>
              <span className="text-xs font-bold text-[#151c27] block">
                {session.variant === 'AES-256' ? '256-bit (32B)' : session.variant === 'AES-192' ? '192-bit (24B)' : '128-bit (16B)'}
              </span>
            </div>

            {/* Card 6: Encryption Status */}
            <div className="bg-white border border-[#D9DDE7] p-4 rounded-2xl shadow-xs space-y-1">
              <span className="text-[10px] font-extrabold text-[#767683] uppercase tracking-wider block">Status</span>
              <span className="text-xs font-extrabold text-[#005221] flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#005221]" />
                <span>{session.status}</span>
              </span>
            </div>

            {/* Card 7: Duration */}
            <div className="bg-white border border-[#D9DDE7] p-4 rounded-2xl shadow-xs space-y-1">
              <span className="text-[10px] font-extrabold text-[#767683] uppercase tracking-wider block">Duration</span>
              <span className="text-xs font-bold text-[#151c27] block">{session.duration}</span>
            </div>

            {/* Card 8: Total Rounds */}
            <div className="bg-white border border-[#D9DDE7] p-4 rounded-2xl shadow-xs space-y-1">
              <span className="text-[10px] font-extrabold text-[#767683] uppercase tracking-wider block">Rounds</span>
              <span className="text-xs font-extrabold text-[#142380] block">
                {session.totalRounds || 10} Rounds
              </span>
            </div>
          </div>

          {/* ================= 5. ENCRYPTION OVERVIEW (PROCESS FLOW) ================= */}
          <div className="bg-white border border-[#D9DDE7] rounded-3xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-[#142380]" />
                <h3 className="text-base font-extrabold text-[#151c27]">Encryption Overview (Process Flow)</h3>
              </div>
              <span className="text-xs font-bold text-[#005221] bg-[#e8f8ee] px-3 py-1 rounded-full flex items-center gap-1">
                <Check className="w-3.5 h-3.5" />
                <span>All 8 Stages Executed</span>
              </span>
            </div>

            {/* Horizontal Stage Pipeline */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 pt-2">
              {[
                { step: '01', title: 'Plaintext', desc: '128-bit Block' },
                { step: '02', title: 'Key Expansion', desc: '11 Round Keys' },
                { step: '03', title: 'State Matrix', desc: '4x4 Byte Grid' },
                { step: '04', title: 'SubBytes', desc: 'S-Box Lookup' },
                { step: '05', title: 'ShiftRows', desc: 'Cyclic Permute' },
                { step: '06', title: 'MixColumns', desc: 'GF(2^8) Matrix' },
                { step: '07', title: 'AddRoundKey', desc: 'XOR Key Mix' },
                { step: '08', title: 'Ciphertext', desc: 'Final 16 Bytes' }
              ].map((stage, idx) => (
                <div
                  key={stage.step}
                  className="bg-[#F7F8FC] border border-[#D9DDE7] p-3 rounded-2xl relative text-center space-y-1 group hover:border-[#142380] transition-colors"
                >
                  <div className="w-5 h-5 rounded-full bg-[#142380] text-white text-[10px] font-bold mx-auto flex items-center justify-center">
                    {stage.step}
                  </div>
                  <h4 className="text-xs font-extrabold text-[#151c27] leading-tight">{stage.title}</h4>
                  <p className="text-[10px] text-[#767683] font-semibold">{stage.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ================= 6. INPUT VS OUTPUT COMPARISON ================= */}
          <div className="bg-white border border-[#D9DDE7] rounded-3xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-extrabold text-[#151c27] flex items-center gap-2">
                <Lock className="w-5 h-5 text-[#142380]" />
                <span>Transformation Result (Input vs Output)</span>
              </h3>
              <span className="text-xs text-[#767683] font-semibold">128-bit Symmetric Block Transformation</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-11 gap-4 items-center">
              {/* Left Input Card */}
              <div className="md:col-span-5 bg-[#F7F8FC] border border-[#D9DDE7] p-5 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-[#151c27] uppercase tracking-wider flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-[#767683]" />
                    <span>Original Plaintext</span>
                  </span>
                  <button
                    onClick={() => handleCopyText(session.plaintextHex || '', 'Plaintext Hex')}
                    className="text-[11px] font-bold text-[#142380] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Copy className="w-3 h-3" />
                    <span>Copy Hex</span>
                  </button>
                </div>

                <div className="space-y-1">
                  <p className="text-xs text-[#767683] font-semibold">ASCII Representation:</p>
                  <div className="p-2.5 bg-white rounded-xl border border-[#D9DDE7] font-bold text-xs text-[#151c27]">
                    "{session.plaintext}"
                  </div>
                </div>

                <div className="space-y-1">
                  <p className="text-xs text-[#767683] font-semibold">16-Byte Hexadecimal Matrix Input:</p>
                  <div className="p-3 bg-white rounded-xl border border-[#D9DDE7] font-mono text-xs text-[#142380] font-extrabold break-all leading-relaxed">
                    {session.plaintextHex}
                  </div>
                </div>
              </div>

              {/* Transformation Arrow Center */}
              <div className="md:col-span-1 flex flex-col items-center justify-center space-y-1 py-2">
                <div className="w-10 h-10 rounded-full bg-[#e7eefe] text-[#142380] flex items-center justify-center shadow-xs">
                  <ArrowRight className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-extrabold text-[#767683] uppercase tracking-wider text-center">10 Rounds</span>
              </div>

              {/* Right Output Card */}
              <div className="md:col-span-5 bg-[#e8f8ee]/40 border border-[#005221]/30 p-5 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-[#005221] uppercase tracking-wider flex items-center gap-1.5">
                    <Lock className="w-4 h-4 text-[#005221]" />
                    <span>Final Ciphertext</span>
                  </span>
                  <button
                    onClick={() => handleCopyText(session.ciphertextHex || '', 'Ciphertext Hex')}
                    className="text-[11px] font-bold text-[#005221] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Copy className="w-3 h-3" />
                    <span>Copy Hex</span>
                  </button>
                </div>

                <div className="space-y-1">
                  <p className="text-xs text-[#005221] font-semibold">Ciphertext State Output:</p>
                  <div className="p-2.5 bg-white rounded-xl border border-[#005221]/20 font-bold text-xs text-[#005221]">
                    Encrypted High-Entropy Block
                  </div>
                </div>

                <div className="space-y-1">
                  <p className="text-xs text-[#005221] font-semibold">16-Byte Hexadecimal Matrix Output:</p>
                  <div className="p-3 bg-white rounded-xl border border-[#005221]/20 font-mono text-xs text-[#005221] font-extrabold break-all leading-relaxed">
                    {session.ciphertextHex}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ================= 7. MAIN WORKSPACE: TIMELINE & INTERACTIVE ROUND INSPECTOR ================= */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* LEFT: EXPANDABLE AES TRANSFORMATIONS TIMELINE (7 COLS) */}
            <div className="lg:col-span-7 space-y-6">
              <div className="bg-white border border-[#D9DDE7] rounded-3xl p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-extrabold text-[#151c27]">AES Transformation Timeline</h3>
                    <p className="text-xs text-[#767683]">Click any stage to expand matrix snapshots and cryptographic details</p>
                  </div>
                  <span className="text-xs font-bold text-[#142380] bg-[#e7eefe] px-3 py-1 rounded-full">
                    Complete Trace
                  </span>
                </div>

                {/* Vertical Timeline Items */}
                <div className="space-y-3 pt-2">
                  {[
                    {
                      id: 'state-init',
                      title: '1. State Matrix Initialization',
                      subtitle: 'Plaintext 16-byte block mapped into 4x4 column-major matrix',
                      content: 'The 128-bit input block is loaded into a 4x4 state matrix in column-major order: state[row][col] = byte[row + 4*col]. This allows vectorized polynomial matrix operations in finite field GF(2^8).'
                    },
                    {
                      id: 'key-expand',
                      title: '2. Key Expansion & Schedule Generation',
                      subtitle: 'Master key expanded into 11 distinct round keys (44 words / 176 bytes)',
                      content: 'Rijndael key schedule algorithm uses RotWord, SubWord, and Round Constant (Rcon) XOR addition to generate 11 round keys K0 through K10 for AES-128, preventing slide attacks.'
                    },
                    {
                      id: 'addroundkey0',
                      title: '3. Initial AddRoundKey (Round 0)',
                      subtitle: 'Bitwise XOR addition between initial State Matrix and Round Key 0',
                      content: 'State Matrix ⊕ Key 0 ensures that plaintext is immediately randomized before any non-linear substitutions take place. Without this step, an attacker could invert S-Box transformations directly.'
                    },
                    {
                      id: 'subbytes',
                      title: '4. SubBytes Transformation (Rounds 1 - 10)',
                      subtitle: 'Non-linear byte substitution using 16x16 Substitution Box (S-Box)',
                      content: 'Every byte in the State Matrix is independently replaced with a value from the Rijndael S-Box, constructed by finding the multiplicative inverse in GF(2^8) followed by an affine transformation over GF(2).'
                    },
                    {
                      id: 'shiftrows',
                      title: '5. ShiftRows Permutation (Rounds 1 - 10)',
                      subtitle: 'Cyclic byte shifts across rows (Row 0: 0, Row 1: 1, Row 2: 2, Row 3: 3)',
                      content: 'Row 0 remains unchanged, Row 1 shifts 1 byte left, Row 2 shifts 2 bytes left, and Row 3 shifts 3 bytes left. This provides inter-column transposition diffusion across state boundaries.'
                    },
                    {
                      id: 'mixcolumns',
                      title: '6. MixColumns Galois Field Matrix Multiplication (Rounds 1 - 9)',
                      subtitle: 'Multiplication over GF(2^8) modulo x^8 + x^4 + x^3 + x + 1',
                      content: 'Each column of the State Matrix is treated as a four-term polynomial and multiplied modulo x^4 + 1 with a fixed matrix [[02, 03, 01, 01], [01, 02, 03, 01], [01, 01, 02, 03], [03, 01, 01, 02]]. Omitted in Round 10.'
                    },
                    {
                      id: 'final-round',
                      title: '7. Final Round & Ciphertext Generation',
                      subtitle: 'Round 10 execution producing final 128-bit ciphertext block',
                      content: 'Applies SubBytes → ShiftRows → AddRoundKey (Round Key 10). The resulting 4x4 matrix is unpacked column-by-column into a 16-byte hex array representing the final encrypted output.'
                    }
                  ].map((item) => {
                    const isExpanded = expandedTimelineItem === item.id;
                    return (
                      <div
                        key={item.id}
                        className="bg-[#F7F8FC] border border-[#D9DDE7] rounded-2xl overflow-hidden transition-all"
                      >
                        <button
                          onClick={() => setExpandedTimelineItem(isExpanded ? null : item.id)}
                          className="w-full p-4 text-left flex items-center justify-between gap-3 hover:bg-[#e7eefe]/50 transition-colors cursor-pointer"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-xl bg-[#142380] text-white flex items-center justify-center font-extrabold text-xs shrink-0">
                              <Check className="w-4 h-4" />
                            </div>
                            <div>
                              <h4 className="text-xs font-extrabold text-[#151c27]">{item.title}</h4>
                              <p className="text-[11px] text-[#767683] font-medium">{item.subtitle}</p>
                            </div>
                          </div>
                          {isExpanded ? (
                            <ChevronUp className="w-4 h-4 text-[#767683]" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-[#767683]" />
                          )}
                        </button>

                        {isExpanded && (
                          <div className="p-4 pt-0 border-t border-[#D9DDE7]/60 bg-white space-y-3 text-xs text-[#454652] leading-relaxed animate-in fade-in">
                            <p className="pt-3 font-medium">{item.content}</p>
                            
                            {/* Matrix Snapshot Placeholder */}
                            <div className="p-3 bg-[#F7F8FC] rounded-xl border border-[#D9DDE7] space-y-2">
                              <span className="text-[10px] font-extrabold text-[#142380] uppercase tracking-wider block">
                                Stage Matrix Snapshot Preview
                              </span>
                              <div className="grid grid-cols-4 gap-1.5 font-mono text-[11px] font-extrabold text-center max-w-xs">
                                {['48', '45', '4C', '4C', '4F', '20', '41', '45', '53', '20', '57', '4F', '52', '4C', '44', '31'].map((b, i) => (
                                  <div key={i} className="bg-white p-1.5 rounded border border-[#D9DDE7] text-[#142380]">
                                    {b}
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* RIGHT: INTERACTIVE ROUND SUMMARY & NAVIGATOR (5 COLS) */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* ROUND INSPECTOR CARD */}
              <div className="bg-white border border-[#D9DDE7] rounded-3xl p-6 shadow-xs space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-[#f0f3ff]">
                  <div>
                    <h3 className="text-base font-extrabold text-[#151c27]">Round Inspector</h3>
                    <p className="text-xs text-[#767683]">Select a round to analyze operations & state matrices</p>
                  </div>
                  <span className="text-xs font-mono font-extrabold text-[#142380] bg-[#e7eefe] px-2.5 py-1 rounded-lg">
                    R{activeRound} / 10
                  </span>
                </div>

                {/* Round Selector Buttons */}
                <div className="flex items-center justify-between gap-1 overflow-x-auto pb-1">
                  {Array.from({ length: 11 }, (_, i) => i).map((r) => (
                    <button
                      key={r}
                      onClick={() => setActiveRound(r)}
                      className={`w-8 h-8 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer shrink-0 ${
                        activeRound === r
                          ? 'bg-[#142380] text-white shadow-xs scale-105'
                          : 'bg-[#F7F8FC] border border-[#D9DDE7] text-[#454652] hover:bg-[#e7eefe] hover:text-[#142380]'
                      }`}
                    >
                      R{r}
                    </button>
                  ))}
                </div>

                {/* Round Details Container */}
                <div className="bg-[#F7F8FC] border border-[#D9DDE7] p-4 rounded-2xl space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-extrabold text-[#142380]">{currentRoundData.roundTitle}</h4>
                    <div className="flex items-center gap-1">
                      <button
                        disabled={activeRound === 0}
                        onClick={() => setActiveRound((r) => Math.max(0, r - 1))}
                        className="p-1 rounded-lg border border-[#D9DDE7] bg-white hover:bg-[#f0f3ff] disabled:opacity-40 cursor-pointer"
                      >
                        <ChevronLeft className="w-3.5 h-3.5" />
                      </button>
                      <button
                        disabled={activeRound === 10}
                        onClick={() => setActiveRound((r) => Math.min(10, r + 1))}
                        className="p-1 rounded-lg border border-[#D9DDE7] bg-white hover:bg-[#f0f3ff] disabled:opacity-40 cursor-pointer"
                      >
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Operations Executed List */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-extrabold text-[#767683] uppercase tracking-wider block">
                      Operations Executed in Round {activeRound}:
                    </span>
                    <ul className="space-y-1">
                      {currentRoundData.opsExecuted.map((op, idx) => (
                        <li key={idx} className="text-xs font-semibold text-[#151c27] flex items-center gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#005221] shrink-0" />
                          <span>{op}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Round Key Matrix */}
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[10px] font-extrabold text-[#767683] uppercase tracking-wider block">
                      Round Key #{activeRound} Used (Hex):
                    </span>
                    <div className="p-2.5 bg-white rounded-xl border border-[#D9DDE7] font-mono text-[11px] text-[#96490d] font-bold break-all">
                      {currentRoundData.keyUsedHex}
                    </div>
                  </div>

                  {/* Output State Matrix Grid */}
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[10px] font-extrabold text-[#767683] uppercase tracking-wider block">
                      Output State Matrix (GF(2^8) Grid):
                    </span>
                    <div className="grid grid-cols-4 gap-2 font-mono text-xs font-extrabold text-center">
                      {currentRoundData.outputMatrix.map((row, rIdx) =>
                        row.map((cell, cIdx) => (
                          <div
                            key={`${rIdx}-${cIdx}`}
                            className="bg-white p-2 rounded-xl border border-[#D9DDE7] text-[#142380] shadow-2xs hover:border-[#142380] transition-colors"
                          >
                            {cell}
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Educational Summary */}
                  <div className="p-3 bg-[#e7eefe]/60 rounded-xl border border-[#142380]/20 text-xs text-[#142380] leading-relaxed">
                    <p className="font-semibold">{currentRoundData.summary}</p>
                  </div>
                </div>
              </div>

              {/* SIDEBAR WIDGET: LEARNING ACHIEVEMENT */}
              <div className="bg-gradient-to-br from-[#142380] to-[#2f3c97] text-white rounded-3xl p-6 shadow-md space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center">
                    <Award className="w-5 h-5 text-[#ff9a5b]" />
                  </div>
                  <span className="px-3 py-1 bg-[#ffdbc9] text-[#96490d] text-xs font-extrabold rounded-full">
                    100% Complete
                  </span>
                </div>

                <div className="space-y-1">
                  <h4 className="text-base font-extrabold">Learning Achievement</h4>
                  <p className="text-xs text-white/80 leading-relaxed">
                    You have successfully completed the AES encryption visualization session. All 10 round transformations were verified and stored in Chapter 3 database tables.
                  </p>
                </div>

                <button
                  onClick={() => setActiveTab('basics')}
                  className="w-full py-2.5 bg-white hover:bg-[#f0f3ff] text-[#142380] font-extrabold text-xs rounded-2xl transition-all cursor-pointer shadow-xs flex items-center justify-center gap-2"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Review AES Basics Guide</span>
                </button>
              </div>

            </div>
          </div>

          {/* ================= 8. EDUCATIONAL NOTES (COLLAPSIBLE PANEL) ================= */}
          <div className="bg-white border border-[#D9DDE7] rounded-3xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-[#96490d]" />
                <h3 className="text-base font-extrabold text-[#151c27]">What Happened During This Session?</h3>
              </div>
              <span className="text-xs text-[#767683] font-semibold">Cryptographic Analysis & Explanation</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {[
                {
                  id: 'plaintext-flow',
                  title: 'How Plaintext Became Ciphertext',
                  desc: 'Plaintext bytes passed through 10 rounds of confusion (SubBytes) and diffusion (ShiftRows + MixColumns), creating an avalanche effect where changing 1 bit alters over 50% of output bits.'
                },
                {
                  id: 'key-exp-note',
                  title: 'How Key Expansion Generated Round Keys',
                  desc: 'The original 128-bit key was expanded into 11 round keys using the Rijndael key schedule algorithm with RotWord, SubWord S-Box lookups, and round constant (Rcon) XOR addition.'
                },
                {
                  id: 'transform-imp',
                  title: 'Why Each Transformation Is Necessary',
                  desc: 'SubBytes breaks linear relationships. ShiftRows diffuses byte positions across rows. MixColumns spreads bits across entire columns. AddRoundKey injects secret entropy.'
                },
                {
                  id: 'security-guarantee',
                  title: 'Security & Resistance to Cryptanalysis',
                  desc: 'AES-128 requires 2^128 operations to brute-force. The combination of algebraic operations over GF(2^8) and non-linear S-Boxes protects against differential and linear cryptanalysis.'
                }
              ].map((note) => {
                const isNoteExpanded = expandedNote === note.id;
                return (
                  <div
                    key={note.id}
                    className="p-4 bg-[#F7F8FC] border border-[#D9DDE7] rounded-2xl space-y-2 hover:border-[#142380] transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-extrabold text-[#142380]">{note.title}</h4>
                      <button
                        onClick={() => setExpandedNote(isNoteExpanded ? null : note.id)}
                        className="text-[#767683] hover:text-[#142380] cursor-pointer"
                      >
                        {isNoteExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                    </div>
                    <p className="text-xs text-[#454652] leading-relaxed font-medium">
                      {note.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ================= 9. SESSION STATISTICS CARDS ================= */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="bg-white border border-[#D9DDE7] p-4 rounded-2xl shadow-xs space-y-1">
              <span className="text-[10px] font-extrabold text-[#767683] uppercase tracking-wider block">Total Operations</span>
              <span className="text-lg font-extrabold text-[#151c27]">160 S-Box Lookups</span>
            </div>

            <div className="bg-white border border-[#D9DDE7] p-4 rounded-2xl shadow-xs space-y-1">
              <span className="text-[10px] font-extrabold text-[#767683] uppercase tracking-wider block">Total Rounds</span>
              <span className="text-lg font-extrabold text-[#142380]">10 Full Rounds</span>
            </div>

            <div className="bg-white border border-[#D9DDE7] p-4 rounded-2xl shadow-xs space-y-1">
              <span className="text-[10px] font-extrabold text-[#767683] uppercase tracking-wider block">Round Keys</span>
              <span className="text-lg font-extrabold text-[#151c27]">11 Keys (44 Words)</span>
            </div>

            <div className="bg-white border border-[#D9DDE7] p-4 rounded-2xl shadow-xs space-y-1">
              <span className="text-[10px] font-extrabold text-[#767683] uppercase tracking-wider block">Processing Time</span>
              <span className="text-lg font-extrabold text-[#005221]">{session.duration}</span>
            </div>

            <div className="bg-white border border-[#D9DDE7] p-4 rounded-2xl shadow-xs space-y-1">
              <span className="text-[10px] font-extrabold text-[#767683] uppercase tracking-wider block">Bytes Encrypted</span>
              <span className="text-lg font-extrabold text-[#151c27]">16 Bytes (128 bits)</span>
            </div>

            <div className="bg-white border border-[#D9DDE7] p-4 rounded-2xl shadow-xs space-y-1">
              <span className="text-[10px] font-extrabold text-[#767683] uppercase tracking-wider block">Visualization</span>
              <span className="text-lg font-extrabold text-[#005221]">100% Complete</span>
            </div>
          </div>

          {/* ================= 10. BOTTOM ACTION PANEL ================= */}
          <div className="bg-white border border-[#D9DDE7] rounded-3xl p-6 shadow-xs flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-0.5">
              <h4 className="text-sm font-extrabold text-[#151c27]">Ready to continue learning or test new inputs?</h4>
              <p className="text-xs text-[#767683]">Replay this visualization, export the full PDF report, or start a new encryption experiment.</p>
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
              <button
                onClick={() => handleCopyText(window.location.href, 'Session Share Link')}
                className="px-4 py-3 bg-[#F7F8FC] border border-[#D9DDE7] hover:bg-[#f0f3ff] text-[#151c27] font-bold text-xs rounded-2xl transition-all cursor-pointer flex items-center justify-center gap-2 flex-1 sm:flex-initial"
              >
                <Share2 className="w-4 h-4 text-[#767683]" />
                <span>Share Session</span>
              </button>

              <button
                onClick={handleDownloadPDF}
                className="px-4 py-3 bg-white border border-[#142380] hover:bg-[#e7eefe] text-[#142380] font-extrabold text-xs rounded-2xl transition-all cursor-pointer flex items-center justify-center gap-2 flex-1 sm:flex-initial shadow-xs"
              >
                <Download className="w-4 h-4" />
                <span>Download PDF Report</span>
              </button>

              <button
                onClick={() => setActiveTab('visualization')}
                className="px-6 py-3 bg-[#142380] hover:bg-[#2f3c97] text-white font-extrabold text-xs rounded-2xl transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-md flex items-center justify-center gap-2 flex-1 sm:flex-initial"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>Replay Visualization</span>
              </button>
            </div>
          </div>



        </div>
      </main>
    </div>
  );
};
