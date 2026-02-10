import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Party } from '@/data/types';
import { Button } from '@/components/ui/button';

interface Props {
  parties: Party[];
  open: boolean;
  onClose: () => void;
}

export default function ComparisonModal({ parties, open, onClose }: Props) {
  if (parties.length < 2) return null;

  const metrics = [
    { label: 'מנדטים', key: 'seats' },
    { label: 'מועמדים', key: 'candidates' },
    { label: '% נשים', key: 'genderRatio' },
    { label: 'גיל ממוצע', key: 'avgAge' },
    { label: 'ותק ממוצע', key: 'avgSeniority' },
    { label: '% אקדמאים', key: 'educationAcademic' },
  ] as const;

  const getValue = (party: Party, key: string): number | string => {
    if (key === 'educationAcademic') return party.educationBreakdown.academic + '%';
    return (party as any)[key];
  };

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
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            transition={{ type: 'spring', damping: 25 }}
            className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-[600px] md:max-h-[80vh] bg-card rounded-2xl shadow-xl border border-border z-50 flex flex-col overflow-hidden"
          >
            <div className="p-4 border-b border-border flex items-center justify-between">
              <h2 className="font-rubik font-bold text-lg">השוואת מפלגות</h2>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="w-5 h-5" />
              </Button>
            </div>

            <div className="overflow-y-auto p-4">
              {/* Party headers */}
              <div className="grid gap-4" style={{ gridTemplateColumns: `120px repeat(${parties.length}, 1fr)` }}>
                <div />
                {parties.map(p => (
                  <div key={p.id} className="text-center">
                    <div
                      className="w-12 h-12 rounded-xl mx-auto flex items-center justify-center text-white font-bold text-sm shadow-sm"
                      style={{ backgroundColor: p.color }}
                    >
                      {p.name.slice(0, 2)}
                    </div>
                    <p className="font-rubik font-bold text-sm mt-2">{p.name}</p>
                  </div>
                ))}
              </div>

              {/* Metrics rows */}
              <div className="mt-6 space-y-2">
                {metrics.map((metric, i) => (
                  <motion.div
                    key={metric.key}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="grid gap-4 items-center py-3 border-b border-border/50 last:border-b-0"
                    style={{ gridTemplateColumns: `120px repeat(${parties.length}, 1fr)` }}
                  >
                    <span className="text-sm text-muted-foreground font-medium">{metric.label}</span>
                    {parties.map(p => (
                      <span key={p.id} className="text-center font-bold text-sm" style={{ color: p.color }}>
                        {getValue(p, metric.key)}
                      </span>
                    ))}
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
