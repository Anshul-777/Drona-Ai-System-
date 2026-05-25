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
  const bgRef = useRef<HTMLCanvasElement>(null);

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

  // Background Particles
  useEffect(() => {
    const canvas = bgRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = canvas.width = canvas.offsetWidth;
    let h = canvas.height = canvas.offsetHeight;
    
    const particles: {x: number, y: number, vx: number, vy: number, r: number, color: string}[] = [];
    const colors = ["rgba(42, 92, 255, 0.6)", "rgba(124, 58, 237, 0.6)", "rgba(16, 185, 129, 0.6)", "rgba(236, 72, 153, 0.6)"];
    
    for (let i = 0; i < 50; i++) {
      particles.push({
        x: Math.random() * w, y: Math.random() * h,
        vx: (Math.random() - 0.5) * 1.5, vy: (Math.random() - 0.5) * 1.5,
        r: Math.random() * 2 + 1,
        color: colors[Math.floor(Math.random() * colors.length)]
      });
    }

    let frameId: number;
    const drawBg = () => {
      ctx.clearRect(0, 0, w, h);
      
      const grad = ctx.createRadialGradient(w/2, h/2, 0, w/2, h/2, w*0.8);
      grad.addColorStop(0, "rgba(42, 92, 255, 0.08)");
      grad.addColorStop(1, "rgba(255, 255, 255, 0)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
          if (dist < 150) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(124, 58, 237, ${0.2 - (dist / 150) * 0.2})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }
      frameId = requestAnimationFrame(drawBg);
    };
    drawBg();

    const resize = () => { w = canvas.width = canvas.offsetWidth; h = canvas.height = canvas.offsetHeight; };
    window.addEventListener("resize", resize);
    return () => { cancelAnimationFrame(frameId); window.removeEventListener("resize", resize); };
  }, []);

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
    <div className="relative w-full h-full overflow-hidden flex flex-col items-center justify-center bg-gradient-to-br from-[#f8fafc] to-[#e2e8f0]">
      {/* Interactive Particle Background */}
      <canvas ref={bgRef} className="absolute inset-0 w-full h-full z-0" />
      
      {/* Animated subtle background blobs for visual flair */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary/20 rounded-full blur-[120px] animate-[spin_10s_linear_infinite]" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/20 rounded-full blur-[120px] animate-[spin_15s_linear_infinite_reverse]" />
      
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

      {/* Main Arcade Console Container */}
      <div className="relative z-10 mt-16 flex flex-row items-stretch bg-white/40 backdrop-blur-2xl rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] border border-white/70 p-6 xl:p-10 gap-8 xl:gap-14 h-[85vh] max-h-[800px] animate-[fadeSlideUp_0.6s_ease]">
        
        {/* Main Game Canvas */}
        <div className="relative h-full aspect-[1/2] rounded-2xl overflow-hidden shadow-2xl border-4 border-white/80 bg-white/50">
          <canvas 
            ref={ref} 
            width={CW} 
            height={CH} 
            className="w-full h-full block"
          />
          
          {/* Start / Game Over Overlays */}
          {!started && !over && (
            <div className="absolute inset-0 bg-white/70 flex flex-col items-center justify-center backdrop-blur-sm z-30">
              <button onClick={startGame} className="px-10 py-4 bg-black text-white rounded-2xl text-xl font-black tracking-widest shadow-2xl hover:scale-110 hover:shadow-[0_10px_40px_rgba(0,0,0,0.3)] transition-all cursor-pointer">
                START
              </button>
            </div>
          )}

          {over && (
            <div className="absolute inset-0 bg-white/80 flex flex-col items-center justify-center backdrop-blur-md z-30">
              <span className="text-black font-black text-4xl tracking-widest mb-2 text-center">GAME<br/>OVER</span>
              <span className="text-gray-600 font-bold mb-8 font-mono uppercase tracking-widest text-lg">Score: {score}</span>
              <button onClick={reset} className="px-10 py-4 bg-primary text-white rounded-2xl text-lg font-bold shadow-xl hover:scale-110 hover:shadow-[0_10px_40px_rgba(0,0,0,0.2)] transition-all cursor-pointer">
                Retry
              </button>
            </div>
          )}
        </div>
        
        {/* Right side controls panel (Integrated) */}
        <div className="flex flex-col items-center justify-between py-6 w-40 xl:w-48">
          {/* Next Block */}
          <div className="flex flex-col items-center group w-full">
            <span className="text-sm font-bold uppercase tracking-widest text-gray-600 mb-4 transition-colors group-hover:text-black">Next Piece</span>
            <div className="w-full aspect-square bg-white/80 rounded-3xl shadow-inner flex items-center justify-center border-4 border-white group-hover:border-primary/30 transition-all duration-300">
              <canvas ref={nextRef} width={140} height={140} className="w-[80%] h-[80%] object-contain" />
            </div>
          </div>
          
          {/* Arrow Controls */}
          <div className="flex flex-col items-center gap-3 w-full">
            <button onClick={rotatePiece} className="w-full h-14 bg-white/80 text-gray-700 rounded-2xl shadow-md hover:bg-black hover:text-white hover:-translate-y-1 hover:shadow-xl active:translate-y-0 active:scale-95 transition-all border border-white flex items-center justify-center">
              <span className="material-symbols-outlined text-[28px] font-bold">rotate_right</span>
            </button>
            <div className="flex gap-3 w-full">
              <button onClick={() => movePiece(-1, 0)} className="flex-1 h-14 bg-white/80 text-gray-700 rounded-2xl font-bold text-2xl shadow-md hover:bg-black hover:text-white hover:-translate-y-1 hover:shadow-xl active:translate-y-0 active:scale-95 transition-all border border-white">←</button>
              <button onClick={() => movePiece(0, 1)} className="flex-1 h-14 bg-white/80 text-gray-700 rounded-2xl font-bold text-2xl shadow-md hover:bg-black hover:text-white hover:-translate-y-1 hover:shadow-xl active:translate-y-0 active:scale-95 transition-all border border-white">↓</button>
              <button onClick={() => movePiece(1, 0)} className="flex-1 h-14 bg-white/80 text-gray-700 rounded-2xl font-bold text-2xl shadow-md hover:bg-black hover:text-white hover:-translate-y-1 hover:shadow-xl active:translate-y-0 active:scale-95 transition-all border border-white">→</button>
            </div>
          </div>

          {/* Fallback Restart */}
          {started && (
            <button onClick={reset} className="w-full py-4 border-2 border-gray-400/30 bg-white/30 text-gray-700 rounded-2xl text-sm font-bold hover:bg-black hover:text-white hover:border-black transition-all shadow-sm">
              Restart Game
            </button>
          )}
        </div>
      </div>
      
    </div>
  );
}