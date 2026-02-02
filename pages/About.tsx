import React from 'react';
import { Target, Users, Zap, Globe } from 'lucide-react';
import { motion } from 'framer-motion';

const About: React.FC = () => {
  return (
    <div className="py-12 md:py-20 max-w-5xl mx-auto px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-20"
      >
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">Democratizing Traffic</h1>
        <p className="text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
          We believe great content deserves to be seen. Our AI agents work tirelessly to connect creators with their ideal audience.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-12 mb-24">
        <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
        >
          <h2 className="text-2xl font-bold text-white mb-4">Our Mission</h2>
          <p className="text-slate-400 leading-relaxed mb-6 text-sm md:text-base">
            The internet is crowded. Traditional SEO takes months, and ads are expensive. SmartTraffic AI bridges the gap using advanced AI reasoning to understand the *intent* of a website and match it instantly with users who are looking for exactly that content.
          </p>
          <p className="text-slate-400 leading-relaxed text-sm md:text-base">
            We are building the first autonomous traffic engine that doesn't just send clicks—it sends fans, customers, and readers.
          </p>
        </motion.div>
        <div className="grid grid-cols-2 gap-4">
           <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 flex flex-col items-center text-center">
              <Zap className="text-brand-400 mb-4" size={32} />
              <div className="text-2xl font-bold text-white mb-1">2.5M+</div>
              <div className="text-xs text-slate-500 uppercase font-bold">Visits Generated</div>
           </div>
           <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 flex flex-col items-center text-center">
              <Users className="text-blue-400 mb-4" size={32} />
              <div className="text-2xl font-bold text-white mb-1">50k+</div>
              <div className="text-xs text-slate-500 uppercase font-bold">Active Explorers</div>
           </div>
           <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 flex flex-col items-center text-center">
              <Globe className="text-emerald-400 mb-4" size={32} />
              <div className="text-2xl font-bold text-white mb-1">120+</div>
              <div className="text-xs text-slate-500 uppercase font-bold">Countries</div>
           </div>
           <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 flex flex-col items-center text-center">
              <Target className="text-pink-400 mb-4" size={32} />
              <div className="text-2xl font-bold text-white mb-1">98%</div>
              <div className="text-xs text-slate-500 uppercase font-bold">Match Accuracy</div>
           </div>
        </div>
      </div>
      
      <div className="bg-slate-800 rounded-3xl p-8 md:p-12 text-center border border-slate-700">
          <h2 className="text-2xl font-bold text-white mb-4">Join the Movement</h2>
          <p className="text-slate-400 mb-8 max-w-2xl mx-auto">Whether you're building the next big startup or just want to find cool websites, there's a place for you here.</p>
          <a href="/#/login?mode=signup" className="inline-block bg-white text-slate-900 px-8 py-3 rounded-xl font-bold hover:bg-slate-200 transition-colors">Get Started Today</a>
      </div>
    </div>
  );
};

export default About;