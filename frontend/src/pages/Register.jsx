import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User as UserIcon, ShieldCheck, ChevronRight, Star, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import axios from 'axios';

const HERO_IMAGES = [
  '/assets/ssb2.jpg',
  '/assets/ssb3.jpg',
  '/assets/ssb4.jpg',
  '/assets/ssb1.jpg',
];

function SlideshowPanel() {
  const [current, setCurrent] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const t = setInterval(() => {
      setFade(false);
      setTimeout(() => { setCurrent(p => (p + 1) % HERO_IMAGES.length); setFade(true); }, 500);
    }, 6000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="fixed inset-0 z-0">
      {HERO_IMAGES.map((src, i) => (
        <img key={i} src={src} alt="SSB" className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000"
          style={{ opacity: i === current ? (fade ? 1 : 0) : 0 }} />
      ))}
      <div className="absolute inset-0 bg-[#06120b]/50 backdrop-blur-[4px]" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#06120b] via-[#06120b]/30 to-transparent" />
    </div>
  );
}

const ENTRY_TYPES = [
  { value: "NDA", label: "NDA", sub: "National Defence Academy", color: "from-emerald-500 to-teal-500" },
  { value: "CDS", label: "CDS", sub: "Combined Defence Services", color: "from-amber-400 to-yellow-500" },
  { value: "SSC Tech", label: "SSC Tech", sub: "Technical Entry (CSE/ECE)", color: "from-blue-500 to-cyan-500" },
  { value: "AFCAT", label: "AFCAT", sub: "Air Force Common Admission", color: "from-indigo-500 to-violet-500" },
];

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [entryType, setEntryType] = useState('NDA');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    // Frontend Validation
    if (!name.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
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

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsLoading(true);
    setError('');
    try {
      await axios.post('/api/auth/register', { name, email, password, entryType });
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data || "Registration failed. Try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#06120b] text-white flex items-center justify-center relative py-12 px-4 selection:bg-emerald-500/30">
      <SlideshowPanel />

      <div className="relative z-10 w-full max-w-5xl mx-auto flex flex-col lg:flex-row shadow-[0_0_60px_rgba(0,0,0,0.8)] border border-white/10 rounded-3xl overflow-hidden bg-black/40 backdrop-blur-xl">

        {/* Left Side: Branding */}
        <div className="lg:w-5/12 p-10 lg:p-14 flex flex-col justify-between bg-gradient-to-br from-emerald-950/40 to-black/60 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-amber-500" />

          <div className="relative z-10">
            <Link to="/login" className="inline-flex items-center gap-2 text-xs text-emerald-400 hover:text-emerald-300 font-bold transition-colors mb-10">
              <ArrowLeft className="w-4 h-4" /> Return to Login
            </Link>
            <div className="w-20 h-20 flex items-center justify-center rounded-full overflow-hidden shadow-[0_0_20px_rgba(16,185,129,0.5)] border-2 border-emerald-500/50 mb-8">
              <img src="https://i.pinimg.com/originals/30/31/a3/3031a322175f31f5ade065c8d1a4d377.jpg" alt="Indian Army Emblem" className="w-full h-full object-cover" />
            </div>
            <h1 className="text-4xl lg:text-5xl font-black tracking-tight leading-tight mb-4">
              Join The <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-amber-400">Elite Ranks</span>
            </h1>
            <p className="text-slate-300 text-sm leading-relaxed max-w-sm mb-12">
              Create your candidate profile to access India's most advanced SSB simulator. Master the 5-day intelligence and psychology testing under simulated pressure.
            </p>

            <div className="space-y-4">
              <div className="flex items-center gap-4 text-emerald-400/80">
                <ShieldCheck className="w-6 h-6" />
                <span className="text-xs font-black uppercase tracking-widest text-white">Military Grade Secure</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="lg:w-7/12 p-10 lg:p-14 bg-[#0a0a0a]/50">
          <div className="max-w-md w-full mx-auto">
            {success ? (
              <div className="text-center py-20">
                <div className="w-24 h-24 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-8 border border-emerald-500/30">
                  <ShieldCheck className="w-12 h-12 text-emerald-400" />
                </div>
                <h2 className="text-3xl font-black text-white mb-3">Enlistment Confirmed!</h2>
                <p className="text-slate-400 text-sm">Your secure candidate profile has been generated. Redirecting to access terminal...</p>
                <div className="mt-8 h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full w-full animate-pulse" />
                </div>
              </div>
            ) : (
              <>
                <div className="mb-10">
                  <h2 className="text-3xl font-black text-white tracking-tight">Create Account</h2>
                  <p className="text-slate-400 text-sm mt-2">Fill in your operational details to begin</p>

                  {error && (
                    <div className="mt-6 p-4 rounded-xl border border-red-500/30 bg-red-500/10 flex items-start gap-3">
                      <div className="text-red-400 font-bold text-sm">{error}</div>
                    </div>
                  )}
                </div>

                <form onSubmit={handleRegister} className="space-y-5">
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2">
                      Candidate Full Name <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <UserIcon className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                      <input
                        type="text" value={name} onChange={e => setName(e.target.value)} required
                        className="w-full bg-[#111] border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all placeholder:text-slate-600 font-medium"
                        placeholder="Upendra Dwivedi"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2">
                      Email Address <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                      <input
                        type="email" value={email} onChange={e => setEmail(e.target.value)} required
                        className="w-full bg-[#111] border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all placeholder:text-slate-600 font-medium"
                        placeholder="candidate@gmail.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2">Entry Type</label>
                    <div className="grid grid-cols-2 gap-3">
                      {ENTRY_TYPES.map((et) => (
                        <button
                          key={et.value} type="button"
                          onClick={() => setEntryType(et.value)}
                          className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${entryType === et.value
                              ? 'border-emerald-500/50 bg-emerald-500/10'
                              : 'border-white/5 bg-[#111] hover:border-white/10'
                            }`}
                        >
                          <div className={`w-2.5 h-2.5 rounded-full bg-gradient-to-r ${et.color} shrink-0`} />
                          <div>
                            <div className="text-xs font-black text-white">{et.label}</div>
                            <div className="text-[10px] text-slate-500">{et.sub}</div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2">
                        Password <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <Lock className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                        <input
                          type={showPassword ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} required minLength={6}
                          className="w-full bg-[#111] border border-white/10 rounded-xl py-3.5 pl-12 pr-12 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all placeholder:text-slate-600 font-medium"
                          placeholder="Min 6 chars"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-emerald-400 transition-colors"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2">
                        Confirm Password <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <Lock className={`w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 ${confirmPassword && confirmPassword !== password ? 'text-red-500' : confirmPassword && confirmPassword === password ? 'text-emerald-500' : 'text-slate-500'}`} />
                        <input
                          type={showConfirmPassword ? "text" : "password"} value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required
                          className={`w-full bg-[#111] border rounded-xl py-3.5 pl-12 pr-12 text-white text-sm focus:outline-none focus:ring-2 transition-all placeholder:text-slate-600 font-medium ${confirmPassword && confirmPassword !== password
                              ? 'border-red-500/50 focus:ring-red-500'
                              : confirmPassword && confirmPassword === password
                                ? 'border-emerald-500/50 focus:ring-emerald-500'
                                : 'border-white/10 focus:ring-emerald-500'
                            }`}
                          placeholder="Repeat code"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-emerald-400 transition-colors"
                        >
                          {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit" disabled={isLoading}
                    className="w-full mt-4 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs uppercase tracking-widest py-4.5 rounded-xl transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] flex items-center justify-center gap-2 disabled:opacity-50 h-[56px]"
                  >
                    {isLoading
                      ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> ENLISTING...</>
                      : <><ShieldCheck className="w-5 h-5" /> COMPLETE REGISTRATION</>
                    }
                  </button>
                </form>

                <div className="mt-8 text-center">
                  <span className="text-xs text-slate-500">Already enlisted? </span>
                  <Link to="/login" className="text-xs text-amber-400 font-black hover:text-amber-300 uppercase tracking-widest ml-1 transition-colors">Sign In Here</Link>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
