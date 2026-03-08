import { Link, useLocation } from 'react-router-dom';
import { Users, List, Compass } from 'lucide-react';

const items = [
  { icon: Users, label: 'מועמדים', path: '/people' },
  { icon: List, label: 'רשימות', path: '/lists' },
  { icon: Compass, label: 'חקר', path: '/explore' },
];

export default function MobileNav() {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-card/90 backdrop-blur-xl border-t border-border">
      <div className="flex items-center justify-around h-16">
        {items.map(({ icon: Icon, label, path }) => (
          <Link
            key={path}
            to={path}
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all duration-300 ${
              isActive(path)
                ? 'text-primary'
                : 'text-muted-foreground'
            }`}
          >
            <div className={`p-1.5 rounded-lg transition-all duration-300 ${isActive(path) ? 'gradient-primary shadow-glow' : ''}`}>
              <Icon className={`w-5 h-5 ${isActive(path) ? 'text-primary-foreground' : ''}`} />
            </div>
            <span className="text-xs font-medium">{label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
