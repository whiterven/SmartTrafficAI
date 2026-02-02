import { GoogleGenAI, Type, FunctionDeclaration, Tool } from "@google/genai";
import { User, Website, MatchResult, CampaignAsset, CampaignStep } from '../types';

const apiKey = process.env.API_KEY || ''; 
const ai = new GoogleGenAI({ apiKey });

// Constants for matching algorithm
const MATCH_THRESHOLD = 60; // Minimum score to show a site
const MAX_DAILY_MATCHES = 50; // Max sites per user per day

// --- TRAFFIC CAMPAIGN TOOLS ---
const CAMPAIGN_TOOLS: Tool[] = [
  {
    functionDeclarations: [
      {
        name: "submit_to_directory",
        description: "Submit website to a high-DA web directory",
        parameters: {
          type: Type.OBJECT,
          properties: {
            directoryUrl: { type: Type.STRING },
            category: { type: Type.STRING },
            description: { type: Type.STRING }
          },
          required: ["directoryUrl", "category", "description"]
        }
      },
      {
        name: "create_web2_post",
        description: "Create a blog post on platforms like Medium, Blogger, or WordPress",
        parameters: {
          type: Type.OBJECT,
          properties: {
            platform: { type: Type.STRING },
            title: { type: Type.STRING },
            content: { type: Type.STRING },
            backlinkAnchor: { type: Type.STRING }
          },
          required: ["platform", "title", "content", "backlinkAnchor"]
        }
      },
      {
        name: "post_to_social_media",
        description: "Create and schedule a social media post",
        parameters: {
          type: Type.OBJECT,
          properties: {
            platform: { type: Type.STRING },
            message: { type: Type.STRING },
            hashtags: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["platform", "message", "hashtags"]
        }
      },
      {
        name: "generate_seo_article",
        description: "Generate a full SEO article for content marketing",
        parameters: {
          type: Type.OBJECT,
          properties: {
            topic: { type: Type.STRING },
            targetKeywords: { type: Type.ARRAY, items: { type: Type.STRING } },
            outline: { type: Type.STRING }
          },
          required: ["topic", "targetKeywords"]
        }
      },
      {
        name: "submit_press_release",
        description: "Submit a press release to news aggregators",
        parameters: {
          type: Type.OBJECT,
          properties: {
            headline: { type: Type.STRING },
            body: { type: Type.STRING },
            outlet: { type: Type.STRING }
          },
          required: ["headline", "body", "outlet"]
        }
      },
      {
        name: "submit_to_search_engine",
        description: "Submit website URL to search engines for indexing",
        parameters: {
          type: Type.OBJECT,
          properties: {
            engine: { type: Type.STRING },
            sitemapUrl: { type: Type.STRING }
          },
          required: ["engine", "sitemapUrl"]
        }
      },
      {
        name: "create_video_content",
        description: "Generate a promotional video script and metadata",
        parameters: {
          type: Type.OBJECT,
          properties: {
            platform: { type: Type.STRING },
            title: { type: Type.STRING },
            script: { type: Type.STRING }
          },
          required: ["platform", "title", "script"]
        }
      },
      {
        name: "create_local_listing",
        description: "Create a business listing on map services",
        parameters: {
          type: Type.OBJECT,
          properties: {
            service: { type: Type.STRING },
            businessName: { type: Type.STRING },
            category: { type: Type.STRING }
          },
          required: ["service", "businessName", "category"]
        }
      }
    ]
  }
];

export const geminiService = {
  /**
   * DEEP WEBSITE ANALYSIS
   */
  analyzeWebsite: async (url: string, ownerDescription: string, targetAudience: string): Promise<Partial<Website>> => {
    if (!apiKey) throw new Error("Gemini API Key missing");

    const prompt = `
      CRITICAL MISSION: Analyze this website to enable perfect traffic matching.
      
      Website URL: ${url}
      Owner's Description: ${ownerDescription}
      Target Audience Wanted: ${targetAudience}

      INSTRUCTIONS:
      1. Use Google Search to fetch REAL, CURRENT information about this website
      2. Extract the official website title/brand name
      3. Identify PRIMARY niche (e.g., "Fashion Ecommerce", "Tech Blog", "SaaS Tool")
      4. Assign Quality Score (0-100) based on content depth, UX signals, and professional design.
      5. Create detailed Target Audience DNA (Age, Gender, Interests, Intent).
      6. Identify ALL content types present (Blog, Product Pages, Videos, Tools, Forum, etc.)
      7. Extract conversion elements (Sign Up forms, Buy buttons, Newsletter, Contact, etc.)
      8. List 10-15 SEMANTIC TAGS that describe this site (for matching algorithm)
      9. Extract meta description and keywords
      10. Assign ENGAGEMENT PREDICTION (how long average user stays: Low/Medium/High)

      RETURN STRUCTURED JSON ONLY.
    `;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: prompt,
        config: {
          tools: [{ googleSearch: {} }], // Critical for real data
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING, description: "Official website title" },
              niche: { type: Type.STRING, description: "Primary category" },
              qualityScore: { type: Type.INTEGER, description: "0-100 quality rating" },
              targetAudienceProfile: { type: Type.STRING, description: "Detailed audience DNA summary" },
              audienceAge: { type: Type.STRING, description: "Age range like 18-35" },
              audienceGender: { type: Type.STRING, description: "Male/Female/Neutral" },
              audienceInterests: { type: Type.ARRAY, items: { type: Type.STRING }, description: "5-10 specific interests" },
              audienceIntent: { type: Type.STRING, description: "Primary user intent" },
              contentTypes: { type: Type.ARRAY, items: { type: Type.STRING }, description: "All content types found" },
              detectedCTAs: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Conversion elements" },
              semanticTags: { type: Type.ARRAY, items: { type: Type.STRING }, description: "10-15 tags for matching" },
              metaDescription: { type: Type.STRING },
              metaKeywords: { type: Type.ARRAY, items: { type: Type.STRING } },
              engagementPrediction: { type: Type.STRING, enum: ["Low", "Medium", "High"], description: "Expected user engagement level" },
              aiAnalysisSummary: { type: Type.STRING, description: "2-3 sentence summary" }
            },
            required: ["name", "niche", "qualityScore", "targetAudienceProfile", "audienceInterests", "contentTypes", "semanticTags", "engagementPrediction", "aiAnalysisSummary"]
          }
        }
      });

      const text = response.text;
      if (!text) throw new Error("Empty response from Gemini");
      return JSON.parse(text);

    } catch (error) {
      console.error("❌ Website Analysis Failed:", error);
      return {
        name: new URL(url).hostname,
        niche: "Uncategorized",
        qualityScore: 50,
        targetAudienceProfile: ownerDescription || "General audience",
        audienceInterests: ["general"],
        contentTypes: ["Website"],
        semanticTags: ["website"],
        engagementPrediction: "Medium",
        aiAnalysisSummary: `Analysis unavailable. Owner description: ${ownerDescription}`,
        detectedCTAs: [],
        metaDescription: "",
        metaKeywords: []
      };
    }
  },

  /**
   * AUTONOMOUS TRAFFIC CAMPAIGN AGENT
   * Executes tools in a loop to generate traffic.
   */
  runTrafficCampaign: async (
    website: Website, 
    onStep: (step: CampaignStep, asset?: CampaignAsset) => void
  ): Promise<void> => {
    if (!apiKey) return;

    const systemPrompt = `
      You are the "SmartTraffic Autonomous Agent".
      Your goal is to generating REAL traffic for the website: ${website.url} (${website.name}).
      Niche: ${website.niche}
      Target Audience: ${website.targetAudienceProfile}

      MISSION: Execute a massive visibility campaign.
      
      REQUIRED ACTIONS (Execute at least 7 distinct actions):
      1. Submit to at least 1 high-quality directory.
      2. Create 2 distinct social media posts (Twitter, LinkedIn).
      3. Write 1 Web 2.0 blog post (Medium/Blogger).
      4. Generate 1 SEO Article outline.
      5. Issue 1 Press Release draft.
      6. Submit URL to at least 1 major Search Engine.
      7. Create a Short Video Script (TikTok/Shorts) to promote the site.

      STRATEGY:
      - Customize content for the specific audience.
      - Use persuasive language.
      - Ensure diversity in platforms (Text, Video, Social, Search).

      Call the provided tools to perform these actions.
      After calling a tool, I will confirm execution.
      When you have completed at least 7 actions, output "CAMPAIGN_COMPLETE".
    `;

    // Initialize chat session with tools
    const chat = ai.chats.create({
      model: 'gemini-3-pro-preview',
      history: [
        { role: 'user', parts: [{ text: systemPrompt }] }
      ],
      config: {
        tools: CAMPAIGN_TOOLS,
        temperature: 0.7, // Creativity for content generation
      }
    });

    let keepGoing = true;
    let turnCount = 0;
    const MAX_TURNS = 12; // Increased safety limit for more actions

    // Initial Trigger
    let currentMessage = "Start the campaign. Execute the first action.";

    while (keepGoing && turnCount < MAX_TURNS) {
      turnCount++;
      try {
        const response = await chat.sendMessage({ message: currentMessage });
        
        // Check for function calls
        const functionCalls = response.functionCalls;

        if (functionCalls && functionCalls.length > 0) {
          const responseParts = [];

          for (const call of functionCalls) {
            console.log(`🤖 Agent calling tool: ${call.name}`);
            
            // SIMULATE EXECUTION & NOTIFY UI
            const asset = await executeSimulatedTool(call, website);
            
            // Create Log Step
            const step: CampaignStep = {
              id: Math.random().toString(),
              action: formatActionName(call.name),
              detail: getDetailFromCall(call),
              timestamp: Date.now(),
              status: 'success'
            };

            onStep(step, asset); // Update UI
            
            // Prepare response for model
            responseParts.push({
              functionResponse: {
                name: call.name,
                response: { result: "Success: Asset created and scheduled." },
                id: call.id
              }
            });
          }

          // Send tool output back to model
          // Using parts directly for function response
          const toolResponse = await chat.sendMessage({ message: responseParts as any });
          
          // Check if model is done after tool response
          if (toolResponse.text?.includes("CAMPAIGN_COMPLETE")) {
            keepGoing = false;
          }
          currentMessage = "Continue with next action or finish if done.";

        } else {
            // No function call, model might be talking or done
            if (response.text?.includes("CAMPAIGN_COMPLETE")) {
                keepGoing = false;
            } else {
                // Force it to do work if it's just chatting
                currentMessage = "Please execute the next traffic generation tool.";
            }
        }

      } catch (error) {
        console.error("Campaign Loop Error:", error);
        keepGoing = false;
      }
    }
  },

  /**
   * INTELLIGENT MATCHING (Existing)
   */
  findMatches: async (
    user: User, 
    websites: Website[], 
    userHistory: string[] = [], 
    creditMultiplier: number = 1
  ): Promise<MatchResult[]> => {
    // ... (Existing logic kept for feed functionality)
    if (!apiKey || websites.length === 0) return [];
    const unvisitedSites = websites.filter(w => !userHistory.includes(w.id));
    if (unvisitedSites.length === 0) return [];

    const siteList = unvisitedSites.slice(0, 100).map(w => ({
      id: w.id, url: w.url, name: w.name, niche: w.niche, quality: w.qualityScore,
      audience: w.targetAudienceProfile, interests: w.audienceInterests, tags: w.semanticTags
    }));

    const prompt = `
      Match user to websites.
      User Interests: ${user.interests?.join(', ')}
      Sites: ${JSON.stringify(siteList)}
      Return TOP ${Math.min(MAX_DAILY_MATCHES, siteList.length)} matches as JSON array: [{websiteId, matchScore, reasoning}].
    `;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
             type: Type.ARRAY,
             items: {
                 type: Type.OBJECT,
                 properties: {
                     websiteId: { type: Type.STRING },
                     matchScore: { type: Type.INTEGER },
                     reasoning: { type: Type.STRING },
                     predictedEngagementTime: { type: Type.INTEGER }
                 }
             }
          }
        }
      });
      const rawMatches = JSON.parse(response.text || '[]');
      return rawMatches.map((m: any) => ({
        website: websites.find(w => w.id === m.websiteId),
        matchScore: Math.min(100, Math.floor(m.matchScore * creditMultiplier)),
        reasoning: m.reasoning,
        predictedEngagementTime: m.predictedEngagementTime || 30
      })).filter((m: any) => m.website);
    } catch (e) { return []; }
  },

  /**
   * CHAT ASSISTANT
   */
  sendMessage: async (
    history: Array<{ role: string; parts: Array<{ text: string }> }>,
    message: string
  ): Promise<string> => {
    try {
      const chat = ai.chats.create({
        model: 'gemini-3-flash-preview',
        history: history
      });
      const result = await chat.sendMessage({ message });
      return result.text || "I'm processing that...";
    } catch (error) {
      return "Service unavailable.";
    }
  }
};

// --- HELPER FUNCTIONS FOR CAMPAIGN ---

function formatActionName(toolName: string): string {
  const map: Record<string, string> = {
    "submit_to_directory": "Directory Submission",
    "create_web2_post": "Web 2.0 Blog Post",
    "post_to_social_media": "Social Media Blast",
    "generate_seo_article": "SEO Content Gen",
    "submit_press_release": "PR Distribution",
    "submit_to_search_engine": "Search Indexing",
    "create_video_content": "Video Creation",
    "create_local_listing": "Local Map Listing"
  };
  return map[toolName] || "Traffic Action";
}

function getDetailFromCall(call: any): string {
  const args = call.args;
  if (call.name === 'submit_to_directory') return `Submitting to ${args.directoryUrl || 'Niche Directory'}`;
  if (call.name === 'post_to_social_media') return `Posting to ${args.platform}`;
  if (call.name === 'create_web2_post') return `Publishing on ${args.platform}`;
  if (call.name === 'generate_seo_article') return `Drafting: ${args.topic}`;
  if (call.name === 'submit_press_release') return `Outlet: ${args.outlet}`;
  if (call.name === 'submit_to_search_engine') return `Pinging ${args.engine}`;
  if (call.name === 'create_video_content') return `Scripting for ${args.platform}`;
  if (call.name === 'create_local_listing') return `Listing on ${args.service}`;
  return "Processing...";
}

// Simulates the external API calls and returns the "Created Asset"
async function executeSimulatedTool(call: any, website: Website): Promise<CampaignAsset> {
  const args = call.args;
  await new Promise(r => setTimeout(r, 1200)); // Simulate API latency

  let asset: CampaignAsset = {
    id: Math.random().toString(),
    type: 'article',
    platform: 'web',
    content: '',
    createdAt: Date.now()
  };

  switch (call.name) {
    case 'post_to_social_media':
      asset = {
        id: Math.random().toString(),
        type: 'social_post',
        platform: args.platform,
        content: `${args.message}\n\nTags: ${args.hashtags?.join(' ')}`,
        url: `https://${args.platform.toLowerCase()}.com/post/${Math.random().toString(36).substring(7)}`,
        createdAt: Date.now()
      };
      break;
    case 'submit_to_directory':
      asset = {
        id: Math.random().toString(),
        type: 'directory_submission',
        platform: 'Directory',
        content: `Submitted to: ${args.directoryUrl}\nCategory: ${args.category}\nDesc: ${args.description}`,
        url: `${args.directoryUrl}/listing/${website.name.replace(/\s/g, '').toLowerCase()}`,
        createdAt: Date.now()
      };
      break;
    case 'create_web2_post':
      asset = {
        id: Math.random().toString(),
        type: 'article',
        platform: args.platform,
        content: `TITLE: ${args.title}\n\n${args.content.substring(0, 200)}...\n\n[Link to ${website.url}]`,
        url: `https://${args.platform.toLowerCase()}.com/${website.name.toLowerCase()}-update`,
        createdAt: Date.now()
      };
      break;
    case 'generate_seo_article':
      asset = {
        id: Math.random().toString(),
        type: 'article',
        platform: 'Internal Blog',
        content: `TOPIC: ${args.topic}\nKEYWORDS: ${args.targetKeywords?.join(', ')}\n\nOUTLINE:\n${args.outline}`,
        createdAt: Date.now()
      };
      break;
    case 'submit_press_release':
      asset = {
        id: Math.random().toString(),
        type: 'article',
        platform: args.outlet,
        content: `HEADLINE: ${args.headline}\n\n${args.body.substring(0, 150)}...`,
        url: `https://pr-newswire.com/${Date.now()}`,
        createdAt: Date.now()
      };
      break;
    case 'submit_to_search_engine':
      asset = {
        id: Math.random().toString(),
        type: 'search_submission',
        platform: args.engine,
        content: `Submitted sitemap: ${args.sitemapUrl}`,
        url: `https://${args.engine.toLowerCase()}.com/webmasters/status`,
        createdAt: Date.now()
      };
      break;
    case 'create_video_content':
      asset = {
        id: Math.random().toString(),
        type: 'video_content',
        platform: args.platform,
        content: `TITLE: ${args.title}\n\nSCRIPT:\n${args.script.substring(0, 150)}...`,
        url: `https://${args.platform.toLowerCase()}.com/shorts/${Math.random().toString(36).substring(7)}`,
        createdAt: Date.now()
      };
      break;
    case 'create_local_listing':
      asset = {
        id: Math.random().toString(),
        type: 'local_listing',
        platform: args.service,
        content: `Business: ${args.businessName}\nCategory: ${args.category}`,
        url: `https://${args.service.toLowerCase()}.com/maps?q=${encodeURIComponent(args.businessName)}`,
        createdAt: Date.now()
      };
      break;
  }

  return asset;
}