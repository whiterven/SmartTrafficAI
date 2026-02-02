import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { dbService } from '../services/dbService';
import { UserRole } from '../types';
import { Lock, Mail, User as UserIcon, Briefcase, ArrowRight, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

const Auth: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState(''); // Just for show in this demo
  const [name, setName] = useState('');
  const [role, setRole] = useState<UserRole>(UserRole.GENERATOR);

  // Initialize from URL params
  useEffect(() => {
    const roleParam = searchParams.get('role');
    const modeParam = searchParams.get('mode');

    if (roleParam === 'OWNER') setRole(UserRole.OWNER);
    if (roleParam === 'GENERATOR') setRole(UserRole.GENERATOR);
    
    if (modeParam === 'signup') setIsLogin(false);
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        const user = await dbService.login(email);
        if (!user) {
          throw new Error('User not found. Please sign up.');
        }
        navigate(user.role === UserRole.OWNER ? '/dashboard' : '/feed');
      } else {
        if (!name || !email) throw new Error("Please fill in all fields");
        const newUser = await dbService.register({
          id: Math.random().toString(36).substr(2, 9),
          email,
          name,
          role,
          points: 0,
          interests: [] as string[],
          dislikes: [] as string[]
        });
        navigate(newUser.role === UserRole.OWNER ? '/dashboard' : '/profile'); // Send new generators to profile to set interests
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[80vh]">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-slate-800/50 backdrop-blur-xl border border-slate-700 p-8 rounded-3xl shadow-2xl relative overflow-hidden"
      >
        {/* Background Decorative Blob */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-brand-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <h2 className="text-3xl font-bold text-center mb-2 bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p className="text-slate-400 text-center mb-8">
            {isLogin ? 'Enter your credentials to access your account' : 'Join the premium traffic network'}
          </p>

          {/* Toggle */}
          <div className="flex bg-slate-900/50 p-1 rounded-xl mb-8 border border-slate-700">
            <button
              onClick={() => { setIsLogin(true); setError(''); }}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
                isLogin ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => { setIsLogin(false); setError(''); }}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
                !isLogin ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="space-y-4">
                <div className="relative group">
                  <UserIcon className="absolute left-3 top-3.5 text-slate-500 group-focus-within:text-brand-400 transition-colors" size={18} />
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-slate-900/50 border border-slate-700 rounded-xl py-3 pl-10 pr-4 text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all"
                  />
                </div>
                
                {/* Role Selection */}
                <div className="grid grid-cols-2 gap-3">
                  <div 
                    onClick={() => setRole(UserRole.GENERATOR)}
                    className={`cursor-pointer border rounded-xl p-3 flex flex-col items-center gap-2 transition-all ${
                      role === UserRole.GENERATOR 
                        ? 'bg-brand-500/10 border-brand-500 text-brand-300 ring-1 ring-brand-500' 
                        : 'bg-slate-900/30 border-slate-700 text-slate-400 hover:border-slate-600'
                    }`}
                  >
                    <UserIcon size={20} />
                    <span className="text-xs font-semibold">I want to Discover</span>
                  </div>
                  <div 
                    onClick={() => setRole(UserRole.OWNER)}
                    className={`cursor-pointer border rounded-xl p-3 flex flex-col items-center gap-2 transition-all ${
                      role === UserRole.OWNER 
                        ? 'bg-brand-500/10 border-brand-500 text-brand-300 ring-1 ring-brand-500' 
                        : 'bg-slate-900/30 border-slate-700 text-slate-400 hover:border-slate-600'
                    }`}
                  >
                    <Briefcase size={20} />
                    <span className="text-xs font-semibold">I own a Website</span>
                  </div>
                </div>
              </div>
            )}

            <div className="relative group">
              <Mail className="absolute left-3 top-3.5 text-slate-500 group-focus-within:text-brand-400 transition-colors" size={18} />
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-900/50 border border-slate-700 rounded-xl py-3 pl-10 pr-4 text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all"
              />
            </div>

            <div className="relative group">
              <Lock className="absolute left-3 top-3.5 text-slate-500 group-focus-within:text-brand-400 transition-colors" size={18} />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-900/50 border border-slate-700 rounded-xl py-3 pl-10 pr-4 text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all"
              />
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-red-400" />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand-600 hover:bg-brand-500 text-white font-semibold py-3.5 rounded-xl shadow-lg shadow-brand-500/25 flex items-center justify-center space-x-2 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default Auth;