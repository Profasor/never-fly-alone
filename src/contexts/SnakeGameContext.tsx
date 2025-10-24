import { createContext, useContext, type ReactNode } from "react";
import { useSnakeGame } from "../hooks/useSnakeGame";

const SnakeGameContext = createContext<ReturnType<typeof useSnakeGame> | undefined>(
  undefined,
);

export function SnakeGameProvider({ children }: { children: ReactNode }) {
  const value = useSnakeGame();
  return <SnakeGameContext.Provider value={value}>{children}</SnakeGameContext.Provider>;
}

export function useSnakeGameContext() {
  const context = useContext(SnakeGameContext);
  if (!context) {
    throw new Error("useSnakeGameContext must be used within SnakeGameProvider");
  }
  return context;
}
