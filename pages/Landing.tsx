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
      // Pass the role preference to the auth page
      navigate(`/login?role=${role}&mode=signup`);
    }
  };

  const toggleFaq = (index: number) => {
    setFaqOpen(faqOpen === index ? null : index);
  };

  return (
    <div className="flex flex-col items-center bg-slate-900 overflow-hidden">
      
      {/* --- HERO SECTION --- */}
      <section className="w-full max-w-7xl mx-auto py-20 md:py-32 text-center px-4 relative">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-600/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-800/20 via-slate-900/0 to-slate-900/0 pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10"
        >
          <div className="inline-flex items-center space-x-2 bg-slate-800/80 backdrop-blur-md border border-slate-700/50 rounded-full px-4 py-1.5 mb-8 shadow-xl shadow-brand-900/20 ring-1 ring-white/5">
            <span className="flex h-2 w-2 rounded-full bg-brand-400 animate-pulse shadow-[0_0_10px_currentColor]"></span>
            <span className="text-xs font-bold text-brand-100 tracking-wide uppercase">Powered by Advanced AI Reasoning</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 leading-tight">
            <span className="bg-gradient-to-b from-white via-slate-100 to-slate-400 bg-clip-text text-transparent drop-shadow-sm">Smart Traffic.</span><br /> 
            <span className="text-brand-400 drop-shadow-[0_0_30px_rgba(139,92,246,0.3)]">Intelligent Rewards.</span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed font-light">
            A premium two-sided network. Website owners get <span className="text-slate-200 font-medium">high-intent visitors</span>. 
            Users discover hidden gems and <span className="text-slate-200 font-medium">earn rewards</span> for quality feedback.
          </p>
          
          {/* Two Entry Paths */}
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <button 
              onClick={() => handleRoute('OWNER')}
              className="group relative overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 hover:border-brand-500/50 rounded-3xl p-8 text-left transition-all duration-300 hover:shadow-2xl hover:shadow-brand-500/10 hover:-translate-y-1"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-brand-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10">
                 <div className="w-14 h-14 bg-slate-800 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 border border-slate-700 group-hover:border-brand-500/30 shadow-inner">
                    <TrendingUp className="text-brand-400" size={28} />
                 </div>
                 <h3 className="text-2xl font-bold text-white mb-2 flex items-center">
                    Get Traffic 
                    <ArrowRight className="ml-2 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-brand-400" size={20} />
                 </h3>
                 <p className="text-sm text-slate-400 leading-relaxed">
                    For website owners.<br/>Submit your URL and get AI-matched visitors instantly.
                 </p>
              </div>
            </button>

            <button 
              onClick={() => handleRoute('GENERATOR')}
              className="group relative overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 hover:border-emerald-500/50 rounded-3xl p-8 text-left transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-500/10 hover:-translate-y-1"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10">
                 <div className="w-14 h-14 bg-slate-800 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 border border-slate-700 group-hover:border-emerald-500/30 shadow-inner">
                    <Trophy className="text-emerald-400" size={28} />
                 </div>
                 <h3 className="text-2xl font-bold text-white mb-2 flex items-center">
                    Earn Rewards
                    <ArrowRight className="ml-2 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-emerald-400" size={20} />
                 </h3>
                 <p className="text-sm text-slate-400 leading-relaxed">
                    For explorers.<br/>Discover sites you love, rate them, and win prizes.
                 </p>
              </div>
            </button>
          </div>
        </motion.div>
      </section>

      {/* --- CORE PILLARS SECTION --- */}
      <section className="w-full bg-slate-900 border-y border-slate-800 py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-slate-800/20" /> {/* Subtle overlay */}
        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-3 gap-12 relative z-10">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-center group"
            >
                <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-6 text-brand-400 shadow-xl border border-slate-700 group-hover:border-brand-500/50 transition-colors">
                    <BrainCircuit size={32} />
                </div>
                <h3 className="text-xl font-bold text-white mb-4 group-hover:text-brand-300 transition-colors">Deep Semantic Matching</h3>
                <p className="text-slate-400 leading-relaxed text-sm">Our AI engine doesn't just read keywords. It understands <span className="text-slate-200">intent</span>, analyzing your site's structure to find users who genuinely care about your content.</p>
            </motion.div>
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="text-center group"
            >
                <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-6 text-indigo-400 shadow-xl border border-slate-700 group-hover:border-indigo-500/50 transition-colors">
                    <ShieldCheck size={32} />
                </div>
                <h3 className="text-xl font-bold text-white mb-4 group-hover:text-indigo-300 transition-colors">Anti-Bot Quality Control</h3>
                <p className="text-slate-400 leading-relaxed text-sm">We track dwell time, scroll depth, and interaction patterns. Low-quality traffic and bots are <span className="text-slate-200">automatically filtered</span> out of the ecosystem.</p>
            </motion.div>
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="text-center group"
            >
                <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-6 text-emerald-400 shadow-xl border border-slate-700 group-hover:border-emerald-500/50 transition-colors">
                    <MousePointer2 size={32} />
                </div>
                <h3 className="text-xl font-bold text-white mb-4 group-hover:text-emerald-300 transition-colors">Incentivized Engagement</h3>
                <p className="text-slate-400 leading-relaxed text-sm">Visitors aren't just clicking links—they're <span className="text-slate-200">rating your site</span>. This gamified loop ensures they actually explore your landing pages.</p>
            </motion.div>
        </div>
      </section>

      {/* --- HOW IT WORKS (TABBED) --- */}
      <section className="w-full max-w-6xl mx-auto py-24 px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">How The Ecosystem Works</h2>
          <div className="inline-flex bg-slate-800/50 p-1 rounded-full border border-slate-700">
            <button 
              onClick={() => setRoleTab('owner')}
              className={`px-6 py-2 rounded-full text-sm font-semibold transition-all ${roleTab === 'owner' ? 'bg-brand-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
            >
              For Website Owners
            </button>
            <button 
              onClick={() => setRoleTab('generator')}
              className={`px-6 py-2 rounded-full text-sm font-semibold transition-all ${roleTab === 'generator' ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
            >
              For Traffic Explorers
            </button>
          </div>
        </div>

        <div className="relative bg-slate-800 rounded-3xl p-8 md:p-12 border border-slate-700 shadow-2xl overflow-hidden">
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-white/5 to-transparent rounded-bl-[100px] pointer-events-none" />
          
          {roleTab === 'owner' ? (
            <motion.div 
              key="owner"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="grid md:grid-cols-2 gap-12 items-center"
            >
               <div className="space-y-8">
                  <div className="flex gap-4">
                     <div className="w-10 h-10 rounded-full bg-brand-500/20 text-brand-300 flex items-center justify-center font-bold text-lg shrink-0 border border-brand-500/30">1</div>
                     <div>
                        <h3 className="text-xl font-bold text-white mb-2">Submit & Analyze</h3>
                        <p className="text-slate-400">Enter your URL. Our AI scans your content, identifies your niche, and builds a "Target Audience DNA" profile.</p>
                     </div>
                  </div>
                  <div className="flex gap-4">
                     <div className="w-10 h-10 rounded-full bg-brand-500/20 text-brand-300 flex items-center justify-center font-bold text-lg shrink-0 border border-brand-500/30">2</div>
                     <div>
                        <h3 className="text-xl font-bold text-white mb-2">Launch Campaign</h3>
                        <p className="text-slate-400">Your site enters the discovery pool. Our algorithm matches it only with users who have expressed interest in your specific topic.</p>
                     </div>
                  </div>
                  <div className="flex gap-4">
                     <div className="w-10 h-10 rounded-full bg-brand-500/20 text-brand-300 flex items-center justify-center font-bold text-lg shrink-0 border border-brand-500/30">3</div>
                     <div>
                        <h3 className="text-xl font-bold text-white mb-2">Receive Feedback</h3>
                        <p className="text-slate-400">Get real visitors who stay on your site. Review their star ratings and feedback to improve your conversion rate.</p>
                     </div>
                  </div>
                  <button onClick={() => handleRoute('OWNER')} className="mt-4 px-8 py-3 bg-brand-600 hover:bg-brand-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-brand-500/20 flex items-center gap-2">
                    Get Traffic Now <ArrowRight size={18} />
                  </button>
               </div>
               <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 relative">
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
              className="grid md:grid-cols-2 gap-12 items-center"
            >
               <div className="space-y-8">
                  <div className="flex gap-4">
                     <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-bold text-lg shrink-0 border border-emerald-500/30">1</div>
                     <div>
                        <h3 className="text-xl font-bold text-white mb-2">Build Your Profile</h3>
                        <p className="text-slate-400">Tell us what you love—Tech, Fashion, Crypto, Design. Our AI customizes your daily discovery feed.</p>
                     </div>
                  </div>
                  <div className="flex gap-4">
                     <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-bold text-lg shrink-0 border border-emerald-500/30">2</div>
                     <div>
                        <h3 className="text-xl font-bold text-white mb-2">Explore & Rate</h3>
                        <p className="text-slate-400">Visit new websites. Stay for at least 30 seconds. Rate your experience honestly to earn credits.</p>
                     </div>
                  </div>
                  <div className="flex gap-4">
                     <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-bold text-lg shrink-0 border border-emerald-500/30">3</div>
                     <div>
                        <h3 className="text-xl font-bold text-white mb-2">Climb & Win</h3>
                        <p className="text-slate-400">Top contributors get 1.5x point multipliers, special badges, and access to exclusive high-reward campaigns.</p>
                     </div>
                  </div>
                  <button onClick={() => handleRoute('GENERATOR')} className="mt-4 px-8 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-2">
                    Start Earning <ArrowRight size={18} />
                  </button>
               </div>
               <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 relative">
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

      {/* --- TECH SPECS SECTION --- */}
      <section className="w-full bg-slate-800 py-24 border-y border-slate-700">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-12 items-center">
            <div className="flex-1">
               <div className="inline-flex items-center space-x-2 text-brand-400 mb-4 font-mono text-sm tracking-wider uppercase">
                  <Cpu size={16} />
                  <span>The Engine</span>
               </div>
               <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Built on Next-Gen Reasoning AI.</h2>
               <p className="text-slate-400 text-lg mb-8 leading-relaxed">
                  SmartTraffic isn't a simple directory. It's an autonomous agent. 
                  Using multimodal vision capabilities, it actually "looks" at your website to understand design quality, 
                  reads your content to grasp semantic meaning, and predicts user engagement probability.
               </p>
               
               <div className="space-y-4">
                  {[
                    'Multimodal Vision Analysis (Screenshots -> Data)', 
                    'Function Calling for Auto-Campaigns', 
                    'Google Search Grounding for Niche Verification',
                    'Thinking Mode for Strategy Generation'
                  ].map((item, i) => (
                    <div key={i} className="flex items-center space-x-3">
                       <CheckCircle2 size={20} className="text-brand-500" />
                       <span className="text-slate-300 font-medium">{item}</span>
                    </div>
                  ))}
               </div>
            </div>
            <div className="flex-1 relative">
                {/* Abstract Code Visual */}
                <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 font-mono text-xs md:text-sm text-slate-400 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-500 to-indigo-500" />
                    <div className="space-y-2">
                        <p><span className="text-purple-400">const</span> analysis = <span className="text-blue-400">await</span> ai.models.generateContent({'{'}</p>
                        <p className="pl-4">model: <span className="text-green-400">'neural-reasoning-v3'</span>,</p>
                        <p className="pl-4">tools: [<span className="text-yellow-400">googleSearch</span>, <span className="text-yellow-400">vision</span>],</p>
                        <p className="pl-4">reasoning_effort: <span className="text-orange-400">'high'</span></p>
                        <p>});</p>
                        <p className="text-slate-600">// Extracting semantic niche and quality signals...</p>
                        <p><span className="text-purple-400">return</span> matchScore({'{'} user: <span className="text-blue-400">currentUser</span>, site: <span className="text-blue-400">analysis</span> {'}'});</p>
                    </div>
                    {/* Glowing Orb */}
                    <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-brand-500/20 blur-[50px] rounded-full pointer-events-none" />
                </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- FAQ SECTION --- */}
      <section className="w-full max-w-3xl mx-auto py-24 px-4">
         <h2 className="text-3xl font-bold text-white text-center mb-12">Frequently Asked Questions</h2>
         <div className="space-y-4">
            {[
                { q: "Is the traffic real?", a: "Yes. Every visitor is a real user from our 'Generator' pool who has expressed interest in your niche. We strictly ban bots and use dwell-time verification." },
                { q: "Does this help SEO?", a: "Indirectly, yes. Real user signals like dwell time, click-through rate, and lower bounce rates are positive signals to search engines. Plus, our AI agents can generate backlink content." },
                { q: "How do I earn money?", a: "Currently, Generators earn 'Credits' which can be used to promote their own projects or redeemed for digital rewards (feature coming soon)." },
                { q: "What AI technology is used?", a: "We utilize enterprise-grade multimodal AI models. We use them to 'see' and 'understand' websites better than any keyword scraper ever could." }
            ].map((item, i) => (
                <div key={i} className="border border-slate-700 rounded-xl bg-slate-800/50 overflow-hidden">
                    <button 
                        onClick={() => toggleFaq(i)}
                        className="w-full flex justify-between items-center p-6 text-left hover:bg-slate-800 transition-colors"
                    >
                        <span className="font-semibold text-white">{item.q}</span>
                        {faqOpen === i ? <ChevronUp className="text-brand-400" /> : <ChevronDown className="text-slate-500" />}
                    </button>
                    {faqOpen === i && (
                        <div className="px-6 pb-6 text-slate-400 text-sm leading-relaxed border-t border-slate-700/50 pt-4">
                            {item.a}
                        </div>
                    )}
                </div>
            ))}
         </div>
      </section>

      {/* --- FINAL CTA --- */}
      <section className="w-full py-20 px-4">
         <div className="max-w-5xl mx-auto bg-gradient-to-r from-brand-900 to-indigo-900 rounded-3xl p-12 text-center relative overflow-hidden border border-brand-500/30 shadow-2xl">
             {/* Abstract Shapes */}
             <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl" />
             <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/20 rounded-full -ml-12 -mb-12 blur-xl" />
             
             <div className="relative z-10">
                 <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Ready to grow?</h2>
                 <p className="text-brand-100 text-lg mb-8 max-w-2xl mx-auto">Join thousands of website owners and explorers building a better, more human web.</p>
                 <div className="flex flex-col sm:flex-row justify-center gap-4">
                    <button 
                        onClick={() => handleRoute('OWNER')}
                        className="px-8 py-4 bg-white text-brand-900 rounded-xl font-bold hover:bg-brand-50 transition-colors shadow-lg flex items-center justify-center"
                    >
                        I have a Website
                    </button>
                    <button 
                        onClick={() => handleRoute('GENERATOR')}
                        className="px-8 py-4 bg-brand-700 text-white rounded-xl font-bold hover:bg-brand-600 transition-colors border border-brand-500 flex items-center justify-center"
                    >
                        I want to Explore
                    </button>
                 </div>
             </div>
         </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="w-full bg-slate-950 border-t border-slate-800 py-12 text-center text-slate-500 text-sm">
         <div className="flex items-center justify-center space-x-2 mb-4 opacity-50">
            <Zap size={16} />
            <span className="font-semibold tracking-wider">SMARTTRAFFIC AI</span>
         </div>
         <p>&copy; {new Date().getFullYear()} SmartTraffic AI. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Landing;