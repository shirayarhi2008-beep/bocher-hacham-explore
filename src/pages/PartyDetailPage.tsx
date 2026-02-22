import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight, Users, GraduationCap, Calendar, Clock, Scale, ArrowLeft } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { getPartyById } from '@/data/parties';
import { getCandidatesByParty } from '@/data/candidates';
import { Button } from '@/components/ui/button';
import CandidateCard from '@/components/CandidateCard';

export default function PartyDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const party = getPartyById(id || '');
  const candidates = getCandidatesByParty(id || '');

  if (!party) {
    return (
      <div className="text-center py-20">
        <p className="text-muted-foreground text-lg">מפלגה לא נמצאה</p>
        <Button variant="link" onClick={() => navigate('/lists')}>חזרה לרשימות</Button>
      </div>
    );
  }

  // Gender data
  const femaleCount = candidates.filter(c => c.gender === 'female').length;
  const maleCount = candidates.filter(c => c.gender === 'male').length;
  const genderData = [
    { name: 'נשים', value: femaleCount, color: 'hsl(340, 80%, 55%)' },
    { name: 'גברים', value: maleCount, color: 'hsl(200, 85%, 55%)' },
  ];

  // Education data
  const eduMap: Record<string, number> = {};
  candidates.forEach(c => { eduMap[c.education] = (eduMap[c.education] || 0) + 1; });
  const educationData = Object.entries(eduMap)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  // Age distribution
  const ageBuckets = [
    { label: '28-35', min: 28, max: 35 },
    { label: '36-45', min: 36, max: 45 },
    { label: '46-55', min: 46, max: 55 },
    { label: '56-65', min: 56, max: 65 },
    { label: '66+', min: 66, max: 100 },
  ];
  const ageData = ageBuckets.map(b => ({
    name: b.label,
    value: candidates.filter(c => c.age >= b.min && c.age <= b.max).length,
  }));

  // Region data
  const regionMap: Record<string, number> = {};
  candidates.forEach(c => { regionMap[c.region] = (regionMap[c.region] || 0) + 1; });
  const regionData = Object.entries(regionMap)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  const PIE_COLORS = ['hsl(340, 80%, 55%)', 'hsl(200, 85%, 55%)', 'hsl(160, 70%, 45%)', 'hsl(270, 75%, 60%)', 'hsl(38, 95%, 55%)', 'hsl(12, 90%, 65%)'];

  const statCards = [
    { icon: Users, label: 'מועמדים', value: candidates.length },
    { icon: Calendar, label: 'גיל ממוצע', value: party.avgAge },
    { icon: Clock, label: 'ותק ממוצע', value: `${party.avgSeniority} שנים` },
    { icon: GraduationCap, label: '% אקדמאים', value: `${party.educationBreakdown.academic}%` },
  ];

  return (
    <div className="space-y-8 pb-8">
      {/* Breadcrumb */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link to="/lists" className="hover:text-foreground transition-colors">רשימות</Link>
        <ChevronRight className="w-4 h-4 rotate-180" />
        <span className="text-foreground font-medium">{party.name}</span>
      </motion.div>

      {/* Party Header */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card rounded-2xl border border-border p-6 shadow-card relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 right-0 h-2" style={{ backgroundColor: party.color }} />
        <div className="flex items-center gap-4">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-md"
            style={{ backgroundColor: party.color }}
          >
            {party.name.slice(0, 2)}
          </div>
          <div>
            <h1 className="font-rubik font-bold text-2xl md:text-3xl">{party.name}</h1>
            <p className="text-muted-foreground text-sm mt-1">{party.seats} מנדטים · {candidates.length} מועמדים ברשימה</p>
          </div>
        </div>
      </motion.div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {statCards.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="bg-card rounded-xl border border-border p-4 text-center shadow-card"
          >
            <stat.icon className="w-5 h-5 mx-auto mb-2 text-muted-foreground" />
            <p className="font-bold text-lg" style={{ color: party.color }}>{stat.value}</p>
            <p className="text-xs text-muted-foreground">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Gender Pie */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card rounded-2xl border border-border p-5 shadow-card"
        >
          <h3 className="font-rubik font-bold text-lg mb-4">התפלגות מגדרית</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={genderData} cx="50%" cy="50%" innerRadius={50} outerRadius={85} paddingAngle={4} dataKey="value" animationDuration={800}>
                {genderData.map((entry, i) => <Cell key={i} fill={entry.color} stroke="none" />)}
              </Pie>
              <Tooltip formatter={(value: number) => [`${value} מועמדים`, '']} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-6 mt-2">
            {genderData.map(d => (
              <div key={d.name} className="flex items-center gap-2 text-sm">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: d.color }} />
                <span>{d.name} ({d.value})</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Age Distribution Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-card rounded-2xl border border-border p-5 shadow-card"
        >
          <h3 className="font-rubik font-bold text-lg mb-4">התפלגות גילאים</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={ageData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip formatter={(value: number) => [`${value} מועמדים`, '']} />
              <Bar dataKey="value" fill={party.color} radius={[6, 6, 0, 0]} animationDuration={800} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Education Pie */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-card rounded-2xl border border-border p-5 shadow-card"
        >
          <h3 className="font-rubik font-bold text-lg mb-4">רמת השכלה</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={educationData} cx="50%" cy="50%" innerRadius={50} outerRadius={85} paddingAngle={3} dataKey="value" animationDuration={800}>
                {educationData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} stroke="none" />)}
              </Pie>
              <Tooltip formatter={(value: number, name: string) => [`${value}`, name]} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap justify-center gap-3 mt-2">
            {educationData.slice(0, 4).map((d, i) => (
              <div key={d.name} className="flex items-center gap-1.5 text-xs">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }} />
                <span>{d.name} ({d.value})</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Region Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-card rounded-2xl border border-border p-5 shadow-card"
        >
          <h3 className="font-rubik font-bold text-lg mb-4">פריסה גיאוגרפית</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={regionData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis type="number" tick={{ fontSize: 12 }} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={80} />
              <Tooltip formatter={(value: number) => [`${value} מועמדים`, '']} />
              <Bar dataKey="value" fill={party.color} radius={[0, 6, 6, 0]} animationDuration={800} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Candidates List */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
        <h2 className="font-rubik font-bold text-xl mb-4">מועמדי הרשימה</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {candidates.map((c, i) => (
            <CandidateCard key={c.id} candidate={c} index={i} />
          ))}
        </div>
      </motion.div>

      {/* Compare CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-card rounded-2xl border-2 border-dashed border-primary/30 p-6 text-center shadow-card"
      >
        <Scale className="w-8 h-8 mx-auto mb-3 text-primary" />
        <h3 className="font-rubik font-bold text-lg mb-1">רוצים להשוות?</h3>
        <p className="text-muted-foreground text-sm mb-4">השוו את {party.name} עם מפלגה אחרת</p>
        <Button
          onClick={() => navigate('/lists')}
          className="gradient-primary text-primary-foreground rounded-xl gap-2 shadow-glow"
        >
          <Scale className="w-4 h-4" />
          עברו להשוואה
          <ArrowLeft className="w-4 h-4" />
        </Button>
      </motion.div>
    </div>
  );
}
