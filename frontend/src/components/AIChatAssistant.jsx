import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, X, Minus, User, ShieldCheck, ShieldAlert, Cpu } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { chatWithAI } from '../services/aiService';

const TacticalLogo = ({ size = 30, className = "" }) => (
  <motion.svg
    viewBox="0 0 100 100"
    className={`${className}`}
    style={{ width: size, height: size, filter: 'drop-shadow(0 0 8px rgba(16,185,129,0.5))' }}
    initial="initial"
    animate="animate"
  >
    <defs>
      <radialGradient id="hologramGradient" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#d1fae5" stopOpacity="0.8" />
        <stop offset="60%" stopColor="#10b981" stopOpacity="0.4" />
        <stop offset="100%" stopColor="#064e3b" stopOpacity="0.1" />
      </radialGradient>

      <linearGradient id="glareGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="white" stopOpacity="0.4" />
        <stop offset="50%" stopColor="white" stopOpacity="0" />
      </linearGradient>

      <filter id="glow">
        <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
        <feMerge>
          <feMergeNode in="coloredBlur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>

    {/* Outer Hexagon Frame (Tactical Shield) */}
    <motion.path
      d="M50 5 L89 27.5 L89 72.5 L50 95 L11 72.5 L11 27.5 Z"
      fill="rgba(6, 78, 59, 0.4)"
      stroke="#10b981"
      strokeWidth="2"
      strokeLinejoin="round"
      animate={{ opacity: [0.6, 1, 0.6] }}
      transition={{ duration: 3, repeat: Infinity }}
    />

    {/* Rotating Technical Data Ring */}
    <motion.circle
      cx="50" cy="50" r="32"
      stroke="#10b981"
      strokeWidth="1"
      fill="none"
      strokeDasharray="4 8"
      animate={{ rotate: 360 }}
      transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
    />

    {/* Central Core (The "Eye") */}
    <circle cx="50" cy="50" r="22" fill="#06120b" stroke="#10b981" strokeWidth="0.5" />
    <motion.circle
      cx="50" cy="50" r="18"
      fill="url(#hologramGradient)"
      animate={{ scale: [0.95, 1.05, 0.95] }}
      transition={{ duration: 2, repeat: Infinity }}
    />

    {/* Dynamic Scan Line */}
    <motion.rect
      x="25" width="50" height="1" fill="#6ee7b7"
      initial={{ y: 35, opacity: 0 }}
      animate={{ y: [35, 65, 35], opacity: [0, 0.8, 0] }}
      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
    />

    {/* Reflective Glare */}
    <path d="M30 30 Q50 20 70 30" stroke="url(#glareGradient)" strokeWidth="2" fill="none" opacity="0.6" />

    {/* Technical Crosshair */}
    <path d="M50 40 V60 M40 50 H60" stroke="#fff" strokeWidth="0.5" opacity="0.5" />
  </motion.svg>
);

const TypewriterText = ({ text, delay = 15 }) => {
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    let i = 0;
    setDisplayedText('');
    const timer = setInterval(() => {
      if (i < text.length) {
        setDisplayedText((prev) => prev + text.charAt(i));
        i++;
      } else {
        clearInterval(timer);
      }
    }, delay);
    return () => clearInterval(timer);
  }, [text, delay]);

  return <span>{displayedText}<span className="inline-block w-1.5 h-4 bg-emerald-400 ml-1 animate-pulse align-middle"></span></span>;
};

export default function AIChatAssistant({ userData }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: `  Greetings Cadet ${userData?.name?.split(' ')[0] || ''}. I'm your AI Buddy. How can I assist your mission preparation today?`,
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isConfiguring, setIsConfiguring] = useState(!localStorage.getItem('GEMINI_API_KEY'));
  const [tempKey, setTempKey] = useState('');
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen, isMinimized]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg = { id: Date.now(), text: input, sender: 'user', timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const responseText = await chatWithAI(input, messages);
      const aiMsg = { id: Date.now() + 1, text: responseText, sender: 'ai', timestamp: new Date() };
      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      console.error(err);
      const errorMsg = {
        id: Date.now() + 1,
        text: err.message === 'API_KEY_MISSING'
          ? "CRITICAL FAILURE: Digital signature (API Key) not detected. Access denied."
          : "SIGNAL INTERFERENCE: Failed to synchronize with Command Core. Retrying link...",
        sender: 'ai',
        isError: true,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const saveApiKey = (e) => {
    e.preventDefault();
    if (tempKey.trim()) {
      localStorage.setItem('GEMINI_API_KEY', tempKey.trim());
      setIsConfiguring(false);
      setTempKey('');
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end gap-4 pointer-events-none">

      {/* ── Chat Window ───────────────────────────────── */}
      <AnimatePresence>
        {isOpen && !isMinimized && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95, transformOrigin: 'bottom right' }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="w-[calc(100vw-2rem)] md:w-[340px] h-[500px] max-h-[85vh] flex flex-col rounded-[1.5rem] overflow-hidden pointer-events-auto shadow-[0_20px_50px_rgba(0,0,0,0.6)] border border-emerald-500/30"
            style={{ background: 'linear-gradient(165deg, rgba(6, 18, 11, 0.95), rgba(4, 15, 10, 0.98))', backdropFilter: 'blur(20px)' }}
          >
            {/* Header */}
            <div className="p-3 flex items-center justify-between border-b border-emerald-500/10 bg-emerald-500/5 relative overflow-hidden">
              <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'repeating-linear-gradient(0deg, #10b981 0px, transparent 1px, transparent 4px)', backgroundSize: '100% 4px' }}></div>
              <div className="flex items-center gap-3 md:gap-4 relative z-10">
                <div className="relative">
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-[#0a1f11] flex items-center justify-center border border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                    <TacticalLogo size={20} />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 md:w-4 md:h-4 rounded-full bg-emerald-500 border-[3px] md:border-4 border-[#06120b] animate-pulse shadow-[0_0_10px_#10b981]"></div>
                </div>
                <div>
                  <h3 className="text-xs md:text-sm font-black tracking-[0.2em] text-white uppercase flex items-center gap-2">
                    <Cpu size={12} className="md:w-[14px] md:h-[14px] text-emerald-400" />
                    AI Buddy
                  </h3>
                  <div className="flex items-center gap-2 mt-0.5 md:mt-1">
                    <span className="text-[8px] md:text-[10px] font-bold text-emerald-500/80 uppercase tracking-widest bg-emerald-500/10 px-1.5 md:px-2 py-0.5 rounded border border-emerald-500/20">Secure Link</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1 md:gap-2 relative z-10">
                <button onClick={() => setIsMinimized(true)} className="p-1.5 md:p-2 hover:bg-emerald-500/10 text-emerald-500/50 hover:text-emerald-400 rounded-xl transition-all">
                  <Minus size={16} md:size={18} />
                </button>
                <button onClick={() => setIsOpen(false)} className="p-1.5 md:p-2 hover:bg-rose-500/20 text-emerald-500/50 hover:text-rose-400 rounded-xl transition-all">
                  <X size={16} md:size={18} />
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-3 space-y-3 relative"
              style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(16,185,129,0.2) transparent' }}
            >
              <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))', backgroundSize: '100% 2px, 3px 100%' }}></div>

              {isConfiguring ? (
                <div className="h-full flex flex-col items-center justify-center p-6 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 mb-6 shadow-[0_0_20px_rgba(16,185,129,0.1)]">
                    <ShieldAlert className="w-8 h-8 text-amber-500 animate-pulse" />
                  </div>
                  <h4 className="text-sm font-black text-white uppercase tracking-widest mb-2">Signature Required</h4>
                  <p className="text-[10px] text-slate-400 mb-6 leading-relaxed">
                    Access to Command AI requires a valid digital signature (Gemini API Key).
                  </p>
                  <form onSubmit={saveApiKey} className="w-full space-y-3">
                    <input
                      type="password"
                      value={tempKey}
                      onChange={(e) => setTempKey(e.target.value)}
                      placeholder="Paste API Key Here..."
                      className="w-full bg-[#111] border border-emerald-500/30 rounded-xl px-4 py-3 text-xs text-white placeholder:text-emerald-900/30 focus:outline-none focus:border-emerald-500 transition-all font-mono"
                    />
                    <button
                      type="submit"
                      className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black text-[10px] uppercase tracking-widest py-3 rounded-xl transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                    >
                      Initialize Link
                    </button>
                    <a
                      href="https://aistudio.google.com/app/apikey"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-[9px] text-emerald-400/60 hover:text-emerald-400 underline uppercase tracking-widest transition-colors pt-2"
                    >
                      Get your key here
                    </a>
                  </form>
                </div>
              ) : (
                <>
                  {messages.map((msg, idx) => (
                    <div key={msg.id} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                      {msg.sender === 'ai' && (
                        <div className="flex items-center gap-2 mb-1.5 md:mb-2 px-1">
                          <div className="w-1 h-2.5 md:h-3 bg-emerald-500 rounded-full"></div>
                          <span className="text-[9px] md:text-[10px] font-black text-emerald-500 uppercase tracking-widest">AI</span>
                        </div>
                      )}
                      <div className={`max-w-[95%] p-2 md:p-2.5 text-xs md:text-sm leading-relaxed relative ${msg.sender === 'user'
                        ? 'bg-emerald-600 font-bold text-white rounded-2xl rounded-tr-none shadow-[0_4px_15px_rgba(16,185,129,0.3)]'
                        : msg.isError
                          ? 'bg-rose-500/10 border border-rose-500/20 text-rose-300 rounded-2xl rounded-tl-none font-mono'
                          : 'bg-emerald-500/5 border border-emerald-500/20 text-emerald-100 rounded-2xl rounded-tl-none font-mono shadow-[inset_0_0_20px_rgba(16,185,129,0.05)]'
                        }`}>
                        {msg.sender === 'ai' ? (
                          <TypewriterText text={msg.text} />
                        ) : (
                          msg.text
                        )}
                        {msg.sender === 'ai' && (
                          <>
                            <div className="absolute top-0 left-0 w-1.5 h-1.5 border-l border-t border-emerald-500/50"></div>
                            <div className="absolute bottom-0 right-0 w-1.5 h-1.5 border-r border-b border-emerald-500/50"></div>
                          </>
                        )}
                      </div>
                      <span className="text-[9px] md:text-[10px] text-slate-600 font-black mt-1.5 md:mt-2 flex items-center gap-1.5 md:gap-2 px-1">
                        {msg.sender === 'user' && <User size={10} />}
                        {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex flex-col gap-2 p-2">
                      <div className="flex items-center gap-2 text-emerald-500/80">
                        <div className="flex gap-1.5">
                          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse delay-75"></span>
                          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse delay-150"></span>
                        </div>
                        <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] animate-pulse">Synchronizing...</span>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Input Area */}
            {!isConfiguring && (
              <form onSubmit={handleSend} className="p-2 border-t border-emerald-500/10 bg-emerald-500/5 relative">
                <div className="relative group">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type your command..."
                    className="w-full bg-[#0a1f11] border border-emerald-500/20 rounded-2xl px-4 md:px-5 py-2.5 md:py-3 text-xs md:text-sm text-white placeholder:text-emerald-900/50 focus:outline-none focus:border-emerald-500/50 focus:shadow-[0_0_15px_rgba(16,185,129,0.1)] transition-all pr-12 md:pr-14 font-mono"
                  />
                  <button
                    type="submit"
                    disabled={!input.trim() || isLoading}
                    className="absolute right-1.5 md:right-2 top-1/2 -translate-y-1/2 w-8 h-8 md:w-10 md:h-10 rounded-xl flex items-center justify-center text-emerald-400 hover:bg-emerald-500 hover:text-black disabled:text-emerald-900/30 disabled:hover:bg-transparent transition-all"
                  >
                    <Send size={14} md:size={16} />
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Minimized Pill ────────────────────────────── */}
      <AnimatePresence>
        {isOpen && isMinimized && (
          <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            onClick={() => setIsMinimized(false)}
            whileHover={{ scale: 1.05 }}
            className="pointer-events-auto flex items-center gap-2 bg-emerald-600 text-white px-3 py-2 rounded-lg shadow-[0_10px_20px_rgba(16,185,129,0.3)] hover:bg-emerald-500 transition-all font-black text-[9px] uppercase tracking-[0.2em] border border-white/20"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></div>
            Buddy Active
          </motion.button>
        )}
      </AnimatePresence>

      {/* ── Main FAB ──────────────────────────────────── */}
      <motion.button
        onClick={() => {
          setIsOpen(true);
          setIsMinimized(false);
        }}
        whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
        whileTap={{ scale: 0.9 }}
        className={`pointer-events-auto w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center transition-all duration-500 shadow-[0_15px_40px_rgba(16,185,129,0.4)] group relative overflow-hidden ${isOpen ? 'opacity-0 scale-0' : 'opacity-100 scale-100'
          }`}
        style={{
          background: 'linear-gradient(135deg, #10b981, #059669)',
          border: '2px md:border-3 solid rgba(255,255,255,0.2)'
        }}
      >
        <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity blur-xl"></div>
        <TacticalLogo size={32} className="relative z-10" />

        {/* Radar Ping Animation */}
        <div className="absolute inset-0 rounded-3xl border-2 border-emerald-400 opacity-0 group-hover:opacity-100 animate-[ping_2s_infinite]"></div>
        <div className="absolute inset-0 rounded-3xl border-2 border-emerald-400 opacity-20 animate-[ping_3s_infinite]"></div>
      </motion.button>

    </div>
  );
}
