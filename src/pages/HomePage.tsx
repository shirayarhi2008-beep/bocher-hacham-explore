import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, BarChart3, Sparkles, ChevronLeft, ChevronDown, SkipForward } from 'lucide-react';
import { parties } from '@/data/parties';
import { candidates } from '@/data/candidates';
import { categories } from '@/data/categories';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';

const SKIP_QUIZ_KEY = 'skip-homepage-quiz';

const quizQuestions = [
  {
    question: 'מה הכי חשוב לך בנציג הציבור שלך?',
    answers: ['ניסיון ועשייה', 'יושרה ושקיפות', 'ייצוגיות וגיוון', 'התאמה רעיונית'],
  },
  {
    question: 'מה המטרה שלך בשימוש בפלטפורמה היום?',
    answers: ['להבין למי להצביע', 'להכיר את האנשים ברשימה', 'לחקור נתונים לעומק'],
    routes: ['/lists', '/people', '/explore'],
  },
];

export default function HomePage() {
  const [quizStep, setQuizStep] = useState(0);
  const [dontAskAgain, setDontAskAgain] = useState(false);
  const [skipQuiz, setSkipQuiz] = useState(() => localStorage.getItem(SKIP_QUIZ_KEY) === 'true');
  const [targetRoute, setTargetRoute] = useState('/people');
  const contentRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const scrollToContent = () => {
    contentRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleAnswer = (answerIndex: number) => {
    const current = quizQuestions[quizStep];
    if (quizStep === quizQuestions.length - 1 && current.routes) {
      setTargetRoute(current.routes[answerIndex] || '/people');
    }
    setQuizStep(s => s + 1);
  };

  const handleFinish = () => {
    if (dontAskAgain) {
      localStorage.setItem(SKIP_QUIZ_KEY, 'true');
    }
    navigate(targetRoute);
  };

  const handleSkip = () => {
    if (dontAskAgain) {
      localStorage.setItem(SKIP_QUIZ_KEY, 'true');
    }
  };

  const progressPercent = (quizStep / quizQuestions.length) * 100;

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
          כל כך הרבה מידע
          <br />
          אנחנו נעזור לכם לעשות סדר בבלאגן
        </motion.p>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-3 text-2xl md:text-3xl font-rubik font-bold opacity-95 relative z-10"
        >
          אתם, כבר תבחרו בעצמכם
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
      {!skipQuiz && (
        <div ref={contentRef} className="px-4 py-8 max-w-lg mx-auto min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center">
          {/* Progress Bar */}
          {quizStep <= quizQuestions.length && (
            <div className="w-full mb-6 space-y-1">
              <p className="text-xs text-muted-foreground text-center">
                {quizStep < quizQuestions.length ? `${quizStep + 1} מתוך ${quizQuestions.length}` : 'סיימנו!'}
              </p>
              <Progress value={progressPercent} className="h-2" />
            </div>
          )}

          <AnimatePresence mode="wait">
            {quizStep < quizQuestions.length ? (
              <motion.div
                key={quizStep}
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 40 }}
                transition={{ duration: 0.3 }}
                className="w-full"
              >
                <div className="bg-card rounded-2xl border border-border p-6 shadow-card">
                  <p className="font-rubik font-semibold text-lg mb-6 text-center">
                    {quizQuestions[quizStep].question}
                  </p>
                  <div className="space-y-3">
                    {quizQuestions[quizStep].answers.map((ans, ai) => (
                      <button
                        key={ai}
                        onClick={() => handleAnswer(ai)}
                        className="w-full text-right p-4 rounded-xl border border-border bg-background hover:bg-primary hover:text-primary-foreground transition-colors duration-200 text-sm font-medium cursor-pointer"
                      >
                        {ans}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Don't ask again + Skip */}
                <div className="mt-4 flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer text-sm text-muted-foreground">
                    <Checkbox
                      checked={dontAskAgain}
                      onCheckedChange={(checked) => setDontAskAgain(checked === true)}
                    />
                    אל תשאל אותי שוב
                  </label>
                  <a
                    href="#dashboard"
                    onClick={handleSkip}
                    className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <SkipForward className="w-4 h-4" />
                    דלג לדשבורד
                  </a>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="cta"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="w-full text-center space-y-6"
              >
                <div className="w-16 h-16 rounded-2xl gradient-cool mx-auto flex items-center justify-center shadow-glow">
                  <Users className="w-8 h-8 text-primary-foreground" />
                </div>
                <h2 className="font-rubik font-bold text-2xl">מעולה! עכשיו אפשר להתחיל</h2>
                <p className="text-muted-foreground">גלו את כל המועמדים, סננו והשוו</p>

                {/* Don't ask again checkbox */}
                <label className="flex items-center justify-center gap-2 cursor-pointer text-sm text-muted-foreground">
                  <Checkbox
                    checked={dontAskAgain}
                    onCheckedChange={(checked) => setDontAskAgain(checked === true)}
                  />
                  אל תשאל אותי שוב
                </label>

                <button
                  onClick={handleFinish}
                  className="mt-4 px-8 py-3 rounded-full bg-primary text-primary-foreground font-rubik font-bold text-lg hover:opacity-90 transition-opacity cursor-pointer shadow-glow"
                >
                  בואו לחקור
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Dashboard */}
      <div id="dashboard" ref={skipQuiz ? contentRef : undefined} className="px-4 pb-8 space-y-10 max-w-5xl mx-auto">
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
      </div>
    </div>
  );
}
