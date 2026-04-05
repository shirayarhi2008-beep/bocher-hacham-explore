import { parties } from '@/data/parties';
import PartyCard from '@/components/PartyCard';

export default function ListsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-bold text-2xl md:text-3xl text-foreground">מפלגות</h1>
        <span className="inline-flex items-center gap-1.5 bg-primary/8 text-primary text-xs font-semibold px-3 py-1.5 rounded-pill border border-primary/20">
          <span className="w-1.5 h-1.5 rounded-full bg-primary" />
          {parties.length} מתמודדות
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {parties.map(party => (
          <PartyCard key={party.id} party={party} />
        ))}
      </div>
    </div>
  );
}
