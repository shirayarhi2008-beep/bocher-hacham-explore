import { useState } from 'react';
import { Search, GitCompareArrows } from 'lucide-react';
import { parties } from '@/data/parties';
import { candidates } from '@/data/candidates';
import PartyCard from '@/components/PartyCard';
import { useCompare } from '@/context/CompareContext';

// Count actual candidates per party from TSV data
const actualCounts: Record<string, number> = {};
for (const c of candidates) {
  actualCounts[c.partyId] = (actualCounts[c.partyId] ?? 0) + 1;
}

// Merge actual counts and drop parties with 0 candidates
const partiesWithData = parties
  .map(p => ({ ...p, candidates: actualCounts[p.id] ?? 0 }))
  .filter(p => p.candidates > 0);

export default function ListsPage() {
  const [search, setSearch] = useState('');
  const { openModal } = useCompare();

  const filtered = partiesWithData.filter(p =>
    p.name.includes(search) || p.ballotLetter?.includes(search)
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-bold text-2xl md:text-3xl text-foreground">רשימות</h1>
        <span className="inline-flex items-center gap-1.5 bg-primary/8 text-primary text-xs font-semibold px-3 py-1.5 rounded-pill border border-primary/20">
          <span className="w-1.5 h-1.5 rounded-full bg-primary" />
          {filtered.length} מתמודדות
        </span>
      </div>

      <div className="relative">
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="חיפוש רשימה..."
          className="w-full h-10 pr-9 pl-3 bg-white border border-border rounded-md text-sm outline-none focus:border-primary transition-colors duration-fast placeholder:text-muted-foreground/60"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {filtered.map(party => (
          <PartyCard key={party.id} party={party} />
        ))}
        {filtered.length === 0 && (
          <p className="col-span-2 text-center text-muted-foreground text-sm py-10">לא נמצאה רשימה</p>
        )}
      </div>

      {/* Compare CTA */}
      <div className="flex justify-center pt-2">
        <button
          onClick={() => openModal()}
          className="inline-flex items-center gap-2 bg-white border border-border text-foreground font-semibold px-5 py-3 rounded-pill text-sm hover:border-primary hover:text-primary transition-colors shadow-sm"
        >
          <GitCompareArrows className="w-4 h-4" />
          השוואה בין מפלגות
        </button>
      </div>
    </div>
  );
}
