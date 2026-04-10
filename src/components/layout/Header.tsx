import { Link, useLocation } from 'react-router-dom';
import { Search } from 'lucide-react';

// SVG feColorMatrix: black(0,0,0) → #2952d9, white(1,1,1) → white
// R: factor=0.839, offset=0.161  |  G: factor=0.678, offset=0.322  |  B: factor=0.149, offset=0.851
const LOGO_FILTER_ID = 'logo-to-primary';

export default function Header() {
  const { pathname } = useLocation();

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-border shadow-nav">
      {/* Hidden SVG filter */}
      <svg width="0" height="0" style={{ position: 'absolute' }}>
        <defs>
          <filter id={LOGO_FILTER_ID}>
            <feColorMatrix
              type="matrix"
              values="0.839 0 0 0 0.161
                      0 0.678 0 0 0.322
                      0 0 0.149 0 0.851
                      0 0 0   1 0"
            />
          </filter>
        </defs>
      </svg>

      <div className="container mx-auto px-6 max-w-content h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 shrink-0">
          <img
            src="/logo.png"
            alt="לוגו"
            className="w-8 h-8 object-contain"
            style={{ filter: `url(#${LOGO_FILTER_ID})` }}
          />
          <span className="font-bold text-primary text-lg">בוחרים ח״כם</span>
        </Link>

        {/* Desktop nav — hidden on mobile (bottom nav handles it) */}
        <nav className="hidden md:flex items-center gap-6">
          <Link
            to="/lists"
            className={`text-sm font-medium transition-colors duration-normal ${
              pathname.startsWith('/lists') ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            רשימות
          </Link>
          <Link
            to="/people"
            aria-label="חיפוש"
            className={`transition-colors duration-normal ${
              pathname === '/people' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Search className="w-5 h-5" />
          </Link>
        </nav>
      </div>
    </header>
  );
}
