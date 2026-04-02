import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Check, RotateCcw, X } from 'lucide-react';
import { parties } from '@/data/parties';
import {
  CandidateFilters,
  DEFAULT_FILTERS,
  ALL_TOPICS,
  MAX_LIST_POSITION,
} from '@/hooks/useFilteredCandidates';

// ── Helpers ──────────────────────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest mb-2">
      {children}
    </p>
  );
}

function SegmentedControl({
  options,
  value,
  onChange,
}: {
  options: { label: string; value: string }[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex gap-1 bg-muted/60 rounded-xl p-1">
      {options.map(opt => (
        <button
          key={opt.value}
          onClick={() => onChange(value === opt.value ? 'all' : opt.value)}
          className={`flex-1 text-xs font-medium py-1.5 rounded-lg transition-all duration-200 ${
            value === opt.value
              ? 'bg-card shadow text-foreground font-semibold'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

// ── Multi-select dropdown ────────────────────────────────────────────────────

function MultiSelectDropdown({
  label,
  items,
  selected,
  onToggle,
  getColor,
}: {
  label: string;
  items: { id: string; name: string }[];
  selected: string[];
  onToggle: (id: string) => void;
  getColor?: (id: string) => string | undefined;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        className={`w-full flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl border text-sm transition-all duration-200 ${
          selected.length > 0
            ? 'border-primary bg-primary/5 text-foreground'
            : 'border-border bg-card text-muted-foreground hover:border-foreground/30 hover:text-foreground'
        }`}
      >
        <span className="truncate">
          {selected.length === 0
            ? label
            : selected.length === 1
              ? items.find(i => i.id === selected[0])?.name ?? label
              : `${selected.length} נבחרו`}
        </span>
        <div className="flex items-center gap-1.5 shrink-0">
          {selected.length > 0 && (
            <span
              onClick={e => { e.stopPropagation(); selected.forEach(id => onToggle(id)); }}
              className="w-4 h-4 rounded-full bg-primary/20 hover:bg-primary/40 flex items-center justify-center transition-colors"
            >
              <X className="w-2.5 h-2.5 text-primary" />
            </span>
          )}
          <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
        </div>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full right-0 left-0 mt-1 bg-card border border-border rounded-xl shadow-xl z-50 overflow-hidden"
          >
            <div className="max-h-52 overflow-y-auto">
              {items.map(item => {
                const active = selected.includes(item.id);
                const color = getColor?.(item.id);
                return (
                  <button
                    key={item.id}
                    onClick={() => onToggle(item.id)}
                    className="w-full flex items-center gap-3 px-3 py-2 hover:bg-muted/50 transition-colors text-sm text-right"
                  >
                    <span
                      className={`w-4 h-4 rounded flex items-center justify-center shrink-0 border-2 transition-all ${
                        active ? 'border-transparent' : 'border-muted-foreground/40'
                      }`}
                      style={active && color ? { backgroundColor: color, borderColor: color } : undefined}
                    >
                      {active && <Check className="w-2.5 h-2.5 text-white" />}
                    </span>
                    {color && (
                      <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: color }} />
                    )}
                    <span className={active ? 'font-medium text-foreground' : 'text-muted-foreground'}>
                      {item.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Main filter panel (sidebar) ──────────────────────────────────────────────

interface Props {
  filters: CandidateFilters;
  onChange: <K extends keyof CandidateFilters>(key: K, value: CandidateFilters[K]) => void;
  onReset: () => void;
}

export default function FilterPanel({ filters, onChange, onReset }: Props) {
  const isDefault = JSON.stringify(filters) === JSON.stringify(DEFAULT_FILTERS);

  const toggleParty = (id: string) => {
    onChange('parties', filters.parties.includes(id)
      ? filters.parties.filter(p => p !== id)
      : [...filters.parties, id]);
  };

  const toggleTopic = (t: string) => {
    onChange('topics', filters.topics.includes(t)
      ? filters.topics.filter(x => x !== t)
      : [...filters.topics, t]);
  };

  const partyColor = (id: string) => parties.find(p => p.id === id)?.color;

  return (
    <div className="space-y-5">

      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="font-rubik font-bold text-base">סינון</span>
        {!isDefault && (
          <button
            onClick={onReset}
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            איפוס
          </button>
        )}
      </div>

      {/* Orientation */}
      <div>
        <SectionLabel>אוריינטציה</SectionLabel>
        <SegmentedControl
          value={filters.orientation}
          onChange={v => onChange('orientation', v)}
          options={[
            { label: 'ימין', value: 'ימין' },
            { label: 'מרכז', value: 'מרכז' },
            { label: 'שמאל', value: 'שמאל' },
          ]}
        />
      </div>

      {/* Gender */}
      <div>
        <SectionLabel>מגדר</SectionLabel>
        <SegmentedControl
          value={filters.gender}
          onChange={v => onChange('gender', v)}
          options={[
            { label: 'גברים', value: 'male' },
            { label: 'נשים', value: 'female' },
          ]}
        />
      </div>

      <div className="h-px bg-border" />

      {/* Parties */}
      <div>
        <SectionLabel>מפלגה</SectionLabel>
        <MultiSelectDropdown
          label="כל המפלגות"
          items={parties.map(p => ({ id: p.id, name: p.name }))}
          selected={filters.parties}
          onToggle={toggleParty}
          getColor={partyColor}
        />
      </div>

      {/* Topics */}
      {ALL_TOPICS.length > 0 && (
        <div>
          <SectionLabel>נושאים</SectionLabel>
          <MultiSelectDropdown
            label="כל הנושאים"
            items={ALL_TOPICS.map(t => ({ id: t, name: t }))}
            selected={filters.topics}
            onToggle={toggleTopic}
          />
        </div>
      )}

      <div className="h-px bg-border" />

      {/* Newcomer toggle */}
      <button
        onClick={() => onChange('newcomerOnly', !filters.newcomerOnly)}
        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl border text-sm font-medium transition-all duration-200 ${
          filters.newcomerOnly
            ? 'border-emerald bg-emerald/10 text-emerald'
            : 'border-border bg-card text-muted-foreground hover:border-foreground/30 hover:text-foreground'
        }`}
      >
        <span>מועמדים חדשים בלבד</span>
        <span
          className={`w-8 h-5 rounded-full transition-all duration-300 flex items-center px-0.5 ${
            filters.newcomerOnly ? 'bg-emerald' : 'bg-muted-foreground/30'
          }`}
        >
          <span
            className={`w-4 h-4 rounded-full bg-white shadow transition-transform duration-300 ${
              filters.newcomerOnly ? 'translate-x-3' : 'translate-x-0'
            }`}
          />
        </span>
      </button>

    </div>
  );
}

// ── Active chips (shown inline above results) ────────────────────────────────

export function ActiveFilterChips({
  filters,
  onChange,
  onReset,
}: {
  filters: CandidateFilters;
  onChange: <K extends keyof CandidateFilters>(key: K, value: CandidateFilters[K]) => void;
  onReset: () => void;
}) {
  const chips: { label: string; onRemove: () => void }[] = [];

  if (filters.orientation !== 'all') chips.push({ label: filters.orientation, onRemove: () => onChange('orientation', 'all') });
  if (filters.gender !== 'all') chips.push({ label: filters.gender === 'male' ? 'גברים' : 'נשים', onRemove: () => onChange('gender', 'all') });
  filters.parties.forEach(pid => {
    const p = parties.find(x => x.id === pid);
    if (p) chips.push({ label: p.name, onRemove: () => onChange('parties', filters.parties.filter(x => x !== pid)) });
  });
  filters.topics.forEach(t => chips.push({ label: t, onRemove: () => onChange('topics', filters.topics.filter(x => x !== t)) }));
  if (filters.newcomerOnly) chips.push({ label: 'חדשים בלבד', onRemove: () => onChange('newcomerOnly', false) });
  if (filters.listPositionRange[0] > 1 || filters.listPositionRange[1] < MAX_LIST_POSITION) {
    chips.push({ label: `מקום ${filters.listPositionRange[0]}–${filters.listPositionRange[1]}`, onRemove: () => onChange('listPositionRange', DEFAULT_FILTERS.listPositionRange) });
  }

  if (chips.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-wrap gap-1.5 items-center"
    >
      {chips.map((chip, i) => (
        <button
          key={i}
          onClick={chip.onRemove}
          className="flex items-center gap-1 text-xs bg-primary/10 text-primary rounded-full px-2.5 py-1 hover:bg-primary/20 transition-colors"
        >
          {chip.label}
          <X className="w-3 h-3" />
        </button>
      ))}
      {chips.length > 1 && (
        <button onClick={onReset} className="text-xs text-muted-foreground hover:text-foreground px-1 transition-colors">
          נקה הכל
        </button>
      )}
    </motion.div>
  );
}
