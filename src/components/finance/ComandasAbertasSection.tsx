import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Transaction } from '@/types/finance';
import { formatCurrency } from '@/lib/formatUtils';
import { AlertTriangle, Clock, User, DollarSign } from 'lucide-react';
import { useClientes } from '@/hooks/salon/useClientes';
import { useProfissionais } from '@/hooks/salon/useProfissionais';
import { formatDateDisplay } from '@/lib/dateUtils';

interface ComandasAbertasSectionProps {
  comandasAbertas: Transaction[];
  onFecharComanda: (comandaId: string) => void;
  loading?: boolean;
}

export const ComandasAbertasSection = ({ 
  comandasAbertas, 
  onFecharComanda,
  loading = false 
}: ComandasAbertasSectionProps) => {
  const { clientes } = useClientes();
  const { profissionais } = useProfissionais();

  if (comandasAbertas.length === 0) {
    return null;
  }

  const getClienteNome = (clienteId?: string) => {
    if (!clienteId) return 'Cliente não informado';
    const cliente = clientes.find(c => c.id === clienteId);
    return cliente?.nome || 'Cliente não encontrado';
  };

  const getProfissionalNome = (profissionalId?: string) => {
    if (!profissionalId) return 'Profissional não informado';
    const profissional = profissionais.find(p => p.id === profissionalId);
    return profissional?.nome || 'Profissional não encontrado';
  };

  return (
    <Card className="bg-gradient-to-r from-orange-50 to-red-50 border-orange-200 dark:from-orange-950/20 dark:to-red-950/20 dark:border-orange-800 mb-6">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2 text-orange-700 dark:text-orange-300">
          <AlertTriangle className="h-5 w-5" />
          Comandas Pendentes de Fechamento
          <Badge variant="destructive" className="ml-auto">
            {comandasAbertas.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {comandasAbertas.map((comanda) => (
          <Card key={comanda.id} className="bg-white/80 dark:bg-slate-950/80 border-orange-200 dark:border-orange-800">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1 text-sm font-medium">
                      <User className="h-4 w-4 text-primary" />
                      {getClienteNome(comanda.clienteId)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      ({getProfissionalNome(comanda.profissionalId)})
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      {formatDateDisplay(comanda.date)}
                    </div>
                    <div className="flex items-center gap-1 font-medium">
                      <DollarSign className="h-4 w-4 text-green-600" />
                      {formatCurrency(comanda.totalBruto)}
                    </div>
                  </div>
                  
                  {comanda.observacoes && (
                    <div className="text-xs text-muted-foreground bg-muted/50 rounded p-2">
                      {comanda.observacoes}
                    </div>
                  )}
                </div>
                
                <Button
                  onClick={() => onFecharComanda(comanda.id)}
                  disabled={loading}
                  size="sm"
                  className="ml-4 bg-green-600 hover:bg-green-700 text-white"
                >
                  Fechar
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </CardContent>
    </Card>
  );
};