import { createContext, useContext, useState, type ReactNode } from 'react';

export const light = { bg: '#F5F6F0', card: '#FFFFFF', text: '#172D25', muted: '#65756D', border: '#E2E8DF', green: '#227650', soft: '#E6F1E9', danger: '#B63636', warning: '#8A590D', dangerBg: '#FFF0EE', warningBg: '#FFF1CE' };
export const dark: typeof light = { bg: '#10231B', card: '#1A3227', text: '#EFF7EF', muted: '#B0C1B6', border: '#365043', green: '#9DE0AE', soft: '#2B4936', danger: '#FFA7A1', warning: '#F4CF7A', dangerBg: '#492D2B', warningBg: '#473E24' };
const ThemeContext = createContext<{ darkMode: boolean; toggleTheme: () => void; colors: typeof light } | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [darkMode, setDarkMode] = useState(false);
  return <ThemeContext.Provider value={{ darkMode, toggleTheme: () => setDarkMode(previous => !previous), colors: darkMode ? dark : light }}>{children}</ThemeContext.Provider>;
}
export function useTheme() {
  const theme = useContext(ThemeContext);
  if (!theme) throw new Error('useTheme harus berada di dalam ThemeProvider.');
  return theme;
}
