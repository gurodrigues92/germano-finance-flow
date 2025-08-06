import React from 'react';
import { ResponsiveHeader } from './ResponsiveHeader';
import { Profissional } from '@/types/salon';

interface MobileAgendaHeaderProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  selectedProfissional: string;
  onProfissionalChange: (profissionalId: string) => void;
  profissionais: Profissional[];
}

export const MobileAgendaHeader = (props: MobileAgendaHeaderProps) => {
  return <ResponsiveHeader {...props} />;
};