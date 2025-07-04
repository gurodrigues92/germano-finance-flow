import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Target, 
  TrendingUp, 
  Calendar, 
  Edit,
  Trash2,
  CheckCircle 
} from 'lucide-react';
import { MetaFinanceira } from '@/types/metas';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface MetaCardProps {
  meta: MetaFinanceira;
  onEdit: (meta: MetaFinanceira) => void;
  onDelete: (id: string) => void;
  onMarkComplete: (id: string) => void;
}

export const MetaCard = ({ meta, onEdit, onDelete, onMarkComplete }: MetaCardProps) => {
  const progresso = meta.valor_meta > 0 ? (meta.valor_atual / meta.valor_meta) * 100 : 0;
  const isCompleta = progresso >= 100;
  const isVencida = new Date(meta.data_fim) < new Date() && meta.status === 'ativa';

  const getStatusColor = () => {
    if (meta.status === 'concluida') return 'bg-green-500';
    if (meta.status === 'cancelada') return 'bg-red-500';
    if (isVencida) return 'bg-orange-500';
    return 'bg-blue-500';
  };

  const getStatusText = () => {
    if (meta.status === 'concluida') return 'Concluída';
    if (meta.status === 'cancelada') return 'Cancelada';
    if (isVencida) return 'Vencida';
    return 'Ativa';
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              {meta.titulo}
            </CardTitle>
            {meta.categoria && (
              <Badge variant="outline" className="text-xs">
                {meta.categoria}
              </Badge>
            )}
          </div>
          <Badge className={`${getStatusColor()} text-white`}>
            {getStatusText()}
          </Badge>
        </div>
        
        {meta.descricao && (
          <p className="text-sm text-muted-foreground">{meta.descricao}</p>
        )}
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Progresso */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Progresso</span>
            <span className="font-medium">{progresso.toFixed(1)}%</span>
          </div>
          <Progress 
            value={Math.min(progresso, 100)} 
            className={`h-3 ${isCompleta ? 'bg-green-100' : ''}`}
          />
          <div className="flex justify-between text-sm">
            <span className="font-medium">
              {meta.valor_atual.toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL'
              })}
            </span>
            <span className="text-muted-foreground">
              {meta.valor_meta.toLocaleString('pt-BR', {
                style: 'currency', 
                currency: 'BRL'
              })}
            </span>
          </div>
        </div>

        {/* Datas */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>
              {format(new Date(meta.data_inicio), 'dd/MM/yy', { locale: ptBR })} - {format(new Date(meta.data_fim), 'dd/MM/yy', { locale: ptBR })}
            </span>
          </div>
        </div>

        {/* Ações */}
        <div className="flex gap-2 pt-2">
          {meta.status === 'ativa' && isCompleta && (
            <Button
              size="sm"
              variant="default"
              onClick={() => onMarkComplete(meta.id)}
              className="flex-1"
            >
              <CheckCircle className="h-4 w-4 mr-1" />
              Marcar como Concluída
            </Button>
          )}
          
          {meta.status === 'ativa' && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => onEdit(meta)}
            >
              <Edit className="h-4 w-4" />
            </Button>
          )}
          
          <Button
            size="sm"
            variant="outline"
            onClick={() => onDelete(meta.id)}
            className="text-red-600 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};