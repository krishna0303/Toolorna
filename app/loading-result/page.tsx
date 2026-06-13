"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useQuiz } from "@/lib/context";

const loadingMessages = [
  "Analyzing your profile...",
  "Searching best tools for you...",
  "Finding exclusive coupon codes...",
  "Almost ready...",
];

export default function LoadingResultPage() {
  const router = useRouter();
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
        const res = await fetch("/api/recommend", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
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
        setState((prev) => ({ ...prev, recommendation: data.data }));
        router.push("/result");
      } catch {
        setError("Connection issue. Please check your internet.");
      }
    };

    fetchRecommendation();
  }, [state.profession, state.problem, state.budget, state.tools_tried, state.email, router, setState]);

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8">
        <div className="text-center max-w-md">
          <p className="text-red-400 mb-4">{error}</p>
          <button
            onClick={() => router.push("/quiz")}
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

