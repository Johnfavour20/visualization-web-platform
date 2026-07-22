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
  ExternalLink
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
  const [expandedKbItem, setExpandedKbItem] = useState<'hex' | 'matrix' | 'padding' | null>('hex');

  // View Controls
  const [displayFormat, setDisplayFormat] = useState<DisplayFormat>('hex');
  const [activeTab, setActiveTab] = useState<'trace' | 'keyExpansion'>('trace');
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [hoveredCell, setHoveredCell] = useState<{ r: number; c: number } | null>(null);

  // Trace Step State
  const [currentStepIdx, setCurrentStepIdx] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playSpeedMs, setPlaySpeedMs] = useState<number>(1200);

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
      timer = setInterval(() => {
        setCurrentStepIdx((prev) => {
          if (prev >= trace.steps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, playSpeedMs);
    }
    return () => clearInterval(timer);
  }, [isPlaying, playSpeedMs, trace.steps.length]);

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
                  onClick={() => { setCurrentStepIdx(trace.steps.length - 1); setActiveTab('trace'); }}
                  className={`w-full px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-2.5 transition-all cursor-pointer ${
                    currentStepIdx === trace.steps.length - 1
                      ? 'bg-[#142380] text-white shadow-xs'
                      : 'text-[#454652] hover:bg-[#f0f3ff] hover:text-[#142380]'
                  }`}
                >
                  <Clock className="w-4 h-4" />
                  <span>History</span>
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
                  <span className="flex items-center gap-1.5 font-bold text-[#005221] bg-[#6bff8f]/20 px-2.5 py-1 rounded-full text-[11px]">
                    <span className="w-2 h-2 rounded-full bg-[#005221] animate-pulse"></span>
                    Ready
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
                { id: 1, label: 'Input', icon: CheckCircle2, targetIdx: 0 },
                { id: 2, label: 'Initialize', icon: CheckCircle2, targetIdx: 1 },
                { id: 3, label: 'State Matrix', icon: Grid, targetIdx: 2 },
                { id: 4, label: 'SubBytes', icon: Layers, targetIdx: trace.steps.findIndex(s => s.operation === 'subBytes') >= 0 ? trace.steps.findIndex(s => s.operation === 'subBytes') : 3 },
                { id: 5, label: 'ShiftRows', icon: BarChart2, targetIdx: trace.steps.findIndex(s => s.operation === 'shiftRows') >= 0 ? trace.steps.findIndex(s => s.operation === 'shiftRows') : 4 }
              ].map((step) => {
                const isCurrent = (
                  (step.id === 1 && currentStepIdx === 0) ||
                  (step.id === 2 && currentStepIdx === 1) ||
                  (step.id === 3 && currentStepIdx === 2) ||
                  (step.id === 4 && trace.steps[currentStepIdx]?.operation === 'subBytes') ||
                  (step.id === 5 && trace.steps[currentStepIdx]?.operation === 'shiftRows')
                );
                const isCompleted = (
                  (step.id === 1 && currentStepIdx > 0) ||
                  (step.id === 2 && currentStepIdx > 1) ||
                  (step.id === 3 && currentStepIdx > 2)
                );

                const StepIcon = step.icon;

                return (
                  <div key={step.id} className="relative z-10 flex flex-col items-center group cursor-pointer" onClick={() => {
                    setCurrentStepIdx(step.targetIdx);
                    setActiveTab('trace');
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
                      onClick={() => setCurrentStepIdx(2)}
                      className="w-full sm:w-auto px-6 py-3 bg-[#142380] hover:bg-[#2f3c97] text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>Continue to Initial State Matrix</span>
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
                    <button
                      onClick={() => setCurrentStepIdx((prev) => Math.min(trace.steps.length - 1, prev + 1))}
                      disabled={currentStepIdx === trace.steps.length - 1}
                      className="hover:text-[#142380] disabled:opacity-30 font-semibold cursor-pointer"
                    >
                      Next Step →
                    </button>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* TAB 2: KEY EXPANSION SCHEDULE */}
          {activeTab === 'keyExpansion' && (
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#D9DDE7] shadow-sm space-y-8">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-[#D9DDE7]">
                <div>
                  <h2 className="text-xl font-bold text-[#151c27]">
                    AES-128 Key Expansion Schedule
                  </h2>
                  <p className="text-sm text-[#454652]">
                    Generates 11 Round Keys (44 32-bit words: W[0] through W[43]) using RotWord, SubWord, and Rcon[i].
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {trace.roundKeys.map((rk) => {
                  const hexVal = bytesToHexFormatted(rk.roundKeyMatrix.flat());
                  return (
                    <div
                      key={rk.round}
                      className="bg-[#F7F8FC] p-6 rounded-2xl border border-[#D9DDE7] hover:border-[#142380] hover:shadow-md transition-all space-y-4"
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-bold text-[#142380] bg-[#e7eefe] px-3 py-1 rounded-full">
                          Round Key {rk.round}
                        </span>
                        <button
                          onClick={() => copyToClipboard(hexVal, `rk-${rk.round}`)}
                          className="text-xs text-[#454652] hover:text-[#142380] flex items-center gap-1 font-mono cursor-pointer"
                        >
                          {copiedText === `rk-${rk.round}` ? <Check className="w-3 h-3 text-green-600" /> : <Copy className="w-3 h-3" />}
                          <span>Copy</span>
                        </button>
                      </div>

                      <div className="space-y-1.5 font-mono text-xs">
                        {rk.words.map((w, wIdx) => {
                          const overallWordIdx = rk.round * 4 + wIdx;
                          return (
                            <div key={wIdx} className="bg-white p-2 rounded-xl border border-[#D9DDE7] flex justify-between">
                              <span className="font-bold text-[#142380]">W[{overallWordIdx}]:</span>
                              <span className="text-[#151c27]">{bytesToHexFormatted(w)}</span>
                            </div>
                          );
                        })}
                      </div>

                      {rk.rotWord && (
                        <div className="text-[11px] bg-[#e7eefe]/50 p-2.5 rounded-xl border border-[#c6c5d4] space-y-1 text-[#454652] font-mono">
                          <div><strong className="text-[#142380]">RotWord:</strong> {bytesToHexFormatted(rk.rotWord)}</div>
                          <div><strong className="text-[#142380]">SubWord:</strong> {rk.subWord && bytesToHexFormatted(rk.subWord)}</div>
                          <div><strong className="text-[#142380]">Rcon[{rk.round}]:</strong> {rk.rcon && bytesToHexFormatted(rk.rcon)}</div>
                        </div>
                      )}

                      <div>
                        <div className="text-[10px] font-bold text-[#454652] uppercase mb-1">
                          4×4 Matrix Layout
                        </div>
                        <div className="grid grid-cols-4 gap-1 text-center font-mono text-xs">
                          {rk.roundKeyMatrix.map((r, rIdx) =>
                            r.map((val, cIdx) => (
                              <div key={`${rIdx}-${cIdx}`} className="bg-white p-1 rounded border border-[#D9DDE7] text-[#151c27]">
                                {val.toString(16).padStart(2, '0').toUpperCase()}
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

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

            {/* Knowledge Base Accordions (Matching User Screenshot) */}
            <div className="bg-[#f0f3ff] rounded-2xl border border-[#dce2f3] p-5 space-y-4 shadow-2xs">
              <div className="flex items-center gap-2 text-[#142380]">
                <Lightbulb className="w-4 h-4 text-[#142380]" />
                <h3 className="text-sm font-extrabold">Knowledge Base</h3>
              </div>

              <div className="space-y-2">
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
    </div>
  );
};
