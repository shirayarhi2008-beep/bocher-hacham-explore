import { Link, useLocation } from 'react-router-dom';
import { Home, LayoutList, Search } from 'lucide-react';

const items = [
  { icon: Home,       label: 'בית',      path: '/' },
  { icon: LayoutList, label: 'רשימות',   path: '/lists' },
  { icon: Search,     label: 'חיפוש',    path: '/people' },
];

export default function MobileNav() {
  const { pathname } = useLocation();

  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-50 bg-white border-t border-border">
      <div className="flex items-center justify-around h-14 px-2">
        {items.map(({ icon: Icon, label, path }) => {
          const active = pathname === path || (path !== '/' && pathname.startsWith(path));
          return (
            <Link
              key={path}
              to={path}
              className={`flex flex-col items-center gap-0.5 px-4 py-2 rounded-md transition-colors duration-fast ${
                active ? 'text-primary-light' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon className="w-5 h-5" strokeWidth={active ? 2.5 : 2} />
              <span className="text-xs font-medium">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
