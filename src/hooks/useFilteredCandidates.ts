import { useMemo, useState } from 'react';
import { Candidate } from '@/data/types';
import { candidates as allCandidates } from '@/data/candidates';

export function useFilteredCandidates() {
  const [search, setSearch] = useState('');
  const [genderFilter, setGenderFilter] = useState<string>('all');
  const [regionFilter, setRegionFilter] = useState<string>('all');
  const [partyFilter, setPartyFilter] = useState<string>('all');

  const filtered = useMemo(() => {
    let result = allCandidates;
    if (search) {
      result = result.filter(c =>
        c.name.includes(search) || c.party.includes(search) || c.profession.includes(search)
      );
    }
    if (genderFilter !== 'all') {
      result = result.filter(c => c.gender === genderFilter);
    }
    if (regionFilter !== 'all') {
      result = result.filter(c => c.region === regionFilter);
    }
    if (partyFilter !== 'all') {
      result = result.filter(c => c.partyId === partyFilter);
    }
    return result;
  }, [search, genderFilter, regionFilter, partyFilter]);

  const randomCandidate = () => {
    const idx = Math.floor(Math.random() * allCandidates.length);
    return allCandidates[idx];
  };

  const regions = [...new Set(allCandidates.map(c => c.region))];

  return {
    candidates: filtered,
    search, setSearch,
    genderFilter, setGenderFilter,
    regionFilter, setRegionFilter,
    partyFilter, setPartyFilter,
    randomCandidate,
    regions,
    totalCount: allCandidates.length,
  };
}
