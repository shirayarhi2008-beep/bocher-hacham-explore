import { useState } from 'react';
import { Star, ChevronDown, MapPin, Calendar, Shield, Lightbulb, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
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
  const [expanded, setExpanded] = useState(false);

  const hasMilitary = candidate.militaryType || candidate.militaryRank;
  const location = candidate.city || candidate.district;

  return (
    <>
      <motion.div
        layout
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: Math.min(index * 0.04, 0.6), duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="bg-card rounded-2xl border border-border shadow-card hover:shadow-card-hover transition-shadow duration-300 relative overflow-hidden"
      >
        {/* Color accent bar */}
        <div className="absolute top-0 left-0 right-0 h-[3px] rounded-t-2xl" style={{ backgroundColor: color }} />

        {/* Main row — always visible */}
        <div
          className="flex items-start gap-3 p-4 cursor-pointer select-none"
          onClick={() => setExpanded(e => !e)}
        >
          {/* Avatar */}
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-rubik font-bold text-base shrink-0 shadow-sm"
            style={{ backgroundColor: color }}
          >
            {candidate.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span
                className="text-[11px] font-bold px-1.5 py-0.5 rounded-md"
                style={{ backgroundColor: `${color}20`, color }}
              >
                #{candidate.listPosition}
              </span>
              <h3 className="font-rubik font-bold text-sm leading-tight">{candidate.name}</h3>
              {candidate.isNewcomer && (
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-emerald/15 text-emerald">חדש</span>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">{candidate.party}</p>

            <div className="flex gap-1.5 mt-2 flex-wrap">
              {candidate.ticket1 && (
                <span className="text-[11px] bg-muted text-muted-foreground px-2 py-0.5 rounded-full">{candidate.ticket1}</span>
              )}
              {candidate.ticket2 && (
                <span className="text-[11px] bg-muted text-muted-foreground px-2 py-0.5 rounded-full">{candidate.ticket2}</span>
              )}
              {!candidate.ticket1 && candidate.profession && (
                <span className="text-[11px] bg-muted text-muted-foreground px-2 py-0.5 rounded-full">{candidate.profession}</span>
              )}
            </div>
          </div>

          <div className="flex flex-col items-center gap-2 shrink-0">
            {/* Favorite */}
            <motion.button
              whileTap={{ scale: 0.8 }}
              onClick={e => { e.stopPropagation(); toggleFavorite(candidate.id); }}
              className="p-1"
            >
              <motion.div animate={fav ? { scale: [1, 1.4, 1] } : {}} transition={{ duration: 0.3 }}>
                <Star className={`w-4 h-4 transition-colors duration-200 ${fav ? 'text-amber fill-amber' : 'text-muted-foreground/40 hover:text-amber/60'}`} />
              </motion.div>
            </motion.button>

            {/* Expand chevron */}
            <motion.div
              animate={{ rotate: expanded ? 180 : 0 }}
              transition={{ duration: 0.22 }}
            >
              <ChevronDown className="w-3.5 h-3.5 text-muted-foreground/50" />
            </motion.div>
          </div>
        </div>

        {/* Expanded content */}
        <AnimatePresence initial={false}>
          {expanded && (
            <motion.div
              key="expand"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden"
            >
              <div className="px-4 pb-4 space-y-3">
                <div className="h-px bg-border" />

                {/* Quick facts row */}
                <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                  {candidate.age && (
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {candidate.age}
                    </span>
                  )}
                  {location && (
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {location}
                    </span>
                  )}
                  {hasMilitary && (
                    <span className="flex items-center gap-1">
                      <Shield className="w-3 h-3" />
                      {candidate.militaryRank || candidate.militaryType}
                    </span>
                  )}
                  {candidate.orientation && candidate.orientation !== 'all' && (
                    <span
                      className="px-2 py-0.5 rounded-full text-[10px] font-semibold"
                      style={{ backgroundColor: `${color}15`, color }}
                    >
                      {candidate.orientation}
                    </span>
                  )}
                </div>

                {/* Fun fact */}
                {candidate.funFact && (
                  <div className="flex items-start gap-2 rounded-xl bg-amber/8 border border-amber/20 px-3 py-2">
                    <Lightbulb className="w-3.5 h-3.5 text-amber shrink-0 mt-0.5" />
                    <p className="text-xs text-foreground/80 leading-relaxed">{candidate.funFact}</p>
                  </div>
                )}

                {/* Draft stance */}
                {candidate.stanceDraft && (
                  <div className="text-xs">
                    <span className="text-muted-foreground">עמדה – גיוס חרדים: </span>
                    <span className="font-medium text-foreground">{candidate.stanceDraft}</span>
                  </div>
                )}

                {/* Open full profile */}
                <button
                  onClick={e => { e.stopPropagation(); setModalOpen(true); }}
                  className="flex items-center gap-1.5 text-xs font-semibold mt-1 transition-colors duration-200"
                  style={{ color }}
                >
                  פרופיל מלא
                  <ArrowLeft className="w-3 h-3" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <CandidateModal candidate={candidate} open={modalOpen} onOpenChange={setModalOpen} />
    </>
  );
}
