import { GoogleGenAI, Type } from "@google/genai";
import { AuditResult } from '../types';

// This function assumes that process.env.API_KEY is set in the environment.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

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

export const getGbpAudit = async (businessName: string, location: string, phoneNumber: string): Promise<AuditResult> => {
  const prompt = `
    Act as a world-class Google Business Profile (GBP) optimization expert.

    You cannot access the live internet. Generate a plausible, highly detailed, and hypothetical audit for a business with the following details:
    - Business Name: "${businessName}"
    - Location: "${location}"
    - Phone Number: "${phoneNumber}"

    Infer the business's industry from its name (e.g., restaurant, law firm, retail shop). Your audit MUST reflect the nuances of that specific industry.

    Perform a detailed audit covering these key areas:
    1.  **Profile Completeness & Accuracy:** Check for consistent NAP (Name, Address, Phone), filled-out service areas, attributes, and a compelling business description.
    2.  **Review Strategy & Responsiveness:** Evaluate the quantity and quality of reviews. Crucially, analyze the hypothetical responsiveness to both positive and negative reviews. A good response is timely, professional, and personalized. A bad response is generic, slow, or non-existent.
    3.  **Photo & Video Strategy:** Assess the quality (high-resolution, well-lit, professional) and quantity of photos and videos. For a restaurant, this would mean appetizing food photos; for a law firm, professional headshots and office photos.
    4.  **Post Frequency & Engagement:** Analyze the consistency and relevance of GBP posts (updates, offers, events). Are they engaging? Do they have clear calls-to-action?
    5.  **Q&A Engagement:** Evaluate how well the business manages its Q&A section. Does it proactively add common questions and provide authoritative answers? Does it answer user questions promptly?
    6.  **Local SEO Signals:** Evaluate hypothetical local citations, backlink profile from relevant local sites, and keyword optimization in the business description and posts.
    7.  **Service/Product Listing Optimization:** Assess how well services and products are listed, described, and priced. Are they using high-quality images for each?

    Your response MUST be a valid JSON object that adheres to the provided schema. Do not include any text outside of the JSON object.

    The analysis must include:
    1.  An overall score from 1 to 100.
    2.  A breakdown of scores for at least 6 of the categories listed above.
    3.  At least 4 specific, actionable recommendations for improvement. These should be insightful and tailored to the hypothetical findings.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: auditResponseSchema,
        temperature: 0.7,
      },
    });

    const jsonText = response.text.trim();
    const parsedResult = JSON.parse(jsonText);
    
    // Basic validation
    if (typeof parsedResult.overallScore !== 'number' || !Array.isArray(parsedResult.auditBreakdown) || !Array.isArray(parsedResult.recommendations)) {
        throw new Error("Invalid data structure received from API.");
    }

    return parsedResult as AuditResult;
  } catch (error) {
    console.error("Error fetching or parsing GBP audit:", error);
    throw new Error("Failed to generate audit from AI model.");
  }
};

export const generateEmailBody = async (result: AuditResult, businessName: string): Promise<string> => {
  const prompt = `
    Summarize the following Google Business Profile audit for "${businessName}" into a concise and professional email body suitable for sharing with a team or stakeholder.
    The tone should be informative and encouraging.
    Format it with clear headings using block capitals (e.g., "OVERALL SCORE") and use bullet points for lists. Do not use markdown. Use plain text with line breaks for maximum compatibility.

    Audit Data:
    - Overall Score: ${result.overallScore}/100
    - Breakdown: ${JSON.stringify(result.auditBreakdown)}
    - Recommendations: ${JSON.stringify(result.recommendations)}

    Start the email body directly with "Here is the summary of your Google Business Profile audit for ${businessName}:".
    Follow this structure:
    1. A brief introduction.
    2. A section titled "OVERALL SCORE".
    3. A section titled "KEY FINDINGS" that lists each audit category and its score as a bullet point (e.g., "- Profile Completeness: 85/100").
    4. A section titled "TOP RECOMMENDATIONS" that lists the title of each recommendation as a bullet point.
    5. A concluding sentence.
  `;

  try {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error generating email body:", error);
    throw new Error("Failed to generate email summary.");
  }
};