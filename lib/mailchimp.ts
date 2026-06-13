interface MailchimpSubscriber {
  email: string;
  profession: string;
}

export async function subscribeToMailchimp({
  email,
  profession,
}: MailchimpSubscriber): Promise<boolean> {
  const apiKey = process.env.MAILCHIMP_API_KEY;
  const serverPrefix = process.env.MAILCHIMP_SERVER_PREFIX;
  const listId = process.env.MAILCHIMP_LIST_ID;

  if (!apiKey || !serverPrefix || !listId) {
    console.error("Missing Mailchimp environment variables");
    return false;
  }

  try {
    const url = `https://${serverPrefix}.api.mailchimp.com/3.0/lists/${listId}/members`;
    const response = await fetch(url, {
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
    });

    if (!response.ok) {
      const error = await response.json();
      console.error("Mailchimp error:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Mailchimp subscription failed:", error);
    return false;
  }
}
