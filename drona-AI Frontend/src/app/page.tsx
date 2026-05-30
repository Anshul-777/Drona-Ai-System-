"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const rotorData = [
  { tag: "PTR", t: "Next-paper guidance", d: "Smarter mock training with realistic difficulty patterns.", img: "1606326608606-aa0b62935f2b" },
  { tag: "ACA", t: "Smart academic search", d: "Find the right concept fast—without generic noise.", img: "1456513080510-7bf3a84b82f8" },
  { tag: "FLS", t: "Flashcards that stick", d: "Spaced revision tied to your mastery progress.", img: "1532153975070-2e9ab71f1b14" },
  { tag: "AUD", t: "Audio micro-lessons", d: "Podcast-style explainers for calm, repeatable learning.", img: "1478737270239-2f02b77fc618" },
  { tag: "VID", t: "Video studio snippets", d: "Short micro-lessons for fast revision cycles.", img: "1574717024653-61fd2cf4d44d" },
  { tag: "MAP", t: "Concept mapping", d: "Interactive connections to strengthen your mental model.", img: "1635070041078-e363dbe005cb" },
  { tag: "DSP", t: "Diagram clarity", d: "Turn complexity into structured visuals you can revisit.", img: "1499209974431-9dddcece7f88" },
  { tag: "TONE", t: "Coaching tone options", d: "Choose the learning style that suits your mindset.", img: "1456735190827-d1262f71b8a3" },
  { tag: "NOTE", t: "Knowledge vault", d: "Organize what you learn and retrieve it quickly.", img: "1509228468518-180dd4864904" },
  { tag: "PLAN", t: "Personal learning plans", d: "A consistent schedule that supports your goals.", img: "1506784983877-45594efa4cbe" },
];

const faqs = [
  { q: "What makes DRONA different from generic learning tools?", a: "DRONA is built as a complete learning experience—structured teaching, environment-based practice, and progress that carries forward across your entire journey." },
  { q: "Is the free experience really usable?", a: "Yes—Seeker is designed for genuine practice. You get core learning flow and progress visibility without pressure or setup complexity." },
  { q: "Can I customize how the learning feels?", a: "Yes. DRONA supports different coaching styles and lesson depth preferences so the experience matches the way you learn." },
  { q: "How does the test experience help me?", a: "After every mock, you receive targeted breakdown insights and next-step practice guidance—so attempts become smarter and outcomes improve." },
  { q: "Is my learning privacy secured?", a: "DRONA is designed with privacy in mind. Your learning experience stays under your control, and you can manage what’s stored in your learning workspace." }
];

type PageId = "home" | "env-main" | "env-test" | "env-game" | "env-workspace" | "env-resources" | "env-career";

export default function LandingPage() {
  const [activePage, setActivePage] = useState<PageId>("home");
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [faqOpenIndex, setFaqOpenIndex] = useState<number | null>(null);
  const [contactSuccess, setContactSuccess] = useState(false);

  // Contact form state
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // IntersectionObserver for reveal on scroll (SPA elements)
  useEffect(() => {
    if (activePage !== "home") return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
          }
        });
      },
      { threshold: 0.12 }
    );

    const reveals = document.querySelectorAll(".reveal");
    reveals.forEach((el) => observer.observe(el));

    return () => {
      reveals.forEach((el) => observer.unobserve(el));
    };
  }, [activePage]);

  const navigateTo = (target: PageId) => {
    setActivePage(target);
    setIsMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const to = "anshulrathod999@gmail.com";
    const fullSubject = `${formData.subject} — from ${formData.name}`;
    const body = `Name: ${formData.name}\nEmail: ${formData.email}\n\n${formData.message}`;
    const mailto = `mailto:${encodeURIComponent(to)}?subject=${encodeURIComponent(fullSubject)}&body=${encodeURIComponent(body)}`;

    setContactSuccess(true);
    setTimeout(() => {
      setContactSuccess(false);
    }, 2500);

    window.location.href = mailto;

    setTimeout(() => {
      setIsContactOpen(false);
    }, 350);

    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  const toggleFaq = (index: number) => {
    setFaqOpenIndex(faqOpenIndex === index ? null : index);
  };

  return (
    <div className="relative min-h-screen font-body-custom bg-[#fafaf8] text-[#0a0a0f]">
      {/* Navigation */}
      <nav className={`nav ${isScrolled ? "scrolled" : ""}`} id="nav">
        <div className="wrap nav-row">
          <a className="brand" onClick={() => navigateTo("home")}>
            <span className="brand-mark">D</span>
            <span>DRONA<sup style={{ fontSize: ".5em", color: "var(--accent)" }}>AI</sup></span>
          </a>
          <div className="nav-links">
            <a onClick={() => navigateTo("home")}>Overview</a>
            <a href="#features">Features</a>
            <a href="#environments">Environments</a>
            <a href="#agents">Agents</a>
            <a href="#journey">Journey</a>
            <a href="#pricing">Pricing</a>
            <a href="#about">About</a>
          </div>
          <div className="nav-cta">
            <button
              className={`nav-menu-btn ${isMenuOpen ? "open" : ""}`}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Open environments menu"
            >
              <span></span><span></span><span></span>
            </button>
            <div className={`nav-dropdown ${isMenuOpen ? "active" : ""}`} role="menu" aria-label="Environments menu">
              <div className="nav-dropdown-group">
                <div className="nav-dropdown-title">Environments</div>
                <a className="nav-dropdown-item" onClick={() => navigateTo("env-main")}>🎓 Main Learning</a>
                <a className="nav-dropdown-item" onClick={() => navigateTo("env-test")}>📝 Test & Exams</a>
                <a className="nav-dropdown-item" onClick={() => navigateTo("env-game")}>🎮 Game Arena</a>
                <a className="nav-dropdown-item" onClick={() => navigateTo("env-workspace")}>🗂️ Workspace</a>
                <a className="nav-dropdown-item" onClick={() => navigateTo("env-resources")}>🛠️ Resources</a>
                <a className="nav-dropdown-item" onClick={() => navigateTo("env-career")}>🚀 Career Path</a>
              </div>
              <div className="nav-dropdown-group">
                <div className="nav-dropdown-title">Account</div>
                <Link href="/login" className="nav-dropdown-item">Sign In</Link>
                <a className="nav-dropdown-item" onClick={() => { setIsContactOpen(true); setIsMenuOpen(false); }}>Get in Touch</a>
              </div>
            </div>
            <Link href="/login" className="btn btn-ghost">Sign In</Link>
            <Link href="/signup" className="btn btn-dark">
              Begin Assessment
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M13 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Home Page */}
      {activePage === "home" && (
        <div id="page-home" className="animate-fadeIn">
          {/* Hero */}
          <section className="hero">
            <div className="hero-bg">
              <div className="hero-grid"></div>
              <div className="hero-orb orb-1"></div>
              <div className="hero-orb orb-2"></div>
              <div className="hero-orb orb-3"></div>
              <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 w-full h-full">
                <defs>
                  <linearGradient id="lg1" x1="0" x2="1" y1="0" y2="1">
                    <stop offset="0" stopColor="#2a5cff" stopOpacity=".08" />
                    <stop offset="1" stopColor="#9b5de5" stopOpacity=".03" />
                  </linearGradient>
                </defs>
                <path d="M0,650 Q400,500 800,600 T1600,580 L1600,900 L0,900 Z" fill="url(#lg1)" />
                <path d="M0,720 Q400,620 800,700 T1600,680" stroke="#2a5cff" strokeWidth=".5" fill="none" opacity=".25" />
              </svg>
            </div>

            <div className="hero-inner wrap">
              <div className="hero-grid-2">
                <div>
                  <span className="kicker"><span className="dot"></span> A Premium Education Brand, Built for Mastery</span>
                  <h1 className="hero-title">
                    <span className="line"><span className="word">A</span> <span className="word" style={{ animationDelay: ".06s" }}><em>personal</em></span></span>
                    <span className="line"><span className="word" style={{ animationDelay: ".12s" }}>learning</span> <span className="word" style={{ animationDelay: ".18s" }}>faculty,</span></span>
                    <span className="line"><span className="word" style={{ animationDelay: ".24s" }}>ready</span> <span className="word" style={{ animationDelay: ".30s" }}><em>today.</em></span></span>
                  </h1>
                  <p className="hero-sub">DRONA AI is a world-class teaching experience for Indian competitive exams—six connected learning environments, built to help students remember more, panic less, and progress faster.</p>
                  <div className="hero-cta">
                    <Link href="/signup" className="btn btn-dark animate-pulse">
                      Start the Experience
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M5 12h14M13 5l7 7-7 7" />
                      </svg>
                    </Link>
                    <a className="btn btn-ghost" href="#features">Explore the Proof</a>
                  </div>
                  <div className="hero-meta">
                    <div className="m"><b>100+</b><span>Learning Modules</span></div>
                    <div className="m"><b>06</b><span>Environments</span></div>
                    <div className="m"><b>25+</b><span>Built-in Capabilities</span></div>
                    <div className="m"><b>∞</b><span>Progress Loop</span></div>
                  </div>
                </div>

                <div className="hero-visual" aria-hidden="true">
                  <div className="hero-photo">
                    <div className="hp-main">
                      <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=900&q=80&auto=format&fit=crop" alt="Students learning with AI" />
                      <div className="hp-badge"><span className="d"></span> Live Learning Experience</div>
                    </div>
                    <div className="hp-sub hp-sub-1">
                      <img src="https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=520&q=80&auto=format&fit=crop" alt="Learning dashboard" />
                    </div>
                    <div className="hp-sub hp-sub-2">
                      <img src="https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=520&q=80&auto=format&fit=crop" alt="Knowledge library" />
                    </div>
                    <div className="hp-card">
                      <div className="hp-row"><span className="hp-dot" style={{ backgroundColor: "#2a5cff" }}></span> Clarify Physics with precision</div>
                      <div className="hp-row"><span className="hp-dot" style={{ backgroundColor: "#00c896" }}></span> Master Mathematics with cadence</div>
                      <div className="hp-row"><span className="hp-dot" style={{ backgroundColor: "#ff4d2a" }}></span> Train for mocks with confidence</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Marquee */}
          <div className="marquee">
            <div className="marquee-track">
              <span>Instruction that</span><span>·</span><span><em>sticks</em></span><span>·</span><span><em>Personal</em></span><span>·</span><span>Performance</span><span>·</span>
              <span>Connected</span><span>·</span><span><em>Memory-led</em></span><span>·</span><span>Environment-based</span><span>·</span><span><em>Mastery loop</em></span><span>·</span>
              <span>Instruction that</span><span>·</span><span><em>sticks</em></span><span>·</span><span><em>Personal</em></span><span>·</span><span>Performance</span><span>·</span>
              <span>Connected</span><span>·</span><span><em>Memory-led</em></span><span>·</span><span>Environment-based</span><span>·</span><span><em>Mastery loop</em></span><span>·</span>
            </div>
          </div>

          {/* Features */}
          <section id="features">
            <div className="wrap">
              <div className="sec-head reveal">
                <div className="left">
                  <div className="num">— 01 / Mastery</div>
                  <h2>Capabilities designed<br />for <em>results</em>.</h2>
                </div>
                <div className="right">
                  <span className="eyebrow">Ten transformative pillars</span>
                  <p style={{ marginTop: "14px" }}>Every capability is built to feel like premium teaching: guided structure, confident explanations, and progress that stays consistent across your full journey.</p>
                </div>
              </div>

              <div className="top-feat reveal">
                <div className="card tf-1 tf-big">
                  <div>
                    <span className="num">01</span>
                    <div className="tag">TEACHING</div>
                    <h3>Signature Learning Faculty</h3>
                    <p>A coordinated learning experience that plans, clarifies, and continuously upgrades your lesson flow—so you stay focused on mastering, not guessing.</p>
                  </div>
                  <div style={{ marginTop: "auto", fontFamily: "var(--ff-mono)", fontSize: ".7rem", letterSpacing: ".16em", color: "var(--ink-40)", textTransform: "uppercase" }}>Learn how →</div>
                </div>
                <div className="card tf-2">
                  <div>
                    <span className="num">02</span>
                    <div className="tag">MEMORY</div>
                    <h3>Personal Recall Engine</h3>
                    <p>Your lessons evolve with you—doubts and mistakes are remembered and refined into better practice over time.</p>
                  </div>
                  <div style={{ marginTop: "auto", fontFamily: "var(--ff-mono)", fontSize: ".7rem", letterSpacing: ".16em", color: "var(--ink-40)", textTransform: "uppercase" }}>Learn how →</div>
                </div>
                <div className="card tf-3">
                  <div>
                    <span className="num">03</span>
                    <div className="tag">SOLUTIONS</div>
                    <h3>Instant Step Guidance</h3>
                    <p>From question to structured explanation with clear steps, linked concepts, and exam-style clarity.</p>
                  </div>
                  <div style={{ marginTop: "auto", fontFamily: "var(--ff-mono)", fontSize: ".7rem", letterSpacing: ".16em", color: "var(--ink-40)", textTransform: "uppercase" }}>Learn how →</div>
                </div>
                <div className="card tf-4">
                  <div>
                    <span className="num">04</span>
                    <div className="tag">VISUAL</div>
                    <h3>Diagram-to-Understanding</h3>
                    <p>Turn complex topics into digestible diagrams and flow-based learning snapshots you can revisit anytime.</p>
                  </div>
                  <div style={{ marginTop: "auto", fontFamily: "var(--ff-mono)", fontSize: ".7rem", letterSpacing: ".16em", color: "var(--ink-40)", textTransform: "uppercase" }}>Learn how →</div>
                </div>
                <div className="card tf-5">
                  <div>
                    <span className="num">05</span>
                    <div className="tag">TESTS</div>
                    <h3>Mock Training that Feels Real</h3>
                    <p>Train with smart difficulty patterns, realistic grading cues, and a post-test breakdown that leads to better attempts.</p>
                  </div>
                  <div style={{ marginTop: "auto", fontFamily: "var(--ff-mono)", fontSize: ".7rem", letterSpacing: ".16em", color: "var(--ink-40)", textTransform: "uppercase" }}>Learn how →</div>
                </div>
                <div className="card tf-6">
                  <div>
                    <span className="num">06</span>
                    <div className="tag">INSIGHTS</div>
                    <h3>Progress Radar</h3>
                    <p>See your learning in six dimensions—precision, pace, recall, endurance, and consistency—updated as you grow.</p>
                  </div>
                  <div style={{ marginTop: "auto", fontFamily: "var(--ff-mono)", fontSize: ".7rem", letterSpacing: ".16em", color: "var(--ink-40)", textTransform: "uppercase" }}>Learn how →</div>
                </div>
                <div className="card tf-7">
                  <div>
                    <span className="num">07</span>
                    <div className="tag">GAME</div>
                    <h3>Arena-Based Practice</h3>
                    <p>Practice in an engaging arena format—leaderboards, quests, and achievement milestones that keep momentum alive.</p>
                  </div>
                  <div style={{ marginTop: "auto", fontFamily: "var(--ff-mono)", fontSize: ".7rem", letterSpacing: ".16em", color: "var(--ink-40)", textTransform: "uppercase" }}>Learn how →</div>
                </div>
                <div className="card tf-8">
                  <div>
                    <span className="num">08</span>
                    <div className="tag">CONTROL</div>
                    <h3>Bring Your Preferred Tools</h3>
                    <p>Use your own teaching providers and keep the experience unified inside a premium DRONA learning identity.</p>
                  </div>
                  <div style={{ marginTop: "auto", fontFamily: "var(--ff-mono)", fontSize: ".7rem", letterSpacing: ".16em", color: "var(--ink-40)", textTransform: "uppercase" }}>Learn how →</div>
                </div>
                <div className="card tf-9">
                  <div>
                    <span className="num">09</span>
                    <div className="tag">WORKSPACE</div>
                    <h3>Second Brain for Learners</h3>
                    <p>Organize your schedule, notes, and focus sessions—then reuse that structure for better learning outcomes.</p>
                  </div>
                  <div style={{ marginTop: "auto", fontFamily: "var(--ff-mono)", fontSize: ".7rem", letterSpacing: ".16em", color: "var(--ink-40)", textTransform: "uppercase" }}>Learn how →</div>
                </div>
                <div className="card tf-10">
                  <div>
                    <span className="num">10</span>
                    <div className="tag">SOCRATIC</div>
                    <h3>Discovery-first Coaching</h3>
                    <p>Instead of giving answers, the experience guides you toward the next correct step—so learning becomes yours.</p>
                  </div>
                  <div style={{ marginTop: "auto", fontFamily: "var(--ff-mono)", fontSize: ".7rem", letterSpacing: ".16em", color: "var(--ink-40)", textTransform: "uppercase" }}>Learn how →</div>
                </div>
              </div>
            </div>
          </section>

          {/* Rotor Carousel */}
          <section style={{ paddingTop: "40px" }} id="environments">
            <div className="wrap">
              <div className="sec-head reveal">
                <div className="left">
                  <div className="num">— 02 / Rotor</div>
                  <h2>Hover to pause.<br /><em>Expand</em> for details.</h2>
                </div>
                <div className="right">
                  <span className="eyebrow">A living capability reel</span>
                  <p style={{ marginTop: "14px" }}>Hover the carousel to stop motion—then read the full capability card. This creates a calm, premium browsing experience while still feeling energetic.</p>
                </div>
              </div>
              <div className="rotor reveal">
                <div className="rotor-track" id="rotorTrack">
                  {[...rotorData, ...rotorData].map((c, i) => {
                    const originalIndex = i % rotorData.length;
                    return (
                      <div className="rotor-card" key={i}>
                        <img loading="lazy" src={`https://images.unsplash.com/photo-${c.img}?w=560&q=70&auto=format&fit=crop`} alt={c.t} />
                        <span className="rc-num">{String(originalIndex + 1).padStart(2, "0")}</span>
                        <div className="rotor-inner">
                          <span className="rc-tag">{c.tag}</span>
                          <div>
                            <h5>{c.t}</h5>
                            <div className="rc-desc">{c.d}</div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </section>

          {/* Environment Cards Section */}
          <section>
            <div className="wrap">
              <div className="sec-head reveal">
                <div className="left">
                  <div className="num">— 03 / Worlds</div>
                  <h2>Six connected<br /><em>learning environments</em>.</h2>
                </div>
                <div className="right">
                  <span className="eyebrow">A unified workspace</span>
                  <p style={{ marginTop: "14px" }}>DRONA is split into six focus environments to help you transition cleanly between studying, practicing, planning, and assessing.</p>
                </div>
              </div>

              <div className="envs reveal">
                {/* Env 1 */}
                <div className="env env-1" onClick={() => navigateTo("env-main")}>
                  <div className="env-cover">
                    <img src="https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=700&q=80&auto=format&fit=crop" alt="Main learning" />
                    <div className="env-icon">🎓</div>
                    <span className="env-num">Env / 01</span>
                  </div>
                  <div className="env-body">
                    <h3>Main Learning</h3>
                    <div className="env-tag">Adaptive lesson flow, structured explanations, and subject-specific learning rooms.</div>
                    <span className="env-link">Explore Environment</span>
                  </div>
                  <div className="env-pop">
                    <ul>
                      <li>Coordinated signature learning faculty</li>
                      <li>Smart physics, math, and chemistry spaces</li>
                      <li>Socratic Discovery-first guidance</li>
                    </ul>
                  </div>
                </div>

                {/* Env 2 */}
                <div className="env env-2" onClick={() => navigateTo("env-test")}>
                  <div className="env-cover">
                    <img src="https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=700&q=80&auto=format&fit=crop" alt="Test environment" />
                    <div className="env-icon">📝</div>
                    <span className="env-num">Env / 02</span>
                  </div>
                  <div className="env-body">
                    <h3>Test Arena</h3>
                    <div className="env-tag">Shadow mock exams, certainty-accuracy split, and smart concept breakdowns.</div>
                    <span className="env-link">Explore Environment</span>
                  </div>
                  <div className="env-pop">
                    <ul>
                      <li>Exam mode & shadow-sim tests</li>
                      <li>Step-aware grading cues</li>
                      <li>Intensive revision calendar planning</li>
                    </ul>
                  </div>
                </div>

                {/* Env 3 */}
                <div className="env env-3" onClick={() => navigateTo("env-game")}>
                  <div className="env-cover">
                    <img src="https://images.unsplash.com/photo-1511512578047-dfb367046420?w=700&q=80&auto=format&fit=crop" alt="Game Arena" />
                    <div className="env-icon">🎮</div>
                    <span className="env-num">Env / 03</span>
                  </div>
                  <div className="env-body">
                    <h3>Game Arena</h3>
                    <div className="env-tag">Milestone tracking, interactive boss practice, duels, and leaderboards.</div>
                    <span className="env-link">Explore Environment</span>
                  </div>
                  <div className="env-pop">
                    <ul>
                      <li>Friendly peer-to-peer concept duels</li>
                      <li>Mastery quests and level XP progression</li>
                      <li>Reverse-solving thinking challenges</li>
                    </ul>
                  </div>
                </div>

                {/* Env 4 */}
                <div className="env env-4" onClick={() => navigateTo("env-workspace")}>
                  <div className="env-cover">
                    <img src="https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=700&q=80&auto=format&fit=crop" alt="Workspace" />
                    <div className="env-icon">🗂️</div>
                    <span className="env-num">Env / 04</span>
                  </div>
                  <div className="env-body">
                    <h3>Workspace</h3>
                    <div className="env-tag">Notes organization, focus calendars, session timers, and progress radar.</div>
                    <span className="env-link">Explore Environment</span>
                  </div>
                  <div className="env-pop">
                    <ul>
                      <li>Notes, schedule, and daily tasks organizer</li>
                      <li>Focus timers tuned for consistency</li>
                      <li>Dynamic parent progress dashboards</li>
                    </ul>
                  </div>
                </div>

                {/* Env 5 */}
                <div className="env env-5" onClick={() => navigateTo("env-resources")}>
                  <div className="env-cover">
                    <img src="https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=700&q=80&auto=format&fit=crop" alt="Resources" />
                    <div className="env-icon">🛠️</div>
                    <span className="env-num">Env / 05</span>
                  </div>
                  <div className="env-body">
                    <h3>Resources</h3>
                    <div className="env-tag">Diagram generators, audio explainers, and a shared formulas studio.</div>
                    <span className="env-link">Explore Environment</span>
                  </div>
                  <div className="env-pop">
                    <ul>
                      <li>Formula vault and custom flashcards</li>
                      <li>Image-to-explanation insight builders</li>
                      <li>Mermaid canvas concept diagrams</li>
                    </ul>
                  </div>
                </div>

                {/* Env 6 */}
                <div className="env env-6" onClick={() => navigateTo("env-career")}>
                  <div className="env-cover">
                    <img src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=700&q=80&auto=format&fit=crop" alt="Career Path" />
                    <div className="env-icon">🚀</div>
                    <span className="env-num">Env / 06</span>
                  </div>
                  <div className="env-body">
                    <h3>Career Path</h3>
                    <div className="env-tag">Goal roadmaps, resume feedback, and industry skill alignments.</div>
                    <span className="env-link">Explore Environment</span>
                  </div>
                  <div className="env-pop">
                    <ul>
                      <li>Long-range goal progression paths</li>
                      <li>Voice/text simulated interview practice</li>
                      <li>Industry-matched gap analytics</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Agents */}
          <section id="agents">
            <div className="wrap">
              <div className="sec-head reveal">
                <div className="left">
                  <div className="num">— 04 / Teachers</div>
                  <h2>The faculty behind the<br /><em>clarity</em>.</h2>
                </div>
                <div className="right">
                  <span className="eyebrow">Orchestration, not noise</span>
                  <p style={{ marginTop: "14px" }}>Behind every interaction is a coordinated teaching experience that keeps explanations structured, keeps plans consistent, and keeps your progress moving forward.</p>
                </div>
              </div>
              <div className="agent-mosaic reveal">
                <div className="am-tile big">
                  <img src="https://images.unsplash.com/photo-1531746790731-6c087fecd65a?w=900&q=80&auto=format&fit=crop" alt="Teacher orchestration" />
                  <div className="am-cap"><div className="t">Lead · Orchestrator</div><h4>The principal that guides every lesson</h4></div>
                </div>
                <div className="am-tile">
                  <img src="https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?w=700&q=80&auto=format&fit=crop" alt="Physics" />
                  <div className="am-cap"><div className="t">Subject · Physics</div><h4>Clarity through problem-first teaching</h4></div>
                </div>
                <div className="am-tile">
                  <img src="https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=700&q=80&auto=format&fit=crop" alt="Chemistry" />
                  <div className="am-cap"><div className="t">Subject · Chemistry</div><h4>Mechanism-first explanations</h4></div>
                </div>
                <div className="am-tile wide">
                  <img src="https://images.unsplash.com/photo-1509228468518-180dd4864904?w=900&q=80&auto=format&fit=crop" alt="Mathematics" />
                  <div className="am-cap"><div className="t">Subject · Mathematics</div><h4>Multiple approaches, verified solutions</h4></div>
                </div>
              </div>
            </div>
          </section>

          {/* Journey Section */}
          <section id="journey">
            <div className="wrap">
              <div className="sec-head reveal">
                <div className="left">
                  <div className="num">— 05 / Journey</div>
                  <h2>The progression<br /><em>track</em>.</h2>
                </div>
                <div className="right">
                  <span className="eyebrow">Clear steps to mastery</span>
                  <p style={{ marginTop: "14px" }}>A clean, stage-by-stage learning trajectory that prevents prep anxiety and ensures complete exam readiness.</p>
                </div>
              </div>

              <div className="journey-track reveal">
                <div className="j-step" onClick={() => navigateTo("env-workspace")}>
                  <div className="j-dot">01</div>
                  <h5>Initialize</h5>
                  <p>Register profile & identify targets</p>
                </div>
                <div className="j-step" onClick={() => navigateTo("env-main")}>
                  <div className="j-dot">02</div>
                  <h5>Diagnose</h5>
                  <p>Initial assessment to find focus areas</p>
                </div>
                <div className="j-step" onClick={() => navigateTo("env-main")}>
                  <div className="j-dot">03</div>
                  <h5>Learn</h5>
                  <p>Structured sessions with the faculty</p>
                </div>
                <div className="j-step" onClick={() => navigateTo("env-resources")}>
                  <div className="j-dot">04</div>
                  <h5>Recall</h5>
                  <p>Adaptive flashcards & formula practice</p>
                </div>
                <div className="j-step" onClick={() => navigateTo("env-test")}>
                  <div className="j-dot">05</div>
                  <h5>Assess</h5>
                  <p>Mock shadow-sims and breakdown checks</p>
                </div>
                <div className="j-step" onClick={() => navigateTo("env-career")}>
                  <div className="j-dot">06</div>
                  <h5>Succeed</h5>
                  <p>Mastery reporting and career planning</p>
                </div>
              </div>
            </div>
          </section>

          {/* Philosophy Section */}
          <section className="philosophy">
            <div className="wrap">
              <div className="sec-head">
                <div className="left">
                  <div className="num">— 06 / Core</div>
                  <h2>Built to replace<br /><em>academic stress</em>.</h2>
                </div>
                <div className="right">
                  <span className="eyebrow">The DRONA Difference</span>
                  <p style={{ marginTop: "14px" }}>Generic apps feed you answers; DRONA develops deep mastery by guiding your thinking process, recalling past doubts, and testing under real conditions.</p>
                </div>
              </div>

              <div className="philo-grid">
                <div className="philo-card">
                  <div className="pn">01</div>
                  <h4>No Answers Offered</h4>
                  <p>We use Socratic coaching to guide students step-by-step, ensuring they own the process of finding the correct solution.</p>
                </div>
                <div className="philo-card">
                  <div className="pn">02</div>
                  <h4>Doubt Integration</h4>
                  <p>Every incorrect problem or highlighted doubt is automatically filed and re-introduced during revision cycles.</p>
                </div>
                <div className="philo-card">
                  <div className="pn">03</div>
                  <h4>Realistic Pressure</h4>
                  <p>We mimic actual competitive exam fatigue, time limits, and confidence indexing to prepare students mentally.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Pricing Section */}
          <section id="pricing">
            <div className="wrap">
              <div className="sec-head reveal">
                <div className="left">
                  <div className="num">— 07 / Pricing</div>
                  <h2>Fair billing,<br /><em>complete value</em>.</h2>
                </div>
                <div className="right">
                  <span className="eyebrow">Clear, branded value</span>
                  <p style={{ marginTop: "14px" }}>Choose the plan that matches your stage—then grow within the same premium DRONA learning experience.</p>
                </div>
              </div>

              <div className="pricing reveal">
                <div className="plan">
                  <div className="ptag">Plan / 01</div>
                  <h3>Seeker</h3>
                  <p style={{ marginBottom: "18px", fontSize: ".9rem" }}>Free experience</p>
                  <div className="price"><b>₹0</b><span>/ month</span></div>
                  <ul>
                    <li>Guided learning flow</li>
                    <li>Core practice loop</li>
                    <li>Starter progress radar</li>
                    <li>Basic resources studio</li>
                  </ul>
                  <Link href="/signup" className="btn btn-ghost mt-auto text-center">Choose Seeker</Link>
                </div>

                <div className="plan featured">
                  <span className="pop">Most Loved</span>
                  <div className="ptag">Plan / 02</div>
                  <h3>Scholar</h3>
                  <p style={{ marginBottom: "18px", fontSize: ".9rem" }}>Best for active learners</p>
                  <div className="price"><b>₹499</b><span>/ month</span></div>
                  <ul>
                    <li>All environments unlocked</li>
                    <li>Full recall and practice loop</li>
                    <li>Expanded resources studio</li>
                    <li>Mock training + arena layer</li>
                  </ul>
                  <Link href="/signup" className="btn btn-accent mt-auto text-center">Choose Scholar</Link>
                </div>

                <div className="plan">
                  <div className="ptag">Plan / 03</div>
                  <h3>Acharya</h3>
                  <p style={{ marginBottom: "18px", fontSize: ".9rem" }}>For serious preparation</p>
                  <div className="price"><b>₹1,299</b><span>/ month</span></div>
                  <ul>
                    <li>Advanced mock training</li>
                    <li>Targeted revision plans</li>
                    <li>Deep mastery tracking</li>
                    <li>Career environment preview</li>
                  </ul>
                  <Link href="/signup" className="btn btn-ghost mt-auto text-center">Choose Acharya</Link>
                </div>

                <div className="plan">
                  <div className="ptag">Plan / 04</div>
                  <h3>BYOK</h3>
                  <p style={{ marginBottom: "18px", fontSize: ".9rem" }}>Use your own keys</p>
                  <div className="price"><b>₹199</b><span>/ month</span></div>
                  <ul>
                    <li>Bring your preferred API keys</li>
                    <li>Unified DRONA experience</li>
                    <li>Priority support & updates</li>
                    <li>For advanced learners</li>
                  </ul>
                  <Link href="/signup" className="btn btn-ghost mt-auto text-center">Choose BYOK</Link>
                </div>
              </div>
            </div>
          </section>

          {/* About Section */}
          <section id="about">
            <div className="wrap">
              <div className="sec-head reveal">
                <div className="left">
                  <div className="num">— 08 / About</div>
                  <h2>Built in<br /><em>India</em> for India’s learners.</h2>
                </div>
                <div className="right">
                  <span className="eyebrow">Brand mission</span>
                  <p style={{ marginTop: "14px" }}>DRONA AI is designed as a learning system—premium teaching that upgrades how students understand, practice, and retain. The goal is simple: replace anxiety with a structured mastery loop.</p>
                </div>
              </div>

              <div className="about-grid">
                <div className="reveal">
                  <p style={{ fontSize: "1.15rem", color: "var(--ink)", marginBottom: "18px" }}>Every student deserves a learning faculty that feels personal—built for the way competitive exams reward consistency and clarity.</p>
                  <p>DRONA connects teaching, practice, assessment, and progress reporting into one cohesive brand experience. The result: learning becomes calmer, more guided, and measurable.</p>
                  <div className="about-stat">
                    <div className="as"><b>6</b><span>Environments</span></div>
                    <div className="as"><b>3</b><span>Teaching Modes</span></div>
                    <div className="as"><b>25+</b><span>Essential Capabilities</span></div>
                    <div className="as"><b>∞</b><span>Progress Loop</span></div>
                  </div>
                </div>

                <div className="reveal flex flex-col justify-center p-[50px] bg-[#f4f4f0] rounded-[28px] font-serif-custom italic text-[1.4rem] leading-[1.5] text-[#1a1a24]">
                  “The best teacher is the one who turns the student into a question, not an answer.”
                  <div style={{ marginTop: "24px", fontFamily: "var(--ff-mono)", fontStyle: "normal", fontSize: ".7rem", letterSpacing: ".16em", textTransform: "uppercase", color: "var(--ink-40)" }}>— DRONA Brand Principle</div>
                </div>
              </div>
            </div>
          </section>

          {/* FAQ Section */}
          <section style={{ backgroundColor: "#f4f4f0" }}>
            <div className="wrap">
              <div className="sec-head reveal">
                <div className="left">
                  <div className="num">— 09 / Help</div>
                  <h2>Quiet<br /><em>confidence</em>.</h2>
                </div>
                <div className="right">
                  <span className="eyebrow">FAQ</span>
                  <p style={{ marginTop: "14px" }}>Questions learners and parents ask most often.</p>
                </div>
              </div>

              <div className="faq reveal">
                {faqs.map((faq, i) => (
                  <div className={`faq-item ${faqOpenIndex === i ? "open" : ""}`} key={i}>
                    <div className="faq-q" onClick={() => toggleFaq(i)}>
                      {faq.q}
                      <span className="pm">{faqOpenIndex === i ? "−" : "+"}</span>
                    </div>
                    <div className="faq-a" style={{ maxHeight: faqOpenIndex === i ? "420px" : "0", paddingBottom: faqOpenIndex === i ? "22px" : "0" }}>
                      <p>{faq.a}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      )}

      {/* Subpage Environments (Main, Test, Game, Workspace, Resources, Career) */}
      {activePage !== "home" && (
        <div className="animate-fadeIn py-[140px] px-0 bg-[#fafaf8]">
          <div className="wrap">
            <a className="page-back" onClick={() => navigateTo("home")}>← Back to home</a>
            
            {activePage === "env-main" && (
              <div>
                <div className="page-hero">
                  <div className="env-icon" style={{ fontSize: "32px", width: "64px", height: "64px", borderRadius: "16px" }}>🎓</div>
                  <span className="eyebrow" style={{ display: "block", margin: "18px 0 8px" }}>Where the faculty teaches.</span>
                  <h1 style={{ fontSize: "clamp(2.5rem, 5vw, 4.5rem)" }} className="font-display-custom font-bold">Main Learning Environment</h1>
                  <p className="lead">Your default home for guided mastery—structured explanations, adaptive depth, and consistent progress across topics.</p>
                </div>
                <div className="page-section">
                  <h3 className="font-display-custom font-bold text-2xl mb-6">The Teaching Experience</h3>
                  <div className="page-cards">
                    <div className="pc"><div className="pic text-blue-600">●</div><h4>Always guided</h4><p>Lesson flow stays structured and easy to follow.</p></div>
                    <div className="pc"><div className="pic text-blue-600">●</div><h4>Smart planning</h4><p>Practice plans update based on your learning rhythm.</p></div>
                    <div className="pc"><div className="pic text-blue-600">●</div><h4>Depth controls</h4><p>Short summaries or detailed coaching—whenever you need.</p></div>
                  </div>
                </div>
                <div className="page-section">
                  <h3 className="font-display-custom font-bold text-2xl mb-6">Specialized Learning Rooms</h3>
                  <div className="page-cards">
                    <div className="pc"><div className="pic text-blue-600">●</div><h4>Physics</h4><p>Diagrams + step-by-step understanding.</p></div>
                    <div className="pc"><div className="pic text-blue-600">●</div><h4>Chemistry</h4><p>Mechanism-first explanations and structured recall.</p></div>
                    <div className="pc"><div className="pic text-blue-600">●</div><h4>Mathematics</h4><p>Multiple methods with clear reasoning.</p></div>
                    <div className="pc"><div className="pic text-blue-600">●</div><h4>Biology</h4><p>Memory-friendly concepts and diagram clarity.</p></div>
                    <div className="pc"><div className="pic text-blue-600">●</div><h4>Socratic Coaching</h4><p>Discovery-first guidance that builds ownership.</p></div>
                    <div className="pc"><div className="pic text-blue-600">●</div><h4>Strategic Planning</h4><p>A long-range learning approach that stays on track.</p></div>
                  </div>
                </div>
              </div>
            )}

            {activePage === "env-test" && (
              <div>
                <div className="page-hero">
                  <div className="env-icon" style={{ fontSize: "32px", width: "64px", height: "64px", borderRadius: "16px" }}>📝</div>
                  <span className="eyebrow" style={{ display: "block", margin: "18px 0 8px" }}>Where preparation becomes performance.</span>
                  <h1 style={{ fontSize: "clamp(2.5rem, 5vw, 4.5rem)" }} className="font-display-custom font-bold">Test Arena</h1>
                  <p className="lead">Mock training with realistic flow and a breakdown that turns every attempt into a learning upgrade.</p>
                </div>
                <div className="page-section">
                  <h3 className="font-display-custom font-bold text-2xl mb-6">Mock Preparation</h3>
                  <div className="page-cards">
                    <div className="pc"><div className="pic text-red-600">●</div><h4>Shadow-Sim Practice</h4><p>Exam-style conditions with adaptive patterns.</p></div>
                    <div className="pc"><div className="pic text-red-600">●</div><h4>Step-aware feedback</h4><p>Understand what worked and why.</p></div>
                    <div className="pc"><div className="pic text-red-600">●</div><h4>Confidence capture</h4><p>Track certainty vs accuracy for smarter decisions.</p></div>
                  </div>
                </div>
                <div className="page-section">
                  <h3 className="font-display-custom font-bold text-2xl mb-6">After the Exam</h3>
                  <div className="page-cards">
                    <div className="pc"><div className="pic text-red-600">●</div><h4>Breakdown clarity</h4><p>Concept vs careless split for targeted improvement.</p></div>
                    <div className="pc"><div className="pic text-red-600">●</div><h4>Smart next practice</h4><p>Automatically curated revision plan.</p></div>
                    <div className="pc"><div className="pic text-red-600">●</div><h4>Crash revision</h4><p>1 / 3 / 7-day intensive readiness plans.</p></div>
                  </div>
                </div>
              </div>
            )}

            {activePage === "env-game" && (
              <div>
                <div className="page-hero">
                  <div className="env-icon" style={{ fontSize: "32px", width: "64px", height: "64px", borderRadius: "16px" }}>🎮</div>
                  <span className="eyebrow" style={{ display: "block", margin: "18px 0 8px" }}>Lobby · Arena · Leaderboard</span>
                  <h1 style={{ fontSize: "clamp(2.5rem, 5vw, 4.5rem)" }} className="font-display-custom font-bold">Game Arena</h1>
                  <p className="lead">A competition layer that turns practice into momentum—leaderboards, quests, achievements, and friendly challenges.</p>
                </div>
                <div className="page-section">
                  <h3 className="font-display-custom font-bold text-2xl mb-6">Play to Progress</h3>
                  <div className="page-cards">
                    <div className="pc"><div className="pic text-yellow-600">●</div><h4>Boss Matches</h4><p>Timed practice arenas with strong motivation.</p></div>
                    <div className="pc"><div className="pic text-yellow-600">●</div><h4>Friend Duels</h4><p>Challenge friends on the same learning targets.</p></div>
                    <div className="pc"><div className="pic text-yellow-600">●</div><h4>Reverse Practice</h4><p>Learn by flipping the thinking—find the question.</p></div>
                  </div>
                </div>
                <div className="page-section">
                  <h3 className="font-display-custom font-bold text-2xl mb-6">Rewards & Progress</h3>
                  <div className="page-cards">
                    <div className="pc"><div className="pic text-yellow-600">●</div><h4>XP & Levels</h4><p>Earn progress in a calm, readable way.</p></div>
                    <div className="pc"><div className="pic text-yellow-600">●</div><h4>Streak Moments</h4><p>Maintain continuity for better retention.</p></div>
                    <div className="pc"><div className="pic text-yellow-600">●</div><h4>Achievement tiers</h4><p>Common to legendary milestone journeys.</p></div>
                  </div>
                </div>
              </div>
            )}

            {activePage === "env-workspace" && (
              <div>
                <div className="page-hero">
                  <div className="env-icon" style={{ fontSize: "32px", width: "64px", height: "64px", borderRadius: "16px" }}>🗂️</div>
                  <span className="eyebrow" style={{ display: "block", margin: "18px 0 8px" }}>A personal dashboard for learners.</span>
                  <h1 style={{ fontSize: "clamp(2.5rem, 5vw, 4.5rem)" }} className="font-display-custom font-bold">Workspace Environment</h1>
                  <p className="lead">Schedule, notes, focus sessions, and progress reporting in one premium space.</p>
                </div>
                <div className="page-section">
                  <h3 className="font-display-custom font-bold text-2xl mb-6">Your Second Brain</h3>
                  <div className="page-cards">
                    <div className="pc"><div className="pic text-green-600">●</div><h4>Notes & Media</h4><p>Organize what you learn and revisit it fast.</p></div>
                    <div className="pc"><div className="pic text-green-600">●</div><h4>Agent-ready organization</h4><p>Your workspace structure stays usable for learning.</p></div>
                    <div className="pc"><div className="pic text-green-600">●</div><h4>Clean recall</h4><p>Find context quickly when it matters.</p></div>
                  </div>
                </div>
                <div className="page-section">
                  <h3 className="font-display-custom font-bold text-2xl mb-6">Planning & Reporting</h3>
                  <div className="page-cards">
                    <div className="pc"><div className="pic text-green-600">●</div><h4>Calendar + tasks</h4><p>Daily and weekly learning structure.</p></div>
                    <div className="pc"><div className="pic text-green-600">●</div><h4>Focus timers</h4><p>Pomodoro-style sessions tuned for consistency.</p></div>
                    <div className="pc"><div className="pic text-green-600">●</div><h4>Parent weekly reports</h4><p>Simple updates that reflect progress.</p></div>
                  </div>
                </div>
              </div>
            )}

            {activePage === "env-resources" && (
              <div>
                <div className="page-hero">
                  <div className="env-icon" style={{ fontSize: "32px", width: "64px", height: "64px", borderRadius: "16px" }}>🛠️</div>
                  <span className="eyebrow" style={{ display: "block", margin: "18px 0 8px" }}>Studios for learning assets.</span>
                  <h1 style={{ fontSize: "clamp(2.5rem, 5vw, 4.5rem)" }} className="font-display-custom font-bold">Resources Environment</h1>
                  <p className="lead">Transform topics into learning assets—diagrams, flashcards, audio explainers, and structured tools.</p>
                </div>
                <div className="page-section">
                  <h3 className="font-display-custom font-bold text-2xl mb-6">Generation Studios</h3>
                  <div className="page-cards">
                    <div className="pc"><div className="pic text-purple-600">●</div><h4>Image to Insight</h4><p>Convert questions into structured guidance.</p></div>
                    <div className="pc"><div className="pic text-purple-600">●</div><h4>Audio Explain</h4><p>Podcast-style teaching for calm understanding.</p></div>
                    <div className="pc"><div className="pic text-purple-600">●</div><h4>Video Micro-lessons</h4><p>Short teaching snapshots for quick revision.</p></div>
                  </div>
                </div>
                <div className="page-section">
                  <h3 className="font-display-custom font-bold text-2xl mb-6">Learning Tools</h3>
                  <div className="page-cards">
                    <div className="pc"><div className="pic text-purple-600">●</div><h4>Flow Canvas</h4><p>Mermaid-style diagrams and concept linking.</p></div>
                    <div className="pc"><div className="pic text-purple-600">●</div><h4>Formula Vault</h4><p>Searchable formulas with fast recall access.</p></div>
                    <div className="pc"><div className="pic text-purple-600">●</div><h4>Flashcards</h4><p>Spaced repetition aligned to mastery progress.</p></div>
                  </div>
                </div>
              </div>
            )}

            {activePage === "env-career" && (
              <div>
                <div className="page-hero">
                  <div className="env-icon" style={{ fontSize: "32px", width: "64px", height: "64px", borderRadius: "16px" }}>🚀</div>
                  <span className="eyebrow" style={{ display: "block", margin: "18px 0 8px" }}>From aspirant to professional.</span>
                  <h1 style={{ fontSize: "clamp(2.5rem, 5vw, 4.5rem)" }} className="font-display-custom font-bold">Career Environment</h1>
                  <p className="lead">A coming environment for long-term growth—roadmaps, interview practice, skill alignment, and professional progress planning.</p>
                </div>
                <div className="page-section">
                  <h3 className="font-display-custom font-bold text-2xl mb-6">Roadmaps</h3>
                  <div className="page-cards">
                    <div className="pc"><div className="pic text-indigo-650">●</div><h4>Career Map</h4><p>Aligned growth plan for your goals.</p></div>
                    <div className="pc"><div className="pic text-indigo-650">●</div><h4>Skill Gap</h4><p>Clear difference between today and target.</p></div>
                    <div className="pc"><div className="pic text-indigo-650">●</div><h4>Industry Pulse</h4><p>Trend-aware guidance for decision-making.</p></div>
                  </div>
                </div>
                <div className="page-section">
                  <h3 className="font-display-custom font-bold text-2xl mb-6">Practice & Apply</h3>
                  <div className="page-cards">
                    <div className="pc"><div className="pic text-indigo-650">●</div><h4>Interview Practice</h4><p>Structured voice + text mock interviews.</p></div>
                    <div className="pc"><div className="pic text-indigo-650">●</div><h4>Resume Guidance</h4><p>Application-focused improvement tips.</p></div>
                    <div className="pc"><div className="pic text-indigo-650">●</div><h4>Internship Discovery</h4><p>Curated opportunities matched to your path.</p></div>
                  </div>
                </div>
              </div>
            )}

            {/* Premium visual wireframe for environments */}
            <div className="viz">
              <svg viewBox="0 0 1200 360" className="w-full h-auto">
                <rect x="40" y="40" width="1120" height="280" rx="16" fill="#fff" stroke="#e4e3de" />
                <rect x="60" y="60" width="220" height="240" rx="10" fill="#f4f4f0" />
                <text x="170" y="180" textAnchor="middle" fontFamily="DM Mono" fontSize="11" fill="#6a6a7a">SIDEBAR</text>
                <rect x="300" y="60" width="840" height="60" rx="10" fill="#f4f4f0" />
                <text x="720" y="96" textAnchor="middle" fontFamily="DM Mono" fontSize="11" fill="#6a6a7a">HEADER · 6 ENVS · PROFILE</text>
                <rect x="300" y="140" width="540" height="160" rx="10" fill="#fafaf8" stroke="#e4e3de" />
                <text x="570" y="225" textAnchor="middle" fontFamily="Playfair Display" fontStyle="italic" fontSize="22" fill="#0a0a0f">{activePage === "env-main" ? "Main Learning" : activePage === "env-test" ? "Test Arena" : activePage === "env-game" ? "Game Arena" : activePage === "env-workspace" ? "Workspace" : activePage === "env-resources" ? "Resources" : "Career Path"} workspace</text>
                <rect x="860" y="140" width="280" height="160" rx="10" fill="#0a0a0f" />
                <text x="1000" y="225" textAnchor="middle" fontFamily="DM Mono" fontSize="11" fill="#fff">Learning · Chat</text>
              </svg>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer>
        <div className="wrap">
          <div className="foot">
            <div className="foot-brand">
              <a className="brand" onClick={() => navigateTo("home")}>
                <span className="brand-mark">D</span>
                <span>DRONA<sup style={{ fontSize: ".5em", color: "var(--accent)" }}>AI</sup></span>
              </a>
              <p className="text-sm mt-3 opacity-60">India’s first multi-environment education experience. One journey. Six worlds. Premium mastery loop.</p>
            </div>
            <div>
              <h6>Platform</h6>
              <a onClick={() => navigateTo("env-main")}>Main Learning</a>
              <a onClick={() => navigateTo("env-test")}>Test Arena</a>
              <a onClick={() => navigateTo("env-game")}>Game Arena</a>
              <a onClick={() => navigateTo("env-workspace")}>Workspace</a>
              <a onClick={() => navigateTo("env-resources")}>Resources</a>
              <a onClick={() => navigateTo("env-career")}>Career</a>
            </div>
            <div>
              <h6>Resources</h6>
              <a>Documentation</a>
              <a>API Reference</a>
              <Link href="/signup">Free Experience</Link>
              <a>BYOK Guide</a>
              <a>Changelog</a>
            </div>
            <div>
              <h6>Company</h6>
              <a>About</a>
              <a>Mission</a>
              <a>Roadmap</a>
              <a>Press</a>
              <a>Careers</a>
            </div>
            <div>
              <h6>Legal</h6>
              <a>Privacy</a>
              <a>Terms</a>
              <a>Data Policy</a>
              <a>Refund</a>
              <a onClick={() => setIsContactOpen(true)}>Contact</a>
            </div>
          </div>
          <div className="foot-bottom">
            <span>© 2026 DRONA AI · Premium Learning System</span>
            <span>Brand Landing v2</span>
          </div>
        </div>
      </footer>

      {/* Contact Modal */}
      {isContactOpen && (
        <div className="contact-modal open" id="contactModal" aria-hidden="false">
          <button className="close-btn" id="closeContact" aria-label="Close contact form" onClick={() => setIsContactOpen(false)}>×</button>
          <div className="contact-form-wrap" role="dialog" aria-modal="true" aria-label="Contact form">
            <h3 className="font-display-custom font-bold text-2xl text-[#0a0a0f] mb-2">Contact DRONA AI</h3>
            <p className="desc text-sm mb-6 text-[#6a6a7a]">Send a message to get professional support. This page will open your email client with details pre-filled.</p>

            <form id="contactForm" onSubmit={handleContactSubmit}>
              <div className="form-group text-left">
                <label className="text-xs uppercase tracking-wider font-mono-custom text-[#6a6a7a] mb-2 block">Your Name</label>
                <input
                  type="text"
                  name="name"
                  placeholder="John Doe"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-3 rounded-lg border border-[#e4e3de] bg-[#f4f4f0] text-sm text-[#0a0a0f] focus:outline-none focus:border-[#2a5cff] focus:bg-white"
                />
              </div>
              <div className="form-group text-left">
                <label className="text-xs uppercase tracking-wider font-mono-custom text-[#6a6a7a] mb-2 block">Email Address</label>
                <input
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full p-3 rounded-lg border border-[#e4e3de] bg-[#f4f4f0] text-sm text-[#0a0a0f] focus:outline-none focus:border-[#2a5cff] focus:bg-white"
                />
              </div>
              <div className="form-group text-left">
                <label className="text-xs uppercase tracking-wider font-mono-custom text-[#6a6a7a] mb-2 block">Subject</label>
                <input
                  type="text"
                  name="subject"
                  placeholder="Tell us what you need"
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full p-3 rounded-lg border border-[#e4e3de] bg-[#f4f4f0] text-sm text-[#0a0a0f] focus:outline-none focus:border-[#2a5cff] focus:bg-white"
                />
              </div>
              <div className="form-group text-left">
                <label className="text-xs uppercase tracking-wider font-mono-custom text-[#6a6a7a] mb-2 block">Message</label>
                <textarea
                  name="message"
                  placeholder="Write your message..."
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full p-3 rounded-lg border border-[#e4e3de] bg-[#f4f4f0] text-sm text-[#0a0a0f] focus:outline-none focus:border-[#2a5cff] focus:bg-white min-h-[110px] resize-y"
                />
              </div>
              <div className="form-actions flex gap-3 mt-6">
                <button type="submit" className="btn btn-dark flex-1">Send via Email</button>
                <button type="button" className="btn btn-ghost flex-1" onClick={() => setIsContactOpen(false)}>Cancel</button>
              </div>
              <div className={`form-success mt-4 font-mono-custom text-xs text-green-600 ${contactSuccess ? "show" : ""}`}>✓ Draft ready in your email client.</div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
