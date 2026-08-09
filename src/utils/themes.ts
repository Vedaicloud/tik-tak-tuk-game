import { SymbolSet, ThemeConfig, ThemeId } from '../types';

export const THEMES: Record<ThemeId, ThemeConfig> = {
  wood: {
    id: 'wood',
    name: 'Mahogany Wood',
    description: 'Polished carved mahogany table with brass & dark chrome metallic pieces.',
    boardBg: 'from-amber-950 via-stone-900 to-amber-950',
    boardBorder: 'border-amber-800/60 shadow-[inset_0_2px_10px_rgba(0,0,0,0.8),0_20px_40px_rgba(0,0,0,0.6)]',
    cellBg: 'bg-gradient-to-b from-amber-900/40 to-stone-950/80',
    cellHoverBg: 'hover:bg-amber-800/30',
    cellShadow: 'shadow-[inset_2px_2px_6px_rgba(0,0,0,0.8),1px_1px_2px_rgba(255,255,255,0.05)]',
    lineColor: '#b45309', // amber-700
    textColor: 'text-amber-100',
    accentColor: '#f59e0b',
    soundType: 'wood',
    fontFamily: 'serif',
  },
  neon: {
    id: 'neon',
    name: 'Cyber Arcade',
    description: 'Electric synthwave neon glow board with acrylic illuminated tiles.',
    boardBg: 'from-slate-950 via-purple-950 to-slate-950',
    boardBorder: 'border-cyan-500/40 shadow-[0_0_30px_rgba(6,182,212,0.3),inset_0_0_15px_rgba(217,70,239,0.2)]',
    cellBg: 'bg-slate-900/80',
    cellHoverBg: 'hover:bg-cyan-950/60 hover:border-cyan-400/50',
    cellShadow: 'shadow-[inset_0_0_10px_rgba(0,0,0,0.9),0_0_8px_rgba(6,182,212,0.15)]',
    lineColor: '#06b6d4', // cyan-500
    textColor: 'text-cyan-100',
    accentColor: '#d946ef',
    soundType: 'synth',
    fontFamily: 'sans-serif',
  },
  slate: {
    id: 'slate',
    name: 'Slate Chalkboard',
    description: 'Authentic stone slate board with chalk strokes and powdery dust.',
    boardBg: 'from-stone-900 via-neutral-900 to-stone-950',
    boardBorder: 'border-stone-700/50 shadow-[inset_0_0_20px_rgba(0,0,0,0.9),0_15px_30px_rgba(0,0,0,0.7)]',
    cellBg: 'bg-stone-950/60',
    cellHoverBg: 'hover:bg-stone-800/40',
    cellShadow: 'shadow-[inset_2px_2px_8px_rgba(0,0,0,0.8)]',
    lineColor: '#e7e5e4', // stone-200
    textColor: 'text-stone-200',
    accentColor: '#fbbf24',
    soundType: 'chalk',
    fontFamily: 'sans-serif',
  },
  glass: {
    id: 'glass',
    name: 'Frosted Glass',
    description: 'Modern translucent glass slab over dynamic ambient gradient light.',
    boardBg: 'from-sky-950/70 via-indigo-950/70 to-slate-950/70',
    boardBorder: 'border-white/20 backdrop-blur-md shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.3)]',
    cellBg: 'bg-white/5 backdrop-blur-sm',
    cellHoverBg: 'hover:bg-white/10',
    cellShadow: 'shadow-[inset_0_1px_1px_rgba(255,255,255,0.15),0_4px_12px_rgba(0,0,0,0.2)]',
    lineColor: '#38bdf8', // sky-400
    textColor: 'text-sky-100',
    accentColor: '#818cf8',
    soundType: 'metal',
    fontFamily: 'sans-serif',
  },
  sketch: {
    id: 'sketch',
    name: 'Notebook Pencil',
    description: 'Cream sketchbook paper with graphite pencil shading and doodles.',
    boardBg: 'from-amber-50 via-orange-50/80 to-amber-100/90',
    boardBorder: 'border-stone-400/40 shadow-[0_10px_25px_rgba(0,0,0,0.15),inset_0_0_10px_rgba(0,0,0,0.05)]',
    cellBg: 'bg-amber-100/30',
    cellHoverBg: 'hover:bg-amber-200/40',
    cellShadow: 'shadow-[inset_1px_1px_3px_rgba(0,0,0,0.1)]',
    lineColor: '#44403c', // stone-700
    textColor: 'text-stone-800',
    accentColor: '#ea580c',
    soundType: 'pencil',
    fontFamily: 'sans-serif',
  },
};

export interface SymbolDefinition {
  id: SymbolSet;
  name: string;
  xLabel: string;
  oLabel: string;
  xIcon?: string;
  oIcon?: string;
  xColor: string;
  oColor: string;
  xGlow: string;
  oGlow: string;
}

export const SYMBOL_SETS: Record<SymbolSet, SymbolDefinition> = {
  classic: {
    id: 'classic',
    name: 'Classic X & O',
    xLabel: 'X',
    oLabel: 'O',
    xColor: 'from-amber-400 via-yellow-500 to-amber-600',
    oColor: 'from-cyan-400 via-sky-500 to-blue-600',
    xGlow: 'drop-shadow-[0_0_12px_rgba(245,158,11,0.6)]',
    oGlow: 'drop-shadow-[0_0_12px_rgba(14,165,233,0.6)]',
  },
  elemental: {
    id: 'elemental',
    name: 'Fire & Water',
    xLabel: '🔥',
    oLabel: '💧',
    xColor: 'from-red-500 to-orange-500',
    oColor: 'from-blue-400 to-cyan-500',
    xGlow: 'drop-shadow-[0_0_12px_rgba(239,68,68,0.7)]',
    oGlow: 'drop-shadow-[0_0_12px_rgba(6,182,212,0.7)]',
  },
  celestial: {
    id: 'celestial',
    name: 'Sun & Moon',
    xLabel: '☀️',
    oLabel: '🌙',
    xColor: 'from-yellow-300 to-amber-500',
    oColor: 'from-indigo-300 to-purple-400',
    xGlow: 'drop-shadow-[0_0_12px_rgba(253,224,71,0.8)]',
    oGlow: 'drop-shadow-[0_0_12px_rgba(165,180,252,0.8)]',
  },
  royalty: {
    id: 'royalty',
    name: 'Crown & Gem',
    xLabel: '👑',
    oLabel: '💎',
    xColor: 'from-amber-300 to-yellow-600',
    oColor: 'from-emerald-400 to-teal-500',
    xGlow: 'drop-shadow-[0_0_12px_rgba(217,119,6,0.7)]',
    oGlow: 'drop-shadow-[0_0_12px_rgba(16,185,129,0.7)]',
  },
  cyber: {
    id: 'cyber',
    name: 'Bolt & Shield',
    xLabel: '⚡',
    oLabel: '🛡️',
    xColor: 'from-fuchsia-500 to-pink-500',
    oColor: 'from-cyan-400 to-teal-400',
    xGlow: 'drop-shadow-[0_0_12px_rgba(217,70,239,0.8)]',
    oGlow: 'drop-shadow-[0_0_12px_rgba(45,212,191,0.8)]',
  },
};
