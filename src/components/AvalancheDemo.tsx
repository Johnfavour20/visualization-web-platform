import React, { useState, useMemo } from 'react';
import { runAESTrace, parseInputBytes, bytesToHexFormatted } from '../lib/aes';
import { Zap, ShieldAlert, ArrowRight } from 'lucide-react';

export const AvalancheDemo: React.FC = () => {
  const [baseText, setBaseText] = useState('HELLO WORLD 2026');
  const [baseKey, setBaseKey] = useState('AES SECRET KEY!!');
  const [flippedBitIndex, setFlippedBitIndex] = useState<number>(0);

  // Original Trace
  const origTrace = useMemo(() => {
    const pt = parseInputBytes(baseText, false);
    const key = parseInputBytes(baseKey, false);
    return runAESTrace(pt, key);
  }, [baseText, baseKey]);

  // Modified Trace with 1 bit flipped in Plaintext
  const modTrace = useMemo(() => {
    const pt = parseInputBytes(baseText, false);
    const byteIdx = Math.floor(flippedBitIndex / 8);
    const bitPos = flippedBitIndex % 8;
    pt[byteIdx] ^= 1 << bitPos; // Flip bit
    const key = parseInputBytes(baseKey, false);
    return runAESTrace(pt, key);
  }, [baseText, baseKey, flippedBitIndex]);

  // Calculate bit differences per round
  const roundDiffs = useMemo(() => {
    const diffs: { round: number; flippedBits: number; percentage: number }[] = [];
    for (let r = 0; r <= 10; r++) {
      // Find step in round
      const origStep = origTrace.steps.find((s) => s.round === r && s.operation === 'addRoundKey') || origTrace.steps[origTrace.steps.length - 1];
      const modStep = modTrace.steps.find((s) => s.round === r && s.operation === 'addRoundKey') || modTrace.steps[modTrace.steps.length - 1];

      let diffBitsCount = 0;
      for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 4; col++) {
          const xorVal = origStep.state[row][col] ^ modStep.state[row][col];
          // Count set bits
          let b = xorVal;
          while (b > 0) {
            diffBitsCount += b & 1;
            b >>= 1;
          }
        }
      }
      diffs.push({
        round: r,
        flippedBits: diffBitsCount,
        percentage: Math.round((diffBitsCount / 128) * 100)
      });
    }
    return diffs;
  }, [origTrace, modTrace]);

  return (
    <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#D9DDE7] shadow-sm space-y-6">
      <div className="flex items-center gap-3 pb-4 border-b border-[#D9DDE7]">
        <div className="w-10 h-10 rounded-xl bg-[#ff9a5b] text-[#733300] flex items-center justify-center font-bold">
          <Zap className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-[#1C2340]">
            Interactive Avalanche Effect Simulator
          </h3>
          <p className="text-sm text-[#454652]">
            Demonstrating the Strict Avalanche Criterion (SAC): changing just 1 input bit alters ~50% of ciphertext bits.
          </p>
        </div>
      </div>

      {/* Bit Flip Controller */}
      <div className="bg-[#F7F8FC] p-4 rounded-2xl border border-[#D9DDE7] space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <span className="text-xs font-bold text-[#142380] uppercase">
            Flip Bit Position in Plaintext (Bit 0 to 127)
          </span>
          <span className="text-xs font-bold text-[#2f3c97] font-mono">
            Bit #{flippedBitIndex} (Byte {Math.floor(flippedBitIndex / 8)}, Bit {flippedBitIndex % 8})
          </span>
        </div>
        <input
          type="range"
          min={0}
          max={127}
          value={flippedBitIndex}
          onChange={(e) => setFlippedBitIndex(Number(e.target.value))}
          className="w-full accent-[#2f3c97] cursor-pointer"
        />
      </div>

      {/* Round-by-Round Bit Diffusion Chart */}
      <div className="space-y-3">
        <div className="text-xs font-bold text-[#1C2340] uppercase">
          Ciphertext Bit Flips Progression Across Rounds (Total 128 bits)
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-11 gap-2 text-center font-mono">
          {roundDiffs.map((rd) => (
            <div
              key={rd.round}
              className={`p-3 rounded-2xl border text-xs flex flex-col justify-between transition-all ${
                rd.percentage >= 40
                  ? 'bg-[#e7eefe] border-[#2f3c97] text-[#142380]'
                  : 'bg-[#F7F8FC] border-[#D9DDE7] text-[#454652]'
              }`}
            >
              <div className="font-bold text-[10px] text-[#454652]">R{rd.round}</div>
              <div className="text-lg font-extrabold text-[#1C2340] my-1">
                {rd.flippedBits} <span className="text-[10px] text-[#454652]">bits</span>
              </div>
              <div className="text-[10px] font-bold text-[#2f3c97]">
                {rd.percentage}%
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Ciphertext Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
        <div className="bg-[#F7F8FC] p-4 rounded-2xl border border-[#D9DDE7] space-y-1">
          <div className="font-bold text-[#142380]">Original Ciphertext:</div>
          <div className="text-[#1C2340] break-all">{origTrace.ciphertextHex}</div>
        </div>
        <div className="bg-[#ff9a5b]/10 p-4 rounded-2xl border border-[#ff9a5b] space-y-1">
          <div className="font-bold text-[#96490d]">Modified Ciphertext (1 Bit Flipped):</div>
          <div className="text-[#1C2340] break-all">{modTrace.ciphertextHex}</div>
        </div>
      </div>
    </div>
  );
};
