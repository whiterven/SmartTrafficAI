import React from 'react';
import { Target, Users, Zap, Globe, Cpu, Heart, Shield, Rocket } from 'lucide-react';
import { motion } from 'framer-motion';

const About: React.FC = () => {
  return (
    <div className="py-12 md:py-20 max-w-7xl mx-auto px-4">
      {/* Hero */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-20 max-w-4xl mx-auto"
      >
        <div className="inline-block px-3 py-1 bg-brand-500/10 text-brand-300 rounded-full text-sm font-semibold mb-4 border border-brand-500/20">
            Our Vision
        </div>
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
          Democratizing Traffic with <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-indigo-400">Semantic AI Intelligence</span>
        </h1>
        <p className="text-xl text-slate-400 leading-relaxed">
          We believe great content deserves to be seen, not buried under algorithms. We're building the first autonomous traffic engine that understands *intent*, not just keywords.
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-24">
         <StatCard icon={Zap} value="2.5M+" label="Visits Generated" color="text-brand-400" />
         <StatCard icon={Users} value="50k+" label="Active Explorers" color="text-blue-400" />
         <StatCard icon={Globe} value="120+" label="Countries" color="text-emerald-400" />
         <StatCard icon={Target} value="98%" label="Match Accuracy" color="text-pink-400" />
      </div>

      {/* Our Story */}
      <div className="grid md:grid-cols-2 gap-16 items-center mb-32">
        <div className="order-2 md:order-1">
            <h2 className="text-3xl font-bold text-white mb-6">Our Story</h2>
            <div className="space-y-6 text-slate-400 leading-relaxed">
                <p>
                    The internet is crowded. Traditional SEO takes months, ads are prohibitively expensive, and social algorithms are fickle. In 2024, a team of ex-Google engineers and growth hackers asked a simple question: 
                    <em className="text-slate-200"> "What if we could use AI to find the perfect audience for any website instantly?"</em>
                </p>
                <p>
                    SmartTraffic AI was born from this question. We moved away from "buying clicks" to "matching intent". By using Gemini 3's advanced reasoning capabilities, we analyze the soul of a website—its tone, niche, and value proposition—and pair it with users who have explicitly expressed interest in those exact qualities.
                </p>
                <p>
                    Today, we are bridging the gap between discovery and intent, creating a healthier, more human-centric web ecosystem.
                </p>
            </div>
        </div>
        <div className="order-1 md:order-2 bg-slate-800 rounded-3xl p-2 border border-slate-700 shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500">
            <div className="bg-slate-900 rounded-2xl h-80 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-brand-500/20 to-indigo-500/20" />
                <Cpu size={80} className="text-brand-500 relative z-10" />
            </div>
        </div>
      </div>

      {/* Core Values */}
      <div className="mb-32">
          <h2 className="text-3xl font-bold text-white mb-12 text-center">Our Core Values</h2>
          <div className="grid md:grid-cols-3 gap-8">
              <ValueCard 
                icon={Heart} 
                title="Human-Centric" 
                desc="We optimize for user experience, not just click-through rates. If a user doesn't stay, it doesn't count." 
              />
              <ValueCard 
                icon={Shield} 
                title="Zero-Bot Policy" 
                desc="We maintain the strictest anti-fraud systems in the industry. Every visitor is verified real." 
              />
              <ValueCard 
                icon={Rocket} 
                title="Continuous Growth" 
                desc="Our algorithms learn from every interaction. The more you use the platform, the smarter it gets." 
              />
          </div>
      </div>
      
      {/* Tech Stack Callout */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-3xl p-8 md:p-16 text-center border border-slate-700 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          
          <div className="relative z-10">
            <h2 className="text-3xl font-bold text-white mb-6">Powered by Gemini 3</h2>
            <p className="text-slate-400 mb-8 max-w-3xl mx-auto text-lg">
                We utilize the latest multimodal reasoning models to "see" websites like a human does. From analyzing design aesthetics to understanding complex semantic context, our tech stack is generations ahead of keyword matching.
            </p>
            <a href="/#/login?mode=signup" className="inline-block bg-white text-slate-900 px-8 py-4 rounded-xl font-bold hover:bg-slate-200 transition-colors shadow-lg hover:shadow-xl hover:-translate-y-1 transform duration-200">
                Experience the Technology
            </a>
          </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon: Icon, value, label, color }: any) => (
    <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 flex flex-col items-center text-center hover:border-slate-600 transition-colors group">
        <Icon className={`${color} mb-4 group-hover:scale-110 transition-transform`} size={32} />
        <div className="text-2xl md:text-3xl font-bold text-white mb-1">{value}</div>
        <div className="text-xs text-slate-500 uppercase font-bold tracking-wider">{label}</div>
    </div>
);

const ValueCard = ({ icon: Icon, title, desc }: any) => (
    <div className="bg-slate-800/50 p-8 rounded-3xl border border-slate-700/50 hover:bg-slate-800 transition-colors">
        <div className="w-12 h-12 bg-slate-700 rounded-xl flex items-center justify-center mb-6 text-white">
            <Icon size={24} />
        </div>
        <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
        <p className="text-slate-400 leading-relaxed text-sm">
            {desc}
        </p>
    </div>
);

export default About;