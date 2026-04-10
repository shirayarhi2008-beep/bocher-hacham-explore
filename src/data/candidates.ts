import { Candidate } from './types';
import rawTsv from './candidates-raw.tsv?raw';

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
const C = {
  name: 0,
  party: 1,
  listPosition: 2,
  training: 3,
  educationLevel: 4,
  educationField: 5,
  educationInstitution: 6,
  educationCategory: 7,
  firstElected: 8,
  seniority: 9,
  preKnessetRole: 10,
  preKnessetCategory: 11,
  role2: 12,
  role2Category: 13,
  currentRole: 14,
  ministerialPast: 15,
  ministerialExperience: 16,  // "V" = true
  committees: 17,
  previousParty: 18,
  gender: 19,                  // "ז" = male, "נ" = female
  birthYear: 20,
  age: 21,
  militaryType: 22,
  militaryRank: 23,
  militaryUnit: 24,
  isCombat: 25,                // "V" = true
  exemptionReason: 26,
  underTrial: 27,
  sector: 28,
  subGroup: 29,
  city: 30,
  district: 31,                // has "מחוז " prefix
  subDistrict: 32,             // has "נפת " prefix
  peripheryIndex: 33,
  languages: 34,               // comma-separated
  orientation: 35,
  ticket1: 36,
  _ticket1Vector: 37,          // skip
  ticket2: 38,
  _ticket2Vector: 39,          // skip
  funFact: 40,
  _economicInterests: 41,      // skip for now
  wikipedia: 42,
  facebook: 43,
  knessetSite: 44,
  stanceDraft: 45,
  stanceEducation: 46,
  stanceTransport: 47,
  _courage: 48,
  _committeeAttendance: 49,
  _knessetAttendance: 50,
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
    // Skip header/metadata rows: list position must be a valid number
    const rawPosition = col(cols, C.listPosition);
    const listPosition = parseInt(rawPosition, 10);
    if (!name || !party || isNaN(listPosition) || listPosition <= 0) return;

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
      id: `${partyId}-${listPosition}`,
      name,
      party: partyDisplayName[party] ?? party,
      partyId,
      gender,
      region,
      age,
      education: col(cols, C.educationLevel),
      seniority,
      profession: col(cols, C.preKnessetRole),
      listPosition,

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
  return candidates.filter(c => c.partyId === partyId).sort((a, b) => a.listPosition - b.listPosition);
}
