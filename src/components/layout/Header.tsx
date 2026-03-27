import { Link, useLocation } from 'react-router-dom';

export default function Header({ onOpenFavorites: _onOpenFavorites }: { onOpenFavorites: () => void }) {
  const location = useLocation();

  const navItems = [
    { label: 'מועמדים', path: '/people' },
    { label: 'רשימות', path: '/lists' },
    { label: 'חקר', path: '/explore' },
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

        <div />
      </div>
    </header>
  );
}
