import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, LogOut, CheckSquare } from 'lucide-react';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register' || location.pathname === '/' || location.pathname === '/forgot-password';

  const handleLogout = () => {
    localStorage.removeItem('USER_DATA');
    navigate('/login');
  };

  if (isAuthPage) return null;

  return (
    <nav className="glass-panel mx-6 mt-6 px-6 py-4 flex items-center justify-between sticky top-6 z-50 shadow-2xl">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center border border-primary/30">
          <CheckSquare className="w-5 h-5 text-primary" />
        </div>
        <span className="text-xl font-black text-white tracking-tighter uppercase italic">SSB.train</span>
      </div>
      
      <div className="flex items-center gap-6">
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
    </nav>
  );
}
