import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  AIDifficulty,
  BoardSize,
  CellState,
  GameMode,
  GameStats,
  Move,
  PlayerConfig,
  PlayerSymbol,
  SymbolSet,
  ThemeId,
  WinningLine,
} from './types';
import { checkWinner, getAIMove, getHintMove } from './utils/ai';
import { THEMES, SYMBOL_SETS } from './utils/themes';
import { soundEngine } from './utils/audio';
import { Board3D } from './components/Board3D';
import { ScoreBoard } from './components/ScoreBoard';
import { Controls } from './components/Controls';
import { ResultModal } from './components/ResultModal';
import { ParticlesCanvas } from './components/ParticlesCanvas';
import { Trophy, RefreshCw, Volume2, Sparkles, Gamepad2 } from 'lucide-react';

const LOCAL_STORAGE_KEY = 'tictactoe_game_stats_v1';

export default function App() {
  // Game Configuration State
  const [boardSize, setBoardSize] = useState<BoardSize>(3);
  const [themeId, setThemeId] = useState<ThemeId>('wood');
  const [symbolSet, setSymbolSet] = useState<SymbolSet>('classic');
  const [gameMode, setGameMode] = useState<GameMode>('ai');
  const [aiDifficulty, setAiDifficulty] = useState<AIDifficulty>('hard');
  const [blitzMode, setBlitzMode] = useState<number | null>(null);

  // Active Game State
  const [board, setBoard] = useState<CellState[]>(() => Array(9).fill(null));
  const [currentTurn, setCurrentTurn] = useState<PlayerSymbol>('X');
  const [winningInfo, setWinningInfo] = useState<WinningLine | null>(null);
  const [moveHistory, setMoveHistory] = useState<Move[]>([]);
  const [isAIThinking, setIsAIThinking] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [matchStartTime, setMatchStartTime] = useState<number>(Date.now());
  const [matchDuration, setMatchDuration] = useState<number>(0);
  const [hintedCellIndex, setHintedCellIndex] = useState<number | null>(null);

  // Turn Countdown Timer
  const [timerSeconds, setTimerSeconds] = useState<number | null>(null);

  // Modal State
  const [showResultModal, setShowResultModal] = useState(false);
  const [aiTaunt, setAiTaunt] = useState<string | undefined>(undefined);
  const [triggerWinBurst, setTriggerWinBurst] = useState(false);

  // Player Profiles
  const [playerX] = useState<PlayerConfig>({
    name: 'Player 1',
    symbol: 'X',
    set: symbolSet,
    color: 'amber',
  });

  const [playerO] = useState<PlayerConfig>({
    name: gameMode === 'ai' ? 'Master AI' : 'Player 2',
    symbol: 'O',
    set: symbolSet,
    color: 'cyan',
  });

  // Score Statistics
  const [stats, setStats] = useState<GameStats>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // Fallback
    }
    return {
      winsX: 0,
      winsO: 0,
      draws: 0,
      streakX: 0,
      streakO: 0,
      currentStreakWinner: null,
      totalGames: 0,
    };
  });

  // Save Stats to Local Storage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(stats));
    } catch {
      // Ignore
    }
  }, [stats]);

  // Reset board on size change
  const handleBoardSizeChange = (newSize: BoardSize) => {
    setBoardSize(newSize);
    setBoard(Array(newSize * newSize).fill(null));
    setWinningInfo(null);
    setMoveHistory([]);
    setCurrentTurn('X');
    setShowResultModal(false);
    setTriggerWinBurst(false);
    setHintedCellIndex(null);
    setMatchStartTime(Date.now());
  };

  // Reset current match
  const handleResetMatch = useCallback(() => {
    setBoard(Array(boardSize * boardSize).fill(null));
    setWinningInfo(null);
    setMoveHistory([]);
    setCurrentTurn('X');
    setShowResultModal(false);
    setTriggerWinBurst(false);
    setHintedCellIndex(null);
    setMatchStartTime(Date.now());
    soundEngine.playClick();
  }, [boardSize]);

  // Core Move Logic
  const executeMove = useCallback(
    (index: number, symbol: PlayerSymbol) => {
      const theme = THEMES[themeId] || THEMES.wood;
      soundEngine.playPlacePiece(theme.soundType);

      const nextBoard = [...board];
      nextBoard[index] = symbol;

      const r = Math.floor(index / boardSize);
      const c = index % boardSize;
      const newMove: Move = { index, symbol, row: r, col: c, time: Date.now() };

      setBoard(nextBoard);
      setMoveHistory((prev) => [...prev, newMove]);

      // Check win condition
      const winResult = checkWinner(nextBoard, boardSize);

      if (winResult.winner !== null) {
        setWinningInfo(winResult);
        const durationSec = Math.max(1, Math.round((Date.now() - matchStartTime) / 1000));
        setMatchDuration(durationSec);

        if (winResult.winner === 'draw') {
          soundEngine.playDraw();
          setStats((s) => ({
            ...s,
            draws: s.draws + 1,
            totalGames: s.totalGames + 1,
            currentStreakWinner: null,
          }));
          setAiTaunt('A hard-fought stalemate! Great tactical balance.');
        } else {
          soundEngine.playWin();
          setTriggerWinBurst(true);

          if (winResult.winner === 'X') {
            setStats((s) => ({
              ...s,
              winsX: s.winsX + 1,
              streakX: s.currentStreakWinner === 'X' ? s.streakX + 1 : 1,
              streakO: 0,
              currentStreakWinner: 'X',
              totalGames: s.totalGames + 1,
            }));
            setAiTaunt('Impressive move sequence! You outsmarted the grid.');
          } else {
            setStats((s) => ({
              ...s,
              winsO: s.winsO + 1,
              streakO: s.currentStreakWinner === 'O' ? s.streakO + 1 : 1,
              streakX: 0,
              currentStreakWinner: 'O',
              totalGames: s.totalGames + 1,
            }));
            setAiTaunt('The AI calculated every possible branch and claimed victory!');
          }
        }

        setTimeout(() => {
          setShowResultModal(true);
        }, 1100);
      } else {
        // Toggle turn
        const nextTurn: PlayerSymbol = symbol === 'X' ? 'O' : 'X';
        setCurrentTurn(nextTurn);
      }
    },
    [board, boardSize, themeId, matchStartTime]
  );

  // Handle player cell click move
  const handleCellClick = useCallback(
    (index: number) => {
      if (board[index] !== null || winningInfo !== null || isAIThinking) return;
      setHintedCellIndex(null);
      executeMove(index, currentTurn);
    },
    [board, winningInfo, isAIThinking, currentTurn, executeMove]
  );

  // Trigger AI Move when it's AI's turn
  useEffect(() => {
    if (gameMode === 'ai' && currentTurn === 'O' && winningInfo === null) {
      setIsAIThinking(true);

      const aiTimer = setTimeout(() => {
        const bestMoveIndex = getAIMove(board, boardSize, aiDifficulty, 'O');
        setIsAIThinking(false);

        if (bestMoveIndex !== -1 && board[bestMoveIndex] === null) {
          executeMove(bestMoveIndex, 'O');
        }
      }, 400);

      return () => clearTimeout(aiTimer);
    }
  }, [gameMode, currentTurn, winningInfo, board, boardSize, aiDifficulty, executeMove]);

  // Turn Blitz Timer Interval
  useEffect(() => {
    if (blitzMode === null || winningInfo !== null || showResultModal || isAIThinking) {
      setTimerSeconds(null);
      return;
    }

    setTimerSeconds(blitzMode);

    const interval = setInterval(() => {
      setTimerSeconds((prev) => {
        if (prev === null) return null;
        if (prev <= 1) {
          return 0;
        }
        soundEngine.playTimerTick();
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [currentTurn, blitzMode, winningInfo, showResultModal, isAIThinking]);

  // Blitz Timer Timeout Action
  useEffect(() => {
    if (timerSeconds === 0 && blitzMode !== null && winningInfo === null && !isAIThinking) {
      const available = board
        .map((val, idx) => (val === null ? idx : null))
        .filter((val): val is number => val !== null);
      if (available.length > 0) {
        const randomMove = available[Math.floor(Math.random() * available.length)];
        executeMove(randomMove, currentTurn);
      }
    }
  }, [timerSeconds, blitzMode, winningInfo, isAIThinking, board, currentTurn, executeMove]);

  // Undo Move
  const handleUndoMove = () => {
    if (moveHistory.length === 0 || winningInfo !== null) return;

    // In AI mode, undo both AI move and Player move
    const stepsToUndo = gameMode === 'ai' && moveHistory.length >= 2 ? 2 : 1;
    const newHistory = moveHistory.slice(0, moveHistory.length - stepsToUndo);

    const newBoard = Array(boardSize * boardSize).fill(null);
    newHistory.forEach((m) => {
      newBoard[m.index] = m.symbol;
    });

    setBoard(newBoard);
    setMoveHistory(newHistory);
    setWinningInfo(null);

    // Set correct turn
    if (newHistory.length > 0) {
      const lastMove = newHistory[newHistory.length - 1];
      setCurrentTurn(lastMove.symbol === 'X' ? 'O' : 'X');
    } else {
      setCurrentTurn('X');
    }

    soundEngine.playClick();
  };

  // Get Hint Move
  const handleGetHint = () => {
    if (winningInfo !== null || isAIThinking) return;

    const hintIdx = getHintMove(board, boardSize, currentTurn);
    if (hintIdx !== -1) {
      soundEngine.playHover();
      setHintedCellIndex(hintIdx);

      // Auto clear hint after 3.5s
      setTimeout(() => {
        setHintedCellIndex(null);
      }, 3500);
    }
  };

  const currentTheme = THEMES[themeId] || THEMES.wood;

  return (
    <div
      className={`min-h-screen w-full bg-stone-950 text-stone-100 flex flex-col items-center justify-between p-3 sm:p-6 transition-colors duration-500 overflow-x-hidden font-${currentTheme.fontFamily}`}
    >
      {/* Particle Celebration Canvas Overlay */}
      <ParticlesCanvas
        themeId={themeId}
        triggerWin={triggerWinBurst}
        triggerPlaceCellIndex={null}
        boardSize={boardSize}
      />

      {/* Top Header Title & Branding */}
      <header className="w-full max-w-[520px] flex items-center justify-between py-2 border-b border-white/10 select-none">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center font-black text-stone-950 shadow-lg shadow-amber-500/20">
            <Gamepad2 className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-black tracking-tight bg-gradient-to-r from-amber-200 via-amber-400 to-amber-100 bg-clip-text text-transparent">
              Tic Tac Toe Real 3D
            </h1>
            <p className="text-[10px] text-stone-400 font-semibold">
              Tactile Physical Board • Web Audio • Smart AI
            </p>
          </div>
        </div>

        {/* Total Games Played pill */}
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-900 border border-white/10 text-xs font-bold text-stone-300">
          <Trophy className="w-3.5 h-3.5 text-amber-400" />
          <span>{stats.totalGames} Matches</span>
        </div>
      </header>

      {/* Main Game Stage */}
      <main className="w-full max-w-[520px] flex flex-col items-center justify-center my-auto">
        {/* Scoreboard */}
        <ScoreBoard
          playerX={playerX}
          playerO={{ ...playerO, name: gameMode === 'ai' ? 'Master AI' : 'Player 2' }}
          stats={stats}
          currentTurn={currentTurn}
          gameMode={gameMode}
          aiDifficulty={aiDifficulty}
          themeId={themeId}
          timerSeconds={timerSeconds}
          isMuted={isMuted}
          onToggleMute={() => {
            const muted = soundEngine.toggleMute();
            setIsMuted(muted);
          }}
          onResetMatch={handleResetMatch}
          isGameOver={winningInfo !== null}
          winnerSymbol={winningInfo?.winner ?? null}
        />

        {/* AI Thinking Status Badge */}
        {isAIThinking && (
          <div className="my-1 flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 text-xs font-bold animate-pulse">
            <Sparkles className="w-3.5 h-3.5 animate-spin" />
            <span>AI calculating optimal move...</span>
          </div>
        )}

        {/* 3D Interactive Board */}
        <Board3D
          board={board}
          boardSize={boardSize}
          themeId={themeId}
          symbolSet={symbolSet}
          currentTurn={currentTurn}
          winningInfo={winningInfo}
          hintedCellIndex={hintedCellIndex}
          onCellClick={handleCellClick}
          disabled={winningInfo !== null || isAIThinking}
        />

        {/* Game Customization Controls */}
        <Controls
          gameMode={gameMode}
          aiDifficulty={aiDifficulty}
          boardSize={boardSize}
          themeId={themeId}
          symbolSet={symbolSet}
          blitzMode={blitzMode}
          onModeChange={(m) => {
            setGameMode(m);
            handleResetMatch();
          }}
          onDifficultyChange={setAiDifficulty}
          onBoardSizeChange={handleBoardSizeChange}
          onThemeChange={setThemeId}
          onSymbolSetChange={setSymbolSet}
          onBlitzTimerChange={setBlitzMode}
          onUndoMove={handleUndoMove}
          onGetHint={handleGetHint}
          canUndo={moveHistory.length > 0 && winningInfo === null}
          canHint={winningInfo === null && !isAIThinking}
        />
      </main>

      {/* Footer copyright & reset stats */}
      <footer className="w-full max-w-[520px] flex items-center justify-between text-[11px] text-stone-500 py-3 border-t border-white/5 select-none">
        <span>Tic Tac Toe Real 3D Experience</span>
        <button
          type="button"
          id="clear-stats-btn"
          onClick={() => {
            if (confirm('Reset all match stats & win streaks?')) {
              setStats({
                winsX: 0,
                winsO: 0,
                draws: 0,
                streakX: 0,
                streakO: 0,
                currentStreakWinner: null,
                totalGames: 0,
              });
              localStorage.removeItem(LOCAL_STORAGE_KEY);
            }
          }}
          className="hover:text-stone-300 transition-colors underline"
        >
          Clear Stats
        </button>
      </footer>

      {/* Victory / Draw Result Modal */}
      <ResultModal
        isOpen={showResultModal}
        winnerSymbol={winningInfo?.winner ?? null}
        playerX={playerX}
        playerO={{ ...playerO, name: gameMode === 'ai' ? 'Master AI' : 'Player 2' }}
        movesCount={moveHistory.length}
        durationSeconds={matchDuration}
        onPlayAgain={handleResetMatch}
        aiTaunt={aiTaunt}
      />
    </div>
  );
}
