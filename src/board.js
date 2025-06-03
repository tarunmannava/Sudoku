
const SIZE = 9;


function blankBoard() {
  return Array.from({ length: SIZE }, () => Array(SIZE).fill(0));
}

/** Pretty‑print to console (for quick debugging) */
function printBoard(board) {
  board.forEach((row, r) => {
    const line = row
      .map((n, c) => (n === 0 ? '.' : n) + ((c % 3 === 2 && c !== 8) ? ' │ ' : ' '))
      .join('');
    console.log(line.trim());
    if (r % 3 === 2 && r !== 8) console.log('------+-------+------');
  });
}

module.exports = { blankBoard, printBoard };
