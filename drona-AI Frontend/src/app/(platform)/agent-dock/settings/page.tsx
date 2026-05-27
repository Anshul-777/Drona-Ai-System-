"use client";

import { useState } from "react";

type CategoryId = "general" | "permissions" | "memory" | "prompts" | "agents" | "byok";

export default function AgentDockSettings() {
  const [activeCategory, setActiveCategory] = useState<CategoryId>("general");

  const categories: { id: CategoryId; label: string }[] = [
    { id: "general", label: "General (Personalized)" },
    { id: "permissions", label: "Permissions" },
    { id: "memory", label: "Memory" },
    { id: "prompts", label: "System Prompts" },
    { id: "agents", label: "Agent Registry" },
    { id: "byok", label: "BYOK (Connections)" }
  ];

  const [toggles, setToggles] = useState({
    vectorMemory: true,
    emotionalMemory: true,
  });

  const [activeProvider, setActiveProvider] = useState<string | null>(null);

  const toggleState = (key: keyof typeof toggles) => {
    setToggles(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const PROMPT_TEXT = "Analyze our entire chat history and summarize everything you know about me, my learning style, my strengths, weaknesses, and preferences in a structured bulleted list.";

  return (
    <div className="absolute inset-0 flex overflow-hidden bg-white text-gray-700 animate-[viewFadeIn_0.3s_ease]">
      
      {/* Left Sidebar - Fixed, No Scroll */}
      <div className="w-[260px] flex flex-col flex-shrink-0 py-6 px-3 border-r border-gray-200 bg-gray-50/50">
        <h2 className="px-3 text-lg font-black text-gray-900 mb-6 font-display tracking-tight">Settings</h2>
        
        <div className="space-y-1">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`w-full text-left px-3 py-2.5 text-[13px] rounded-lg transition-colors flex items-center justify-between group ${
                activeCategory === cat.id ? "bg-primary/10 text-primary font-bold shadow-sm" : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 font-medium"
              }`}
            >
              {cat.label}
              {activeCategory === cat.id && <span className="material-symbols-outlined text-[16px]">chevron_right</span>}
            </button>
          ))}
        </div>
        
        <div className="mt-8 mb-2 px-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Workspaces</div>
        <button className="w-full text-left px-3 py-2 text-[13px] text-gray-600 font-medium hover:bg-gray-100 hover:text-gray-900 rounded-lg transition-colors flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500"></div>
          Drona AI System
        </button>

        <div className="mt-auto space-y-1 pt-6 border-t border-gray-200/60">
          <button className="w-full text-left px-3 py-2 text-[13px] text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded-lg transition-colors font-medium flex items-center gap-2">
            <span className="material-symbols-outlined text-[16px]">keyboard</span> Shortcuts
          </button>
          <button className="w-full text-left px-3 py-2 text-[13px] text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded-lg transition-colors font-medium flex items-center gap-2">
            <span className="material-symbols-outlined text-[16px]">feedback</span> Provide Feedback
          </button>
        </div>
      </div>

      {/* Main Content Area - Scrollable */}
      <div className="flex-1 overflow-y-auto bg-white px-12 py-10 custom-scrollbar">
        <div className="w-full pb-20">
          
          {/* GENERAL SETTINGS (Get Personalized) */}
          {activeCategory === "general" && (
            <div className="space-y-8 animate-[viewFadeIn_0.3s_ease]">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2 font-display">Get Personalized</h3>
                <p className="text-sm text-gray-500 mb-8 max-w-2xl leading-relaxed">
                  Extract your memories, preferences, and learning styles from other AI agents you've used (like ChatGPT, Claude, or Gemini) and instantly personalize Drona AI to your exact needs.
                </p>
                
                {/* Step 1 */}
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 mb-6">
                  <h4 className="text-sm font-bold text-blue-900 mb-2 flex items-center gap-2">
                    <span className="bg-blue-200 text-blue-700 w-5 h-5 rounded-full flex items-center justify-center text-[10px]">1</span>
                    Copy Extraction Prompt
                  </h4>
                  <p className="text-xs text-blue-700 mb-4">Paste this prompt into your other AI assistant to extract your profile.</p>
                  <div className="flex items-center gap-3 bg-white p-3 rounded-lg border border-blue-100 shadow-sm">
                    <code className="text-xs text-gray-700 flex-1 truncate">{PROMPT_TEXT}</code>
                    <button className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-xs font-bold bg-blue-50 px-3 py-1.5 rounded-md transition-colors shrink-0">
                      <span className="material-symbols-outlined text-[14px]">content_copy</span> Copy
                    </button>
                  </div>
                </div>

                {/* Step 2 */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                      <span className="bg-gray-200 text-gray-700 w-5 h-5 rounded-full flex items-center justify-center text-[10px]">2</span>
                      Saved Preferences Contexts
                    </h4>
                    <button className="bg-primary hover:bg-primary/90 text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors shadow-sm flex items-center gap-2">
                      <span className="material-symbols-outlined text-[16px]">add</span> Add New Context
                    </button>
                  </div>

                  <div className="space-y-3">
                    <div className="p-4 rounded-xl border border-gray-200 bg-white shadow-sm flex items-start justify-between group hover:border-gray-300 transition-all">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center text-orange-600 border border-orange-100 shrink-0">
                          <span className="material-symbols-outlined">smart_toy</span>
                        </div>
                        <div>
                          <h5 className="text-sm font-bold text-gray-900">Claude 3.5 Sonnet Extraction</h5>
                          <p className="text-xs text-gray-500 mt-1 mb-2">Imported on October 24, 2026 • 12 KB</p>
                          <div className="flex gap-2">
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-gray-100 text-gray-600">Visual Learner</span>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-gray-100 text-gray-600">Needs Analogies</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-1.5 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-md transition-colors" title="Edit">
                          <span className="material-symbols-outlined text-[18px]">edit</span>
                        </button>
                        <button className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors" title="Delete">
                          <span className="material-symbols-outlined text-[18px]">delete</span>
                        </button>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl border border-gray-200 bg-white shadow-sm flex items-start justify-between group hover:border-gray-300 transition-all">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center text-green-600 border border-green-100 shrink-0">
                          <span className="material-symbols-outlined">chat</span>
                        </div>
                        <div>
                          <h5 className="text-sm font-bold text-gray-900">ChatGPT 4o Preferences</h5>
                          <p className="text-xs text-gray-500 mt-1 mb-2">Imported on September 12, 2026 • 8 KB</p>
                          <div className="flex gap-2">
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-gray-100 text-gray-600">Direct Answers</span>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-gray-100 text-gray-600">Late Night Study</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-1.5 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-md transition-colors" title="Edit">
                          <span className="material-symbols-outlined text-[18px]">edit</span>
                        </button>
                        <button className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors" title="Delete">
                          <span className="material-symbols-outlined text-[18px]">delete</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* MEMORY SETTINGS */}
          {activeCategory === "memory" && (
            <div className="space-y-8 animate-[viewFadeIn_0.3s_ease]">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2 font-display">Agent Memory</h3>
                <p className="text-sm text-gray-500 mb-8 max-w-2xl leading-relaxed">
                  Control how Drona AI stores, recalls, and decays information about your interactions over time.
                </p>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-5 rounded-xl bg-white border border-gray-200 shadow-sm">
                    <div className="pr-8">
                      <p className="text-sm text-gray-900 font-bold mb-1">Enable Long-Term Vector Memory</p>
                      <p className="text-xs text-gray-500 leading-relaxed">Allows the agent to semantically search past conversations weeks or months later to recall context.</p>
                    </div>
                    <button 
                      className={`w-[44px] h-[24px] rounded-full relative transition-colors duration-200 shrink-0 ${toggles.vectorMemory ? 'bg-primary' : 'bg-gray-300'}`}
                      onClick={() => toggleState('vectorMemory')}
                    >
                      <div className={`w-[18px] h-[18px] bg-white rounded-full absolute top-[3px] shadow transition-transform duration-200 ${toggles.vectorMemory ? 'translate-x-[23px]' : 'translate-x-[3px]'}`}></div>
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-5 rounded-xl bg-white border border-gray-200 shadow-sm">
                    <div className="pr-8">
                      <p className="text-sm text-gray-900 font-bold mb-1">Remember Emotional States & Moods</p>
                      <p className="text-xs text-gray-500 leading-relaxed">Agent will log frustration, excitement, and fatigue levels to adjust future teaching tone.</p>
                    </div>
                    <button 
                      className={`w-[44px] h-[24px] rounded-full relative transition-colors duration-200 shrink-0 ${toggles.emotionalMemory ? 'bg-primary' : 'bg-gray-300'}`}
                      onClick={() => toggleState('emotionalMemory')}
                    >
                      <div className={`w-[18px] h-[18px] bg-white rounded-full absolute top-[3px] shadow transition-transform duration-200 ${toggles.emotionalMemory ? 'translate-x-[23px]' : 'translate-x-[3px]'}`}></div>
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-5 rounded-xl bg-white border border-gray-200 shadow-sm">
                    <div className="pr-8">
                      <p className="text-sm text-gray-900 font-bold mb-1">Memory Decay Rate</p>
                      <p className="text-xs text-gray-500 leading-relaxed">Determines how quickly less important details are pruned from the vector database to save space.</p>
                    </div>
                    <select className="bg-gray-50 border border-gray-300 text-gray-900 text-xs font-medium px-4 py-2 rounded-lg outline-none focus:border-primary focus:ring-1 focus:ring-primary">
                      <option>Slow (Retain Everything)</option>
                      <option selected>Normal (Optimal)</option>
                      <option>Aggressive (Save Space)</option>
                    </select>
                  </div>
                </div>

                <div className="mt-8 pt-8 border-t border-gray-200">
                  <button className="flex items-center gap-2 text-red-600 font-bold text-sm hover:bg-red-50 px-4 py-2 rounded-lg transition-colors border border-transparent hover:border-red-100">
                    <span className="material-symbols-outlined text-[18px]">delete_forever</span> Clear All Agent Memory
                  </button>
                  <p className="text-xs text-gray-400 mt-2 ml-4">This action is irreversible and will reset the agent's understanding of you.</p>
                </div>
              </div>
            </div>
          )}

          {/* PROMPTS SETTINGS */}
          {activeCategory === "prompts" && (
            <div className="space-y-6 animate-[viewFadeIn_0.3s_ease]">
              <h3 className="text-2xl font-bold text-gray-900 mb-2 font-display">System Prompts</h3>
              <p className="text-sm text-gray-500 mb-8 max-w-2xl leading-relaxed">Customize the foundational instructions that dictate Drona AI's personality and rules of engagement.</p>
              
              <div className="p-6 rounded-xl bg-white border border-gray-200 shadow-sm w-full focus-within:border-primary/50 transition-colors">
                <p className="text-sm text-gray-900 font-bold mb-1">Global Master Instruction</p>
                <p className="text-xs text-gray-500 mb-4">This prompt is injected before all other context in every agent's thought process.</p>
                
                <textarea 
                  className="w-full h-48 bg-gray-50 border border-gray-200 rounded-lg p-4 text-sm text-gray-700 font-mono leading-relaxed outline-none focus:border-primary focus:ring-1 focus:ring-primary resize-y shadow-inner"
                  defaultValue={`You are Drona, a rigorous but empathetic AI tutor for competitive exam preparation (JEE, NEET). You never give direct answers. Instead, use Socratic questioning to guide the student toward understanding. Adapt your complexity based on the student's demonstrated level. Use analogies from everyday life. When the student is frustrated, acknowledge it before redirecting. Always track and reference prior sessions for continuity.`}
                ></textarea>
                <div className="flex justify-end mt-4">
                  <button className="bg-primary hover:bg-primary/90 text-white text-xs font-bold px-6 py-2.5 rounded-lg transition-colors shadow-sm">Save Prompt</button>
                </div>
              </div>
            </div>
          )}

          {/* AGENT REGISTRY */}
          {activeCategory === "agents" && (
            <div className="space-y-6 animate-[viewFadeIn_0.3s_ease]">
              <h3 className="text-2xl font-bold text-gray-900 mb-2 font-display">Agent Registry</h3>
              <p className="text-sm text-gray-500 mb-8 max-w-2xl leading-relaxed">
                The specialized sub-agents currently operating within your workspace. 
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                
                {/* Chemistry Agent */}
                <div className="relative p-6 rounded-2xl bg-gradient-to-br from-white to-green-50/30 border border-gray-200 shadow-sm hover:shadow-md transition-all overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-green-400/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:bg-green-400/20 transition-colors"></div>
                  
                  <div className="flex justify-between items-start mb-4 relative z-10">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-green-100 text-green-600 flex items-center justify-center shadow-inner">
                        <span className="material-symbols-outlined text-[24px]">science</span>
                      </div>
                      <div>
                        <h4 className="text-lg text-gray-900 font-bold">Chemistry</h4>
                        <span className="text-[10px] font-bold text-green-700 bg-green-100 px-2 py-0.5 rounded uppercase tracking-wider">Online</span>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-6 relative z-10">Specialist in Organic, Inorganic, Physical, and Electrochemistry. Equipped with molecular structure visualization tools.</p>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100 relative z-10">
                    <div className="flex gap-4">
                      <div className="flex flex-col">
                        <span className="text-lg font-black text-gray-900">98%</span>
                        <span className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Accuracy</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-lg font-black text-gray-900">42</span>
                        <span className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Sessions</span>
                      </div>
                    </div>
                    <button className="text-primary text-xs font-bold hover:underline">Configure</button>
                  </div>
                </div>

                {/* Physics Agent */}
                <div className="relative p-6 rounded-2xl bg-gradient-to-br from-white to-blue-50/30 border border-gray-200 shadow-sm hover:shadow-md transition-all overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-blue-400/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:bg-blue-400/20 transition-colors"></div>
                  
                  <div className="flex justify-between items-start mb-4 relative z-10">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shadow-inner">
                        <span className="material-symbols-outlined text-[24px]">bolt</span>
                      </div>
                      <div>
                        <h4 className="text-lg text-gray-900 font-bold">Physics</h4>
                        <span className="text-[10px] font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded uppercase tracking-wider">Online</span>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-6 relative z-10">Specialist in Mechanics, Optics, Thermodynamics, and Electromagnetism. Equipped with kinematics simulators.</p>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100 relative z-10">
                    <div className="flex gap-4">
                      <div className="flex flex-col">
                        <span className="text-lg font-black text-gray-900">95%</span>
                        <span className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Accuracy</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-lg font-black text-gray-900">56</span>
                        <span className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Sessions</span>
                      </div>
                    </div>
                    <button className="text-primary text-xs font-bold hover:underline">Configure</button>
                  </div>
                </div>

                {/* Math Agent */}
                <div className="relative p-6 rounded-2xl bg-gradient-to-br from-white to-purple-50/30 border border-gray-200 shadow-sm hover:shadow-md transition-all overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-purple-400/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:bg-purple-400/20 transition-colors"></div>
                  
                  <div className="flex justify-between items-start mb-4 relative z-10">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center shadow-inner">
                        <span className="material-symbols-outlined text-[24px]">calculate</span>
                      </div>
                      <div>
                        <h4 className="text-lg text-gray-900 font-bold">Mathematics</h4>
                        <span className="text-[10px] font-bold text-purple-700 bg-purple-100 px-2 py-0.5 rounded uppercase tracking-wider">Online</span>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-6 relative z-10">Specialist in Calculus, Algebra, Coordinate Geometry, and Probability. Equipped with graphing and solver tools.</p>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100 relative z-10">
                    <div className="flex gap-4">
                      <div className="flex flex-col">
                        <span className="text-lg font-black text-gray-900">99%</span>
                        <span className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Accuracy</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-lg font-black text-gray-900">89</span>
                        <span className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Sessions</span>
                      </div>
                    </div>
                    <button className="text-primary text-xs font-bold hover:underline">Configure</button>
                  </div>
                </div>

                {/* Gamification Agent */}
                <div className="relative p-6 rounded-2xl bg-gray-50 border border-gray-200 transition-all overflow-hidden opacity-70 grayscale">
                  <div className="flex justify-between items-start mb-4 relative z-10">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-gray-200 text-gray-500 flex items-center justify-center shadow-inner">
                        <span className="material-symbols-outlined text-[24px]">sports_esports</span>
                      </div>
                      <div>
                        <h4 className="text-lg text-gray-700 font-bold">Gamification</h4>
                        <span className="text-[10px] font-bold text-gray-500 bg-gray-200 px-2 py-0.5 rounded uppercase tracking-wider">Disabled</span>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-500 mb-6 relative z-10">Manages XP, Quests, and Achievements engine to maintain motivation.</p>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200 relative z-10">
                    <button className="bg-gray-800 text-white text-xs font-bold px-4 py-1.5 rounded hover:bg-gray-900 transition-colors shadow-sm w-full">Enable Agent</button>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* BYOK SETTINGS */}
          {activeCategory === "byok" && (
            <div className="space-y-6 animate-[viewFadeIn_0.3s_ease]">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2 font-display">Bring Your Own Key (BYOK)</h3>
                <p className="text-sm text-gray-500 mb-8 max-w-2xl leading-relaxed">
                  Provide your own API keys to power the Drona Multi-Agent system with specific foundation models.
                </p>

                <div className="space-y-4">
                  {/* Provider: OpenAI */}
                  <div className={`rounded-xl border transition-all overflow-hidden shadow-sm ${activeProvider === 'openai' ? 'border-primary ring-1 ring-primary' : 'border-gray-200 hover:border-gray-300'}`}>
                    <div 
                      className={`p-5 cursor-pointer flex items-center justify-between ${activeProvider === 'openai' ? 'bg-primary/5' : 'bg-white'}`}
                      onClick={() => setActiveProvider(activeProvider === 'openai' ? null : 'openai')}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-black flex items-center justify-center shrink-0">
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg"><path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.2157-2.1042 6.0028 6.0028 0 0 0-3.238-3.7925 5.9645 5.9645 0 0 0-4.6062-.3165 6.0289 6.0289 0 0 0-3.3283-1.8906 6.008 6.008 0 0 0-4.498.922 6.0354 6.0354 0 0 0-2.31 3.235A6.0224 6.0224 0 0 0 2.22 8.7844a5.986 5.986 0 0 0 .2144 2.1055 6.0028 6.0028 0 0 0 3.2393 3.7938 5.9593 5.9593 0 0 0 4.6075.3152 6.0315 6.0315 0 0 0 3.327 1.8893 6.008 6.008 0 0 0 4.4967-.922 6.0328 6.0328 0 0 0 2.3087-3.2363 6.0224 6.0224 0 0 0 1.8683-2.9088zm-11.3858 8.423a3.5414 3.5414 0 0 1-3.535-3.535v-1.157l1.01.5836 2.5276 1.4586v1.4928a2.1906 2.1906 0 0 0 2.1893 2.1893h1.4928l-1.4586 2.5276-1.01.5836a3.535 3.535 0 0 1-1.216.3565zm7.362-2.5855l-1.4586 2.5276-1.4928-2.5856.883-.5097 1.6447-.95 1.4928 2.5856a2.1906 2.1906 0 0 0 2.1893 2.1893h-1.4928a3.535 3.535 0 0 1-1.7656-.2572zM12 4.475a3.5414 3.5414 0 0 1 3.535 3.535v1.157l-1.01-.5836-2.5276-1.4586v-1.4928A2.1906 2.1906 0 0 0 9.8107 3.4426H8.318l1.4586-2.5276 1.01-.5836A3.535 3.535 0 0 1 12 4.475zM4.638 7.0605l1.4586-2.5276 1.4928 2.5856-.883.5097-1.6447.95-1.4928-2.5856a2.1906 2.1906 0 0 0-2.1893-2.1893h1.4928a3.535 3.535 0 0 1 1.7656.2572zm-1.0966 8.3582a3.5414 3.5414 0 0 1 0-7.0701h2.314l-1.01.5836-1.2638.7293a2.1906 2.1906 0 0 0-1.0947 1.8953v2.9856l2.5276 1.4586a3.535 3.535 0 0 1-1.473-.5823zm10.7486.273h-2.314l1.01-.5836 1.2638-.7293a2.1906 2.1906 0 0 0 1.0947-1.8953V9.4984l-2.5276-1.4586a3.535 3.535 0 0 1 1.473.5823v7.0701z" fill="currentColor"/></svg>
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-gray-900">OpenAI API</h4>
                          <p className="text-xs text-gray-500 mt-0.5">GPT-4o, GPT-3.5-Turbo</p>
                        </div>
                      </div>
                      
                      {/* Status Badges */}
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] text-green-700 bg-green-100 px-2 py-0.5 rounded font-bold uppercase tracking-wider">Valid Key</span>
                        <span className="material-symbols-outlined text-gray-400">
                          {activeProvider === 'openai' ? 'expand_less' : 'expand_more'}
                        </span>
                      </div>
                    </div>
                    
                    {/* Expanded Content */}
                    {activeProvider === 'openai' && (
                      <div className="p-5 border-t border-primary/20 bg-primary/5">
                        <div className="mb-4">
                          <label className="block text-xs font-bold text-gray-700 mb-1">API Key</label>
                          <div className="flex gap-2">
                            <input type="password" defaultValue="sk-proj-xxxxxxxxxxxxxxxxxxxx" className="flex-1 bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:border-primary focus:ring-1 focus:ring-primary outline-none" />
                            <button className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-lg text-sm font-bold shadow-sm transition-colors">Update</button>
                          </div>
                        </div>
                        
                        <div className="bg-white rounded-lg border border-gray-200 p-4 flex justify-between items-center shadow-sm">
                          <div>
                            <p className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Current Usage</p>
                            <p className="text-xl font-black text-gray-900">$12.40 <span className="text-sm text-gray-400 font-medium">/ $100 limit</span></p>
                          </div>
                          <button className="text-red-600 text-xs font-bold hover:underline">Revoke Key</button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Provider: Anthropic */}
                  <div className={`rounded-xl border transition-all overflow-hidden shadow-sm ${activeProvider === 'anthropic' ? 'border-primary ring-1 ring-primary' : 'border-gray-200 hover:border-gray-300'}`}>
                    <div 
                      className={`p-5 cursor-pointer flex items-center justify-between ${activeProvider === 'anthropic' ? 'bg-primary/5' : 'bg-white'}`}
                      onClick={() => setActiveProvider(activeProvider === 'anthropic' ? null : 'anthropic')}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-[#D97757] flex items-center justify-center shrink-0 text-white font-serif italic font-bold text-lg">
                          A
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-gray-900">Anthropic API</h4>
                          <p className="text-xs text-gray-500 mt-0.5">Claude 3.5 Sonnet, Haiku</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] text-gray-500 bg-gray-100 px-2 py-0.5 rounded font-bold uppercase tracking-wider">Not Connected</span>
                        <span className="material-symbols-outlined text-gray-400">
                          {activeProvider === 'anthropic' ? 'expand_less' : 'expand_more'}
                        </span>
                      </div>
                    </div>
                    
                    {/* Expanded Content */}
                    {activeProvider === 'anthropic' && (
                      <div className="p-5 border-t border-primary/20 bg-primary/5">
                        <div className="mb-2">
                          <label className="block text-xs font-bold text-gray-700 mb-1">API Key</label>
                          <div className="flex gap-2">
                            <input type="password" placeholder="sk-ant-api03-..." className="flex-1 bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:border-primary focus:ring-1 focus:ring-primary outline-none" />
                            <button className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-sm transition-colors">Connect</button>
                          </div>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">Your key is stored securely locally and only used for requests made from this machine.</p>
                      </div>
                    )}
                  </div>
                  
                  {/* Provider: Google */}
                  <div className={`rounded-xl border transition-all overflow-hidden shadow-sm ${activeProvider === 'google' ? 'border-primary ring-1 ring-primary' : 'border-gray-200 hover:border-gray-300'}`}>
                    <div 
                      className={`p-5 cursor-pointer flex items-center justify-between ${activeProvider === 'google' ? 'bg-primary/5' : 'bg-white'}`}
                      onClick={() => setActiveProvider(activeProvider === 'google' ? null : 'google')}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-blue-500 flex items-center justify-center shrink-0 text-white font-bold text-lg font-sans">
                          G
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-gray-900">Google AI Studio</h4>
                          <p className="text-xs text-gray-500 mt-0.5">Gemini 1.5 Pro, Flash</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] text-gray-500 bg-gray-100 px-2 py-0.5 rounded font-bold uppercase tracking-wider">Not Connected</span>
                        <span className="material-symbols-outlined text-gray-400">
                          {activeProvider === 'google' ? 'expand_less' : 'expand_more'}
                        </span>
                      </div>
                    </div>
                    
                    {/* Expanded Content */}
                    {activeProvider === 'google' && (
                      <div className="p-5 border-t border-primary/20 bg-primary/5">
                        <div className="mb-2">
                          <label className="block text-xs font-bold text-gray-700 mb-1">API Key</label>
                          <div className="flex gap-2">
                            <input type="password" placeholder="AIzaSy..." className="flex-1 bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:border-primary focus:ring-1 focus:ring-primary outline-none" />
                            <button className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-sm transition-colors">Connect</button>
                          </div>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">Your key is stored securely locally and only used for requests made from this machine.</p>
                      </div>
                    )}
                  </div>

                </div>
              </div>
            </div>
          )}

          {/* Fallbacks for permissions */}
          {activeCategory === "permissions" && (
            <div className="h-64 flex flex-col items-center justify-center text-gray-400 animate-[viewFadeIn_0.3s_ease]">
              <span className="material-symbols-outlined text-[48px] mb-4 opacity-50">security</span>
              <p className="text-sm font-bold text-gray-600">Permissions Module</p>
              <p className="text-xs mt-1">Configure which local directories agents can access.</p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
