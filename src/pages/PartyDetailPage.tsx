import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ChevronRight, Users, Calendar, Clock, GraduationCap, User } from 'lucide-react';
import cityClusterMap from '@/data/peripherality-map.json';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Candidate } from '@/data/types';
import { getPartyById } from '@/data/parties';
import { getCandidatesByParty } from '@/data/candidates';
import IsraelMap from '@/components/IsraelMap';

const CHART_COLORS = ['#2952d9', '#5982fe', '#50bab6', '#88b12d', '#fa8501', '#f9bc01'];

export default function PartyDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const party = getPartyById(id ?? '');
  const candidates = getCandidatesByParty(id ?? '');
  const [modal, setModal] = useState<{ title: string; list: Candidate[] } | null>(null);

  if (!party) {
    return (
      <div className="text-center py-20">
        <p className="text-muted-foreground">מפלגה לא נמצאה</p>
        <button onClick={() => navigate('/lists')} className="mt-3 text-sm text-primary hover:underline">
          חזרה לרשימות
        </button>
      </div>
    );
  }

  // Gender chart data
  const femaleCount = candidates.filter(c => c.gender === 'female').length;
  const maleCount = candidates.filter(c => c.gender === 'male').length;
  const genderData = [
    { name: 'נשים', value: femaleCount },
    { name: 'גברים', value: maleCount },
  ];

  // Age distribution
  const ageBuckets = [
    { label: '28–35', min: 28, max: 35 },
    { label: '36–45', min: 36, max: 45 },
    { label: '46–55', min: 46, max: 55 },
    { label: '56–65', min: 56, max: 65 },
    { label: '66+',   min: 66, max: 100 },
  ];
  const ageData = ageBuckets.map(b => ({
    name: b.label,
    value: candidates.filter(c => c.age >= b.min && c.age <= b.max).length,
  }));

  // Education breakdown — only include candidates with a non-empty education field
  const eduMap: Record<string, number> = {};
  candidates.forEach(c => {
    if (c.education && c.education.trim()) {
      eduMap[c.education] = (eduMap[c.education] || 0) + 1;
    }
  });
  const educationData = Object.entries(eduMap)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
  const hasEducationData = educationData.length > 0;

  // Peripherality (1=פריפריה, 10=מרכז)
  const clusterLookup = cityClusterMap as Record<string, number>;
  let peripheralitySum = 0;
  let peripheralityCoverage = 0;
  candidates.forEach(c => {
    const city = c.city?.trim();
    const cluster = city ? clusterLookup[city] : undefined;
    if (cluster) {
      peripheralitySum += cluster;
      peripheralityCoverage++;
    }
  });
  const avgCluster = peripheralityCoverage > 0
    ? Math.round((peripheralitySum / peripheralityCoverage) * 10) / 10
    : null;
  const avgClusterLabel = avgCluster !== null
    ? avgCluster <= 2 ? 'פריפריה'
    : avgCluster <= 4 ? 'חצי-פריפריה'
    : avgCluster <= 7 ? 'מרכז-שוליים'
    : 'מרכז'
    : null;

  // Military type distribution
  const militaryMap: Record<string, number> = {};
  candidates.forEach(c => {
    const key = c.militaryType?.trim() || (c.exemptionReason ? 'פטור' : 'לא ידוע');
    militaryMap[key] = (militaryMap[key] || 0) + 1;
  });
  const militaryData = Object.entries(militaryMap)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
  const hasMilitaryData = militaryData.length > 0;

  // Region data
  const regionMap: Record<string, number> = {};
  candidates.forEach(c => {
    const region = c.region === 'נגב' ? 'דרום' : c.region;
    regionMap[region] = (regionMap[region] || 0) + 1;
  });
  const regionData = Object.entries(regionMap)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  return (
    <div className="space-y-8 pb-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm text-muted-foreground">
        <Link to="/lists" className="hover:text-foreground transition-colors">רשימות</Link>
        <ChevronRight className="w-3.5 h-3.5 rotate-180" />
        <span className="text-foreground font-medium">{party.name}</span>
      </nav>

      {/* Party header */}
      <div className="bg-white border border-border rounded-lg p-6">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="font-bold text-2xl md:text-3xl text-foreground">{party.name}</h1>
            <p className="text-muted-foreground text-sm mt-0.5">{party.seats} מנדטים · {candidates.length} מועמדים ברשימה</p>
          </div>
        </div>
      </div>

      {/* Stat highlights */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { icon: Users,         label: 'מועמדים',    value: candidates.length },
          { icon: Calendar,      label: 'גיל ממוצע',  value: party.avgAge },
          { icon: Clock,         label: 'ותק ממוצע',  value: `${party.avgSeniority} שנים` },
          ...(hasEducationData ? [{ icon: GraduationCap, label: '% אקדמאים', value: `${party.educationBreakdown.academic}%` }] : []),
        ].map(stat => (
          <div key={stat.label} className="bg-white border border-border rounded-lg p-4 text-center">
            <stat.icon className="w-4 h-4 mx-auto mb-2 text-muted-foreground" />
            <p className="font-bold text-lg text-primary-light">{stat.value}</p>
            <p className="text-xs text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Gender */}
        <div className="bg-white border border-border rounded-lg p-5 cursor-pointer" onClick={() => {}}>
          <h3 className="font-semibold text-base mb-4">התפלגות מגדרית</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={genderData}
                cx="50%" cy="50%"
                innerRadius={45} outerRadius={80}
                paddingAngle={4}
                dataKey="value"
                onClick={(_, index) => {
                  const gender = index === 0 ? 'female' : 'male';
                  const label = genderData[index].name;
                  setModal({ title: label, list: candidates.filter(c => c.gender === gender) });
                }}
                style={{ cursor: 'pointer' }}
              >
                {genderData.map((_, i) => <Cell key={i} fill={CHART_COLORS[i]} />)}
              </Pie>
              <Tooltip formatter={(v: number) => [`${v} מועמדים`, '']} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-5 mt-1">
            {genderData.map((d, i) => (
              <button
                key={d.name}
                className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => {
                  const gender = i === 0 ? 'female' : 'male';
                  setModal({ title: d.name, list: candidates.filter(c => c.gender === gender) });
                }}
              >
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: CHART_COLORS[i] }} />
                {d.name} {Math.round((d.value / candidates.length) * 100)}% ({d.value})
              </button>
            ))}
          </div>
        </div>

        {/* Age */}
        <div className="bg-white border border-border rounded-lg p-5">
          <h3 className="font-semibold text-base mb-4">התפלגות גילאים</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={ageData} barCategoryGap="30%">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} width={24} />
              <Tooltip formatter={(v: number) => [`${v} מועמדים`, '']} />
              <Bar dataKey="value" fill="#2952d9" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Education */}
        {hasEducationData && <div className="bg-white border border-border rounded-lg p-5">
          <h3 className="font-semibold text-base mb-4">רמת השכלה</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={educationData}
                cx="50%" cy="50%"
                innerRadius={45} outerRadius={80}
                paddingAngle={3}
                dataKey="value"
                onClick={(_, index) => {
                  const edu = educationData[index].name;
                  setModal({ title: edu, list: candidates.filter(c => c.education === edu) });
                }}
                style={{ cursor: 'pointer' }}
              >
                {educationData.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
              </Pie>
              <Tooltip formatter={(v: number, name: string) => [v, name]} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap justify-center gap-2 mt-1">
            {educationData.slice(0, 4).map((d, i) => (
              <button
                key={d.name}
                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setModal({ title: d.name, list: candidates.filter(c => c.education === d.name) })}
              >
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }} />
                {d.name} {Math.round((d.value / candidates.length) * 100)}% ({d.value})
              </button>
            ))}
          </div>
        </div>}

        {/* Military */}
        {hasMilitaryData && (
          <div className="bg-white border border-border rounded-lg p-5">
            <h3 className="font-semibold text-base mb-4">שירות צבאי</h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={militaryData}
                  cx="50%" cy="50%"
                  innerRadius={45} outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                  onClick={(_, index) => {
                    const type = militaryData[index].name;
                    setModal({
                      title: type,
                      list: candidates.filter(c => {
                        const key = c.militaryType?.trim() || (c.exemptionReason ? 'פטור' : 'לא ידוע');
                        return key === type;
                      }),
                    });
                  }}
                  style={{ cursor: 'pointer' }}
                >
                  {militaryData.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
                </Pie>
                <Tooltip formatter={(v: number, name: string) => [v, name]} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap justify-center gap-2 mt-1">
              {militaryData.map((d, i) => (
                <button
                  key={d.name}
                  className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                  onClick={() => setModal({
                    title: d.name,
                    list: candidates.filter(c => {
                      const key = c.militaryType?.trim() || (c.exemptionReason ? 'פטור' : 'לא ידוע');
                      return key === d.name;
                    }),
                  })}
                >
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }} />
                  {d.name} ({d.value})
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Map */}
        <div className="bg-white border border-border rounded-lg p-5">
          <h3 className="font-semibold text-base mb-4">מדד הפריפריה</h3>
          {avgCluster !== null && (
            <div className="flex items-end gap-3 mb-5">
              <div
                className="group relative cursor-help"
              >
                <p className="text-5xl font-black text-primary leading-none">{avgCluster}</p>
                <p className="text-xs text-muted-foreground mt-1">מתוך 10 ⓘ</p>
                {/* Tooltip */}
                <div className="absolute bottom-full right-0 mb-2 w-64 bg-foreground text-background text-xs rounded-lg px-3 py-2 opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none z-20 leading-relaxed text-right">
                  מחושב לפי מדד הפריפריאליות של הלמ"ס 2020.<br />
                  1 = פריפריה מרוחקת, 10 = מרכז.<br />
                  מבוסס על {peripheralityCoverage} מועמדים שעיר מגוריהם ידועה.
                </div>
              </div>
              <div className="pb-1">
                <p className="font-semibold text-sm text-foreground">{avgClusterLabel}</p>
                <p className="text-xs text-muted-foreground">{peripheralityCoverage} מועמדים</p>
              </div>
            </div>
          )}
          <IsraelMap data={regionData} color="#2952d9" candidates={candidates} />
        </div>
      </div>

      {/* Candidates modal (gender / education) */}
      <Dialog open={!!modal} onOpenChange={(open) => !open && setModal(null)}>
        <DialogContent className="max-w-md max-h-[70vh] overflow-y-auto" dir="rtl">
          <DialogHeader>
            <DialogTitle className="text-right">{modal?.title} · {modal?.list.length} מועמדים</DialogTitle>
          </DialogHeader>
          <div className="space-y-2 mt-2">
            {modal?.list.map(c => (
              <Link
                key={c.id}
                to={`/candidates/${c.id}`}
                onClick={() => setModal(null)}
                className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 border border-border hover:bg-secondary transition-colors"
              >
                {c.photoUrl ? (
                  <img src={c.photoUrl} alt={c.name} className="w-9 h-9 rounded-full object-cover shrink-0" />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <User className="w-5 h-5 text-primary/50" />
                  </div>
                )}
                <div className="min-w-0">
                  <p className="font-medium text-sm">{c.name}</p>
                  <p className="text-xs text-muted-foreground">מקום {c.listPosition || '?'} · {c.profession || c.party}</p>
                </div>
              </Link>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Candidates — vertical list per design system */}
      <div>
        <h2 className="font-bold text-xl mb-4">מועמדי הרשימה</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {candidates.map(c => (
            <Link
              key={c.id}
              to={`/candidates/${c.id}`}
              className="flex items-center gap-3 px-4 py-3 bg-white border border-border rounded-lg hover:bg-secondary transition-colors duration-normal group"
            >
              <div className="relative shrink-0">
                {c.photoUrl ? (
                  <img
                    src={c.photoUrl}
                    alt={c.name}
                    className="w-10 h-10 rounded-full object-cover border border-border"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-end justify-center overflow-hidden border border-border">
                    <User className="w-6 h-6 text-gray-400 mb-[-3px]" />
                  </div>
                )}
                <span className="absolute -bottom-1 -left-1 text-[9px] font-bold text-white bg-primary rounded-full w-4 h-4 flex items-center justify-center leading-none">
                  {c.listPosition || '?'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm text-foreground">{c.name}</p>
                <p className="text-xs text-muted-foreground truncate">{c.profession || c.party}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0 rotate-180" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
