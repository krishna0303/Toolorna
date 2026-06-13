"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

interface CouponBoxProps {
  couponCode: string | null;
  discountPercent: string | null;
  source?: string;
  expiry?: string;
}

export default function CouponBox({
  couponCode,
  discountPercent,
  source,
  expiry,
}: CouponBoxProps) {
  const [copied, setCopied] = useState(false);

  if (!couponCode) {
    return (
      <div className="bg-surface border border-border-custom rounded-xl p-4">
        <p className="text-text-muted text-sm">
          No coupon available right now. Check back later for deals!
        </p>
      </div>
    );
  }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(couponCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-surface border border-success/30 rounded-xl p-5">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-success">Exclusive Coupon</span>
        {discountPercent && (
          <span className="text-xs font-semibold bg-warning/10 text-warning px-2 py-1 rounded-lg">
            Save {discountPercent}
          </span>
        )}
      </div>

      <div className="flex items-center gap-3 mt-3">
        <code className="flex-1 bg-background border border-border-custom rounded-lg px-4 py-3 text-lg font-mono font-bold text-text-primary tracking-wider">
          {couponCode}
        </code>
        <button
          onClick={handleCopy}
          className="flex items-center gap-2 bg-primary hover:bg-primary-hover text-white px-4 py-3 rounded-lg transition-all duration-200 font-medium"
        >
          {copied ? (
            <>
              <Check size={16} /> Copied!
            </>
          ) : (
            <>
              <Copy size={16} /> Copy
            </>
          )}
        </button>
      </div>

      {(source || expiry) && (
        <div className="mt-3 flex gap-4 text-xs text-text-muted">
          {source && <span>Source: {source}</span>}
          {expiry && <span>Expires: {expiry}</span>}
        </div>
      )}
    </div>
  );
}
