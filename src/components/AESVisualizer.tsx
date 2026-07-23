import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  DisplayFormat,
  AESTraceResult,
  StateMatrixStep,
  RoundKeyStep
} from '../types';
import {
  runAESTrace,
  parseInputBytes,
  bytesToHexFormatted,
  bytesToAscii,
  PRESET_EXAMPLES,
  SBOX
} from '../lib/aes';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  RotateCcw,
  Sparkles,
  Info,
  Key,
  Grid,
  FileCode,
  Copy,
  Check,
  Zap,
  ArrowRight,
  ArrowLeft,
  ChevronsLeft,
  PanelLeftClose,
  PanelLeftOpen,
  PanelRightClose,
  PanelRightOpen,
  ChevronDown,
  ChevronUp,
  LayoutDashboard,
  CheckCircle2,
  Circle,
  HelpCircle,
  Settings,
  LogOut,
  Lightbulb,
  Eye,
  EyeOff,
  Wand2,
  ShieldCheck,
  Cpu,
  ArrowDown,
  Layers,
  Clock,
  Lock,
  BookOpen,
  BarChart2,
  Binary,
  ExternalLink,
  Brain,
  ChevronRight,
  RefreshCw
} from 'lucide-react';

export const AESVisualizer: React.FC = () => {
  // Input States
  const [plaintextInput, setPlaintextInput] = useState<string>('HELLO WORLD 2026');
  const [keyInput, setKeyInput] = useState<string>('AES SECRET KEY!!');
  const [isHexMode, setIsHexMode] = useState<boolean>(false);
  const [selectedAlgo, setSelectedAlgo] = useState<string>('128');
  const [showKey, setShowKey] = useState<boolean>(false);

  // Session duration timer state
  const [sessionSeconds, setSessionSeconds] = useState<number>(0);

  // Sidebar Collapsible States
  const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState<boolean>(true);
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState<boolean>(true);
  const [isObjectivesOpen, setIsObjectivesOpen] = useState<boolean>(true);
  const [isWhyOpen, setIsWhyOpen] = useState<boolean>(true);
  const [isMatrixOpen, setIsMatrixOpen] = useState<boolean>(true);
  const [isKeyExpOpen, setIsKeyExpOpen] = useState<boolean>(true);
  const [expandedKbItem, setExpandedKbItem] = useState<string | null>('hex');

  // Key Expansion Animation State
  const [keyExpRound, setKeyExpRound] = useState<number>(0);
  const [hoveredRoundKey, setHoveredRoundKey] = useState<number | null>(null);

  // View Controls
  const [displayFormat, setDisplayFormat] = useState<DisplayFormat>('hex');
  const [activeTab, setActiveTab] = useState<'trace' | 'keyExpansion' | 'finalCiphertext'>('trace');
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [hoveredCell, setHoveredCell] = useState<{ r: number; c: number } | null>(null);

  // Trace Step State
  const [currentStepIdx, setCurrentStepIdx] = useState<number>(0);
  const [activeAddKeyByteIdx, setActiveAddKeyByteIdx] = useState<number>(0);
  const [activeSubByteIdx, setActiveSubByteIdx] = useState<number>(0);
  const [activeShiftRowIdx, setActiveShiftRowIdx] = useState<number>(0);
  const [activeMixColIdx, setActiveMixColIdx] = useState<number>(0);
  const [showFullSBoxModal, setShowFullSBoxModal] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playSpeedMs, setPlaySpeedMs] = useState<number>(1200);

  // Reset active byte indices on step change
  useEffect(() => {
    setActiveAddKeyByteIdx(0);
    setActiveSubByteIdx(0);
    setActiveShiftRowIdx(0);
    setActiveMixColIdx(0);
  }, [currentStepIdx]);

  // Session timer ticker
  useEffect(() => {
    const timer = setInterval(() => {
      setSessionSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Format session duration as mm:ss
  const formattedSessionDuration = useMemo(() => {
    const mins = Math.floor(sessionSeconds / 60);
    const secs = sessionSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, [sessionSeconds]);

  // Compute key length in bits
  const keyLengthBits = useMemo(() => {
    if (selectedAlgo === '192') return 192;
    if (selectedAlgo === '256') return 256;
    return 128;
  }, [selectedAlgo]);

  // Compute AES Trace
  const trace: AESTraceResult = useMemo(() => {
    const ptBytes = parseInputBytes(plaintextInput, isHexMode);
    const keyBytes = parseInputBytes(keyInput, isHexMode);
    return runAESTrace(ptBytes, keyBytes);
  }, [plaintextInput, keyInput, isHexMode]);

  // Compute progress percentage
  const sessionProgressPct = useMemo(() => {
    if (trace.steps.length <= 1) return 0;
    return Math.round((currentStepIdx / (trace.steps.length - 1)) * 100);
  }, [currentStepIdx, trace.steps.length]);

  // Handle Play / Pause Auto Progress
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying) {
      if (activeTab === 'keyExpansion') {
        timer = setInterval(() => {
          setKeyExpRound((prev) => {
            if (prev >= 10) {
              setIsPlaying(false);
              return 10;
            }
            return prev + 1;
          });
        }, playSpeedMs);
      } else {
        const curOp = trace.steps[currentStepIdx]?.operation;
        timer = setInterval(() => {
          if (curOp === 'addRoundKey') {
            setActiveAddKeyByteIdx((prev) => {
              if (prev >= 15) {
                setIsPlaying(false);
                return 15;
              }
              return prev + 1;
            });
          } else if (curOp === 'subBytes') {
            setActiveSubByteIdx((prev) => {
              if (prev >= 15) {
                setIsPlaying(false);
                return 15;
              }
              return prev + 1;
            });
          } else if (curOp === 'shiftRows') {
            setActiveShiftRowIdx((prev) => {
              if (prev >= 3) {
                setIsPlaying(false);
                return 3;
              }
              return prev + 1;
            });
          } else if (curOp === 'mixColumns') {
            setActiveMixColIdx((prev) => {
              if (prev >= 3) {
                setIsPlaying(false);
                return 3;
              }
              return prev + 1;
            });
          } else {
            setCurrentStepIdx((prev) => {
              if (prev >= trace.steps.length - 1) {
                setIsPlaying(false);
                return prev;
              }
              return prev + 1;
            });
          }
        }, playSpeedMs);
      }
    }
    return () => clearInterval(timer);
  }, [isPlaying, activeTab, playSpeedMs, trace.steps, currentStepIdx]);

  const currentStep: StateMatrixStep = trace.steps[currentStepIdx] || trace.steps[0];

  // Helper for preset selection
  const handleSelectPreset = (presetId: string) => {
    const preset = PRESET_EXAMPLES.find((p) => p.id === presetId);
    if (!preset) return;
    if (preset.id === 'nist-official' || preset.id === 'zero-vector') {
      setIsHexMode(true);
      setPlaintextInput(preset.plaintext);
      setKeyInput(preset.key);
    } else {
      setIsHexMode(false);
      setPlaintextInput(preset.plaintext);
      setKeyInput(preset.key);
    }
    setCurrentStepIdx(0);
    setIsPlaying(false);
  };

  // Generate Random Key Helper
  const handleGenerateRandomKey = () => {
    if (isHexMode) {
      const hexChars = '0123456789abcdef';
      let randomHex = '';
      for (let i = 0; i < 32; i++) {
        randomHex += hexChars[Math.floor(Math.random() * 16)];
      }
      setKeyInput(randomHex);
    } else {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
      let randomKey = '';
      for (let i = 0; i < 16; i++) {
        randomKey += chars[Math.floor(Math.random() * chars.length)];
      }
      setKeyInput(randomKey);
    }
    setCurrentStepIdx(0);
  };

  // Helper formatting cell value according to display format
  const formatCellValue = (byteVal: number): string => {
    switch (displayFormat) {
      case 'hex':
        return byteVal.toString(16).padStart(2, '0').toUpperCase();
      case 'dec':
        return byteVal.toString(10).padStart(3, '0');
      case 'ascii':
        return byteVal >= 32 && byteVal <= 126 ? String.fromCharCode(byteVal) : '·';
      case 'binary':
        return byteVal.toString(2).padStart(8, '0');
      default:
        return byteVal.toString(16).padStart(2, '0').toUpperCase();
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2000);
  };

  // Group steps by round
  const stepsByRound = useMemo(() => {
    const map: { [round: number]: number[] } = {};
    trace.steps.forEach((step, idx) => {
      if (!map[step.round]) map[step.round] = [];
      map[step.round].push(idx);
    });
    return map;
  }, [trace.steps]);

  // Stepper current active index calculation
  const getStepperActiveIndex = () => {
    if (currentStepIdx === 0) return 1; // Input
    if (currentStepIdx === 1) return 2; // Initialize
    if (currentStepIdx === 2) return 3; // Matrix
    if (currentStepIdx < trace.steps.length - 1) return 4; // Rounds
    return 5; // Cipher
  };
  const activeStepNum = getStepperActiveIndex();

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F8FC] text-[#151c27]">
      
      {/* Workspace Sub-Bar with Breadcrumb and Sidebar Controls */}
      <div className="bg-white border-b border-[#D9DDE7] px-4 sm:px-6 py-3 flex justify-between items-center z-20 shadow-xs">
        <div className="flex items-center gap-3">
          {/* Left Sidebar Toggle Button */}
          <button
            onClick={() => setIsLeftSidebarOpen(!isLeftSidebarOpen)}
            className="p-2 rounded-xl bg-[#F7F8FC] border border-[#D9DDE7] text-[#142380] hover:bg-[#e7eefe] hover:border-[#142380] transition-all cursor-pointer flex items-center gap-2 text-xs font-bold"
            title={isLeftSidebarOpen ? 'Collapse Left Sidebar' : 'Expand Left Sidebar'}
            id="toggle-left-sidebar-btn"
          >
            {isLeftSidebarOpen ? (
              <>
                <PanelLeftClose className="w-4 h-4 text-[#142380]" />
                <span className="hidden sm:inline">Collapse Sidebar</span>
              </>
            ) : (
              <>
                <PanelLeftOpen className="w-4 h-4 text-[#142380]" />
                <span className="hidden sm:inline">Expand Sidebar</span>
              </>
            )}
          </button>

          {/* Breadcrumbs */}
          <nav className="hidden sm:flex items-center gap-2 text-xs font-semibold text-[#454652]">
            <span>Home</span>
            <span>/</span>
            <span>AES Workspace</span>
            <span>/</span>
            <span className="text-[#142380] font-bold">Interactive Session</span>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          {/* Preset Selector */}
          <select
            onChange={(e) => handleSelectPreset(e.target.value)}
            defaultValue=""
            className="bg-[#F7F8FC] border border-[#D9DDE7] text-[#151c27] font-semibold text-xs rounded-xl px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#142380]/20 cursor-pointer"
            id="workspace-preset-selector"
          >
            <option value="" disabled>
              Load Example Preset...
            </option>
            {PRESET_EXAMPLES.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>

          {/* Right Sidebar Toggle Button */}
          <button
            onClick={() => setIsRightSidebarOpen(!isRightSidebarOpen)}
            className="p-2 rounded-xl bg-[#F7F8FC] border border-[#D9DDE7] text-[#142380] hover:bg-[#e7eefe] hover:border-[#142380] transition-all cursor-pointer flex items-center gap-2 text-xs font-bold"
            title={isRightSidebarOpen ? 'Collapse Learning Panel' : 'Expand Learning Panel'}
            id="toggle-right-sidebar-btn"
          >
            {isRightSidebarOpen ? (
              <>
                <span className="hidden sm:inline">Hide Guide</span>
                <PanelRightClose className="w-4 h-4 text-[#142380]" />
              </>
            ) : (
              <>
                <span className="hidden sm:inline">Show Guide</span>
                <PanelRightOpen className="w-4 h-4 text-[#142380]" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Container with Collapsible Left & Right Sidebars */}
      <div className="flex flex-1 overflow-hidden relative">

        {/* ================= LEFT SIDEBAR (COLLAPSIBLE) ================= */}
        <aside
          className={`bg-[#f0f3ff] border-r border-[#D9DDE7] transition-all duration-300 flex flex-col z-10 shrink-0 ${
            isLeftSidebarOpen ? 'w-72 p-4' : 'w-16 p-2 items-center'
          }`}
        >
          {/* Header & Toggle */}
          <div className={`flex items-center mb-4 ${isLeftSidebarOpen ? 'justify-between' : 'justify-center'}`}>
            {isLeftSidebarOpen ? (
              <div className="flex items-center gap-2.5">
                <div className="h-9 w-9 rounded-xl bg-[#142380] flex items-center justify-center text-white shadow-xs">
                  <LayoutDashboard className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-[#151c27]">Session Info</h3>
                  <p className="text-[11px] text-[#454652]">Active Workspace</p>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setIsLeftSidebarOpen(true)}
                className="h-10 w-10 rounded-xl bg-[#142380] text-white flex items-center justify-center shadow-md hover:bg-[#2f3c97] transition-all cursor-pointer"
                title="Expand Left Sidebar"
              >
                <LayoutDashboard className="w-5 h-5" />
              </button>
            )}

            {isLeftSidebarOpen && (
              <button
                onClick={() => setIsLeftSidebarOpen(false)}
                className="p-1.5 rounded-lg text-[#767683] hover:text-[#142380] hover:bg-[#dce2f3] transition-colors cursor-pointer"
                title="Collapse Sidebar"
              >
                <PanelLeftClose className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* EXPANDED CONTENT */}
          {isLeftSidebarOpen ? (
            <div className="flex-1 overflow-y-auto space-y-4 pr-1">
              
              {/* Main Navigation Items (Matching User Screenshot) */}
              <div className="bg-white rounded-2xl border border-[#D9DDE7] p-2 space-y-1 shadow-2xs">
                <div className="text-[10px] font-bold text-[#767683] uppercase tracking-wider px-3 py-1 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#142380]" />
                  <span>Current Session</span>
                </div>

                <button
                  onClick={() => { setCurrentStepIdx(0); setActiveTab('trace'); }}
                  className={`w-full px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-2.5 transition-all cursor-pointer ${
                    currentStepIdx === 0
                      ? 'bg-[#142380] text-white shadow-xs'
                      : 'text-[#454652] hover:bg-[#f0f3ff] hover:text-[#142380]'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Dashboard</span>
                </button>

                <button
                  onClick={() => { setCurrentStepIdx(2); setActiveTab('trace'); }}
                  className={`w-full px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-2.5 transition-all cursor-pointer ${
                    currentStepIdx >= 2 && activeTab === 'trace'
                      ? 'bg-[#142380] text-white shadow-xs'
                      : 'text-[#454652] hover:bg-[#f0f3ff] hover:text-[#142380]'
                  }`}
                >
                  <Grid className="w-4 h-4" />
                  <span>State Matrix</span>
                </button>

                <button
                  onClick={() => { setCurrentStepIdx(2); setActiveTab('keyExpansion'); }}
                  className={`w-full px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-2.5 transition-all cursor-pointer ${
                    activeTab === 'keyExpansion'
                      ? 'bg-[#142380] text-white shadow-xs'
                      : 'text-[#454652] hover:bg-[#f0f3ff] hover:text-[#142380]'
                  }`}
                >
                  <Key className="w-4 h-4" />
                  <span>Key Expansion</span>
                </button>

                <button
                  onClick={() => {
                    const mixIdx = trace.steps.findIndex(s => s.operation === 'mixColumns');
                    if (mixIdx >= 0) setCurrentStepIdx(mixIdx);
                    else setCurrentStepIdx(2);
                    setActiveTab('trace');
                  }}
                  className="w-full px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-2.5 text-[#454652] hover:bg-[#f0f3ff] hover:text-[#142380] transition-all cursor-pointer"
                >
                  <BarChart2 className="w-4 h-4" />
                  <span>MixColumns</span>
                </button>

                <button
                  onClick={() => { setCurrentStepIdx(trace.steps.length - 1); setActiveTab('finalCiphertext'); }}
                  className={`w-full px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-2.5 transition-all cursor-pointer ${
                    activeTab === 'finalCiphertext'
                      ? 'bg-[#142380] text-white shadow-xs'
                      : 'text-[#454652] hover:bg-[#f0f3ff] hover:text-[#142380]'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Final Ciphertext</span>
                </button>
              </div>

              {/* Session Metrics Dashboard */}
              <div className="bg-white rounded-2xl border border-[#D9DDE7] p-4 space-y-3.5 shadow-xs">
                {/* Session Status */}
                <div className="flex justify-between items-center text-xs pb-2 border-b border-[#f0f3ff]">
                  <span className="font-semibold text-[#454652] uppercase tracking-wider text-[10px] flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#142380]" />
                    Session Status
                  </span>
                  <span className={`flex items-center gap-1.5 font-bold px-2.5 py-1 rounded-full text-[11px] ${
                    activeTab === 'finalCiphertext'
                      ? 'text-[#005221] bg-[#e8f8ee]'
                      : 'text-[#142380] bg-[#e7eefe]'
                  }`}>
                    <span className={`w-2 h-2 rounded-full animate-pulse ${
                      activeTab === 'finalCiphertext' ? 'bg-[#005221]' : 'bg-[#142380]'
                    }`}></span>
                    {activeTab === 'finalCiphertext'
                      ? 'Completed'
                      : activeTab === 'keyExpansion'
                      ? 'Preparing Encryption'
                      : 'Ready'}
                  </span>
                </div>

                {/* Current Stage */}
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-[#454652] uppercase tracking-wider text-[10px] flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#142380]" />
                    Current Stage
                  </span>
                  <span className="font-bold text-[#142380]">
                    {activeTab === 'finalCiphertext'
                      ? 'Final Ciphertext'
                      : activeTab === 'keyExpansion'
                      ? 'Key Expansion'
                      : currentStep.title}
                  </span>
                </div>

                {/* Current Round */}
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-[#454652] uppercase tracking-wider text-[10px] flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-[#142380]" />
                    Current Round
                  </span>
                  <span className="font-bold text-[#151c27]">
                    {activeTab === 'finalCiphertext'
                      ? 'Round 10 (Final)'
                      : activeTab === 'keyExpansion'
                      ? 'Preparation'
                      : `Round ${currentStep.round}`}
                  </span>
                </div>

                {/* Overall Progress */}
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-[#454652] uppercase tracking-wider text-[10px] flex items-center gap-1.5">
                    <BarChart2 className="w-3.5 h-3.5 text-[#142380]" />
                    Overall Progress
                  </span>
                  <span className={`font-bold px-2 py-0.5 rounded-md ${
                    activeTab === 'finalCiphertext'
                      ? 'text-[#005221] bg-[#e8f8ee]'
                      : 'text-[#142380] bg-[#e7eefe]'
                  }`}>
                    {activeTab === 'finalCiphertext'
                      ? '100%'
                      : activeTab === 'keyExpansion'
                      ? '10%'
                      : `${Math.round(((currentStepIdx + 1) / trace.steps.length) * 100)}%`}
                  </span>
                </div>

                {/* AES Algorithm */}
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-[#454652] uppercase tracking-wider text-[10px] flex items-center gap-1.5">
                    <Cpu className="w-3.5 h-3.5 text-[#142380]" />
                    AES Algorithm
                  </span>
                  <span className="font-bold text-[#142380] bg-[#e7eefe] px-2 py-0.5 rounded-md">
                    AES-{selectedAlgo}
                  </span>
                </div>

                {/* Block Size */}
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-[#454652] uppercase tracking-wider text-[10px] flex items-center gap-1.5">
                    <Grid className="w-3.5 h-3.5 text-[#142380]" />
                    Block Size
                  </span>
                  <span className="font-bold text-[#151c27]">128 bits</span>
                </div>

                {/* Encryption Rounds */}
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-[#454652] uppercase tracking-wider text-[10px] flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-[#142380]" />
                    Encryption Rounds
                  </span>
                  <span className="font-bold text-[#142380]">
                    {selectedAlgo === '128' ? '10' : selectedAlgo === '192' ? '12' : '14'}
                  </span>
                </div>

                {/* Plaintext Length */}
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-[#454652] uppercase tracking-wider text-[10px] flex items-center gap-1.5">
                    <FileCode className="w-3.5 h-3.5 text-[#142380]" />
                    Plaintext Length
                  </span>
                  <span className="font-bold text-[#151c27]">
                    {plaintextInput.length} Characters
                  </span>
                </div>

                {/* Key Length */}
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-[#454652] uppercase tracking-wider text-[10px] flex items-center gap-1.5">
                    <Key className="w-3.5 h-3.5 text-[#142380]" />
                    Key Length
                  </span>
                  <span className="font-bold text-[#151c27]">
                    {keyLengthBits} Bits
                  </span>
                </div>

                {/* Session Duration */}
                <div className="flex justify-between items-center text-xs pt-2 border-t border-[#f0f3ff]">
                  <span className="font-semibold text-[#454652] uppercase tracking-wider text-[10px] flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#142380]" />
                    Session Duration
                  </span>
                  <span className="font-mono font-bold text-[#142380] bg-[#F7F8FC] px-2 py-0.5 rounded border border-[#D9DDE7]">
                    {formattedSessionDuration}
                  </span>
                </div>
              </div>

              {/* Learning Objectives Collapsible Box */}
              <div className="bg-[#142380] text-white rounded-2xl p-4 shadow-sm space-y-2.5">
                <div
                  onClick={() => setIsObjectivesOpen(!isObjectivesOpen)}
                  className="flex items-center justify-between cursor-pointer select-none"
                >
                  <span className="text-[11px] font-bold uppercase tracking-widest text-[#dfe0ff] flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-[#ff9a5b]" />
                    Objectives
                  </span>
                  <button className="text-white hover:text-[#ff9a5b] transition-colors">
                    {isObjectivesOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>

                {isObjectivesOpen && (
                  <ul className="text-xs space-y-2 text-[#dfe0ff] pt-1">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#6bff8f] shrink-0" />
                      <span>Understand 4×4 state matrix layout</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#6bff8f] shrink-0" />
                      <span>Observe SubBytes & ShiftRows</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Circle className="w-3.5 h-3.5 text-[#dfe0ff]/60 shrink-0" />
                      <span>Examine MixColumns transformation</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Circle className="w-3.5 h-3.5 text-[#dfe0ff]/60 shrink-0" />
                      <span>Verify key expansion round keys</span>
                    </li>
                  </ul>
                )}
              </div>

              {/* Session Progress Card (Item 7) */}
              <div className="bg-white rounded-2xl border border-[#D9DDE7] p-4 space-y-2.5 shadow-xs">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-[#151c27] flex items-center gap-1.5">
                    <BarChart2 className="w-3.5 h-3.5 text-[#142380]" />
                    Session Progress
                  </span>
                  <span className="font-mono font-extrabold text-xs text-[#142380]">
                    {sessionProgressPct}%
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-[#f0f3ff] rounded-full h-2.5 overflow-hidden border border-[#D9DDE7]">
                  <div
                    className="bg-gradient-to-r from-[#142380] to-[#2f3c97] h-full transition-all duration-300 rounded-full"
                    style={{ width: `${sessionProgressPct}%` }}
                  ></div>
                </div>

                <div className="flex justify-between items-center text-[11px] text-[#454652]">
                  <span>Status:</span>
                  <span className="font-bold text-[#142380]">
                    {currentStepIdx === 0
                      ? 'Waiting to Start'
                      : currentStepIdx === trace.steps.length - 1
                      ? 'Completed'
                      : `Step ${currentStepIdx + 1} of ${trace.steps.length}`}
                  </span>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="pt-1 space-y-2">
                <button
                  onClick={() => {
                    setPlaintextInput('HELLO WORLD 2026');
                    setKeyInput('AES SECRET KEY!!');
                    setCurrentStepIdx(0);
                    setIsPlaying(false);
                  }}
                  className="w-full py-2.5 px-3 bg-white border border-[#D9DDE7] text-[#142380] font-bold text-xs rounded-xl hover:bg-[#e7eefe] hover:border-[#142380] transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Session</span>
                </button>
              </div>

            </div>
          ) : (
            /* COLLAPSED ICON COLUMN */
            <div className="flex flex-col items-center gap-4 pt-2">
              <button
                onClick={() => setIsLeftSidebarOpen(true)}
                className="w-10 h-10 rounded-xl bg-white border border-[#D9DDE7] text-[#142380] hover:bg-[#e7eefe] flex items-center justify-center transition-all cursor-pointer"
                title="Status: Ready"
              >
                <span className="w-3 h-3 rounded-full bg-[#005221]"></span>
              </button>

              <button
                onClick={() => setIsLeftSidebarOpen(true)}
                className="w-10 h-10 rounded-xl bg-white border border-[#D9DDE7] text-[#142380] hover:bg-[#e7eefe] flex items-center justify-center transition-all cursor-pointer"
                title="Expand Objectives Checklist"
              >
                <CheckCircle2 className="w-5 h-5 text-[#142380]" />
              </button>

              <button
                onClick={() => {
                  setPlaintextInput('HELLO WORLD 2026');
                  setKeyInput('AES SECRET KEY!!');
                  setCurrentStepIdx(0);
                }}
                className="w-10 h-10 rounded-xl bg-white border border-[#D9DDE7] text-[#96490d] hover:bg-[#ffdbc9] flex items-center justify-center transition-all cursor-pointer"
                title="Reset Session"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          )}
        </aside>

        {/* ================= MAIN WORKSPACE AREA ================= */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">
          
          {/* Progress Stepper Bar */}
          <div className="max-w-4xl mx-auto px-4">
            <div className="flex items-center justify-between relative">
              <div className="absolute top-1/2 left-0 w-full h-[2px] bg-[#D9DDE7] -translate-y-1/2 z-0"></div>

              {[
                { id: 1, label: 'Input', icon: CheckCircle2, isKeyExp: false, targetIdx: 0 },
                { id: 2, label: 'Initialize', icon: CheckCircle2, isKeyExp: false, targetIdx: 1 },
                { id: 3, label: 'Key Expansion', icon: Key, isKeyExp: true, targetIdx: 1 },
                { id: 4, label: 'State Matrix', icon: Grid, isKeyExp: false, targetIdx: 2 },
                { id: 5, label: 'SubBytes', icon: Layers, isKeyExp: false, targetIdx: trace.steps.findIndex(s => s.operation === 'subBytes') >= 0 ? trace.steps.findIndex(s => s.operation === 'subBytes') : 3 },
                { id: 6, label: 'ShiftRows', icon: BarChart2, isKeyExp: false, targetIdx: trace.steps.findIndex(s => s.operation === 'shiftRows') >= 0 ? trace.steps.findIndex(s => s.operation === 'shiftRows') : 4 },
                { id: 7, label: 'MixColumns', icon: Sparkles, isKeyExp: false, targetIdx: trace.steps.findIndex(s => s.operation === 'mixColumns') >= 0 ? trace.steps.findIndex(s => s.operation === 'mixColumns') : 5 },
                { id: 8, label: 'AddRoundKey', icon: Key, isKeyExp: false, targetIdx: trace.steps.findIndex(s => s.operation === 'addRoundKey') >= 0 ? trace.steps.findIndex(s => s.operation === 'addRoundKey') : 6 },
                { id: 9, label: 'Final Cipher', icon: ShieldCheck, isKeyExp: false, isFinalCipher: true, targetIdx: trace.steps.length - 1 }
              ].map((step) => {
                const isCurrent = step.isFinalCipher
                  ? activeTab === 'finalCiphertext'
                  : step.isKeyExp
                  ? activeTab === 'keyExpansion'
                  : activeTab === 'trace' && (
                      (step.id === 1 && currentStepIdx === 0) ||
                      (step.id === 2 && currentStepIdx === 1) ||
                      (step.id === 4 && currentStepIdx === 2) ||
                      (step.id === 5 && trace.steps[currentStepIdx]?.operation === 'subBytes') ||
                      (step.id === 6 && trace.steps[currentStepIdx]?.operation === 'shiftRows') ||
                      (step.id === 7 && trace.steps[currentStepIdx]?.operation === 'mixColumns') ||
                      (step.id === 8 && trace.steps[currentStepIdx]?.operation === 'addRoundKey')
                    );

                const isCompleted = activeTab === 'finalCiphertext'
                  ? step.id < 9
                  : step.isKeyExp
                  ? currentStepIdx >= 2 && activeTab === 'trace'
                  : (
                      (step.id === 1 && (currentStepIdx > 0 || activeTab === 'keyExpansion')) ||
                      (step.id === 2 && (currentStepIdx > 1 || activeTab === 'keyExpansion')) ||
                      (step.id === 4 && currentStepIdx > 2) ||
                      (step.id < 9 && currentStepIdx === trace.steps.length - 1)
                    );

                const StepIcon = step.icon;

                return (
                  <div key={step.id} className="relative z-10 flex flex-col items-center group cursor-pointer" onClick={() => {
                    if (step.isKeyExp) {
                      setActiveTab('keyExpansion');
                    } else if (step.isFinalCipher) {
                      setCurrentStepIdx(step.targetIdx);
                      setActiveTab('finalCiphertext');
                    } else {
                      setCurrentStepIdx(step.targetIdx);
                      setActiveTab('trace');
                    }
                  }}>
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all shadow-sm ${
                        isCurrent
                          ? 'bg-[#142380] text-white ring-4 ring-[#142380]/20 scale-105'
                          : isCompleted
                          ? 'bg-[#005221] text-white ring-2 ring-white'
                          : 'bg-white border-2 border-[#D9DDE7] text-[#767683]'
                      }`}
                    >
                      {isCompleted ? <CheckCircle2 className="w-5 h-5 text-white" /> : <StepIcon className="w-4 h-4" />}
                    </div>
                    <span
                      className={`text-[10px] sm:text-[11px] font-extrabold mt-1.5 uppercase tracking-wider text-center transition-colors ${
                        isCurrent
                          ? 'text-[#142380]'
                          : isCompleted
                          ? 'text-[#005221]'
                          : 'text-[#767683]'
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* STEP 1: INPUT SCREEN */}
          {currentStepIdx === 0 && (
            <div className="space-y-6">
              {/* Today's Learning Objective Banner */}
              <div className="bg-white border-l-4 border-[#142380] border border-[#D9DDE7] rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <div className="p-2.5 rounded-xl bg-[#e7eefe] text-[#142380] shrink-0 mt-0.5">
                    <Sparkles className="w-5 h-5 text-[#142380]" />
                  </div>
                  <div className="space-y-0.5">
                    <h3 className="text-sm font-extrabold text-[#142380] uppercase tracking-wider flex items-center gap-2">
                      Today's Learning Objective
                    </h3>
                    <p className="text-xs sm:text-sm text-[#454652] leading-relaxed">
                      Learn how the Advanced Encryption Standard transforms plaintext into ciphertext through state matrix transformations, key expansion, and round-by-round encryption.
                    </p>
                  </div>
                </div>
                <div className="shrink-0 bg-[#F7F8FC] px-3 py-1.5 rounded-xl border border-[#D9DDE7] text-[11px] font-bold text-[#142380] flex items-center gap-1.5 self-end sm:self-center">
                  <BookOpen className="w-3.5 h-3.5 text-[#ff9a5b]" />
                  <span>Interactive Session</span>
                </div>
              </div>

              {/* Input Configuration Card */}
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#D9DDE7] shadow-xs space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-[#D9DDE7]">
                  <div>
                    <div className="flex items-center gap-2">
                      <Key className="w-5 h-5 text-[#142380]" />
                      <h2 className="text-lg sm:text-xl font-extrabold text-[#151c27]">
                        Encryption Configuration
                      </h2>
                    </div>
                    <p className="text-xs text-[#454652] mt-1">
                      Provide the required inputs to begin the AES visualization session.
                    </p>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-center">
                    <span className="text-xs font-bold text-[#454652]">Input Format:</span>
                    <div className="bg-[#F7F8FC] p-1 rounded-xl border border-[#D9DDE7] flex gap-1">
                      <button
                        onClick={() => setIsHexMode(false)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          !isHexMode ? 'bg-[#142380] text-white shadow-2xs' : 'text-[#454652] hover:text-[#142380]'
                        }`}
                      >
                        ASCII Text
                      </button>
                      <button
                        onClick={() => setIsHexMode(true)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          isHexMode ? 'bg-[#142380] text-white shadow-2xs' : 'text-[#454652] hover:text-[#142380]'
                        }`}
                      >
                        Hex Bytes
                      </button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Section 1: Plaintext Input */}
                  <div className="space-y-2.5 bg-[#F7F8FC] p-4 rounded-2xl border border-[#D9DDE7]">
                    <div className="flex justify-between items-center text-xs font-bold text-[#142380]">
                      <label htmlFor="plaintext-input" className="uppercase tracking-wider flex items-center gap-1.5">
                        <FileCode className="w-4 h-4 text-[#142380]" />
                        Plaintext Message
                      </label>
                      <span className="text-[#454652] font-semibold text-[11px] bg-white px-2 py-0.5 rounded border border-[#D9DDE7]">
                        {plaintextInput.length} / 16 chars (1 block)
                      </span>
                    </div>
                    <textarea
                      id="plaintext-input"
                      value={plaintextInput}
                      onChange={(e) => {
                        setPlaintextInput(e.target.value);
                        setCurrentStepIdx(0);
                      }}
                      rows={2}
                      placeholder={isHexMode ? '32 43 f6 a8 88 5a 30 8d 31 31 98 a2 e0 37 07 34' : 'HELLO WORLD 2026'}
                      className="w-full bg-white border border-[#D9DDE7] focus:border-[#142380] focus:ring-2 focus:ring-[#142380]/10 text-[#151c27] font-mono text-sm p-3 rounded-xl focus:outline-none transition-all resize-none shadow-2xs"
                    />
                    <p className="text-[11px] text-[#454652]">
                      The input text converted into a 4×4 state matrix for processing.
                    </p>
                  </div>

                  {/* Section 2: Algorithm Type & Encryption Key */}
                  <div className="space-y-4 bg-[#F7F8FC] p-4 rounded-2xl border border-[#D9DDE7]">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-[#151c27] uppercase tracking-wider block flex items-center gap-1.5">
                        <Cpu className="w-4 h-4 text-[#142380]" />
                        AES Algorithm Type
                      </label>
                      <select
                        value={selectedAlgo}
                        onChange={(e) => setSelectedAlgo(e.target.value)}
                        className="w-full bg-white border border-[#D9DDE7] text-[#151c27] font-semibold text-sm rounded-xl p-3 focus:outline-none focus:border-[#142380] focus:ring-2 focus:ring-[#142380]/10 cursor-pointer shadow-2xs"
                      >
                        <option value="128">AES-128 (10 Encryption Rounds)</option>
                        <option value="192">AES-192 (12 Encryption Rounds)</option>
                        <option value="256">AES-256 (14 Encryption Rounds)</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center text-xs font-bold text-[#96490d]">
                        <label htmlFor="key-input" className="uppercase tracking-wider flex items-center gap-1.5">
                          <Key className="w-4 h-4 text-[#96490d]" />
                          Encryption Key
                        </label>
                        <button
                          onClick={handleGenerateRandomKey}
                          className="text-[#96490d] hover:underline text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                        >
                          <Wand2 className="w-3 h-3 text-[#ff9a5b]" /> Generate Random Key
                        </button>
                      </div>
                      <div className="relative">
                        <input
                          id="key-input"
                          type={showKey ? 'text' : 'password'}
                          value={keyInput}
                          onChange={(e) => {
                            setKeyInput(e.target.value);
                            setCurrentStepIdx(0);
                          }}
                          placeholder={isHexMode ? '2b 7e 15 16 28 ae d2 a6 ab f7 15 88 09 cf 4f 3c' : 'AES SECRET KEY!!'}
                          className="w-full bg-white border border-[#D9DDE7] focus:border-[#ff9a5b] focus:ring-2 focus:ring-[#ff9a5b]/10 text-[#151c27] font-mono text-sm pl-3 pr-10 py-3 rounded-xl focus:outline-none transition-all shadow-2xs"
                        />
                        <button
                          type="button"
                          onClick={() => setShowKey(!showKey)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#767683] hover:text-[#142380] transition-colors cursor-pointer"
                        >
                          {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions Bar */}
                <div className="pt-4 border-t border-[#D9DDE7] flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center">
                  <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                    <button
                      onClick={() => {
                        setPlaintextInput('');
                        setKeyInput('');
                        setCurrentStepIdx(0);
                      }}
                      className="px-4 py-2.5 bg-[#F7F8FC] border border-[#D9DDE7] text-[#454652] font-bold text-xs rounded-xl hover:bg-[#dce2f3] hover:text-[#151c27] transition-all cursor-pointer"
                    >
                      Clear Form
                    </button>
                    <div className="flex flex-col">
                      <button
                        onClick={() => {
                          handleSelectPreset('nist-official');
                        }}
                        className="px-4 py-2.5 bg-white border border-[#142380] text-[#142380] font-bold text-xs rounded-xl hover:bg-[#e7eefe] transition-all cursor-pointer"
                      >
                        Load Sample Data
                      </button>
                      <span className="text-[10px] text-[#454652] mt-1 text-center sm:text-left">
                        New to AES? Load an example session to explore the visualization instantly.
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setCurrentStepIdx(1);
                    }}
                    className="w-full sm:w-auto px-8 py-3.5 bg-[#142380] hover:bg-[#2f3c97] text-white font-extrabold text-sm rounded-2xl shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2.5 hover:scale-[1.01] active:scale-[0.99]"
                    id="start-visualization-btn"
                  >
                    <Play className="w-5 h-5 fill-white text-white" />
                    <span>Initialize AES</span>
                  </button>
                </div>
              </div>

              {/* Large Visualization Preview Panel (Item 2) */}
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#D9DDE7] shadow-xs space-y-6 relative overflow-hidden">
                {/* Header */}
                <div className="flex justify-between items-center pb-4 border-b border-[#D9DDE7]">
                  <div className="flex items-center gap-2">
                    <Eye className="w-5 h-5 text-[#142380]" />
                    <h2 className="text-lg font-extrabold text-[#151c27]">
                      Visualization Preview
                    </h2>
                  </div>
                  <span className="text-[11px] font-bold text-[#142380] bg-[#e7eefe] px-3 py-1 rounded-full border border-[#142380]/20">
                    Interactive Canvas Preview
                  </span>
                </div>

                {/* Centered Helper Text */}
                <div className="text-center space-y-2 py-2">
                  <p className="text-xs sm:text-sm font-semibold text-[#454652] max-w-xl mx-auto bg-[#F7F8FC] py-2 px-4 rounded-xl border border-[#D9DDE7] inline-block shadow-2xs">
                    "Your interactive AES visualization will appear here after starting the session."
                  </p>
                </div>

                {/* Placeholder Canvas Content with Subtle Opacity */}
                <div className="bg-[#F7F8FC] border-2 border-dashed border-[#D9DDE7] rounded-2xl p-6 opacity-75 space-y-6">
                  
                  {/* Flow Arrows Pipeline Illustration */}
                  <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs font-bold text-[#142380]">
                    <div className="bg-white px-3 py-1.5 rounded-xl border border-[#D9DDE7] shadow-2xs text-[#454652]">
                      Plaintext
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#ff9a5b] shrink-0" />
                    <div className="bg-[#e7eefe] px-3 py-1.5 rounded-xl border border-[#142380]/30 shadow-2xs text-[#142380] font-mono">
                      State Matrix
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#ff9a5b] shrink-0" />
                    <div className="bg-[#142380] text-white px-3 py-1.5 rounded-xl shadow-2xs">
                      SubBytes
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#ff9a5b] shrink-0" />
                    <div className="bg-[#142380] text-white px-3 py-1.5 rounded-xl shadow-2xs">
                      ShiftRows
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#ff9a5b] shrink-0" />
                    <div className="bg-[#142380] text-white px-3 py-1.5 rounded-xl shadow-2xs">
                      MixColumns
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#ff9a5b] shrink-0" />
                    <div className="bg-[#142380] text-white px-3 py-1.5 rounded-xl shadow-2xs">
                      AddRoundKey
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#ff9a5b] shrink-0" />
                    <div className="bg-[#ff9a5b] text-white px-3 py-1.5 rounded-xl shadow-2xs font-mono">
                      Ciphertext
                    </div>
                  </div>

                  {/* Faint 4x4 AES State Matrix Preview */}
                  <div className="flex flex-col md:flex-row items-center justify-center gap-8 pt-2">
                    <div className="space-y-2 text-center">
                      <span className="text-[11px] font-bold text-[#454652] uppercase tracking-wider block">
                        Faint 4×4 State Matrix
                      </span>
                      <div className="grid grid-cols-4 gap-1.5 w-48 mx-auto font-mono text-xs">
                        {[
                          ['S₀,₀', 'S₀,₁', 'S₀,₂', 'S₀,₃'],
                          ['S₁,₀', 'S₁,₁', 'S₁,₂', 'S₁,₃'],
                          ['S₂,₀', 'S₂,₁', 'S₂,₂', 'S₂,₃'],
                          ['S₃,₀', 'S₃,₁', 'S₃,₂', 'S₃,₃']
                        ].map((row, rIdx) =>
                          row.map((cell, cIdx) => (
                            <div
                              key={`${rIdx}-${cIdx}`}
                              className="bg-white/80 border border-[#D9DDE7] p-2 rounded-lg text-center text-[#142380] font-bold shadow-2xs hover:border-[#142380] transition-colors"
                            >
                              {cell}
                            </div>
                          ))
                        )}
                      </div>
                    </div>

                    {/* Transformation Connected Blocks Diagram */}
                    <div className="space-y-2 text-center max-w-sm">
                      <span className="text-[11px] font-bold text-[#454652] uppercase tracking-wider block">
                        Connected Transformation Blocks
                      </span>
                      <div className="bg-white p-4 rounded-xl border border-[#D9DDE7] space-y-2.5 text-left text-xs shadow-2xs">
                        <div className="flex items-center gap-2 text-[#142380] font-bold">
                          <Zap className="w-4 h-4 text-[#ff9a5b]" />
                          <span>Round 1 to N Execution Flow</span>
                        </div>
                        <p className="text-[11px] text-[#454652] leading-relaxed">
                          Each byte in the state matrix undergoes S-Box substitution, row cyclic shifts, Galois Field matrix column mixing, and XORing with the expanded round key.
                        </p>
                        <div className="flex items-center gap-2 pt-1 border-t border-[#f0f3ff]">
                          <span className="w-2 h-2 rounded-full bg-[#142380]"></span>
                          <span className="text-[10px] font-bold text-[#142380]">
                            Ready to process 16 bytes (128-bit block)
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          )}

          {/* STEP 2: INITIALIZE AES DASHBOARD SCREEN (3-COLUMN LAYOUT MATCHING USER REFERENCE IMAGE) */}
          {currentStepIdx === 1 && (
            <div className="grid grid-cols-12 gap-6 items-start">
              {/* Left Column: Summary & Controls (3 cols) */}
              <div className="col-span-12 lg:col-span-3 flex flex-col gap-6">
                {/* Initialization Status Card */}
                <div className="bg-white rounded-2xl p-5 border border-[#D9DDE7] shadow-xs space-y-4">
                  <div className="flex items-center gap-2">
                    <Settings className="w-5 h-5 text-[#142380]" />
                    <h2 className="text-base font-extrabold text-[#142380]">Initialization Status</h2>
                  </div>
                  <div className="space-y-2.5 border-t border-[#D9DDE7] pt-3 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="text-[#454652] font-semibold">Current Stage</span>
                      <span className="font-bold text-[#142380]">Initialization</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[#454652] font-semibold">Active Operation</span>
                      <span className="font-bold text-[#96490d]">State Mapping</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[#454652] font-semibold">Est. Time</span>
                      <span className="font-bold text-[#151c27]">~0:08s</span>
                    </div>
                  </div>
                </div>

                {/* INITIALIZATION LOG Card */}
                <div className="bg-white rounded-2xl p-5 border border-[#D9DDE7] shadow-xs flex flex-col gap-3">
                  <h3 className="text-xs font-extrabold text-[#142380] uppercase tracking-widest">
                    INITIALIZATION LOG
                  </h3>
                  <div className="bg-[#151c27] rounded-xl p-3.5 font-mono text-[11px] leading-relaxed h-52 overflow-y-auto space-y-1.5 shadow-inner">
                    <p className="text-[#6bff8f] flex gap-2">
                      <span className="opacity-40">[1]</span>
                      <span>[OK] System: Ready.</span>
                    </p>
                    <p className="text-[#6bff8f] flex gap-2">
                      <span className="opacity-40">[2]</span>
                      <span>[OK] Parsing input string...</span>
                    </p>
                    <p className="text-[#6bff8f] flex gap-2">
                      <span className="opacity-40">[3]</span>
                      <span>[OK] Validating plaintext (128-bit)...</span>
                    </p>
                    <p className="text-[#dfe0ff] flex gap-2">
                      <span className="opacity-40">[4]</span>
                      <span>[INFO] AES-{selectedAlgo} configuration selected.</span>
                    </p>
                    <p className="text-[#ffb68b] animate-pulse flex gap-2">
                      <span className="opacity-40">[5]</span>
                      <span>[BUSY] Creating state matrix...</span>
                    </p>
                    <p className="text-[#767683] flex gap-2">
                      <span className="opacity-40">[6]</span>
                      <span>[WAIT] Allocating round key memory...</span>
                    </p>
                    <p className="text-[#6bff8f]/80 flex gap-2">
                      <span className="opacity-40">[7]</span>
                      <span>[10:12:18] Applying Rijndael S-box transforms...</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Middle Column: Main Visualization (6 cols) */}
              <div className="col-span-12 lg:col-span-6 flex flex-col gap-6">
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#D9DDE7] shadow-xs flex-grow flex flex-col space-y-6">
                  {/* Why this step matters banner */}
                  <div className="p-4 bg-[#e7eefe] border border-[#142380]/20 rounded-2xl flex items-start gap-3">
                    <Info className="w-5 h-5 text-[#142380] shrink-0 mt-0.5" />
                    <p className="text-xs sm:text-sm text-[#142380] leading-relaxed font-medium">
                      <strong>Why this step matters:</strong> AES processes data in blocks. This step organizes your raw input into the 4×4 State Matrix required for mathematical transformations.
                    </p>
                  </div>

                  {/* Title & Progress Header */}
                  <div className="space-y-3">
                    <h1 className="text-2xl font-extrabold text-[#142380]">
                      Initialization Dashboard
                    </h1>

                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-extrabold text-[#142380] animate-pulse">
                          Preparing encryption environment...
                        </span>
                        <span className="font-semibold text-[#454652]">85% Complete</span>
                      </div>
                      <div className="w-full h-3.5 bg-[#f0f3ff] rounded-full overflow-hidden border border-[#D9DDE7] relative">
                        <div className="bg-[#142380] h-full rounded-full w-[85%] transition-all duration-500 relative">
                          <div className="absolute inset-0 bg-white/30 animate-pulse" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 2 Cards Grid inside middle column */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-grow">
                    {/* Task List Card */}
                    <div className="flex flex-col gap-3 p-4 bg-[#F7F8FC] border border-[#D9DDE7] rounded-2xl">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <CheckCircle2 className="w-5 h-5 text-[#005221]" />
                          <div>
                            <p className="text-xs font-extrabold text-[#142380]">Validate Plaintext</p>
                            <p className="text-[11px] text-[#454652]">Parsing input into byte array</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <CheckCircle2 className="w-5 h-5 text-[#005221]" />
                          <div>
                            <p className="text-xs font-extrabold text-[#142380]">Validate AES Key</p>
                            <p className="text-[11px] text-[#454652]">Key length and entropy check</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between bg-white p-2.5 rounded-xl border border-[#142380] shadow-2xs">
                        <div className="flex items-center gap-2.5">
                          <RotateCcw className="w-5 h-5 text-[#142380] animate-spin" />
                          <div>
                            <p className="text-xs font-extrabold text-[#142380]">Generate State Matrix</p>
                            <p className="text-[11px] text-[#454652]">Mapping 16 bytes to 4x4 grid</p>
                          </div>
                        </div>
                        <span className="text-[10px] font-bold text-[#96490d] bg-[#ffdbc9] px-2 py-0.5 rounded">⏳ 6s</span>
                      </div>

                      <div className="flex items-center justify-between opacity-60 p-1">
                        <div className="flex items-center gap-2.5">
                          <Circle className="w-5 h-5 text-[#767683]" />
                          <div>
                            <p className="text-xs font-extrabold text-[#767683]">Generate Round Keys</p>
                            <p className="text-[11px] text-[#767683]">Key Expansion Schedule</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Visual Preview Diagram Card */}
                    <div className="relative bg-[#142380]/5 border border-[#142380]/20 rounded-2xl p-5 flex flex-col items-center justify-center space-y-4 text-center">
                      <div className="flex flex-col items-center gap-3 w-full">
                        <div className="flex gap-2 items-center">
                          <span className="text-[10px] font-extrabold text-[#454652] uppercase tracking-wider">
                            INPUT STREAM
                          </span>
                          <div className="flex gap-1 font-mono text-xs">
                            {trace.steps[0]?.state.flat().slice(0, 4).map((b, i) => (
                              <div key={i} className={`px-2 py-0.5 rounded font-bold ${i === 3 ? 'bg-[#142380] text-white shadow-md' : 'bg-white border border-[#D9DDE7] text-[#142380]'}`}>
                                {b.toString(16).padStart(2, '0').toUpperCase()}
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 text-[#142380]">
                          <ArrowDown className="w-5 h-5 animate-bounce" />
                          <Zap className="w-4 h-4 text-[#ff9a5b]" />
                        </div>

                        <div className="grid grid-cols-4 gap-1.5 p-2.5 bg-[#142380] rounded-xl border-2 border-[#142380] shadow-md">
                          {trace.steps[1]?.state.flat().map((b, idx) => (
                            <div
                              key={idx}
                              className={`w-8 h-8 rounded-md flex items-center justify-center text-xs font-extrabold ${
                                idx < 4
                                  ? 'bg-white text-[#142380] shadow-2xs'
                                  : 'bg-white/10 border border-white/20'
                              }`}
                            >
                              {idx < 4 ? b.toString(16).padStart(2, '0').toUpperCase() : ''}
                            </div>
                          ))}
                        </div>

                        <p className="text-[10px] font-extrabold text-[#142380] uppercase tracking-widest">
                          MAPPING STATE MATRIX
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Footer Actions */}
                  <div className="flex flex-col sm:flex-row justify-between items-center gap-3 pt-4 border-t border-[#D9DDE7]">
                    <button
                      disabled
                      className="w-full sm:w-auto px-5 py-2.5 bg-[#F7F8FC] border border-[#D9DDE7] text-[#454652] font-bold text-xs rounded-xl flex items-center justify-center gap-2 opacity-70 cursor-not-allowed"
                    >
                      <RotateCcw className="w-4 h-4 animate-spin text-[#142380]" />
                      <span>Initializing... Please Wait</span>
                    </button>

                    <button
                      onClick={() => setActiveTab('keyExpansion')}
                      className="w-full sm:w-auto px-6 py-3 bg-[#142380] hover:bg-[#2f3c97] text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>Continue to Key Expansion</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Column: Educational Cards (3 cols) */}
              <div className="col-span-12 lg:col-span-3 flex flex-col gap-4">
                {/* WHY INITIALIZATION? Card */}
                <div className="bg-white rounded-2xl border border-[#D9DDE7] shadow-xs overflow-hidden">
                  <button
                    onClick={() => setIsWhyOpen(!isWhyOpen)}
                    className="w-full bg-[#F7F8FC] px-4 py-3 border-b border-[#D9DDE7] flex items-center justify-between text-left cursor-pointer hover:bg-[#e7eefe]/50 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <HelpCircle className="w-4 h-4 text-[#142380]" />
                      <h4 className="text-xs font-extrabold text-[#142380] uppercase">
                        WHY INITIALIZATION?
                      </h4>
                    </div>
                    {isWhyOpen ? <ChevronUp className="w-4 h-4 text-[#454652]" /> : <ChevronDown className="w-4 h-4 text-[#454652]" />}
                  </button>
                  {isWhyOpen && (
                    <div className="p-4 space-y-3">
                      <p className="text-xs text-[#454652] leading-relaxed">
                        AES converts input into a structured 4×4 State Matrix for processing.
                      </p>
                      <a
                        href="#learn-more"
                        className="text-xs font-bold text-[#142380] hover:underline flex items-center gap-1"
                      >
                        <span>Learn More</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  )}
                </div>

                {/* STATE MATRIX Card */}
                <div className="bg-white rounded-2xl border border-[#D9DDE7] shadow-xs overflow-hidden">
                  <button
                    onClick={() => setIsMatrixOpen(!isMatrixOpen)}
                    className="w-full bg-[#F7F8FC] px-4 py-3 border-b border-[#D9DDE7] flex items-center justify-between text-left cursor-pointer hover:bg-[#e7eefe]/50 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <Grid className="w-4 h-4 text-[#142380]" />
                      <h4 className="text-xs font-extrabold text-[#142380] uppercase">
                        STATE MATRIX
                      </h4>
                    </div>
                    {isMatrixOpen ? <ChevronUp className="w-4 h-4 text-[#454652]" /> : <ChevronDown className="w-4 h-4 text-[#454652]" />}
                  </button>
                  {isMatrixOpen && (
                    <div className="p-4 space-y-3">
                      <p className="text-xs text-[#454652] leading-relaxed">
                        A 4×4 array of bytes where all encryption steps occur.
                      </p>
                      <a
                        href="#learn-more"
                        className="text-xs font-bold text-[#142380] hover:underline flex items-center gap-1"
                      >
                        <span>Learn More</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  )}
                </div>

                {/* KEY EXPANSION Card */}
                <div className="bg-white rounded-2xl border border-[#D9DDE7] shadow-xs overflow-hidden">
                  <button
                    onClick={() => setIsKeyExpOpen(!isKeyExpOpen)}
                    className="w-full bg-[#F7F8FC] px-4 py-3 border-b border-[#D9DDE7] flex items-center justify-between text-left cursor-pointer hover:bg-[#e7eefe]/50 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <Key className="w-4 h-4 text-[#142380]" />
                      <h4 className="text-xs font-extrabold text-[#142380] uppercase">
                        KEY EXPANSION
                      </h4>
                    </div>
                    {isKeyExpOpen ? <ChevronUp className="w-4 h-4 text-[#454652]" /> : <ChevronDown className="w-4 h-4 text-[#454652]" />}
                  </button>
                  {isKeyExpOpen && (
                    <div className="p-4 space-y-3">
                      <p className="text-xs text-[#454652] leading-relaxed">
                        Generates 11 distinct keys from the original 128-bit key.
                      </p>
                      <a
                        href="#learn-more"
                        className="text-xs font-bold text-[#142380] hover:underline flex items-center gap-1"
                      >
                        <span>Learn More</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3+: ROUND-BY-ROUND TRACE & STATE MATRIX VISUALIZER */}
          {currentStepIdx >= 2 && (
            <div className="space-y-6">
              {/* Main Workspace Navigation Tabs */}
              <div className="flex border-b border-[#D9DDE7] space-x-6">
            <button
              onClick={() => setActiveTab('trace')}
              className={`pb-3 text-sm sm:text-base font-bold transition-all border-b-2 cursor-pointer ${
                activeTab === 'trace'
                  ? 'text-[#142380] border-[#142380]'
                  : 'text-[#454652] border-transparent hover:text-[#2f3c97]'
              }`}
              id="tab-round-trace"
            >
              Round-by-Round Visual Trace ({trace.steps.length} Steps)
            </button>
            <button
              onClick={() => setActiveTab('keyExpansion')}
              className={`pb-3 text-sm sm:text-base font-bold transition-all border-b-2 cursor-pointer ${
                activeTab === 'keyExpansion'
                  ? 'text-[#142380] border-[#142380]'
                  : 'text-[#454652] border-transparent hover:text-[#2f3c97]'
              }`}
              id="tab-key-expansion"
            >
              Key Expansion Schedule (11 Round Keys)
            </button>
          </div>

          {/* TAB 1: ROUND-BY-ROUND TRACE */}
          {activeTab === 'trace' && (
            <div className="space-y-6">
              
              {/* Playback Controls Toolbar */}
              <div className="bg-white p-5 sm:p-6 rounded-3xl border border-[#D9DDE7] shadow-sm space-y-4">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                  
                  {/* Media Buttons */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setIsPlaying(false);
                        setCurrentStepIdx(0);
                      }}
                      className="p-2.5 rounded-xl border border-[#D9DDE7] text-[#454652] hover:bg-[#f0f3ff] hover:text-[#142380] transition-colors cursor-pointer"
                      title="Reset to Start"
                    >
                      <RotateCcw className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => {
                        setIsPlaying(false);
                        setCurrentStepIdx((prev) => Math.max(0, prev - 1));
                      }}
                      disabled={currentStepIdx === 0}
                      className="p-2.5 rounded-xl border border-[#D9DDE7] text-[#454652] hover:bg-[#f0f3ff] disabled:opacity-40 transition-colors cursor-pointer"
                      title="Previous Step"
                    >
                      <SkipBack className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="px-6 py-2.5 rounded-xl bg-[#142380] text-white font-bold text-sm shadow-md hover:bg-[#2f3c97] transition-all flex items-center gap-2 cursor-pointer"
                      id="play-pause-toggle-btn"
                    >
                      {isPlaying ? (
                        <>
                          <Pause className="w-4 h-4 fill-white" />
                          <span>Pause</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4 fill-white" />
                          <span>Play</span>
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => {
                        setIsPlaying(false);
                        setCurrentStepIdx((prev) => Math.min(trace.steps.length - 1, prev + 1));
                      }}
                      disabled={currentStepIdx === trace.steps.length - 1}
                      className="p-2.5 rounded-xl border border-[#D9DDE7] text-[#454652] hover:bg-[#f0f3ff] disabled:opacity-40 transition-colors cursor-pointer"
                      title="Next Step"
                    >
                      <SkipForward className="w-5 h-5" />
                    </button>

                    <div className="h-6 w-px bg-[#D9DDE7] mx-1" />

                    {/* Speed selector */}
                    <span className="text-xs font-semibold text-[#454652] hidden sm:inline">Speed:</span>
                    <select
                      value={playSpeedMs}
                      onChange={(e) => setPlaySpeedMs(Number(e.target.value))}
                      className="bg-[#F7F8FC] border border-[#D9DDE7] text-xs font-semibold text-[#151c27] rounded-lg px-2 py-1.5 cursor-pointer"
                    >
                      <option value={2000}>0.5x (Slow)</option>
                      <option value={1200}>1.0x (Normal)</option>
                      <option value={600}>2.0x (Fast)</option>
                    </select>
                  </div>

                  {/* Cell Value Format Toggle */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#454652]">Format:</span>
                    <div className="bg-[#F7F8FC] p-1 rounded-xl border border-[#D9DDE7] flex gap-1">
                      {(['hex', 'dec', 'ascii', 'binary'] as DisplayFormat[]).map((fmt) => (
                        <button
                          key={fmt}
                          onClick={() => setDisplayFormat(fmt)}
                          className={`px-3 py-1 rounded-lg text-xs font-bold uppercase transition-all cursor-pointer ${
                            displayFormat === fmt
                              ? 'bg-[#142380] text-white shadow-2xs'
                              : 'text-[#454652] hover:text-[#142380]'
                          }`}
                        >
                          {fmt}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Step Timeline Pills Bar */}
                <div className="pt-3 border-t border-[#D9DDE7]">
                  <div className="flex items-center justify-between text-xs text-[#454652] mb-2 font-medium">
                    <span>Step {currentStepIdx + 1} of {trace.steps.length}</span>
                    <span className="font-bold text-[#142380]">{currentStep.title}</span>
                  </div>
                  <div className="flex gap-1 overflow-x-auto pb-2 scrollbar-thin">
                    {trace.steps.map((step, idx) => {
                      const isActive = idx === currentStepIdx;
                      return (
                        <button
                          key={idx}
                          onClick={() => {
                            setIsPlaying(false);
                            setCurrentStepIdx(idx);
                          }}
                          className={`h-3 rounded-full flex-1 min-w-[12px] transition-all cursor-pointer ${
                            isActive
                              ? 'bg-[#ff9a5b] ring-2 ring-[#ff9a5b] ring-offset-1 scale-110'
                              : idx < currentStepIdx
                              ? 'bg-[#142380]'
                              : 'bg-[#dce2f3] hover:bg-[#c6c5d4]'
                          }`}
                          title={`Step ${idx + 1}: ${step.title}`}
                        />
                      );
                    })}
                  </div>

                  {/* Quick Round Navigation Tabs */}
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {Object.keys(stepsByRound).map((rStr) => {
                      const rNum = Number(rStr);
                      const firstStepInRound = stepsByRound[rNum][0];
                      const isCurrentRound = currentStep.round === rNum;
                      return (
                        <button
                          key={rNum}
                          onClick={() => {
                            setIsPlaying(false);
                            setCurrentStepIdx(firstStepInRound);
                          }}
                          className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                            isCurrentRound
                              ? 'bg-[#142380] text-white shadow-xs'
                              : 'bg-[#F7F8FC] text-[#454652] border border-[#D9DDE7] hover:bg-[#e7eefe]'
                          }`}
                        >
                          Round {rNum}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Grid Layout: State Matrix (Left) + Math Breakdown (Right) */}
              {currentStep.operation === 'shiftRows' ? (() => {
                const inputMatrix = currentStep.prevState || currentStep.state;
                const outputMatrix = currentStep.state;

                return (
                  <div className="space-y-6">
                    {/* Header Title & Subtitle */}
                    <div className="space-y-1">
                      <h1 className="text-2xl font-extrabold text-[#151c27] tracking-tight">
                        ShiftRows Transformation
                      </h1>
                      <p className="text-xs text-[#767683] max-w-3xl">
                        AES cyclically shifts each row of the State Matrix to the left to increase diffusion. This ensures that bytes from the same column are distributed across different columns.
                      </p>
                    </div>

                    {/* Top 3-Panel Row: BEFORE SHIFTROWS | CYCLIC SHIFT ANIMATION | AFTER SHIFTROWS */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
                      
                      {/* Panel 1: BEFORE SHIFTROWS */}
                      <div className="lg:col-span-3 bg-white p-5 rounded-3xl border border-[#D9DDE7] shadow-xs flex flex-col justify-between space-y-4">
                        <div className="text-center">
                          <span className="text-[10px] font-extrabold text-[#767683] uppercase tracking-wider">
                            BEFORE SHIFTROWS
                          </span>
                        </div>

                        <div className="grid grid-cols-4 gap-1.5 p-2 bg-[#F7F8FC] rounded-2xl border border-[#D9DDE7] my-auto">
                          {Array.from({ length: 4 }).map((_, r) =>
                            Array.from({ length: 4 }).map((_, c) => {
                              const val = inputMatrix[r][c];
                              const isActiveRow = r === activeShiftRowIdx;

                              return (
                                <div
                                  key={`before-sr-${r}-${c}`}
                                  onClick={() => setActiveShiftRowIdx(r)}
                                  className={`aspect-square rounded-xl text-xs font-mono font-extrabold flex items-center justify-center cursor-pointer transition-all ${
                                    isActiveRow
                                      ? 'border-2 border-[#142380] bg-[#f0f3ff] text-[#142380] shadow-2xs'
                                      : 'bg-white text-[#151c27] border border-[#D9DDE7] hover:bg-[#F7F8FC]'
                                  }`}
                                >
                                  {val.toString(16).padStart(2, '0').toUpperCase()}
                                </div>
                              );
                            })
                          )}
                        </div>

                        <div className="text-center text-[11px] font-medium text-[#767683]">
                          Processing: Row {activeShiftRowIdx}
                        </div>
                      </div>

                      {/* Panel 2: CYCLIC ROW SHIFT ANIMATION */}
                      <div className="lg:col-span-6 bg-white p-5 rounded-3xl border border-[#D9DDE7] shadow-xs flex flex-col justify-between space-y-4">
                        <div className="text-center">
                          <span className="text-[10px] font-extrabold text-[#767683] uppercase tracking-wider">
                            CYCLIC ROW SHIFT ANIMATION
                          </span>
                        </div>

                        <div className="space-y-3 my-auto py-2">
                          {/* Row 0 */}
                          <div
                            onClick={() => setActiveShiftRowIdx(0)}
                            className={`p-2.5 rounded-2xl border transition-all cursor-pointer flex flex-col sm:flex-row items-center justify-between gap-2 ${
                              activeShiftRowIdx === 0
                                ? 'bg-[#f0f3ff] border-[#142380] shadow-2xs'
                                : 'bg-[#F7F8FC] border-[#D9DDE7] hover:bg-[#e7eefe]'
                            }`}
                          >
                            <span className="text-xs font-extrabold text-[#767683] w-28 text-left">
                              Row 0 (No Shift)
                            </span>
                            <div className="flex gap-2">
                              {[0, 1, 2, 3].map((c) => (
                                <div
                                  key={`r0-c${c}`}
                                  className="w-11 h-11 rounded-xl bg-white border border-[#D9DDE7] flex items-center justify-center font-mono font-extrabold text-xs text-[#151c27] shadow-2xs"
                                >
                                  {inputMatrix[0][c].toString(16).padStart(2, '0').toUpperCase()}
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Row 1 */}
                          <div
                            onClick={() => setActiveShiftRowIdx(1)}
                            className={`p-2.5 rounded-2xl border transition-all cursor-pointer flex flex-col sm:flex-row items-center justify-between gap-2 ${
                              activeShiftRowIdx === 1
                                ? 'bg-[#f0f3ff] border-[#142380] shadow-2xs'
                                : 'bg-[#F7F8FC] border-[#D9DDE7] hover:bg-[#e7eefe]'
                            }`}
                          >
                            <div className="flex items-center gap-1.5 w-28">
                              <span className="text-xs font-extrabold text-[#142380]">
                                Row 1 (Shift 1)
                              </span>
                              <ArrowLeft className="w-3.5 h-3.5 text-[#142380]" />
                            </div>
                            <div className="flex gap-2">
                              {[1, 2, 3, 0].map((cIdx, pos) => {
                                const val = inputMatrix[1][cIdx];
                                const isWrapped = pos === 3;
                                return (
                                  <div
                                    key={`r1-pos${pos}`}
                                    className={`w-11 h-11 rounded-xl flex items-center justify-center font-mono font-extrabold text-xs shadow-2xs transition-all ${
                                      isWrapped
                                        ? 'bg-[#ffdbc9] border-2 border-[#ff9a5b] text-[#96490d]'
                                        : 'bg-[#142380] text-white'
                                    }`}
                                  >
                                    {val.toString(16).padStart(2, '0').toUpperCase()}
                                  </div>
                                );
                              })}
                            </div>
                          </div>

                          {/* Row 2 */}
                          <div
                            onClick={() => setActiveShiftRowIdx(2)}
                            className={`p-2.5 rounded-2xl border transition-all cursor-pointer flex flex-col sm:flex-row items-center justify-between gap-2 ${
                              activeShiftRowIdx === 2
                                ? 'bg-[#f0f3ff] border-[#142380] shadow-2xs'
                                : 'bg-[#F7F8FC] border-[#D9DDE7] hover:bg-[#e7eefe]'
                            }`}
                          >
                            <div className="flex items-center gap-1.5 w-28">
                              <span className="text-xs font-extrabold text-[#142380]">
                                Row 2 (Shift 2)
                              </span>
                              <ChevronsLeft className="w-3.5 h-3.5 text-[#142380]" />
                            </div>
                            <div className="flex gap-2">
                              {[2, 3, 0, 1].map((cIdx, pos) => {
                                const val = inputMatrix[2][cIdx];
                                const isWrapped = pos >= 2;
                                return (
                                  <div
                                    key={`r2-pos${pos}`}
                                    className={`w-11 h-11 rounded-xl flex items-center justify-center font-mono font-extrabold text-xs shadow-2xs transition-all ${
                                      isWrapped
                                        ? 'bg-[#ffdbc9] border-2 border-[#ff9a5b] text-[#96490d]'
                                        : 'bg-[#142380] text-white'
                                    }`}
                                  >
                                    {val.toString(16).padStart(2, '0').toUpperCase()}
                                  </div>
                                );
                              })}
                            </div>
                          </div>

                          {/* Row 3 */}
                          <div
                            onClick={() => setActiveShiftRowIdx(3)}
                            className={`p-2.5 rounded-2xl border transition-all cursor-pointer flex flex-col sm:flex-row items-center justify-between gap-2 ${
                              activeShiftRowIdx === 3
                                ? 'bg-[#f0f3ff] border-[#142380] shadow-2xs'
                                : 'bg-[#F7F8FC] border-[#D9DDE7] hover:bg-[#e7eefe]'
                            }`}
                          >
                            <div className="flex items-center gap-1.5 w-28">
                              <span className="text-xs font-extrabold text-[#142380]">
                                Row 3 (Shift 3)
                              </span>
                              <ChevronsLeft className="w-3.5 h-3.5 text-[#142380]" />
                            </div>
                            <div className="flex gap-2">
                              {[3, 0, 1, 2].map((cIdx, pos) => {
                                const val = inputMatrix[3][cIdx];
                                const isWrapped = pos >= 1;
                                return (
                                  <div
                                    key={`r3-pos${pos}`}
                                    className={`w-11 h-11 rounded-xl flex items-center justify-center font-mono font-extrabold text-xs shadow-2xs transition-all ${
                                      isWrapped
                                        ? 'bg-[#ffdbc9] border-2 border-[#ff9a5b] text-[#96490d]'
                                        : 'bg-[#142380] text-white'
                                    }`}
                                  >
                                    {val.toString(16).padStart(2, '0').toUpperCase()}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>

                        <div className="text-center text-[11px] font-extrabold text-[#142380]">
                          Click a row to inspect shift behavior
                        </div>
                      </div>

                      {/* Panel 3: AFTER SHIFTROWS */}
                      <div className="lg:col-span-3 bg-white p-5 rounded-3xl border border-[#D9DDE7] shadow-xs flex flex-col justify-between space-y-4">
                        <div className="text-center">
                          <span className="text-[10px] font-extrabold text-[#767683] uppercase tracking-wider">
                            AFTER SHIFTROWS
                          </span>
                        </div>

                        <div className="grid grid-cols-4 gap-1.5 p-2 bg-[#F7F8FC] rounded-2xl border border-[#D9DDE7] my-auto">
                          {Array.from({ length: 4 }).map((_, r) =>
                            Array.from({ length: 4 }).map((_, c) => {
                              const val = outputMatrix[r][c];
                              const isProc = r <= activeShiftRowIdx;
                              const isActRow = r === activeShiftRowIdx;

                              return (
                                <div
                                  key={`after-sr-${r}-${c}`}
                                  onClick={() => setActiveShiftRowIdx(r)}
                                  className={`aspect-square rounded-xl text-xs font-mono font-extrabold flex items-center justify-center cursor-pointer transition-all ${
                                    isActRow
                                      ? 'border-2 border-[#ff9a5b] bg-[#fff5ef] text-[#96490d] shadow-2xs'
                                      : isProc
                                      ? 'bg-[#f0f3ff] text-[#142380] border border-[#dce2f3]'
                                      : 'bg-white text-[#c6c5d4] border border-dashed border-[#D9DDE7]'
                                  }`}
                                >
                                  {isProc ? val.toString(16).padStart(2, '0').toUpperCase() : '--'}
                                </div>
                              );
                            })
                          )}
                        </div>

                        <div className="text-center text-[11px] font-extrabold text-[#142380]">
                          Row {activeShiftRowIdx + 1}/4 Processed
                        </div>
                      </div>

                    </div>

                    {/* Middle Row: Live Detail / Shift Specs + Controls */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
                      
                      {/* Left: Shift Rules & Live Detail */}
                      <div className="lg:col-span-9 bg-white p-5 rounded-3xl border border-[#D9DDE7] shadow-xs flex flex-col justify-between space-y-4">
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center divide-x divide-[#f0f3ff]">
                          <div className={`p-2 rounded-2xl transition-all ${activeShiftRowIdx === 0 ? 'bg-[#f0f3ff]' : ''}`}>
                            <div className="text-[10px] font-extrabold text-[#767683] uppercase tracking-wider mb-1">
                              ROW 0
                            </div>
                            <div className="text-sm font-mono font-extrabold text-[#142380]">
                              No Shift (0)
                            </div>
                            <div className="text-[10px] text-[#767683] mt-1 font-medium">
                              Positions unchanged
                            </div>
                          </div>

                          <div className={`p-2 rounded-2xl transition-all ${activeShiftRowIdx === 1 ? 'bg-[#f0f3ff]' : ''}`}>
                            <div className="text-[10px] font-extrabold text-[#767683] uppercase tracking-wider mb-1">
                              ROW 1
                            </div>
                            <div className="text-sm font-mono font-extrabold text-[#142380]">
                              Shift 1 Left
                            </div>
                            <div className="text-[10px] text-[#96490d] mt-1 font-extrabold">
                              Byte 0 → Col 3
                            </div>
                          </div>

                          <div className={`p-2 rounded-2xl transition-all ${activeShiftRowIdx === 2 ? 'bg-[#f0f3ff]' : ''}`}>
                            <div className="text-[10px] font-extrabold text-[#767683] uppercase tracking-wider mb-1">
                              ROW 2
                            </div>
                            <div className="text-sm font-mono font-extrabold text-[#142380]">
                              Shift 2 Left
                            </div>
                            <div className="text-[10px] text-[#96490d] mt-1 font-extrabold">
                              Bytes 0,1 → Col 2,3
                            </div>
                          </div>

                          <div className={`p-2 rounded-2xl transition-all ${activeShiftRowIdx === 3 ? 'bg-[#f0f3ff]' : ''}`}>
                            <div className="text-[10px] font-extrabold text-[#767683] uppercase tracking-wider mb-1">
                              ROW 3
                            </div>
                            <div className="text-sm font-mono font-extrabold text-[#142380]">
                              Shift 3 Left
                            </div>
                            <div className="text-[10px] text-[#96490d] mt-1 font-extrabold">
                              Bytes 0,1,2 → Col 1,2,3
                            </div>
                          </div>
                        </div>

                        <div className="pt-3 border-t border-[#f0f3ff] text-center text-xs text-[#454652] font-medium">
                          Diffusion Principle: Bytes from column <span className="font-bold text-[#142380]">C{activeShiftRowIdx}</span> are now distributed across 4 distinct columns!
                        </div>
                      </div>

                      {/* Right: Controls Card */}
                      <div className="lg:col-span-3 bg-white p-5 rounded-3xl border border-[#D9DDE7] shadow-xs flex items-center justify-center gap-3">
                        <button
                          onClick={() => setActiveShiftRowIdx((prev) => Math.max(0, prev - 1))}
                          disabled={activeShiftRowIdx === 0}
                          className="p-3.5 rounded-2xl bg-[#F7F8FC] border border-[#D9DDE7] hover:bg-[#e7eefe] text-[#151c27] disabled:opacity-40 transition-all cursor-pointer"
                          title="Previous Row"
                        >
                          <SkipBack className="w-5 h-5" />
                        </button>

                        <button
                          onClick={() => setIsPlaying(!isPlaying)}
                          className="p-4 rounded-2xl bg-[#142380] text-white hover:bg-[#2f3c97] shadow-sm transition-all cursor-pointer"
                          title={isPlaying ? 'Pause' : 'Play'}
                        >
                          {isPlaying ? <Pause className="w-5 h-5 fill-white" /> : <Play className="w-5 h-5 fill-white" />}
                        </button>

                        <button
                          onClick={() => setActiveShiftRowIdx((prev) => Math.min(3, prev + 1))}
                          disabled={activeShiftRowIdx === 3}
                          className="p-3.5 rounded-2xl bg-[#F7F8FC] border border-[#D9DDE7] hover:bg-[#e7eefe] text-[#151c27] disabled:opacity-40 transition-all cursor-pointer"
                          title="Next Row"
                        >
                          <SkipForward className="w-5 h-5" />
                        </button>

                        <button
                          onClick={() => { setIsPlaying(false); setActiveShiftRowIdx(0); }}
                          className="p-3.5 rounded-2xl bg-[#F7F8FC] border border-[#D9DDE7] hover:bg-[#e7eefe] text-[#767683] transition-all cursor-pointer"
                          title="Reset"
                        >
                          <RotateCcw className="w-5 h-5" />
                        </button>
                      </div>

                    </div>

                    {/* Bottom Row: Educational Box + Learning Hub */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
                      
                      {/* Left: Why ShiftRows? Card */}
                      <div className="lg:col-span-8 bg-white p-6 rounded-3xl border border-[#D9DDE7] shadow-xs space-y-3 flex flex-col justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-2xl bg-[#f0f3ff] text-[#142380] flex items-center justify-center shrink-0">
                            <Brain className="w-5 h-5" />
                          </div>
                          <h2 className="text-lg font-extrabold text-[#151c27]">
                            Why ShiftRows?
                          </h2>
                        </div>

                        <p className="text-xs text-[#454652] leading-relaxed">
                          This step creates <strong className="font-extrabold text-[#142380]">Diffusion</strong> by ensuring that each column of the input state is spread across four columns of the output state. Combined with MixColumns, this guarantees that every byte of the final ciphertext depends on every byte of the initial plaintext (the Avalanche Effect).
                        </p>
                      </div>

                      {/* Right: Learning Hub Card */}
                      <div className="lg:col-span-4 bg-[#142380] text-white p-6 rounded-3xl shadow-md space-y-4 flex flex-col justify-between">
                        <h3 className="text-base font-extrabold text-white tracking-tight">
                          Learning Hub
                        </h3>

                        <div className="space-y-2.5">
                          {[
                            'What is Diffusion?',
                            'Why Rows Are Shifted',
                            'Why Row 0 Does Not Move',
                            'Preparing for MixColumns'
                          ].map((item, idx) => (
                            <button
                              key={`sr-hub-${idx}`}
                              className="w-full bg-white/10 hover:bg-white/20 text-white rounded-2xl p-3 flex items-center justify-between text-xs font-bold transition-all cursor-pointer border border-white/10"
                            >
                              <span>{item}</span>
                              <ChevronRight className="w-4 h-4 text-white/80" />
                            </button>
                          ))}
                        </div>
                      </div>

                    </div>

                    {/* ShiftRows Complete Banner */}
                    <div className="bg-[#e8f8ee] border-2 border-[#10b981] rounded-3xl p-6 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-[#10b981] text-white flex items-center justify-center shrink-0">
                          <CheckCircle2 className="w-7 h-7" />
                        </div>
                        <div>
                          <h3 className="text-base font-extrabold text-[#151c27]">
                            ShiftRows Completed for Round {currentStep.round}
                          </h3>
                          <p className="text-xs text-[#454652] mt-0.5">
                            All 4 rows cyclically shifted! State matrix diffusion achieved. Ready for MixColumns.
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          const nextIdx = trace.steps.findIndex(
                            (s, idx) => idx > currentStepIdx && s.operation === 'mixColumns'
                          );
                          if (nextIdx !== -1) {
                            setCurrentStepIdx(nextIdx);
                          } else if (currentStepIdx < trace.steps.length - 1) {
                            setCurrentStepIdx(currentStepIdx + 1);
                          }
                        }}
                        className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-[#142380] hover:bg-[#2f3c97] text-white font-extrabold text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer shrink-0"
                      >
                        <span>Continue to MixColumns</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>

                  </div>
                );
              })() : currentStep.operation === 'subBytes' ? (() => {
                const curRow = activeSubByteIdx % 4;
                const curCol = Math.floor(activeSubByteIdx / 4);
                const inputMatrix = currentStep.prevState || currentStep.state;
                const outputMatrix = currentStep.state;
                const curSourceByte = inputMatrix[curRow]?.[curCol] ?? 0;
                const rowNibble = (curSourceByte >> 4) & 0x0F;
                const colNibble = curSourceByte & 0x0F;
                const substitutedByte = SBOX[curSourceByte] ?? outputMatrix[curRow]?.[curCol] ?? 0;

                const curSourceByteHex = curSourceByte.toString(16).padStart(2, '0').toUpperCase();
                const substitutedByteHex = substitutedByte.toString(16).padStart(2, '0').toUpperCase();
                const rowNibbleBinary = rowNibble.toString(2).padStart(4, '0');
                const colNibbleBinary = colNibble.toString(2).padStart(4, '0');
                const outputAscii = (substitutedByte >= 32 && substitutedByte <= 126) ? String.fromCharCode(substitutedByte) : (curSourceByte >= 32 && curSourceByte <= 126 ? String.fromCharCode(curSourceByte) : 'R');

                return (
                  <div className="space-y-6">
                    {/* Header Title & Subtitle */}
                    <div className="space-y-1">
                      <h1 className="text-2xl font-extrabold text-[#151c27] tracking-tight">
                        SubBytes Transformation
                      </h1>
                      <p className="text-xs text-[#767683] max-w-3xl">
                        Each byte in the State Matrix is replaced using the AES Substitution Box (S-Box) to introduce confusion through non-linear substitution.
                      </p>
                    </div>

                    {/* Top 3-Panel Row: ORIGINAL STATE MATRIX | S-BOX LOOKUP LENS | UPDATED STATE MATRIX */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
                      
                      {/* Panel 1: ORIGINAL STATE MATRIX */}
                      <div className="lg:col-span-3 bg-white p-5 rounded-3xl border border-[#D9DDE7] shadow-xs flex flex-col justify-between space-y-4">
                        <div className="text-center">
                          <span className="text-[10px] font-extrabold text-[#767683] uppercase tracking-wider">
                            ORIGINAL STATE MATRIX
                          </span>
                        </div>

                        <div className="grid grid-cols-4 gap-1.5 p-2 bg-[#F7F8FC] rounded-2xl border border-[#D9DDE7] my-auto">
                          {Array.from({ length: 4 }).map((_, r) =>
                            Array.from({ length: 4 }).map((_, c) => {
                              const bIdx = c * 4 + r;
                              const val = inputMatrix[r][c];
                              const isCur = bIdx === activeSubByteIdx;

                              return (
                                <div
                                  key={`orig-sb-${r}-${c}`}
                                  onClick={() => setActiveSubByteIdx(bIdx)}
                                  className={`aspect-square rounded-xl text-xs font-mono font-extrabold flex items-center justify-center cursor-pointer transition-all ${
                                    isCur
                                      ? 'border-2 border-[#ff9a5b] bg-[#fff5ef] text-[#96490d] shadow-2xs scale-105'
                                      : 'bg-white text-[#151c27] border border-[#D9DDE7] hover:bg-[#f0f3ff]'
                                  }`}
                                >
                                  0x{val.toString(16).padStart(2, '0').toUpperCase()}
                                </div>
                              );
                            })
                          )}
                        </div>

                        <div className="text-center text-[11px] font-medium text-[#767683]">
                          Processing: Row {curRow}, Col {curCol}
                        </div>
                      </div>

                      {/* Panel 2: S-BOX LOOKUP LENS */}
                      <div className="lg:col-span-6 bg-white p-6 rounded-3xl border border-[#D9DDE7] shadow-xs flex flex-col justify-between space-y-4 text-center relative overflow-hidden">
                        <span className="text-[10px] font-extrabold text-[#767683] uppercase tracking-wider">
                          S-BOX LOOKUP LENS
                        </span>

                        <div className="flex items-center justify-center gap-4 sm:gap-6 my-auto py-4">
                          {/* Left Input Box */}
                          <div className="flex flex-col items-center">
                            <div className="w-20 h-20 rounded-2xl bg-[#142380] text-white flex items-center justify-center font-mono font-extrabold text-xl shadow-md">
                              0x{curSourceByteHex}
                            </div>
                            <div className="flex gap-1.5 mt-3">
                              <span className="bg-[#F7F8FC] border border-[#D9DDE7] text-[#767683] text-[10px] font-extrabold px-2 py-0.5 rounded-md">
                                Row: {rowNibble}
                              </span>
                              <span className="bg-[#F7F8FC] border border-[#D9DDE7] text-[#767683] text-[10px] font-extrabold px-2 py-0.5 rounded-md">
                                Col: {colNibble}
                              </span>
                            </div>
                          </div>

                          {/* Center S-Box Lens Icon & Arrow */}
                          <div className="flex items-center gap-2">
                            <div className="w-14 h-14 rounded-full border-2 border-[#142380] text-[#142380] flex flex-col items-center justify-center bg-[#f0f3ff] shadow-2xs">
                              <RefreshCw className="w-4 h-4 text-[#142380]" />
                              <span className="text-[8px] font-extrabold text-[#142380] uppercase tracking-tighter">S-BOX</span>
                            </div>
                            <ArrowRight className="w-5 h-5 text-[#142380]" />
                          </div>

                          {/* Right Output Box */}
                          <div className="flex flex-col items-center">
                            <div className="w-20 h-20 rounded-2xl bg-[#ffdbc9] border-2 border-[#ff9a5b] text-[#96490d] flex items-center justify-center font-mono font-extrabold text-xl shadow-md">
                              0x{substitutedByteHex}
                            </div>
                            <div className="mt-3">
                              <span className="bg-[#ffdbc9] text-[#96490d] text-[10px] font-extrabold px-2.5 py-1 rounded-md">
                                Result: 0x{substitutedByteHex}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Interactive Full Table Trigger */}
                        <div className="pt-2 border-t border-[#f0f3ff]">
                          <button
                            onClick={() => setShowFullSBoxModal(true)}
                            className="text-xs font-bold text-[#142380] hover:underline cursor-pointer inline-flex items-center gap-1.5"
                          >
                            <Grid className="w-3.5 h-3.5" />
                            <span>View Full S-Box Table Grid</span>
                          </button>
                        </div>
                      </div>

                      {/* Panel 3: UPDATED STATE MATRIX */}
                      <div className="lg:col-span-3 bg-white p-5 rounded-3xl border border-[#D9DDE7] shadow-xs flex flex-col justify-between space-y-4">
                        <div className="text-center">
                          <span className="text-[10px] font-extrabold text-[#767683] uppercase tracking-wider">
                            UPDATED STATE MATRIX
                          </span>
                        </div>

                        <div className="grid grid-cols-4 gap-1.5 p-2 bg-[#F7F8FC] rounded-2xl border border-[#D9DDE7] my-auto">
                          {Array.from({ length: 4 }).map((_, r) =>
                            Array.from({ length: 4 }).map((_, c) => {
                              const bIdx = c * 4 + r;
                              const isProc = bIdx <= activeSubByteIdx;
                              const isCur = bIdx === activeSubByteIdx;
                              const val = outputMatrix[r][c];

                              return (
                                <div
                                  key={`upd-sb-${r}-${c}`}
                                  onClick={() => setActiveSubByteIdx(bIdx)}
                                  className={`aspect-square rounded-xl text-xs font-mono font-extrabold flex items-center justify-center cursor-pointer transition-all ${
                                    isCur
                                      ? 'border-2 border-[#ff9a5b] bg-[#fff5ef] text-[#96490d] shadow-2xs scale-105'
                                      : isProc
                                      ? 'bg-[#f0f3ff] text-[#142380] border border-[#dce2f3]'
                                      : 'bg-white text-[#c6c5d4] border border-dashed border-[#D9DDE7]'
                                  }`}
                                >
                                  {isProc ? `0x${val.toString(16).padStart(2, '0').toUpperCase()}` : '--'}
                                </div>
                              );
                            })
                          )}
                        </div>

                        <div className="text-center text-[11px] font-extrabold text-[#142380]">
                          {activeSubByteIdx + 1}/16 Bytes Processed
                        </div>
                      </div>

                    </div>

                    {/* Middle Row: Math Breakdown Card (Left) + Player Controls (Right) */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
                      
                      {/* Left: Math & Binary Mapping Card */}
                      <div className="lg:col-span-9 bg-white p-5 rounded-3xl border border-[#D9DDE7] shadow-xs flex flex-col justify-between space-y-4">
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center divide-x divide-[#f0f3ff]">
                          <div className="p-2">
                            <div className="text-[10px] font-extrabold text-[#767683] uppercase tracking-wider mb-1">
                              ORIGINAL HEX
                            </div>
                            <div className="text-base font-mono font-extrabold text-[#142380]">
                              0x{curSourceByteHex}
                            </div>
                          </div>

                          <div className="p-2">
                            <div className="text-[10px] font-extrabold text-[#767683] uppercase tracking-wider mb-1">
                              BINARY MAPPING
                            </div>
                            <div className="text-base font-mono font-extrabold">
                              <span className="text-[#142380]">{rowNibbleBinary}</span>{' '}
                              <span className="text-[#96490d]">{colNibbleBinary}</span>
                            </div>
                          </div>

                          <div className="p-2">
                            <div className="text-[10px] font-extrabold text-[#767683] uppercase tracking-wider mb-1">
                              S-BOX (ROW, COL)
                            </div>
                            <div className="text-base font-mono font-extrabold text-[#151c27]">
                              Row {rowNibble}, Col {colNibble}
                            </div>
                          </div>

                          <div className="p-2">
                            <div className="text-[10px] font-extrabold text-[#767683] uppercase tracking-wider mb-1">
                              OUTPUT HEX
                            </div>
                            <div className="text-base font-mono font-extrabold text-[#96490d]">
                              0x{substitutedByteHex}
                            </div>
                          </div>
                        </div>

                        <div className="pt-3 border-t border-[#f0f3ff] text-center">
                          <span className="text-[10px] font-extrabold text-[#767683] uppercase tracking-wider mr-2">
                            ASCII RESULT
                          </span>
                          <span className="text-sm font-mono font-extrabold text-[#151c27]">
                            "{outputAscii}"
                          </span>
                        </div>
                      </div>

                      {/* Right: Player Controls Card */}
                      <div className="lg:col-span-3 bg-white p-5 rounded-3xl border border-[#D9DDE7] shadow-xs flex items-center justify-center gap-3">
                        <button
                          onClick={() => setActiveSubByteIdx((prev) => Math.max(0, prev - 1))}
                          disabled={activeSubByteIdx === 0}
                          className="p-3.5 rounded-2xl bg-[#F7F8FC] border border-[#D9DDE7] hover:bg-[#e7eefe] text-[#151c27] disabled:opacity-40 transition-all cursor-pointer"
                          title="Previous Byte"
                        >
                          <SkipBack className="w-5 h-5" />
                        </button>

                        <button
                          onClick={() => setIsPlaying(!isPlaying)}
                          className="p-4 rounded-2xl bg-[#142380] text-white hover:bg-[#2f3c97] shadow-sm transition-all cursor-pointer"
                          title={isPlaying ? 'Pause' : 'Play'}
                        >
                          {isPlaying ? <Pause className="w-5 h-5 fill-white" /> : <Play className="w-5 h-5 fill-white" />}
                        </button>

                        <button
                          onClick={() => setActiveSubByteIdx((prev) => Math.min(15, prev + 1))}
                          disabled={activeSubByteIdx === 15}
                          className="p-3.5 rounded-2xl bg-[#F7F8FC] border border-[#D9DDE7] hover:bg-[#e7eefe] text-[#151c27] disabled:opacity-40 transition-all cursor-pointer"
                          title="Next Byte"
                        >
                          <SkipForward className="w-5 h-5" />
                        </button>

                        <button
                          onClick={() => { setIsPlaying(false); setActiveSubByteIdx(0); }}
                          className="p-3.5 rounded-2xl bg-[#F7F8FC] border border-[#D9DDE7] hover:bg-[#e7eefe] text-[#767683] transition-all cursor-pointer"
                          title="Reset"
                        >
                          <RotateCcw className="w-5 h-5" />
                        </button>
                      </div>

                    </div>

                    {/* Bottom Row: Educational Box (Left) + Learning Hub (Right) */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
                      
                      {/* Left: Why SubBytes? Card */}
                      <div className="lg:col-span-8 bg-white p-6 rounded-3xl border border-[#D9DDE7] shadow-xs space-y-3 flex flex-col justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-2xl bg-[#f0f3ff] text-[#142380] flex items-center justify-center shrink-0">
                            <Brain className="w-5 h-5" />
                          </div>
                          <h2 className="text-lg font-extrabold text-[#151c27]">
                            Why SubBytes?
                          </h2>
                        </div>

                        <p className="text-xs text-[#454652] leading-relaxed">
                          SubBytes is the only non-linear transformation in AES. By using the S-Box, we ensure that the relationship between the plaintext and the ciphertext is complex. This principle, known as <strong className="font-extrabold text-[#142380]">Confusion</strong>, prevents attackers from using simple mathematical models to reverse the encryption. The S-Box is specially constructed based on the multiplicative inverse in GF(2⁸) followed by an affine transformation to resist linear and differential cryptanalysis.
                        </p>
                      </div>

                      {/* Right: Learning Hub Card */}
                      <div className="lg:col-span-4 bg-[#142380] text-white p-6 rounded-3xl shadow-md space-y-4 flex flex-col justify-between">
                        <h3 className="text-base font-extrabold text-white tracking-tight">
                          Learning Hub
                        </h3>

                        <div className="space-y-2.5">
                          {[
                            'What is the AES S-Box?',
                            'Understanding Confusion',
                            'Math behind S-Box'
                          ].map((item, idx) => (
                            <button
                              key={`hub-item-${idx}`}
                              onClick={() => setShowFullSBoxModal(true)}
                              className="w-full bg-white/10 hover:bg-white/20 text-white rounded-2xl p-3.5 flex items-center justify-between text-xs font-bold transition-all cursor-pointer border border-white/10"
                            >
                              <span>{item}</span>
                              <ChevronRight className="w-4 h-4 text-white/80" />
                            </button>
                          ))}
                        </div>
                      </div>

                    </div>

                    {/* SubBytes Phase Complete Banner */}
                    {activeSubByteIdx === 15 && (
                      <div className="bg-[#e8f8ee] border-2 border-[#10b981] rounded-3xl p-6 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-[#10b981] text-white flex items-center justify-center shrink-0">
                            <CheckCircle2 className="w-7 h-7" />
                          </div>
                          <div>
                            <h3 className="text-base font-extrabold text-[#065f46]">
                              SubBytes Complete for Round {currentStep.round}
                            </h3>
                            <p className="text-xs text-[#047857] mt-0.5">
                              All 16 bytes in the state matrix have been substituted through the S-Box table.
                            </p>
                          </div>
                        </div>

                        <button
                          onClick={() => {
                            const nextIdx = trace.steps.findIndex((s, idx) => idx > currentStepIdx && s.operation === 'shiftRows');
                            if (nextIdx >= 0) {
                              setCurrentStepIdx(nextIdx);
                            } else if (currentStepIdx < trace.steps.length - 1) {
                              setCurrentStepIdx(currentStepIdx + 1);
                            }
                          }}
                          className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-[#142380] hover:bg-[#2f3c97] text-white font-extrabold text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer shrink-0"
                        >
                          <span>Continue to ShiftRows</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                );
              })() : currentStep.operation === 'addRoundKey' ? (() => {
                const curRow = activeAddKeyByteIdx % 4;
                const curCol = Math.floor(activeAddKeyByteIdx / 4);
                const inputMatrix = currentStep.prevState || currentStep.state;
                const keyMatrix = currentStep.roundKey || Array.from({ length: 4 }, () => [0, 0, 0, 0]);
                const curStateByte = inputMatrix[curRow]?.[curCol] ?? 0;
                const curKeyByte = keyMatrix[curRow]?.[curCol] ?? 0;
                const curResultByte = curStateByte ^ curKeyByte;
                const outputMatrix = currentStep.state;

                return (
                  <div className="space-y-6">
                    {/* Top Header Banner */}
                    <div className="bg-white p-5 rounded-3xl border border-[#D9DDE7] shadow-2xs">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="bg-[#ffdbc9] text-[#96490d] text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
                              Step {currentStep.round === 0 ? '1' : '8'}: Key Addition
                            </span>
                            <h2 className="text-sm font-extrabold text-[#454652] tracking-wider uppercase">
                              ADDROUNDKEY TRANSFORMATION
                            </h2>
                          </div>
                          <p className="text-xs text-[#767683] max-w-2xl">
                            The final transformation of the round. In this step, the 128-bit state is combined with a 128-bit subkey using a bitwise XOR operation.
                          </p>
                        </div>

                        {/* Top-right controls */}
                        <div className="flex items-center gap-1.5 self-end sm:self-auto">
                          <button
                            onClick={() => { setIsPlaying(false); setActiveAddKeyByteIdx(0); }}
                            className="p-2 rounded-xl bg-[#f0f3ff] text-[#142380] hover:bg-[#e7eefe] transition-colors cursor-pointer"
                            title="Reset Byte"
                          >
                            <RotateCcw className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setIsPlaying(!isPlaying)}
                            className="p-2 rounded-xl bg-[#142380] text-white hover:bg-[#2f3c97] transition-colors cursor-pointer"
                            title={isPlaying ? 'Pause' : 'Play'}
                          >
                            {isPlaying ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white" />}
                          </button>
                          <button
                            onClick={() => setActiveAddKeyByteIdx((prev) => (prev + 1) % 16)}
                            className="p-2 rounded-xl bg-[#f0f3ff] text-[#142380] hover:bg-[#e7eefe] transition-colors cursor-pointer"
                            title="Next Byte"
                          >
                            <SkipForward className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Main 3 Panels Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-stretch">
                      
                      {/* PANEL 1: STATE MATRIX (INPUT) */}
                      <div className="bg-white p-5 rounded-3xl border border-[#D9DDE7] shadow-sm space-y-4 flex flex-col justify-between">
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-extrabold text-[#767683] uppercase tracking-wider">
                            STATE MATRIX (INPUT)
                          </span>
                          <span className="bg-[#e7eefe] text-[#142380] text-[10px] font-extrabold px-2.5 py-1 rounded-md uppercase tracking-wider">
                            {currentStep.round === 0 ? 'From Input' : 'From MixColumns'}
                          </span>
                        </div>

                        {/* 4x4 Grid Matrix */}
                        <div className="grid grid-cols-4 gap-2.5 my-auto max-w-xs mx-auto w-full">
                          {Array.from({ length: 4 }).map((_, r) =>
                            Array.from({ length: 4 }).map((_, c) => {
                              const byteIdx = c * 4 + r; // column-major
                              const val = inputMatrix[r][c];
                              const isSelected = byteIdx === activeAddKeyByteIdx;

                              return (
                                <div
                                  key={`in-${r}-${c}`}
                                  onClick={() => setActiveAddKeyByteIdx(byteIdx)}
                                  className={`p-3 rounded-2xl border-2 font-mono font-extrabold text-sm text-center transition-all cursor-pointer ${
                                    isSelected
                                      ? 'border-[#142380] bg-[#e7eefe] text-[#142380] shadow-sm scale-105 z-10'
                                      : 'border-[#D9DDE7] bg-[#F7F8FC] text-[#151c27] hover:border-[#c6c5d4]'
                                  }`}
                                >
                                  {val.toString(16).padStart(2, '0').toUpperCase()}
                                </div>
                              );
                            })
                          )}
                        </div>

                        <div className="text-[11px] text-[#767683] text-center font-medium">
                          Input state before XOR operation
                        </div>
                      </div>

                      {/* PANEL 2: XOR OPERATION (ENGINE) */}
                      <div className="bg-[#f0f3ff]/60 rounded-3xl border-2 border-dashed border-[#142380]/20 p-5 text-center flex flex-col items-center justify-between space-y-4 shadow-sm">
                        <div className="text-xs font-extrabold text-[#142380] uppercase tracking-wider">
                          XOR OPERATION (ENGINE)
                        </div>

                        {/* State Byte Box */}
                        <div className="space-y-1 w-full flex flex-col items-center">
                          <span className="text-[10px] font-extrabold text-[#454652] uppercase tracking-wider">
                            STATE BYTE ({curStateByte.toString(16).padStart(2, '0').toUpperCase()})
                          </span>
                          <div className="w-16 h-16 rounded-2xl bg-white border-2 border-[#142380] text-[#142380] font-mono font-extrabold text-xl flex items-center justify-center shadow-xs">
                            {curStateByte.toString(16).padStart(2, '0').toUpperCase()}
                          </div>
                        </div>

                        {/* Circle Plus Icon */}
                        <div className="flex items-center gap-2 text-[#96490d]">
                          <div className="w-8 h-8 rounded-full bg-[#ffdbc9] border border-[#ff9a5b] text-[#96490d] font-mono font-extrabold text-base flex items-center justify-center shadow-2xs">
                            ⊕
                          </div>
                          <span className="text-[10px] font-extrabold text-[#96490d] uppercase tracking-wider">
                            ROUND KEY BYTE ({curKeyByte.toString(16).padStart(2, '0').toUpperCase()})
                          </span>
                        </div>

                        {/* Round Key Byte Box */}
                        <div className="w-16 h-16 rounded-2xl bg-white border-2 border-[#D9DDE7] text-[#151c27] font-mono font-extrabold text-xl flex items-center justify-center shadow-xs">
                          {curKeyByte.toString(16).padStart(2, '0').toUpperCase()}
                        </div>

                        {/* Arrow Down */}
                        <div className="text-[#142380]">
                          <ArrowRight className="w-4 h-4 rotate-90" />
                        </div>

                        {/* Result Byte Box */}
                        <div className="space-y-1 w-full flex flex-col items-center">
                          <div className="w-16 h-16 rounded-2xl bg-[#ffdbc9] border-2 border-[#ff9a5b] text-[#96490d] font-mono font-extrabold text-xl flex items-center justify-center shadow-sm">
                            {curResultByte.toString(16).padStart(2, '0').toUpperCase()}
                          </div>
                          <span className="text-[10px] font-extrabold text-[#96490d] uppercase tracking-wider">
                            RESULT ({curResultByte.toString(16).padStart(2, '0').toUpperCase()})
                          </span>
                        </div>

                        {/* Equation Badge */}
                        <div className="bg-white border border-[#dce2f3] px-4 py-1.5 rounded-xl font-mono text-xs font-extrabold text-[#142380] shadow-2xs">
                          {curStateByte.toString(16).padStart(2, '0').toUpperCase()} ⊕ {curKeyByte.toString(16).padStart(2, '0').toUpperCase()} = {curResultByte.toString(16).padStart(2, '0').toUpperCase()}
                        </div>

                        <p className="text-[11px] text-[#454652] leading-tight px-2">
                          XOR combines the data with the round key to produce the next encrypted state.
                        </p>
                      </div>

                      {/* PANEL 3: UPDATED STATE (OUTPUT) */}
                      <div className="bg-white p-5 rounded-3xl border border-[#D9DDE7] shadow-sm space-y-4 flex flex-col justify-between">
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-extrabold text-[#767683] uppercase tracking-wider">
                            UPDATED STATE (OUTPUT)
                          </span>
                          <span className="text-[#96490d] text-[10px] font-extrabold flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-[#ff9a5b] animate-pulse" />
                            Populating...
                          </span>
                        </div>

                        {/* 4x4 Output Grid Matrix */}
                        <div className="grid grid-cols-4 gap-2.5 my-auto max-w-xs mx-auto w-full">
                          {Array.from({ length: 4 }).map((_, r) =>
                            Array.from({ length: 4 }).map((_, c) => {
                              const byteIdx = c * 4 + r; // column-major
                              const isProcessed = byteIdx <= activeAddKeyByteIdx;
                              const isCurrent = byteIdx === activeAddKeyByteIdx;
                              const val = outputMatrix[r][c];

                              return (
                                <div
                                  key={`out-${r}-${c}`}
                                  onClick={() => setActiveAddKeyByteIdx(byteIdx)}
                                  className={`p-3 rounded-2xl border-2 font-mono font-extrabold text-sm text-center transition-all cursor-pointer ${
                                    isCurrent
                                      ? 'border-[#ff9a5b] bg-[#ffdbc9] text-[#96490d] shadow-sm scale-105 z-10'
                                      : isProcessed
                                      ? 'border-[#142380]/30 bg-[#f0f3ff] text-[#142380]'
                                      : 'border-dashed border-[#D9DDE7] bg-[#F7F8FC] text-[#c6c5d4]'
                                  }`}
                                >
                                  {isProcessed ? val.toString(16).padStart(2, '0').toUpperCase() : '--'}
                                </div>
                              );
                            })
                          )}
                        </div>

                        <div className="text-[11px] text-[#767683] text-center font-medium">
                          Result state after Round Key XOR
                        </div>
                      </div>

                    </div>

                    {/* Lower Cards Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      
                      {/* Transformation Detail Card */}
                      <div className="bg-[#f0f3ff] p-5 rounded-3xl border border-[#dce2f3] space-y-4 shadow-2xs">
                        <div className="flex items-center gap-2 text-[#142380]">
                          <Info className="w-4 h-4 text-[#142380]" />
                          <h3 className="text-xs font-extrabold uppercase tracking-wider">
                            Transformation Detail
                          </h3>
                        </div>

                        <div className="grid grid-cols-4 gap-2 text-center font-mono">
                          <div className="bg-white p-2.5 rounded-2xl border border-[#dce2f3]">
                            <div className="text-[9px] font-extrabold text-[#767683] uppercase">POSITION</div>
                            <div className="text-xs font-bold text-[#142380]">R{curRow}, C{curCol}</div>
                          </div>
                          <div className="bg-white p-2.5 rounded-2xl border border-[#dce2f3]">
                            <div className="text-[9px] font-extrabold text-[#767683] uppercase">STATE BYTE</div>
                            <div className="text-xs font-bold text-[#151c27]">{curStateByte.toString(16).padStart(2, '0').toUpperCase()}</div>
                          </div>
                          <div className="bg-white p-2.5 rounded-2xl border border-[#dce2f3]">
                            <div className="text-[9px] font-extrabold text-[#767683] uppercase">ROUND KEY</div>
                            <div className="text-xs font-bold text-[#151c27]">{curKeyByte.toString(16).padStart(2, '0').toUpperCase()}</div>
                          </div>
                          <div className="bg-white p-2.5 rounded-2xl border border-[#ff9a5b]">
                            <div className="text-[9px] font-extrabold text-[#96490d] uppercase">XOR RESULT</div>
                            <div className="text-xs font-bold text-[#96490d]">{curResultByte.toString(16).padStart(2, '0').toUpperCase()}</div>
                          </div>
                        </div>

                        <p className="text-xs text-[#454652] leading-relaxed">
                          Byte-by-byte processing: 16 total operations. The state is processed in column-major order.
                        </p>
                      </div>

                      {/* Why AddRoundKey? Dark Navy Card */}
                      <div className="bg-[#142380] text-white p-5 rounded-3xl shadow-md relative overflow-hidden space-y-2.5">
                        <div className="text-[10px] font-extrabold uppercase tracking-widest text-[#dfe0ff]">
                          Security Pillar
                        </div>
                        <h3 className="text-base font-extrabold tracking-tight text-white">
                          Why AddRoundKey?
                        </h3>
                        <p className="text-xs text-[#dfe0ff] leading-relaxed pr-6">
                          This is the <strong>only step</strong> in the entire AES algorithm where the secret key is actually used. All other steps are public mathematical operations... Without AddRoundKey, AES provides no actual security!
                        </p>
                        <Lock className="w-16 h-16 text-white/10 absolute -right-2 -bottom-2 pointer-events-none" />
                      </div>

                    </div>

                    {/* Floating Controls Toolbar */}
                    <div className="bg-white border border-[#D9DDE7] p-3 rounded-2xl shadow-md flex items-center justify-between gap-4 max-w-xl mx-auto">
                      <button
                        onClick={() => setActiveSubByteIdx(0)}
                        className="px-3 py-1.5 rounded-xl text-xs font-bold text-[#454652] hover:bg-[#f0f3ff] hover:text-[#142380] transition-colors cursor-pointer"
                      >
                        RESET
                      </button>
                      <button
                        onClick={() => setActiveSubByteIdx((prev) => Math.max(0, prev - 1))}
                        disabled={activeSubByteIdx === 0}
                        className="p-2 rounded-xl text-[#454652] hover:bg-[#f0f3ff] disabled:opacity-40 transition-colors cursor-pointer"
                      >
                        <SkipBack className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => setIsPlaying(!isPlaying)}
                        className="w-10 h-10 rounded-full bg-[#142380] text-white flex items-center justify-center shadow-sm hover:bg-[#2f3c97] transition-colors cursor-pointer"
                      >
                        {isPlaying ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white" />}
                      </button>

                      <button
                        onClick={() => setActiveSubByteIdx((prev) => Math.min(15, prev + 1))}
                        disabled={activeSubByteIdx === 15}
                        className="p-2 rounded-xl text-[#454652] hover:bg-[#f0f3ff] disabled:opacity-40 transition-colors cursor-pointer"
                      >
                        <SkipForward className="w-4 h-4" />
                      </button>

                      <span className="text-xs font-mono font-bold text-[#142380]">
                        Step {activeSubByteIdx + 1} of 16
                      </span>
                    </div>

                    {/* Green Round Complete Banner */}
                    {activeSubByteIdx === 15 && (
                      <div className="bg-[#e8f8ee] border-2 border-[#10b981] rounded-3xl p-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-[#10b981] text-white flex items-center justify-center shrink-0">
                            <CheckCircle2 className="w-7 h-7" />
                          </div>
                          <div>
                            <h3 className="text-base font-extrabold text-[#065f46]">
                              Round {currentStep.round} Complete
                            </h3>
                            <p className="text-xs text-[#047857] mt-0.5">
                              All encryption steps for Round {currentStep.round} finished successfully. State has been transformed with the round key.
                            </p>
                          </div>
                        </div>

                        <button
                          onClick={() => {
                            const nextIdx = trace.steps.findIndex((s, idx) => idx > currentStepIdx && s.operation === 'subBytes');
                            if (nextIdx >= 0) {
                              setCurrentStepIdx(nextIdx);
                              setActiveAddKeyByteIdx(0);
                            } else if (currentStepIdx < trace.steps.length - 1) {
                              setCurrentStepIdx(currentStepIdx + 1);
                              setActiveAddKeyByteIdx(0);
                            }
                          }}
                          className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-[#142380] hover:bg-[#2f3c97] text-white font-extrabold text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer shrink-0"
                        >
                          <span>Continue to Round {currentStep.round + 1}</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                );
              })() : currentStep.operation === 'mixColumns' ? (() => {
                const inputMatrix = currentStep.prevState || currentStep.state;
                const outputMatrix = currentStep.state;

                const colIdx = activeMixColIdx;
                const inBytes = [
                  inputMatrix[0]?.[colIdx] ?? 0,
                  inputMatrix[1]?.[colIdx] ?? 0,
                  inputMatrix[2]?.[colIdx] ?? 0,
                  inputMatrix[3]?.[colIdx] ?? 0,
                ];
                const outBytes = [
                  outputMatrix[0]?.[colIdx] ?? 0,
                  outputMatrix[1]?.[colIdx] ?? 0,
                  outputMatrix[2]?.[colIdx] ?? 0,
                  outputMatrix[3]?.[colIdx] ?? 0,
                ];

                return (
                  <div className="space-y-6">
                    {/* Header Title & Subtitle */}
                    <div className="space-y-1">
                      <h1 className="text-2xl font-extrabold text-[#151c27] tracking-tight">
                        MixColumns Transformation
                      </h1>
                      <p className="text-xs text-[#767683] max-w-3xl">
                        MixColumns provides diffusion by mixing the four bytes of each column using a linear transformation. This ensures that every byte of the output depends on all four bytes of the input column.
                      </p>
                    </div>

                    {/* Top 3-Panel Row: BEFORE MIXING | MIXCOLUMNS ENGINE | AFTER MIXING */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
                      
                      {/* Panel 1: BEFORE MIXING */}
                      <div className="lg:col-span-3 bg-white p-5 rounded-3xl border border-[#D9DDE7] shadow-xs flex flex-col justify-between space-y-4">
                        <div className="text-center">
                          <span className="text-[10px] font-extrabold text-[#767683] uppercase tracking-wider">
                            BEFORE MIXING
                          </span>
                        </div>

                        <div className="grid grid-cols-4 gap-1.5 p-2 bg-[#F7F8FC] rounded-2xl border border-[#D9DDE7] my-auto">
                          {Array.from({ length: 4 }).map((_, r) =>
                            Array.from({ length: 4 }).map((_, c) => {
                              const val = inputMatrix[r][c];
                              const isCurCol = c === activeMixColIdx;

                              return (
                                <div
                                  key={`before-mc-${r}-${c}`}
                                  onClick={() => setActiveMixColIdx(c)}
                                  className={`aspect-square rounded-xl text-xs font-mono font-extrabold flex items-center justify-center cursor-pointer transition-all ${
                                    isCurCol
                                      ? 'border-2 border-[#142380] bg-[#f0f3ff] text-[#142380] shadow-2xs scale-105'
                                      : 'bg-white text-[#151c27] border border-[#D9DDE7] hover:bg-[#F7F8FC]'
                                  }`}
                                >
                                  0x{val.toString(16).padStart(2, '0').toUpperCase()}
                                </div>
                              );
                            })
                          )}
                        </div>

                        <div className="text-center text-[11px] font-medium text-[#767683]">
                          Processing: Column {activeMixColIdx}
                        </div>
                      </div>

                      {/* Panel 2: MIXCOLUMNS ENGINE */}
                      <div className="lg:col-span-6 bg-white p-6 rounded-3xl border border-[#D9DDE7] shadow-xs flex flex-col justify-between space-y-4 text-center relative overflow-hidden">
                        <div className="text-center space-y-0.5">
                          <span className="text-[10px] font-extrabold text-[#142380] uppercase tracking-wider">
                            MIXCOLUMNS ENGINE
                          </span>
                          <p className="text-[11px] text-[#767683] font-medium">
                            Transforming Column {activeMixColIdx}
                          </p>
                        </div>

                        <div className="flex flex-col items-center justify-center gap-4 my-auto py-2">
                          {/* Input Column Bytes */}
                          <div className="flex gap-2">
                            {inBytes.map((b, i) => (
                              <div
                                key={`in-col-${i}`}
                                className="w-12 h-12 rounded-xl bg-[#142380] text-white flex items-center justify-center font-mono font-extrabold text-xs shadow-md"
                              >
                                0x{b.toString(16).padStart(2, '0').toUpperCase()}
                              </div>
                            ))}
                          </div>

                          {/* Center Rotating Engine */}
                          <div className="flex items-center gap-3">
                            <div className="w-14 h-14 rounded-full border-2 border-[#142380] text-[#142380] flex flex-col items-center justify-center bg-[#f0f3ff] shadow-2xs">
                              <RefreshCw className="w-5 h-5 text-[#142380] animate-spin" />
                            </div>
                            <div className="text-left text-[11px] font-mono font-bold text-[#142380] bg-[#f0f3ff] px-3 py-1.5 rounded-xl border border-[#dce2f3]">
                              <div>GF(2⁸) MDS Matrix Multiplication</div>
                              <div className="text-[9px] text-[#767683] font-sans font-normal">
                                [02 03 01 01] × Column Vector
                              </div>
                            </div>
                          </div>

                          {/* Output Column Bytes */}
                          <div className="flex gap-2">
                            {outBytes.map((b, i) => (
                              <div
                                key={`out-col-${i}`}
                                className="w-12 h-12 rounded-xl bg-[#e8f8ee] border-2 border-[#10b981] text-[#065f46] flex items-center justify-center font-mono font-extrabold text-xs shadow-md"
                              >
                                0x{b.toString(16).padStart(2, '0').toUpperCase()}
                              </div>
                            ))}
                          </div>
                        </div>

                        <p className="text-xs font-bold text-[#142380] text-center">
                          Each output byte depends on all four input bytes.
                        </p>
                      </div>

                      {/* Panel 3: AFTER MIXING */}
                      <div className="lg:col-span-3 bg-white p-5 rounded-3xl border border-[#D9DDE7] shadow-xs flex flex-col justify-between space-y-4">
                        <div className="text-center">
                          <span className="text-[10px] font-extrabold text-[#767683] uppercase tracking-wider">
                            AFTER MIXING
                          </span>
                        </div>

                        <div className="grid grid-cols-4 gap-1.5 p-2 bg-[#F7F8FC] rounded-2xl border border-[#D9DDE7] my-auto">
                          {Array.from({ length: 4 }).map((_, r) =>
                            Array.from({ length: 4 }).map((_, c) => {
                              const val = outputMatrix[r][c];
                              const isProc = c <= activeMixColIdx;
                              const isCurCol = c === activeMixColIdx;

                              return (
                                <div
                                  key={`after-mc-${r}-${c}`}
                                  onClick={() => setActiveMixColIdx(c)}
                                  className={`aspect-square rounded-xl text-xs font-mono font-extrabold flex items-center justify-center cursor-pointer transition-all ${
                                    isCurCol
                                      ? 'border-2 border-[#10b981] bg-[#e8f8ee] text-[#065f46] shadow-2xs scale-105'
                                      : isProc
                                      ? 'bg-[#f0f3ff] text-[#142380] border border-[#dce2f3]'
                                      : 'bg-white text-[#c6c5d4] border border-dashed border-[#D9DDE7]'
                                  }`}
                                >
                                  {isProc ? `0x${val.toString(16).padStart(2, '0').toUpperCase()}` : '--'}
                                </div>
                              );
                            })
                          )}
                        </div>

                        <div className="text-center text-[11px] font-extrabold text-[#142380]">
                          Column {activeMixColIdx + 1}/4 Processed
                        </div>
                      </div>

                    </div>

                    {/* Middle Row: Transformation Detail Card + Controls */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
                      
                      {/* Left: Transformation Detail */}
                      <div className="lg:col-span-9 bg-white p-5 rounded-3xl border border-[#D9DDE7] shadow-xs flex flex-col justify-between space-y-4">
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center divide-x divide-[#f0f3ff]">
                          <div className="p-2">
                            <div className="text-[10px] font-extrabold text-[#767683] uppercase tracking-wider mb-1">
                              CURRENT COLUMN
                            </div>
                            <div className="text-base font-mono font-extrabold text-[#142380]">
                              Column {activeMixColIdx}
                            </div>
                          </div>

                          <div className="p-2">
                            <div className="text-[10px] font-extrabold text-[#767683] uppercase tracking-wider mb-1">
                              INPUT BYTES
                            </div>
                            <div className="text-xs font-mono font-extrabold text-[#151c27] truncate">
                              {inBytes.map(b => b.toString(16).padStart(2, '0').toUpperCase()).join(' ')}
                            </div>
                          </div>

                          <div className="p-2">
                            <div className="text-[10px] font-extrabold text-[#767683] uppercase tracking-wider mb-1">
                              STATUS
                            </div>
                            <div className="text-xs font-mono font-extrabold text-[#065f46] bg-[#e8f8ee] px-2 py-0.5 rounded-full inline-block">
                              Transformed
                            </div>
                          </div>

                          <div className="p-2">
                            <div className="text-[10px] font-extrabold text-[#767683] uppercase tracking-wider mb-1">
                              OUTPUT BYTES
                            </div>
                            <div className="text-xs font-mono font-extrabold text-[#065f46] truncate">
                              {outBytes.map(b => b.toString(16).padStart(2, '0').toUpperCase()).join(' ')}
                            </div>
                          </div>
                        </div>

                        <div className="pt-3 border-t border-[#f0f3ff] text-center text-xs text-[#454652] font-medium">
                          Galois Field Matrix Equation: <span className="font-mono font-bold text-[#142380]">S'(0,c) = ({'{02}'}•S(0,c)) ⊕ ({'{03}'}•S(1,c)) ⊕ S(2,c) ⊕ S(3,c)</span>
                        </div>
                      </div>

                      {/* Right: Controls Card */}
                      <div className="lg:col-span-3 bg-white p-5 rounded-3xl border border-[#D9DDE7] shadow-xs flex items-center justify-center gap-3">
                        <button
                          onClick={() => setActiveMixColIdx((prev) => Math.max(0, prev - 1))}
                          disabled={activeMixColIdx === 0}
                          className="p-3.5 rounded-2xl bg-[#F7F8FC] border border-[#D9DDE7] hover:bg-[#e7eefe] text-[#151c27] disabled:opacity-40 transition-all cursor-pointer"
                          title="Previous Column"
                        >
                          <SkipBack className="w-5 h-5" />
                        </button>

                        <button
                          onClick={() => setIsPlaying(!isPlaying)}
                          className="p-4 rounded-2xl bg-[#142380] text-white hover:bg-[#2f3c97] shadow-sm transition-all cursor-pointer"
                          title={isPlaying ? 'Pause' : 'Play'}
                        >
                          {isPlaying ? <Pause className="w-5 h-5 fill-white" /> : <Play className="w-5 h-5 fill-white" />}
                        </button>

                        <button
                          onClick={() => setActiveMixColIdx((prev) => Math.min(3, prev + 1))}
                          disabled={activeMixColIdx === 3}
                          className="p-3.5 rounded-2xl bg-[#F7F8FC] border border-[#D9DDE7] hover:bg-[#e7eefe] text-[#151c27] disabled:opacity-40 transition-all cursor-pointer"
                          title="Next Column"
                        >
                          <SkipForward className="w-5 h-5" />
                        </button>

                        <button
                          onClick={() => { setIsPlaying(false); setActiveMixColIdx(0); }}
                          className="p-3.5 rounded-2xl bg-[#F7F8FC] border border-[#D9DDE7] hover:bg-[#e7eefe] text-[#767683] transition-all cursor-pointer"
                          title="Reset"
                        >
                          <RotateCcw className="w-5 h-5" />
                        </button>
                      </div>

                    </div>

                    {/* Bottom Row: Educational Box + Learning Hub */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
                      
                      {/* Left: Why MixColumns? Card */}
                      <div className="lg:col-span-8 bg-white p-6 rounded-3xl border border-[#D9DDE7] shadow-xs space-y-3 flex flex-col justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-2xl bg-[#f0f3ff] text-[#142380] flex items-center justify-center shrink-0">
                            <Brain className="w-5 h-5" />
                          </div>
                          <h2 className="text-lg font-extrabold text-[#151c27]">
                            Why MixColumns?
                          </h2>
                        </div>

                        <p className="text-xs text-[#454652] leading-relaxed">
                          MixColumns provides high-degree <strong className="font-extrabold text-[#142380]">Diffusion</strong> by mixing the four bytes in each column. By using matrix multiplication over GF(2⁸), changing a single input bit ensures that all 4 bytes of the output column are altered, spreading changes exponentially across rounds.
                        </p>
                      </div>

                      {/* Right: Learning Hub Card */}
                      <div className="lg:col-span-4 bg-[#142380] text-white p-6 rounded-3xl shadow-md space-y-4 flex flex-col justify-between">
                        <h3 className="text-base font-extrabold text-white tracking-tight">
                          Learning Hub
                        </h3>

                        <div className="space-y-2.5">
                          {[
                            'What is Diffusion?',
                            'Why Columns are Mixed?',
                            'Column Transformation Math',
                            'Preparing for AddRoundKey'
                          ].map((item, idx) => (
                            <button
                              key={`mc-hub-${idx}`}
                              className="w-full bg-white/10 hover:bg-white/20 text-white rounded-2xl p-3 flex items-center justify-between text-xs font-bold transition-all cursor-pointer border border-white/10"
                            >
                              <span>{item}</span>
                              <ChevronRight className="w-4 h-4 text-white/80" />
                            </button>
                          ))}
                        </div>
                      </div>

                    </div>

                    {/* MixColumns Complete Banner */}
                    <div className="bg-[#e8f8ee] border-2 border-[#10b981] rounded-3xl p-6 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-[#10b981] text-white flex items-center justify-center shrink-0">
                          <CheckCircle2 className="w-7 h-7" />
                        </div>
                        <div>
                          <h3 className="text-base font-extrabold text-[#151c27]">
                            MixColumns Completed for Round {currentStep.round}
                          </h3>
                          <p className="text-xs text-[#454652] mt-0.5">
                            All 4 columns mixed successfully using GF(2⁸) matrix multiplication. Ready for AddRoundKey.
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          const nextIdx = trace.steps.findIndex(
                            (s, idx) => idx > currentStepIdx && s.operation === 'addRoundKey'
                          );
                          if (nextIdx !== -1) {
                            setCurrentStepIdx(nextIdx);
                          } else if (currentStepIdx < trace.steps.length - 1) {
                            setCurrentStepIdx(currentStepIdx + 1);
                          }
                        }}
                        className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-[#142380] hover:bg-[#2f3c97] text-white font-extrabold text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer shrink-0"
                      >
                        <span>Continue to AddRoundKey</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>

                  </div>
                );
              })() : (currentStep.operation as string) === 'addRoundKey' ? (() => {
                const curRow = activeAddKeyByteIdx % 4;
                const curCol = Math.floor(activeAddKeyByteIdx / 4);
                const inputMatrix = currentStep.prevState || currentStep.state;
                const outputMatrix = currentStep.state;
                const keyMatrix = currentStep.roundKey || Array.from({ length: 4 }, () => [0, 0, 0, 0]);

                const stateByte = inputMatrix[curRow]?.[curCol] ?? 0;
                const keyByte = keyMatrix[curRow]?.[curCol] ?? 0;
                const resultByte = outputMatrix[curRow]?.[curCol] ?? (stateByte ^ keyByte);

                const stateByteHex = stateByte.toString(16).padStart(2, '0').toUpperCase();
                const keyByteHex = keyByte.toString(16).padStart(2, '0').toUpperCase();
                const resultByteHex = resultByte.toString(16).padStart(2, '0').toUpperCase();

                const stateByteBin = stateByte.toString(2).padStart(8, '0');
                const keyByteBin = keyByte.toString(2).padStart(8, '0');
                const resultByteBin = resultByte.toString(2).padStart(8, '0');

                return (
                  <div className="space-y-6">
                    {/* Header Title & Subtitle */}
                    <div className="space-y-1">
                      <h1 className="text-2xl font-extrabold text-[#151c27] tracking-tight">
                        AddRoundKey Transformation
                      </h1>
                      <p className="text-xs text-[#767683] max-w-3xl">
                        The final transformation of the round. In this step, the 128-bit State Matrix is combined byte-by-byte with the 128-bit Round Key using a bitwise XOR (⊕) operation.
                      </p>
                    </div>

                    {/* Top 3-Panel Row: STATE MATRIX (INPUT) | XOR OPERATION ENGINE | UPDATED STATE MATRIX (OUTPUT) */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
                      
                      {/* Panel 1: STATE MATRIX (INPUT) */}
                      <div className="lg:col-span-3 bg-white p-5 rounded-3xl border border-[#D9DDE7] shadow-xs flex flex-col justify-between space-y-4">
                        <div className="text-center">
                          <span className="text-[10px] font-extrabold text-[#767683] uppercase tracking-wider">
                            STATE MATRIX (INPUT)
                          </span>
                        </div>

                        <div className="grid grid-cols-4 gap-1.5 p-2 bg-[#F7F8FC] rounded-2xl border border-[#D9DDE7] my-auto">
                          {Array.from({ length: 4 }).map((_, r) =>
                            Array.from({ length: 4 }).map((_, c) => {
                              const bIdx = c * 4 + r;
                              const val = inputMatrix[r][c];
                              const isCur = bIdx === activeAddKeyByteIdx;

                              return (
                                <div
                                  key={`in-ark-${r}-${c}`}
                                  onClick={() => setActiveAddKeyByteIdx(bIdx)}
                                  className={`aspect-square rounded-xl text-xs font-mono font-extrabold flex items-center justify-center cursor-pointer transition-all ${
                                    isCur
                                      ? 'border-2 border-[#142380] bg-[#f0f3ff] text-[#142380] shadow-2xs scale-105'
                                      : 'bg-white text-[#151c27] border border-[#D9DDE7] hover:bg-[#F7F8FC]'
                                  }`}
                                >
                                  0x{val.toString(16).padStart(2, '0').toUpperCase()}
                                </div>
                              );
                            })
                          )}
                        </div>

                        <div className="text-center text-[11px] font-medium text-[#767683]">
                          Processing: Row {curRow}, Col {curCol}
                        </div>
                      </div>

                      {/* Panel 2: XOR OPERATION ENGINE */}
                      <div className="lg:col-span-6 bg-white p-6 rounded-3xl border border-[#D9DDE7] shadow-xs flex flex-col justify-between space-y-4 text-center relative overflow-hidden">
                        <span className="text-[10px] font-extrabold text-[#142380] uppercase tracking-wider">
                          XOR OPERATION ENGINE
                        </span>

                        <div className="flex flex-col items-center justify-center gap-3 my-auto py-2">
                          {/* Top State Byte & Round Key Byte Stack */}
                          <div className="flex items-center justify-center gap-4 sm:gap-6">
                            {/* State Byte Card */}
                            <div className="flex flex-col items-center">
                              <span className="text-[10px] font-extrabold text-[#767683] uppercase mb-1">
                                STATE BYTE
                              </span>
                              <div className="w-16 h-16 rounded-2xl bg-[#142380] text-white flex items-center justify-center font-mono font-extrabold text-lg shadow-md">
                                0x{stateByteHex}
                              </div>
                              <span className="text-[10px] font-mono font-bold text-[#767683] mt-1.5">
                                {stateByteBin}
                              </span>
                            </div>

                            {/* XOR Icon */}
                            <div className="flex flex-col items-center justify-center text-[#96490d]">
                              <div className="w-10 h-10 rounded-full bg-[#ffdbc9] border border-[#ff9a5b] flex items-center justify-center font-mono font-extrabold text-base shadow-2xs">
                                ⊕
                              </div>
                              <span className="text-[9px] font-extrabold uppercase mt-1 text-[#96490d]">XOR</span>
                            </div>

                            {/* Round Key Byte Card */}
                            <div className="flex flex-col items-center">
                              <span className="text-[10px] font-extrabold text-[#767683] uppercase mb-1">
                                ROUND KEY BYTE
                              </span>
                              <div className="w-16 h-16 rounded-2xl bg-[#151c27] text-white flex items-center justify-center font-mono font-extrabold text-lg shadow-md">
                                0x{keyByteHex}
                              </div>
                              <span className="text-[10px] font-mono font-bold text-[#767683] mt-1.5">
                                {keyByteBin}
                              </span>
                            </div>
                          </div>

                          {/* Divider Line */}
                          <div className="w-48 h-0.5 bg-[#D9DDE7] my-1" />

                          {/* Result Byte Card */}
                          <div className="flex flex-col items-center">
                            <span className="text-[10px] font-extrabold text-[#065f46] uppercase mb-1">
                              RESULT STATE BYTE
                            </span>
                            <div className="w-20 h-14 rounded-2xl bg-[#e8f8ee] border-2 border-[#10b981] text-[#065f46] flex items-center justify-center font-mono font-extrabold text-xl shadow-md">
                              0x{resultByteHex}
                            </div>
                            <span className="text-[10px] font-mono font-bold text-[#065f46] mt-1.5">
                              {resultByteBin}
                            </span>
                          </div>
                        </div>

                        <p className="text-xs font-bold text-[#142380] text-center">
                          0x{stateByteHex} ⊕ 0x{keyByteHex} = 0x{resultByteHex}
                        </p>
                      </div>

                      {/* Panel 3: UPDATED STATE MATRIX (OUTPUT) */}
                      <div className="lg:col-span-3 bg-white p-5 rounded-3xl border border-[#D9DDE7] shadow-xs flex flex-col justify-between space-y-4">
                        <div className="text-center">
                          <span className="text-[10px] font-extrabold text-[#767683] uppercase tracking-wider">
                            UPDATED STATE MATRIX
                          </span>
                        </div>

                        <div className="grid grid-cols-4 gap-1.5 p-2 bg-[#F7F8FC] rounded-2xl border border-[#D9DDE7] my-auto">
                          {Array.from({ length: 4 }).map((_, r) =>
                            Array.from({ length: 4 }).map((_, c) => {
                              const bIdx = c * 4 + r;
                              const isProc = bIdx <= activeAddKeyByteIdx;
                              const isCur = bIdx === activeAddKeyByteIdx;
                              const val = outputMatrix[r][c];

                              return (
                                <div
                                  key={`upd-ark-${r}-${c}`}
                                  onClick={() => setActiveAddKeyByteIdx(bIdx)}
                                  className={`aspect-square rounded-xl text-xs font-mono font-extrabold flex items-center justify-center cursor-pointer transition-all ${
                                    isCur
                                      ? 'border-2 border-[#10b981] bg-[#e8f8ee] text-[#065f46] shadow-2xs scale-105'
                                      : isProc
                                      ? 'bg-[#f0f3ff] text-[#142380] border border-[#dce2f3]'
                                      : 'bg-white text-[#c6c5d4] border border-dashed border-[#D9DDE7]'
                                  }`}
                                >
                                  {isProc ? `0x${val.toString(16).padStart(2, '0').toUpperCase()}` : '--'}
                                </div>
                              );
                            })
                          )}
                        </div>

                        <div className="text-center text-[11px] font-extrabold text-[#142380]">
                          {activeAddKeyByteIdx + 1}/16 Bytes Processed
                        </div>
                      </div>

                    </div>

                    {/* Middle Row: Transformation Detail Card + Controls */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
                      
                      {/* Left: Transformation Detail */}
                      <div className="lg:col-span-9 bg-white p-5 rounded-3xl border border-[#D9DDE7] shadow-xs flex flex-col justify-between space-y-4">
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center divide-x divide-[#f0f3ff]">
                          <div className="p-2">
                            <div className="text-[10px] font-extrabold text-[#767683] uppercase tracking-wider mb-1">
                              POSITION
                            </div>
                            <div className="text-base font-mono font-extrabold text-[#142380]">
                              R{curRow}, C{curCol}
                            </div>
                          </div>

                          <div className="p-2">
                            <div className="text-[10px] font-extrabold text-[#767683] uppercase tracking-wider mb-1">
                              STATE BYTE
                            </div>
                            <div className="text-xs font-mono font-extrabold text-[#151c27]">
                              0x{stateByteHex}
                            </div>
                          </div>

                          <div className="p-2">
                            <div className="text-[10px] font-extrabold text-[#767683] uppercase tracking-wider mb-1">
                              ROUND KEY
                            </div>
                            <div className="text-xs font-mono font-extrabold text-[#151c27]">
                              0x{keyByteHex}
                            </div>
                          </div>

                          <div className="p-2">
                            <div className="text-[10px] font-extrabold text-[#767683] uppercase tracking-wider mb-1">
                              XOR RESULT
                            </div>
                            <div className="text-xs font-mono font-extrabold text-[#065f46] bg-[#e8f8ee] px-2 py-0.5 rounded-full inline-block">
                              0x{resultByteHex}
                            </div>
                          </div>
                        </div>

                        <div className="pt-3 border-t border-[#f0f3ff] text-center text-xs text-[#454652] font-medium">
                          Bitwise Equation: <span className="font-mono font-bold text-[#142380]">{stateByteBin} ⊕ {keyByteBin} = {resultByteBin}</span>
                        </div>
                      </div>

                      {/* Right: Controls Card */}
                      <div className="lg:col-span-3 bg-white p-5 rounded-3xl border border-[#D9DDE7] shadow-xs flex items-center justify-center gap-3">
                        <button
                          onClick={() => setActiveAddKeyByteIdx((prev) => Math.max(0, prev - 1))}
                          disabled={activeAddKeyByteIdx === 0}
                          className="p-3.5 rounded-2xl bg-[#F7F8FC] border border-[#D9DDE7] hover:bg-[#e7eefe] text-[#151c27] disabled:opacity-40 transition-all cursor-pointer"
                          title="Previous Byte"
                        >
                          <SkipBack className="w-5 h-5" />
                        </button>

                        <button
                          onClick={() => setIsPlaying(!isPlaying)}
                          className="p-4 rounded-2xl bg-[#142380] text-white hover:bg-[#2f3c97] shadow-sm transition-all cursor-pointer"
                          title={isPlaying ? 'Pause' : 'Play'}
                        >
                          {isPlaying ? <Pause className="w-5 h-5 fill-white" /> : <Play className="w-5 h-5 fill-white" />}
                        </button>

                        <button
                          onClick={() => setActiveAddKeyByteIdx((prev) => Math.min(15, prev + 1))}
                          disabled={activeAddKeyByteIdx === 15}
                          className="p-3.5 rounded-2xl bg-[#F7F8FC] border border-[#D9DDE7] hover:bg-[#e7eefe] text-[#151c27] disabled:opacity-40 transition-all cursor-pointer"
                          title="Next Byte"
                        >
                          <SkipForward className="w-5 h-5" />
                        </button>

                        <button
                          onClick={() => { setIsPlaying(false); setActiveAddKeyByteIdx(0); }}
                          className="p-3.5 rounded-2xl bg-[#F7F8FC] border border-[#D9DDE7] hover:bg-[#e7eefe] text-[#767683] transition-all cursor-pointer"
                          title="Reset"
                        >
                          <RotateCcw className="w-5 h-5" />
                        </button>
                      </div>

                    </div>

                    {/* Bottom Row: Educational Box + Learning Hub */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
                      
                      {/* Left: Why AddRoundKey? Card */}
                      <div className="lg:col-span-8 bg-white p-6 rounded-3xl border border-[#D9DDE7] shadow-xs space-y-3 flex flex-col justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-2xl bg-[#f0f3ff] text-[#142380] flex items-center justify-center shrink-0">
                            <Key className="w-5 h-5" />
                          </div>
                          <h2 className="text-lg font-extrabold text-[#151c27]">
                            Why AddRoundKey?
                          </h2>
                        </div>

                        <p className="text-xs text-[#454652] leading-relaxed">
                          This is the <strong className="font-extrabold text-[#142380]">only step</strong> in the entire AES cipher where the secret key is directly injected into the state. All other steps (SubBytes, ShiftRows, MixColumns) are fixed public mathematical operations. AddRoundKey provides secret-dependent <strong className="font-extrabold text-[#142380]">Confusion</strong>.
                        </p>
                      </div>

                      {/* Right: Learning Hub Card */}
                      <div className="lg:col-span-4 bg-[#142380] text-white p-6 rounded-3xl shadow-md space-y-4 flex flex-col justify-between">
                        <h3 className="text-base font-extrabold text-white tracking-tight">
                          Learning Hub
                        </h3>

                        <div className="space-y-2.5">
                          {[
                            'What is XOR?',
                            'Why AES Uses XOR',
                            'Understanding Round Keys',
                            'Secret Key Security'
                          ].map((item, idx) => (
                            <button
                              key={`ark-hub-${idx}`}
                              className="w-full bg-white/10 hover:bg-white/20 text-white rounded-2xl p-3 flex items-center justify-between text-xs font-bold transition-all cursor-pointer border border-white/10"
                            >
                              <span>{item}</span>
                              <ChevronRight className="w-4 h-4 text-white/80" />
                            </button>
                          ))}
                        </div>
                      </div>

                    </div>

                    {/* AddRoundKey Complete Banner */}
                    <div className="bg-[#e8f8ee] border-2 border-[#10b981] rounded-3xl p-6 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-[#10b981] text-white flex items-center justify-center shrink-0">
                          <CheckCircle2 className="w-7 h-7" />
                        </div>
                        <div>
                          <h3 className="text-base font-extrabold text-[#151c27]">
                            Round {currentStep.round} Completed!
                          </h3>
                          <p className="text-xs text-[#454652] mt-0.5">
                            All 16 bytes successfully XORed with Round Key {currentStep.round}. State matrix updated.
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          if (currentStepIdx < trace.steps.length - 1) {
                            setCurrentStepIdx(currentStepIdx + 1);
                          }
                        }}
                        disabled={currentStepIdx === trace.steps.length - 1}
                        className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-[#142380] hover:bg-[#2f3c97] text-white font-extrabold text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer shrink-0 disabled:opacity-50"
                      >
                        <span>{currentStepIdx === trace.steps.length - 1 ? 'Encryption Complete' : 'Continue to Next Round'}</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>

                  </div>
                );
              })() : (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                
                {/* 4x4 State Matrix View */}
                <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-[#D9DDE7] shadow-sm space-y-6">
                  {/* Title & Subtitle */}
                  <div className="text-center pb-2 border-b border-[#D9DDE7]">
                    <h3 className="text-xl sm:text-2xl font-extrabold text-[#151c27]">
                      {currentStep.round === 0 ? '128-bit Initialization' : `Round ${currentStep.round}: ${currentStep.title}`}
                    </h3>
                    <p className="text-xs text-[#454652] mt-1">
                      Conversion of input plaintext into 4×4 byte State Matrix
                    </p>
                  </div>

                  {/* Input & Plaintext Badge Row */}
                  <div className="flex flex-wrap justify-center items-center gap-3">
                    <div className="bg-[#f0f3ff] border border-[#dce2f3] px-5 py-2 rounded-xl text-sm font-extrabold text-[#142380] tracking-wider uppercase shadow-2xs">
                      {plaintextInput || 'AES IS SECURE'}
                    </div>
                    <div className="bg-[#e7eefe] border border-[#142380]/20 px-3 py-1.5 rounded-lg text-xs font-bold text-[#142380] uppercase tracking-wider">
                      PLAINTEXT
                    </div>
                  </div>

                  {/* Connector Line */}
                  <div className="flex flex-col items-center">
                    <div className="w-px h-5 border-l-2 border-dashed border-[#142380]/30" />
                    <div className="w-1.5 h-1.5 rounded-full bg-[#142380]" />
                  </div>

                  {/* ASCII Decimal & Hexadecimal Comparison Stream */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs max-w-xl mx-auto">
                    <div className="bg-[#F7F8FC] p-3 rounded-2xl border border-[#D9DDE7] space-y-1 text-center">
                      <div className="font-extrabold text-[#151c27] tracking-widest text-sm overflow-x-auto">
                        {parseInputBytes(plaintextInput, isHexMode).slice(0, 8).join('  ')}...
                      </div>
                      <div className="text-[10px] font-extrabold text-[#454652] uppercase tracking-wider">
                        ASCII DECIMAL
                      </div>
                    </div>

                    <div className="bg-[#F7F8FC] p-3 rounded-2xl border border-[#D9DDE7] space-y-1 text-center">
                      <div className="font-extrabold text-[#142380] tracking-widest text-sm overflow-x-auto">
                        {bytesToHexFormatted(parseInputBytes(plaintextInput, isHexMode).slice(0, 8))}...
                      </div>
                      <div className="text-[10px] font-extrabold text-[#454652] uppercase tracking-wider">
                        HEXADECIMAL
                      </div>
                    </div>
                  </div>

                  {/* Connector Line */}
                  <div className="flex flex-col items-center">
                    <div className="w-px h-5 border-l-2 border-dashed border-[#142380]/30" />
                    <div className="w-1.5 h-1.5 rounded-full bg-[#142380]" />
                  </div>

                  {/* The 4x4 Grid Matrix with C0-C3 and R0-R3 Labels */}
                  <div className="max-w-md mx-auto space-y-3">
                    {/* Column Headers */}
                    <div className="grid grid-cols-5 gap-2 text-center font-mono text-xs font-bold text-[#454652]">
                      <div></div>
                      <div>C0</div>
                      <div>C1</div>
                      <div>C2</div>
                      <div>C3</div>
                    </div>

                    {/* Row Rows */}
                    {Array.from({ length: 4 }).map((_, rowIdx) => (
                      <div key={rowIdx} className="grid grid-cols-5 gap-2 items-center text-center">
                        <div className="font-mono text-xs font-bold text-[#454652]">R{rowIdx}</div>
                        {Array.from({ length: 4 }).map((_, colIdx) => {
                          const byteVal = currentStep.state[rowIdx][colIdx];
                          const isHovered = hoveredCell && hoveredCell[0] === rowIdx && hoveredCell[1] === colIdx;
                          const isPaddingByte = rowIdx === 3 && colIdx >= 1 && byteVal === 0;

                          return (
                            <div
                              key={`${rowIdx}-${colIdx}`}
                              onMouseEnter={() => setHoveredCell([rowIdx, colIdx])}
                              onMouseLeave={() => setHoveredCell(null)}
                              className={`p-3 rounded-2xl border-2 font-mono font-extrabold text-base transition-all duration-200 cursor-pointer text-center ${
                                isHovered
                                  ? 'border-[#96490d] bg-[#ffdbc9] text-[#96490d] scale-105 shadow-md z-10'
                                  : isPaddingByte
                                  ? 'border-[#D9DDE7] bg-[#F7F8FC] text-[#767683]'
                                  : 'border-[#142380]/30 bg-[#f0f3ff] text-[#142380] hover:border-[#142380]'
                              }`}
                            >
                              {byteVal.toString(16).padStart(2, '0').toUpperCase()}
                            </div>
                          );
                        })}
                      </div>
                    ))}

                    {/* Legend */}
                    <div className="flex flex-wrap justify-center items-center gap-6 pt-3 text-xs font-bold text-[#454652]">
                      <div className="flex items-center gap-2">
                        <span className="w-3.5 h-3.5 rounded-md bg-[#f0f3ff] border border-[#142380]/30" />
                        <span>Active Data</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-3.5 h-3.5 rounded-md bg-[#F7F8FC] border border-[#D9DDE7]" />
                        <span>Padding</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-3.5 h-3.5 rounded-md bg-[#ffdbc9] border border-[#96490d]" />
                        <span>Current Process</span>
                      </div>
                    </div>
                  </div>

                  {/* Primary Continue Button & Playback Toolbar */}
                  <div className="pt-4 border-t border-[#D9DDE7] flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => { setIsPlaying(false); setCurrentStepIdx(0); }}
                        className="p-2.5 rounded-xl border border-[#D9DDE7] text-[#454652] hover:bg-[#f0f3ff] hover:text-[#142380] transition-colors cursor-pointer"
                        title="Reset"
                      >
                        <RotateCcw className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setIsPlaying(!isPlaying)}
                        className="p-2.5 rounded-xl bg-[#142380] text-white hover:bg-[#2f3c97] transition-colors cursor-pointer"
                        title={isPlaying ? 'Pause' : 'Play'}
                      >
                        {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => setCurrentStepIdx((prev) => Math.min(trace.steps.length - 1, prev + 1))}
                        disabled={currentStepIdx === trace.steps.length - 1}
                        className="p-2.5 rounded-xl border border-[#D9DDE7] text-[#454652] hover:bg-[#f0f3ff] disabled:opacity-40 transition-colors cursor-pointer"
                        title="Step Forward"
                      >
                        <SkipForward className="w-4 h-4" />
                      </button>
                    </div>

                    <button
                      onClick={() => {
                        const nextSubIdx = trace.steps.findIndex(s => s.operation === 'subBytes');
                        if (nextSubIdx >= 0) setCurrentStepIdx(nextSubIdx);
                        else setCurrentStepIdx((prev) => Math.min(trace.steps.length - 1, prev + 1));
                      }}
                      className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-[#142380] hover:bg-[#2f3c97] text-white font-extrabold text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>Continue to SubBytes</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Hovered Cell Detail Info Card */}
                  {hoveredCell && (
                    <div className="bg-[#f0f3ff] p-4 rounded-2xl border border-[#dce2f3] text-xs space-y-2">
                      <div className="flex justify-between font-bold text-[#142380]">
                        <span>Selected Cell: State[{hoveredCell[0]}, {hoveredCell[1]}]</span>
                        <span>Column {hoveredCell[1]}, Row {hoveredCell[0]}</span>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center font-mono pt-1">
                        <div className="bg-white p-2 rounded-xl border border-[#c6c5d4]">
                          <div className="text-[10px] text-[#454652]">HEX</div>
                          <div className="font-bold text-[#151c27]">0x{currentStep.state[hoveredCell[0]][hoveredCell[1]].toString(16).padStart(2, '0').toUpperCase()}</div>
                        </div>
                        <div className="bg-white p-2 rounded-xl border border-[#c6c5d4]">
                          <div className="text-[10px] text-[#454652]">DEC</div>
                          <div className="font-bold text-[#151c27]">{currentStep.state[hoveredCell[0]][hoveredCell[1]]}</div>
                        </div>
                        <div className="bg-white p-2 rounded-xl border border-[#c6c5d4]">
                          <div className="text-[10px] text-[#454652]">ASCII</div>
                          <div className="font-bold text-[#151c27]">{bytesToAscii([currentStep.state[hoveredCell[0]][hoveredCell[1]]])}</div>
                        </div>
                        <div className="bg-white p-2 rounded-xl border border-[#c6c5d4]">
                          <div className="text-[10px] text-[#454652]">S-BOX LOOKUP</div>
                          <div className="font-bold text-[#142380]">0x{SBOX[currentStep.state[hoveredCell[0]][hoveredCell[1]]].toString(16).padStart(2, '0').toUpperCase()}</div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Round Key 4x4 Mini Display */}
                  {currentStep.roundKey && (
                    <div className="pt-4 border-t border-[#D9DDE7]">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-bold text-[#96490d]">
                          Round {currentStep.round} Key Matrix
                        </span>
                        <span className="text-[10px] font-mono text-[#454652]">
                          Hex: {bytesToHexFormatted(currentStep.roundKey.flat())}
                        </span>
                      </div>
                      <div className="grid grid-cols-4 gap-2 max-w-xs mx-auto text-center font-mono text-xs">
                        {currentStep.roundKey.map((rowArr, rIdx) =>
                          rowArr.map((val, cIdx) => (
                            <div key={`rk-${rIdx}-${cIdx}`} className="bg-[#F7F8FC] p-1.5 rounded-lg border border-[#D9DDE7] text-[#151c27] font-semibold">
                              {val.toString(16).padStart(2, '0').toUpperCase()}
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Step Math Explanation */}
                <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-3xl border border-[#D9DDE7] shadow-sm space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#142380] text-white flex items-center justify-center font-bold text-sm">
                      R{currentStep.round}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-[#151c27]">
                        {currentStep.title}
                      </h3>
                      <div className="text-xs font-medium text-[#454652]">
                        Transformation Step Breakdown
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-[#454652] leading-relaxed bg-[#F7F8FC] p-4 rounded-2xl border border-[#D9DDE7]">
                    {currentStep.description}
                  </p>

                  <div className="space-y-2">
                    <div className="text-xs font-bold text-[#142380] uppercase tracking-wider">
                      Mathematical Operation
                    </div>
                    <div className="bg-[#151c27] text-emerald-400 p-4 rounded-2xl font-mono text-xs overflow-x-auto shadow-inner leading-relaxed">
                      <code>{currentStep.mathDetail}</code>
                    </div>
                  </div>

                  {currentStep.prevState && (
                    <div className="space-y-2 pt-2">
                      <div className="text-xs font-bold text-[#151c27]">
                        Before vs After Transformation
                      </div>
                      <div className="grid grid-cols-2 gap-4 items-center">
                        <div className="bg-[#F7F8FC] p-3 rounded-2xl border border-[#D9DDE7] text-center">
                          <div className="text-[10px] font-bold text-[#454652] mb-1">BEFORE</div>
                          <div className="grid grid-cols-4 gap-1 font-mono text-[10px]">
                            {currentStep.prevState.map((rowArr, r) =>
                              rowArr.map((v, c) => (
                                <div key={`p-${r}-${c}`} className="p-0.5 rounded bg-white text-[#151c27]">
                                  {v.toString(16).padStart(2, '0').toUpperCase()}
                                </div>
                              ))
                            )}
                          </div>
                        </div>

                        <div className="bg-[#e7eefe] p-3 rounded-2xl border border-[#142380]/30 text-center">
                          <div className="text-[10px] font-bold text-[#142380] mb-1">AFTER</div>
                          <div className="grid grid-cols-4 gap-1 font-mono text-[10px]">
                            {currentStep.state.map((rowArr, r) =>
                              rowArr.map((v, c) => (
                                <div key={`a-${r}-${c}`} className="p-0.5 rounded bg-white text-[#142380] font-bold">
                                  {v.toString(16).padStart(2, '0').toUpperCase()}
                                </div>
                              ))
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="pt-4 border-t border-[#D9DDE7] flex justify-between text-xs text-[#454652]">
                    <button
                      onClick={() => setCurrentStepIdx((prev) => Math.max(0, prev - 1))}
                      disabled={currentStepIdx === 0}
                      className="hover:text-[#142380] disabled:opacity-30 font-semibold cursor-pointer"
                    >
                      ← Previous Step
                    </button>
                    {currentStepIdx === trace.steps.length - 1 ? (
                      <button
                        onClick={() => setActiveTab('finalCiphertext')}
                        className="px-4 py-2 bg-[#142380] hover:bg-[#2f3c97] text-white font-extrabold text-xs rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                      >
                        <span>View Final Ciphertext</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    ) : (
                      <button
                        onClick={() => setCurrentStepIdx((prev) => Math.min(trace.steps.length - 1, prev + 1))}
                        className="hover:text-[#142380] disabled:opacity-30 font-semibold cursor-pointer"
                      >
                        Next Step →
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
            </div>
          )}

          {/* TAB 2: KEY EXPANSION SCHEDULE */}
          {activeTab === 'keyExpansion' && (() => {
            const parsedKeyBytes = parseInputBytes(keyInput, isHexMode);
            const keyMatrix: number[][] = [
              [parsedKeyBytes[0] ?? 0, parsedKeyBytes[4] ?? 0, parsedKeyBytes[8] ?? 0, parsedKeyBytes[12] ?? 0],
              [parsedKeyBytes[1] ?? 0, parsedKeyBytes[5] ?? 0, parsedKeyBytes[9] ?? 0, parsedKeyBytes[13] ?? 0],
              [parsedKeyBytes[2] ?? 0, parsedKeyBytes[6] ?? 0, parsedKeyBytes[10] ?? 0, parsedKeyBytes[14] ?? 0],
              [parsedKeyBytes[3] ?? 0, parsedKeyBytes[7] ?? 0, parsedKeyBytes[11] ?? 0, parsedKeyBytes[15] ?? 0],
            ];
            const curRoundKeyStep = trace.roundKeys[keyExpRound] || trace.roundKeys[0];

            return (
              <div className="space-y-6">
                {/* Header Title & Badges */}
                <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#D9DDE7] shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-xl bg-[#142380] text-white">
                        <Key className="w-5 h-5" />
                      </div>
                      <h1 className="text-xl sm:text-2xl font-extrabold text-[#151c27] tracking-tight">
                        Key Expansion
                      </h1>
                    </div>
                    <p className="text-xs sm:text-sm text-[#454652] max-w-2xl">
                      Generating 10 round keys from the original 128-bit secret key.
                    </p>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-center">
                    <span className="bg-[#f0f3ff] border border-[#dce2f3] px-3 py-1.5 rounded-xl text-xs font-extrabold text-[#142380] uppercase tracking-wider">
                      AES-{selectedAlgo}
                    </span>
                    <span className="bg-[#ffdbc9] border border-[#ff9a5b]/40 px-3 py-1.5 rounded-xl text-xs font-extrabold text-[#96490d] uppercase tracking-wider flex items-center gap-1.5">
                      <RefreshCw className="w-3.5 h-3.5" />
                      10 Rounds
                    </span>
                  </div>
                </div>

                {/* THREE-PANEL EDUCATIONAL VISUALIZATION */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
                  
                  {/* LEFT PANEL: ORIGINAL SECRET KEY */}
                  <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-[#D9DDE7] shadow-xs flex flex-col justify-between space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-[#f0f3ff]">
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-[#142380]" />
                        <h2 className="text-sm font-extrabold text-[#151c27]">Original Secret Key</h2>
                      </div>
                      <span className="text-[10px] font-extrabold text-[#142380] bg-[#e7eefe] px-2 py-0.5 rounded">
                        128 BITS
                      </span>
                    </div>

                    {/* Key Attributes */}
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="p-2.5 bg-[#F7F8FC] rounded-xl border border-[#D9DDE7]">
                        <span className="text-[10px] font-bold text-[#767683] uppercase block">Variant</span>
                        <span className="font-extrabold text-[#142380]">AES-128</span>
                      </div>
                      <div className="p-2.5 bg-[#F7F8FC] rounded-xl border border-[#D9DDE7]">
                        <span className="text-[10px] font-bold text-[#767683] uppercase block">Key Length</span>
                        <span className="font-mono font-bold text-[#151c27]">16 Bytes</span>
                      </div>
                    </div>

                    {/* 4x4 Key Matrix */}
                    <div className="space-y-1.5">
                      <div className="text-[10px] font-extrabold text-[#767683] uppercase tracking-wider text-center">
                        4×4 KEY MATRIX LAYOUT
                      </div>
                      <div className="grid grid-cols-4 gap-1.5 p-2.5 bg-[#F7F8FC] rounded-2xl border border-[#D9DDE7]">
                        {keyMatrix.map((rowArr, rIdx) =>
                          rowArr.map((val, cIdx) => (
                            <div
                              key={`key-cell-${rIdx}-${cIdx}`}
                              className={`aspect-square rounded-xl text-xs font-mono font-extrabold flex items-center justify-center transition-all ${
                                keyExpRound === 0
                                  ? 'bg-[#142380] text-white shadow-xs scale-105'
                                  : 'bg-white text-[#142380] border border-[#D9DDE7]'
                              }`}
                            >
                              {val.toString(16).padStart(2, '0').toUpperCase()}
                            </div>
                          ))
                        )}
                      </div>
                    </div>

                    {/* Hex Representation */}
                    <div className="p-3 bg-[#f0f3ff] rounded-2xl border border-[#dce2f3] text-center space-y-1">
                      <span className="text-[10px] font-extrabold text-[#767683] uppercase">HEXADECIMAL KEY</span>
                      <p className="text-xs font-mono font-extrabold text-[#142380] break-all">
                        {bytesToHexFormatted(parsedKeyBytes)}
                      </p>
                    </div>
                  </div>

                  {/* CENTER PANEL: KEY EXPANSION ENGINE */}
                  <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-[#D9DDE7] shadow-xs flex flex-col justify-between space-y-4 text-center relative overflow-hidden">
                    <div className="flex items-center justify-between pb-3 border-b border-[#f0f3ff]">
                      <div className="flex items-center gap-2">
                        <Cpu className="w-4 h-4 text-[#142380]" />
                        <h2 className="text-sm font-extrabold text-[#151c27]">Key Expansion Engine</h2>
                      </div>
                      <span className="text-[10px] font-extrabold text-[#005221] bg-[#e8f8ee] px-2 py-0.5 rounded flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#005221] animate-pulse"></span>
                        Active
                      </span>
                    </div>

                    {/* Animated Flow & G-Function Display */}
                    <div className="my-auto py-2 space-y-3">
                      <div className="p-4 bg-[#f0f3ff] rounded-2xl border border-[#142380]/20 space-y-3 relative shadow-inner">
                        <div className="flex items-center justify-center gap-2 text-xs font-extrabold text-[#142380]">
                          <Sparkles className="w-4 h-4 text-[#142380] animate-spin" />
                          <span>
                            {keyExpRound === 0 ? 'Original Key Loaded' : `Deriving Round Key ${keyExpRound}`}
                          </span>
                        </div>

                        {/* Sequence Flow */}
                        <div className="grid grid-cols-3 gap-2 items-center text-xs font-mono">
                          <div className="bg-white p-2.5 rounded-xl border border-[#D9DDE7] shadow-2xs">
                            <div className="text-[9px] text-[#767683] font-bold">PREV WORD</div>
                            <div className="font-extrabold text-[#151c27]">
                              W[{keyExpRound === 0 ? 0 : keyExpRound * 4 - 1}]
                            </div>
                          </div>

                          <div className="bg-[#ffdbc9] p-2.5 rounded-xl border border-[#ff9a5b] text-[#96490d] shadow-2xs">
                            <div className="text-[9px] font-extrabold uppercase">G-FUNCTION</div>
                            <div className="text-[10px] font-bold">Rot + Sub + Rcon</div>
                          </div>

                          <div className="bg-[#142380] text-white p-2.5 rounded-xl shadow-2xs">
                            <div className="text-[9px] text-[#dfe0ff] font-bold">NEW WORD</div>
                            <div className="font-extrabold">
                              W[{keyExpRound === 0 ? 3 : keyExpRound * 4}]
                            </div>
                          </div>
                        </div>

                        {curRoundKeyStep.rotWord && (
                          <div className="text-[10px] bg-white p-2 rounded-xl border border-[#D9DDE7] text-left font-mono space-y-0.5 text-[#454652]">
                            <div><strong className="text-[#142380]">RotWord:</strong> {bytesToHexFormatted(curRoundKeyStep.rotWord)}</div>
                            <div><strong className="text-[#142380]">SubWord:</strong> {curRoundKeyStep.subWord && bytesToHexFormatted(curRoundKeyStep.subWord)}</div>
                            <div><strong className="text-[#142380]">Rcon[{keyExpRound}]:</strong> {curRoundKeyStep.rcon && bytesToHexFormatted(curRoundKeyStep.rcon)}</div>
                          </div>
                        )}
                      </div>

                      <p className="text-xs text-[#454652] leading-relaxed italic max-w-xs mx-auto">
                        "The original secret key is expanded into multiple unique round keys used throughout AES encryption."
                      </p>
                    </div>

                    {/* Live Status Bar */}
                    <div className="bg-[#F7F8FC] p-3 rounded-2xl border border-[#D9DDE7] flex items-center justify-between text-xs">
                      <span className="font-bold text-[#454652]">Status:</span>
                      <span className="font-extrabold text-[#142380]">
                        {keyExpRound === 0
                          ? 'Original Key Loaded'
                          : keyExpRound < 10
                          ? `Generating Round Key ${keyExpRound}`
                          : 'Round Keys Generated: 10 / 10'}
                      </span>
                    </div>
                  </div>

                  {/* RIGHT PANEL: GENERATED ROUND KEYS CARDS */}
                  <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-[#D9DDE7] shadow-xs flex flex-col justify-between space-y-3">
                    <div className="flex items-center justify-between pb-3 border-b border-[#f0f3ff]">
                      <h2 className="text-sm font-extrabold text-[#151c27]">Generated Round Keys</h2>
                      <span className="text-[11px] font-extrabold text-[#142380] bg-[#e7eefe] px-2.5 py-0.5 rounded-full">
                        {keyExpRound + 1} / 11 Ready
                      </span>
                    </div>

                    {/* Scrollable list of 11 Round Key Cards */}
                    <div className="space-y-2 max-h-[320px] overflow-y-auto pr-1">
                      {trace.roundKeys.map((rk) => {
                        const isCompleted = rk.round <= keyExpRound;
                        const isGenerating = rk.round === keyExpRound + 1 && isPlaying;
                        const hexPreview = bytesToHexFormatted(rk.roundKeyMatrix.flat()).substring(0, 12) + '...';

                        return (
                          <div
                            key={`rk-card-${rk.round}`}
                            onMouseEnter={() => setHoveredRoundKey(rk.round)}
                            onMouseLeave={() => setHoveredRoundKey(null)}
                            className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                              rk.round === keyExpRound
                                ? 'bg-[#f0f3ff] border-2 border-[#142380] shadow-2xs'
                                : isCompleted
                                ? 'bg-white border-[#D9DDE7] hover:border-[#142380]'
                                : 'bg-[#F7F8FC] border-dashed border-[#D9DDE7] opacity-60'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div
                                className={`w-7 h-7 rounded-xl flex items-center justify-center font-mono font-bold text-xs ${
                                  rk.round === keyExpRound
                                    ? 'bg-[#142380] text-white'
                                    : isCompleted
                                    ? 'bg-[#005221] text-white'
                                    : 'bg-[#D9DDE7] text-[#767683]'
                                }`}
                              >
                                {rk.round}
                              </div>

                              <div>
                                <div className="text-xs font-extrabold text-[#151c27]">
                                  {rk.round === 0 ? 'Round Key 0 (Original Key)' : `Round Key ${rk.round}`}
                                </div>
                                <div className="text-[11px] font-mono text-[#767683]">
                                  {isCompleted ? hexPreview : isGenerating ? 'Generating...' : 'Pending'}
                                </div>
                              </div>
                            </div>

                            <div>
                              {isCompleted ? (
                                <CheckCircle2 className="w-4 h-4 text-[#005221]" />
                              ) : isGenerating ? (
                                <RefreshCw className="w-4 h-4 text-[#142380] animate-spin" />
                              ) : (
                                <Clock className="w-4 h-4 text-[#767683]" />
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                </div>

                {/* SECOND ROW: Educational Box + Key Schedule Core */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
                  
                  {/* Left: Why Key Expansion? Card */}
                  <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-[#D9DDE7] shadow-xs space-y-3 flex flex-col justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-[#f0f3ff] text-[#142380] flex items-center justify-center shrink-0">
                        <Lightbulb className="w-5 h-5" />
                      </div>
                      <h2 className="text-lg font-extrabold text-[#151c27]">
                        Why Key Expansion?
                      </h2>
                    </div>

                    <p className="text-xs text-[#454652] leading-relaxed">
                      AES does not use the same key repeatedly during encryption. Instead, it generates a unique Round Key for every encryption round. This strengthens security by ensuring each round applies a different key while all keys originate from the original secret key.
                    </p>
                  </div>

                  {/* Right: Key Schedule Core Box */}
                  <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-[#D9DDE7] shadow-xs space-y-3 flex flex-col justify-between">
                    <div className="flex items-center justify-between pb-2 border-b border-[#f0f3ff]">
                      <h3 className="text-sm font-extrabold text-[#151c27]">
                        The Key Schedule Core (G-Function)
                      </h3>
                      <span className="text-[10px] font-extrabold text-[#142380] bg-[#e7eefe] px-2 py-0.5 rounded">
                        4-Byte Words
                      </span>
                    </div>

                    <p className="text-xs text-[#454652] leading-relaxed">
                      The G-function is the heart of key expansion. Every 4th word passes through three core operations:
                    </p>

                    <ul className="text-xs space-y-1.5 text-[#454652]">
                      <li className="flex items-start gap-2">
                        <span className="font-extrabold text-[#142380]">• RotWord:</span>
                        <span>Cyclic left shift of the 4 bytes [b0,b1,b2,b3] → [b1,b2,b3,b0].</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="font-extrabold text-[#142380]">• SubWord:</span>
                        <span>Passes each byte through the S-Box for substitution.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="font-extrabold text-[#142380]">• Rcon[i]:</span>
                        <span>XORs first byte with round constant to break symmetry.</span>
                      </li>
                    </ul>
                  </div>

                </div>

                {/* PLAYBACK CONTROLS TOOLBAR */}
                <div className="bg-white border border-[#D9DDE7] p-3 rounded-2xl shadow-md flex items-center justify-between gap-4 max-w-xl mx-auto">
                  <button
                    onClick={() => { setIsPlaying(false); setKeyExpRound(0); }}
                    className="px-3 py-1.5 rounded-xl text-xs font-bold text-[#454652] hover:bg-[#f0f3ff] hover:text-[#142380] transition-colors cursor-pointer"
                  >
                    RESET
                  </button>

                  <button
                    onClick={() => setKeyExpRound((prev) => Math.max(0, prev - 1))}
                    disabled={keyExpRound === 0}
                    className="p-2 rounded-xl text-[#454652] hover:bg-[#f0f3ff] disabled:opacity-40 transition-colors cursor-pointer"
                    title="Previous Step"
                  >
                    <SkipBack className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="px-5 py-2 rounded-xl bg-[#142380] text-white font-bold text-xs hover:bg-[#2f3c97] transition-all cursor-pointer flex items-center gap-2"
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    <span>{isPlaying ? 'PAUSE' : 'AUTO PLAY'}</span>
                  </button>

                  <button
                    onClick={() => setKeyExpRound((prev) => Math.min(10, prev + 1))}
                    disabled={keyExpRound === 10}
                    className="p-2 rounded-xl text-[#454652] hover:bg-[#f0f3ff] disabled:opacity-40 transition-colors cursor-pointer"
                    title="Next Step"
                  >
                    <SkipForward className="w-4 h-4" />
                  </button>

                  <span className="text-xs font-mono font-bold text-[#142380]">
                    Round Key {keyExpRound} / 10
                  </span>
                </div>

                {/* COMPLETION STATE BANNER */}
                {keyExpRound === 10 && (
                  <div className="bg-[#e8f8ee] border-2 border-[#10b981] rounded-3xl p-6 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-[#10b981] text-white flex items-center justify-center shrink-0">
                        <CheckCircle2 className="w-7 h-7" />
                      </div>
                      <div>
                        <h3 className="text-base font-extrabold text-[#151c27]">
                          ✓ Key Expansion Complete
                        </h3>
                        <p className="text-xs text-[#454652] mt-0.5">
                          All required Round Keys have been successfully generated. The AES encryption process is now ready to begin.
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      <button
                        onClick={() => { setKeyExpRound(0); setIsPlaying(true); }}
                        className="px-4 py-3 rounded-2xl bg-white border border-[#D9DDE7] hover:bg-[#f0f3ff] text-[#142380] font-bold text-xs transition-colors cursor-pointer"
                      >
                        Replay Expansion
                      </button>
                      <button
                        onClick={() => {
                          setCurrentStepIdx(2);
                          setActiveTab('trace');
                        }}
                        className="px-6 py-3.5 rounded-2xl bg-[#142380] hover:bg-[#2f3c97] text-white font-extrabold text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer shrink-0"
                      >
                        <span>Continue to State Matrix</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })()}
        </div>
      )}

      {/* TAB 3: FINAL CIPHERTEXT */}
      {activeTab === 'finalCiphertext' && (() => {
        const finalStateBytes = trace.steps[trace.steps.length - 1]?.state.flat() || [];
        const finalCiphertextHex = bytesToHexFormatted(finalStateBytes);
        const plainTextHex = bytesToHexFormatted(parseInputBytes(plaintextInput, isHexMode));
        const keyHex = bytesToHexFormatted(parseInputBytes(keyInput, isHexMode));

        // Chunk ciphertext into 4 groups of 4 bytes
        const hexChunks = [];
        for (let i = 0; i < finalStateBytes.length; i += 4) {
          hexChunks.push(
            finalStateBytes.slice(i, i + 4).map(b => b.toString(16).padStart(2, '0').toUpperCase()).join(' ')
          );
        }

        const handleDownloadReport = () => {
          const reportContent = `================================================
AES ENCRYPTION SESSION REPORT
================================================
Timestamp: ${new Date().toISOString()}
Algorithm: AES-${selectedAlgo}
Status: Completed Successfully
Rounds Executed: 10
Execution Time: 0.04 ms

INPUT DATA:
Plaintext (Raw): ${plaintextInput}
Plaintext (Hex): ${plainTextHex}

SECRET KEY:
Key (Raw): ${keyInput}
Key (Hex): ${keyHex}

FINAL RESULT:
Ciphertext (Hex): ${finalCiphertextHex}

SUMMARY:
128-bit input block processed through 10 rounds using 11 derived round keys.
================================================`;
          const blob = new Blob([reportContent], { type: 'text/plain' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `AES_Encryption_Report_${Date.now()}.txt`;
          a.click();
          URL.revokeObjectURL(url);
        };

        return (
          <div className="space-y-6 animate-fadeIn max-w-6xl mx-auto">
            {/* 1. Hero Section: Success Banner */}
            <section className="relative bg-white border border-[#10b981]/30 rounded-3xl p-6 sm:p-8 flex items-center gap-6 shadow-xs overflow-hidden">
              <div className="absolute right-0 top-0 w-80 h-full opacity-10 bg-gradient-to-l from-[#10b981] to-transparent pointer-events-none"></div>
              <div className="w-16 h-16 rounded-3xl bg-[#e8f8ee] border-2 border-[#10b981]/40 flex items-center justify-center shrink-0 shadow-md">
                <ShieldCheck className="w-9 h-9 text-[#005221]" />
              </div>
              <div className="z-10 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xl">🎉</span>
                  <h1 className="text-xl sm:text-2xl font-extrabold text-[#151c27] tracking-tight">
                    AES Encryption Completed Successfully
                  </h1>
                </div>
                <p className="text-xs sm:text-sm text-[#454652] max-w-3xl leading-relaxed">
                  Your plaintext has been securely transformed into ciphertext through the Advanced Encryption Standard (AES) encryption process. The 128-bit block has been successfully processed through all 10 rounds.
                </p>
              </div>
            </section>

            {/* 2. Main Visualization: Horizontal Flow Diagram */}
            <section className="bg-white border border-[#D9DDE7] rounded-3xl p-6 shadow-xs overflow-x-auto">
              <h3 className="text-sm font-extrabold text-[#151c27] mb-4 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#142380]" />
                <span>Encryption Flow</span>
              </h3>

              <div className="flex items-center justify-between min-w-[720px] py-2 px-2">
                {/* Node 1: Plaintext */}
                <div className="flex flex-col items-center gap-2 w-32 text-center">
                  <div className="w-12 h-12 rounded-2xl bg-[#F7F8FC] border border-[#D9DDE7] flex items-center justify-center shadow-2xs">
                    <FileCode className="w-6 h-6 text-[#142380]" />
                  </div>
                  <span className="text-xs font-bold text-[#151c27]">Plaintext</span>
                  <span className="text-[10px] font-mono text-[#767683] truncate max-w-[110px]" title={plaintextInput}>
                    {plaintextInput}
                  </span>
                </div>

                {/* Connector 1 */}
                <div className="flex-1 h-0.5 bg-[#D9DDE7] relative mx-3 flex items-center justify-center">
                  <div className="absolute inset-0 bg-[#005221] opacity-70"></div>
                  <ChevronRight className="w-4 h-4 text-[#005221] absolute right-0 -mr-1 z-10" />
                </div>

                {/* Node 2: Key Expansion */}
                <div className="flex flex-col items-center gap-2 w-36 text-center">
                  <div className="w-12 h-12 rounded-2xl bg-[#F7F8FC] border border-[#D9DDE7] flex items-center justify-center shadow-2xs">
                    <Key className="w-6 h-6 text-[#142380]" />
                  </div>
                  <span className="text-xs font-bold text-[#151c27]">Key Expansion</span>
                  <span className="text-[10px] text-[#005221] font-bold bg-[#e8f8ee] px-2 py-0.5 rounded">
                    11 Round Keys
                  </span>
                </div>

                {/* Connector 2 */}
                <div className="flex-1 h-0.5 bg-[#D9DDE7] relative mx-3 flex items-center justify-center">
                  <div className="absolute inset-0 bg-[#005221] opacity-70"></div>
                  <ChevronRight className="w-4 h-4 text-[#005221] absolute right-0 -mr-1 z-10" />
                </div>

                {/* Node 3: AES (10 Rounds) */}
                <div className="flex flex-col items-center gap-2 w-44 text-center">
                  <div className="w-14 h-14 rounded-2xl bg-[#142380] text-white flex items-center justify-center shadow-md border-2 border-[#2f3c97]">
                    <RefreshCw className="w-7 h-7 text-white" />
                  </div>
                  <span className="text-xs font-extrabold text-[#142380]">AES ({trace.roundKeys.length - 1} Rounds)</span>
                  <span className="text-[10px] font-bold text-[#142380] bg-[#e7eefe] px-2 py-0.5 rounded">
                    State Matrix
                  </span>
                </div>

                {/* Connector 3 */}
                <div className="flex-1 h-0.5 bg-[#D9DDE7] relative mx-3 flex items-center justify-center">
                  <div className="absolute inset-0 bg-[#005221] opacity-70"></div>
                  <ChevronRight className="w-4 h-4 text-[#005221] absolute right-0 -mr-1 z-10" />
                </div>

                {/* Node 4: Final Ciphertext */}
                <div className="flex flex-col items-center gap-2 w-36 text-center">
                  <div className="w-14 h-14 rounded-2xl bg-[#96490d] text-white flex items-center justify-center shadow-md border-2 border-[#ff9a5b]">
                    <Lock className="w-7 h-7" />
                  </div>
                  <span className="text-xs font-extrabold text-[#96490d]">Ciphertext</span>
                  <span className="text-[10px] font-bold text-[#96490d] bg-[#ffdbc9] px-2 py-0.5 rounded">
                    128 Bits (16B)
                  </span>
                </div>
              </div>
            </section>

            {/* 3. Bento Grid for Ciphertext & Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              
              {/* Main Ciphertext Card */}
              <section className="lg:col-span-8 bg-white border border-[#D9DDE7] rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col justify-between space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-[#f0f3ff]">
                  <div>
                    <h2 className="text-xl font-extrabold text-[#151c27]">Final Ciphertext</h2>
                    <p className="text-xs sm:text-sm text-[#454652] mt-0.5">
                      Resulting 128-bit block after completing round 10.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => copyToClipboard(finalCiphertextHex, 'finalCipher')}
                      className="px-4 py-2 bg-[#F7F8FC] hover:bg-[#e7eefe] text-[#142380] border border-[#D9DDE7] rounded-xl font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      {copiedText === 'finalCipher' ? (
                        <>
                          <Check className="w-4 h-4 text-[#005221]" />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={handleDownloadReport}
                      className="px-4 py-2 bg-[#142380] hover:bg-[#2f3c97] text-white rounded-xl font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span>Export Report</span>
                    </button>
                  </div>
                </div>

                {/* Monospace Ciphertext Box */}
                <div className="bg-[#F7F8FC] p-6 sm:p-8 rounded-2xl border border-[#D9DDE7] text-center flex-1 flex flex-col justify-center items-center min-h-[180px] space-y-3">
                  <span className="text-[10px] font-extrabold text-[#767683] uppercase tracking-widest">
                    128-BIT HEXADECIMAL CIPHERTEXT OUTPUT
                  </span>

                  <div className="font-mono text-base sm:text-lg md:text-xl font-extrabold text-[#142380] tracking-widest leading-relaxed grid grid-cols-2 sm:grid-cols-4 gap-3 w-full max-w-xl mx-auto my-auto">
                    {hexChunks.map((chunk, idx) => (
                      <div key={idx} className="bg-white p-3 rounded-xl border border-[#D9DDE7] shadow-2xs">
                        {chunk}
                      </div>
                    ))}
                  </div>

                  <p className="text-[11px] font-mono text-[#767683]">
                    Formatted in 4-byte columns (16 bytes total)
                  </p>
                </div>
              </section>

              {/* Encryption Summary & Statistics */}
              <section className="lg:col-span-4 flex flex-col justify-between gap-3">
                <div className="bg-white border border-[#D9DDE7] rounded-2xl p-4 shadow-xs flex items-center gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-[#e7eefe] text-[#142380] flex items-center justify-center shrink-0">
                    <BarChart2 className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-[#767683] uppercase tracking-wider">ALGORITHM</p>
                    <p className="text-base font-extrabold text-[#151c27]">AES-{selectedAlgo}</p>
                  </div>
                </div>

                <div className="bg-white border border-[#D9DDE7] rounded-2xl p-4 shadow-xs flex items-center gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-[#e7eefe] text-[#142380] flex items-center justify-center shrink-0">
                    <RefreshCw className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-[#767683] uppercase tracking-wider">TOTAL ROUNDS</p>
                    <p className="text-base font-extrabold text-[#151c27]">10 Rounds</p>
                  </div>
                </div>

                <div className="bg-white border border-[#D9DDE7] rounded-2xl p-4 shadow-xs flex items-center gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-[#e8f8ee] text-[#005221] flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-[#767683] uppercase tracking-wider">EXECUTION TIME</p>
                    <p className="text-base font-extrabold text-[#151c27]">0.04 ms</p>
                  </div>
                </div>

                <div className="bg-white border border-[#D9DDE7] rounded-2xl p-4 shadow-xs flex items-center gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-[#e8f8ee] text-[#005221] flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-[#767683] uppercase tracking-wider">STATUS</p>
                    <p className="text-base font-extrabold text-[#005221] flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#005221] animate-pulse"></span>
                      Success
                    </p>
                  </div>
                </div>
              </section>

            </div>

            {/* 4. Journey Timeline */}
            <section className="bg-white border border-[#D9DDE7] rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
              <div className="flex items-center justify-between pb-2 border-b border-[#f0f3ff]">
                <div>
                  <h3 className="text-base font-extrabold text-[#151c27]">Journey Timeline</h3>
                  <p className="text-xs text-[#454652]">Complete progression of the AES 128-bit block transformation</p>
                </div>
                <span className="text-xs font-bold text-[#005221] bg-[#e8f8ee] px-3 py-1 rounded-full">
                  100% Completed
                </span>
              </div>

              <div className="relative w-full h-2 bg-[#D9DDE7] rounded-full my-6">
                <div className="absolute top-0 left-0 h-full bg-[#142380] rounded-full w-full"></div>

                <div className="absolute w-full flex justify-between top-1/2 -translate-y-1/2 px-1">
                  {[
                    { label: 'Input', round: 0 },
                    { label: 'Key Exp.', round: 0 },
                    { label: 'Initial Add', round: 0 },
                    { label: 'Rounds 1-9', round: 9 },
                    { label: 'Round 10 (Final)', round: 10 }
                  ].map((tm, tIdx) => (
                    <div key={tIdx} className="flex flex-col items-center group relative">
                      <div className="w-6 h-6 rounded-full bg-[#142380] text-white border-2 border-white shadow-sm flex items-center justify-center text-[10px] font-bold">
                        ✓
                      </div>
                      <div className="absolute -top-7 whitespace-nowrap text-[11px] font-extrabold text-[#142380]">
                        {tm.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* 5. Educational Card: What is Ciphertext? */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-[#D9DDE7] shadow-xs space-y-3 flex flex-col justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#f0f3ff] text-[#142380] flex items-center justify-center shrink-0">
                    <Lightbulb className="w-5 h-5" />
                  </div>
                  <h2 className="text-base font-extrabold text-[#151c27]">What is Ciphertext?</h2>
                </div>
                <p className="text-xs text-[#454652] leading-relaxed">
                  Ciphertext is the encrypted version of the original plaintext. It appears completely random and unreadable, ensuring that sensitive information remains confidential during storage or transmission. It can only be restored to plaintext with the corresponding decryption key.
                </p>
              </div>

              <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-[#D9DDE7] shadow-xs space-y-3 flex flex-col justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#ffdbc9] text-[#96490d] flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <h2 className="text-base font-extrabold text-[#151c27]">Why AES Is Secure</h2>
                </div>
                <p className="text-xs text-[#454652] leading-relaxed">
                  AES relies on a Substitution-Permutation Network (SPN). By combining non-linear byte substitution (SubBytes), row rotations (ShiftRows), column mixing (MixColumns), and key mixing (AddRoundKey) over 10 rounds, it achieves high confusion and diffusion.
                </p>
              </div>
            </div>

            {/* 6. Primary Action Controls */}
            <div className="flex flex-col sm:flex-row justify-end items-center gap-4 pt-4">
              <button
                onClick={() => {
                  setCurrentStepIdx(0);
                  setActiveTab('trace');
                  setIsPlaying(false);
                }}
                className="w-full sm:w-auto px-6 py-3.5 bg-white hover:bg-[#f0f3ff] text-[#142380] border border-[#142380] rounded-2xl font-extrabold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Replay Visualization</span>
              </button>

              <button
                onClick={() => {
                  setPlaintextInput('NEW SECRET MSG 26');
                  setKeyInput('AES SECRET KEY!!');
                  setCurrentStepIdx(0);
                  setActiveTab('trace');
                }}
                className="w-full sm:w-auto px-8 py-3.5 bg-[#142380] hover:bg-[#2f3c97] text-white rounded-2xl font-extrabold text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Start New Encryption</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        );
      })()}

        </main>

        {/* ================= RIGHT LEARNING PANEL (COLLAPSIBLE) ================= */}
        {isRightSidebarOpen && (
          <aside className="hidden xl:flex flex-col w-80 bg-white border-l border-[#D9DDE7] p-6 overflow-y-auto space-y-6 shrink-0 z-10">
            {/* Header & Close Button */}
            <div className="flex justify-between items-center pb-3 border-b border-[#D9DDE7]">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-[#142380]" />
                <h2 className="text-base font-extrabold text-[#142380]">Educational Guide</h2>
              </div>
              <button
                onClick={() => setIsRightSidebarOpen(false)}
                className="p-1 rounded-lg text-[#767683] hover:text-[#142380] hover:bg-[#F7F8FC] transition-colors cursor-pointer"
                title="Collapse Guide Panel"
              >
                <PanelRightClose className="w-4 h-4" />
              </button>
            </div>

            {/* Knowledge Base Accordions */}
            <div className="bg-[#f0f3ff] rounded-2xl border border-[#dce2f3] p-5 space-y-4 shadow-2xs">
              <div className="flex items-center gap-2 text-[#142380]">
                <Lightbulb className="w-4 h-4 text-[#142380]" />
                <h3 className="text-sm font-extrabold">
                  {activeTab === 'finalCiphertext'
                    ? 'Final Ciphertext Guide'
                    : activeTab === 'keyExpansion'
                    ? 'Key Expansion Guide'
                    : 'Knowledge Base'}
                </h3>
              </div>

              <div className="space-y-2">
                {activeTab === 'finalCiphertext' ? (
                  <>
                    {/* Final Ciphertext KB Item 1 */}
                    <div className="bg-white rounded-xl border border-[#dce2f3] overflow-hidden">
                      <button
                        onClick={() => setExpandedKbItem(expandedKbItem === 'whatIsCiphertext' ? null : 'whatIsCiphertext')}
                        className="w-full p-3 text-left font-bold text-xs text-[#142380] flex justify-between items-center cursor-pointer hover:bg-[#f0f3ff]/50 transition-colors"
                      >
                        <span>From Plaintext to Ciphertext</span>
                        {expandedKbItem === 'whatIsCiphertext' ? <ChevronUp className="w-3.5 h-3.5 text-[#142380]" /> : <ChevronDown className="w-3.5 h-3.5 text-[#767683]" />}
                      </button>
                      {expandedKbItem === 'whatIsCiphertext' && (
                        <div className="px-3 pb-3 text-xs text-[#454652] leading-relaxed border-t border-[#f0f3ff] pt-2">
                          The 128-bit plaintext passed through 10 rounds of non-linear substitution (SubBytes), transposition (ShiftRows), diffusion (MixColumns), and key mixing (AddRoundKey).
                        </div>
                      )}
                    </div>

                    {/* Final Ciphertext KB Item 2 */}
                    <div className="bg-white rounded-xl border border-[#dce2f3] overflow-hidden">
                      <button
                        onClick={() => setExpandedKbItem(expandedKbItem === 'cipherSecurity' ? null : 'cipherSecurity')}
                        className="w-full p-3 text-left font-bold text-xs text-[#142380] flex justify-between items-center cursor-pointer hover:bg-[#f0f3ff]/50 transition-colors"
                      >
                        <span>Why Is Ciphertext Secure?</span>
                        {expandedKbItem === 'cipherSecurity' ? <ChevronUp className="w-3.5 h-3.5 text-[#142380]" /> : <ChevronDown className="w-3.5 h-3.5 text-[#767683]" />}
                      </button>
                      {expandedKbItem === 'cipherSecurity' && (
                        <div className="px-3 pb-3 text-xs text-[#454652] leading-relaxed border-t border-[#f0f3ff] pt-2">
                          Small changes in either plaintext or secret key produce completely different ciphertext (the Avalanche Effect), preventing pattern analysis or unauthorized decryption.
                        </div>
                      )}
                    </div>

                    {/* Final Ciphertext KB Item 3 */}
                    <div className="bg-white rounded-xl border border-[#dce2f3] overflow-hidden">
                      <button
                        onClick={() => setExpandedKbItem(expandedKbItem === 'decryptionNote' ? null : 'decryptionNote')}
                        className="w-full p-3 text-left font-bold text-xs text-[#142380] flex justify-between items-center cursor-pointer hover:bg-[#f0f3ff]/50 transition-colors"
                      >
                        <span>How Decryption Works</span>
                        {expandedKbItem === 'decryptionNote' ? <ChevronUp className="w-3.5 h-3.5 text-[#142380]" /> : <ChevronDown className="w-3.5 h-3.5 text-[#767683]" />}
                      </button>
                      {expandedKbItem === 'decryptionNote' && (
                        <div className="px-3 pb-3 text-xs text-[#454652] leading-relaxed border-t border-[#f0f3ff] pt-2">
                          Decryption executes the inverse transformations (InvSubBytes, InvShiftRows, InvMixColumns, and AddRoundKey) in reverse order using the derived round keys.
                        </div>
                      )}
                    </div>
                  </>
                ) : activeTab === 'keyExpansion' ? (
                  <>
                    {/* Key Expansion KB Item 1 */}
                    <div className="bg-white rounded-xl border border-[#dce2f3] overflow-hidden">
                      <button
                        onClick={() => setExpandedKbItem(expandedKbItem === 'whatIsKeyExp' ? null : 'whatIsKeyExp')}
                        className="w-full p-3 text-left font-bold text-xs text-[#142380] flex justify-between items-center cursor-pointer hover:bg-[#f0f3ff]/50 transition-colors"
                      >
                        <span>What is Key Expansion?</span>
                        {expandedKbItem === 'whatIsKeyExp' ? <ChevronUp className="w-3.5 h-3.5 text-[#142380]" /> : <ChevronDown className="w-3.5 h-3.5 text-[#767683]" />}
                      </button>
                      {expandedKbItem === 'whatIsKeyExp' && (
                        <div className="px-3 pb-3 text-xs text-[#454652] leading-relaxed border-t border-[#f0f3ff] pt-2">
                          Key Expansion is the process of generating 11 round keys (for AES-128) from a single 128-bit secret key using bitwise XOR, byte substitutions (S-Box), and cyclic rotations.
                        </div>
                      )}
                    </div>

                    {/* Key Expansion KB Item 2 */}
                    <div className="bg-white rounded-xl border border-[#dce2f3] overflow-hidden">
                      <button
                        onClick={() => setExpandedKbItem(expandedKbItem === 'whatIsRoundKey' ? null : 'whatIsRoundKey')}
                        className="w-full p-3 text-left font-bold text-xs text-[#142380] flex justify-between items-center cursor-pointer hover:bg-[#f0f3ff]/50 transition-colors"
                      >
                        <span>What is a Round Key?</span>
                        {expandedKbItem === 'whatIsRoundKey' ? <ChevronUp className="w-3.5 h-3.5 text-[#142380]" /> : <ChevronDown className="w-3.5 h-3.5 text-[#767683]" />}
                      </button>
                      {expandedKbItem === 'whatIsRoundKey' && (
                        <div className="px-3 pb-3 text-xs text-[#454652] leading-relaxed border-t border-[#f0f3ff] pt-2">
                          A Round Key is a 128-bit matrix derived specifically for one encryption round. It is XORed with the state matrix during the AddRoundKey step to scramble state bits.
                        </div>
                      )}
                    </div>

                    {/* Key Expansion KB Item 3 */}
                    <div className="bg-white rounded-xl border border-[#dce2f3] overflow-hidden">
                      <button
                        onClick={() => setExpandedKbItem(expandedKbItem === 'whyMultipleKeys' ? null : 'whyMultipleKeys')}
                        className="w-full p-3 text-left font-bold text-xs text-[#142380] flex justify-between items-center cursor-pointer hover:bg-[#f0f3ff]/50 transition-colors"
                      >
                        <span>Why Multiple Round Keys?</span>
                        {expandedKbItem === 'whyMultipleKeys' ? <ChevronUp className="w-3.5 h-3.5 text-[#142380]" /> : <ChevronDown className="w-3.5 h-3.5 text-[#767683]" />}
                      </button>
                      {expandedKbItem === 'whyMultipleKeys' && (
                        <div className="px-3 pb-3 text-xs text-[#454652] leading-relaxed border-t border-[#f0f3ff] pt-2">
                          Using a single key repeatedly would leave mathematical patterns for attackers. Distinct round keys ensure each round alters data differently, maximizing diffusion and confusion.
                        </div>
                      )}
                    </div>

                    {/* Key Expansion KB Item 4 */}
                    <div className="bg-white rounded-xl border border-[#dce2f3] overflow-hidden">
                      <button
                        onClick={() => setExpandedKbItem(expandedKbItem === 'gFunctionDetails' ? null : 'gFunctionDetails')}
                        className="w-full p-3 text-left font-bold text-xs text-[#142380] flex justify-between items-center cursor-pointer hover:bg-[#f0f3ff]/50 transition-colors"
                      >
                        <span>The G-Function Core</span>
                        {expandedKbItem === 'gFunctionDetails' ? <ChevronUp className="w-3.5 h-3.5 text-[#142380]" /> : <ChevronDown className="w-3.5 h-3.5 text-[#767683]" />}
                      </button>
                      {expandedKbItem === 'gFunctionDetails' && (
                        <div className="px-3 pb-3 text-xs text-[#454652] leading-relaxed border-t border-[#f0f3ff] pt-2 space-y-1">
                          <p>The G-function transforms 4-byte words using:</p>
                          <ul className="list-disc list-inside text-[11px] text-[#142380] font-mono space-y-0.5">
                            <li>1. RotWord (left rotate)</li>
                            <li>2. SubWord (S-Box)</li>
                            <li>3. Rcon[i] (XOR round constant)</li>
                          </ul>
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <>
                    {/* Accordion 1: Why Hexadecimal? */}
                    <div className="bg-white rounded-xl border border-[#dce2f3] overflow-hidden">
                      <button
                        onClick={() => setExpandedKbItem(expandedKbItem === 'hex' ? null : 'hex')}
                        className="w-full p-3 text-left font-bold text-xs text-[#142380] flex justify-between items-center cursor-pointer hover:bg-[#f0f3ff]/50 transition-colors"
                      >
                        <span>Why Hexadecimal?</span>
                        {expandedKbItem === 'hex' ? <ChevronUp className="w-3.5 h-3.5 text-[#142380]" /> : <ChevronDown className="w-3.5 h-3.5 text-[#767683]" />}
                      </button>
                      {expandedKbItem === 'hex' && (
                        <div className="px-3 pb-3 text-xs text-[#454652] leading-relaxed border-t border-[#f0f3ff] pt-2">
                          Hex represents 8-bit bytes compactly. Each pair of hex digits (00–FF) corresponds exactly to one byte in memory, making it easier for humans to read than binary.
                        </div>
                      )}
                    </div>

                    {/* Accordion: What is XOR? */}
                    <div className="bg-white rounded-xl border border-[#dce2f3] overflow-hidden">
                      <button
                        onClick={() => setExpandedKbItem(expandedKbItem === 'xor' ? null : 'xor')}
                        className="w-full p-3 text-left font-bold text-xs text-[#142380] flex justify-between items-center cursor-pointer hover:bg-[#f0f3ff]/50 transition-colors"
                      >
                        <span>What is XOR?</span>
                        {expandedKbItem === 'xor' ? <ChevronUp className="w-3.5 h-3.5 text-[#142380]" /> : <ChevronDown className="w-3.5 h-3.5 text-[#767683]" />}
                      </button>
                      {expandedKbItem === 'xor' && (
                        <div className="px-3 pb-3 text-xs text-[#454652] leading-relaxed border-t border-[#f0f3ff] pt-2 space-y-1.5">
                          <p>Exclusive OR (XOR) outputs 1 if and only if inputs differ. Key properties:</p>
                          <ul className="list-disc list-inside text-[11px] space-y-0.5 text-[#142380] font-mono">
                            <li>A ⊕ 0 = A</li>
                            <li>A ⊕ A = 0</li>
                            <li>(A ⊕ B) ⊕ B = A</li>
                          </ul>
                        </div>
                      )}
                    </div>

                    {/* Accordion: Why AES Uses XOR */}
                    <div className="bg-white rounded-xl border border-[#dce2f3] overflow-hidden">
                      <button
                        onClick={() => setExpandedKbItem(expandedKbItem === 'whyXor' ? null : 'whyXor')}
                        className="w-full p-3 text-left font-bold text-xs text-[#142380] flex justify-between items-center cursor-pointer hover:bg-[#f0f3ff]/50 transition-colors"
                      >
                        <span>Why AES Uses XOR</span>
                        {expandedKbItem === 'whyXor' ? <ChevronUp className="w-3.5 h-3.5 text-[#142380]" /> : <ChevronDown className="w-3.5 h-3.5 text-[#767683]" />}
                      </button>
                      {expandedKbItem === 'whyXor' && (
                        <div className="px-3 pb-3 text-xs text-[#454652] leading-relaxed border-t border-[#f0f3ff] pt-2">
                          XOR is fast in hardware and software, preserves bit uniformity, and allows simple decryption since XORing with the same round key again restores the original input.
                        </div>
                      )}
                    </div>

                    {/* Accordion 2: Why 4x4 Matrix? */}
                    <div className="bg-white rounded-xl border border-[#dce2f3] overflow-hidden">
                      <button
                        onClick={() => setExpandedKbItem(expandedKbItem === 'matrix' ? null : 'matrix')}
                        className="w-full p-3 text-left font-bold text-xs text-[#142380] flex justify-between items-center cursor-pointer hover:bg-[#f0f3ff]/50 transition-colors"
                      >
                        <span>Why 4×4 Matrix?</span>
                        {expandedKbItem === 'matrix' ? <ChevronUp className="w-3.5 h-3.5 text-[#142380]" /> : <ChevronDown className="w-3.5 h-3.5 text-[#767683]" />}
                      </button>
                      {expandedKbItem === 'matrix' && (
                        <div className="px-3 pb-3 text-xs text-[#454652] leading-relaxed border-t border-[#f0f3ff] pt-2">
                          AES operates on 128-bit (16-byte) blocks arranged in a 4×4 byte matrix where transformations are applied by column and row.
                        </div>
                      )}
                    </div>

                    {/* Accordion 3: How Padding Works? */}
                    <div className="bg-white rounded-xl border border-[#dce2f3] overflow-hidden">
                      <button
                        onClick={() => setExpandedKbItem(expandedKbItem === 'padding' ? null : 'padding')}
                        className="w-full p-3 text-left font-bold text-xs text-[#142380] flex justify-between items-center cursor-pointer hover:bg-[#f0f3ff]/50 transition-colors"
                      >
                        <span>How Padding Works?</span>
                        {expandedKbItem === 'padding' ? <ChevronUp className="w-3.5 h-3.5 text-[#142380]" /> : <ChevronDown className="w-3.5 h-3.5 text-[#767683]" />}
                      </button>
                      {expandedKbItem === 'padding' && (
                        <div className="px-3 pb-3 text-xs text-[#454652] leading-relaxed border-t border-[#f0f3ff] pt-2">
                          When input length is less than 16 bytes, PKCS#7 or zero padding fills the remaining matrix cells to complete the 128-bit block.
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* AES Parameter Dark Navy Card (Matching User Screenshot) */}
            <div className="bg-[#142380] text-white rounded-2xl p-5 shadow-md relative overflow-hidden space-y-2">
              <div className="text-[10px] font-extrabold uppercase tracking-widest text-[#dfe0ff]">
                AES Parameter
              </div>
              <h3 className="text-base font-extrabold tracking-tight text-white">
                128-bit Block Size
              </h3>
              <p className="text-xs text-[#dfe0ff] leading-relaxed pr-6">
                Requires 10 rounds of transformation for full security strength.
              </p>
              <Lock className="w-16 h-16 text-white/10 absolute -right-2 -bottom-2 pointer-events-none" />
            </div>

            {/* Educational Concept Cards (Item 6) */}
            <div className="space-y-4">
              {/* Card 1: Plaintext */}
              <div className="p-4 bg-[#F7F8FC] rounded-2xl border border-[#D9DDE7] hover:border-[#142380] transition-all space-y-1.5 shadow-2xs">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-[#e7eefe] text-[#142380]">
                    <FileCode className="w-4 h-4" />
                  </div>
                  <h4 className="text-xs font-extrabold text-[#142380] uppercase tracking-wider">
                    1. Plaintext
                  </h4>
                </div>
                <p className="text-xs text-[#454652] leading-relaxed pl-0.5">
                  Plaintext is the original unencrypted input data. In AES, it is partitioned into fixed 128-bit (16-byte) blocks and structured as a 4×4 byte matrix before encryption begins.
                </p>
              </div>

              {/* Card 2: Secret Key */}
              <div className="p-4 bg-[#F7F8FC] rounded-2xl border border-[#D9DDE7] hover:border-[#96490d] transition-all space-y-1.5 shadow-2xs">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-[#ffdbc9]/60 text-[#96490d]">
                    <Key className="w-4 h-4" />
                  </div>
                  <h4 className="text-xs font-extrabold text-[#96490d] uppercase tracking-wider">
                    2. Secret Key
                  </h4>
                </div>
                <p className="text-xs text-[#454652] leading-relaxed pl-0.5">
                  The secret cipher key controls the entire encryption transformation. Through the Key Expansion schedule, it is expanded into distinct subkeys applied in each round.
                </p>
              </div>

              {/* Card 3: AES Rounds */}
              <div className="p-4 bg-[#F7F8FC] rounded-2xl border border-[#D9DDE7] hover:border-[#142380] transition-all space-y-1.5 shadow-2xs">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-[#e7eefe] text-[#142380]">
                    <Layers className="w-4 h-4" />
                  </div>
                  <h4 className="text-xs font-extrabold text-[#142380] uppercase tracking-wider">
                    3. AES Rounds
                  </h4>
                </div>
                <p className="text-xs text-[#454652] leading-relaxed pl-0.5">
                  AES applies repeated algebraic rounds of SubBytes, ShiftRows, MixColumns, and AddRoundKey. The key size determines the round count (10, 12, or 14 rounds).
                </p>
              </div>
            </div>
          </aside>
        )}

      </div>

      {/* Full 16x16 S-Box Table Modal */}
      {showFullSBoxModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl border border-[#D9DDE7] shadow-xl max-w-3xl w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-3 border-b border-[#D9DDE7]">
              <div>
                <h2 className="text-base font-extrabold text-[#151c27]">
                  AES Substitution Box (S-Box)
                </h2>
                <p className="text-xs text-[#767683]">
                  16×16 substitution lookup table used in SubBytes transformation
                </p>
              </div>
              <button
                onClick={() => setShowFullSBoxModal(false)}
                className="p-2 rounded-xl bg-[#F7F8FC] hover:bg-[#e7eefe] text-[#454652] font-bold text-xs transition-colors cursor-pointer"
              >
                Close (ESC)
              </button>
            </div>

            {/* 16x16 Grid */}
            <div className="overflow-x-auto p-2 bg-[#F7F8FC] rounded-2xl border border-[#D9DDE7]">
              <div className="grid gap-1 font-mono text-[10px] text-center min-w-[500px]" style={{ gridTemplateColumns: 'repeat(17, minmax(0, 1fr))' }}>
                {/* Header Row */}
                <div className="font-extrabold text-[#767683] p-1">y \ x</div>
                {Array.from({ length: 16 }).map((_, c) => (
                  <div key={`sbox-hdr-${c}`} className="font-extrabold text-[#142380] bg-[#e7eefe] p-1 rounded-sm">
                    {c.toString(16).toUpperCase()}
                  </div>
                ))}

                {/* 16 Rows */}
                {Array.from({ length: 16 }).map((_, r) => (
                  <React.Fragment key={`sbox-row-${r}`}>
                    <div className="font-extrabold text-[#142380] bg-[#e7eefe] p-1 rounded-sm flex items-center justify-center">
                      {r.toString(16).toUpperCase()}
                    </div>
                    {Array.from({ length: 16 }).map((_, c) => {
                      const idx = (r << 4) | c;
                      const val = SBOX[idx];
                      const curSubSource = (currentStep.prevState || currentStep.state)[activeSubByteIdx % 4]?.[Math.floor(activeSubByteIdx / 4)] ?? 0;
                      const activeRow = (curSubSource >> 4) & 0x0F;
                      const activeCol = curSubSource & 0x0F;
                      const isTarget = currentStep.operation === 'subBytes' && r === activeRow && c === activeCol;

                      return (
                        <div
                          key={`sbox-cell-${r}-${c}`}
                          className={`p-1.5 rounded-sm font-bold transition-all ${
                            isTarget
                              ? 'bg-[#142380] text-white scale-125 z-10 shadow-md ring-2 ring-[#142380]'
                              : r === activeRow || c === activeCol
                              ? 'bg-[#f0f3ff] text-[#142380]'
                              : 'bg-white text-[#151c27] hover:bg-[#e7eefe]'
                          }`}
                        >
                          {val.toString(16).padStart(2, '0').toUpperCase()}
                        </div>
                      );
                    })}
                  </React.Fragment>
                ))}
              </div>
            </div>

            <div className="flex justify-between items-center text-xs text-[#767683]">
              <span>Row = High Nibble (x), Col = Low Nibble (y)</span>
              <button
                onClick={() => setShowFullSBoxModal(false)}
                className="px-5 py-2 rounded-xl bg-[#142380] text-white font-bold cursor-pointer hover:bg-[#2f3c97] transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
