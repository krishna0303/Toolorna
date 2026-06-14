import { createContext, useContext, useState, type ReactNode } from "react";
import type { AppState } from "@/types";

const initialState: AppState = {
  requirements: "",
  email: "",
  recommendation: null,
};

interface AppContextType {
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
  reset: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(initialState);
  const reset = () => setState(initialState);
  return (
    <AppContext.Provider value={{ state, setState, reset }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
