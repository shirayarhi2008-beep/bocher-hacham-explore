import { useState, useMemo, useRef, useCallback } from 'react';
import { Search, Dice5 } from 'lucide-react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import CandidateCard from '@/components/CandidateCard';
import { useFilteredCandidates } from '@/hooks/useFilteredCandidates';
import { parties } from '@/data/parties';
import { useNavigate } from 'react-router-dom';

const PAGE_SIZE = 24;

export default function PeoplePage() {
  const navigate = useNavigate();
  const {
    candidates, search, setSearch,
    genderFilter, setGenderFilter,
    regionFilter, setRegionFilter,
    partyFilter, setPartyFilter,
    randomCandidate, regions, totalCount,
  } = useFilteredCandidates();

  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const observer = useRef<IntersectionObserver>();

  const lastCardRef = useCallback((node: HTMLDivElement | null) => {
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && visibleCount < candidates.length) {
        setVisibleCount(prev => Math.min(prev + PAGE_SIZE, candidates.length));
      }
    });
    if (node) observer.current.observe(node);
  }, [visibleCount, candidates.length]);

  const visible = useMemo(() => candidates.slice(0, visibleCount), [candidates, visibleCount]);

  const handleSurprise = () => {
    const c = randomCandidate();
    setSearch(c.name);
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-rubik font-bold text-2xl md:text-3xl text-gradient-primary">אנשים</h1>
        <p className="text-muted-foreground text-sm mt-1">{totalCount} מועמדים מ-{parties.length} מפלגות</p>
      </motion.div>

      {/* Search & Filters */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="space-y-3"
      >
        <div className="relative">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="חפש מועמד..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pr-10 rounded-xl h-12 bg-card border-border shadow-card"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <Select value={genderFilter} onValueChange={setGenderFilter}>
            <SelectTrigger className="w-[120px] rounded-xl bg-card">
              <SelectValue placeholder="מגדר" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">כל המגדרים</SelectItem>
              <SelectItem value="male">גברים</SelectItem>
              <SelectItem value="female">נשים</SelectItem>
            </SelectContent>
          </Select>

          <Select value={regionFilter} onValueChange={setRegionFilter}>
            <SelectTrigger className="w-[120px] rounded-xl bg-card">
              <SelectValue placeholder="אזור" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">כל האזורים</SelectItem>
              {regions.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
            </SelectContent>
          </Select>

          <Select value={partyFilter} onValueChange={setPartyFilter}>
            <SelectTrigger className="w-[130px] rounded-xl bg-card">
              <SelectValue placeholder="מפלגה" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">כל המפלגות</SelectItem>
              {parties.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
            </SelectContent>
          </Select>

        </div>
      </motion.div>

      {/* Results */}
      <p className="text-sm text-muted-foreground">{candidates.length} תוצאות</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {visible.map((c, i) => (
          <div key={c.id} ref={i === visible.length - 1 ? lastCardRef : undefined}>
            <CandidateCard candidate={c} index={i} />
          </div>
        ))}
      </div>

      {candidates.length === 0 && (
        <div className="text-center py-16">
          <p className="text-muted-foreground text-lg">לא נמצאו מועמדים</p>
          <Button variant="link" onClick={() => { setSearch(''); setGenderFilter('all'); setRegionFilter('all'); setPartyFilter('all'); }}>
            נקה סינונים
          </Button>
        </div>
      )}
    </div>
  );
}
