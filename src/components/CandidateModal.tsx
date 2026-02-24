import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Candidate } from '@/data/types';
import { getPartyColor } from '@/data/parties';
import { candidates as allCandidates } from '@/data/candidates';
import { Badge } from '@/components/ui/badge';
import { User, MapPin, Briefcase, GraduationCap, Calendar, Clock, Users, ChevronDown, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  candidate: Candidate | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function getSimilarCandidates(candidate: Candidate, all: Candidate[]): Candidate[] {
  const others = all.filter(c => c.id !== candidate.id);
  const scored = others.map(c => {
    let score = 0;
    if (c.profession === candidate.profession) score += 3;
    if (c.gender === candidate.gender) score += 2;
    if (c.region === candidate.region) score += 2;
    if (c.education === candidate.education) score += 1;
    if (Math.abs(c.age - candidate.age) <= 5) score += 1;
    return { candidate: c, score };
  });
  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, 4).map(s => s.candidate);
}

export default function CandidateModal({ candidate, open, onOpenChange }: Props) {
  const [showSimilar, setShowSimilar] = useState(false);

  const similar = useMemo(
    () => (candidate ? getSimilarCandidates(candidate, allCandidates) : []),
    [candidate]
  );

  if (!candidate) return null;
  const color = getPartyColor(candidate.partyId);

  const fields = [
    { icon: User, label: 'מגדר', value: candidate.gender === 'male' ? 'זכר' : 'נקבה' },
    { icon: Calendar, label: 'גיל', value: `${candidate.age}` },
    { icon: MapPin, label: 'אזור', value: candidate.region },
    { icon: Briefcase, label: 'מקצוע', value: candidate.profession },
    { icon: GraduationCap, label: 'השכלה', value: candidate.education },
    { icon: Clock, label: 'ותק פוליטי', value: `${candidate.seniority} שנים` },
  ];

  return (
    <Dialog open={open} onOpenChange={(o) => { onOpenChange(o); if (!o) setShowSimilar(false); }}>
      <DialogContent className="max-w-sm rounded-2xl p-0 overflow-hidden max-h-[90vh] overflow-y-auto" dir="rtl">
        {/* Header with party color */}
        <div className="h-24 relative flex items-end justify-center" style={{ backgroundColor: color }}>
          <div className="absolute -bottom-10 w-20 h-20 rounded-2xl bg-card border-4 border-background flex items-center justify-center text-2xl font-bold shadow-lg" style={{ color }}>
            {candidate.name.split(' ').map(n => n[0]).join('')}
          </div>
        </div>

        <div className="pt-12 pb-6 px-5">
          <DialogHeader className="mb-4">
            <DialogTitle className="font-rubik text-xl text-center">{candidate.name}</DialogTitle>
            <div className="flex justify-center mt-1">
              <Link to={`/lists/${candidate.partyId}`} onClick={() => onOpenChange(false)}>
                <Badge variant="secondary" className="cursor-pointer hover:opacity-80 transition-opacity" style={{ backgroundColor: `${color}20`, color }}>
                  {candidate.party}
                </Badge>
              </Link>
            </div>
            <p className="text-xs text-muted-foreground text-center mt-1">מזהה: {candidate.id}</p>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-3">
            {fields.map(f => (
              <div key={f.label} className="bg-muted/50 rounded-xl p-3 flex items-start gap-2">
                <f.icon className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">{f.label}</p>
                  <p className="text-sm font-medium">{f.value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Similar Candidates Button */}
          <button
            onClick={() => setShowSimilar(prev => !prev)}
            className="mt-5 w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-border bg-muted/30 hover:bg-muted/60 transition-colors text-sm font-medium cursor-pointer"
          >
            <Users className="w-4 h-4 text-muted-foreground" />
            <span>{showSimilar ? 'הסתר מתמודדים דומים' : 'לעוד מתמודדים דומים'}</span>
            <motion.div animate={{ rotate: showSimilar ? 180 : 0 }} transition={{ duration: 0.2 }}>
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            </motion.div>
          </button>

          {/* Similar Candidates Section */}
          <AnimatePresence>
            {showSimilar && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="mt-3 flex gap-3 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>
                  {similar.map(sc => {
                    const scColor = getPartyColor(sc.partyId);
                    return (
                      <div key={sc.id} className="flex flex-col items-center gap-1.5 min-w-[72px]">
                        <div
                          className="w-14 h-14 rounded-xl flex items-center justify-center text-primary-foreground font-bold text-sm shadow-sm"
                          style={{ backgroundColor: scColor }}
                        >
                          {sc.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <p className="text-xs font-medium text-center truncate w-full">{sc.name.split(' ')[0]}</p>
                        <p className="text-[10px] text-muted-foreground text-center truncate w-full">{sc.party}</p>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
}
