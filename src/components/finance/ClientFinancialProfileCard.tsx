import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  User, 
  DollarSign, 
  Calendar, 
  TrendingUp, 
  CreditCard,
  Star,
  Eye
} from 'lucide-react';
import { ClientFinancialProfile } from '@/hooks/useClientFinancialAnalytics';
import { formatCurrency } from '@/lib/formatUtils';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ClientFinancialProfileCardProps {
  client: ClientFinancialProfile;
  onViewHistory: (clientId: string) => void;
}

export const ClientFinancialProfileCard = ({ 
  client, 
  onViewHistory 
}: ClientFinancialProfileCardProps) => {
  const getPreferredPaymentMethod = () => {
    const methods = client.metodos_pagamento_preferidos;
    const total = methods.dinheiro + methods.pix + methods.debito + methods.credito;
    
    if (total === 0) return { method: 'Nenhum', percentage: 0 };

    const percentages = [
      { method: 'Dinheiro', value: methods.dinheiro, percentage: (methods.dinheiro / total) * 100 },
      { method: 'PIX', value: methods.pix, percentage: (methods.pix / total) * 100 },
      { method: 'Débito', value: methods.debito, percentage: (methods.debito / total) * 100 },
      { method: 'Crédito', value: methods.credito, percentage: (methods.credito / total) * 100 }
    ];

    const preferred = percentages.reduce((prev, current) => 
      prev.percentage > current.percentage ? prev : current
    );

    return preferred;
  };

  const getCategoryColor = (categoria: string) => {
    switch (categoria) {
      case 'VIP':
        return 'bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--primary-glow))] text-white';
      case 'Regular':
        return 'bg-[hsl(var(--secondary))] text-[hsl(var(--secondary-foreground))]';
      default:
        return 'bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))]';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-[hsl(var(--success))]';
    if (score >= 60) return 'text-[hsl(var(--warning))]';
    return 'text-[hsl(var(--destructive))]';
  };

  const preferredPayment = getPreferredPaymentMethod();

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-[hsl(var(--primary))]/10 flex items-center justify-center">
              <User className="w-6 h-6 text-[hsl(var(--primary))]" />
            </div>
            <div>
              <CardTitle className="text-lg">{client.cliente_nome}</CardTitle>
              <CardDescription>
                Cliente desde {format(new Date(client.primeira_transacao), 'MMM yyyy', { locale: ptBR })}
              </CardDescription>
            </div>
          </div>
          <Badge className={getCategoryColor(client.categoria_cliente)}>
            {client.categoria_cliente === 'VIP' && <Star className="w-3 h-3 mr-1" />}
            {client.categoria_cliente}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Métricas Principais */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-[hsl(var(--muted))]/50 rounded-lg">
            <DollarSign className="w-5 h-5 mx-auto mb-1 text-[hsl(var(--primary))]" />
            <div className="text-lg font-bold">{formatCurrency(client.total_gasto)}</div>
            <p className="text-xs text-muted-foreground">Total Gasto</p>
          </div>
          
          <div className="text-center p-3 bg-[hsl(var(--muted))]/50 rounded-lg">
            <Calendar className="w-5 h-5 mx-auto mb-1 text-[hsl(var(--primary))]" />
            <div className="text-lg font-bold">{client.numero_transacoes}</div>
            <p className="text-xs text-muted-foreground">Atendimentos</p>
          </div>
        </div>

        {/* Ticket Médio e Score */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Ticket Médio</span>
            <span className="font-bold">{formatCurrency(client.ticket_medio)}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Score de Lucratividade</span>
            <span className={`font-bold ${getScoreColor(client.score_lucratividade)}`}>
              {client.score_lucratividade}/100
            </span>
          </div>
          <Progress 
            value={client.score_lucratividade} 
            className="h-2"
          />
        </div>

        {/* Método de Pagamento Preferido */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium flex items-center gap-2">
              <CreditCard className="w-4 h-4" />
              Pagamento Preferido
            </span>
            <span className="text-sm">
              {preferredPayment.method} ({preferredPayment.percentage.toFixed(0)}%)
            </span>
          </div>
        </div>

        {/* Informações Adicionais */}
        <div className="text-xs text-muted-foreground space-y-1">
          <div className="flex justify-between">
            <span>Última visita:</span>
            <span>{format(new Date(client.ultima_transacao), 'dd/MM/yyyy', { locale: ptBR })}</span>
          </div>
          {client.frequencia_media_dias > 0 && (
            <div className="flex justify-between">
              <span>Frequência média:</span>
              <span>A cada {client.frequencia_media_dias} dias</span>
            </div>
          )}
        </div>

        {/* Botão de Ação */}
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full"
          onClick={() => onViewHistory(client.cliente_id)}
        >
          <Eye className="w-4 h-4 mr-2" />
          Ver Histórico Completo
        </Button>
      </CardContent>
    </Card>
  );
};