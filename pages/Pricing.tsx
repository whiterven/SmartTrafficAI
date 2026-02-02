import React from 'react';
import { Check, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Pricing: React.FC = () => {
  const navigate = useNavigate();

  const tiers = [
    {
      name: 'Starter',
      price: '$0',
      description: 'Perfect for hobbyists and personal blogs.',
      features: [
        '1 Website Property',
        'Basic Audience Matching',
        'Manual Campaign Triggers',
        'Standard Analytics',
        'Community Support'
      ],
      cta: 'Get Started',
      popular: false
    },
    {
      name: 'Growth',
      price: '$29',
      period: '/month',
      description: 'For startups and growing businesses.',
      features: [
        '5 Website Properties',
        'Deep AI Intent Analysis',
        'Auto-Pilot Campaigns (Weekly)',
        'Advanced Competitor Insights',
        'Priority Email Support',
        'Remove Branding'
      ],
      cta: 'Start Free Trial',
      popular: true
    },
    {
      name: 'Agency',
      price: '$99',
      period: '/month',
      description: 'Scale traffic for multiple clients.',
      features: [
        'Unlimited Websites',
        'Real-time Traffic Injection',
        'White-label Reports',
        'API Access',
        'Dedicated Account Manager',
        'Custom AI Tuning'
      ],
      cta: 'Contact Sales',
      popular: false
    }
  ];

  return (
    <div className="py-12 md:py-20 max-w-7xl mx-auto px-4">
      <div className="text-center mb-16">
        <h1 className="text-3xl md:text-5xl font-bold text-white mb-6">Simple, Transparent Pricing</h1>
        <p className="text-slate-400 max-w-2xl mx-auto text-lg">Choose the plan that fits your growth stage. No hidden fees.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {tiers.map((tier, idx) => (
          <motion.div 
            key={tier.name} 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className={`relative bg-slate-800 rounded-3xl p-8 border ${tier.popular ? 'border-brand-500 shadow-2xl shadow-brand-900/20 ring-1 ring-brand-500/50' : 'border-slate-700'} flex flex-col`}
          >
            {tier.popular && (
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-brand-600 text-white px-4 py-1 rounded-full text-xs font-bold shadow-lg tracking-wide uppercase">
                Most Popular
              </div>
            )}
            <div className="mb-8">
              <h3 className="text-xl font-bold text-white mb-2">{tier.name}</h3>
              <p className="text-slate-400 text-sm h-10">{tier.description}</p>
            </div>
            <div className="mb-8 flex items-baseline">
              <span className="text-4xl font-bold text-white">{tier.price}</span>
              {tier.period && <span className="text-slate-500 ml-1">{tier.period}</span>}
            </div>
            <ul className="space-y-4 mb-8 flex-1">
              {tier.features.map((feature) => (
                <li key={feature} className="flex items-start">
                  <Check className="text-brand-400 shrink-0 mr-3" size={18} />
                  <span className="text-slate-300 text-sm">{feature}</span>
                </li>
              ))}
            </ul>
            <button 
              onClick={() => navigate('/login?mode=signup')}
              className={`w-full py-3 rounded-xl font-bold transition-all ${
                tier.popular 
                  ? 'bg-brand-600 hover:bg-brand-500 text-white shadow-lg shadow-brand-500/20' 
                  : 'bg-slate-700 hover:bg-slate-600 text-white'
              }`}
            >
              {tier.cta}
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Pricing;