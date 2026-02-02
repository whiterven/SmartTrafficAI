import React, { useEffect, useState } from 'react';
import { dbService } from '../services/dbService';
import { User } from '../types';
import { Trophy, Medal, Crown, Award, Zap, Clock, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

const Leaderboard: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [timeLeft, setTimeLeft] = useState('');
  const [isSimulating, setIsSimulating] = useState(false);

  const loadData = () => {
    dbService.checkAndRunWeeklyRewards();
    setUsers(dbService.getLeaderboard());
  };

  useEffect(() => {
    loadData();

    // Timer Interval
    const timerInterval = setInterval(() => {
        const now = new Date();
        const diff = dbService.getNextWeeklyUpdate().getTime() - now.getTime();
        
        if (diff <= 0) {
             setTimeLeft('Calculating Rewards...');
             dbService.checkAndRunWeeklyRewards();
             setUsers(dbService.getLeaderboard());
        } else {
            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);
            setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
        }
    }, 1000);

    const pollInterval = setInterval(() => {
        setUsers(dbService.getLeaderboard());
    }, 3000);
    
    return () => {
        clearInterval(timerInterval);
        clearInterval(pollInterval);
    };
  }, []);

  const handleSimulateWeek = () => {
      setIsSimulating(true);
      const lastWeek = Date.now() - (8 * 24 * 60 * 60 * 1000);
      localStorage.setItem('st_sys_last_update', lastWeek.toString());
      
      setTimeout(() => {
          dbService.triggerWeeklyRewards();
          setUsers(dbService.getLeaderboard());
          setIsSimulating(false);
      }, 1000);
  };

  return (
    <div className="max-w-2xl mx-auto pb-20 px-2 md:px-0">
      <div className="text-center mb-6 md:mb-10">
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">Weekly Top Contributors</h1>
        <p className="text-sm md:text-base text-slate-400">Top 10 users unlock a <span className="text-brand-400 font-bold">1.5x Point Multiplier</span>.</p>
        
        <div className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-3 mt-4 md:mt-6">
            <div className="inline-flex items-center bg-slate-800 border border-slate-700 rounded-full px-3 py-1.5 md:px-4 md:py-2 text-xs md:text-sm text-slate-400 shadow-lg">
                <Clock size={12} className="mr-2 text-brand-400 md:w-[14px]" />
                Rewards In: <span className="text-white ml-2 font-mono font-bold">{timeLeft}</span>
            </div>
        </div>
      </div>

      <div className="bg-slate-800/50 border border-slate-700 rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl relative">
        {users.length > 0 ? users.map((user, index) => (
          <motion.div
            layout
            key={user.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`flex items-center p-4 md:p-6 border-b border-slate-700/50 last:border-0 ${
              index < 3 ? 'bg-gradient-to-r from-brand-900/10 to-transparent' : ''
            } hover:bg-slate-700/30 transition-colors relative group`}
          >
            {/* Rank */}
            <div className="w-8 md:w-12 flex-shrink-0 text-center font-bold text-lg md:text-xl text-slate-500 relative">
              {index === 0 ? <Crown className="text-yellow-400 mx-auto drop-shadow-[0_0_10px_rgba(250,204,21,0.5)] w-6 h-6 md:w-7 md:h-7" /> : 
               index === 1 ? <Medal className="text-slate-300 mx-auto w-5 h-5 md:w-6 md:h-6" /> : 
               index === 2 ? <Medal className="text-amber-700 mx-auto w-5 h-5 md:w-6 md:h-6" /> : 
               `#${index + 1}`}
            </div>
            
            <div className="ml-4 md:ml-6 flex-1">
              <div className="flex items-center space-x-2 flex-wrap">
                <span className={`font-bold text-sm md:text-lg ${user.id === dbService.getCurrentUser()?.id ? 'text-brand-400' : 'text-white'}`}>
                    {user.name} {user.id === dbService.getCurrentUser()?.id && '(You)'}
                </span>
                
                {/* Active Boost Badge */}
                {user.isTopContributor && (
                    <span className="bg-yellow-500/20 border border-yellow-500/40 text-yellow-300 text-[9px] md:text-[10px] px-1.5 py-0.5 rounded-full font-bold flex items-center shadow-sm animate-pulse">
                        <Zap size={8} className="mr-1 fill-current md:w-[10px]" /> 1.5x ACTIVE
                    </span>
                )}
              </div>
              <div className="text-slate-500 text-[10px] md:text-sm">Lvl {Math.floor(user.points / 100) + 1} • {user.streakDays} Day Streak</div>
            </div>

            <div className="text-right">
              <div className="font-mono font-bold text-white text-base md:text-xl">{user.points.toLocaleString()}</div>
              <div className="text-[9px] md:text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Points</div>
            </div>
          </motion.div>
        )) : (
            <div className="p-8 md:p-10 text-center text-slate-500">
                <Trophy size={40} className="mx-auto mb-4 opacity-20 md:w-[48px]" />
                <p className="text-sm">No contributors yet.</p>
            </div>
        )}
      </div>

      {/* Testing Utility */}
      <div className="mt-8 md:mt-12 flex justify-center">
          <button 
            onClick={handleSimulateWeek}
            disabled={isSimulating}
            className="flex items-center space-x-2 text-[10px] md:text-xs text-slate-600 hover:text-brand-400 transition-colors border border-slate-800 hover:border-brand-500/30 px-3 py-1.5 md:px-4 md:py-2 rounded-full"
          >
              <RefreshCw size={10} className={isSimulating ? 'animate-spin md:w-[12px]' : 'md:w-[12px]'} />
              <span>Simulate Rewards</span>
          </button>
      </div>
    </div>
  );
};

export default Leaderboard;