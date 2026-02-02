import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
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
    `flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-200 ${
      isActive 
        ? 'bg-brand-600 text-white shadow-lg shadow-brand-500/30' 
        : 'text-slate-400 hover:text-white hover:bg-slate-800'
    }`;

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans selection:bg-brand-500 selection:text-white">
      {/* Top Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 h-16">
        <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigate(user ? (user.role === UserRole.OWNER ? '/dashboard' : '/feed') : '/')}>
            <div className="w-8 h-8 bg-gradient-to-tr from-brand-500 to-indigo-500 rounded-lg flex items-center justify-center shadow-lg shadow-brand-500/20">
              <Zap size={20} className="text-white fill-current" />
            </div>
            <span className="font-bold text-lg tracking-tight">SmartTraffic<span className="text-brand-400">AI</span></span>
          </div>

          {user && (
            <div className="flex items-center space-x-2">
              {/* Credits Display - The Traffic Engine Fuel */}
              <div className="hidden md:flex items-center space-x-1.5 bg-slate-800/50 border border-slate-700 rounded-full px-3 py-1 mr-2">
                <Coins size={14} className="text-yellow-400" />
                <span className="text-sm font-bold text-white">{user.credits || 0}</span>
                <span className="text-xs text-slate-500 uppercase font-medium">Credits</span>
              </div>

              {user.role === UserRole.OWNER ? (
                <>
                  <NavLink to="/dashboard" className={navLinkClass}>
                    <LayoutDashboard size={18} />
                    <span className="text-sm font-medium">Dashboard</span>
                  </NavLink>
                  <NavLink to="/profile" className={navLinkClass}>
                    <UserIcon size={18} />
                    <span className="text-sm font-medium">Profile</span>
                  </NavLink>
                </>
              ) : (
                <>
                  <NavLink to="/feed" className={navLinkClass}>
                    <Compass size={18} />
                    <span className="text-sm font-medium">Discover</span>
                  </NavLink>
                  <NavLink to="/leaderboard" className={navLinkClass}>
                    <Trophy size={18} />
                    <span className="text-sm font-medium">Leaderboard</span>
                  </NavLink>
                  {/* Added Profile Link for Generator to allow Interest editing */}
                  <NavLink to="/profile" className={navLinkClass}>
                    <UserIcon size={18} />
                    <span className="text-sm font-medium">Profile</span>
                  </NavLink>
                </>
              )}
              <div className="h-6 w-px bg-slate-800 mx-2" />
              <button 
                onClick={handleLogout}
                className="p-2 text-slate-400 hover:text-red-400 transition-colors"
                title="Logout"
              >
                <LogOut size={18} />
              </button>
            </div>
          )}
          
          {!user && (
            <div className="flex items-center space-x-4">
               <button onClick={() => navigate('/login')} className="text-sm font-medium text-slate-300 hover:text-white transition-colors">Login</button>
               <button onClick={() => navigate('/login')} className="text-sm font-medium bg-white text-slate-900 px-4 py-2 rounded-full hover:bg-slate-200 transition-colors">Get Started</button>
            </div>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-20 px-4 max-w-7xl mx-auto pb-20">
        {children}
      </main>

      {/* Chat Bot */}
      <ChatBot />
    </div>
  );
};

export default Layout;