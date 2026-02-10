import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { Party } from '@/data/types';

interface Props {
  party: Party;
  selected: boolean;
  onToggle: () => void;
  index: number;
}

export default function PartyCard({ party, selected, onToggle, index }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
      onClick={onToggle}
      className={`bg-card rounded-2xl border-2 p-5 shadow-card hover:shadow-card-hover transition-all duration-300 cursor-pointer relative overflow-hidden ${
        selected ? 'border-primary shadow-glow' : 'border-border'
      }`}
    >
      {/* Party color bar */}
      <div className="absolute top-0 left-0 right-0 h-1.5" style={{ backgroundColor: party.color }} />

      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-sm"
            style={{ backgroundColor: party.color }}
          >
            {party.name.slice(0, 2)}
          </div>
          <div>
            <h3 className="font-rubik font-bold">{party.name}</h3>
            <p className="text-xs text-muted-foreground">{party.seats} מנדטים · {party.candidates} מועמדים</p>
          </div>
        </div>

        <div
          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
            selected
              ? 'gradient-primary border-transparent'
              : 'border-muted-foreground/30'
          }`}
        >
          {selected && <Check className="w-4 h-4 text-primary-foreground" />}
        </div>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2 text-center">
        <div className="bg-muted/50 rounded-lg p-2">
          <p className="text-xs text-muted-foreground">נשים</p>
          <p className="font-bold text-sm" style={{ color: party.color }}>{party.genderRatio}%</p>
        </div>
        <div className="bg-muted/50 rounded-lg p-2">
          <p className="text-xs text-muted-foreground">גיל ממוצע</p>
          <p className="font-bold text-sm" style={{ color: party.color }}>{party.avgAge}</p>
        </div>
        <div className="bg-muted/50 rounded-lg p-2">
          <p className="text-xs text-muted-foreground">ותק</p>
          <p className="font-bold text-sm" style={{ color: party.color }}>{party.avgSeniority}y</p>
        </div>
      </div>
    </motion.div>
  );
}
