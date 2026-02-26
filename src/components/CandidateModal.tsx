import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Candidate } from '@/data/types';
import { getPartyColor } from '@/data/parties';
import { candidates as allCandidates, getCandidatesByParty } from '@/data/candidates';
import { Badge } from '@/components/ui/badge';
import { MapPin, Briefcase, GraduationCap, Calendar, Clock, Users, ChevronDown, Landmark, MessageSquareQuote } from 'lucide-react';
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

function getListPosition(candidate: Candidate): number {
  const partyCandidates = getCandidatesByParty(candidate.partyId);
  return partyCandidates.findIndex(c => c.id === candidate.id) + 1;
}

export default function CandidateModal({ candidate, open, onOpenChange }: Props) {
  const [showSimilar, setShowSimilar] = useState(false);
  const [selectedSimilar, setSelectedSimilar] = useState<Candidate | null>(null);

  const similar = useMemo(
    () => (candidate ? getSimilarCandidates(candidate, allCandidates) : []),
    [candidate]
  );

  const listPosition = useMemo(
    () => (candidate ? getListPosition(candidate) : 0),
    [candidate]
  );

  if (!candidate) return null;
  const color = getPartyColor(candidate.partyId);

  const infoItems = [
    { icon: Calendar, value: `${candidate.age}` },
    { icon: MapPin, value: candidate.region },
    { icon: Briefcase, value: candidate.profession },
    { icon: GraduationCap, value: candidate.education },
    { icon: Clock, value: `${candidate.seniority} שנות ותק` },
  ];

  if (selectedSimilar) {
    return (
      <CandidateModal
        candidate={selectedSimilar}
        open={open}
        onOpenChange={(o) => {
          if (!o) {
            setSelectedSimilar(null);
            onOpenChange(false);
          }
        }}
      />
    );
  }

  return (
    <Dialog open={open} onOpenChange={(o) => { onOpenChange(o); if (!o) setShowSimilar(false); }}>
      <DialogContent className="max-w-sm rounded-2xl p-0 overflow-hidden max-h-[90vh] overflow-y-auto" dir="rtl">
        {/* Header with party color */}
        <div className="h-28 relative flex items-end justify-center" style={{ backgroundColor: color }}>
          {/* List position badge */}
          <div className="absolute top-3 right-3 bg-background/90 backdrop-blur-sm rounded-lg px-2.5 py-1 shadow-sm">
            <span className="text-xs text-muted-foreground">מקום </span>
            <span className="font-rubik font-bold text-sm" style={{ color }}>#{listPosition}</span>
          </div>
          {/* Photo placeholder */}
          <div className="absolute -bottom-12 w-24 h-24 rounded-2xl bg-card border-4 border-background flex items-center justify-center text-3xl font-bold shadow-lg overflow-hidden" style={{ color }}>
            {candidate.photoUrl ? (
              <img src={candidate.photoUrl} alt={candidate.name} className="w-full h-full object-cover" />
            ) : (
              candidate.name.split(' ').map(n => n[0]).join('')
            )}
          </div>
        </div>

        <div className="pt-14 pb-6 px-5">
          <DialogHeader className="mb-3">
            <DialogTitle className="font-rubik text-xl text-center">{candidate.name}</DialogTitle>
            <div className="flex justify-center mt-1">
              <Link to={`/lists/${candidate.partyId}`} onClick={() => onOpenChange(false)}>
                <Badge variant="secondary" className="cursor-pointer hover:opacity-80 transition-opacity" style={{ backgroundColor: `${color}20`, color }}>
                  {candidate.party}
                </Badge>
              </Link>
            </div>
          </DialogHeader>

          {/* Compact info row */}
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-muted-foreground mb-4">
            {infoItems.map((item, i) => (
              <span key={i} className="flex items-center gap-1 bg-muted/50 rounded-full px-2.5 py-1">
                <item.icon className="w-3 h-3" />
                {item.value}
              </span>
            ))}
          </div>

          {/* Accordion sections */}
          <Accordion type="multiple" className="w-full">
            <AccordionItem value="political-activity">
              <AccordionTrigger className="text-sm font-rubik font-semibold gap-2 hover:no-underline">
                <span className="flex items-center gap-2">
                  <Landmark className="w-4 h-4 text-muted-foreground" />
                  פעילות פוליטית
                </span>
              </AccordionTrigger>
              <AccordionContent>
                <p className="text-sm text-muted-foreground text-center py-4">תוכן יתווסף בקרוב</p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="statements">
              <AccordionTrigger className="text-sm font-rubik font-semibold gap-2 hover:no-underline">
                <span className="flex items-center gap-2">
                  <MessageSquareQuote className="w-4 h-4 text-muted-foreground" />
                  התבטאויות בסוגיות
                </span>
              </AccordionTrigger>
              <AccordionContent>
                <p className="text-sm text-muted-foreground text-center py-4">תוכן יתווסף בקרוב</p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

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

          {/* Similar Candidates Carousel */}
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
                    const scPosition = getListPosition(sc);
                    return (
                      <button
                        key={sc.id}
                        onClick={() => setSelectedSimilar(sc)}
                        className="flex flex-col items-center gap-1.5 min-w-[72px] cursor-pointer hover:opacity-80 transition-opacity"
                      >
                        <div className="relative">
                          <div
                            className="w-14 h-14 rounded-xl flex items-center justify-center text-primary-foreground font-bold text-sm shadow-sm"
                            style={{ backgroundColor: scColor }}
                          >
                            {sc.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-background border border-border flex items-center justify-center">
                            <span className="text-[9px] font-bold" style={{ color: scColor }}>#{scPosition}</span>
                          </div>
                        </div>
                        <p className="text-xs font-medium text-center truncate w-full">{sc.name.split(' ')[0]}</p>
                        <p className="text-[10px] text-muted-foreground text-center truncate w-full">{sc.party}</p>
                      </button>
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
