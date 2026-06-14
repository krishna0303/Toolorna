import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useApp } from "@/lib/context";
import type { Recommendation } from "@/types";

const loadingMessages = [
  "Analyzing your requirements...",
  "Searching the web for the best tools...",
  "Hunting for real coupon codes...",
  "Verifying pricing and deals...",
  "Almost ready...",
];

export default function LoadingResult() {
  const navigate = useNavigate();
  const { state, setState } = useApp();
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
            requirements: state.requirements,
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
  }, [state.requirements, state.email, navigate, setState]);

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8">
        <div className="text-center max-w-md">
          <p className="text-red-400 mb-4">{error}</p>
          <button
            onClick={() => navigate("/")}
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

        <p className="mt-6 text-xs text-text-muted/60">
          Our AI is searching the internet right now for the latest tools and active coupon codes
        </p>
      </motion.div>
    </div>
  );
}
