import { motion, AnimatePresence } from 'framer-motion';
import { X, Share2, Trash2, Star } from 'lucide-react';
import { useFavoritesContext } from '@/contexts/FavoritesContext';
import { candidates } from '@/data/candidates';
import { getPartyColor } from '@/data/parties';
import { Button } from '@/components/ui/button';

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function FavoritesDrawer({ open, onClose }: Props) {
  const { favorites, toggleFavorite, clearAll } = useFavoritesContext();
  const favCandidates = candidates.filter(c => favorites.includes(c.id));

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-50"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-card z-50 shadow-xl border-l border-border flex flex-col"
          >
            <div className="p-4 border-b border-border flex items-center justify-between">
              <h2 className="font-rubik font-bold text-lg flex items-center gap-2">
                <Star className="w-5 h-5 text-amber fill-amber" />
                המועדפים שלי
              </h2>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="w-5 h-5" />
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {favCandidates.length === 0 ? (
                <p className="text-muted-foreground text-center py-8 text-sm">
                  עדיין לא בחרת מועדפים
                </p>
              ) : (
                favCandidates.map(c => (
                  <motion.div
                    key={c.id}
                    layout
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 group"
                  >
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-primary-foreground font-bold text-sm"
                      style={{ backgroundColor: getPartyColor(c.partyId) }}
                    >
                      {c.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{c.name}</p>
                      <p className="text-xs text-muted-foreground">{c.party}</p>
                    </div>
                    <button
                      onClick={() => toggleFavorite(c.id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </motion.div>
                ))
              )}
            </div>

            {favCandidates.length > 0 && (
              <div className="p-4 border-t border-border space-y-2">
                <Button className="w-full gradient-primary text-primary-foreground" onClick={() => {
                  const names = favCandidates.map(c => c.name).join(', ');
                  navigator.clipboard.writeText(`הנבחרת שלי: ${names}`);
                }}>
                  <Share2 className="w-4 h-4" />
                  שתף את הנבחרת שלי
                </Button>
                <Button variant="ghost" className="w-full text-destructive" onClick={clearAll}>
                  <Trash2 className="w-4 h-4" />
                  נקה הכל
                </Button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
