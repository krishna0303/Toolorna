import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const email = (body.email || "").trim();
    const profession = body.profession || "unknown";

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return new Response(
        JSON.stringify({ error: "Valid email is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const apiKey = Deno.env.get("MAILCHIMP_API_KEY");
    const serverPrefix = Deno.env.get("MAILCHIMP_SERVER_PREFIX");
    const listId = Deno.env.get("MAILCHIMP_LIST_ID");

    if (apiKey && serverPrefix && listId) {
      const url = `https://${serverPrefix}.api.mailchimp.com/3.0/lists/${listId}/members`;
      await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `apikey ${apiKey}`,
        },
        body: JSON.stringify({
          email_address: email,
          status: "subscribed",
          tags: ["toolmatch-user", profession],
        }),
      }).catch(() => {});
    }

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Subscribe API error:", error);
    return new Response(
      JSON.stringify({ error: "Something went wrong." }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
