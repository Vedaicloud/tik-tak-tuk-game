export type BoardSize = 3 | 4 | 5;

export type PlayerSymbol = 'X' | 'O';

export type SymbolSet = 'classic' | 'elemental' | 'celestial' | 'royalty' | 'cyber';

export type ThemeId = 'wood' | 'neon' | 'slate' | 'glass' | 'sketch';

export type GameMode = 'ai' | 'pvp';

export type AIDifficulty = 'easy' | 'medium' | 'hard' | 'master';

export type CellState = PlayerSymbol | null;

export interface WinningLine {
  winner: PlayerSymbol | 'draw' | null;
  line: number[] | null; // cell indices making the winning row
  direction?: 'row' | 'col' | 'diag-main' | 'diag-sub';
}

export interface Move {
  index: number;
  symbol: PlayerSymbol;
  row: number;
  col: number;
  time: number;
}

export interface PlayerConfig {
  name: string;
  symbol: PlayerSymbol;
  set: SymbolSet;
  color: string;
}

export interface GameStats {
  winsX: number;
  winsO: number;
  draws: number;
  streakX: number;
  streakO: number;
  currentStreakWinner: PlayerSymbol | null;
  totalGames: number;
}

export interface MatchHistoryItem {
  id: string;
  date: string;
  mode: GameMode;
  difficulty?: AIDifficulty;
  winner: PlayerSymbol | 'draw';
  boardSize: BoardSize;
  movesCount: number;
  durationSeconds: number;
}

export interface ThemeConfig {
  id: ThemeId;
  name: string;
  description: string;
  boardBg: string;
  boardBorder: string;
  cellBg: string;
  cellHoverBg: string;
  cellShadow: string;
  lineColor: string;
  textColor: string;
  accentColor: string;
  soundType: 'wood' | 'metal' | 'chalk' | 'synth' | 'pencil';
  fontFamily: string;
}
