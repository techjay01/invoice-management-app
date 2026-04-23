import { useTheme } from '../context/ThemeContext';
import { Logo, SunIcon, MoonIcon } from './Icons';

// ─── Sidebar Component ────────────────────────────────────────────────────────

const Sidebar = () => {
  const { theme, toggleTheme } = useTheme();
  return (
    <nav className="inv-sidebar" aria-label="Main navigation">
      <div className="inv-logo" aria-label="Invoice App"><Logo /></div>
      <div className="inv-sidebar-bottom">
        <button
          className="inv-theme-btn"
          onClick={toggleTheme}
          type="button"
          aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
        >
          {theme === "dark" ? <SunIcon /> : <MoonIcon />}
        </button>
        <div className="inv-divider" role="separator" />
        <div className="inv-avatar" role="img" aria-label="User avatar">AJ</div>
      </div>
    </nav>
  );
};

export default Sidebar;