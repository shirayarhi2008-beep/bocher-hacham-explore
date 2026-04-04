// tailwind.config.js — בוחרים ח"כם
// מקור האמת הטכני של מערכת העיצוב.
// אין לשנות ערכים ללא עדכון מקביל ב-DESIGN_SYSTEM.md
import tailwindcssAnimate from 'tailwindcss-animate';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{js,ts,jsx,tsx,html}'],

  theme: {
    extend: {
      // ─── Colors ───────────────────────────────────────────
      colors: {
        // ── Brand palette (static hex) ──
        primary: {
          DEFAULT: '#2952d9',
          light: '#5982fe',
          foreground: 'hsl(var(--primary-foreground))',
        },
        success: '#88b12d',
        warning: '#fa8501',
        attention: '#f9bc01',
        accent: {
          DEFAULT: '#50bab6',
          foreground: 'hsl(var(--accent-foreground))',
        },
        neutral: {
          strong: '#424b68',
        },

        // ── shadcn/ui compatibility (CSS-variable based) ──
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        sidebar: {
          DEFAULT: 'hsl(var(--sidebar-background))',
          foreground: 'hsl(var(--sidebar-foreground))',
          primary: 'hsl(var(--sidebar-primary))',
          'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
          accent: 'hsl(var(--sidebar-accent))',
          'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
          border: 'hsl(var(--sidebar-border))',
          ring: 'hsl(var(--sidebar-ring))',
        },
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))',
        },
      },

      // ─── Gradients ────────────────────────────────────────
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #2952d9, #5982fe)',
      },

      // ─── Typography ───────────────────────────────────────
      fontFamily: {
        sans: ['Heebo', 'sans-serif'],
      },

      fontSize: {
        display: ['2.5rem', { lineHeight: '1.2', fontWeight: '800' }],
        h1: ['2rem', { lineHeight: '1.3', fontWeight: '700' }],
        h2: ['1.5rem', { lineHeight: '1.3', fontWeight: '700' }],
        h3: ['1.25rem', { lineHeight: '1.4', fontWeight: '600' }],
        'body-lg': ['1.125rem', { lineHeight: '1.7', fontWeight: '400' }],
        body: ['1rem', { lineHeight: '1.7', fontWeight: '400' }],
        sm: ['0.875rem', { lineHeight: '1.5', fontWeight: '400' }],
        xs: ['0.75rem', { lineHeight: '1.4', fontWeight: '500' }],
      },

      // ─── Spacing ──────────────────────────────────────────
      // משתמשים בסקאלה הבסיסית של Tailwind (4px base)
      // הטוקנים המוגדרים בתיעוד (space-1 עד space-24) ממופים ל:
      // space-1 = p-1 (4px), space-2 = p-2 (8px) ... וכו'
      // אין צורך להגדיר מחדש — הסקאלה של Tailwind תואמת

      // ─── Border Radius ────────────────────────────────────
      borderRadius: {
        sm: '4px',
        md: '8px',
        lg: '12px',
        xl: '16px',
        pill: '999px',
      },

      // ─── Shadows ──────────────────────────────────────────
      boxShadow: {
        'card-hover': '0 4px 16px rgba(0, 0, 0, 0.08)',
        nav: '0 1px 0 rgba(0, 0, 0, 0.08)',
      },

      // ─── Max Width ────────────────────────────────────────
      maxWidth: {
        content: '1280px',
      },

      // ─── Transitions ──────────────────────────────────────
      transitionDuration: {
        fast: '100ms',
        normal: '200ms',
      },
      transitionTimingFunction: {
        default: 'ease',
      },

      // ─── Breakpoints ──────────────────────────────────────
      // Tailwind ברירת מחדל תואמת (sm/md/lg/xl)
      // אין צורך לשנות
    },
  },

  plugins: [tailwindcssAnimate],
};
