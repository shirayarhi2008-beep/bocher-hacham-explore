import { useState, useMemo, useRef, useCallback, useEffect } from 'react';
import { Sparkles, SlidersHorizontal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import CandidateCard from '@/components/CandidateCard';
import FilterPanel, { ActiveFilterChips } from '@/components/FilterPanel';
import { useFilteredCandidates } from '@/hooks/useFilteredCandidates';
import { parties } from '@/data/parties';

const PAGE_SIZE = 24;

const SEARCH_HINTS = [
  'חפש מועמד...',
  'מי הח״כיות החדשות?',
  'מועמדים עם ניסיון צבאי...',
  'מי תומך בגיוס חרדים?',
  'מועמדים ממחוז הצפון...',
  'מי עוסק בחינוך?',
];

function useTypewriter(phrases: string[], typingSpeed = 70, pause = 2200) {
  const [text, setText] = useState('');
  const [phraseIdx, setPhraseIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = phrases[phraseIdx];
    let timeout: ReturnType<typeof setTimeout>;

    if (!deleting && charIdx < current.length) {
      timeout = setTimeout(() => setCharIdx(i => i + 1), typingSpeed);
    } else if (!deleting && charIdx === current.length) {
      timeout = setTimeout(() => setDeleting(true), pause);
    } else if (deleting && charIdx > 0) {
      timeout = setTimeout(() => setCharIdx(i => i - 1), typingSpeed / 2);
    } else if (deleting && charIdx === 0) {
      setDeleting(false);
      setPhraseIdx(i => (i + 1) % phrases.length);
    }

    return () => clearTimeout(timeout);
  }, [charIdx, deleting, phraseIdx, phrases, typingSpeed, pause]);

  useEffect(() => {
    setText(phrases[phraseIdx].slice(0, charIdx));
  }, [charIdx, phraseIdx, phrases]);

  return text;
}

export default function PeoplePage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const {
    candidates, filters, updateFilter, resetFilters,
    activeFilterCount, totalCount, search, setSearch,
  } = useFilteredCandidates();

  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [inputFocused, setInputFocused] = useState(false);
  const observer = useRef<IntersectionObserver>();

  const animatedPlaceholder = useTypewriter(SEARCH_HINTS);

  const lastCardRef = useCallback((node: HTMLDivElement | null) => {
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) setVisibleCount(prev => Math.min(prev + PAGE_SIZE, candidates.length));
    });
    if (node) observer.current.observe(node);
  }, [candidates.length]);

  // reset pagination when filters change
  useEffect(() => { setVisibleCount(PAGE_SIZE); }, [candidates.length]);

  const visible = useMemo(() => candidates.slice(0, visibleCount), [candidates, visibleCount]);

  return (
    <div className="space-y-5">

      {/* Page header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-rubik font-bold text-2xl md:text-3xl text-gradient-primary">מועמדים</h1>
        <p className="text-muted-foreground text-sm mt-1">{totalCount} מועמדים מ-{parties.length} מפלגות</p>
      </motion.div>

      {/* AI Search bar */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="relative"
      >
        {/* Glow ring when focused */}
        <AnimatePresence>
          {inputFocused && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute -inset-0.5 rounded-2xl bg-gradient-to-l from-violet/30 via-primary/20 to-cyan-400/30 blur-sm pointer-events-none"
            />
          )}
        </AnimatePresence>

        <div className="relative flex items-center bg-card border border-border rounded-2xl shadow-card overflow-hidden">
          {/* AI icon */}
          <div className="flex items-center gap-1.5 px-3 border-l border-border shrink-0 h-12">
            <Sparkles className="w-4 h-4 text-violet" />
            <span className="text-xs font-semibold text-violet hidden sm:inline">AI</span>
          </div>

          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            onFocus={() => setInputFocused(true)}
            onBlur={() => setInputFocused(false)}
            placeholder={inputFocused ? '' : animatedPlaceholder}
            className="flex-1 h-12 px-3 bg-transparent text-sm outline-none placeholder:text-muted-foreground/60 text-right"
          />

          {/* Animated cursor when no text typed */}
          {!search && !inputFocused && (
            <span className="absolute left-4 top-1/2 -translate-y-1/2 w-0.5 h-4 bg-muted-foreground/40 animate-pulse" />
          )}

          {/* Filter toggle (mobile) */}
          <button
            onClick={() => setSidebarOpen(o => !o)}
            className={`md:hidden flex items-center gap-1.5 px-3 border-r border-border h-12 text-sm shrink-0 transition-colors ${
              sidebarOpen || activeFilterCount > 0 ? 'text-primary' : 'text-muted-foreground'
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
      </motion.div>

      {/* Body: sidebar (right) + results (left) */}
      <div className="flex gap-6 items-start">

        {/* Filter sidebar — right side in RTL */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.aside
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
              className="w-64 shrink-0 sticky top-20 bg-card border border-border rounded-2xl p-4 shadow-card hidden md:block"
            >
              <FilterPanel filters={filters} onChange={updateFilter} onReset={resetFilters} />
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Results column */}
        <div className="flex-1 min-w-0 space-y-4">

          {/* Active chips */}
          <ActiveFilterChips filters={filters} onChange={updateFilter} onReset={resetFilters} />

          {/* Count */}
          <p className="text-sm text-muted-foreground">
            {candidates.length === totalCount ? `${candidates.length} מועמדים` : `${candidates.length} תוצאות`}
          </p>

          {/* Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {visible.map((c, i) => (
              <div key={c.id} ref={i === visible.length - 1 ? lastCardRef : undefined}>
                <CandidateCard candidate={c} index={i} />
              </div>
            ))}
          </div>

          {candidates.length === 0 && (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-lg">לא נמצאו מועמדים</p>
              <Button variant="link" onClick={resetFilters}>נקה סינונים</Button>
            </div>
          )}
        </div>

        {/* Mobile: filter panel slides in below search (full-width) */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden w-full overflow-hidden absolute right-4 left-4 z-40 top-[calc(theme(spacing.5)*3+theme(spacing.12)+theme(spacing.12))]"
            >
              <div className="bg-card border border-border rounded-2xl p-4 shadow-xl">
                <FilterPanel filters={filters} onChange={updateFilter} onReset={resetFilters} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
