import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Users, List, Compass, Clock, TrendingUp, BarChart3, Sparkles, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { parties } from '@/data/parties';
import { candidates } from '@/data/candidates';
import { categories } from '@/data/categories';

// Election date — set to a future date for demo
const ELECTION_DATE = new Date('2026-11-03T07:00:00+02:00');

function useCountdown(target: Date) {
  const calc = () => {
    const diff = Math.max(0, target.getTime() - Date.now());
    return {
      days: Math.floor(diff / 86400000),
      hours: Math.floor((diff % 86400000) / 3600000),
      minutes: Math.floor((diff % 3600000) / 60000),
      seconds: Math.floor((diff % 60000) / 1000),
    };
  };
  const [time, setTime] = useState(calc);
  useEffect(() => {
    const id = setInterval(() => setTime(calc), 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}

const countdownUnits = [
  { key: 'days', label: 'ימים' },
  { key: 'hours', label: 'שעות' },
  { key: 'minutes', label: 'דקות' },
  { key: 'seconds', label: 'שניות' },
] as const;

export default function HomePage() {
  const countdown = useCountdown(ELECTION_DATE);

  const quickStats = [
    { label: 'מועמדים', value: candidates.length, icon: Users, color: 'hsl(var(--sky))' },
    { label: 'מפלגות', value: parties.length, icon: List, color: 'hsl(var(--violet))' },
    { label: 'נושאים לחקירה', value: categories.length, icon: Compass, color: 'hsl(var(--emerald))' },
  ];

  const entryPoints = [
    {
      title: 'חקרו מועמדים',
      description: 'גלו מי מתמודד — סננו לפי מגדר, אזור, מפלגה ועוד',
      icon: Users,
      path: '/people',
      gradient: 'gradient-cool',
    },
    {
      title: 'השוו רשימות',
      description: 'בחרו מפלגות והשוו ביניהן בלחיצה',
      icon: BarChart3,
      path: '/lists',
      gradient: 'gradient-fun',
    },
    {
      title: 'מה חשוב לך?',
      description: 'גלו תובנות על מגדר, גיל, השכלה ועוד',
      icon: Sparkles,
      path: '/explore',
      gradient: 'gradient-warm',
    },
  ];

  // Top parties by seats
  const topParties = [...parties].sort((a, b) => b.seats - a.seats).slice(0, 5);

  return (
    <div className="space-y-10 pb-8">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-8"
      >
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', damping: 12 }}
          className="w-20 h-20 rounded-3xl gradient-primary mx-auto flex items-center justify-center shadow-glow mb-5"
        >
          <span className="text-primary-foreground font-bold text-2xl font-rubik">בח</span>
        </motion.div>
        <h1 className="font-rubik font-bold text-3xl md:text-4xl text-gradient-primary">בוחר חכם</h1>
        <p className="text-muted-foreground mt-2 max-w-md mx-auto">
          הכלי שיעזור לכם להכיר את המועמדים, להשוות רשימות ולהגיע מוכנים ליום הבחירות
        </p>
      </motion.div>

      {/* Countdown */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="bg-card rounded-2xl border border-border p-6 shadow-card text-center"
      >
        <div className="flex items-center justify-center gap-2 mb-4">
          <Clock className="w-5 h-5 text-primary" />
          <h2 className="font-rubik font-bold text-lg">ספירה לאחור לבחירות</h2>
        </div>
        <div className="flex justify-center gap-3 md:gap-5">
          {countdownUnits.map(({ key, label }) => (
            <motion.div
              key={key}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col items-center"
            >
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-xl gradient-primary flex items-center justify-center shadow-glow">
                <motion.span
                  key={countdown[key]}
                  initial={{ y: -8, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="text-primary-foreground font-bold text-2xl md:text-3xl font-rubik"
                >
                  {countdown[key]}
                </motion.span>
              </div>
              <span className="text-xs text-muted-foreground mt-1.5 font-medium">{label}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-3">
        {quickStats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + i * 0.08 }}
            className="bg-card rounded-xl border border-border p-4 text-center shadow-card"
          >
            <stat.icon className="w-6 h-6 mx-auto mb-2" style={{ color: stat.color }} />
            <p className="font-bold text-xl font-rubik" style={{ color: stat.color }}>{stat.value}</p>
            <p className="text-xs text-muted-foreground">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Entry Points */}
      <div className="space-y-3">
        <h2 className="font-rubik font-bold text-xl">מאיפה מתחילים?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {entryPoints.map((ep, i) => (
            <motion.div
              key={ep.path}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
            >
              <Link to={ep.path}>
                <div className="bg-card rounded-2xl border border-border p-5 shadow-card hover:shadow-card-hover transition-all duration-300 group h-full">
                  <div className={`w-12 h-12 rounded-xl ${ep.gradient} flex items-center justify-center mb-3 shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                    <ep.icon className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <h3 className="font-rubik font-bold text-base mb-1">{ep.title}</h3>
                  <p className="text-sm text-muted-foreground">{ep.description}</p>
                  <div className="flex items-center gap-1 mt-3 text-primary text-sm font-medium">
                    <span>גלו עכשיו</span>
                    <ChevronLeft className="w-4 h-4" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Top Parties Widget */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-card rounded-2xl border border-border p-5 shadow-card"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            <h2 className="font-rubik font-bold text-lg">המפלגות הגדולות</h2>
          </div>
          <Link to="/lists" className="text-sm text-primary font-medium hover:underline">
            כל הרשימות
          </Link>
        </div>
        <div className="space-y-3">
          {topParties.map((party, i) => (
            <motion.div
              key={party.id}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.55 + i * 0.06 }}
            >
              <Link to={`/lists/${party.id}`} className="flex items-center gap-3 p-2 rounded-xl hover:bg-muted/50 transition-colors group">
                <span className="text-xs text-muted-foreground w-5 text-center font-bold">{i + 1}</span>
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center text-white font-bold text-xs shadow-sm"
                  style={{ backgroundColor: party.color }}
                >
                  {party.name.slice(0, 2)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm">{party.name}</p>
                  <p className="text-xs text-muted-foreground">{party.seats} מנדטים</p>
                </div>
                <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(party.seats / topParties[0].seats) * 100}%` }}
                    transition={{ delay: 0.7 + i * 0.06, duration: 0.6 }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: party.color }}
                  />
                </div>
                <ChevronLeft className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
