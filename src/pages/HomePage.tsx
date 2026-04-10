import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="-mx-4 -mt-6">
      <section className="min-h-[85vh] flex flex-col items-center justify-center px-6 text-center bg-gradient-primary">
        <h1 className="text-white font-extrabold leading-tight"
          style={{ fontSize: 'clamp(2.5rem, 8vw, 5rem)' }}>
          בוחרים ח״כם
        </h1>

        <p className="mt-3 text-white/80 font-medium tracking-widest"
          style={{ fontSize: 'clamp(1.4rem, 4vw, 2rem)' }}>
          בוחרים מראש לרשימה
        </p>

        <p className="mt-6 text-white/60"
          style={{ fontSize: 'clamp(1rem, 2.5vw, 1.4rem)', fontFamily: 'GadiAlmog, serif' }}>
          <span style={{ fontWeight: 300 }}>כל המידע על המועמדים במקום אחד.</span>
          <br />
          <span style={{ fontWeight: 700 }}>אתם כבר תבחרו בעצמכם.</span>
        </p>

        <div className="mt-12 flex flex-col sm:flex-row items-center gap-3">
          <Link
            to="/lists"
            className="group inline-flex items-center gap-2 bg-white text-primary font-semibold px-6 py-3 rounded-pill text-sm hover:bg-white/90 active:scale-[0.98] transition-all duration-normal shadow-md"
          >
            רשימות המפלגות
            <ArrowLeft className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1" style={{ animation: 'arrowNudge 2s ease-in-out infinite' }} />
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
