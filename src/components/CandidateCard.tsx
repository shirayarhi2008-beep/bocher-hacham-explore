import { Link } from 'react-router-dom';
import { User } from 'lucide-react';
import { Candidate } from '@/data/types';

interface Props {
  candidate: Candidate;
  accentColor?: string;
}

function Avatar({ candidate, accentColor }: { candidate: Candidate; accentColor: string }) {
  if (candidate.photoUrl) {
    return (
      <img
        src={candidate.photoUrl}
        alt={candidate.name}
        className="w-12 h-12 rounded-full object-cover border border-border shrink-0"
      />
    );
  }
  return (
    <div className="w-12 h-12 rounded-full bg-gray-100 flex flex-col items-center justify-end overflow-hidden shrink-0 border border-border">
      <User className="w-7 h-7 text-gray-400 mb-[-4px]" />
    </div>
  );
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
        {/* Avatar with position badge */}
        <div className="relative shrink-0">
          <Avatar candidate={candidate} accentColor={accentColor} />
          <span
            className="absolute -bottom-1 -left-1 text-[10px] font-bold text-white rounded-full w-5 h-5 flex items-center justify-center leading-none"
            style={{ backgroundColor: accentColor }}
          >
            {candidate.listPosition || '?'}
          </span>
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
