export type ThemeChoice = "light" | "dark" | "system";

const THEME_KEY = "elyvex.theme";
const systemTheme = window.matchMedia("(prefers-color-scheme: dark)");

export function getThemeChoice(): ThemeChoice {
  const saved = localStorage.getItem(THEME_KEY);
  return saved === "light" || saved === "dark" || saved === "system" ? saved : "system";
}

export function applyTheme(choice: ThemeChoice) {
  const effectiveTheme = choice === "system" ? (systemTheme.matches ? "dark" : "light") : choice;
  document.documentElement.dataset.theme = effectiveTheme;
  document.documentElement.dataset.themeChoice = choice;
}

export function watchSystemTheme() {
  systemTheme.addEventListener("change", () => {
    if (getThemeChoice() === "system") applyTheme("system");
  });
}
