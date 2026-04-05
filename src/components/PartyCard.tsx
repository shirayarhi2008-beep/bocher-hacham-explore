import { Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { Party } from '@/data/types';

interface Props {
  party: Party;
}

export default function PartyCard({ party }: Props) {
  return (
    <Link
      to={`/lists/${party.id}`}
      className="flex items-center gap-4 bg-white border border-border rounded-lg p-4 pr-3 hover:-translate-y-1 hover:shadow-md transition-all duration-normal group"
      style={{ borderRightWidth: 4, borderRightColor: party.color }}
    >
      {/* Ballot letter badge */}
      <div
        className="w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 leading-none"
        style={{ backgroundColor: party.color }}
      >
        {party.ballotLetter ?? party.name.slice(0, 1)}
      </div>

      {/* Text */}
      <div className="flex-1 min-w-0">
        <h3 className="font-extrabold text-foreground text-base leading-tight">{party.name}</h3>
        <p className="text-xs text-gray-400 mt-0.5">{party.candidates} מועמדים ברשימה</p>
      </div>

      <ChevronLeft className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
    </Link>
  );
}
