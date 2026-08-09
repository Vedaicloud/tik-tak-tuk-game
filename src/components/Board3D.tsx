import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { BoardSize, CellState, PlayerSymbol, SymbolSet, ThemeId, WinningLine } from '../types';
import { THEMES, SYMBOL_SETS } from '../utils/themes';
import { Piece3D } from './Piece3D';
import { soundEngine } from '../utils/audio';

interface Board3DProps {
  board: CellState[];
  boardSize: BoardSize;
  themeId: ThemeId;
  symbolSet: SymbolSet;
  currentTurn: PlayerSymbol;
  winningInfo: WinningLine | null;
  hintedCellIndex?: number | null;
  onCellClick: (index: number) => void;
  disabled: boolean;
}

export const Board3D: React.FC<Board3DProps> = ({
  board,
  boardSize,
  themeId,
  symbolSet,
  currentTurn,
  winningInfo,
  hintedCellIndex = null,
  onCellClick,
  disabled,
}) => {
  const theme = THEMES[themeId] || THEMES.wood;
  const boardRef = useRef<HTMLDivElement | null>(null);

  // 3D tilt angles
  const [tilt, setTilt] = useState({ rotateX: 12, rotateY: -8 });
  const [isHovered, setIsHovered] = useState(false);
  const [hoveredCell, setHoveredCell] = useState<number | null>(null);

  // Mouse move tilt calculation
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!boardRef.current) return;
    const rect = boardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;

    // Limit max tilt to +- 18 deg
    const rotateY = (mouseX / (rect.width / 2)) * 16;
    const rotateX = -(mouseY / (rect.height / 2)) * 16;

    setTilt({ rotateX, rotateY });
  };

  // Touch drag tilt calculation for mobile devices
  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!boardRef.current || e.touches.length === 0) return;
    const touch = e.touches[0];
    const rect = boardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const touchX = touch.clientX - centerX;
    const touchY = touch.clientY - centerY;

    const rotateY = (touchX / (rect.width / 2)) * 16;
    const rotateX = -(touchY / (rect.height / 2)) * 16;

    setTilt({ rotateX, rotateY });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setHoveredCell(null);
    setTilt({ rotateX: 12, rotateY: -8 }); // Return to standard elegant perspective angle
  };

  // Sound on hover cell
  const handleCellMouseEnter = (idx: number) => {
    if (disabled || board[idx] !== null) return;
    setHoveredCell(idx);
    soundEngine.playHover();
  };

  // Winning line coordinates for SVG strike-through
  const getLineCoordinates = () => {
    if (!winningInfo || !winningInfo.line || winningInfo.line.length === 0) return null;
    const firstIdx = winningInfo.line[0];
    const lastIdx = winningInfo.line[winningInfo.line.length - 1];

    const r1 = Math.floor(firstIdx / boardSize);
    const c1 = firstIdx % boardSize;
    const r2 = Math.floor(lastIdx / boardSize);
    const c2 = lastIdx % boardSize;

    // Percentage coordinates (cell center)
    const step = 100 / boardSize;
    const x1 = c1 * step + step / 2;
    const y1 = r1 * step + step / 2;
    const x2 = c2 * step + step / 2;
    const y2 = r2 * step + step / 2;

    return { x1, y1, x2, y2 };
  };

  const lineCoords = getLineCoordinates();

  // CSS grid column template based on size
  const gridColsClass =
    boardSize === 3
      ? 'grid-cols-3'
      : boardSize === 4
      ? 'grid-cols-4'
      : 'grid-cols-5';

  return (
    <div className="relative w-full flex flex-col items-center justify-center py-4 perspective-1000">
      {/* 3D Tilting Board Frame */}
      <motion.div
        ref={boardRef}
        onMouseMove={handleMouseMove}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleMouseLeave}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        animate={{
          rotateX: tilt.rotateX,
          rotateY: tilt.rotateY,
        }}
        transition={{ type: 'spring', stiffness: 220, damping: 20, mass: 0.5 }}
        style={{ transformStyle: 'preserve-3d' }}
        className={`relative w-full max-w-[420px] sm:max-w-[480px] aspect-square rounded-3xl p-4 sm:p-6 bg-gradient-to-br ${theme.boardBg} border-4 ${theme.boardBorder} transition-all duration-300 cursor-pointer select-none`}
      >
        {/* 3D Board Extrusion Side Shadows */}
        <div className="absolute -bottom-4 left-4 right-4 h-6 bg-black/60 blur-md rounded-full -z-20 transform translate-z-[-20px]" />

        {/* Board Surface Bevel & Grid Container */}
        <div
          className={`relative w-full h-full rounded-2xl grid ${gridColsClass} gap-3 sm:gap-4 p-2 sm:p-3 overflow-hidden transform translate-z-[10px]`}
        >
          {/* Engraved Grid Cells */}
          {board.map((cell, idx) => {
            const isWinningCell = winningInfo?.line?.includes(idx) ?? false;
            const isHinted = hintedCellIndex === idx;
            const symbolDef = SYMBOL_SETS[symbolSet] || SYMBOL_SETS.classic;
            const currentLabel = currentTurn === 'X' ? symbolDef.xLabel : symbolDef.oLabel;

            return (
              <motion.button
                key={idx}
                type="button"
                id={`cell-${idx}`}
                disabled={disabled || cell !== null}
                onClick={() => onCellClick(idx)}
                onMouseEnter={() => handleCellMouseEnter(idx)}
                onMouseLeave={() => setHoveredCell(null)}
                whileHover={{ scale: cell === null && !disabled ? 1.04 : 1 }}
                whileTap={{ scale: cell === null && !disabled ? 0.95 : 1 }}
                className={`relative w-full h-full rounded-2xl flex items-center justify-center transition-all duration-200 ${
                  theme.cellBg
                } ${theme.cellShadow} ${theme.cellHoverBg} ${
                  isHinted ? 'ring-4 ring-indigo-400 ring-offset-2 ring-offset-stone-900 animate-pulse' : ''
                } ${
                  cell === null && !disabled ? 'cursor-pointer hover:border hover:border-white/20' : 'cursor-default'
                }`}
              >
                {/* Cell Slot Inset Shadow Texture */}
                <div className="absolute inset-0 rounded-2xl bg-black/20 pointer-events-none shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)]" />

                {/* Placed 3D Piece */}
                {cell !== null && (
                  <div className="w-4/5 h-4/5 z-10">
                    <Piece3D
                      symbol={cell}
                      symbolSet={symbolSet}
                      themeId={themeId}
                      isWinningCell={isWinningCell}
                    />
                  </div>
                )}

                {/* Ghost Preview on Hover */}
                {cell === null && hoveredCell === idx && !disabled && (
                  <div className="w-4/5 h-4/5 opacity-40 filter blur-[0.5px] scale-90 transition-all pointer-events-none flex items-center justify-center text-3xl font-bold">
                    <span style={{ color: theme.accentColor }}>{currentLabel}</span>
                  </div>
                )}
              </motion.button>
            );
          })}

          {/* Winning Line Strike Animation */}
          {winningInfo && lineCoords && (
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none z-30"
              style={{ overflow: 'visible' }}
            >
              <defs>
                <filter id="glow-strike" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="4" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              <motion.line
                x1={`${lineCoords.x1}%`}
                y1={`${lineCoords.y1}%`}
                x2={`${lineCoords.x2}%`}
                y2={`${lineCoords.y2}%`}
                stroke={theme.accentColor}
                strokeWidth="12"
                strokeLinecap="round"
                filter="url(#glow-strike)"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
              />
            </svg>
          )}
        </div>
      </motion.div>

      {/* Touch / Mouse Tilt Indicator Hint */}
      <div className="mt-2 text-xs opacity-60 tracking-wider flex items-center gap-1.5 select-none">
        <span>✨ Interactive 3D Board — Move mouse / drag to tilt perspective</span>
      </div>
    </div>
  );
};
