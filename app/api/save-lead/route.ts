import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { sanitizeInput, validateEmail, validateProfession, validateProblem, validateBudget } from "@/lib/validation";
import crypto from "crypto";

export async function POST(request: Request) {
  try {
    const ip = request.headers.get("x-forwarded-for") || "unknown";
    const ipHash = crypto.createHash("sha256").update(ip).digest("hex");

    const rawBody = await request.json();
    const body = sanitizeInput(rawBody);

    const validations = [
      validateEmail(body.email),
      validateProfession(body.profession),
      validateProblem(body.problem),
      validateBudget(body.budget),
    ];

    for (const v of validations) {
      if (!v.valid) {
        return NextResponse.json({ error: v.message }, { status: 400 });
      }
    }

    const { error } = await supabaseAdmin.from("leads").insert({
      email: body.email,
      profession: body.profession,
      problem: body.problem,
      budget: body.budget,
      tools_tried: body.tools_tried || null,
      ip_hash: ipHash,
    });

    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json(
        { error: "Something went wrong. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Save lead API error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
