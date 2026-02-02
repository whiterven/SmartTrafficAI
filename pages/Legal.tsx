import React from 'react';

export const Privacy: React.FC = () => (
  <div className="max-w-3xl mx-auto py-12 px-4 prose prose-invert prose-slate">
    <h1 className="text-3xl font-bold text-white mb-6">Privacy Policy</h1>
    <p className="text-slate-400 mb-4">Last Updated: {new Date().toLocaleDateString()}</p>
    
    <div className="space-y-6 text-slate-300">
        <p>Your privacy is important to us. It is SmartTraffic AI's policy to respect your privacy regarding any information we may collect from you across our website.</p>
        
        <h3 className="text-xl font-semibold text-white">1. Information We Collect</h3>
        <p>We only ask for personal information when we truly need it to provide a service to you. We collect it by fair and lawful means, with your knowledge and consent.</p>
        
        <h3 className="text-xl font-semibold text-white">2. Usage Data</h3>
        <p>When you visit our website, our servers may automatically log the standard data provided by your web browser. This data is considered "non-identifying information", as it does not personally identify you on its own.</p>
        
        <h3 className="text-xl font-semibold text-white">3. Data Retention</h3>
        <p>We only retain collected information for as long as necessary to provide you with your requested service. What data we store, we'll protect within commercially acceptable means to prevent loss and theft.</p>
    </div>
  </div>
);

export const Terms: React.FC = () => (
  <div className="max-w-3xl mx-auto py-12 px-4 prose prose-invert prose-slate">
    <h1 className="text-3xl font-bold text-white mb-6">Terms of Service</h1>
    <p className="text-slate-400 mb-4">Last Updated: {new Date().toLocaleDateString()}</p>
    
    <div className="space-y-6 text-slate-300">
        <h3 className="text-xl font-semibold text-white">1. Terms</h3>
        <p>By accessing the website at SmartTraffic AI, you are agreeing to be bound by these terms of service, all applicable laws and regulations, and agree that you are responsible for compliance with any applicable local laws.</p>
        
        <h3 className="text-xl font-semibold text-white">2. Use License</h3>
        <p>Permission is granted to temporarily download one copy of the materials (information or software) on SmartTraffic AI's website for personal, non-commercial transitory viewing only.</p>
        
        <h3 className="text-xl font-semibold text-white">3. Disclaimer</h3>
        <p>The materials on SmartTraffic AI's website are provided on an 'as is' basis. SmartTraffic AI makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability.</p>
        
        <h3 className="text-xl font-semibold text-white">4. Bot Traffic</h3>
        <p>The use of automated bots, scripts, or any non-human traffic generation methods is strictly prohibited. Accounts found violating this will be immediately banned.</p>
    </div>
  </div>
);