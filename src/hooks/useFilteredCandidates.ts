import { useMemo, useState } from 'react';
import { candidates as allCandidates } from '@/data/candidates';

export interface CandidateFilters {
  search: string;
  orientation: string;             // 'all' | 'ימין' | 'מרכז' | 'שמאל'
  parties: string[];               // partyIds (empty = all)
  listPositionRange: [number, number];
  newcomerOnly: boolean;
  gender: string;                  // 'all' | 'male' | 'female'
  topics: string[];                // ticket values (empty = all)
}

const MAX_POSITION = Math.max(...allCandidates.filter(c => c.listPosition > 0).map(c => c.listPosition), 40);

export const DEFAULT_FILTERS: CandidateFilters = {
  search: '',
  orientation: 'all',
  parties: [],
  listPositionRange: [1, MAX_POSITION],
  newcomerOnly: false,
  gender: 'all',
  topics: [],
};

// Unique topics extracted from ticket1 + ticket2 across all candidates
export const ALL_TOPICS: string[] = [
  ...new Set(
    allCandidates.flatMap(c => [c.ticket1, c.ticket2].filter((t): t is string => !!t))
  ),
].sort();

export const MAX_LIST_POSITION = MAX_POSITION;

export function countActiveFilters(f: CandidateFilters): number {
  let n = 0;
  if (f.search) n++;
  if (f.orientation !== 'all') n++;
  if (f.parties.length > 0) n++;
  if (f.listPositionRange[0] > 1 || f.listPositionRange[1] < MAX_POSITION) n++;
  if (f.newcomerOnly) n++;
  if (f.gender !== 'all') n++;
  if (f.topics.length > 0) n++;
  return n;
}

export function useFilteredCandidates() {
  const [filters, setFilters] = useState<CandidateFilters>(DEFAULT_FILTERS);

  const updateFilter = <K extends keyof CandidateFilters>(key: K, value: CandidateFilters[K]) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => setFilters(DEFAULT_FILTERS);

  const filtered = useMemo(() => {
    let result = allCandidates;

    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(c =>
        c.name.toLowerCase().includes(q) ||
        c.party.toLowerCase().includes(q) ||
        c.profession?.toLowerCase().includes(q) ||
        c.ticket1?.toLowerCase().includes(q) ||
        c.ticket2?.toLowerCase().includes(q)
      );
    }

    if (filters.orientation !== 'all') {
      result = result.filter(c => c.orientation === filters.orientation);
    }

    if (filters.parties.length > 0) {
      result = result.filter(c => filters.parties.includes(c.partyId));
    }

    const [minPos, maxPos] = filters.listPositionRange;
    if (minPos > 1 || maxPos < MAX_POSITION) {
      // listPosition === 0 means unknown — always include regardless of range filter
      result = result.filter(c => c.listPosition === 0 || (c.listPosition >= minPos && c.listPosition <= maxPos));
    }

    if (filters.newcomerOnly) {
      result = result.filter(c => c.isNewcomer);
    }

    if (filters.gender !== 'all') {
      result = result.filter(c => c.gender === filters.gender);
    }

    if (filters.topics.length > 0) {
      result = result.filter(c =>
        filters.topics.some(t => c.ticket1 === t || c.ticket2 === t)
      );
    }

    return result;
  }, [filters]);

  // Legacy compat
  const randomCandidate = () => allCandidates[Math.floor(Math.random() * allCandidates.length)];

  return {
    candidates: filtered,
    filters,
    updateFilter,
    resetFilters,
    activeFilterCount: countActiveFilters(filters),
    totalCount: allCandidates.length,
    randomCandidate,
    // Legacy aliases still used by PeoplePage
    search: filters.search,
    setSearch: (v: string) => updateFilter('search', v),
  };
}
