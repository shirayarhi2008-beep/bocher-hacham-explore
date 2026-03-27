import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Users, BarChart3, Sparkles, ChevronLeft, ChevronDown } from 'lucide-react';
import { parties } from '@/data/parties';

export default function HomePage() {
  const contentRef = useRef<HTMLDivElement>(null);

  const scrollToContent = () => {
    contentRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

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

      {/* Dashboard */}
      <div id="dashboard" ref={contentRef} className="px-4 pb-8 space-y-10 max-w-5xl mx-auto">
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
