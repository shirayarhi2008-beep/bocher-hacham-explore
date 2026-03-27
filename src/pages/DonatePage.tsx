import { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const PRESET_AMOUNTS = [50, 100, 200];

export default function DonatePage() {
  const [selected, setSelected] = useState<number | null>(null);
  const [custom, setCustom] = useState('');

  const handlePreset = (amount: number) => {
    setSelected(amount);
    setCustom('');
  };

  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustom(e.target.value);
    setSelected(null);
  };

  const displayAmount = selected ?? (custom ? parseInt(custom) : null);

  return (
    <div className="max-w-md mx-auto space-y-8 py-4" dir="rtl">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-2">
        <div className="w-16 h-16 rounded-2xl gradient-warm mx-auto flex items-center justify-center shadow-glow">
          <Heart className="w-8 h-8 text-primary-foreground" />
        </div>
        <h1 className="font-rubik font-bold text-3xl">עזרו לנו להמשיך</h1>
        <p className="text-muted-foreground leading-relaxed">
          המיזם פועל בהתנדבות ונשען על תמיכת הציבור כדי להמשיך לפתח את הפלטפורמה
        </p>
      </motion.div>

      {/* Donation Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-card rounded-2xl border border-border p-6 shadow-card space-y-6"
      >
        {/* Preset amounts */}
        <div>
          <p className="text-sm font-medium text-muted-foreground mb-3">בחרו סכום</p>
          <div className="flex gap-3">
            {PRESET_AMOUNTS.map(amount => (
              <button
                key={amount}
                onClick={() => handlePreset(amount)}
                className={`flex-1 py-3 rounded-xl border text-sm font-rubik font-bold transition-all duration-200 cursor-pointer ${
                  selected === amount
                    ? 'gradient-primary text-primary-foreground border-transparent shadow-glow'
                    : 'bg-background border-border hover:border-primary hover:text-primary'
                }`}
              >
                ₪{amount}
              </button>
            ))}
          </div>
        </div>

        {/* Custom amount */}
        <div>
          <p className="text-sm font-medium text-muted-foreground mb-2">או הכניסו סכום אחר</p>
          <div className="relative">
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">₪</span>
            <Input
              type="number"
              min={1}
              placeholder="סכום לבחירתכם"
              value={custom}
              onChange={handleCustomChange}
              className="pr-8 rounded-xl h-11 bg-background border-border"
            />
          </div>
        </div>

        {/* Donate button */}
        <Button
          disabled={!displayAmount}
          className="w-full h-12 rounded-xl font-rubik font-bold text-base gradient-primary shadow-glow hover:opacity-90 transition-opacity"
        >
          {displayAmount ? `תרמו ₪${displayAmount}` : 'בחרו סכום לתרומה'}
        </Button>

        {/* Note */}
        <p className="text-xs text-muted-foreground text-center">
          אמצעי התשלום ייקבעו בהמשך
        </p>
      </motion.div>
    </div>
  );
}
