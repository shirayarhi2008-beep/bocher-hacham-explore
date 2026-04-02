import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronDown, Zap } from 'lucide-react';
import { Party, Candidate } from '@/data/types';
import { getCandidatesByParty } from '@/data/candidates';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';

interface Props {
  parties: Party[];
  open: boolean;
  onClose: () => void;
}

// ── Data helpers ─────────────────────────────────────────────────────────────

function pct(n: number, total: number) {
  return total === 0 ? 0 : Math.round((n / total) * 100);
}

function deltaLabel(a: number, b: number): string {
  if (a === b) return 'שווה';
  if (b === 0) return a > 0 ? 'בלעדי' : '—';
  if (a === 0) return '—';
  const ratio = a / b;
  if (ratio >= 1.9) return `פי ${ratio.toFixed(1)} יותר`;
  if (ratio <= 0.55) return `פי ${(1 / ratio).toFixed(1)} פחות`;
  const diff = a - b;
  return diff > 0 ? `+${diff}%` : `${diff}%`;
}

const CENTRAL_DISTRICTS = ['מחוז תל אביב', 'מחוז מרכז', 'תל אביב', 'מרכז', 'מחוז חיפה', 'חיפה', 'מחוז ירושלים', 'ירושלים'];

function isCentral(c: Candidate) {
  return CENTRAL_DISTRICTS.some(d => c.district?.includes(d) || c.region?.includes(d));
}

const ARCHETYPE_MAP: Record<string, string> = {
  'ביטחון': 'כבדי הביטחון',
  'משפט': 'ליבת המשפטנים',
  'עסקים': 'אנשי העסקים',
  'שירות המדינה': 'בירוקרטים מנוסים',
  'שלטון מקומי': 'ראשי הערים',
  'חינוך': 'אנשי החינוך',
  'תקשורת': 'אנשי התקשורת',
  'פוליטיקה מפלגתית': 'הוותיקים המפלגתיים',
  'חברה אזרחית': 'מנהיגי החברה האזרחית',
  'אחר': 'פרופיל מגוון',
};

function getArchetype(candidates: Candidate[]): string {
  const counts: Record<string, number> = {};
  candidates.forEach(c => {
    const cat = c.preKnessetCategory || c.educationCategory || 'אחר';
    counts[cat] = (counts[cat] || 0) + 1;
  });
  const top = Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'אחר';
  return ARCHETYPE_MAP[top] || top;
}

function getProfCategories(candidates: Candidate[]) {
  const counts: Record<string, number> = {};
  candidates.forEach(c => {
    const cat = c.preKnessetCategory || c.educationCategory || 'אחר';
    counts[cat] = (counts[cat] || 0) + 1;
  });
  return Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 6);
}

function getDraftStances(candidates: Candidate[]) {
  const counts: Record<string, number> = {};
  candidates.forEach(c => {
    if (c.stanceDraft) counts[c.stanceDraft] = (counts[c.stanceDraft] || 0) + 1;
  });
  return counts;
}

function generatePunchline(pa: Party, pb: Party, ca: Candidate[], cb: Candidate[]): string {
  const gDiff = Math.abs(pa.genderRatio - pb.genderRatio);
  const senDiff = Math.abs(pa.avgSeniority - pb.avgSeniority);
  const newA = pct(ca.filter(c => c.isNewcomer).length, ca.length);
  const newB = pct(cb.filter(c => c.isNewcomer).length, cb.length);
  const newDiff = Math.abs(newA - newB);
  const secA = ca.filter(c => c.preKnessetCategory === 'ביטחון').length;
  const secB = cb.filter(c => c.preKnessetCategory === 'ביטחון').length;
  const secDiff = Math.abs(pct(secA, ca.length) - pct(secB, cb.length));

  const diffs = [
    { diff: gDiff, line: `${pa.genderRatio > pb.genderRatio ? pa.name : pb.name} מובילה בייצוג נשים` },
    { diff: senDiff, line: `${pa.avgSeniority > pb.avgSeniority ? pa.name : pb.name} ותיקה יותר בפוליטיקה` },
    { diff: newDiff, line: `${newA > newB ? pa.name : pb.name} מביאה יותר פרצופים חדשים` },
    { diff: secDiff, line: `${secA > secB ? pa.name : pb.name} כוללת יותר אנשי ביטחון` },
  ];

  return diffs.sort((a, b) => b.diff - a.diff)[0].line;
}

// ── Visual sub-components ────────────────────────────────────────────────────

function PartyHeader({ party }: { party: Party }) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-sm"
        style={{ backgroundColor: party.color }}
      >
        {party.name.slice(0, 2)}
      </div>
      <p className="font-rubik font-bold text-sm text-center">{party.name}</p>
    </div>
  );
}

function Gauge({
  label,
  aVal, bVal,
  aColor, bColor,
  unit = '%',
  higherIsBetter = true,
}: {
  label: string;
  aVal: number; bVal: number;
  aColor: string; bColor: string;
  unit?: string;
  higherIsBetter?: boolean;
}) {
  const max = Math.max(aVal, bVal, 1);
  const aWins = higherIsBetter ? aVal >= bVal : aVal <= bVal;

  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-center text-xs text-muted-foreground">
        <span>{label}</span>
        <span className="text-[10px] bg-muted px-1.5 py-0.5 rounded-full">
          {deltaLabel(aVal, bVal)}
        </span>
      </div>
      {/* Party A bar */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-bold w-8 text-left shrink-0" style={{ color: aColor }}>{aVal}{unit}</span>
        <div className="flex-1 bg-muted rounded-full h-2 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(aVal / max) * 100}%` }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="h-full rounded-full"
            style={{ backgroundColor: aColor, opacity: aWins ? 1 : 0.45 }}
          />
        </div>
      </div>
      {/* Party B bar */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-bold w-8 text-left shrink-0" style={{ color: bColor }}>{bVal}{unit}</span>
        <div className="flex-1 bg-muted rounded-full h-2 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(bVal / max) * 100}%` }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}
            className="h-full rounded-full"
            style={{ backgroundColor: bColor, opacity: !aWins ? 1 : 0.45 }}
          />
        </div>
      </div>
    </div>
  );
}

function AccordionSection({
  title,
  icon,
  badge,
  children,
  defaultOpen = false,
}: {
  title: string;
  icon: React.ReactNode;
  badge?: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border border-border rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-4 py-3 bg-muted/30 hover:bg-muted/50 transition-colors"
      >
        <div className="flex items-center gap-2 text-sm font-rubik font-semibold">
          {icon}
          {title}
          {badge && (
            <span className="text-[10px] bg-primary/15 text-primary px-1.5 py-0.5 rounded-full font-medium">{badge}</span>
          )}
        </div>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="p-4 space-y-4">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Main modal ───────────────────────────────────────────────────────────────

export default function ComparisonModal({ parties, open, onClose }: Props) {
  const [pa, pb] = parties;

  const ca = useMemo(() => (pa ? getCandidatesByParty(pa.id) : []), [pa]);
  const cb = useMemo(() => (pb ? getCandidatesByParty(pb.id) : []), [pb]);

  const stats = useMemo(() => {
    if (!pa || !pb) return null;

    const aNewcomers = pct(ca.filter(c => c.isNewcomer).length, ca.length);
    const bNewcomers = pct(cb.filter(c => c.isNewcomer).length, cb.length);
    const aCentral = pct(ca.filter(isCentral).length, ca.length);
    const bCentral = pct(cb.filter(isCentral).length, cb.length);

    // talent mix chart data
    const aCats = Object.fromEntries(getProfCategories(ca));
    const bCats = Object.fromEntries(getProfCategories(cb));
    const allCats = [...new Set([...Object.keys(aCats), ...Object.keys(bCats)])];
    const talentData = allCats.map(cat => ({
      name: cat,
      [pa.id]: pct(aCats[cat] || 0, ca.length),
      [pb.id]: pct(bCats[cat] || 0, cb.length),
    }));

    // draft stances
    const aDraft = getDraftStances(ca);
    const bDraft = getDraftStances(cb);
    const draftKeys = [...new Set([...Object.keys(aDraft), ...Object.keys(bDraft)])];

    // next in line (candidates beyond current seat count)
    const aNext = [...ca].sort((x, y) => x.listPosition - y.listPosition).filter(c => c.listPosition > pa.seats).slice(0, 3);
    const bNext = [...cb].sort((x, y) => x.listPosition - y.listPosition).filter(c => c.listPosition > pb.seats).slice(0, 3);

    // punchline
    const punchline = generatePunchline(pa, pb, ca, cb);

    return { aNewcomers, bNewcomers, aCentral, bCentral, talentData, aDraft, bDraft, draftKeys, aNext, bNext, punchline };
  }, [pa, pb, ca, cb]);

  if (parties.length < 2 || !stats) return null;

  return (
    <AnimatePresence>
      {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ type: 'spring', damping: 28 }}
            onClick={e => e.stopPropagation()}
            className="w-full max-w-[640px] max-h-[88vh] bg-card rounded-2xl shadow-xl border border-border z-50 flex flex-col overflow-hidden"
            dir="rtl"
          >
            {/* Modal header */}
            <div className="px-5 py-4 border-b border-border flex items-center justify-between shrink-0">
              <div className="flex items-center gap-4">
                <PartyHeader party={pa} />
                <span className="text-muted-foreground font-bold text-sm">vs.</span>
                <PartyHeader party={pb} />
              </div>
              <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-muted transition-colors">
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            <div className="overflow-y-auto flex-1 p-4 space-y-3">

              {/* Punchline */}
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-start gap-2 bg-primary/8 border border-primary/20 rounded-xl px-4 py-3"
              >
                <Zap className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <p className="text-sm font-medium text-foreground">{stats.punchline}</p>
              </motion.div>

              {/* ── Stage 1: At-a-glance ── */}
              <AccordionSection
                title="מבט ראשון"
                icon={<span className="text-base">👁</span>}
                badge="DNA"
                defaultOpen
              >
                {/* Archetype tags */}
                <div className="grid grid-cols-2 gap-3">
                  {[{ p: pa, c: ca }, { p: pb, c: cb }].map(({ p, c }) => (
                    <div
                      key={p.id}
                      className="rounded-xl p-3 text-center"
                      style={{ backgroundColor: p.color + '15', borderColor: p.color + '30', border: '1px solid' }}
                    >
                      <p className="text-[10px] text-muted-foreground mb-1">ה-DNA של הרשימה</p>
                      <p className="text-sm font-rubik font-bold" style={{ color: p.color }}>
                        {getArchetype(c)}
                      </p>
                      <p className="text-[10px] text-muted-foreground mt-1">{c.length} מועמדים</p>
                    </div>
                  ))}
                </div>

                <div className="space-y-4">
                  <Gauge
                    label="ייצוג נשים"
                    aVal={pa.genderRatio} bVal={pb.genderRatio}
                    aColor={pa.color} bColor={pb.color}
                  />
                  <Gauge
                    label="מועמדים חדשים"
                    aVal={stats.aNewcomers} bVal={stats.bNewcomers}
                    aColor={pa.color} bColor={pb.color}
                  />
                  <Gauge
                    label="מרכז הארץ"
                    aVal={stats.aCentral} bVal={stats.bCentral}
                    aColor={pa.color} bColor={pb.color}
                  />
                  <Gauge
                    label="ותק ממוצע"
                    aVal={pa.avgSeniority} bVal={pb.avgSeniority}
                    aColor={pa.color} bColor={pb.color}
                    unit=" שנ׳"
                    higherIsBetter={false}
                  />
                </div>
              </AccordionSection>

              {/* ── Stage 2: Talent mix ── */}
              <AccordionSection
                title="הרכב מקצועי"
                icon={<span className="text-base">💼</span>}
              >
                <div className="flex gap-4 text-xs justify-center mb-2">
                  <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm inline-block" style={{ backgroundColor: pa.color }} />{pa.name}</span>
                  <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm inline-block" style={{ backgroundColor: pb.color }} />{pb.name}</span>
                </div>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={stats.talentData} layout="vertical" margin={{ right: 8, left: 8 }}>
                    <XAxis type="number" tick={{ fontSize: 10 }} unit="%" />
                    <YAxis type="category" dataKey="name" tick={{ fontSize: 10 }} width={90} />
                    <Tooltip formatter={(v: number) => `${v}%`} />
                    <Bar dataKey={pa.id} name={pa.name} fill={pa.color} radius={[0, 4, 4, 0]} barSize={10} />
                    <Bar dataKey={pb.id} name={pb.name} fill={pb.color} radius={[0, 4, 4, 0]} barSize={10} />
                  </BarChart>
                </ResponsiveContainer>
              </AccordionSection>

              {/* ── Stage 3: Conflict points ── */}
              <AccordionSection
                title="נקודות חיכוך"
                icon={<span className="text-base">⚡</span>}
              >
                {/* Draft law stances */}
                <div>
                  <p className="text-xs font-semibold text-muted-foreground mb-3">עמדות לגבי גיוס חרדים</p>
                  <div className="space-y-2">
                    {stats.draftKeys.map(stance => {
                      const aCount = stats.aDraft[stance] || 0;
                      const bCount = stats.bDraft[stance] || 0;
                      const aP = pct(aCount, ca.length);
                      const bP = pct(bCount, cb.length);
                      return (
                        <div key={stance} className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span className="text-muted-foreground">{stance}</span>
                            <span className="text-[10px] text-muted-foreground">{deltaLabel(aP, bP)}</span>
                          </div>
                          <div className="grid grid-cols-2 gap-1.5">
                            <div className="bg-muted rounded-full h-1.5 overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${aP}%` }}
                                transition={{ duration: 0.5 }}
                                className="h-full rounded-full"
                                style={{ backgroundColor: pa.color }}
                              />
                            </div>
                            <div className="bg-muted rounded-full h-1.5 overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${bP}%` }}
                                transition={{ duration: 0.5, delay: 0.1 }}
                                className="h-full rounded-full"
                                style={{ backgroundColor: pb.color }}
                              />
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-1.5 text-[10px] text-muted-foreground">
                            <span>{aCount} ({aP}%)</span>
                            <span>{bCount} ({bP}%)</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Next in line */}
                {(stats.aNext.length > 0 || stats.bNext.length > 0) && (
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground mb-3">הבאים בתור — מי מחכה בשוליים?</p>
                    <div className="grid grid-cols-2 gap-3">
                      {[{ p: pa, next: stats.aNext }, { p: pb, next: stats.bNext }].map(({ p, next }) => (
                        <div key={p.id} className="space-y-1.5">
                          <p className="text-[10px] font-semibold" style={{ color: p.color }}>{p.name}</p>
                          {next.length === 0 && <p className="text-[11px] text-muted-foreground">אין נתונים</p>}
                          {next.map(c => (
                            <div key={c.id} className="flex items-center gap-2 bg-muted/40 rounded-lg px-2 py-1.5">
                              <span className="text-[10px] font-bold text-muted-foreground">#{c.listPosition}</span>
                              <span className="text-xs truncate">{c.name}</span>
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </AccordionSection>

            </div>
          </motion.div>
          </motion.div>
      )}
    </AnimatePresence>
  );
}
