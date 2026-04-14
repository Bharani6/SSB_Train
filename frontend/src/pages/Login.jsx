import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, LogIn, Shield, Star, Target, Award, ChevronLeft, ChevronRight, Brain, Users, Zap, Eye, EyeOff } from 'lucide-react';
import axios from 'axios';

// Real SSB / OTA photos stored locally
const HERO_IMAGES = [
  { src: '/assets/ssb1.jpg' },
  { src: '/assets/ssb2.jpg' },
  { src: '/assets/ssb3.jpg' },
  { src: '/assets/ssb4.jpg' },
];

const SSB_DAYS = [
  {
    day: "DAY 1",
    tag: "Screening",
    color: "from-blue-500 to-cyan-500",
    icon: <Eye className="w-8 h-8" />,
    sections: [
      {
        title: "1. Traditional Screening (Current SSB)",
        tasks: ["Officer Intelligence Rating (OIR)", "Picture Perception & Discussion Test (PPDT)"]
      },
      {
        title: "🔹 2. New Screening System (CSSS)",
        tasks: ["Cognitive Ability Test", "Personality & Situational Judgement Test", "Modified PPDT Simulation"]
      }
    ]
  },
  { day: "DAY 2", tag: "Psychology", color: "from-violet-500 to-purple-500", icon: <Brain className="w-8 h-8" />, tasks: ["Thematic Apperception Test (TAT)", "Word Association Test (WAT)", "Situation Reaction Test (SRT)", "Self Description Test (SDT)"] },
  { day: "DAY 3 & 4", tag: "GTO + Interviews", color: "from-amber-500 to-orange-500", icon: <Target className="w-8 h-8" />, tasks: ["Personal Interview (IO)", "Group Discussion (GD)", "Group Planning Exercise (GPE)", "Progressive Group Task (PGT)", "Half Group Task (HGT)", "Lecturette", "Individual Obstacles", "Command Task", "Final Group Task"] },
  { day: "DAY 5", tag: "Conference", color: "from-rose-500 to-red-500", icon: <Award className="w-8 h-8" />, tasks: ["Final Conference", "Result Declaration", "OLQ Evaluation Summary"] },
];

const OLQ_GROUPS = [
  { title: "Intellectual & Decision-Making", icon: <Brain className="w-4 h-1" />, color: "text-blue-400 border-blue-500/30 bg-blue-500/10", qualities: ["Effective Intelligence", "Reasoning Ability", "Organizing Ability", "Power of Expression"] },
  { title: "Social & Leadership", icon: <Users className="w-4 h-1" />, color: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10", qualities: ["Social Adaptability", "Cooperation", "Sense of Responsibility", "Initiative", "Self Confidence"] },
  { title: "Dynamic & Courage", icon: <Zap className="w-4 h-1" />, color: "text-amber-400 border-amber-500/30 bg-amber-500/10", qualities: ["Speed of Decision", "Ability to Influence Group", "Liveliness", "Determination", "Courage"] },
  { title: "Emotional Stability", icon: <Shield className="w-4 h-1" />, color: "text-rose-400 border-rose-500/30 bg-rose-500/10", qualities: ["Stamina", "Emotional Control"] },
];

function HeroSlideshow() {
  const [current, setCurrent] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setCurrent(prev => (prev + 1) % HERO_IMAGES.length);
        setFade(true);
      }, 400);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const go = (dir) => {
    setFade(false);
    setTimeout(() => {
      setCurrent(prev => (prev + dir + HERO_IMAGES.length) % HERO_IMAGES.length);
      setFade(true);
    }, 300);
  };

  return (
    <div className="fixed inset-0 z-0">
      {HERO_IMAGES.map((img, i) => (
        <img
          key={i}
          src={img.src}
          alt={img.caption}
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000"
          style={{ opacity: i === current ? (fade ? 1 : 0) : 0 }}
        />
      ))}
      {/* Deep military green overlays */}
      <div className="absolute inset-0 bg-[#06120b]/50 backdrop-blur-[4px]" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#06120b] via-[#06120b]/40 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#06120b]/80 via-[#06120b]/30 to-transparent lg:w-3/4" />

      {/* Caption + Controls */}
      <div className="absolute bottom-10 lg:bottom-20 left-6 lg:left-8 right-6 lg:right-8 z-10 flex items-end justify-between gap-4">
        <p className="text-[10px] text-white/40 font-medium max-w-[50%] lg:max-w-xs leading-relaxed italic">
          {HERO_IMAGES[current].caption}
        </p>
        <div className="flex items-center gap-2">
          <button onClick={() => go(-1)} className="w-8 h-8 rounded-full border border-white/20 bg-white/5 backdrop-blur-md flex items-center justify-center hover:bg-white/20 transition-all text-white">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div className="flex gap-1.5 mx-2">
            {HERO_IMAGES.map((_, i) => (
              <button key={i} onClick={() => { setFade(false); setTimeout(() => { setCurrent(i); setFade(true); }, 300); }}
                className={`h-1.5 rounded-full transition-all duration-300 ${i === current ? 'w-8 bg-emerald-500' : 'w-2 bg-white/30'}`}
              />
            ))}
          </div>
          <button onClick={() => go(1)} className="w-8 h-8 rounded-full border border-white/20 bg-white/5 backdrop-blur-md flex items-center justify-center hover:bg-white/20 transition-all text-white">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    // Frontend Validation
    if (!email.trim() || !password.trim()) {
      setError("All fields are required.");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await axios.post('/api/auth/login', { email, password });
      localStorage.setItem('USER_DATA', JSON.stringify(res.data));
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data || "Invalid credentials. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#06120b] text-white selection:bg-emerald-500/30">

      {/* ── HERO SECTION ── */}
      <div className="relative min-h-screen flex flex-col">
        <HeroSlideshow />

        {/* Brand */}
        <div className="relative z-10 flex items-center px-6 lg:px-10 py-6 lg:py-8">
          <div className="flex items-center gap-3 lg:gap-4">
            <div className="w-12 h-12 lg:w-14 lg:h-14 flex items-center justify-center rounded-full overflow-hidden shadow-[0_0_20px_rgba(16,185,129,0.5)] border-2 border-emerald-500/50">
              <img src="https://i.pinimg.com/originals/30/31/a3/3031a322175f31f5ade065c8d1a4d377.jpg" alt="Indian Army Emblem" className="w-full h-full object-cover" />
            </div>
            <div>
              <div className="font-black text-white tracking-wider text-sm">SSB.TRAIN</div>
              <div className="text-[9px] text-slate-400 uppercase tracking-[0.3em]">Service Selection Board</div>
            </div>
          </div>
        </div>

        {/* Hero Content + Login */}
        <div className="relative z-10 w-full max-w-[1400px] mx-auto px-6 lg:px-10 pt-4 pb-16 lg:pb-24 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">

          {/* Left */}
          <div className="lg:col-span-7 lg:pr-10">
            <div className="inline-flex items-center gap-3 bg-black/40 border border-emerald-500/30 px-4 py-2 rounded-full mb-8 backdrop-blur-md shadow-xl">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)] animate-pulse" />
              <span className="text-emerald-300 text-xs font-black uppercase tracking-widest">Active Training Platform</span>
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-[5.5rem] font-black tracking-tighter leading-[0.95] drop-shadow-2xl text-white mb-6 lg:mb-8">
              THE MAKING<br />OF AN<br />
              <span className="bg-gradient-to-r from-emerald-400 to-amber-400 bg-clip-text text-transparent filter drop-shadow-[0_0_30px_rgba(16,185,129,0.3)]">OFFICER</span>
            </h1>
            <p className="text-slate-300 text-lg leading-relaxed max-w-lg font-medium border-l-2 border-emerald-500 pl-6">
              Let’s train. Become a future Lieutenant.
            </p>
          </div>

          {/* Right: Login Card */}
          <div className="lg:col-span-5 relative">
            <div className="absolute -inset-1 bg-gradient-to-br from-emerald-500/20 to-amber-500/20 rounded-3xl blur-xl opacity-70" />
            <div className="relative bg-[#0a0a0a]/60 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 lg:p-10 shadow-[0_0_50px_rgba(0,0,0,0.8)]">
              <div className="mb-8">
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-emerald-400 mb-4">
                  <Shield className="w-4 h-4 text-emerald-500" /> Candidate Secure Access
                </div>
                <h2 className="text-2xl lg:text-3xl font-black text-white">Welcome Back</h2>
                {error && (
                  <div className="mt-4 p-3 rounded-xl border border-red-500/30 bg-red-500/10">
                    <p className="text-red-400 text-xs font-bold">{error}</p>
                  </div>
                )}
              </div>

              <form onSubmit={handleLogin} className="space-y-5">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">
                    Email <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                      className="w-full bg-[#111] border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all placeholder:text-slate-600 font-medium"
                      placeholder="candidate@ssb.train" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      Password <span className="text-rose-500">*</span>
                    </label>
                    <Link to="/forgot-password" title="Recover your account password" className="text-[10px] text-emerald-400 font-black uppercase tracking-widest hover:text-emerald-300">Forgot password ?</Link>
                  </div>
                  <div className="relative">
                    <Lock className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input type={showPassword ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} required
                      className="w-full bg-[#111] border border-white/10 rounded-xl py-3.5 pl-12 pr-12 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all placeholder:text-slate-600 font-medium"
                      placeholder="••••••••" />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-emerald-400 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <button type="submit" disabled={isLoading}
                  className="w-full mt-4 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs uppercase tracking-widest py-4.5 rounded-xl transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] flex items-center justify-center gap-2 h-[56px] disabled:opacity-50">
                  {isLoading
                    ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> AUTHENTICATING...</>
                    : <><LogIn className="w-5 h-5" /> Login</>}
                </button>
              </form>

              <div className="mt-8 pt-6 border-t border-white/10 text-center">
                <span className="text-xs text-slate-400">Not enlisted yet? </span>
                <Link to="/register" className="text-xs text-amber-400 font-black hover:text-amber-300 uppercase tracking-widest ml-1 transition-colors">Register Now</Link>
              </div>
            </div>
          </div>

        </div>

        {/* Scroll hint */}
        <div className="relative z-10 flex flex-col items-center pb-10 gap-2">
          <span className="text-[9px] uppercase tracking-[0.3em] text-slate-600 font-bold">Scroll to discover</span>
          <div className="w-px h-8 bg-gradient-to-b from-rose-500 to-transparent animate-pulse" />
        </div>
      </div>

      {/* ── 5-DAY PROCESS ── */}
      <div className="relative z-10 py-20 lg:py-32 px-6 lg:px-8 bg-[#0a0a0a]/90 backdrop-blur-3xl border-t border-white/10 overflow-hidden">
        {/* Animated Background Decorative Elements */}
        <div className="absolute top-1/2 left-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-[120px] -translate-y-1/2 -translate-x-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-[150px] translate-y-1/2 translate-x-1/2" />

        <div className="max-w-7xl mx-auto relative">
          <div className="text-center mb-24">
            <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 px-4 py-2 rounded-full mb-6 animate-bounce-slow">
              <Target className="w-4 h-4 text-emerald-400" />
              <span className="text-emerald-400 text-xs font-black uppercase tracking-[0.3em] text-center">Operational Roadmap</span>
            </div>
            <h2 className="text-4xl lg:text-7xl font-black tracking-tighter mb-6 text-white leading-tight lg:leading-none">
              THE 5-DAY <span className="bg-gradient-to-r from-emerald-400 via-amber-400 to-emerald-400 bg-clip-text text-transparent animate-gradient-x block sm:inline">SSB JOURNEY</span>
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-lg font-medium">From first-day screening to the final conference—master every phase of the selection trial.</p>
          </div>

          {/* Timeline Connector Line */}
          <div className="hidden lg:block absolute top-[420px] left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent z-0" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
            {SSB_DAYS.map((day, idx) => (
              <div
                key={idx}
                className="relative group transition-all duration-500 hover:-translate-y-4"
                style={{ transitionDelay: `${idx * 150}ms` }}
              >
                {/* Connection Node */}
                <div className="hidden lg:flex absolute -top-12 left-1/2 -translate-x-1/2 items-center justify-center">
                  <div className={`w-4 h-4 rounded-full border-4 border-[#0a0a0a] shadow-[0_0_15px_rgba(16,185,129,0.5)] bg-gradient-to-r ${day.color}`} />
                  <div className="absolute w-px h-12 bg-emerald-500/20 top-4" />
                </div>

                <div className="relative h-full rounded-2xl border border-white/5 bg-white/[0.02] p-8 backdrop-blur-md hover:border-emerald-500/30 hover:bg-white/[0.05] transition-all duration-500 shadow-xl group-hover:shadow-emerald-500/10">
                  <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${day.color} rounded-t-2xl opacity-50 group-hover:opacity-100 transition-opacity`} />

                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <div className={`inline-block text-[10px] font-black uppercase tracking-[0.2em] mb-2 px-3 py-1 rounded-full bg-gradient-to-r ${day.color} text-white shadow-lg`}>
                        {day.day}
                      </div>
                      <h3 className="text-xl lg:text-2xl font-black text-white group-hover:text-emerald-400 transition-colors uppercase tracking-tighter">
                        {day.tag}
                      </h3>
                    </div>
                    <div className={`filter group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.4)] transition-all duration-500 transform group-hover:scale-125 group-hover:rotate-12 ${idx === 0 ? 'text-blue-400' : idx === 1 ? 'text-purple-400' : idx === 2 ? 'text-amber-400' : 'text-rose-400'} opacity-40 group-hover:opacity-100`}>
                      {day.icon}
                    </div>
                  </div>

                  <div className="space-y-6">
                    {day.sections ? (
                      day.sections.map((section, si) => (
                        <div key={si} className="relative">
                          <div className="text-[11px] font-black text-emerald-400/80 uppercase tracking-widest mb-3 flex items-center gap-2">
                            <div className="w-1 h-3 bg-emerald-500 rounded-full" />
                            {section.title}
                          </div>
                          <ul className="space-y-3">
                            {section.tasks.map((task, ti) => (
                              <li key={ti} className="flex items-start gap-3 text-xs text-slate-400 font-bold leading-relaxed group-hover:text-slate-200 transition-colors">
                                <div className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 bg-gradient-to-r ${day.color} shadow-[0_0_8px_currentColor]`} />
                                {task}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))
                    ) : (
                      <ul className="space-y-3">
                        {day.tasks.map((task, ti) => (
                          <li key={ti} className="flex items-start gap-3 text-xs text-slate-400 font-bold leading-relaxed group-hover:text-slate-200 transition-colors">
                            <div className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 bg-gradient-to-r ${day.color} shadow-[0_0_8px_currentColor]`} />
                            {task}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── OLQ SECTION ── */}
      <div className="relative z-10 py-20 lg:py-32 px-6 lg:px-8 bg-[#06120b] border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 lg:mb-20">
            <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 px-4 py-2 rounded-full mb-6">
              <Award className="w-4 h-4 text-amber-500" />
              <span className="text-amber-400 text-xs font-black uppercase tracking-[0.3em] text-center">What They Look For</span>
            </div>
            <h2 className="text-4xl lg:text-6xl font-black tracking-tighter mb-4 text-white leading-tight">
              15 Officer Like <span className="bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent block sm:inline">Qualities (OLQs)</span>
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-lg">The SSB board evaluates you on these 15 key qualities to determine your potential as a future officer.</p>
          </div>
          <div className="relative max-w-5xl mx-auto mb-32 px-4 lg:px-0">
            {/* Central Node for Desktop */}
            <div className="hidden lg:flex absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 w-44 h-44 rounded-full bg-[#06120b] border-2 border-amber-500/30 shadow-[0_0_40px_rgba(245,158,11,0.15)] flex-col items-center justify-center p-2 text-center group cursor-default">
              <div className="absolute inset-0 rounded-full border border-dashed border-amber-500/40 animate-[spin_30s_linear_infinite]" />
              <div className="absolute inset-3 rounded-full bg-gradient-to-br from-amber-500/10 to-transparent" />
              <img src="https://i.pinimg.com/originals/30/31/a3/3031a322175f31f5ade065c8d1a4d377.jpg" alt="Indian Army Emblem" className="w-20 h-20 object-cover rounded-full mb-2 border border-amber-500/50 shadow-[0_0_10px_rgba(245,158,11,0.4)]" />
              <div className="relative z-10 text-[11px] font-black uppercase text-white tracking-[0.2em] leading-tight mt-1">
                <span className="text-amber-400">Lieutenant</span>
              </div>
            </div>

            {/* Connecting Lines for Desktop */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none hidden lg:block z-0" style={{ filter: 'drop-shadow(0 0 6px rgba(245,158,11,0.3))' }}>
              <line x1="25%" y1="25%" x2="50%" y2="50%" stroke="#f59e0b" strokeWidth="2" strokeDasharray="4 4" opacity="0.4" />
              <line x1="75%" y1="25%" x2="50%" y2="50%" stroke="#f59e0b" strokeWidth="2" strokeDasharray="4 4" opacity="0.4" />
              <line x1="25%" y1="75%" x2="50%" y2="50%" stroke="#f59e0b" strokeWidth="2" strokeDasharray="4 4" opacity="0.4" />
              <line x1="75%" y1="75%" x2="50%" y2="50%" stroke="#f59e0b" strokeWidth="2" strokeDasharray="4 4" opacity="0.4" />
            </svg>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-x-48 lg:gap-y-24 relative z-10">
              {OLQ_GROUPS.map((group, idx) => (
                <div key={idx} className={`rounded-2xl border p-6 ${group.color} bg-[#06120b] backdrop-blur-md shadow-xl hover:-translate-y-2 transition-all duration-500 hover:shadow-[0_0_30px_rgba(255,255,255,0.05)]`}>
                  <div className="flex items-center gap-3 mb-5">
                    <div className="opacity-80 p-2 rounded-lg bg-white/5 border border-white/10">{group.icon}</div>
                    <div className="text-sm font-black uppercase tracking-wider">{group.title}</div>
                  </div>
                  <ul className="space-y-3">
                    {group.qualities.map((q, qi) => (
                      <li key={qi} className="text-xs text-slate-300 flex items-center gap-3 font-semibold">
                        <div className="w-1.5 h-1.5 rounded-full bg-current opacity-70 shrink-0 shadow-[0_0_5px_currentColor]" />
                        {q}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* CTA with real photo collage */}
          <div className="relative rounded-3xl lg:rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl bg-[#06120b]">
            <div className="grid grid-cols-2 md:grid-cols-4 absolute inset-0">
              {HERO_IMAGES.map((img, i) => (
                <img key={i} src={img.src} alt="" className="w-full h-full object-cover transition-opacity"
                  style={{ opacity: (i === 0 || i === 3) ? 1 : 0.5 }} />
              ))}
            </div>
            <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(to right, transparent 5%, #06120b 25%, #06120b 75%, transparent 95%)' }} />
            <div className="relative z-10 p-8 md:p-12 lg:p-20 text-center">
              <div className="text-4xl lg:text-5xl mb-4 lg:mb-6">🎯</div>
              <h3 className="text-3xl lg:text-5xl font-black text-white tracking-tight mb-4">Your Mission Starts Here</h3>
              <p className="text-emerald-400 text-lg lg:text-xl mb-4 font-bold tracking-wide">Consistency + Self-awareness + Practice = Success in SSB</p>
              <p className="text-white/60 text-sm lg:text-base mb-8 lg:mb-10 max-w-xl mx-auto">Start your journey today and access the interactive tools needed to train exactly like a future officer.</p>
              <div className="flex flex-col sm:flex-row gap-5 justify-center">
                <Link to="/register" className="bg-emerald-500 hover:bg-emerald-400 text-[#06120b] font-black uppercase tracking-widest px-10 py-5 rounded-2xl text-sm transition-all shadow-[0_0_20px_rgba(16,185,129,0.4)]">
                  Begin Training →
                </Link>

              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Growth Banner - Compact Version */}
      <div className="relative z-10 max-w-4xl mx-auto mb-8 px-6">
        <div className="flex flex-col lg:flex-row items-center gap-6 lg:gap-10">
          {/* Illustration */}
          <div className="w-32 h-32 lg:w-56 lg:h-56 shrink-0">
            <img
              src="https://clevertap.com/wp-content/uploads/2025/08/bots.png"
              alt="AI Growth Ecosystem"
              className="w-full h-full object-contain drop-shadow-xl"
            />
          </div>
          {/* Typography */}
          <div className="text-white text-center lg:text-left flex-1 px-2 lg:px-4">
            <p className="text-xs lg:text-base font-bold tracking-widest mb-2 lg:mb-1 text-slate-400 uppercase">
              AI evaluates performance and helps in achieving the goal
            </p>
            <p className="text-2xl lg:text-3xl font-black tracking-tight leading-tight">
              of becoming a <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-amber-400 to-emerald-400 bg-[length:200%_auto] animate-gradient-x animate-pulse-glow font-black italic">future Lieutenant.</span>
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10 py-6 px-8  text-center">
        <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">© 2026 — Empowering Future Officers of India</p>
      </div>
    </div>
  );
}
