import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { format, addDays, subDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Profissional } from '@/types/salon';

interface SalonAgendaHeaderProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  selectedProfissional: string;
  onProfissionalChange: (profissionalId: string) => void;
  profissionais: Profissional[];
}

export const SalonAgendaHeader = ({
  selectedDate,
  onDateChange,
  selectedProfissional,
  onProfissionalChange,
  profissionais
}: SalonAgendaHeaderProps) => {
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
    return format(date, "EEEE, dd/MM/yyyy", { locale: ptBR });
  };

  return (
    <Card>
      <CardContent className="p-4">
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
            
            <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-lg font-semibold min-w-[200px] justify-center">
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
              Hoje
            </Button>
          </div>

          {/* Professional Filter */}
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-gray-700 whitespace-nowrap">
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
                    {prof.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};