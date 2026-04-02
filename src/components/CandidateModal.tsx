import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Candidate } from '@/data/types';
import { getPartyColor } from '@/data/parties';
import { getCandidatesByParty } from '@/data/candidates';
import { Badge } from '@/components/ui/badge';
import { Briefcase, GraduationCap, Calendar, Clock, Landmark, MessageSquareQuote, Shield, Lightbulb, ExternalLink, MapPin } from 'lucide-react';

interface Props {
  candidate: Candidate | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function Row({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex justify-between items-center gap-2 text-sm">
      <span className="text-muted-foreground shrink-0">{label}</span>
      <span className={`font-medium text-left ${highlight ? 'text-emerald' : 'text-foreground'}`}>{value}</span>
    </div>
  );
}

function getListPosition(candidate: Candidate): number {
  const partyCandidates = getCandidatesByParty(candidate.partyId);
  return partyCandidates.findIndex(c => c.id === candidate.id) + 1;
}

export default function CandidateModal({ candidate, open, onOpenChange }: Props) {
  const listPosition = useMemo(
    () => (candidate ? getListPosition(candidate) : 0),
    [candidate]
  );

  if (!candidate) return null;
  const color = getPartyColor(candidate.partyId);

  const infoItems = [
    { icon: Calendar, value: `גיל ${candidate.age}` },
    { icon: MapPin, value: candidate.region },
    { icon: Briefcase, value: candidate.profession },
    { icon: GraduationCap, value: candidate.education },
    { icon: Clock, value: `${candidate.seniority} שנות ותק` },
  ].filter(item => item.value && item.value !== ' שנות ותק');

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg rounded-2xl p-0 overflow-hidden max-h-[90vh] overflow-y-auto" dir="rtl">
        {/* Header */}
        <div className="h-28 relative flex items-end justify-center" style={{ backgroundColor: color }}>
          <div className="absolute top-3 right-3 bg-background/90 backdrop-blur-sm rounded-lg px-2.5 py-1 shadow-sm">
            <span className="text-xs text-muted-foreground">מקום </span>
            <span className="font-rubik font-bold text-sm" style={{ color }}>#{listPosition || candidate.listPosition}</span>
          </div>
          <div className="absolute -bottom-12 w-24 h-24 rounded-2xl bg-card border-4 border-background flex items-center justify-center text-3xl font-bold shadow-lg overflow-hidden" style={{ color }}>
            {candidate.photoUrl ? (
              <img src={candidate.photoUrl} alt={candidate.name} className="w-full h-full object-cover" />
            ) : (
              candidate.name.split(' ').map(n => n[0]).join('')
            )}
          </div>
        </div>

        <div className="pt-14 pb-6 px-6">
          <DialogHeader className="mb-3">
            <DialogTitle className="font-rubik text-xl text-center">{candidate.name}</DialogTitle>
            <div className="flex justify-center mt-1">
              <Link to={`/lists/${candidate.partyId}`} onClick={() => onOpenChange(false)}>
                <Badge variant="secondary" className="cursor-pointer hover:opacity-80 transition-opacity" style={{ backgroundColor: `${color}20`, color }}>
                  {candidate.party}
                </Badge>
              </Link>
            </div>
          </DialogHeader>

          {/* Info pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-muted-foreground mb-4">
            {infoItems.map((item, i) => (
              <span key={i} className="flex items-center gap-1 bg-muted/50 rounded-full px-2.5 py-1">
                <item.icon className="w-3 h-3" />
                {item.value}
              </span>
            ))}
          </div>

          {/* Fun Fact */}
          {candidate.funFact && (
            <div className="flex items-start gap-2 rounded-xl bg-amber/10 border border-amber/20 px-3 py-2.5 mb-3">
              <Lightbulb className="w-4 h-4 text-amber shrink-0 mt-0.5" />
              <p className="text-xs text-foreground leading-relaxed">{candidate.funFact}</p>
            </div>
          )}

          {/* Accordion */}
          <Accordion type="multiple" className="w-full">

            <AccordionItem value="political-activity">
              <AccordionTrigger className="text-sm font-rubik font-semibold gap-2 hover:no-underline">
                <span className="flex items-center gap-2">
                  <Landmark className="w-4 h-4 text-muted-foreground" />
                  רקע פוליטי
                </span>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2 pt-1">
                  {candidate.firstElected && <Row label="נבחר לראשונה" value={String(candidate.firstElected)} />}
                  <Row label="ותק בכנסת" value={`${candidate.seniority} שנים`} />
                  {candidate.ministerialExperience && <Row label="ניסיון מיניסטריאלי" value="כן" highlight />}
                  {candidate.isNewcomer && <Row label="סטטוס" value="מועמד/ת חדש/ה" highlight />}
                  {candidate.stanceDraft && <Row label="עמדה — גיוס חרדים" value={candidate.stanceDraft} />}
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="professional">
              <AccordionTrigger className="text-sm font-rubik font-semibold gap-2 hover:no-underline">
                <span className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-muted-foreground" />
                  מסלול מקצועי
                </span>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2 pt-1">
                  {candidate.training && <Row label="הכשרה" value={candidate.training} />}
                  {candidate.education && <Row label="השכלה" value={candidate.education} />}
                  {candidate.educationField && <Row label="תחום" value={candidate.educationField} />}
                  {candidate.educationInstitution && <Row label="מוסד" value={candidate.educationInstitution} />}
                  {candidate.profession && <Row label="תפקיד לפני הכנסת" value={candidate.profession} />}
                  {candidate.role2 && <Row label="תפקיד נוסף" value={candidate.role2} />}
                </div>
              </AccordionContent>
            </AccordionItem>

            {(candidate.militaryType || candidate.militaryRank) && (
              <AccordionItem value="military">
                <AccordionTrigger className="text-sm font-rubik font-semibold gap-2 hover:no-underline">
                  <span className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-muted-foreground" />
                    שירות צבאי
                  </span>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2 pt-1">
                    {candidate.militaryType && <Row label="סוג שירות" value={candidate.militaryType} />}
                    {candidate.militaryRank && <Row label="דרגה" value={candidate.militaryRank} />}
                    {candidate.militaryUnit && <Row label="יחידה" value={candidate.militaryUnit} />}
                    {candidate.isCombat && <Row label="לוחם/ת" value="כן" highlight />}
                    {candidate.exemptionReason && <Row label="סיבת פטור" value={candidate.exemptionReason} />}
                  </div>
                </AccordionContent>
              </AccordionItem>
            )}

            <AccordionItem value="statements">
              <AccordionTrigger className="text-sm font-rubik font-semibold gap-2 hover:no-underline">
                <span className="flex items-center gap-2">
                  <MessageSquareQuote className="w-4 h-4 text-muted-foreground" />
                  שיוך ועמדות
                </span>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2 pt-1">
                  {candidate.orientation && <Row label="אוריינטציה" value={candidate.orientation} />}
                  {candidate.sector && <Row label="מגזר" value={candidate.sector} />}
                  {candidate.subGroup && <Row label="תת-קבוצה" value={candidate.subGroup} />}
                  {candidate.ticket1 && <Row label="טיקט 1" value={candidate.ticket1} />}
                  {candidate.ticket2 && <Row label="טיקט 2" value={candidate.ticket2} />}
                  {candidate.languages && candidate.languages.length > 0 && (
                    <Row label="שפות" value={candidate.languages.join(', ')} />
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          {/* External links */}
          {(candidate.wikipedia || candidate.facebook || candidate.knessetSite) && (
            <div className="flex gap-2 mt-4 justify-center flex-wrap">
              {candidate.knessetSite && (
                <a href={candidate.knessetSite} target="_blank" rel="noreferrer"
                  className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full bg-muted hover:bg-muted/80 transition-colors text-muted-foreground">
                  <ExternalLink className="w-3 h-3" />כנסת
                </a>
              )}
              {candidate.wikipedia && (
                <a href={candidate.wikipedia} target="_blank" rel="noreferrer"
                  className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full bg-muted hover:bg-muted/80 transition-colors text-muted-foreground">
                  <ExternalLink className="w-3 h-3" />ויקיפדיה
                </a>
              )}
              {candidate.facebook && (
                <a href={candidate.facebook} target="_blank" rel="noreferrer"
                  className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full bg-muted hover:bg-muted/80 transition-colors text-muted-foreground">
                  <ExternalLink className="w-3 h-3" />פייסבוק
                </a>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
