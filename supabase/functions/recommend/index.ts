import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";
import { GoogleGenerativeAI } from "npm:@google/generative-ai@0.24";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const RECOMMENDATION_PROMPT = `You are a world-class software tool analyst and deal hunter for Indian professionals and businesses. You have encyclopedic knowledge of SaaS tools, their Indian pricing (INR), and the promotional landscape across every category.

YOUR MISSION: Given the user's detailed requirements below, use your web search capability to find the SINGLE BEST tool match AND a currently active, real coupon code for it.

USER REQUIREMENTS:
{requirements}

EXECUTION STRATEGY:
1. ANALYZE the requirements deeply — identify the core job-to-be-done, must-have features, budget constraints, team size, integrations needed, and Indian-specific requirements (UPI, GST billing, local compliance etc.)
2. SEARCH the web for tools that solve this specific problem in 2025-2026. Do NOT recommend outdated or discontinued tools.
3. EVALUATE the top candidates against every constraint the user mentioned. Pick the ONE tool that is the strongest overall match.
4. HUNT FOR DEALS — Search the web RIGHT NOW for active coupon/promo codes for the chosen tool:
   - Check the tool's official pricing/promotions page
   - Check coupon sites (RetailMeNot, CouponDunia, GrabOn, etc.)
   - Check recent blog posts or YouTube videos with promo links
   - Verify the code is likely still valid (published within the last 90 days)
   - If no coupon exists, search for partner/affiliate deals, startup programs, or education discounts
5. CROSS-REFERENCE pricing — confirm the current Indian pricing from the official site, not cached/outdated data.

CRITICAL RULES:
- Recommend EXACTLY ONE tool. Not a list. The single best match.
- All pricing MUST be in Indian Rupees (₹) and current as of today.
- The coupon code MUST be a real code you found via web search, not fabricated.
- If no real coupon code is found, set coupon_code to null — do NOT make up codes.
- The why_perfect field must directly reference specific requirements the user stated.

Respond ONLY in this exact JSON format, nothing else:
{
  "tool_name": "exact official tool name",
  "tagline": "one-line description of what it does",
  "why_perfect": "3-4 sentences explaining specifically how this tool addresses the user's stated requirements, mentioning features they asked for by name",
  "key_feature": "the single most useful feature for this user's specific use case",
  "indian_price_monthly": "₹XXX/month (current official pricing)",
  "indian_price_annual": "₹XXXX/year (current official pricing)",
  "free_tier": true_or_false,
  "coupon_code": "REALCODE or null",
  "discount_percent": "XX% or null",
  "coupon_source": "exact URL or site where you found this coupon",
  "coupon_expiry": "YYYY-MM-DD or unknown",
  "affiliate_category": "hosting/vpn/design/productivity/marketing/CRM/finance/other"
}`;

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

function stripHtml(str: string): string {
  return str.replace(/<[^>]*>/g, "");
}
function sanitize(str: string): string {
  return stripHtml(str).trim();
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
    const requirements = typeof rawBody.requirements === "string" ? sanitize(rawBody.requirements) : "";
    const email = typeof rawBody.email === "string" ? sanitize(rawBody.email) : "";

    if (!requirements || requirements.length < 10) {
      return new Response(
        JSON.stringify({ error: "Please provide your requirements (at least 10 characters)" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const apiKey = Deno.env.get("GEMINI_API_KEY");
    if (!apiKey) throw new Error("Missing GEMINI_API_KEY");

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
      tools: [{ googleSearchRetrieval: {} }],
    });

    const prompt = RECOMMENDATION_PROMPT.replace("{requirements}", requirements);
    const result = await model.generateContent(prompt);
    const text = result.response.text();

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("Failed to parse Gemini response as JSON");

    const recommendation = JSON.parse(jsonMatch[0]);

    if (email) {
      const { data: leadData } = await supabaseAdmin
        .from("leads")
        .select("id")
        .eq("email", email)
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
