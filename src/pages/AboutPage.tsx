import { motion } from 'framer-motion';
import { useState } from 'react';
import { Mail, Phone } from 'lucide-react';

function TeamAvatar({ name, image }: { name: string; image: string }) {
  const [imgError, setImgError] = useState(false);
  if (!imgError) {
    return (
      <img
        src={image}
        alt={name}
        className="w-12 h-12 rounded-full object-cover flex-shrink-0 shadow-sm"
        onError={() => setImgError(true)}
      />
    );
  }
  return (
    <div className="w-12 h-12 rounded-full gradient-cool flex-shrink-0 flex items-center justify-center shadow-sm">
      <span className="text-primary-foreground font-rubik font-bold text-sm">{name.charAt(0)}</span>
    </div>
  );
}

const team = [
  {
    name: 'יאיר ליפסקי-אופז',
    role: 'יזם חברתי מהגליל העליון, מפקד במילואים, מרצה וכלכלן',
    image: '/team/yair.jpg',
  },
  {
    name: 'תומר בר עוז',
    role: 'חוקר פילוסופיה פוליטית באוניברסיטת תל אביב ופעיל חברתי',
    image: '/team/tomer.jpg',
  },
  {
    name: 'עדי קרליבך',
    role: 'אקטיביסטית ממשואות יצחק, תושבת באר שבע, סטודנטית לעבודה סוציאלית',
    image: '/team/adi.jpg',
  },
  {
    name: 'שירה ירחי',
    role: 'ירושלמית מאלון שבות, פעילה חברתית, מתכנתת ועובדת ב-Wix',
    image: '/team/shira.jpg',
  },
];

export default function AboutPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-10 py-4" dir="rtl">
      {/* Hero */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-rubik font-bold text-3xl md:text-4xl text-gradient-primary">בוחרים ח״כם</h1>
        <p className="mt-3 text-muted-foreground text-base leading-relaxed">
          מיזם חברתי-טכנולוגי א-מפלגתי המציב את הרכב הרשימות במרכז בחירות 2026
        </p>
      </motion.div>

      {/* Who we are */}
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-card rounded-2xl border border-border p-6 shadow-card space-y-3"
      >
        <h2 className="font-rubik font-bold text-xl">מי אנחנו</h2>
        <p className="text-muted-foreground leading-relaxed">
          פלטפורמה דיגיטלית שמנגישה מידע, מאפשרת היכרות והשוואה בין המועמדים והרשימות בבחירות 2026.
          יוזמה מהשטח, נטולת אינטרס פוליטי, המובלת על ידי צוות מגוון ורב-תחומי.
        </p>
      </motion.section>

      {/* Team */}
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-4"
      >
        <h2 className="font-rubik font-bold text-xl">הצוות</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {team.map((member, i) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 + i * 0.07 }}
              className="bg-card rounded-2xl border border-border p-5 shadow-card flex gap-4 items-start"
            >
              <TeamAvatar name={member.name} image={member.image} />
              <div>
                <p className="font-rubik font-semibold text-sm">{member.name}</p>
                <p className="text-muted-foreground text-xs mt-1 leading-relaxed">{member.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Contact */}
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45 }}
        className="bg-card rounded-2xl border border-border p-6 shadow-card space-y-3"
      >
        <h2 className="font-rubik font-bold text-xl">יצירת קשר</h2>
        <p className="font-medium">יאיר</p>
        <div className="flex flex-col gap-2 text-sm text-muted-foreground">
          <a href="tel:0526689141" className="flex items-center gap-2 hover:text-foreground transition-colors">
            <Phone className="w-4 h-4" />
            052-6689141
          </a>
          <a href="mailto:yairlipsky0@gmail.com" className="flex items-center gap-2 hover:text-foreground transition-colors">
            <Mail className="w-4 h-4" />
            yairlipsky0@gmail.com
          </a>
        </div>
      </motion.section>
    </div>
  );
}
