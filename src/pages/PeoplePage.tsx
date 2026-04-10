import { useState, useMemo, useRef, useCallback, useEffect } from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { useFilteredCandidates } from '@/hooks/useFilteredCandidates';
import { parties } from '@/data/parties';
import CandidateCard from '@/components/CandidateCard';
import FilterPanel, { ActiveFilterChips } from '@/components/FilterPanel';

const PAGE_SIZE = 24;

export default function PeoplePage() {
  const [searchParams] = useSearchParams();
  const {
    candidates, filters, updateFilter, resetFilters,
    activeFilterCount, totalCount, search, setSearch,
  } = useFilteredCandidates();

  // Initialize search from URL param once on mount (e.g. /people?q=גלנט)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const q = searchParams.get('q');
    if (q) setSearch(q);
  }, [searchParams.get('q')]);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const observer = useRef<IntersectionObserver>();

  const lastCardRef = useCallback((node: HTMLDivElement | null) => {
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) setVisibleCount(p => Math.min(p + PAGE_SIZE, candidates.length));
    });
    if (node) observer.current.observe(node);
  }, [candidates.length]);

  useEffect(() => { setVisibleCount(PAGE_SIZE); }, [candidates.length]);

  const visible = useMemo(() => candidates.slice(0, visibleCount), [candidates, visibleCount]);

  const PARTY_COLORS = ['#2952d9', '#5982fe', '#50bab6', '#88b12d', '#fa8501', '#f9bc01'];

  // Group visible candidates by party, preserving order of first appearance
  const grouped = useMemo(() => {
    const map = new Map<string, { name: string; color: string; members: typeof visible }>();
    let colorIdx = 0;
    visible.forEach(c => {
      if (!map.has(c.partyId)) {
        map.set(c.partyId, {
          name: c.party,
          color: PARTY_COLORS[colorIdx++ % PARTY_COLORS.length],
          members: [],
        });
      }
      map.get(c.partyId)!.members.push(c);
    });
    return [...map.values()];
  }, [visible]);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h1 className="font-bold text-2xl md:text-3xl text-foreground">מועמדים</h1>
        <p className="text-muted-foreground text-sm mt-1">
          {totalCount} מועמדים מ-{parties.length} רשימות
        </p>
      </div>

      {/* Search row */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="חיפוש לפי שם, מפלגה, תחום..."
            className="w-full h-10 pr-9 pl-3 bg-white border border-border rounded-md text-sm outline-none focus:border-primary transition-colors duration-fast placeholder:text-muted-foreground/60"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filter toggle — mobile only */}
        <button
          onClick={() => setSidebarOpen(o => !o)}
          className={`md:hidden h-10 px-3 flex items-center gap-1.5 border rounded-md text-sm transition-colors duration-fast ${
            activeFilterCount > 0
              ? 'border-primary text-primary bg-primary/5'
              : sidebarOpen
                ? 'border-primary-light text-primary-light bg-primary-light/5'
                : 'border-border text-muted-foreground hover:text-foreground'
          }`}
        >
          <SlidersHorizontal className="w-4 h-4" />
          {activeFilterCount > 0 && (
            <span className="w-4 h-4 rounded-full bg-primary text-white text-[10px] font-bold flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      {/* Mobile filter panel — inline, not absolute */}
      {sidebarOpen && (
        <div className="md:hidden bg-white border border-border rounded-lg p-4 shadow-card">
          <FilterPanel filters={filters} onChange={updateFilter} onReset={resetFilters} />
        </div>
      )}

      {/* Body: sidebar + results */}
      <div className="flex gap-6 items-start">
        {/* Desktop sidebar */}
        <aside className="w-60 shrink-0 sticky top-20 hidden md:block">
          <div className="bg-white border border-border rounded-lg p-4 shadow-card">
            <FilterPanel filters={filters} onChange={updateFilter} onReset={resetFilters} />
          </div>
        </aside>

        {/* Results */}
        <div className="flex-1 min-w-0 space-y-4">
          <ActiveFilterChips filters={filters} onChange={updateFilter} onReset={resetFilters} />

          <p className="text-sm text-muted-foreground">
            {candidates.length === totalCount
              ? `${candidates.length} מועמדים`
              : `${candidates.length} תוצאות`}
          </p>

          <div className="space-y-8">
            {grouped.map((group, gi) => (
              <div key={group.name}>
                {/* Party header */}
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: group.color }} />
                  <span className="font-semibold text-sm text-foreground">{group.name}</span>
                  <span className="text-xs text-muted-foreground">({group.members.length})</span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-3">
                  {group.members.map((c, ci) => {
                    const isLast = gi === grouped.length - 1 && ci === group.members.length - 1;
                    return (
                      <div key={c.id} ref={isLast ? lastCardRef : undefined}>
                        <CandidateCard candidate={c} accentColor={group.color} />
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {candidates.length === 0 && (
            <div className="text-center py-16">
              <p className="text-muted-foreground">לא נמצאו מועמדים</p>
              <button
                onClick={resetFilters}
                className="mt-2 text-sm text-primary hover:underline"
              >
                נקה סינונים
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
