import { useTheme } from '../hooks/useTheme';
import '../styles/theme-toggle.css';

const themeToggle = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <button 
      className={`theme-toggle ${isDarkMode ? 'dark' : 'light'}`}
      onClick={toggleTheme}
      aria-label={isDarkMode ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
    >
      {isDarkMode ? '☀️' : '🌙'}
    </button>
  );
};

export default themeToggle;