import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Candidate } from '@/data/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { MapPin } from 'lucide-react';

interface RegionData {
  name: string;
  value: number;
}

interface Props {
  data: RegionData[];
  color: string;
  candidates?: Candidate[];
}

const REGION_PATHS: Record<string, { path: string; labelX: number; labelY: number }> = {
  'צפון': { path: 'M85,20 L120,15 L135,40 L130,75 L110,85 L80,75 L70,50 Z', labelX: 100, labelY: 50 },
  'חיפה': { path: 'M65,75 L80,75 L110,85 L105,110 L75,115 L55,100 Z', labelX: 82, labelY: 95 },
  'מרכז': { path: 'M55,120 L100,115 L110,120 L115,155 L100,170 L60,165 L50,145 Z', labelX: 82, labelY: 142 },
  'תל אביב': { path: 'M45,115 L55,120 L50,145 L40,140 L35,125 Z', labelX: 45, labelY: 130 },
  'ירושלים': { path: 'M110,120 L140,115 L150,140 L140,165 L115,160 L115,155 Z', labelX: 130, labelY: 140 },
  'יהודה ושומרון': { path: 'M105,85 L130,75 L145,90 L150,110 L140,115 L110,120 L100,115 L105,110 Z', labelX: 125, labelY: 100 },
  'דרום': { path: 'M60,165 L100,170 L140,165 L150,200 L130,260 L110,300 L100,320 L85,320 L60,290 L40,250 L35,220 L50,200 Z', labelX: 95, labelY: 245 },
};

export default function IsraelMap({ data, color, candidates = [] }: Props) {
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const maxValue = Math.max(...data.map(d => d.value), 1);
  const total = data.reduce((sum, d) => sum + d.value, 0);

  const getRegionValue = (regionName: string): number => {
    return data.find(d => d.name === regionName)?.value || 0;
  };

  const getPct = (regionName: string): string => {
    const v = getRegionValue(regionName);
    if (!v || !total) return '';
    return `${Math.round((v / total) * 100)}%`;
  };

  const getOpacity = (regionName: string): number => {
    const value = getRegionValue(regionName);
    if (value === 0) return 0.08;
    return 0.2 + (value / maxValue) * 0.8;
  };

  const regionCandidates = selectedRegion
    ? candidates.filter(c => c.region === selectedRegion)
    : [];

  return (
    <>
      <div className="relative w-full flex justify-center">
        <svg viewBox="20 0 160 340" className="w-full max-w-[220px] h-auto">
          {Object.entries(REGION_PATHS).map(([name, { path, labelX, labelY }]) => {
            const value = getRegionValue(name);
            const isHovered = hoveredRegion === name;
            return (
              <g
                key={name}
                onMouseEnter={() => setHoveredRegion(name)}
                onMouseLeave={() => setHoveredRegion(null)}
                onClick={() => value > 0 && setSelectedRegion(name)}
                className="cursor-pointer transition-all duration-300"
              >
                <motion.path
                  d={path}
                  fill={color}
                  fillOpacity={getOpacity(name)}
                  stroke={isHovered ? color : 'hsl(var(--border))'}
                  strokeWidth={isHovered ? 2 : 1}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  whileHover={{ scale: 1.02 }}
                />
                <text
                  x={labelX}
                  y={labelY - 6}
                  textAnchor="middle"
                  fontSize="8"
                  fontWeight="600"
                  fontFamily="Heebo, sans-serif"
                  fill="hsl(var(--foreground))"
                  stroke="white"
                  strokeWidth="2.5"
                  paintOrder="stroke"
                  style={{ pointerEvents: 'none' }}
                >
                  {name === 'יהודה ושומרון' ? 'יו"ש' : name}
                </text>
                {value > 0 && (
                  <text
                    x={labelX}
                    y={labelY + 6}
                    textAnchor="middle"
                    fontSize="8"
                    fontWeight="700"
                    fontFamily="Heebo, sans-serif"
                    fill="hsl(var(--foreground))"
                    stroke="white"
                    strokeWidth="2.5"
                    paintOrder="stroke"
                    style={{ pointerEvents: 'none' }}
                  >
                    {getPct(name)} ({value})
                  </text>
                )}
              </g>
            );
          })}
        </svg>

        {hoveredRegion && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute top-2 left-2 bg-card border border-border rounded-lg px-3 py-2 shadow-lg text-sm z-10"
          >
            <p className="font-bold" style={{ color }}>{hoveredRegion}</p>
            <p className="text-muted-foreground">{getPct(hoveredRegion)} ({getRegionValue(hoveredRegion)})</p>
          </motion.div>
        )}
      </div>

      {/* Region candidates modal */}
      <Dialog open={!!selectedRegion} onOpenChange={(open) => !open && setSelectedRegion(null)}>
        <DialogContent className="max-w-md max-h-[70vh] overflow-y-auto" dir="rtl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-right">
              <MapPin className="w-5 h-5" style={{ color }} />
              <span>מועמדים מאזור {selectedRegion}</span>
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-2 mt-2">
            {regionCandidates.length > 0 ? (
              regionCandidates.map((c) => (
                <Link
                  key={c.id}
                  to={`/candidates/${c.id}`}
                  onClick={() => setSelectedRegion(null)}
                  className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 border border-border hover:bg-secondary transition-colors"
                >
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
                    style={{ backgroundColor: color }}
                  >
                    {c.name.slice(0, 2)}
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-sm truncate">{c.name}</p>
                    {(c.city || c.district) && (
                      <p className="text-xs text-muted-foreground">{c.city || c.district}</p>
                    )}
                  </div>
                </Link>
              ))
            ) : (
              <p className="text-muted-foreground text-sm text-center py-4">אין מועמדים באזור זה</p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
