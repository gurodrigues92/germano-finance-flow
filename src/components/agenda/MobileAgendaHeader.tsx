import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ResponsiveButton } from '@/components/ui/responsive-button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Calendar, ChevronLeft, ChevronRight, Filter, User, Home } from 'lucide-react';
import { format, addDays, subDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useIsMobile } from '@/hooks/use-mobile';
import { Profissional } from '@/types/salon';
import { useTranslations } from '@/lib/translations';

interface MobileAgendaHeaderProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  selectedProfissional: string;
  onProfissionalChange: (profissionalId: string) => void;
  profissionais: Profissional[];
}

export const MobileAgendaHeader = ({
  selectedDate,
  onDateChange,
  selectedProfissional,
  onProfissionalChange,
  profissionais
}: MobileAgendaHeaderProps) => {
  const isMobile = useIsMobile();
  const t = useTranslations();
  const [filterOpen, setFilterOpen] = useState(false);

  const isToday = format(selectedDate, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');
  const selectedProf = profissionais.find(p => p.id === selectedProfissional);

  const goToToday = () => {
    onDateChange(new Date());
  };

  if (!isMobile) {
    return (
      <div className="flex items-center justify-between p-4 bg-background border-b">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDateChange(subDays(selectedDate, 1))}
            className="hover:bg-primary/10"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          
          <div className="text-center min-w-[200px]">
            <div className="text-lg font-semibold">
              {format(selectedDate, "dd/MM", { locale: ptBR })}
            </div>
            <div className="text-sm text-muted-foreground">
              {format(selectedDate, "EEEE", { locale: ptBR })}
            </div>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDateChange(addDays(selectedDate, 1))}
            className="hover:bg-primary/10"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex items-center gap-2">
          {!isToday && (
            <Button variant="outline" size="sm" onClick={goToToday}>
              <Home className="w-4 h-4 mr-1" />
              {t.navigation.today}
            </Button>
          )}
          
          <Sheet open={filterOpen} onOpenChange={setFilterOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-1" />
                {selectedProfissional === 'todos' ? 'Todos' : selectedProf?.nome}
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <SheetHeader>
                <SheetTitle>{t.labels.filters}</SheetTitle>
              </SheetHeader>
              <div className="mt-6">
                <Select value={selectedProfissional} onValueChange={onProfissionalChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos profissionais</SelectItem>
                    {profissionais.map(prof => (
                      <SelectItem key={prof.id} value={prof.id}>
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: prof.cor_agenda }}
                          />
                          {prof.nome}
                          {prof.tipo === 'assistente' && (
                            <Badge variant="secondary" className="text-xs">Assist.</Badge>
                          )}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    );
  }

  return (
    <div className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      <div className="flex items-center justify-between p-3">
        {/* Navigation Controls */}
        <div className="flex items-center gap-2">
          <ResponsiveButton
            variant="ghost"
            size="sm"
            onClick={() => onDateChange(subDays(selectedDate, 1))}
            className="h-10 w-10 p-0"
          >
            <ChevronLeft className="w-5 h-5" />
          </ResponsiveButton>
          
          <div className="text-center min-w-[120px]">
            <div className="text-base font-semibold leading-tight">
              {format(selectedDate, "dd/MM", { locale: ptBR })}
            </div>
            <div className="text-xs text-muted-foreground">
              {format(selectedDate, "EEEE", { locale: ptBR })}
            </div>
          </div>
          
          <ResponsiveButton
            variant="ghost"
            size="sm"
            onClick={() => onDateChange(addDays(selectedDate, 1))}
            className="h-10 w-10 p-0"
          >
            <ChevronRight className="w-5 h-5" />
          </ResponsiveButton>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {!isToday && (
            <ResponsiveButton 
              variant="outline" 
              size="sm"
              onClick={goToToday}
              className="h-9 px-3"
            >
              <Home className="w-4 h-4" />
            </ResponsiveButton>
          )}
          
          <Sheet open={filterOpen} onOpenChange={setFilterOpen}>
            <SheetTrigger asChild>
              <ResponsiveButton 
                variant="outline" 
                size="sm"
                className="h-9 px-3"
              >
                <Filter className="w-4 h-4" />
                {selectedProfissional !== 'todos' && (
                  <div 
                    className="w-2 h-2 rounded-full ml-1"
                    style={{ backgroundColor: selectedProf?.cor_agenda }}
                  />
                )}
              </ResponsiveButton>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  {t.labels.professional}
                </SheetTitle>
              </SheetHeader>
              <div className="mt-6 space-y-4">
                <Select value={selectedProfissional} onValueChange={onProfissionalChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-muted-foreground" />
                        Todos profissionais
                      </div>
                    </SelectItem>
                    {profissionais.map(prof => (
                      <SelectItem key={prof.id} value={prof.id}>
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: prof.cor_agenda }}
                          />
                          <span>{prof.nome}</span>
                          {prof.tipo === 'assistente' && (
                            <Badge variant="secondary" className="text-xs ml-auto">
                              Assist.
                            </Badge>
                          )}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                {selectedProfissional !== 'todos' && selectedProf && (
                  <div className="p-3 rounded-lg bg-muted/50 border">
                    <div className="flex items-center gap-2 mb-2">
                      <div 
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: selectedProf.cor_agenda }}
                      />
                      <span className="font-medium">{selectedProf.nome}</span>
                    </div>
                    {selectedProf.especialidades && selectedProf.especialidades.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {selectedProf.especialidades.map((esp, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {esp}
                          </Badge>
                        ))}
                      </div>
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
};