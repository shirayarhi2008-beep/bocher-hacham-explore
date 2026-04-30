import { createContext, useContext, useState, ReactNode } from 'react';

type Step = 'select' | 'compare';

interface CompareContextType {
  compareIds: string[];
  lockedId: string | null;   // party that can't be removed (entered from its page)
  step: Step;
  addParty: (id: string) => void;
  removeParty: (id: string) => void;
  clearCompare: () => void;
  isSelected: (id: string) => boolean;
  modalOpen: boolean;
  openModal: (lockedId?: string) => void;
  closeModal: () => void;
  goToCompare: () => void;
  goToSelect: () => void;
}

const CompareContext = createContext<CompareContextType | null>(null);

export function CompareProvider({ children }: { children: ReactNode }) {
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [lockedId, setLockedId] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [step, setStep] = useState<Step>('select');

  const addParty = (id: string) => {
    setCompareIds(prev => prev.includes(id) || prev.length >= 2 ? prev : [...prev, id]);
  };

  const removeParty = (id: string) => {
    if (id === lockedId) return; // can't remove locked
    setCompareIds(prev => prev.filter(p => p !== id));
  };

  const clearCompare = () => {
    setCompareIds([]);
    setLockedId(null);
  };

  const isSelected = (id: string) => compareIds.includes(id);

  const openModal = (locked?: string) => {
    const ids = locked ? [locked] : [];
    setCompareIds(ids);
    setLockedId(locked ?? null);
    setStep('select');
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setCompareIds([]);
    setLockedId(null);
    setStep('select');
  };

  const goToCompare = () => setStep('compare');
  const goToSelect = () => setStep('select');

  return (
    <CompareContext.Provider value={{
      compareIds, lockedId, step,
      addParty, removeParty, clearCompare, isSelected,
      modalOpen, openModal, closeModal,
      goToCompare, goToSelect,
    }}>
      {children}
    </CompareContext.Provider>
  );
}

export function useCompare() {
  const ctx = useContext(CompareContext);
  if (!ctx) throw new Error('useCompare must be used within CompareProvider');
  return ctx;
}
