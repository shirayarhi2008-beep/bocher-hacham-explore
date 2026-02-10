import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { parties } from '@/data/parties';
import PartyCard from '@/components/PartyCard';
import ComparisonModal from '@/components/ComparisonModal';
import { Scale } from 'lucide-react';

export default function ListsPage() {
  const [selected, setSelected] = useState<string[]>([]);
  const [compareOpen, setCompareOpen] = useState(false);

  const toggleParty = (id: string) => {
    setSelected(prev => {
      if (prev.includes(id)) return prev.filter(s => s !== id);
      if (prev.length >= 2) return prev;
      return [...prev, id];
    });
  };

  const selectedParties = parties.filter(p => selected.includes(p.id));

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-rubik font-bold text-2xl md:text-3xl text-gradient-primary">רשימות</h1>
        <p className="text-muted-foreground text-sm mt-1">בחרו עד 2 מפלגות להשוואה</p>
      </motion.div>

      {/* Selection status */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center justify-between bg-card rounded-xl p-3 border border-border shadow-card"
      >
        <span className="text-sm font-medium">
          <span className="font-bold text-primary">{selected.length}</span>/2 נבחרו
        </span>
        {selected.length >= 2 && (
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
            <Button
              onClick={() => setCompareOpen(true)}
              className="gradient-primary text-primary-foreground rounded-xl gap-2 shadow-glow"
            >
              <Scale className="w-4 h-4" />
              !השווה
            </Button>
          </motion.div>
        )}
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {parties.map((party, i) => (
          <PartyCard
            key={party.id}
            party={party}
            selected={selected.includes(party.id)}
            onToggle={() => toggleParty(party.id)}
            index={i}
          />
        ))}
      </div>

      <ComparisonModal
        parties={selectedParties}
        open={compareOpen}
        onClose={() => setCompareOpen(false)}
      />
    </div>
  );
}
