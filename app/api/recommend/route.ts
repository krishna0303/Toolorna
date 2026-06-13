import { NextResponse } from "next/server";
import { getRecommendation } from "@/lib/gemini";
import { supabaseAdmin } from "@/lib/supabase";
import { checkRateLimit } from "@/lib/rateLimit";
import { sanitizeInput, validateProfession, validateProblem, validateBudget, validateToolsTried } from "@/lib/validation";
import crypto from "crypto";

export async function POST(request: Request) {
  try {
    const ip = request.headers.get("x-forwarded-for") || "unknown";
    const ipHash = crypto.createHash("sha256").update(ip).digest("hex");

    const rateLimitResult = checkRateLimit(ipHash);
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { error: "You've made too many requests. Please wait 1 hour." },
        { status: 429 }
      );
    }

    const rawBody = await request.json();
    const body = sanitizeInput(rawBody);

    const validations = [
      validateProfession(body.profession),
      validateProblem(body.problem),
      validateBudget(body.budget),
      validateToolsTried(body.tools_tried || ""),
    ];

    for (const v of validations) {
      if (!v.valid) {
        return NextResponse.json({ error: v.message }, { status: 400 });
      }
    }

    const recommendation = await getRecommendation(
      body.profession,
      body.problem,
      body.budget,
      body.tools_tried
    );

    const { data: leadData } = await supabaseAdmin
      .from("leads")
      .select("id")
      .eq("email", body.email)
      .single();

    const leadId = leadData?.id;

    if (leadId) {
      await supabaseAdmin.from("recommendations").insert({
        lead_id: leadId,
        tool_name: recommendation.tool_name,
        tool_description: recommendation.tagline,
        why_perfect: recommendation.why_perfect,
        key_feature: recommendation.key_feature,
        indian_price: recommendation.indian_price_monthly,
        coupon_code: recommendation.coupon_code,
        discount_percent: recommendation.discount_percent,
      });
    }

    return NextResponse.json({ success: true, data: recommendation });
  } catch (error) {
    console.error("Recommendation API error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
