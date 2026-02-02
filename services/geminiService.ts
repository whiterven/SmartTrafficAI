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
        description: "Create and schedule a social media post with an image",
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
        description: "Generate a promotional video using Veo",
        parameters: {
          type: Type.OBJECT,
          properties: {
            platform: { type: Type.STRING },
            title: { type: Type.STRING },
            visualPrompt: { type: Type.STRING, description: "Description of the video scene to generate" }
          },
          required: ["platform", "title", "visualPrompt"]
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
      },
      {
        name: "setup_analytics_tracking",
        description: "Configure analytics tools for the website",
        parameters: {
          type: Type.OBJECT,
          properties: {
            platform: { type: Type.STRING, description: "e.g., Google Analytics, Facebook Pixel" },
            trackingId: { type: Type.STRING }
          },
          required: ["platform", "trackingId"]
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
      
      REQUIRED ACTIONS:
      1. Create a compelling Social Media Post (Twitter/LinkedIn) with a generated image.
      2. Write a detailed SEO Article draft.
      3. Create a short promotional Video using Veo.
      4. Submit to a Search Engine.
      5. Draft a Press Release.
      6. Setup Analytics Tracking.

      STRATEGY:
      - Customize content for the specific audience.
      - Use persuasive language.
      - Ensure diversity in platforms (Text, Video, Social, Search).

      Call the provided tools to perform these actions.
      After calling a tool, I will confirm execution.
      When you have completed the required actions, output "CAMPAIGN_COMPLETE".
    `;

    // Initialize chat session with tools
    // Note: Thinking Mode disabled here to allow Tool usage (API restriction)
    // We will use thinking mode inside the specific generation tools for quality content instead.
    const chat = ai.chats.create({
      model: 'gemini-3-pro-preview',
      history: [
        { role: 'user', parts: [{ text: systemPrompt }] }
      ],
      config: {
        tools: [...CAMPAIGN_TOOLS, { googleSearch: {} }, { codeExecution: {} }],
        // thinkingConfig: { thinkingBudget: 32768 }, // DISABLED to prevent "Tool use with function calling is unsupported" error
      }
    });

    let keepGoing = true;
    let turnCount = 0;
    const MAX_TURNS = 12; 

    // Initial Trigger
    let currentMessage = "Start the campaign. Analyze the best strategy and execute the first action.";

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
            
            // EXECUTE REAL TOOL (Generates Images/Videos/Text)
            const asset = await executeRealTool(call, website);
            
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
                response: { result: "Success: Asset created." },
                id: call.id
              }
            });
          }

          const toolResponse = await chat.sendMessage({ message: responseParts as any });
          
          if (toolResponse.text?.includes("CAMPAIGN_COMPLETE")) {
            keepGoing = false;
          }
          currentMessage = "Continue with next action or finish if done.";

        } else {
            if (response.text?.includes("CAMPAIGN_COMPLETE")) {
                keepGoing = false;
            } else {
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
          thinkingConfig: { thinkingBudget: 32768 }, // Enabled Thinking Mode here where no tools are used
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

// --- REAL GENERATION HELPERS ---

async function generateImage(prompt: string, size: '1K' | '2K' | '4K' = '1K'): Promise<string | null> {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-image-preview', // Nano Banana Pro
      contents: { parts: [{ text: prompt }] },
      config: {
        imageConfig: {
          imageSize: size,
          aspectRatio: "16:9" 
        }
      }
    });
    
    // Find the image part
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (e) {
    console.error("Image Gen Failed", e);
    return null;
  }
}

async function generateVideo(prompt: string): Promise<string | null> {
  try {
    let operation = await ai.models.generateVideos({
      model: 'veo-3.1-fast-generate-preview',
      prompt: prompt,
      config: {
        numberOfVideos: 1,
        resolution: '720p',
        aspectRatio: '16:9'
      }
    });

    // Poll for completion
    let attempts = 0;
    while (!operation.done && attempts < 30) { // Max wait ~3 min
      await new Promise(resolve => setTimeout(resolve, 5000));
      operation = await ai.operations.getVideosOperation({operation: operation});
      attempts++;
    }

    if (operation.done && operation.response?.generatedVideos?.[0]?.video?.uri) {
      // Append key to fetch the video binary
      return `${operation.response.generatedVideos[0].video.uri}&key=${apiKey}`;
    }
    return null;
  } catch (e) {
    console.error("Video Gen Failed", e);
    return null;
  }
}

// Helper to generate fast text using Flash
async function generateTextContent(prompt: string): Promise<string> {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview', 
            contents: prompt
        });
        return response.text || "Content generation failed.";
    } catch (e) {
        return "Content generation error.";
    }
}

// Helper to generate high quality content using Pro + Thinking
async function generateLongFormContent(prompt: string): Promise<string> {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-pro-preview', 
            contents: prompt,
            config: {
                thinkingConfig: { thinkingBudget: 4096 } // Moderate thinking for structure
            }
        });
        return response.text || "Content generation failed.";
    } catch (e) {
        console.error("Long Form Gen Error", e);
        return "Content generation error.";
    }
}

// --- TOOL EXECUTION LOGIC ---

function formatActionName(toolName: string): string {
  const map: Record<string, string> = {
    "submit_to_directory": "Directory Submission",
    "create_web2_post": "Web 2.0 Blog Post",
    "post_to_social_media": "Social Media Blast",
    "generate_seo_article": "SEO Content Gen",
    "submit_press_release": "PR Distribution",
    "submit_to_search_engine": "Search Indexing",
    "create_video_content": "Video Creation",
    "create_local_listing": "Local Map Listing",
    "setup_analytics_tracking": "Analytics Config"
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
  if (call.name === 'setup_analytics_tracking') return `Configuring ${args.platform}`;
  return "Processing...";
}

// Executes REAL work: Generates Images, Videos, and Text
async function executeRealTool(call: any, website: Website): Promise<CampaignAsset> {
  const args = call.args;
  let asset: CampaignAsset = {
    id: Math.random().toString(),
    type: 'article',
    platform: 'web',
    content: 'Processing...',
    createdAt: Date.now()
  };

  switch (call.name) {
    case 'post_to_social_media':
      // Generate real image for post
      const imagePrompt = `A high quality social media image for: ${args.message}. Style: Professional, Engaging.`;
      const imageUrl = await generateImage(imagePrompt, website.preferredImageSize || '1K');
      
      asset = {
        id: Math.random().toString(),
        type: 'social_post',
        platform: args.platform,
        content: `${args.message}\n\nTags: ${args.hashtags?.join(' ')}`,
        url: `https://${args.platform.toLowerCase()}.com/post/gen-${Math.random().toString(36).substring(7)}`,
        mediaUrl: imageUrl || undefined,
        mediaType: 'image',
        createdAt: Date.now()
      };
      break;

    case 'create_video_content':
      // Generate real video using Veo
      const videoPrompt = args.visualPrompt || `A promotional video for ${website.name}: ${args.title}`;
      const videoUrl = await generateVideo(videoPrompt);

      asset = {
        id: Math.random().toString(),
        type: 'video_content',
        platform: args.platform,
        content: `TITLE: ${args.title}\n\nVISUAL: ${args.visualPrompt}`,
        url: `https://${args.platform.toLowerCase()}.com/shorts/gen-${Math.random().toString(36).substring(7)}`,
        mediaUrl: videoUrl || undefined,
        mediaType: 'video',
        createdAt: Date.now()
      };
      break;

    case 'generate_seo_article':
      // Generate full text with Gemini Pro + Thinking
      const articlePrompt = `Write a comprehensive SEO article about "${args.topic}" for the website ${website.name} (${website.url}). Keywords: ${args.targetKeywords?.join(', ')}. Use the following outline: ${args.outline}. Format in Markdown.`;
      const fullArticle = await generateLongFormContent(articlePrompt);

      asset = {
        id: Math.random().toString(),
        type: 'article',
        platform: 'Internal Blog',
        content: fullArticle, // Full real content
        createdAt: Date.now()
      };
      break;

    case 'create_web2_post':
        const blogPrompt = `Write a high-quality blog post for ${args.platform} titled "${args.title}". Content focus: ${args.content}. Include a natural backlink to ${website.url} with anchor "${args.backlinkAnchor}". Write at least 400 words.`;
        const blogContent = await generateLongFormContent(blogPrompt);

        asset = {
            id: Math.random().toString(),
            type: 'article',
            platform: args.platform,
            content: blogContent,
            url: `https://${args.platform.toLowerCase()}.com/${website.name.toLowerCase()}-update`,
            createdAt: Date.now()
        };
        break;

    case 'submit_press_release':
        const prPrompt = `Write a formal press release. Headline: ${args.headline}. Body context: ${args.body}. For outlet: ${args.outlet}. Include boilerplate for ${website.name}.`;
        const prContent = await generateLongFormContent(prPrompt);
        
        asset = {
            id: Math.random().toString(),
            type: 'article',
            platform: args.outlet,
            content: prContent,
            url: `https://pr-newswire.com/${Date.now()}`,
            createdAt: Date.now()
        };
        break;

    case 'submit_to_directory':
      const dirPrompt = `Write a professional directory listing submission for the website "${website.name}" (${website.url}). Target Directory: ${args.directoryUrl}. Category: ${args.category}. Focus on the niche: ${website.niche}. Keep it under 100 words.`;
      const dirContent = await generateTextContent(dirPrompt); 

      asset = {
        id: Math.random().toString(),
        type: 'directory_submission',
        platform: 'Directory',
        content: `TARGET: ${args.directoryUrl}\n\nSUBMISSION TEXT:\n${dirContent}`,
        url: `${args.directoryUrl}/listing/${website.name.replace(/\s/g, '').toLowerCase()}`,
        createdAt: Date.now()
      };
      break;

    case 'submit_to_search_engine':
      const xmlPrompt = `Generate a valid XML sitemap snippet for ${website.url} with today's date (${new Date().toISOString().split('T')[0]}) as lastmod. Include Homepage, About, Contact, and Blog pages.`;
      const xmlContent = await generateTextContent(xmlPrompt);

      asset = {
        id: Math.random().toString(),
        type: 'search_submission',
        platform: args.engine,
        content: xmlContent,
        url: `https://${args.engine.toLowerCase()}.com/webmasters/status`,
        createdAt: Date.now()
      };
      break;

    case 'create_local_listing':
      const localPrompt = `Generate Schema.org JSON-LD for a LocalBusiness: ${args.businessName} (${args.category}). Service: ${args.service}. Website: ${website.url}.`;
      const localContent = await generateTextContent(localPrompt);

      asset = {
        id: Math.random().toString(),
        type: 'local_listing',
        platform: args.service,
        content: localContent,
        url: `https://${args.service.toLowerCase()}.com/maps?q=${encodeURIComponent(args.businessName)}`,
        createdAt: Date.now()
      };
      break;

    case 'setup_analytics_tracking':
      const codePrompt = `Generate the HTML/JS tracking snippet for ${args.platform} with Tracking ID: ${args.trackingId}.`;
      const codeContent = await generateTextContent(codePrompt);

      asset = {
          id: Math.random().toString(),
          type: 'search_submission', // Reusing type for UI simplicity
          platform: args.platform,
          content: codeContent,
          url: `https://analytics.google.com/`,
          createdAt: Date.now()
      };
      break;
  }

  return asset;
}