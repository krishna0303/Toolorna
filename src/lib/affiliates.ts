export const AFFILIATE_LINKS: Record<string, string> = {
  Hostinger: "https://www.hostinger.in/",
  NordVPN: "https://nordvpn.com/",
  Canva: "https://www.canva.com/",
  SEMrush: "https://www.semrush.com/",
  Notion: "https://www.notion.so/",
  Grammarly: "https://www.grammarly.com/",
  Mailchimp: "https://mailchimp.com/",
  Envato: "https://elements.envato.com/",
  Shopify: "https://www.shopify.com/",
  Figma: "https://www.figma.com/",
};

export function getAffiliateLink(toolName: string): string {
  return AFFILIATE_LINKS[toolName] || "#";
}
