import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Zap, Target, ShieldCheck, ArrowRight, MousePointer2, TrendingUp, Trophy, BrainCircuit, BarChart, CheckCircle2, Search, Cpu, Users, Layers, ChevronDown, ChevronUp } from 'lucide-react';
import { dbService } from '../services/dbService';
import { UserRole } from '../types';

const Landing: React.FC = () => {
  const navigate = useNavigate();
  const user = dbService.getCurrentUser();
  const [faqOpen, setFaqOpen] = useState<number | null>(null);
  const [roleTab, setRoleTab] = useState<'owner' | 'generator'>('owner');

  const handleRoute = (role: string) => {
    if (user) {
      navigate(user.role === UserRole.OWNER ? '/dashboard' : '/feed');
    } else {
      navigate(`/login?role=${role}&mode=signup`);
    }
  };

  const toggleFaq = (index: number) => {
    setFaqOpen(faqOpen === index ? null : index);
  };

  return (
    <div className="flex flex-col items-center bg-slate-900 overflow-hidden w-full">
      
      {/* --- HERO SECTION --- */}
      <section className="w-full max-w-7xl mx-auto py-12 md:py-32 text-center px-4 relative">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/4 w-64 h-64 md:w-96 md:h-96 bg-brand-600/20 rounded-full blur-[80px] md:blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 md:w-96 md:h-96 bg-indigo-600/10 rounded-full blur-[80px] md:blur-[120px] pointer-events-none" />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10"
        >
          <div className="inline-flex items-center space-x-2 bg-slate-800/80 backdrop-blur-md border border-slate-700/50 rounded-full px-3 py-1 md:px-4 md:py-1.5 mb-6 md:mb-8 shadow-xl shadow-brand-900/20 ring-1 ring-white/5">
            <span className="flex h-1.5 w-1.5 md:h-2 md:w-2 rounded-full bg-brand-400 animate-pulse shadow-[0_0_10px_currentColor]"></span>
            <span className="text-[10px] md:text-xs font-bold text-brand-100 tracking-wide uppercase">Powered by Advanced AI Reasoning</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight mb-6 md:mb-8 leading-[1.1]">
            <span className="bg-gradient-to-b from-white via-slate-100 to-slate-400 bg-clip-text text-transparent drop-shadow-sm">Smart Traffic.</span><br /> 
            <span className="text-brand-400 drop-shadow-[0_0_30px_rgba(139,92,246,0.3)]">Intelligent Rewards.</span>
          </h1>
          
          <p className="text-base md:text-xl text-slate-400 mb-8 md:mb-12 max-w-2xl mx-auto leading-relaxed font-light px-2">
            A premium two-sided network. Website owners get <span className="text-slate-200 font-medium">high-intent visitors</span>. 
            Users discover hidden gems and <span className="text-slate-200 font-medium">earn rewards</span> for quality feedback.
          </p>
          
          {/* Two Entry Paths */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 max-w-4xl mx-auto px-2">
            <button 
              onClick={() => handleRoute('OWNER')}
              className="group relative overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 hover:border-brand-500/50 rounded-2xl md:rounded-3xl p-6 md:p-8 text-left transition-all duration-300 hover:shadow-2xl hover:shadow-brand-500/10 hover:-translate-y-1"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-brand-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10 flex items-center md:block">
                 <div className="w-12 h-12 md:w-14 md:h-14 bg-slate-800 rounded-xl md:rounded-2xl flex items-center justify-center mr-4 md:mr-0 md:mb-6 group-hover:scale-110 transition-transform duration-300 border border-slate-700 group-hover:border-brand-500/30 shadow-inner shrink-0">
                    <TrendingUp className="text-brand-400" size={24} />
                 </div>
                 <div>
                    <h3 className="text-lg md:text-2xl font-bold text-white mb-1 md:mb-2 flex items-center">
                        Get Traffic 
                        <ArrowRight className="hidden md:block ml-2 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-brand-400" size={20} />
                    </h3>
                    <p className="text-xs md:text-sm text-slate-400 leading-relaxed">
                        Owners: Submit URL & get matched visitors.
                    </p>
                 </div>
              </div>
            </button>

            <button 
              onClick={() => handleRoute('GENERATOR')}
              className="group relative overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 hover:border-emerald-500/50 rounded-2xl md:rounded-3xl p-6 md:p-8 text-left transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-500/10 hover:-translate-y-1"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10 flex items-center md:block">
                 <div className="w-12 h-12 md:w-14 md:h-14 bg-slate-800 rounded-xl md:rounded-2xl flex items-center justify-center mr-4 md:mr-0 md:mb-6 group-hover:scale-110 transition-transform duration-300 border border-slate-700 group-hover:border-emerald-500/30 shadow-inner shrink-0">
                    <Trophy className="text-emerald-400" size={24} />
                 </div>
                 <div>
                    <h3 className="text-lg md:text-2xl font-bold text-white mb-1 md:mb-2 flex items-center">
                        Earn Rewards
                        <ArrowRight className="hidden md:block ml-2 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-emerald-400" size={20} />
                    </h3>
                    <p className="text-xs md:text-sm text-slate-400 leading-relaxed">
                        Explorers: Discover sites & win prizes.
                    </p>
                 </div>
              </div>
            </button>
          </div>
        </motion.div>
      </section>

      {/* --- CORE PILLARS SECTION --- */}
      <section className="w-full bg-slate-900 border-y border-slate-800 py-16 md:py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 relative z-10">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center group"
            >
                <div className="w-12 h-12 md:w-16 md:h-16 bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-4 md:mb-6 text-brand-400 shadow-xl border border-slate-700 group-hover:border-brand-500/50 transition-colors">
                    <BrainCircuit size={24} className="md:w-8 md:h-8" />
                </div>
                <h3 className="text-lg md:text-xl font-bold text-white mb-2 md:mb-4">Deep Semantic Matching</h3>
                <p className="text-slate-400 leading-relaxed text-xs md:text-sm">Our AI engine doesn't just read keywords. It understands <span className="text-slate-200">intent</span>, analyzing your site's structure to find users who genuinely care.</p>
            </motion.div>
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-center group"
            >
                <div className="w-12 h-12 md:w-16 md:h-16 bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-4 md:mb-6 text-indigo-400 shadow-xl border border-slate-700 group-hover:border-indigo-500/50 transition-colors">
                    <ShieldCheck size={24} className="md:w-8 md:h-8" />
                </div>
                <h3 className="text-lg md:text-xl font-bold text-white mb-2 md:mb-4">Anti-Bot Quality Control</h3>
                <p className="text-slate-400 leading-relaxed text-xs md:text-sm">We track dwell time, scroll depth, and interaction patterns. Low-quality traffic and bots are <span className="text-slate-200">automatically filtered</span>.</p>
            </motion.div>
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="text-center group"
            >
                <div className="w-12 h-12 md:w-16 md:h-16 bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-4 md:mb-6 text-emerald-400 shadow-xl border border-slate-700 group-hover:border-emerald-500/50 transition-colors">
                    <MousePointer2 size={24} className="md:w-8 md:h-8" />
                </div>
                <h3 className="text-lg md:text-xl font-bold text-white mb-2 md:mb-4">Incentivized Engagement</h3>
                <p className="text-slate-400 leading-relaxed text-xs md:text-sm">Visitors aren't just clicking links—they're <span className="text-slate-200">rating your site</span>. This gamified loop ensures they actually explore your landing pages.</p>
            </motion.div>
        </div>
      </section>

      {/* --- HOW IT WORKS (TABBED) --- */}
      <section className="w-full max-w-6xl mx-auto py-16 md:py-24 px-4">
        <div className="text-center mb-10 md:mb-16">
          <h2 className="text-2xl md:text-4xl font-bold text-white mb-4 md:mb-6">How The Ecosystem Works</h2>
          <div className="inline-flex bg-slate-800/50 p-1 rounded-full border border-slate-700">
            <button 
              onClick={() => setRoleTab('owner')}
              className={`px-4 py-1.5 md:px-6 md:py-2 rounded-full text-xs md:text-sm font-semibold transition-all ${roleTab === 'owner' ? 'bg-brand-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
            >
              For Website Owners
            </button>
            <button 
              onClick={() => setRoleTab('generator')}
              className={`px-4 py-1.5 md:px-6 md:py-2 rounded-full text-xs md:text-sm font-semibold transition-all ${roleTab === 'generator' ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
            >
              For Traffic Explorers
            </button>
          </div>
        </div>

        <div className="relative bg-slate-800 rounded-3xl p-6 md:p-12 border border-slate-700 shadow-2xl overflow-hidden">
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-white/5 to-transparent rounded-bl-[100px] pointer-events-none" />
          
          {roleTab === 'owner' ? (
            <motion.div 
              key="owner"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="grid md:grid-cols-2 gap-8 md:gap-12 items-center"
            >
               <div className="space-y-6 md:space-y-8">
                  <div className="flex gap-4">
                     <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-brand-500/20 text-brand-300 flex items-center justify-center font-bold text-sm md:text-lg shrink-0 border border-brand-500/30">1</div>
                     <div>
                        <h3 className="text-lg md:text-xl font-bold text-white mb-1 md:mb-2">Submit & Analyze</h3>
                        <p className="text-xs md:text-base text-slate-400">Enter your URL. Our AI scans your content, identifies your niche, and builds a "Target Audience DNA" profile.</p>
                     </div>
                  </div>
                  <div className="flex gap-4">
                     <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-brand-500/20 text-brand-300 flex items-center justify-center font-bold text-sm md:text-lg shrink-0 border border-brand-500/30">2</div>
                     <div>
                        <h3 className="text-lg md:text-xl font-bold text-white mb-1 md:mb-2">Launch Campaign</h3>
                        <p className="text-xs md:text-base text-slate-400">Your site enters the discovery pool. Our algorithm matches it only with users who have expressed interest in your specific topic.</p>
                     </div>
                  </div>
                  <div className="flex gap-4">
                     <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-brand-500/20 text-brand-300 flex items-center justify-center font-bold text-sm md:text-lg shrink-0 border border-brand-500/30">3</div>
                     <div>
                        <h3 className="text-lg md:text-xl font-bold text-white mb-1 md:mb-2">Receive Feedback</h3>
                        <p className="text-xs md:text-base text-slate-400">Get real visitors who stay on your site. Review their star ratings and feedback to improve your conversion rate.</p>
                     </div>
                  </div>
                  <button onClick={() => handleRoute('OWNER')} className="mt-4 px-6 py-2.5 md:px-8 md:py-3 bg-brand-600 hover:bg-brand-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-brand-500/20 flex items-center gap-2 text-sm md:text-base">
                    Get Traffic Now <ArrowRight size={16} />
                  </button>
               </div>
               {/* Simplified visual for mobile */}
               <div className="hidden md:block bg-slate-900 border border-slate-700 rounded-2xl p-6 relative">
                  <div className="absolute -top-4 -right-4 bg-brand-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">Owner Dashboard</div>
                  <div className="space-y-4 opacity-80 pointer-events-none select-none">
                     <div className="h-4 bg-slate-800 rounded w-1/3"></div>
                     <div className="h-32 bg-slate-800 rounded-xl border border-slate-700/50 flex items-center justify-center">
                        <BarChart className="text-brand-500/40" size={48} />
                     </div>
                     <div className="grid grid-cols-2 gap-4">
                        <div className="h-20 bg-slate-800 rounded-xl"></div>
                        <div className="h-20 bg-slate-800 rounded-xl"></div>
                     </div>
                  </div>
               </div>
            </motion.div>
          ) : (
            <motion.div 
              key="generator"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="grid md:grid-cols-2 gap-8 md:gap-12 items-center"
            >
               <div className="space-y-6 md:space-y-8">
                  <div className="flex gap-4">
                     <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-bold text-sm md:text-lg shrink-0 border border-emerald-500/30">1</div>
                     <div>
                        <h3 className="text-lg md:text-xl font-bold text-white mb-1 md:mb-2">Build Your Profile</h3>
                        <p className="text-xs md:text-base text-slate-400">Tell us what you love—Tech, Fashion, Crypto, Design. Our AI customizes your daily discovery feed.</p>
                     </div>
                  </div>
                  <div className="flex gap-4">
                     <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-bold text-sm md:text-lg shrink-0 border border-emerald-500/30">2</div>
                     <div>
                        <h3 className="text-lg md:text-xl font-bold text-white mb-1 md:mb-2">Explore & Rate</h3>
                        <p className="text-xs md:text-base text-slate-400">Visit new websites. Stay for at least 30 seconds. Rate your experience honestly to earn credits.</p>
                     </div>
                  </div>
                  <div className="flex gap-4">
                     <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-bold text-sm md:text-lg shrink-0 border border-emerald-500/30">3</div>
                     <div>
                        <h3 className="text-lg md:text-xl font-bold text-white mb-1 md:mb-2">Climb & Win</h3>
                        <p className="text-xs md:text-base text-slate-400">Top contributors get 1.5x point multipliers, special badges, and access to exclusive high-reward campaigns.</p>
                     </div>
                  </div>
                  <button onClick={() => handleRoute('GENERATOR')} className="mt-4 px-6 py-2.5 md:px-8 md:py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-2 text-sm md:text-base">
                    Start Earning <ArrowRight size={16} />
                  </button>
               </div>
               <div className="hidden md:block bg-slate-900 border border-slate-700 rounded-2xl p-6 relative">
                  <div className="absolute -top-4 -right-4 bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">Discovery Feed</div>
                  <div className="space-y-4 opacity-80 pointer-events-none select-none">
                     <div className="h-4 bg-slate-800 rounded w-1/2"></div>
                     <div className="h-40 bg-slate-800 rounded-xl border border-slate-700/50 flex flex-col items-center justify-center gap-2">
                        <Search className="text-emerald-500/40" size={32} />
                        <div className="w-24 h-2 bg-slate-700 rounded-full"></div>
                     </div>
                     <div className="h-12 bg-emerald-500/10 rounded-xl border border-emerald-500/20"></div>
                  </div>
               </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* --- FAQ SECTION --- */}
      <section className="w-full max-w-3xl mx-auto py-16 md:py-24 px-4">
         <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-8 md:mb-12">Frequently Asked Questions</h2>
         <div className="space-y-3 md:space-y-4">
            {[
                { q: "Is the traffic real?", a: "Yes. Every visitor is a real user from our 'Generator' pool who has expressed interest in your niche. We strictly ban bots and use dwell-time verification." },
                { q: "Does this help SEO?", a: "Indirectly, yes. Real user signals like dwell time, click-through rate, and lower bounce rates are positive signals to search engines." },
                { q: "How do I earn money?", a: "Currently, Generators earn 'Credits' which can be used to promote their own projects or redeemed for digital rewards (feature coming soon)." }
            ].map((item, i) => (
                <div key={i} className="border border-slate-700 rounded-xl bg-slate-800/50 overflow-hidden">
                    <button 
                        onClick={() => toggleFaq(i)}
                        className="w-full flex justify-between items-center p-4 md:p-6 text-left hover:bg-slate-800 transition-colors"
                    >
                        <span className="font-semibold text-white text-sm md:text-base">{item.q}</span>
                        {faqOpen === i ? <ChevronUp className="text-brand-400" /> : <ChevronDown className="text-slate-500" />}
                    </button>
                    {faqOpen === i && (
                        <div className="px-4 pb-4 md:px-6 md:pb-6 text-slate-400 text-xs md:text-sm leading-relaxed border-t border-slate-700/50 pt-4">
                            {item.a}
                        </div>
                    )}
                </div>
            ))}
         </div>
      </section>

      {/* --- FINAL CTA --- */}
      <section className="w-full py-12 md:py-20 px-4">
         <div className="max-w-5xl mx-auto bg-gradient-to-r from-brand-900 to-indigo-900 rounded-3xl p-8 md:p-12 text-center relative overflow-hidden border border-brand-500/30 shadow-2xl">
             <div className="relative z-10">
                 <h2 className="text-2xl md:text-5xl font-bold text-white mb-4 md:mb-6">Ready to grow?</h2>
                 <p className="text-brand-100 text-sm md:text-lg mb-6 md:mb-8 max-w-2xl mx-auto">Join thousands of website owners and explorers building a better, more human web.</p>
                 <div className="flex flex-col sm:flex-row justify-center gap-3 md:gap-4">
                    <button 
                        onClick={() => handleRoute('OWNER')}
                        className="px-6 py-3 md:px-8 md:py-4 bg-white text-brand-900 rounded-xl font-bold hover:bg-brand-50 transition-colors shadow-lg flex items-center justify-center text-sm md:text-base"
                    >
                        I have a Website
                    </button>
                    <button 
                        onClick={() => handleRoute('GENERATOR')}
                        className="px-6 py-3 md:px-8 md:py-4 bg-brand-700 text-white rounded-xl font-bold hover:bg-brand-600 transition-colors border border-brand-500 flex items-center justify-center text-sm md:text-base"
                    >
                        I want to Explore
                    </button>
                 </div>
             </div>
         </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="w-full bg-slate-950 border-t border-slate-800 py-8 md:py-12 text-center text-slate-500 text-xs md:text-sm">
         <div className="flex items-center justify-center space-x-2 mb-4 opacity-50">
            <Zap size={14} />
            <span className="font-semibold tracking-wider">SMARTTRAFFIC AI</span>
         </div>
         <p>&copy; {new Date().getFullYear()} SmartTraffic AI. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Landing;