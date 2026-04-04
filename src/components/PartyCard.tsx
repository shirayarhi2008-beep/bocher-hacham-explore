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
      className="block bg-white border border-border rounded-lg p-5 hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-normal group"
    >
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-foreground">{party.name}</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            {party.candidates} מועמדים ברשימה
          </p>
        </div>
        <ChevronLeft
          className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors duration-fast shrink-0"
        />
      </div>
    </Link>
  );
}
