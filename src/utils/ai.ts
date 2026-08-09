import { BoardSize, CellState, PlayerSymbol, WinningLine } from '../types';

/**
 * Returns winning lines for a given board size.
 * For 3x3: 3 in a row
 * For 4x4: 4 in a row
 * For 5x5: 4 in a row (or 5)
 */
export function getWinningCombinations(size: BoardSize): number[][] {
  const targetLen = size === 3 ? 3 : 4; // 3 in a row for 3x3, 4 in a row for 4x4/5x5
  const combos: number[][] = [];

  // Horizontal combinations
  for (let r = 0; r < size; r++) {
    for (let c = 0; c <= size - targetLen; c++) {
      const line: number[] = [];
      for (let k = 0; k < targetLen; k++) {
        line.push(r * size + (c + k));
      }
      combos.push(line);
    }
  }

  // Vertical combinations
  for (let c = 0; c < size; c++) {
    for (let r = 0; r <= size - targetLen; r++) {
      const line: number[] = [];
      for (let k = 0; k < targetLen; k++) {
        line.push((r + k) * size + c);
      }
      combos.push(line);
    }
  }

  // Main Diagonals (\)
  for (let r = 0; r <= size - targetLen; r++) {
    for (let c = 0; c <= size - targetLen; c++) {
      const line: number[] = [];
      for (let k = 0; k < targetLen; k++) {
        line.push((r + k) * size + (c + k));
      }
      combos.push(line);
    }
  }

  // Anti Diagonals (/)
  for (let r = 0; r <= size - targetLen; r++) {
    for (let c = targetLen - 1; c < size; c++) {
      const line: number[] = [];
      for (let k = 0; k < targetLen; k++) {
        line.push((r + k) * size + (c - k));
      }
      combos.push(line);
    }
  }

  return combos;
}

/**
 * Checks if the board has a winner or draw
 */
export function checkWinner(board: CellState[], size: BoardSize): WinningLine {
  const combinations = getWinningCombinations(size);

  for (const combo of combinations) {
    const first = board[combo[0]];
    if (first && combo.every((idx) => board[idx] === first)) {
      // Determine direction
      const diff = combo[1] - combo[0];
      let direction: 'row' | 'col' | 'diag-main' | 'diag-sub' = 'row';
      if (diff === 1) direction = 'row';
      else if (diff === size) direction = 'col';
      else if (diff === size + 1) direction = 'diag-main';
      else if (diff === size - 1) direction = 'diag-sub';

      return {
        winner: first,
        line: combo,
        direction,
      };
    }
  }

  if (board.every((cell) => cell !== null)) {
    return { winner: 'draw', line: null };
  }

  return { winner: null, line: null };
}

/**
 * Minimax AI for 3x3 (unbeatable)
 */
function minimax(
  board: CellState[],
  depth: number,
  isMaximizing: boolean,
  aiSymbol: PlayerSymbol,
  humanSymbol: PlayerSymbol,
  alpha: number,
  beta: number
): { score: number; move: number } {
  const winState = checkWinner(board, 3);
  if (winState.winner === aiSymbol) return { score: 10 - depth, move: -1 };
  if (winState.winner === humanSymbol) return { score: depth - 10, move: -1 };
  if (winState.winner === 'draw') return { score: 0, move: -1 };

  const availableMoves = board
    .map((val, idx) => (val === null ? idx : null))
    .filter((val): val is number => val !== null);

  if (availableMoves.length === 0) return { score: 0, move: -1 };

  if (isMaximizing) {
    let bestScore = -Infinity;
    let bestMove = availableMoves[0];

    for (const move of availableMoves) {
      board[move] = aiSymbol;
      const result = minimax(board, depth + 1, false, aiSymbol, humanSymbol, alpha, beta);
      board[move] = null;

      if (result.score > bestScore) {
        bestScore = result.score;
        bestMove = move;
      }
      alpha = Math.max(alpha, bestScore);
      if (beta <= alpha) break;
    }
    return { score: bestScore, move: bestMove };
  } else {
    let bestScore = Infinity;
    let bestMove = availableMoves[0];

    for (const move of availableMoves) {
      board[move] = humanSymbol;
      const result = minimax(board, depth + 1, true, aiSymbol, humanSymbol, alpha, beta);
      board[move] = null;

      if (result.score < bestScore) {
        bestScore = result.score;
        bestMove = move;
      }
      beta = Math.min(beta, bestScore);
      if (beta <= alpha) break;
    }
    return { score: bestScore, move: bestMove };
  }
}

/**
 * Evaluates board heuristically for larger boards (4x4, 5x5)
 */
function evaluateBoardHeuristic(
  board: CellState[],
  size: BoardSize,
  aiSymbol: PlayerSymbol,
  humanSymbol: PlayerSymbol
): number {
  const combos = getWinningCombinations(size);
  let score = 0;

  for (const combo of combos) {
    let aiCount = 0;
    let humanCount = 0;

    for (const idx of combo) {
      if (board[idx] === aiSymbol) aiCount++;
      if (board[idx] === humanSymbol) humanCount++;
    }

    if (aiCount > 0 && humanCount === 0) {
      score += Math.pow(10, aiCount);
    } else if (humanCount > 0 && aiCount === 0) {
      score -= Math.pow(10, humanCount);
    }
  }

  // Positional center bias
  const centerIndices =
    size === 4
      ? [5, 6, 9, 10]
      : size === 5
      ? [6, 7, 8, 11, 12, 13, 16, 17, 18]
      : [4];

  for (const cIdx of centerIndices) {
    if (board[cIdx] === aiSymbol) score += 5;
    if (board[cIdx] === humanSymbol) score -= 5;
  }

  return score;
}

/**
 * Gets best AI move depending on difficulty and board size
 */
export function getAIMove(
  board: CellState[],
  size: BoardSize,
  difficulty: 'easy' | 'medium' | 'hard' | 'master',
  aiSymbol: PlayerSymbol
): number {
  const humanSymbol: PlayerSymbol = aiSymbol === 'X' ? 'O' : 'X';
  const availableMoves = board
    .map((val, idx) => (val === null ? idx : null))
    .filter((val): val is number => val !== null);

  if (availableMoves.length === 0) return -1;

  // Easy: Mostly random, 30% smart
  if (difficulty === 'easy' && Math.random() < 0.7) {
    return availableMoves[Math.floor(Math.random() * availableMoves.length)];
  }

  // Check 1-step immediate win
  for (const move of availableMoves) {
    board[move] = aiSymbol;
    if (checkWinner(board, size).winner === aiSymbol) {
      board[move] = null;
      return move;
    }
    board[move] = null;
  }

  // Block opponent's immediate win
  for (const move of availableMoves) {
    board[move] = humanSymbol;
    if (checkWinner(board, size).winner === humanSymbol) {
      board[move] = null;
      return move;
    }
    board[move] = null;
  }

  // Medium: 50% optimal move, 50% random
  if (difficulty === 'medium' && Math.random() < 0.5) {
    return availableMoves[Math.floor(Math.random() * availableMoves.length)];
  }

  // For 3x3 Unbeatable / Master
  if (size === 3) {
    // If center is available on first move, grab center
    if (board[4] === null && (difficulty === 'hard' || difficulty === 'master')) {
      return 4;
    }
    const result = minimax(board, 0, true, aiSymbol, humanSymbol, -Infinity, Infinity);
    if (result.move !== -1 && board[result.move] === null) {
      return result.move;
    }
  }

  // For 4x4 or 5x5: Heuristic position scoring with tie breaking
  let bestScore = -Infinity;
  let bestMoves: number[] = [availableMoves[0]];

  for (const move of availableMoves) {
    board[move] = aiSymbol;
    const score = evaluateBoardHeuristic(board, size, aiSymbol, humanSymbol);
    board[move] = null;

    if (score > bestScore) {
      bestScore = score;
      bestMoves = [move];
    } else if (score === bestScore) {
      bestMoves.push(move);
    }
  }

  return bestMoves[Math.floor(Math.random() * bestMoves.length)];
}

/**
 * Provides a hint for human player
 */
export function getHintMove(board: CellState[], size: BoardSize, currentSymbol: PlayerSymbol): number {
  return getAIMove(board, size, 'master', currentSymbol);
}
