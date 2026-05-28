"use client";

import { useState, useRef, useEffect } from "react";

// --- Deterministic Layout Generator ---
const generateStaticGraph = () => {
  const width = 1400;
  const height = 1000;
  const cx = width / 2;
  const cy = height / 2;

  const nodes: any[] = [];
  const links: any[] = [];

  const addNode = (id: string, label: string, group: string, x: number, y: number, colorTheme: string, size: number) => {
    nodes.push({ id, label, group, x, y, colorTheme, size });
  };
  const addLink = (source: string, target: string, color: string, isDashed = false) => {
    links.push({ source, target, color, isDashed });
  };

  addNode("core", "Student Core", "core", cx, cy, "white", 64);

  const subjects = [
    { id: "chem", label: "Chemistry", theme: "emerald", hex: "#10b981", concepts: ["Organic Chem", "Inorganic Chem", "Physical Chem", "Covalent Bonds", "Ionic Bonds", "Equilibrium", "Kinetics", "Polymers"] },
    { id: "phys", label: "Physics", theme: "blue", hex: "#3b82f6", concepts: ["Mechanics", "Optics", "Thermodynamics", "Electromagnetism", "Quantum Physics", "Kinematics", "Waves", "Nuclear Physics"] },
    { id: "math", label: "Mathematics", theme: "violet", hex: "#8b5cf6", concepts: ["Calculus", "Algebra", "Geometry", "Trigonometry", "Probability", "Statistics", "Linear Algebra", "Vector Calculus"] },
    { id: "habits", label: "Study Habits", theme: "amber", hex: "#f59e0b", concepts: ["Time Management", "Focus", "Sleep", "Pomodoro", "Spaced Repetition", "Active Recall", "Procrastination", "Deep Work"] }
  ];

  subjects.forEach((subj, i) => {
    const angle = (i / subjects.length) * Math.PI * 2 - Math.PI / 4;
    const sx = cx + Math.cos(angle) * 220;
    const sy = cy + Math.sin(angle) * 220;
    
    addNode(subj.id, subj.label, subj.id, sx, sy, subj.theme, 48);
    addLink("core", subj.id, subj.hex);

    subj.concepts.forEach((concept, j) => {
      // Arc spread around the subject node
      const conceptAngle = angle - Math.PI/1.8 + (j / (subj.concepts.length - 1)) * (Math.PI * 1.1);
      const distance = 160 + (j % 2) * 40; // Stagger to look organic
      const cx2 = sx + Math.cos(conceptAngle) * distance;
      const cy2 = sy + Math.sin(conceptAngle) * distance;
      
      const conceptId = `${subj.id}_${j}`;
      addNode(conceptId, concept, subj.id, cx2, cy2, subj.theme, 24);
      addLink(subj.id, conceptId, subj.hex);

      // Level 3 nodes (Sub-concepts) to dramatically increase density
      const subNodesCount = 2 + (j % 3); // Generates 2 to 4 sub-nodes per concept
      const subLabels = ["Definition", "Core Formula", "Applications", "Common Errors"];
      for (let k = 0; k < subNodesCount; k++) {
        // Tighter arc around the parent concept
        const subAngle = conceptAngle - Math.PI/3 + (k / Math.max(1, subNodesCount - 1)) * (Math.PI / 1.5);
        const subDist = 60 + (k % 2) * 20; // Stagger distances
        const cx3 = cx2 + Math.cos(subAngle) * subDist;
        const cy3 = cy2 + Math.sin(subAngle) * subDist;
        
        const subId = `${conceptId}_sub_${k}`;
        addNode(subId, subLabels[k], subj.id, cx3, cy3, subj.theme, 10);
        addLink(conceptId, subId, subj.hex, true);
      }
    });
  });

  // Cross links (Interconnected Knowledge Web)
  const linkColor = "#cbd5e1"; // Slate 300 for light theme
  
  // Physics <-> Math
  addLink(`phys_4`, `math_0`, linkColor, true); // Quantum -> Calculus
  addLink(`phys_0`, `math_2`, linkColor, true); // Mechanics -> Geometry
  addLink(`phys_5`, `math_0`, linkColor, true); // Kinematics -> Calculus
  addLink(`phys_3`, `math_7`, linkColor, true); // Electromagnetism -> Vector Calculus
  addLink(`phys_1`, `math_3`, linkColor, true); // Optics -> Trigonometry
  
  // Physics <-> Chemistry
  addLink(`chem_2`, `phys_2`, linkColor, true); // Physical Chem -> Thermodynamics
  addLink(`chem_6`, `phys_7`, linkColor, true); // Kinetics -> Nuclear Physics
  addLink(`chem_4`, `phys_3`, linkColor, true); // Ionic Bonds -> Electromagnetism
  addLink(`chem_5`, `phys_2`, linkColor, true); // Equilibrium -> Thermodynamics
  
  // Chemistry <-> Math
  addLink(`chem_6`, `math_3`, linkColor, true); // Kinetics -> Trigonometry
  addLink(`chem_6`, `math_0`, linkColor, true); // Kinetics -> Calculus
  addLink(`chem_2`, `math_5`, linkColor, true); // Physical Chem -> Statistics
  
  // Math <-> Math (Internal)
  addLink(`math_4`, `math_5`, linkColor, true); // Probability -> Statistics
  addLink(`math_6`, `math_7`, linkColor, true); // Linear Algebra -> Vector Calculus
  
  // Habits <-> Everything (Meta-learning)
  addLink(`habits_0`, `habits_3`, linkColor, true); // Time Management -> Pomodoro
  addLink(`habits_4`, `habits_5`, linkColor, true); // Spaced Repetition -> Active Recall
  addLink(`habits_1`, `habits_6`, linkColor, true); // Focus -> Procrastination (Inverse)
  addLink(`habits_7`, `phys_4`, linkColor, true);   // Deep Work -> Quantum Physics (Requires focus)
  addLink(`habits_5`, `math_0`, linkColor, true);   // Active Recall -> Calculus
  addLink(`habits_4`, `chem_0`, linkColor, true);   // Spaced Repetition -> Organic Chem (Memorization)
  
  // Subject level cross-pollination
  addLink(`phys`, `math`, linkColor, true);
  addLink(`chem`, `phys`, linkColor, true);

  return { nodes, links, width, height };
};

const THEMES: Record<string, { bg: string, border: string, text: string, shadow: string, hex: string }> = {
  emerald: { bg: "bg-emerald-100", border: "border-emerald-300", text: "text-emerald-700", shadow: "shadow-[0_4px_14px_rgba(16,185,129,0.2)]", hex: "#10b981" },
  blue: { bg: "bg-blue-100", border: "border-blue-300", text: "text-blue-700", shadow: "shadow-[0_4px_14px_rgba(59,130,246,0.2)]", hex: "#3b82f6" },
  violet: { bg: "bg-violet-100", border: "border-violet-300", text: "text-violet-700", shadow: "shadow-[0_4px_14px_rgba(139,92,246,0.2)]", hex: "#8b5cf6" },
  amber: { bg: "bg-amber-100", border: "border-amber-300", text: "text-amber-700", shadow: "shadow-[0_4px_14px_rgba(245,158,11,0.2)]", hex: "#f59e0b" },
  white: { bg: "bg-slate-100", border: "border-slate-300", text: "text-slate-700", shadow: "shadow-[0_4px_14px_rgba(148,163,184,0.2)]", hex: "#64748b" },
};

export default function AgentDockMemory() {
  const { nodes, links, width: graphWidth, height: graphHeight } = generateStaticGraph();
  
  // Pan and Zoom state
  const [transform, setTransform] = useState({ x: 0, y: 0, scale: 0.8 });
  const [isDragging, setIsDragging] = useState(false);
  const [startPan, setStartPan] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  const resetView = () => {
    if (containerRef.current) {
      const { clientWidth, clientHeight } = containerRef.current;
      const fitScale = Math.min(clientWidth / graphWidth, clientHeight / graphHeight) * 0.9;
      setTransform({
        x: (clientWidth - graphWidth * fitScale) / 2,
        y: (clientHeight - graphHeight * fitScale) / 2,
        scale: fitScale
      });
    }
  };

  // Center the graph on mount to fit perfectly
  useEffect(() => {
    resetView();
  }, [graphWidth, graphHeight]);

  const handleZoom = (delta: number) => {
    setTransform(prev => ({ ...prev, scale: Math.max(0.1, Math.min(prev.scale + delta, 3)) }));
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartPan({ x: e.clientX - transform.x, y: e.clientY - transform.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setTransform(prev => ({
      ...prev,
      x: e.clientX - startPan.x,
      y: e.clientY - startPan.y
    }));
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const scaleAdjust = e.deltaY * -0.001;
    const newScale = Math.min(Math.max(0.2, transform.scale + scaleAdjust), 3);
    
    // Zoom towards center of screen
    const ratio = newScale / transform.scale;
    const cx = containerRef.current ? containerRef.current.clientWidth / 2 : 0;
    const cy = containerRef.current ? containerRef.current.clientHeight / 2 : 0;
    
    setTransform(prev => ({
      scale: newScale,
      x: cx - (cx - prev.x) * ratio,
      y: cy - (cy - prev.y) * ratio
    }));
  };

  const activeNodeData = nodes.find(n => n.id === hoveredNode);

  return (
    <div className="flex-1 w-full h-full flex flex-col overflow-hidden bg-slate-50 text-slate-800 select-none">
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes float0 { 0%, 100% { transform: translate(0px, 0px); } 50% { transform: translate(6px, -8px); } }
        @keyframes float1 { 0%, 100% { transform: translate(0px, 0px); } 50% { transform: translate(-8px, 6px); } }
        @keyframes float2 { 0%, 100% { transform: translate(0px, 0px); } 50% { transform: translate(5px, 7px); } }
        .node-float-0 { animation: float0 6s ease-in-out infinite; }
        .node-float-1 { animation: float1 7.5s ease-in-out infinite; }
        .node-float-2 { animation: float2 9s ease-in-out infinite; }
      `}} />

      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between flex-shrink-0 bg-slate-50/90 backdrop-blur-md z-20">
        <div className="flex items-center gap-4">
          <h2 className="font-display font-bold text-xl tracking-tight text-slate-900">Neural Canvas</h2>
          <div className="flex items-center gap-2 text-[10px] font-mono">
            <span className="bg-emerald-100 text-emerald-700 border border-emerald-300 px-2 py-0.5 rounded-full font-bold shadow-sm">Active State</span>
            <span className="bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full border border-slate-300">{nodes.length} Nodes</span>
            <span className="bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full border border-slate-300">{links.length} Edges</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-white border border-slate-300 rounded-xl px-3 py-1.5 focus-within:border-slate-400 focus-within:ring-1 focus-within:ring-slate-400 transition-all shadow-sm">
            <span className="material-symbols-outlined text-[16px] text-slate-400">search</span>
            <input type="text" placeholder="Query Neural Net..." className="bg-transparent text-xs font-body outline-none w-48 placeholder:text-slate-400 text-slate-800 border-none focus:ring-0 p-0"/>
          </div>
          <button onClick={resetView} className="w-8 h-8 rounded-xl border border-slate-300 bg-white flex items-center justify-center text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-all" title="Reset View">
            <span className="material-symbols-outlined text-[18px]">center_focus_strong</span>
          </button>
        </div>
      </div>

      {/* Main Interactive Area */}
      <div 
        ref={containerRef}
        className="flex-1 w-full h-full relative overflow-hidden"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
        style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
      >
        {/* Background Grid */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{
          backgroundImage: "linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)",
          backgroundSize: `${40 * transform.scale}px ${40 * transform.scale}px`,
          backgroundPosition: `${transform.x}px ${transform.y}px`
        }} />

        {/* Graph Layer */}
        <div 
          className="absolute origin-top-left transition-transform duration-75"
          style={{ 
            width: graphWidth, 
            height: graphHeight,
            transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`
          }}
        >
          {/* SVG Links */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
            {links.map((link, idx) => {
              const sourceNode = nodes.find(n => n.id === link.source);
              const targetNode = nodes.find(n => n.id === link.target);
              if (!sourceNode || !targetNode) return null;

              const isConnected = hoveredNode === sourceNode.id || hoveredNode === targetNode.id;
              const isFaded = hoveredNode && !isConnected;

              return (
                <line 
                  key={idx}
                  x1={sourceNode.x}
                  y1={sourceNode.y}
                  x2={targetNode.x}
                  y2={targetNode.y}
                  stroke={isConnected ? targetNode.hex : "#cbd5e1"}
                  strokeWidth={isConnected ? 3 : 1.5}
                  strokeDasharray={link.isDashed ? "5,5" : "none"}
                  opacity={isFaded ? 0.1 : (isConnected ? 0.9 : 0.6)}
                  className="transition-all duration-300"
                />
              );
            })}
          </svg>

          {/* HTML Nodes */}
          {nodes.map((node, idx) => {
            const isHovered = hoveredNode === node.id;
            const isNeighbor = hoveredNode && links.some(l => 
              (l.source === hoveredNode && l.target === node.id) || 
              (l.target === hoveredNode && l.source === node.id)
            );
            const isFaded = hoveredNode && !isHovered && !isNeighbor;
            const theme = THEMES[node.colorTheme];

            return (
              <div 
                key={node.id}
                className={`absolute node-float-${idx % 3}`}
                style={{
                  left: node.x - node.size / 2,
                  top: node.y - node.size / 2,
                  width: node.size,
                  height: node.size,
                  opacity: isFaded ? 0.15 : 1,
                  zIndex: isHovered ? 10 : (isNeighbor ? 5 : 1)
                }}
                onMouseEnter={() => setHoveredNode(node.id)}
                onMouseLeave={() => setHoveredNode(null)}
              >
                <div 
                  className={`w-full h-full rounded-full flex items-center justify-center transition-all duration-300 ${theme.bg} ${isHovered ? 'shadow-[0_0_30px_rgba(0,0,0,0.1)] ' + theme.shadow : ''}`}
                  style={{
                    transform: isHovered ? 'scale(1.2)' : 'scale(1)',
                  }}
                >
                  {/* Node Border Glow */}
                  <div className={`absolute inset-0 rounded-full border-[3px] ${theme.border} opacity-80`}></div>

                  {/* Core Brain Icon */}
                  {node.group === 'core' && (
                    <span className="material-symbols-outlined text-slate-400 text-3xl opacity-50 absolute">psychology</span>
                  )}
                  
                  {/* Node Label */}
                  {(!isFaded || node.size > 30) && (
                    <div 
                      className={`absolute whitespace-nowrap text-center transition-all duration-300 pointer-events-none
                        ${isHovered ? 'text-slate-800 font-bold text-sm' : 'text-slate-500 font-medium text-xs'}
                      `}
                      style={{
                        top: node.size + (isHovered ? 12 : 8),
                        opacity: isFaded ? 0 : 1
                      }}
                    >
                      <span className="bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full border border-slate-200 shadow-sm">
                        {node.label}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Floating Inspector */}
      <div className="absolute top-20 right-6 w-72 bg-white/95 backdrop-blur-xl border border-slate-200 rounded-2xl flex flex-col flex-shrink-0 shadow-[0_10px_40px_rgba(0,0,0,0.08)] transition-all duration-300 pointer-events-none z-30">
        <div className="p-4 border-b border-slate-100">
          <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Node Inspector</h3>
          
          {activeNodeData ? (
            <div className="flex items-center gap-3 animate-[viewFadeIn_0.2s_ease-out]">
              <div className={`w-10 h-10 rounded-xl ${THEMES[activeNodeData.colorTheme].bg} border ${THEMES[activeNodeData.colorTheme].border} flex items-center justify-center shadow-sm`}>
                <span className={`material-symbols-outlined ${THEMES[activeNodeData.colorTheme].text} text-[20px]`}>
                  {activeNodeData.type === 'core' ? 'hub' : activeNodeData.type === 'subject' ? 'category' : 'radio_button_checked'}
                </span>
              </div>
              <div>
                <p className="text-sm font-bold text-slate-800">{activeNodeData.label}</p>
                <p className="text-[10px] text-slate-500 capitalize">{activeNodeData.type} Node</p>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3 opacity-50">
              <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center">
                <span className="material-symbols-outlined text-slate-400 text-[20px]">ads_click</span>
              </div>
              <div>
                <p className="text-sm font-bold text-slate-500">No Node Selected</p>
                <p className="text-[10px] text-slate-400">Hover over the neural graph</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Legend */}
      <div className="absolute bottom-6 left-6 flex gap-2 z-20">
        {[{label: 'Chemistry', theme: 'emerald'}, {label: 'Physics', theme: 'blue'}, {label: 'Math', theme: 'violet'}, {label: 'Habits', theme: 'amber'}].map(item => (
          <div key={item.label} className="bg-white/90 backdrop-blur-md border border-slate-200 px-3 py-1.5 rounded-full flex items-center gap-2 shadow-sm cursor-pointer hover:bg-slate-50 transition-colors pointer-events-auto">
            <div className={`w-2 h-2 rounded-full ${THEMES[item.theme].bg} ${THEMES[item.theme].shadow}`}></div>
            <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">{item.label}</span>
          </div>
        ))}
      </div>

      {/* Zoom Controls */}
      <div className="absolute bottom-6 right-6 flex items-center bg-white/90 backdrop-blur-md border border-slate-200 rounded-xl shadow-sm z-20 overflow-hidden pointer-events-auto">
        <button onClick={() => handleZoom(0.1)} className="p-2 hover:bg-slate-100 text-slate-600 transition-colors border-r border-slate-200 flex items-center justify-center" title="Zoom In">
          <span className="material-symbols-outlined text-[20px]">zoom_in</span>
        </button>
        <button onClick={resetView} className="px-4 py-2 hover:bg-slate-100 text-slate-600 font-bold text-[10px] uppercase tracking-wider transition-colors border-r border-slate-200 flex items-center justify-center" title="Reset View">
          Reset
        </button>
        <button onClick={() => handleZoom(-0.1)} className="p-2 hover:bg-slate-100 text-slate-600 transition-colors flex items-center justify-center" title="Zoom Out">
          <span className="material-symbols-outlined text-[20px]">zoom_out</span>
        </button>
      </div>
    </div>
  );
}
