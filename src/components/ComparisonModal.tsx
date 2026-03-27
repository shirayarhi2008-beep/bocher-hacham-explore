import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ToggleLeft, ToggleRight } from 'lucide-react';
import { Party } from '@/data/types';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { getCandidatesByParty } from '@/data/candidates';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell } from 'recharts';
import CandidateCard from './CandidateCard';

interface Props {
  parties: Party[];
  open: boolean;
  onClose: () => void;
}

type FilterMetric = 'age' | 'seniority';

const metrics = [
  { label: 'מנדטים', key: 'seats' },
  { label: 'מועמדים', key: 'candidates' },
  { label: '% נשים', key: 'genderRatio' },
  { label: 'גיל ממוצע', key: 'avgAge' },
  { label: 'ותק ממוצע', key: 'avgSeniority' },
  { label: '% אקדמאים', key: 'educationAcademic' },
] as const;

const getValue = (party: Party, key: string): number | string => {
  if (key === 'educationAcademic') return party.educationBreakdown.academic + '%';
  return (party as any)[key];
};

const getNumericValue = (party: Party, key: string): number => {
  if (key === 'educationAcademic') return party.educationBreakdown.academic;
  return (party as any)[key] || 0;
};

export default function ComparisonModal({ parties, open, onClose }: Props) {
  const [advancedMode, setAdvancedMode] = useState(false);
  const [filterMetric, setFilterMetric] = useState<FilterMetric>('age');
  const [filterRange, setFilterRange] = useState<[number, number]>([25, 70]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  if (parties.length < 2) return null;

  const chartData = metrics.map(m => ({
    metric: m.label,
    ...Object.fromEntries(parties.map(p => [p.id, getNumericValue(p, m.key)])),
  }));

  // For advanced mode — filter candidates by slider range
  const filteredCandidatesByParty = parties.map(p => {
    const all = getCandidatesByParty(p.id);
    const filtered = all.filter(c => {
      const val = filterMetric === 'age' ? c.age : c.seniority;
      return val >= filterRange[0] && val <= filterRange[1];
    });
    return { party: p, candidates: filtered, total: all.length };
  });

  const metricConfig = {
    age: { label: 'גיל', min: 25, max: 70, unit: '' },
    seniority: { label: 'ותק (שנים)', min: 0, max: 25, unit: ' שנים' },
  };

  const currentMetric = metricConfig[filterMetric];

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-50"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            transition={{ type: 'spring', damping: 25 }}
            className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-[800px] md:max-h-[85vh] bg-card rounded-2xl shadow-xl border border-border z-50 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 border-b border-border flex items-center justify-between">
              <h2 className="font-rubik font-bold text-lg">השוואת מפלגות</h2>
              <div className="flex items-center gap-3">
                {/* Toggle */}
                <button
                  onClick={() => setAdvancedMode(!advancedMode)}
                  className="flex items-center gap-2 text-sm font-medium px-3 py-1.5 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                >
                  {advancedMode ? (
                    <ToggleRight className="w-5 h-5 text-primary" />
                  ) : (
                    <ToggleLeft className="w-5 h-5 text-muted-foreground" />
                  )}
                  <span className={advancedMode ? 'text-primary' : 'text-muted-foreground'}>
                    {advancedMode ? 'מתקדם' : 'פשוט'}
                  </span>
                </button>
                <Button variant="ghost" size="icon" onClick={onClose}>
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </div>

            <div className="overflow-y-auto p-4 space-y-6">
              {/* Party headers */}
              <div className="grid gap-4" style={{ gridTemplateColumns: `120px repeat(${parties.length}, 1fr)` }}>
                <div />
                {parties.map(p => (
                  <div key={p.id} className="text-center">
                    <div
                      className="w-12 h-12 rounded-xl mx-auto flex items-center justify-center text-white font-bold text-sm shadow-sm"
                      style={{ backgroundColor: p.color }}
                    >
                      {p.name.slice(0, 2)}
                    </div>
                    <p className="font-rubik font-bold text-sm mt-2">{p.name}</p>
                  </div>
                ))}
              </div>

              {/* Simple Mode */}
              {!advancedMode && (
                <>
                  {/* Visual chart comparison FIRST */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <h3 className="font-rubik font-bold text-sm mb-3">השוואה חזותית</h3>
                    <ResponsiveContainer width="100%" height={200}>
                      <BarChart data={chartData}>
                        <XAxis dataKey="metric" tick={{ fontSize: 10 }} />
                        <YAxis tick={{ fontSize: 10 }} />
                        <Tooltip />
                        {parties.map(p => (
                          <Bar key={p.id} dataKey={p.id} name={p.name} fill={p.color} radius={[4, 4, 0, 0]} />
                        ))}
                      </BarChart>
                    </ResponsiveContainer>
                  </motion.div>

                  {/* Metrics table SECOND */}
                  <div className="space-y-2">
                    {metrics.map((metric, i) => (
                      <motion.div
                        key={metric.key}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="grid gap-4 items-center py-3 border-b border-border/50 last:border-b-0"
                        style={{ gridTemplateColumns: `120px repeat(${parties.length}, 1fr)` }}
                      >
                        <span className="text-sm text-muted-foreground font-medium">{metric.label}</span>
                        {parties.map(p => (
                          <span key={p.id} className="text-center font-bold text-sm" style={{ color: p.color }}>
                            {getValue(p, metric.key)}
                          </span>
                        ))}
                      </motion.div>
                    ))}
                  </div>
                </>
              )}

              {/* Advanced Mode */}
              {advancedMode && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-6"
                >
                  {/* Metric selector */}
                  <div>
                    <h3 className="font-rubik font-bold text-sm mb-3">סנן מועמדים לפי:</h3>
                    <div className="flex gap-2">
                      {(Object.keys(metricConfig) as FilterMetric[]).map(key => (
                        <button
                          key={key}
                          onClick={() => {
                            setFilterMetric(key);
                            setFilterRange([metricConfig[key].min, metricConfig[key].max]);
                          }}
                          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                            filterMetric === key
                              ? 'gradient-primary text-primary-foreground shadow-glow'
                              : 'bg-muted/50 text-muted-foreground hover:bg-muted'
                          }`}
                        >
                          {metricConfig[key].label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Slider */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">טווח:</span>
                      <span className="font-bold text-primary">
                        {filterRange[0]}{currentMetric.unit} — {filterRange[1]}{currentMetric.unit}
                      </span>
                    </div>
                    <Slider
                      min={currentMetric.min}
                      max={currentMetric.max}
                      step={1}
                      value={filterRange}
                      onValueChange={(val) => setFilterRange(val as [number, number])}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{currentMetric.min}{currentMetric.unit}</span>
                      <span>{currentMetric.max}{currentMetric.unit}</span>
                    </div>
                  </div>

                  {/* Filtered results */}
                  {filteredCandidatesByParty.map(({ party, candidates, total }) => (
                    <motion.div
                      key={party.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-3"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-xs"
                          style={{ backgroundColor: party.color }}
                        >
                          {party.name.slice(0, 2)}
                        </div>
                        <div>
                          <span className="font-rubik font-bold text-sm">{party.name}</span>
                          <span className="text-xs text-muted-foreground mr-2">
                            ({candidates.length} מתוך {total} מועמדים)
                          </span>
                        </div>
                      </div>

                      {candidates.length === 0 ? (
                        <p className="text-sm text-muted-foreground pr-11">אין מועמדים בטווח זה</p>
                      ) : (
                        <div className="grid grid-cols-1 gap-2 pr-11">
                          {candidates.map((c, i) => (
                            <motion.div
                              key={c.id}
                              initial={{ opacity: 0, x: 10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: i * 0.03 }}
                              className="flex items-center gap-3 bg-muted/30 rounded-xl p-3 text-sm"
                            >
                              <div
                                className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold shrink-0"
                                style={{ backgroundColor: party.color }}
                              >
                                {c.name.split(' ').map(n => n[0]).join('')}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-medium truncate">{c.name}</p>
                                <p className="text-xs text-muted-foreground">
                                  {filterMetric === 'age' ? `גיל ${c.age}` : `ותק ${c.seniority} שנים`}
                                  {' · '}{c.profession}
                                </p>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
