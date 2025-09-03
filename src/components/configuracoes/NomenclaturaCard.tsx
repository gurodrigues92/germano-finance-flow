import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, RefreshCw, Save, Eye } from 'lucide-react';
import { useConfiguracoes } from '@/contexts/ConfiguracoesContext';

export const NomenclaturaCard = () => {
  const { config, updateNomenclatura, resetSection } = useConfiguracoes();
  const [formData, setFormData] = useState(config.nomenclatura);
  const [hasChanges, setHasChanges] = useState(false);

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handleSave = () => {
    updateNomenclatura(formData);
    setHasChanges(false);
  };

  const handleReset = () => {
    resetSection('nomenclatura');
    setFormData(config.nomenclatura);
    setHasChanges(false);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            <div>
              <CardTitle>Nomenclaturas Personalizadas</CardTitle>
              <CardDescription>
                Personalize como os participantes são exibidos no sistema
              </CardDescription>
            </div>
          </div>
          {hasChanges && (
            <Badge variant="secondary" className="animate-pulse">
              Não salvo
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="profissional">Nome do Profissional Principal</Label>
            <Input
              id="profissional"
              value={formData.profissional}
              onChange={(e) => handleChange('profissional', e.target.value)}
              placeholder="Ex: Eduardo, Profissional, etc."
            />
            <p className="text-xs text-muted-foreground">
              Como será exibido nos gráficos e relatórios
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="assistente">Nome do Assistente</Label>
            <Input
              id="assistente"
              value={formData.assistente}
              onChange={(e) => handleChange('assistente', e.target.value)}
              placeholder="Ex: Kamila, Assistente, etc."
            />
            <p className="text-xs text-muted-foreground">
              Como será exibido nos gráficos e relatórios
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="studio">Nome do Estabelecimento</Label>
            <Input
              id="studio"
              value={formData.studio}
              onChange={(e) => handleChange('studio', e.target.value)}
              placeholder="Ex: Studio Germano, Casa, etc."
            />
            <p className="text-xs text-muted-foreground">
              Como será exibido nos gráficos e relatórios
            </p>
          </div>
        </div>

        <div className="border rounded-lg p-4 bg-muted/50">
          <div className="flex items-center gap-2 mb-3">
            <Eye className="h-4 w-4 text-primary" />
            <span className="font-medium">Preview das Nomenclaturas</span>
          </div>
          <div className="grid grid-cols-3 gap-2 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-primary"></div>
              <span>{formData.profissional}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-destructive"></div>
              <span>{formData.assistente}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-secondary"></div>
              <span>{formData.studio}</span>
            </div>
          </div>
        </div>

        <div className="flex gap-3 pt-4 border-t">
          <Button 
            onClick={handleSave}
            disabled={!hasChanges}
            className="flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            Salvar Alterações
          </Button>
          
          <Button 
            variant="outline" 
            onClick={handleReset}
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Restaurar Padrão
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};