import { Link, useLocation } from 'react-router-dom';
import { Star, Share2, Copy, MessageCircle, Facebook, Image, FileText } from 'lucide-react';
import { useFavoritesContext } from '@/contexts/FavoritesContext';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';

export default function Header({ onOpenFavorites }: { onOpenFavorites: () => void }) {
  const { count } = useFavoritesContext();
  const [shareOpen, setShareOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { label: 'אנשים', path: '/' },
    { label: 'רשימות', path: '/lists' },
    { label: 'חקר', path: '/explore' },
  ];

  const isActive = (path: string) => location.pathname === path;

  const shareActions = [
    { icon: Copy, label: 'העתק קישור', action: () => navigator.clipboard.writeText(window.location.href) },
    { icon: MessageCircle, label: 'שתף בווטסאפ', action: () => window.open(`https://wa.me/?text=${encodeURIComponent(window.location.href)}`) },
    { icon: Facebook, label: 'שתף בפייסבוק', action: () => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`) },
    { icon: Image, label: 'שמור כתמונה', action: () => {} },
    { icon: FileText, label: 'ייצא PDF', action: () => {} },
  ];

  return (
    <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-xl border-b border-border shadow-sm">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center shadow-glow group-hover:scale-110 transition-transform duration-300">
            <span className="text-primary-foreground font-bold text-sm">בח</span>
          </div>
          <span className="font-rubik font-bold text-lg text-gradient-primary hidden sm:block">בוחר חכם</span>
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

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Share */}
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShareOpen(!shareOpen)}
              className="hover:bg-muted"
            >
              <Share2 className="w-5 h-5" />
            </Button>
            <AnimatePresence>
              {shareOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -5 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -5 }}
                  className="absolute left-0 top-full mt-2 bg-card rounded-xl shadow-lg border border-border p-2 min-w-[180px] z-50"
                >
                  {shareActions.map(({ icon: Icon, label, action }) => (
                    <button
                      key={label}
                      onClick={() => { action(); setShareOpen(false); }}
                      className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm hover:bg-muted transition-colors text-right"
                    >
                      <Icon className="w-4 h-4 text-muted-foreground" />
                      <span>{label}</span>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Favorites */}
          <Button
            variant="ghost"
            onClick={onOpenFavorites}
            className="relative hover:bg-muted gap-1"
          >
            <Star className="w-5 h-5 text-amber fill-amber" />
            {count > 0 && (
              <motion.span
                key={count}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="bg-accent text-accent-foreground text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center"
              >
                {count}
              </motion.span>
            )}
          </Button>
        </div>
      </div>
    </header>
  );
}
