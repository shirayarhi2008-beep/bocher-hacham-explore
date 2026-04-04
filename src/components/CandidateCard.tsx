import { Link } from 'react-router-dom';
import { Candidate } from '@/data/types';

interface Props {
  candidate: Candidate;
  accentColor?: string;
}

export default function CandidateCard({ candidate, accentColor = '#5982fe' }: Props) {
  const tags = [candidate.ticket1, candidate.ticket2].filter(Boolean) as string[];
  if (tags.length === 0 && candidate.profession) tags.push(candidate.profession);

  return (
    <Link
      to={`/candidates/${candidate.id}`}
      className="block bg-white border border-border rounded-lg p-4 hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-normal group"
    >
      <div className="flex items-start gap-3">
        {/* Position circle */}
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg text-white shrink-0 transition-opacity duration-fast group-hover:opacity-90"
          style={{ backgroundColor: accentColor }}
        >
          {candidate.listPosition}
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm text-foreground leading-snug">{candidate.name}</h3>
          <p className="text-xs text-muted-foreground mt-0.5">{candidate.party}</p>

          {tags.length > 0 && (
            <div className="flex gap-1.5 mt-2 flex-wrap">
              {tags.map(tag => (
                <span key={tag} className="text-[11px] text-muted-foreground bg-secondary border border-border px-2 py-0.5 rounded">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
