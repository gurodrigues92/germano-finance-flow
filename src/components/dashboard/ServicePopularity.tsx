import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/lib/formatUtils';
import { Star, Award } from 'lucide-react';

interface ServicePopularityProps {
  services: Array<{
    id: string;
    nome: string;
    count: number;
    faturamento: number;
  }>;
}

export const ServicePopularity = ({ services }: ServicePopularityProps) => {
  if (services.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5" />
            Serviços Mais Populares
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-4">
            Nenhum serviço registrado neste mês
          </p>
        </CardContent>
      </Card>
    );
  }

  const maxCount = Math.max(...services.map(s => s.count));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Star className="h-5 w-5" />
          Serviços Mais Populares
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {services.map((service, index) => (
            <div key={service.id} className="flex items-center gap-3">
              <div className="flex items-center gap-2 min-w-0 flex-1">
                {index === 0 && (
                  <Award className="h-4 w-4 text-yellow-500 flex-shrink-0" />
                )}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-medium truncate">{service.nome}</h4>
                    <span className="text-sm text-muted-foreground">
                      {service.count}x
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(service.count / maxCount) * 100}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatCurrency(service.faturamento)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};