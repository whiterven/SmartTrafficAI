import { User, Website, Rating, UserRole, Campaign, CampaignAsset } from '../types';

// Simulation of a database using LocalStorage
// In production, replace this with Supabase calls.

const STORAGE_KEYS = {
  USERS: 'st_users',
  WEBSITES: 'st_websites',
  RATINGS: 'st_ratings',
  CURRENT_USER: 'st_current_user',
  SYSTEM_LAST_UPDATE: 'st_sys_last_update',
  CAMPAIGNS: 'st_campaigns',
};

const getItems = <T>(key: string): T[] => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
};

const setItems = <T>(key: string, items: T[]) => {
  localStorage.setItem(key, JSON.stringify(items));
};

export const dbService = {
  // Auth
  login: async (email: string): Promise<User | null> => {
    await new Promise(r => setTimeout(r, 500));
    dbService.checkAndRunWeeklyRewards();
    const users = getItems<User>(STORAGE_KEYS.USERS);
    const user = users.find(u => u.email === email);
    if (user) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
      return user;
    }
    return null;
  },

  register: async (userInfo: Omit<User, 'credits' | 'streakDays' | 'lastActiveDate' | 'referralCode'>): Promise<User> => {
    await new Promise(r => setTimeout(r, 500));
    const users = getItems<User>(STORAGE_KEYS.USERS);
    if (users.find(u => u.email === userInfo.email)) {
      throw new Error("User already exists");
    }
    const user: User = {
      ...userInfo,
      pointMultiplier: 1.0,
      isTopContributor: false,
      credits: 50,
      streakDays: 0,
      lastActiveDate: new Date().toISOString(),
      referralCode: Math.random().toString(36).substring(2, 8).toUpperCase(),
    };
    users.push(user);
    setItems(STORAGE_KEYS.USERS, users);
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    return user;
  },

  getCurrentUser: (): User | null => {
    const data = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    return data ? JSON.parse(data) : null;
  },

  logout: () => {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  },

  checkAndRunWeeklyRewards: () => {
    const lastUpdateStr = localStorage.getItem(STORAGE_KEYS.SYSTEM_LAST_UPDATE);
    const now = Date.now();
    const ONE_WEEK = 7 * 24 * 60 * 60 * 1000;
    if (!lastUpdateStr || (now - parseInt(lastUpdateStr) > ONE_WEEK)) {
      const users = getItems<User>(STORAGE_KEYS.USERS);
      users.sort((a, b) => b.points - a.points);
      users.forEach((user, index) => {
        if (user.role === UserRole.GENERATOR) {
          if (index < 10 && user.points > 0) {
            user.isTopContributor = true;
            user.pointMultiplier = 1.5;
          } else {
            user.isTopContributor = false;
            user.pointMultiplier = 1.0;
          }
        }
      });
      setItems(STORAGE_KEYS.USERS, users);
      localStorage.setItem(STORAGE_KEYS.SYSTEM_LAST_UPDATE, now.toString());
      const currentUser = dbService.getCurrentUser();
      if (currentUser) {
        const updatedCurrent = users.find(u => u.id === currentUser.id);
        if (updatedCurrent) {
          localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(updatedCurrent));
        }
      }
    }
  },

  // Websites
  addWebsite: async (site: Website): Promise<Website> => {
    await new Promise(r => setTimeout(r, 800));
    const sites = getItems<Website>(STORAGE_KEYS.WEBSITES);
    sites.push(site);
    setItems(STORAGE_KEYS.WEBSITES, sites);
    return site;
  },

  getWebsitesByOwner: (ownerId: string): Website[] => {
    const sites = getItems<Website>(STORAGE_KEYS.WEBSITES);
    return sites.filter(s => s.ownerId === ownerId);
  },

  getAllWebsites: (): Website[] => {
    return getItems<Website>(STORAGE_KEYS.WEBSITES);
  },

  getSiteById: (id: string): Website | undefined => {
    const sites = getItems<Website>(STORAGE_KEYS.WEBSITES);
    return sites.find(s => s.id === id);
  },

  updateWebsiteStats: (siteId: string, rating: number) => {
    const sites = getItems<Website>(STORAGE_KEYS.WEBSITES);
    const index = sites.findIndex(s => s.id === siteId);
    if (index !== -1) {
      const site = sites[index];
      const totalScore = site.averageRating * site.totalVisits + rating;
      site.totalVisits += 1;
      site.averageRating = totalScore / site.totalVisits;
      sites[index] = site;
      setItems(STORAGE_KEYS.WEBSITES, sites);
      
      const users = getItems<User>(STORAGE_KEYS.USERS);
      const ownerIdx = users.findIndex(u => u.id === site.ownerId);
      if (ownerIdx !== -1) {
        users[ownerIdx].credits = Math.max(0, (users[ownerIdx].credits || 0) - 1);
        setItems(STORAGE_KEYS.USERS, users);
      }
    }
  },

  getRatingsByUser: (userId: string): Rating[] => {
    const ratings = getItems<Rating>(STORAGE_KEYS.RATINGS);
    return ratings.filter(r => r.userId === userId);
  },

  getRatingsBySite: (websiteId: string): Rating[] => {
    const ratings = getItems<Rating>(STORAGE_KEYS.RATINGS);
    return ratings.filter(r => r.websiteId === websiteId).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  },

  addRating: async (rating: Rating): Promise<Rating> => {
    await new Promise(r => setTimeout(r, 600));
    const ratings = getItems<Rating>(STORAGE_KEYS.RATINGS);
    ratings.push(rating);
    setItems(STORAGE_KEYS.RATINGS, ratings);
    const users = getItems<User>(STORAGE_KEYS.USERS);
    const userIndex = users.findIndex(u => u.id === rating.userId);
    if (userIndex !== -1) {
      const user = users[userIndex];
      const lastActive = new Date(user.lastActiveDate || 0);
      const today = new Date();
      const isSameDay = lastActive.getDate() === today.getDate() && lastActive.getMonth() === today.getMonth() && lastActive.getFullYear() === today.getFullYear();
      const isYesterday = (today.getTime() - lastActive.getTime()) < (48 * 60 * 60 * 1000) && !isSameDay;
      if (isYesterday) {
        user.streakDays = (user.streakDays || 0) + 1;
      } else if (!isSameDay) {
        user.streakDays = 1;
      }
      user.lastActiveDate = new Date().toISOString();
      const baseCredits = 5;
      const streakBonus = Math.min(Math.floor((user.streakDays || 0) / 5), 5);
      const earnedCredits = baseCredits + streakBonus;
      user.credits = (user.credits || 0) + earnedCredits;
      const multiplier = user.pointMultiplier || 1.0;
      user.points += Math.round(10 * multiplier);
      setItems(STORAGE_KEYS.USERS, users);
      const currentUser = dbService.getCurrentUser();
      if (currentUser && currentUser.id === rating.userId) {
        currentUser.credits = user.credits;
        currentUser.streakDays = user.streakDays;
        currentUser.points = user.points;
        localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(currentUser));
      }
    }
    dbService.updateWebsiteStats(rating.websiteId, rating.score);
    return rating;
  },

  getLeaderboard: (): User[] => {
    const users = getItems<User>(STORAGE_KEYS.USERS);
    return users.filter(u => u.role === UserRole.GENERATOR).sort((a, b) => b.points - a.points).slice(0, 10);
  },

  // --- CAMPAIGN METHODS ---
  saveCampaign: (campaign: Campaign) => {
    const campaigns = getItems<Campaign>(STORAGE_KEYS.CAMPAIGNS);
    // Overwrite existing if present (update)
    const idx = campaigns.findIndex(c => c.id === campaign.id);
    if (idx !== -1) {
      campaigns[idx] = campaign;
    } else {
      campaigns.push(campaign);
    }
    setItems(STORAGE_KEYS.CAMPAIGNS, campaigns);
  },

  getCampaignByWebsite: (websiteId: string): Campaign | undefined => {
    const campaigns = getItems<Campaign>(STORAGE_KEYS.CAMPAIGNS);
    // Return latest
    return campaigns.filter(c => c.websiteId === websiteId).sort((a, b) => b.timestamp - a.timestamp)[0];
  }
};