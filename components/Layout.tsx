import React from 'react';
import { NavLink, useNavigate, Link } from 'react-router-dom';
import { dbService } from '../services/dbService';
import { UserRole } from '../types';
import { Zap, LogOut, LayoutDashboard, Compass, Trophy, User as UserIcon, Coins } from 'lucide-react';
import ChatBot from './ChatBot';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const user = dbService.getCurrentUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    dbService.logout();
    navigate('/');
  };

  const navLinkClass = ({ isActive }: { isActive: boolean }) => 
    `flex items-center space-x-2 px-3 py-1.5 md:px-4 md:py-2 rounded-full transition-all duration-200 ${
      isActive 
        ? 'bg-brand-600 text-white shadow-lg shadow-brand-500/30' 
        : 'text-slate-400 hover:text-white hover:bg-slate-800'
    }`;

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans selection:bg-brand-500 selection:text-white flex flex-col">
      {/* Top Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 h-14 md:h-16">
        <div className="max-w-7xl mx-auto px-3 md:px-4 h-full flex items-center justify-between">
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigate(user ? (user.role === UserRole.OWNER ? '/dashboard' : '/feed') : '/')}>
            <div className="w-7 h-7 md:w-8 md:h-8 bg-gradient-to-tr from-brand-500 to-indigo-500 rounded-lg flex items-center justify-center shadow-lg shadow-brand-500/20">
              <Zap size={18} className="text-white fill-current md:w-5 md:h-5" />
            </div>
            <span className="font-bold text-base md:text-lg tracking-tight">SmartTraffic<span className="text-brand-400">AI</span></span>
          </div>

          {user && (
            <div className="flex items-center gap-1 md:gap-2">
              {/* Stats Display - Compact on Mobile */}
              <div className="flex items-center mr-1 md:mr-2">
                  <div className="flex items-center space-x-1 md:space-x-1.5 bg-slate-800/50 border border-slate-700 rounded-full px-2 py-1 md:px-3">
                    <Coins size={12} className="text-yellow-400 md:w-3.5 md:h-3.5" />
                    <span className="text-xs md:text-sm font-bold text-white">{user.credits || 0}</span>
                  </div>
              </div>

              {user.role === UserRole.OWNER ? (
                <>
                  <NavLink to="/dashboard" className={navLinkClass} title="Dashboard">
                    <LayoutDashboard size={18} className="md:w-[18px] md:h-[18px]" />
                    <span className="hidden md:inline text-sm font-medium">Dashboard</span>
                  </NavLink>
                  <NavLink to="/profile" className={navLinkClass} title="Profile">
                    <UserIcon size={18} className="md:w-[18px] md:h-[18px]" />
                    <span className="hidden md:inline text-sm font-medium">Profile</span>
                  </NavLink>
                </>
              ) : (
                <>
                  <NavLink to="/feed" className={navLinkClass} title="Discovery Feed">
                    <Compass size={18} className="md:w-[18px] md:h-[18px]" />
                    <span className="hidden md:inline text-sm font-medium">Discover</span>
                  </NavLink>
                  <NavLink to="/leaderboard" className={navLinkClass} title="Leaderboard">
                    <Trophy size={18} className="md:w-[18px] md:h-[18px]" />
                    <span className="hidden md:inline text-sm font-medium">Leaderboard</span>
                  </NavLink>
                  <NavLink to="/profile" className={navLinkClass} title="Profile">
                    <UserIcon size={18} className="md:w-[18px] md:h-[18px]" />
                    <span className="hidden md:inline text-sm font-medium">Profile</span>
                  </NavLink>
                </>
              )}
              <div className="h-5 w-px bg-slate-800 mx-1 md:mx-2" />
              <button 
                onClick={handleLogout}
                className="p-1.5 md:p-2 text-slate-400 hover:text-red-400 transition-colors"
                title="Logout"
              >
                <LogOut size={18} className="md:w-[18px] md:h-[18px]" />
              </button>
            </div>
          )}
          
          {!user && (
            <div className="flex items-center space-x-2 md:space-x-4">
               <NavLink to="/pricing" className="text-xs md:text-sm font-medium text-slate-300 hover:text-white transition-colors hidden sm:block">Pricing</NavLink>
               <button onClick={() => navigate('/login')} className="text-xs md:text-sm font-medium text-slate-300 hover:text-white transition-colors">Login</button>
               <button onClick={() => navigate('/login')} className="text-xs md:text-sm font-medium bg-white text-slate-900 px-3 py-1.5 md:px-4 md:py-2 rounded-full hover:bg-slate-200 transition-colors">Get Started</button>
            </div>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 pt-16 md:pt-20 px-3 md:px-4 max-w-7xl mx-auto w-full">
        {children}
      </main>

      {/* Footer */}
      <footer className="w-full bg-slate-950 border-t border-slate-800 py-10 text-center text-slate-500 text-xs md:text-sm mt-auto">
         <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center space-x-2 opacity-70 hover:opacity-100 transition-opacity">
                <Zap size={14} />
                <span className="font-semibold tracking-wider">SMARTTRAFFIC AI</span>
            </div>
            
            <div className="flex flex-wrap justify-center gap-6">
                <Link to="/about" className="hover:text-white transition-colors">About</Link>
                <Link to="/pricing" className="hover:text-white transition-colors">Pricing</Link>
                <Link to="/contact" className="hover:text-white transition-colors">Contact</Link>
                <Link to="/privacy" className="hover:text-white transition-colors">Privacy</Link>
                <Link to="/terms" className="hover:text-white transition-colors">Terms</Link>
            </div>

            <p className="opacity-50">&copy; {new Date().getFullYear()} SmartTraffic AI.</p>
         </div>
      </footer>

      {/* Chat Bot */}
      <ChatBot />
    </div>
  );
};

export default Layout;