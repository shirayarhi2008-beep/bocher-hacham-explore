import { Party } from './types';

export const parties: Party[] = [
  {
    id: 'likud', name: 'הליכוד', color: '#1d4ed8', seats: 32, candidates: 41,
    genderRatio: 22, avgAge: 54, educationBreakdown: { academic: 62, professional: 22, other: 16 }, avgSeniority: 14,
  },
  {
    id: 'yesh-atid', name: 'יש עתיד', color: '#0ea5e9', seats: 24, candidates: 26,
    genderRatio: 40, avgAge: 48, educationBreakdown: { academic: 72, professional: 20, other: 8 }, avgSeniority: 8,
  },
  {
    id: 'mahaneh-mamlachti', name: 'המחנה הממלכתי', color: '#3b82f6', seats: 12, candidates: 15,
    genderRatio: 40, avgAge: 51, educationBreakdown: { academic: 78, professional: 15, other: 7 }, avgSeniority: 9,
  },
  {
    id: 'shas', name: 'ש"ס', color: '#6d28d9', seats: 11, candidates: 14,
    genderRatio: 0, avgAge: 56, educationBreakdown: { academic: 28, professional: 22, other: 50 }, avgSeniority: 16,
  },
  {
    id: 'zionut-datit', name: 'הציונות הדתית', color: '#f97316', seats: 7, candidates: 10,
    genderRatio: 10, avgAge: 47, educationBreakdown: { academic: 55, professional: 30, other: 15 }, avgSeniority: 5,
  },
  {
    id: 'otzma', name: 'עוצמה יהודית', color: '#dc2626', seats: 6, candidates: 10,
    genderRatio: 10, avgAge: 46, educationBreakdown: { academic: 40, professional: 35, other: 25 }, avgSeniority: 4,
  },
  {
    id: 'yahadut-hatora', name: 'יהדות התורה', color: '#1e293b', seats: 7, candidates: 9,
    genderRatio: 0, avgAge: 59, educationBreakdown: { academic: 22, professional: 18, other: 60 }, avgSeniority: 19,
  },
  {
    id: 'israel-beytenu', name: 'ישראל ביתנו', color: '#b91c1c', seats: 6, candidates: 8,
    genderRatio: 25, avgAge: 52, educationBreakdown: { academic: 55, professional: 28, other: 17 }, avgSeniority: 11,
  },
  {
    id: 'raam', name: 'רע"מ', color: '#16a34a', seats: 5, candidates: 6,
    genderRatio: 0, avgAge: 49, educationBreakdown: { academic: 52, professional: 28, other: 20 }, avgSeniority: 6,
  },
  {
    id: 'hadash-taal', name: 'חד"ש-תע"ל', color: '#ef4444', seats: 5, candidates: 7,
    genderRatio: 30, avgAge: 46, educationBreakdown: { academic: 65, professional: 22, other: 13 }, avgSeniority: 8,
  },
  {
    id: 'democrats', name: 'הדמוקרטים', color: '#22c55e', seats: 8, candidates: 12,
    genderRatio: 55, avgAge: 44, educationBreakdown: { academic: 82, professional: 12, other: 6 }, avgSeniority: 6,
  },
  {
    id: 'bennett26', name: 'בנט 26', color: '#0891b2', seats: 0, candidates: 5,
    genderRatio: 30, avgAge: 46, educationBreakdown: { academic: 70, professional: 20, other: 10 }, avgSeniority: 3,
  },
  {
    id: 'yashar', name: 'ישר', color: '#7c3aed', seats: 0, candidates: 4,
    genderRatio: 35, avgAge: 44, educationBreakdown: { academic: 68, professional: 22, other: 10 }, avgSeniority: 4,
  },
];

export function getPartyById(id: string): Party | undefined {
  return parties.find(p => p.id === id);
}

export function getPartyColor(partyId: string): string {
  return getPartyById(partyId)?.color || '#94a3b8';
}
