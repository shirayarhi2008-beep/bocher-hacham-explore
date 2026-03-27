import { useState } from 'react';
import { Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { Candidate } from '@/data/types';
import { getPartyColor } from '@/data/parties';
import { useFavoritesContext } from '@/contexts/FavoritesContext';
import CandidateModal from './CandidateModal';

interface Props {
  candidate: Candidate;
  index: number;
}

export default function CandidateCard({ candidate, index }: Props) {
  const { isFavorite, toggleFavorite } = useFavoritesContext();
  const fav = isFavorite(candidate.id);
  const color = getPartyColor(candidate.partyId);
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: Math.min(index * 0.03, 0.5), duration: 0.4 }}
        whileHover={{ y: -4, transition: { duration: 0.2 } }}
        onClick={() => setModalOpen(true)}
        className="bg-card rounded-2xl border border-border p-4 shadow-card hover:shadow-card-hover transition-shadow duration-300 group relative overflow-hidden cursor-pointer"
      >
        {/* Color accent top bar */}
        <div className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl" style={{ backgroundColor: color }} />

        <div className="flex items-start gap-3">
          {/* Avatar */}
          <div
            className="w-14 h-14 rounded-xl flex items-center justify-center text-white font-bold text-lg shrink-0 shadow-sm"
            style={{ backgroundColor: color }}
          >
            {candidate.name.split(' ').map(n => n[0]).join('')}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-muted-foreground bg-muted px-1.5 py-0.5 rounded-md">#{candidate.listPosition}</span>
              <h3 className="font-rubik font-bold text-sm truncate">{candidate.name}</h3>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">{candidate.party}</p>
            <div className="flex gap-2 mt-2 flex-wrap">
              <span className="text-xs bg-muted px-2 py-0.5 rounded-full">{candidate.region}</span>
              <span className="text-xs bg-muted px-2 py-0.5 rounded-full">{candidate.profession}</span>
            </div>
          </div>

          {/* Favorite star */}
          <motion.button
            whileTap={{ scale: 0.8 }}
            onClick={(e) => { e.stopPropagation(); toggleFavorite(candidate.id); }}
            className="shrink-0 p-1"
          >
            <motion.div animate={fav ? { scale: [1, 1.3, 1] } : {}} transition={{ duration: 0.3 }}>
              <Star
                className={`w-5 h-5 transition-colors duration-300 ${
                  fav ? 'text-amber fill-amber' : 'text-muted-foreground/40 hover:text-amber/60'
                }`}
              />
            </motion.div>
          </motion.button>
        </div>
      </motion.div>

      <CandidateModal candidate={candidate} open={modalOpen} onOpenChange={setModalOpen} />
    </>
  );
}
