import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useState, useEffect } from 'react';

const ELECTION_DATE = new Date('2026-07-01T07:00:00+03:00');

function useCountdown() {
  const [timeLeft, setTimeLeft] = useState(() => ELECTION_DATE.getTime() - Date.now());
  useEffect(() => {
    const id = setInterval(() => setTimeLeft(ELECTION_DATE.getTime() - Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  const total = Math.max(0, timeLeft);
  const days    = Math.floor(total / 86400000);
  const hours   = Math.floor((total % 86400000) / 3600000);
  const minutes = Math.floor((total % 3600000) / 60000);
  const seconds = Math.floor((total % 60000) / 1000);
  return { days, hours, minutes, seconds };
}

function CountdownUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <span className="text-white font-black tabular-nums" style={{ fontSize: 'clamp(1.8rem, 5vw, 3rem)', lineHeight: 1 }}>
        {String(value).padStart(2, '0')}
      </span>
      <span className="text-white/60 text-xs mt-1 tracking-wide">{label}</span>
    </div>
  );
}

export default function HomePage() {
  const countdown = useCountdown();
  return (
    <div className='-mx-4 -mt-6'>
      <section className='min-h-[85vh] flex flex-col items-center justify-center px-6 text-center bg-gradient-primary'>
        <h1
          className='text-white font-extrabold leading-tight'
          style={{ fontSize: 'clamp(2.5rem, 8vw, 5rem)' }}>
          בוחרים ח״כם
        </h1>

        <p
          className='mt-3 text-white/80 font-medium tracking-widest'
          style={{ fontSize: 'clamp(1.4rem, 4vw, 2rem)' }}>
          בוחרים מראש לרשימה
        </p>

        <p
          className='mt-6 text-white/60'
          style={{
            fontSize: 'clamp(1rem, 2.5vw, 1.4rem)',
            fontFamily: 'GadiAlmog, serif',
          }}>
          <span style={{ fontWeight: 300 }}>
            כל המידע על המועמדים והרשימות במקום אחד.
          </span>
          <br />
          <span style={{ fontWeight: 700 }}>אתם כבר תבחרו בעצמכם.</span>
        </p>

        {/* Countdown */}
        <div className='mt-10 flex flex-col items-center gap-2'>
          <p className='text-white/50 text-xs tracking-widest uppercase'>עד הבחירות</p>
          <div className='flex items-center gap-4' dir="ltr">
            <CountdownUnit value={countdown.days}    label="ימים" />
            <span className='text-white/40 font-light text-2xl mb-4'>:</span>
            <CountdownUnit value={countdown.hours}   label="שעות" />
            <span className='text-white/40 font-light text-2xl mb-4'>:</span>
            <CountdownUnit value={countdown.minutes} label="דקות" />
            <span className='text-white/40 font-light text-2xl mb-4'>:</span>
            <CountdownUnit value={countdown.seconds} label="שניות" />
          </div>
        </div>

        <div className='mt-12 flex flex-col sm:flex-row items-center gap-3'>
          <Link
            to='/lists'
            className='group inline-flex items-center gap-2 bg-white text-primary font-semibold px-6 py-3 rounded-pill text-sm hover:bg-white/90 active:scale-[0.98] transition-all duration-normal shadow-md'>
            רשימות המפלגות
            <ArrowLeft
              className='w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1'
              style={{ animation: 'arrowNudge 2s ease-in-out infinite' }}
            />
          </Link>
          <Link
            to='/people'
            className='inline-flex items-center gap-2 bg-white/10 border border-white/30 text-white font-medium px-6 py-3 rounded-pill text-sm hover:bg-white/20 active:scale-[0.98] transition-all duration-normal'>
            חיפוש מועמדים
          </Link>
        </div>
      </section>
    </div>
  );
}
