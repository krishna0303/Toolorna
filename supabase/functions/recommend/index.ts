import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";
import { GoogleGenerativeAI } from "npm:@google/generative-ai@0.24";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

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

function buildPrompt(profession: string, problem: string, budget: string, tools_tried: string): string {
  return RECOMMENDATION_PROMPT
    .replace("{profession}", profession)
    .replace("{problem}", problem)
    .replace("{budget}", budget)
    .replace("{tools_tried}", tools_tried || "None");
}

function stripHtml(str: string): string {
  return str.replace(/<[^>]*>/g, "");
}

function sanitize(str: string): string {
  return stripHtml(str).trim();
}

function sanitizeInput(input: Record<string, unknown>): Record<string, string> {
  const result: Record<string, string> = {};
  for (const [key, value] of Object.entries(input)) {
    result[key] = typeof value === "string" ? sanitize(value) : "";
  }
  return result;
}

const VALID_PROFESSIONS = ["Student", "Freelancer", "Developer", "Content Creator", "Small Business", "Working Professional"];
const VALID_PROBLEMS = ["Save Time", "Save Money", "Grow Online Presence", "Manage Work Better", "Create Content Faster", "Learn New Skills", "Build a Website"];
const VALID_BUDGETS = ["Free Only", "Under ₹500", "₹500–₹2000", "₹2000+"];

const rateLimitMap = new Map<string, { count: number; firstRequest: number }>();
const MAX_REQUESTS = 5;
const WINDOW_MS = 60 * 60 * 1000;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now - entry.firstRequest > WINDOW_MS) {
    rateLimitMap.set(ip, { count: 1, firstRequest: now });
    return true;
  }
  if (entry.count >= MAX_REQUESTS) return false;
  entry.count += 1;
  return true;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

    const ip = req.headers.get("x-forwarded-for") || "unknown";

    if (!checkRateLimit(ip)) {
      return new Response(
        JSON.stringify({ error: "You've made too many requests. Please wait 1 hour." }),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const rawBody = await req.json();
    const body = sanitizeInput(rawBody);

    if (!VALID_PROFESSIONS.includes(body.profession)) {
      return new Response(JSON.stringify({ error: "Invalid profession" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    if (!VALID_PROBLEMS.includes(body.problem)) {
      return new Response(JSON.stringify({ error: "Invalid challenge" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    if (!VALID_BUDGETS.includes(body.budget)) {
      return new Response(JSON.stringify({ error: "Invalid budget" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const apiKey = Deno.env.get("GEMINI_API_KEY");
    if (!apiKey) throw new Error("Missing GEMINI_API_KEY");

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      tools: [{ googleSearchRetrieval: {} }],
    });

    const prompt = buildPrompt(body.profession, body.problem, body.budget, body.tools_tried);
    const result = await model.generateContent(prompt);
    const text = result.response.text();

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("Failed to parse Gemini response as JSON");

    const recommendation = JSON.parse(jsonMatch[0]);

    const { data: leadData } = await supabaseAdmin
      .from("leads")
      .select("id")
      .eq("email", body.email)
      .single();

    if (leadData?.id) {
      await supabaseAdmin.from("recommendations").insert({
        lead_id: leadData.id,
        tool_name: recommendation.tool_name,
        tool_description: recommendation.tagline,
        why_perfect: recommendation.why_perfect,
        key_feature: recommendation.key_feature,
        indian_price: recommendation.indian_price_monthly,
        coupon_code: recommendation.coupon_code,
        discount_percent: recommendation.discount_percent,
      });
    }

    return new Response(
      JSON.stringify({ success: true, data: recommendation }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Recommendation API error:", error);
    return new Response(
      JSON.stringify({ error: "Something went wrong. Please try again." }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
