import { motion } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const flows = [
  {
    title: 'חקירת מועמדים',
    screens: [
      {
        label: 'דף הבית',
        content: (
          <div className="flex flex-col h-full bg-primary text-primary-foreground">
            <div className="flex-1 flex flex-col items-center justify-center px-4 text-center">
              <p className="font-rubik font-bold text-xl">בוחרים ח״כם</p>
              <p className="text-xs opacity-80 mt-2">כל כך הרבה בלאגן...</p>
              <div className="mt-4 w-6 h-6 border-2 border-primary-foreground/40 rounded-full flex items-center justify-center">
                <ChevronLeft className="w-3 h-3 rotate-[-90deg]" />
              </div>
            </div>
          </div>
        ),
      },
      {
        label: 'שאלון',
        content: (
          <div className="flex flex-col h-full bg-background p-3">
            <div className="w-full h-1.5 bg-muted rounded-full mb-3">
              <div className="w-1/3 h-full bg-primary rounded-full" />
            </div>
            <div className="bg-card rounded-xl border border-border p-3 flex-1">
              <p className="font-rubik font-bold text-[10px] text-center mb-2">באיזה אזור הפוליטי את/ה?</p>
              {['ימין', 'מרכז', 'שמאל'].map(a => (
                <div key={a} className="bg-muted/50 rounded-lg p-1.5 mb-1.5 text-[9px] text-center">{a}</div>
              ))}
            </div>
          </div>
        ),
      },
      {
        label: 'חיפוש מועמדים',
        content: (
          <div className="flex flex-col h-full bg-background p-3">
            <p className="font-rubik font-bold text-xs mb-2">מועמדים</p>
            <div className="bg-card rounded-lg border border-border p-2 mb-2">
              <div className="h-2 w-20 bg-muted rounded" />
            </div>
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-card rounded-lg border border-border p-2 mb-1.5 flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-primary/20" />
                <div>
                  <div className="h-1.5 w-12 bg-muted rounded" />
                  <div className="h-1 w-8 bg-muted/50 rounded mt-1" />
                </div>
              </div>
            ))}
          </div>
        ),
      },
      {
        label: 'תעודת זהות',
        content: (
          <div className="flex flex-col h-full bg-background">
            <div className="h-10 bg-primary" />
            <div className="flex-1 p-3 pt-6">
              <p className="font-rubik font-bold text-[10px] text-center">משה כהן</p>
              <div className="grid grid-cols-2 gap-1.5 mt-2">
                {['מגדר', 'גיל', 'אזור', 'מקצוע'].map(f => (
                  <div key={f} className="bg-muted/50 rounded-md p-1.5">
                    <p className="text-[7px] text-muted-foreground">{f}</p>
                    <div className="h-1 w-6 bg-muted rounded mt-0.5" />
                  </div>
                ))}
              </div>
              <div className="mt-2 bg-muted/30 rounded-md p-1.5 text-center text-[8px] text-muted-foreground">
                מתמודדים דומים ▼
              </div>
            </div>
          </div>
        ),
      },
    ],
  },
  {
    title: 'השוואת רשימות',
    screens: [
      {
        label: 'בחירת מפלגות',
        content: (
          <div className="flex flex-col h-full bg-background p-3">
            <p className="font-rubik font-bold text-xs mb-2">רשימות</p>
            {['הליכוד', 'יש עתיד', 'ש"ס'].map((p, i) => (
              <div key={p} className="bg-card rounded-lg border border-border p-2 mb-1.5 flex items-center gap-2">
                <div className={`w-3 h-3 rounded border-2 ${i < 2 ? 'bg-primary border-primary' : 'border-muted-foreground/30'}`} />
                <div className="w-5 h-5 rounded-md" style={{ backgroundColor: ['#2563eb', '#06b6d4', '#7c3aed'][i] }} />
                <span className="text-[9px] font-medium">{p}</span>
              </div>
            ))}
            <div className="mt-auto bg-primary text-primary-foreground rounded-lg p-1.5 text-center text-[9px] font-bold">
              !השווה
            </div>
          </div>
        ),
      },
      {
        label: 'השוואה חזותית',
        content: (
          <div className="flex flex-col h-full bg-background p-3">
            <p className="font-rubik font-bold text-[10px] mb-2">השוואה חזותית</p>
            <div className="flex-1 flex items-end gap-1 justify-center pb-4">
              {[70, 50, 30].map((h, i) => (
                <div key={i} className="flex flex-col items-center gap-1">
                  <div className="w-4 rounded-t" style={{ height: h, backgroundColor: ['#2563eb', '#06b6d4', '#7c3aed'][i] }} />
                  <span className="text-[6px]">{['ליכוד', 'י.עתיד', 'ש"ס'][i]}</span>
                </div>
              ))}
            </div>
          </div>
        ),
      },
      {
        label: 'נתונים',
        content: (
          <div className="flex flex-col h-full bg-background p-3">
            <p className="font-rubik font-bold text-[10px] mb-2">נתונים</p>
            {['מנדטים', '% נשים', 'גיל ממוצע'].map(m => (
              <div key={m} className="flex items-center justify-between py-1.5 border-b border-border/50 text-[8px]">
                <span className="text-muted-foreground">{m}</span>
                <div className="flex gap-3">
                  <span className="font-bold" style={{ color: '#2563eb' }}>32</span>
                  <span className="font-bold" style={{ color: '#06b6d4' }}>24</span>
                </div>
              </div>
            ))}
          </div>
        ),
      },
      {
        label: 'מצב מתקדם',
        content: (
          <div className="flex flex-col h-full bg-background p-3">
            <p className="font-rubik font-bold text-[10px] mb-1">סנן לפי גיל</p>
            <div className="w-full h-1 bg-muted rounded-full mb-2">
              <div className="w-3/5 h-full bg-primary rounded-full" />
            </div>
            <p className="text-[7px] text-muted-foreground mb-2">25 — 45</p>
            {[1, 2].map(i => (
              <div key={i} className="bg-muted/30 rounded-md p-1.5 mb-1 flex items-center gap-1.5">
                <div className="w-4 h-4 rounded bg-primary/20" />
                <div>
                  <div className="h-1 w-8 bg-muted rounded" />
                  <div className="h-0.5 w-5 bg-muted/50 rounded mt-0.5" />
                </div>
              </div>
            ))}
          </div>
        ),
      },
    ],
  },
  {
    title: 'חקירת נתונים',
    screens: [
      {
        label: 'דשבורד חקר',
        content: (
          <div className="flex flex-col h-full bg-background p-3">
            <p className="font-rubik font-bold text-xs mb-2">חקרו</p>
            <div className="grid grid-cols-2 gap-1.5">
              {['מגדר', 'גיל', 'השכלה', 'ותק'].map(c => (
                <div key={c} className="bg-card rounded-lg border border-border p-2 text-center">
                  <div className="w-5 h-5 rounded-md bg-primary/10 mx-auto mb-1" />
                  <p className="text-[8px] font-medium">{c}</p>
                </div>
              ))}
            </div>
          </div>
        ),
      },
      {
        label: 'תובנה - מגדר',
        content: (
          <div className="flex flex-col h-full bg-background p-3">
            <p className="font-rubik font-bold text-[10px] mb-2">פילוח מגדרי</p>
            <div className="flex-1 flex items-center justify-center gap-4">
              <div className="text-center">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-[9px] font-bold">65%</div>
                <p className="text-[7px] mt-1">גברים</p>
              </div>
              <div className="text-center">
                <div className="w-10 h-10 rounded-full bg-accent/30 flex items-center justify-center text-[9px] font-bold">35%</div>
                <p className="text-[7px] mt-1">נשים</p>
              </div>
            </div>
          </div>
        ),
      },
      {
        label: 'פילוח לפי מפלגה',
        content: (
          <div className="flex flex-col h-full bg-background p-3">
            <p className="font-rubik font-bold text-[10px] mb-2">לפי מפלגה</p>
            {['הליכוד', 'מרצ', 'ש"ס'].map((p, i) => (
              <div key={p} className="flex items-center gap-2 mb-1.5">
                <span className="text-[7px] w-8">{p}</span>
                <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${[27, 60, 0][i]}%`, backgroundColor: ['#2563eb', '#22c55e', '#7c3aed'][i] }} />
                </div>
                <span className="text-[7px] text-muted-foreground">{[27, 60, 0][i]}%</span>
              </div>
            ))}
          </div>
        ),
      },
      {
        label: 'השכלה',
        content: (
          <div className="flex flex-col h-full bg-background p-3">
            <p className="font-rubik font-bold text-[10px] mb-2">השכלה</p>
            <div className="flex-1 flex items-end gap-2 justify-center pb-2">
              {[{ l: 'אקדמי', h: 55 }, { l: 'מקצועי', h: 25 }, { l: 'אחר', h: 20 }].map(d => (
                <div key={d.l} className="flex flex-col items-center gap-0.5">
                  <div className="w-6 rounded-t bg-primary/60" style={{ height: d.h }} />
                  <span className="text-[6px]">{d.l}</span>
                </div>
              ))}
            </div>
          </div>
        ),
      },
    ],
  },
  {
    title: 'מועדפים והשוואה',
    screens: [
      {
        label: 'סימון מועדף',
        content: (
          <div className="flex flex-col h-full bg-background p-3">
            <p className="font-rubik font-bold text-xs mb-2">מועמדים</p>
            {[true, false, true].map((fav, i) => (
              <div key={i} className="bg-card rounded-lg border border-border p-2 mb-1.5 flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-primary/20" />
                <div className="flex-1">
                  <div className="h-1.5 w-12 bg-muted rounded" />
                </div>
                <span className={`text-[10px] ${fav ? 'text-amber-400' : 'text-muted-foreground/30'}`}>★</span>
              </div>
            ))}
          </div>
        ),
      },
      {
        label: 'מגירת מועדפים',
        content: (
          <div className="flex flex-col h-full bg-background">
            <div className="flex-1 p-3 opacity-30">
              <div className="h-2 w-16 bg-muted rounded mb-2" />
              <div className="h-2 w-24 bg-muted rounded" />
            </div>
            <div className="bg-card border-t border-border rounded-t-2xl p-3 h-2/3">
              <div className="w-8 h-1 bg-muted rounded-full mx-auto mb-2" />
              <p className="font-rubik font-bold text-[10px] mb-2">המועדפים שלי</p>
              {[1, 2].map(i => (
                <div key={i} className="bg-muted/30 rounded-md p-1.5 mb-1 flex items-center gap-1.5">
                  <div className="w-5 h-5 rounded bg-primary/20" />
                  <div className="h-1 w-10 bg-muted rounded" />
                </div>
              ))}
            </div>
          </div>
        ),
      },
      {
        label: 'עמוד מפלגה',
        content: (
          <div className="flex flex-col h-full bg-background">
            <div className="h-10 bg-primary flex items-center justify-center">
              <p className="text-primary-foreground text-[10px] font-bold">הליכוד</p>
            </div>
            <div className="p-3">
              <div className="grid grid-cols-3 gap-1.5 mb-2">
                {['32 מנדטים', '27% נשים', 'גיל 52'].map(s => (
                  <div key={s} className="bg-muted/50 rounded-md p-1 text-center text-[7px]">{s}</div>
                ))}
              </div>
              {[1, 2].map(i => (
                <div key={i} className="bg-card rounded-md border border-border p-1.5 mb-1 flex items-center gap-1.5">
                  <div className="w-4 h-4 rounded bg-primary/20" />
                  <div className="h-1 w-10 bg-muted rounded" />
                </div>
              ))}
            </div>
          </div>
        ),
      },
      {
        label: 'CTA סופי',
        content: (
          <div className="flex flex-col h-full bg-background items-center justify-center p-3 text-center">
            <div className="w-8 h-8 rounded-lg bg-primary/20 mx-auto mb-2 flex items-center justify-center">
              <span className="text-[10px]">✓</span>
            </div>
            <p className="font-rubik font-bold text-[10px]">מעולה!</p>
            <p className="text-[7px] text-muted-foreground mt-1">עכשיו אפשר להתחיל</p>
            <div className="mt-3 bg-primary text-primary-foreground rounded-full px-3 py-1 text-[8px] font-bold">
              בואו לחקור
            </div>
          </div>
        ),
      },
    ],
  },
];

function IPhoneFrame({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-[140px] h-[280px] bg-foreground rounded-[24px] p-[6px] shadow-xl">
        {/* Notch */}
        <div className="absolute top-[6px] left-1/2 -translate-x-1/2 w-12 h-3 bg-foreground rounded-b-xl z-10" />
        {/* Screen */}
        <div className="w-full h-full rounded-[18px] overflow-hidden bg-background">
          <div className="pt-4 h-full">{children}</div>
        </div>
      </div>
      <p className="text-[10px] text-muted-foreground text-center max-w-[140px]">{label}</p>
    </div>
  );
}

export default function MockupPage() {
  return (
    <div className="space-y-12 pb-12">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-2 mb-1">
          <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
            <ChevronLeft className="w-5 h-5 rotate-180" />
          </Link>
          <h1 className="font-rubik font-bold text-2xl md:text-3xl text-gradient-primary">User Flows</h1>
        </div>
        <p className="text-muted-foreground text-sm">4 תרחישי שימוש עיקריים במערכת</p>
      </motion.div>

      {flows.map((flow, fi) => (
        <motion.section
          key={flow.title}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: fi * 0.1 }}
          className="space-y-4"
        >
          <h2 className="font-rubik font-bold text-lg">{flow.title}</h2>
          <div className="flex gap-4 overflow-x-auto pb-4" style={{ scrollbarWidth: 'none' }}>
            {flow.screens.map((screen, si) => (
              <motion.div
                key={si}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: si * 0.08 }}
                className="shrink-0"
              >
                <IPhoneFrame label={screen.label}>{screen.content}</IPhoneFrame>
              </motion.div>
            ))}
            {/* Flow arrows between screens */}
          </div>
        </motion.section>
      ))}
    </div>
  );
}
