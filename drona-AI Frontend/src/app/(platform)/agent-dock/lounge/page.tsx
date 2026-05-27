"use client";

import { useState, useRef, useEffect } from "react";

export default function TeacherLounge() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("logs");
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on load
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, []);

  return (
    <div className="absolute inset-0 flex bg-white text-gray-900 font-body overflow-hidden">
      
      {/* ════════════════════════════════════════════════════════
          LEFT SIDEBAR - Fixed, No Scroll
          ════════════════════════════════════════════════════════ */}
      <div className="w-[260px] flex flex-col flex-shrink-0 py-6 px-3 border-r border-gray-200 bg-gray-50/50">
        <h2 className="px-3 text-lg font-black text-gray-900 mb-6 font-display tracking-tight">Teacher Lounge</h2>
        
        <div className="px-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Daily Logs</div>
        <div className="space-y-1">
          <div className="px-3 py-2 text-[13px] font-bold text-primary bg-primary/10 rounded-lg cursor-pointer shadow-sm">Today</div>
          <div className="px-3 py-2 text-[13px] font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors">Yesterday</div>
          <div className="px-3 py-2 text-[13px] font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors">May 25, 2026</div>
        </div>

        <div className="mt-auto space-y-1 pt-6 border-t border-gray-200/60">
          <button className="w-full text-left px-3 py-2 text-[13px] text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded-lg transition-colors font-medium flex items-center gap-2">
            <span className="material-symbols-outlined text-[16px]">settings</span> Settings
          </button>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════
          MAIN CONTINUOUS LOG CHAT
          ════════════════════════════════════════════════════════ */}
      <div className="flex-1 flex flex-col relative bg-white">
        
        {/* Scrollable Chat Area with invisible scrollbars */}
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto px-4 md:px-12 lg:px-24 py-8 z-10 relative scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        >
          <div className="w-full px-8 space-y-8 pb-12">
            
            {/* Timestamp Divider */}
            <div className="flex items-center gap-4 py-4">
              <div className="h-px bg-gray-200 flex-1"></div>
              <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest bg-gray-50 px-3 py-1 rounded-full border border-gray-200">09:14 AM - User Request</span>
              <div className="h-px bg-gray-200 flex-1"></div>
            </div>

            {/* Event: User Query */}
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-white border border-gray-300 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-gray-600 text-[20px]">person</span>
              </div>
              <div className="flex-1">
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="font-bold text-sm text-gray-900">User</span>
                </div>
                <div className="bg-gray-100 p-4 rounded-2xl rounded-tl-none border border-gray-200 text-sm leading-relaxed inline-block text-gray-800 shadow-sm">
                  Student just failed the Kinematics mock test. Specifically struggling with relative velocity. How should we intervene?
                </div>
              </div>
            </div>

            {/* Event: Agent Deliberation */}
            <div className="flex items-start gap-4 ml-8">
              <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 border border-blue-200 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[16px]">bolt</span>
              </div>
              <div className="flex-1">
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="font-bold text-sm text-blue-600">Physics Agent</span>
                  <span className="text-[10px] text-gray-500 font-mono">09:14:02 AM</span>
                </div>
                <div className="text-sm text-gray-700 leading-relaxed">
                  I reviewed the test. The mathematical approach is correct, but they are messing up the sign conventions when frames of reference switch. I suggest a 10-minute visual simulator exercise.
                </div>
              </div>
            </div>

            <div className="flex items-start gap-4 ml-8">
              <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 border border-purple-200 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[16px]">calculate</span>
              </div>
              <div className="flex-1">
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="font-bold text-sm text-purple-600">Math Agent</span>
                  <span className="text-[10px] text-gray-500 font-mono">09:14:05 AM</span>
                </div>
                <div className="text-sm text-gray-700 leading-relaxed">
                  Agreed. The vector subtraction (Vab = Va - Vb) is being applied without directional context. I can generate 5 drill questions specifically on vector signs to reinforce this.
                </div>
              </div>
            </div>

            <div className="flex items-start gap-4 ml-8">
              <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 border border-orange-200 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[16px]">sports_esports</span>
              </div>
              <div className="flex-1">
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="font-bold text-sm text-orange-600">Gamification Agent</span>
                  <span className="text-[10px] text-gray-500 font-mono">09:14:08 AM</span>
                </div>
                <div className="text-sm text-gray-700 leading-relaxed">
                  Student's motivation dropped after the failure. We need to frame this intervention as a "Special Quest" rather than a remediation task to avoid tilting them further.
                </div>
              </div>
            </div>

            {/* Poll Initiated by Drona AI */}
            <div className="flex items-start gap-4 ml-8 mt-6">
              <div className="w-8 h-8 rounded-full bg-primary text-white border border-primary flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[16px]">smart_toy</span>
              </div>
              <div className="flex-1">
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="font-bold text-sm text-primary">Drona AI (Orchestrator)</span>
                  <span className="text-[10px] text-gray-500 font-mono">09:14:10 AM</span>
                </div>
                
                {/* Voting Component */}
                <div className="bg-white border border-gray-200 p-5 rounded-xl shadow-sm mb-2 w-full max-w-xl">
                  <div className="text-sm font-bold text-gray-900 mb-1 flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px] text-primary">poll</span> 
                    Action Plan Poll
                  </div>
                  <p className="text-xs text-gray-500 mb-4">Select the most optimal intervention method for the current student state.</p>
                  
                  <div className="space-y-3">
                    {/* Option 1 */}
                    <div className="border border-primary/30 bg-primary/5 rounded-lg p-3 relative overflow-hidden">
                      <div className="absolute left-0 top-0 bottom-0 w-[66%] bg-primary/10 z-0"></div>
                      <div className="relative z-10 flex items-center justify-between">
                        <span className="text-sm font-bold text-gray-800">Visual Simulator Quest</span>
                        <div className="flex items-center gap-1.5">
                          <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center border border-blue-200" title="Physics Agent">
                            <span className="material-symbols-outlined text-[12px]">bolt</span>
                          </div>
                          <div className="w-6 h-6 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center border border-orange-200" title="Gamification Agent">
                            <span className="material-symbols-outlined text-[12px]">sports_esports</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* Option 2 */}
                    <div className="border border-gray-200 rounded-lg p-3 relative overflow-hidden">
                      <div className="absolute left-0 top-0 bottom-0 w-[33%] bg-gray-100 z-0"></div>
                      <div className="relative z-10 flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">Math Drills (Vector Signs)</span>
                        <div className="flex items-center gap-1.5">
                          <div className="w-6 h-6 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center border border-purple-200" title="Math Agent">
                            <span className="material-symbols-outlined text-[12px]">calculate</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Accepted Terms */}
            <div className="ml-[4.5rem] border-l-2 border-green-400 pl-6 py-2 relative mt-4 mb-8">
              <div className="absolute -left-[13px] top-4 w-6 h-6 rounded-full bg-green-50 flex items-center justify-center border border-green-300 shadow-sm">
                <span className="material-symbols-outlined text-[14px] text-green-600">verified</span>
              </div>
              <div className="bg-green-50/50 border border-green-200/60 p-5 rounded-xl shadow-sm">
                <h4 className="text-[11px] font-bold text-green-800 mb-3 uppercase tracking-widest flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                  Accepted Terms (Consensus Reached)
                </h4>
                <ul className="text-sm text-gray-900 leading-relaxed space-y-2 list-disc list-inside marker:text-green-500">
                  <li><strong>Format:</strong> River-Boat Simulator mini-game.</li>
                  <li><strong>Core Focus:</strong> Visualizing frame-of-reference velocity vectors.</li>
                  <li><strong>Condition:</strong> Math agent will silently evaluate the vector math inputs in the background.</li>
                </ul>
              </div>
            </div>
            
            {/* Timestamp Divider */}
            <div className="flex items-center gap-4 py-4">
              <div className="h-px bg-gray-200 flex-1"></div>
              <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest bg-gray-50 px-3 py-1 rounded-full border border-gray-200">11:45 AM - System Event</span>
              <div className="h-px bg-gray-200 flex-1"></div>
            </div>

            {/* Add a fade out at the bottom to indicate more can be typed */}
          </div>
        </div>
      </div>
    </div>
  );
}
