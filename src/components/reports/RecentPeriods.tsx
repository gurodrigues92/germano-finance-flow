import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { History, X } from 'lucide-react';
import { ReportFilter } from '@/hooks/useAdvancedReports';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface RecentPeriod {
  id: string;
  startDate: string;
  endDate: string;
  label?: string;
  timestamp: number;
}

interface RecentPeriodsProps {
  filters: ReportFilter;
  onChange: (filters: ReportFilter) => void;
}

export const RecentPeriods = ({ filters, onChange }: RecentPeriodsProps) => {
  const [recentPeriods, setRecentPeriods] = useState<RecentPeriod[]>([]);

  // Load recent periods from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('recent-report-periods');
    if (saved) {
      try {
        const periods = JSON.parse(saved);
        setRecentPeriods(periods);
      } catch (error) {
        console.error('Error loading recent periods:', error);
      }
    }
  }, []);

  // Save a period when filters change
  useEffect(() => {
    if (filters.startDate && filters.endDate) {
      const newPeriod: RecentPeriod = {
        id: `${filters.startDate}-${filters.endDate}`,
        startDate: filters.startDate,
        endDate: filters.endDate,
        timestamp: Date.now()
      };

      setRecentPeriods(prev => {
        // Remove duplicate if it exists
        const filtered = prev.filter(p => p.id !== newPeriod.id);
        // Add new period at the beginning
        const updated = [newPeriod, ...filtered].slice(0, 5); // Keep only 5 most recent
        
        // Save to localStorage
        localStorage.setItem('recent-report-periods', JSON.stringify(updated));
        
        return updated;
      });
    }
  }, [filters.startDate, filters.endDate]);

  const formatPeriodLabel = (period: RecentPeriod) => {
    const start = new Date(period.startDate);
    const end = new Date(period.endDate);
    
    // If same day
    if (period.startDate === period.endDate) {
      return format(start, "dd/MM/yyyy", { locale: ptBR });
    }
    
    // If same month
    if (start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear()) {
      return `${format(start, "dd", { locale: ptBR })} a ${format(end, "dd/MM/yyyy", { locale: ptBR })}`;
    }
    
    // Different months/years
    return `${format(start, "dd/MM", { locale: ptBR })} a ${format(end, "dd/MM/yyyy", { locale: ptBR })}`;
  };

  const getDaysCount = (period: RecentPeriod) => {
    const start = new Date(period.startDate);
    const end = new Date(period.endDate);
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    return days;
  };

  const applyPeriod = (period: RecentPeriod) => {
    onChange({
      ...filters,
      startDate: period.startDate,
      endDate: period.endDate
    });
  };

  const removePeriod = (periodId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    setRecentPeriods(prev => {
      const updated = prev.filter(p => p.id !== periodId);
      localStorage.setItem('recent-report-periods', JSON.stringify(updated));
      return updated;
    });
  };

  const clearAllPeriods = () => {
    setRecentPeriods([]);
    localStorage.removeItem('recent-report-periods');
  };

  if (recentPeriods.length === 0) {
    return null;
  }

  return (
    <Card className="mb-4">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="h-4 w-4" />
            <CardTitle className="text-base">Períodos Recentes</CardTitle>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={clearAllPeriods}
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            Limpar
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {recentPeriods.map((period) => {
            const isActive = filters.startDate === period.startDate && filters.endDate === period.endDate;
            
            return (
              <div
                key={period.id}
                className={`flex items-center justify-between p-2 rounded-lg border cursor-pointer transition-colors ${
                  isActive 
                    ? 'bg-primary/10 border-primary/20' 
                    : 'hover:bg-muted border-border'
                }`}
                onClick={() => applyPeriod(period)}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">
                      {formatPeriodLabel(period)}
                    </span>
                    {isActive && (
                      <Badge variant="default" className="text-xs">
                        Ativo
                      </Badge>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {getDaysCount(period)} {getDaysCount(period) === 1 ? 'dia' : 'dias'}
                  </div>
                </div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => removePeriod(period.id, e)}
                  className="h-6 w-6 p-0 hover:bg-destructive/10 hover:text-destructive"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};