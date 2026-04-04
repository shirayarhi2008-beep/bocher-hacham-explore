import { parties } from '@/data/parties';
import PartyCard from '@/components/PartyCard';

export default function ListsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-bold text-2xl md:text-3xl text-foreground">מפלגות</h1>
        <p className="text-muted-foreground text-sm mt-1">{parties.length} מפלגות מתמודדות בבחירות</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {parties.map(party => (
          <PartyCard key={party.id} party={party} />
        ))}
      </div>
    </div>
  );
}
