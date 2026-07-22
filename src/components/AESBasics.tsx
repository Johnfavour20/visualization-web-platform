import React from 'react';
import { NavigationTab } from '../types';
import { AvalancheDemo } from './AvalancheDemo';
import { BookOpen, Shield, RefreshCw, ArrowLeftRight, Columns, PlusCircle, CheckCircle2, ArrowRight } from 'lucide-react';

interface AESBasicsProps {
  setActiveTab: (tab: NavigationTab) => void;
}

export const AESBasics: React.FC<AESBasicsProps> = ({ setActiveTab }) => {
  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
      
      {/* Header Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#D9DDE7] shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="inline-flex items-center gap-2 bg-[#e7eefe] text-[#142380] px-3 py-1 rounded-full text-xs font-bold mb-2">
            <BookOpen className="w-3.5 h-3.5 text-[#2f3c97]" />
            AES Cryptography Fundamentals
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1C2340]">
            Advanced Encryption Standard (AES) Explained
          </h1>
          <p className="text-sm sm:text-base text-[#454652] mt-1">
            Discover the mathematics, state transformations, and security guarantees behind NIST FIPS 197.
          </p>
        </div>

        <button
          onClick={() => {
            setActiveTab('visualization');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="bg-[#2f3c97] text-white px-6 py-3 rounded-xl font-bold text-sm shadow-md hover:bg-[#142380] transition-all flex items-center gap-2 cursor-pointer"
        >
          <span>Open Interactive Visualizer</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-[#D9DDE7] shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-[#2f3c97] text-white flex items-center justify-center font-bold">
            128
          </div>
          <h3 className="text-lg font-bold text-[#1C2340]">AES-128 Standard</h3>
          <p className="text-sm text-[#454652] leading-relaxed">
            Uses a 128-bit key and 10 transformation rounds. Operates on a 4x4 matrix of bytes representing a 128-bit block size.
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-[#D9DDE7] shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-[#ff9a5b] text-[#733300] flex items-center justify-center font-bold">
            192
          </div>
          <h3 className="text-lg font-bold text-[#1C2340]">AES-192 Standard</h3>
          <p className="text-sm text-[#454652] leading-relaxed">
            Uses a 192-bit key and 12 transformation rounds. Provides increased security against future quantum key search algorithms.
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-[#D9DDE7] shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-[#005221] text-white flex items-center justify-center font-bold">
            256
          </div>
          <h3 className="text-lg font-bold text-[#1C2340]">AES-256 Standard</h3>
          <p className="text-sm text-[#454652] leading-relaxed">
            Uses a 256-bit key and 14 transformation rounds. Certified for top-secret classified military and government intelligence data.
          </p>
        </div>
      </div>

      {/* The 4 Core Transformations Detailed */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#D9DDE7] shadow-sm space-y-8">
        <div className="border-b border-[#D9DDE7] pb-4">
          <h2 className="text-xl font-bold text-[#1C2340]">
            The Four Core Round Transformations
          </h2>
          <p className="text-sm text-[#454652]">
            Every AES encryption round (except the final round) sequentially applies these 4 mathematical operations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* SubBytes */}
          <div className="bg-[#F7F8FC] p-6 rounded-2xl border border-[#D9DDE7] space-y-3">
            <div className="flex items-center gap-3 text-[#2f3c97]">
              <RefreshCw className="w-6 h-6" />
              <h3 className="text-lg font-bold text-[#1C2340]">1. SubBytes (Substitution)</h3>
            </div>
            <p className="text-sm text-[#454652] leading-relaxed">
              Provides non-linearity to frustrate linear differential cryptanalysis. Each byte in the State matrix is independently mapped to a new byte using a precomputed 16x16 Substitution Box (S-Box).
            </p>
            <div className="bg-white p-3 rounded-xl border border-[#D9DDE7] font-mono text-xs text-[#142380]">
              State[r,c] = SBox[State[r,c]]
            </div>
          </div>

          {/* ShiftRows */}
          <div className="bg-[#F7F8FC] p-6 rounded-2xl border border-[#D9DDE7] space-y-3">
            <div className="flex items-center gap-3 text-[#96490d]">
              <ArrowLeftRight className="w-6 h-6" />
              <h3 className="text-lg font-bold text-[#1C2340]">2. ShiftRows (Permutation)</h3>
            </div>
            <p className="text-sm text-[#454652] leading-relaxed">
              Provides horizontal diffusion across columns. Bytes in Row 0 stay fixed, Row 1 shifts 1 byte left, Row 2 shifts 2 bytes left, and Row 3 shifts 3 bytes left cyclically.
            </p>
            <div className="bg-white p-3 rounded-xl border border-[#D9DDE7] font-mono text-xs text-[#96490d]">
              Row 0: no shift | Row 1: &lt;&lt;1 | Row 2: &lt;&lt;2 | Row 3: &lt;&lt;3
            </div>
          </div>

          {/* MixColumns */}
          <div className="bg-[#F7F8FC] p-6 rounded-2xl border border-[#D9DDE7] space-y-3">
            <div className="flex items-center gap-3 text-[#2f3c97]">
              <Columns className="w-6 h-6" />
              <h3 className="text-lg font-bold text-[#1C2340]">3. MixColumns (Diffusion)</h3>
            </div>
            <p className="text-sm text-[#454652] leading-relaxed">
              Provides vertical diffusion. Each column of 4 bytes is treated as a 4-term polynomial and multiplied by a fixed matrix modulo x⁴+1 in Galois Field GF(2⁸).
            </p>
            <div className="bg-white p-3 rounded-xl border border-[#D9DDE7] font-mono text-xs text-[#142380]">
              Matrix Mult: [02 03 01 01; 01 02 03 01; 01 01 02 03; 03 01 01 02]
            </div>
          </div>

          {/* AddRoundKey */}
          <div className="bg-[#F7F8FC] p-6 rounded-2xl border border-[#D9DDE7] space-y-3">
            <div className="flex items-center gap-3 text-[#005221]">
              <PlusCircle className="w-6 h-6" />
              <h3 className="text-lg font-bold text-[#1C2340]">4. AddRoundKey (Key Inclusion)</h3>
            </div>
            <p className="text-sm text-[#454652] leading-relaxed">
              Combines the secret key with the state. Each byte of the State matrix is XORed (⊕) with its corresponding byte from the expanded Round Key matrix.
            </p>
            <div className="bg-white p-3 rounded-xl border border-[#D9DDE7] font-mono text-xs text-[#005221]">
              State[r,c] = State[r,c] ⊕ RoundKey[r,c]
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Avalanche Effect Simulator */}
      <AvalancheDemo />

    </div>
  );
};
