"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";

const COLS = 10;
const ROWS = 20;
const CELL = 40; // Reduced slightly to prevent cutting off
const CW = COLS * CELL;
const CH = ROWS * CELL;

type PK = "I" | "O" | "T" | "S" | "Z" | "J" | "L";
const SHAPES: Record<PK, number[][]> = {
  I: [[0,0,0,0],[1,1,1,1],[0,0,0,0],[0,0,0,0]],
  O: [[2,2],[2,2]],
  T: [[0,3,0],[3,3,3],[0,0,0]],
  S: [[0,4,4],[4,4,0],[0,0,0]],
  Z: [[5,5,0],[0,5,5],[0,0,0]],
  J: [[6,0,0],[6,6,6],[0,0,0]],
  L: [[0,0,7],[7,7,7],[0,0,0]],
};

const COLORS = ["transparent","#00d8d8","#d8d800","#9000d8","#00d800","#d80000","#0000d8","#d89000"];

function emptyGrid(): number[][] {
  return Array.from({ length: ROWS }, () => Array(COLS).fill(0));
}

function randomPiece() {
  const keys = Object.keys(SHAPES) as PK[];
  const pk = keys[Math.floor(Math.random() * keys.length)];
  const s = SHAPES[pk];
  return { shape: s, x: Math.floor(COLS / 2) - Math.floor(s[0].length / 2), y: 0 };
}

export default function TetrisPanel() {
  const ref = useRef<HTMLCanvasElement>(null);
  const nextRef = useRef<HTMLCanvasElement>(null);

  const gridRef = useRef(emptyGrid());
  const pieceRef = useRef(randomPiece());
  const nextPieceRef = useRef(randomPiece());

  const [score, setScore] = useState(0);
  const [over, setOver] = useState(false);
  const [started, setStarted] = useState(false);

  const overRef = useRef(false);
  const startedRef = useRef(false);

  const frameId = useRef(0);
  const dropCounter = useRef(0);
  const lastTime = useRef(0);
  const scoreRef = useRef(0);

  const collides = (s: number[][], px: number, py: number, g: number[][]) => {
    for (let r = 0; r < s.length; r++)
      for (let c = 0; c < s[r].length; c++)
        if (s[r][c] !== 0) {
          const nx = px + c, ny = py + r;
          if (nx < 0 || nx >= COLS || ny >= ROWS || (ny >= 0 && g[ny][nx] !== 0)) return true;
        }
    return false;
  };

  const merge = (s: number[][], px: number, py: number, g: number[][]) => {
    const ng = g.map(r => [...r]);
    s.forEach((row, r) => row.forEach((v, c) => {
      if (v && py + r >= 0 && py + r < ROWS && px + c >= 0 && px + c < COLS)
        ng[py + r][px + c] = v;
    }));
    return ng;
  };

  const clearRows = (g: number[][]) => {
    let cleared = 0;
    const ng = g.filter(row => {
      if (row.every(c => c !== 0)) { cleared++; return false; }
      return true;
    });
    while (ng.length < ROWS) ng.unshift(Array(COLS).fill(0));
    if (cleared > 0) {
      scoreRef.current += cleared * 100;
      setScore(scoreRef.current);
    }
    return ng;
  };

  const drawNext = useCallback(() => {
    const ctx = nextRef.current?.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, 140, 140);
    const p = nextPieceRef.current;
    
    const offset = (4 - p.shape.length) / 2;
    
    p.shape.forEach((row, r) => row.forEach((v, c) => {
      if (v) { 
        const dx = (c + offset) * 28;
        const dy = (r + offset) * 28;
        ctx.fillStyle = COLORS[v]; 
        ctx.fillRect(dx + 14, dy + 14, 26, 26); 
        ctx.fillStyle = "rgba(255,255,255,0.4)"; 
        ctx.fillRect(dx + 14, dy + 14, 26, 5); 
      }
    }));
  }, []);

  const draw = useCallback(() => {
    const ctx = ref.current?.getContext("2d");
    if (!ctx) return;
    const g = gridRef.current;
    const p = pieceRef.current;
    
    // Clear background
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, CW, CH);
    
    // Draw Grid Lines visibly
    ctx.strokeStyle = "#f0f0f0";
    ctx.lineWidth = 1;
    for (let r = 0; r <= ROWS; r++) {
      ctx.beginPath();
      ctx.moveTo(0, r * CELL);
      ctx.lineTo(CW, r * CELL);
      ctx.stroke();
    }
    for (let c = 0; c <= COLS; c++) {
      ctx.beginPath();
      ctx.moveTo(c * CELL, 0);
      ctx.lineTo(c * CELL, CH);
      ctx.stroke();
    }

    // Placed blocks
    g.forEach((row, y) => row.forEach((v, x) => {
      if (v) { 
        ctx.fillStyle = COLORS[v]; 
        ctx.fillRect(x * CELL + 1, y * CELL + 1, CELL - 2, CELL - 2); 
        ctx.fillStyle = "rgba(255,255,255,0.3)"; 
        ctx.fillRect(x * CELL + 1, y * CELL + 1, CELL - 2, Math.floor(CELL / 5)); 
      }
    }));

    // Active piece
    if (startedRef.current && !overRef.current) {
      p.shape.forEach((row, r) => row.forEach((v, c) => {
        if (v) { 
          const dx = (p.x + c) * CELL, dy = (p.y + r) * CELL; 
          ctx.fillStyle = COLORS[v]; 
          ctx.fillRect(dx + 1, dy + 1, CELL - 2, CELL - 2); 
          ctx.fillStyle = "rgba(255,255,255,0.3)"; 
          ctx.fillRect(dx + 1, dy + 1, CELL - 2, Math.floor(CELL / 5)); 
        }
      }));
    }

    drawNext();
  }, [drawNext]);

  const movePiece = useCallback((dx: number, dy: number) => {
    if (!startedRef.current || overRef.current) return;
    const p = pieceRef.current, g = gridRef.current;
    if (collides(p.shape, p.x + dx, p.y + dy, g)) {
      if (dy > 0) {
        const merged = merge(p.shape, p.x, p.y, g);
        gridRef.current = clearRows(merged);
        pieceRef.current = nextPieceRef.current;
        nextPieceRef.current = randomPiece();
        
        if (collides(pieceRef.current.shape, pieceRef.current.x, pieceRef.current.y, gridRef.current)) {
          overRef.current = true;
          setOver(true);
        }
      }
    } else {
      pieceRef.current = { ...p, x: p.x + dx, y: p.y + dy };
    }
  }, []);

  const rotatePiece = useCallback(() => {
    if (!startedRef.current || overRef.current) return;
    const p = pieceRef.current;
    const rot = p.shape[0].map((_, i) => p.shape.map(r => r[i]).reverse());
    if (!collides(rot, p.x, p.y, gridRef.current))
      pieceRef.current = { ...p, shape: rot };
  }, []);

  useEffect(() => {
    const loop = (t: number) => {
      if (overRef.current) { draw(); return; }
      if (startedRef.current) {
        const dt = t - lastTime.current;
        lastTime.current = t;
        dropCounter.current += dt;
        if (dropCounter.current > 700) { movePiece(0, 1); dropCounter.current = 0; }
      }
      draw();
      frameId.current = requestAnimationFrame(loop);
    };
    lastTime.current = performance.now();
    frameId.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frameId.current);
  }, [draw, movePiece]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (overRef.current || !startedRef.current) return;
      if (e.key === "ArrowLeft") movePiece(-1, 0);
      else if (e.key === "ArrowRight") movePiece(1, 0);
      else if (e.key === "ArrowDown") movePiece(0, 1);
      else if (e.key === "ArrowUp") rotatePiece();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [movePiece, rotatePiece]);

  const startGame = () => {
    startedRef.current = true;
    setStarted(true);
    lastTime.current = performance.now();
  };

  const reset = () => {
    gridRef.current = emptyGrid();
    pieceRef.current = randomPiece();
    nextPieceRef.current = randomPiece();
    scoreRef.current = 0;
    setScore(0);
    overRef.current = false;
    setOver(false);
    startedRef.current = true;
    setStarted(true);
    lastTime.current = performance.now();
  };

  return (
    <div className="relative w-full h-full overflow-hidden flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Animated subtle background blobs for visual flair */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary/10 rounded-full blur-[100px] animate-[spin_10s_linear_infinite]" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px] animate-[spin_15s_linear_infinite_reverse]" />
      
      {/* Floating Header */}
      <div className="absolute top-8 left-10 z-20 pointer-events-none animate-[fadeSlideUp_0.8s_ease]">
        <Link href="/" className="flex items-center gap-3 pointer-events-auto group">
          <div className="w-12 h-12 bg-black rounded-2xl flex items-center justify-center shadow-lg border border-white/20 group-hover:scale-105 transition-transform">
            <span className="text-white font-serif font-bold text-2xl">D</span>
          </div>
          <span className="font-serif font-black text-3xl tracking-tighter text-black drop-shadow-sm">
            DRONA<sup className="text-[0.5em] text-primary font-sans tracking-normal ml-0.5">AI</sup>
          </span>
        </Link>
      </div>

      {/* Floating Score */}
      <div className="absolute top-8 right-10 z-20 flex flex-col items-end pointer-events-none animate-[fadeSlideUp_1s_ease]">
        <span className="text-[12px] font-bold uppercase tracking-[.2em] text-gray-500">Score</span>
        <span className="text-4xl font-black text-black tabular-nums drop-shadow-sm">{score}</span>
      </div>

      {/* Main Container: Game on left, Controls on right */}
      <div className="relative z-10 flex flex-row items-center gap-10 xl:gap-20">
        {/* Main Game Canvas */}
        <div className="relative animate-[fadeSlideUp_0.6s_ease]">
          <canvas 
            ref={ref} 
            width={CW} 
            height={CH} 
            className="bg-white border-4 border-gray-200 rounded-xl shadow-2xl transition-all duration-500" 
            style={{ maxHeight: "calc(100vh - 160px)", width: "auto" }} 
          />
          
          {/* Start / Game Over Overlays */}
          {!started && !over && (
            <div className="absolute inset-0 bg-white/70 flex flex-col items-center justify-center backdrop-blur-sm z-30 rounded-xl">
              <button onClick={startGame} className="px-10 py-4 bg-black text-white rounded-2xl text-xl font-black tracking-widest shadow-2xl hover:scale-110 hover:shadow-[0_10px_40px_rgba(0,0,0,0.3)] transition-all cursor-pointer">
                START
              </button>
            </div>
          )}

          {over && (
            <div className="absolute inset-0 bg-white/80 flex flex-col items-center justify-center backdrop-blur-md z-30 rounded-xl">
              <span className="text-black font-black text-4xl tracking-widest mb-2">GAME OVER</span>
              <span className="text-gray-600 font-bold mb-8 font-mono uppercase tracking-widest text-lg">Score: {score}</span>
              <button onClick={reset} className="px-10 py-4 bg-primary text-white rounded-2xl text-lg font-bold shadow-xl hover:scale-110 hover:shadow-[0_10px_40px_rgba(0,0,0,0.2)] transition-all cursor-pointer">
                Retry
              </button>
            </div>
          )}
        </div>
        
        {/* Right side controls panel */}
        <div className="flex flex-col items-center gap-12 bg-white/70 p-10 rounded-[2rem] shadow-2xl backdrop-blur-xl border border-white animate-[fadeSlideUp_0.8s_ease]">
          {/* Next Block */}
          <div className="flex flex-col items-center group">
            <span className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-4 transition-colors group-hover:text-black">Next Piece</span>
            <div className="w-36 h-36 bg-white rounded-3xl shadow-inner flex items-center justify-center border-4 border-gray-50 group-hover:border-primary/20 transition-all duration-300">
              <canvas ref={nextRef} width={140} height={140} className="w-full h-full object-contain" />
            </div>
          </div>
          
          {/* Arrow Controls */}
          <div className="flex flex-col items-center gap-3">
            <button onClick={rotatePiece} className="w-14 h-12 bg-white text-gray-700 rounded-xl font-bold text-xl shadow-md hover:bg-black hover:text-white hover:-translate-y-1 hover:shadow-xl active:translate-y-0 active:scale-95 transition-all border border-gray-100">↑</button>
            <div className="flex gap-3">
              <button onClick={() => movePiece(-1, 0)} className="w-14 h-12 bg-white text-gray-700 rounded-xl font-bold text-xl shadow-md hover:bg-black hover:text-white hover:-translate-y-1 hover:shadow-xl active:translate-y-0 active:scale-95 transition-all border border-gray-100">←</button>
              <button onClick={() => movePiece(0, 1)} className="w-14 h-12 bg-white text-gray-700 rounded-xl font-bold text-xl shadow-md hover:bg-black hover:text-white hover:-translate-y-1 hover:shadow-xl active:translate-y-0 active:scale-95 transition-all border border-gray-100">↓</button>
              <button onClick={() => movePiece(1, 0)} className="w-14 h-12 bg-white text-gray-700 rounded-xl font-bold text-xl shadow-md hover:bg-black hover:text-white hover:-translate-y-1 hover:shadow-xl active:translate-y-0 active:scale-95 transition-all border border-gray-100">→</button>
            </div>
          </div>

          {/* Fallback Restart */}
          {started && (
            <button onClick={reset} className="mt-4 px-6 py-2 border-2 border-gray-300 text-gray-600 rounded-full text-sm font-bold hover:bg-gray-100 transition-colors">
              Restart Game
            </button>
          )}
        </div>
      </div>
      
    </div>
  );
}