export type Profession =
  | "Student"
  | "Freelancer"
  | "Developer"
  | "Content Creator"
  | "Small Business"
  | "Working Professional";

export type Problem =
  | "Save Time"
  | "Save Money"
  | "Grow Online Presence"
  | "Manage Work Better"
  | "Create Content Faster"
  | "Learn New Skills"
  | "Build a Website";

export type Budget = "Free Only" | "Under ₹500" | "₹500–₹2000" | "₹2000+";

export interface UserProfile {
  profession: Profession | "";
  problem: Problem | "";
  budget: Budget | "";
  tools_tried: string;
  email: string;
}

export interface Recommendation {
  tool_name: string;
  tagline: string;
  why_perfect: string;
  key_feature: string;
  indian_price_monthly: string;
  indian_price_annual: string;
  free_tier: boolean;
  coupon_code: string | null;
  discount_percent: string | null;
  coupon_source: string;
  coupon_expiry: string;
  affiliate_category: string;
}

export interface QuizState extends UserProfile {
  recommendation: Recommendation | null;
}

export interface LeadRow {
  id: string;
  email: string;
  profession: string;
  problem: string;
  budget: string;
  tools_tried: string | null;
  ip_hash: string | null;
  created_at: string;
}

export interface RecommendationRow {
  id: string;
  lead_id: string;
  tool_name: string;
  tool_description: string | null;
  why_perfect: string | null;
  key_feature: string | null;
  indian_price: string | null;
  coupon_code: string | null;
  discount_percent: string | null;
  affiliate_link: string | null;
  created_at: string;
}

export interface ClickRow {
  id: string;
  recommendation_id: string;
  clicked_at: string;
  ip_hash: string | null;
}
