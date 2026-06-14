import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import ToolCard from "@/components/result/ToolCard";
import { useApp } from "@/lib/context";
import { getAffiliateLink } from "@/lib/affiliates";

export default function Result() {
  const navigate = useNavigate();
  const { state } = useApp();

  if (!state.recommendation) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8">
        <div className="text-center max-w-md">
          <p className="text-text-muted mb-4">
            No recommendation found. Please describe your requirements first.
          </p>
          <button
            onClick={() => navigate("/")}
            className="bg-primary hover:bg-primary-hover text-white font-semibold rounded-xl px-6 py-3 transition-all duration-200"
          >
            Start Over
          </button>
        </div>
      </div>
    );
  }

  const affiliateLink = getAffiliateLink(state.recommendation.tool_name);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8">
      <motion.div
        className="w-full max-w-xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-4">
          <p className="text-sm text-text-muted">Based on your requirements:</p>
          <p className="text-text-primary text-sm mt-1 line-clamp-2">"{state.requirements.substring(0, 150)}{state.requirements.length > 150 ? "..." : ""}"</p>
        </div>

        <ToolCard
          recommendation={state.recommendation}
          affiliateLink={affiliateLink}
        />

        <div className="mt-6 text-center">
          <button
            onClick={() => navigate("/")}
            className="text-text-muted hover:text-text-primary text-sm transition-colors duration-200"
          >
            Not what you expected? Try again with different requirements
          </button>
        </div>
      </motion.div>
    </div>
  );
}
