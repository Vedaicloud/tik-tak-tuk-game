import React from 'react';
import { motion } from 'motion/react';
import { PlayerSymbol, SymbolSet, ThemeId } from '../types';
import { SYMBOL_SETS, THEMES } from '../utils/themes';

interface Piece3DProps {
  symbol: PlayerSymbol;
  symbolSet: SymbolSet;
  themeId: ThemeId;
  isWinningCell?: boolean;
}

export const Piece3D: React.FC<Piece3DProps> = ({
  symbol,
  symbolSet,
  themeId,
  isWinningCell = false,
}) => {
  const symbolDef = SYMBOL_SETS[symbolSet] || SYMBOL_SETS.classic;
  const theme = THEMES[themeId] || THEMES.wood;
  const isX = symbol === 'X';

  const label = isX ? symbolDef.xLabel : symbolDef.oLabel;
  const isEmoji = label !== 'X' && label !== 'O';

  // Specific 3D CSS piece styles according to Theme
  const getPieceStyle = () => {
    if (themeId === 'wood') {
      return isX
        ? 'bg-gradient-to-br from-amber-200 via-amber-400 to-amber-600 text-stone-900 border border-amber-300/80 shadow-[inset_0_2px_4px_rgba(255,255,255,0.8),0_6px_12px_rgba(0,0,0,0.6)]'
        : 'bg-gradient-to-br from-zinc-700 via-zinc-800 to-zinc-950 text-amber-100 border border-zinc-600 shadow-[inset_0_2px_4px_rgba(255,255,255,0.3),0_6px_12px_rgba(0,0,0,0.8)]';
    }
    if (themeId === 'neon') {
      return isX
        ? 'bg-gradient-to-br from-cyan-400 to-blue-600 text-white shadow-[0_0_20px_rgba(6,182,212,0.8),inset_0_2px_6px_rgba(255,255,255,0.7)] border border-cyan-300'
        : 'bg-gradient-to-br from-fuchsia-500 to-pink-600 text-white shadow-[0_0_20px_rgba(217,70,239,0.8),inset_0_2px_6px_rgba(255,255,255,0.7)] border border-pink-300';
    }
    if (themeId === 'slate') {
      return isX
        ? 'bg-gradient-to-br from-stone-200 to-stone-400 text-stone-950 shadow-[0_4px_8px_rgba(0,0,0,0.6),inset_0_1px_3px_rgba(255,255,255,0.9)] border border-stone-300'
        : 'bg-gradient-to-br from-amber-200 to-yellow-400 text-stone-950 shadow-[0_4px_8px_rgba(0,0,0,0.6),inset_0_1px_3px_rgba(255,255,255,0.9)] border border-yellow-300';
    }
    if (themeId === 'glass') {
      return isX
        ? 'bg-gradient-to-br from-sky-400/90 via-blue-500/90 to-indigo-600/90 text-white backdrop-blur-md border border-white/40 shadow-[0_8px_20px_rgba(14,165,233,0.4),inset_0_2px_4px_rgba(255,255,255,0.8)]'
        : 'bg-gradient-to-br from-indigo-400/90 via-purple-500/90 to-pink-600/90 text-white backdrop-blur-md border border-white/40 shadow-[0_8px_20px_rgba(168,85,247,0.4),inset_0_2px_4px_rgba(255,255,255,0.8)]';
    }
    // Sketch
    return isX
      ? 'bg-stone-800 text-amber-50 shadow-[0_4px_6px_rgba(0,0,0,0.2)] border border-stone-900'
      : 'bg-orange-600 text-amber-50 shadow-[0_4px_6px_rgba(0,0,0,0.2)] border border-orange-700';
  };

  return (
    <motion.div
      initial={{ scale: 1.9, opacity: 0, y: -24, rotateX: 35, rotateZ: isX ? -15 : 15 }}
      animate={{
        scale: isWinningCell ? [1, 1.15, 1.05] : 1,
        opacity: 1,
        y: 0,
        rotateX: 0,
        rotateZ: 0,
      }}
      transition={{
        type: 'spring',
        stiffness: 420,
        damping: 22,
        mass: 0.8,
        repeat: isWinningCell ? Infinity : 0,
        repeatType: 'reverse',
        duration: isWinningCell ? 0.8 : undefined,
      }}
      className={`relative w-full h-full flex items-center justify-center rounded-2xl select-none transition-all duration-300 ${getPieceStyle()} ${
        isWinningCell ? 'ring-4 ring-yellow-400/90 scale-105 z-20 animate-pulse' : ''
      }`}
    >
      {/* 3D Top Specular Highlight */}
      <div className="absolute top-1 left-2 right-2 h-1/3 bg-gradient-to-b from-white/30 to-transparent rounded-t-xl pointer-events-none" />

      {/* Render Symbol (Classic SVG or Custom Emoji/Icon) */}
      {!isEmoji ? (
        <div className="relative flex items-center justify-center w-full h-full p-2">
          {isX ? (
            <svg
              viewBox="0 0 100 100"
              className="w-4/5 h-4/5 filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]"
            >
              <defs>
                <linearGradient id={`xGrad-${themeId}`} x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="currentColor" stopOpacity="1" />
                  <stop offset="100%" stopColor="currentColor" stopOpacity="0.85" />
                </linearGradient>
              </defs>
              <line
                x1="20"
                y1="20"
                x2="80"
                y2="80"
                stroke={`url(#xGrad-${themeId})`}
                strokeWidth="18"
                strokeLinecap="round"
              />
              <line
                x1="80"
                y1="20"
                x2="20"
                y2="80"
                stroke={`url(#xGrad-${themeId})`}
                strokeWidth="18"
                strokeLinecap="round"
              />
            </svg>
          ) : (
            <svg
              viewBox="0 0 100 100"
              className="w-4/5 h-4/5 filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]"
            >
              <circle
                cx="50"
                cy="50"
                r="30"
                fill="none"
                stroke="currentColor"
                strokeWidth="18"
                strokeLinecap="round"
              />
            </svg>
          )}
        </div>
      ) : (
        <span className="text-3xl sm:text-4xl filter drop-shadow-[0_4px_6px_rgba(0,0,0,0.4)] transform hover:scale-110 transition-transform">
          {label}
        </span>
      )}

      {/* Winning cell extra glow ring */}
      {isWinningCell && (
        <div className="absolute -inset-1 rounded-2xl bg-yellow-400/30 blur-md -z-10 animate-ping" />
      )}
    </motion.div>
  );
};
