import { Link, useLocation } from 'react-router-dom';
import { Sun, Moon } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTheme } from '@/contexts/ThemeContext';

export default function Header({ onOpenFavorites: _onOpenFavorites }: { onOpenFavorites: () => void }) {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  const navItems = [
    { label: 'מועמדים', path: '/people' },
    { label: 'רשימות', path: '/lists' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-xl border-b border-border shadow-sm">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center shadow-glow group-hover:scale-110 transition-transform duration-300">
            <span className="text-primary-foreground font-bold text-sm">בח</span>
          </div>
          <span className="font-rubik font-bold text-lg text-gradient-primary hidden sm:block">בוחרים ח״כם</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300 ${
                isActive(item.path)
                  ? 'gradient-primary text-primary-foreground shadow-glow'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Dark mode toggle */}
        <motion.button
          onClick={toggleTheme}
          whileTap={{ scale: 0.85 }}
          className="w-9 h-9 rounded-xl flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors duration-200"
          aria-label={theme === 'dark' ? 'מעבר למצב בהיר' : 'מעבר למצב כהה'}
        >
          <motion.div
            key={theme}
            initial={{ rotate: -30, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            transition={{ duration: 0.25 }}
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </motion.div>
        </motion.button>
      </div>
    </header>
  );
}
