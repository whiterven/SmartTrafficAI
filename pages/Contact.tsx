import React, { useState } from 'react';
import { Mail, MapPin, Phone, Send, MessageSquare, Twitter, Linkedin, Github } from 'lucide-react';
import { motion } from 'framer-motion';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    // Simulate API call
    setTimeout(() => {
      setStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 1500);
  };

  return (
    <div className="py-12 md:py-20 max-w-7xl mx-auto px-4">
      <div className="text-center mb-16">
        <h1 className="text-3xl md:text-5xl font-bold text-white mb-6">Get in Touch</h1>
        <p className="text-slate-400 max-w-2xl mx-auto text-lg">
          Have questions about your traffic campaign? Need enterprise solutions? We're here to help.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-12 bg-slate-800/50 border border-slate-700 rounded-3xl overflow-hidden shadow-2xl">
        {/* Contact Info Side */}
        <div className="bg-slate-900/80 p-8 md:p-12 flex flex-col justify-between relative overflow-hidden">
           {/* Decorative */}
           <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/10 rounded-bl-full pointer-events-none" />
           
           <div>
               <h2 className="text-2xl font-bold text-white mb-8">Contact Information</h2>
               <div className="space-y-6">
                   <div className="flex items-start space-x-4">
                       <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center text-brand-400 shrink-0">
                           <Mail size={20} />
                       </div>
                       <div>
                           <h3 className="text-white font-medium mb-1">Email Us</h3>
                           <p className="text-slate-400 text-sm">support@smarttraffic.ai</p>
                           <p className="text-slate-400 text-sm">sales@smarttraffic.ai</p>
                       </div>
                   </div>
                   
                   <div className="flex items-start space-x-4">
                       <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center text-emerald-400 shrink-0">
                           <MapPin size={20} />
                       </div>
                       <div>
                           <h3 className="text-white font-medium mb-1">HQ Location</h3>
                           <p className="text-slate-400 text-sm">1200 Tech Plaza, Suite 400</p>
                           <p className="text-slate-400 text-sm">San Francisco, CA 94107</p>
                       </div>
                   </div>

                   <div className="flex items-start space-x-4">
                       <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center text-indigo-400 shrink-0">
                           <Phone size={20} />
                       </div>
                       <div>
                           <h3 className="text-white font-medium mb-1">Call Support</h3>
                           <p className="text-slate-400 text-sm">+1 (555) 123-4567</p>
                           <p className="text-slate-500 text-xs mt-1">Mon-Fri, 9am - 6pm PST</p>
                       </div>
                   </div>
               </div>
           </div>

           <div className="mt-12">
               <h3 className="text-white font-medium mb-4">Follow Us</h3>
               <div className="flex gap-4">
                   <a href="#" className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center text-slate-400 hover:bg-brand-600 hover:text-white transition-all">
                       <Twitter size={18} />
                   </a>
                   <a href="#" className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center text-slate-400 hover:bg-blue-600 hover:text-white transition-all">
                       <Linkedin size={18} />
                   </a>
                   <a href="#" className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center text-slate-400 hover:bg-slate-700 hover:text-white transition-all">
                       <Github size={18} />
                   </a>
               </div>
           </div>
        </div>

        {/* Form Side */}
        <div className="p-8 md:p-12 bg-slate-800">
            {status === 'success' ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-10">
                    <div className="w-16 h-16 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mb-6">
                        <Send size={32} />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">Message Sent!</h3>
                    <p className="text-slate-400 mb-8">We'll get back to you within 24 hours.</p>
                    <button 
                        onClick={() => setStatus('idle')}
                        className="text-brand-400 hover:text-brand-300 font-medium"
                    >
                        Send another message
                    </button>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300">Your Name</label>
                            <input 
                                required
                                type="text" 
                                value={formData.name}
                                onChange={e => setFormData({...formData, name: e.target.value})}
                                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-500 transition-colors"
                                placeholder="John Doe"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300">Email Address</label>
                            <input 
                                required
                                type="email" 
                                value={formData.email}
                                onChange={e => setFormData({...formData, email: e.target.value})}
                                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-500 transition-colors"
                                placeholder="john@example.com"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300">Subject</label>
                        <select 
                            value={formData.subject}
                            onChange={e => setFormData({...formData, subject: e.target.value})}
                            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-500 transition-colors"
                        >
                            <option value="" disabled>Select a topic</option>
                            <option value="support">Technical Support</option>
                            <option value="billing">Billing Inquiry</option>
                            <option value="enterprise">Enterprise Plan</option>
                            <option value="other">Other</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300">Message</label>
                        <textarea 
                            required
                            rows={4}
                            value={formData.message}
                            onChange={e => setFormData({...formData, message: e.target.value})}
                            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-500 transition-colors"
                            placeholder="How can we help you?"
                        />
                    </div>

                    <button 
                        type="submit"
                        disabled={status === 'submitting'}
                        className="w-full bg-brand-600 hover:bg-brand-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-brand-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                    >
                        {status === 'submitting' ? (
                            <>Sending...</>
                        ) : (
                            <>
                                <Send size={18} /> Send Message
                            </>
                        )}
                    </button>
                </form>
            )}
        </div>
      </div>
    </div>
  );
};

export default Contact;