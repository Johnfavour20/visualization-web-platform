import React, { useState } from 'react';
import { NavigationTab } from '../types';
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
  CheckCircle2,
  Clock,
  Menu,
  ChevronLeft,
  ChevronRight,
  X,
  Sparkles,
  Bookmark,
  Award,
  ArrowRight,
  Key,
  Lock,
  Unlock,
  RefreshCw,
  ArrowLeftRight,
  Columns,
  Layers,
  HelpCircle as QuestionIcon,
  Check,
  ChevronDown,
  ChevronUp,
  Cpu,
  Globe,
  Wifi,
  Smartphone,
  CreditCard,
  Cloud,
  MapPin,
  Play
} from 'lucide-react';

interface LearningCenterViewProps {
  setActiveTab: (tab: NavigationTab) => void;
}

export const LearningCenterView: React.FC<LearningCenterViewProps> = ({ setActiveTab }) => {
  // Sidebar state
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Top bar notifications & profile
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Search filter
  const [searchQuery, setSearchQuery] = useState('');

  // Interactive Flow Stage Inspector
  const [selectedStage, setSelectedStage] = useState<'keyexp' | 'subbytes' | 'shiftrows' | 'mixcols' | 'addroundkey'>('subbytes');

  // Interactive Glossary filter & expansion
  const [glossarySearch, setGlossarySearch] = useState('');
  const [expandedTerm, setExpandedTerm] = useState<string | null>('subbytes');

  // Interactive Quiz State
  const [quizIndex, setQuizIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);
  const [quizScore, setQuizScore] = useState(0);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Glossary items
  const glossaryTerms = [
    {
      term: 'AES',
      title: 'Advanced Encryption Standard',
      category: 'Core Standard',
      definition: 'A specification for the encryption of electronic data established by the U.S. National Institute of Standards and Technology (NIST) in 2001 (FIPS 197).'
    },
    {
      term: 'Plaintext',
      title: 'Unencrypted Input Data',
      category: 'Data State',
      definition: 'The original unencrypted message or file before undergoing cryptographic transformation. In AES, plaintext is processed in 128-bit (16-byte) blocks.'
    },
    {
      term: 'Ciphertext',
      title: 'Encrypted Output Data',
      category: 'Data State',
      definition: 'The pseudo-random scrambled output produced by the encryption algorithm. It is unreadable without the corresponding secret key and decryption procedure.'
    },
    {
      term: 'Encryption',
      title: 'Scrambling Process',
      category: 'Operation',
      definition: 'The reversible mathematical process of converting plaintext into ciphertext using an encryption algorithm and a secret cryptographic key.'
    },
    {
      term: 'Decryption',
      title: 'Recovery Process',
      category: 'Operation',
      definition: 'The process of converting encrypted ciphertext back into its original readable plaintext format using the secret key.'
    },
    {
      term: 'Cryptography',
      title: 'Science of Secret Communication',
      category: 'Field',
      definition: 'The discipline concerned with mathematical techniques for securing communication, ensuring confidentiality, integrity, authentication, and non-repudiation.'
    },
    {
      term: 'Symmetric Key',
      title: 'Shared Secret Cryptography',
      category: 'Keys',
      definition: 'An encryption scheme where the same secret key is used for both encrypting the plaintext and decrypting the ciphertext.'
    },
    {
      term: 'State Matrix',
      title: '4x4 Byte Grid',
      category: 'Internal Memory',
      definition: 'An intermediate 4-row by 4-column matrix of bytes that holds the 128-bit block during all intermediate transformation rounds.'
    },
    {
      term: 'Key Expansion',
      title: 'Rijndael Key Schedule',
      category: 'Key Schedule',
      definition: 'The algorithm that expands the initial master key into multiple round keys (11 keys for AES-128, 13 for AES-192, 15 for AES-256).'
    },
    {
      term: 'SubBytes',
      title: 'Substitution Box Transformation',
      category: 'Transformation',
      definition: 'A non-linear byte substitution step where each byte in the State matrix is replaced with another byte using a precomputed S-Box lookup table.'
    },
    {
      term: 'ShiftRows',
      title: 'Cyclic Byte Permutation',
      category: 'Transformation',
      definition: 'A transposition step where bytes in each row of the State matrix are cyclically shifted to the left by row index offsets.'
    },
    {
      term: 'MixColumns',
      title: 'Galois Field Matrix Multiplication',
      category: 'Transformation',
      definition: 'A vertical diffusion operation where columns of the State matrix are multiplied with a fixed polynomial matrix in Galois Field GF(2^8).'
    },
    {
      term: 'AddRoundKey',
      title: 'Key Addition',
      category: 'Transformation',
      definition: 'A bitwise XOR operation combining each byte of the State matrix with the corresponding byte of the current round key.'
    },
    {
      term: 'Round Key',
      title: 'Subkey Instance',
      category: 'Key Schedule',
      definition: 'A 128-bit subkey derived from the master key used exclusively during a single specific round of the AES algorithm.'
    },
    {
      term: 'Visualization',
      title: 'Interactive Learning Interface',
      category: 'Pedagogy',
      definition: 'An educational tool that renders state matrix transitions, matrix calculations, and key schedules step-by-step for clear visual inspection.'
    },
    {
      term: 'Interactive Learning',
      title: 'Active Pedagogical Method',
      category: 'Pedagogy',
      definition: 'Learning by manipulating parameters, observing real-time cryptographic state changes, and testing knowledge with interactive quizzes.'
    }
  ];

  const filteredGlossary = glossaryTerms.filter((item) =>
    item.term.toLowerCase().includes(glossarySearch.toLowerCase()) ||
    item.title.toLowerCase().includes(glossarySearch.toLowerCase()) ||
    item.definition.toLowerCase().includes(glossarySearch.toLowerCase())
  );

  // Quiz questions
  const quizQuestions = [
    {
      question: 'Which AES transformation substitutes each byte using a precomputed 16x16 lookup matrix (S-Box)?',
      options: ['ShiftRows', 'MixColumns', 'SubBytes', 'AddRoundKey'],
      correct: 2,
      explanation: 'SubBytes provides non-linear substitution to protect against linear and differential cryptanalysis using the Rijndael S-Box.'
    },
    {
      question: 'How many transformation rounds are executed in AES-128 encryption?',
      options: ['8 Rounds', '10 Rounds', '12 Rounds', '14 Rounds'],
      correct: 1,
      explanation: 'AES-128 uses a 128-bit key and executes 10 rounds (Rounds 1-9 include all 4 transformations, while Round 10 omits MixColumns).'
    },
    {
      question: 'Which AES step is omitted during the final round of encryption?',
      options: ['AddRoundKey', 'MixColumns', 'SubBytes', 'ShiftRows'],
      correct: 1,
      explanation: 'MixColumns is omitted in the final round to preserve symmetry between encryption and decryption algorithms.'
    },
    {
      question: 'What mathematical field is used during the MixColumns polynomial matrix multiplication?',
      options: ['Galois Field GF(2^8)', 'Prime Field FP(257)', 'Integer Modulo 2^32', 'Complex Matrix Field'],
      correct: 0,
      explanation: 'MixColumns operates over the finite Galois Field GF(2^8) modulo the irreducible polynomial x^8 + x^4 + x^3 + x + 1.'
    }
  ];

  const currentQuestion = quizQuestions[quizIndex];

  const handleOptionSelect = (optionIdx: number) => {
    if (isAnswerChecked) return;
    setSelectedOption(optionIdx);
  };

  const handleCheckAnswer = () => {
    if (selectedOption === null) return;
    setIsAnswerChecked(true);
    if (selectedOption === currentQuestion.correct) {
      setQuizScore((prev) => prev + 1);
      triggerToast('Correct! Great cryptographic knowledge.');
    } else {
      triggerToast('Incorrect. Read the explanation below!');
    }
  };

  const handleNextQuiz = () => {
    setSelectedOption(null);
    setIsAnswerChecked(false);
    setQuizIndex((prev) => (prev + 1) % quizQuestions.length);
  };

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
              title="AES Explorer Dashboard"
            >
              <div className="w-10 h-10 rounded-xl bg-[#142380] text-white flex items-center justify-center shadow-md group-hover:bg-[#2f3c97] transition-colors shrink-0">
                <Shield className="w-5 h-5 fill-white" />
              </div>
              {!isSidebarCollapsed && (
                <div className="min-w-0">
                  <h1 className="text-base font-extrabold text-[#142380] leading-tight truncate">
                    AES Explorer
                  </h1>
                  <p className="text-[11px] font-semibold text-[#767683] uppercase tracking-wider truncate">
                    Academic Edition
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
              className={`w-full flex items-center rounded-xl font-extrabold text-xs sm:text-sm text-[#142380] bg-[#e7eefe] border-r-4 border-[#142380] transition-all cursor-pointer ${
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
            onClick={() => setActiveTab('visualization')}
            className={`w-full py-3 bg-[#142380] hover:bg-[#2f3c97] text-white rounded-2xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs ${
              isSidebarCollapsed ? 'px-0' : 'px-4'
            }`}
          >
            <PlusCircle className="w-4 h-4 text-[#ff9a5b]" />
            {!isSidebarCollapsed && <span>New Session</span>}
          </button>

          <button
            onClick={() => setActiveTab('documentation')}
            title="Documentation"
            className={`w-full flex items-center rounded-xl font-semibold text-xs text-[#454652] hover:bg-[#f0f3ff] hover:text-[#142380] transition-all cursor-pointer ${
              isSidebarCollapsed ? 'justify-center p-2.5' : 'px-4 py-2.5 gap-3'
            }`}
          >
            <Settings className="w-4 h-4 text-[#767683] shrink-0" />
            {!isSidebarCollapsed && <span>Documentation</span>}
          </button>

          <button
            onClick={() => setActiveTab('basics')}
            title="Help & FAQ"
            className={`w-full flex items-center rounded-xl font-semibold text-xs text-[#454652] hover:bg-[#f0f3ff] hover:text-[#142380] transition-all cursor-pointer ${
              isSidebarCollapsed ? 'justify-center p-2.5' : 'px-4 py-2.5 gap-3'
            }`}
          >
            <HelpCircle className="w-4 h-4 text-[#767683] shrink-0" />
            {!isSidebarCollapsed && <span>Support</span>}
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
                    <h2 className="font-extrabold text-[#142380] text-base">AES Explorer</h2>
                    <p className="text-[10px] text-[#767683] font-semibold">Academic Edition</p>
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
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[#142380] bg-[#e7eefe] font-bold text-sm"
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

            {/* Top Search Bar */}
            <div className="relative w-full max-w-md">
              <Search className="w-4 h-4 text-[#767683] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search learning topics (e.g. SubBytes, MixColumns)..."
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
                    <h4 className="text-xs font-extrabold text-[#151c27] uppercase tracking-wider">Learning Alerts</h4>
                    <span className="text-[10px] font-bold text-[#142380] bg-[#e7eefe] px-2 py-0.5 rounded-full">New Topic</span>
                  </div>
                  <div className="p-2.5 bg-[#F7F8FC] rounded-xl border border-[#D9DDE7]/50 space-y-0.5">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-[#142380]">Quiz Module Unlocked</span>
                      <span className="text-[10px] text-[#767683]">Today</span>
                    </div>
                    <p className="text-[11px] text-[#454652]">Test your knowledge on MixColumns and S-Box substitutions.</p>
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
                    <span>Preferences</span>
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
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#D9DDE7] pb-6">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 bg-[#e7eefe] text-[#142380] px-3 py-1 rounded-full text-xs font-bold">
                <BookOpen className="w-3.5 h-3.5 text-[#2f3c97]" />
                <span>Interactive Pedagogy Module</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#151c27] tracking-tight">
                AES Learning Center
              </h1>
              <p className="text-xs sm:text-sm text-[#454652] max-w-2xl leading-relaxed">
                Build a robust understanding of the Advanced Encryption Standard through structured learning, interactive content, and practical explanations.
              </p>
            </div>

            {/* Right Side Header Controls */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  setBookmarked(!bookmarked);
                  triggerToast(bookmarked ? 'Topic removed from bookmarks.' : 'Learning Center bookmarked!');
                }}
                className={`p-3 rounded-2xl border transition-all cursor-pointer ${
                  bookmarked
                    ? 'bg-[#142380] text-white border-[#142380]'
                    : 'bg-white border-[#D9DDE7] text-[#142380] hover:bg-[#f0f3ff]'
                }`}
                title="Bookmark Learning Center"
              >
                <Bookmark className={`w-5 h-5 ${bookmarked ? 'fill-white' : ''}`} />
              </button>

              <button
                onClick={() => setActiveTab('visualization')}
                className="px-5 py-3 bg-[#142380] hover:bg-[#2f3c97] text-white font-extrabold text-xs sm:text-sm rounded-2xl flex items-center gap-2 transition-all shadow-md cursor-pointer"
              >
                <span>Launch Interactive Visualizer</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* ================= 4. LEARNING PROGRESS CARD ================= */}
          <div className="bg-white border border-[#D9DDE7] rounded-3xl p-6 shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              
              {/* Radial Donut Gauge */}
              <div className="relative w-28 h-28 flex items-center justify-center shrink-0">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle
                    className="text-[#f0f3ff]"
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="10"
                  />
                  <circle
                    className="text-[#142380] transition-all duration-1000 ease-out"
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="10"
                    strokeDasharray="251.2"
                    strokeDashoffset="62.8" /* 75% completed */
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-xl font-extrabold text-[#142380]">75%</span>
                  <span className="text-[9px] font-bold text-[#767683] uppercase">Progress</span>
                </div>
              </div>

              {/* Progress Text & Badges */}
              <div className="space-y-2 text-center sm:text-left">
                <h3 className="text-base font-extrabold text-[#151c27]">Your Learning Journey</h3>
                <p className="text-xs text-[#454652]">You have completed 15 out of 20 core cryptographic lessons.</p>
                <div className="flex flex-wrap gap-3 justify-center sm:justify-start pt-1">
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#005221] bg-[#e8f8ee] px-3 py-1 rounded-full">
                    <CheckCircle2 className="w-4 h-4 text-[#005221]" />
                    <span>15/20 Lessons Completed</span>
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#96490d] bg-[#ffdbc9]/60 px-3 py-1 rounded-full">
                    <Clock className="w-4 h-4 text-[#96490d]" />
                    <span>5 Topics Remaining</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Last Lesson Viewed Widget */}
            <div className="bg-[#F7F8FC] border border-[#D9DDE7] p-4 rounded-2xl w-full md:w-64 space-y-2 shrink-0">
              <span className="text-[10px] font-extrabold text-[#767683] uppercase tracking-wider block">Last Lesson Viewed</span>
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-[#96490d]" />
                <span className="text-sm font-extrabold text-[#151c27]">MixColumns Galois Field</span>
              </div>
              <button
                onClick={() => {
                  setSelectedStage('mixcols');
                  triggerToast('Jumped to MixColumns lesson module!');
                }}
                className="w-full py-2 bg-[#2f3c97] hover:bg-[#142380] text-white text-xs font-extrabold rounded-xl transition-all cursor-pointer shadow-2xs"
              >
                Continue Lesson
              </button>
            </div>
          </div>

          {/* ================= 5. FEATURED LEARNING MODULES BENTO GRID ================= */}
          <div className="space-y-4">
            <h3 className="text-lg font-extrabold text-[#151c27]">Featured Learning Modules</h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Module 1: What is AES? */}
              <div className="bg-white border border-[#D9DDE7] hover:border-[#142380] p-6 rounded-3xl shadow-xs transition-all hover:-translate-y-1 space-y-4 group">
                <div className="w-12 h-12 rounded-2xl bg-[#dfe0ff] text-[#142380] flex items-center justify-center group-hover:scale-110 transition-transform">
                  <BookOpen className="w-6 h-6 text-[#142380]" />
                </div>
                <div>
                  <h4 className="text-base font-extrabold text-[#151c27]">What is AES?</h4>
                  <p className="text-xs text-[#454652] leading-relaxed mt-1">
                    Introduction to symmetric key algorithms and why AES became the global standard for securing digital information under NIST FIPS 197.
                  </p>
                </div>
              </div>

              {/* Module 2: Encryption vs Decryption */}
              <div className="bg-white border border-[#D9DDE7] hover:border-[#96490d] p-6 rounded-3xl shadow-xs transition-all hover:-translate-y-1 space-y-4 group">
                <div className="w-12 h-12 rounded-2xl bg-[#ffdbc9] text-[#753400] flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Lock className="w-6 h-6 text-[#96490d]" />
                </div>
                <div>
                  <h4 className="text-base font-extrabold text-[#151c27]">Encryption vs Decryption</h4>
                  <p className="text-xs text-[#454652] leading-relaxed mt-1">
                    Understand the symmetrical inverse operations required to convert plaintext into scrambled ciphertext and safely recover readable message content.
                  </p>
                </div>
              </div>

              {/* Module 3: AES Encryption Process Overview */}
              <div className="bg-white border border-[#D9DDE7] hover:border-[#005221] p-6 rounded-3xl shadow-xs transition-all hover:-translate-y-1 space-y-4 group">
                <div className="w-12 h-12 rounded-2xl bg-[#6bff8f]/30 text-[#005321] flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Layers className="w-6 h-6 text-[#005321]" />
                </div>
                <div>
                  <h4 className="text-base font-extrabold text-[#151c27]">AES Transformation Pipeline</h4>
                  <p className="text-xs text-[#454652] leading-relaxed mt-1">
                    Comprehensive overview of Key Expansion, State Matrix initialization, SubBytes, ShiftRows, MixColumns, and AddRoundKey operations.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ================= 6. INTERACTIVE AES FLOW & STAGE INSPECTOR ================= */}
          <div className="bg-white border border-[#D9DDE7] rounded-3xl p-6 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#f0f3ff] pb-4">
              <div>
                <h3 className="text-base font-extrabold text-[#151c27]">Interactive AES Transformation Flow</h3>
                <p className="text-xs text-[#767683]">Click any stage to inspect mathematical formulas, matrix operations, and purpose</p>
              </div>
              <span className="text-xs font-bold text-[#142380] bg-[#e7eefe] px-3 py-1 rounded-full">
                Interactive Module
              </span>
            </div>

            {/* Stage Pipeline Selector */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {[
                { id: 'keyexp', name: 'Key Expansion', icon: Key, num: '1' },
                { id: 'subbytes', name: 'SubBytes', icon: RefreshCw, num: '2' },
                { id: 'shiftrows', name: 'ShiftRows', icon: ArrowLeftRight, num: '3' },
                { id: 'mixcols', name: 'MixColumns', icon: Columns, num: '4' },
                { id: 'addroundkey', name: 'AddRoundKey', icon: Layers, num: '5' }
              ].map((stage) => {
                const Icon = stage.icon;
                const isSelected = selectedStage === stage.id;
                return (
                  <button
                    key={stage.id}
                    onClick={() => setSelectedStage(stage.id as any)}
                    className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-3 ${
                      isSelected
                        ? 'bg-[#142380] text-white border-[#142380] shadow-md scale-102'
                        : 'bg-[#F7F8FC] border-[#D9DDE7] text-[#151c27] hover:bg-[#e7eefe]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs ${
                        isSelected ? 'bg-white/20 text-white' : 'bg-white text-[#142380] border border-[#D9DDE7]'
                      }`}>
                        {stage.num}
                      </div>
                      <Icon className={`w-4 h-4 ${isSelected ? 'text-[#ff9a5b]' : 'text-[#767683]'}`} />
                    </div>
                    <span className="text-xs font-extrabold">{stage.name}</span>
                  </button>
                );
              })}
            </div>

            {/* Stage Detailed Inspector Panel */}
            <div className="bg-[#F7F8FC] border border-[#D9DDE7] p-6 rounded-2xl space-y-4">
              {selectedStage === 'keyexp' && (
                <div className="space-y-3 animate-in fade-in">
                  <div className="flex items-center gap-2 text-[#142380]">
                    <Key className="w-5 h-5" />
                    <h4 className="text-sm font-extrabold text-[#151c27]">1. Key Expansion (Rijndael Key Schedule)</h4>
                  </div>
                  <p className="text-xs text-[#454652] leading-relaxed">
                    The 128-bit master key is expanded into 11 round keys (44 32-bit words or 176 total bytes) using RotWord cyclic byte rotation, SubWord S-Box substitutions, and Round Constant (Rcon) XOR addition. This guarantees distinct keys for each round.
                  </p>
                  <div className="p-3 bg-white rounded-xl border border-[#D9DDE7] font-mono text-xs text-[#142380] font-bold">
                    w[i] = w[i-1] ⊕ w[i-4] ⊕ SubWord(RotWord(w[i-1])) ⊕ Rcon[i/4]
                  </div>
                </div>
              )}

              {selectedStage === 'subbytes' && (
                <div className="space-y-3 animate-in fade-in">
                  <div className="flex items-center gap-2 text-[#142380]">
                    <RefreshCw className="w-5 h-5" />
                    <h4 className="text-sm font-extrabold text-[#151c27]">2. SubBytes Transformation (Non-linear Substitution)</h4>
                  </div>
                  <p className="text-xs text-[#454652] leading-relaxed">
                    Provides non-linearity to frustrate linear and differential cryptanalysis. Each byte in the 4x4 State matrix is independently replaced with a byte from a precomputed 16x16 Substitution Box (S-Box), derived from GF(2^8) multiplicative inverses.
                  </p>
                  <div className="p-3 bg-white rounded-xl border border-[#D9DDE7] font-mono text-xs text-[#142380] font-bold">
                    State[r,c] = SBox[State[r,c]]  | Example: 0x53 → 0xED
                  </div>
                </div>
              )}

              {selectedStage === 'shiftrows' && (
                <div className="space-y-3 animate-in fade-in">
                  <div className="flex items-center gap-2 text-[#96490d]">
                    <ArrowLeftRight className="w-5 h-5" />
                    <h4 className="text-sm font-extrabold text-[#151c27]">3. ShiftRows Permutation (Horizontal Diffusion)</h4>
                  </div>
                  <p className="text-xs text-[#454652] leading-relaxed">
                    Provides horizontal transposition diffusion across state columns. Row 0 remains unchanged, Row 1 shifts 1 byte left, Row 2 shifts 2 bytes left, and Row 3 shifts 3 bytes left cyclically.
                  </p>
                  <div className="p-3 bg-white rounded-xl border border-[#D9DDE7] font-mono text-xs text-[#96490d] font-bold">
                    Row 0: no shift | Row 1: &lt;&lt; 1 byte | Row 2: &lt;&lt; 2 bytes | Row 3: &lt;&lt; 3 bytes
                  </div>
                </div>
              )}

              {selectedStage === 'mixcols' && (
                <div className="space-y-3 animate-in fade-in">
                  <div className="flex items-center gap-2 text-[#142380]">
                    <Columns className="w-5 h-5" />
                    <h4 className="text-sm font-extrabold text-[#151c27]">4. MixColumns Galois Field Multiplication (Vertical Diffusion)</h4>
                  </div>
                  <p className="text-xs text-[#454652] leading-relaxed">
                    Provides vertical diffusion across state rows. Each column of 4 bytes is treated as a 4-term polynomial over GF(2^8) and multiplied by a fixed matrix modulo x^4 + 1. (Omitted in the final round 10).
                  </p>
                  <div className="p-3 bg-white rounded-xl border border-[#D9DDE7] font-mono text-xs text-[#142380] font-bold">
                    Matrix Mult: [[02,03,01,01], [01,02,03,01], [01,01,02,03], [03,01,01,02]] × Column
                  </div>
                </div>
              )}

              {selectedStage === 'addroundkey' && (
                <div className="space-y-3 animate-in fade-in">
                  <div className="flex items-center gap-2 text-[#005221]">
                    <Layers className="w-5 h-5" />
                    <h4 className="text-sm font-extrabold text-[#151c27]">5. AddRoundKey (Key Integration)</h4>
                  </div>
                  <p className="text-xs text-[#454652] leading-relaxed">
                    Combines the secret key schedule with state memory. Each byte of the State matrix is bitwise XORed (⊕) with the corresponding byte from the current round's 128-bit key.
                  </p>
                  <div className="p-3 bg-white rounded-xl border border-[#D9DDE7] font-mono text-xs text-[#005221] font-bold">
                    State[r,c] = State[r,c] ⊕ RoundKey[r,c]
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ================= 7. AES VARIANTS COMPARISON CARDS ================= */}
          <div className="space-y-4">
            <h3 className="text-lg font-extrabold text-[#151c27]">AES Variants Comparison</h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* AES-128 */}
              <div className="bg-white border border-[#D9DDE7] p-6 rounded-3xl shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-[#142380] text-white">
                    AES-128
                  </span>
                  <span className="text-xs font-bold text-[#767683]">Standard</span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-[#767683]">Key Length:</span>
                    <span className="font-extrabold text-[#151c27]">128 bits (16 bytes)</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-[#767683]">Rounds Executed:</span>
                    <span className="font-extrabold text-[#142380]">10 Rounds</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-[#767683]">Primary Use Case:</span>
                    <span className="font-bold text-[#005221]">Web & Mobile Apps</span>
                  </div>
                </div>
                <p className="text-xs text-[#454652] leading-relaxed pt-2 border-t border-[#D9DDE7]/60">
                  Optimal balance of processing speed and security. Used in SSL/TLS HTTPS web traffic, wireless WPA2/WPA3, and mobile app encryption.
                </p>
              </div>

              {/* AES-192 */}
              <div className="bg-white border border-[#D9DDE7] p-6 rounded-3xl shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-[#96490d] text-white">
                    AES-192
                  </span>
                  <span className="text-xs font-bold text-[#767683]">Enhanced</span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-[#767683]">Key Length:</span>
                    <span className="font-extrabold text-[#151c27]">192 bits (24 bytes)</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-[#767683]">Rounds Executed:</span>
                    <span className="font-extrabold text-[#96490d]">12 Rounds</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-[#767683]">Primary Use Case:</span>
                    <span className="font-bold text-[#96490d]">Enterprise Systems</span>
                  </div>
                </div>
                <p className="text-xs text-[#454652] leading-relaxed pt-2 border-t border-[#D9DDE7]/60">
                  Provides increased protection against future key search algorithms. Ideal for high-value enterprise database storage and financial networks.
                </p>
              </div>

              {/* AES-256 */}
              <div className="bg-white border border-[#D9DDE7] p-6 rounded-3xl shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-[#005221] text-white">
                    AES-256
                  </span>
                  <span className="text-xs font-bold text-[#767683]">Maximum</span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-[#767683]">Key Length:</span>
                    <span className="font-extrabold text-[#151c27]">256 bits (32 bytes)</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-[#767683]">Rounds Executed:</span>
                    <span className="font-extrabold text-[#005221]">14 Rounds</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-[#767683]">Primary Use Case:</span>
                    <span className="font-bold text-[#005221]">Military & Government</span>
                  </div>
                </div>
                <p className="text-xs text-[#454652] leading-relaxed pt-2 border-t border-[#D9DDE7]/60">
                  Certified for TOP SECRET classified government communications. Requires 2^256 key operations, providing quantum-resistant protection.
                </p>
              </div>
            </div>
          </div>

          {/* ================= 8. WHY AES IS SECURE ================= */}
          <div className="bg-white border border-[#D9DDE7] rounded-3xl p-6 shadow-xs space-y-4">
            <h3 className="text-lg font-extrabold text-[#151c27]">Why AES Is Cryptographically Secure</h3>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-[#F7F8FC] p-4 rounded-2xl border border-[#D9DDE7] space-y-2">
                <div className="w-8 h-8 rounded-xl bg-[#142380] text-white flex items-center justify-center font-bold text-xs">
                  <Shield className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-extrabold text-[#151c27]">Multiple Transformation Rounds</h4>
                <p className="text-[11px] text-[#454652] leading-relaxed">
                  Executing 10 to 14 iterative rounds ensures high avalanche amplification, so changing 1 input bit flip changes ~50% of output bits.
                </p>
              </div>

              <div className="bg-[#F7F8FC] p-4 rounded-2xl border border-[#D9DDE7] space-y-2">
                <div className="w-8 h-8 rounded-xl bg-[#96490d] text-white flex items-center justify-center font-bold text-xs">
                  <RefreshCw className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-extrabold text-[#151c27]">Non-Linear Confusion</h4>
                <p className="text-[11px] text-[#454652] leading-relaxed">
                  SubBytes S-Box substitutions introduce non-linear algebraic complexity, preventing linear differential attack vectors.
                </p>
              </div>

              <div className="bg-[#F7F8FC] p-4 rounded-2xl border border-[#D9DDE7] space-y-2">
                <div className="w-8 h-8 rounded-xl bg-[#005221] text-white flex items-center justify-center font-bold text-xs">
                  <Columns className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-extrabold text-[#151c27]">Polynomial Diffusion</h4>
                <p className="text-[11px] text-[#454652] leading-relaxed">
                  ShiftRows and MixColumns spread single-byte changes across all 16 bytes of the state matrix within just 2 rounds.
                </p>
              </div>

              <div className="bg-[#F7F8FC] p-4 rounded-2xl border border-[#D9DDE7] space-y-2">
                <div className="w-8 h-8 rounded-xl bg-[#2f3c97] text-white flex items-center justify-center font-bold text-xs">
                  <Key className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-extrabold text-[#151c27]">Unbounded Key Space</h4>
                <p className="text-[11px] text-[#454652] leading-relaxed">
                  AES-128 key space has 3.4×10^38 combinations. Even the fastest supercomputers would take billions of years to brute-force.
                </p>
              </div>
            </div>
          </div>

          {/* ================= 9. AES APPLICATIONS ================= */}
          <div className="space-y-4">
            <h3 className="text-lg font-extrabold text-[#151c27]">Real-World AES Applications</h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {[
                { title: 'Online Banking', desc: 'Financial TLS 1.3', icon: CreditCard },
                { title: 'Secure Messaging', desc: 'Signal & WhatsApp', icon: Smartphone },
                { title: 'Cloud Storage', desc: 'Drive & S3 at-rest', icon: Cloud },
                { title: 'Gov Systems', desc: 'Classified Top Secret', icon: Globe },
                { title: 'Wireless WiFi', desc: 'WPA2 & WPA3 PSK', icon: Wifi },
                { title: 'E-Commerce', desc: 'PCI-DSS Payment Gateways', icon: Cpu }
              ].map((app, idx) => {
                const Icon = app.icon;
                return (
                  <div
                    key={idx}
                    className="bg-white border border-[#D9DDE7] p-4 rounded-2xl text-center space-y-2 hover:border-[#142380] transition-all group"
                  >
                    <div className="w-10 h-10 rounded-2xl bg-[#F7F8FC] text-[#142380] group-hover:bg-[#142380] group-hover:text-white mx-auto flex items-center justify-center transition-colors">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h4 className="text-xs font-extrabold text-[#151c27]">{app.title}</h4>
                    <p className="text-[10px] text-[#767683] font-semibold">{app.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ================= 10. SEARCHABLE INTERACTIVE GLOSSARY ================= */}
          <div className="bg-white border border-[#D9DDE7] rounded-3xl p-6 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#f0f3ff] pb-4">
              <div>
                <h3 className="text-base font-extrabold text-[#151c27]">Cryptographic Terminology Glossary</h3>
                <p className="text-xs text-[#767683]">Search definitions from Chapter 1 and academic literature</p>
              </div>

              {/* Glossary Search Input */}
              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 text-[#767683] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={glossarySearch}
                  onChange={(e) => setGlossarySearch(e.target.value)}
                  placeholder="Filter terms (e.g. SubBytes)..."
                  className="w-full bg-[#F7F8FC] border border-[#D9DDE7] focus:border-[#142380] text-xs pl-10 pr-4 py-2 rounded-xl outline-none font-medium"
                />
              </div>
            </div>

            {/* Glossary Terms Accordion */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {filteredGlossary.map((item) => {
                const isExpanded = expandedTerm === item.term.toLowerCase();
                return (
                  <div
                    key={item.term}
                    className="bg-[#F7F8FC] border border-[#D9DDE7] rounded-2xl overflow-hidden transition-all"
                  >
                    <button
                      onClick={() => setExpandedTerm(isExpanded ? null : item.term.toLowerCase())}
                      className="w-full p-4 text-left flex items-center justify-between gap-3 hover:bg-[#e7eefe]/50 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-extrabold text-[#142380] bg-[#e7eefe] px-2.5 py-1 rounded-lg">
                          {item.term}
                        </span>
                        <span className="text-xs font-extrabold text-[#151c27]">{item.title}</span>
                      </div>
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4 text-[#767683]" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-[#767683]" />
                      )}
                    </button>

                    {isExpanded && (
                      <div className="p-4 pt-0 border-t border-[#D9DDE7]/60 bg-white space-y-2 animate-in fade-in">
                        <span className="text-[10px] font-bold text-[#96490d] uppercase tracking-wider block pt-2">
                          Category: {item.category}
                        </span>
                        <p className="text-xs text-[#454652] leading-relaxed">
                          {item.definition}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* ================= 11. KNOWLEDGE CHECK (INTERACTIVE QUIZ) ================= */}
          <div className="bg-gradient-to-br from-[#142380] to-[#2f3c97] text-white rounded-3xl p-6 sm:p-8 shadow-md space-y-6">
            <div className="flex items-center justify-between border-b border-white/20 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center">
                  <QuestionIcon className="w-5 h-5 text-[#ff9a5b]" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold">Knowledge Check (Quiz)</h3>
                  <p className="text-xs opacity-80">Test your understanding of AES operations</p>
                </div>
              </div>
              <span className="text-xs font-bold text-[#ff9a5b] bg-white/10 px-3 py-1 rounded-full">
                Question {quizIndex + 1} of {quizQuestions.length} | Score: {quizScore}
              </span>
            </div>

            {/* Quiz Question Box */}
            <div className="space-y-4">
              <h4 className="text-sm sm:text-base font-extrabold leading-snug">
                {currentQuestion.question}
              </h4>

              {/* Options List */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {currentQuestion.options.map((option, idx) => {
                  let isSelected = selectedOption === idx;
                  let isCorrect = idx === currentQuestion.correct;
                  let buttonStyle = 'bg-white/10 border-white/20 hover:bg-white/20 text-white';

                  if (isAnswerChecked) {
                    if (isCorrect) {
                      buttonStyle = 'bg-[#005221] border-[#005221] text-white font-extrabold';
                    } else if (isSelected && !isCorrect) {
                      buttonStyle = 'bg-[#EF4444] border-[#EF4444] text-white font-extrabold';
                    }
                  } else if (isSelected) {
                    buttonStyle = 'bg-white text-[#142380] font-extrabold';
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleOptionSelect(idx)}
                      disabled={isAnswerChecked}
                      className={`p-4 rounded-2xl border text-left text-xs font-bold transition-all cursor-pointer flex items-center justify-between gap-2 ${buttonStyle}`}
                    >
                      <span>{option}</span>
                      {isAnswerChecked && isCorrect && <Check className="w-4 h-4 text-white shrink-0" />}
                    </button>
                  );
                })}
              </div>

              {/* Explanation & Action Panel */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
                {isAnswerChecked ? (
                  <div className="p-3 bg-white/10 backdrop-blur-md rounded-xl text-xs leading-relaxed flex-1">
                    <p className="font-semibold">{currentQuestion.explanation}</p>
                  </div>
                ) : (
                  <span className="text-xs opacity-70">Select an option and click "Check Answer"</span>
                )}

                {!isAnswerChecked ? (
                  <button
                    onClick={handleCheckAnswer}
                    disabled={selectedOption === null}
                    className="px-6 py-3 bg-[#ff9a5b] hover:bg-[#ff8a40] disabled:opacity-50 text-[#321200] font-extrabold text-xs rounded-xl transition-all cursor-pointer shadow-xs shrink-0"
                  >
                    Check Answer
                  </button>
                ) : (
                  <button
                    onClick={handleNextQuiz}
                    className="px-6 py-3 bg-white text-[#142380] font-extrabold text-xs rounded-xl hover:bg-[#f0f3ff] transition-all cursor-pointer shadow-xs shrink-0 flex items-center gap-2"
                  >
                    <span>Next Question</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* ================= 12. RECOMMENDED LEARNING PATH ROADMAP ================= */}
          <div className="bg-white border border-[#D9DDE7] rounded-3xl p-6 shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b border-[#f0f3ff] pb-4">
              <div>
                <h3 className="text-base font-extrabold text-[#151c27]">Recommended Learning Roadmap</h3>
                <p className="text-xs text-[#767683]">Structured step-by-step curriculum for mastering AES</p>
              </div>
              <span className="text-xs font-bold text-[#005221] bg-[#e8f8ee] px-3 py-1 rounded-full">
                Step 4 of 6 Active
              </span>
            </div>

            {/* Horizontal Step Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
              {[
                { step: '1', title: 'Learn AES Basics', status: 'Completed', active: false },
                { step: '2', title: 'Understand Key Expansion', status: 'Completed', active: false },
                { step: '3', title: 'Explore State Matrix', status: 'Completed', active: false },
                { step: '4', title: 'Study Each Transformation', status: 'In Progress', active: true },
                { step: '5', title: 'Run Visualization Session', status: 'Next Up', active: false },
                { step: '6', title: 'Review Session History', status: 'Next Up', active: false }
              ].map((item) => (
                <div
                  key={item.step}
                  className={`p-4 rounded-2xl border space-y-2 text-center transition-all ${
                    item.active
                      ? 'bg-[#142380] text-white border-[#142380] shadow-md'
                      : item.status === 'Completed'
                      ? 'bg-[#e8f8ee]/60 border-[#005221]/30 text-[#005221]'
                      : 'bg-[#F7F8FC] border-[#D9DDE7] text-[#767683]'
                  }`}
                >
                  <div className={`w-7 h-7 rounded-full text-xs font-bold mx-auto flex items-center justify-center ${
                    item.active
                      ? 'bg-white text-[#142380]'
                      : item.status === 'Completed'
                      ? 'bg-[#005221] text-white'
                      : 'bg-[#D9DDE7] text-[#151c27]'
                  }`}>
                    {item.status === 'Completed' ? <Check className="w-4 h-4" /> : item.step}
                  </div>
                  <h4 className="text-xs font-extrabold leading-tight">{item.title}</h4>
                  <span className="text-[10px] font-semibold block">{item.status}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </main>

    </div>
  );
};
