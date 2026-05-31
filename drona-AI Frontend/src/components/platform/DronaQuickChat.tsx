"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";

export default function DronaQuickChat() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<{ role: "user" | "drona"; text: string }[]>([
    {
      role: "drona",
      text: "Drona AI online. I'm your cognitive co-pilot. Ask me anything or launch the full terminal for a deep session.",
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        // Don't close if clicking the FAB itself
        const fab = document.getElementById("drona-quick-fab");
        if (fab && fab.contains(e.target as Node)) return;
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  const sendMessage = async () => {
    const trimmed = message.trim();
    if (!trimmed) return;
    setMessage("");
    setMessages((prev) => [...prev, { role: "user", text: trimmed }]);
    setIsTyping(true);

    // Simulate a quick AI response — replace with actual API call
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: "drona",
          text: "Understood. For a full analytical session with context-aware responses, switch to the Drona terminal. Quick answers incoming from my knowledge base.",
        },
      ]);
      setIsTyping(false);
    }, 1400);
  };

  return (
    <>
      {/* ── Floating Panel ── */}
      <div
        ref={panelRef}
        className={`fixed bottom-[92px] right-5 w-[360px] z-[9998] transition-all duration-300 ${
          open
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 translate-y-4 pointer-events-none"
        }`}
      >
        <div
          className="relative flex flex-col overflow-hidden"
          style={{
            borderRadius: "1.5rem",
            background: "rgba(10, 10, 18, 0.97)",
            border: "1px solid rgba(201, 168, 76, 0.25)",
            boxShadow:
              "0 24px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(201,168,76,0.08), 0 0 60px rgba(201,168,76,0.05) inset",
            backdropFilter: "blur(20px)",
          }}
        >
          {/* Subtle top accent */}
          <div
            className="absolute top-0 left-0 right-0 h-px"
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(201,168,76,0.6), transparent)",
            }}
          />

          {/* Header */}
          <div
            className="flex items-center justify-between px-5 py-4"
            style={{
              borderBottom: "1px solid rgba(201,168,76,0.12)",
              background: "rgba(201,168,76,0.04)",
            }}
          >
            <div className="flex items-center gap-3">
              {/* Drona Icon */}
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center relative"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(201,168,76,0.3), rgba(201,168,76,0.1))",
                  border: "1.5px solid rgba(201,168,76,0.4)",
                  boxShadow: "0 0 20px rgba(201,168,76,0.2)",
                }}
              >
                <span
                  className="material-symbols-outlined text-[18px]"
                  style={{
                    color: "#c9a84c",
                    fontVariationSettings: "'FILL' 1",
                  }}
                >
                  bolt
                </span>
                {/* Online pulse */}
                <span
                  className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 animate-pulse"
                  style={{
                    background: "#22c55e",
                    borderColor: "rgba(10,10,18,1)",
                  }}
                />
              </div>

              <div>
                <p
                  className="text-white font-black text-sm tracking-[0.15em] uppercase"
                  style={{ letterSpacing: "0.12em" }}
                >
                  Drona AI
                </p>
                <p className="text-[9px] font-bold text-green-400 uppercase tracking-widest">
                  • Active
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Link
                href="/drona"
                className="flex items-center gap-1 text-[9px] font-black uppercase tracking-widest transition-colors"
                style={{ color: "rgba(201,168,76,0.7)" }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = "#c9a84c")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = "rgba(201,168,76,0.7)")
                }
              >
                Full Mode
                <span className="material-symbols-outlined text-[11px]">
                  open_in_new
                </span>
              </Link>
              <button
                onClick={() => setOpen(false)}
                className="w-7 h-7 rounded-xl flex items-center justify-center transition-all"
                style={{ background: "rgba(255,255,255,0.05)" }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "rgba(255,255,255,0.1)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "rgba(255,255,255,0.05)")
                }
              >
                <span
                  className="material-symbols-outlined text-[13px]"
                  style={{ color: "rgba(255,255,255,0.4)" }}
                >
                  close
                </span>
              </button>
            </div>
          </div>

          {/* Messages */}
          <div
            className="flex-1 overflow-y-auto p-4 space-y-3"
            style={{
              maxHeight: "260px",
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {msg.role === "drona" && (
                  <div
                    className="w-5 h-5 rounded-full flex items-center justify-center mr-2 mt-0.5 shrink-0"
                    style={{
                      background: "rgba(201,168,76,0.2)",
                      border: "1px solid rgba(201,168,76,0.3)",
                    }}
                  >
                    <span
                      className="material-symbols-outlined text-[10px]"
                      style={{
                        color: "#c9a84c",
                        fontVariationSettings: "'FILL' 1",
                      }}
                    >
                      bolt
                    </span>
                  </div>
                )}
                <div
                  className="max-w-[78%] px-3.5 py-2.5 text-[12px] font-medium leading-relaxed"
                  style={{
                    borderRadius:
                      msg.role === "user"
                        ? "1rem 1rem 0.2rem 1rem"
                        : "1rem 1rem 1rem 0.2rem",
                    background:
                      msg.role === "user"
                        ? "linear-gradient(135deg, #c9a84c, #b3923a)"
                        : "rgba(255,255,255,0.07)",
                    color:
                      msg.role === "user" ? "#0a0a12" : "rgba(255,255,255,0.75)",
                    border:
                      msg.role === "user"
                        ? "none"
                        : "1px solid rgba(255,255,255,0.08)",
                    fontWeight: msg.role === "user" ? 700 : 500,
                  }}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {isTyping && (
              <div className="flex justify-start items-center gap-2">
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                  style={{
                    background: "rgba(201,168,76,0.2)",
                    border: "1px solid rgba(201,168,76,0.3)",
                  }}
                >
                  <span
                    className="material-symbols-outlined text-[10px]"
                    style={{
                      color: "#c9a84c",
                      fontVariationSettings: "'FILL' 1",
                    }}
                  >
                    bolt
                  </span>
                </div>
                <div
                  className="flex items-center gap-1 px-3.5 py-2.5"
                  style={{
                    background: "rgba(255,255,255,0.07)",
                    borderRadius: "1rem 1rem 1rem 0.2rem",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}
                >
                  {[0, 1, 2].map((j) => (
                    <div
                      key={j}
                      className="w-1.5 h-1.5 rounded-full animate-bounce"
                      style={{
                        background: "#c9a84c",
                        animationDelay: `${j * 150}ms`,
                        animationDuration: "800ms",
                      }}
                    />
                  ))}
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div
            className="p-3 flex items-center gap-2"
            style={{
              borderTop: "1px solid rgba(255,255,255,0.07)",
              background: "rgba(255,255,255,0.02)",
            }}
          >
            <input
              ref={inputRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
              placeholder="Ask Drona anything..."
              className="flex-1 text-[12px] text-white placeholder:text-white/25 focus:outline-none bg-transparent"
              style={{
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "0.75rem",
                padding: "0.6rem 1rem",
                transition: "border-color 0.2s",
              }}
              onFocus={(e) =>
                (e.target.style.borderColor = "rgba(201,168,76,0.5)")
              }
              onBlur={(e) =>
                (e.target.style.borderColor = "rgba(255,255,255,0.1)")
              }
            />
            <button
              onClick={sendMessage}
              disabled={!message.trim()}
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all"
              style={{
                background: message.trim()
                  ? "linear-gradient(135deg, #c9a84c, #b3923a)"
                  : "rgba(255,255,255,0.06)",
                cursor: message.trim() ? "pointer" : "not-allowed",
                opacity: message.trim() ? 1 : 0.4,
                boxShadow: message.trim()
                  ? "0 4px 16px rgba(201,168,76,0.3)"
                  : "none",
              }}
            >
              <span
                className="material-symbols-outlined text-[16px]"
                style={{
                  color: message.trim() ? "#0a0a12" : "rgba(255,255,255,0.4)",
                  fontVariationSettings: "'FILL' 1",
                }}
              >
                send
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* ── FAB Button ── */}
      <button
        id="drona-quick-fab"
        onClick={() => setOpen((prev) => !prev)}
        className="fixed bottom-5 right-5 z-[9999] w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 group"
        style={{
          background: open
            ? "rgba(30,20,10,0.9)"
            : "linear-gradient(135deg, #c9a84c 0%, #a07835 100%)",
          border: open ? "1.5px solid rgba(201,168,76,0.4)" : "none",
          boxShadow: open
            ? "0 0 0 1px rgba(201,168,76,0.2), 0 8px 32px rgba(0,0,0,0.5)"
            : "0 8px 32px rgba(201,168,76,0.35), 0 2px 8px rgba(0,0,0,0.3)",
        }}
        title={open ? "Close Drona AI" : "Open Drona AI"}
      >
        <span
          className="material-symbols-outlined text-[24px] transition-all duration-300"
          style={{
            color: open ? "#c9a84c" : "#0a0a12",
            fontVariationSettings: "'FILL' 1",
            transform: open ? "rotate(45deg)" : "rotate(0deg)",
          }}
        >
          bolt
        </span>

        {/* Online indicator — only when closed */}
        {!open && (
          <span
            className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-[2.5px] animate-pulse"
            style={{
              background: "#22c55e",
              borderColor: "#fff",
            }}
          />
        )}

        {/* Tooltip */}
        <span
          className="absolute right-[calc(100%+12px)] top-1/2 -translate-y-1/2 text-[10px] font-black uppercase tracking-widest whitespace-nowrap px-3 py-1.5 rounded-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          style={{
            background: "rgba(10,10,18,0.95)",
            border: "1px solid rgba(201,168,76,0.3)",
            color: "#c9a84c",
          }}
        >
          Drona AI
        </span>
      </button>
    </>
  );
}
