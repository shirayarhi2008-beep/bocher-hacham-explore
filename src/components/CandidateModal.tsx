import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Candidate } from '@/data/types';
import { getPartyColor } from '@/data/parties';
import { Badge } from '@/components/ui/badge';
import { User, MapPin, Briefcase, GraduationCap, Calendar, Clock } from 'lucide-react';

interface Props {
  candidate: Candidate | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CandidateModal({ candidate, open, onOpenChange }: Props) {
  if (!candidate) return null;
  const color = getPartyColor(candidate.partyId);

  const fields = [
    { icon: User, label: 'מגדר', value: candidate.gender === 'male' ? 'זכר' : 'נקבה' },
    { icon: Calendar, label: 'גיל', value: `${candidate.age}` },
    { icon: MapPin, label: 'אזור', value: candidate.region },
    { icon: Briefcase, label: 'מקצוע', value: candidate.profession },
    { icon: GraduationCap, label: 'השכלה', value: candidate.education },
    { icon: Clock, label: 'ותק פוליטי', value: `${candidate.seniority} שנים` },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm rounded-2xl p-0 overflow-hidden" dir="rtl">
        {/* Header with party color */}
        <div className="h-24 relative flex items-end justify-center" style={{ backgroundColor: color }}>
          <div className="absolute -bottom-10 w-20 h-20 rounded-2xl bg-card border-4 border-background flex items-center justify-center text-2xl font-bold shadow-lg" style={{ color }}>
            {candidate.name.split(' ').map(n => n[0]).join('')}
          </div>
        </div>

        <div className="pt-12 pb-6 px-5">
          <DialogHeader className="mb-4">
            <DialogTitle className="font-rubik text-xl text-center">{candidate.name}</DialogTitle>
            <div className="flex justify-center mt-1">
              <Badge variant="secondary" style={{ backgroundColor: `${color}20`, color }}>{candidate.party}</Badge>
            </div>
            <p className="text-xs text-muted-foreground text-center mt-1">מזהה: {candidate.id}</p>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-3">
            {fields.map(f => (
              <div key={f.label} className="bg-muted/50 rounded-xl p-3 flex items-start gap-2">
                <f.icon className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">{f.label}</p>
                  <p className="text-sm font-medium">{f.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
