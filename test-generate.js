const { printBoard } = require('./src/board');
const { generate }   = require('./src/generate');

const { puzzle, solution } = generate(30);

console.log('Puzzle (30 clues):');
printBoard(puzzle);

console.log('\nSolution:');
printBoard(solution);
