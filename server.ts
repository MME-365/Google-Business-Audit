import express from "express";
import path from "path";
import cors from "cors";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

const PORT = 3000;

async function startServer() {
  const app = express();
  app.use(express.json());
  app.use(cors());

  // Allow embedding in any domain for lead magnet persistence
  app.use((req, res, next) => {
    res.setHeader("Content-Security-Policy", "frame-ancestors *;");
    res.removeHeader("X-Frame-Options");
    next();
  });

  // Initialize GenAI
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
      console.warn("GEMINI_API_KEY is not set. AI features will fail.");
  }
  
  const ai = new GoogleGenAI({ 
      apiKey,
      httpOptions: {
          headers: {
              'User-Agent': 'aistudio-build',
          }
      }
  });

  const auditResponseSchema = {
    type: Type.OBJECT,
    properties: {
      overallScore: {
        type: Type.INTEGER,
        description: "A score from 1 to 100 representing the overall health of the Google Business Profile."
      },
      auditBreakdown: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            category: { type: Type.STRING, description: "The category being audited (e.g., 'Profile Completeness', 'Review Management')." },
            score: { type: Type.INTEGER, description: "Score for this category (1-100)." },
            comment: { type: Type.STRING, description: "A brief comment on this category's performance." }
          },
          required: ['category', 'score', 'comment']
        }
      },
      recommendations: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING, description: "A short, catchy title for the recommendation." },
            description: { type: Type.STRING, description: "A detailed explanation of the suggested improvement." }
          },
          required: ['title', 'description']
        }
      }
    },
    required: ['overallScore', 'auditBreakdown', 'recommendations']
  };

  const regionalLeadsSchema = {
    type: Type.OBJECT,
    properties: {
      leads: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            businessName: { type: Type.STRING },
            location: { type: Type.STRING, description: "Local address or neighborhood and city" },
            niche: { type: Type.STRING },
            phoneNumber: { type: Type.STRING },
            website: { type: Type.STRING },
            rating: { type: Type.NUMBER, description: "Rating from 1.0 to 5.0" },
            reviewCount: { type: Type.INTEGER },
            googleMapsStatus: { type: Type.STRING, description: "Brief status like 'Weak Review Velocity' or 'Missing Website Link'" },
            opportunityScore: { type: Type.INTEGER, description: "Score from 1 to 100 on how high the agency opportunity is" },
            auditPitchAngle: { type: Type.STRING, description: "1-sentence pitch angle why auditing this business is an easy retainer win" }
          },
          required: ['businessName', 'location', 'niche', 'phoneNumber', 'website', 'rating', 'reviewCount', 'googleMapsStatus', 'opportunityScore', 'auditPitchAngle']
        }
      }
    },
    required: ['leads']
  };

  // API Route: Audit
  app.post("/api/audit", async (req, res) => {
    const { businessName, location, phoneNumber, website, niche } = req.body;
    
    if (!businessName || !location) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    const prompt = `
      Act as a world-class Google Business Profile (GBP) optimization expert.
      Generate a plausible, highly detailed, and hypothetical audit for a business with the following details:
      - Business Name: "${businessName}"
      - Location: "${location}"
      - Phone Number: "${phoneNumber || 'Not provided'}"
      - Website: "${website || 'Not provided'}"
      - Category / Niche: "${niche || 'Inferred from business name'}"

      Infer the business's industry from its name and niche. Your audit MUST reflect the nuances of that specific industry.

      Perform a detailed audit covering: Profile Completeness, Review Strategy, Photo Strategy, Post Frequency, Q&A Engagement, and Local SEO Signals.
    `;

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: auditResponseSchema,
        },
      });

      const result = JSON.parse(response.text || "{}");
      res.json(result);
    } catch (error) {
      console.error("Audit error:", error);
      res.status(500).json({ error: "Failed to generate audit." });
    }
  });

  // API Route: Fresh Regional Leads Finder
  app.post("/api/find-regional-leads", async (req, res) => {
    const { niche, region } = req.body;
    
    if (!niche || !region) {
      return res.status(400).json({ error: "Niche and region are required." });
    }

    const prompt = `
      You are an elite regional B2B prospector and Google Business Profile (GBP) scout.
      Identify 6 to 8 realistic, active regional small-to-medium businesses for:
      - Niche / Industry: "${niche}"
      - Geographic Region / Market: "${region}"

      For each business:
      1. Provide a realistic business name tailored to "${region}".
      2. Provide a realistic street or neighborhood location within "${region}".
      3. Provide a realistic local phone number matching the area code of "${region}".
      4. Provide an estimated website URL or specify "Missing / Not Listed".
      5. Provide an estimated Google Maps star rating (3.7 - 4.7) and review count (7 - 65) displaying realistic ranking gaps compared to the top 3 Google 3-Pack leaders.
      6. Provide a specific GBP diagnostic status (e.g., "Missing Website Link on Maps", "Low Review Velocity (1 rev/3 mo)", "Inconsistent NAP vs Yelp", "No GBP Updates or Photos in 6+ months").
      7. Provide an opportunity score (65-98) and a crisp 1-sentence agency pitch angle.
    `;

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: regionalLeadsSchema,
        },
      });

      const result = JSON.parse(response.text || "{}");
      res.json(result);
    } catch (error) {
      console.error("Regional leads search error:", error);
      res.status(500).json({ error: "Failed to generate regional leads." });
    }
  });

  // API Route: Email Summary
  app.post("/api/email-summary", async (req, res) => {
    const { result, businessName } = req.body;
    
    const prompt = `
      Summarize the Google Business Profile audit for "${businessName}" into a concise, professional email body.
      Tone: Informative and encouraging.
      Format: Plain text with clear headings and bullet points. No markdown.
      
      Audit Data:
      - Overall Score: ${result.overallScore}/100
      - Breakdown: ${JSON.stringify(result.auditBreakdown)}
      - Recommendations: ${JSON.stringify(result.recommendations)}
    `;

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
      });
      res.json({ text: response.text });
    } catch (error) {
      console.error("Email summary error:", error);
      res.status(500).json({ error: "Failed to generate email summary." });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
