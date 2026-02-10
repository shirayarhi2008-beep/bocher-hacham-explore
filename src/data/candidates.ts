import { Candidate } from './types';

const firstNamesMale = ['אבי','יוסי','משה','דוד','יעקב','חיים','אריה','בנימין','שמעון','דני','עמית','גיל','אורן','ניר','רון','אלון','עידו','תומר','יונתן','אסף','גדי','מיכאל','רפי','צחי','אמיר','ליאור','עמרי','שי','ברק','נדב'];
const firstNamesFemale = ['שרה','רחל','מיכל','תמר','נועה','דנה','אורלי','גלית','מירי','לימור','ענת','רונית','הילה','סיגל','אירית','יעל','עדי','שירה','ליאת','קרן','מאיה','אביגיל','שלומית','חגית','נורית','אסתר','דפנה','מורן','רותם','טלי'];
const lastNames = ['כהן','לוי','מזרחי','פרץ','ביטון','אברהם','דוד','חיים','יוסף','שלום','אזולאי','עמר','דהן','גבאי','אוחנה','שמעוני','רבינוביץ','גולדשטיין','פרידמן','קפלן','ברגר','שטרן','וייס','רוזנברג','בלום','סגל','נחמיאס','אליהו','מלכה','בוחבוט','מרדכי','סויסה','חזן','אלמוג','שפירא','גרינברג','בנאי','שגב','הרצוג','ברון'];
const regions = ['צפון','דרום','מרכז','ירושלים','חיפה','תל אביב','יהודה ושומרון','נגב'];
const educations = ['תואר ראשון','תואר שני','דוקטורט','הנדסאי','תיכונית','ישיבתית','תואר שלישי'];
const professions = ['עורך דין','רואה חשבון','מהנדס','מורה','רופא','כלכלן','איש עסקים','קצין צבא','עיתונאי','פעיל חברתי','יועץ','מנהל','אקדמאי','חוקר','דיפלומט','פוליטיקאי'];

const partyIds = ['likud','yesh-atid','mahaneh-mamlachti','shas','yahadut-hatora','israel-beytenu','raam','hadash-taal','meretz','otzma','noam','avoda'];
const partyNames: Record<string, string> = {
  'likud': 'הליכוד', 'yesh-atid': 'יש עתיד', 'mahaneh-mamlachti': 'המחנה הממלכתי',
  'shas': 'ש"ס', 'yahadut-hatora': 'יהדות התורה', 'israel-beytenu': 'ישראל ביתנו',
  'raam': 'רע"מ', 'hadash-taal': 'חד"ש-תע"ל', 'meretz': 'מרצ', 'otzma': 'עוצמה יהודית',
  'noam': 'נועם', 'avoda': 'העבודה',
};

function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return s / 2147483647;
  };
}

function generateCandidates(): Candidate[] {
  const rand = seededRandom(42);
  const pick = <T>(arr: T[]): T => arr[Math.floor(rand() * arr.length)];
  const candidates: Candidate[] = [];
  
  // distribute ~120 candidates across parties
  const distribution = [15, 14, 12, 10, 8, 8, 8, 8, 10, 8, 5, 10]; // total = 116 + a few extra
  
  partyIds.forEach((partyId, pi) => {
    const count = distribution[pi] || 8;
    for (let i = 0; i < count; i++) {
      const isFemale = rand() < 0.35;
      const gender = isFemale ? 'female' : 'male';
      const firstName = isFemale ? pick(firstNamesFemale) : pick(firstNamesMale);
      const lastName = pick(lastNames);
      candidates.push({
        id: `${partyId}-${i}`,
        name: `${firstName} ${lastName}`,
        party: partyNames[partyId],
        partyId,
        gender,
        region: pick(regions),
        age: 28 + Math.floor(rand() * 42),
        education: pick(educations),
        seniority: Math.floor(rand() * 25),
        profession: pick(professions),
      });
    }
  });
  
  return candidates;
}

export const candidates: Candidate[] = generateCandidates();

export function getCandidatesByParty(partyId: string): Candidate[] {
  return candidates.filter(c => c.partyId === partyId);
}
