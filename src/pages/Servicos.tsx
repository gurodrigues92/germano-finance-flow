import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useServicos } from '@/hooks/salon/useServicos';
import { ServicoForm } from '@/components/salon/ServicoForm';
import { ServicoDetailsDialog } from '@/components/salon/ServicoDetailsDialog';
import { Plus, Search, Eye, Edit, Scissors, Clock, DollarSign, Palette } from 'lucide-react';
import { Servico, ServicoFormData } from '@/types/salon';
import { useTranslations } from '@/lib/translations';
import { PageLayout } from '@/components/layout/PageLayout';

const formatDuracao = (minutos: number) => {
  const horas = Math.floor(minutos / 60);
  const min = minutos % 60;
  
  if (horas > 0) {
    return min > 0 ? `${horas}h ${min}min` : `${horas}h`;
  }
  return `${min}min`;
};

export default function Servicos() {
  const t = useTranslations();
  const { servicos, loading, getServicosPorCategoria, addServico, updateServico } = useServicos();
  const [showForm, setShowForm] = useState(false);
  const [editingServico, setEditingServico] = useState<Servico | null>(null);
  const [selectedServico, setSelectedServico] = useState<Servico | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Filtrar serviços por termo de busca
  const filteredServicos = servicos.filter(servico =>
    servico.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    servico.categoria.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Agrupar serviços filtrados por categoria
  const servicosFiltradosPorCategoria = filteredServicos.reduce((acc, servico) => {
    if (!acc[servico.categoria]) {
      acc[servico.categoria] = [];
    }
    acc[servico.categoria].push(servico);
    return acc;
  }, {} as Record<string, Servico[]>);

  const handleSubmit = async (data: ServicoFormData) => {
    if (editingServico) {
      await updateServico(editingServico.id, data);
    } else {
      await addServico(data);
    }
  };

  const handleEdit = (servico: Servico) => {
    setEditingServico(servico);
    setSelectedServico(null);
    setShowForm(true);
  };

  const handleNewServico = () => {
    setEditingServico(null);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingServico(null);
  };

  return (
    <PageLayout
      title={t.navigation.services}
      subtitle="Catálogo completo de serviços"
      onFabClick={handleNewServico}
      fabIcon={<Plus className="w-6 h-6" />}
    >
      <div className="space-y-6">
        {/* Barra de ferramentas */}
        {servicos.length > 0 && (
          <div className="flex justify-between items-center bg-card border rounded-lg p-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder={t.placeholders.searchServices}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Badge variant="secondary" className="bg-[hsl(var(--services-color))]/10 text-[hsl(var(--services-color))]">
                {filteredServicos.length} {t.navigation.services}
              </Badge>
            </div>
          </div>
        )}

        {/* Grid de Serviços por Categoria */}
        <div className="space-y-8">
          {loading ? (
            <div className="text-center py-12">
              <div className="text-muted-foreground">{t.actions.loading}</div>
            </div>
          ) : servicos.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="text-center py-12">
                <div className="w-16 h-16 bg-[hsl(var(--services-color))]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Scissors className="w-8 h-8 text-[hsl(var(--services-color))]" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Nenhum serviço ainda</h3>
                <p className="text-muted-foreground mb-6">Comece criando seu primeiro serviço</p>
                <Button 
                  onClick={handleNewServico}
                  className="bg-[hsl(var(--services-color))] hover:bg-[hsl(var(--services-color))]/90 text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  {t.actions.create} Primeiro Serviço
                </Button>
              </CardContent>
            </Card>
          ) : Object.keys(servicosFiltradosPorCategoria).length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-muted-foreground">Nenhum serviço encontrado com sua pesquisa.</p>
              </CardContent>
            </Card>
          ) : (
            Object.entries(servicosFiltradosPorCategoria).map(([categoria, servicosCategoria]) => (
              <div key={categoria} className="space-y-4">
                {/* Header da Categoria */}
                <div className="flex items-center gap-3 pb-2 border-b">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: servicosCategoria[0]?.cor_categoria || '#8B5CF6' }}
                    />
                    <Palette className="w-4 h-4 text-muted-foreground" />
                    <h3 className="text-lg font-semibold text-foreground">{categoria}</h3>
                  </div>
                  <Badge 
                    variant="secondary" 
                    className="bg-[hsl(var(--services-color))]/10 text-[hsl(var(--services-color))]"
                  >
                    {servicosCategoria.length} serviço{servicosCategoria.length !== 1 ? 's' : ''}
                  </Badge>
                </div>
                
                {/* Grid de Serviços */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {servicosCategoria.map((servico) => (
                    <Card key={servico.id} className="hover:shadow-lg transition-all duration-200 border border-border hover:border-[hsl(var(--services-color))]/30">
                      <CardHeader className="pb-3">
                        <CardTitle className="flex items-start justify-between">
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-2 h-2 rounded-full"
                              style={{ backgroundColor: servico.cor_categoria }}
                            />
                            <span className="font-semibold text-foreground">{servico.nome}</span>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold text-[hsl(var(--services-color))]">
                              R$ {servico.preco.toFixed(2)}
                            </div>
                          </div>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {servico.descricao && (
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {servico.descricao}
                          </p>
                        )}
                        
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <Clock className="w-4 h-4" />
                            <span>{formatDuracao(servico.duracao_minutos)}</span>
                          </div>
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <DollarSign className="w-4 h-4" />
                            <span>R$ {servico.preco.toFixed(2)}</span>
                          </div>
                        </div>

                        {/* Botões de Ação */}
                        <div className="flex gap-2 pt-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setSelectedServico(servico)}
                            className="flex-1 border-[hsl(var(--services-color))]/20 text-[hsl(var(--services-color))] hover:bg-[hsl(var(--services-color))]/10"
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            {t.actions.view}
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleEdit(servico)}
                            className="flex-1 bg-[hsl(var(--services-color))] hover:bg-[hsl(var(--services-color))]/90 text-white"
                          >
                            <Edit className="w-4 h-4 mr-2" />
                            {t.actions.edit}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Formulário */}
        <ServicoForm
          open={showForm}
          onOpenChange={handleCloseForm}
          onSubmit={handleSubmit}
          initialData={editingServico ? {
            nome: editingServico.nome,
            categoria: editingServico.categoria,
            preco: editingServico.preco,
            duracao_minutos: editingServico.duracao_minutos,
            descricao: editingServico.descricao || '',
            cor_categoria: editingServico.cor_categoria || '#8B5CF6'
          } : undefined}
          isEditing={!!editingServico}
        />

        {/* Detalhes */}
        <ServicoDetailsDialog
          servico={selectedServico}
          open={!!selectedServico}
          onOpenChange={(open) => !open && setSelectedServico(null)}
          onEdit={handleEdit}
        />
      </div>
    </PageLayout>
  );
}