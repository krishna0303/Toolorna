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

export interface AppState {
  requirements: string;
  email: string;
  recommendation: Recommendation | null;
}
