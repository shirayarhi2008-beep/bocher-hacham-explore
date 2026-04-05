import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ChevronRight, ExternalLink,
  Library, Briefcase, ShieldCheck, Info, Globe, MapPin, Calendar, User,
  Facebook,
} from 'lucide-react';
import { candidates } from '@/data/candidates';
import { getPartyById } from '@/data/parties';

// ── Helpers ────────────────────────────────────────────────────────────────

function StatBox({ value, label }: { value: string | number; label: string }) {
  return (
    <div className="flex-1 text-center bg-gray-50 rounded-xl py-4 px-3">
      <p className="text-2xl font-extrabold text-primary leading-none">{value}</p>
      <p className="text-xs text-muted-foreground mt-1.5 leading-snug">{label}</p>
    </div>
  );
}

function TimelineItem({ title, subtitle, isLast }: { title: string; subtitle?: string; isLast?: boolean }) {
  return (
    <div className="flex gap-3">
      <div className="flex flex-col items-center">
        <div className="w-2 h-2 rounded-full bg-primary mt-1.5 shrink-0" />
        {!isLast && <div className="w-px flex-1 bg-border mt-1" />}
      </div>
      <div className="pb-5">
        <p className="text-sm font-medium text-foreground leading-snug">{title}</p>
        {subtitle && <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>}
      </div>
    </div>
  );
}

function FactRow({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="flex items-start gap-2.5">
      <Icon className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
      <div>
        <p className="text-[11px] text-muted-foreground uppercase tracking-wide">{label}</p>
        <p className="text-sm font-medium text-foreground mt-0.5">{value}</p>
      </div>
    </div>
  );
}

function SectionHeader({ icon: Icon, title }: { icon: React.ElementType; title: string }) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <Icon className="w-4 h-4 text-primary shrink-0" />
      <h2 className="font-bold text-base text-foreground">{title}</h2>
    </div>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────

export default function CandidatePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const candidate = candidates.find(c => c.id === id);
  const party = candidate ? getPartyById(candidate.partyId) : null;

  if (!candidate) {
    return (
      <div className="text-center py-20">
        <p className="text-muted-foreground">מועמד לא נמצא</p>
        <button onClick={() => navigate(-1)} className="mt-3 text-sm text-primary hover:underline">חזרה</button>
      </div>
    );
  }

  const location = [candidate.city, candidate.district].filter(Boolean).join(', ');
  const hasMilitary = candidate.militaryType || candidate.militaryRank;
  const hasLinks = candidate.knessetSite || candidate.wikipedia || candidate.facebook;
  const focusTag = candidate.ticket1 || candidate.ticket2;

  // Professional timeline items
  const timelineItems = [
    candidate.profession && { title: candidate.profession, subtitle: candidate.preKnessetCategory },
    candidate.role2 && { title: candidate.role2, subtitle: candidate.role2Category },
    candidate.training && { title: candidate.training, subtitle: 'הכשרה' },
    candidate.education && {
      title: candidate.education,
      subtitle: [candidate.educationField, candidate.educationInstitution].filter(Boolean).join(' · '),
    },
  ].filter(Boolean) as { title: string; subtitle?: string }[];

  return (
    <div className="max-w-2xl mx-auto pb-16">

      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm text-muted-foreground mb-8">
        <Link to="/lists" className="hover:text-foreground transition-colors">מפלגות</Link>
        <ChevronRight className="w-3.5 h-3.5 rotate-180" />
        {party && (
          <>
            <Link to={`/lists/${party.id}`} className="hover:text-foreground transition-colors">{party.name}</Link>
            <ChevronRight className="w-3.5 h-3.5 rotate-180" />
          </>
        )}
        <span className="text-foreground">{candidate.name}</span>
      </nav>

      {/* ── Identity Header ──────────────────────────────────── */}
      <div className="flex items-start gap-5 mb-8">
        {/* Photo */}
        <div className="shrink-0">
          {candidate.photoUrl ? (
            <img
              src={candidate.photoUrl}
              alt={candidate.name}
              className="w-24 h-24 rounded-full object-cover border-2 border-border shadow-sm"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-gray-100 border-2 border-border flex flex-col items-center justify-end overflow-hidden shadow-sm">
              <User className="w-16 h-16 text-gray-300 mb-[-6px]" />
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <h1 className="font-extrabold text-2xl md:text-3xl text-foreground leading-tight">
            {candidate.name}
          </h1>

          <div className="flex flex-wrap items-center gap-2 mt-2">
            {party && (
              <Link
                to={`/lists/${party.id}`}
                className="text-xs font-semibold text-primary bg-primary/8 border border-primary/20 rounded-pill px-3 py-0.5 hover:bg-primary/15 transition-colors"
              >
                {candidate.party}
              </Link>
            )}
            <span className="text-xs font-semibold text-primary-light bg-primary-light/10 border border-primary-light/25 rounded-pill px-3 py-0.5">
              מקום {candidate.listPosition}
            </span>
            {candidate.ministerialExperience && (
              <span className="text-xs text-muted-foreground bg-gray-50 border border-border rounded-pill px-3 py-0.5">
                ניסיון מיניסטריאלי
              </span>
            )}
          </div>

          {/* Value tag */}
          {focusTag && (
            <p className="mt-2.5 text-sm text-muted-foreground">
              <span className="font-medium text-foreground">מיקוד: </span>{focusTag}
            </p>
          )}
        </div>
      </div>

      {/* ── Impact Metrics ───────────────────────────────────── */}
      <div className="flex gap-3 mb-8">
        <StatBox value={`${candidate.seniority} שנ׳`} label="ותק בכנסת" />
        <StatBox value={candidate.age} label="גיל" />
        <StatBox
          value={candidate.orientation ?? '—'}
          label="אוריינטציה"
        />
      </div>

      {/* ── Tickets ──────────────────────────────────────────── */}
      {(candidate.ticket1 || candidate.ticket2) && (
        <div className="flex flex-wrap gap-2 mb-8">
          {[candidate.ticket1, candidate.ticket2].filter(Boolean).map(t => (
            <span key={t} className="text-xs font-semibold bg-primary/8 text-primary border border-primary/20 rounded-pill px-3 py-1">
              {t}
            </span>
          ))}
        </div>
      )}

      {/* ── Political Background ─────────────────────────────── */}
      {(candidate.orientation || candidate.sector || candidate.stanceDraft || candidate.firstElected) && (
        <div className="bg-gray-50 rounded-xl p-5 mb-6">
          <SectionHeader icon={Library} title="רקע פוליטי" />
          <div className="grid grid-cols-2 gap-4">
            {candidate.orientation && <FactRow icon={Info} label="אוריינטציה" value={candidate.orientation} />}
            {candidate.firstElected && <FactRow icon={Calendar} label="נבחר לראשונה" value={String(candidate.firstElected)} />}
            {candidate.sector && <FactRow icon={User} label="מגזר" value={candidate.sector} />}
            {candidate.subGroup && <FactRow icon={User} label="תת-קבוצה" value={candidate.subGroup} />}
            {candidate.stanceDraft && (
              <div className="col-span-2">
                <FactRow icon={Info} label="עמדה — גיוס חרדים" value={candidate.stanceDraft} />
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Professional Timeline ────────────────────────────── */}
      {timelineItems.length > 0 && (
        <div className="mb-6">
          <SectionHeader icon={Briefcase} title="מסלול מקצועי" />
          <div className="pr-1">
            {timelineItems.map((item, i) => (
              <TimelineItem
                key={i}
                title={item.title}
                subtitle={item.subtitle}
                isLast={i === timelineItems.length - 1}
              />
            ))}
          </div>
        </div>
      )}

      {/* ── Quick Facts Grid ─────────────────────────────────── */}
      <div className="bg-gray-50 rounded-xl p-5 mb-6">
        <SectionHeader icon={Info} title="פרטים אישיים" />
        <div className="grid grid-cols-2 gap-4">
          {candidate.age > 0 && <FactRow icon={Calendar} label="גיל" value={String(candidate.age)} />}
          {location && <FactRow icon={MapPin} label="מגורים" value={location} />}
          {candidate.languages && candidate.languages.length > 0 && (
            <FactRow icon={Globe} label="שפות" value={candidate.languages.join(', ')} />
          )}
          {candidate.gender && (
            <FactRow icon={User} label="מגדר" value={candidate.gender === 'female' ? 'אישה' : 'גבר'} />
          )}
        </div>
      </div>

      {/* ── Military ─────────────────────────────────────────── */}
      {hasMilitary && (
        <div className="bg-gray-50 rounded-xl p-5 mb-6">
          <SectionHeader icon={ShieldCheck} title="שירות צבאי" />
          <div className="grid grid-cols-2 gap-4">
            {candidate.militaryType && <FactRow icon={ShieldCheck} label="סוג שירות" value={candidate.militaryType} />}
            {candidate.militaryRank && <FactRow icon={ShieldCheck} label="דרגה" value={candidate.militaryRank} />}
            {candidate.militaryUnit && <FactRow icon={ShieldCheck} label="יחידה" value={candidate.militaryUnit} />}
            {candidate.exemptionReason && <FactRow icon={Info} label="סיבת פטור" value={candidate.exemptionReason} />}
          </div>
        </div>
      )}

      {/* ── Personal Insight ─────────────────────────────────── */}
      {candidate.funFact && (
        <div className="mb-6 p-5 rounded-xl border border-primary/15 bg-primary/4">
          <p className="text-sm text-foreground leading-relaxed">{candidate.funFact}</p>
        </div>
      )}

      {/* ── External Links ───────────────────────────────────── */}
      {hasLinks && (
        <div className="flex flex-wrap gap-2 pt-5 border-t border-border">
          {candidate.knessetSite && (
            <a href={candidate.knessetSite} target="_blank" rel="noreferrer"
              className="inline-flex items-center gap-2 text-sm font-medium text-primary bg-primary/8 border border-primary/20 rounded-lg px-4 py-2 hover:bg-primary/15 transition-colors">
              <ExternalLink className="w-3.5 h-3.5" />
              אתר הכנסת
            </a>
          )}
          {candidate.wikipedia && (
            <a href={candidate.wikipedia} target="_blank" rel="noreferrer"
              className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground bg-white border border-border rounded-lg px-4 py-2 hover:text-foreground hover:border-foreground/30 transition-colors">
              <ExternalLink className="w-3.5 h-3.5" />
              ויקיפדיה
            </a>
          )}
          {candidate.facebook && (
            <a href={candidate.facebook} target="_blank" rel="noreferrer"
              className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground bg-white border border-border rounded-lg px-4 py-2 hover:text-foreground hover:border-foreground/30 transition-colors">
              <Facebook className="w-3.5 h-3.5" />
              פייסבוק
            </a>
          )}
        </div>
      )}
    </div>
  );
}
