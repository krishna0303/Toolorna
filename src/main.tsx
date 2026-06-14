import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "@/lib/context";
import Home from "@/pages/Home";
import Requirements from "@/pages/Requirements";
import LoadingResult from "@/pages/LoadingResult";
import Result from "@/pages/Result";
import "./globals.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <AppProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/requirements" element={<Requirements />} />
          <Route path="/loading-result" element={<LoadingResult />} />
          <Route path="/result" element={<Result />} />
        </Routes>
      </AppProvider>
    </BrowserRouter>
  </StrictMode>
);
