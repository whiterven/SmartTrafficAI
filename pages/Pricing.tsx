import React from 'react';
import { Check, X, HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';
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
        <p className="text-slate-400 max-w-2xl mx-auto text-lg">Choose the plan that fits your growth stage. No hidden fees. Cancel anytime.</p>
      </div>

      {/* Pricing Cards */}
      <div className="grid md:grid-cols-3 gap-8 mb-24">
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

      {/* Feature Comparison Table */}
      <div className="mb-24 overflow-x-auto">
          <h2 className="text-2xl font-bold text-white mb-8 text-center">Compare Features</h2>
          <table className="w-full min-w-[800px] border-collapse text-left">
              <thead>
                  <tr className="border-b border-slate-700">
                      <th className="py-4 px-6 text-slate-400 font-medium">Features</th>
                      <th className="py-4 px-6 text-white font-bold text-center">Starter</th>
                      <th className="py-4 px-6 text-brand-400 font-bold text-center">Growth</th>
                      <th className="py-4 px-6 text-white font-bold text-center">Agency</th>
                  </tr>
              </thead>
              <tbody className="text-sm">
                  <ComparisonRow feature="Traffic Sites" starter="1" growth="5" agency="Unlimited" />
                  <ComparisonRow feature="Daily Visitor Cap" starter="100" growth="5,000" agency="Unlimited" />
                  <ComparisonRow feature="AI Analysis Depth" starter="Basic" growth="Advanced" agency="Custom" />
                  <ComparisonRow feature="Auto-Pilot Campaigns" starter={false} growth={true} agency={true} />
                  <ComparisonRow feature="Social Media Automation" starter={false} growth={true} agency={true} />
                  <ComparisonRow feature="Video Content Gen" starter={false} growth="5/mo" agency="Unlimited" />
                  <ComparisonRow feature="White-label Reports" starter={false} growth={false} agency={true} />
                  <ComparisonRow feature="Priority Support" starter={false} growth={true} agency="Dedicated" />
              </tbody>
          </table>
      </div>

      {/* FAQ */}
      <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-8 text-center">Pricing FAQ</h2>
          <div className="space-y-4">
              <FaqItem q="Can I change plans anytime?" a="Yes, you can upgrade, downgrade, or cancel your plan at any time from your dashboard. Changes take effect immediately." />
              <FaqItem q="Do you offer a money-back guarantee?" a="We offer a 14-day money-back guarantee on the Growth plan if you're not satisfied with the traffic quality." />
              <FaqItem q="What happens if I exceed my traffic limit?" a="Your campaigns will pause until the next billing cycle, or you can purchase a one-time traffic boost pack." />
              <FaqItem q="Is there a contract?" a="No, all our plans are month-to-month unless you choose annual billing for a discount." />
          </div>
      </div>
      
      {/* Enterprise CTA */}
      <div className="mt-20 p-8 md:p-12 bg-gradient-to-r from-indigo-900 to-slate-900 rounded-3xl border border-indigo-500/30 text-center">
          <h3 className="text-2xl font-bold text-white mb-4">Need Custom Volume?</h3>
          <p className="text-slate-400 mb-8 max-w-2xl mx-auto">For platforms with over 1M+ monthly pageviews, we offer custom infrastructure and dedicated AI model fine-tuning.</p>
          <button onClick={() => navigate('/contact')} className="bg-white text-indigo-900 px-8 py-3 rounded-xl font-bold hover:bg-indigo-50 transition-colors">Contact Enterprise Sales</button>
      </div>
    </div>
  );
};

const ComparisonRow = ({ feature, starter, growth, agency }: any) => {
    const renderCell = (val: any) => {
        if (typeof val === 'boolean') {
            return val ? <Check size={18} className="mx-auto text-green-400" /> : <X size={18} className="mx-auto text-slate-600" />;
        }
        return val;
    };

    return (
        <tr className="border-b border-slate-800 hover:bg-slate-800/30 transition-colors">
            <td className="py-4 px-6 text-slate-300 font-medium">{feature}</td>
            <td className="py-4 px-6 text-slate-400 text-center">{renderCell(starter)}</td>
            <td className="py-4 px-6 text-white text-center font-medium bg-brand-500/5">{renderCell(growth)}</td>
            <td className="py-4 px-6 text-slate-400 text-center">{renderCell(agency)}</td>
        </tr>
    );
};

const FaqItem = ({ q, a }: { q: string, a: string }) => {
    const [isOpen, setIsOpen] = React.useState(false);
    return (
        <div className="bg-slate-800 rounded-xl overflow-hidden border border-slate-700">
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex justify-between items-center p-5 text-left hover:bg-slate-700/50 transition-colors"
            >
                <span className="font-semibold text-white">{q}</span>
                {isOpen ? <ChevronUp className="text-brand-400" /> : <ChevronDown className="text-slate-500" />}
            </button>
            {isOpen && (
                <div className="px-5 pb-5 text-slate-400 text-sm leading-relaxed border-t border-slate-700/50 pt-4">
                    {a}
                </div>
            )}
        </div>
    )
}

export default Pricing;