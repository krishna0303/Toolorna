import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useQuiz } from "@/lib/context";
import type { Recommendation } from "@/types";

const loadingMessages = [
  "Analyzing your profile...",
  "Searching best tools for you...",
  "Finding exclusive coupon codes...",
  "Almost ready...",
];

const RECOMMENDATION_PROMPT = `You are an expert software tool advisor for Indian users.
You have deep knowledge of all software tools, their Indian pricing, and current discount offers.

User Profile:
- Profession: {profession}
- Biggest Challenge: {problem}
- Monthly Budget: {budget}
- Tools Already Tried: {tools_tried}

Your task:
1. Recommend EXACTLY ONE software tool that perfectly fits this user.
2. Search the internet RIGHT NOW and find the best working coupon code for that tool.
   - Find the highest discount percentage available today
   - Verify it is likely still active (check recent sources)
   - If no coupon exists, say "No coupon available right now"

Respond ONLY in this exact JSON format, nothing else:
{
  "tool_name": "exact tool name",
  "tagline": "one line what it does",
  "why_perfect": "2-3 lines explaining exactly why this fits THIS user's profile",
  "key_feature": "the single most useful feature for this user",
  "indian_price_monthly": "₹XXX/month",
  "indian_price_annual": "₹XXXX/year",
  "free_tier": true/false,
  "coupon_code": "CODEXXX or null",
  "discount_percent": "XX% or null",
  "coupon_source": "where you found this coupon",
  "coupon_expiry": "date or unknown",
  "affiliate_category": "hosting/vpn/design/productivity/marketing/other"
}`;

function buildPrompt(
  profession: string,
  problem: string,
  budget: string,
  tools_tried: string
): string {
  return RECOMMENDATION_PROMPT
    .replace("{profession}", profession)
    .replace("{problem}", problem)
    .replace("{budget}", budget)
    .replace("{tools_tried}", tools_tried || "None");
}

export default function LoadingResult() {
  const navigate = useNavigate();
  const { state, setState } = useQuiz();
  const [messageIndex, setMessageIndex] = useState(0);
  const [error, setError] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % loadingMessages.length);
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchRecommendation = async () => {
      try {
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
        const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

        const res = await fetch(`${supabaseUrl}/functions/v1/recommend`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${supabaseAnonKey}`,
          },
          body: JSON.stringify({
            profession: state.profession,
            problem: state.problem,
            budget: state.budget,
            tools_tried: state.tools_tried,
            email: state.email,
          }),
        });

        if (!res.ok) {
          const data = await res.json();
          setError(data.error || "Something went wrong. Please try again.");
          return;
        }

        const data = await res.json();
        setState((prev) => ({ ...prev, recommendation: data.data as Recommendation }));
        navigate("/result");
      } catch {
        setError("Connection issue. Please check your internet.");
      }
    };

    fetchRecommendation();
  }, [state.profession, state.problem, state.budget, state.tools_tried, state.email, navigate, setState]);

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8">
        <div className="text-center max-w-md">
          <p className="text-red-400 mb-4">{error}</p>
          <button
            onClick={() => navigate("/quiz")}
            className="bg-primary hover:bg-primary-hover text-white font-semibold rounded-xl px-6 py-3 transition-all duration-200"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8">
      <motion.div
        className="text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-8" />

        <AnimatePresence mode="wait">
          <motion.p
            key={messageIndex}
            className="text-lg text-text-muted"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {loadingMessages[messageIndex]}
          </motion.p>
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
