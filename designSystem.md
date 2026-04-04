# 🎨 DESIGN SYSTEM — בוחרים ח"כם

> מקור האמת העיצובי של הפרויקט.
> כל קומפוננטה, צבע, מרווח, וטיפוגרפיה מוגדרים כאן.
> אין לסטות מהם ללא עדכון קובץ זה.

---

## 🧠 עקרונות יסוד

1. **ניטרליות ויזואלית** — אין צבעי מפלגות, אין רמזים פוליטיים בעיצוב
2. **מינימליזם** — כל אלמנט שאינו משרת תפקיד — מוסר
3. **היררכיה ברורה** — המשתמש תמיד יודע איפה הוא ולאן הוא יכול להמשיך
4. **RTL ראשי** — כל ה-layout מתוכנן לעברית/ערבית. LTR הוא adaptation
5. **Mobile-first** — עיצוב מתחיל ממסך 375px ומתרחב למעלה

---

🎨 פלטת צבעים
Primary
--color-primary: #2952d9 → כפתורים, לינקים, הדגשות פעילות
--color-primary-light: #5982fe → hover states, fills עדינים, אייקונים
--gradient-primary: linear-gradient(135deg, #2952d9, #5982fe) → hero, CTA ראשי בלבד
Semantic (משמעות בלבד — לא דקורטיבי)
--color-success: #88b12d → מצב חיובי, אישור
--color-warning: #fa8501 → אזהרה, שים לב
--color-attention: #f9bc01 → badge, highlight קטן בלבד
Supporting
--color-accent: #50bab6 → גרפים, data viz, accent משני
--color-neutral-strong: #424b68 → טקסט משני, borders, רקעים עדינים
Neutrals (סקאלה)
--color-gray-50: #f8f9fa
--color-gray-100: #f1f3f5
--color-gray-200: #e9ecef
--color-gray-400: #ced4da
--color-gray-600: #868e96
--color-gray-800: #343a40
--color-gray-900: #212529
כללי שימוש קריטיים

צבע דומיננטי אחד בלבד לכל מסך
מקסימום 2 צבעי accent לכל קומפוננטה
גרדיאנט — hero ו-CTA ראשי בלבד, לא על כפתורים רגילים
צהוב (attention) — אסור על כפתורים, רקעים גדולים, בלוקי טקסט
אין להכניס צבעים חדשים שאינם בפלטה

---

## 🔤 טיפוגרפיה

**פונט יחיד:** Heebo (Google Fonts)
תומך בעברית, ערבית (עם Noto Sans Arabic), אנגלית, רוסית

```html
<link
  href="https://fonts.googleapis.com/css2?family=Heebo:wght@300;400;500;600;700;800&display=swap"
  rel="stylesheet" />
```

### סקאלה

| Token          | Size            | Weight | שימוש                     |
| -------------- | --------------- | ------ | ------------------------- |
| `text-display` | 2.5rem (40px)   | 800    | כותרת ראשית — דף בית בלבד |
| `text-h1`      | 2rem (32px)     | 700    | כותרת עמוד                |
| `text-h2`      | 1.5rem (24px)   | 700    | כותרת סקשן                |
| `text-h3`      | 1.25rem (20px)  | 600    | כותרת קומפוננטה           |
| `text-body-lg` | 1.125rem (18px) | 400    | גוף טקסט ראשי             |
| `text-body`    | 1rem (16px)     | 400    | גוף טקסט רגיל             |
| `text-sm`      | 0.875rem (14px) | 400    | metadata, תאריכים         |
| `text-xs`      | 0.75rem (12px)  | 500    | badge, label              |

### כללים

- line-height גוף: 1.7 (קריאות עברית)
- line-height כותרות: 1.3
- אין לערבב weights באותה קומפוננטה מעבר לשניים
- RTL: `dir="rtl"` על `<html>`, LTR per-element כשנדרש

---

## 📐 Spacing & Layout

### יחידת בסיס: 4px

```
space-1:  4px
space-2:  8px
space-3:  12px
space-4:  16px
space-5:  20px
space-6:  24px
space-8:  32px
space-10: 40px
space-12: 48px
space-16: 64px
space-20: 80px
space-24: 96px
```

### Grid

- Max content width: **1280px**
- Gutter: 24px (מובייל), 32px (טאבלט+)
- עמודות: 4 (מובייל) / 8 (טאבלט) / 12 (דסקטופ)

### Breakpoints

```
sm:  640px
md:  768px
lg:  1024px
xl:  1280px
```

---

## 🧱 קומפוננטות בסיס

### Button

**Primary**

```
רקע: gradient-primary
טקסט: לבן, font-weight 600
padding: 12px 24px
border-radius: 8px
hover: translateY(-1px) + shadow-md
active: scale(0.98)
```

**Secondary**

```
רקע: שקוף
border: 1.5px solid --color-gray-400
טקסט: --color-gray-800
hover: border-color → primary, טקסט → primary
```

**Ghost**

```
רקע: שקוף, ללא border
טקסט: --color-primary-light
hover: רקע --color-gray-50
```

**כללים:**

- אין כפתור צהוב
- אין יותר מסוג אחד של כפתור ראשי בקונטקסט נתון
- כפתור disabled: opacity 0.4, no pointer events

---

### Card

```
רקע: לבן
border: 1px solid --color-gray-200
border-radius: 12px
padding: 24px
shadow: none ב-default
hover shadow: 0 4px 16px rgba(0,0,0,0.08) + translateY(-2px)
transition: 200ms ease
```

שימוש: כרטיס מועמד, כרטיס מפלגה, תוצאת חיפוש

---

### Input / Search

```
border: 1.5px solid --color-gray-300
border-radius: 8px
padding: 12px 16px
font-size: text-body
focus: border-color → primary, outline: 2px solid primary/20
placeholder: --color-gray-400
```

---

### Badge

```
border-radius: 999px (pill)
padding: 2px 10px
font-size: text-xs
font-weight: 500
```

| סוג       | צבע רקע      | צבע טקסט |
| --------- | ------------ | -------- |
| neutral   | gray-100     | gray-700 |
| success   | success/15   | success  |
| warning   | warning/15   | warning  |
| attention | attention/20 | gray-800 |

---

## 🗺️ דפוסי Layout

### Header / Navbar

```
גובה: 64px
רקע: לבן עם border-bottom: 1px solid gray-200
תוכן RTL: לוגו (ימין) + "מפלגות" + חיפוש (שמאל)
sticky: yes
mobile: לוגו + search icon + hamburger
```

**פריטי ניווט — 3 בלבד:**

1. לוגו (קישור לדף בית)
2. מפלגות
3. חיפוש (search icon שנפתח לשדה, או שדה קבוע בדסקטופ)

> אין "רשימות" ו"מועמדים" כפריטים נפרדים בניווט הראשי.

---

### דף בית (Home)

```
[Hero]
  כותרת h1 + תיאור קצר (2 שורות מקסימום) — מה האתר ולמי
  Search bar — נגיש אך לא ה-CTA היחיד
  רקע: לבן נקי

[רשימת מפלגות — Grid — הגוף הראשי של הדף]
  3 עמודות דסקטופ / 2 טאבלט / 1 מובייל
  Card לכל מפלגה: ראשי תיבות + שם + מספר מנדטים
  ללא צבעי מפלגות — כל הכרטיסים באותו עיצוב
```

### דף מפלגות (רשימה כללית)

```
  רשימת כל המפלגות — זהה לגריד בדף הבית
  נגיש מהניווט הראשי
```

---

### דף רשימת מועמדים

```
[Header של המפלגה]
  שם + לוגו + תקציר חד-משפטי

[רשימה]
  layout: רשימה אנכית (לא grid) — קל לסריקה
  כל שורה: מספר ברשימה + תמונה + שם + תפקיד/ועדה + חץ ←
  hover: highlight שורה בשלמותה
  mobile: אותו layout, תמונה קטנה יותר
```

---

### תז"א — תעודת זהות אישית (עמוד עצמאי)

> **חשוב:** תז"א הוא עמוד עצמאי עם URL משלו (`/candidates/[id]`).
> **לא modal, לא drawer, לא popup.**
> חייב להיות ניתן לשיתוף וגוגל.

**ויב:** פרופיל אישי — חם, אנושי, תמונה בולטת. המשתמש צריך להרגיש שהוא מכיר אדם, לא קורא דוח.

```
[Hero — full-width, בולט]
  תמונה גדולה ובולטת — לא עגולה קטנה, אלא נוכחות חזקה בדף
  שם בגודל h1, מפלגה כ-badge מתחת
  מיקום ברשימה + breadcrumb עדין
  רקע: gradient עדין מ-gray-50 ל-לבן, או תמונה עם overlay

  [שורת עובדות מהירות — inline, לא כרטיסים]
  גיל · אזור מגורים · ותק · השכלה

[על האדם — פסקה קצרה]
  2-3 משפטים ביוגרפיים — לא bullet list
  קולגי, קריא, אנושי

[Tabs]
  עמדות | הצבעות | רקע

[עמדות — הטאב הראשי]
  נושא → עמדה → מקור
  ללא עמדה ידועה: "לא תועד" — מפורש ולא מוסתר

[הצבעות]
  רשימה: נושא + בעד/נגד/נמנע (badge semantic) + תאריך + מקור

[מקורות]
  כל פיסת מידע קישורית — גלוי תמיד
```

**מה לא לעשות בתז"א:**

- אין dashboard של גרפים וסטטיסטיקות (זה הופך אותו לדוח, לא לאדם)
- אין כפתור "השווה" — השוואה הוסרה מה-MVP
- אין צבעי מפלגה ב-hero

---

### דף תז"מ — תעודת זהות מפלגתית

```
[Hero]
  לוגו + שם + תיאור קצר + ספקטרום פוליטי (שמאל/מרכז/ימין — עובדתי)

[עמדות מרכזיות]
  רשימת נושאים + עמדת המפלגה + מקור

[רשימת מועמדים]
  CTA לדף הרשימה המלאה
```

---

## 🎬 Motion

**ברירת מחדל: אין אנימציה.**

מותר:

```
hover lift:   translateY(-2px), transition 200ms ease
hover shadow: transition 200ms ease
click scale:  scale(0.98), transition 100ms
fade-in:      opacity 0→1, 150ms (כניסת עמוד בלבד)
```

אסור:

- אנימציות מתמשכות / לופ
- רוטציה / פולסינג
- יותר מאפקט אחד בו-זמנית
- אנימציה דקורטיבית שאינה feedback

---

## ♿ נגישות

- ניגודיות: WCAG AA מינימום (4.5:1 לטקסט, 3:1 לאלמנטי UI)
- כל interactive element: focus-visible ברור (outline 2px primary)
- תמונות מועמדים: alt עם שם מלא
- כפתורים ללא טקסט: aria-label חובה
- סדר tab: לפי סדר ויזואלי ב-RTL

---

## 🔄 איך לעדכן קובץ זה

- שינוי צבע / פונט / spacing → עדכן כאן **ואז** ב-tailwind.config.js
- קומפוננטה חדשה → תעד כאן לפני שכותבים קוד
- החלטה שסוטה מהכללים → תעד את הסיבה ב-Decision Log ב-CLAUDE.md
