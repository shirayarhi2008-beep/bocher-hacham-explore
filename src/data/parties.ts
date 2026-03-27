import { Party } from './types';

export const parties: Party[] = [
  {
    id: 'likud', name: 'הליכוד', color: '#2563eb', seats: 32, candidates: 15,
    genderRatio: 27, avgAge: 52, educationBreakdown: { academic: 60, professional: 25, other: 15 }, avgSeniority: 12,
  },
  {
    id: 'yesh-atid', name: 'יש עתיד', color: '#06b6d4', seats: 24, candidates: 14,
    genderRatio: 43, avgAge: 47, educationBreakdown: { academic: 71, professional: 21, other: 8 }, avgSeniority: 6,
  },
  {
    id: 'mahaneh-mamlachti', name: 'המחנה הממלכתי', color: '#3b82f6', seats: 12, candidates: 12,
    genderRatio: 42, avgAge: 50, educationBreakdown: { academic: 75, professional: 17, other: 8 }, avgSeniority: 8,
  },
  {
    id: 'shas', name: 'ש"ס', color: '#7c3aed', seats: 11, candidates: 10,
    genderRatio: 0, avgAge: 55, educationBreakdown: { academic: 30, professional: 20, other: 50 }, avgSeniority: 15,
  },
  {
    id: 'yahadut-hatora', name: 'יהדות התורה', color: '#1e293b', seats: 7, candidates: 8,
    genderRatio: 0, avgAge: 58, educationBreakdown: { academic: 25, professional: 15, other: 60 }, avgSeniority: 18,
  },
  {
    id: 'israel-beytenu', name: 'ישראל ביתנו', color: '#dc2626', seats: 6, candidates: 8,
    genderRatio: 25, avgAge: 51, educationBreakdown: { academic: 50, professional: 30, other: 20 }, avgSeniority: 10,
  },
  {
    id: 'raam', name: 'רע"מ', color: '#16a34a', seats: 5, candidates: 8,
    genderRatio: 13, avgAge: 48, educationBreakdown: { academic: 50, professional: 25, other: 25 }, avgSeniority: 5,
  },
  {
    id: 'hadash-taal', name: 'חד"ש-תע"ל', color: '#ef4444', seats: 5, candidates: 8,
    genderRatio: 38, avgAge: 45, educationBreakdown: { academic: 63, professional: 25, other: 12 }, avgSeniority: 7,
  },
  {
    id: 'meretz', name: 'דמוקרטים', color: '#22c55e', seats: 6, candidates: 10,
    genderRatio: 60, avgAge: 43, educationBreakdown: { academic: 80, professional: 15, other: 5 }, avgSeniority: 5,
  },
  {
    id: 'otzma', name: 'עוצמה יהודית', color: '#f59e0b', seats: 7, candidates: 8,
    genderRatio: 13, avgAge: 46, educationBreakdown: { academic: 38, professional: 37, other: 25 }, avgSeniority: 4,
  },
  {
    id: 'noam', name: 'ציונות הדתית', color: '#a855f7', seats: 1, candidates: 5,
    genderRatio: 0, avgAge: 42, educationBreakdown: { academic: 40, professional: 40, other: 20 }, avgSeniority: 2,
  },
  {
    id: 'avoda', name: 'דמוקרטים', color: '#e11d48', seats: 4, candidates: 10,
    genderRatio: 50, avgAge: 49, educationBreakdown: { academic: 70, professional: 20, other: 10 }, avgSeniority: 9,
  },
];

export function getPartyById(id: string): Party | undefined {
  return parties.find(p => p.id === id);
}

export function getPartyColor(partyId: string): string {
  return getPartyById(partyId)?.color || '#94a3b8';
}
