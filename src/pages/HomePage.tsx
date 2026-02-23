import { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, List, Compass, TrendingUp, BarChart3, Sparkles, ChevronLeft, ChevronDown } from 'lucide-react';
import { parties } from '@/data/parties';
import { candidates } from '@/data/candidates';
import { categories } from '@/data/categories';

const quizQuestions = [
  {
    question: 'שאלה ראשונה — תמולא בהמשך',
    answers: ['תשובה א׳', 'תשובה ב׳', 'תשובה ג׳'],
  },
  {
    question: 'שאלה שנייה — תמולא בהמשך',
    answers: ['תשובה א׳', 'תשובה ב׳', 'תשובה ג׳'],
  },
  {
    question: 'שאלה שלישית — תמולא בהמשך',
    answers: ['תשובה א׳', 'תשובה ב׳', 'תשובה ג׳'],
  },
];

export default function HomePage() {
  const [quizStep, setQuizStep] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const scrollToContent = () => {
    contentRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

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

  const topParties = [...parties].sort((a, b) => b.seats - a.seats).slice(0, 5);

  return (
    <div className="-mx-4 -mt-6">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative flex flex-col items-center justify-center min-h-[80vh] bg-primary text-primary-foreground px-4 text-center overflow-hidden"
      >
        {/* Subtle bg circles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-primary-foreground/5" />
          <div className="absolute -bottom-32 -left-16 w-96 h-96 rounded-full bg-primary-foreground/5" />
        </div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="font-rubik font-bold text-5xl md:text-7xl relative z-10"
        >
          בוחרים ח״כם
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-6 text-lg md:text-xl max-w-lg leading-relaxed opacity-90 relative z-10"
        >
          כל כך הרבה בלאגן, כל כך הרבה מידע
          <br />
          מביאים לכם את השורה התחתונה
        </motion.p>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-3 text-2xl md:text-3xl font-rubik font-bold opacity-95 relative z-10"
        >
          אתם — תבחרו בעצמכם
        </motion.p>

        <motion.button
          onClick={scrollToContent}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="mt-12 relative z-10 group cursor-pointer"
          aria-label="גלול למטה"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          >
            <ChevronDown className="w-8 h-8 opacity-70 group-hover:opacity-100 transition-opacity" />
          </motion.div>
        </motion.button>
      </motion.section>

      {/* Quiz Section */}
      <div ref={contentRef} className="px-4 py-12 max-w-lg mx-auto min-h-[60vh] flex flex-col items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={quizStep}
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 40 }}
            transition={{ duration: 0.3 }}
            className="w-full"
          >
            <p className="text-center text-sm text-muted-foreground mb-2">
              {quizStep + 1} / {quizQuestions.length}
            </p>
            <div className="bg-card rounded-2xl border border-border p-6 shadow-card">
              <p className="font-rubik font-semibold text-lg mb-6 text-center">
                {quizQuestions[quizStep].question}
              </p>
              <div className="space-y-3">
                {quizQuestions[quizStep].answers.map((ans, ai) => (
                  <button
                    key={ai}
                    onClick={() => {
                      if (quizStep < quizQuestions.length - 1) {
                        setQuizStep((s) => s + 1);
                      } else {
                        navigate('/people');
                      }
                    }}
                    className="w-full text-right p-4 rounded-xl border border-border bg-background hover:bg-primary hover:text-primary-foreground transition-colors duration-200 text-sm font-medium cursor-pointer"
                  >
                    {ans}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Dashboard */}
      <div id="dashboard" className="px-4 pb-8 space-y-10 max-w-5xl mx-auto">
        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3">
          {quickStats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
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
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
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
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
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
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
              >
                <Link to={`/lists/${party.id}`} className="flex items-center gap-3 p-2 rounded-xl hover:bg-muted/50 transition-colors group">
                  <span className="text-xs text-muted-foreground w-5 text-center font-bold">{i + 1}</span>
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center text-primary-foreground font-bold text-xs shadow-sm"
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
                      whileInView={{ width: `${(party.seats / topParties[0].seats) * 100}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6 }}
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
    </div>
  );
}
