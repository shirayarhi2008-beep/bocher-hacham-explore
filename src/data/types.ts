export interface Candidate {
  // ── Core (backward-compatible) ────────────────────────────────────
  id: string;
  name: string;
  party: string;
  partyId: string;
  gender: 'male' | 'female';
  region: string;       // from מחוז
  age: number;
  education: string;    // רמת השכלה
  seniority: number;    // years in Knesset
  profession: string;   // תפקיד לפני הכנסת
  photoUrl?: string;
  listPosition: number;

  // ── Professional Identity ─────────────────────────────────────────
  training?: string;              // הכשרה
  educationField?: string;        // תחום השכלה
  educationInstitution?: string;  // מוסד אקדמי
  educationCategory?: string;     // קטגוריית השכלה
  preKnessetCategory?: string;    // קטגוריה (of role 1)
  role2?: string;                 // תפקיד 2
  role2Category?: string;         // קטגוריה 2

  // ── Political Record ──────────────────────────────────────────────
  firstElected?: number;          // year
  isNewcomer?: boolean;           // first elected >= 2023
  ministerialExperience?: boolean;

  // ── Personal / Demographics ───────────────────────────────────────
  birthYear?: number;
  city?: string;
  district?: string;
  subDistrict?: string;
  peripheryIndex?: number;
  sector?: string;
  subGroup?: string;
  languages?: string[];

  // ── Military ─────────────────────────────────────────────────────
  militaryType?: string;   // קבע / סדיר / לא שרתה
  militaryRank?: string;
  militaryUnit?: string;
  isCombat?: boolean;
  exemptionReason?: string;

  // ── Ideology & Stances ────────────────────────────────────────────
  orientation?: string;   // ימין / מרכז / שמאל
  ticket1?: string;
  ticket2?: string;
  stanceDraft?: string;   // עמדה גיוס חרדים

  // ── UX Metadata ──────────────────────────────────────────────────
  funFact?: string;
  wikipedia?: string;
  facebook?: string;
  knessetSite?: string;
  underTrial?: boolean;
}

export interface Party {
  id: string;
  name: string;
  color: string;
  seats: number;
  candidates: number;
  genderRatio: number;        // % women
  avgAge: number;
  educationBreakdown: {
    academic: number;
    professional: number;
    other: number;
  };
  avgSeniority: number;
}

export type CategoryKey = 'gender' | 'periphery' | 'professionalism' | 'education' | 'age' | 'seniority';

export interface CategoryInfo {
  key: CategoryKey;
  title: string;
  icon: string;
  color: string;
  description: string;
  insightFact: string;
}
