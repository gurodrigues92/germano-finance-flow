import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/lib/formatUtils';
import { TrendingUp, User } from 'lucide-react';

interface ProfessionalPerformanceProps {
  performance: Array<{
    id: string;
    nome: string;
    totalAtendimentos: number;
    totalFaturamento: number;
    comissaoTotal: number;
    cor: string;
  }>;
}

export const ProfessionalPerformance = ({ performance }: ProfessionalPerformanceProps) => {
  if (performance.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Performance dos Profissionais
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-4">
            Nenhum atendimento registrado neste mês
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Performance dos Profissionais
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {performance.map((prof) => (
            <div
              key={prof.id}
              className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border"
            >
              <div className="flex items-center gap-3">
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold"
                  style={{ backgroundColor: prof.cor }}
                >
                  <User className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-medium">{prof.nome}</h4>
                  <p className="text-sm text-muted-foreground">
                    {prof.totalAtendimentos} atendimento{prof.totalAtendimentos !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold">{formatCurrency(prof.totalFaturamento)}</p>
                <p className="text-sm text-muted-foreground">
                  Comissão: {formatCurrency(prof.comissaoTotal)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};