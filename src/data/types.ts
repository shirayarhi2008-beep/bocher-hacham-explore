export interface Candidate {
  id: string;
  name: string;
  party: string;
  partyId: string;
  gender: 'male' | 'female';
  region: string;
  age: number;
  education: string;
  seniority: number; // years in politics
  profession: string;
  photoUrl?: string;
  listPosition: number; // position in party list
}

export interface Party {
  id: string;
  name: string;
  color: string;
  seats: number;
  candidates: number;
  genderRatio: number; // percentage of women
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
