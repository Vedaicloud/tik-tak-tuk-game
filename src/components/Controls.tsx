import React from 'react';
import { AIDifficulty, BoardSize, GameMode, SymbolSet, ThemeId } from '../types';
import { THEMES, SYMBOL_SETS } from '../utils/themes';
import { Settings, Sparkles, Trophy, Grid, Layers, Clock, Volume2, VolumeX } from 'lucide-react';

interface ControlsProps {
  gameMode: GameMode;
  aiDifficulty: AIDifficulty;
  boardSize: BoardSize;
  themeId: ThemeId;
  symbolSet: SymbolSet;
  blitzMode: number | null; // timer seconds or null
  onModeChange: (mode: GameMode) => void;
  onDifficultyChange: (diff: AIDifficulty) => void;
  onBoardSizeChange: (size: BoardSize) => void;
  onThemeChange: (theme: ThemeId) => void;
  onSymbolSetChange: (set: SymbolSet) => void;
  onBlitzTimerChange: (seconds: number | null) => void;
  onUndoMove?: () => void;
  onGetHint?: () => void;
  canUndo: boolean;
  canHint: boolean;
}

export const Controls: React.FC<ControlsProps> = ({
  gameMode,
  aiDifficulty,
  boardSize,
  themeId,
  symbolSet,
  blitzMode,
  onModeChange,
  onDifficultyChange,
  onBoardSizeChange,
  onThemeChange,
  onSymbolSetChange,
  onBlitzTimerChange,
  onUndoMove,
  onGetHint,
  canUndo,
  canHint,
}) => {
  return (
    <div className="w-full max-w-[520px] bg-stone-950/80 backdrop-blur-xl rounded-2xl p-4 border border-white/10 shadow-2xl flex flex-col gap-4 text-stone-200">
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <Settings className="w-4 h-4 text-amber-400" />
          <h2 className="text-sm font-bold tracking-wide uppercase">Game Settings & Customization</h2>
        </div>

        {/* Action helper buttons: Undo & Hint */}
        <div className="flex items-center gap-2">
          {onGetHint && (
            <button
              type="button"
              id="hint-btn"
              disabled={!canHint}
              onClick={onGetHint}
              className="px-2.5 py-1 rounded-lg bg-indigo-500/20 hover:bg-indigo-500/30 disabled:opacity-40 border border-indigo-500/40 text-indigo-200 text-xs font-semibold flex items-center gap-1 transition-all"
            >
              <Sparkles className="w-3 h-3 text-indigo-300" />
              <span>Hint</span>
            </button>
          )}

          {onUndoMove && (
            <button
              type="button"
              id="undo-btn"
              disabled={!canUndo}
              onClick={onUndoMove}
              className="px-2.5 py-1 rounded-lg bg-stone-800 hover:bg-stone-700 disabled:opacity-40 border border-white/10 text-stone-300 text-xs font-semibold transition-all"
            >
              Undo
            </button>
          )}
        </div>
      </div>

      {/* Row 1: Mode & AI Difficulty */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Game Mode Picker */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-stone-400 flex items-center gap-1">
            <Trophy className="w-3.5 h-3.5 text-amber-400" /> Mode
          </label>
          <div className="grid grid-cols-2 gap-1.5 p-1 bg-stone-900 rounded-xl border border-white/5">
            <button
              type="button"
              id="mode-ai-btn"
              onClick={() => onModeChange('ai')}
              className={`py-1.5 text-xs font-bold rounded-lg transition-all ${
                gameMode === 'ai' ? 'bg-amber-500 text-stone-950 shadow-md' : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              vs AI
            </button>
            <button
              type="button"
              id="mode-pvp-btn"
              onClick={() => onModeChange('pvp')}
              className={`py-1.5 text-xs font-bold rounded-lg transition-all ${
                gameMode === 'pvp' ? 'bg-amber-500 text-stone-950 shadow-md' : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              2 Player
            </button>
          </div>
        </div>

        {/* AI Difficulty (If AI Mode) */}
        {gameMode === 'ai' && (
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-stone-400">AI Level</label>
            <select
              id="ai-difficulty-select"
              value={aiDifficulty}
              onChange={(e) => onDifficultyChange(e.target.value as AIDifficulty)}
              className="bg-stone-900 border border-white/10 rounded-xl px-3 py-1.5 text-xs font-semibold text-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              <option value="easy">Casual (Easy)</option>
              <option value="medium">Balanced (Medium)</option>
              <option value="hard">Unbeatable Minimax (Hard)</option>
              <option value="master">Grandmaster AI (Master)</option>
            </select>
          </div>
        )}
      </div>

      {/* Row 2: Board Theme & Board Size */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Theme Picker */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-stone-400 flex items-center gap-1">
            <Layers className="w-3.5 h-3.5 text-cyan-400" /> Board Theme
          </label>
          <select
            id="theme-select"
            value={themeId}
            onChange={(e) => onThemeChange(e.target.value as ThemeId)}
            className="bg-stone-900 border border-white/10 rounded-xl px-3 py-1.5 text-xs font-semibold text-stone-200 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          >
            {Object.values(THEMES).map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        </div>

        {/* Board Size */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-stone-400 flex items-center gap-1">
            <Grid className="w-3.5 h-3.5 text-emerald-400" /> Grid Size
          </label>
          <div className="grid grid-cols-3 gap-1.5 p-1 bg-stone-900 rounded-xl border border-white/5">
            {([3, 4, 5] as BoardSize[]).map((sz) => (
              <button
                key={sz}
                type="button"
                id={`grid-size-${sz}`}
                onClick={() => onBoardSizeChange(sz)}
                className={`py-1.5 text-xs font-bold rounded-lg transition-all ${
                  boardSize === sz ? 'bg-emerald-500 text-stone-950 shadow-md' : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                {sz}x{sz}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Row 3: Symbols & Blitz Timer */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Symbol Set */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-stone-400">Pieces / Symbols</label>
          <select
            id="symbol-set-select"
            value={symbolSet}
            onChange={(e) => onSymbolSetChange(e.target.value as SymbolSet)}
            className="bg-stone-900 border border-white/10 rounded-xl px-3 py-1.5 text-xs font-semibold text-stone-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            {Object.values(SYMBOL_SETS).map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.xLabel} vs {s.oLabel})
              </option>
            ))}
          </select>
        </div>

        {/* Blitz Turn Timer */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-stone-400 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-red-400" /> Turn Timer
          </label>
          <select
            id="blitz-timer-select"
            value={blitzMode === null ? 'none' : blitzMode.toString()}
            onChange={(e) => {
              const val = e.target.value;
              onBlitzTimerChange(val === 'none' ? null : parseInt(val, 10));
            }}
            className="bg-stone-900 border border-white/10 rounded-xl px-3 py-1.5 text-xs font-semibold text-stone-200 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <option value="none">Untimed (Casual)</option>
            <option value="10">10 Sec Blitz</option>
            <option value="5">5 Sec Rush!</option>
          </select>
        </div>
      </div>
    </div>
  );
};
