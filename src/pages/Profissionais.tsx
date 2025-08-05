import React, { useState } from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useProfissionais } from '@/hooks/salon/useProfissionais';
import { ProfissionalForm } from '@/components/salon/ProfissionalForm';
import { ProfissionalDetailsDialog } from '@/components/salon/ProfissionalDetailsDialog';
import { Plus, Phone, Mail, Percent, Search, Eye, Edit, Scissors } from 'lucide-react';
import { Profissional, ProfissionalFormData } from '@/types/salon';

const getTipoColor = (tipo: string) => {
  switch (tipo) {
    case 'cabeleireiro':
      return 'bg-purple-100 text-purple-800 border-purple-200';
    case 'assistente':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'recepcionista':
      return 'bg-green-100 text-green-800 border-green-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const getTipoLabel = (tipo: string) => {
  switch (tipo) {
    case 'cabeleireiro':
      return 'Cabeleireiro(a)';
    case 'assistente':
      return 'Assistente';
    case 'recepcionista':
      return 'Recepcionista';
    default:
      return tipo;
  }
};

export default function Profissionais() {
  const { profissionais, loading, addProfissional, updateProfissional } = useProfissionais();
  const [showForm, setShowForm] = useState(false);
  const [editingProfissional, setEditingProfissional] = useState<Profissional | null>(null);
  const [selectedProfissional, setSelectedProfissional] = useState<Profissional | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Filtrar profissionais por termo de busca
  const filteredProfissionais = profissionais.filter(profissional =>
    profissional.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    profissional.tipo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = async (data: ProfissionalFormData) => {
    if (editingProfissional) {
      await updateProfissional(editingProfissional.id, data);
    } else {
      await addProfissional(data);
    }
  };

  const handleEdit = (profissional: Profissional) => {
    setEditingProfissional(profissional);
    setSelectedProfissional(null);
    setShowForm(true);
  };

  const handleNewProfissional = () => {
    setEditingProfissional(null);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingProfissional(null);
  };

  return (
    <PageLayout
      title="Profissionais"
      subtitle="Gestão da equipe do salão"
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Scissors className="w-6 h-6 text-primary" />
            <h2 className="text-xl font-semibold">Equipe do Salão</h2>
          </div>
          <Button onClick={handleNewProfissional}>
            <Plus className="w-4 h-4 mr-2" />
            Novo Profissional
          </Button>
        </div>

        {/* Barra de Busca */}
        {profissionais.length > 0 && (
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Buscar profissionais..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        )}

        {/* Profissionais */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {loading ? (
            <div className="col-span-full text-center py-8">Carregando profissionais...</div>
          ) : profissionais.length === 0 ? (
            <Card className="col-span-full">
              <CardContent className="text-center py-8">
                <Scissors className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">Nenhum profissional cadastrado</p>
                <Button onClick={handleNewProfissional}>
                  <Plus className="w-4 h-4 mr-2" />
                  Cadastrar primeiro profissional
                </Button>
              </CardContent>
            </Card>
          ) : (
            filteredProfissionais.map((profissional) => (
              <Card key={profissional.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: profissional.cor_agenda }}
                      />
                      <span className="truncate">{profissional.nome}</span>
                    </div>
                    <Badge className={getTipoColor(profissional.tipo)}>
                      {getTipoLabel(profissional.tipo)}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {profissional.telefone && (
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      <span>{profissional.telefone}</span>
                    </div>
                  )}
                  
                  {profissional.email && (
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <span className="truncate">{profissional.email}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-2 text-sm">
                    <Percent className="w-4 h-4 text-muted-foreground" />
                    <span>Comissão: {profissional.percentual_comissao}%</span>
                  </div>

                  {/* Botões de Ação */}
                  <div className="flex gap-2 pt-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSelectedProfissional(profissional)}
                      className="flex-1"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Ver
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(profissional)}
                      className="flex-1"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Editar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>

      {/* Formulário */}
      <ProfissionalForm
        open={showForm}
        onOpenChange={handleCloseForm}
        onSubmit={handleSubmit}
        initialData={editingProfissional ? {
          nome: editingProfissional.nome,
          telefone: editingProfissional.telefone || '',
          email: editingProfissional.email || '',
          tipo: editingProfissional.tipo,
          percentual_comissao: editingProfissional.percentual_comissao,
          cor_agenda: editingProfissional.cor_agenda || '#8B5CF6',
          horario_trabalho: editingProfissional.horario_trabalho || {}
        } : undefined}
        isEditing={!!editingProfissional}
      />

      {/* Detalhes */}
      <ProfissionalDetailsDialog
        profissional={selectedProfissional}
        open={!!selectedProfissional}
        onOpenChange={(open) => !open && setSelectedProfissional(null)}
        onEdit={handleEdit}
      />
    </PageLayout>
  );
}