import React, { useEffect, useState } from 'react';
import { dbService } from '../services/dbService';
import { User } from '../types';
import { Trophy, Medal, Crown, TrendingUp, Award, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

const Leaderboard: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    // Ensure weekly rewards are calculated if needed before showing
    dbService.checkAndRunWeeklyRewards();
    setUsers(dbService.getLeaderboard());
  }, []);

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-white mb-2">Top Contributors</h1>
        <p className="text-slate-400">Earn points by visiting matched sites and providing quality feedback.</p>
        <div className="mt-4 inline-flex items-center bg-brand-900/30 border border-brand-500/30 rounded-full px-4 py-1.5">
            <Award size={14} className="text-yellow-400 mr-2" />
            <span className="text-xs text-brand-200">Top 10 users earn a <span className="text-white font-bold">1.5x Multiplier</span> for next week!</span>
        </div>
      </div>

      <div className="bg-slate-800/50 border border-slate-700 rounded-3xl overflow-hidden">
        {users.map((user, index) => (
          <motion.div
            key={user.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`flex items-center p-6 border-b border-slate-700/50 last:border-0 ${
              index < 3 ? 'bg-gradient-to-r from-slate-800 to-transparent' : ''
            }`}
          >
            <div className="w-12 flex-shrink-0 text-center font-bold text-xl text-slate-500">
              {index === 0 ? <Crown className="text-yellow-400 mx-auto" /> : 
               index === 1 ? <Medal className="text-slate-300 mx-auto" /> : 
               index === 2 ? <Medal className="text-amber-600 mx-auto" /> : 
               `#${index + 1}`}
            </div>
            
            <div className="ml-6 flex-1">
              <div className="flex items-center space-x-2">
                <span className="font-bold text-white text-lg">{user.name}</span>
                {user.isTopContributor && (
                    <span className="bg-yellow-500/20 border border-yellow-500/40 text-yellow-300 text-[10px] px-2 py-0.5 rounded-full font-bold flex items-center shadow-sm">
                        <Zap size={10} className="mr-1 fill-current" /> 1.5x ACTIVE
                    </span>
                )}
              </div>
              <div className="text-slate-500 text-sm">Level {Math.floor(user.points / 100) + 1} Explorer</div>
            </div>

            <div className="text-right">
              <div className="font-mono font-bold text-brand-400 text-xl">{user.points}</div>
              <div className="text-xs text-slate-500 uppercase">Points</div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Leaderboard;