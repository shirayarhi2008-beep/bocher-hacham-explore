import { Candidate } from './types';
import rawTsv from './candidates-raw.tsv?raw';

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
  'נועם': 'noam',
  'מרצ': 'meretz',
};

const regionFromDistrict: Record<string, string> = {
  'תל אביב': 'תל אביב',
  'מרכז': 'מרכז',
  'ירושלים': 'ירושלים',
  'חיפה': 'חיפה',
  'צפון': 'צפון',
  'דרום': 'דרום',
  'יהודה ושומרון': 'יהודה ושומרון',
};

function parseTsv(): Candidate[] {
  const lines = rawTsv.trim().split('\n');
  if (lines.length < 2) return [];

  // skip header row
  const dataLines = lines.slice(1);
  const result: Candidate[] = [];

  dataLines.forEach((line, idx) => {
    if (!line.trim()) return;
    const cols = line.split('\t');

    const name = cols[0]?.trim() || '';
    const party = cols[1]?.trim() || '';
    const listPosition = parseInt(cols[2]?.trim() || '0', 10) || idx + 1;
    // cols[3] = הכשרה, cols[4] = רמת השכלה, cols[5] = תחום השכלה
    const educationLevel = cols[4]?.trim() || '';
    // cols[8] = נבחר לראשונה (year), cols[9] = זמן ותק
    const firstElected = parseInt(cols[8]?.trim() || '0', 10);
    const seniority = parseInt(cols[9]?.trim() || '0', 10) || (firstElected ? 2024 - firstElected : 0);
    // cols[16] = מגדר, cols[17] = שנת לידה, cols[18] = גיל
    const genderRaw = cols[16]?.trim() || '';
    const birthYear = parseInt(cols[17]?.trim() || '0', 10);
    const age = parseInt(cols[18]?.trim() || '0', 10) || (birthYear ? 2024 - birthYear : 40);
    // cols[27] = עיר מגורים, cols[28] = מחוז, cols[29] = נפה, cols[30] = פריפריה
    const city = cols[27]?.trim() || '';
    const district = cols[28]?.trim() || '';
    // cols[11] = תפקיד לפני הכנסת
    const profession = cols[11]?.trim() || '';

    if (!name || !party) return;

    const gender: 'male' | 'female' = genderRaw === 'נקבה' || genderRaw === 'אישה' || genderRaw === 'F' ? 'female' : 'male';
    const partyId = partyIdMap[party] || party.toLowerCase().replace(/[^a-z0-9]/g, '-');
    const region = regionFromDistrict[district] || district || city || 'מרכז';

    // map education level to our categories
    let education = educationLevel;
    if (!education) education = 'לא ידוע';

    result.push({
      id: `${partyId}-${listPosition}`,
      name,
      party,
      partyId,
      gender,
      region,
      age,
      education,
      seniority,
      profession,
      listPosition,
    });
  });

  return result;
}

export const candidates: Candidate[] = parseTsv();

export function getCandidatesByParty(partyId: string): Candidate[] {
  return candidates.filter(c => c.partyId === partyId);
}
