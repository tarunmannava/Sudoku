const SIZE = 9, SUB = 3;

function valid(board, row, col, num) {
  // Row
  for (let c = 0; c < SIZE; c++) {
    if (board[row][c] === num) return false;
  }
  // Col
  for (let r = 0; r < SIZE; r++) {
    if (board[r][col] === num) return false;
  }
  // 3×3 block
  const br = row - (row % SUB);
  const bc = col - (col % SUB);
  for (let r = 0; r < SUB; r++) {
    for (let c = 0; c < SUB; c++) {
      if (board[br + r][bc + c] === num) return false;
    }
  }
  return true;
}

module.exports = { valid };