import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Zap, Target, ShieldCheck, ArrowRight, MousePointer2, TrendingUp, Trophy } from 'lucide-react';
import { dbService } from '../services/dbService';
import { UserRole } from '../types';

const Landing: React.FC = () => {
  const navigate = useNavigate();
  const user = dbService.getCurrentUser();

  const handleRoute = (role: string) => {
    if (user) {
      navigate(user.role === UserRole.OWNER ? '/dashboard' : '/feed');
    } else {
      // Pass the role preference to the auth page
      navigate(`/login?role=${role}&mode=signup`);
    }
  };

  return (
    <div className="flex flex-col items-center">
      {/* Hero Section */}
      <section className="w-full max-w-5xl mx-auto py-20 md:py-28 text-center px-4 relative">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-brand-600/20 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-indigo-600/20 rounded-full blur-[100px] pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10"
        >
          <div className="inline-flex items-center space-x-2 bg-slate-800/80 backdrop-blur-sm border border-slate-700/50 rounded-full px-4 py-1.5 mb-8 shadow-lg shadow-brand-900/10">
            <span className="flex h-2 w-2 rounded-full bg-brand-400 animate-pulse"></span>
            <span className="text-xs font-medium text-brand-200">Powered by Gemini 3 Reasoning</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-tight">
            <span className="bg-gradient-to-b from-white via-white to-slate-400 bg-clip-text text-transparent">Smart Traffic.</span><br /> 
            <span className="text-brand-400">Intelligent Rewards.</span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed">
            A premium two-sided network. Website owners get high-intent visitors. 
            Users discover hidden gems and earn rewards for quality feedback.
          </p>
          
          {/* Two Entry Paths - Requirement #1 */}
          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            <button 
              onClick={() => handleRoute('OWNER')}
              className="group relative overflow-hidden bg-slate-800 hover:bg-slate-750 border border-slate-700 hover:border-brand-500/50 rounded-3xl p-8 text-left transition-all duration-300 hover:shadow-2xl hover:shadow-brand-500/10 hover:-translate-y-1"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-brand-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative z-10">
                 <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform border border-slate-700 group-hover:border-brand-500/30">
                    <TrendingUp className="text-brand-400" size={24} />
                 </div>
                 <h3 className="text-xl font-bold text-white mb-2 flex items-center">
                    Get Traffic 
                    <ArrowRight className="ml-2 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" size={18} />
                 </h3>
                 <p className="text-sm text-slate-400">
                    For website owners.<br/>Submit your URL and get AI-matched visitors.
                 </p>
              </div>
            </button>

            <button 
              onClick={() => handleRoute('GENERATOR')}
              className="group relative overflow-hidden bg-slate-800 hover:bg-slate-750 border border-slate-700 hover:border-emerald-500/50 rounded-3xl p-8 text-left transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-500/10 hover:-translate-y-1"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative z-10">
                 <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform border border-slate-700 group-hover:border-emerald-500/30">
                    <Trophy className="text-emerald-400" size={24} />
                 </div>
                 <h3 className="text-xl font-bold text-white mb-2 flex items-center">
                    Earn Rewards
                    <ArrowRight className="ml-2 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" size={18} />
                 </h3>
                 <p className="text-sm text-slate-400">
                    For explorers.<br/>Discover sites you love, rate them, and win.
                 </p>
              </div>
            </button>
          </div>
        </motion.div>
      </section>

      {/* Value Prop Section */}
      <section className="w-full bg-slate-800/30 border-y border-slate-800 py-20">
        <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-3 gap-12">
            <div className="text-center">
                <div className="w-14 h-14 bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-6 text-brand-400 shadow-lg border border-slate-700">
                    <Target size={28} />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Precision Matching</h3>
                <p className="text-slate-400 leading-relaxed">Gemini 3 analyzes site content and user interests to ensure every visit is relevant.</p>
            </div>
            <div className="text-center">
                <div className="w-14 h-14 bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-6 text-indigo-400 shadow-lg border border-slate-700">
                    <ShieldCheck size={28} />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Quality Control</h3>
                <p className="text-slate-400 leading-relaxed">We track dwell time and rating consistency to filter out bots and low-quality traffic.</p>
            </div>
            <div className="text-center">
                <div className="w-14 h-14 bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-6 text-emerald-400 shadow-lg border border-slate-700">
                    <MousePointer2 size={28} />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Real Engagement</h3>
                <p className="text-slate-400 leading-relaxed">Visitors are incentivized to actually explore your content, not just bounce immediately.</p>
            </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;