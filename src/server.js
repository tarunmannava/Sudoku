/* ------------------------------------------------------------------
   Minimal Sudoku API
------------------------------------------------------------------- */
const path    = require('path');
const express = require('express');
const cors    = require('cors');

const { generate } = require('./generate');
const { valid }    = require('./validate');

const app  = express();
const PORT = 3000;

/* ─── Middleware ──────────────────────────────────────────────── */
app.use(cors());
app.use(express.json());                       // parse application/json

/* ─── Serve front‑end from /static ------------------------------ */
app.use(express.static(path.join(__dirname, '../static')));

/* ─── In‑memory game state (single‑player toy) ------------------ */
let GAME = generate(30);   // { puzzle, solution }

/* ─── Routes ---------------------------------------------------- */

/* 1. Get a brand‑new puzzle
      GET /new?clues=30    → { board:[[]] }
*/
app.get('/new', (req, res) => {
  const clues = Number(req.query.clues) || 30;
  GAME = generate(clues);
  res.json({ board: GAME.puzzle });
});

/* 2. Validate *one* move
      POST /validate  { row,col,num,board }  → { ok:bool }
*/
app.post('/validate', (req, res) => {
  const { row, col, num, board } = req.body;

  // don’t allow editing fixed clues
  if (GAME.puzzle[row][col] !== 0) {
    return res.status(400).json({ ok:false, reason:'fixed clue' });
  }

  res.json({ ok: valid(board, row, col, num) });
});

/* 3. Check if the whole board is correct
      POST /check  { board }  → { solved:bool }
*/
app.post('/check', (req, res) => {
  const solved = JSON.stringify(req.body.board) ===
                 JSON.stringify(GAME.solution);
  res.json({ solved });
});

/* 4. Reveal full solution (cheat button)
      GET /solve → { solution:[[]] }
*/
app.get('/solve', (_req, res) => res.json({ solution: GAME.solution }));

/* ─── Start server --------------------------------------------- */
app.listen(PORT, () =>
  console.log(`✔ Sudoku API + static site → http://localhost:${PORT}`)
);
