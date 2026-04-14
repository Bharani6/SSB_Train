import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Shield, ChevronLeft, Lock, ArrowRight, CheckCircle2, AlertCircle, Loader2, KeyRound, Eye, EyeOff } from 'lucide-react';
import axios from 'axios';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validateEmail = (e) => {
    return String(e)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setIsLoading(true);
    try {
      await axios.post('/api/auth/forgot-password', { email });
      alert(`SIMULATED RECOVERY OTP: 123456`);
      setStep(2);
    } catch (err) {
      console.error("Recovery failed:", err);
      setError(err.response?.data || err.message || "Failed to initiate recovery. Try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError('');

    if (otp.length !== 6) {
      setError("Please enter a 6-digit verification code.");
      return;
    }

    setIsLoading(true);
    try {
      if (otp !== "123456") {
        throw new Error("Invalid verification code.");
      }
      setStep(3);
    } catch (err) {
      setError(err.message || "Invalid verification code.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsLoading(true);
    try {
      await axios.post('/api/auth/update-password', {
        email,
        password: newPassword
      });
      setIsSubmitted(true);
    } catch (err) {
      setError("Failed to update password. System error.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020503] text-white flex flex-col md:flex-row relative overflow-hidden font-sans">
      {/* ── BACKGROUND IMAGE SECTION (SPLIT SCREEN) ── */}
      <div className="absolute inset-0 z-0 hidden md:block md:w-[50%] lg:w-[60%] overflow-hidden">
        <motion.div
          className="absolute inset-0 w-full h-full bg-cover bg-center origin-center"
          style={{ backgroundImage: 'url("/assets/ssb1.jpg")' }}
          initial={{ scale: 1.15 }}
          animate={{ scale: 1 }}
          transition={{ duration: 25, ease: "linear", repeat: Infinity, repeatType: "reverse" }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#020503] z-10" />
        <div className="absolute inset-0 border-r border-white/5 z-20" />

        {/* Decorative Badge */}
        <div className="absolute bottom-10 left-10 z-30 p-6 bg-[#020503]/60 backdrop-blur-md rounded-2xl border border-white/10 flex items-center gap-4 max-w-xs">
          <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
            <Shield className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <h3 className="text-white font-black uppercase text-sm tracking-widest">Candidate Rescue</h3>
            <p className="text-slate-400 text-[11px] font-medium mt-1 leading-relaxed">Secure protocol initiated using email authentication.</p>
          </div>
        </div>
      </div>

      {/* ── MOBILE BACKGROUND IMAGE ── */}
      <div className="absolute inset-0 z-0 block md:hidden opacity-30">
        <div
          className="absolute inset-0 w-full h-full bg-cover bg-center"
          style={{ backgroundImage: 'url("/assets/ssb1.jpg")' }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#020503] via-[#020503]/80 to-[#020503]/40 z-10" />
      </div>

      {/* ── FORM SECTION ── */}
      <div className="relative z-20 flex-1 flex flex-col md:ml-[50%] lg:ml-[60%] bg-transparent md:bg-[#020503] p-6 pt-10 min-h-[100dvh]">
        <header className="flex justify-between items-center mb-auto pt-4 px-2">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
              <Shield className="w-4 h-4 text-emerald-500" />
            </div>
            <span className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-200">SSB.TRAIN</span>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Link to="/login" className="flex items-center gap-2 group text-slate-400 hover:text-emerald-400 transition-colors bg-white/5 py-2 px-4 rounded-full border border-white/5 hover:border-emerald-500/30">
              <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span className="text-[10px] font-bold uppercase tracking-widest hidden sm:inline-block">Return</span>
            </Link>
          </motion.div>
        </header>

        <main className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full md:w-[400px]">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-emerald-600/5 rounded-full blur-[100px] pointer-events-none" />

            <div className="relative z-10 text-center mb-10">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, delay: 0.3 }}
                className="w-16 h-16 bg-gradient-to-br from-emerald-500/20 to-emerald-900/40 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-emerald-500/30 shadow-[0_0_30px_rgba(16,185,129,0.15)] overflow-hidden relative group"
              >
                <div className="absolute inset-0 bg-emerald-400/20 w-full h-[2px] blur-[2px] animate-[scan_3s_ease-in-out_infinite]" />
                <Lock className="w-7 h-7 text-emerald-400 group-hover:scale-110 transition-transform duration-500 z-10 relative" />
              </motion.div>
              <h1 className="text-3xl font-black text-white mb-3 tracking-tight uppercase">Access Recovery</h1>
              <p className="text-slate-400 text-sm font-medium leading-relaxed">Identity verification required. A secure reset code will be dispatched to your registered email.</p>
            </div>

            <AnimatePresence mode="wait">
              {!isSubmitted ? (
                <motion.div
                  key="form"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.4 }}
                >
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mb-8 p-4 rounded-xl border border-red-500/30 bg-red-500/10 backdrop-blur-md flex items-start gap-3 overflow-hidden"
                    >
                      <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                      <p className="text-red-300 text-xs font-bold leading-relaxed">{error}</p>
                    </motion.div>
                  )}

                  {step === 1 && (
                    <form onSubmit={handleSendOtp} className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-[11px] font-black text-emerald-500/80 uppercase tracking-[0.2em] ml-1">
                          Registered Email Address
                        </label>
                        <div className="relative group/input">
                          <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-emerald-500/50 to-teal-500/50 opacity-0 group-hover/input:opacity-100 blur transition-opacity duration-500" />
                          <div className="relative flex items-center bg-[#0a120e] rounded-xl border border-white/10 group-hover/input:border-emerald-500/50 focus-within:border-emerald-400 focus-within:bg-[#0c1a14] transition-all duration-300 overflow-hidden shadow-lg">
                            <div className="pl-4 pr-3 py-4 flex items-center justify-center text-slate-500 group-focus-within/input:text-emerald-400 transition-colors">
                              <Mail className="w-5 h-5" />
                            </div>
                            <input
                              type="email"
                              value={email}
                              onChange={e => setEmail(e.target.value)}
                              required
                              className="w-full bg-transparent py-4 pr-4 pl-0 text-white text-[15px] focus:outline-none placeholder:text-slate-600 font-medium"
                              placeholder="candidate@gmail.com"
                            />
                          </div>
                        </div>
                      </div>

                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        disabled={isLoading}
                        className="w-full relative group/btn h-14 mt-4"
                      >
                        <div className="absolute inset-0 bg-emerald-600 to-teal-600 rounded-xl blur-[8px] opacity-60 group-hover/btn:opacity-100 transition-opacity duration-500" />
                        <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl overflow-hidden border border-white/10 group-hover/btn:border-white/30">
                          <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-500 ease-in-out" />
                        </div>
                        <div className="relative h-full flex items-center justify-center gap-3 text-[13px] font-black uppercase tracking-[0.2em] text-white overflow-hidden rounded-xl">
                          {isLoading ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                          ) : (
                            <>INITIATE PROTOCOL <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" /></>
                          )}
                        </div>
                      </motion.button>
                    </form>
                  )}

                  {step === 2 && (
                    <form onSubmit={handleVerifyOtp} className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-[11px] font-black text-emerald-500/80 uppercase tracking-[0.2em] ml-1">
                          Verification Code (OTP)
                        </label>
                        <div className="relative flex items-center bg-[#0a120e] rounded-xl border border-white/10 focus-within:border-emerald-400 transition-all overflow-hidden shadow-lg">
                          <div className="pl-4 pr-3 py-4 flex items-center justify-center text-slate-500 group-focus-within/input:text-emerald-400 transition-colors">
                            <Shield className="w-5 h-5" />
                          </div>
                          <input
                            type="text"
                            value={otp}
                            onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                            required
                            className="w-full bg-transparent py-4 pr-4 pl-0 text-white text-[15px] focus:outline-none placeholder:text-slate-600 font-medium tracking-[0.5em]"
                            placeholder="••••••"
                          />
                        </div>
                      </div>

                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        disabled={isLoading}
                        className="w-full relative group/btn h-14 mt-4 text-white"
                      >
                        <div className="absolute inset-0 bg-emerald-600 rounded-xl" />
                        <span className="relative z-10 font-black uppercase text-xs tracking-widest">
                          {isLoading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : "Verify & Unlock"}
                        </span>
                      </motion.button>
                    </form>
                  )}

                  {step === 3 && (
                    <form onSubmit={handleResetPassword} className="space-y-5">
                      <div className="space-y-2">
                        <label className="text-[11px] font-black text-emerald-500/80 uppercase tracking-[0.2em] ml-1">New Access Password</label>
                        <div className="relative flex items-center bg-[#0a120e] rounded-xl border border-white/10 overflow-hidden">
                          <div className="px-4 text-slate-500"><KeyRound className="w-5 h-5" /></div>
                          <input
                            type={showPassword ? "text" : "password"}
                            value={newPassword}
                            onChange={e => setNewPassword(e.target.value)}
                            required
                            className="w-full bg-transparent py-4 pr-12 text-white text-sm focus:outline-none"
                            placeholder="New Password"
                          />
                          <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 text-slate-500">
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[11px] font-black text-emerald-500/80 uppercase tracking-[0.2em] ml-1">Confirm Security Hash</label>
                        <div className="relative flex items-center bg-[#0a120e] rounded-xl border border-white/10 overflow-hidden">
                          <div className="px-4 text-slate-500"><Lock className="w-5 h-5" /></div>
                          <input
                            type="password"
                            value={confirmPassword}
                            onChange={e => setConfirmPassword(e.target.value)}
                            required
                            className="w-full bg-transparent py-4 pr-4 text-white text-sm focus:outline-none"
                            placeholder="Confirm Password"
                          />
                        </div>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-emerald-600 h-14 rounded-xl font-black uppercase text-xs tracking-widest shadow-lg shadow-emerald-900/40"
                      >
                        {isLoading ? <Loader2 className="w-5 h-5 animate-spin mx-auto text-white" /> : "Commit Changes"}
                      </motion.button>
                    </form>
                  )}
                </motion.div>
              ) : (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-[#0a120e] rounded-2xl border border-emerald-500/20 p-8 text-center shadow-[0_0_40px_rgba(16,185,129,0.1)] relative overflow-hidden"
                >
                  <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500" />
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", delay: 0.2 }}
                  >
                    <CheckCircle2 className="w-14 h-14 text-emerald-400 mx-auto mb-4" />
                  </motion.div>
                  <h2 className="text-xl font-black text-white mb-3 uppercase tracking-wide">Password Updated</h2>
                  <p className="text-slate-400 text-[13px] mb-8 leading-relaxed">
                    Your password has been successfully reset for<br />
                    <span className="text-white font-bold inline-block mt-2 px-3 py-1 bg-white/5 rounded-md border border-white/10">{email}</span>
                  </p>
                  <Link to="/login" className="inline-flex items-center justify-center gap-2 w-full bg-white/5 hover:bg-white/10 border border-white/10 py-3.5 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all text-slate-300 hover:text-white group">
                    <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Acknowledge & Return
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-auto pt-10 pb-6 flex flex-col items-center gap-3"
          >
            <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.2em]">
              <div className="flex items-center gap-2 text-emerald-500/60">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-[pulse_2s_ease-in-out_infinite]" />
                SECURE CHANNEL
              </div>
            </div>
          </motion.div>
        </main>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes scan {
          0% { top: -10%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 110%; opacity: 0; }
        }
      `}} />
    </div>
  );
}
