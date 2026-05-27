"use client";

import { useEffect, useRef, useState } from "react";

export default function AgentDockMemory() {
  const [nodes, setNodes] = useState([
    { id: 1, type: "core", label: "Student Core", icon: "person", top: 170, left: 270, bg: "bg-primary text-on-primary shadow-primary/20", glow: "ring-4 ring-primary/20" },
    { id: 2, type: "knowledge", label: "Chemistry", icon: "science", top: 110, left: 510, score: "89", text: "Organic Chem: Strong. Inorganic: Weak. Electrochemistry: Moderate.", color: "green" },
    { id: 3, type: "knowledge", label: "Physics", icon: "bolt", top: 90, left: 90, score: "72", text: "Mechanics: OK. Optics: Weak. Thermodynamics: Needs review.", color: "blue" },
    { id: 4, type: "knowledge", label: "Mathematics", icon: "calculate", top: 26, left: 210, text: "Calculus: Weak → Priority", color: "purple" },
    { id: 5, type: "active", label: "Covalent Bonds", icon: "link", top: 50, left: 650, text: "Active concept. Polar vs non-polar gap identified. Water analogy used.", bg: "bg-primary/5 border-2 border-primary" },
    { id: 6, type: "style", label: "Learning Style", icon: "palette", top: 310, left: 130, text: "Visual learner. Prefers analogies. Responds well to challenges.", color: "amber" },
    { id: 7, type: "weakness", label: "Weak Areas", icon: "warning", top: 290, left: 470, text: "Polarity, Integration by Parts, Optics — recurring failures.", color: "rose" },
    { id: 8, type: "gap", label: "Polarity Gap", icon: "electric_bolt", top: 210, left: 650, text: "3 failed attempts. Needs visual.", color: "secondary" },
    { id: 9, type: "history", label: "Session 4", icon: "history", top: 410, left: 290, text: "Water molecule analogy worked.", color: "teal" },
    { id: 10, type: "mood", label: "Mood", icon: "mood", top: 410, left: 10, text: "Motivated but frustrated with polarity.", color: "pink" },
    { id: 11, type: "target", label: "JEE Target", icon: "flag", top: 290, left: 810, text: "Rank < 5000. Chemistry focus.", color: "indigo" },
    { id: 12, type: "pattern", label: "Study Pattern", icon: "schedule", top: 410, left: 590, text: "Peak: 8-11PM. Avg 3.2h/day.", color: "cyan" },
    { id: 13, type: "confidence", label: "Confidence", icon: "trending_up", top: 410, left: 770, text: "Overall: 67%. Rising trend.", color: "emerald" },
  ]);

  const canvasRef = useRef<HTMLDivElement>(null);
  const [draggedNode, setDraggedNode] = useState<number | null>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent, id: number) => {
    if (!canvasRef.current) return;
    const nodeElement = e.currentTarget as HTMLDivElement;
    const rect = nodeElement.getBoundingClientRect();
    setOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
    setDraggedNode(id);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (draggedNode === null || !canvasRef.current) return;
    const canvasRect = canvasRef.current.getBoundingClientRect();
    
    setNodes(prev => prev.map(n => {
      if (n.id === draggedNode) {
        return {
          ...n,
          left: Math.max(0, e.clientX - canvasRect.left - offset.x),
          top: Math.max(0, e.clientY - canvasRect.top - offset.y),
        };
      }
      return n;
    }));
  };

  const handleMouseUp = () => {
    setDraggedNode(null);
  };

  const getNodeColor = (colorStr?: string) => {
    const map: Record<string, string> = {
      green: "bg-green-500 text-white",
      blue: "bg-blue-500 text-white",
      purple: "bg-purple-500 text-white",
      amber: "bg-amber-500 text-white",
      rose: "bg-rose-500 text-white",
      secondary: "bg-secondary text-white",
      teal: "bg-teal-500 text-white",
      pink: "bg-pink-400 text-white",
      indigo: "bg-indigo-500 text-white",
      cyan: "bg-cyan-500 text-white",
      emerald: "bg-emerald-500 text-white",
    };
    return colorStr && map[colorStr] ? map[colorStr] : "bg-primary text-white";
  };
  
  const getBorderColor = (colorStr?: string) => {
    const map: Record<string, string> = {
      green: "border-green-300",
      blue: "border-blue-300",
      purple: "border-purple-200",
      amber: "border-amber-300",
      rose: "border-rose-200",
      secondary: "border-outline-variant/40",
      teal: "border-outline-variant/40",
      pink: "border-outline-variant/40",
      indigo: "border-outline-variant/40",
      cyan: "border-outline-variant/40",
      emerald: "border-outline-variant/40",
    };
    return colorStr && map[colorStr] ? map[colorStr] : "border-outline-variant/40";
  };

  const getScoreColor = (colorStr?: string) => {
    const map: Record<string, string> = {
      green: "bg-green-100 text-green-700",
      blue: "bg-blue-100 text-blue-700",
    };
    return colorStr && map[colorStr] ? map[colorStr] : "bg-surface-container-high text-secondary";
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden animate-[viewFadeIn_0.4s_cubic-bezier(0.4,0,0.2,1)]">
      
      {/* Memory Header */}
      <div className="px-6 py-4 border-b border-outline-variant/20 flex items-center justify-between flex-shrink-0 bg-surface/50">
        <div className="flex items-center gap-4">
          <h2 className="font-display font-bold text-xl text-on-surface">Memory Canvas</h2>
          <div className="flex items-center gap-2 text-[10px] font-mono">
            <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold">1,247 nodes</span>
            <span className="bg-surface-container-high text-secondary px-2 py-0.5 rounded-full">2,891 connections</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-surface-container-low border border-outline-variant/30 rounded-lg px-3 py-1.5 focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/20 transition-all">
            <span className="material-symbols-outlined text-[16px] text-secondary">search</span>
            <input type="text" placeholder="Search memories..." className="bg-transparent text-xs font-body outline-none w-40 placeholder:text-outline border-none focus:ring-0 p-0"/>
          </div>
          <button className="w-8 h-8 rounded-lg border border-outline-variant/30 flex items-center justify-center text-secondary hover:text-on-surface hover:bg-surface-container-low transition-all" title="Filter">
            <span className="material-symbols-outlined text-[18px]">filter_list</span>
          </button>
          <button className="w-8 h-8 rounded-lg border border-outline-variant/30 flex items-center justify-center text-secondary hover:text-on-surface hover:bg-surface-container-low transition-all" title="Zoom In">
            <span className="material-symbols-outlined text-[18px]">zoom_in</span>
          </button>
          <button className="w-8 h-8 rounded-lg border border-outline-variant/30 flex items-center justify-center text-secondary hover:text-on-surface hover:bg-surface-container-low transition-all" title="Zoom Out">
            <span className="material-symbols-outlined text-[18px]">zoom_out</span>
          </button>
        </div>
      </div>

      {/* Canvas */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Graph Canvas Area */}
        <div 
          className="flex-1 relative overflow-hidden" 
          id="memory-canvas"
          ref={canvasRef}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          style={{
            backgroundImage: "linear-gradient(rgba(196,197,217,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(196,197,217,0.15) 1px, transparent 1px)",
            backgroundSize: "32px 32px"
          }}
        >
          {/* SVG Connections Layer (Static for demo) */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
            {/* These lines are static in this demo but could dynamically connect nodes based on their positions */}
            <line x1="320" y1="200" x2="560" y2="140" stroke="#0042dc" strokeWidth="2" fill="none"/>
            <line x1="320" y1="200" x2="180" y2="340" stroke="#0042dc" strokeWidth="2" fill="none"/>
            <line x1="320" y1="200" x2="520" y2="320" stroke="#c4c5d9" strokeWidth="1.5" fill="none"/>
            <line x1="320" y1="200" x2="140" y2="120" stroke="#c4c5d9" strokeWidth="1.5" fill="none"/>
            <line x1="560" y1="140" x2="720" y2="80" stroke="#c4c5d9" strokeWidth="1.5" strokeDasharray="6 4" opacity="0.5" fill="none"/>
            <line x1="560" y1="140" x2="700" y2="240" stroke="#c4c5d9" strokeWidth="1.5" fill="none"/>
            <line x1="180" y1="340" x2="340" y2="440" stroke="#c4c5d9" strokeWidth="1.5" fill="none"/>
            <line x1="180" y1="340" x2="60" y2="440" stroke="#c4c5d9" strokeWidth="1.5" strokeDasharray="6 4" opacity="0.5" fill="none"/>
            <line x1="520" y1="320" x2="700" y2="240" stroke="#c4c5d9" strokeWidth="1.5" fill="none"/>
            <line x1="520" y1="320" x2="640" y2="440" stroke="#c4c5d9" strokeWidth="1.5" strokeDasharray="6 4" opacity="0.5" fill="none"/>
            <line x1="340" y1="440" x2="520" y2="320" stroke="#c4c5d9" strokeWidth="1.5" strokeDasharray="6 4" opacity="0.5" fill="none"/>
            <line x1="140" y1="120" x2="260" y2="60" stroke="#c4c5d9" strokeWidth="1.5" fill="none"/>
            <line x1="700" y1="240" x2="860" y2="320" stroke="#c4c5d9" strokeWidth="1.5" strokeDasharray="6 4" opacity="0.5" fill="none"/>
            <line x1="860" y1="320" x2="820" y2="440" stroke="#c4c5d9" strokeWidth="1.5" strokeDasharray="6 4" opacity="0.5" fill="none"/>
          </svg>

          {/* Render Nodes */}
          {nodes.map(node => (
            <div 
              key={node.id}
              className={`absolute select-none cursor-grab active:cursor-grabbing transition-transform hover:scale-[1.04] ${draggedNode === node.id ? 'z-50 scale-[1.04]' : 'z-10'}`}
              style={{ left: `${node.left}px`, top: `${node.top}px` }}
              onMouseDown={(e) => handleMouseDown(e, node.id)}
            >
              {node.type === 'core' ? (
                <div className={`w-[100px] h-[60px] rounded-xl flex flex-col items-center justify-center shadow-lg ${node.bg} ${node.glow}`}>
                  <span className="material-symbols-outlined filled text-[18px]">{node.icon}</span>
                  <span className="text-[9px] font-bold mt-0.5">{node.label}</span>
                </div>
              ) : (
                <div className={`rounded-xl p-3 shadow-sm hover:shadow-md transition-shadow max-w-[170px] ${node.type === 'active' ? node.bg : `bg-surface-container-lowest border-2 ${getBorderColor(node.color)}`}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <div className={`w-5 h-5 rounded flex items-center justify-center ${node.type === 'active' ? 'bg-primary' : getNodeColor(node.color)}`}>
                      <span className="material-symbols-outlined text-[12px]">{node.icon}</span>
                    </div>
                    <span className={`text-[10px] font-bold ${node.type === 'active' ? 'text-primary' : 'text-on-surface'}`}>{node.label}</span>
                    
                    {node.score && (
                      <span className={`text-[8px] px-1 rounded ml-auto ${getScoreColor(node.color)}`}>{node.score}/100</span>
                    )}
                    {node.type === 'active' && (
                      <div className="w-2 h-2 rounded-full bg-primary animate-pulse ml-auto shadow-[0_0_8px_rgba(0,66,220,0.5)]"></div>
                    )}
                  </div>
                  <p className="text-[9px] text-secondary leading-tight">{node.text}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Right: Node Inspector */}
        <div className="w-72 border-l border-outline-variant/20 bg-surface-container-lowest flex flex-col flex-shrink-0 overflow-y-auto hidden lg:flex shadow-[-4px_0_24px_rgba(0,0,0,0.02)]">
          <div className="p-4 border-b border-outline-variant/20">
            <h3 className="text-xs font-bold text-secondary uppercase tracking-wider mb-3">Node Inspector</h3>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-green-500 flex items-center justify-center">
                <span className="material-symbols-outlined text-white text-[20px]">science</span>
              </div>
              <div>
                <p className="text-sm font-bold text-on-surface">Chemistry</p>
                <p className="text-[10px] text-secondary">Knowledge Cluster • 89/100</p>
              </div>
            </div>
          </div>
          <div className="p-4 space-y-4 text-xs">
            <div>
              <p className="font-bold text-secondary uppercase tracking-wider text-[10px] mb-2">Sub-Topics</p>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between p-2 bg-surface-container-low rounded-lg">
                  <span className="text-on-surface font-medium">Organic Chemistry</span>
                  <span className="text-green-600 font-bold">94%</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-surface-container-low rounded-lg">
                  <span className="text-on-surface font-medium">Electrochemistry</span>
                  <span className="text-amber-600 font-bold">71%</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-surface-container-low rounded-lg">
                  <span className="text-on-surface font-medium">Inorganic Chemistry</span>
                  <span className="text-rose-600 font-bold">58%</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-surface-container-low rounded-lg">
                  <span className="text-on-surface font-medium">Physical Chemistry</span>
                  <span className="text-blue-600 font-bold">82%</span>
                </div>
              </div>
            </div>
            <div>
              <p className="font-bold text-secondary uppercase tracking-wider text-[10px] mb-2">Connected Nodes</p>
              <div className="flex flex-wrap gap-1.5">
                <span className="bg-primary/10 text-primary px-2 py-1 rounded-lg font-medium">Student Core</span>
                <span className="bg-primary/10 text-primary px-2 py-1 rounded-lg font-medium">Covalent Bonds</span>
                <span className="bg-surface-container-high text-secondary px-2 py-1 rounded-lg">Polarity Gap</span>
                <span className="bg-surface-container-high text-secondary px-2 py-1 rounded-lg">Weak Areas</span>
              </div>
            </div>
            <div>
              <p className="font-bold text-secondary uppercase tracking-wider text-[10px] mb-2">Recent Activity</p>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <div className="w-1 rounded-full bg-primary flex-shrink-0"></div>
                  <div>
                    <p className="text-on-surface font-medium">Covalent bond eval triggered</p>
                    <p className="text-secondary text-[10px]">2 min ago</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className="w-1 rounded-full bg-outline-variant flex-shrink-0"></div>
                  <div>
                    <p className="text-on-surface font-medium">Organic Chem quiz: 9/10</p>
                    <p className="text-secondary text-[10px]">1 hour ago</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className="w-1 rounded-full bg-outline-variant flex-shrink-0"></div>
                  <div>
                    <p className="text-on-surface font-medium">Polarity concept re-taught</p>
                    <p className="text-secondary text-[10px]">Yesterday</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
