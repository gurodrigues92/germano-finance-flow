import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Plus, 
  Target, 
  TrendingUp, 
  Calendar,
  DollarSign,
  CheckCircle
} from 'lucide-react';
import { useMetas } from '@/hooks/useMetas';
import { MetaCard } from '@/components/metas/MetaCard';
import { MetaForm } from '@/components/metas/MetaForm';
import { MetaFinanceira, MetaFinanceiraInput } from '@/types/metas';
import { useToast } from '@/hooks/use-toast';

export const Metas = () => {
  const { metas, loading, addMeta, updateMeta, deleteMeta } = useMetas();
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [editingMeta, setEditingMeta] = useState<MetaFinanceira | undefined>();

  const estatisticas = useMetas().getEstatisticas();

  const handleSubmit = async (data: MetaFinanceiraInput) => {
    const result = editingMeta 
      ? await updateMeta(editingMeta.id, data)
      : await addMeta(data);

    if (result.success) {
      toast({
        title: editingMeta ? 'Meta atualizada!' : 'Meta criada!',
        description: editingMeta 
          ? 'A meta foi atualizada com sucesso.'
          : 'Nova meta adicionada ao sistema.'
      });
      setShowForm(false);
      setEditingMeta(undefined);
    } else {
      toast({
        title: 'Erro',
        description: 'Ocorreu um erro ao salvar a meta.',
        variant: 'destructive'
      });
    }

    return result;
  };

  const handleEdit = (meta: MetaFinanceira) => {
    setEditingMeta(meta);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    const result = await deleteMeta(id);
    if (result.success) {
      toast({
        title: 'Meta removida',
        description: 'A meta foi removida com sucesso.'
      });
    }
  };

  const handleMarkComplete = async (id: string) => {
    const result = await updateMeta(id, { status: 'concluida' });
    if (result.success) {
      toast({
        title: 'Meta concluída!',
        description: 'Parabéns por atingir sua meta!'
      });
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingMeta(undefined);
  };

  if (showForm) {
    return (
      <div className="container mx-auto p-6">
        <MetaForm
          meta={editingMeta}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Metas Financeiras</h1>
          <p className="text-muted-foreground">Defina e acompanhe suas metas financeiras</p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Nova Meta
        </Button>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Metas Ativas</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{estatisticas.totalMetas}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Metas Concluídas</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{estatisticas.metasConcluidas}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor Total das Metas</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {estatisticas.totalValorMetas.toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL'
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Progresso Geral</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{estatisticas.progressoGeral.toFixed(1)}%</div>
            <Progress value={estatisticas.progressoGeral} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Lista de Metas */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Suas Metas</h2>
        
        {loading ? (
          <div className="text-center py-8">
            <p>Carregando metas...</p>
          </div>
        ) : metas.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Nenhuma meta criada</h3>
              <p className="text-muted-foreground mb-4">
                Comece definindo suas primeiras metas financeiras
              </p>
              <Button onClick={() => setShowForm(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Criar primeira meta
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {metas.map((meta) => (
              <MetaCard
                key={meta.id}
                meta={meta}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onMarkComplete={handleMarkComplete}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};