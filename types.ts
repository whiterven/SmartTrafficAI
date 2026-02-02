export enum UserRole {
  OWNER = 'OWNER',
  GENERATOR = 'GENERATOR' // The traffic generator/visitor
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  points: number; // Legacy score
  // Traffic Engine Economy
  credits: number; // Currency: Earned by visiting, Spent by getting visits
  streakDays: number;
  lastActiveDate: string; // ISO Date for streak tracking
  referralCode: string;
  referredBy?: string;
  
  // Reward System
  isTopContributor?: boolean;
  pointMultiplier?: number; // e.g., 1.0 or 1.5
  lastWeeklyUpdate?: number;
  // For Generators:
  interests?: string[]; 
  dislikes?: string[];
  
  // Advanced Profiling
  preferredContentTypes?: string[];
  browsingStyle?: string;
  avgEngagementTime?: number;
  favoriteNiches?: string[];

  // For Owners:
  organization?: string;
}

export interface Website {
  id: string;
  ownerId: string;
  url: string;
  name: string;
  description: string;
  // AI Generated fields
  niche: string;
  qualityScore: number; // 0-100
  targetAudienceProfile: string;
  aiAnalysisSummary: string;
  
  // Detailed Analysis Fields
  audienceAge?: string;
  audienceGender?: string;
  audienceInterests?: string[];
  audienceIntent?: string;
  semanticTags?: string[];
  engagementPrediction?: "Low" | "Medium" | "High";

  // New Enhanced Fields
  contentTypes: string[]; // e.g. "Blog", "Landing Page"
  detectedCTAs: string[]; // e.g. "Sign Up Button", "Newsletter Form"
  metaDescription?: string;
  metaKeywords?: string[];
  preferredImageSize?: '1K' | '2K' | '4K'; // User preference for image generation
  
  createdAt: string;
  totalVisits: number;
  averageRating: number;
  ctr?: number; // Click Through Rate percentage
}

export interface Rating {
  id: string;
  userId: string;
  websiteId: string;
  score: number; // 1-5
  feedback: string;
  dwellTimeSeconds: number;
  timestamp: string;
}

export interface MatchResult {
  website: Website;
  matchScore: number; // 0-100
  reasoning: string;
  predictedEngagementTime?: number;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

// --- TRAFFIC CAMPAIGN TYPES ---

export interface Campaign {
  id: string;
  websiteId: string;
  status: 'running' | 'completed' | 'failed';
  timestamp: number;
  logs: CampaignStep[];
  assets: CampaignAsset[];
  totalBacklinks: number;
  totalPosts: number;
  estimatedTraffic: number;
}

export interface CampaignStep {
  id: string;
  action: string; // e.g., "Creating Backlink"
  detail: string; // e.g., "Submitted to TechCrunch Directory"
  timestamp: number;
  status: 'pending' | 'success' | 'error';
}

export interface CampaignAsset {
  id: string;
  type: 'article' | 'social_post' | 'backlink' | 'video_script' | 'directory_submission' | 'video_content' | 'search_submission' | 'local_listing';
  platform: string;
  content: string; // The generated text/script
  url?: string; // The simulated live URL or external link
  mediaUrl?: string; // Base64 image or video Blob URL
  mediaType?: 'image' | 'video';
  createdAt: number;
}