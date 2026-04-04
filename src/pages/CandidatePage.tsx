import { useParams, Link, useNavigate } from 'react-router-dom';
import { ChevronRight, ExternalLink } from 'lucide-react';
import { candidates } from '@/data/candidates';
import { getPartyById } from '@/data/parties';

function Fact({ label, value }: { label: string; value: string | number }) {
  return (
    <div>
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="text-sm font-medium text-foreground mt-0.5">{value}</dd>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border-t border-border pt-6">
      <h2 className="font-semibold text-base text-foreground mb-4">{title}</h2>
      <dl className="grid grid-cols-2 md:grid-cols-3 gap-4">{children}</dl>
    </div>
  );
}

export default function CandidatePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const candidate = candidates.find(c => c.id === id);
  const party = candidate ? getPartyById(candidate.partyId) : null;

  if (!candidate) {
    return (
      <div className="text-center py-20">
        <p className="text-muted-foreground">מועמד לא נמצא</p>
        <button onClick={() => navigate(-1)} className="mt-3 text-sm text-primary hover:underline">
          חזרה
        </button>
      </div>
    );
  }

  const location = [candidate.city, candidate.district].filter(Boolean).join(', ');
  const hasMilitary = candidate.militaryType || candidate.militaryRank;
  const hasLinks = candidate.knessetSite || candidate.wikipedia || candidate.facebook;

  return (
    <div className="max-w-2xl mx-auto pb-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm text-muted-foreground mb-8">
        <Link to="/lists" className="hover:text-foreground transition-colors">מפלגות</Link>
        <ChevronRight className="w-3.5 h-3.5 rotate-180" />
        {party && (
          <>
            <Link to={`/lists/${party.id}`} className="hover:text-foreground transition-colors">
              {party.name}
            </Link>
            <ChevronRight className="w-3.5 h-3.5 rotate-180" />
          </>
        )}
        <span className="text-foreground">{candidate.name}</span>
      </nav>

      {/* ── Profile hero ────────────────────────────────────── */}
      <div className="flex items-start gap-5 mb-8">
        {/* Avatar / Photo */}
        <div className="shrink-0">
          {candidate.photoUrl ? (
            <img
              src={candidate.photoUrl}
              alt={candidate.name}
              className="w-24 h-24 rounded-xl object-cover border border-border"
            />
          ) : (
            <div className="w-24 h-24 rounded-xl bg-primary/10 flex items-center justify-center">
              <span className="text-primary text-2xl font-bold">
                {candidate.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </span>
            </div>
          )}
        </div>

        <div>
          <h1 className="font-bold text-2xl md:text-3xl text-foreground leading-tight">
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
              <span className="text-xs text-muted-foreground bg-secondary border border-border rounded px-2 py-0.5">
                ניסיון מיניסטריאלי
              </span>
            )}
          </div>

          {/* Quick facts inline */}
          <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
            {[
              candidate.age && `${candidate.age}`,
              location,
              candidate.profession,
              candidate.seniority && `${candidate.seniority} שנות ותק`,
            ].filter(Boolean).join(' · ')}
          </p>
        </div>
      </div>

      {/* ── Bio / Fun fact ──────────────────────────────────── */}
      {candidate.funFact && (
        <div className="mb-8 p-4 bg-secondary rounded-lg border border-border">
          <p className="text-sm text-foreground leading-relaxed">{candidate.funFact}</p>
        </div>
      )}

      {/* ── Tickets / Topics ────────────────────────────────── */}
      {(candidate.ticket1 || candidate.ticket2) && (
        <div className="mb-8 flex flex-wrap gap-2">
          {candidate.ticket1 && (
            <span className="text-xs font-semibold bg-primary-light/10 text-primary-light border border-primary-light/25 rounded-pill px-3 py-1">
              {candidate.ticket1}
            </span>
          )}
          {candidate.ticket2 && (
            <span className="text-xs font-semibold bg-primary-light/10 text-primary-light border border-primary-light/25 rounded-pill px-3 py-1">
              {candidate.ticket2}
            </span>
          )}
        </div>
      )}

      {/* ── Sections ────────────────────────────────────────── */}

      {/* Political */}
      <Section title="רקע פוליטי">
        {candidate.orientation && <Fact label="אוריינטציה" value={candidate.orientation} />}
        {candidate.seniority !== undefined && <Fact label="ותק בכנסת" value={`${candidate.seniority} שנים`} />}
        {candidate.firstElected && <Fact label="נבחר לראשונה" value={String(candidate.firstElected)} />}
        {candidate.sector && <Fact label="מגזר" value={candidate.sector} />}
        {candidate.subGroup && <Fact label="תת-קבוצה" value={candidate.subGroup} />}
        {candidate.stanceDraft && <Fact label="עמדה — גיוס חרדים" value={candidate.stanceDraft} />}
      </Section>

      {/* Professional */}
      <Section title="מסלול מקצועי">
        {candidate.profession && <Fact label="תפקיד לפני הכנסת" value={candidate.profession} />}
        {candidate.role2 && <Fact label="תפקיד נוסף" value={candidate.role2} />}
        {candidate.training && <Fact label="הכשרה" value={candidate.training} />}
        {candidate.education && <Fact label="השכלה" value={candidate.education} />}
        {candidate.educationField && <Fact label="תחום לימוד" value={candidate.educationField} />}
        {candidate.educationInstitution && <Fact label="מוסד" value={candidate.educationInstitution} />}
        {candidate.languages && candidate.languages.length > 0 && (
          <Fact label="שפות" value={candidate.languages.join(', ')} />
        )}
      </Section>

      {/* Military — conditional */}
      {hasMilitary && (
        <Section title="שירות צבאי">
          {candidate.militaryType && <Fact label="סוג שירות" value={candidate.militaryType} />}
          {candidate.militaryRank && <Fact label="דרגה" value={candidate.militaryRank} />}
          {candidate.militaryUnit && <Fact label="יחידה" value={candidate.militaryUnit} />}
          {candidate.isCombat && <Fact label="לוחם" value="כן" />}
          {candidate.exemptionReason && <Fact label="סיבת פטור" value={candidate.exemptionReason} />}
        </Section>
      )}

      {/* Personal */}
      <Section title="פרטים אישיים">
        {candidate.age && <Fact label="גיל" value={candidate.age} />}
        {candidate.birthYear && <Fact label="שנת לידה" value={candidate.birthYear} />}
        {candidate.city && <Fact label="עיר" value={candidate.city} />}
        {candidate.district && <Fact label="מחוז" value={candidate.district} />}
      </Section>

      {/* ── External links ──────────────────────────────────── */}
      {hasLinks && (
        <div className="border-t border-border pt-6 flex flex-wrap gap-2">
          {candidate.knessetSite && (
            <a
              href={candidate.knessetSite}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-muted-foreground border border-border rounded px-3 py-2 hover:text-foreground hover:border-foreground/30 transition-colors"
            >
              <ExternalLink className="w-3 h-3" />
              אתר הכנסת
            </a>
          )}
          {candidate.wikipedia && (
            <a
              href={candidate.wikipedia}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-muted-foreground border border-border rounded px-3 py-2 hover:text-foreground hover:border-foreground/30 transition-colors"
            >
              <ExternalLink className="w-3 h-3" />
              ויקיפדיה
            </a>
          )}
          {candidate.facebook && (
            <a
              href={candidate.facebook}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-muted-foreground border border-border rounded px-3 py-2 hover:text-foreground hover:border-foreground/30 transition-colors"
            >
              <ExternalLink className="w-3 h-3" />
              פייסבוק
            </a>
          )}
        </div>
      )}
    </div>
  );
}
