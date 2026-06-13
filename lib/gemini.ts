import { GoogleGenerativeAI } from "@google/generative-ai";
import type { Recommendation } from "@/types";

const RECOMMENDATION_PROMPT = `You are an expert software tool advisor for Indian users.
You have deep knowledge of all software tools, their Indian pricing, and current discount offers.

User Profile:
- Profession: {profession}
- Biggest Challenge: {problem}
- Monthly Budget: {budget}
- Tools Already Tried: {tools_tried}

Your task:
1. Recommend EXACTLY ONE software tool that perfectly fits this user.
2. Search the internet RIGHT NOW and find the best working coupon code for that tool.
   - Find the highest discount percentage available today
   - Verify it is likely still active (check recent sources)
   - If no coupon exists, say "No coupon available right now"

Respond ONLY in this exact JSON format, nothing else:
{
  "tool_name": "exact tool name",
  "tagline": "one line what it does",
  "why_perfect": "2-3 lines explaining exactly why this fits THIS user's profile",
  "key_feature": "the single most useful feature for this user",
  "indian_price_monthly": "₹XXX/month",
  "indian_price_annual": "₹XXXX/year",
  "free_tier": true/false,
  "coupon_code": "CODEXXX or null",
  "discount_percent": "XX% or null",
  "coupon_source": "where you found this coupon",
  "coupon_expiry": "date or unknown",
  "affiliate_category": "hosting/vpn/design/productivity/marketing/other"
}`;

function buildPrompt(
  profession: string,
  problem: string,
  budget: string,
  tools_tried: string
): string {
  return RECOMMENDATION_PROMPT
    .replace("{profession}", profession)
    .replace("{problem}", problem)
    .replace("{budget}", budget)
    .replace("{tools_tried}", tools_tried || "None");
}

export async function getRecommendation(
  profession: string,
  problem: string,
  budget: string,
  tools_tried: string
): Promise<Recommendation> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("Missing GEMINI_API_KEY");

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    tools: [{ googleSearchRetrieval: {} }],
  });

  const prompt = buildPrompt(profession, problem, budget, tools_tried);
  const result = await model.generateContent(prompt);
  const response = result.response;
  const text = response.text();

  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error("Failed to parse Gemini response as JSON");

  const parsed = JSON.parse(jsonMatch[0]) as Recommendation;
  return parsed;
}
