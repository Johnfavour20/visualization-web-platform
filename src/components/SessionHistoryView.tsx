import React, { useState, useMemo } from 'react';
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
  Check,
  Calendar,
  Sparkles
} from 'lucide-react';

interface SessionHistoryViewProps {
  setActiveTab: (tab: NavigationTab) => void;
  onSelectSession?: (session: SessionRecord) => void;
}

export const SessionHistoryView: React.FC<SessionHistoryViewProps> = ({ setActiveTab, onSelectSession }) => {
  // Sidebar state
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Top header popovers
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [variantFilter, setVariantFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'recent' | 'oldest' | 'duration'>('recent');

  // Modal states
  const [selectedSessionModal, setSelectedSessionModal] = useState<SessionRecord | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  // Initial Chapter 3 Database Session Records
  const [sessions, setSessions] = useState<SessionRecord[]>([
    {
      id: '#AES-8492',
      date: '12 Jul 2026',
      timestamp: '2026-07-12 14:32:05',
      variant: 'AES-128',
      status: 'Completed',
      duration: '2m 15s',
      lastStage: 'Final Ciphertext',
      plaintext: 'HELLO AES WORLD 12',
      plaintextHex: '48 45 4C 4C 4F 20 41 45 53 20 57 4F 52 4C 44 31',
      key: 'SECRET KEY 123456',
      keyHex: '53 45 43 52 45 54 20 4B 45 59 20 31 32 33 34 35',
      ciphertextHex: '4A E8 2F B9 12 88 9F 0D C6 34 2F AE 7C D2 1B 88',
      roundsCompleted: 10,
      totalRounds: 10
    },
    {
      id: '#AES-8491',
      date: '10 Jul 2026',
      timestamp: '2026-07-10 09:15:22',
      variant: 'AES-256',
      status: 'In Progress',
      duration: '1m 05s',
      lastStage: 'MixColumns (Round 4)',
      plaintext: 'TOP SECRET MATRIX DATA',
      plaintextHex: '54 4F 50 20 53 45 43 52 45 54 20 4D 41 54 52 49',
      key: '32_BYTE_MASTER_KEY_AES_256_TEST',
      keyHex: '33 32 5F 42 59 54 45 5F 4D 41 53 54 45 52 5F 4B',
      ciphertextHex: '88 4A D2 1B 9F 7C 0D AE 31 34 B9 2F C6 E8 88 4A',
      roundsCompleted: 4,
      totalRounds: 14
    },
    {
      id: '#AES-8488',
      date: '05 Jul 2026',
      timestamp: '2026-07-05 18:40:11',
      variant: 'AES-128',
      status: 'Completed',
      duration: '3m 40s',
      lastStage: 'Final Ciphertext',
      plaintext: 'CRYPTOGRAPHY 2026 LAB',
      plaintextHex: '43 52 59 50 54 4F 47 52 41 50 48 59 20 32 30 32',
      key: 'UNI_PROJECT_KEY!',
      keyHex: '55 4E 49 5F 50 52 4F 4A 45 43 54 5F 4B 45 59 21',
      ciphertextHex: '12 AE C6 88 4A D2 9F 7C 0D B9 34 2F E8 1B 31 4A',
      roundsCompleted: 10,
      totalRounds: 10
    },
    {
      id: '#AES-8475',
      date: '28 Jun 2026',
      timestamp: '2026-06-28 11:05:44',
      variant: 'AES-192',
      status: 'Completed',
      duration: '2m 50s',
      lastStage: 'Final Ciphertext',
      plaintext: 'FINANCIAL TRANSACTION DATA',
      plaintextHex: '46 49 4E 41 4E 43 49 41 4C 20 54 52 41 4E 53 41',
      key: '24_BYTE_MEDIUM_KEY_12345678',
      keyHex: '32 34 5F 42 59 54 45 5F 4D 45 44 49 55 4D 5F 4B',
      ciphertextHex: 'D2 1B 88 4A 9F 7C 0D AE 31 34 B9 2F C6 E8 88 12',
      roundsCompleted: 12,
      totalRounds: 12
    },
    {
      id: '#AES-8460',
      date: '20 Jun 2026',
      timestamp: '2026-06-20 16:22:10',
      variant: 'AES-128',
      status: 'Draft',
      duration: '0m 45s',
      lastStage: 'AddRoundKey (Round 0)',
      plaintext: 'SAMPLE TEST STRING 99',
      plaintextHex: '53 41 4D 50 4C 45 20 54 45 53 54 20 53 54 52 49',
      key: 'TEST_KEY_DEFAULT',
      keyHex: '54 45 53 54 5F 4B 45 59 5F 44 45 46 41 55 4C 54',
      ciphertextHex: '7C 0D AE 31 34 B9 2F C6 E8 88 12 4A E8 2F B9 9F',
      roundsCompleted: 0,
      totalRounds: 10
    },
    {
      id: '#AES-8452',
      date: '15 Jun 2026',
      timestamp: '2026-06-15 10:11:33',
      variant: 'AES-256',
      status: 'Completed',
      duration: '4m 12s',
      lastStage: 'Final Ciphertext',
      plaintext: 'QUANTUM RESISTANT AES TEST',
      plaintextHex: '51 55 41 4E 54 55 4D 20 52 45 53 49 53 54 41 4E',
      key: 'AES_256_MAX_SECURITY_EXPANDED',
      keyHex: '41 45 53 5F 32 35 36 5F 4D 41 58 5F 53 45 43 55',
      ciphertextHex: 'F9 12 88 C6 34 2F AE 7C D2 1B 88 4A E8 2F B9 0D',
      roundsCompleted: 14,
      totalRounds: 14
    }
  ]);

  // Notifications mock data
  const notificationsList = [
    { id: 1, title: 'Session #AES-8492 Saved', desc: 'Full encryption trace generated and stored.', time: '10m ago' },
    { id: 2, title: 'Session #AES-8491 Updated', desc: 'MixColumns transformation state saved.', time: '1h ago' },
    { id: 3, title: 'Database Sync Complete', desc: 'Chapter 3 local schemas verified.', time: '1d ago' },
  ];

  // Filtering & Sorting Logic
  const filteredAndSortedSessions = useMemo(() => {
    return sessions
      .filter((session) => {
        // Search
        const query = searchQuery.toLowerCase();
        const matchesSearch =
          session.id.toLowerCase().includes(query) ||
          session.plaintext.toLowerCase().includes(query) ||
          session.key.toLowerCase().includes(query) ||
          session.lastStage.toLowerCase().includes(query);

        // Variant Filter
        const matchesVariant = variantFilter === 'ALL' || session.variant === variantFilter;

        // Status Filter
        const matchesStatus = statusFilter === 'ALL' || session.status === statusFilter;

        return matchesSearch && matchesVariant && matchesStatus;
      })
      .sort((a, b) => {
        if (sortBy === 'recent') {
          return new Date(b.timestamp || b.date).getTime() - new Date(a.timestamp || a.date).getTime();
        } else if (sortBy === 'oldest') {
          return new Date(a.timestamp || a.date).getTime() - new Date(b.timestamp || b.date).getTime();
        } else if (sortBy === 'duration') {
          return b.duration.localeCompare(a.duration);
        }
        return 0;
      });
  }, [sessions, searchQuery, variantFilter, statusFilter, sortBy]);

  // Paginated Sessions
  const totalPages = Math.ceil(filteredAndSortedSessions.length / pageSize) || 1;
  const paginatedSessions = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredAndSortedSessions.slice(start, start + pageSize);
  }, [filteredAndSortedSessions, currentPage, pageSize]);

  // Deletion handler
  const handleDeleteSession = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (confirm(`Are you sure you want to delete session ${id}?`)) {
      setSessions((prev) => prev.filter((s) => s.id !== id));
      if (selectedSessionModal?.id === id) {
        setSelectedSessionModal(null);
      }
    }
  };

  // Metrics summary
  const totalSessionsCount = sessions.length;
  const completedSessionsCount = sessions.filter((s) => s.status === 'Completed').length;
  const inProgressSessionsCount = sessions.filter((s) => s.status === 'In Progress').length;

  return (
    <div className="min-h-screen bg-[#f9f9ff] text-[#151c27] flex flex-col md:flex-row font-sans">
      
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
              className={`w-full flex items-center rounded-xl font-bold text-xs sm:text-sm bg-[#142380] text-white shadow-xs transition-all cursor-pointer ${
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
                    <p className="text-[10px] text-[#767683] font-semibold">Session History</p>
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
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-[#142380] text-white font-bold text-sm"
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
                <button
                  onClick={() => { setActiveTab('documentation'); setMobileSidebarOpen(false); }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[#454652] font-bold text-sm hover:bg-[#f0f3ff]"
                >
                  <Info className="w-5 h-5" />
                  <span>About AES</span>
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

            {/* Global Search Bar */}
            <div className="relative w-full max-w-md">
              <Search className="w-4 h-4 text-[#767683] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search sessions, keys, or plaintext..."
                className="w-full bg-[#F7F8FC] border border-[#D9DDE7] focus:border-[#142380] focus:bg-white text-[#151c27] text-xs sm:text-sm pl-10 pr-4 py-2.5 rounded-2xl outline-none transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#767683] hover:text-[#151c27]"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
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
                    <span className="text-[10px] font-bold text-[#005221] bg-[#e8f8ee] px-2 py-0.5 rounded-full">3 New</span>
                  </div>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {notificationsList.map((n) => (
                      <div key={n.id} className="p-2.5 bg-[#F7F8FC] rounded-xl border border-[#D9DDE7]/50 space-y-0.5 hover:bg-[#e7eefe] transition-colors">
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-bold text-[#142380]">{n.title}</span>
                          <span className="text-[10px] text-[#767683]">{n.time}</span>
                        </div>
                        <p className="text-[11px] text-[#454652]">{n.desc}</p>
                      </div>
                    ))}
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

          {/* ================= 3. PAGE HEADER ================= */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#e7eefe] text-[#142380] rounded-full text-xs font-bold mb-1">
                <History className="w-3.5 h-3.5" />
                <span>Chapter 3 Local Database Storage</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#151c27] tracking-tight">
                Session History
              </h1>
              <p className="text-xs sm:text-sm text-[#454652] max-w-2xl leading-relaxed">
                Review previous AES encryption visualizations and continue learning from past sessions.
              </p>
            </div>

            <button
              onClick={() => setActiveTab('visualization')}
              className="px-5 py-3 bg-[#142380] hover:bg-[#2f3c97] text-white font-extrabold text-xs sm:text-sm rounded-2xl shadow-md transition-all hover:scale-105 active:scale-95 flex items-center gap-2 shrink-0 cursor-pointer self-start sm:self-auto"
            >
              <PlusCircle className="w-4 h-4 text-[#ff9a5b]" />
              <span>New Visualization</span>
            </button>
          </div>

          {/* ================= 4. SUMMARY STATISTICS CARDS ================= */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Stat 1: Total Sessions */}
            <div className="bg-white border border-[#D9DDE7] rounded-3xl p-5 shadow-xs flex flex-col justify-between h-32 hover:border-[#142380]/40 transition-all">
              <div className="flex items-center justify-between text-[#767683]">
                <span className="text-[11px] font-extrabold uppercase tracking-wider">Total Sessions</span>
                <div className="w-8 h-8 rounded-xl bg-[#e7eefe] text-[#142380] flex items-center justify-center">
                  <History className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-3xl font-extrabold text-[#151c27]">{totalSessionsCount}</span>
                <span className="text-[10px] font-bold text-[#142380] bg-[#e7eefe] px-2 py-0.5 rounded-full">
                  All Records
                </span>
              </div>
            </div>

            {/* Stat 2: Completed Sessions */}
            <div className="bg-white border border-[#D9DDE7] rounded-3xl p-5 shadow-xs flex flex-col justify-between h-32 hover:border-[#005221]/40 transition-all">
              <div className="flex items-center justify-between text-[#767683]">
                <span className="text-[11px] font-extrabold uppercase tracking-wider">Completed</span>
                <div className="w-8 h-8 rounded-xl bg-[#e8f8ee] text-[#005221] flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-3xl font-extrabold text-[#151c27]">{completedSessionsCount}</span>
                <span className="text-[10px] font-bold text-[#005221] bg-[#e8f8ee] px-2 py-0.5 rounded-full">
                  {Math.round((completedSessionsCount / (totalSessionsCount || 1)) * 100)}% Mastered
                </span>
              </div>
            </div>

            {/* Stat 3: In Progress */}
            <div className="bg-white border border-[#D9DDE7] rounded-3xl p-5 shadow-xs flex flex-col justify-between h-32 hover:border-[#96490d]/40 transition-all">
              <div className="flex items-center justify-between text-[#767683]">
                <span className="text-[11px] font-extrabold uppercase tracking-wider">In Progress</span>
                <div className="w-8 h-8 rounded-xl bg-[#ffdbc9] text-[#96490d] flex items-center justify-center">
                  <Clock className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-3xl font-extrabold text-[#151c27]">{inProgressSessionsCount}</span>
                <span className="text-[10px] font-bold text-[#96490d] bg-[#ffdbc9] px-2 py-0.5 rounded-full animate-pulse">
                  Resume Available
                </span>
              </div>
            </div>

            {/* Stat 4: Avg Completion Time */}
            <div className="bg-white border border-[#D9DDE7] rounded-3xl p-5 shadow-xs flex flex-col justify-between h-32 hover:border-[#142380]/40 transition-all">
              <div className="flex items-center justify-between text-[#767683]">
                <span className="text-[11px] font-extrabold uppercase tracking-wider">Avg. Time</span>
                <div className="w-8 h-8 rounded-xl bg-[#F7F8FC] border border-[#D9DDE7] text-[#151c27] flex items-center justify-center">
                  <BarChart2 className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-extrabold text-[#151c27]">2m 45s</span>
                <span className="text-[10px] font-bold text-[#767683] bg-[#F7F8FC] px-2 py-0.5 rounded-full">
                  ~10 Rounds
                </span>
              </div>
            </div>
          </div>

          {/* ================= 5. MAIN WORKSPACE: TABLE & EDUCATIONAL SIDEBAR ================= */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* LEFT AREA: SEARCH/FILTER + SESSION TABLE / CARDS (8 COLS) */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* SEARCH & FILTER BAR */}
              <div className="bg-white p-4 rounded-3xl border border-[#D9DDE7] shadow-xs flex flex-col sm:flex-row gap-4 items-center justify-between">
                {/* Search Input */}
                <div className="relative w-full sm:w-64">
                  <Search className="w-4 h-4 text-[#767683] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setCurrentPage(1);
                    }}
                    placeholder="Search Session ID..."
                    className="w-full bg-[#F7F8FC] border border-[#D9DDE7] focus:border-[#142380] text-xs text-[#151c27] pl-9 pr-3 py-2 rounded-xl outline-none transition-all font-medium"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#767683] hover:text-[#151c27]"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Dropdown Filters */}
                <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-start sm:justify-end">
                  {/* Variant Filter */}
                  <div className="flex items-center gap-1.5 bg-[#F7F8FC] border border-[#D9DDE7] px-3 py-1.5 rounded-xl">
                    <Filter className="w-3.5 h-3.5 text-[#767683]" />
                    <select
                      value={variantFilter}
                      onChange={(e) => {
                        setVariantFilter(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="bg-transparent text-xs font-bold text-[#151c27] outline-none cursor-pointer"
                    >
                      <option value="ALL">All Variants</option>
                      <option value="AES-128">AES-128</option>
                      <option value="AES-192">AES-192</option>
                      <option value="AES-256">AES-256</option>
                    </select>
                  </div>

                  {/* Status Filter */}
                  <div className="flex items-center gap-1.5 bg-[#F7F8FC] border border-[#D9DDE7] px-3 py-1.5 rounded-xl">
                    <select
                      value={statusFilter}
                      onChange={(e) => {
                        setStatusFilter(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="bg-transparent text-xs font-bold text-[#151c27] outline-none cursor-pointer"
                    >
                      <option value="ALL">All Statuses</option>
                      <option value="Completed">Completed</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Draft">Draft</option>
                    </select>
                  </div>

                  {/* Sort Order */}
                  <div className="flex items-center gap-1.5 bg-[#F7F8FC] border border-[#D9DDE7] px-3 py-1.5 rounded-xl">
                    <ArrowUpDown className="w-3.5 h-3.5 text-[#767683]" />
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as any)}
                      className="bg-transparent text-xs font-bold text-[#151c27] outline-none cursor-pointer"
                    >
                      <option value="recent">Most Recent</option>
                      <option value="oldest">Oldest</option>
                      <option value="duration">Duration</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* DATA TABLE (DESKTOP & TABLET) */}
              <div className="bg-white rounded-3xl border border-[#D9DDE7] shadow-xs overflow-hidden hidden sm:block">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-[#F7F8FC] border-b border-[#D9DDE7] text-[11px] font-extrabold text-[#767683] uppercase tracking-wider">
                        <th className="py-4 px-6">Session ID</th>
                        <th className="py-4 px-6">Details</th>
                        <th className="py-4 px-6">Status</th>
                        <th className="py-4 px-6 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#f0f3ff] text-xs font-medium text-[#151c27]">
                      {filteredAndSortedSessions.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="py-12 text-center">
                            <div className="flex flex-col items-center justify-center space-y-3">
                              <div className="w-12 h-12 rounded-2xl bg-[#f0f3ff] text-[#142380] flex items-center justify-center">
                                <FileQuestion className="w-6 h-6" />
                              </div>
                              <h4 className="text-sm font-extrabold text-[#151c27]">No visualization sessions yet</h4>
                              <p className="text-xs text-[#767683] max-w-sm">
                                Start your first AES visualization or adjust your filters to view past learning sessions.
                              </p>
                              <button
                                onClick={() => setActiveTab('visualization')}
                                className="mt-2 px-4 py-2 bg-[#142380] text-white text-xs font-bold rounded-xl hover:bg-[#2f3c97] transition-all cursor-pointer"
                              >
                                Start New Visualization
                              </button>
                            </div>
                          </td>
                        </tr>
                      ) : (
                        paginatedSessions.map((session) => (
                          <tr
                            key={session.id}
                            className="hover:bg-[#f0f3ff]/60 transition-colors group cursor-pointer"
                            onClick={() => {
                              if (onSelectSession) {
                                onSelectSession(session);
                              } else {
                                setActiveTab('details');
                              }
                            }}
                          >
                            {/* Session ID & Date */}
                            <td className="py-4 px-6">
                              <div className="font-extrabold text-[#142380] font-mono text-sm">
                                {session.id}
                              </div>
                              <div className="text-[11px] text-[#767683] mt-0.5 flex items-center gap-1 font-semibold">
                                <Calendar className="w-3 h-3 text-[#767683]" />
                                <span>{session.date}</span>
                              </div>
                            </td>

                            {/* Details (Variant + Duration + Last Stage) */}
                            <td className="py-4 px-6">
                              <div className="flex items-center gap-2">
                                <span
                                  className={`px-2 py-0.5 rounded font-extrabold text-[10px] ${
                                    session.variant === 'AES-256'
                                      ? 'bg-[#ffdbc9] text-[#96490d]'
                                      : session.variant === 'AES-192'
                                      ? 'bg-[#e7eefe] text-[#142380]'
                                      : 'bg-[#e8f8ee] text-[#005221]'
                                  }`}
                                >
                                  {session.variant}
                                </span>
                                <span className="text-[#767683] text-[11px] flex items-center gap-1 font-semibold">
                                  <Clock className="w-3 h-3" />
                                  {session.duration}
                                </span>
                              </div>
                              <div className="text-xs font-bold text-[#151c27] mt-1">
                                {session.lastStage}
                              </div>
                            </td>

                            {/* Status Badge */}
                            <td className="py-4 px-6">
                              <span
                                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold ${
                                  session.status === 'Completed'
                                    ? 'bg-[#e8f8ee] text-[#005221]'
                                    : session.status === 'In Progress'
                                    ? 'bg-[#e7eefe] text-[#142380]'
                                    : 'bg-[#F7F8FC] border border-[#D9DDE7] text-[#767683]'
                                }`}
                              >
                                <span
                                  className={`w-1.5 h-1.5 rounded-full ${
                                    session.status === 'Completed'
                                      ? 'bg-[#005221]'
                                      : session.status === 'In Progress'
                                      ? 'bg-[#142380] animate-pulse'
                                      : 'bg-[#767683]'
                                  }`}
                                />
                                {session.status}
                              </span>
                            </td>

                            {/* Actions Buttons */}
                            <td className="py-4 px-6 text-right" onClick={(e) => e.stopPropagation()}>
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => {
                                    if (onSelectSession) {
                                      onSelectSession(session);
                                    } else {
                                      setActiveTab('details');
                                    }
                                  }}
                                  className="p-2 rounded-xl text-[#142380] hover:bg-[#e7eefe] transition-colors cursor-pointer"
                                  title="View Details"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>

                                <button
                                  onClick={() => setActiveTab('visualization')}
                                  className="p-2 rounded-xl text-[#96490d] hover:bg-[#ffdbc9] transition-colors cursor-pointer"
                                  title={session.status === 'In Progress' ? 'Continue Session' : 'Replay Visualization'}
                                >
                                  {session.status === 'In Progress' ? (
                                    <Play className="w-4 h-4 fill-[#96490d]" />
                                  ) : (
                                    <RotateCcw className="w-4 h-4" />
                                  )}
                                </button>

                                <button
                                  onClick={(e) => handleDeleteSession(session.id, e)}
                                  className="p-2 rounded-xl text-[#767683] hover:text-[#EF4444] hover:bg-red-50 transition-colors cursor-pointer"
                                  title="Delete Session"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Pagination Controls */}
                {filteredAndSortedSessions.length > 0 && (
                  <div className="p-4 border-t border-[#f0f3ff] flex items-center justify-between text-xs text-[#767683] font-semibold">
                    <span>
                      Showing {(currentPage - 1) * pageSize + 1}-
                      {Math.min(currentPage * pageSize, filteredAndSortedSessions.length)} of{' '}
                      {filteredAndSortedSessions.length} sessions
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                        className="p-1.5 rounded-lg border border-[#D9DDE7] hover:bg-[#f0f3ff] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <span className="px-3 font-bold text-[#151c27]">
                        Page {currentPage} of {totalPages}
                      </span>
                      <button
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                        className="p-1.5 rounded-lg border border-[#D9DDE7] hover:bg-[#f0f3ff] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* MOBILE SESSION CARDS (SM ONLY) */}
              <div className="sm:hidden space-y-3">
                {filteredAndSortedSessions.length === 0 ? (
                  <div className="bg-white p-6 rounded-3xl border border-[#D9DDE7] text-center space-y-3">
                    <FileQuestion className="w-8 h-8 text-[#142380] mx-auto" />
                    <p className="text-xs font-bold text-[#151c27]">No sessions found</p>
                    <button
                      onClick={() => setActiveTab('visualization')}
                      className="px-4 py-2 bg-[#142380] text-white text-xs font-bold rounded-xl"
                    >
                      Start New Visualization
                    </button>
                  </div>
                ) : (
                  paginatedSessions.map((session) => (
                    <div
                      key={session.id}
                      onClick={() => setSelectedSessionModal(session)}
                      className="bg-white p-5 rounded-3xl border border-[#D9DDE7] shadow-xs space-y-3 cursor-pointer hover:border-[#142380]/40 transition-all"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-extrabold text-sm text-[#142380]">
                          {session.id}
                        </span>
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                            session.status === 'Completed'
                              ? 'bg-[#e8f8ee] text-[#005221]'
                              : 'bg-[#e7eefe] text-[#142380]'
                          }`}
                        >
                          {session.status}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-xs">
                        <span className="px-2 py-0.5 rounded bg-[#f0f3ff] font-extrabold text-[10px] text-[#151c27]">
                          {session.variant}
                        </span>
                        <span className="text-[#767683] font-medium">• {session.date}</span>
                        <span className="text-[#767683] font-medium">• {session.duration}</span>
                      </div>

                      <p className="text-xs font-bold text-[#151c27]">
                        Stage: <span className="text-[#454652] font-normal">{session.lastStage}</span>
                      </p>

                      <div className="pt-2 border-t border-[#f0f3ff] flex items-center justify-between gap-2" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => setSelectedSessionModal(session)}
                          className="flex-1 py-2 bg-[#F7F8FC] border border-[#D9DDE7] text-[#142380] text-xs font-bold rounded-xl text-center"
                        >
                          View Details
                        </button>
                        <button
                          onClick={() => setActiveTab('visualization')}
                          className="flex-1 py-2 bg-[#142380] text-white text-xs font-bold rounded-xl text-center"
                        >
                          {session.status === 'In Progress' ? 'Continue' : 'Replay'}
                        </button>
                        <button
                          onClick={(e) => handleDeleteSession(session.id, e)}
                          className="p-2 text-[#767683] hover:text-[#EF4444]"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

            </div>

            {/* RIGHT SIDEBAR: EDUCATIONAL WIDGET ("LEARNING TIP") (4 COLS) */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* LEARNING TIP WIDGET */}
              <div className="bg-white rounded-3xl border border-[#D9DDE7] p-6 shadow-xs sticky top-24 space-y-5">
                <div className="flex items-center gap-3 pb-3 border-b border-[#f0f3ff]">
                  <div className="w-10 h-10 rounded-2xl bg-[#ffdbc9] text-[#96490d] flex items-center justify-center shrink-0 shadow-2xs">
                    <Lightbulb className="w-5 h-5 fill-[#96490d]" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-[#151c27]">Learning Tip</h3>
                    <p className="text-[11px] text-[#767683] font-semibold">Educational Insight</p>
                  </div>
                </div>

                <p className="text-xs text-[#454652] leading-relaxed">
                  Reviewing previous sessions is crucial for mastering the AES algorithm. Pay special attention to the{' '}
                  <strong className="text-[#142380] font-extrabold">MixColumns</strong> and{' '}
                  <strong className="text-[#142380] font-extrabold">ShiftRows</strong> stages in your replays to observe how data diffuses across the 4x4 state matrix.
                </p>

                {/* Concept Reinforcement Card */}
                <div className="p-4 bg-[#F7F8FC] rounded-2xl border border-[#D9DDE7]/60 space-y-1.5">
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#96490d]" />
                    <h4 className="text-xs font-extrabold text-[#151c27]">Concept Reinforcement</h4>
                  </div>
                  <p className="text-[11px] text-[#767683] leading-normal">
                    Replay your incomplete AES-256 session to see the extended Rijndael key schedule in action across 14 full rounds.
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2 pt-2">
                  <button
                    onClick={() => setActiveTab('basics')}
                    className="w-full py-3 bg-[#142380] hover:bg-[#2f3c97] text-white font-extrabold text-xs rounded-2xl transition-all shadow-xs flex justify-center items-center gap-2 cursor-pointer"
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>Open Study Guide</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('visualization')}
                    className="w-full py-2.5 bg-white border border-[#D9DDE7] hover:bg-[#f0f3ff] text-[#142380] font-extrabold text-xs rounded-2xl transition-all flex justify-center items-center gap-2 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Replay a Session</span>
                  </button>
                </div>
              </div>

            </div>

          </div>

          {/* ================= 6. SESSION DETAILS MODAL (VIEW DETAILS) ================= */}
          {selectedSessionModal && (
            <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl space-y-6 animate-in zoom-in-95 border border-[#D9DDE7]">
                
                {/* Modal Header */}
                <div className="flex items-start justify-between pb-4 border-b border-[#f0f3ff]">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-lg font-extrabold text-[#142380]">
                        {selectedSessionModal.id}
                      </span>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                          selectedSessionModal.variant === 'AES-256'
                            ? 'bg-[#ffdbc9] text-[#96490d]'
                            : selectedSessionModal.variant === 'AES-192'
                            ? 'bg-[#e7eefe] text-[#142380]'
                            : 'bg-[#e8f8ee] text-[#005221]'
                        }`}
                      >
                        {selectedSessionModal.variant}
                      </span>
                    </div>
                    <p className="text-xs text-[#767683] font-medium">
                      Created on {selectedSessionModal.timestamp || selectedSessionModal.date}
                    </p>
                  </div>

                  <button
                    onClick={() => setSelectedSessionModal(null)}
                    className="p-2 text-[#767683] hover:text-[#151c27] hover:bg-[#f0f3ff] rounded-2xl cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Session Entity Attributes (Chapter 3 Data Model) */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#F7F8FC] p-4 rounded-2xl border border-[#D9DDE7]/70 text-xs">
                  <div>
                    <span className="text-[10px] font-extrabold text-[#767683] uppercase">Status</span>
                    <p className="font-bold text-[#005221]">{selectedSessionModal.status}</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-extrabold text-[#767683] uppercase">Duration</span>
                    <p className="font-bold text-[#151c27]">{selectedSessionModal.duration}</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-extrabold text-[#767683] uppercase">Rounds</span>
                    <p className="font-bold text-[#151c27]">
                      {selectedSessionModal.roundsCompleted || 10} / {selectedSessionModal.totalRounds || 10}
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] font-extrabold text-[#767683] uppercase">Last Stage</span>
                    <p className="font-bold text-[#142380] truncate">{selectedSessionModal.lastStage}</p>
                  </div>
                </div>

                {/* Input_Data Entity Details */}
                <div className="space-y-4">
                  <h4 className="text-xs font-extrabold text-[#151c27] uppercase tracking-wider flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[#142380]" />
                    <span>Input Data Parameters</span>
                  </h4>

                  <div className="space-y-3">
                    <div className="bg-[#F7F8FC] p-3 rounded-xl border border-[#D9DDE7]/50 space-y-1">
                      <span className="text-[10px] font-extrabold text-[#767683] uppercase">Plaintext (ASCII)</span>
                      <p className="text-xs font-mono text-[#151c27] font-bold">{selectedSessionModal.plaintext}</p>
                      {selectedSessionModal.plaintextHex && (
                        <p className="text-[10px] font-mono text-[#767683]">{selectedSessionModal.plaintextHex}</p>
                      )}
                    </div>

                    <div className="bg-[#F7F8FC] p-3 rounded-xl border border-[#D9DDE7]/50 space-y-1">
                      <span className="text-[10px] font-extrabold text-[#767683] uppercase">AES Secret Key</span>
                      <p className="text-xs font-mono text-[#96490d] font-bold">{selectedSessionModal.key}</p>
                      {selectedSessionModal.keyHex && (
                        <p className="text-[10px] font-mono text-[#767683]">{selectedSessionModal.keyHex}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Encryption_Process Trace Preview */}
                <div className="space-y-3">
                  <h4 className="text-xs font-extrabold text-[#151c27] uppercase tracking-wider flex items-center gap-2">
                    <Layers className="w-4 h-4 text-[#142380]" />
                    <span>Encryption Output Ciphertext</span>
                  </h4>

                  <div className="bg-[#142380] text-white p-4 rounded-2xl font-mono text-xs tracking-widest break-all space-y-1">
                    <span className="text-[10px] text-[#ff9a5b] font-bold uppercase tracking-wider block">
                      Generated 128-Bit Ciphertext Hex:
                    </span>
                    <p className="text-sm font-extrabold">{selectedSessionModal.ciphertextHex}</p>
                  </div>
                </div>

                {/* Modal Footer Actions */}
                <div className="pt-4 border-t border-[#f0f3ff] flex flex-col sm:flex-row gap-3 justify-end">
                  <button
                    onClick={() => {
                      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(selectedSessionModal, null, 2));
                      const downloadAnchor = document.createElement('a');
                      downloadAnchor.setAttribute("href", dataStr);
                      downloadAnchor.setAttribute("download", `session-${selectedSessionModal.id}.json`);
                      document.body.appendChild(downloadAnchor);
                      downloadAnchor.click();
                      downloadAnchor.remove();
                    }}
                    className="px-4 py-2.5 bg-[#F7F8FC] border border-[#D9DDE7] text-[#151c27] hover:bg-[#e7eefe] text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Download className="w-4 h-4 text-[#767683]" />
                    <span>Download Trace JSON</span>
                  </button>

                  <button
                    onClick={() => {
                      setSelectedSessionModal(null);
                      setActiveTab('visualization');
                    }}
                    className="px-6 py-2.5 bg-[#142380] hover:bg-[#2f3c97] text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                  >
                    <Play className="w-4 h-4 fill-white" />
                    <span>Launch in Visualizer</span>
                  </button>
                </div>

              </div>
            </div>
          )}



        </div>
      </main>

    </div>
  );
};
