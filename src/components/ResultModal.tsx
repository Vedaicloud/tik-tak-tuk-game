import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PlayerConfig, PlayerSymbol } from '../types';
import { Trophy, RefreshCw, Flame, Sparkles, Scale } from 'lucide-react';

interface ResultModalProps {
  isOpen: boolean;
  winnerSymbol: PlayerSymbol | 'draw' | null;
  playerX: PlayerConfig;
  playerO: PlayerConfig;
  movesCount: number;
  durationSeconds: number;
  onPlayAgain: () => void;
  aiTaunt?: string;
}

export const ResultModal: React.FC<ResultModalProps> = ({
  isOpen,
  winnerSymbol,
  playerX,
  playerO,
  movesCount,
  durationSeconds,
  onPlayAgain,
  aiTaunt,
}) => {
  if (!isOpen || !winnerSymbol) return null;

  const isDraw = winnerSymbol === 'draw';
  const winnerPlayer = winnerSymbol === 'X' ? playerX : playerO;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ scale: 0.7, opacity: 0, y: 30 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.7, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 350, damping: 22 }}
          className="relative w-full max-w-sm rounded-3xl bg-gradient-to-b from-stone-900 via-stone-950 to-stone-900 border-2 border-amber-500/50 shadow-[0_25px_60px_-15px_rgba(245,158,11,0.3)] p-6 flex flex-col items-center text-center text-stone-100 overflow-hidden"
        >
          {/* Top Decorative Rays */}
          <div className="absolute -top-24 w-48 h-48 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />

          {/* Trophy or Draw Icon */}
          <motion.div
            initial={{ scale: 0, rotate: -30 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 400, delay: 0.1 }}
            className={`w-20 h-20 rounded-3xl flex items-center justify-center mb-4 shadow-xl ${
              isDraw
                ? 'bg-stone-800 text-stone-300 border border-stone-600'
                : winnerSymbol === 'X'
                ? 'bg-gradient-to-br from-amber-400 to-amber-600 text-stone-950 border border-amber-300 shadow-amber-500/40'
                : 'bg-gradient-to-br from-cyan-400 to-blue-600 text-stone-950 border border-cyan-300 shadow-cyan-500/40'
            }`}
          >
            {isDraw ? <Scale className="w-10 h-10" /> : <Trophy className="w-10 h-10" />}
          </motion.div>

          {/* Winner Headline */}
          <h2 className="text-2xl font-black tracking-tight mb-1">
            {isDraw ? (
              <span className="text-stone-300">STALEMATE! DRAW MATCH</span>
            ) : (
              <span
                className={winnerSymbol === 'X' ? 'text-amber-400' : 'text-cyan-400'}
              >
                {winnerPlayer.name} VICTORY!
              </span>
            )}
          </h2>

          <p className="text-xs text-stone-400 font-medium mb-4">
            {isDraw
              ? 'Both players demonstrated equal tactical skill.'
              : `Flawless victory with ${winnerPlayer.symbol} strategy!`}
          </p>

          {/* AI Comment / Reaction */}
          {aiTaunt && (
            <div className="w-full bg-stone-900/90 rounded-xl p-3 border border-amber-500/20 text-xs italic text-amber-200/90 mb-4 flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
              <span>"{aiTaunt}"</span>
            </div>
          )}

          {/* Match Stats Pill */}
          <div className="w-full grid grid-cols-2 gap-2 bg-stone-900/60 rounded-xl p-3 border border-white/5 text-xs mb-6">
            <div className="flex flex-col">
              <span className="text-stone-400 text-[10px] uppercase font-bold">Total Moves</span>
              <span className="text-stone-200 font-extrabold text-sm">{movesCount} Moves</span>
            </div>
            <div className="flex flex-col">
              <span className="text-stone-400 text-[10px] uppercase font-bold">Match Time</span>
              <span className="text-stone-200 font-extrabold text-sm">{durationSeconds}s</span>
            </div>
          </div>

          {/* Play Again Button */}
          <button
            type="button"
            id="play-again-btn"
            onClick={onPlayAgain}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-stone-950 font-black text-sm tracking-wide shadow-lg shadow-amber-500/30 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span>PLAY AGAIN</span>
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
