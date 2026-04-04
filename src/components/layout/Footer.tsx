import { Link } from 'react-router-dom';
import { Facebook, Instagram } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-border bg-card/50 mt-8 mb-16 md:mb-0" dir="rtl">
      <div className="container mx-auto px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
        {/* Brand */}
        <span className="font-rubik font-semibold text-foreground">בוחרים ח״כם</span>

        {/* Links */}
        <div className="flex items-center gap-6">
          <Link to="/about" className="hover:text-foreground transition-colors">אודות</Link>
        </div>

        {/* Social */}
        <div className="flex items-center gap-3">
          <a href="https://facebook.com/placeholder" target="_blank" rel="noopener noreferrer" aria-label="פייסבוק" className="hover:text-foreground transition-colors">
            <Facebook className="w-4 h-4" />
          </a>
          <a href="https://instagram.com/placeholder" target="_blank" rel="noopener noreferrer" aria-label="אינסטגרם" className="hover:text-foreground transition-colors">
            <Instagram className="w-4 h-4" />
          </a>
          <a href="https://tiktok.com/@placeholder" target="_blank" rel="noopener noreferrer" aria-label="טיקטוק" className="hover:text-foreground transition-colors text-xs font-bold">
            TT
          </a>
        </div>
      </div>
    </footer>
  );
}
