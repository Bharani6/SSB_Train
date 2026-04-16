import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, LogOut, CheckSquare, Menu, X } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register' || location.pathname === '/' || location.pathname === '/forgot-password';

  const handleLogout = () => {
    localStorage.removeItem('USER_DATA');
    navigate('/login');
    setIsOpen(false);
  };

  if (isAuthPage) return null;

  return (
    <nav className="glass-panel mx-4 md:mx-6 mt-4 md:mt-6 px-4 md:px-6 py-3 md:py-4 flex items-center justify-between sticky top-4 md:top-6 z-50 shadow-2xl">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center border border-primary/30">
          <CheckSquare className="w-5 h-5 text-primary" />
        </div>
        <span className="text-lg md:text-xl font-black text-white tracking-tighter uppercase italic">SSB.train</span>
      </div>
      
      {/* Desktop Menu */}
      <div className="hidden md:flex items-center gap-6">
        <Link to="/dashboard" className={`flex items-center gap-2 text-sm font-bold uppercase tracking-widest ${location.pathname === '/dashboard' ? 'text-primary' : 'text-textSecondary hover:text-white transition-colors'}`}>
          <LayoutDashboard className="w-4 h-4" />
          Dashboard
        </Link>
        <div className="h-6 w-px bg-white/10" />
        <button onClick={handleLogout} className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-red-500 hover:text-red-400 transition-colors">
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>

      {/* Mobile Menu Toggle */}
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="md:hidden p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-4 md:hidden glass-panel p-4 flex flex-col gap-4 animate-in fade-in slide-in-from-top-4 duration-300">
          <Link 
            to="/dashboard" 
            onClick={() => setIsOpen(false)}
            className={`flex items-center gap-3 p-3 rounded-lg text-sm font-bold uppercase tracking-widest ${location.pathname === '/dashboard' ? 'bg-primary/20 text-primary' : 'text-textSecondary hover:bg-white/5'}`}
          >
            <LayoutDashboard className="w-5 h-5" />
            Dashboard
          </Link>
          <button 
            onClick={handleLogout} 
            className="flex items-center gap-3 p-3 rounded-lg text-sm font-bold uppercase tracking-widest text-red-500 hover:bg-red-500/10 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}
