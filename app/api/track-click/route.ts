import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import crypto from "crypto";

export async function POST(request: Request) {
  try {
    const { recommendation_id } = await request.json();

    if (!recommendation_id) {
      return NextResponse.json(
        { error: "Recommendation ID is required" },
        { status: 400 }
      );
    }

    const ip = request.headers.get("x-forwarded-for") || "unknown";
    const ipHash = crypto.createHash("sha256").update(ip).digest("hex");

    const { error } = await supabaseAdmin.from("clicks").insert({
      recommendation_id,
      ip_hash: ipHash,
    });

    if (error) {
      console.error("Click tracking error:", error);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Track click API error:", error);
    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 }
    );
  }
}
