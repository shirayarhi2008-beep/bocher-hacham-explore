import { useState } from 'react';
import { Search } from 'lucide-react';
import { parties } from '@/data/parties';
import PartyCard from '@/components/PartyCard';

export default function ListsPage() {
  const [search, setSearch] = useState('');

  const filtered = parties.filter(p =>
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
    </div>
  );
}
