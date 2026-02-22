import { useState } from 'react';
import { motion } from 'framer-motion';
import { Tooltip as ReactTooltip } from 'recharts';

interface RegionData {
  name: string;
  value: number;
}

interface Props {
  data: RegionData[];
  color: string;
}

// Simplified SVG map regions for Israel with approximate positions
const REGION_PATHS: Record<string, { path: string; labelX: number; labelY: number }> = {
  'צפון': {
    path: 'M85,20 L120,15 L135,40 L130,75 L110,85 L80,75 L70,50 Z',
    labelX: 100, labelY: 50,
  },
  'חיפה': {
    path: 'M65,75 L80,75 L110,85 L105,110 L75,115 L55,100 Z',
    labelX: 82, labelY: 95,
  },
  'מרכז': {
    path: 'M55,120 L100,115 L110,120 L115,155 L100,170 L60,165 L50,145 Z',
    labelX: 82, labelY: 142,
  },
  'תל אביב': {
    path: 'M45,115 L55,120 L50,145 L40,140 L35,125 Z',
    labelX: 45, labelY: 130,
  },
  'ירושלים': {
    path: 'M110,120 L140,115 L150,140 L140,165 L115,160 L115,155 Z',
    labelX: 130, labelY: 140,
  },
  'יהודה ושומרון': {
    path: 'M105,85 L130,75 L145,90 L150,110 L140,115 L110,120 L100,115 L105,110 Z',
    labelX: 125, labelY: 100,
  },
  'דרום': {
    path: 'M60,165 L100,170 L140,165 L150,200 L130,260 L110,300 L100,310 L90,290 L70,240 L50,200 Z',
    labelX: 100, labelY: 220,
  },
  'נגב': {
    path: 'M50,200 L70,240 L90,290 L100,310 L85,320 L60,290 L40,250 L35,220 Z',
    labelX: 65, labelY: 270,
  },
};

export default function IsraelMap({ data, color }: Props) {
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);
  const maxValue = Math.max(...data.map(d => d.value), 1);

  const getRegionValue = (regionName: string): number => {
    const found = data.find(d => d.name === regionName);
    return found?.value || 0;
  };

  const getOpacity = (regionName: string): number => {
    const value = getRegionValue(regionName);
    if (value === 0) return 0.08;
    return 0.2 + (value / maxValue) * 0.8;
  };

  return (
    <div className="relative w-full flex justify-center">
      <svg viewBox="20 0 160 340" className="w-full max-w-[220px] h-auto">
        {/* Regions */}
        {Object.entries(REGION_PATHS).map(([name, { path, labelX, labelY }]) => {
          const value = getRegionValue(name);
          const isHovered = hoveredRegion === name;
          return (
            <g
              key={name}
              onMouseEnter={() => setHoveredRegion(name)}
              onMouseLeave={() => setHoveredRegion(null)}
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
              {/* Label */}
              <text
                x={labelX}
                y={labelY - 6}
                textAnchor="middle"
                className="text-[8px] font-medium fill-foreground pointer-events-none"
                style={{ fontFamily: 'Heebo, sans-serif' }}
              >
                {name === 'יהודה ושומרון' ? 'יו"ש' : name}
              </text>
              {value > 0 && (
                <text
                  x={labelX}
                  y={labelY + 6}
                  textAnchor="middle"
                  className="text-[9px] font-bold pointer-events-none"
                  fill={color}
                >
                  {value}
                </text>
              )}
            </g>
          );
        })}
      </svg>

      {/* Tooltip */}
      {hoveredRegion && (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-2 left-2 bg-card border border-border rounded-lg px-3 py-2 shadow-lg text-sm z-10"
        >
          <p className="font-bold" style={{ color }}>{hoveredRegion}</p>
          <p className="text-muted-foreground">{getRegionValue(hoveredRegion)} מועמדים</p>
        </motion.div>
      )}
    </div>
  );
}
