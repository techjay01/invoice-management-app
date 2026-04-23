import { createContext, useContext } from "react";

// ─── Theme Context ──────────────────────────────────────────────────────────────────

const ThemeContext = createContext();
const useTheme = () => useContext(ThemeContext);

export { ThemeContext, useTheme };