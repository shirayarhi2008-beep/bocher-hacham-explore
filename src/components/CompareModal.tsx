import { X, ChevronLeft, Lock } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useCompare } from '@/context/CompareContext';
import { getPartyById, parties } from '@/data/parties';
import { computePartyStats } from '@/data/partyStats';
import { candidates } from '@/data/candidates';
import { useMemo } from 'react';
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, Cell, Tooltip, PieChart, Pie,
} from 'recharts';

// ── data ──────────────────────────────────────────────────────────────────────
const actualCounts: Record<string, number> = {};
for (const c of candidates) actualCounts[c.partyId] = (actualCounts[c.partyId] ?? 0) + 1;

const availableParties = parties
  .map(p => ({ ...p, candidates: actualCounts[p.id] ?? 0 }))
  .filter(p => p.candidates > 0)
  .sort((a, b) => b.candidates - a.candidates);


// ── helpers ───────────────────────────────────────────────────────────────────
function PartyBadge({ id, locked, onRemove }: {
  id: string; locked: boolean; onRemove: () => void;
}) {
  const party = getPartyById(id);
  if (!party) return null;
  const color = party.color;
  return (
    <div
      className="flex items-center gap-2 px-3 py-2 rounded-xl border-2 bg-white shadow-sm"
      style={{ borderColor: color }}
    >
      <div
        className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[11px] font-bold shrink-0"
        style={{ backgroundColor: color }}
      >
        {party.ballotLetter ?? party.name.slice(0, 2)}
      </div>
      <span className="font-bold text-sm">{party.name}</span>
      {locked
        ? <Lock className="w-3 h-3 text-muted-foreground" />
        : (
          <button onClick={onRemove} className="text-muted-foreground hover:text-red-500 transition-colors">
            <X className="w-3.5 h-3.5" />
          </button>
        )}
    </div>
  );
}

// ── step 1: selection ─────────────────────────────────────────────────────────
function SelectStep() {
  const { compareIds, lockedId, addParty, removeParty, goToCompare } = useCompare();
  const canCompare = compareIds.length === 2;
  const secondId = compareIds.find(id => id !== lockedId);

  return (
    <div className="px-6 py-5 space-y-6">
      {/* selected pills */}
      <div className="flex flex-wrap gap-3 min-h-[48px] items-center">
        {compareIds.map((id) => (
          <PartyBadge
            key={id}
            id={id}
            locked={id === lockedId}
            onRemove={() => removeParty(id)}
          />
        ))}
        {compareIds.length < 2 && (
          <p className="text-sm text-muted-foreground">← בחר מפלגה להשוואה</p>
        )}
      </div>

      {/* party grid */}
      <div>
        <p className="text-xs text-muted-foreground mb-3 font-medium">
          {lockedId
            ? `בחר מפלגה להשוות עם ${getPartyById(lockedId)?.name}`
            : 'בחר 2 מפלגות להשוואה'}
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-72 overflow-y-auto">
          {availableParties.map(p => {
            const isLocked = p.id === lockedId;
            const isSelected = compareIds.includes(p.id);
            const disabled = isLocked || (compareIds.length >= 2 && !isSelected);
            return (
              <button
                key={p.id}
                disabled={disabled && !isSelected}
                onClick={() => isSelected && !isLocked ? removeParty(p.id) : addParty(p.id)}
                className={[
                  'flex items-center gap-2 px-3 py-2.5 rounded-xl border text-right transition-all text-sm',
                  isLocked
                    ? 'border-primary/40 bg-primary/6 cursor-not-allowed opacity-70'
                    : isSelected
                    ? 'border-orange-400 bg-orange-50 font-semibold'
                    : disabled
                    ? 'border-border bg-gray-50 opacity-40 cursor-not-allowed'
                    : 'border-border bg-white hover:border-primary/50 hover:bg-primary/4',
                ].join(' ')}
              >
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px] font-bold shrink-0"
                  style={{ backgroundColor: p.color }}
                >
                  {p.ballotLetter ?? p.name.slice(0, 1)}
                </div>
                <span className="truncate font-medium">{p.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* confirm */}
      <div className="flex justify-end pt-1">
        <button
          disabled={!canCompare}
          onClick={goToCompare}
          className={[
            'flex items-center gap-2 px-6 py-2.5 rounded-pill font-semibold text-sm transition-all',
            canCompare
              ? 'bg-primary text-white hover:bg-primary/90 shadow-md'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed',
          ].join(' ')}
        >
          השוואה
          <ChevronLeft className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

// ── step 2: comparison ────────────────────────────────────────────────────────
function StatCard({ label, a, b, unit = '', colorA, colorB }: { label: string; a: number | null; b: number | null; unit?: string; colorA: string; colorB: string }) {
  const aVal = a ?? 0;
  const bVal = b ?? 0;
  const max = Math.max(aVal, bVal, 1);
  return (
    <div className="bg-gray-50 rounded-xl p-4 space-y-2">
      <p className="text-xs font-semibold text-muted-foreground">{label}</p>
      <div className="flex items-end gap-3">
        <div className="flex-1 text-right">
          <p className="font-black text-2xl leading-none" style={{ color: colorA }}>
            {a !== null ? `${a}${unit}` : '—'}
          </p>
        </div>
        <div className="flex-1 text-right">
          <p className="font-black text-2xl leading-none" style={{ color: colorB }}>
            {b !== null ? `${b}${unit}` : '—'}
          </p>
        </div>
      </div>
      <div className="space-y-1">
        <div className="flex items-center gap-1.5">
          <div className="h-2 rounded-full transition-all" style={{ width: `${(aVal / max) * 100}%`, backgroundColor: colorA, minWidth: 4 }} />
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-2 rounded-full transition-all" style={{ width: `${(bVal / max) * 100}%`, backgroundColor: colorB, minWidth: 4 }} />
        </div>
      </div>
    </div>
  );
}

function PctPieChart({ label, aVal, bVal, aName, bName, colorA, colorB }: {
  label: string; aVal: number; bVal: number; aName: string; bName: string; colorA: string; colorB: string;
}) {
  const dataA = [{ value: aVal }, { value: 100 - aVal }];
  const dataB = [{ value: bVal }, { value: 100 - bVal }];
  return (
    <div className="bg-gray-50 rounded-xl p-4">
      <p className="text-xs font-semibold text-muted-foreground mb-2">{label}</p>
      <div className="flex justify-around items-center">
        {[{ data: dataA, color: colorA, name: aName, val: aVal },
          { data: dataB, color: colorB, name: bName, val: bVal }].map(({ data, color, name, val }) => (
          <div key={name} className="flex flex-col items-center gap-1">
            <ResponsiveContainer width={80} height={80}>
              <PieChart>
                <Pie data={data} dataKey="value" innerRadius={24} outerRadius={36} startAngle={90} endAngle={-270} paddingAngle={2}>
                  <Cell fill={color} />
                  <Cell fill="#e5e7eb" />
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <p className="font-black text-lg leading-none" style={{ color }}>{val}%</p>
            <p className="text-[10px] text-muted-foreground">{name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function RadarSection({ sA, sB, nameA, nameB, colorA, colorB }: {
  sA: ReturnType<typeof computePartyStats>;
  sB: ReturnType<typeof computePartyStats>;
  nameA: string; nameB: string; colorA: string; colorB: string;
}) {
  const data = [
    { axis: 'נשים', A: sA.pctWomen, B: sB.pctWomen },
    { axis: 'שירות צבאי', A: sA.pctServed, B: sB.pctServed },
    { axis: 'קרביים', A: sA.pctCombat, B: sB.pctCombat },
    { axis: 'אקדמאים', A: sA.pctAcademic, B: sB.pctAcademic },
    { axis: 'חדשים', A: sA.pctNewcomer, B: sB.pctNewcomer },
  ];
  return (
    <div className="bg-gray-50 rounded-xl p-4 col-span-2">
      <p className="text-xs font-semibold text-muted-foreground mb-1">פרופיל השוואתי (%)</p>
      <ResponsiveContainer width="100%" height={300}>
        <RadarChart data={data} cx="50%" cy="50%" outerRadius="75%">
          <PolarGrid stroke="#e5e7eb" />
          <PolarAngleAxis dataKey="axis" tick={{ fontSize: 11, fontFamily: 'Heebo, sans-serif', fill: '#6b7280' }} />
          <Radar dataKey="A" stroke={colorA} fill={colorA} fillOpacity={0.18} name={nameA} />
          <Radar dataKey="B" stroke={colorB} fill={colorB} fillOpacity={0.18} name={nameB} />
          <Tooltip formatter={(v: number, name: string) => [`${v}%`, name]} />
        </RadarChart>
      </ResponsiveContainer>
      <div className="flex justify-center gap-6 mt-1">
        <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <span className="w-3 h-1.5 rounded-full inline-block" style={{ backgroundColor: colorA }} />{nameA}
        </span>
        <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <span className="w-3 h-1.5 rounded-full inline-block" style={{ backgroundColor: colorB }} />{nameB}
        </span>
      </div>
    </div>
  );
}

function PeripherySection({ sA, sB, nameA, nameB, colorA, colorB }: {
  sA: ReturnType<typeof computePartyStats>;
  sB: ReturnType<typeof computePartyStats>;
  nameA: string; nameB: string; colorA: string; colorB: string;
}) {
  const data = [
    { name: nameA, value: sA.avgPeriphery ?? 0 },
    { name: nameB, value: sB.avgPeriphery ?? 0 },
  ];
  return (
    <div className="bg-gray-50 rounded-xl p-4 col-span-2">
      <p className="text-xs font-semibold text-muted-foreground mb-1">מדד פריפריה ממוצע (1–10)</p>
      <p className="text-[10px] text-muted-foreground mb-3">לפי הלמ"ס 2020 · 1 = פריפריה, 10 = מרכז</p>
      <ResponsiveContainer width="100%" height={100}>
        <BarChart data={data} barCategoryGap="40%" layout="vertical">
          <XAxis type="number" domain={[0, 10]} tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
          <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fontFamily: 'Heebo, sans-serif' }} axisLine={false} tickLine={false} width={80} />
          <Tooltip formatter={(v: number) => [v.toFixed(1), 'מדד']} />
          <Bar dataKey="value" radius={[0, 6, 6, 0]}>
            <Cell fill={colorA} />
            <Cell fill={colorB} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

function CompareStep() {
  const { compareIds, lockedId, goToSelect } = useCompare();
  const [idA, idB] = compareIds;
  const partyA = getPartyById(idA);
  const partyB = getPartyById(idB);
  const stats = useMemo(() => compareIds.map(id => computePartyStats(id)), [compareIds]);
  const [sA, sB] = stats;
  if (!partyA || !partyB || !sA || !sB) return null;
  const colorA = partyA.color;
  const colorB = partyB.color;

  return (
    <div className="px-6 py-5 space-y-5">
      {/* Header row */}
      <div className="flex items-center justify-between">
        <button onClick={goToSelect} className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors">
          <ChevronLeft className="w-3.5 h-3.5 rotate-180" />
          שנה בחירה
        </button>
        <div className="flex gap-4">
          <span className="font-bold text-sm" style={{ color: colorA }}>{partyA.name}</span>
          <span className="text-muted-foreground text-sm">vs.</span>
          <span className="font-bold text-sm" style={{ color: colorB }}>{partyB.name}</span>
        </div>
      </div>

      {/* Stat cards grid */}
      <div className="grid grid-cols-2 gap-3">
        <RadarSection sA={sA} sB={sB} nameA={partyA.name} nameB={partyB.name} colorA={colorA} colorB={colorB} />

        <StatCard label="מועמדים ברשימה" a={sA.total} b={sB.total} colorA={colorA} colorB={colorB} />
        <StatCard label="גיל ממוצע" a={sA.avgAge || null} b={sB.avgAge || null} unit=" שנ׳" colorA={colorA} colorB={colorB} />
        <StatCard label="ותק ממוצע" a={sA.avgSeniority || null} b={sB.avgSeniority || null} unit=" שנ׳" colorA={colorA} colorB={colorB} />
        <StatCard label="מועמדים חדשים" a={sA.pctNewcomer} b={sB.pctNewcomer} unit="%" colorA={colorA} colorB={colorB} />

        <PctPieChart label="נשים ברשימה" aVal={sA.pctWomen} bVal={sB.pctWomen} aName={partyA.name} bName={partyB.name} colorA={colorA} colorB={colorB} />
        <PctPieChart label="שירות צבאי" aVal={sA.pctServed} bVal={sB.pctServed} aName={partyA.name} bName={partyB.name} colorA={colorA} colorB={colorB} />

        <PeripherySection sA={sA} sB={sB} nameA={partyA.name} nameB={partyB.name} colorA={colorA} colorB={colorB} />
      </div>
    </div>
  );
}

// ── main modal ────────────────────────────────────────────────────────────────
export default function CompareModal() {
  const { modalOpen, closeModal, step, compareIds } = useCompare();

  return (
    <Dialog open={modalOpen} onOpenChange={open => !open && closeModal()}>
      <DialogContent
        className="max-w-2xl w-[95vw] max-h-[92vh] overflow-y-auto p-0"
        dir="rtl"
      >
        <DialogHeader className="px-6 pt-5 pb-4 border-b border-border sticky top-0 bg-white z-10">
          <DialogTitle className="text-right text-lg font-bold">
            {step === 'select' ? 'בחר מפלגות להשוואה' : 'השוואת מפלגות'}
          </DialogTitle>
          {step === 'select' && (
            <p className="text-xs text-muted-foreground text-right mt-0.5">
              {compareIds.length}/2 מפלגות נבחרו
            </p>
          )}
        </DialogHeader>

        {step === 'select' ? <SelectStep /> : <CompareStep />}
      </DialogContent>
    </Dialog>
  );
}
