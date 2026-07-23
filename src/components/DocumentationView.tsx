import React, { useState } from 'react';
import { NavigationTab } from '../types';
import { SBOX, INV_SBOX, RCON } from '../lib/aes';
import { Search, FileText, CheckCircle, ExternalLink, Grid, Table, ChevronLeft, LayoutDashboard } from 'lucide-react';

interface DocumentationViewProps {
  setActiveTab: (tab: NavigationTab) => void;
}

export const DocumentationView: React.FC<DocumentationViewProps> = ({ setActiveTab }) => {
  const [selectedBox, setSelectedBox] = useState<'sbox' | 'invSbox'>('sbox');
  const [hoveredByte, setHoveredByte] = useState<number | null>(0x32);
  const [searchQuery, setSearchQuery] = useState('');

  const activeBox = selectedBox === 'sbox' ? SBOX : INV_SBOX;

  return (
    <div className="min-h-screen bg-[#f9f9ff]">
      {/* Top Navigation Bar */}
      <div className="sticky top-0 z-40 bg-white border-b border-[#D9DDE7] shadow-xs px-4 sm:px-6 lg:px-8 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setActiveTab('dashboard')}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-[#454652] hover:bg-[#f0f3ff] transition-all"
            >
              <ChevronLeft className="w-5 h-5" />
              <span className="font-semibold text-sm">Back to Dashboard</span>
            </button>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('dashboard')}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#2f3c97] text-white font-semibold text-sm hover:bg-[#142380] transition-all"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
        {/* Title Banner */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#D9DDE7] shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="inline-flex items-center gap-2 bg-[#e7eefe] text-[#142380] px-3 py-1 rounded-full text-xs font-bold mb-2">
            <FileText className="w-3.5 h-3.5 text-[#2f3c97]" />
            NIST FIPS 197 Specifications & Tables
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1C2340]">
            AES Documentation & Lookup Tables
          </h1>
          <p className="text-sm sm:text-base text-[#454652] mt-1">
            Explore the 256-entry S-Box, Inverse S-Box, Round Constants (Rcon), and GF(2^8) mathematical specifications.
          </p>
        </div>

        <a
          href="https://nvlpubs.nist.gov/nistpubs/FIPS/NIST.FIPS.197.pdf"
          target="_blank"
          rel="noreferrer"
          className="bg-[#2f3c97] text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-md hover:bg-[#142380] transition-all flex items-center gap-2"
        >
          <span>NIST Spec PDF</span>
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>

      {/* Interactive S-Box / Inv S-Box Table Explorer */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#D9DDE7] shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-[#D9DDE7]">
          <div className="flex items-center gap-3">
            <Grid className="w-5 h-5 text-[#2f3c97]" />
            <h2 className="text-xl font-bold text-[#1C2340]">
              256-Byte Substitution Box (16×16 Table)
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedBox('sbox')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                selectedBox === 'sbox'
                  ? 'bg-[#2f3c97] text-white shadow-xs'
                  : 'bg-[#F7F8FC] text-[#454652] border border-[#D9DDE7]'
              }`}
            >
              Encryption S-Box
            </button>
            <button
              onClick={() => setSelectedBox('invSbox')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                selectedBox === 'invSbox'
                  ? 'bg-[#2f3c97] text-white shadow-xs'
                  : 'bg-[#F7F8FC] text-[#454652] border border-[#D9DDE7]'
              }`}
            >
              Decryption Inverse S-Box
            </button>
          </div>
        </div>

        {/* Selected Byte Detail Header */}
        {hoveredByte !== null && (
          <div className="bg-[#f0f3ff] p-4 rounded-2xl border border-[#dce2f3] flex flex-wrap justify-between items-center gap-4 font-mono text-xs">
            <div>
              <span className="text-[#454652]">Input Byte: </span>
              <span className="font-extrabold text-[#142380] text-sm">
                0x{hoveredByte.toString(16).padStart(2, '0').toUpperCase()}
              </span>
              <span className="text-[#454652] ml-2">
                (Row {Math.floor(hoveredByte / 16).toString(16).toUpperCase()}, Col {(hoveredByte % 16).toString(16).toUpperCase()})
              </span>
            </div>

            <div>
              <span className="text-[#454652]">Substituted Byte: </span>
              <span className="font-extrabold text-[#96490d] text-sm">
                0x{activeBox[hoveredByte].toString(16).padStart(2, '0').toUpperCase()}
              </span>
            </div>

            <div>
              <span className="text-[#454652]">Binary: </span>
              <span className="font-bold text-[#1C2340]">
                {activeBox[hoveredByte].toString(2).padStart(8, '0')}
              </span>
            </div>
          </div>
        )}

        {/* 16x16 Grid Matrix */}
        <div className="overflow-x-auto">
          <table className="w-full text-center border-collapse font-mono text-xs">
            <thead>
              <tr>
                <th className="p-2 text-[#454652] font-bold bg-[#F7F8FC] border border-[#D9DDE7]">y\x</th>
                {Array.from({ length: 16 }).map((_, col) => (
                  <th key={col} className="p-2 font-bold text-[#142380] bg-[#e7eefe] border border-[#D9DDE7]">
                    0{col.toString(16).toUpperCase()}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 16 }).map((_, row) => (
                <tr key={row}>
                  <td className="p-2 font-bold text-[#142380] bg-[#e7eefe] border border-[#D9DDE7]">
                    0{row.toString(16).toUpperCase()}
                  </td>
                  {Array.from({ length: 16 }).map((_, col) => {
                    const byteIdx = row * 16 + col;
                    const val = activeBox[byteIdx];
                    const isHovered = hoveredByte === byteIdx;

                    return (
                      <td
                        key={col}
                        onMouseEnter={() => setHoveredByte(byteIdx)}
                        className={`p-2 border transition-colors cursor-pointer ${
                          isHovered
                            ? 'bg-[#2f3c97] text-white font-bold scale-110 shadow-md z-10'
                            : 'bg-white text-[#1C2340] border-[#D9DDE7] hover:bg-[#F7F8FC]'
                        }`}
                      >
                        {val.toString(16).padStart(2, '0').toUpperCase()}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Round Constants Table */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#D9DDE7] shadow-sm space-y-4">
        <h2 className="text-xl font-bold text-[#1C2340]">
          AES Round Constants (Rcon Table)
        </h2>
        <p className="text-sm text-[#454652]">
          Powers of x in GF(2^8) used during key expansion to eliminate symmetry.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-6 lg:grid-cols-11 gap-3 font-mono text-center text-xs">
          {RCON.map((rc, idx) => (
            <div key={idx} className="bg-[#F7F8FC] p-3 rounded-2xl border border-[#D9DDE7] space-y-1">
              <div className="text-[10px] text-[#454652] font-bold">Rcon[{idx}]</div>
              <div className="font-extrabold text-[#142380]">
                0x{rc.toString(16).padStart(2, '0').toUpperCase()}
              </div>
            </div>
          ))}
        </div>
      </div>
      </div>

    </div>
  );
};
