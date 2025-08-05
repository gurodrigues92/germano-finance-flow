import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Servico } from '@/types/salon';
import { Clock, DollarSign, Palette, Edit, BarChart3 } from 'lucide-react';
import { formatCurrency } from '@/lib/formatUtils';

interface ServicoDetailsDialogProps {
  servico: Servico | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit: (servico: Servico) => void;
}

const formatDuracao = (minutos: number) => {
  const horas = Math.floor(minutos / 60);
  const min = minutos % 60;
  
  if (horas > 0) {
    return min > 0 ? `${horas}h ${min}min` : `${horas}h`;
  }
  return `${min}min`;
};

export const ServicoDetailsDialog: React.FC<ServicoDetailsDialogProps> = ({
  servico,
  open,
  onOpenChange,
  onEdit
}) => {
  if (!servico) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <div className="flex justify-between items-start">
            <div>
              <DialogTitle className="text-xl">{servico.nome}</DialogTitle>
              <Badge 
                className="mt-2"
                style={{ 
                  backgroundColor: `${servico.cor_categoria}20`,
                  color: servico.cor_categoria,
                  borderColor: servico.cor_categoria
                }}
              >
                {servico.categoria}
              </Badge>
            </div>
            <Button onClick={() => onEdit(servico)} size="sm">
              <Edit className="w-4 h-4 mr-2" />
              Editar
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Informações do Serviço */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Detalhes do Serviço</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <DollarSign className="w-5 h-5 text-muted-foreground" />
                <div>
                  <div className="font-semibold text-lg">{formatCurrency(servico.preco)}</div>
                  <div className="text-sm text-muted-foreground">Preço</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-muted-foreground" />
                <div>
                  <div className="font-semibold">{formatDuracao(servico.duracao_minutos)}</div>
                  <div className="text-sm text-muted-foreground">Duração</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Palette className="w-5 h-5 text-muted-foreground" />
                <div className="flex items-center gap-2">
                  <div 
                    className="w-6 h-6 rounded-full border-2 border-muted"
                    style={{ backgroundColor: servico.cor_categoria }}
                  />
                  <span className="text-sm text-muted-foreground">Cor da categoria</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Descrição */}
          {servico.descricao && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Descrição</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {servico.descricao}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Estatísticas (Placeholder para futuras implementações) */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Estatísticas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold">-</div>
                  <div className="text-sm text-muted-foreground">Agendamentos Este Mês</div>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold">-</div>
                  <div className="text-sm text-muted-foreground">Receita Gerada</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};