import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { dbService } from '../services/dbService';
import { Website, Rating, Campaign } from '../types';
import { ArrowLeft, Clock, TrendingUp, Users, Star, Activity, BarChart3, Zap, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const SiteAnalytics: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [site, setSite] = useState<Website | undefined>(undefined);
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [campaign, setCampaign] = useState<Campaign | undefined>(undefined);

  useEffect(() => {
    if (id) {
      setSite(dbService.getSiteById(id));
      setRatings(dbService.getRatingsBySite(id));
      setCampaign(dbService.getCampaignByWebsite(id));
    }
  }, [id]);

  if (!site) return <div className="p-10 text-center text-slate-500">Loading website data...</div>;

  const averageDwell = ratings.length > 0 
    ? Math.round(ratings.reduce((acc, curr) => acc + curr.dwellTimeSeconds, 0) / ratings.length) 
    : 0;

  // Simulate traffic data for the chart
  const trafficData = [45, 67, 58, 80, 102, 95, 124]; 
  const maxTraffic = Math.max(...trafficData);

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <button onClick={() => navigate('/dashboard')} className="p-2 bg-slate-800 rounded-full hover:bg-slate-700 text-slate-400">
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-white">{site.name} Analytics</h1>
          <p className="text-slate-400 text-sm flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
            Active Monitoring
            <span className="text-slate-600">•</span>
            {site.url}
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-800 border border-slate-700 p-5 rounded-2xl">
          <div className="flex items-center space-x-2 text-slate-400 mb-2">
            <Users size={16} />
            <span className="text-xs font-bold uppercase">Total Visitors</span>
          </div>
          <div className="text-3xl font-bold text-white">{site.totalVisits}</div>
          <div className="text-xs text-green-400 flex items-center mt-1">
            <TrendingUp size={12} className="mr-1" /> +12% this week
          </div>
        </div>

        <div className="bg-slate-800 border border-slate-700 p-5 rounded-2xl">
          <div className="flex items-center space-x-2 text-slate-400 mb-2">
            <Star size={16} />
            <span className="text-xs font-bold uppercase">Avg Rating</span>
          </div>
          <div className="text-3xl font-bold text-white">{site.averageRating.toFixed(1)}</div>
          <div className="flex mt-1 space-x-0.5">
             {[1,2,3,4,5].map(s => (
               <div key={s} className={`w-1.5 h-1.5 rounded-full ${s <= Math.round(site.averageRating) ? 'bg-yellow-400' : 'bg-slate-700'}`} />
             ))}
          </div>
        </div>

        <div className="bg-slate-800 border border-slate-700 p-5 rounded-2xl">
          <div className="flex items-center space-x-2 text-slate-400 mb-2">
            <Clock size={16} />
            <span className="text-xs font-bold uppercase">Avg Dwell Time</span>
          </div>
          <div className="text-3xl font-bold text-white">{averageDwell}s</div>
          <div className="text-xs text-slate-500 mt-1">Target: 45s+</div>
        </div>

        <div className="bg-slate-800 border border-slate-700 p-5 rounded-2xl">
          <div className="flex items-center space-x-2 text-slate-400 mb-2">
            <Zap size={16} />
            <span className="text-xs font-bold uppercase">Quality Score</span>
          </div>
          <div className="text-3xl font-bold text-brand-400">{site.qualityScore}</div>
          <div className="text-xs text-slate-500 mt-1">Gemini AI Audit</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart Section */}
        <div className="lg:col-span-2 bg-slate-800 border border-slate-700 rounded-2xl p-6">
           <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-white flex items-center gap-2">
                  <BarChart3 size={18} className="text-brand-400"/> Traffic Trends
              </h3>
              <select className="bg-slate-900 border border-slate-700 text-xs rounded-lg px-2 py-1 text-slate-300">
                  <option>Last 7 Days</option>
                  <option>Last 30 Days</option>
              </select>
           </div>
           
           {/* Custom CSS Bar Chart */}
           <div className="h-64 flex items-end justify-between space-x-2 px-2">
              {trafficData.map((val, idx) => {
                  const height = (val / maxTraffic) * 100;
                  return (
                      <div key={idx} className="flex-1 flex flex-col items-center group">
                          <div className="relative w-full mx-1">
                              <div 
                                className="w-full bg-brand-500/20 group-hover:bg-brand-500/40 rounded-t-sm transition-all duration-300"
                                style={{ height: `${height}%` }}
                              />
                              <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity border border-slate-700 z-10">
                                  {val} Visits
                              </div>
                          </div>
                          <div className="text-[10px] text-slate-500 mt-2 uppercase">Day {idx + 1}</div>
                      </div>
                  )
              })}
           </div>
        </div>

        {/* Campaign Status */}
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
           <h3 className="font-bold text-white mb-4 flex items-center gap-2">
               <Activity size={18} className="text-emerald-400" /> Recent Campaign
           </h3>
           
           {campaign ? (
               <div className="space-y-4">
                   <div className="flex justify-between items-center bg-slate-900 p-3 rounded-lg border border-slate-700">
                       <span className="text-sm text-slate-400">Status</span>
                       <span className="text-xs font-bold bg-green-500/20 text-green-400 px-2 py-1 rounded capitalize">{campaign.status}</span>
                   </div>
                   
                   <div className="space-y-2">
                       <div className="flex justify-between text-xs">
                           <span className="text-slate-500">Backlinks Created</span>
                           <span className="text-white font-mono">{campaign.totalBacklinks}</span>
                       </div>
                       <div className="w-full bg-slate-900 rounded-full h-1.5">
                           <div className="bg-brand-500 h-1.5 rounded-full" style={{ width: '100%' }}></div>
                       </div>
                   </div>

                   <div className="space-y-2">
                       <div className="flex justify-between text-xs">
                           <span className="text-slate-500">Content Published</span>
                           <span className="text-white font-mono">{campaign.totalPosts}</span>
                       </div>
                       <div className="w-full bg-slate-900 rounded-full h-1.5">
                           <div className="bg-purple-500 h-1.5 rounded-full" style={{ width: '100%' }}></div>
                       </div>
                   </div>

                   <div className="pt-4 border-t border-slate-700">
                       <p className="text-xs text-slate-500 mb-2">Estimated Traffic Impact</p>
                       <p className="text-2xl font-bold text-white">~{campaign.estimatedTraffic} <span className="text-sm font-normal text-slate-500">visitors/mo</span></p>
                   </div>
               </div>
           ) : (
               <div className="text-center py-8 text-slate-500 text-sm">
                   No active campaigns.
                   <button onClick={() => navigate('/dashboard')} className="block mx-auto mt-2 text-brand-400 hover:underline">Launch One</button>
               </div>
           )}
        </div>
      </div>

      {/* Ratings List */}
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
          <h3 className="font-bold text-white mb-6">Visitor Feedback</h3>
          <div className="space-y-4">
              {ratings.length > 0 ? ratings.map(rating => (
                  <motion.div 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }}
                    key={rating.id} 
                    className="p-4 bg-slate-900/50 rounded-xl border border-slate-700/50"
                  >
                      <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center space-x-1">
                              {[1,2,3,4,5].map(s => (
                                  <Star key={s} size={14} className={s <= rating.score ? "text-yellow-400 fill-current" : "text-slate-700"} />
                              ))}
                          </div>
                          <span className="text-xs text-slate-500">{new Date(rating.timestamp).toLocaleDateString()}</span>
                      </div>
                      <p className="text-slate-300 text-sm italic">"{rating.feedback}"</p>
                      <div className="mt-2 text-xs text-slate-500 flex items-center gap-1">
                          <Clock size={10} /> Time on site: {rating.dwellTimeSeconds}s
                      </div>
                  </motion.div>
              )) : (
                  <div className="text-center py-10 text-slate-500">
                      <AlertCircle className="mx-auto mb-2 opacity-50" />
                      No feedback yet. Launch a campaign to get visitors!
                  </div>
              )}
          </div>
      </div>
    </div>
  );
};

export default SiteAnalytics;