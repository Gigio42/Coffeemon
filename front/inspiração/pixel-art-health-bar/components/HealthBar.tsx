import React from 'react';
import { GrassPattern, LeafIcon } from './icons';

interface HealthBarProps {
  name: string;
  level: number;
  currentHp: number;
  maxHp: number;
}

export const HealthBar: React.FC<HealthBarProps> = ({ name, level, currentHp, maxHp }) => {
  const hpPercentage = (currentHp / maxHp) * 100;

  return (
    <div className="w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl">
      {/* Outer container with border and rounded corners */}
      <div className="bg-[#e4e0d4] p-1.5 rounded-xl border border-[#c7bfae] shadow-lg">
        <div className="bg-[#f5f3ed] rounded-lg p-1">
          {/* Top section: Name and Level */}
          <div className="flex justify-between items-center px-3 py-1">
            <div className="flex items-center gap-2">
              <LeafIcon />
              <span className="text-[#6c6962] font-bold text-xl tracking-wider uppercase">{name}</span>
            </div>
            <div className="flex items-baseline gap-1">
                <span className="text-[#a1967c] font-bold text-base">Lv.</span>
                <span className="text-[#a1967c] font-bold text-xl">{level}</span>
            </div>
          </div>

          {/* Middle section: HP Bar */}
          <div className="flex items-center gap-2 px-2 pb-1">
            <div className="bg-white border-2 border-[#6c6962] rounded-sm px-1">
              <span className="font-bold text-[#6c6962] text-sm">HP</span>
            </div>
            <div className="relative w-full h-4 bg-[#4a5547] rounded overflow-hidden border border-gray-600/50">
              <div
                className="absolute top-0 left-0 h-full bg-gradient-to-b from-[#99e550] to-[#68a741] rounded"
                style={{ width: `${hpPercentage}%` }}
              ></div>
              <div 
                className="absolute top-0 left-1 h-[2px] bg-white/40 rounded"
                style={{ width: `calc(${hpPercentage}% - 8px)` }}
              ></div>
            </div>
          </div>

          {/* Bottom section: HP values and grass background */}
          <div className="relative h-12 rounded-b-lg overflow-hidden">
            <GrassPattern />
            <div className="absolute inset-0 flex justify-end items-center pr-4">
              <p className="text-white text-2xl font-bold" style={{ textShadow: '2px 2px #3b4238' }}>
                {currentHp} / {maxHp}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};