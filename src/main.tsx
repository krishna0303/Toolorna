import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QuizProvider } from "@/lib/context";
import Home from "@/pages/Home";
import Quiz from "@/pages/Quiz";
import Email from "@/pages/Email";
import LoadingResult from "@/pages/LoadingResult";
import Result from "@/pages/Result";
import "./globals.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <QuizProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/email" element={<Email />} />
          <Route path="/loading-result" element={<LoadingResult />} />
          <Route path="/result" element={<Result />} />
        </Routes>
      </QuizProvider>
    </BrowserRouter>
  </StrictMode>
);
