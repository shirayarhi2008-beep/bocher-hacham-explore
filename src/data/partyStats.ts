import { getCandidatesByParty } from './candidates';
import cityClusterMap from './peripherality-map.json';

export interface PartyStats {
  partyId: string;
  total: number;
  avgAge: number;
  pctWomen: number;
  pctCombat: number;
  pctServed: number;       // served in any military capacity
  pctAcademic: number;
  avgSeniority: number;
  pctNewcomer: number;
  avgPeriphery: number | null;
  peripheryCoverage: number;
  militaryBreakdown: { name: string; value: number }[];
}

const clusterLookup = cityClusterMap as Record<string, number>;

export function computePartyStats(partyId: string): PartyStats {
  const cs = getCandidatesByParty(partyId);
  const total = cs.length;
  if (total === 0) {
    return {
      partyId, total: 0, avgAge: 0, pctWomen: 0, pctCombat: 0, pctServed: 0,
      pctAcademic: 0, avgSeniority: 0, pctNewcomer: 0, avgPeriphery: null,
      peripheryCoverage: 0, militaryBreakdown: [],
    };
  }

  const withAge = cs.filter(c => c.age > 0);
  const avgAge = withAge.length ? Math.round(withAge.reduce((s, c) => s + c.age, 0) / withAge.length * 10) / 10 : 0;

  const pctWomen = Math.round((cs.filter(c => c.gender === 'female').length / total) * 100);
  const pctCombat = Math.round((cs.filter(c => c.isCombat).length / total) * 100);

  const served = cs.filter(c => c.militaryType && !['פטור','לא שירת','לא שירתה','אזרחי'].includes(c.militaryType.trim()));
  const pctServed = Math.round((served.length / total) * 100);

  const academic = cs.filter(c => {
    const e = c.education?.trim().toLowerCase() ?? '';
    return e.includes('תואר') || e.includes('אקדמ') || e.includes('דוקטו') || e.includes('מוסמך');
  });
  const pctAcademic = Math.round((academic.length / total) * 100);

  const withSeniority = cs.filter(c => c.seniority > 0);
  const avgSeniority = withSeniority.length
    ? Math.round(withSeniority.reduce((s, c) => s + c.seniority, 0) / withSeniority.length * 10) / 10
    : 0;

  const pctNewcomer = Math.round((cs.filter(c => c.isNewcomer).length / total) * 100);

  let peripherySum = 0, peripheryCoverage = 0;
  cs.forEach(c => {
    const city = c.city?.trim();
    const cluster = city ? clusterLookup[city] : undefined;
    if (cluster) { peripherySum += cluster; peripheryCoverage++; }
  });
  const avgPeriphery = peripheryCoverage > 0
    ? Math.round((peripherySum / peripheryCoverage) * 10) / 10
    : null;

  // Military type breakdown
  const milMap: Record<string, number> = {};
  cs.forEach(c => {
    const key = c.militaryType?.trim() || (c.exemptionReason ? 'פטור' : 'לא ידוע');
    milMap[key] = (milMap[key] ?? 0) + 1;
  });
  const militaryBreakdown = Object.entries(milMap)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  return {
    partyId, total, avgAge, pctWomen, pctCombat, pctServed,
    pctAcademic, avgSeniority, pctNewcomer, avgPeriphery,
    peripheryCoverage, militaryBreakdown,
  };
}
