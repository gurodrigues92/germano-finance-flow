import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useProfissionais } from '@/hooks/salon/useProfissionais';
import { ProfissionalForm } from '@/components/salon/ProfissionalForm';
import { ProfissionalDetailsDialog } from '@/components/salon/ProfissionalDetailsDialog';
import { Plus, Phone, Mail, Percent, Search, Eye, Edit, UserCheck, Clock, Users } from 'lucide-react';
import { Profissional, ProfissionalFormData } from '@/types/salon';

const getTipoColor = (tipo: string) => {
  switch (tipo) {
    case 'cabeleireiro':
      return 'bg-[hsl(var(--professionals-color))]/10 text-[hsl(var(--professionals-color))] border-[hsl(var(--professionals-color))]/20';
    case 'assistente':
      return 'bg-blue-100 text-blue-700 border-blue-200';
    case 'recepcionista':
      return 'bg-orange-100 text-orange-700 border-orange-200';
    default:
      return 'bg-gray-100 text-gray-700 border-gray-200';
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
    <div className="p-6 space-y-6">
      {/* Header estilo SalonSoft */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-[hsl(var(--professionals-color))] rounded-lg flex items-center justify-center">
            <UserCheck className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Professionals</h1>
            <p className="text-muted-foreground">Gestão completa da equipe</p>
          </div>
        </div>
        <Button 
          onClick={handleNewProfissional}
          className="bg-[hsl(var(--professionals-color))] hover:bg-[hsl(var(--professionals-color))]/90 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Professional
        </Button>
      </div>

      {/* Barra de ferramentas */}
      {profissionais.length > 0 && (
        <div className="flex justify-between items-center bg-card border rounded-lg p-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search professionals..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="w-4 h-4" />
              <Badge variant="secondary" className="bg-[hsl(var(--professionals-color))]/10 text-[hsl(var(--professionals-color))]">
                {filteredProfissionais.length} Team Members
              </Badge>
            </div>
          </div>
        </div>
      )}

      {/* Grid de Profissionais */}
      <div className="space-y-6">
        {loading ? (
          <div className="text-center py-12">
            <div className="text-muted-foreground">Loading team...</div>
          </div>
        ) : profissionais.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="text-center py-12">
              <div className="w-16 h-16 bg-[hsl(var(--professionals-color))]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <UserCheck className="w-8 h-8 text-[hsl(var(--professionals-color))]" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No team members yet</h3>
              <p className="text-muted-foreground mb-6">Start by adding your first professional</p>
              <Button 
                onClick={handleNewProfissional}
                className="bg-[hsl(var(--professionals-color))] hover:bg-[hsl(var(--professionals-color))]/90 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add First Professional
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredProfissionais.map((profissional) => (
              <Card key={profissional.id} className="hover:shadow-lg transition-all duration-200 border border-border hover:border-[hsl(var(--professionals-color))]/30">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div 
                          className="w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold"
                          style={{ backgroundColor: profissional.cor_agenda }}
                        >
                          {profissional.nome.charAt(0).toUpperCase()}
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-background"></div>
                      </div>
                      <div>
                        <div className="font-semibold text-foreground">{profissional.nome}</div>
                        <Badge className={`${getTipoColor(profissional.tipo)} text-xs`}>
                          {getTipoLabel(profissional.tipo)}
                        </Badge>
                      </div>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    {profissional.telefone && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Phone className="w-4 h-4" />
                        <span>{profissional.telefone}</span>
                      </div>
                    )}
                    
                    {profissional.email && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Mail className="w-4 h-4" />
                        <span className="truncate">{profissional.email}</span>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-2 text-sm">
                      <Percent className="w-4 h-4 text-muted-foreground" />
                      <span className="text-[hsl(var(--professionals-color))] font-medium">
                        {profissional.percentual_comissao}% Commission
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      <span>Active Schedule</span>
                    </div>
                  </div>

                  {/* Botões de Ação */}
                  <div className="flex gap-2 pt-3">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSelectedProfissional(profissional)}
                      className="flex-1 border-[hsl(var(--professionals-color))]/20 text-[hsl(var(--professionals-color))] hover:bg-[hsl(var(--professionals-color))]/10"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleEdit(profissional)}
                      className="flex-1 bg-[hsl(var(--professionals-color))] hover:bg-[hsl(var(--professionals-color))]/90 text-white"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
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
    </div>
  );
}