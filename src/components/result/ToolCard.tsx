import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import CouponBox from "./CouponBox";
import ShareButtons from "./ShareButtons";
import type { Recommendation } from "@/types";

interface ToolCardProps {
  recommendation: Recommendation;
  affiliateLink: string;
}

export default function ToolCard({ recommendation, affiliateLink }: ToolCardProps) {
  return (
    <Card className="max-w-xl mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold mb-2">{recommendation.tool_name}</h2>
        <p className="text-text-muted">{recommendation.tagline}</p>
      </div>

      {recommendation.why_perfect && (
        <div className="mb-6">
          <h3 className="text-sm font-medium text-primary mb-2">
            Why this is perfect for you
          </h3>
          <p className="text-text-muted leading-relaxed">
            {recommendation.why_perfect}
          </p>
        </div>
      )}

      {recommendation.key_feature && (
        <div className="mb-6 bg-primary/5 border border-primary/20 rounded-xl p-4">
          <h3 className="text-sm font-medium text-primary mb-1">Key Feature</h3>
          <p className="text-text-primary">{recommendation.key_feature}</p>
        </div>
      )}

      <div className="mb-6 flex items-center justify-center gap-6">
        <div className="text-center">
          <p className="text-2xl font-bold">{recommendation.indian_price_monthly}</p>
          <p className="text-xs text-text-muted">per month</p>
        </div>
        <div className="w-px h-10 bg-border-custom" />
        <div className="text-center">
          <p className="text-2xl font-bold">{recommendation.indian_price_annual}</p>
          <p className="text-xs text-text-muted">per year</p>
        </div>
      </div>

      {recommendation.free_tier && (
        <p className="text-center text-success text-sm mb-4">
          Free tier available
        </p>
      )}

      <CouponBox
        couponCode={recommendation.coupon_code}
        discountPercent={recommendation.discount_percent}
        source={recommendation.coupon_source}
        expiry={recommendation.coupon_expiry}
      />

      <div className="mt-6">
        <a href={affiliateLink} target="_blank" rel="noopener noreferrer">
          <Button className="w-full text-center">Get This Tool Now &rarr;</Button>
        </a>
      </div>

      <div className="mt-6 pt-4 border-t border-border-custom flex items-center justify-between">
        <ShareButtons toolName={recommendation.tool_name} />
      </div>
    </Card>
  );
}
