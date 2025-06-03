const { valid } = require('./validate');

function findEmpty(board) {
  for (let r = 0; r < 9; r++)
    for (let c = 0; c < 9; c++)
      if (board[r][c] === 0) return [r, c];
  return null;
}

function solve(board) {
  const spot = findEmpty(board);
  if (!spot) return true;           // solved

  const [row, col] = spot;
  for (let num = 1; num <= 9; num++) {
    if (valid(board, row, col, num)) {
      board[row][col] = num;
      if (solve(board)) return true;
      board[row][col] = 0;          // backtrack
    }
  }
  return false;                     // trigger back‑track
}

module.exports = { solve };
