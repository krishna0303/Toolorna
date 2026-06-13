import { NextResponse } from "next/server";
import { subscribeToMailchimp } from "@/lib/mailchimp";
import { sanitizeInput, validateEmail } from "@/lib/validation";

export async function POST(request: Request) {
  try {
    const rawBody = await request.json();
    const body = sanitizeInput(rawBody);

    const emailValidation = validateEmail(body.email);
    if (!emailValidation.valid) {
      return NextResponse.json({ error: emailValidation.message }, { status: 400 });
    }

    await subscribeToMailchimp({
      email: body.email,
      profession: body.profession || "unknown",
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Subscribe API error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
