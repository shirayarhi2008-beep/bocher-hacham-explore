import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronRight,
  ChevronLeft,
  ArrowDown,
  FlaskConical,
  Swords,
  Trophy,
  MapPin,
  HelpCircle,
  Users,
} from 'lucide-react';
import { candidates } from '@/data/candidates';
import { parties } from '@/data/parties';

const LAB_VISITED_KEY = 'lab-visited';
const TOTAL_BEATS = 4;

// ─── Computed stats from real data ───────────────────────────────────────────

const avgAge = Math.round(
  candidates.reduce((sum, c) => sum + c.age, 0) / candidates.length
);

const femaleCount = candidates.filter(c => c.gender === 'female').length;
const femalePercent = Math.round((femaleCount / candidates.length) * 100);

const newbieCount = candidates.filter(c => c.seniority <= 2).length;
const newbiePercent = Math.round((newbieCount / candidates.length) * 100);

const totalSeats = parties.reduce((sum, p) => sum + p.seats, 0);

// ─── Candidate cards for beat 3 ──────────────────────────────────────────────

const featuredCandidates = candidates.slice(0, 4);

const partyColors: Record<string, string> = parties.reduce(
  (acc, p) => ({ ...acc, [p.id]: p.color }),
  {}
);

// ─── Sub-components ──────────────────────────────────────────────────────────

function TeamSwitcherBar() {
  const navigate = useNavigate();
  return (
    <div
      dir="rtl"
      className="sticky top-0 z-[100] bg-[hsl(222,47%,8%)] border-b border-white/10 py-2 px-4 flex items-center justify-between gap-4"
    >
      <div className="flex items-center gap-3">
        <span className="text-white/60 text-xs font-heebo">מצב תצוגה:</span>
        <div className="flex items-center gap-1 bg-white/10 rounded-lg p-1">
          <button
            onClick={() => navigate('/')}
            className="px-3 py-1 rounded-md text-xs font-medium text-white/70 hover:bg-white/10 transition-colors"
          >
            A — האתר הנוכחי
          </button>
          <button
            className="px-3 py-1 rounded-md text-xs font-medium bg-white text-[hsl(222,47%,11%)] shadow transition-colors"
          >
            B — המעבדה
          </button>
        </div>
      </div>
      <span className="text-white/40 text-xs font-heebo hidden sm:block">
        בחרו את החוויה המועדפת עליכם
      </span>
    </div>
  );
}

// ─── Beat 1 ──────────────────────────────────────────────────────────────────

function Beat1() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center px-6 relative overflow-hidden">
      {/* Background orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-violet-600/20 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-sky-500/20 blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="relative"
      >
        <span
          className="font-rubik font-black text-white"
          style={{
            fontSize: 'clamp(7rem, 20vw, 16rem)',
            lineHeight: 1,
            textShadow: '0 0 80px hsl(270 90% 65% / 0.6)',
          }}
        >
          120
        </span>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.7 }}
        className="mt-6 max-w-xl"
      >
        <p className="font-rubik text-2xl sm:text-3xl font-bold text-white leading-snug">
          בחירות 2026.
          <br />
          <span className="text-gradient-primary">120 מושבים.</span>
          <br />
          אתה יודע מי יושב שם?
        </p>
      </motion.div>
    </div>
  );
}

// ─── Beat 2 ──────────────────────────────────────────────────────────────────

const stats = [
  {
    value: avgAge,
    suffix: '',
    label: 'גיל ממוצע של חברי כנסת',
    sub: 'המבוגר ביותר מזה שני עשורים',
    color: 'hsl(38,95%,55%)',
    gradient: 'gradient-warm',
  },
  {
    value: femalePercent,
    suffix: '%',
    label: '% נשים ברשימות',
    sub: 'רק שליש מהמנדטים מיוצגים על ידי נשים',
    color: 'hsl(340,80%,60%)',
    gradient: 'gradient-fun',
  },
  {
    value: newbiePercent,
    suffix: '%',
    label: '% מועמדים חדשים',
    sub: 'ותק של עד 2 שנים בפוליטיקה',
    color: 'hsl(200,85%,55%)',
    gradient: 'gradient-cool',
  },
  {
    value: totalSeats,
    suffix: '',
    label: 'סה״כ מושבים בכנסת',
    sub: 'מחולקים בין 12 מפלגות',
    color: 'hsl(160,70%,45%)',
    gradient: 'gradient-cool',
  },
];

function StatCard({ stat, index }: { stat: typeof stats[0]; index: number }) {
  const [displayed, setDisplayed] = useState(0);

  useEffect(() => {
    const target = stat.value;
    const duration = 1200;
    const steps = 40;
    const increment = target / steps;
    let current = 0;
    const interval = setInterval(() => {
      current += increment;
      if (current >= target) {
        setDisplayed(target);
        clearInterval(interval);
      } else {
        setDisplayed(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(interval);
  }, [stat.value]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: index * 0.25, duration: 0.6, ease: 'easeOut' }}
      className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 text-center shadow-card hover:bg-white/15 transition-colors"
    >
      <div
        className="font-rubik font-black text-5xl sm:text-6xl mb-2"
        style={{ color: stat.color, textShadow: `0 0 30px ${stat.color}80` }}
      >
        {displayed}
        {stat.suffix}
      </div>
      <div className="font-rubik font-bold text-white text-base sm:text-lg mb-1">
        {stat.label}
      </div>
      <div className="font-heebo text-white/50 text-xs sm:text-sm">{stat.sub}</div>
    </motion.div>
  );
}

function Beat2() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 py-20">
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="font-rubik font-black text-3xl sm:text-4xl text-white mb-12 text-center"
      >
        הנתונים מדברים
      </motion.h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 w-full max-w-2xl">
        {stats.map((stat, i) => (
          <StatCard key={stat.label} stat={stat} index={i} />
        ))}
      </div>
    </div>
  );
}

// ─── Beat 3 ──────────────────────────────────────────────────────────────────

function MiniCandidateCard({
  candidate,
  index,
}: {
  candidate: (typeof featuredCandidates)[0];
  index: number;
}) {
  const color = partyColors[candidate.partyId] || '#94a3b8';
  const initials = candidate.name
    .split(' ')
    .map(w => w[0])
    .join('')
    .slice(0, 2);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, rotate: index % 2 === 0 ? -4 : 4 }}
      animate={{ opacity: 1, scale: 1, rotate: 0 }}
      transition={{ delay: index * 0.15, duration: 0.5, type: 'spring', stiffness: 200 }}
      className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-5 flex flex-col items-center text-center shadow-card"
    >
      <div
        className="w-14 h-14 rounded-full flex items-center justify-center mb-3 font-rubik font-bold text-lg text-white shadow-glow"
        style={{ background: color }}
      >
        {initials}
      </div>
      <div className="font-rubik font-bold text-white text-sm mb-1">{candidate.name}</div>
      <div className="font-heebo text-white/60 text-xs">{candidate.party}</div>
      <div className="font-heebo text-white/40 text-xs mt-1">{candidate.region}</div>
    </motion.div>
  );
}

function Beat3() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 py-20">
      <motion.p
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="font-rubik font-bold text-xl sm:text-2xl text-white/70 text-center mb-3"
      >
        אבל מאחורי הנתונים —
      </motion.p>
      <motion.h2
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="font-rubik font-black text-3xl sm:text-5xl text-white text-center mb-12"
      >
        אנשים. <span className="text-gradient-primary">בואו נכיר אותם.</span>
      </motion.h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full max-w-2xl">
        {featuredCandidates.map((c, i) => (
          <MiniCandidateCard key={c.id} candidate={c} index={i} />
        ))}
      </div>
    </div>
  );
}

// ─── Beat 4 (Fork) ───────────────────────────────────────────────────────────

const forkOptions = [
  {
    icon: HelpCircle,
    title: 'מי מתאים לי?',
    sub: 'שאלון אישיות וערכים',
    badge: 'בקרוב',
    gradient: 'gradient-primary',
    glow: 'hsl(270,90%,65%)',
  },
  {
    icon: MapPin,
    title: 'מי מייצג אותי?',
    sub: 'מראה אזורית ואישית',
    badge: 'בקרוב',
    gradient: 'gradient-cool',
    glow: 'hsl(200,85%,55%)',
  },
  {
    icon: Swords,
    title: 'זירה — השווה מפלגות',
    sub: 'קרב ישיר בין מפלגות',
    badge: 'בקרוב',
    gradient: 'gradient-warm',
    glow: 'hsl(38,95%,55%)',
  },
  {
    icon: Trophy,
    title: 'דירוגים',
    sub: 'מי בראש ומי בתחתית',
    badge: 'בקרוב',
    gradient: 'gradient-fun',
    glow: 'hsl(340,80%,60%)',
  },
];

function ForkCard({
  option,
  index,
}: {
  option: (typeof forkOptions)[0];
  index: number;
}) {
  const Icon = option.icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.12, duration: 0.5, ease: 'easeOut' }}
      whileHover={{ y: -6, scale: 1.02 }}
      className="relative cursor-default rounded-2xl overflow-hidden border border-white/20 shadow-card group"
    >
      <div className={`${option.gradient} p-px rounded-2xl`}>
        <div className="bg-[hsl(222,47%,12%)] rounded-2xl p-6 flex flex-col items-center text-center gap-3 h-full">
          <div
            className="w-14 h-14 rounded-xl flex items-center justify-center mb-1 shadow-glow"
            style={{ background: option.gradient === 'gradient-primary' ? 'var(--gradient-primary)' : undefined }}
          >
            <div className={`w-full h-full rounded-xl ${option.gradient} flex items-center justify-center`}>
              <Icon className="w-7 h-7 text-white" strokeWidth={2} />
            </div>
          </div>
          <span className="font-rubik font-black text-white text-lg leading-tight">
            {option.title}
          </span>
          <span className="font-heebo text-white/60 text-sm">{option.sub}</span>
          <span className="mt-1 text-xs px-3 py-1 rounded-full bg-white/10 text-white/50 font-heebo border border-white/10">
            {option.badge}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

function Beat4({ onScrollDown }: { onScrollDown: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 py-20 bg-[hsl(222,47%,14%)]">
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="font-rubik font-black text-3xl sm:text-4xl text-white text-center mb-3"
      >
        מה אתה רוצה לעשות עכשיו?
      </motion.h2>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="font-heebo text-white/50 text-base text-center mb-10"
      >
        בחר חוויה — הכל מגיע בקרוב
      </motion.p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 w-full max-w-2xl mb-12">
        {forkOptions.map((opt, i) => (
          <ForkCard key={opt.title} option={opt} index={i} />
        ))}
      </div>

      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.5 }}
        onClick={onScrollDown}
        className="flex items-center gap-2 px-6 py-3 rounded-full gradient-primary text-white font-rubik font-bold text-base shadow-glow hover:scale-105 transition-transform"
      >
        <ArrowDown className="w-5 h-5" />
        התחל לחקור
      </motion.button>
    </div>
  );
}

// ─── Phase 2 Dashboard ────────────────────────────────────────────────────────

const dashboardSections = [
  {
    icon: HelpCircle,
    title: 'מי מתאים לי?',
    description:
      'שאלון קצר שמתאים אותך לאידאולוגיה ולמפלגות הקרובות ביותר לעולמך הערכי. 5 דקות, תוצאות מפתיעות.',
    gradient: 'gradient-primary',
    bg: 'bg-gradient-to-br from-violet-950/60 to-purple-900/40',
  },
  {
    icon: MapPin,
    title: 'מי מייצג אותי?',
    description:
      'הכנס את האזור שלך וגלה מי מהמועמדים מגיע מהפריפריה שלך, מה הרקע שלו ואיך הוא מצביע.',
    gradient: 'gradient-cool',
    bg: 'bg-gradient-to-br from-sky-950/60 to-teal-900/40',
  },
  {
    icon: Swords,
    title: 'זירה — השווה מפלגות',
    description:
      'בחר שתי מפלגות לקרב ישיר — השווה גיל ממוצע, ותק, ייצוג מגדרי וכלכלה מול ביטחון.',
    gradient: 'gradient-warm',
    bg: 'bg-gradient-to-br from-orange-950/60 to-amber-900/40',
  },
  {
    icon: Trophy,
    title: 'דירוגים',
    description:
      'טבלאות דירוג חיות: איזו מפלגה הכי ותיקה? הכי צעירה? הכי מגדרית? הנתונים לא משקרים.',
    gradient: 'gradient-fun',
    bg: 'bg-gradient-to-br from-rose-950/60 to-pink-900/40',
  },
];

function DashboardSection({
  section,
  index,
}: {
  section: (typeof dashboardSections)[0];
  index: number;
}) {
  const Icon = section.icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ delay: index * 0.1, duration: 0.6, ease: 'easeOut' }}
      className={`relative rounded-3xl overflow-hidden border border-white/10 shadow-card ${section.bg} p-8 flex flex-col sm:flex-row items-start gap-6`}
    >
      <div
        className={`flex-shrink-0 w-16 h-16 rounded-2xl ${section.gradient} flex items-center justify-center shadow-glow`}
      >
        <Icon className="w-8 h-8 text-white" strokeWidth={1.5} />
      </div>
      <div className="flex-1">
        <div className="flex flex-wrap items-center gap-3 mb-2">
          <h3 className="font-rubik font-black text-white text-xl sm:text-2xl">
            {section.title}
          </h3>
          <span className="text-xs px-3 py-1 rounded-full bg-white/10 text-white/50 font-heebo border border-white/10">
            בקרוב
          </span>
        </div>
        <p className="font-heebo text-white/60 text-base leading-relaxed">
          {section.description}
        </p>
      </div>
    </motion.div>
  );
}

// ─── Main LabPage ─────────────────────────────────────────────────────────────

export default function LabPage() {
  const [beat, setBeat] = useState<number>(() => {
    const visited = localStorage.getItem(LAB_VISITED_KEY) === 'true';
    return visited ? 4 : 1;
  });

  const dashboardRef = useRef<HTMLDivElement>(null);

  const hasVisited = localStorage.getItem(LAB_VISITED_KEY) === 'true';

  const goNext = () => {
    setBeat(b => {
      const next = Math.min(b + 1, TOTAL_BEATS);
      if (next >= 3) {
        localStorage.setItem(LAB_VISITED_KEY, 'true');
      }
      return next;
    });
  };

  const goPrev = () => setBeat(b => Math.max(b - 1, 1));

  const skipToFork = () => {
    localStorage.setItem(LAB_VISITED_KEY, 'true');
    setBeat(4);
  };

  const scrollToDashboard = () => {
    dashboardRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const canGoBack = beat > 1;
  const canGoForward = beat < TOTAL_BEATS;
  const isLastBeat = beat === TOTAL_BEATS;

  return (
    <div dir="rtl" className="min-h-screen bg-[hsl(222,47%,11%)] text-white">
      <TeamSwitcherBar />

      {/* ── Phase 1: Story slides ── */}
      <div className="relative">
        {/* Skip button — visible on beats 1-3 */}
        <AnimatePresence>
          {!isLastBeat && (
            <motion.button
              key="skip-btn"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={skipToFork}
              className="fixed bottom-6 left-6 z-50 flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur border border-white/20 text-white/70 text-sm font-heebo hover:bg-white/20 transition-colors"
            >
              כבר הייתי פה
              <ChevronLeft className="w-4 h-4" />
            </motion.button>
          )}
        </AnimatePresence>

        {/* Navigation arrows */}
        <AnimatePresence>
          {!isLastBeat && (
            <motion.div
              key="nav-arrows"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed bottom-6 right-1/2 translate-x-1/2 z-50 flex items-center gap-3"
            >
              {canGoBack && (
                <button
                  onClick={goPrev}
                  className="w-10 h-10 rounded-full bg-white/10 backdrop-blur border border-white/20 flex items-center justify-center hover:bg-white/20 transition-colors"
                  aria-label="קודם"
                >
                  <ChevronRight className="w-5 h-5 text-white" />
                </button>
              )}

              {/* Beat indicators */}
              <div className="flex items-center gap-2">
                {Array.from({ length: TOTAL_BEATS }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      if (i + 1 <= beat || i + 1 === beat + 1) setBeat(i + 1);
                    }}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      i + 1 === beat ? 'bg-white w-6' : 'bg-white/30'
                    }`}
                  />
                ))}
              </div>

              {canGoForward && (
                <button
                  onClick={goNext}
                  className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center hover:scale-110 transition-transform shadow-glow"
                  aria-label="הבא"
                >
                  <ChevronLeft className="w-5 h-5 text-white" />
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Beat content */}
        <AnimatePresence mode="wait">
          {beat === 1 && (
            <motion.div
              key="beat1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, x: 80 }}
              transition={{ duration: 0.4 }}
            >
              <Beat1 />
            </motion.div>
          )}
          {beat === 2 && (
            <motion.div
              key="beat2"
              initial={{ opacity: 0, x: -80 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 80 }}
              transition={{ duration: 0.4 }}
            >
              <Beat2 />
            </motion.div>
          )}
          {beat === 3 && (
            <motion.div
              key="beat3"
              initial={{ opacity: 0, x: -80 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 80 }}
              transition={{ duration: 0.4 }}
            >
              <Beat3 />
            </motion.div>
          )}
          {beat === 4 && (
            <motion.div
              key="beat4"
              initial={{ opacity: 0, x: -80 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
            >
              <Beat4 onScrollDown={scrollToDashboard} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Phase 2: Scrollable dashboard ── */}
      <div
        ref={dashboardRef}
        className="bg-[hsl(222,47%,9%)] border-t border-white/10 px-6 py-16"
      >
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-3 mb-12"
          >
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-glow">
              <FlaskConical className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-rubik font-black text-white text-2xl sm:text-3xl">
                המעבדה
              </h2>
              <p className="font-heebo text-white/50 text-sm">
                כל הכלים במקום אחד — בקרוב
              </p>
            </div>
          </motion.div>

          <div className="flex flex-col gap-5">
            {dashboardSections.map((section, i) => (
              <DashboardSection key={section.title} section={section} index={i} />
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="mt-16 text-center"
          >
            <div className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-white/5 border border-white/10">
              <Users className="w-4 h-4 text-white/40" />
              <span className="font-heebo text-white/40 text-sm">
                {candidates.length} מועמדים · {parties.length} מפלגות · בחירות 2026
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
