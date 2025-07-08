import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Plus, 
  Target, 
  TrendingUp, 
  DollarSign,
  CheckCircle
} from 'lucide-react';
import { useMetas } from '@/hooks/useMetas';
import { MetaCard } from '@/components/metas/MetaCard';
import { MetaForm } from '@/components/metas/MetaForm';
import { MetaFinanceira, MetaFinanceiraInput } from '@/types/metas';
import { useToast } from '@/hooks/use-toast';
import { formatCompactCurrency } from '@/lib/formatUtils';
import { useIsMobile } from '@/hooks/use-mobile';
import { PageLayout } from '@/components/layout/PageLayout';


export const Metas = () => {
  const { metas, loading, addMeta, updateMeta, deleteMeta } = useMetas();
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [editingMeta, setEditingMeta] = useState<MetaFinanceira | undefined>();
  const isMobile = useIsMobile();

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
      <PageLayout
        title="Metas Financeiras"
        subtitle="Defina e acompanhe suas metas"
      >
        <MetaForm
          meta={editingMeta}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      </PageLayout>
    );
  }

  return (
    <PageLayout
      title="Metas Financeiras"
      subtitle="Defina e acompanhe suas metas"
      onFabClick={() => setShowForm(true)}
      fabIcon={<Plus className="h-5 w-5" />}
    >
      {/* Cards de Estatísticas */}
      <div className="card-grid card-grid-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Metas Ativas</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="metric-value">{estatisticas.totalMetas}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Metas Concluídas</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="metric-value">{estatisticas.metasConcluidas}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Valor Total das Metas</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="metric-value">
              {formatCompactCurrency(estatisticas.totalValorMetas, isMobile)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Progresso Geral</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="metric-value">{estatisticas.progressoGeral.toFixed(1)}%</div>
            <Progress value={estatisticas.progressoGeral} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Lista de Metas */}
      <div className="space-y-4">
        <h2 className="subsection-title">Suas Metas</h2>
        
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
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
          <div className="card-grid card-grid-3">
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
    </PageLayout>
  );
};