import { CategoryInfo } from './types';

export const categories: CategoryInfo[] = [
  {
    key: 'gender',
    title: 'מגדר',
    icon: 'Users',
    color: 'hsl(340, 80%, 55%)',
    description: 'ייצוג מגדרי במפלגות',
    insightFact: 'רק 29% מחברי הכנסת הנוכחית הן נשים — ירידה מ-33% בכנסת הקודמת.',
  },
  {
    key: 'periphery',
    title: 'פריפריאליות',
    icon: 'MapPin',
    color: 'hsl(200, 85%, 55%)',
    description: 'ייצוג גיאוגרפי — מרכז מול פריפריה',
    insightFact: '62% מהמועמדים מגיעים מאזור המרכז, למרות שרק 42% מהאוכלוסייה גרה שם.',
  },
  {
    key: 'professionalism',
    title: 'מקצועיות',
    icon: 'Briefcase',
    color: 'hsl(160, 70%, 45%)',
    description: 'רקע מקצועי של המועמדים',
    insightFact: '35% מהמועמדים הם עורכי דין — המקצוע הנפוץ ביותר בקרב פוליטיקאים.',
  },
  {
    key: 'education',
    title: 'השכלה',
    icon: 'GraduationCap',
    color: 'hsl(270, 75%, 60%)',
    description: 'רמת השכלה של המועמדים',
    insightFact: '58% מהמועמדים בעלי תואר אקדמי לפחות.',
  },
  {
    key: 'age',
    title: 'גיל',
    icon: 'Calendar',
    color: 'hsl(38, 95%, 55%)',
    description: 'התפלגות גילאים של המועמדים',
    insightFact: 'הגיל הממוצע של חבר כנסת הוא 51 — המבוגר ביותר מזה 20 שנה.',
  },
  {
    key: 'seniority',
    title: 'ותק',
    icon: 'Clock',
    color: 'hsl(12, 90%, 65%)',
    description: 'ניסיון פוליטי של המועמדים',
    insightFact: '40% מהמועמדים הם טירונים פוליטיים עם פחות מ-3 שנות ותק.',
  },
];

export function getCategoryByKey(key: string): CategoryInfo | undefined {
  return categories.find(c => c.key === key);
}
