import { Candidate } from './types';
import rawTsv from './spreadsheet_data.tsv?raw';

// Map Hebrew party names → internal IDs
const partyIdMap: Record<string, string> = {
  'הליכוד': 'likud',
  'יש עתיד': 'yesh-atid',
  'המחנה הממלכתי': 'mahaneh-mamlachti',
  'ש"ס': 'shas',
  'יהדות התורה': 'yahadut-hatora',
  'ישראל ביתנו': 'israel-beytenu',
  'רע"מ': 'raam',
  'חד"ש-תע"ל': 'hadash-taal',
  'הדמוקרטים': 'democrats',
  'דמוקרטים': 'democrats',
  'עוצמה יהודית': 'otzma',
  'ציונות הדתית': 'zionut-datit',
  'הציונות הדתית': 'zionut-datit',
  'בנט 26': 'bennett26',
  'ישר': 'yashar',
  'נועם': 'zionut-datit',
  'מרצ': 'democrats',
  'העבודה': 'democrats',
};

// Normalize display names (TSV name → display name)
const partyDisplayName: Record<string, string> = {
  'המחנה הממלכתי': 'כחול לבן',
};

// Actual column positions in the real data (0-indexed)
// Updated to match TSV v2: new cols at 3 (candidateStatus), 13 (vector skip),
// 16 (vector skip), 30 (hassidut) shift everything accordingly.
const C = {
  name: 0,
  party: 1,
  listPosition: 2,
  // col 3: מועמד חדש/מכהן/חוזר — candidateStatus (not in Candidate type)
  training: 4,
  educationLevel: 5,
  educationField: 6,
  educationInstitution: 7,
  educationCategory: 8,
  firstElected: 9,
  seniority: 10,
  preKnessetRole: 11,
  preKnessetCategory: 12,
  // col 13: ווקטור קטגוריה 1 — skip
  role2: 14,
  role2Category: 15,
  // col 16: ווקטור קטגוריה 2 — skip
  currentRole: 17,
  ministerialPast: 18,
  ministerialExperience: 19,  // "V" = true
  committees: 20,
  previousParty: 21,
  gender: 22,                  // "ז" = male, "נ" = female
  birthYear: 23,
  age: 24,
  militaryType: 25,
  militaryRank: 26,
  militaryUnit: 27,
  isCombat: 28,                // "V" = true
  exemptionReason: 29,
  // col 30: ישיבה\חסידות — hassidut (not in Candidate type)
  underTrial: 31,
  sector: 32,
  subGroup: 33,
  city: 34,
  district: 35,                // has "מחוז " prefix
  subDistrict: 36,             // has "נפת " prefix
  peripheryIndex: 37,
  languages: 38,               // comma-separated
  orientation: 39,
  ticket1: 40,
  _ticket1Vector: 41,          // skip
  ticket2: 42,
  _ticket2Vector: 43,          // skip
  funFact: 44,
  _economicInterests: 45,      // skip for now
  wikipedia: 46,
  facebook: 47,
  knessetSite: 48,
  stanceDraft: 49,
  stanceEducation: 50,
  stanceTransport: 51,
  _courage: 52,
  _committeeAttendance: 53,
  _knessetAttendance: 54,
} as const;

function col(cols: string[], idx: number): string {
  return cols[idx]?.trim() || '';
}

function isUrl(s: string): boolean {
  return s.startsWith('http://') || s.startsWith('https://');
}

function cleanDistrict(raw: string): string {
  return raw.replace(/^מחוז\s+/, '').trim();
}

function parseTsv(): Candidate[] {
  const lines = rawTsv.trim().split('\n');
  const result: Candidate[] = [];

  lines.forEach((line) => {
    if (!line.trim()) return;
    const cols = line.split('\t');

    const name = col(cols, C.name);
    const party = col(cols, C.party);
    // Skip empty or header rows
    if (!name || !party || name === 'שם חבר הכנסת') return;
    const rawPosition = col(cols, C.listPosition);
    const listPosition = parseInt(rawPosition, 10);
    const resolvedPosition = (isNaN(listPosition) || listPosition <= 0) ? 0 : listPosition;

    const partyId = partyIdMap[party] ?? party.replace(/['"״]/g, '').replace(/\s+/g, '-').toLowerCase();

    const genderRaw = col(cols, C.gender);
    const gender: 'male' | 'female' = (genderRaw === 'נ' || genderRaw === 'נקבה' || genderRaw === 'F') ? 'female' : 'male';

    const age = parseInt(col(cols, C.age), 10) || 0;
    const birthYear = parseInt(col(cols, C.birthYear), 10) || undefined;
    const seniority = parseInt(col(cols, C.seniority), 10) || 0;
    const firstElected = parseInt(col(cols, C.firstElected), 10) || undefined;
    const isNewcomer = firstElected ? firstElected >= 2023 : seniority === 0;

    const districtRaw = col(cols, C.district);
    const district = cleanDistrict(districtRaw);
    const region = district || col(cols, C.city) || 'מרכז';

    const peripheryRaw = parseInt(col(cols, C.peripheryIndex), 10);
    const peripheryIndex = isNaN(peripheryRaw) ? undefined : peripheryRaw;

    const langRaw = col(cols, C.languages);
    const langs = langRaw ? langRaw.split(/[,،]/).map(s => s.trim()).filter(Boolean) : undefined;

    const isCombat = col(cols, C.isCombat) === 'V';
    const ministerialExperience = col(cols, C.ministerialExperience) === 'V';

    const underTrialRaw = col(cols, C.underTrial);
    const underTrial = !!underTrialRaw && underTrialRaw.length > 0;

    const wikiRaw = col(cols, C.wikipedia);
    const fbRaw = col(cols, C.facebook);
    const knessetRaw = col(cols, C.knessetSite);

    result.push({
      // Core
      id: resolvedPosition > 0 ? `${partyId}-${resolvedPosition}` : `${partyId}-${name.replace(/\s+/g, '-')}`,
      name,
      party: partyDisplayName[party] ?? party,
      partyId,
      gender,
      region,
      age,
      education: col(cols, C.educationLevel),
      seniority,
      profession: col(cols, C.preKnessetRole),
      listPosition: resolvedPosition,

      // Professional identity
      training: col(cols, C.training) || undefined,
      educationField: col(cols, C.educationField) || undefined,
      educationInstitution: col(cols, C.educationInstitution) || undefined,
      educationCategory: col(cols, C.educationCategory) || undefined,
      preKnessetCategory: col(cols, C.preKnessetCategory) || undefined,
      role2: col(cols, C.role2) || undefined,
      role2Category: col(cols, C.role2Category) || undefined,

      // Political record
      firstElected,
      isNewcomer,
      ministerialExperience,

      // Personal
      birthYear,
      city: col(cols, C.city) || undefined,
      district: district || undefined,
      subDistrict: col(cols, C.subDistrict).replace(/^נפת\s+/, '') || undefined,
      peripheryIndex,
      sector: col(cols, C.sector) || undefined,
      subGroup: col(cols, C.subGroup) || undefined,
      languages: langs,

      // Military
      militaryType: col(cols, C.militaryType) || undefined,
      militaryRank: col(cols, C.militaryRank) || undefined,
      militaryUnit: col(cols, C.militaryUnit) || undefined,
      isCombat: isCombat || undefined,
      exemptionReason: col(cols, C.exemptionReason) || undefined,

      // Ideology
      orientation: col(cols, C.orientation) || undefined,
      ticket1: col(cols, C.ticket1) || undefined,
      ticket2: col(cols, C.ticket2) || undefined,
      stanceDraft: col(cols, C.stanceDraft) || undefined,

      // UX
      funFact: col(cols, C.funFact) || undefined,
      wikipedia: isUrl(wikiRaw) ? wikiRaw : undefined,
      facebook: isUrl(fbRaw) ? fbRaw : undefined,
      knessetSite: isUrl(knessetRaw) ? knessetRaw : undefined,
      underTrial,
    });
  });

  return result;
}

export const candidates: Candidate[] = parseTsv();

export function getCandidatesByParty(partyId: string): Candidate[] {
  return candidates.filter(c => c.partyId === partyId).sort((a, b) => {
    if (a.listPosition === 0) return 1;
    if (b.listPosition === 0) return -1;
    return a.listPosition - b.listPosition;
  });
}
