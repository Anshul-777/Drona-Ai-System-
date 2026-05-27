"use client";

import { useEffect, useState, useRef } from "react";

export default function AgentDockArchitecture() {
  const [logs, setLogs] = useState([
    { time: '14:02:38', agent: '[Core]', color: '#f9e2af', msg: 'Student submitted response. Routing to pipeline.' },
    { time: '14:02:39', agent: '[Router]', color: '#f9e2af', msg: 'Query classified: CHEMISTRY/BONDING. Dispatching.' },
    { time: '14:02:41', agent: '[Context Synth]', color: '#89b4fa', msg: 'Pulled 3 prior sessions. Student struggled with polarity.' },
    { time: '14:02:43', agent: '[Chemistry]', color: '#a6e3a1', msg: 'Analyzing: "Electrons are shared equally."' },
    { time: '14:02:44', agent: '[Chemistry]', color: '#f38ba8', msg: '⚠ Incomplete. Student conflates polar & non-polar covalent.' },
    { time: '14:02:45', agent: '[Context Synth]', color: '#89b4fa', msg: 'Recommending water molecule analogy from Session 4.' },
    { time: '14:02:46', agent: '[Core → Socratic]', color: '#f9e2af', msg: 'CONSENSUS: Generate prompt re: polar vs non-polar. Use water analogy. No direct answers.', isBox: true },
  ]);

  const [isTyping, setIsTyping] = useState(true);
  const logEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  useEffect(() => {
    const additionalLogs = [
      { time: '14:02:50', agent: '[Socratic]', color: '#f38ba8', msg: 'Generating Socratic prompt with tug-of-war analogy.' },
      { time: '14:02:52', agent: '[Core]', color: '#f9e2af', msg: 'Response quality check initiated. Verifying alignment with constraints.' },
      { time: '14:02:54', agent: '[Context Synth]', color: '#89b4fa', msg: 'Injecting session context: Student prefers visual metaphors.' },
      { time: '14:02:55', agent: '[Socratic]', color: '#f38ba8', msg: 'Draft complete. "You said electrons are shared equally — but are all friendships equal?" Submitting for review.' },
      { time: '14:02:57', agent: '[Core]', color: '#f9e2af', msg: '✓ Approved. Delivering to student interface.' },
      { time: '14:02:58', agent: '[Grader]', color: '#fab387', msg: 'Standing by to evaluate student\'s next response.' },
    ];

    let index = 0;
    const interval = setInterval(() => {
      if (index < additionalLogs.length) {
        setLogs(prev => [...prev, additionalLogs[index]]);
        index++;
      } else {
        setIsTyping(false);
        clearInterval(interval);
      }
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex-1 flex flex-col lg:flex-row h-full overflow-hidden animate-[viewFadeIn_0.4s_cubic-bezier(0.4,0,0.2,1)]">
      
      {/* Left: Orchestration Topology */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topology Header */}
        <div className="px-6 py-4 border-b border-outline-variant/20 flex items-center justify-between flex-shrink-0 bg-surface/50">
          <div>
            <h2 className="font-display font-bold text-xl text-on-surface">Orchestration Topology</h2>
            <p className="text-xs text-secondary mt-0.5">Real-time agent routing & consensus pipeline</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="bg-green-50 text-green-700 border border-green-200 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">All Systems Nominal</span>
            <button className="w-8 h-8 rounded-lg border border-outline-variant/30 flex items-center justify-center text-secondary hover:text-on-surface hover:bg-surface-container-low transition-all">
              <span className="material-symbols-outlined text-[18px]">fullscreen</span>
            </button>
          </div>
        </div>

        {/* Topology Canvas */}
        <div 
          className="flex-1 relative overflow-auto p-8"
          style={{
            backgroundImage: "radial-gradient(circle, #e1e3e4 1px, transparent 1px)",
            backgroundSize: "24px 24px"
          }}
        >
          {/* SVG Connection Lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
            <line x1="50%" y1="100" x2="50%" y2="180" stroke="#0042dc" strokeWidth="2" strokeDasharray="4 3" opacity="0.4"/>
            <line x1="50%" y1="220" x2="20%" y2="300" stroke="#0042dc" strokeWidth="1.5" strokeDasharray="4 3" opacity="0.3"/>
            <line x1="50%" y1="220" x2="50%" y2="300" stroke="#0042dc" strokeWidth="1.5" strokeDasharray="4 3" opacity="0.3"/>
            <line x1="50%" y1="220" x2="80%" y2="300" stroke="#0042dc" strokeWidth="1.5" strokeDasharray="4 3" opacity="0.3"/>
          </svg>

          <div className="relative flex flex-col items-center gap-6" style={{ zIndex: 2, minHeight: '560px' }}>
            
            {/* TIER 0: Master Orchestrator */}
            <div className="flex flex-col items-center">
              <div className="relative">
                <div className="w-20 h-20 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20 ring-4 ring-primary/10">
                  <span className="material-symbols-outlined filled text-on-primary text-3xl">psychology</span>
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                <div className="absolute inset-0 rounded-2xl border-2 border-primary/30 animate-ping" style={{ animationDuration: '3s' }}></div>
              </div>
              <div className="mt-3 text-center">
                <h3 className="font-display font-bold text-base text-on-surface">Drona Core</h3>
                <p className="text-[10px] font-mono text-primary font-medium mt-0.5">MASTER ORCHESTRATOR</p>
                <p className="text-[10px] text-secondary mt-1">Routing • Consensus • Delegation</p>
              </div>
            </div>

            {/* TIER 1: Cognitive Router */}
            <div className="flex flex-col items-center">
              <div className="w-px h-6 bg-primary/30"></div>
              <div className="px-5 py-2.5 rounded-xl bg-surface-container-lowest border border-primary/20 shadow-sm flex items-center gap-3">
                <span className="material-symbols-outlined text-primary text-[20px]">route</span>
                <div>
                  <p className="text-xs font-bold text-on-surface">Cognitive Router</p>
                  <p className="text-[10px] text-primary font-mono">DISPATCHING → Chemistry Node</p>
                </div>
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse ml-2 shadow-[0_0_8px_rgba(0,66,220,0.5)]"></div>
              </div>
              <div className="w-px h-6 bg-primary/30"></div>
            </div>

            {/* TIER 2: Agent Clusters */}
            <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-6 px-4 pb-12">
              
              {/* STEM Cluster */}
              <div className="flex flex-col gap-3">
                <div className="text-center">
                  <span className="text-[10px] font-bold text-secondary uppercase tracking-widest bg-surface-container-high px-3 py-1 rounded-full">STEM Specialists</span>
                </div>

                <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-4 flex items-center gap-3 cursor-pointer hover:-translate-y-0.5 hover:shadow-md transition-all">
                  <div className="relative flex-shrink-0">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center">
                      <span className="material-symbols-outlined text-blue-600 text-[20px]">bolt</span>
                    </div>
                    <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-neutral-400 border border-white"></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-bold text-on-surface">Physics</p>
                      <span className="text-[9px] font-mono text-secondary bg-surface-container-high px-1.5 py-0.5 rounded">IDLE</span>
                    </div>
                    <p className="text-[10px] text-secondary mt-0.5 truncate">Last: Kinematics review — 4m ago</p>
                  </div>
                </div>

                <div className="bg-surface-container-lowest border-2 border-primary/40 rounded-xl p-4 flex items-center gap-3 cursor-pointer hover:-translate-y-0.5 hover:shadow-md transition-all ring-4 ring-primary/5">
                  <div className="relative flex-shrink-0">
                    <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                      <span className="material-symbols-outlined text-on-primary text-[20px]">science</span>
                    </div>
                    <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-green-500 border border-white shadow-[0_0_8px_rgba(34,197,94,0.5)]"></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-bold text-primary">Chemistry</p>
                      <span className="text-[9px] font-mono text-primary bg-primary/10 px-1.5 py-0.5 rounded font-bold">ACTIVE</span>
                    </div>
                    <p className="text-[10px] text-primary/70 mt-0.5 truncate">Evaluating covalent bond response...</p>
                    <div className="w-full h-1 bg-primary/10 rounded-full mt-2"><div className="h-full bg-primary rounded-full animate-pulse" style={{ width: '65%' }}></div></div>
                  </div>
                </div>

                <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-4 flex items-center gap-3 cursor-pointer hover:-translate-y-0.5 hover:shadow-md transition-all">
                  <div className="relative flex-shrink-0">
                    <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-center">
                      <span className="material-symbols-outlined text-purple-600 text-[20px]">calculate</span>
                    </div>
                    <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-neutral-400 border border-white"></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-bold text-on-surface">Mathematics</p>
                      <span className="text-[9px] font-mono text-secondary bg-surface-container-high px-1.5 py-0.5 rounded">STANDBY</span>
                    </div>
                    <p className="text-[10px] text-secondary mt-0.5 truncate">Ready — Calculus module loaded</p>
                  </div>
                </div>
              </div>

              {/* Cognitive Core Cluster */}
              <div className="flex flex-col gap-3">
                <div className="text-center">
                  <span className="text-[10px] font-bold text-secondary uppercase tracking-widest bg-surface-container-high px-3 py-1 rounded-full">Cognitive Core</span>
                </div>

                <div className="bg-surface-container-lowest border-2 border-amber-300/50 rounded-xl p-4 flex items-center gap-3 cursor-pointer hover:-translate-y-0.5 hover:shadow-md transition-all ring-4 ring-amber-500/5">
                  <div className="relative flex-shrink-0">
                    <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center">
                      <span className="material-symbols-outlined text-white text-[20px]">psychology_alt</span>
                    </div>
                    <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-green-500 border border-white shadow-[0_0_8px_rgba(34,197,94,0.5)]"></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-bold text-amber-700">Context Synth</p>
                      <span className="text-[9px] font-mono text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded font-bold">ACTIVE</span>
                    </div>
                    <p className="text-[10px] text-amber-600/70 mt-0.5 truncate">Retrieving session history...</p>
                    <div className="w-full h-1 bg-amber-100 rounded-full mt-2"><div className="h-full bg-amber-500 rounded-full animate-pulse" style={{ width: '45%' }}></div></div>
                  </div>
                </div>

                <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-4 flex items-center gap-3 cursor-pointer hover:-translate-y-0.5 hover:shadow-md transition-all">
                  <div className="relative flex-shrink-0">
                    <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center">
                      <span className="material-symbols-outlined text-teal-600 text-[20px]">database</span>
                    </div>
                    <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-green-500 border border-white"></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-bold text-on-surface">Long-term Mem</p>
                      <span className="text-[9px] font-mono text-green-700 bg-green-50 px-1.5 py-0.5 rounded">SYNCED</span>
                    </div>
                    <p className="text-[10px] text-secondary mt-0.5">1,247 memories • 99.8% coherence</p>
                  </div>
                </div>
              </div>

              {/* Evaluation Cluster */}
              <div className="flex flex-col gap-3">
                <div className="text-center">
                  <span className="text-[10px] font-bold text-secondary uppercase tracking-widest bg-surface-container-high px-3 py-1 rounded-full">Evaluation Layer</span>
                </div>

                <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-4 flex items-center gap-3 cursor-pointer hover:-translate-y-0.5 hover:shadow-md transition-all">
                  <div className="relative flex-shrink-0">
                    <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-center">
                      <span className="material-symbols-outlined text-orange-600 text-[20px]">fact_check</span>
                    </div>
                    <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-neutral-400 border border-white"></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-bold text-on-surface">Grader</p>
                      <span className="text-[9px] font-mono text-secondary bg-surface-container-high px-1.5 py-0.5 rounded">QUEUED</span>
                    </div>
                    <p className="text-[10px] text-secondary mt-0.5">Awaiting Chemistry eval output</p>
                  </div>
                </div>

                <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-4 flex items-center gap-3 cursor-pointer hover:-translate-y-0.5 hover:shadow-md transition-all">
                  <div className="relative flex-shrink-0">
                    <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center">
                      <span className="material-symbols-outlined text-rose-600 text-[20px]">record_voice_over</span>
                    </div>
                    <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-neutral-400 border border-white"></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-bold text-on-surface">Socratic Tutor</p>
                      <span className="text-[9px] font-mono text-secondary bg-surface-container-high px-1.5 py-0.5 rounded">STANDBY</span>
                    </div>
                    <p className="text-[10px] text-secondary mt-0.5">Will compose response after consensus</p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* Right Sidebar: Live Logs + Task Queue */}
      <div className="w-full lg:w-[420px] border-l border-outline-variant/20 flex flex-col flex-shrink-0 bg-surface-container-lowest z-10 shadow-[-4px_0_24px_rgba(0,0,0,0.02)]">
        
        {/* Current Task */}
        <div className="p-4 border-b border-outline-variant/20 bg-surface-container-lowest relative z-10">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold text-secondary uppercase tracking-wider">Active Task Pipeline</h3>
            <span className="text-[10px] font-mono text-primary">3 in queue</span>
          </div>
          <div className="bg-primary/5 border border-primary/20 rounded-xl p-3">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
              <span className="text-xs font-bold text-on-surface">Evaluate Covalent Bond Understanding</span>
            </div>
            <div className="flex items-center gap-3 text-[10px] text-secondary font-mono">
              <span>Student → "Electrons are shared equally"</span>
            </div>
            <div className="mt-2 flex items-center gap-2">
              <div className="flex-1 h-1.5 bg-primary/10 rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full transition-all duration-1000" style={{ width: '55%' }}></div>
              </div>
              <span className="text-[10px] font-mono text-primary font-bold">55%</span>
            </div>
            <div className="mt-2 flex flex-wrap gap-1">
              <span className="text-[9px] bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded font-medium">Chemistry</span>
              <span className="text-[9px] bg-amber-50 text-amber-700 px-1.5 py-0.5 rounded font-medium">Context Synth</span>
              <span className="text-[9px] bg-surface-container-high text-secondary px-1.5 py-0.5 rounded">→ Grader</span>
              <span className="text-[9px] bg-surface-container-high text-secondary px-1.5 py-0.5 rounded">→ Socratic</span>
            </div>
          </div>
        </div>

        {/* System Prompt Preview */}
        <div className="p-4 border-b border-outline-variant/20 bg-surface-container-lowest relative z-10">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-bold text-secondary uppercase tracking-wider flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[14px]">terminal</span>
              Active Instruction
            </h3>
            <button className="text-[10px] text-primary font-medium hover:underline">Expand</button>
          </div>
          <div className="bg-[#1e1e2e] rounded-lg p-3 font-mono text-[11px] text-[#cdd6f4] leading-relaxed max-h-24 overflow-hidden relative">
            <span className="text-[#cba6f7]">"task"</span>: <span className="text-[#a6e3a1]">"Evaluate student's understanding of covalent bonds"</span>,<br/>
            <span className="text-[#cba6f7]">"constraints"</span>: [<span className="text-[#a6e3a1]">"No direct answers"</span>, <span className="text-[#a6e3a1]">"Socratic method"</span>],<br/>
            <span className="text-[#cba6f7]">"tone"</span>: <span className="text-[#a6e3a1]">"encouraging, academic"</span>
            <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-[#1e1e2e] to-transparent"></div>
          </div>
        </div>

        {/* Live Consensus Log */}
        <div className="flex-1 flex flex-col min-h-0 bg-[#1e1e2e]">
          <div className="px-4 py-3 border-b border-[#313244] flex items-center justify-between flex-shrink-0 bg-[#181825]">
            <h3 className="text-xs font-bold text-[#cdd6f4] uppercase tracking-wider flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[#89b4fa] text-[14px]">monitor_heart</span>
              Consensus Stream
            </h3>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              <span className="text-[10px] font-mono text-[#a6adc8]">LIVE</span>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 font-mono text-[11px] space-y-2.5 custom-scrollbar" style={{ scrollbarWidth: 'thin', scrollbarColor: '#313244 transparent' }}>
            {logs.map((log, i) => (
              <div key={i} className="flex gap-2 animate-[viewFadeIn_0.3s_ease]">
                <span className="text-[#585b70] w-14 flex-shrink-0">{log.time}</span>
                {log.isBox ? (
                  <div className="bg-[#313244]/50 p-2 rounded border-l-2 border-[#f9e2af] w-full">
                    <span className="text-[#f9e2af] font-semibold">{log.agent}</span><br/>
                    <span className="text-[#cdd6f4]">{log.msg}</span>
                  </div>
                ) : (
                  <div>
                    <span style={{ color: log.color }} className="font-semibold">{log.agent}</span>{' '}
                    <span className="text-[#cdd6f4]">{log.msg}</span>
                  </div>
                )}
              </div>
            ))}
            
            {isTyping && (
              <div className="flex gap-2 opacity-60">
                <span className="text-[#585b70] w-14 flex-shrink-0">...</span>
                <div className="flex gap-1 items-center h-4">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#89b4fa] animate-[blink_1.4s_infinite]"></div>
                  <div className="w-1.5 h-1.5 rounded-full bg-[#89b4fa] animate-[blink_1.4s_infinite_0.2s]"></div>
                  <div className="w-1.5 h-1.5 rounded-full bg-[#89b4fa] animate-[blink_1.4s_infinite_0.4s]"></div>
                </div>
              </div>
            )}
            
            <div ref={logEndRef} />
          </div>
        </div>
      </div>
    </div>
  );
}
