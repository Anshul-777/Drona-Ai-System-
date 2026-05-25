"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";

const W = 1200;
const H = 800;
const BIRD_X = 400; // Moved further inwards to prevent edge cropping
const BIRD_R = 14;

// Gentle physics
const GRAVITY    = 0.15;
const FLAP_VEL   = -3.8;
const SPEED      = 2.8; // Increased speed further
const PIPE_W     = 52;
const GAP        = 170;
const PIPE_SPACE = 220;

interface Pipe { x: number; topH: number; scored: boolean; }

export default function FlappyPanel() {
  const ref = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [over, setOver] = useState(false);
  const [started, setStarted] = useState(false);

  const stateRef = useRef({
    birdY: H / 2,
    vel: 0,
    pipes: [] as Pipe[],
    score: 0,
    over: false,
    started: false,
    frame: 0,
  });
  const frameId = useRef(0);

  const spawnPipe = (): Pipe => {
    const s = stateRef.current;
    const lastX = s.pipes.length ? s.pipes[s.pipes.length - 1].x : W;
    const topH = 60 + Math.random() * (H - GAP - 120);
    return { x: Math.max(lastX + PIPE_SPACE, W + 20), topH, scored: false };
  };

  const flap = useCallback(() => {
    const s = stateRef.current;
    if (s.over) return;
    if (!s.started) {
      s.started = true;
      setStarted(true);
      s.pipes = [spawnPipe()];
    }
    s.vel = FLAP_VEL;
  }, []);

  const draw = useCallback(() => {
    const ctx = ref.current?.getContext("2d");
    if (!ctx) return;
    const s = stateRef.current;

    // Sky gradient
    const sky = ctx.createLinearGradient(0, 0, 0, H);
    sky.addColorStop(0, "#87ceeb");
    sky.addColorStop(1, "#e0f0ff");
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, W, H);

    // Ground
    ctx.fillStyle = "#8B7355";
    ctx.fillRect(0, H - 40, W, 40);
    ctx.fillStyle = "#6B8E23";
    ctx.fillRect(0, H - 44, W, 6);

    // Pipes
    for (const p of s.pipes) {
      // Top pipe
      const grad1 = ctx.createLinearGradient(p.x, 0, p.x + PIPE_W, 0);
      grad1.addColorStop(0, "#3a8c3a");
      grad1.addColorStop(0.5, "#5cbf5c");
      grad1.addColorStop(1, "#3a8c3a");
      ctx.fillStyle = grad1;
      ctx.fillRect(p.x, 0, PIPE_W, p.topH);
      ctx.fillStyle = "#2d6e2d";
      ctx.fillRect(p.x - 3, p.topH - 24, PIPE_W + 6, 24);

      // Bottom pipe
      const botY = p.topH + GAP;
      ctx.fillStyle = grad1;
      ctx.fillRect(p.x, botY, PIPE_W, H - 40 - botY);
      ctx.fillStyle = "#2d6e2d";
      ctx.fillRect(p.x - 3, botY, PIPE_W + 6, 24);
    }

    // Bird
    const bY = s.birdY;
    
    ctx.save();
    ctx.translate(BIRD_X, bY);
    // Add smooth tilt animation based on velocity
    let tilt = s.vel * 0.1;
    if (tilt > Math.PI / 4) tilt = Math.PI / 4;
    if (tilt < -Math.PI / 4) tilt = -Math.PI / 4;
    ctx.rotate(tilt);

    // Body
    ctx.fillStyle = "#FFD700";
    ctx.beginPath();
    ctx.ellipse(0, 0, BIRD_R + 2, BIRD_R, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#B8860B";
    ctx.stroke();

    // Eye
    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.arc(6, -4, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "black";
    ctx.beginPath();
    ctx.arc(8, -4, 2, 0, Math.PI * 2);
    ctx.fill();

    // Wing
    ctx.fillStyle = "#FFFACD";
    ctx.beginPath();
    ctx.ellipse(-4, 2, 7, 4, -Math.PI / 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Beak
    ctx.fillStyle = "#FF6347";
    ctx.beginPath();
    ctx.moveTo(10, 0);
    ctx.lineTo(22, 2);
    ctx.lineTo(10, 6);
    ctx.fill();
    ctx.stroke();

    ctx.restore();

    // Score
    if (s.started) {
      ctx.fillStyle = "#fff";
      ctx.strokeStyle = "#000";
      ctx.lineWidth = 3;
      ctx.font = "bold 32px sans-serif";
      ctx.textAlign = "center";
      ctx.strokeText(String(s.score), W / 2, 50);
      ctx.fillText(String(s.score), W / 2, 50);
    }

    // Idle prompt
    if (!s.started && !s.over) {
      ctx.fillStyle = "rgba(0,0,0,0.25)";
      ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = "#fff";
      ctx.font = "bold 20px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("Click or Press Space", W / 2, H / 2 - 10);
      ctx.font = "14px sans-serif";
      ctx.fillText("to start flying", W / 2, H / 2 + 16);
    }
  }, []);

  useEffect(() => {
    const loop = () => {
      const s = stateRef.current;
      if (s.over) { draw(); return; }

      if (s.started) {
        // Physics
        s.vel += GRAVITY;
        s.birdY += s.vel;

        // Move pipes
        for (const p of s.pipes) p.x -= SPEED;

        // Remove offscreen
        s.pipes = s.pipes.filter(p => p.x + PIPE_W > -10);

        // Spawn new
        if (!s.pipes.length || s.pipes[s.pipes.length - 1].x < W - PIPE_SPACE)
          s.pipes.push(spawnPipe());

        // Score
        for (const p of s.pipes) {
          if (!p.scored && p.x + PIPE_W < BIRD_X) {
            p.scored = true;
            s.score++;
            setScore(s.score);
            setHighScore(prev => Math.max(prev, s.score));
          }
        }

        // Collision
        const hitGround = s.birdY + BIRD_R > H - 44;
        const hitCeil = s.birdY - BIRD_R < 0;
        let hitPipe = false;
        for (const p of s.pipes) {
          if (BIRD_X + BIRD_R > p.x && BIRD_X - BIRD_R < p.x + PIPE_W) {
            if (s.birdY - BIRD_R < p.topH || s.birdY + BIRD_R > p.topH + GAP)
              hitPipe = true;
          }
        }

        if (hitGround || hitCeil || hitPipe) {
          s.over = true;
          setOver(true);
          draw();
          return;
        }
      } else {
        // Idle hover
        s.frame++;
        s.birdY = H / 2 + Math.sin(s.frame * 0.04) * 12;
      }

      draw();
      frameId.current = requestAnimationFrame(loop);
    };
    frameId.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frameId.current);
  }, [draw]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.code === "Space") { e.preventDefault(); flap(); } };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [flap]);

  const reset = () => {
    const s = stateRef.current;
    s.birdY = H / 2;
    s.vel = 0;
    s.pipes = [];
    s.score = 0;
    s.over = false;
    s.started = false;
    s.frame = 0;
    setScore(0);
    setOver(false);
    setStarted(false);
    frameId.current = requestAnimationFrame(function loop() {
      if (stateRef.current.over) { draw(); return; }
      if (stateRef.current.started) {
        stateRef.current.vel += GRAVITY;
        stateRef.current.birdY += stateRef.current.vel;
        for (const p of stateRef.current.pipes) p.x -= SPEED;
        stateRef.current.pipes = stateRef.current.pipes.filter(p => p.x + PIPE_W > -10);
        if (!stateRef.current.pipes.length || stateRef.current.pipes[stateRef.current.pipes.length - 1].x < W - PIPE_SPACE)
          stateRef.current.pipes.push(spawnPipe());
        for (const p of stateRef.current.pipes) {
          if (!p.scored && p.x + PIPE_W < BIRD_X) { p.scored = true; stateRef.current.score++; setScore(stateRef.current.score); }
        }
        const hitGround = stateRef.current.birdY + BIRD_R > H - 44;
        const hitCeil = stateRef.current.birdY - BIRD_R < 0;
        let hitPipe = false;
        for (const p of stateRef.current.pipes) {
          if (BIRD_X + BIRD_R > p.x && BIRD_X - BIRD_R < p.x + PIPE_W)
            if (stateRef.current.birdY - BIRD_R < p.topH || stateRef.current.birdY + BIRD_R > p.topH + GAP) hitPipe = true;
        }
        if (hitGround || hitCeil || hitPipe) { stateRef.current.over = true; setOver(true); draw(); return; }
      } else {
        stateRef.current.frame++;
        stateRef.current.birdY = H / 2 + Math.sin(stateRef.current.frame * 0.04) * 12;
      }
      draw();
      frameId.current = requestAnimationFrame(loop);
    });
  };

  return (
    <div className="relative w-full h-full bg-[#87ceeb] overflow-hidden flex flex-col items-center justify-center" onClick={flap}>
      {/* Background Canvas */}
      <canvas ref={ref} width={W} height={H} className="absolute inset-0 w-full h-full object-cover" />
      
      {/* Floating Header */}
      <div className="absolute top-8 left-10 z-20 pointer-events-none animate-[fadeSlideUp_0.8s_ease]">
        <Link href="/" className="flex items-center gap-3 pointer-events-auto group">
          <div className="w-12 h-12 bg-black rounded-2xl flex items-center justify-center shadow-lg border border-white/20 group-hover:scale-105 transition-transform">
            <span className="text-white font-serif font-bold text-2xl">D</span>
          </div>
          <span className="font-serif font-black text-3xl tracking-tighter text-white drop-shadow-md">
            DRONA<sup className="text-[0.5em] text-primary font-sans tracking-normal ml-0.5">AI</sup>
          </span>
        </Link>
      </div>

      {/* Floating Score */}
      <div className="absolute top-8 right-10 z-20 flex flex-col items-end pointer-events-none animate-[fadeSlideUp_1s_ease]">
        <div className="flex gap-6 items-end">
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-bold uppercase tracking-[.2em] text-white/70 drop-shadow">Best</span>
            <span className="text-xl font-bold text-white/90 tabular-nums drop-shadow-sm">{highScore}</span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-[12px] font-bold uppercase tracking-[.2em] text-white/90 drop-shadow">Score</span>
            <span className="text-4xl font-black text-white tabular-nums drop-shadow-md">{score}</span>
          </div>
        </div>
      </div>

      {/* Overlays */}
      {over && (
        <div className="absolute inset-0 bg-black/75 flex flex-col items-center justify-center backdrop-blur-sm z-30 animate-[fadeIn_0.3s_ease]">
          <span className="text-white font-bold text-4xl tracking-widest mb-1 drop-shadow-lg">GAME OVER</span>
          <span className="text-white/80 text-lg mb-8 font-mono uppercase tracking-widest">Final Score: {score}</span>
          <button onClick={(e) => { e.stopPropagation(); reset(); }} className="px-10 py-4 bg-white text-black rounded-2xl text-xl font-black tracking-widest shadow-2xl hover:scale-110 hover:shadow-[0_10px_40px_rgba(255,255,255,0.3)] transition-all cursor-pointer">
            PLAY AGAIN
          </button>
        </div>
      )}
      {!started && !over && (
        <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center backdrop-blur-sm z-30 animate-[fadeIn_0.5s_ease]">
          <button onClick={(e) => { e.stopPropagation(); flap(); }} className="px-10 py-4 bg-white text-black rounded-2xl text-xl font-black tracking-widest shadow-2xl hover:scale-110 hover:shadow-[0_10px_40px_rgba(255,255,255,0.3)] transition-all cursor-pointer animate-pulse">
            TAP TO FLAP
          </button>
        </div>
      )}
    </div>
  );
}
