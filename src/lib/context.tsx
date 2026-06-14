import { createContext, useContext, useState, type ReactNode } from "react";
import type { QuizState } from "@/types";

const initialState: QuizState = {
  profession: "",
  problem: "",
  budget: "",
  tools_tried: "",
  email: "",
  recommendation: null,
};

interface QuizContextType {
  state: QuizState;
  setState: React.Dispatch<React.SetStateAction<QuizState>>;
  resetQuiz: () => void;
}

const QuizContext = createContext<QuizContextType | undefined>(undefined);

export function QuizProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<QuizState>(initialState);

  const resetQuiz = () => setState(initialState);

  return (
    <QuizContext.Provider value={{ state, setState, resetQuiz }}>
      {children}
    </QuizContext.Provider>
  );
}

export function useQuiz() {
  const context = useContext(QuizContext);
  if (!context) {
    throw new Error("useQuiz must be used within a QuizProvider");
  }
  return context;
}
