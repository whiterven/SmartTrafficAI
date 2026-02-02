import React, { useState, useEffect } from 'react';
import { dbService } from '../services/dbService';
import { UserRole } from '../types';
import { Save, Plus, X, Award, Zap, TrendingUp, Sparkles, ArrowRight, ShieldCheck, CreditCard, Bell, Flame, Users, Copy, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const SUGGESTED_INTERESTS = ['SaaS', 'Crypto', 'AI Tools', 'Health', 'Marketing', 'Design', 'Tech News', 'E-commerce', 'Gaming', 'Finance'];

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(dbService.getCurrentUser());
  const [interests, setInterests] = useState<string[]>([]);
  const [newInterest, setNewInterest] = useState('');
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (user?.interests) {
      setInterests(user.interests);
    }
  }, [user]);

  const handleAddInterest = (tag: string) => {
    if (tag && !interests.includes(tag)) {
      setInterests([...interests, tag]);
      if (tag === newInterest) setNewInterest('');
    }
  };

  const handleRemoveInterest = (tag: string) => {
    setInterests(interests.filter(i => i !== tag));
  };

  const handleSave = () => {
    if (!user) return;
    const updatedUser = { ...user, interests };
    localStorage.setItem('st_current_user', JSON.stringify(updatedUser));
    
    // Update main user list in LS
    const allUsers = JSON.parse(localStorage.getItem('st_users') || '[]');
    const idx = allUsers.findIndex((u: any) => u.id === user.id);
    if (idx !== -1) {
      allUsers[idx] = updatedUser;
      localStorage.setItem('st_users', JSON.stringify(allUsers));
    }
    
    setUser(updatedUser);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleCopyReferral = () => {
      navigator.clipboard.writeText(user?.referralCode || '');
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
  };

  if (!user) return null;

  const profileStrength = Math.min((interests.length / 5) * 100, 100);

  return (
    <div className="max-w-xl mx-auto space-y-6 md:space-y-8 pb-8">
      <div className="flex items-center justify-between px-2">
         <h1 className="text-2xl md:text-3xl font-bold text-white">Profile Settings</h1>
         <div className="text-xs md:text-sm text-slate-400">Member since {new Date().getFullYear()}</div>
      </div>

      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-slate-800 border border-slate-700 rounded-2xl p-5 md:p-6 relative overflow-hidden group"
      >
        <div className="absolute top-0 right-0 w-24 h-24 md:w-32 md:h-32 bg-brand-500/10 rounded-bl-full -mr-6 -mt-6 md:-mr-8 md:-mt-8 transition-transform group-hover:scale-110" />
        
        {user.isTopContributor && (
            <div className="absolute top-0 right-0 bg-yellow-500/20 text-yellow-300 text-[10px] md:text-xs font-bold px-2 py-1 md:px-3 rounded-bl-xl border-l border-b border-yellow-500/30 flex items-center shadow-lg">
                <Award size={12} className="mr-1 md:w-[14px]" /> Top Contributor
            </div>
        )}
        <div className="flex items-center space-x-4 relative z-10">
          <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-brand-600 to-indigo-700 rounded-full flex items-center justify-center text-2xl md:text-3xl font-bold text-white ring-4 ring-slate-900 shadow-xl">
            {user.name.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-xl md:text-2xl font-bold text-white flex items-center gap-2 truncate">
                {user.name} 
            </h2>
            <p className="text-sm md:text-base text-slate-400 truncate">{user.email}</p>
            <div className="flex flex-wrap gap-2 mt-2 md:mt-3">
                <span className="text-[10px] md:text-xs bg-slate-700 border border-slate-600 text-slate-300 px-2 py-0.5 md:px-2.5 md:py-1 rounded-md font-medium">{user.role}</span>
                {user.pointMultiplier && user.pointMultiplier > 1 && (
                    <span className="text-[10px] md:text-xs bg-gradient-to-r from-brand-600 to-brand-500 text-white px-2 py-0.5 md:px-2.5 md:py-1 rounded-md inline-flex items-center font-bold shadow-lg shadow-brand-500/20 animate-pulse">
                        <Zap size={10} className="mr-1 fill-current" /> {user.pointMultiplier}x Active
                    </span>
                )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* TRAFFIC ENGINE STATS (For All Users) */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.05 }}
        className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4"
      >
        <div className="bg-slate-800 border border-slate-700 p-4 rounded-xl md:rounded-2xl flex flex-col items-center text-center">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-yellow-500/10 rounded-full flex items-center justify-center text-yellow-400 mb-2">
                <CreditCard size={16} className="md:w-[20px]" />
            </div>
            <div className="text-xl md:text-2xl font-bold text-white">{user.credits || 0}</div>
            <div className="text-[10px] md:text-xs text-slate-400 uppercase font-bold">Credits</div>
        </div>
        <div className="bg-slate-800 border border-slate-700 p-4 rounded-xl md:rounded-2xl flex flex-col items-center text-center">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-orange-500/10 rounded-full flex items-center justify-center text-orange-400 mb-2">
                <Flame size={16} className="md:w-[20px]" />
            </div>
            <div className="text-xl md:text-2xl font-bold text-white">{user.streakDays || 0}</div>
            <div className="text-[10px] md:text-xs text-slate-400 uppercase font-bold">Day Streak</div>
        </div>
        <div className="col-span-2 md:col-span-1 bg-slate-800 border border-slate-700 p-4 rounded-xl md:rounded-2xl flex flex-col justify-center">
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1 text-slate-400 text-[10px] md:text-xs font-bold uppercase"><Users size={12}/> Referral Code</div>
            </div>
            <button 
                onClick={handleCopyReferral}
                className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 flex items-center justify-between hover:border-brand-500 transition-colors group"
            >
                <span className="font-mono text-brand-400 font-bold text-sm">{user.referralCode || 'GEN-X'}</span>
                {copied ? <Check size={14} className="text-green-500"/> : <Copy size={14} className="text-slate-500 group-hover:text-white"/>}
            </button>
        </div>
      </motion.div>

      {user.role === UserRole.GENERATOR ? (
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-slate-800 border border-slate-700 rounded-2xl p-5 md:p-6"
        >
          <div className="flex justify-between items-start mb-4">
             <div>
                <h3 className="text-base md:text-lg font-bold text-white mb-1">Matching Preferences</h3>
                <p className="text-slate-400 text-xs md:text-sm">
                    Add topics to help Gemini AI find your perfect websites.
                </p>
             </div>
             <div className="text-right">
                <div className="text-[10px] md:text-xs text-slate-500 uppercase mb-1 font-semibold">Match Power</div>
                <div className="w-16 md:w-24 h-1.5 md:h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div 
                        className={`h-full ${profileStrength === 100 ? 'bg-green-500' : 'bg-brand-500'} transition-all duration-500`} 
                        style={{ width: `${profileStrength}%` }}
                    />
                </div>
             </div>
          </div>

          <div className="min-h-[80px] md:min-h-[100px] bg-slate-900/50 rounded-xl p-3 md:p-4 mb-6 border border-slate-700/50">
            {interests.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                    {interests.map(tag => (
                    <span key={tag} className="bg-brand-500/20 text-brand-300 border border-brand-500/30 px-2.5 py-1 rounded-full text-xs md:text-sm font-medium flex items-center group transition-colors hover:bg-brand-500/30">
                        {tag}
                        <button onClick={() => handleRemoveInterest(tag)} className="ml-1.5 text-brand-400 group-hover:text-white transition-colors"><X size={12} className="md:w-[14px]" /></button>
                    </span>
                    ))}
                </div>
            ) : (
                <div className="h-full flex flex-col items-center justify-center text-slate-500 text-xs md:text-sm py-4">
                    <Sparkles size={18} className="mb-2 opacity-50 md:w-[20px]" />
                    <p>No interests added yet.</p>
                </div>
            )}
          </div>

          <div className="mb-6">
            <p className="text-[10px] md:text-xs text-slate-500 uppercase font-semibold mb-3">Popular Topics</p>
            <div className="flex flex-wrap gap-2">
                {SUGGESTED_INTERESTS.filter(i => !interests.includes(i)).map(tag => (
                <button 
                    key={tag} 
                    onClick={() => handleAddInterest(tag)} 
                    className="text-[10px] md:text-xs bg-slate-700 hover:bg-slate-600 text-slate-300 px-2.5 py-1 rounded-full border border-slate-600 hover:border-slate-500 transition-all flex items-center"
                >
                    <Plus size={10} className="mr-1" /> {tag}
                </button>
                ))}
            </div>
          </div>

          <div className="flex gap-2 mb-8">
            <input 
              value={newInterest}
              onChange={(e) => setNewInterest(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddInterest(newInterest)}
              placeholder="Type custom interest..."
              className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 md:py-3 text-white focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all placeholder-slate-500 text-sm"
            />
            <button 
              onClick={() => handleAddInterest(newInterest)}
              disabled={!newInterest}
              className="bg-slate-700 hover:bg-slate-600 disabled:opacity-50 text-white px-3 md:px-4 rounded-xl transition-colors"
            >
              <Plus size={20} className="md:w-[24px]" />
            </button>
          </div>

          <button 
            onClick={handleSave}
            className="w-full bg-brand-600 hover:bg-brand-500 text-white font-bold py-3 md:py-3.5 rounded-xl flex items-center justify-center space-x-2 transition-all shadow-lg shadow-brand-900/20 active:scale-[0.98] text-sm md:text-base"
          >
            {saved ? (
                <>
                    <CheckmarkIcon />
                    <span>Preferences Saved</span>
                </>
            ) : (
                <>
                    <Save size={16} className="md:w-[18px]" />
                    <span>Save Changes</span>
                </>
            )}
          </button>

          {interests.length > 0 && (
             <button
              onClick={() => navigate('/feed')}
              className="w-full mt-4 bg-slate-700 hover:bg-slate-600 text-white font-medium py-3 rounded-xl flex items-center justify-center space-x-2 transition-all border border-slate-600 text-sm md:text-base"
             >
                <span>Continue to Discovery Feed</span>
                <ArrowRight size={16} className="md:w-[18px]" />
             </button>
          )}
        </motion.div>
      ) : (
        /* Owner Specific Profile Settings */
        <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="space-y-4"
        >
            <div className="bg-slate-800 border border-slate-700 rounded-2xl p-4 md:p-6 flex items-center justify-between">
                <div className="flex items-center space-x-3 md:space-x-4">
                    <div className="w-8 h-8 md:w-10 md:h-10 bg-slate-700 rounded-lg flex items-center justify-center text-slate-400">
                        <CreditCard size={18} className="md:w-[20px]" />
                    </div>
                    <div>
                        <h3 className="text-white font-semibold text-sm md:text-base">Billing Plan</h3>
                        <p className="text-xs md:text-sm text-slate-400">Free Tier (Active)</p>
                    </div>
                </div>
                <button className="text-xs md:text-sm text-brand-400 hover:text-brand-300 font-medium">Manage</button>
            </div>

            <div className="bg-slate-800 border border-slate-700 rounded-2xl p-4 md:p-6 flex items-center justify-between">
                <div className="flex items-center space-x-3 md:space-x-4">
                    <div className="w-8 h-8 md:w-10 md:h-10 bg-slate-700 rounded-lg flex items-center justify-center text-slate-400">
                        <Bell size={18} className="md:w-[20px]" />
                    </div>
                    <div>
                        <h3 className="text-white font-semibold text-sm md:text-base">Notifications</h3>
                        <p className="text-xs md:text-sm text-slate-400">Weekly reports enabled</p>
                    </div>
                </div>
                <button className="text-xs md:text-sm text-brand-400 hover:text-brand-300 font-medium">Edit</button>
            </div>

            <div className="bg-slate-800 border border-slate-700 rounded-2xl p-4 md:p-6 flex items-center justify-between">
                <div className="flex items-center space-x-3 md:space-x-4">
                    <div className="w-8 h-8 md:w-10 md:h-10 bg-slate-700 rounded-lg flex items-center justify-center text-slate-400">
                        <ShieldCheck size={18} className="md:w-[20px]" />
                    </div>
                    <div>
                        <h3 className="text-white font-semibold text-sm md:text-base">Security</h3>
                        <p className="text-xs md:text-sm text-slate-400">Password and 2FA</p>
                    </div>
                </div>
                <button className="text-xs md:text-sm text-brand-400 hover:text-brand-300 font-medium">Update</button>
            </div>
            
            <div className="text-center pt-4">
                <p className="text-slate-500 text-xs md:text-sm">Need help? <a href="#" className="text-brand-400 hover:underline">Contact Support</a></p>
            </div>
        </motion.div>
      )}
    </div>
  );
};

const CheckmarkIcon = () => (
    <svg className="w-4 h-4 md:w-5 md:h-5 animate-in fade-in zoom-in duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
    </svg>
);

export default Profile;