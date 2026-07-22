import React, { useState } from 'react';
import { NavigationTab } from '../types';
import { LogIn, Grid, RefreshCw, ArrowLeftRight, Columns, PlusCircle, LogOut, Info, X } from 'lucide-react';

interface JourneyTimelineProps {
  setActiveTab: (tab: NavigationTab) => void;
  onSelectStep?: (op: string) => void;
}

export const JourneyTimeline: React.FC<JourneyTimelineProps> = ({ setActiveTab, onSelectStep }) => {
  const [selectedStepModal, setSelectedStepModal] = useState<number | null>(null);

  const steps = [
    {
      index: 1,
      op: 'initial',
      title: 'Plaintext',
      icon: LogIn,
      color: 'border-[#2f3c97] text-[#2f3c97] hover:bg-[#2f3c97] hover:text-white',
      textColor: 'text-[#142380]',
      tooltip: 'Initial plaintext input provided as 16 raw bytes.',
      detail: 'The unencrypted input message (128-bit / 16 bytes) is prepared for encryption. In text mode, ASCII characters are converted directly to hexadecimal values.'
    },
    {
      index: 2,
      op: 'stateMatrix',
      title: 'State Matrix',
      icon: Grid,
      color: 'border-[#ff9a5b] text-[#96490d] hover:bg-[#ff9a5b] hover:text-[#733300]',
      textColor: 'text-[#96490d]',
      tooltip: 'Organization of data in a 4x4 grid of bytes.',
      detail: 'The 16 bytes of plaintext are loaded into a 4x4 matrix column by column (Column-Major order). All subsequent AES operations act on this State matrix.'
    },
    {
      index: 3,
      op: 'subBytes',
      title: 'SubBytes',
      icon: RefreshCw,
      color: 'border-[#2f3c97] text-[#2f3c97] hover:bg-[#2f3c97] hover:text-white',
      textColor: 'text-[#142380]',
      tooltip: 'Replaces each byte using the AES S-Box.',
      detail: 'A non-linear byte substitution step where each byte in the State matrix is independently replaced with another byte using a static 256-entry lookup table (S-Box).'
    },
    {
      index: 4,
      op: 'shiftRows',
      title: 'ShiftRows',
      icon: ArrowLeftRight,
      color: 'border-[#ff9a5b] text-[#96490d] hover:bg-[#ff9a5b] hover:text-[#733300]',
      textColor: 'text-[#96490d]',
      tooltip: 'Rotates rows to improve data diffusion.',
      detail: 'The bytes in the last three rows of the State matrix are cyclically shifted to the left by row index offsets (Row 0: 0, Row 1: 1, Row 2: 2, Row 3: 3).'
    },
    {
      index: 5,
      op: 'mixColumns',
      title: 'MixColumns',
      icon: Columns,
      color: 'border-[#2f3c97] text-[#2f3c97] hover:bg-[#2f3c97] hover:text-white',
      textColor: 'text-[#142380]',
      tooltip: 'Mixes each column using finite field arithmetic.',
      detail: 'Each 4-byte column is multiplied by a fixed polynomial matrix over GF(2^8). This step diffuses byte changes across entire columns.'
    },
    {
      index: 6,
      op: 'addRoundKey',
      title: 'AddRoundKey',
      icon: PlusCircle,
      color: 'border-[#ff9a5b] text-[#96490d] hover:bg-[#ff9a5b] hover:text-[#733300]',
      textColor: 'text-[#96490d]',
      tooltip: 'Combines the current state with the round key using XOR.',
      detail: 'Each byte of the State matrix is combined with a byte of the current round key using bitwise XOR (⊕). This is the only step directly incorporating the secret key.'
    },
    {
      index: 7,
      op: 'finalCiphertext',
      title: 'Ciphertext',
      icon: LogOut,
      color: 'border-[#2f3c97] text-[#2f3c97] hover:bg-[#2f3c97] hover:text-white',
      textColor: 'text-[#142380]',
      tooltip: 'Final encrypted output after 10 rounds.',
      detail: 'After 10 rounds of transformations (Round 10 omits MixColumns), the final State matrix is read column-by-column to yield the 16-byte encrypted ciphertext.'
    }
  ];

  const handleStepClick = (index: number) => {
    setSelectedStepModal(index);
  };

  const currentStepInfo = selectedStepModal !== null ? steps[selectedStepModal - 1] : null;

  return (
    <section className="py-16 md:py-20 bg-white border-y border-[#D9DDE7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1C2340] mb-3">
            The AES Journey
          </h2>
          <p className="text-base text-[#454652]">
            Seven steps to complete cryptographic security. Click any stage to explore details.
          </p>
        </div>

        {/* Timeline Flow */}
        <div className="relative">
          {/* Horizontal Connecting Line for Desktop */}
          <div className="absolute top-8 left-8 right-8 h-1 bg-[#e7eefe] hidden lg:block -z-0" />

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-6 relative z-10">
            {steps.map((s) => {
              const IconComp = s.icon;
              return (
                <div
                  key={s.index}
                  onClick={() => handleStepClick(s.index)}
                  className="flex flex-col items-center group cursor-pointer"
                  title={s.tooltip}
                >
                  <div className={`w-16 h-16 bg-white border-2 ${s.color} rounded-full flex items-center justify-center mb-3 shadow-md transition-all group-hover:scale-110 active:scale-95`}>
                    <IconComp className="w-6 h-6" />
                  </div>
                  <span className={`font-bold text-sm sm:text-base ${s.textColor} group-hover:underline text-center`}>
                    {s.title}
                  </span>
                  <span className="text-xs text-[#454652] mt-1 hidden sm:block text-center">
                    Step {s.index}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Modal for Step Explanations */}
        {currentStepInfo && (
          <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-[#c6c5d4] animate-in fade-in zoom-in-95">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#e7eefe] text-[#142380] flex items-center justify-center font-bold">
                    #{currentStepInfo.index}
                  </div>
                  <h3 className="text-xl font-bold text-[#1C2340]">
                    {currentStepInfo.title}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedStepModal(null)}
                  className="p-1 text-[#454652] hover:text-[#142380] rounded-lg hover:bg-[#f0f3ff]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <p className="text-base text-[#454652] mb-6 leading-relaxed">
                {currentStepInfo.detail}
              </p>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setSelectedStepModal(null)}
                  className="px-4 py-2 border border-[#D9DDE7] text-[#454652] font-semibold text-sm rounded-xl hover:bg-[#f0f3ff]"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setSelectedStepModal(null);
                    if (onSelectStep) onSelectStep(currentStepInfo.op);
                    setActiveTab('visualization');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="px-5 py-2 bg-[#2f3c97] text-white font-semibold text-sm rounded-xl hover:bg-[#142380] shadow-sm flex items-center gap-1.5"
                >
                  <span>Open in Visualizer</span>
                  <Info className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
