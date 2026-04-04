import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="-mx-4 -mt-6">
      <section className="min-h-[85vh] flex flex-col items-center justify-center px-6 text-center bg-gradient-primary">
        <p className="text-white/70 text-sm font-medium tracking-widest uppercase mb-6">
          בחירות לכנסת
        </p>

        <h1 className="text-white font-extrabold leading-tight"
          style={{ fontSize: 'clamp(2.5rem, 8vw, 5rem)' }}>
          בוחרים ח״כם
        </h1>

        <p className="mt-5 text-white/80 text-base max-w-xs leading-relaxed">
          כל המידע על המועמדים — במקום אחד
        </p>

        <p className="mt-4 text-white font-semibold"
          style={{ fontSize: 'clamp(1.25rem, 3vw, 1.75rem)' }}>
          אתם, תבחרו בעצמכם.
        </p>

        <div className="mt-12 flex flex-col sm:flex-row items-center gap-3">
          <Link
            to="/lists"
            className="inline-flex items-center gap-2 bg-white text-primary font-semibold px-6 py-3 rounded-pill text-sm hover:bg-white/90 active:scale-[0.98] transition-all duration-normal shadow-md"
          >
            רשימות המפלגות
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <Link
            to="/people"
            className="inline-flex items-center gap-2 bg-white/10 border border-white/30 text-white font-medium px-6 py-3 rounded-pill text-sm hover:bg-white/20 active:scale-[0.98] transition-all duration-normal"
          >
            חיפוש מועמדים
          </Link>
        </div>
      </section>
    </div>
  );
}
