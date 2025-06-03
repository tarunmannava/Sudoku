/* ── src/generate.js ─────────────────────────────────────────── */
const { blankBoard } = require('./board');
const { valid }      = require('./validate');

/* ---------- helper: Fisher‑Yates shuffle --------------------- */
function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/* ---------- variant of solver that stops after N solutions --- */
function countSolutions(board, limit = 2) {
  // we mutate, so deep‑copy once at entry point
  const work = board.map(r => [...r]);
  let found = 0;

  function dfs() {
    if (found >= limit) return;                  // early exit
    // find first empty
    let row = -1, col = -1;
    outer: for (let r = 0; r < 9; r++)
      for (let c = 0; c < 9; c++)
        if (work[r][c] === 0) { row = r; col = c; break outer; }

    if (row === -1) {                            // solved
      found++;
      return;
    }

    for (const n of shuffle([1,2,3,4,5,6,7,8,9])) {
      if (valid(work, row, col, n)) {
        work[row][col] = n;
        dfs();
        work[row][col] = 0;                      // back‑track
      }
    }
  }

  dfs();
  return found;          // 0 (unsolvable), 1 (unique), 2+ (multiple)
}

/* ---------- generate a full board ---------------------------- */
function generateFullBoard() {
  const board = blankBoard();

  function fill(idx = 0) {
    if (idx === 81) return true;                 // done
    const row = Math.floor(idx / 9);
    const col = idx % 9;

    if (board[row][col] !== 0) return fill(idx + 1);

    for (const n of shuffle([1,2,3,4,5,6,7,8,9])) {
      if (valid(board, row, col, n)) {
        board[row][col] = n;
        if (fill(idx + 1)) return true;
        board[row][col] = 0;
      }
    }
    return false;                               // trigger back‑track
  }

  fill();
  return board;
}

/* ---------- public: generate puzzle + solution ---------------- */
function generate(clues = 30) {
  if (clues < 17 || clues > 81) throw new Error('clues must be 17‑81');

  const solution = generateFullBoard();
  const puzzle   = solution.map(r => [...r]);   // shallow copy rows

  // build a shuffled list of 81 cell coordinates
  const coords = shuffle(
    Array.from({ length: 81 }, (_, i) => [Math.floor(i / 9), i % 9])
  );

  let removed = 0;
  for (const [r, c] of coords) {
    if (81 - removed <= clues) break;           // stop when enough clues left
    const backup = puzzle[r][c];
    puzzle[r][c] = 0;

    // ensure puzzle still has unique solution
    const solCount = countSolutions(puzzle, 2); // 0,1,2+
    if (solCount !== 1) {
      puzzle[r][c] = backup;                    // undo – uniqueness lost
    } else {
      removed++;
    }
  }
  return { puzzle, solution };
}

module.exports = { generate, countSolutions };
