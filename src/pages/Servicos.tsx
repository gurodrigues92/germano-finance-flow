import React, { useState } from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useServicos } from '@/hooks/salon/useServicos';
import { ServicoForm } from '@/components/salon/ServicoForm';
import { ServicoDetailsDialog } from '@/components/salon/ServicoDetailsDialog';
import { Plus, Search, Eye, Edit, Receipt, Clock, DollarSign } from 'lucide-react';
import { Servico, ServicoFormData } from '@/types/salon';

const formatDuracao = (minutos: number) => {
  const horas = Math.floor(minutos / 60);
  const min = minutos % 60;
  
  if (horas > 0) {
    return min > 0 ? `${horas}h ${min}min` : `${horas}h`;
  }
  return `${min}min`;
};

export default function Servicos() {
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
      title="Serviços"
      subtitle="Catálogo de serviços do salão"
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Receipt className="w-6 h-6 text-primary" />
            <h2 className="text-xl font-semibold">Catálogo de Serviços</h2>
          </div>
          <Button onClick={handleNewServico}>
            <Plus className="w-4 h-4 mr-2" />
            Novo Serviço
          </Button>
        </div>

        {/* Barra de Busca */}
        {servicos.length > 0 && (
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Buscar serviços..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        )}

        {/* Serviços por Categoria */}
        <div className="space-y-8">
          {loading ? (
            <div className="text-center py-8">Carregando serviços...</div>
          ) : servicos.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <Receipt className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">Nenhum serviço cadastrado</p>
                <Button onClick={handleNewServico}>
                  <Plus className="w-4 h-4 mr-2" />
                  Cadastrar primeiro serviço
                </Button>
              </CardContent>
            </Card>
          ) : Object.keys(servicosFiltradosPorCategoria).length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-muted-foreground">Nenhum serviço encontrado com esse termo.</p>
              </CardContent>
            </Card>
          ) : (
            Object.entries(servicosFiltradosPorCategoria).map(([categoria, servicosCategoria]) => (
              <div key={categoria} className="space-y-4">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: servicosCategoria[0]?.cor_categoria || '#8B5CF6' }}
                  />
                  <h3 className="text-lg font-semibold">{categoria}</h3>
                  <Badge variant="secondary">{servicosCategoria.length}</Badge>
                </div>
                
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {servicosCategoria.map((servico) => (
                    <Card key={servico.id} className="hover:shadow-md transition-shadow">
                      <CardHeader className="pb-3">
                        <CardTitle className="flex items-center justify-between">
                          <span className="truncate">{servico.nome}</span>
                          <span className="text-lg font-semibold text-primary">
                            R$ {servico.preco.toFixed(2)}
                          </span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {servico.descricao && (
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {servico.descricao}
                          </p>
                        )}
                        
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4 text-muted-foreground" />
                            <span>{formatDuracao(servico.duracao_minutos)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <DollarSign className="w-4 h-4 text-muted-foreground" />
                            <span>R$ {servico.preco.toFixed(2)}</span>
                          </div>
                        </div>

                        {/* Botões de Ação */}
                        <div className="flex gap-2 pt-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setSelectedServico(servico)}
                            className="flex-1"
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            Ver
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(servico)}
                            className="flex-1"
                          >
                            <Edit className="w-4 h-4 mr-2" />
                            Editar
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
    </PageLayout>
  );
}