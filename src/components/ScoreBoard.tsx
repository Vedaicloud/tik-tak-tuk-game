import React from 'react';
import { motion } from 'motion/react';
import { AIDifficulty, GameMode, GameStats, PlayerConfig, PlayerSymbol, ThemeId } from '../types';
import { THEMES } from '../utils/themes';
import { Volume2, VolumeX, RotateCcw, Flame, Bot, User, Clock } from 'lucide-react';

interface ScoreBoardProps {
  playerX: PlayerConfig;
  playerO: PlayerConfig;
  stats: GameStats;
  currentTurn: PlayerSymbol;
  gameMode: GameMode;
  aiDifficulty: AIDifficulty;
  themeId: ThemeId;
  timerSeconds: number | null; // null if untimed
  isMuted: boolean;
  onToggleMute: () => void;
  onResetMatch: () => void;
  isGameOver: boolean;
  winnerSymbol: PlayerSymbol | 'draw' | null;
}

export const ScoreBoard: React.FC<ScoreBoardProps> = ({
  playerX,
  playerO,
  stats,
  currentTurn,
  gameMode,
  aiDifficulty,
  themeId,
  timerSeconds,
  isMuted,
  onToggleMute,
  onResetMatch,
  isGameOver,
  winnerSymbol,
}) => {
  const theme = THEMES[themeId] || THEMES.wood;

  return (
    <div className="w-full max-w-[520px] flex flex-col gap-3 my-2 select-none">
      {/* Top Controls Bar */}
      <div className="flex items-center justify-between px-2">
        {/* Mode & Difficulty Badge */}
        <div className="flex items-center gap-2 bg-stone-900/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 text-xs font-semibold text-stone-200">
          {gameMode === 'ai' ? (
            <>
              <Bot className="w-3.5 h-3.5 text-cyan-400" />
              <span>Vs AI ({aiDifficulty.toUpperCase()})</span>
            </>
          ) : (
            <>
              <User className="w-3.5 h-3.5 text-amber-400" />
              <span>Pass & Play (2P)</span>
            </>
          )}
        </div>

        {/* Turn Timer (if blitz enabled) */}
        {timerSeconds !== null && (
          <div
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${
              timerSeconds <= 3
                ? 'bg-red-500/30 text-red-300 border border-red-500/50 animate-bounce'
                : 'bg-stone-900/60 text-stone-200 border border-white/10'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>00:0{timerSeconds}s</span>
          </div>
        )}

        {/* Quick Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            id="sound-toggle-btn"
            onClick={onToggleMute}
            className="p-2 rounded-full bg-stone-900/60 hover:bg-stone-800 border border-white/10 text-stone-200 transition-all hover:scale-110 active:scale-95"
            title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          </button>

          <button
            type="button"
            id="reset-match-btn"
            onClick={onResetMatch}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-200 text-xs font-semibold transition-all hover:scale-105 active:scale-95"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Main Scorecard Banner */}
      <div className="relative w-full rounded-2xl bg-stone-950/80 backdrop-blur-md p-3 border border-white/10 shadow-2xl flex items-center justify-between">
        {/* Player X Badge */}
        <div
          className={`flex-1 flex items-center gap-3 p-2 rounded-xl transition-all ${
            currentTurn === 'X' && !isGameOver
              ? 'bg-amber-500/20 border border-amber-500/40 ring-2 ring-amber-400/30 shadow-[0_0_15px_rgba(245,158,11,0.2)]'
              : 'opacity-70'
          }`}
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center font-black text-stone-950 text-xl shadow-md">
            X
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold text-stone-300 truncate max-w-[90px]">
              {playerX.name}
            </span>
            <span className="text-lg font-black text-amber-400">{stats.winsX} W</span>
          </div>
        </div>

        {/* Center VS & Turn Indicator */}
        <div className="flex flex-col items-center justify-center px-3">
          {!isGameOver ? (
            <motion.div
              key={currentTurn}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex flex-col items-center"
            >
              <span className="text-[10px] font-bold tracking-widest uppercase text-stone-400">TURN</span>
              <span
                className={`text-sm font-black tracking-wider ${
                  currentTurn === 'X' ? 'text-amber-400' : 'text-cyan-400'
                }`}
              >
                {currentTurn === 'X' ? playerX.name : playerO.name}
              </span>
            </motion.div>
          ) : (
            <div className="flex flex-col items-center">
              <span className="text-[10px] font-bold tracking-widest uppercase text-emerald-400">RESULT</span>
              <span className="text-xs font-black text-emerald-300">
                {winnerSymbol === 'draw' ? 'DRAW!' : `${winnerSymbol === 'X' ? playerX.name : playerO.name} WINS!`}
              </span>
            </div>
          )}

          {/* Streak indicator */}
          {stats.currentStreakWinner && stats.streakX > 1 && (
            <div className="mt-1 flex items-center gap-0.5 text-[10px] font-extrabold text-orange-400 bg-orange-950/60 px-2 py-0.5 rounded-full border border-orange-500/30">
              <Flame className="w-3 h-3 animate-pulse" />
              <span>{stats.streakX} Streak!</span>
            </div>
          )}
        </div>

        {/* Player O Badge */}
        <div
          className={`flex-1 flex items-center gap-3 p-2 rounded-xl transition-all justify-end ${
            currentTurn === 'O' && !isGameOver
              ? 'bg-cyan-500/20 border border-cyan-500/40 ring-2 ring-cyan-400/30 shadow-[0_0_15px_rgba(6,182,212,0.2)]'
              : 'opacity-70'
          }`}
        >
          <div className="flex flex-col items-end">
            <span className="text-xs font-bold text-stone-300 truncate max-w-[90px]">
              {playerO.name}
            </span>
            <span className="text-lg font-black text-cyan-400">{stats.winsO} W</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center font-black text-stone-950 text-xl shadow-md">
            O
          </div>
        </div>
      </div>
    </div>
  );
};
