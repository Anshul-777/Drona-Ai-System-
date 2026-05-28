"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";

interface Message {
  id: string;
  role: 'user' | 'drona';
  content: string;
  time: string;
  isNew?: boolean;
}

interface Session {
  id: string;
  title: string;
  updated_at: string;
}

const CustomImage = ({node, ...props}: any) => {
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    setImgLoaded(false);
    setImgError(false);
  }, [props?.src]);

  if (imgError) {
    return (
      <span className="relative block w-full max-w-sm mt-4 mb-4 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900 shadow-sm">
        <span className="block font-semibold">Image preview unavailable</span>
        <span className="block mt-1 text-[12px] text-amber-700">The image URL failed to load. Try again or open the source directly.</span>
      </span>
    );
  }

  return (
    <span className="relative block w-full max-w-sm mt-4 mb-4">
      {!imgLoaded && (
         <span className="block w-full rounded-2xl overflow-hidden relative border border-gray-200 shadow-sm aspect-video bg-[#f8f9fa]">
           <span className="absolute inset-0 bg-gradient-to-tr from-indigo-500/5 via-purple-500/5 to-pink-500/5 animate-[pulse_2s_ease-in-out_infinite]"></span>
           <span className="absolute inset-0 flex flex-col items-center justify-center gap-3">
             <span className="w-6 h-6 rounded-full border-[2px] border-indigo-200 border-t-indigo-600 animate-spin"></span>
             <span className="text-[10px] font-bold text-gray-400 tracking-[0.15em] uppercase">Visualizing</span>
           </span>
         </span>
      )}
      <img 
        className={`rounded-xl shadow-lg max-w-full h-auto border border-gray-100 transition-opacity duration-500 ${imgLoaded ? 'opacity-100 relative' : 'opacity-0 absolute inset-0'}`} 
        {...props} 
        onLoad={() => setImgLoaded(true)}
        onError={() => {
          setImgError(true);
          setImgLoaded(false);
        }}
        loading="eager"
        decoding="async"
      />
    </span>
  );
};

const markdownComponents = {
  h1: ({node, ...props}: any) => <h1 className="text-2xl font-bold mt-4 mb-2 text-black" {...props} />,
  h2: ({node, ...props}: any) => <h2 className="text-xl font-bold mt-4 mb-2 text-black" {...props} />,
  h3: ({node, ...props}: any) => <h3 className="text-lg font-bold mt-3 mb-2 text-black" {...props} />,
  p: ({node, ...props}: any) => <p className="mb-2 leading-relaxed" {...props} />,
  ul: ({node, ...props}: any) => <ul className="list-disc pl-5 mb-2 space-y-1" {...props} />,
  ol: ({node, ...props}: any) => <ol className="list-decimal pl-5 mb-2 space-y-1" {...props} />,
  strong: ({node, ...props}: any) => <strong className="font-bold text-black" {...props} />,
  code: ({node, inline, ...props}: any) => inline 
    ? <code className="bg-gray-100 px-1.5 py-0.5 rounded text-[13px] font-mono text-pink-600" {...props} />
    : <code className="block bg-gray-900 text-gray-100 p-4 rounded-lg my-3 font-mono text-[13px] overflow-x-auto" {...props} />,
  img: CustomImage,
};

const TypewriterText = ({ text, onComplete }: { text: string, onComplete: () => void }) => {
  const isImageResponse = text.includes('![') && text.includes('](');
  const [displayedText, setDisplayedText] = useState(isImageResponse ? text : "");
  const hasCompleted = useRef(false);
  
  useEffect(() => {
    if (hasCompleted.current) return;
    
    if (isImageResponse) {
       hasCompleted.current = true;
       onComplete();
       return;
    }
    
    let i = displayedText.length;
    const interval = setInterval(() => {
      setDisplayedText(text.slice(0, i + 3));
      i += 3;
      if (i >= text.length) {
        clearInterval(interval);
        if (!hasCompleted.current) {
          hasCompleted.current = true;
          onComplete();
        }
      }
    }, 5); 
    return () => clearInterval(interval);
  }, [text, isImageResponse, onComplete]); 

  return (
    <div className="flex flex-col relative w-full">
      <ReactMarkdown 
        remarkPlugins={[remarkGfm, remarkMath]} 
        rehypePlugins={[rehypeKatex]}
        components={markdownComponents}
      >
        {displayedText}
      </ReactMarkdown>
      {displayedText.length < text.length && (
        <span className="absolute bottom-1 right-[-10px] inline-block w-2 h-4 bg-black rounded-sm animate-pulse"></span>
      )}
    </div>
  );
};

export default function DronaChat() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const [hoveredChat, setHoveredChat] = useState<string | null>(null);
  const [showOptionsPopup, setShowOptionsPopup] = useState<string | null>(null);
  
  // Modes & Image State
  const [activeMode, setActiveMode] = useState('AI Chat');
  const [isModesVisible, setIsModesVisible] = useState(false);
  const [isImageMode, setIsImageMode] = useState(false);
  const [showPlusMenu, setShowPlusMenu] = useState(false);
  const modesTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // File Upload State
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Session State
  const [sessions, setSessions] = useState<Session[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [sidebarTab, setSidebarTab] = useState<'active' | 'archived' | 'trashed'>('active');
  const [editingSessionId, setEditingSessionId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [activeCommand, setActiveCommand] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const showModes = () => {
    setIsModesVisible(true);
    if (modesTimeoutRef.current) clearTimeout(modesTimeoutRef.current);
    modesTimeoutRef.current = setTimeout(() => {
      setIsModesVisible(false);
    }, 60000);
  };

  const fetchSessions = async (status = sidebarTab) => {
    try {
      const res = await fetch(`http://localhost:8000/api/sessions?status=${status}`);
      const data = await res.json();
      setSessions(data.sessions || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchSessions(sidebarTab);
  }, [sidebarTab]);

  const handleRename = async (id: string, newTitle: string) => {
    if (!newTitle.trim()) { setEditingSessionId(null); return; }
    await fetch(`http://localhost:8000/api/sessions/${id}/rename`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: newTitle })
    });
    setEditingSessionId(null);
    fetchSessions();
  };

  const handleStatusUpdate = async (id: string, status: string) => {
    await fetch(`http://localhost:8000/api/sessions/${id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    if (currentSessionId === id) {
       setMessages([]);
       setCurrentSessionId(null);
    }
    fetchSessions();
  };
  
  const handleShare = async (id: string) => {
    if (navigator.share) {
      navigator.share({
        title: 'Drona AI Chat',
        url: window.location.href
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const loadSession = async (id: string) => {
    setCurrentSessionId(id);
    setMessages([]);
    setIsThinking(true);
    try {
      const res = await fetch(`http://localhost:8000/api/sessions/${id}`);
      const data = await res.json();
      const loadedMessages = data.messages.map((m: any) => ({
        id: m.id,
        role: m.role,
        content: m.content,
        time: m.time,
        isNew: false
      }));
      setMessages(loadedMessages);
    } catch (err) {
      console.error(err);
    } finally {
      setIsThinking(false);
    }
  };

  const handleNewChat = () => {
    setCurrentSessionId(null);
    setMessages([]);
    setSelectedFile(null);
  };

  const handleDeleteSession = async (id: string) => {
    if (sidebarTab === 'trashed') {
      try {
        await fetch(`http://localhost:8000/api/sessions/${id}`, { method: 'DELETE' });
        if (currentSessionId === id) {
          setMessages([]);
          setCurrentSessionId(null);
        }
        fetchSessions();
      } catch (err) { console.error(err); }
    } else {
      await handleStatusUpdate(id, 'trashed');
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isThinking]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (messages.some(m => m.isNew)) {
        scrollToBottom();
      }
    }, 50);
    return () => clearInterval(interval);
  }, [messages]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
      setShowPlusMenu(false);
    }
  };

  const executeAIRequest = async (promptText: string, fileData: File | null = null) => {
    setIsThinking(true);
    let finalMessage = promptText;
    let willGenerateImage = isImageMode;
    
    if (promptText.startsWith("/image ")) {
      willGenerateImage = true;
      finalMessage = promptText.replace("/image ", "");
    }
    
    if (willGenerateImage) {
      finalMessage = "[FORCE_IMAGE_GENERATION] " + finalMessage;
    }
    
    setIsGeneratingImage(willGenerateImage);
    setIsModesVisible(false); 
    setIsImageMode(false); 
    setShowPlusMenu(false);

    let cmd = null;
    if (promptText.startsWith('/')) {
        cmd = promptText.split(' ')[0].substring(1).toUpperCase();
    } else if (isImageMode) {
        cmd = 'IMAGE';
    }
    setActiveCommand(cmd);

    try {
      let response;
      if (fileData) {
        const formData = new FormData();
        formData.append("message", finalMessage || "Please analyze this attached file.");
        if (currentSessionId) formData.append("session_id", currentSessionId);
        formData.append("file", fileData);

        response = await fetch("http://localhost:8000/api/chat/file", {
          method: "POST",
          body: formData
        });
      } else {
        response = await fetch("http://localhost:8000/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: finalMessage,
            session_id: currentSessionId
          })
        });
      }
      
      const data = await response.json();
      
      if (data.success) {
        const dronaMsg: Message = {
          id: data.message_id || (Date.now() + 1).toString(),
          role: 'drona',
          content: data.response,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isNew: true
        };
        setMessages(prev => [...prev, dronaMsg]);

        if (!currentSessionId) {
          setCurrentSessionId(data.session_id);
          fetchSessions();
        }
      } else {
        throw new Error(data.detail || "API Error");
      }
    } catch (err) {
      console.error(err);
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'drona',
        content: "I'm having trouble connecting to my cognitive core right now. Please ensure the Python backend is running on port 8000.",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isNew: true
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsThinking(false);
      setIsGeneratingImage(false);
    }
  };

  const handleSend = () => {
    if (!input.trim() && !selectedFile) return;
    
    const userMsgText = input.trim() || `[Attached File: ${selectedFile?.name}]`;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: userMsgText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setMessages(prev => [...prev, userMsg]);
    
    const promptToSend = input;
    const fileToSend = selectedFile;
    
    setInput("");
    setSelectedFile(null);
    executeAIRequest(promptToSend, fileToSend);
  };

  const handleRetry = (dronaMsgId: string) => {
    const index = messages.findIndex(m => m.id === dronaMsgId);
    if (index > 0) {
      const userMsg = messages[index - 1];
      // Slice the array to rollback chat history up to the message we are retrying
      setMessages(prev => prev.slice(0, index));
      executeAIRequest(userMsg.content, null); // Retrying without file for now
    }
  };

  const handleTypewriterComplete = (id: string) => {
    setMessages(prev => prev.map(m => m.id === id ? { ...m, isNew: false } : m));
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [input]);

  const filteredSessions = sessions.filter(s => (s.title || "").toLowerCase().includes(searchQuery.toLowerCase()));

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="flex w-full h-[calc(100vh-80px)] overflow-hidden bg-white relative font-sans" onClick={() => setShowPlusMenu(false)}>
      
      {/* Sidebar - Pure White */}
      <div className={`h-full bg-[#f9f9f9] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] flex flex-col shrink-0 ${sidebarOpen ? 'w-[260px]' : 'w-0 opacity-0'}`}>
        {sidebarOpen && (
          <div className="w-[260px] h-full flex flex-col overflow-hidden animate-[viewFadeIn_0.2s_ease-out_0.1s_both]">
            
            {/* Top Sidebar Actions */}
            <div className="p-3 pb-2 space-y-1">
              
              {/* Drona OS Branding */}
              <div className="flex items-center gap-3 px-3 py-3 mb-4 mt-2">
                <div className="w-8 h-8 rounded-xl bg-slate-900 flex items-center justify-center shadow-md">
                  <span className="material-symbols-outlined text-white text-[18px]">psychology</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[16px] font-bold text-slate-900 leading-tight">Drona Chat</span>
                  <span className="text-[9px] font-bold text-slate-500 tracking-widest uppercase">Intelligence OS</span>
                </div>
              </div>

              <div 
                className="flex items-center justify-between group hover:bg-[#ececec] px-3 py-2.5 rounded-lg cursor-pointer transition-colors text-black font-medium border border-transparent hover:border-gray-200"
                onClick={handleNewChat}
              >
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded bg-black text-white flex items-center justify-center">
                    <span className="material-symbols-outlined text-[14px]">add</span>
                  </div>
                  <span className="text-[14px]">New chat</span>
                </div>
              </div>
              
              {isSearching ? (
                <div className="px-3 py-1 mt-1 mb-2">
                  <input 
                    type="text" 
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Search chats..."
                    className="w-full bg-[#ececec] rounded-lg px-3 py-1.5 text-[13px] outline-none border border-gray-200"
                    autoFocus
                    onBlur={() => !searchQuery && setIsSearching(false)}
                  />
                </div>
              ) : (
                <div 
                  className="flex items-center gap-2 hover:bg-[#ececec] px-3 py-2.5 rounded-lg cursor-pointer transition-colors text-black font-medium"
                  onClick={() => setIsSearching(true)}
                >
                  <span className="material-symbols-outlined text-[18px] text-gray-500">search</span>
                  <span className="text-[14px]">Search chats</span>
                </div>
              )}

              {/* Sidebar Tabs */}
              <div className="flex items-center gap-1 mt-2 mb-1 border-b border-gray-200 pb-2 px-1">
                <div onClick={() => setSidebarTab('active')} className={`flex-1 text-center py-1 text-[11px] font-bold uppercase tracking-wider cursor-pointer rounded transition-colors ${sidebarTab === 'active' ? 'text-slate-900 bg-gray-200/50' : 'text-gray-400 hover:text-gray-600'}`}>Active</div>
                <div onClick={() => setSidebarTab('archived')} className={`flex-1 text-center py-1 text-[11px] font-bold uppercase tracking-wider cursor-pointer rounded transition-colors ${sidebarTab === 'archived' ? 'text-slate-900 bg-gray-200/50' : 'text-gray-400 hover:text-gray-600'}`}>Archive</div>
                <div onClick={() => setSidebarTab('trashed')} className={`flex-1 text-center py-1 text-[11px] font-bold uppercase tracking-wider cursor-pointer rounded transition-colors ${sidebarTab === 'trashed' ? 'text-red-600 bg-red-50' : 'text-gray-400 hover:text-gray-600'}`}>Trash</div>
              </div>
            </div>

            {/* Scrollable list */}
            <div className="flex-1 overflow-y-auto custom-scrollbar px-3 pb-20">
              
              <div className="mt-4 mb-2 px-3 text-[12px] font-semibold text-gray-500">Recents</div>
              <div className="space-y-0.5">
                {filteredSessions.map((session) => (
                  <div 
                    key={session.id} 
                    className={`group relative flex items-center justify-between hover:bg-[#ececec] px-3 py-2.5 rounded-lg cursor-pointer transition-colors text-black ${currentSessionId === session.id ? 'bg-[#ececec]' : ''}`}
                    onClick={() => loadSession(session.id)}
                    onMouseEnter={() => setHoveredChat(session.id)}
                    onMouseLeave={() => setHoveredChat(null)}
                  >
                    {editingSessionId === session.id ? (
                      <input 
                        type="text" 
                        value={editTitle} 
                        onChange={e => setEditTitle(e.target.value)}
                        onKeyDown={e => { if(e.key === 'Enter') handleRename(session.id, editTitle); }}
                        onBlur={() => handleRename(session.id, editTitle)}
                        autoFocus
                        className="w-full text-[13px] bg-white border border-blue-400 outline-none px-2 py-0.5 rounded"
                      />
                    ) : (
                      <span className="text-[13px] truncate pr-6">{session.title}</span>
                    )}
                    <div className={`absolute right-2 flex items-center gap-1 bg-gradient-to-l from-[#ececec] pl-2 ${hoveredChat === session.id || showOptionsPopup === session.id ? 'opacity-100' : 'opacity-0'}`}>
                      <span className="material-symbols-outlined text-[14px] text-gray-500 hover:text-black">push_pin</span>
                      <div className="relative">
                        <span 
                          className="material-symbols-outlined text-[14px] text-gray-500 hover:text-black"
                          onClick={(e) => { e.stopPropagation(); setShowOptionsPopup(showOptionsPopup === session.id ? null : session.id); }}
                        >
                          more_horiz
                        </span>
                        
                        {/* 3-Dot Options Popup */}
                        {showOptionsPopup === session.id && (
                          <div className="absolute top-full right-0 mt-1 w-44 bg-white border border-gray-200 rounded-lg shadow-[0_10px_30px_rgba(0,0,0,0.1)] z-50 py-1 font-medium text-[13px]">
                            <div className="px-3 py-2 flex items-center gap-2 hover:bg-gray-100 cursor-pointer" onClick={(e) => { e.stopPropagation(); handleShare(session.id); setShowOptionsPopup(null); }}><span className="material-symbols-outlined text-[16px]">share</span> Share</div>
                            <div className="px-3 py-2 flex items-center gap-2 hover:bg-gray-100 cursor-pointer" onClick={(e) => { e.stopPropagation(); setEditTitle(session.title); setEditingSessionId(session.id); setShowOptionsPopup(null); }}><span className="material-symbols-outlined text-[16px]">edit</span> Rename</div>
                            
                            {sidebarTab !== 'archived' && (
                                <div className="px-3 py-2 flex items-center gap-2 hover:bg-gray-100 cursor-pointer" onClick={(e) => { e.stopPropagation(); handleStatusUpdate(session.id, 'archived'); setShowOptionsPopup(null); }}><span className="material-symbols-outlined text-[16px]">archive</span> Archive</div>
                            )}
                            {sidebarTab === 'archived' && (
                                <div className="px-3 py-2 flex items-center gap-2 hover:bg-gray-100 cursor-pointer" onClick={(e) => { e.stopPropagation(); handleStatusUpdate(session.id, 'active'); setShowOptionsPopup(null); }}><span className="material-symbols-outlined text-[16px]">unarchive</span> Unarchive</div>
                            )}
                            
                            <div className="h-[1px] bg-gray-100 my-1"></div>
                            
                            {sidebarTab !== 'trashed' && (
                                <div className="px-3 py-2 flex items-center gap-2 hover:bg-red-50 text-red-600 cursor-pointer" onClick={(e) => { e.stopPropagation(); handleDeleteSession(session.id); setShowOptionsPopup(null); }}><span className="material-symbols-outlined text-[16px]">delete</span> Trash</div>
                            )}
                            {sidebarTab === 'trashed' && (
                                <div className="px-3 py-2 flex items-center gap-2 hover:bg-gray-100 cursor-pointer" onClick={(e) => { e.stopPropagation(); handleStatusUpdate(session.id, 'active'); setShowOptionsPopup(null); }}><span className="material-symbols-outlined text-[16px]">restore_from_trash</span> Restore</div>
                            )}
                            {sidebarTab === 'trashed' && (
                                <div className="px-3 py-2 flex items-center gap-2 hover:bg-red-50 text-red-600 cursor-pointer" onClick={(e) => { e.stopPropagation(); handleDeleteSession(session.id); setShowOptionsPopup(null); }}><span className="material-symbols-outlined text-[16px]">delete_forever</span> Delete Permanently</div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Profile */}
            <div className="absolute bottom-0 w-full p-3 bg-gradient-to-t from-[#f9f9f9] via-[#f9f9f9] to-transparent">
              <div className="flex items-center justify-between hover:bg-[#ececec] px-3 py-2 rounded-lg cursor-pointer transition-colors border border-gray-200/50 bg-white">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs uppercase shadow-sm">
                    AN
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[13px] font-semibold text-black">Anshul</span>
                  </div>
                </div>
                <span className="material-symbols-outlined text-[18px] text-gray-500">settings</span>
              </div>
            </div>
            
          </div>
        )}
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col relative h-full w-full bg-white">
        
        {/* Toggle Sidebar Button */}
        <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)} 
            className="w-10 h-10 rounded-lg flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors" 
          >
            <span className="material-symbols-outlined text-[20px]">left_panel_open</span>
          </button>
        </div>

        {/* New Chat Button */}
        {!sidebarOpen && (
          <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
             <button 
                onClick={handleNewChat}
                className="w-10 h-10 rounded-lg flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors" 
             >
               <span className="material-symbols-outlined text-[20px]">edit_square</span>
             </button>
          </div>
        )}

        {/* AI Mode Switcher (Floating Top Center) */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center">
          
          <div className={`transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] overflow-hidden flex items-center bg-[#212121] text-[#b4b4b4] rounded-b-2xl shadow-md text-[13px] font-medium border-b border-l border-r border-[#333] ${isModesVisible ? 'opacity-100 max-h-20 p-1 mb-0 transform-none' : 'opacity-0 max-h-0 p-0 mb-0 -translate-y-4 pointer-events-none'}`}>
            <div 
              className={`px-4 py-1.5 rounded-full cursor-pointer flex items-center gap-2 transition-all ${activeMode === 'AI Solver' ? 'bg-[#333] text-white' : 'hover:text-white'}`} 
              onClick={() => { setActiveMode('AI Solver'); showModes(); }}
            >
              <span className="material-symbols-outlined text-[16px]">function</span> AI Solver
            </div>
            <div 
              className={`px-4 py-1.5 rounded-full cursor-pointer flex items-center gap-2 transition-all ${activeMode === 'AI Visualizer' ? 'bg-[#333] text-white' : 'hover:text-white'}`} 
              onClick={() => { setActiveMode('AI Visualizer'); setIsImageMode(true); showModes(); }}
            >
              <span className="material-symbols-outlined text-[16px]">brush</span> AI Visualizer
            </div>
            <div 
              className={`px-4 py-1.5 rounded-full cursor-pointer flex items-center gap-2 transition-all ${activeMode === 'AI Chat' ? 'bg-[#333] text-white' : 'hover:text-white'}`} 
              onClick={() => { setActiveMode('AI Chat'); setIsImageMode(false); showModes(); }}
            >
              <span className="material-symbols-outlined text-[16px]">forum</span> AI Chat
            </div>
            <div className="h-4 w-[1px] bg-[#444] mx-1"></div>
            <div className="relative group px-4 py-1.5 cursor-pointer flex items-center gap-1 hover:text-white transition-all">
              <span className="material-symbols-outlined text-[20px]">keyboard_arrow_down</span>
            </div>
          </div>

          {!isModesVisible && (
            <button 
              onClick={showModes}
              className="w-12 h-6 rounded-b-xl bg-white border-b border-l border-r border-gray-200 text-gray-400 flex items-center justify-center hover:bg-gray-50 hover:text-gray-600 transition-colors shadow-sm animate-[viewFadeIn_0.3s_ease-out_0.2s_both]"
            >
              <span className="material-symbols-outlined text-[18px]">keyboard_arrow_down</span>
            </button>
          )}
        </div>

        {/* Empty State vs Chat Logs */}
        {messages.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center pb-32">
            <div className="w-16 h-16 rounded-2xl bg-slate-900 flex items-center justify-center shadow-lg mb-6 animate-[viewFadeIn_0.3s_ease-out]">
               <span className="material-symbols-outlined text-white text-[32px]">psychology</span>
            </div>
            <h1 className="text-3xl font-semibold text-gray-800 animate-[viewFadeIn_0.4s_ease-out]">What's on your mind today?</h1>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto px-4 w-full custom-scrollbar">
            <div className="max-w-4xl mx-auto py-10 space-y-6 pb-40">
              {messages.map((msg) => (
                <div key={msg.id} className="w-full flex flex-col">
                  {msg.role === 'user' ? (
                    <div className="flex flex-col items-end w-full group relative">
                      <div className="bg-[#f4f4f4] text-black px-4 py-2.5 rounded-[20px] max-w-[70%] z-10">
                        <p className="text-[14px] leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                      </div>
                      
                      {/* User Message Action Bar (Edit, Copy) */}
                      <div className="absolute -bottom-6 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                        <button className="flex items-center justify-center text-gray-400 hover:text-black hover:bg-gray-100 p-1 rounded-md transition-colors" title="Edit">
                          <span className="material-symbols-outlined text-[13px]">edit</span>
                        </button>
                        <button onClick={() => handleCopy(msg.content)} className="flex items-center justify-center text-gray-400 hover:text-black hover:bg-gray-100 p-1 rounded-md transition-colors" title="Copy">
                          <span className="material-symbols-outlined text-[13px]">content_copy</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex gap-4 w-full justify-start mt-2 group">
                      <div className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center flex-shrink-0 bg-white shadow-sm mt-1">
                        <span className="material-symbols-outlined text-black text-[18px]">psychology</span>
                      </div>
                      <div className="flex flex-col items-start w-full max-w-[85%]">
                        <div className="text-[15px] leading-relaxed text-gray-800 w-full mt-1">
                          {msg.isNew ? (
                            <TypewriterText text={msg.content} onComplete={() => handleTypewriterComplete(msg.id)} />
                          ) : (
                            <>
                              <ReactMarkdown 
                                remarkPlugins={[remarkGfm, remarkMath]} 
                                rehypePlugins={[rehypeKatex]}
                                components={markdownComponents}
                              >
                                {msg.content}
                              </ReactMarkdown>
                              
                              {/* AI Message Action Bar (Copy, Retry, More) */}
                              <div className="flex items-center gap-1 mt-5 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => handleCopy(msg.content)} className="flex items-center justify-center text-gray-400 hover:text-black hover:bg-gray-100 p-1.5 rounded-lg transition-colors" title="Copy">
                                  <span className="material-symbols-outlined text-[14px]">content_copy</span>
                                </button>
                                <button onClick={() => handleRetry(msg.id)} className="flex items-center justify-center text-gray-400 hover:text-black hover:bg-gray-100 p-1.5 rounded-lg transition-colors" title="Retry generation">
                                  <span className="material-symbols-outlined text-[14px]">refresh</span>
                                </button>
                                <button className="flex items-center justify-center text-gray-400 hover:text-black hover:bg-gray-100 p-1.5 rounded-lg transition-colors" title="More options">
                                  <span className="material-symbols-outlined text-[14px]">more_horiz</span>
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
              
              {isThinking && (
                <div className="flex gap-4 w-full justify-start mt-2">
                  <div className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center flex-shrink-0 bg-white shadow-sm mt-1">
                    <span className="material-symbols-outlined text-black text-[18px]">psychology</span>
                  </div>
                  <div className="flex flex-col w-full max-w-[85%]">
                    {activeCommand ? (
                      <div className="flex items-center gap-2 mt-2 px-1">
                        <span className="w-4 h-4 rounded-full border-2 border-indigo-200 border-t-indigo-600 animate-spin"></span>
                        <span className="text-[10px] font-bold text-gray-400 tracking-[0.15em] uppercase">{activeCommand}ING...</span>
                      </div>
                    ) : (
                      /* 3 Dots Loader */
                      <div className="flex items-center gap-1.5 h-8 mt-1 px-2">
                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-[bounce_1s_infinite_0ms]"></div>
                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-[bounce_1s_infinite_200ms]"></div>
                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-[bounce_1s_infinite_400ms]"></div>
                      </div>
                    )}
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>
        )}

        {/* Floating Input Area (Pill Design) */}
        <div className={`absolute left-0 right-0 px-4 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] z-20 ${messages.length === 0 ? 'top-1/2 -translate-y-1/2 mt-28' : 'bottom-0 pb-1'}`}>
          
          {isImageMode && (
            <div className="max-w-3xl mx-auto mb-2 flex items-center">
              <div className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-[12px] font-semibold px-3 py-1.5 rounded-full flex items-center gap-2 shadow-sm animate-[viewFadeIn_0.2s_ease-out]">
                <span>🎨 Image Generation Mode</span>
                <button onClick={() => setIsImageMode(false)} className="hover:bg-white/20 rounded-full p-0.5 transition-colors flex items-center justify-center">
                  <span className="material-symbols-outlined text-[14px]">close</span>
                </button>
              </div>
            </div>
          )}

          {/* Attached File Preview Chip */}
          {selectedFile && (
            <div className="max-w-3xl mx-auto mb-2 flex items-center animate-[viewFadeIn_0.2s_ease-out]">
              <div className="bg-white border border-gray-200 shadow-sm text-gray-800 text-[13px] font-medium px-3 py-2 rounded-xl flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-indigo-600">
                  <span className="material-symbols-outlined text-[18px]">insert_drive_file</span>
                </div>
                <div className="flex flex-col max-w-[200px]">
                  <span className="truncate">{selectedFile.name}</span>
                  <span className="text-[10px] text-gray-500 uppercase tracking-widest">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</span>
                </div>
                <button onClick={() => setSelectedFile(null)} className="ml-2 w-6 h-6 hover:bg-gray-100 rounded-full flex items-center justify-center text-gray-500 hover:text-red-500 transition-colors">
                  <span className="material-symbols-outlined text-[16px]">close</span>
                </button>
              </div>
            </div>
          )}
          
          <div className="max-w-3xl mx-auto bg-[#f4f4f4] rounded-[26px] flex flex-col pt-1 pb-1 shadow-sm focus-within:bg-[#f0f0f0] transition-colors relative">
            
            <div className="flex items-end px-2 pt-1">
              
              {/* Plus Menu inside the pill */}
              <div className="relative shrink-0 mb-1">
                
                {/* Hidden File Input */}
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileChange} 
                  className="hidden" 
                  aria-label="Attach a file"
                  title="Attach a file"
                  accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt"
                />

                <button 
                  onClick={(e) => { e.stopPropagation(); setShowPlusMenu(!showPlusMenu); }}
                  className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${showPlusMenu ? 'bg-black text-white' : 'text-gray-500 hover:text-black hover:bg-gray-200'}`}
                  title="Attach Menu"
                >
                  <span className={`material-symbols-outlined text-[24px] transition-transform duration-300 ${showPlusMenu ? 'rotate-45' : ''}`}>add</span>
                </button>
                
                {/* Advanced Menu Options */}
                {showPlusMenu && (
                  <div className="absolute bottom-full left-0 mb-3 w-56 bg-white border border-gray-200 rounded-2xl shadow-xl overflow-hidden animate-[viewFadeIn_0.1s_ease-out] z-30 py-2 origin-bottom-left">
                    <div 
                      className="px-4 py-2.5 flex items-center gap-3 hover:bg-gray-50 cursor-pointer transition-colors text-gray-700 font-medium text-[13px]"
                      onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                    >
                      <span className="material-symbols-outlined text-[18px]">attach_file</span> Add photos & files
                    </div>
                    <div className="px-4 py-2.5 flex items-center justify-between hover:bg-gray-50 cursor-pointer transition-colors text-gray-700 font-medium text-[13px]">
                      <div className="flex items-center gap-3"><span className="material-symbols-outlined text-[18px]">history</span> Recent files</div>
                      <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                    </div>
                    
                    <div className="h-[1px] bg-gray-100 my-1 mx-4"></div>
                    
                    <div 
                      className="px-4 py-2.5 flex items-center gap-3 hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsImageMode(true);
                        setShowPlusMenu(false);
                      }}
                    >
                      <span className="text-[18px]">🎨</span> 
                      <span className="text-[13px] font-semibold text-gray-800">Create image</span>
                    </div>
                    
                    <div className="px-4 py-2.5 flex items-center gap-3 hover:bg-gray-50 cursor-pointer transition-colors text-gray-700 font-medium text-[13px]">
                      <span className="text-[18px]">🧠</span> Thinking
                    </div>
                    
                    <div className="px-4 py-2.5 flex items-center gap-3 hover:bg-gray-50 cursor-pointer transition-colors text-gray-700 font-medium text-[13px]">
                      <span className="text-[18px]">🔭</span> Deep research
                    </div>
                    
                    <div className="px-4 py-2.5 flex items-center gap-3 hover:bg-gray-50 cursor-pointer transition-colors text-gray-700 font-medium text-[13px]">
                      <span className="material-symbols-outlined text-[18px]">travel_explore</span> Web search
                    </div>
                  </div>
                )}
              </div>
              
              {/* Highlight Overlay and Textarea */}
              <div className="relative flex-1 min-h-[36px] max-h-[200px] mb-0.5">
                {/* Highlighted text overlay */}
                <div 
                  className="absolute inset-0 px-3 py-2 text-[14.5px] pointer-events-none whitespace-pre-wrap break-words custom-scrollbar overflow-y-auto"
                  style={{ maxHeight: textareaRef.current?.style.height || 'auto' }}
                >
                  {(() => {
                    if (input.startsWith('/')) {
                      const spaceIdx = input.indexOf(' ');
                      if (spaceIdx === -1) {
                        return <span className="text-blue-500 font-semibold bg-blue-50 rounded px-1">{input}</span>;
                      }
                      return (
                        <>
                          <span className="text-blue-500 font-semibold bg-blue-50 rounded px-1">{input.slice(0, spaceIdx)}</span>
                          <span className="text-transparent">{input.slice(spaceIdx)}</span>
                        </>
                      );
                    }
                    return <span className="text-transparent">{input}</span>;
                  })()}
                </div>
                
                <textarea 
                  ref={textareaRef}
                  value={input}
                  onChange={handleInputChange}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  placeholder="Message Drona..."
                  className="absolute inset-0 w-full h-full bg-transparent border-none focus:ring-0 resize-none text-[14.5px] text-black placeholder:text-gray-500 px-3 py-2 outline-none custom-scrollbar"
                  style={{ color: input.startsWith('/') ? 'transparent' : 'black', caretColor: 'black' }}
                  rows={1}
                />
              </div>

              <div className="flex items-center gap-1 shrink-0 mb-1 px-1">
                {input.trim() || selectedFile ? (
                  <button 
                    onClick={handleSend}
                    disabled={isThinking}
                    className="w-9 h-9 rounded-full bg-slate-900 text-white flex items-center justify-center hover:bg-black transition-colors shadow-sm"
                  >
                    <span className="material-symbols-outlined text-[18px]">arrow_upward</span>
                  </button>
                ) : (
                  <button 
                    onClick={() => setIsListening(!isListening)}
                    className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${isListening ? 'bg-red-100 text-red-500' : 'text-gray-500 hover:text-black hover:bg-gray-200'}`}
                  >
                    <span className="material-symbols-outlined text-[20px]">mic</span>
                  </button>
                )}
              </div>
            </div>
          </div>
          
          <div className={`text-center mt-2.5 transition-opacity duration-500 ${messages.length === 0 ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            <span className="text-[11.5px] text-gray-400 font-medium tracking-wide">Drona AI can make mistakes. Consider verifying important information.</span>
          </div>
        </div>

      </div>

    </div>
  );
}