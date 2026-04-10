import { useState, useEffect, useCallback } from 'react';
import { PersonStanding, Type, Contrast, Eye, Link2, Zap, RotateCcw } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';

// ── Types ────────────────────────────────────────────────────────────────────

type FontSize = 'normal' | 'large' | 'xl';

interface A11yState {
  fontSize: FontSize;
  highContrast: boolean;
  grayscale: boolean;
  highlightLinks: boolean;
  reduceMotion: boolean;
}

// ── Constants ────────────────────────────────────────────────────────────────

const DEFAULT_STATE: A11yState = {
  fontSize: 'normal',
  highContrast: false,
  grayscale: false,
  highlightLinks: false,
  reduceMotion: false,
};

const STORAGE_KEY = 'bocherHacham_a11y';

const FONT_SIZE_VALUES: Record<FontSize, string> = {
  normal: '100%',
  large: '120%',
  xl: '140%',
};

// ── DOM side-effects (no React state, immediate) ─────────────────────────────

function applyA11yState(state: A11yState) {
  document.documentElement.style.fontSize = FONT_SIZE_VALUES[state.fontSize];
  document.body.classList.toggle('high-contrast', state.highContrast);
  // Grayscale goes on <html>, not <body> — see index.css for the full explanation.
  document.documentElement.classList.toggle('grayscale-mode', state.grayscale);
  document.body.classList.toggle('highlight-links', state.highlightLinks);
  document.body.classList.toggle('reduce-motion', state.reduceMotion);
}

// ── Sub-components ───────────────────────────────────────────────────────────

interface ToggleRowProps {
  labelId: string;
  icon: React.ReactNode;
  label: string;
  checked: boolean;
  onChange: () => void;
}

function ToggleRow({ labelId, icon, label, checked, onChange }: ToggleRowProps) {
  return (
    <div className="flex items-center justify-between py-1">
      <div className="flex items-center gap-2">
        <span className="text-muted-foreground" aria-hidden="true">{icon}</span>
        <span id={labelId} className="text-sm font-medium">{label}</span>
      </div>

      {/* ARIA switch — role="switch" + aria-checked is the WCAG pattern for toggles */}
      <button
        role="switch"
        aria-checked={checked}
        aria-labelledby={labelId}
        onClick={onChange}
        className={[
          'relative w-11 h-6 rounded-full transition-colors',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
          checked ? 'bg-primary' : 'bg-muted',
        ].join(' ')}
      >
        {/* Thumb — physical left→right movement works correctly in both LTR and RTL */}
        <span
          aria-hidden="true"
          className={[
            'absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-200',
            checked ? 'translate-x-5 left-0.5' : 'translate-x-0 left-0.5',
          ].join(' ')}
        />
        <span className="sr-only">{checked ? 'פעיל' : 'כבוי'}</span>
      </button>
    </div>
  );
}

interface FontButtonProps {
  size: FontSize;
  label: string;
  current: FontSize;
  onSelect: (s: FontSize) => void;
}

function FontButton({ size, label, current, onSelect }: FontButtonProps) {
  const active = current === size;
  return (
    <button
      onClick={() => onSelect(size)}
      aria-pressed={active}
      className={[
        'flex-1 py-2 px-3 rounded-md text-sm font-medium border transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1',
        active
          ? 'bg-primary text-primary-foreground border-primary'
          : 'bg-background text-foreground border-border hover:bg-muted',
      ].join(' ')}
    >
      {label}
    </button>
  );
}

// ── Main component ───────────────────────────────────────────────────────────

export default function AccessibilityMenu() {
  const [open, setOpen] = useState(false);

  const [state, setState] = useState<A11yState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return { ...DEFAULT_STATE, ...JSON.parse(saved) };
    } catch {
      // localStorage unavailable or corrupted — fall through to defaults
    }
    return DEFAULT_STATE;
  });

  // Apply DOM side-effects and persist whenever state changes
  useEffect(() => {
    applyA11yState(state);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Silently ignore write failures (private browsing, quota exceeded, etc.)
    }
  }, [state]);

  const toggleKey = useCallback(
    <K extends keyof A11yState>(key: K) =>
      setState(prev => ({ ...prev, [key]: !prev[key] })),
    [],
  );

  const setFontSize = useCallback(
    (size: FontSize) => setState(prev => ({ ...prev, fontSize: size })),
    [],
  );

  const reset = useCallback(() => setState(DEFAULT_STATE), []);

  return (
    <>
      {/* ── Floating trigger button ─────────────────────────────────────────
          Positioned bottom-left: in RTL layout this is the logical "end" side.
          Rises above the mobile bottom-nav (which is ~64px tall) on small screens. */}
      <button
        onClick={() => setOpen(true)}
        aria-label="פתח תפריט נגישות"
        title="נגישות"
        className={[
          'fixed bottom-24 left-4 md:bottom-6 md:left-6 z-50',
          'w-12 h-12 rounded-full bg-primary text-primary-foreground shadow-lg',
          'flex items-center justify-center',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
          'transition-transform hover:scale-105 active:scale-95',
        ].join(' ')}
      >
        <PersonStanding  className="w-6 h-6" aria-hidden="true" />
      </button>

      {/* ── Accessibility panel ─────────────────────────────────────────────
          Opens from the left (logical "end" in RTL). Sheet is Radix Dialog-based
          and handles focus trapping, Escape key, and aria-modal automatically. */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent
          side="left"
          className="w-80 max-w-[90vw] flex flex-col gap-0 px-6"
        >
          <SheetHeader className="mb-6 mt-4">
            <SheetTitle className="text-right text-lg">הגדרות נגישות</SheetTitle>
            <SheetDescription className="text-right text-sm text-muted-foreground">
              התאם את תצוגת האתר לצרכיך
            </SheetDescription>
          </SheetHeader>

          <div className="flex flex-col gap-6 flex-1 overflow-y-auto">

            {/* Font size ────────────────────────────────────────────────── */}
            <section aria-labelledby="a11y-font-heading">
              <div className="flex items-center gap-2 mb-3">
                <Type className="w-4 h-4 text-muted-foreground" aria-hidden="true" />
                <span id="a11y-font-heading" className="text-sm font-semibold">
                  גודל טקסט
                </span>
              </div>
              {/* role="group" + aria-labelledby lets AT announce the group name */}
              <div
                role="group"
                aria-labelledby="a11y-font-heading"
                className="flex gap-2"
              >
                <FontButton size="normal" label="רגיל"      current={state.fontSize} onSelect={setFontSize} />
                <FontButton size="large"  label="גדול"      current={state.fontSize} onSelect={setFontSize} />
                <FontButton size="xl"     label="גדול מאוד" current={state.fontSize} onSelect={setFontSize} />
              </div>
            </section>

            <div className="border-t border-border" role="separator" />

            {/* Boolean toggles ──────────────────────────────────────────── */}
            <section aria-label="אפשרויות תצוגה" className="flex flex-col gap-4">
              <ToggleRow
                labelId="a11y-contrast-label"
                icon={<Contrast className="w-4 h-4" />}
                label="ניגודיות גבוהה"
                checked={state.highContrast}
                onChange={() => toggleKey('highContrast')}
              />
              <ToggleRow
                labelId="a11y-grayscale-label"
                icon={<Eye className="w-4 h-4" />}
                label="גווני אפור"
                checked={state.grayscale}
                onChange={() => toggleKey('grayscale')}
              />
              <ToggleRow
                labelId="a11y-links-label"
                icon={<Link2 className="w-4 h-4" />}
                label="הדגשת קישורים"
                checked={state.highlightLinks}
                onChange={() => toggleKey('highlightLinks')}
              />
              <ToggleRow
                labelId="a11y-motion-label"
                icon={<Zap className="w-4 h-4" />}
                label="הפחתת אנימציות"
                checked={state.reduceMotion}
                onChange={() => toggleKey('reduceMotion')}
              />
            </section>

            <div className="border-t border-border" role="separator" />

            {/* Reset ────────────────────────────────────────────────────── */}
            <button
              onClick={reset}
              className={[
                'w-full py-2 text-sm text-muted-foreground',
                'flex items-center justify-center gap-2 rounded-md',
                'hover:bg-muted hover:text-foreground transition-colors',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1',
              ].join(' ')}
              aria-label="אפס את כל הגדרות הנגישות לברירת המחדל"
            >
              <RotateCcw className="w-4 h-4" aria-hidden="true" />
              אפס הגדרות
            </button>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
