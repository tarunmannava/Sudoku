
const { blankBoard } = require('./src/board');
const { valid } = require('./src/validate');

const b = blankBoard();
b[0][1] = 5;
console.log(valid(b, 0, 2, 5)); // false (row clash)
console.log(valid(b, 1, 1, 5)); // false (col clash)
console.log(valid(b, 1, 2, 5)); // false (block clash)
console.log(valid(b, 4, 4, 5)); // true  (no clash)
