import React from 'react';
import { Button } from '@/components/ui/button';
import { ResponsiveButton } from '@/components/ui/responsive-button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { ChevronLeft, ChevronRight, Calendar, Filter, Users } from 'lucide-react';
import { format, addDays, subDays, isToday } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Profissional } from '@/types/salon';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { translations } from '@/lib/translations';

interface ResponsiveHeaderProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  selectedProfissional: string;
  onProfissionalChange: (profissionalId: string) => void;
  profissionais: Profissional[];
}

export const ResponsiveHeader = ({
  selectedDate,
  onDateChange,
  selectedProfissional,
  onProfissionalChange,
  profissionais
}: ResponsiveHeaderProps) => {
  const isMobile = useIsMobile();

  const handlePreviousDay = () => {
    onDateChange(subDays(selectedDate, 1));
  };

  const handleNextDay = () => {
    onDateChange(addDays(selectedDate, 1));
  };

  const handleToday = () => {
    onDateChange(new Date());
  };

  const formatDisplayDate = (date: Date) => {
    return format(date, isMobile ? "EEE, dd/MM" : "EEEE, dd/MM/yyyy", { locale: ptBR });
  };

  const formatDisplayDateLong = (date: Date) => {
    return format(date, "EEEE, dd 'de' MMMM 'de' yyyy", { locale: ptBR });
  };

  const selectedProfissionalData = profissionais.find(p => p.id === selectedProfissional);

  if (isMobile) {
    return (
      <div className="px-4 py-3 space-y-3">
        {/* Date Navigation */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ResponsiveButton
              variant="outline"
              size="sm"
              onClick={handlePreviousDay}
              className="h-9 w-9 p-0"
            >
              <ChevronLeft className="w-4 h-4" />
            </ResponsiveButton>
            
            <ResponsiveButton
              variant="outline"
              size="sm"
              onClick={handleNextDay}
              className="h-9 w-9 p-0"
            >
              <ChevronRight className="w-4 h-4" />
            </ResponsiveButton>
          </div>

          <div className="flex-1 mx-3">
            <div className="text-center">
              <div className="text-sm font-medium text-muted-foreground">
                {formatDisplayDate(selectedDate)}
              </div>
              <div className="text-xs text-muted-foreground/80 capitalize">
                {format(selectedDate, "yyyy", { locale: ptBR })}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!isToday(selectedDate) && (
              <ResponsiveButton
                variant="outline"
                size="sm"
                onClick={handleToday}
                className="text-xs px-3"
              >
                {translations.navigation.today}
              </ResponsiveButton>
            )}

            <Sheet>
              <SheetTrigger asChild>
                <ResponsiveButton variant="outline" size="sm" className="h-9 w-9 p-0">
                  <Filter className="w-4 h-4" />
                </ResponsiveButton>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px]">
                <SheetHeader>
                  <SheetTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Filtrar Profissional
                  </SheetTitle>
                </SheetHeader>
                <div className="mt-6 space-y-4">
                  <Select value={selectedProfissional} onValueChange={onProfissionalChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecionar profissional" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos os profissionais</SelectItem>
                      {profissionais.map((prof) => (
                        <SelectItem key={prof.id} value={prof.id}>
                          <div className="flex items-center gap-3">
                            <div 
                              className="w-3 h-3 rounded-full border"
                              style={{ backgroundColor: prof.cor_agenda || '#8B5CF6' }}
                            />
                            <span>{prof.nome}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {selectedProfissionalData && (
                    <div className="p-3 bg-accent rounded-lg">
                      <div className="flex items-center gap-3 mb-2">
                        <div 
                          className="w-4 h-4 rounded-full border"
                          style={{ backgroundColor: selectedProfissionalData.cor_agenda || '#8B5CF6' }}
                        />
                        <span className="font-medium">{selectedProfissionalData.nome}</span>
                      </div>
                      {selectedProfissionalData.especialidades && (
                        <p className="text-sm text-muted-foreground">
                          {selectedProfissionalData.especialidades.join(', ')}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    );
  }

  // Desktop version
  return (
    <div className="bg-card rounded-lg border border-border p-4">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        {/* Date Navigation */}
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePreviousDay}
            className="h-9 w-9 p-0"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          
          <div className="flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-lg font-semibold min-w-[200px] justify-center">
            <Calendar className="w-4 h-4" />
            <span className="capitalize">
              {formatDisplayDate(selectedDate)}
            </span>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleNextDay}
            className="h-9 w-9 p-0"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleToday}
            className="ml-2"
          >
            {translations.navigation.today}
          </Button>
        </div>

        {/* Professional Filter */}
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">
            Profissional:
          </span>
          <Select value={selectedProfissional} onValueChange={onProfissionalChange}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Selecionar profissional" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos os profissionais</SelectItem>
              {profissionais.map((prof) => (
                <SelectItem key={prof.id} value={prof.id}>
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-3 h-3 rounded-full border"
                      style={{ backgroundColor: prof.cor_agenda || '#8B5CF6' }}
                    />
                    <span>{prof.nome}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};