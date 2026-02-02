import React, { useState, useEffect, useRef } from 'react';
import { dbService } from '../services/dbService';
import { geminiService } from '../services/geminiService';
import { Website, MatchResult } from '../types';
import { ExternalLink, Star, ArrowRight, Sparkles, Clock, CheckCircle, Flag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const DiscoveryFeed: React.FC = () => {
  const user = dbService.getCurrentUser();
  const navigate = useNavigate();
  const [matches, setMatches] = useState<MatchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeVisitSiteId, setActiveVisitSiteId] = useState<string | null>(null);
  const [visitStartTime, setVisitStartTime] = useState<number | null>(null);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [ratingSite, setRatingSite] = useState<Website | null>(null);
  const [calculatedDwellTime, setCalculatedDwellTime] = useState(0);

  // Check if onboarding is needed
  useEffect(() => {
    if (user && (!user.interests || user.interests.length === 0)) {
      navigate('/profile');
    }
  }, [user, navigate]);

  const loadMatches = async () => {
    if (!user) return;
    setLoading(true);
    const allSites = dbService.getAllWebsites();
    
    // Get History for filtering
    const userRatings = dbService.getRatingsByUser(user.id);
    const visitedSiteIds = userRatings.map(r => r.websiteId);

    try {
        const results = await geminiService.findMatches(
            user, 
            allSites,
            visitedSiteIds,
            user.pointMultiplier || 1
        );
        setMatches(results);
    } catch (e) {
        console.error(e);
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    loadMatches();
  }, []);

  const handleVisit = (site: Website) => {
      // 1. Open URL
      window.open(site.url, '_blank');
      // 2. Start Timer
      setActiveVisitSiteId(site.id);
      setVisitStartTime(Date.now());
  };

  const handleReturnToRate = (site: Website) => {
      if (!visitStartTime) return;
      // 3. Stop Timer & Calculate
      const duration = (Date.now() - visitStartTime) / 1000; // seconds
      setCalculatedDwellTime(duration);
      setRatingSite(site);
      setShowRatingModal(true);
      // Reset
      setActiveVisitSiteId(null);
      setVisitStartTime(null);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 pb-20">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-white">Your Daily Mix</h1>
        <p className="text-slate-400">AI-curated websites based on your interests in <span className="text-brand-400">{user?.interests?.slice(0, 3).join(', ')}...</span></p>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-slate-700 rounded-full" />
            <div className="absolute top-0 left-0 w-16 h-16 border-4 border-t-brand-500 rounded-full animate-spin" />
            <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-brand-400" size={24} />
          </div>
          <p className="text-slate-400 animate-pulse">Gemini 3 is performing deep reasoning match...</p>
        </div>
      ) : (
        <div className="space-y-6">
          {matches.map((match, idx) => {
            const isVisiting = activeVisitSiteId === match.website.id;
            const otherActive = activeVisitSiteId !== null && !isVisiting;

            return (
              <MatchCard 
                key={match.website.id} 
                match={match} 
                index={idx}
                isVisiting={isVisiting}
                disabled={otherActive}
                onVisit={() => handleVisit(match.website)}
                onRate={() => handleReturnToRate(match.website)}
              />
            );
          })}
          
          {matches.length === 0 && !loading && (
             <div className="text-center py-12 bg-slate-800/50 rounded-2xl border border-slate-700">
                <p className="text-slate-400">No new matches right now.</p>
                <button onClick={loadMatches} className="mt-4 text-brand-400 hover:text-brand-300 font-medium">Try Refreshing</button>
             </div>
          )}
        </div>
      )}

      <AnimatePresence>
        {showRatingModal && ratingSite && (
            <RatingModal 
                site={ratingSite} 
                dwellTime={calculatedDwellTime}
                onClose={() => { 
                    setShowRatingModal(false); 
                    setRatingSite(null); 
                    loadMatches(); // Refresh list after rating
                }} 
            />
        )}
      </AnimatePresence>
    </div>
  );
};

const MatchCard: React.FC<{ 
    match: MatchResult, 
    index: number, 
    isVisiting: boolean,
    disabled: boolean,
    onVisit: () => void,
    onRate: () => void
}> = ({ match, index, isVisiting, disabled, onVisit, onRate }) => {
  
  // Timer for visual feedback during visit
  const [seconds, setSeconds] = useState(0);
  useEffect(() => {
    let interval: any;
    if (isVisiting) {
        interval = setInterval(() => setSeconds(s => s + 1), 1000);
    } else {
        setSeconds(0);
    }
    return () => clearInterval(interval);
  }, [isVisiting]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: disabled ? 0.5 : 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`bg-slate-800 border ${isVisiting ? 'border-brand-500 shadow-brand-500/20' : 'border-slate-700'} rounded-2xl overflow-hidden shadow-xl transition-all relative`}
    >
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <span className="bg-brand-500/10 text-brand-300 text-xs font-bold px-2 py-1 rounded-md uppercase tracking-wide">
                 {match.matchScore}% Match
              </span>
              <span className="text-slate-500 text-xs">{match.website.niche}</span>
            </div>
            <h3 className="text-xl font-bold text-white">{match.website.name}</h3>
          </div>
          {isVisiting && (
            <div className="flex items-center space-x-2 bg-brand-900/50 px-3 py-1 rounded-full animate-pulse border border-brand-500/30">
                <Clock size={14} className="text-brand-400" />
                <span className="text-brand-200 font-mono font-bold text-sm">{Math.floor(seconds / 60)}:{(seconds % 60).toString().padStart(2, '0')}</span>
            </div>
          )}
        </div>

        <div className="bg-slate-900/50 rounded-xl p-4 mb-6">
          <div className="flex items-start gap-3">
            <Sparkles className="text-brand-400 flex-shrink-0 mt-0.5" size={16} />
            <p className="text-sm text-slate-300 leading-relaxed italic">
              "{match.reasoning}"
            </p>
          </div>
        </div>

        {match.predictedEngagementTime && (
            <div className="mb-4 text-xs text-slate-500 flex items-center">
                <Clock size={12} className="mr-1"/> 
                Predicted visit time: {match.predictedEngagementTime}s
            </div>
        )}

        <p className="text-slate-400 text-sm mb-6 line-clamp-2">
          {match.website.description}
        </p>

        {!isVisiting ? (
            <button 
                onClick={onVisit}
                disabled={disabled}
                className="w-full bg-slate-100 hover:bg-white disabled:bg-slate-700 disabled:text-slate-500 text-slate-900 font-bold py-3.5 rounded-xl transition-colors flex items-center justify-center space-x-2"
            >
                <span>Visit Site</span>
                <ExternalLink size={18} />
            </button>
        ) : (
            <div className="space-y-3">
                 <div className="p-3 bg-brand-500/10 border border-brand-500/20 rounded-lg text-sm text-brand-200 text-center">
                    Visit open in new tab. Browse freely!
                 </div>
                 <button 
                    onClick={onRate}
                    className="w-full bg-brand-600 hover:bg-brand-500 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-brand-900/20 flex items-center justify-center space-x-2 animate-bounce-subtle"
                >
                    <CheckCircle size={18} />
                    <span>I'm Done - Rate Now</span>
                </button>
            </div>
        )}
      </div>
    </motion.div>
  );
};

const RatingModal: React.FC<{ site: Website, dwellTime: number, onClose: () => void }> = ({ site, dwellTime, onClose }) => {
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [reported, setReported] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) return;
    setSubmitting(true);
    
    await dbService.addRating({
      id: Math.random().toString(),
      userId: dbService.getCurrentUser()?.id || '',
      websiteId: site.id,
      score: rating,
      feedback,
      dwellTimeSeconds: Math.floor(dwellTime),
      timestamp: new Date().toISOString()
    });

    setTimeout(() => {
      setSubmitting(false);
      onClose();
    }, 800);
  };

  const handleReport = () => {
    // In production, send report to admin API
    setReported(true);
    setTimeout(() => onClose(), 1500);
  };

  if (reported) {
      return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-slate-800 border border-slate-700 p-8 rounded-2xl shadow-2xl text-center">
                <CheckCircle size={48} className="text-red-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white">Report Submitted</h3>
                <p className="text-slate-400 mt-2">We will review this site for quality violations.</p>
            </div>
        </div>
      );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-slate-800 border border-slate-700 w-full max-w-md rounded-2xl shadow-2xl p-6 relative"
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-500 hover:text-white">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>

        <div className="text-center mb-6">
            <h3 className="text-xl font-bold text-white mb-2">How was {site.name}?</h3>
            <div className="inline-flex items-center space-x-2 text-slate-400 text-sm bg-slate-900 px-3 py-1 rounded-full">
                <Clock size={12} />
                <span>Tracked time: {Math.floor(dwellTime)}s</span>
            </div>
        </div>
        
        <p className="text-slate-400 text-sm mb-6 text-center">Rate your experience honestly. Quality ratings earn more points.</p>

        <div className="flex justify-center space-x-2 mb-8">
          {[1, 2, 3, 4, 5].map((star) => (
            <motion.button
              key={star}
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.9 }}
              animate={{ 
                scale: rating >= star ? 1.1 : 1,
                rotate: rating >= star ? [0, -10, 10, 0] : 0
              }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
              onClick={() => setRating(star)}
              className={`p-2 transition-colors duration-200 focus:outline-none`}
            >
              <Star 
                size={32} 
                className={`${rating >= star ? 'text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]' : 'text-slate-600 hover:text-slate-500'}`}
                fill={rating >= star ? "currentColor" : "none"} 
              />
            </motion.button>
          ))}
        </div>

        <textarea
          placeholder="Optional: What did you think? (Private feedback to owner)"
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white mb-6 focus:outline-none focus:border-brand-500 text-sm"
          rows={3}
        />

        <button
          onClick={handleSubmit}
          disabled={rating === 0 || submitting}
          className="w-full bg-brand-600 hover:bg-brand-500 disabled:bg-slate-700 disabled:text-slate-500 text-white font-bold py-3 rounded-xl transition-all mb-4"
        >
          {submitting ? 'Submitting...' : 'Submit Review & Earn Points'}
        </button>

        <button 
            onClick={handleReport}
            className="w-full text-xs text-slate-500 hover:text-red-400 flex items-center justify-center space-x-1 py-2"
        >
            <Flag size={12} />
            <span>Report as Spam / Low Quality</span>
        </button>
      </motion.div>
    </div>
  );
};

export default DiscoveryFeed;