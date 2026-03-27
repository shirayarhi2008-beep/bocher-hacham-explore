import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, Lightbulb, ArrowLeft } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { getCategoryByKey } from '@/data/categories';
import { parties } from '@/data/parties';
import { candidates } from '@/data/candidates';
import { Button } from '@/components/ui/button';
import { useMemo } from 'react';

const COLORS = ['#8b5cf6', '#06b6d4', '#f59e0b', '#ef4444', '#22c55e', '#ec4899', '#3b82f6', '#14b8a6', '#f97316', '#6366f1', '#a855f7', '#e11d48'];

export default function CategoryDetailPage() {
  const { key } = useParams<{ key: string }>();
  const navigate = useNavigate();
  const category = getCategoryByKey(key || '');

  const chartData = useMemo(() => {
    if (!key) return [];
    switch (key) {
      case 'gender': {
        const women = candidates.filter(c => c.gender === 'female').length;
        const men = candidates.length - women;
        return [
          { name: 'נשים', value: women },
          { name: 'גברים', value: men },
        ];
      }
      case 'periphery': {
        const regionCounts: Record<string, number> = {};
        candidates.forEach(c => { regionCounts[c.region] = (regionCounts[c.region] || 0) + 1; });
        return Object.entries(regionCounts).map(([name, value]) => ({ name, value }));
      }
      case 'education': {
        const eduCounts: Record<string, number> = {};
        candidates.forEach(c => { eduCounts[c.education] = (eduCounts[c.education] || 0) + 1; });
        return Object.entries(eduCounts).map(([name, value]) => ({ name, value }));
      }
      case 'age': {
        const brackets = [
          { name: '28-35', min: 28, max: 35 },
          { name: '36-45', min: 36, max: 45 },
          { name: '46-55', min: 46, max: 55 },
          { name: '56-70', min: 56, max: 70 },
        ];
        return brackets.map(b => ({
          name: b.name,
          value: candidates.filter(c => c.age >= b.min && c.age <= b.max).length,
        }));
      }
      case 'seniority': {
        const brackets = [
          { name: '0-3 שנים', min: 0, max: 3 },
          { name: '4-10 שנים', min: 4, max: 10 },
          { name: '11-20 שנים', min: 11, max: 20 },
          { name: '20+ שנים', min: 21, max: 99 },
        ];
        return brackets.map(b => ({
          name: b.name,
          value: candidates.filter(c => c.seniority >= b.min && c.seniority <= b.max).length,
        }));
      }
      case 'professionalism': {
        const profCounts: Record<string, number> = {};
        candidates.forEach(c => { profCounts[c.profession] = (profCounts[c.profession] || 0) + 1; });
        return Object.entries(profCounts)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 8)
          .map(([name, value]) => ({ name, value }));
      }
      default:
        return [];
    }
  }, [key]);

  const rankingData = useMemo(() => {
    if (!key) return [];
    switch (key) {
      case 'gender':
        return [...parties].sort((a, b) => b.genderRatio - a.genderRatio).map(p => ({
          name: p.name, value: p.genderRatio + '%', color: p.color, raw: p.genderRatio,
        }));
      case 'age':
        return [...parties].sort((a, b) => a.avgAge - b.avgAge).map(p => ({
          name: p.name, value: p.avgAge.toString(), color: p.color, raw: p.avgAge,
        }));
      case 'seniority':
        return [...parties].sort((a, b) => b.avgSeniority - a.avgSeniority).map(p => ({
          name: p.name, value: p.avgSeniority + ' שנים', color: p.color, raw: p.avgSeniority,
        }));
      default:
        return [...parties].sort((a, b) => b.genderRatio - a.genderRatio).map(p => ({
          name: p.name, value: p.seats.toString(), color: p.color, raw: p.seats,
        }));
    }
  }, [key]);

  if (!category) return <div>קטגוריה לא נמצאה</div>;

  const ctaMap: Record<string, { label: string; filter: string }> = {
    gender: { label: 'סנן לנשים', filter: '?gender=female' },
    periphery: { label: 'סנן לפריפריה', filter: '?region=periphery' },
    age: { label: 'סנן לצעירים', filter: '?age=young' },
    education: { label: 'סנן לאקדמאים', filter: '?education=academic' },
    seniority: { label: 'סנן לחדשים', filter: '?seniority=new' },
    professionalism: { label: 'סנן למקצוענים', filter: '?profession=pro' },
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Breadcrumb */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center gap-2 text-sm text-muted-foreground"
      >
        <Link to="/explore" className="hover:text-primary transition-colors">חקר</Link>
        <ChevronLeft className="w-4 h-4" />
        <span className="font-medium text-foreground">{category.title}</span>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="font-rubik font-bold text-2xl md:text-3xl"
        style={{ color: category.color }}
      >
        {category.title} בכנסת
      </motion.h1>

      {/* Pie Chart */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="bg-card rounded-2xl border border-border p-6 shadow-card"
      >
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              outerRadius={110}
              innerRadius={50}
              paddingAngle={3}
              dataKey="value"
              animationBegin={200}
              animationDuration={800}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            >
              {chartData.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} cursor="pointer" />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                borderRadius: '12px',
                border: 'none',
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                fontFamily: 'Heebo',
                direction: 'rtl',
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Insight box */}
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
        className="rounded-2xl p-4 border-2 flex items-start gap-3"
        style={{ borderColor: category.color, backgroundColor: category.color + '10' }}
      >
        <Lightbulb className="w-6 h-6 shrink-0 mt-0.5" style={{ color: category.color }} />
        <div>
          <p className="font-bold text-sm mb-1" style={{ color: category.color }}>הידעת?</p>
          <p className="text-sm text-foreground">{category.insightFact}</p>
        </div>
      </motion.div>

      {/* Ranking table */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-card rounded-2xl border border-border overflow-hidden shadow-card"
      >
        <div className="p-4 border-b border-border flex items-center justify-between">
          <h3 className="font-rubik font-bold">דירוג מפלגות</h3>
          <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-lg">
            {key === 'gender' ? '% נשים' : key === 'age' ? 'גיל ממוצע' : key === 'seniority' ? 'ותק ממוצע' : 'מנדטים'}
          </span>
        </div>
        <div className="divide-y divide-border">
          {rankingData.map((item, i) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + i * 0.04 }}
              className="flex items-center gap-3 px-4 py-3 hover:bg-muted/30 transition-colors"
            >
              <span className="text-sm font-bold text-muted-foreground w-6">{i + 1}</span>
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="flex-1 font-medium text-sm">{item.name}</span>
              <span className="font-bold text-sm" style={{ color: item.color }}>{item.value}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="text-center"
      >
        <Button
          onClick={() => navigate('/people')}
          className="gradient-primary text-primary-foreground rounded-xl gap-2 px-8 h-12 text-base shadow-glow hover:shadow-hover transition-shadow"
        >
          {ctaMap[key || '']?.label || 'סנן מועמדים'}
          <ArrowLeft className="w-5 h-5" />
        </Button>
      </motion.div>
    </div>
  );
}
