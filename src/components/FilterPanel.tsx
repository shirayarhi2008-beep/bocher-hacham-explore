import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check, X, RotateCcw } from 'lucide-react';
import { parties } from '@/data/parties';
import {
  CandidateFilters,
  DEFAULT_FILTERS,
  ALL_TOPICS,
  MAX_LIST_POSITION,
} from '@/hooks/useFilteredCandidates';

// ── Helpers ───────────────────────────────────────────────────────────────────

function Label({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-2">
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
    <div className="flex rounded-md border border-border overflow-hidden">
      {options.map(opt => {
        const active = value === opt.value;
        return (
          <button
            key={opt.value}
            onClick={() => onChange(active ? 'all' : opt.value)}
            className={`flex-1 text-xs font-medium py-1.5 transition-colors duration-fast border-l border-border first:border-l-0 ${
              active
                ? 'bg-primary text-white'
                : 'bg-white text-muted-foreground hover:text-foreground hover:bg-secondary'
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

// ── Multi-select dropdown ─────────────────────────────────────────────────────

function MultiSelectDropdown({
  label,
  items,
  selected,
  onToggle,
}: {
  label: string;
  items: { id: string; name: string }[];
  selected: string[];
  onToggle: (id: string) => void;
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
        className={`w-full flex items-center justify-between gap-2 px-3 py-2 rounded-md border text-sm transition-colors duration-fast ${
          selected.length > 0
            ? 'border-primary bg-primary/5 text-foreground'
            : 'border-border bg-white text-muted-foreground hover:text-foreground hover:border-foreground/30'
        }`}
      >
        <span className="truncate">
          {selected.length === 0
            ? label
            : selected.length === 1
              ? items.find(i => i.id === selected[0])?.name ?? label
              : `${selected.length} נבחרו`}
        </span>
        <div className="flex items-center gap-1 shrink-0">
          {selected.length > 0 && (
            <span
              onClick={e => { e.stopPropagation(); selected.forEach(id => onToggle(id)); }}
              className="p-0.5 rounded-sm hover:bg-primary/20 text-primary transition-colors"
            >
              <X className="w-3 h-3" />
            </span>
          )}
          <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-fast ${open ? 'rotate-180' : ''}`} />
        </div>
      </button>

      {open && (
        <div className="absolute top-full right-0 left-0 mt-1 bg-white border border-border rounded-md shadow-card-hover z-50 overflow-hidden">
          <div className="max-h-52 overflow-y-auto">
            {items.map(item => {
              const active = selected.includes(item.id);
              return (
                <button
                  key={item.id}
                  onClick={() => onToggle(item.id)}
                  className="w-full flex items-center gap-2.5 px-3 py-2 hover:bg-secondary transition-colors text-sm text-right"
                >
                  <span className={`w-3.5 h-3.5 rounded border flex items-center justify-center shrink-0 transition-colors ${active ? 'bg-primary border-primary' : 'border-border'}`}>
                    {active && <Check className="w-2.5 h-2.5 text-white" />}
                  </span>
                  <span className={active ? 'font-medium text-foreground' : 'text-muted-foreground'}>
                    {item.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Main ─────────────────────────────────────────────────────────────────────

interface Props {
  filters: CandidateFilters;
  onChange: <K extends keyof CandidateFilters>(key: K, value: CandidateFilters[K]) => void;
  onReset: () => void;
}

export default function FilterPanel({ filters, onChange, onReset }: Props) {
  const isDefault = JSON.stringify(filters) === JSON.stringify(DEFAULT_FILTERS);

  const toggleParty = (id: string) =>
    onChange('parties', filters.parties.includes(id)
      ? filters.parties.filter(p => p !== id)
      : [...filters.parties, id]);

  const toggleTopic = (t: string) =>
    onChange('topics', filters.topics.includes(t)
      ? filters.topics.filter(x => x !== t)
      : [...filters.topics, t]);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="font-semibold text-sm">סינון</span>
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
        <Label>אוריינטציה</Label>
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
        <Label>מגדר</Label>
        <SegmentedControl
          value={filters.gender}
          onChange={v => onChange('gender', v)}
          options={[
            { label: 'גברים', value: 'male' },
            { label: 'נשים', value: 'female' },
          ]}
        />
      </div>

      <hr className="border-border" />

      {/* Parties */}
      <div>
        <Label>מפלגה</Label>
        <MultiSelectDropdown
          label="כל המפלגות"
          items={parties.map(p => ({ id: p.id, name: p.name }))}
          selected={filters.parties}
          onToggle={toggleParty}
        />
      </div>

      {/* Topics */}
      {ALL_TOPICS.length > 0 && (
        <div>
          <Label>נושאים</Label>
          <MultiSelectDropdown
            label="כל הנושאים"
            items={ALL_TOPICS.map(t => ({ id: t, name: t }))}
            selected={filters.topics}
            onToggle={toggleTopic}
          />
        </div>
      )}

    </div>
  );
}

// ── Active chips ──────────────────────────────────────────────────────────────

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
  if (filters.listPositionRange[0] > 1 || filters.listPositionRange[1] < MAX_LIST_POSITION) {
    chips.push({ label: `מקום ${filters.listPositionRange[0]}–${filters.listPositionRange[1]}`, onRemove: () => onChange('listPositionRange', DEFAULT_FILTERS.listPositionRange) });
  }

  if (chips.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-1.5 items-center">
      {chips.map((chip, i) => (
        <button
          key={i}
          onClick={chip.onRemove}
          className="flex items-center gap-1 text-xs bg-primary-light/10 text-primary-light border border-primary-light/25 rounded px-2 py-1 hover:bg-primary-light/20 transition-colors"
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
    </div>
  );
}
