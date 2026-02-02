import React, { useState, useEffect, useRef } from 'react';
import { dbService } from '../services/dbService';
import { geminiService } from '../services/geminiService';
import { Website, Campaign, CampaignStep, CampaignAsset } from '../types';
import { Plus, BarChart3, Globe, ExternalLink, Sparkles, Loader2, AlertCircle, Layers, MousePointerClick, Search, Tag, TrendingUp, Users, Clock, X, MessageSquare, ArrowUpRight, Zap, Play, Terminal, CheckCircle2, FileText, Share2, Link as LinkIcon, Video } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Dashboard: React.FC = () => {
  const user = dbService.getCurrentUser();
  const [websites, setWebsites] = useState<Website[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [activeCampaignSite, setActiveCampaignSite] = useState<Website | null>(null);

  useEffect(() => {
    if (user) {
      setWebsites(dbService.getWebsitesByOwner(user.id));
    }
  }, [user]);

  return (
    <div className="space-y-8">
      {activeCampaignSite ? (
        <CampaignRunner 
          site={activeCampaignSite} 
          onClose={() => setActiveCampaignSite(null)} 
        />
      ) : (
        <>
          <div className="flex justify-between items-end">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Traffic Command Center</h1>
              <p className="text-slate-400">Deploy AI agents to generate instant visibility.</p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-brand-600 hover:bg-brand-500 text-white px-5 py-2.5 rounded-xl font-medium shadow-lg shadow-brand-500/20 flex items-center space-x-2 transition-all"
            >
              <Plus size={18} />
              <span>New Property</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {websites.map((site) => (
              <div key={site.id}>
                <WebsiteCard 
                  site={site} 
                  onLaunch={() => setActiveCampaignSite(site)}
                />
              </div>
            ))}
            {websites.length === 0 && (
              <div className="col-span-full py-20 flex flex-col items-center justify-center border-2 border-dashed border-slate-700 rounded-3xl bg-slate-800/20">
                <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4">
                  <Globe className="text-slate-500" size={32} />
                </div>
                <h3 className="text-xl font-semibold text-slate-300">No websites active</h3>
                <p className="text-slate-500 mt-2 max-w-sm text-center">Add a site to launch your first AI traffic campaign.</p>
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

const WebsiteCard: React.FC<{ site: Website, onLaunch: () => void }> = ({ site, onLaunch }) => (
  <motion.div 
    layout
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    className="bg-slate-800 border border-slate-700 rounded-2xl p-6 hover:border-brand-500/50 transition-all group flex flex-col h-full relative overflow-hidden"
  >
    <div className="absolute top-0 right-0 w-24 h-24 bg-brand-500/5 rounded-bl-full -mr-4 -mt-4" />
    
    <div className="flex justify-between items-start mb-4 relative z-10">
      <div className="w-10 h-10 bg-slate-700 rounded-lg flex items-center justify-center text-brand-400">
        <Globe size={20} />
      </div>
      <div className="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-700 text-xs font-mono text-slate-400">
        QS: {site.qualityScore}
      </div>
    </div>
    
    <h3 className="text-lg font-bold text-white mb-1 truncate">{site.name}</h3>
    <a href={site.url} target="_blank" rel="noreferrer" className="text-sm text-slate-500 hover:text-brand-400 flex items-center gap-1 mb-6 truncate max-w-full">
      {site.url} <ExternalLink size={12} />
    </a>

    <div className="grid grid-cols-2 gap-3 mb-6">
       <div className="bg-slate-900/50 p-3 rounded-xl">
          <div className="text-xs text-slate-500 uppercase font-bold mb-1">Visitors</div>
          <div className="text-xl font-bold text-white">{site.totalVisits}</div>
       </div>
       <div className="bg-slate-900/50 p-3 rounded-xl">
          <div className="text-xs text-slate-500 uppercase font-bold mb-1">Rating</div>
          <div className="text-xl font-bold text-yellow-400 flex items-center gap-1">
            {site.averageRating.toFixed(1)} <Sparkles size={12} fill="currentColor"/>
          </div>
       </div>
    </div>

    <button 
      onClick={onLaunch}
      className="w-full mt-auto bg-slate-700 hover:bg-brand-600 text-white font-semibold py-3 rounded-xl transition-all flex items-center justify-center space-x-2 group-hover:shadow-lg group-hover:shadow-brand-500/20"
    >
      <Zap size={18} className="fill-current" />
      <span>Launch Campaign</span>
    </button>
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
  const backlinks = assets.filter(a => a.type === 'backlink' || a.type === 'directory_submission').length;
  const posts = assets.filter(a => a.type === 'social_post' || a.type === 'article').length;

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
        estimatedTraffic: (backlinks * 10) + (posts * 50)
    };
    dbService.saveCampaign(campaign);
  };

  return (
    <div className="bg-slate-900 border border-slate-700 rounded-3xl overflow-hidden shadow-2xl flex flex-col h-[85vh]">
      {/* Header */}
      <div className="bg-slate-800 p-6 border-b border-slate-700 flex justify-between items-center">
        <div>
           <div className="flex items-center space-x-2 text-brand-400 mb-1">
             <Terminal size={18} />
             <span className="font-mono text-xs uppercase tracking-wider">Traffic Automation Agent v3.1</span>
           </div>
           <h2 className="text-2xl font-bold text-white">Campaign: {site.name}</h2>
        </div>
        {!isRunning && <button onClick={onClose} className="p-2 hover:bg-slate-700 rounded-full text-slate-400"><X/></button>}
      </div>

      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Left: Terminal / Logs */}
        <div className="flex-1 flex flex-col border-r border-slate-700 bg-black/40">
           <div className="flex-1 overflow-y-auto p-6 font-mono space-y-4 custom-scrollbar" ref={scrollRef}>
              {logs.length === 0 && !isComplete && (
                  <div className="h-full flex flex-col items-center justify-center text-slate-500 opacity-50">
                      <Play size={48} className="mb-4" />
                      <p>Ready to initialize traffic sequence.</p>
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
                          {log.status === 'pending' ? <Loader2 size={14} className="animate-spin text-brand-400"/> : <CheckCircle2 size={14} className="text-green-500"/>}
                      </div>
                      <div>
                          <div className="text-sm text-brand-200 font-bold">{log.action}</div>
                          <div className="text-xs text-slate-400">{log.detail}</div>
                      </div>
                  </motion.div>
              ))}

              {isRunning && (
                  <div className="flex items-center gap-2 text-brand-400 animate-pulse text-sm pl-7">
                      <span className="w-2 h-2 bg-brand-400 rounded-full"/>
                      Agent is working...
                  </div>
              )}
              
              {isComplete && (
                  <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg text-green-400 text-sm mt-4">
                      CAMPAIGN COMPLETE. Traffic injection started.
                  </div>
              )}
           </div>

           {!isRunning && !isComplete && (
               <div className="p-6 border-t border-slate-800 bg-slate-900">
                   <button 
                     onClick={startCampaign}
                     className="w-full bg-brand-600 hover:bg-brand-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-brand-500/20 flex items-center justify-center space-x-2 text-lg transition-all hover:scale-[1.01]"
                   >
                       <Zap size={24} className="fill-white" />
                       <span>IGNITE TRAFFIC CAMPAIGN</span>
                   </button>
                   <p className="text-center text-slate-500 text-xs mt-3">Est. 20+ automated actions in ~30 seconds</p>
               </div>
           )}
        </div>

        {/* Right: Assets & Results */}
        <div className="w-full md:w-[400px] bg-slate-800/50 p-6 flex flex-col overflow-y-auto">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-6">Generated Assets</h3>
            
            <div className="space-y-4 mb-8">
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-900 p-4 rounded-xl border border-slate-700">
                        <div className="text-2xl font-bold text-white">{backlinks}</div>
                        <div className="text-xs text-slate-500 uppercase">Backlinks</div>
                    </div>
                    <div className="bg-slate-900 p-4 rounded-xl border border-slate-700">
                        <div className="text-2xl font-bold text-white">{posts}</div>
                        <div className="text-xs text-slate-500 uppercase">Posts</div>
                    </div>
                </div>
            </div>

            <div className="space-y-3 flex-1">
                {assets.map((asset, i) => (
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        key={asset.id} 
                        className="bg-slate-900 border border-slate-700 p-4 rounded-xl group hover:border-brand-500/30 transition-colors"
                    >
                        <div className="flex justify-between items-start mb-2">
                             <div className="flex items-center gap-2">
                                {asset.type === 'article' && <FileText size={14} className="text-blue-400" />}
                                {asset.type === 'social_post' && <Share2 size={14} className="text-pink-400" />}
                                {asset.type === 'directory_submission' && <LinkIcon size={14} className="text-emerald-400" />}
                                <span className="text-xs font-bold text-white capitalize">{asset.platform}</span>
                             </div>
                             {asset.url && <a href={asset.url} target="_blank" className="text-slate-500 hover:text-white"><ExternalLink size={12}/></a>}
                        </div>
                        <p className="text-xs text-slate-400 line-clamp-3 font-mono bg-black/20 p-2 rounded">
                            {asset.content}
                        </p>
                    </motion.div>
                ))}
                {assets.length === 0 && (
                    <div className="text-center text-slate-600 text-sm py-10">
                        Assets will appear here as Gemini generates them.
                    </div>
                )}
            </div>
            
            {isComplete && (
                <button onClick={onClose} className="mt-4 w-full py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-medium">
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
      setUrlError('Please enter a valid URL (including https://)');
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-slate-800 border border-slate-700 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
      >
        <div className="p-6 flex-1 overflow-y-auto custom-scrollbar">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-white">Add New Property</h2>
            <button onClick={onClose} className="text-slate-400 hover:text-white">Close</button>
          </div>

          {step === 1 ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Website URL</label>
                <div className="relative">
                  <input 
                    value={url}
                    onChange={(e) => {
                      setUrl(e.target.value);
                      if (urlError) setUrlError('');
                    }}
                    placeholder="https://example.com"
                    className={`w-full bg-slate-900 border rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-1 transition-all ${
                      urlError ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-slate-700 focus:border-brand-500 focus:ring-brand-500'
                    }`}
                  />
                  {urlError && (
                    <div className="absolute right-3 top-2.5 text-red-500">
                      <AlertCircle size={18} />
                    </div>
                  )}
                </div>
                {urlError && <p className="text-red-400 text-xs mt-1 ml-1">{urlError}</p>}
              </div>
              
              {!isAnalyzing ? (
                <>
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1">Brief Description / Intent</label>
                    <textarea 
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="What is this site about?"
                      rows={2}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-brand-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1">Target Audience Profile</label>
                    <input 
                      value={targetAudience}
                      onChange={(e) => setTargetAudience(e.target.value)}
                      placeholder="e.g. Female fashion lovers, 18-35, high spenders"
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-brand-500"
                    />
                    <p className="text-xs text-slate-500 mt-1">AI uses this to build the perfect "Visitor DNA" for matching.</p>
                  </div>

                  <button
                    onClick={handleAnalyze}
                    disabled={!url || !description || !targetAudience}
                    className="w-full bg-brand-600 hover:bg-brand-500 text-white py-3 rounded-xl font-medium flex items-center justify-center space-x-2 disabled:opacity-50 transition-all mt-2"
                  >
                    <Sparkles size={20} />
                    <span>Deep Analyze with AI</span>
                  </button>
                </>
              ) : (
                <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 overflow-hidden relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-slate-700/20 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]" />
                    <div className="flex items-center space-x-2 mb-4">
                        <Sparkles className="text-brand-400 animate-pulse" size={18} />
                        <span className="text-sm text-brand-300 font-medium animate-pulse">Gemini 3 is performing deep analysis...</span>
                    </div>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-brand-900/20 border border-brand-500/20 rounded-xl p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2 text-brand-400">
                    <Sparkles size={16} />
                    <span className="text-sm font-bold uppercase tracking-wide">Analysis Complete</span>
                  </div>
                  {analysis?.name && (
                    <span className="text-xs text-brand-200 bg-brand-500/20 px-2 py-0.5 rounded">
                      Identified: {analysis.name}
                    </span>
                  )}
                </div>
                
                <div className="space-y-4">
                  <div>
                    <span className="text-slate-500 text-xs uppercase">Detected Niche</span>
                    <p className="text-white font-medium">{analysis?.niche}</p>
                  </div>
                  
                  {/* Semantic Tags */}
                  {analysis?.semanticTags && analysis.semanticTags.length > 0 && (
                     <div>
                        <span className="text-slate-500 text-xs uppercase block mb-1">Semantic Tags</span>
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
                    <span className="text-slate-500 text-xs uppercase">Quality Score</span>
                    <div className="px-2 py-0.5 bg-brand-500 text-white text-xs font-bold rounded-full">
                      {analysis?.qualityScore}/100
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-center mb-4">
                  <p className="text-sm text-slate-400">Analysis confirmed. Ready to add to your portfolio?</p>
              </div>

              <div className="flex space-x-3 pb-2">
                 <button
                  onClick={() => setStep(1)}
                  className="flex-1 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white py-3 rounded-xl font-medium transition-colors"
                >
                  Edit Input
                </button>
                <button
                  onClick={handleConfirm}
                  className="flex-[2] bg-green-600 hover:bg-green-500 text-white py-3 rounded-xl font-medium transition-colors shadow-lg shadow-green-900/20"
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