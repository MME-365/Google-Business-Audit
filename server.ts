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

  // API Route: Audit
  app.post("/api/audit", async (req, res) => {
    const { businessName, location, phoneNumber } = req.body;
    
    if (!businessName || !location) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    const prompt = `
      Act as a world-class Google Business Profile (GBP) optimization expert.
      Generate a plausible, highly detailed, and hypothetical audit for a business with the following details:
      - Business Name: "${businessName}"
      - Location: "${location}"
      - Phone Number: "${phoneNumber || 'Not provided'}"

      Infer the business's industry from its name. Your audit MUST reflect the nuances of that specific industry.

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

      const result = JSON.parse(response.text);
      res.json(result);
    } catch (error) {
      console.error("Audit error:", error);
      res.status(500).json({ error: "Failed to generate audit." });
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
