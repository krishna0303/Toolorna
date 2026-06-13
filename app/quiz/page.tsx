"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import QuestionCard from "@/components/quiz/QuestionCard";
import { useQuiz } from "@/lib/context";
import type { Profession, Problem, Budget } from "@/types";

const questions = [
  {
    key: "profession" as const,
    question: "What best describes you?",
    options: [
      "Student",
      "Freelancer",
      "Developer",
      "Content Creator",
      "Small Business",
      "Working Professional",
    ] as Profession[],
  },
  {
    key: "problem" as const,
    question: "What is your biggest challenge right now?",
    options: [
      "Save Time",
      "Save Money",
      "Grow Online Presence",
      "Manage Work Better",
      "Create Content Faster",
      "Learn New Skills",
      "Build a Website",
    ] as Problem[],
  },
  {
    key: "budget" as const,
    question: "What is your monthly budget for tools?",
    options: [
      "Free Only",
      "Under ₹500",
      "₹500–₹2000",
      "₹2000+",
    ] as Budget[],
  },
  {
    key: "tools_tried" as const,
    question: "Which tools have you already tried? (not happy with them)",
    options: [],
  },
];

export default function QuizPage() {
  const router = useRouter();
  const { state, setState } = useQuiz();
  const [currentQuestion, setCurrentQuestion] = useState(0);

  const handleSelect = (value: string) => {
    const key = questions[currentQuestion].key;
    setState((prev) => ({ ...prev, [key]: value }));

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    } else {
      router.push("/email");
    }
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1);
    }
  };

  const handleToolsTriedSubmit = (value: string) => {
    setState((prev) => ({ ...prev, tools_tried: value }));
    router.push("/email");
  };

  const current = questions[currentQuestion];
  const selectedValue = state[current.key as keyof typeof state] as string;

  if (current.key === "tools_tried") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8">
        <QuestionCard
          questionNumber={currentQuestion + 1}
          totalQuestions={questions.length}
          question={current.question}
          options={[]}
          selectedValue={selectedValue}
          onSelect={() => {}}
          onBack={currentQuestion > 0 ? handleBack : undefined}
        />

        <div className="w-full max-w-lg mx-auto mt-6">
          <textarea
            value={state.tools_tried}
            onChange={(e) =>
              setState((prev) => ({ ...prev, tools_tried: e.target.value }))
            }
            placeholder="e.g., Canva, Notion, Trello... (optional, can skip)"
            maxLength={500}
            className="w-full bg-surface border border-border-custom rounded-xl px-4 py-3 text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200 h-28 resize-none"
          />
          <div className="flex gap-3 mt-4">
            <button
              onClick={() => handleToolsTriedSubmit(state.tools_tried)}
              className="flex-1 bg-primary hover:bg-primary-hover text-white font-semibold rounded-xl px-6 py-3 transition-all duration-200"
            >
              Continue &rarr;
            </button>
            <button
              onClick={() => handleToolsTriedSubmit("")}
              className="border border-border-custom text-text-muted hover:text-text-primary font-medium rounded-xl px-6 py-3 transition-all duration-200"
            >
              Skip
            </button>
          </div>
          {currentQuestion > 0 && (
            <button
              onClick={handleBack}
              className="mt-4 text-text-muted hover:text-text-primary text-sm transition-colors duration-200"
            >
              &larr; Back
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.3 }}
        >
          <QuestionCard
            questionNumber={currentQuestion + 1}
            totalQuestions={questions.length}
            question={current.question}
            options={current.options as string[]}
            selectedValue={selectedValue}
            onSelect={handleSelect}
            onBack={currentQuestion > 0 ? handleBack : undefined}
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
