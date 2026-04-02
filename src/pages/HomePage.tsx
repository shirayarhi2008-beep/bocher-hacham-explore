import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function HomePage() {
  const navigate = useNavigate();

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
          onClick={() => navigate('/people')}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="mt-12 relative z-10 group cursor-pointer"
          aria-label="עבור למועמדים"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          >
            <ChevronDown className="w-8 h-8 opacity-70 group-hover:opacity-100 transition-opacity" />
          </motion.div>
        </motion.button>
      </motion.section>

    </div>
  );
}
