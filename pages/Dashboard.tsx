import React, { useState, useEffect, useRef } from 'react';
import { dbService } from '../services/dbService';
import { geminiService } from '../services/geminiService';
import { Website, Campaign, CampaignStep, CampaignAsset } from '../types';
import { Plus, BarChart3, Globe, ExternalLink, Sparkles, Loader2, AlertCircle, Layers, MousePointerClick, Search, Tag, TrendingUp, Users, Clock, X, MessageSquare, ArrowUpRight, Zap, Play, Terminal, CheckCircle2, FileText, Share2, Link as LinkIcon, Video, MapPin, Globe2, Image as ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const user = dbService.getCurrentUser();
  const navigate = useNavigate();
  const [websites, setWebsites] = useState<Website[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [activeCampaignSite, setActiveCampaignSite] = useState<Website | null>(null);

  useEffect(() => {
    if (user) {
      setWebsites(dbService.getWebsitesByOwner(user.id));
    }
  }, [user]);

  return (
    <div className="space-y-6 md:space-y-8">
      {activeCampaignSite ? (
        <CampaignRunner 
          site={activeCampaignSite} 
          onClose={() => setActiveCampaignSite(null)} 
        />
      ) : (
        <>
          <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">Traffic Command Center</h1>
              <p className="text-sm md:text-base text-slate-400">Deploy AI agents to generate instant visibility.</p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-brand-600 hover:bg-brand-500 text-white px-4 py-2.5 rounded-xl font-medium shadow-lg shadow-brand-500/20 flex items-center justify-center space-x-2 transition-all text-sm md:text-base w-full md:w-auto"
            >
              <Plus size={18} />
              <span>New Property</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {websites.map((site) => (
              <div key={site.id}>
                <WebsiteCard 
                  site={site} 
                  onLaunch={() => setActiveCampaignSite(site)}
                  onAnalytics={() => navigate(`/analytics/${site.id}`)}
                />
              </div>
            ))}
            {websites.length === 0 && (
              <div className="col-span-full py-16 md:py-20 flex flex-col items-center justify-center border-2 border-dashed border-slate-700 rounded-3xl bg-slate-800/20">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4">
                  <Globe className="text-slate-500" size={24} />
                </div>
                <h3 className="text-lg md:text-xl font-semibold text-slate-300">No websites active</h3>
                <p className="text-sm md:text-base text-slate-500 mt-2 max-w-sm text-center px-4">Add a site to launch your first AI traffic campaign.</p>
              </div>
            )}
          </div>
        </>
      )}

      <AnimatePresence>
        {showAddModal && <AddWebsiteModal onClose={() => setShowAddModal(false)} onAdd={(site) => setWebsites([...websites, site])} />}
      </AnimatePresence>
    </div>
  );
};

const WebsiteCard: React.FC<{ site: Website, onLaunch: () => void, onAnalytics: () => void }> = ({ site, onLaunch, onAnalytics }) => (
  <motion.div 
    layout
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    className="bg-slate-800 border border-slate-700 rounded-2xl p-4 md:p-6 hover:border-brand-500/50 transition-all group flex flex-col h-full relative overflow-hidden"
  >
    <div className="absolute top-0 right-0 w-24 h-24 bg-brand-500/5 rounded-bl-full -mr-4 -mt-4" />
    
    <div className="flex justify-between items-start mb-4 relative z-10">
      <div className="w-10 h-10 bg-slate-700 rounded-lg flex items-center justify-center text-brand-400">
        <Globe size={20} />
      </div>
      <div className="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-700 text-[10px] md:text-xs font-mono text-slate-400">
        QS: {site.qualityScore}
      </div>
    </div>
    
    <h3 className="text-lg font-bold text-white mb-1 truncate">{site.name}</h3>
    <a href={site.url} target="_blank" rel="noreferrer" className="text-xs md:text-sm text-slate-500 hover:text-brand-400 flex items-center gap-1 mb-6 truncate max-w-full">
      {site.url} <ExternalLink size={12} />
    </a>

    <div className="grid grid-cols-2 gap-3 mb-6">
       <div className="bg-slate-900/50 p-3 rounded-xl">
          <div className="text-[10px] md:text-xs text-slate-500 uppercase font-bold mb-1">Visitors</div>
          <div className="text-lg md:text-xl font-bold text-white">{site.totalVisits}</div>
       </div>
       <div className="bg-slate-900/50 p-3 rounded-xl">
          <div className="text-[10px] md:text-xs text-slate-500 uppercase font-bold mb-1">Rating</div>
          <div className="text-lg md:text-xl font-bold text-yellow-400 flex items-center gap-1">
            {site.averageRating.toFixed(1)} <Sparkles size={12} fill="currentColor"/>
          </div>
       </div>
    </div>

    <div className="mt-auto space-y-2">
        <button 
        onClick={onLaunch}
        className="w-full bg-slate-700 hover:bg-brand-600 text-white font-semibold py-2.5 md:py-3 rounded-xl transition-all flex items-center justify-center space-x-2 group-hover:shadow-lg group-hover:shadow-brand-500/20 text-sm md:text-base"
        >
        <Zap size={16} className="fill-current" />
        <span>Launch Campaign</span>
        </button>
        <button 
        onClick={onAnalytics}
        className="w-full bg-transparent hover:bg-slate-700 text-slate-400 hover:text-white font-medium py-2 rounded-xl transition-all flex items-center justify-center space-x-2 text-xs md:text-sm"
        >
        <BarChart3 size={16} />
        <span>View Analytics</span>
        </button>
    </div>
  </motion.div>
);

// --- CAMPAIGN RUNNER COMPONENT ---

const CampaignRunner: React.FC<{ site: Website, onClose: () => void }> = ({ site, onClose }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [logs, setLogs] = useState<CampaignStep[]>([]);
  const [assets, setAssets] = useState<CampaignAsset[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Stats
  const backlinks = assets.filter(a => a.type === 'backlink' || a.type === 'directory_submission' || a.type === 'local_listing').length;
  const posts = assets.filter(a => a.type === 'social_post' || a.type === 'article' || a.type === 'video_content').length;
  const indexEvents = assets.filter(a => a.type === 'search_submission').length;

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  const startCampaign = async () => {
    setIsRunning(true);
    setLogs([{ id: 'init', action: 'Initializing Agent', detail: 'Connecting to traffic networks...', timestamp: Date.now(), status: 'pending' }]);
    
    await geminiService.runTrafficCampaign(site, (step, asset) => {
      setLogs(prev => [...prev, step]);
      if (asset) {
        setAssets(prev => [...prev, asset]);
      }
    });

    setIsRunning(false);
    setIsComplete(true);
    
    // Save to DB
    const campaign: Campaign = {
        id: Math.random().toString(),
        websiteId: site.id,
        status: 'completed',
        timestamp: Date.now(),
        logs: logs,
        assets: assets,
        totalBacklinks: backlinks,
        totalPosts: posts,
        estimatedTraffic: (backlinks * 10) + (posts * 50) + (indexEvents * 100)
    };
    dbService.saveCampaign(campaign);
  };

  return (
    <div className="bg-slate-900 border border-slate-700 rounded-3xl overflow-hidden shadow-2xl flex flex-col h-[calc(100vh-100px)] md:h-[85vh]">
      {/* Header */}
      <div className="bg-slate-800 p-4 md:p-6 border-b border-slate-700 flex justify-between items-center shrink-0">
        <div>
           <div className="flex items-center space-x-2 text-brand-400 mb-1">
             <Terminal size={14} className="md:w-[18px]" />
             <span className="font-mono text-[10px] md:text-xs uppercase tracking-wider">Traffic Automation Agent v3.1</span>
           </div>
           <h2 className="text-lg md:text-2xl font-bold text-white truncate max-w-[200px] md:max-w-md">Campaign: {site.name}</h2>
        </div>
        {!isRunning && <button onClick={onClose} className="p-2 hover:bg-slate-700 rounded-full text-slate-400"><X size={20}/></button>}
      </div>

      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Left: Terminal / Logs */}
        <div className="flex-1 flex flex-col border-b md:border-b-0 md:border-r border-slate-700 bg-black/40 min-h-[50%]">
           <div className="flex-1 overflow-y-auto p-4 md:p-6 font-mono space-y-3 md:space-y-4 custom-scrollbar" ref={scrollRef}>
              {logs.length === 0 && !isComplete && (
                  <div className="h-full flex flex-col items-center justify-center text-slate-500 opacity-50">
                      <Play size={32} className="md:w-[48px] md:h-[48px] mb-4" />
                      <p className="text-sm">Ready to initialize traffic sequence.</p>
                  </div>
              )}
              
              {logs.map((log) => (
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    key={log.id} 
                    className="flex items-start gap-3"
                  >
                      <div className="mt-1">
                          {log.status === 'pending' ? <Loader2 size={12} className="animate-spin text-brand-400 md:w-[14px] md:h-[14px]"/> : <CheckCircle2 size={12} className="text-green-500 md:w-[14px] md:h-[14px]"/>}
                      </div>
                      <div>
                          <div className="text-xs md:text-sm text-brand-200 font-bold">{log.action}</div>
                          <div className="text-[10px] md:text-xs text-slate-400">{log.detail}</div>
                      </div>
                  </motion.div>
              ))}

              {isRunning && (
                  <div className="flex items-center gap-2 text-brand-400 animate-pulse text-xs md:text-sm pl-7">
                      <span className="w-1.5 h-1.5 bg-brand-400 rounded-full"/>
                      Agent is working...
                  </div>
              )}
              
              {isComplete && (
                  <div className="p-3 md:p-4 bg-green-500/10 border border-green-500/20 rounded-lg text-green-400 text-xs md:text-sm mt-4">
                      CAMPAIGN COMPLETE. Traffic injection started.
                  </div>
              )}
           </div>

           {!isRunning && !isComplete && (
               <div className="p-4 md:p-6 border-t border-slate-800 bg-slate-900 shrink-0">
                   <button 
                     onClick={startCampaign}
                     className="w-full bg-brand-600 hover:bg-brand-500 text-white font-bold py-3 md:py-4 rounded-xl shadow-lg shadow-brand-500/20 flex items-center justify-center space-x-2 text-base md:text-lg transition-all hover:scale-[1.01]"
                   >
                       <Zap size={20} className="fill-white md:w-[24px] md:h-[24px]" />
                       <span>IGNITE TRAFFIC CAMPAIGN</span>
                   </button>
                   <p className="text-center text-slate-500 text-[10px] md:text-xs mt-3">Est. 20+ automated actions in ~2 minutes</p>
               </div>
           )}
        </div>

        {/* Right: Assets & Results (Hidden on very small screens if logs are active? No, stack it) */}
        <div className="w-full md:w-[450px] lg:w-[500px] bg-slate-800/50 p-4 md:p-6 flex flex-col overflow-y-auto border-t md:border-t-0 border-slate-700 min-h-[40%]">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 md:mb-6">Generated Assets</h3>
            
            <div className="space-y-4 mb-6 md:mb-8">
                <div className="grid grid-cols-3 gap-2">
                    <div className="bg-slate-900 p-2 md:p-3 rounded-xl border border-slate-700 text-center">
                        <div className="text-lg md:text-xl font-bold text-white">{backlinks}</div>
                        <div className="text-[9px] md:text-[10px] text-slate-500 uppercase">Backlinks</div>
                    </div>
                    <div className="bg-slate-900 p-2 md:p-3 rounded-xl border border-slate-700 text-center">
                        <div className="text-lg md:text-xl font-bold text-white">{posts}</div>
                        <div className="text-[9px] md:text-[10px] text-slate-500 uppercase">Content</div>
                    </div>
                    <div className="bg-slate-900 p-2 md:p-3 rounded-xl border border-slate-700 text-center">
                        <div className="text-lg md:text-xl font-bold text-white">{indexEvents}</div>
                        <div className="text-[9px] md:text-[10px] text-slate-500 uppercase">Indexed</div>
                    </div>
                </div>
            </div>

            <div className="space-y-3 flex-1">
                {assets.map((asset, i) => (
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        key={asset.id} 
                        className="bg-slate-900 border border-slate-700 p-3 md:p-4 rounded-xl group hover:border-brand-500/30 transition-colors"
                    >
                        <div className="flex justify-between items-start mb-2">
                             <div className="flex items-center gap-2">
                                {asset.type === 'article' && <FileText size={12} className="text-blue-400 md:w-[14px]" />}
                                {asset.type === 'social_post' && <Share2 size={12} className="text-pink-400 md:w-[14px]" />}
                                {asset.type === 'directory_submission' && <LinkIcon size={12} className="text-emerald-400 md:w-[14px]" />}
                                {asset.type === 'search_submission' && <Globe2 size={12} className="text-indigo-400 md:w-[14px]" />}
                                {asset.type === 'video_content' && <Video size={12} className="text-red-400 md:w-[14px]" />}
                                {asset.type === 'local_listing' && <MapPin size={12} className="text-orange-400 md:w-[14px]" />}
                                <span className="text-[10px] md:text-xs font-bold text-white capitalize">{asset.platform}</span>
                             </div>
                             {asset.url && <a href={asset.url} target="_blank" className="text-slate-500 hover:text-white"><ExternalLink size={12}/></a>}
                        </div>
                        
                        {/* Render Generated Media */}
                        {asset.mediaType === 'image' && asset.mediaUrl && (
                            <div className="mb-3 rounded-lg overflow-hidden border border-slate-700 mt-2">
                                <img src={asset.mediaUrl} alt="Generated Asset" className="w-full h-auto object-cover" />
                            </div>
                        )}
                         {asset.mediaType === 'video' && asset.mediaUrl && (
                            <div className="mb-3 rounded-lg overflow-hidden border border-slate-700 mt-2 bg-black">
                                <video controls src={asset.mediaUrl} className="w-full h-auto" />
                            </div>
                        )}

                        <p className="text-[10px] md:text-xs text-slate-400 line-clamp-4 font-mono bg-black/20 p-2 rounded whitespace-pre-wrap">
                            {asset.content}
                        </p>
                    </motion.div>
                ))}
                {assets.length === 0 && (
                    <div className="text-center text-slate-600 text-xs md:text-sm py-10">
                        Assets will appear here...
                    </div>
                )}
            </div>
            
            {isComplete && (
                <button onClick={onClose} className="mt-4 w-full py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-medium text-sm md:text-base">
                    Close Report
                </button>
            )}
        </div>
      </div>
    </div>
  );
};


const AddWebsiteModal: React.FC<{ onClose: () => void, onAdd: (s: Website) => void }> = ({ onClose, onAdd }) => {
  const [step, setStep] = useState(1);
  const [url, setUrl] = useState('');
  const [description, setDescription] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [preferredImageSize, setPreferredImageSize] = useState<'1K' | '2K' | '4K'>('1K'); // New State
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<Partial<Website> | null>(null);
  const [urlError, setUrlError] = useState('');

  const validateUrl = (value: string) => {
    try {
      new URL(value);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleAnalyze = async () => {
    setUrlError('');
    if (!validateUrl(url)) {
      setUrlError('Invalid URL');
      return;
    }
    if (!url || !description || !targetAudience) return;

    setIsAnalyzing(true);
    try {
      const result = await geminiService.analyzeWebsite(url, description, targetAudience);
      setAnalysis(result);
      setStep(2);
    } catch (e) {
      console.error(e);
      setIsAnalyzing(false);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleConfirm = async () => {
    if (!analysis) return;
    const user = dbService.getCurrentUser();
    if (!user) return;

    const newSite: Website = {
      id: Math.random().toString(36).substr(2, 9),
      ownerId: user.id,
      url,
      name: analysis.name || new URL(url).hostname,
      description,
      niche: analysis.niche || 'General',
      qualityScore: analysis.qualityScore || 50,
      targetAudienceProfile: analysis.targetAudienceProfile || targetAudience,
      aiAnalysisSummary: analysis.aiAnalysisSummary || '',
      
      // New Deep Analysis Fields
      audienceAge: analysis.audienceAge,
      audienceGender: analysis.audienceGender,
      audienceInterests: analysis.audienceInterests,
      audienceIntent: analysis.audienceIntent,
      semanticTags: analysis.semanticTags,
      engagementPrediction: analysis.engagementPrediction,

      contentTypes: analysis.contentTypes || [],
      detectedCTAs: analysis.detectedCTAs || [],
      metaDescription: analysis.metaDescription,
      metaKeywords: analysis.metaKeywords,
      preferredImageSize: preferredImageSize, // Store user preference
      
      createdAt: new Date().toISOString(),
      totalVisits: 0,
      averageRating: 0,
      ctr: 0
    };

    await dbService.addWebsite(newSite);
    onAdd(newSite);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-4 bg-black/50 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-slate-800 border border-slate-700 w-full max-w-[95%] md:max-w-lg rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
      >
        <div className="p-4 md:p-6 flex-1 overflow-y-auto custom-scrollbar">
          <div className="flex justify-between items-center mb-4 md:mb-6">
            <h2 className="text-lg md:text-xl font-bold text-white">Add New Property</h2>
            <button onClick={onClose} className="text-slate-400 hover:text-white text-sm md:text-base">Close</button>
          </div>

          {step === 1 ? (
            <div className="space-y-4">
              <div>
                <label className="block text-xs md:text-sm font-medium text-slate-400 mb-1">Website URL</label>
                <div className="relative">
                  <input 
                    value={url}
                    onChange={(e) => {
                      setUrl(e.target.value);
                      if (urlError) setUrlError('');
                    }}
                    placeholder="https://example.com"
                    className={`w-full bg-slate-900 border rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-1 transition-all text-sm ${
                      urlError ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-slate-700 focus:border-brand-500 focus:ring-brand-500'
                    }`}
                  />
                  {urlError && (
                    <div className="absolute right-3 top-2.5 text-red-500">
                      <AlertCircle size={16} />
                    </div>
                  )}
                </div>
                {urlError && <p className="text-red-400 text-[10px] mt-1 ml-1">{urlError}</p>}
              </div>
              
              {!isAnalyzing ? (
                <>
                  <div>
                    <label className="block text-xs md:text-sm font-medium text-slate-400 mb-1">Brief Description</label>
                    <textarea 
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="What is this site about?"
                      rows={2}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-brand-500 text-sm"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs md:text-sm font-medium text-slate-400 mb-1">Target Audience Profile</label>
                    <input 
                      value={targetAudience}
                      onChange={(e) => setTargetAudience(e.target.value)}
                      placeholder="e.g. Female fashion lovers, 18-35"
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-brand-500 text-sm"
                    />
                  </div>
                  
                  {/* Image Size Preference */}
                  <div>
                    <label className="block text-xs md:text-sm font-medium text-slate-400 mb-1">Image Gen Quality</label>
                    <div className="flex gap-2">
                        {(['1K', '2K', '4K'] as const).map(size => (
                            <button
                                key={size}
                                onClick={() => setPreferredImageSize(size)}
                                className={`flex-1 py-1.5 md:py-2 rounded-lg text-xs md:text-sm font-semibold border transition-all ${
                                    preferredImageSize === size 
                                    ? 'bg-brand-600 border-brand-500 text-white' 
                                    : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-600'
                                }`}
                            >
                                {size}
                            </button>
                        ))}
                    </div>
                  </div>

                  <button
                    onClick={handleAnalyze}
                    disabled={!url || !description || !targetAudience}
                    className="w-full bg-brand-600 hover:bg-brand-500 text-white py-2.5 md:py-3 rounded-xl font-medium flex items-center justify-center space-x-2 disabled:opacity-50 transition-all mt-2 text-sm md:text-base"
                  >
                    <Sparkles size={18} />
                    <span>Deep Analyze with AI</span>
                  </button>
                </>
              ) : (
                <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 overflow-hidden relative text-center">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-slate-700/20 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]" />
                    <div className="flex flex-col items-center gap-2">
                        <Sparkles className="text-brand-400 animate-pulse" size={24} />
                        <span className="text-sm text-brand-300 font-medium animate-pulse">Gemini 3 is performing deep analysis...</span>
                    </div>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4 md:space-y-6">
              <div className="bg-brand-900/20 border border-brand-500/20 rounded-xl p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2 text-brand-400">
                    <Sparkles size={16} />
                    <span className="text-xs md:text-sm font-bold uppercase tracking-wide">Analysis Complete</span>
                  </div>
                  {analysis?.name && (
                    <span className="text-[10px] md:text-xs text-brand-200 bg-brand-500/20 px-2 py-0.5 rounded truncate max-w-[120px]">
                      {analysis.name}
                    </span>
                  )}
                </div>
                
                <div className="space-y-3 md:space-y-4">
                  <div>
                    <span className="text-slate-500 text-[10px] md:text-xs uppercase">Detected Niche</span>
                    <p className="text-white font-medium text-sm md:text-base">{analysis?.niche}</p>
                  </div>
                  
                  {/* Semantic Tags */}
                  {analysis?.semanticTags && analysis.semanticTags.length > 0 && (
                     <div>
                        <span className="text-slate-500 text-[10px] md:text-xs uppercase block mb-1">Semantic Tags</span>
                        <div className="flex flex-wrap gap-1">
                            {analysis.semanticTags.slice(0, 5).map((tag, i) => (
                                <span key={i} className="text-[10px] bg-slate-700 text-slate-300 px-1.5 py-0.5 rounded flex items-center">
                                    # {tag}
                                </span>
                            ))}
                        </div>
                     </div>
                  )}

                  <div className="flex items-center space-x-2 mt-3 pt-3 border-t border-brand-500/20">
                    <span className="text-slate-500 text-[10px] md:text-xs uppercase">Quality Score</span>
                    <div className="px-2 py-0.5 bg-brand-500 text-white text-[10px] md:text-xs font-bold rounded-full">
                      {analysis?.qualityScore}/100
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex space-x-3 pb-2">
                 <button
                  onClick={() => setStep(1)}
                  className="flex-1 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white py-2.5 md:py-3 rounded-xl font-medium transition-colors text-sm md:text-base"
                >
                  Edit Input
                </button>
                <button
                  onClick={handleConfirm}
                  className="flex-[2] bg-green-600 hover:bg-green-500 text-white py-2.5 md:py-3 rounded-xl font-medium transition-colors shadow-lg shadow-green-900/20 text-sm md:text-base"
                >
                  Approve & Add
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;