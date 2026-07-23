import React, { useState } from 'react';
import { NavigationTab } from '../types';
import {
  LayoutDashboard,
  PlusCircle,
  History,
  BookOpen,
  HelpCircle,
  Settings,
  LogOut,
  Search,
  Bell,
  User,
  Play,
  RotateCcw,
  CheckCircle2,
  Clock,
  BarChart2,
  Star,
  ArrowRight,
  Eye,
  Trash2,
  Shield,
  Sparkles,
  ChevronRight,
  X,
  Lock,
  FileCode,
  Key,
  RefreshCw,
  Sliders,
  Check,
  ExternalLink,
  AlertCircle,
  BookMarked,
  Award,
  SlidersHorizontal,
  Layers,
  Info,
  ChevronDown,
  Menu,
  ChevronLeft
} from 'lucide-react';

interface DashboardViewProps {
  setActiveTab: (tab: NavigationTab) => void;
  onSelectSession?: (session: any) => void;
}

interface SessionRecord {
  id: string;
  date: string;
  variant: 'AES-128' | 'AES-192' | 'AES-256';
  plaintext: string;
  key: string;
  ciphertext: string;
  status: 'Completed' | 'In Progress';
}

export const DashboardView: React.FC<DashboardViewProps> = ({ setActiveTab, onSelectSession }) => {
  const [activeSidebarItem, setActiveSidebarItem] = useState<'dashboard' | 'new' | 'history' | 'learning' | 'about' | 'settings' | 'help'>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [selectedSessionModal, setSelectedSessionModal] = useState<SessionRecord | null>(null);
  const [selectedLearningTopic, setSelectedLearningTopic] = useState<string | null>(null);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Initial Session Data
  const [sessions, setSessions] = useState<SessionRecord[]>([
    {
      id: '#AES-8492',
      date: 'Oct 24, 2023',
      variant: 'AES-128',
      plaintext: 'HELLO AES WORLD 12',
      key: 'SECRET KEY 123456',
      ciphertext: '4A E8 2F B9 12 88 9F 0D C6 34 2F AE 7C D2 1B 88',
      status: 'Completed',
    },
    {
      id: '#AES-8491',
      date: 'Oct 22, 2023',
      variant: 'AES-256',
      plaintext: 'TOP SECRET MATRIX',
      key: '32_BYTE_MASTER_KEY_AES_256_TEST',
      ciphertext: '88 4A D2 1B 9F 7C 0D AE S1 34 B9 2F C6 E8 88 4A',
      status: 'In Progress',
    },
    {
      id: '#AES-8488',
      date: 'Oct 15, 2023',
      variant: 'AES-128',
      plaintext: 'CRYPTOGRAPHY 2023',
      key: 'UNI_PROJECT_KEY!',
      ciphertext: '12 AE C6 88 4A D2 9F 7C 0D B9 34 2F E8 1B S1 4A',
      status: 'Completed',
    },
    {
      id: '#AES-8475',
      date: 'Oct 10, 2023',
      variant: 'AES-192',
      plaintext: 'FINANCIAL DATA 99',
      key: '24_BYTE_MEDIUM_KEY_12345678',
      ciphertext: 'D2 1B 88 4A 9F 7C 0D AE S1 34 B9 2F C6 E8 88 12',
      status: 'Completed',
    }
  ]);

  const notificationsList = [
    { id: 1, title: 'Session Saved', desc: 'Session #AES-8492 was saved to history.', time: '10m ago' },
    { id: 2, title: 'New Module Available', desc: 'Galois Field Multiplication interactive guide added.', time: '2h ago' },
    { id: 3, title: 'Progress Update', desc: 'You completed 3/5 modules in the AES path.', time: '1d ago' },
  ];

  const learningTopics = [
    {
      id: 'what-is-aes',
      title: 'What is AES?',
      category: 'Overview',
      desc: 'A high-level overview of the Advanced Encryption Standard established by NIST in 2001.',
      content: 'The Advanced Encryption Standard (AES) is a symmetric-key block cipher chosen by the U.S. National Institute of Standards and Technology (NIST) in 2001. It replaced the older Data Encryption Standard (DES). AES operates on 128-bit blocks of data and supports key sizes of 128, 192, and 256 bits.',
      keyTakeaways: [
        'Symmetric-key cipher: same key encrypts and decrypts',
        'Fixed block size of 128 bits (16 bytes)',
        'Key sizes determine round count: 10 (128-bit), 12 (192-bit), 14 (256-bit)',
        'Adopted globally for financial, governmental, and commercial communication security'
      ]
    },
    {
      id: 'aes-process',
      title: 'AES Encryption Process',
      category: 'Architecture',
      desc: 'Step-by-step breakdown of SubBytes, ShiftRows, MixColumns, and AddRoundKey.',
      content: 'Each round of AES (except the final round) consists of four sequential transformations operating on a 4x4 byte matrix called the State:\n1. SubBytes: Non-linear byte substitution using S-Box\n2. ShiftRows: Cyclic row shifting\n3. MixColumns: Linear mixing across columns via Galois Field matrix multiplication\n4. AddRoundKey: XORing state with current round key',
      keyTakeaways: [
        'SubBytes provides confusion via non-linear S-Box lookup',
        'ShiftRows and MixColumns together provide diffusion',
        'AddRoundKey combines the secret key material into state',
        'Final round omits MixColumns to ensure symmetry in decryption'
      ]
    },
    {
      id: 'key-expansion',
      title: 'Key Expansion',
      category: 'Key Schedule',
      desc: 'Understanding how round keys are generated from the master key.',
      content: 'AES Key Expansion uses a Rijndael key schedule to expand a short master key into multiple 128-bit round keys. It utilizes RotWord (circular word shift), SubWord (S-Box byte substitution), and Rcon (round constants) to prevent mathematical relationships between round keys.',
      keyTakeaways: [
        'Generates N+1 round keys for N rounds (e.g. 11 keys for 10 rounds)',
        'RotWord rotates 4-byte words',
        'SubWord applies S-Box to each byte',
        'Rcon XORs round constants to eliminate symmetry'
      ]
    },
    {
      id: 'enc-vs-dec',
      title: 'Encryption vs Decryption',
      category: 'Symmetry',
      desc: 'Comparing forward cipher and inverse cipher transformations.',
      content: 'AES decryption runs the inverse transformations in reverse sequence: InvAddRoundKey -> InvMixColumns -> InvShiftRows -> InvSubBytes. Because XOR is its own inverse, AddRoundKey remains identical, while S-Box and matrix multiplication use inverse lookup tables.',
      keyTakeaways: [
        'Inverse S-Box (InvSubBytes) reverses byte substitution',
        'InvShiftRows shifts rows right instead of left',
        'InvMixColumns multiplies by inverse polynomial matrix in GF(2^8)',
        'Round keys are applied in reverse order (from last to first)'
      ]
    },
    {
      id: 'variants',
      title: 'AES-128 vs AES-192 vs AES-256',
      category: 'Comparison',
      desc: 'Comparing key sizes, security levels, and round counts.',
      content: 'All AES variants process 128-bit blocks but differ in key length and round count:\n- AES-128: 128-bit key, 10 rounds\n- AES-192: 192-bit key, 12 rounds\n- AES-256: 256-bit key, 14 rounds\nLarger key sizes offer exponential resistance to brute-force attacks.',
      keyTakeaways: [
        'AES-128 requires 2^128 operations to brute force (computationally infeasible)',
        'AES-256 is post-quantum resistant against Grover\'s algorithm',
        'More rounds add minor processing overhead (~40% for AES-256 vs 128)',
        'AES-128 remains secure and is most widely used in web standards (TLS, HTTPS)'
      ]
    }
  ];

  const handleDeleteSession = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm(`Are you sure you want to delete session ${id}?`)) {
      setSessions(sessions.filter((s) => s.id !== id));
    }
  };

  const filteredSessions = sessions.filter(
    (s) =>
      s.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.plaintext.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.variant.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#f9f9ff] text-[#151c27] flex flex-col md:flex-row font-sans">
      
      {/* ================= 1. SIDEBAR NAVIGATION (DESKTOP) ================= */}
      <aside className={`hidden md:flex flex-col bg-white border-r border-[#D9DDE7] sticky top-0 h-screen z-40 shrink-0 justify-between py-6 transition-all duration-300 shadow-xs ${isSidebarCollapsed ? 'w-20 px-3' : 'w-64 px-4'}`}>
        <div className="space-y-6">
          {/* Logo, Platform Name & Collapse Toggle */}
          <div className="flex items-center justify-between px-1">
            <button
              onClick={() => { setActiveSidebarItem('dashboard'); }}
              className={`flex items-center gap-3 py-2 text-left group cursor-pointer ${isSidebarCollapsed ? 'justify-center w-full' : 'min-w-0'}`}
              title="AES Visualizer"
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

            {/* Desktop Collapse Hamburger / Toggle Button */}
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

          {/* Nav Items */}
          <nav className="space-y-1.5 pt-2">
            <button
              onClick={() => {
                setActiveSidebarItem('dashboard');
              }}
              title="Dashboard"
              className={`w-full flex items-center rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                isSidebarCollapsed ? 'justify-center p-3' : 'px-4 py-3 gap-3'
              } ${
                activeSidebarItem === 'dashboard'
                  ? 'bg-[#142380] text-white shadow-xs'
                  : 'text-[#454652] hover:bg-[#f0f3ff] hover:text-[#142380]'
              }`}
            >
              <LayoutDashboard className="w-5 h-5 shrink-0" />
              {!isSidebarCollapsed && <span>Dashboard</span>}
            </button>

            <button
              onClick={() => {
                setActiveTab('visualization');
              }}
              title="New Visualization"
              className={`w-full flex items-center rounded-xl font-bold text-xs sm:text-sm text-[#454652] hover:bg-[#f0f3ff] hover:text-[#142380] transition-all cursor-pointer ${
                isSidebarCollapsed ? 'justify-center p-3' : 'px-4 py-3 gap-3'
              }`}
            >
              <PlusCircle className="w-5 h-5 shrink-0 text-[#96490d]" />
              {!isSidebarCollapsed && <span>New Visualization</span>}
            </button>

            <button
              onClick={() => {
                setActiveTab('history');
              }}
              title="Session History"
              className={`w-full flex items-center rounded-xl font-bold text-xs sm:text-sm text-[#454652] hover:bg-[#f0f3ff] hover:text-[#142380] transition-all cursor-pointer ${
                isSidebarCollapsed ? 'justify-center p-3' : 'px-4 py-3 gap-3'
              }`}
            >
              <History className="w-5 h-5 shrink-0" />
              {!isSidebarCollapsed && <span>Session History</span>}
            </button>

            <button
              onClick={() => {
                setActiveTab('basics');
              }}
              title="Learning Center"
              className={`w-full flex items-center rounded-xl font-bold text-xs sm:text-sm text-[#454652] hover:bg-[#f0f3ff] hover:text-[#142380] transition-all cursor-pointer ${
                isSidebarCollapsed ? 'justify-center p-3' : 'px-4 py-3 gap-3'
              }`}
            >
              <BookOpen className="w-5 h-5 shrink-0" />
              {!isSidebarCollapsed && <span>Learning Center</span>}
            </button>

            <button
              onClick={() => {
                setActiveTab('documentation');
              }}
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
            onClick={() => setShowSettingsModal(true)}
            title="Settings"
            className={`w-full flex items-center rounded-xl font-semibold text-xs sm:text-sm text-[#454652] hover:bg-[#f0f3ff] hover:text-[#142380] transition-all cursor-pointer ${
              isSidebarCollapsed ? 'justify-center p-2.5' : 'px-4 py-2.5 gap-3'
            }`}
          >
            <Settings className="w-4 h-4 text-[#767683] shrink-0" />
            {!isSidebarCollapsed && <span>Settings</span>}
          </button>

          <button
            onClick={() => setShowHelpModal(true)}
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
            <div className="flex justify-center p-1 mt-2" title="Dr. Alex Vance (Professor Profile)">
              <div className="w-9 h-9 rounded-xl bg-[#142380] text-white flex items-center justify-center font-extrabold text-xs shadow-xs cursor-pointer">
                AV
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3 p-3 bg-[#F7F8FC] rounded-2xl border border-[#D9DDE7] mt-2">
              <div className="w-9 h-9 rounded-xl bg-[#142380] text-white flex items-center justify-center font-extrabold text-xs shrink-0 shadow-xs">
                AV
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-[#151c27] truncate">Dr. Alex Vance</p>
                <p className="text-[10px] text-[#767683] font-semibold truncate">Professor Profile</p>
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
                    <p className="text-[10px] text-[#767683] font-semibold">Dashboard Workspace</p>
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
                  onClick={() => { setMobileSidebarOpen(false); }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-[#142380] text-white font-bold text-sm"
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
                onClick={() => { setShowSettingsModal(true); setMobileSidebarOpen(false); }}
                className="w-full flex items-center gap-3 px-4 py-2 text-[#454652] font-semibold text-sm"
              >
                <Settings className="w-4 h-4" />
                <span>Settings</span>
              </button>
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

            {/* Desktop Hamburger Sidebar Collapse Toggle */}
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
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search sessions, topics, or AES variants..."
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

          {/* Right Header Actions */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Notification Popover Button */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2.5 bg-[#F7F8FC] hover:bg-[#e7eefe] text-[#142380] rounded-2xl border border-[#D9DDE7] transition-all relative cursor-pointer"
                title="Notifications"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-[#96490d] rounded-full border-2 border-white animate-pulse" />
              </button>

              {/* Notification Popover */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white border border-[#D9DDE7] rounded-3xl shadow-xl p-4 z-50 animate-in fade-in zoom-in-95 space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-[#f0f3ff]">
                    <h4 className="text-xs font-extrabold text-[#151c27] uppercase tracking-wider">Notifications</h4>
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

            {/* User Profile Dropdown Button */}
            <div className="relative">
              <button
                onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                className="flex items-center gap-2.5 p-1.5 pr-3 bg-[#F7F8FC] hover:bg-[#e7eefe] border border-[#D9DDE7] rounded-2xl transition-all cursor-pointer"
              >
                <div className="w-8 h-8 rounded-xl bg-[#142380] text-white flex items-center justify-center font-extrabold text-xs shadow-xs">
                  AV
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-xs font-bold text-[#151c27] leading-tight">Dr. Alex Vance</p>
                </div>
                <ChevronDown className="w-4 h-4 text-[#767683]" />
              </button>

              {/* Profile Dropdown */}
              {showProfileDropdown && (
                <div className="absolute right-0 mt-2 w-56 bg-white border border-[#D9DDE7] rounded-2xl shadow-xl p-2 z-50 space-y-1 animate-in fade-in">
                  <div className="px-3 py-2 border-b border-[#f0f3ff]">
                    <p className="text-xs font-bold text-[#151c27]">Dr. Alex Vance</p>
                    <p className="text-[10px] text-[#767683]">alex.vance@university.edu</p>
                  </div>
                  <button
                    onClick={() => { setShowSettingsModal(true); setShowProfileDropdown(false); }}
                    className="w-full text-left px-3 py-2 text-xs font-semibold text-[#454652] hover:bg-[#f0f3ff] hover:text-[#142380] rounded-xl flex items-center gap-2 cursor-pointer"
                  >
                    <Settings className="w-4 h-4 text-[#767683]" />
                    <span>Account Preferences</span>
                  </button>
                  <button
                    onClick={() => { setShowHelpModal(true); setShowProfileDropdown(false); }}
                    className="w-full text-left px-3 py-2 text-xs font-semibold text-[#454652] hover:bg-[#f0f3ff] hover:text-[#142380] rounded-xl flex items-center gap-2 cursor-pointer"
                  >
                    <HelpCircle className="w-4 h-4 text-[#767683]" />
                    <span>Help & Documentation</span>
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

        {/* DASHBOARD CANVAS CONTAINER */}
        <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl mx-auto w-full">

          {/* ================= 3. WELCOME HERO CARD ================= */}
          <section className="relative bg-[#142380] text-white rounded-3xl p-6 sm:p-10 overflow-hidden shadow-lg border border-[#2f3c97] flex flex-col md:flex-row items-center justify-between gap-8">
            {/* Background Decorative Matrix & Radial Flares */}
            <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }} />
            <div className="absolute -top-24 -right-24 w-80 h-80 bg-[#ff9a5b]/20 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 space-y-4 max-w-2xl text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full border border-white/20 backdrop-blur-md">
                <Sparkles className="w-3.5 h-3.5 text-[#ff9a5b]" />
                <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#dfe0ff]">
                  AES Interactive Lab Workspace
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white leading-tight">
                Welcome Back!
              </h2>

              <p className="text-xs sm:text-sm lg:text-base text-[#dfe0ff] leading-relaxed max-w-xl">
                Explore how AES encrypts data through interactive visualizations and real-time learning. Analyze round key expansions, Galois Field matrix operations, and avalanche effects in high definition.
              </p>

              <div className="pt-2 flex flex-wrap justify-center md:justify-start gap-3">
                <button
                  onClick={() => setActiveTab('visualization')}
                  className="px-6 py-3 bg-[#96490d] hover:bg-[#D97430] text-white font-extrabold text-xs sm:text-sm rounded-2xl shadow-md transition-all hover:scale-105 active:scale-95 flex items-center gap-2 cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-white" />
                  <span>Start New Visualization</span>
                </button>

                <button
                  onClick={() => setActiveTab('visualization')}
                  className="px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs sm:text-sm rounded-2xl backdrop-blur-md transition-all hover:scale-105 active:scale-95 flex items-center gap-2 cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Continue Last Session</span>
                </button>
              </div>
            </div>

            {/* Hero Interactive Illustration Graphic */}
            <div className="relative z-10 shrink-0 hidden lg:flex flex-col items-center justify-center p-6 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-md shadow-2xs">
              <div className="grid grid-cols-4 gap-2 w-48 h-48 p-3 bg-[#2f3c97]/40 rounded-2xl border border-white/20">
                {['AE', 'S1', '34', 'B9', '2F', 'C6', '88', '4A', 'E8', '88', '4A', 'D2', '1B', '9F', '7C', '0D'].map((val, idx) => (
                  <div
                    key={idx}
                    className={`flex items-center justify-center rounded-lg font-mono text-xs font-bold transition-all ${
                      idx === 1
                        ? 'bg-[#ff9a5b] text-[#142380] shadow-md shadow-[#ff9a5b]/20 scale-105'
                        : 'bg-white/10 text-white border border-white/10'
                    }`}
                  >
                    {val}
                  </div>
                ))}
              </div>
              <span className="text-[10px] font-mono font-bold text-[#dfe0ff] mt-2 tracking-widest uppercase">
                128-Bit State Matrix
              </span>
            </div>
          </section>

          {/* ================= 4. QUICK STATISTICS GRID ================= */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Stat 1: Total Sessions */}
            <div className="bg-white border border-[#D9DDE7] rounded-3xl p-5 shadow-xs hover:shadow-md transition-all hover:-translate-y-0.5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#e7eefe] text-[#142380] flex items-center justify-center shrink-0 shadow-2xs">
                <BarChart2 className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[10px] font-extrabold text-[#767683] uppercase tracking-wider">Total Sessions</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-extrabold text-[#151c27]">24</span>
                  <span className="text-[10px] font-bold text-[#005221] bg-[#e8f8ee] px-1.5 py-0.5 rounded">+4 this week</span>
                </div>
              </div>
            </div>

            {/* Stat 2: Visualizations Completed */}
            <div className="bg-white border border-[#D9DDE7] rounded-3xl p-5 shadow-xs hover:shadow-md transition-all hover:-translate-y-0.5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#e8f8ee] text-[#005221] flex items-center justify-center shrink-0 shadow-2xs">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[10px] font-extrabold text-[#767683] uppercase tracking-wider">Completed</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-extrabold text-[#151c27]">18</span>
                  <span className="text-[10px] font-bold text-[#142380] bg-[#e7eefe] px-1.5 py-0.5 rounded">75% Rate</span>
                </div>
              </div>
            </div>

            {/* Stat 3: Learning Progress */}
            <div className="bg-white border border-[#D9DDE7] rounded-3xl p-5 shadow-xs hover:shadow-md transition-all hover:-translate-y-0.5 flex flex-col justify-center space-y-2">
              <div className="flex justify-between items-center">
                <p className="text-[10px] font-extrabold text-[#767683] uppercase tracking-wider">Learning Progress</p>
                <span className="text-xs font-extrabold text-[#96490d]">65%</span>
              </div>
              <div className="w-full bg-[#f0f3ff] rounded-full h-2.5 overflow-hidden border border-[#D9DDE7]/50">
                <div className="bg-[#96490d] h-full rounded-full transition-all duration-500" style={{ width: '65%' }} />
              </div>
              <p className="text-[10px] text-[#767683] font-medium">3 of 5 Core Modules Mastered</p>
            </div>

            {/* Stat 4: Favorite Variant */}
            <div className="bg-white border border-[#D9DDE7] rounded-3xl p-5 shadow-xs hover:shadow-md transition-all hover:-translate-y-0.5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#ffdbc9] text-[#96490d] flex items-center justify-center shrink-0 shadow-2xs">
                <Star className="w-6 h-6 fill-[#96490d]" />
              </div>
              <div>
                <p className="text-[10px] font-extrabold text-[#767683] uppercase tracking-wider">AES Variant Used Most</p>
                <p className="text-2xl font-extrabold text-[#151c27]">AES-128</p>
              </div>
            </div>

          </section>

          {/* ================= 5. MAIN CONTENT SPLIT (BENTO + PROGRESS & RECENT) ================= */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* LEFT COLUMN (8 COLS) */}
            <div className="lg:col-span-8 space-y-8">
              
              {/* QUICK ACTIONS BENTO GRID */}
              <section className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-extrabold text-[#151c27]">Quick Actions</h3>
                  <span className="text-xs text-[#767683] font-semibold">Select a workspace path</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  
                  {/* Quick Action 1: New AES Visualization */}
                  <button
                    onClick={() => setActiveTab('visualization')}
                    className="group bg-white p-6 rounded-3xl border border-[#D9DDE7] shadow-xs hover:shadow-md hover:border-[#142380]/40 transition-all text-left flex flex-col justify-between h-44 cursor-pointer hover:-translate-y-0.5"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-[#142380]/10 text-[#142380] group-hover:bg-[#142380] group-hover:text-white transition-colors flex items-center justify-center font-bold">
                      <PlusCircle className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-base font-extrabold text-[#151c27] group-hover:text-[#142380] transition-colors">
                        New AES Visualization
                      </h4>
                      <p className="text-xs text-[#454652] mt-1">
                        Start a new step-by-step encryption walkthrough with custom plaintext & keys.
                      </p>
                    </div>
                  </button>

                  {/* Quick Action 2: Session History */}
                  <button
                    onClick={() => {
                      const el = document.getElementById('recent-sessions-table');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="group bg-white p-6 rounded-3xl border border-[#D9DDE7] shadow-xs hover:shadow-md hover:border-[#142380]/40 transition-all text-left flex flex-col justify-between h-44 cursor-pointer hover:-translate-y-0.5"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-[#142380]/10 text-[#142380] group-hover:bg-[#142380] group-hover:text-white transition-colors flex items-center justify-center font-bold">
                      <History className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-base font-extrabold text-[#151c27] group-hover:text-[#142380] transition-colors">
                        Session History
                      </h4>
                      <p className="text-xs text-[#454652] mt-1">
                        View previous encryption sessions, replay matrix transformations, and export reports.
                      </p>
                    </div>
                  </button>

                  {/* Quick Action 3: Learning Center */}
                  <button
                    onClick={() => setActiveTab('basics')}
                    className="group bg-white p-6 rounded-3xl border border-[#D9DDE7] shadow-xs hover:shadow-md hover:border-[#142380]/40 transition-all text-left flex flex-col justify-between h-44 cursor-pointer hover:-translate-y-0.5"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-[#142380]/10 text-[#142380] group-hover:bg-[#142380] group-hover:text-white transition-colors flex items-center justify-center font-bold">
                      <BookOpen className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-base font-extrabold text-[#151c27] group-hover:text-[#142380] transition-colors">
                        Learning Center
                      </h4>
                      <p className="text-xs text-[#454652] mt-1">
                        Learn AES concepts, Galois Field math, S-Box substitution tables, and terminology.
                      </p>
                    </div>
                  </button>

                  {/* Quick Action 4: About AES */}
                  <button
                    onClick={() => setActiveTab('documentation')}
                    className="group bg-white p-6 rounded-3xl border border-[#D9DDE7] shadow-xs hover:shadow-md hover:border-[#142380]/40 transition-all text-left flex flex-col justify-between h-44 cursor-pointer hover:-translate-y-0.5"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-[#142380]/10 text-[#142380] group-hover:bg-[#142380] group-hover:text-white transition-colors flex items-center justify-center font-bold">
                      <Info className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-base font-extrabold text-[#151c27] group-hover:text-[#142380] transition-colors">
                        About AES
                      </h4>
                      <p className="text-xs text-[#454652] mt-1">
                        Understand the Advanced Encryption Standard standard specification and NIST requirements.
                      </p>
                    </div>
                  </button>

                </div>
              </section>

              {/* RECENT SESSIONS TABLE */}
              <section id="recent-sessions-table" className="bg-white rounded-3xl border border-[#D9DDE7] shadow-xs overflow-hidden">
                <div className="p-6 border-b border-[#f0f3ff] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <h3 className="text-base font-extrabold text-[#151c27]">Recent Sessions</h3>
                    <p className="text-xs text-[#454652]">Saved encryption simulations and state traces</p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#142380] bg-[#e7eefe] px-3 py-1 rounded-full">
                      {filteredSessions.length} Total Found
                    </span>
                    <button
                      onClick={() => setActiveTab('history')}
                      className="text-xs font-extrabold text-[#142380] hover:text-[#2f3c97] bg-[#f0f3ff] hover:bg-[#e7eefe] px-3 py-1 rounded-full transition-colors cursor-pointer flex items-center gap-1"
                    >
                      <span>View Full History</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-[#F7F8FC] text-[#767683] font-bold text-[11px] uppercase tracking-wider border-b border-[#D9DDE7]">
                        <th className="py-3.5 px-6">Session ID</th>
                        <th className="py-3.5 px-4">Date</th>
                        <th className="py-3.5 px-4">AES Variant</th>
                        <th className="py-3.5 px-4">Status</th>
                        <th className="py-3.5 px-6 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#f0f3ff] text-xs font-medium text-[#151c27]">
                      {filteredSessions.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="py-8 text-center text-[#767683]">
                            No sessions found matching your search.
                          </td>
                        </tr>
                      ) : (
                        filteredSessions.map((session) => (
                          <tr key={session.id} className="hover:bg-[#f0f3ff]/50 transition-colors">
                            <td className="py-4 px-6 font-extrabold text-[#142380] font-mono">
                              {session.id}
                            </td>
                            <td className="py-4 px-4 text-[#454652]">{session.date}</td>
                            <td className="py-4 px-4">
                              <span
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-md font-bold text-[11px] ${
                                  session.variant === 'AES-256'
                                    ? 'bg-[#ffdbc9] text-[#96490d]'
                                    : session.variant === 'AES-192'
                                    ? 'bg-[#e7eefe] text-[#142380]'
                                    : 'bg-[#e8f8ee] text-[#005221]'
                                }`}
                              >
                                {session.variant}
                              </span>
                            </td>
                            <td className="py-4 px-4">
                              <span
                                className={`inline-flex items-center gap-1.5 font-bold text-[11px] px-2.5 py-1 rounded-full ${
                                  session.status === 'Completed'
                                    ? 'text-[#005221] bg-[#e8f8ee]'
                                    : 'text-[#96490d] bg-[#ffdbc9]'
                                }`}
                              >
                                <span
                                  className={`w-1.5 h-1.5 rounded-full ${
                                    session.status === 'Completed' ? 'bg-[#005221]' : 'bg-[#96490d] animate-pulse'
                                  }`}
                                />
                                {session.status}
                              </span>
                            </td>
                            <td className="py-4 px-6 text-right space-x-2">
                              <button
                                onClick={() => {
                                  if (onSelectSession) {
                                    onSelectSession(session);
                                  } else {
                                    setActiveTab('details');
                                  }
                                }}
                                className="px-3 py-1.5 bg-[#F7F8FC] hover:bg-[#e7eefe] text-[#142380] font-bold text-xs rounded-xl border border-[#D9DDE7] transition-colors cursor-pointer inline-flex items-center gap-1"
                                title="View Details"
                              >
                                <Eye className="w-3.5 h-3.5" />
                                <span>View</span>
                              </button>

                              <button
                                onClick={() => setActiveTab('visualization')}
                                className="px-3 py-1.5 bg-[#142380] hover:bg-[#2f3c97] text-white font-bold text-xs rounded-xl transition-colors cursor-pointer inline-flex items-center gap-1 shadow-2xs"
                                title="Replay Visualization"
                              >
                                <RotateCcw className="w-3.5 h-3.5" />
                                <span>Replay</span>
                              </button>

                              <button
                                onClick={(e) => handleDeleteSession(session.id, e)}
                                className="p-1.5 text-[#767683] hover:text-[#EF4444] hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                                title="Delete Session"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </section>

            </div>

            {/* RIGHT COLUMN (4 COLS): CONTINUE LEARNING & RECOMMENDED READING */}
            <div className="lg:col-span-4 space-y-8">
              
              {/* CONTINUE LEARNING PROGRESS CARD */}
              <section className="bg-white rounded-3xl border border-[#D9DDE7] p-6 shadow-xs space-y-6">
                <div className="flex items-center justify-between pb-3 border-b border-[#f0f3ff]">
                  <div>
                    <h3 className="text-base font-extrabold text-[#151c27]">Learning Path</h3>
                    <p className="text-xs text-[#454652]">Mastering AES Transformations</p>
                  </div>
                  <span className="text-xs font-extrabold text-[#96490d] bg-[#ffdbc9] px-2.5 py-1 rounded-full">
                    65%
                  </span>
                </div>

                {/* Vertical Timeline */}
                <div className="relative pl-6 space-y-5">
                  <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-[#D9DDE7]" />

                  {/* Step 1: State Matrix */}
                  <div className="relative flex items-start gap-3">
                    <div className="absolute -left-[30px] w-6 h-6 rounded-full bg-[#005221] text-white flex items-center justify-center text-xs font-bold shadow-xs">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-[#151c27]">State Matrix</h4>
                      <p className="text-[11px] text-[#005221] font-semibold">Completed</p>
                    </div>
                  </div>

                  {/* Step 2: SubBytes */}
                  <div className="relative flex items-start gap-3">
                    <div className="absolute -left-[30px] w-6 h-6 rounded-full bg-[#005221] text-white flex items-center justify-center text-xs font-bold shadow-xs">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-[#151c27]">SubBytes</h4>
                      <p className="text-[11px] text-[#005221] font-semibold">Completed</p>
                    </div>
                  </div>

                  {/* Step 3: ShiftRows */}
                  <div className="relative flex items-start gap-3">
                    <div className="absolute -left-[30px] w-6 h-6 rounded-full bg-[#005221] text-white flex items-center justify-center text-xs font-bold shadow-xs">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-[#151c27]">ShiftRows</h4>
                      <p className="text-[11px] text-[#005221] font-semibold">Completed</p>
                    </div>
                  </div>

                  {/* Step 4: MixColumns (In Progress) */}
                  <div className="relative flex items-start gap-3">
                    <div className="absolute -left-[30px] w-6 h-6 rounded-full bg-[#96490d] text-white flex items-center justify-center text-xs font-bold shadow-md ring-4 ring-[#ffdbc9]">
                      <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                    </div>
                    <div>
                      <h4 className="text-xs font-extrabold text-[#96490d]">MixColumns</h4>
                      <p className="text-[11px] text-[#96490d] font-bold">In Progress</p>
                      <button
                        onClick={() => setActiveTab('visualization')}
                        className="mt-1 text-[11px] font-extrabold text-[#142380] hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <span>Practice MixColumns</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  {/* Step 5: AddRoundKey */}
                  <div className="relative flex items-start gap-3">
                    <div className="absolute -left-[30px] w-6 h-6 rounded-full bg-[#F7F8FC] border border-[#D9DDE7] text-[#767683] flex items-center justify-center text-xs font-bold">
                      5
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-[#767683]">AddRoundKey</h4>
                      <p className="text-[11px] text-[#767683]">Remaining</p>
                    </div>
                  </div>

                  {/* Step 6: Final Ciphertext */}
                  <div className="relative flex items-start gap-3">
                    <div className="absolute -left-[30px] w-6 h-6 rounded-full bg-[#F7F8FC] border border-[#D9DDE7] text-[#767683] flex items-center justify-center text-xs font-bold">
                      6
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-[#767683]">Final Ciphertext</h4>
                      <p className="text-[11px] text-[#767683]">Remaining</p>
                    </div>
                  </div>

                </div>
              </section>

              {/* RECOMMENDED AES LEARNING CARDS */}
              <section className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-extrabold text-[#151c27]">AES Learning Cards</h3>
                  <button
                    onClick={() => setActiveTab('basics')}
                    className="text-xs font-bold text-[#142380] hover:underline cursor-pointer"
                  >
                    View All
                  </button>
                </div>

                <div className="space-y-3">
                  {learningTopics.map((topic) => (
                    <button
                      key={topic.id}
                      onClick={() => setSelectedLearningTopic(topic.id)}
                      className="w-full text-left p-4 bg-white rounded-2xl border border-[#D9DDE7] shadow-xs hover:border-[#142380] hover:shadow-md transition-all group flex items-start gap-3.5 cursor-pointer"
                    >
                      <div className="w-10 h-10 rounded-xl bg-[#f0f3ff] text-[#142380] group-hover:bg-[#142380] group-hover:text-white transition-colors flex items-center justify-center shrink-0 font-bold">
                        <BookMarked className="w-5 h-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] font-bold text-[#96490d] uppercase tracking-wider">
                            {topic.category}
                          </span>
                          <ChevronRight className="w-3.5 h-3.5 text-[#767683] group-hover:translate-x-0.5 transition-transform" />
                        </div>
                        <h4 className="text-xs font-extrabold text-[#151c27] group-hover:text-[#142380] transition-colors mt-0.5 truncate">
                          {topic.title}
                        </h4>
                        <p className="text-[11px] text-[#454652] line-clamp-2 mt-0.5 leading-snug">
                          {topic.desc}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </section>

            </div>

          </div>

        </div>



      </main>

      {/* ================= MODALS & DRAWERS ================= */}

      {/* SESSION DETAIL MODAL */}
      {selectedSessionModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-[#D9DDE7] space-y-6 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-4 border-b border-[#f0f3ff]">
              <div>
                <span className="text-[10px] font-bold text-[#96490d] uppercase tracking-wider">
                  Session Inspection
                </span>
                <h3 className="text-xl font-extrabold text-[#151c27] font-mono">
                  {selectedSessionModal.id}
                </h3>
              </div>
              <button
                onClick={() => setSelectedSessionModal(null)}
                className="p-2 text-[#767683] hover:text-[#151c27] rounded-xl hover:bg-[#f0f3ff]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4 p-4 bg-[#F7F8FC] rounded-2xl border border-[#D9DDE7]">
                <div>
                  <span className="text-[#767683] font-semibold">Date Created:</span>
                  <p className="font-bold text-[#151c27]">{selectedSessionModal.date}</p>
                </div>
                <div>
                  <span className="text-[#767683] font-semibold">AES Variant:</span>
                  <p className="font-bold text-[#142380]">{selectedSessionModal.variant}</p>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[#767683] font-extrabold uppercase text-[10px]">Plaintext Input</span>
                <div className="p-3 bg-[#F7F8FC] rounded-xl border border-[#D9DDE7] font-mono font-bold text-[#151c27]">
                  {selectedSessionModal.plaintext}
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[#767683] font-extrabold uppercase text-[10px]">Secret Key</span>
                <div className="p-3 bg-[#F7F8FC] rounded-xl border border-[#D9DDE7] font-mono font-bold text-[#142380]">
                  {selectedSessionModal.key}
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[#767683] font-extrabold uppercase text-[10px]">Output Ciphertext</span>
                <div className="p-3 bg-[#F7F8FC] rounded-xl border border-[#D9DDE7] font-mono font-bold text-[#005221] break-all">
                  {selectedSessionModal.ciphertext}
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => {
                  setSelectedSessionModal(null);
                  setActiveTab('visualization');
                }}
                className="flex-1 py-3 bg-[#142380] hover:bg-[#2f3c97] text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Replay in Visualizer</span>
              </button>

              <button
                onClick={() => setSelectedSessionModal(null)}
                className="px-6 py-3 bg-[#F7F8FC] hover:bg-[#e7eefe] text-[#151c27] font-bold text-xs rounded-xl border border-[#D9DDE7] cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDUCATIONAL TOPIC MODAL */}
      {selectedLearningTopic && (() => {
        const topic = learningTopics.find((t) => t.id === selectedLearningTopic);
        if (!topic) return null;
        return (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-[#D9DDE7] space-y-6 animate-in zoom-in-95">
              <div className="flex items-center justify-between pb-3 border-b border-[#f0f3ff]">
                <div>
                  <span className="text-[10px] font-bold text-[#96490d] uppercase tracking-wider">
                    {topic.category}
                  </span>
                  <h3 className="text-xl font-extrabold text-[#151c27]">{topic.title}</h3>
                </div>
                <button
                  onClick={() => setSelectedLearningTopic(null)}
                  className="p-2 text-[#767683] hover:text-[#151c27] rounded-xl hover:bg-[#f0f3ff]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4 text-xs sm:text-sm text-[#454652] leading-relaxed">
                <p>{topic.content}</p>

                <div className="p-4 bg-[#f0f3ff] rounded-2xl border border-[#142380]/10 space-y-2">
                  <h4 className="font-extrabold text-[#142380] text-xs uppercase tracking-wider">
                    Key Takeaways
                  </h4>
                  <ul className="space-y-1.5 text-xs text-[#151c27]">
                    {topic.keyTakeaways.map((point, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-[#005221] shrink-0 mt-0.5" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => {
                    setSelectedLearningTopic(null);
                    setActiveTab('basics');
                  }}
                  className="flex-1 py-3 bg-[#142380] hover:bg-[#2f3c97] text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Open Full Article in Learning Center</span>
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* SETTINGS MODAL */}
      {showSettingsModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-[#D9DDE7] space-y-6 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-[#f0f3ff]">
              <div className="flex items-center gap-2 text-[#142380]">
                <Settings className="w-5 h-5" />
                <h3 className="text-lg font-extrabold text-[#151c27]">Platform Preferences</h3>
              </div>
              <button
                onClick={() => setShowSettingsModal(false)}
                className="p-2 text-[#767683] hover:text-[#151c27] rounded-xl hover:bg-[#f0f3ff]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-[#151c27]">Default AES Variant</label>
                <select className="w-full bg-[#F7F8FC] border border-[#D9DDE7] rounded-xl p-2.5 font-bold text-[#142380]">
                  <option value="128">AES-128 (Recommended for beginners)</option>
                  <option value="192">AES-192 (12 Rounds)</option>
                  <option value="256">AES-256 (14 Rounds)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#151c27]">Animation Playback Speed</label>
                <select className="w-full bg-[#F7F8FC] border border-[#D9DDE7] rounded-xl p-2.5 font-bold text-[#142380]">
                  <option value="1">1.0x Normal Speed</option>
                  <option value="0.5">0.5x Slow Motion</option>
                  <option value="2">2.0x Fast Forward</option>
                </select>
              </div>

              <div className="flex items-center justify-between p-3 bg-[#F7F8FC] rounded-2xl border border-[#D9DDE7]">
                <div>
                  <p className="font-bold text-[#151c27]">Auto-Save Session Trace</p>
                  <p className="text-[10px] text-[#767683]">Automatically log finished visualizations</p>
                </div>
                <input type="checkbox" defaultChecked className="w-4 h-4 text-[#142380] rounded" />
              </div>
            </div>

            <button
              onClick={() => setShowSettingsModal(false)}
              className="w-full py-3 bg-[#142380] text-white font-extrabold text-xs rounded-xl shadow-md"
            >
              Save Preferences
            </button>
          </div>
        </div>
      )}

      {/* HELP & FAQ MODAL */}
      {showHelpModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-[#D9DDE7] space-y-6 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-[#f0f3ff]">
              <div className="flex items-center gap-2 text-[#142380]">
                <HelpCircle className="w-5 h-5" />
                <h3 className="text-lg font-extrabold text-[#151c27]">Help & Shortcuts</h3>
              </div>
              <button
                onClick={() => setShowHelpModal(false)}
                className="p-2 text-[#767683] hover:text-[#151c27] rounded-xl hover:bg-[#f0f3ff]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-[#454652]">
              <div className="p-3 bg-[#f0f3ff] rounded-xl border border-[#D9DDE7] space-y-1">
                <p className="font-bold text-[#142380]">How do I start a visualization?</p>
                <p>Click "Start New Visualization", enter your plaintext and secret key (in string or hex), and click "Start Encryption Walkthrough".</p>
              </div>

              <div className="p-3 bg-[#f0f3ff] rounded-xl border border-[#D9DDE7] space-y-1">
                <p className="font-bold text-[#142380]">What is the Galois Field GF(2^8)?</p>
                <p>MixColumns multiplies matrix columns by fixed polynomials under GF(2^8) modulo 0x11B to keep values bounded to 1 byte.</p>
              </div>
            </div>

            <button
              onClick={() => setShowHelpModal(false)}
              className="w-full py-3 bg-[#142380] text-white font-extrabold text-xs rounded-xl shadow-md"
            >
              Close
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
