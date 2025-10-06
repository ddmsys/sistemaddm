// src/components/ui/ThemeToggle.tsx
"use client";

import { useTheme } from "@/components/providers/ThemeProvider";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { theme, toggleTheme, actualTheme } = useTheme();

  const getIcon = () => {
    if (theme === "system") {
      return actualTheme === "dark" ? "🌙" : "☀️";
    }
    return theme === "dark" ? "🌙" : "☀️";
  };

  const getLabel = () => {
    switch (theme) {
      case "light":
        return "Claro";
      case "dark":
        return "Escuro";
      case "system":
        return `Sistema (${actualTheme === "dark" ? "Escuro" : "Claro"})`;
      default:
        return "Tema";
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleTheme}
      className="gap-2"
      title={`Tema atual: ${getLabel()}`}
    >
      <span className="text-lg">{getIcon()}</span>
      <span className="hidden sm:inline">{getLabel()}</span>
    </Button>
  );
}
