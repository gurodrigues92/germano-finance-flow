import React from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface DatePickerProps {
  value: string; // Date string in YYYY-MM-DD format
  onChange: (date: string) => void;
  placeholder?: string;
  className?: string;
}

export const DatePicker = ({ value, onChange, placeholder = "Selecione uma data", className }: DatePickerProps) => {
  // Convert string date to Date object
  const dateValue = value ? new Date(value) : undefined;

  const handleSelect = (date: Date | undefined) => {
    if (date) {
      // Format date as YYYY-MM-DD for consistency with the form
      const formattedDate = format(date, 'yyyy-MM-dd');
      onChange(formattedDate);
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal text-base sm:text-lg p-2 sm:p-3 h-auto",
            !dateValue && "text-muted-foreground",
            className
          )}
          type="button"
        >
          <CalendarIcon className="mr-2 h-4 w-4 flex-shrink-0" />
          {dateValue ? (
            format(dateValue, "PPP", { locale: ptBR })
          ) : (
            <span>{placeholder}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={dateValue}
          onSelect={handleSelect}
          initialFocus
          className="pointer-events-auto"
          locale={ptBR}
        />
      </PopoverContent>
    </Popover>
  );
};