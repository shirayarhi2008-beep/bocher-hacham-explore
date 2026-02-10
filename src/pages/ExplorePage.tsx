import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { categories } from '@/data/categories';
import { Users, MapPin, Briefcase, GraduationCap, Calendar, Clock } from 'lucide-react';

const iconMap: Record<string, any> = {
  Users, MapPin, Briefcase, GraduationCap, Calendar, Clock,
};

const colorClasses = [
  'from-rose/20 to-rose/5',
  'from-sky/20 to-sky/5',
  'from-emerald/20 to-emerald/5',
  'from-violet/20 to-violet/5',
  'from-amber/20 to-amber/5',
  'from-coral/20 to-coral/5',
];

export default function ExplorePage() {
  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-6"
      >
        <h1 className="font-rubik font-bold text-3xl md:text-4xl text-gradient-primary">?מה חשוב לך</h1>
        <p className="text-muted-foreground mt-2">חקרו את הנתונים לפי הנושא שמעניין אתכם</p>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {categories.map((cat, i) => {
          const Icon = iconMap[cat.icon];
          return (
            <motion.div
              key={cat.key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
            >
              <Link to={`/explore/${cat.key}`}>
                <div
                  className="bg-card rounded-2xl border border-border p-6 text-center shadow-card hover:shadow-card-hover transition-all duration-300 group cursor-pointer relative overflow-hidden"
                  style={{ '--cat-color': cat.color } as React.CSSProperties}
                >
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className="w-14 h-14 rounded-2xl mx-auto flex items-center justify-center mb-3 shadow-sm"
                    style={{ backgroundColor: cat.color + '20', color: cat.color }}
                  >
                    {Icon && <Icon className="w-7 h-7" />}
                  </motion.div>
                  <h3 className="font-rubik font-bold text-lg">{cat.title}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{cat.description}</p>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
